// Server-only helpers shared by the Cloudflare Worker and the Next.js dev route handlers.
// The secret key never reaches the browser.
export type SupabaseEnv = { SUPABASE_URL?: string; SUPABASE_SECRET_KEY?: string; SUPABASE_SERVICE_ROLE_KEY?: string };
export type Admin = { base: URL; key: string; headers: Record<string, string> };
export type SignedInUser = { id: string; email?: string; name?: string };
export type SubscriptionRow = { provider_subscription_id: string; provider_customer_id: string | null; status: string; provider_updated_at: string };

export const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export function supabaseAdmin(env: SupabaseEnv): Admin | null {
  const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  try {
    const base = new URL(env.SUPABASE_URL || "");
    if (base.protocol !== "https:" || base.username || base.password) return null;
    return { base, key, headers: { apikey: key, ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }) } };
  } catch { return null; }
}

/** Rejects cross-site browser requests (same rule as the contact form). */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !(origin && origin !== new URL(request.url).origin) && request.headers.get("sec-fetch-site") !== "cross-site";
}

/** Resolves the Supabase user from the request's `Authorization: Bearer <access token>`. */
export async function userFromRequest(request: Request, admin: Admin): Promise<SignedInUser | null> {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) return null;
  try {
    const response = await fetch(new URL("/auth/v1/user", admin.base), {
      headers: { apikey: admin.key, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;
    const user = await response.json() as { id?: unknown; email?: unknown; user_metadata?: Record<string, unknown> };
    if (typeof user.id !== "string") return null;
    const name = user.user_metadata?.full_name ?? user.user_metadata?.name;
    return { id: user.id, email: typeof user.email === "string" ? user.email : undefined, name: typeof name === "string" ? name : undefined };
  } catch { return null; }
}

/** The user's subscriptions from one Paddle environment ("sandbox" test purchases never count in "live"). */
export async function readSubscriptions(admin: Admin, userId: string, environment: "sandbox" | "live"): Promise<SubscriptionRow[]> {
  const url = new URL("/rest/v1/subscriptions", admin.base);
  url.searchParams.set("user_id", `eq.${userId}`);
  url.searchParams.set("environment", `eq.${environment}`);
  url.searchParams.set("select", "provider_subscription_id,provider_customer_id,status,provider_updated_at");
  url.searchParams.set("order", "provider_updated_at.desc");
  const response = await fetch(url, { headers: admin.headers, signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Supabase subscriptions read failed: ${response.status}`);
  return await response.json() as SubscriptionRow[];
}

export async function rpc(admin: Admin, name: string, args: Record<string, unknown>) {
  return fetch(new URL(`/rest/v1/rpc/${name}`, admin.base), {
    method: "POST",
    headers: { ...admin.headers, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(8_000),
  });
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<Record<string, unknown> | null> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return null;
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch { return null; }
}
