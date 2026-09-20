import { siteUrl } from "@/lib/seo/metadata";
import { getTopicGuides } from "@/lib/seo/topic-guides";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

// Machine-readable site guide for LLMs and AI agents (see https://llmstxt.org).
// Regenerated from the same catalog that drives the sitemap, so it can't drift out of sync.
export async function GET() {
  const subjectSections = visibleSubjectSlugs.map((slug) => {
    const subject = subjectsCatalog[slug];
    const links = subject.simulations
      .map((sim) => `- [${sim.title}](${siteUrl}/en/simulations/${sim.slug}): ${sim.outcome}`)
      .join("\n");
    return `## ${subject.headline}\n\n${subject.description}\n\n${links}`;
  });
  const guideLinks = getTopicGuides()
    .map((guide) => `- [${guide.title}](${siteUrl}/en/guides/${guide.slug}): ${guide.answer}`)
    .join("\n");

  const body = `# LearnerKits

> Free, interactive science simulations for grades 6-12. Students predict, experiment, observe, and explain across space, physics, geography, environmental science, and chemistry — no sign-up required.

LearnerKits is an education platform, not a blog or news site. Each simulation page is a self-contained interactive lab with a stated learning outcome, difficulty level, and the concepts it teaches. Content is available in English, Spanish, Simplified Chinese, Arabic, Portuguese, French, Russian, Japanese, and German at /{locale}/... paths (default locale: en).

## Key pages

- [All subjects](${siteUrl}/en/subjects)
- [All simulations](${siteUrl}/en/simulations)
- [About](${siteUrl}/en/about)
- [Science simulation guides](${siteUrl}/en/guides)
- [Molecule Kit](${siteUrl}/en/molecule-kit): Build molecules and explore 3D molecular geometry.
- [Sitemap](${siteUrl}/sitemap.xml)

## Focused topic guides

${guideLinks}

${subjectSections.join("\n\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
