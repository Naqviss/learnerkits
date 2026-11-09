import { isEntitled } from "./entitlement";
import { resolvePaddle, type PaddleEnv, type PaddleSettings } from "./paddle-config";
import { isSameOrigin, json, readJsonBody, readSubscriptions, rpc, supabaseAdmin, userFromRequest, type Admin, type SupabaseEnv } from "../server/supabase";

/** Paddle settings come in sandbox and live sets; PADDLE_TEST_MODE picks one (lib/billing/paddle-config.ts). */
export type BillingEnv = SupabaseEnv & PaddleEnv;

type PaddleSubscription = {
  id?: unknown; status?: unknown; customer_id?: unknown; custom_data?: { user_id?: unknown } | null;
  items?: { price?: { id?: unknown } }[]; next_billed_at?: unknown; canceled_at?: unknown; updated_at?: unknown;
  scheduled_change?: { action?: unknown; effective_at?: unknown } | null;
};

const statuses = ["active", "trialing", "past_due", "paused", "canceled"];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const paddle = (settings: PaddleSettings & { apiKey: string }, path: string, init: RequestInit = {}) => fetch(`${settings.apiBase}${path}`, {
  ...init,
  headers: { Authorization: `Bearer ${settings.apiKey}`, "Content-Type": "application/json", "Paddle-Version": "1" },
  signal: AbortSignal.timeout(10_000),
});
const hasApiKey = (settings: PaddleSettings): settings is PaddleSettings & { apiKey: string } => Boolean(settings.apiKey);

/** Resolves sandbox/live settings and logs configuration problems (visible in `wrangler tail`). */
function settingsFor(env: BillingEnv) {
  const settings = resolvePaddle(env);
  if (settings.problems.length) console.warn(`Paddle (${settings.mode}) configuration:`, settings.problems.join("; "));
  return settings;
}

/**
 * POST /api/billing/config — which Paddle environment is active and its public client-side token.
 * POST (not GET) because the static export cannot contain dynamic GET route handlers.
 */
export function billingConfig(request: Request, env: BillingEnv): Response {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  const settings = settingsFor(env);
  return json(200, {
    mode: settings.mode,
    clientToken: settings.clientToken ?? null,
    ready: Boolean(settings.apiKey && settings.priceId && settings.clientToken),
  });
}
const unavailable = () => json(503, { error: "Subscriptions are not available yet. Please try again later." });
const checkoutFailed = () => json(502, { error: "Checkout could not be started. Please try again later." });

/**
 * POST /api/billing/checkout — creates a Paddle transaction for the signed-in user, which the
 * browser opens with Paddle.Checkout.open({ transactionId }). The user id is attached here from
 * the verified session (not by the browser), so a payment can only be linked to that account.
 */
export async function createCheckout(request: Request, env: BillingEnv): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (!isSameOrigin(request)) return json(403, { error: "Please subscribe from the LearnerKits website." });
  const admin = supabaseAdmin(env);
  const settings = settingsFor(env);
  const { priceId, clientToken } = settings;
  if (!admin || !hasApiKey(settings) || !priceId || !clientToken) return unavailable();
  const user = await userFromRequest(request, admin);
  if (!user) return json(401, { error: "Please sign in again, then subscribe." });
  const body = await readJsonBody(request, 2_000);
  const requested = typeof body?.returnPath === "string" ? body.returnPath : "/";
  // Same-site paths only: no "//host", backslashes, or schemes.
  const returnPath = /^\/(?!\/)[A-Za-z0-9\-_/]{0,200}$/.test(requested) ? requested : "/";
  try {
    if ((await readSubscriptions(admin, user.id, settings.mode)).some((row) => isEntitled(row))) return json(409, { error: "You already have Premium." });
  } catch { return unavailable(); }
  const successUrl = new URL(returnPath, new URL(request.url).origin);
  successUrl.searchParams.set("premium", "welcome");
  try {
    const response = await paddle(settings, "/transactions", {
      method: "POST",
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        custom_data: { user_id: user.id },
        ...(settings.discountId ? { discount_id: settings.discountId } : {}),
      }),
    });
    if (!response.ok) {
      console.error("Paddle transaction failed", response.status, (await response.text()).slice(0, 500));
      return checkoutFailed();
    }
    const transactionId = ((await response.json()) as { data?: { id?: unknown } }).data?.id;
    if (typeof transactionId !== "string" || !transactionId.startsWith("txn_")) return checkoutFailed();
    // The browser opens checkout with the client token of the same environment as this transaction.
    return json(200, { transactionId, successUrl: successUrl.toString(), clientToken, sandbox: settings.mode === "sandbox" });
  } catch { return checkoutFailed(); }
}

/** POST /api/billing/portal — a fresh Paddle customer-portal link (never cached; links are temporary). */
export async function customerPortal(request: Request, env: BillingEnv): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (!isSameOrigin(request)) return json(403, { error: "Please open this from the LearnerKits website." });
  const admin = supabaseAdmin(env);
  const settings = settingsFor(env);
  if (!admin || !hasApiKey(settings)) return unavailable();
  const user = await userFromRequest(request, admin);
  if (!user) return json(401, { error: "Please sign in again." });
  const failed = () => json(502, { error: "The subscription page is unavailable. Please try again later." });
  try {
    const [latest] = await readSubscriptions(admin, user.id, settings.mode);
    if (!latest?.provider_customer_id) return json(404, { error: "No subscription was found for this account." });
    const response = await paddle(settings, `/customers/${encodeURIComponent(latest.provider_customer_id)}/portal-sessions`, {
      method: "POST", body: JSON.stringify({ subscription_ids: [latest.provider_subscription_id] }),
    });
    const url = response.ok ? ((await response.json()) as { data?: { urls?: { general?: { overview?: unknown } } } }).data?.urls?.general?.overview : undefined;
    return typeof url === "string" && url.startsWith("https://") ? json(200, { url }) : failed();
  } catch { return failed(); }
}

/**
 * POST /api/billing/webhook — Paddle notifications, verified with the Paddle-Signature header.
 * subscription.* events carry the subscription (with the checkout's custom_data). As a fallback,
 * transaction.completed links a new subscription to the user named in the transaction's custom_data.
 */
export async function paddleWebhook(request: Request, env: BillingEnv): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  // Only the active environment's secret is accepted: in live mode, sandbox events are rejected.
  const settings = settingsFor(env);
  const secret = settings.webhookSecret;
  if (!secret) return json(503, { error: "Webhook not configured" });
  const raw = await request.text();
  if (raw.length > 1_000_000) return json(413, { error: "Too large" });
  if (!await verifyPaddleSignature(secret, raw, request.headers.get("paddle-signature") ?? "")) return json(401, { error: "Invalid signature" });
  let payload: { event_type?: unknown; data?: PaddleSubscription & { subscription_id?: unknown } };
  try { payload = JSON.parse(raw); } catch { return json(400, { error: "Invalid JSON" }); }
  const type = payload.event_type;
  const data = payload.data ?? {};
  const admin = supabaseAdmin(env);
  if (typeof type !== "string") return json(200, { ignored: true });

  if (type.startsWith("subscription.")) {
    if (!admin) return json(503, { error: "Database not configured" }); // Paddle retries failed deliveries.
    return saveSubscription(admin, settings, data, userIdFrom(data.custom_data));
  }
  if (type === "transaction.completed" && typeof data.subscription_id === "string") {
    const userId = userIdFrom(data.custom_data);
    if (!userId) return json(200, { ignored: true });
    if (!admin || !hasApiKey(settings)) return json(503, { error: "Not configured" });
    const response = await paddle(settings, `/subscriptions/${encodeURIComponent(data.subscription_id)}`).catch(() => null);
    if (!response?.ok) return json(502, { error: "Could not load subscription" });
    const subscription = ((await response.json()) as { data?: PaddleSubscription }).data ?? {};
    return saveSubscription(admin, settings, subscription, userId);
  }
  return json(200, { ignored: true });
}

function userIdFrom(customData: PaddleSubscription["custom_data"]) {
  const value = customData?.user_id;
  return typeof value === "string" && uuid.test(value) ? value : null;
}

async function saveSubscription(admin: Admin, settings: PaddleSettings, subscription: PaddleSubscription, userId: string | null) {
  const { id, status } = subscription;
  if (typeof id !== "string" || typeof status !== "string" || !statuses.includes(status)) return json(200, { ignored: true });
  const text = (value: unknown) => typeof value === "string" ? value : null;
  const scheduledCancel = subscription.scheduled_change?.action === "cancel" ? text(subscription.scheduled_change.effective_at) : null;
  const response = await rpc(admin, "upsert_subscription", {
    p_environment: settings.mode,
    p_subscription_id: id,
    p_user_id: userId,
    p_customer_id: text(subscription.customer_id),
    p_price_id: text(subscription.items?.[0]?.price?.id),
    p_status: status,
    p_renews_at: text(subscription.next_billed_at),
    p_ends_at: scheduledCancel ?? text(subscription.canceled_at),
    p_updated_at: text(subscription.updated_at) ?? new Date().toISOString(),
  }).catch(() => null);
  if (!response?.ok) {
    console.error("Saving Paddle subscription failed", response?.status, response ? (await response.text()).slice(0, 500) : "network error");
    return json(500, { error: "Could not save subscription" });
  }
  return json(200, { ok: true });
}

/**
 * Paddle-Signature is "ts=<unix seconds>;h1=<hex HMAC-SHA256 of `${ts}:${raw body}`>" (several h1
 * values during secret rotation). Paddle's SDKs allow 5 seconds of clock difference; we allow
 * 5 minutes for delivery delays, which is safe because stored updates are ordered by updated_at,
 * so replaying an old event cannot change a subscription.
 */
export async function verifyPaddleSignature(secret: string, body: string, header: string, now = Date.now()) {
  const parts = header.split(";").map((part) => part.trim().split("="));
  const ts = parts.find(([name]) => name === "ts")?.[1] ?? "";
  const signatures = parts.filter(([name, value]) => name === "h1" && /^[0-9a-f]{64}$/i.test(value ?? "")).map(([, value]) => value);
  if (!/^\d{1,12}$/.test(ts) || !signatures.length || Math.abs(now / 1000 - Number(ts)) > 300) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const signed = encoder.encode(`${ts}:${body}`);
  for (const signature of signatures) {
    const bytes = new Uint8Array(signature.match(/../g)!.map((byte) => parseInt(byte, 16)));
    if (await crypto.subtle.verify("HMAC", key, bytes, signed)) return true;
  }
  return false;
}
