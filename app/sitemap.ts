import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { hreflangCodes, localizedUrl } from "@/lib/seo/metadata";
import { getTopicGuides } from "@/lib/seo/topic-guides";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  // User-specific tools and previews are noindex and should not consume crawl budget.
  const core = ["/", "/simulations", "/missions", "/learn", "/subjects", "/molecule-kit", "/donate", "/about", "/contact", "/privacy", "/cookies", "/terms", "/disclaimer", "/editorial-policy"];
  const subjectPaths = visibleSubjectSlugs.map((slug) => `/subjects/${slug}`);
  const simulationPaths = visibleSubjectSlugs.flatMap((slug) => subjectsCatalog[slug].simulations.map((sim) => `/simulations/${sim.slug}`));
  const topicGuidePaths = ["/guides", ...getTopicGuides().map((guide) => `/guides/${guide.slug}`)];
  const isEnglishOnly = (path: string) => path.startsWith("/guides");
  const lastModified = process.env.NEXT_PUBLIC_CONTENT_UPDATED_AT ?? "2026-09-19";
  return locales.flatMap((locale) => {
    // The focused guides are intentionally English-only until translated; do not publish
    // duplicate localized URLs that point to the same English editorial content.
    const paths = locale === defaultLocale ? [...core, ...subjectPaths, ...simulationPaths, ...topicGuidePaths] : [...core, ...subjectPaths, ...simulationPaths];
    return paths.map((path) => ({
    url: localizedUrl(locale, path),
    lastModified,
    changeFrequency: path.includes("simulations") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.includes("subjects/") ? .85 : isEnglishOnly(path) ? .85 : path === "/donate" ? .5 : .8,
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
