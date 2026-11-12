import { selectRows } from "../server/db";
import type { Admin } from "../server/supabase";
import { mockBanks, mockExams, type MockQuestion } from "../mock-exams/catalog";
import { articles as sourceArticles } from "../articles";

export type ManagedArticle = {
  slug: string; title: string; description: string; category: string; audience: string;
  body: string; status: "draft" | "published"; published_at: string | null; updated_at: string;
};

export type ManagedQuestionRow = {
  id: string; exam_id: string; source_id: string | null; topic: string; question: string;
  options: string[]; answer: number; explanation: string; lab: string | null;
  archived: boolean; sort_order: number; created_at: string; updated_at: string;
};

export async function listManagedArticles(admin: Admin) {
  return selectRows<ManagedArticle>(admin, "managed_articles", { order: "updated_at.desc", limit: "500" });
}

export async function getManagedArticle(admin: Admin, slug: string) {
  const rows = await selectRows<ManagedArticle>(admin, "managed_articles", { slug: `eq.${slug}`, limit: "1" });
  return rows[0] ?? null;
}

export async function listManagedQuestions(admin: Admin, examId?: string) {
  const exams = examId ? mockExams.filter((exam) => exam.id === examId) : mockExams;
  const output: (MockQuestion & { examId: string; managed: boolean })[] = [];
  for (const exam of exams) {
    const overrides = await selectRows<ManagedQuestionRow>(admin, "managed_questions", { exam_id: `eq.${exam.id}`, order: "sort_order.asc,created_at.asc", limit: "1000" });
    const bySource = new Map(overrides.filter((row) => row.source_id).map((row) => [row.source_id!, row]));
    for (const base of mockBanks[exam.bank] ?? []) {
      const row = bySource.get(base.id);
      if (row?.archived) continue;
      output.push(row ? { id: base.id, subject: base.subject, topic: row.topic, q: row.question, options: row.options, answer: row.answer, why: row.explanation, lab: row.lab, examId: exam.id, managed: true } : { ...base, examId: exam.id, managed: false });
    }
    for (const row of overrides.filter((item) => !item.source_id && !item.archived)) {
      output.push({ id: row.id, subject: exam.subject === "physics" ? "Physics" : "Chemistry", topic: row.topic, q: row.question, options: row.options, answer: row.answer, why: row.explanation, lab: row.lab, examId: exam.id, managed: true });
    }
  }
  return output;
}

export async function publicContent(request: Request, admin: Admin | null): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  const raw = await request.text();
  if (raw.length > 2_000) return Response.json({ error: "Too large." }, { status: 413 });
  let body: { type?: unknown; slug?: unknown; examId?: unknown };
  try { body = JSON.parse(raw); } catch { body = {}; }
  const type = typeof body.type === "string" ? body.type : "";
  if (!admin) return Response.json({ error: "Content service is not configured." }, { status: 503 });
  try {
    if (type === "articles") {
      const all = await selectRows<Pick<ManagedArticle, "slug" | "title" | "description" | "category" | "audience" | "status" | "published_at" | "updated_at">>(admin, "managed_articles", { select: "slug,title,description,category,audience,status,published_at,updated_at", order: "updated_at.desc", limit: "500" });
      const articles = all.filter((article) => article.status === "published");
      const sourceSlugs = new Set<string>(sourceArticles.map((article) => article.slug));
      const hiddenSlugs = all.filter((article) => article.status !== "published" && sourceSlugs.has(article.slug)).map((article) => article.slug);
      return Response.json({ articles, hiddenSlugs }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
    }
    if (type === "article") {
      const slug = typeof body.slug === "string" ? body.slug : "";
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return Response.json({ error: "Invalid article slug." }, { status: 400 });
      return Response.json({ article: await getManagedArticle(admin, slug) }, { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } });
    }
    if (type === "questions") {
      const examId = typeof body.examId === "string" ? body.examId : "";
      if (!mockExams.some((exam) => exam.id === examId)) return Response.json({ error: "Unknown exam." }, { status: 400 });
      return Response.json({ questions: (await listManagedQuestions(admin, examId)).map(({ examId: _examId, managed: _managed, ...question }) => question) }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
    }
    return Response.json({ error: "Unknown content type." }, { status: 400 });
  } catch (error) {
    console.error("Public content request failed", type, error);
    return Response.json({ error: "Content could not be loaded." }, { status: 503 });
  }
}
