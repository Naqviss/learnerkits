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

describe("English-only publication", () => {
  it("publishes only English URLs and alternate-language references", () => {
    expect(locales).toEqual(["en"]);
    for (const entry of sitemap()) {
      expect(new URL(entry.url).pathname).toMatch(/^(\/|\/en\/.*)$/);
      expect(Object.keys(entry.alternates?.languages ?? {}).sort()).toEqual(["en", "x-default"]);
    }
    const metadata = localizedMetadata("en", "/simulations", "Simulations", "Science labs");
    expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual(["en", "x-default"]);
    expect(metadata.openGraph).toMatchObject({ alternateLocale: [] });
  });

  it("hides the language selector", () => {
    expect(renderToStaticMarkup(<LanguageSelector locale="en" label="Language"/>)).toBe("");
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

  it("ignores old language preferences when redirecting locale-less links", async () => {
    const response = await worker.fetch(new Request("https://www.learnerkits.com/about", {
      headers: { cookie: "science-sim-locale=es", "accept-language": "ja-JP" },
    }), env);
    expect(response.headers.get("location")).toBe("https://www.learnerkits.com/en/about");
  });

  it("does not redirect missing English pages in a loop", async () => {
    const response = await worker.fetch(new Request("https://www.learnerkits.com/en/not-a-page"), env);
    expect(response.status).toBe(404);
  });
});
