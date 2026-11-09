import { afterEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import { isEntitled } from "@/lib/billing/entitlement";
import { billingConfig, createCheckout, customerPortal, paddleWebhook, verifyPaddleSignature } from "@/lib/billing/paddle";
import { resolvePaddle } from "@/lib/billing/paddle-config";
import { extractReply, handleTutor } from "@/lib/ai/tutor";
import worker from "@/worker/index";

const userId = "3f1c2a9e-1b2c-4d5e-8f90-123456789abc";
const supabase = { SUPABASE_URL: "https://project.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" };
const paddle = {
  ...supabase, PADDLE_TEST_MODE: "true",
  PADDLE_SANDBOX_API_KEY: "pdl_sdbx_apikey_test", PADDLE_SANDBOX_CLIENT_TOKEN: "test_token", PADDLE_SANDBOX_PRICE_ID: "pri_monthly", PADDLE_SANDBOX_DISCOUNT_ID: "dsc_launch", PADDLE_SANDBOX_WEBHOOK_SECRET: "pdl_ntfset_secret",
  PADDLE_LIVE_API_KEY: "pdl_live_apikey_x", PADDLE_LIVE_CLIENT_TOKEN: "live_token", PADDLE_LIVE_PRICE_ID: "pri_live", PADDLE_LIVE_WEBHOOK_SECRET: "pdl_ntfset_live",
};
const live = { ...paddle, PADDLE_TEST_MODE: "false" };
const signature = (body: string, ts = Math.floor(Date.now() / 1000), secret = "pdl_ntfset_secret") =>
  `ts=${ts};h1=${createHmac("sha256", secret).update(`${ts}:${body}`).digest("hex")}`;
const post = (path: string, body: unknown, headers: Record<string, string> = {}) => new Request(`https://www.learnerkits.com${path}`, {
  method: "POST", headers: { "content-type": "application/json", authorization: "Bearer user-token", ...headers }, body: JSON.stringify(body),
});
const webhook = (body: string, header: string) => new Request("https://www.learnerkits.com/api/billing/webhook", { method: "POST", body, headers: { "paddle-signature": header } });
const row = (status: string) => ({ provider_subscription_id: "sub_1", provider_customer_id: "ctm_1", status, provider_updated_at: "2026-11-01T00:00:00Z" });

type Route = (url: URL, init?: RequestInit) => Response | undefined;
function mockFetch(route: Route) {
  const calls: { url: URL; init?: RequestInit }[] = [];
  vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    calls.push({ url, init });
    return route(url, init) ?? new Response("unexpected", { status: 500 });
  }));
  return calls;
}
const signedInAs = (subscriptions: unknown[]): Route => (url) => {
  if (url.pathname === "/auth/v1/user") return Response.json({ id: userId, email: "student@example.com", user_metadata: { full_name: "Sam" } });
  if (url.pathname === "/rest/v1/subscriptions") return Response.json(subscriptions);
};

afterEach(() => { vi.unstubAllGlobals(); });

describe("PADDLE_TEST_MODE switch", () => {
  it("picks the sandbox or live set and the matching API host", () => {
    expect(resolvePaddle(paddle)).toMatchObject({ mode: "sandbox", apiBase: "https://sandbox-api.paddle.com", apiKey: "pdl_sdbx_apikey_test", clientToken: "test_token", priceId: "pri_monthly", problems: [] });
    expect(resolvePaddle(live)).toMatchObject({ mode: "live", apiBase: "https://api.paddle.com", apiKey: "pdl_live_apikey_x", clientToken: "live_token", priceId: "pri_live", discountId: undefined, problems: [] });
  });

  it("refuses keys from the wrong environment instead of using them", () => {
    const mixed = resolvePaddle({ ...live, PADDLE_LIVE_API_KEY: "pdl_sdbx_apikey_oops", PADDLE_LIVE_CLIENT_TOKEN: "test_oops" });
    expect(mixed.apiKey).toBeUndefined();
    expect(mixed.clientToken).toBeUndefined();
    expect(mixed.problems).toEqual([
      'PADDLE_LIVE_API_KEY should start with "pdl_live_apikey_" in live mode',
      'PADDLE_LIVE_CLIENT_TOKEN should start with "live_" in live mode',
    ]);
  });

  it("treats a missing switch as live and reports it", () => {
    const { PADDLE_TEST_MODE: _unused, ...unset } = paddle;
    expect(resolvePaddle(unset).mode).toBe("live");
    expect(resolvePaddle(unset).problems[0]).toContain("PADDLE_TEST_MODE");
  });

  it("tells the browser which environment and client token to use", async () => {
    const request = new Request("https://www.learnerkits.com/api/billing/config", { method: "POST" });
    expect(await billingConfig(request, paddle).json()).toEqual({ mode: "sandbox", clientToken: "test_token", ready: true });
    expect(await billingConfig(request, live).json()).toEqual({ mode: "live", clientToken: "live_token", ready: true });
  });

  it("in live mode, rejects webhooks signed with the sandbox secret", async () => {
    const body = JSON.stringify({ event_type: "subscription.created", data: { id: "sub_x", status: "active", custom_data: { user_id: userId } } });
    const calls = mockFetch(() => new Response(null, { status: 204 }));
    expect((await paddleWebhook(webhook(body, signature(body)), live)).status).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it("counts only subscriptions from the active environment", async () => {
    const calls = mockFetch(signedInAs([]));
    mockFetch((url, init) => url.hostname === "api.paddle.com" ? Response.json({ data: { id: "txn_live" } }) : signedInAs([])(url, init));
    await createCheckout(post("/api/billing/checkout", {}), live);
    const read = vi.mocked(fetch).mock.calls.map(([input]) => new URL(String(input))).find((url) => url.pathname === "/rest/v1/subscriptions")!;
    expect(read.searchParams.get("environment")).toBe("eq.live");
    expect(calls).toHaveLength(0);
  });
});

describe("Premium entitlement", () => {
  it("counts active, trialing and retrying subscriptions only", () => {
    expect(["active", "trialing", "past_due"].every((status) => isEntitled({ status }))).toBe(true);
    expect(["paused", "canceled"].some((status) => isEntitled({ status }))).toBe(false);
  });
});

describe("Paddle webhook", () => {
  const subscription = {
    id: "sub_01", status: "active", customer_id: "ctm_01", custom_data: { user_id: userId },
    items: [{ price: { id: "pri_monthly" } }], next_billed_at: "2026-12-09T00:00:00Z", canceled_at: null,
    scheduled_change: null, updated_at: "2026-11-09T10:00:00Z",
  };
  const event = JSON.stringify({ event_id: "evt_1", event_type: "subscription.created", occurred_at: "2026-11-09T10:00:00Z", data: subscription });

  it("verifies Paddle-Signature (HMAC-SHA256 of ts:body), including rotated secrets and timestamp age", async () => {
    const now = Date.parse("2026-11-09T10:00:00Z"), ts = now / 1000;
    expect(await verifyPaddleSignature("pdl_ntfset_secret", event, signature(event, ts), now)).toBe(true);
    const rotated = `${signature(event, ts, "old_secret")};h1=${signature(event, ts).split("h1=")[1]}`;
    expect(await verifyPaddleSignature("pdl_ntfset_secret", event, rotated, now)).toBe(true);
    expect(await verifyPaddleSignature("pdl_ntfset_secret", event, signature(event, ts, "wrong"), now)).toBe(false);
    expect(await verifyPaddleSignature("pdl_ntfset_secret", event + " ", signature(event, ts), now)).toBe(false);
    expect(await verifyPaddleSignature("pdl_ntfset_secret", event, signature(event, ts - 3600), now)).toBe(false);
    expect(await verifyPaddleSignature("pdl_ntfset_secret", event, "garbage", now)).toBe(false);
  });

  it("rejects unsigned or tampered events without touching the database", async () => {
    const calls = mockFetch(() => undefined);
    expect((await paddleWebhook(webhook(event, signature(event + "x")), paddle)).status).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it("records the subscription for the user in the checkout's custom data", async () => {
    const calls = mockFetch((url) => url.pathname === "/rest/v1/rpc/upsert_subscription" ? new Response(null, { status: 204 }) : undefined);
    expect((await paddleWebhook(webhook(event, signature(event)), paddle)).status).toBe(200);
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({
      p_environment: "sandbox", p_subscription_id: "sub_01", p_user_id: userId, p_customer_id: "ctm_01", p_price_id: "pri_monthly", p_status: "active",
      p_renews_at: "2026-12-09T00:00:00Z", p_ends_at: null, p_updated_at: "2026-11-09T10:00:00Z",
    });
  });

  it("stores the end date of a cancellation scheduled for the end of the period", async () => {
    const body = JSON.stringify({ event_type: "subscription.updated", data: { ...subscription, next_billed_at: null, scheduled_change: { action: "cancel", effective_at: "2026-12-09T00:00:00Z" } } });
    const calls = mockFetch(() => new Response(null, { status: 204 }));
    await paddleWebhook(webhook(body, signature(body)), paddle);
    expect(JSON.parse(String(calls[0].init?.body))).toMatchObject({ p_status: "active", p_ends_at: "2026-12-09T00:00:00Z" });
  });

  it("links the subscription from transaction.completed when needed", async () => {
    const body = JSON.stringify({ event_type: "transaction.completed", data: { id: "txn_1", subscription_id: "sub_01", custom_data: { user_id: userId } } });
    const calls = mockFetch((url) => {
      if (url.hostname === "sandbox-api.paddle.com" && url.pathname === "/subscriptions/sub_01") return Response.json({ data: { ...subscription, custom_data: null } });
      if (url.pathname === "/rest/v1/rpc/upsert_subscription") return new Response(null, { status: 204 });
    });
    expect((await paddleWebhook(webhook(body, signature(body)), paddle)).status).toBe(200);
    expect(JSON.parse(String(calls.at(-1)!.init?.body))).toMatchObject({ p_subscription_id: "sub_01", p_user_id: userId });
  });

  it("asks Paddle to retry when saving fails", async () => {
    mockFetch(() => new Response("down", { status: 503 }));
    expect((await paddleWebhook(webhook(event, signature(event)), paddle)).status).toBe(500);
  });

  it("is routed by the Worker", async () => {
    const response = await worker.fetch(new Request("https://www.learnerkits.com/api/billing/webhook"), { ...paddle, ASSETS: { fetch: async () => new Response(null, { status: 404 }) } });
    expect(response.status).toBe(405);
  });
});

describe("Checkout", () => {
  it("is unavailable until Paddle is configured", async () => {
    expect((await createCheckout(post("/api/billing/checkout", {}), supabase)).status).toBe(503);
  });

  it("requires a signed-in user", async () => {
    mockFetch((url) => url.pathname === "/auth/v1/user" ? new Response("{}", { status: 401 }) : undefined);
    expect((await createCheckout(post("/api/billing/checkout", {}), paddle)).status).toBe(401);
  });

  it("rejects cross-site requests", async () => {
    expect((await createCheckout(post("/api/billing/checkout", {}, { origin: "https://evil.example" }), paddle)).status).toBe(403);
  });

  it("creates a discounted transaction carrying the verified user id", async () => {
    const calls = mockFetch((url, init) => url.hostname === "sandbox-api.paddle.com" ? Response.json({ data: { id: "txn_abc" } }) : signedInAs([])(url, init));
    const response = await createCheckout(post("/api/billing/checkout", { returnPath: "/en/simulations/pendulum", user_id: "someone-else" }), paddle);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ transactionId: "txn_abc", successUrl: "https://www.learnerkits.com/en/simulations/pendulum?premium=welcome", clientToken: "test_token", sandbox: true });
    const call = calls.find((item) => item.url.hostname === "sandbox-api.paddle.com")!;
    expect(call.url.pathname).toBe("/transactions");
    expect((call.init?.headers as Record<string, string>)["Paddle-Version"]).toBe("1");
    expect(JSON.parse(String(call.init?.body))).toEqual({ items: [{ price_id: "pri_monthly", quantity: 1 }], custom_data: { user_id: userId }, discount_id: "dsc_launch" });
  });

  it("uses the live API for live keys and never returns off-site", async () => {
    const calls = mockFetch((url, init) => url.hostname === "api.paddle.com" ? Response.json({ data: { id: "txn_live" } }) : signedInAs([])(url, init));
    const response = await createCheckout(post("/api/billing/checkout", { returnPath: "//evil.example/path" }), live);
    const call = calls.find((item) => item.url.hostname === "api.paddle.com")!;
    expect((call.init?.headers as Record<string, string>).Authorization).toBe("Bearer pdl_live_apikey_x");
    expect(JSON.parse(String(call.init?.body)).items).toEqual([{ price_id: "pri_live", quantity: 1 }]);
    expect(calls.some((item) => item.url.hostname === "sandbox-api.paddle.com")).toBe(false);
    expect(await response.json()).toMatchObject({ successUrl: "https://www.learnerkits.com/?premium=welcome", clientToken: "live_token", sandbox: false });
  });

  it("does not sell a second subscription", async () => {
    mockFetch(signedInAs([row("active")]));
    expect((await createCheckout(post("/api/billing/checkout", {}), paddle)).status).toBe(409);
  });
});

describe("Customer portal", () => {
  it("returns a fresh Paddle portal link for the user's latest subscription", async () => {
    const calls = mockFetch((url, init) => url.hostname === "sandbox-api.paddle.com"
      ? Response.json({ data: { urls: { general: { overview: "https://customer-portal.paddle.com/cpl_x" } } } }, { status: 201 })
      : signedInAs([row("active")])(url, init));
    const response = await customerPortal(post("/api/billing/portal", {}), paddle);
    expect(await response.json()).toEqual({ url: "https://customer-portal.paddle.com/cpl_x" });
    const call = calls.find((item) => item.url.hostname === "sandbox-api.paddle.com")!;
    expect(call.url.pathname).toBe("/customers/ctm_1/portal-sessions");
    expect(JSON.parse(String(call.init?.body))).toEqual({ subscription_ids: ["sub_1"] });
  });
});

describe("AI tutor", () => {
  const question = { locale: "en", simulation: { title: "Pendulum lab" }, messages: [{ role: "user", content: "Why does a longer pendulum swing slower?" }] };
  const ai = (reply: string) => ({ run: vi.fn(async () => ({ choices: [{ message: { content: reply } }] })) });

  it("is only for Premium subscribers", async () => {
    mockFetch(signedInAs([row("canceled")]));
    const binding = ai("hi");
    expect((await handleTutor(post("/api/ai/tutor", question), { ...supabase, AI: binding })).status).toBe(402);
    expect(binding.run).not.toHaveBeenCalled();
  });

  it("enforces the daily limit", async () => {
    mockFetch((url, init) => url.pathname === "/rest/v1/rpc/consume_ai_request" ? Response.json(false) : signedInAs([row("active")])(url, init));
    const binding = ai("hi");
    expect((await handleTutor(post("/api/ai/tutor", question), { ...supabase, AI: binding })).status).toBe(429);
    expect(binding.run).not.toHaveBeenCalled();
  });

  it("answers subscribers with the simulation as context and hides model reasoning", async () => {
    mockFetch((url, init) => url.pathname === "/rest/v1/rpc/consume_ai_request" ? Response.json(true) : signedInAs([row("active")])(url, init));
    const binding = ai("<think>internal</think>\nA longer string means a longer path to swing.");
    const response = await handleTutor(post("/api/ai/tutor", question), { ...supabase, AI: binding });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ reply: "A longer string means a longer path to swing." });
    const [model, input] = binding.run.mock.calls[0] as unknown as [string, { messages: { role: string; content: string }[] }];
    expect(model).toBe("@cf/qwen/qwen3-30b-a3b-fp8");
    expect(input.messages[0]).toMatchObject({ role: "system" });
    expect(input.messages[0].content).toContain('"Pendulum lab"');
    expect(input.messages.at(-1)).toEqual({ role: "user", content: "Why does a longer pendulum swing slower?" });
  });

  it("reads both Workers AI response shapes", () => {
    expect(extractReply({ response: "Plain" })).toBe("Plain");
    expect(extractReply({ choices: [{ message: { content: " Hi " } }] })).toBe("Hi");
    expect(extractReply(null)).toBe("");
  });
});
