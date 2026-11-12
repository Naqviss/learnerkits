// POST /api/admin — the LearnerKits admin panel. Sign-in uses one username/password pair held in
// server-only secrets (ADMIN_USERNAME, ADMIN_PASSWORD); the browser then sends a signed, expiring
// token. Nothing here is reachable with a normal user session.
import { loadTeacherState } from "../classroom/api";
import { isPlanId } from "../classroom/plans";
import type { ClassMember, ClassRow, MockAttempt, TeacherProfile } from "../classroom/types";
import { countRows, DbError, deleteRows, insertRow, isUuid, selectRows, updateRows, upsertRow } from "../server/db";
import { isSameOrigin, json, readJsonBody, supabaseAdmin, type Admin, type SupabaseEnv } from "../server/supabase";
import { resolvePaddle, type PaddleEnv } from "../billing/paddle-config";
import { articles as sourceArticles } from "../articles";
import { mockBanks, mockExams } from "../mock-exams/catalog";
import { listManagedArticles, listManagedQuestions, type ManagedArticle, type ManagedQuestionRow } from "./public-content";

export type AdminEnv = SupabaseEnv & PaddleEnv & { ADMIN_USERNAME?: string; ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string };
type Body = Record<string, unknown>;
export type AdminSubscription = { provider_subscription_id: string; user_id: string; status: string; environment?: string; renews_at: string | null; ends_at: string | null; created_at: string };
export type AdminOverview = {
  counts: Record<"teachers" | "classes" | "students" | "items" | "assignments" | "submissions" | "mockAttempts" | "subscriptions", number>;
  teachers: TeacherProfile[]; classes: ClassRow[]; members: ClassMember[]; mockAttempts: MockAttempt[]; subscriptions: AdminSubscription[];
};

const sessionSeconds = 8 * 60 * 60;
const encoder = new TextEncoder();
const hex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

/** Compares two strings without leaking where they differ (both are hashed first). */
async function safeEqual(a: string, b: string) {
  const [left, right] = await Promise.all([a, b].map(async (value) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)))));
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left[index] ^ right[index];
  return difference === 0;
}

async function sign(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

export async function createAdminToken(secret: string, now = Date.now()) {
  const expires = Math.floor(now / 1000) + sessionSeconds;
  return `${expires}.${await sign(secret, `admin:${expires}`)}`;
}

export async function verifyAdminToken(secret: string, token: string | undefined, now = Date.now()) {
  const [expires, signature] = (token ?? "").split(".");
  if (!/^\d+$/.test(expires ?? "") || !signature || Number(expires) * 1000 < now) return false;
  return safeEqual(signature, await sign(secret, `admin:${expires}`));
}

/** Admin sign-in only works when all three secrets are set and long enough to resist guessing. */
function credentials(env: AdminEnv) {
  const username = env.ADMIN_USERNAME?.trim(), password = env.ADMIN_PASSWORD?.trim(), secret = env.ADMIN_SESSION_SECRET?.trim();
  return username && password && secret && password.length >= 16 && secret.length >= 32 ? { username, password, secret } : null;
}

const id = (value: unknown) => { if (!isUuid(value)) throw new DbError(400, "", "Missing id."); return value; };
const optional = async <T>(read: Promise<T>, fallback: T) => read.catch(() => fallback);

function field(value: unknown, label: string, max: number, min = 1) {
  if (typeof value !== "string" || value.trim().length < min || value.length > max) throw new DbError(400, "", `Enter ${label} (${min}–${max} characters).`);
  return value.trim();
}

async function revenueReport(env: AdminEnv) {
  const paddle = resolvePaddle(env);
  if (!paddle.apiKey) throw new DbError(503, "", `Revenue is unavailable: ${paddle.problems.join("; ") || "Paddle is not configured."}`);
  const since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({ status: "completed", "billed_at[GTE]": since.toISOString(), "order_by": "billed_at[DESC]", per_page: "30" });
  let next: URL | null = new URL(`/transactions?${params}`, paddle.apiBase);
  const transactions: { id: string; billedAt: string; earnings: number | null; total: number | null; currency: string }[] = [];
  let pageCount = 0;
  let truncated = false;
  while (next && pageCount < 80) {
    if (next.origin !== paddle.apiBase) throw new DbError(502, "", "Paddle returned an invalid pagination URL.");
    const response = await fetch(next, { headers: { Authorization: `Bearer ${paddle.apiKey}`, "Paddle-Version": "1" }, signal: AbortSignal.timeout(12_000) });
    if (!response.ok) throw new DbError(502, "", `Paddle revenue request failed (${response.status}).`);
    const page = await response.json() as { data?: { id?: string; status?: string; billed_at?: string; details?: { payout_totals?: { earnings?: string | null; total?: string; currency_code?: string }; totals?: { earnings?: string | null; total?: string; currency_code?: string } } }[]; meta?: { pagination?: { next?: string; has_more?: boolean } } };
    for (const row of page.data ?? []) {
      const totals = row.details?.payout_totals ?? row.details?.totals;
      const currency = totals?.currency_code;
      if (!row.id || !row.billed_at || !currency) continue;
      transactions.push({ id: row.id, billedAt: row.billed_at, earnings: totals?.earnings == null ? null : Number(totals.earnings), total: totals?.total == null ? null : Number(totals.total), currency });
    }
    pageCount++;
    const pageNext = page.meta?.pagination?.has_more ? page.meta.pagination.next : null;
    next = pageNext ? new URL(pageNext) : null;
  }
  truncated = Boolean(next);
  const totals: Record<string, { transactions: number; earnings: number; gross: number }> = {};
  const months: Record<string, Record<string, number>> = {};
  for (const transaction of transactions) {
    const amount = totals[transaction.currency] ??= { transactions: 0, earnings: 0, gross: 0 };
    amount.transactions++;
    amount.earnings += transaction.earnings ?? 0;
    amount.gross += transaction.total ?? 0;
    const month = transaction.billedAt.slice(0, 7);
    months[month] ??= {};
    months[month][transaction.currency] = (months[month][transaction.currency] ?? 0) + (transaction.earnings ?? 0);
  }
  return { mode: paddle.mode, since: since.toISOString(), generatedAt: new Date().toISOString(), totals, months, transactions: transactions.slice(0, 30), truncated };
}

async function contentOverview(admin: Admin) {
  const [managedArticles, managedQuestionRows] = await Promise.all([
    listManagedArticles(admin),
    selectRows<ManagedQuestionRow>(admin, "managed_questions", { order: "exam_id.asc,sort_order.asc,created_at.asc", limit: "3000" }),
  ]);
  const articleOverrides = new Map(managedArticles.map((article) => [article.slug, article]));
  const articles: (ManagedArticle & { builtIn: boolean; managed: boolean })[] = sourceArticles.map((article) => {
    const override = articleOverrides.get(article.slug);
    return override ? { ...override, builtIn: true, managed: true } : { slug: article.slug, title: article.title, description: article.description, category: article.category, audience: article.audience, body: article.body, status: "published", published_at: article.publishedAt, updated_at: article.updatedAt, builtIn: true, managed: false };
  });
  for (const article of managedArticles) if (!sourceArticles.some((source) => source.slug === article.slug)) articles.push({ ...article, builtIn: false, managed: true });
  const questions = mockExams.flatMap((exam) => {
    const overrides = managedQuestionRows.filter((row) => row.exam_id === exam.id);
    const bySource = new Map(overrides.filter((row) => row.source_id).map((row) => [row.source_id!, row]));
    const base = (mockBanks[exam.bank] ?? []).map((question) => {
      const override = bySource.get(question.id);
      return { ...question, examId: exam.id, managed: Boolean(override), archived: override?.archived ?? false, ...(override ? { topic: override.topic, q: override.question, options: override.options, answer: override.answer, why: override.explanation, lab: override.lab } : {}) };
    });
    const custom = overrides.filter((row) => !row.source_id).map((row) => ({ id: row.id, subject: exam.subject === "physics" ? "Physics" : "Chemistry", examId: exam.id, topic: row.topic, q: row.question, options: row.options, answer: row.answer, why: row.explanation, lab: row.lab, managed: true, archived: row.archived }));
    return [...base, ...custom];
  });
  return { articles, questions, questionOverrides: managedQuestionRows };
}

async function overview(admin: Admin): Promise<AdminOverview> {
  const [teachers, classes, members, mockAttempts, subscriptions, items, assignments, submissions, attempts, subscriptionCount] = await Promise.all([
    selectRows<TeacherProfile>(admin, "teacher_profiles", { order: "created_at.desc", limit: "1000" }),
    selectRows<ClassRow>(admin, "classes", { order: "created_at.desc", limit: "2000" }),
    selectRows<ClassMember>(admin, "class_members", { order: "joined_at.desc", limit: "5000" }),
    selectRows<MockAttempt>(admin, "mock_attempts", { order: "created_at.desc", limit: "200" }),
    optional(selectRows<AdminSubscription>(admin, "subscriptions", { order: "created_at.desc", limit: "200" }), []),
    countRows(admin, "teaching_items"), countRows(admin, "assignments"), countRows(admin, "submissions"), countRows(admin, "mock_attempts"),
    optional(countRows(admin, "subscriptions"), 0),
  ]);
  return {
    counts: { teachers: teachers.length, classes: classes.length, students: new Set(members.map((member) => member.student_id)).size, items, assignments, submissions, mockAttempts: attempts, subscriptions: subscriptionCount },
    teachers, classes, members, mockAttempts, subscriptions,
  };
}

async function run(action: string, body: Body, admin: Admin, env: AdminEnv): Promise<Record<string, unknown>> {
  switch (action) {
    case "overview": return { ...await overview(admin) };
    case "revenue": return await revenueReport(env);
    case "content": return await contentOverview(admin);
    case "teacher": {
      const state = await loadTeacherState(admin, id(body.userId));
      return state ? { ...state } : Promise.reject(new DbError(404, "", "Teacher not found."));
    }
    case "setPlan": {
      if (!isPlanId(body.plan)) throw new DbError(400, "", "Unknown plan.");
      return { teachers: await updateRows<TeacherProfile>(admin, "teacher_profiles", { user_id: `eq.${id(body.userId)}` }, { plan: body.plan }) };
    }
    case "setSuspended":
      return { teachers: await updateRows<TeacherProfile>(admin, "teacher_profiles", { user_id: `eq.${id(body.userId)}` }, { suspended: body.suspended === true }) };
    // Removing a teacher profile also removes their classes, resources, assignments and submissions.
    case "deleteTeacher": return { removed: await deleteRows(admin, "teacher_profiles", { user_id: `eq.${id(body.userId)}` }) };
    case "deleteClass": return { removed: await deleteRows(admin, "classes", { id: `eq.${id(body.id)}` }) };
    case "removeMember": return { removed: await deleteRows(admin, "class_members", { class_id: `eq.${id(body.classId)}`, student_id: `eq.${id(body.studentId)}` }) };
    case "deleteItem": return { removed: await deleteRows(admin, "teaching_items", { id: `eq.${id(body.id)}` }) };
    case "deleteAssignment": return { removed: await deleteRows(admin, "assignments", { id: `eq.${id(body.id)}` }) };
    case "deleteSubmission": return { removed: await deleteRows(admin, "submissions", { id: `eq.${id(body.id)}` }) };
    case "saveArticle": {
      const slug = field(body.slug, "a URL slug", 100).toLowerCase();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new DbError(400, "", "Use lowercase letters and numbers separated by hyphens for the URL slug.");
      const title = field(body.title, "a title", 180);
      const description = field(body.description, "a summary", 360);
      const category = field(body.category, "a category", 80);
      const audience = field(body.audience, "an audience", 80);
      const articleBody = field(body.body, "article content", 60_000);
      const status = body.status === "published" ? "published" : body.status === "draft" ? "draft" : null;
      if (!status) throw new DbError(400, "", "Choose draft or published.");
      const existing = (await selectRows<ManagedArticle>(admin, "managed_articles", { slug: `eq.${slug}`, limit: "1" }))[0];
      const publishedAt = status === "published" ? existing?.published_at ?? new Date().toISOString() : existing?.published_at ?? null;
      return { article: await upsertRow<ManagedArticle>(admin, "managed_articles", "slug", { slug, title, description, category, audience, body: articleBody, status, published_at: publishedAt, updated_at: new Date().toISOString() }) };
    }
    case "deleteArticle": {
      const slug = field(body.slug, "an article slug", 100);
      return { removed: await deleteRows(admin, "managed_articles", { slug: `eq.${slug}` }) };
    }
    case "saveQuestion": {
      const examId = field(body.examId, "an exam", 32);
      const exam = mockExams.find((item) => item.id === examId);
      if (!exam) throw new DbError(400, "", "Choose an available mock exam.");
      const topic = field(body.topic, "a topic", 100);
      const question = field(body.question, "question text", 1200);
      const explanation = field(body.explanation, "an explanation", 2400);
      const options = Array.isArray(body.options) ? body.options.map((option) => field(option, "each answer option", 300)) : [];
      if (options.length < 2 || options.length > 6) throw new DbError(400, "", "Add between two and six answer options.");
      if (!Number.isInteger(body.answer) || Number(body.answer) < 0 || Number(body.answer) >= options.length) throw new DbError(400, "", "Choose which option is correct.");
      const lab = body.lab == null || body.lab === "" ? null : field(body.lab, "a lab slug", 100);
      const questionId = typeof body.questionId === "string" ? body.questionId : "";
      const staticQuestion = (mockBanks[exam.bank] ?? []).find((item) => item.id === questionId);
      const row = { exam_id: examId, source_id: staticQuestion?.id ?? null, topic, question, options, answer: Number(body.answer), explanation, lab, archived: false, sort_order: Number.isInteger(body.sortOrder) ? Number(body.sortOrder) : 0, updated_at: new Date().toISOString() };
      if (staticQuestion) return { question: await upsertRow<ManagedQuestionRow>(admin, "managed_questions", "source_id", row) };
      if (questionId && isUuid(questionId)) return { question: await updateRows<ManagedQuestionRow>(admin, "managed_questions", { id: `eq.${questionId}`, exam_id: `eq.${examId}` }, row) };
      return { question: await insertRow<ManagedQuestionRow>(admin, "managed_questions", row) };
    }
    case "deleteQuestion": {
      const questionId = typeof body.questionId === "string" ? body.questionId : "";
      const examId = field(body.examId, "an exam", 32);
      const exam = mockExams.find((item) => item.id === examId);
      if (!exam) throw new DbError(400, "", "Choose an available mock exam.");
      const staticQuestion = (mockBanks[exam.bank] ?? []).find((item) => item.id === questionId);
      if (staticQuestion) {
        const row = (await selectRows<ManagedQuestionRow>(admin, "managed_questions", { source_id: `eq.${staticQuestion.id}`, limit: "1" }))[0];
        const base = row ?? { exam_id: exam.id, source_id: staticQuestion.id, topic: staticQuestion.topic, question: staticQuestion.q, options: staticQuestion.options, answer: staticQuestion.answer, explanation: staticQuestion.why, lab: staticQuestion.lab, sort_order: 0 };
        return { question: await upsertRow<ManagedQuestionRow>(admin, "managed_questions", "source_id", { ...base, archived: true, updated_at: new Date().toISOString() }) };
      }
      return { removed: await deleteRows(admin, "managed_questions", { id: `eq.${id(questionId)}`, exam_id: `eq.${examId}` }) };
    }
    case "restoreQuestion": {
      const sourceId = field(body.questionId, "a source question id", 100);
      return { removed: await deleteRows(admin, "managed_questions", { source_id: `eq.${sourceId}` }) };
    }
    default: throw new DbError(400, "", "Unknown action.");
  }
}

export async function handleAdmin(request: Request, env: AdminEnv): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (!isSameOrigin(request)) return json(403, { error: "Forbidden." });
  const configured = credentials(env);
  if (!configured) return json(503, { error: "The admin panel is not configured on this server." });
  const body = await readJsonBody(request, 100_000);
  if (!body || typeof body.action !== "string") return json(400, { error: "Invalid request." });

  if (body.action === "login") {
    const username = typeof body.username === "string" ? body.username : "", password = typeof body.password === "string" ? body.password : "";
    const matches = (await Promise.all([safeEqual(username, configured.username), safeEqual(password, configured.password)])).every(Boolean);
    if (!matches) {
      // Slow down guessing; the password itself is long and random.
      await new Promise((resolve) => setTimeout(resolve, 700));
      return json(401, { error: "Incorrect username or password." });
    }
    return json(200, { token: await createAdminToken(configured.secret), expiresIn: sessionSeconds });
  }

  const token = request.headers.get("authorization")?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!await verifyAdminToken(configured.secret, token)) return json(401, { error: "Your admin session has ended. Please sign in again." });
  const admin = supabaseAdmin(env);
  if (!admin) return json(503, { error: "Supabase is not configured on this server." });
  try {
    return json(200, await run(body.action, body, admin, env));
  } catch (error) {
    if (error instanceof DbError && error.status >= 400 && error.status < 500 && !error.code) return json(error.status, { error: error.message });
    if (error instanceof DbError && error.status === 503 && !error.code) return json(503, { error: error.message });
    if (error instanceof DbError && (error.code === "42P01" || error.code === "PGRST205")) return json(503, { error: "Required admin tables are missing. Apply the classroom migration and supabase/migrations/202611120002_admin_content.sql." });
    console.error("Admin request failed", body.action, error);
    return json(500, { error: "The request failed. Check the server logs." });
  }
}
