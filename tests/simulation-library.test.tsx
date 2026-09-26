import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { locales } from "@/lib/i18n/config";
import { getLocalizedSubject } from "@/lib/i18n/content";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { matchesTerms, normalizeSearch, searchTerms } from "@/lib/search/normalize";
import Simulations from "@/app/[locale]/simulations/page";

describe("search matching", () => {
  it("ignores case and accents and requires every term", () => {
    const text = normalizeSearch("Laboratorio de velocidad de reacción · Energía de activación");
    expect(matchesTerms(text, searchTerms("ENERGIA reaccion"))).toBe(true);
    expect(matchesTerms(text, searchTerms("energía gravedad"))).toBe(false);
    expect(matchesTerms(normalizeSearch("気体の法則ラボ"), searchTerms("法則"))).toBe(true);
  });
});

describe("simulation library page", () => {
  it("server-renders the search toolbar and every visible lab card in each locale", async () => {
    const total = visibleSubjectSlugs.reduce((n, slug) => n + subjectsCatalog[slug].simulations.length, 0);
    for (const locale of locales) {
      const html = renderToStaticMarkup(await Simulations({ params: Promise.resolve({ locale }) }));
      expect(html).toContain('class="libToolbar"');
      expect(html.match(/class="libCard subject-/g)).toHaveLength(total);
      for (const slug of visibleSubjectSlugs) expect(html).toContain(`id="${slug}"`);
    }
  });

  it("translates environmental science labs outside English", () => {
    for (const locale of locales.filter((code) => code !== "en")) {
      const subject = getLocalizedSubject(locale, "environmental-science");
      expect(subject.description, locale).not.toBe(subjectsCatalog["environmental-science"].description);
      subject.simulations.forEach((sim, index) => expect(sim.title, `${locale}/${sim.slug}`).not.toBe(subjectsCatalog["environmental-science"].simulations[index].title));
    }
  });
});
