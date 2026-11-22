import { examPrepHubsIndexed, topicLessonsIndexed } from "@/lib/exam-prep/catalog";
import { examPrepHubPaths, examPrepTopicPaths } from "@/lib/exam-prep/paths";
import { isMoleculeIndexed, moleculeReferences } from "@/lib/seo/molecules";
import { investigationSlugs } from "@/lib/simulations/practical/investigations";
import { indexedSubjectSlugs, subjectsCatalog, unlistedSimulationSlugs, unlistedSubjectSlugs, visibleSubjectSlugs } from "@/lib/subjects/catalog";

/**
 * English pages that are open to Bing (and the engines built on its index) but kept out of Google
 * with a googlebot noindex (the googleUnlisted option in lib/seo/metadata.ts), while the site recovers
 * from Google's September 2026 spam-update demotion. They are listed in /sitemap-bing.xml, which is
 * not named in robots.txt; `npm run indexnow` submits it with the main sitemap.
 */
export function googleUnlistedPaths(): string[] {
  const unlistedSubjects = visibleSubjectSlugs.filter((slug) => unlistedSubjectSlugs.has(slug));
  return [
    ...unlistedSubjects.flatMap((slug) => [`/subjects/${slug}`, ...subjectsCatalog[slug].simulations.map((sim) => `/simulations/${sim.slug}`)]),
    ...indexedSubjectSlugs.flatMap((slug) => subjectsCatalog[slug].simulations.filter((sim) => unlistedSimulationSlugs.has(sim.slug)).map((sim) => `/simulations/${sim.slug}`)),
    // The lab worksheets (app/[locale]/guides/[lab]/[worksheet]) are always kept out of Google.
    ...investigationSlugs.flatMap((slug) => [`/guides/${slug}/mission`, `/guides/${slug}/how-to-measure`]),
    ...(examPrepHubsIndexed ? [] : examPrepHubPaths),
    ...(topicLessonsIndexed ? [] : examPrepTopicPaths),
    ...moleculeReferences.filter((molecule) => !isMoleculeIndexed(molecule)).map((molecule) => `/molecules/${molecule.slug}`),
  ];
}
