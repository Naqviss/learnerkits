import { contactPolicyVersion, contactTopics } from "./config";
import { isLocale } from "../i18n/config";

type ContactEnv = { SUPABASE_URL?: string; SUPABASE_SECRET_KEY?: string; SUPABASE_SERVICE_ROLE_KEY?: string };
const maxBytes = 24_000;
const reply = (status: number, error?: string) => Response.json(error ? { error } : { ok: true }, {
  status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "900" } : {}) },
});

export async function submitContact(request: Request, env: ContactEnv): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return reply(403, "Please send your message from the contact page on this website.");
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return reply(415, "Please send a JSON request.");
  if (Number(request.headers.get("content-length")) > maxBytes) return reply(413, "Your message is too long.");
  let input: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, "Please complete the form.");
    const decoder = new TextDecoder();
    let text = "", size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); return reply(413, "Your message is too long."); }
      text += decoder.decode(value, { stream: true });
    }
    const parsed: unknown = JSON.parse(text + decoder.decode());
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return reply(400, "Please complete the form.");
    input = parsed as Record<string, unknown>;
  } catch { return reply(400, "We could not read your message. Please try again."); }
  // Honeypot submissions receive no indication that spam detection triggered.
  if (typeof input.website === "string" && input.website.trim()) return reply(200);
  const field = (key: string) => typeof input[key] === "string" ? input[key].trim() : "";
  const name = field("name"), email = field("email").toLowerCase(), topic = field("topic"), message = field("message"), locale = field("locale");
  if (!name || name.length > 100) return reply(400, "Enter a name of up to 100 characters.");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400, "Enter a valid email address.");
  if (!(contactTopics as readonly string[]).includes(topic)) return reply(400, "Choose a contact topic.");
  if (message.length < 20 || message.length > 5000) return reply(400, "Your message must contain between 20 and 5,000 characters.");
  if (!isLocale(locale) || input.consent !== true) return reply(400, "Confirm the privacy notice before sending.");
  const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  let base: URL;
  try {
    base = new URL(env.SUPABASE_URL || "");
    if (base.protocol !== "https:" || base.username || base.password) throw new Error("Invalid URL");
  } catch { return reply(503, "The contact form is temporarily unavailable. Please use the email address on this page."); }
  if (!key) return reply(503, "The contact form is temporarily unavailable. Please use the email address on this page.");
  try {
    const response = await fetch(new URL("/rest/v1/rpc/submit_contact_message", base), {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key, ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }) },
      body: JSON.stringify({ p_name: name, p_email: email, p_topic: topic, p_message: message, p_locale: locale, p_policy_version: contactPolicyVersion }),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 429) return reply(429, "Too many messages from this email address. Please try again in 15 minutes.");
    if (!response.ok) return reply(502, "Your message could not be saved. Please try again later or email us.");
    return reply(201);
  } catch { return reply(502, "We could not confirm that your message was saved. Please try again later or email us."); }
}
