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
  // Spanish is held back until AdSense approves the site (lib/i18n/config.ts).
  it("publishes English only while Spanish is held back", () => {
    expect(locales).toEqual(["en"]);
    expect(disabledLocales).toContain("es");
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
    expect(metadata.openGraph).toMatchObject({ alternateLocale: [] });
  });


  it("lets a page stay published but unlisted, and keeps private pages fully blocked", () => {
    const unlisted = localizedMetadata("en", "/molecules/example", "Example", "Example", { englishOnly: true, unlisted: true });
    expect(unlisted.robots).toEqual({ index: false, follow: true });
    expect(unlisted.alternates).toEqual({ canonical: "https://www.learnerkits.com/en/molecules/example" });
    expect(localizedMetadata("en", "/settings", "Settings", "Settings", { noIndex: true, unlisted: true }).robots).toEqual({ index: false, follow: false });
  });

  it("offers only published languages, and the header hides the picker while there is one", async () => {
    // With one published language the picker renders nothing (the globe icon disappears from the header).
    expect(renderToStaticMarkup(<LanguageSelector locale="en" label="Language"/>)).toBe("");
    const { readFileSync } = await import("node:fs");
    for (const file of ["components/navigation/Nav.tsx", "components/navigation/WorkspaceShell.tsx"]) expect(readFileSync(file, "utf8"), file).toMatch(/locales\.length > 1 && <LanguageSelector/);
  });

  it.each(disabledLocales)("permanently redirects %s deep links for search engines and preserves the query", async (locale) => {
    const response = await worker.fetch(new Request(`https://www.learnerkits.com/${locale}/simulations/moon-phases-3d?source=bookmark`), env);
    expect(response.status).toBe(301);
    // Browsers re-check daily, so a paused language can be restored later.
    expect(response.headers.get("cache-control")).toBe("public, max-age=86400");
    expect(response.headers.get("location")).toBe("https://www.learnerkits.com/en/simulations/moon-phases-3d?source=bookmark");
  });

  it.each(disabledLocales)("redirects the %s homepage directly to the canonical homepage", async (locale) => {
    for (const suffix of ["", "/"]) {
      const response = await worker.fetch(new Request(`https://www.learnerkits.com/${locale}${suffix}`), env);
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("https://www.learnerkits.com/");
    }
  });

  it("ignores a remembered Spanish preference while Spanish is held back", async () => {
    const response = await worker.fetch(new Request("https://www.learnerkits.com/about", {
      headers: { cookie: "science-sim-locale=es", "accept-language": "es-ES" },
    }), env);
    expect(response.headers.get("location")).toBe("https://www.learnerkits.com/en/about");
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
