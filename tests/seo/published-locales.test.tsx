import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { locales, supportedLocales } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";
import sitemap from "@/app/sitemap";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
import worker from "@/worker/index";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/en/simulations",
}));

const disabledLocales = supportedLocales.filter((locale) => !locales.includes(locale));
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };

describe("published locales", () => {
  it("publishes English and Spanish", () => {
    expect(locales).toEqual(["en", "es"]);
  });

  it("lists only published locales in the sitemap and alternates", () => {
    for (const entry of sitemap()) {
      expect(new URL(entry.url).pathname).toMatch(/^(\/|\/(en|es)(\/.*)?)$/);
      expect(Object.keys(entry.alternates?.languages ?? {}).every((code) => ["en", "es", "x-default"].includes(code))).toBe(true);
    }
    expect(sitemap().some((entry) => new URL(entry.url).pathname.startsWith("/es/simulations/"))).toBe(true);
    const metadata = localizedMetadata("en", "/simulations", "Simulations", "Science labs");
    expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual(["en", "es", "x-default"]);
    expect(metadata.openGraph).toMatchObject({ alternateLocale: ["es_ES"] });
  });

  it("shows the language selector with published languages only", () => {
    const html = renderToStaticMarkup(<LanguageSelector locale="en" label="Language"/>);
    expect(html).toContain('value="en"');
    expect(html).toContain('value="es"');
    for (const locale of disabledLocales) expect(html).not.toContain(`value="${locale}"`);
  });

  it.each(disabledLocales)("temporarily redirects %s deep links and preserves the query", async (locale) => {
    const response = await worker.fetch(new Request(`https://www.learnerkits.com/${locale}/simulations/moon-phases-3d?source=bookmark`), env);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://www.learnerkits.com/en/simulations/moon-phases-3d?source=bookmark");
  });

  it.each(disabledLocales)("redirects the %s homepage directly to the canonical homepage", async (locale) => {
    for (const suffix of ["", "/"]) {
      const response = await worker.fetch(new Request(`https://www.learnerkits.com/${locale}${suffix}`), env);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("https://www.learnerkits.com/");
    }
  });

  it("does not redirect Spanish pages", async () => {
    const response = await worker.fetch(new Request("https://www.learnerkits.com/es/not-a-page"), env);
    expect(response.status).toBe(404);
  });

  it("honours a Spanish language preference for locale-less links", async () => {
    const response = await worker.fetch(new Request("https://www.learnerkits.com/about", {
      headers: { cookie: "science-sim-locale=es" },
    }), env);
    expect(response.headers.get("location")).toBe("https://www.learnerkits.com/es/about");
  });

  it("ignores preferences for unpublished languages", async () => {
    const response = await worker.fetch(new Request("https://www.learnerkits.com/about", {
      headers: { cookie: "science-sim-locale=ja", "accept-language": "ja-JP" },
    }), env);
    expect(response.headers.get("location")).toBe("https://www.learnerkits.com/en/about");
  });

  it("does not redirect missing English pages in a loop", async () => {
    const response = await worker.fetch(new Request("https://www.learnerkits.com/en/not-a-page"), env);
    expect(response.status).toBe(404);
  });
});
