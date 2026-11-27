import { informationUpdatedAt, infoMeta } from "@/components/legal/InfoPage";
import type { MetadataRoute } from "next";
import { articleSummaries, articlesUpdatedAt } from "@/lib/articles/catalog";
import { articleImages } from "@/lib/articles/images";
import { getArticle } from "@/lib/articles";
import { examPrepIndexablePaths } from "@/lib/exam-prep/paths";
import { mockExamIndexablePaths } from "@/lib/mock-exams/catalog";
import { getHomeCopy } from "@/lib/home/content";
import { defaultLocale, indexedLocales } from "@/lib/i18n/config";
import { hreflangCodes, localizedUrl, siteUrl } from "@/lib/seo/metadata";
import { getSimulationContent, simulationReviewDate } from "@/lib/seo/simulation-content";
import { indexedMoleculeReferences } from "@/lib/seo/molecules";
import { subjectImages, subjectImagesUpdatedAt } from "@/lib/subjects/images";
import { indexedSubjectSlugs, subjectsCatalog, unlistedSimulationSlugs } from "@/lib/subjects/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // User-specific tools and previews are noindex and should not consume crawl budget.
  const core = ["/", "/simulations", "/subjects", "/molecule-kit", "/donate", "/about", "/contact", "/privacy", "/cookies", "/terms", "/refunds", "/disclaimer", "/editorial-policy", "/faq", "/accessibility"];
  const subjectPaths = indexedSubjectSlugs.map((slug) => `/subjects/${slug}`);
  const subjectImageEntries = Object.fromEntries(indexedSubjectSlugs.flatMap((slug) => {
    const image = subjectImages[slug];
    return image ? [[`/subjects/${slug}`, `${siteUrl}${image.src}`]] : [];
  }));
  // Unlisted subjects (unlistedSubjectSlugs) are published but left out, along with their simulations,
  // and so are single unlisted simulations (unlistedSimulationSlugs).
  const simulationPaths = indexedSubjectSlugs.flatMap((slug) => subjectsCatalog[slug].simulations.filter((sim) => !unlistedSimulationSlugs.has(sim.slug)).map((sim) => `/simulations/${sim.slug}`));
  // Topic guides now live on their simulation pages (the old /guides and /guides/<slug> URLs 301
  // there). The /guides/<lab>/mission and /how-to-measure worksheets are unlisted and left out.
  const topicGuidePaths = ["/guides/environmental-city-builder"];
  const articlePaths = ["/articles", ...articleSummaries.map((article) => `/articles/${article.slug}`)];
  // Only the molecule pages open to search; the rest are unlisted (see indexedMoleculeSlugs).
  const moleculePaths = ["/molecules", ...indexedMoleculeReferences().map((molecule) => `/molecules/${molecule.slug}`)];
  const learningToolPaths = [...examPrepIndexablePaths, ...mockExamIndexablePaths, "/teacher-kit", "/pricing"];
  const isEnglishOnly = (path: string) => ["/guides", "/articles", "/molecules", "/exam-prep", "/mock-exams", "/teacher-kit", "/pricing"].some((prefix) => path.startsWith(prefix));
  const lastModified = process.env.NEXT_PUBLIC_CONTENT_UPDATED_AT ?? "2026-09-19";
  // Languages that are published but not yet open to search engines are left out entirely.
  return indexedLocales.flatMap((locale) => {
    // The focused guides are intentionally English-only until translated; do not publish
    // duplicate localized URLs that point to the same English editorial content.
    const paths = locale === defaultLocale ? [...core, ...subjectPaths, ...simulationPaths, ...topicGuidePaths, ...articlePaths, ...moleculePaths, ...learningToolPaths] : [...core, ...subjectPaths, ...simulationPaths];
    return paths.map((path) => ({
    url: localizedUrl(locale, path),
    ...(path === "/subjects" ? { images: Object.values(subjectImages).map((image) => `${siteUrl}${image.src}`) } : subjectImageEntries[path] ? { images: [subjectImageEntries[path]] } : {}),
    ...(path === "/articles"
      ? { images: articleSummaries.map((article) => `${siteUrl}${articleImages[article.slug].src}`) }
      : articleSummaries.some((article) => path === `/articles/${article.slug}`)
        ? { images: articleSummaries.filter((article) => path === `/articles/${article.slug}`).flatMap((article) => [`${siteUrl}${articleImages[article.slug].src}`, ...(getArticle(article.slug)?.figures ?? []).map((figure) => `${siteUrl}${figure.src}`)]) }
        : {}),
    lastModified: path === "/" ? getHomeCopy(locale).updatedAt : path.startsWith("/simulations/") && locale === defaultLocale && getSimulationContent(path.slice("/simulations/".length)) ? simulationReviewDate(path.slice("/simulations/".length)) : Object.keys(infoMeta).some(key => path === `/${key}`) ? informationUpdatedAt : path === "/subjects/chemistry" || subjectsCatalog.chemistry.simulations.some(sim => path === `/simulations/${sim.slug}`) ? "2026-09-30" : path === "/guides/environmental-city-builder" ? "2026-09-27" : path === "/subjects" || subjectImageEntries[path] ? subjectImagesUpdatedAt : path === "/articles" ? articlesUpdatedAt : learningToolPaths.includes(path) ? "2026-11-12" : articleSummaries.find((article) => path === `/articles/${article.slug}`)?.updatedAt ?? lastModified,
    changeFrequency: path.includes("simulations") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/molecule-kit" ? .9 : path.includes("subjects/") || path === "/molecules" ? .85 : path.startsWith("/molecules/") ? .7 : isEnglishOnly(path) ? .85 : path === "/donate" ? .5 : .8,
    alternates: isEnglishOnly(path)
      ? { languages: { en: localizedUrl(defaultLocale, path), "x-default": localizedUrl(defaultLocale, path) } }
      : {
          languages: {
            ...Object.fromEntries(indexedLocales.map((alt) => [hreflangCodes[alt], localizedUrl(alt, path)])),
            "x-default": localizedUrl(defaultLocale, path),
          },
        },
  }));
  });
}
