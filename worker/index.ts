import { submitContact } from "../lib/contact/submit";
import { createDonationCheckout } from "../lib/donate/checkout";
import { defaultLocale, locales } from "../lib/i18n/config";

type Env = { SUPABASE_URL?: string; SUPABASE_SECRET_KEY?: string; SUPABASE_SERVICE_ROLE_KEY?: string; ASSETS: { fetch(input: Request | URL | string): Promise<Response> } };

// Cloudflare serves every file in out/ directly, and those requests are free and never count
// toward Worker limits. This Worker only runs when no file matches: the donation and contact APIs,
// locale-less paths such as /about, and 404s.
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/api/contact") return submitContact(request, env);

    if (pathname === "/api/donate") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
      return createDonationCheckout(request);
    }

    const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
    if (!hasLocale && !pathname.startsWith("/_next") && !pathname.startsWith("/api/") && !pathname.includes(".")) {
      url.pathname = `/${preferredLocale(request)}${pathname}`;
      return Response.redirect(url.toString(), 307);
    }

    // "/404" rather than "/404.html": the assets binding redirects explicit .html paths.
    const page = await env.ASSETS.fetch(new URL("/404", url));
    return new Response(page.body, { status: 404, headers: page.headers });
  },
};

function preferredLocale(request: Request) {
  const remembered = request.headers.get("cookie")?.match(/(?:^|;\s*)science-sim-locale=([^;]+)/)?.[1];
  const accept = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0];
  return locales.find((candidate) => candidate === remembered) ||
    locales.find((candidate) => candidate === accept) ||
    defaultLocale;
}
