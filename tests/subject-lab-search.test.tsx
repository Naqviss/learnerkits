import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { locales } from "@/lib/i18n/config";
import { getEducationCopy, getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";
import SubjectPage from "@/app/[locale]/subjects/[subject]/page";

describe("subject lab search", () => {
  it("renders a labelled search box above the full, server-rendered lab list", async () => {
    for (const locale of locales) {
      const c = getEducationCopy(locale);
      for (const subject of visibleSubjectSlugs) {
        const html = renderToStaticMarkup(await SubjectPage({ params: Promise.resolve({ locale, subject }) }));
        const data = getLocalizedSubject(locale, subject);
        const search = html.indexOf('class="labSearch"');
        expect(search, `${locale}/${subject}`).toBeGreaterThan(-1);
        expect(html).toContain(`placeholder="${c.subject.labSearchPlaceholder(getLocalizedSubjectName(locale, subject))}"`.replace(/&/g, "&amp;"));
        expect(search).toBeLessThan(html.indexOf('class="labCatalogGrid"'));
        expect(html.match(/class="subjectSimCard educationLabCard"/g)).toHaveLength(data.simulations.length);
        expect(c.subject.labSearchCount("{shown}", "{total}")).toMatch(/\{shown\}.*\{total\}|\{total\}.*\{shown\}/);
      }
    }
  });
});
