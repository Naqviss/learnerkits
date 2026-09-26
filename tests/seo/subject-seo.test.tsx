import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { locales } from "@/lib/i18n/config";
import { getLocalizedSubject } from "@/lib/i18n/content";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { getSubjectSeo } from "@/lib/seo/subject-seo";
import SubjectPage, { generateMetadata } from "@/app/[locale]/subjects/[subject]/page";
import SubjectIndex from "@/app/[locale]/subjects/page";

const cjk = /[\u3040-\u30ff\u4e00-\u9fff]/;
const ldJson = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]));

describe("subject search snippets", () => {
  it("has a localized title and description for every visible subject that fits in a results page", async () => {
    for (const locale of locales) {
      for (const subject of visibleSubjectSlugs) {
        const labs = getLocalizedSubject(locale, subject).simulations.length;
        const seo = getSubjectSeo(locale, subject, labs);
        expect(seo, `${locale}/${subject}`).toBeDefined();
        const narrow = cjk.test(seo!.title);
        expect(seo!.title.length, `${locale}/${subject} title`).toBeLessThanOrEqual(narrow ? 24 : 50);
        expect(seo!.description.length, `${locale}/${subject} description`).toBeGreaterThanOrEqual(narrow ? 40 : 100);
        expect(seo!.description.length, `${locale}/${subject} description`).toBeLessThanOrEqual(narrow ? 80 : 160);
        expect(seo!.description).toContain(String(labs));
        if (locale !== "en") expect(seo!.description).not.toMatch(/\b(the|and|with|free)\b/);

        const metadata = await generateMetadata({ params: Promise.resolve({ locale, subject }) });
        expect(metadata).toMatchObject({ title: seo!.title, description: seo!.description, openGraph: { title: seo!.title, description: seo!.description }, twitter: { title: seo!.title, description: seo!.description } });
      }
    }
  });

  it("describes each subject page and the subject index with structured data", async () => {
    for (const locale of locales) {
      for (const subject of visibleSubjectSlugs) {
        const collection = ldJson(renderToStaticMarkup(await SubjectPage({ params: Promise.resolve({ locale, subject }) }))).find((item) => item["@type"] === "CollectionPage");
        expect(collection).toMatchObject({ isAccessibleForFree: true, educationalLevel: expect.any(String), audience: { "@type": "EducationalAudience" } });
        expect(collection.about.length).toBeGreaterThan(0);
      }
      const json = ldJson(renderToStaticMarkup(await SubjectIndex({ params: Promise.resolve({ locale }) })));
      expect(json.find((item) => item["@type"] === "BreadcrumbList")).toBeDefined();
      expect(json.find((item) => item["@type"] === "CollectionPage").mainEntity.numberOfItems).toBe(visibleSubjectSlugs.length);
    }
  });
});
