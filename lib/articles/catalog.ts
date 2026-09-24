// Keep this lightweight index separate from article bodies so navigation search
// never ships the full editorial collection to the browser.
export const articleSummaries = [
  { slug: "how-students-use-ai-to-understand-science", title: "How Can Students Use AI to Understand Difficult Science Concepts?", description: "A practical student workflow for using AI explanations, checking science claims, and testing predictions with free interactive simulations.", audience: "Students", category: "Study skills", simulationSlugs: ["newtons-laws-force-lab", "gas-law-lab"], relatedSlugs: ["ai-tutors-vs-interactive-simulations", "check-ai-generated-science-answers"] },
  { slug: "ai-tutors-vs-interactive-simulations", title: "AI Tutors vs. Interactive Simulations: How They Differ", description: "Compare AI tutors and science simulations through a worked gas-law investigation, model limitations, and a classroom decision guide.", audience: "Students and teachers", category: "Learning tools", simulationSlugs: ["gas-law-lab", "pendulum-physics"], relatedSlugs: ["how-students-use-ai-to-understand-science", "how-teachers-use-ai-to-prepare-science-lessons"] },
  { slug: "check-ai-generated-science-answers", title: "How to Check Whether an AI-Generated Science Answer Is Correct", description: "Check AI science answers using sources, units, assumptions, independent calculations, and simulation evidence, with worked examples.", audience: "Students", category: "Scientific thinking", simulationSlugs: ["newtons-laws-force-lab", "gas-law-lab", "circuit-builder"], relatedSlugs: ["how-students-use-ai-to-understand-science", "use-ai-to-create-science-practice-questions"] },
  { slug: "how-teachers-use-ai-to-prepare-science-lessons", title: "How Teachers Can Use AI to Prepare Science Lessons", description: "Build an AI-assisted science lesson with a clear learning objective, a timed force-lab activity, differentiation, and an exit assessment.", audience: "Teachers", category: "Teaching practice", simulationSlugs: ["newtons-laws-force-lab", "pendulum-physics"], relatedSlugs: ["use-ai-to-create-science-practice-questions", "ai-tutors-vs-interactive-simulations"] },
  { slug: "use-ai-to-create-science-practice-questions", title: "How to Use AI to Create Science Practice Questions", description: "Create and verify useful AI science questions with a question blueprint, worked force examples, answer keys, and a revision checklist.", audience: "Students and teachers", category: "Practice and assessment", simulationSlugs: ["newtons-laws-force-lab", "gas-law-lab"], relatedSlugs: ["check-ai-generated-science-answers", "how-teachers-use-ai-to-prepare-science-lessons"] },
] as const;

export type ArticleSlug = typeof articleSummaries[number]["slug"];
export type ArticleSummary = typeof articleSummaries[number];
export const articlePublishedAt = "2026-09-25";

export function getArticleSummary(slug: string) {
  return articleSummaries.find((article) => article.slug === slug);
}

export function getArticlesForSimulation(slug: string) {
  return articleSummaries.filter((article) => (article.simulationSlugs as readonly string[]).includes(slug));
}
