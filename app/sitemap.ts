import type { MetadataRoute } from "next";
import { articleSummaries, articlesUpdatedAt } from "@/lib/articles/catalog";
import { articleImages } from "@/lib/articles/images";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { hreflangCodes, localizedUrl, siteUrl } from "@/lib/seo/metadata";
import { getTopicGuides } from "@/lib/seo/topic-guides";
import { moleculeReferences } from "@/lib/seo/molecules";
import { subjectImages, subjectImagesUpdatedAt } from "@/lib/subjects/images";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  // User-specific tools and previews are noindex and should not consume crawl budget.
  const core = ["/", "/simulations", "/subjects", "/molecule-kit", "/donate", "/about", "/contact", "/privacy", "/cookies", "/terms", "/disclaimer", "/editorial-policy"];
  const subjectPaths = visibleSubjectSlugs.map((slug) => `/subjects/${slug}`);
  const subjectImageEntries = Object.fromEntries(visibleSubjectSlugs.flatMap((slug) => {
    const image = subjectImages[slug];
    return image ? [[`/subjects/${slug}`, `${siteUrl}${image.src}`]] : [];
  }));
  const simulationPaths = visibleSubjectSlugs.flatMap((slug) => subjectsCatalog[slug].simulations.map((sim) => `/simulations/${sim.slug}`));
  const topicGuidePaths = ["/guides", ...getTopicGuides().map((guide) => `/guides/${guide.slug}`)];
  const articlePaths = ["/articles", ...articleSummaries.map((article) => `/articles/${article.slug}`)];
  const moleculePaths = ["/molecules", ...moleculeReferences.map((molecule) => `/molecules/${molecule.slug}`)];
  const isEnglishOnly = (path: string) => path.startsWith("/guides") || path.startsWith("/articles") || path.startsWith("/molecules");
  const lastModified = process.env.NEXT_PUBLIC_CONTENT_UPDATED_AT ?? "2026-09-19";
  return locales.flatMap((locale) => {
    // The focused guides are intentionally English-only until translated; do not publish
    // duplicate localized URLs that point to the same English editorial content.
    const paths = locale === defaultLocale ? [...core, ...subjectPaths, ...simulationPaths, ...topicGuidePaths, ...articlePaths, ...moleculePaths] : [...core, ...subjectPaths, ...simulationPaths];
    return paths.map((path) => ({
    url: localizedUrl(locale, path),
    ...(path === "/subjects" ? { images: Object.values(subjectImageEntries) } : subjectImageEntries[path] ? { images: [subjectImageEntries[path]] } : {}),
    ...(path === "/articles"
      ? { images: articleSummaries.map((article) => `${siteUrl}${articleImages[article.slug].src}`) }
      : articleSummaries.some((article) => path === `/articles/${article.slug}`)
        ? { images: articleSummaries.filter((article) => path === `/articles/${article.slug}`).map((article) => `${siteUrl}${articleImages[article.slug].src}`) }
        : {}),
    lastModified: path === "/subjects" || subjectImageEntries[path] ? subjectImagesUpdatedAt : path === "/articles" ? articlesUpdatedAt : articleSummaries.find((article) => path === `/articles/${article.slug}`)?.updatedAt ?? lastModified,
    changeFrequency: path.includes("simulations") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/molecule-kit" ? .9 : path.includes("subjects/") || path === "/molecules" ? .85 : path.startsWith("/molecules/") ? .7 : isEnglishOnly(path) ? .85 : path === "/donate" ? .5 : .8,
    alternates: isEnglishOnly(path)
      ? { languages: { en: localizedUrl(defaultLocale, path), "x-default": localizedUrl(defaultLocale, path) } }
      : {
          languages: {
            ...Object.fromEntries(locales.map((alt) => [hreflangCodes[alt], localizedUrl(alt, path)])),
            "x-default": localizedUrl(defaultLocale, path),
          },
        },
  }));
  });
}
