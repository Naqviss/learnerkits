import { articleSummaries } from "@/lib/articles/catalog";
import { siteSlogan, siteUrl } from "@/lib/seo/metadata";
import { getTopicGuides } from "@/lib/seo/topic-guides";
import { moleculeReferences } from "@/lib/seo/molecules";
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

  const articleLinks = articleSummaries.map((article) => `- [${article.title}](${siteUrl}/en/articles/${article.slug}): ${article.description}`).join("\n");

  const moleculeLinks = moleculeReferences
    .map((m) => `- [${m.formula} ${m.name}](${siteUrl}/en/molecules/${m.slug}): ${m.shape} (${m.axe}), bond angle ${m.bondAngle.replace("≈ ", "about ")}${m.hybridization ? `, ${m.hybridization}` : ""}, ${m.polarity === "Ion" ? "polyatomic ion" : m.polarity.toLowerCase()}`)
    .join("\n");

  const body = `# LearnerKits

${siteSlogan}

> Free, interactive science simulations for grades 6-12. Students predict, experiment, observe, and explain across space, physics, geography, environmental science, and chemistry — no sign-up required.

LearnerKits is an education platform with interactive labs, topic guides, and practical science-learning articles. Articles and focused topic guides are currently available in English only. Each simulation page is a self-contained interactive lab with a stated learning outcome, difficulty level, and the concepts it teaches. Content is available in English, Spanish, Simplified Chinese, Arabic, Portuguese, French, Russian, Japanese, and German at /{locale}/... paths (default locale: en).

## Key pages

- [All subjects](${siteUrl}/en/subjects)
- [All simulations](${siteUrl}/en/simulations)
- [Science learning articles](${siteUrl}/en/articles)
- [About](${siteUrl}/en/about)
- [Science simulation guides](${siteUrl}/en/guides)
- [Molecule Kit](${siteUrl}/en/molecule-kit): Free 3D molecule builder and molecular geometry (VSEPR) lab for students, tutors, and teachers.
- [VSEPR shapes chart](${siteUrl}/en/molecules): Molecular geometry, electron geometry, bond angles, and hybridization for every common VSEPR class, with ${moleculeReferences.length} molecules and ions as rotatable 3D models.
- [Sitemap](${siteUrl}/sitemap.xml)

## Science learning articles

${articleLinks}

## Focused topic guides

${guideLinks}

${subjectSections.join("\n\n")}

## Molecule reference (VSEPR, English)

Each page gives the molecular geometry, electron geometry, bond angle, VSEPR (AXE) notation, hybridization, and polarity, with an interactive 3D model.

${moleculeLinks}
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
