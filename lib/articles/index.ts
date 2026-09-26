import { articleSummaries, type ArticleSlug } from "./catalog";
import { studentAi } from "./content/student-ai";
import { comparison } from "./content/comparison";
import { checking } from "./content/checking";
import { teachers } from "./content/teachers";
import { practice } from "./content/practice";
import { getArticleFigure } from "./figures";

import { interactiveLearning } from "./content/interactive-learning";
import { virtualLabs } from "./content/virtual-labs";
import { labComparison } from "./content/lab-comparison";
import { selfStudy } from "./content/self-study";
import { visualLearning } from "./content/visual-learning";
import { scienceNotebook } from "./content/science-notebook";

const bodies: Record<ArticleSlug, string> = {
  "what-are-interactive-learning-simulations": interactiveLearning,
  "how-virtual-science-labs-work": virtualLabs,
  "virtual-labs-vs-traditional-labs": labComparison,
  "educational-simulations-for-self-study": selfStudy,
  "why-visual-learning-helps-science": visualLearning,
  "how-to-create-a-digital-science-notebook": scienceNotebook,
  "how-students-use-ai-to-understand-science": studentAi,
  "ai-tutors-vs-interactive-simulations": comparison,
  "check-ai-generated-science-answers": checking,
  "how-teachers-use-ai-to-prepare-science-lessons": teachers,
  "use-ai-to-create-science-practice-questions": practice,
};

export function articlePlainText(body: string) {
  return body.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/^:::.*$/gm, "").replace(/^[#>\-]+\s*/gm, "").trim();
}

export const articles = articleSummaries.map((summary) => {
  const body = bodies[summary.slug].trim();
  const [intro, ...parts] = body.split(/\n## /);
  const sections = parts.map((part) => {
    const end = part.indexOf("\n");
    const title = part.slice(0, end);
    return { title, id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), body: part.slice(end).trim() };
  });
  const wordCount = articlePlainText(body).split(/\s+/).length;
  const figures = [...new Set([...body.matchAll(/^:::figure (.+)$/gm)].map((match) => match[1].trim()))].map(getArticleFigure).filter((figure) => figure !== undefined);
  return { ...summary, body, intro, sections, wordCount, figures, readingMinutes: Math.ceil(wordCount / 200) };
});

export type Article = typeof articles[number];
export function getArticle(slug: string) { return articles.find((article) => article.slug === slug); }
