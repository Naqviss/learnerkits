import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { locales } from "@/lib/i18n/config";
import { getEducationCopy } from "@/lib/i18n/content";
import { hiddenSubjectSlugs, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import Home from "@/app/[locale]/page";

describe("home subject cards", () => {
  it("shows watermarked artwork, no grade tag, and unclickable coming-soon cards for hidden subjects", async () => {
    for (const locale of locales) {
      const html = renderToStaticMarkup(await Home({ params: Promise.resolve({ locale }) }));
      expect(html).not.toContain('class="gradeTag"');
      expect(html).not.toContain('class="gatewayGlyph"');
      expect(html.match(/class="subjectWatermark"/g)).toHaveLength(visibleSubjectSlugs.length + hiddenSubjectSlugs.size);
      for (const slug of hiddenSubjectSlugs) {
        expect(html).toMatch(new RegExp(`<div class="[^"]*subjectComingSoon subject-${slug}" aria-disabled="true">`));
        expect(html).not.toContain(`href="/${locale}/subjects/${slug}"`);
      }
      expect(html).toContain(getEducationCopy(locale).home.comingSoon);
    }
  });
});

import SubjectIndex from "@/app/[locale]/subjects/page";
import Simulations from "@/app/[locale]/simulations/page";

describe("coming-soon subjects in other subject lists", () => {
  it("lists hidden subjects as disabled cards on the subjects index and in the simulation library", async () => {
    for (const locale of locales) {
      const params = Promise.resolve({ locale });
      const index = renderToStaticMarkup(await SubjectIndex({ params }));
      const library = renderToStaticMarkup(await Simulations({ params: Promise.resolve({ locale }) }));
      for (const slug of hiddenSubjectSlugs) {
        expect(index).toMatch(new RegExp(`subjectComingSoon subject-${slug}" aria-disabled="true"`));
        expect(index).not.toContain(`href="/${locale}/subjects/${slug}"`);
        expect(library).toMatch(new RegExp(`libCard libCardSoon subject-${slug}" aria-disabled="true"`));
      }
      expect(library.match(/class="libChip libChipSubject libChipSoon" disabled=""/g)).toHaveLength(hiddenSubjectSlugs.size);
    }
  });
});
