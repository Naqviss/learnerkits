import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { hreflangCodes, localizedUrl } from "@/lib/seo/metadata";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["/", "/simulations", "/missions", "/learn", "/subjects", "/progress", "/teacher-preview", "/settings", "/donate", "/about", "/contact", "/privacy", "/cookies", "/terms", "/disclaimer", "/editorial-policy"];
  const subjectPaths = visibleSubjectSlugs.map((slug) => `/subjects/${slug}`);
  const simulationPaths = visibleSubjectSlugs.flatMap((slug) => subjectsCatalog[slug].simulations.map((sim) => `/simulations/${sim.slug}`));
  const paths = [...core, ...subjectPaths, ...simulationPaths];
  return locales.flatMap((locale) => paths.map((path) => ({
    url: localizedUrl(locale, path),
    lastModified: new Date(),
    changeFrequency: path.includes("simulations") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.includes("subjects/") ? .85 : path === "/donate" ? .5 : .8,
    alternates: {
      languages: {
        ...Object.fromEntries(locales.map((alt) => [hreflangCodes[alt], localizedUrl(alt, path)])),
        "x-default": localizedUrl(defaultLocale, path),
      },
    },
  }))) as MetadataRoute.Sitemap;
}
