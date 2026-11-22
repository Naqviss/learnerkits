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

  it("presents the complete learning journey on every published subject page", async () => {
    for (const locale of locales) {
      for (const subject of visibleSubjectSlugs) {
        const html = renderToStaticMarkup(await SubjectPage({ params: Promise.resolve({ locale, subject }) }));
        expect(html, `${locale}/${subject}`).toContain(locale === "es" ? "Un recorrido de aprendizaje completo" : "A complete learning journey");
        expect(html).toContain(locale === "es" ? "Pregunta al tutor de IA del tema" : "Ask the topic-aware AI tutor");
        expect(html).toContain(locale === "es" ? "Consulta tu progreso" : "See learning progress");
        expect(html).toContain(`/${locale}/premium`);
      }
    }
  });
});

import { subjectsCatalog, unlistedSubjectSlugs } from "@/lib/subjects/catalog";
import sitemap from "@/app/sitemap";
import { generateMetadata as simulationMetadata } from "@/app/[locale]/simulations/[slug]/page";

describe("unlisted subjects", () => {
  it("keeps the subject page and its simulations out of Google and its sitemap, but open to Bing", async () => {
    const urls = new Set(sitemap().map((entry) => entry.url));
    const googleOnly = { index: true, follow: true, googleBot: { index: false, follow: true } };
    for (const subject of unlistedSubjectSlugs) {
      expect(await generateMetadata({ params: Promise.resolve({ locale: "en", subject }) })).toMatchObject({ robots: googleOnly });
      expect(await generateMetadata({ params: Promise.resolve({ locale: "es", subject }) })).toMatchObject({ robots: { index: false, follow: true } });
      expect(urls.has(`https://www.learnerkits.com/en/subjects/${subject}`)).toBe(false);
      for (const { slug } of subjectsCatalog[subject].simulations) {
        expect(await simulationMetadata({ params: Promise.resolve({ locale: "en", slug }) }), slug).toMatchObject({ robots: googleOnly });
        expect([...urls].some((url) => url.endsWith(`/simulations/${slug}`)), slug).toBe(false);
      }
    }
  });
});

import { unlistedSimulationSlugs } from "@/lib/subjects/catalog";
import { investigationSlugs } from "@/lib/simulations/practical/investigations";
import { generateMetadata as worksheetMetadata } from "@/app/[locale]/guides/[lab]/[worksheet]/page";
import { generateMetadata as boardMetadata } from "@/app/[locale]/exam-prep/[board]/page";
import { generateMetadata as courseMetadata } from "@/app/[locale]/exam-prep/[board]/[level]/[subject]/page";
import { generateMetadata as papersMetadata } from "@/app/[locale]/exam-prep/[board]/[level]/[subject]/papers/page";

// The 2026-11-23 content audit: page sets built from one template, or added in bulk during the
// spam-update recovery, stay published but out of Google (and its sitemap) until they have content of
// their own. Only Google is told to skip them; Bing may still index them.
describe("pages held out of Google after the content audit", () => {
  const googleOnly = { index: true, follow: true, googleBot: { index: false, follow: true } };
  const urls = new Set(sitemap().map((entry) => entry.url));
  const listed = (path: string) => urls.has(`https://www.learnerkits.com/en${path}`);

  it("unlists the investigation labs that went live in one batch", async () => {
    for (const slug of investigationSlugs) expect(unlistedSimulationSlugs.has(slug), slug).toBe(true);
    for (const slug of unlistedSimulationSlugs) {
      expect(await simulationMetadata({ params: Promise.resolve({ locale: "en", slug }) }), slug).toMatchObject({ robots: googleOnly });
      expect(listed(`/simulations/${slug}`), slug).toBe(false);
    }
    expect(listed("/simulations/tsunami-3d")).toBe(true);
  });

  it("unlists the lab worksheets", async () => {
    for (const lab of investigationSlugs) for (const worksheet of ["mission", "how-to-measure"]) {
      expect(await worksheetMetadata({ params: Promise.resolve({ locale: "en", lab, worksheet }) }), `${lab}/${worksheet}`).toMatchObject({ robots: googleOnly });
      expect(listed(`/guides/${lab}/${worksheet}`), `${lab}/${worksheet}`).toBe(false);
    }
    expect(listed("/guides")).toBe(true);
  });

  it("unlists the exam-prep board, level, course and papers pages", async () => {
    const course = { board: "cambridge", level: "as", subject: "physics" };
    expect(await boardMetadata({ params: Promise.resolve({ locale: "en", board: "cambridge" }) })).toMatchObject({ robots: googleOnly });
    expect(await courseMetadata({ params: Promise.resolve({ locale: "en", ...course }) })).toMatchObject({ robots: googleOnly });
    expect(await papersMetadata({ params: Promise.resolve({ locale: "en", ...course }) })).toMatchObject({ robots: googleOnly });
    for (const path of ["/exam-prep/cambridge", "/exam-prep/cambridge/as", "/exam-prep/cambridge/as/physics", "/exam-prep/cambridge/as/physics/papers", "/exam-prep/ib/dp-hl/physics"]) expect(listed(path), path).toBe(false);
    for (const path of ["/exam-prep", "/exam-prep/any-board", "/exam-prep/practicals/circuit", "/exam-prep/practicals/pendulum"]) expect(listed(path), path).toBe(true);
  });
});

import { googleUnlistedPaths } from "@/lib/seo/google-unlisted";
import { GET as bingSitemap } from "@/app/sitemap-bing.xml/route";

describe("sitemap-bing.xml", () => {
  it("lists every page kept out of Google, once, and none of the sitemap.xml pages", async () => {
    const paths = googleUnlistedPaths();
    expect(new Set(paths).size).toBe(paths.length);
    const google = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
    for (const path of paths) expect(google.has(`/en${path}`), path).toBe(false);
    for (const path of ["/subjects/mathematics", "/simulations/fluid-dynamics-simulator", "/guides/fluid-dynamics-simulator/mission", "/exam-prep/cambridge/as/physics", "/exam-prep/cambridge/as/physics/kinematics", "/molecules/zinc-bromide-znbr2"]) expect(paths, path).toContain(path);
    const xml = await bingSitemap().text();
    expect(xml.match(/<loc>/g)).toHaveLength(paths.length);
    expect(xml).toContain("<loc>https://www.learnerkits.com/en/molecules/zinc-bromide-znbr2</loc>");
  });
});
