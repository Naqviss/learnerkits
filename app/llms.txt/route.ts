import { articleSummaries } from "@/lib/articles/catalog";
import { boards, isBoardIndexable } from "@/lib/exam-prep/catalog";
import { getBoardSeo } from "@/lib/exam-prep/seo";
import { locales, localeNames } from "@/lib/i18n/config";
import { siteSlogan, siteUrl } from "@/lib/seo/metadata";
import { getTopicGuides } from "@/lib/seo/topic-guides";
import { moleculeReferences } from "@/lib/seo/molecules";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

export const dynamic = "force-static";

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

  const examBoardLinks = boards
    .filter((board) => isBoardIndexable(board.id))
    .map((board) => `- [${getBoardSeo(board.id)!.title}](${siteUrl}/en/exam-prep/${board.id}): ${getBoardSeo(board.id)!.description}`)
    .join("\n");

  const body = `# LearnerKits

${siteSlogan}

> Free, interactive science simulations for grades 6-12. Students predict, experiment, observe, and explain across space, physics, geography, environmental science, and chemistry — no sign-up required.

LearnerKits is an education platform with interactive labs, topic guides, and practical science-learning articles. Articles and focused topic guides are currently available in English only. Each simulation page is a self-contained interactive lab with a stated learning outcome, difficulty level, and the concepts it teaches. Currently published languages: ${locales.map((locale) => localeNames[locale]).join(", ")}. The English homepage is at / and English learning pages are at /en/... paths.

## Key pages

- [All subjects](${siteUrl}/en/subjects)
- [All simulations](${siteUrl}/en/simulations)
- [News and science learning articles](${siteUrl}/en/articles)
- [Exam Prep](${siteUrl}/en/exam-prep): Syllabus topic lessons, interactive models, topic checks, optional AI tutor support and on-device activity progress for Cambridge, AQA, Pearson Edexcel and IB science courses. Independent of the exam boards; practice material is original.
- [Exam prep for any board](${siteUrl}/en/exam-prep/any-board): A board-neutral route for students whose curriculum is not listed. Students match an official syllabus topic to any published subject library, with lessons, interactive activities, supported checks and optional AI help.
- [Mock Exams](${siteUrl}/en/mock-exams): Short timed mock exams with original questions, instant marking and worked explanations.
- [Teacher Kit](${siteUrl}/en/teacher-kit): Lesson planner, question papers, class assignments and marking for science teachers.
- [About](${siteUrl}/en/about)
- [Science simulation guides](${siteUrl}/en/guides)
- [Environmental city builder game guide](${siteUrl}/en/guides/environmental-city-builder): Illustrated controls, drag-and-drop instructions, baseline comparisons and investigations for all ten environmental labs.
- [Molecule Kit](${siteUrl}/en/molecule-kit): Free 3D molecule builder and molecular geometry (VSEPR) lab for students, tutors, and teachers.
- [VSEPR shapes chart](${siteUrl}/en/molecules): Molecular geometry, electron geometry, bond angles, and hybridization for every common VSEPR class, with ${moleculeReferences.length} molecules and ions as rotatable 3D models.
- [Sitemap](${siteUrl}/sitemap.xml)

## Exam preparation by board

LearnerKits exam preparation is organised by board, qualification, subject and syllabus topic. Students can learn in a supported language, use interactive models, complete available checks, ask the optional topic-aware AI tutor for help and keep supported activity progress in their browser. Published syllabus mappings are separated from labelled illustrative previews. LearnerKits is independent of every exam board and all practice material is original.

${examBoardLinks}

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
