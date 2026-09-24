import { articlePublishedAt, articleSummaries, type ArticleSlug } from "./catalog";
import { studentAi } from "./content/student-ai";
import { comparison } from "./content/comparison";
import { checking } from "./content/checking";
import { teachers } from "./content/teachers";
import { practice } from "./content/practice";

const bodies: Record<ArticleSlug, string> = {
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
  return { ...summary, body, intro, sections, wordCount, readingMinutes: Math.ceil(wordCount / 200), publishedAt: articlePublishedAt, updatedAt: articlePublishedAt };
});

export type Article = typeof articles[number];
export function getArticle(slug: string) { return articles.find((article) => article.slug === slug); }
