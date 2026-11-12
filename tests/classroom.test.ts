import { afterEach, describe, expect, it, vi } from "vitest";
import { createAdminToken, handleAdmin, verifyAdminToken } from "@/lib/admin/api";
import { cleanItemData, handleClassroom, markPaper, newJoinCode, paperForStudent } from "@/lib/classroom/api";
import { plans } from "@/lib/classroom/plans";
import { csv, lessonOutline, topicStats, wordDocument } from "@/lib/classroom/templates";
import type { PaperData } from "@/lib/classroom/types";
import { canonicalTopicCourse, getSyllabus } from "@/lib/exam-prep/catalog";
import { examPrepIndexablePaths } from "@/lib/exam-prep/paths";

const paper: PaperData = { subject: "Physics", minutes: 15, questions: [
  { id: "a", topic: "Dynamics", q: "F = ma, a?", options: ["2", "4"], answer: 1, why: "20/5" },
  { id: "b", topic: "Waves", q: "v = fλ, v?", options: ["10", "25"], answer: 0, why: "5×2" },
] };
const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const env = { SUPABASE_URL: "https://db.example.co", SUPABASE_SECRET_KEY: "sb_secret_test" };
const adminEnv = { ...env, ADMIN_USERNAME: "admin-test", ADMIN_PASSWORD: "a-long-random-password-123", ADMIN_SESSION_SECRET: "s".repeat(48) };

/** An in-memory stand-in for Supabase Auth and PostgREST (eq./in. filters, insert, update, delete, count). */
function fakeSupabase(tables: Record<string, Record<string, unknown>[]>, users: Record<string, { id: string; email: string }>) {
  let next = 100;
  return vi.fn(async (input: string | URL | Request, init: RequestInit = {}) => {
    const url = new URL(String(input)), method = init.method ?? "GET";
    if (url.pathname === "/auth/v1/user") {
      const user = users[String(new Headers(init.headers).get("authorization")).replace("Bearer ", "")];
      return user ? Response.json(user) : new Response("{}", { status: 401 });
    }
    const table = url.pathname.replace("/rest/v1/", "");
    const rows = tables[table] ??= [];
    const matches = (row: Record<string, unknown>) => [...url.searchParams].every(([key, value]) => {
      if (["select", "order", "limit"].includes(key)) return true;
      if (value.startsWith("eq.")) return String(row[key]) === value.slice(3);
      if (value.startsWith("in.")) return value.slice(4, -1).split(",").includes(String(row[key]));
      return true;
    });
    if (method === "POST") {
      const row = { id: uuid(next++), created_at: "2026-11-12T00:00:00Z", joined_at: "2026-11-12T00:00:00Z", submitted_at: "2026-11-12T00:00:00Z", ...JSON.parse(String(init.body)) };
      if (table === "submissions" && rows.some((existing) => existing.assignment_id === row.assignment_id && existing.student_id === row.student_id)) return Response.json({ code: "23505" }, { status: 409 });
      rows.push(row);
      return Response.json([row], { status: 201 });
    }
    const found = rows.filter(matches);
    if (method === "HEAD") return new Response(null, { headers: { "content-range": `0-0/${found.length}` } });
    if (method === "PATCH") { for (const row of found) Object.assign(row, JSON.parse(String(init.body))); return Response.json(found); }
    if (method === "DELETE") { tables[table] = rows.filter((row) => !found.includes(row)); return Response.json(found); }
    return Response.json(found);
  });
}

const post = (path: string, body: unknown, token?: string) => new Request(`https://www.learnerkits.com${path}`, { method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
const teacher = uuid(1), student = uuid(2), other = uuid(3), group = uuid(10), item = uuid(20), assignment = uuid(30);
const seed = () => ({
  teacher_profiles: [{ user_id: teacher, display_name: "Ms Morgan", email: "t@example.com", plan: "basic", suspended: false }],
  classes: [{ id: group, teacher_id: teacher, name: "AS Physics", board: "", level: "", subject: "", join_code: "ABC2345" }],
  class_members: [{ class_id: group, student_id: student, student_name: "Sam", student_email: "s@example.com" }],
  teaching_items: [{ id: item, teacher_id: teacher, kind: "paper", title: "Quick paper", data: paper }],
  assignments: [{ id: assignment, teacher_id: teacher, class_id: group, item_id: item, kind: "paper", title: "Quick paper", instructions: "", due_date: null }],
  submissions: [] as Record<string, unknown>[],
});
const users = { teacher: { id: teacher, email: "t@example.com" }, student: { id: student, email: "s@example.com" }, other: { id: other, email: "o@example.com" } };

afterEach(() => vi.unstubAllGlobals());

describe("teacher content validation", () => {
  it("accepts complete papers and rejects incomplete or duplicate questions", () => {
    expect(cleanItemData("paper", paper)).toMatchObject({ minutes: 15 });
    expect(cleanItemData("paper", { ...paper, questions: [{ q: "No options" }] })).toBeNull();
    expect(cleanItemData("paper", { ...paper, questions: [paper.questions[0], paper.questions[0]] })).toBeNull();
    expect(cleanItemData("paper", { ...paper, questions: [{ ...paper.questions[0], answer: 5 }] })).toBeNull();
  });

  it("keeps only https video links and known-looking lab slugs in lessons", () => {
    const lesson = cleanItemData("lesson", { topic: "Forces", outline: "5 min — Starter", duration: 999, videos: ["https://example.com/a", "javascript:alert(1)", "http://example.com"], labSlugs: ["newtons-laws-force-lab", "../etc"] });
    expect(lesson).toMatchObject({ duration: 240, videos: ["https://example.com/a"], labSlugs: ["newtons-laws-force-lab"] });
    expect(cleanItemData("lesson", { topic: "Forces" })).toBeNull();
  });

  it("marks papers only when every question has a valid answer", () => {
    expect(markPaper(paper, { a: 1, b: 1 })).toEqual({ answers: { a: 1, b: 1 }, score: 1 });
    expect(markPaper(paper, { a: 1 })).toBeNull();
    expect(markPaper(paper, { a: 1, b: 7 })).toBeNull();
  });

  it("hides the answer key from students until they submit", () => {
    expect(JSON.stringify(paperForStudent(paper, false))).not.toMatch(/"answer"|"why"/);
    expect(paperForStudent(paper, true).questions[0]).toMatchObject({ answer: 1, why: "20/5" });
  });

  it("creates unambiguous join codes", () => {
    expect(newJoinCode()).toMatch(/^[A-HJ-NP-Z2-9]{7}$/);
  });
});

describe("classroom API", () => {
  it("rejects signed-out and cross-site requests", async () => {
    vi.stubGlobal("fetch", fakeSupabase(seed(), users));
    expect((await handleClassroom(post("/api/classroom", { action: "me" }), env)).status).toBe(401);
    const crossSite = post("/api/classroom", { action: "me" }, "teacher");
    crossSite.headers.set("origin", "https://evil.example");
    expect((await handleClassroom(crossSite, env)).status).toBe(403);
  });

  it("gives a student the paper without answers, marks it on the server, and allows one submission", async () => {
    const tables = seed();
    vi.stubGlobal("fetch", fakeSupabase(tables, users));
    const before = await (await handleClassroom(post("/api/classroom", { action: "studentState" }, "student"), env)).json();
    expect(before.assignments).toHaveLength(1);
    expect(JSON.stringify(before.assignments[0].paper)).not.toMatch(/"answer"|"why"/);

    const submitted = await handleClassroom(post("/api/classroom", { action: "submitAssignment", assignmentId: assignment, answers: { a: 1, b: 1 } }, "student"), env);
    expect(submitted.status).toBe(200);
    expect((await submitted.json()).submission).toMatchObject({ score: 1, total: 2, status: "graded", student_name: "Sam" });
    expect((await handleClassroom(post("/api/classroom", { action: "submitAssignment", assignmentId: assignment, answers: { a: 1, b: 0 } }, "student"), env)).status).toBe(409);

    const after = await (await handleClassroom(post("/api/classroom", { action: "studentState" }, "student"), env)).json();
    expect(after.assignments[0].paper.questions[0].answer).toBe(1);
  });

  it("keeps other users out of a class's assignments and a teacher's resources", async () => {
    const tables = seed();
    vi.stubGlobal("fetch", fakeSupabase(tables, users));
    expect((await handleClassroom(post("/api/classroom", { action: "submitAssignment", assignmentId: assignment, answers: { a: 1, b: 1 } }, "other"), env)).status).toBe(404);
    expect((await handleClassroom(post("/api/classroom", { action: "teacherState" }, "other"), env)).status).toBe(403);
    expect((await handleClassroom(post("/api/classroom", { action: "deleteItem", id: item }, "other"), env)).status).toBe(403);
    expect(tables.teaching_items).toHaveLength(1);
    expect(tables.submissions).toHaveLength(0);
  });

  it("enforces the plan's seat limit and a paused teacher when students join", async () => {
    const tables = seed();
    tables.class_members = Array.from({ length: plans.basic.seats }, (_, index) => ({ class_id: group, student_id: uuid(500 + index), student_name: `S${index}`, student_email: null as unknown as string }));
    vi.stubGlobal("fetch", fakeSupabase(tables, users));
    const full = await handleClassroom(post("/api/classroom", { action: "joinClass", code: "abc-2345", name: "Late" }, "other"), env);
    expect(full.status).toBe(403);
    tables.teacher_profiles[0].plan = "famous";
    expect((await handleClassroom(post("/api/classroom", { action: "joinClass", code: "ABC2345", name: "Late" }, "other"), env)).status).toBe(200);
    expect(tables.class_members.some((member) => member.student_id === other)).toBe(true);
    tables.teacher_profiles[0].suspended = true;
    expect((await handleClassroom(post("/api/classroom", { action: "createClass", name: "New" }, "teacher"), env)).status).toBe(403);
  });
});

describe("admin API", () => {
  it("signs tokens that expire and cannot be altered", async () => {
    const now = Date.UTC(2026, 10, 12), token = await createAdminToken("s".repeat(48), now);
    expect(await verifyAdminToken("s".repeat(48), token, now + 60_000)).toBe(true);
    expect(await verifyAdminToken("s".repeat(48), token, now + 9 * 60 * 60 * 1000)).toBe(false);
    expect(await verifyAdminToken("x".repeat(48), token, now)).toBe(false);
    const [expires, signature] = token.split(".");
    expect(await verifyAdminToken("s".repeat(48), `${Number(expires) + 999}.${signature}`, now)).toBe(false);
    expect(await verifyAdminToken("s".repeat(48), undefined, now)).toBe(false);
  });

  it("stays off without strong credentials and rejects wrong ones", async () => {
    vi.stubGlobal("fetch", fakeSupabase(seed(), users));
    expect((await handleAdmin(post("/api/admin", { action: "login", username: "admin", password: "x" }), env)).status).toBe(503);
    expect((await handleAdmin(post("/api/admin", { action: "login", username: "a", password: "short" }), { ...adminEnv, ADMIN_PASSWORD: "short" })).status).toBe(503);
    expect((await handleAdmin(post("/api/admin", { action: "login", username: "admin-test", password: "wrong" }), adminEnv)).status).toBe(401);
    expect((await handleAdmin(post("/api/admin", { action: "overview" }), adminEnv)).status).toBe(401);
    // A signed-in teacher's session is not an admin session.
    expect((await handleAdmin(post("/api/admin", { action: "overview" }, "teacher"), adminEnv)).status).toBe(401);
  });

  it("lets a signed-in admin see everything and change a teacher's plan", async () => {
    const tables = seed();
    vi.stubGlobal("fetch", fakeSupabase(tables, users));
    const login = await handleAdmin(post("/api/admin", { action: "login", username: "admin-test", password: "a-long-random-password-123" }), adminEnv);
    const { token } = await login.json();
    const overview = await (await handleAdmin(post("/api/admin", { action: "overview" }, token), adminEnv)).json();
    expect(overview.counts).toMatchObject({ teachers: 1, classes: 1, students: 1, assignments: 1 });
    expect((await handleAdmin(post("/api/admin", { action: "setPlan", userId: teacher, plan: "premium" }, token), adminEnv)).status).toBe(200);
    expect(tables.teacher_profiles[0].plan).toBe("premium");
    expect((await handleAdmin(post("/api/admin", { action: "setPlan", userId: teacher, plan: "gold" }, token), adminEnv)).status).toBe(400);
    const dashboard = await (await handleAdmin(post("/api/admin", { action: "teacher", userId: teacher }, token), adminEnv)).json();
    expect(dashboard.classes[0].name).toBe("AS Physics");
  });
});

describe("teacher templates and exports", () => {
  it("writes a lesson outline whose minutes add up to the lesson length", () => {
    const minutes = (duration: number) => [...lessonOutline({ topic: "Forces", duration, labNames: [] }).matchAll(/^(\d+) min/gm)].reduce((sum, match) => sum + Number(match[1]), 0);
    for (const duration of [25, 30, 45, 60, 90, 240]) expect(minutes(duration), String(duration)).toBe(duration);
    // Five blocks of at least five minutes: shorter requests are planned as 25 minutes.
    expect(minutes(10)).toBe(25);
  });

  it("reports topic accuracy weakest first", () => {
    const stats = topicStats(seed().assignments as never, seed().teaching_items as never, [{ assignment_id: assignment, answers: { a: 1, b: 1 } }, { assignment_id: assignment, answers: { a: 1, b: 1 } }] as never);
    expect(stats).toEqual([{ topic: "Waves", correct: 0, total: 2 }, { topic: "Dynamics", correct: 2, total: 2 }]);
  });

  it("escapes exported documents and neutralises spreadsheet formulas", () => {
    expect(wordDocument("<b>x</b>", [{ heading: "H", body: "<script>" }])).not.toContain("<script>");
    expect(csv([["=HYPERLINK(1)", 'say "hi"', 3]])).toBe(`"'=HYPERLINK(1)","say ""hi""","3"`);
  });
});

describe("exam prep canonical pages", () => {
  it("lists a topic repeated at a higher level only once in the sitemap", () => {
    const aLevel = { board: "cambridge", level: "a", subject: "physics" };
    const repeated = getSyllabus(aLevel).filter((topic) => canonicalTopicCourse(aLevel, topic));
    expect(repeated.length).toBeGreaterThan(0);
    expect(canonicalTopicCourse(aLevel, repeated[0])).toMatchObject({ level: "as" });
    for (const topic of repeated) expect(examPrepIndexablePaths).not.toContain(`/exam-prep/cambridge/a/physics/${topic.slug}`);
    expect(new Set(examPrepIndexablePaths).size).toBe(examPrepIndexablePaths.length);
  });
});
