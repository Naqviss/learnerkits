import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { indexedLocales, locales, supportedLocales } from "@/lib/i18n/config";
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

  it("opens only English to search engines", () => {
    expect(indexedLocales).toEqual(["en"]);
    expect(indexedLocales.every((locale) => locales.includes(locale))).toBe(true);
  });

  it("lists only search-indexed languages in the sitemap and hreflang", () => {
    for (const entry of sitemap()) {
      expect(new URL(entry.url).pathname).toMatch(/^(\/|\/en(\/.*)?)$/);
      expect(Object.keys(entry.alternates?.languages ?? {}).sort()).toEqual(["en", "x-default"]);
    }
    const metadata = localizedMetadata("en", "/simulations", "Simulations", "Science labs");
    expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual(["en", "x-default"]);
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({ alternateLocale: ["es_ES"] });
  });

  it("keeps Spanish pages for visitors but out of search results", () => {
    const metadata = localizedMetadata("es", "/simulations", "Simulaciones", "Laboratorios de ciencias");
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates).toEqual({ canonical: "https://www.learnerkits.com/es/simulations" });
  });

  it("lets a page stay published but unlisted, and keeps private pages fully blocked", () => {
    const unlisted = localizedMetadata("en", "/molecules/example", "Example", "Example", { englishOnly: true, unlisted: true });
    expect(unlisted.robots).toEqual({ index: false, follow: true });
    expect(unlisted.alternates).toEqual({ canonical: "https://www.learnerkits.com/en/molecules/example" });
    expect(localizedMetadata("en", "/settings", "Settings", "Settings", { noIndex: true, unlisted: true }).robots).toEqual({ index: false, follow: false });
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
