import { afterEach, describe, expect, it, vi } from "vitest";
import { submitContact } from "@/lib/contact/submit";
import worker from "../worker";

const env = { SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" };
const fields = { name: "A Learner", email: " Learner@example.com ", topic: "Science correction", message: "The units on the gravity lab appear inconsistent.", locale: "en", consent: true, website: "" };
const request = (changes = {}, headers = {}) => new Request("https://www.learnerkits.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://www.learnerkits.com", ...headers }, body: JSON.stringify({ ...fields, ...changes }) });
afterEach(() => vi.unstubAllGlobals());

describe("contact submission", () => {
  it("stores validated content using server credentials without forwarding extra fields", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('"uuid"', { status: 200 }));
    vi.stubGlobal("fetch", fetcher);
    const response = await submitContact(request({ status: "closed", ip: "untrusted" }), env);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
    const [url, options] = fetcher.mock.calls[0];
    expect(url.toString()).toBe("https://test.supabase.co/rest/v1/rpc/submit_contact_message");
    expect(options.headers.apikey).toBe("sb_secret_test");
    expect(options.headers.Authorization).toBeUndefined();
    expect(JSON.parse(options.body)).toEqual({ p_name: "A Learner", p_email: "learner@example.com", p_topic: "Science correction", p_message: fields.message, p_locale: "en", p_policy_version: "2026-10-03" });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it.each([{ name: "" }, { email: "invalid" }, { message: "short" }, { message: "x".repeat(5001) }, { topic: "invented" }, { consent: false }, { consent: "true" }, { locale: "invalid" }])("rejects invalid fields: %j", async changes => {
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    expect((await submitContact(request(changes), env)).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("rejects cross-origin and non-JSON submissions", async () => {
    expect((await submitContact(request({}, { Origin: "https://another.example" }), env)).status).toBe(403);
    expect((await submitContact(request({}, { "Content-Type": "text/plain" }), env)).status).toBe(415);
  });
  it("handles malformed JSON, arrays and excessive bodies", async () => {
    for (const body of ["{", "null", "[]"]) {
      expect((await submitContact(new Request("https://www.learnerkits.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body }), env)).status).toBe(400);
    }
    expect((await submitContact(request({ message: "x".repeat(25_000) }), env)).status).toBe(413);
  });
  it("silently drops honeypot spam without a database call", async () => {
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    expect((await submitContact(request({ website: "spam" }), env)).status).toBe(200);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("fails clearly when not configured and does not report success", async () => {
    expect((await submitContact(request(), {})).status).toBe(503);
  });
  it("returns the database's shared rate limit with retry guidance", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("rate limited", { status: 429 })));
    const response = await submitContact(request(), env);
    expect(response.status).toBe(429); expect(response.headers.get("retry-after")).toBe("900");
  });
  it("does not reveal database errors or secrets", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("internal database details", { status: 500 })));
    const response = await submitContact(request(), env);
    expect(response.status).toBe(502); expect(await response.text()).not.toContain("internal database details");
  });
  it("handles upstream network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    expect((await submitContact(request(), env)).status).toBe(502);
  });
  it("supports legacy service-role keys", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('"uuid"')); vi.stubGlobal("fetch", fetcher);
    await submitContact(request(), { SUPABASE_URL: env.SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: "legacy.jwt" });
    expect(fetcher.mock.calls[0][1].headers.Authorization).toBe("Bearer legacy.jwt");
  });
  it("routes production POST requests through the Worker with its secret bindings", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('"uuid"')); vi.stubGlobal("fetch", fetcher);
    const assets = { fetch: vi.fn() };
    expect((await worker.fetch(request(), { ...env, ASSETS: assets })).status).toBe(201);
    expect(assets.fetch).not.toHaveBeenCalled();
    const get = await worker.fetch(new Request("https://www.learnerkits.com/api/contact"), { ...env, ASSETS: assets });
    expect(get.status).toBe(405); expect(get.headers.get("allow")).toBe("POST");
  });
});
