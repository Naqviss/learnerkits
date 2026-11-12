// POST /api/classroom — every Teacher Kit, classroom and mock-history request from a signed-in user.
// The tables are server-key only (see the classroom migration), so each action checks ownership here.
import { runModel, type TutorEnv } from "../ai/tutor";
import { countRows, DbError, deleteRows, inList, insertRow, isUniqueViolation, isUuid, selectRows, updateRows } from "../server/db";
import { isSameOrigin, json, readJsonBody, rpc, supabaseAdmin, userFromRequest, type Admin, type SignedInUser } from "../server/supabase";
import { plans, seatsUsed } from "./plans";
import type { Assignment, ClassMember, ClassRow, ItemKind, KitModule, LessonData, MockAttempt, PaperData, PaperQuestion, StudentAssignment, StudentState, Submission, TeacherProfile, TeacherState, TeachingItem } from "./types";

export type ClassroomEnv = TutorEnv;
type Body = Record<string, unknown>;

class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
const fail = (status: number, message: string): never => { throw new ApiError(status, message); };

const itemKinds: ItemKind[] = ["lesson", "paper", "question", "kit"];
const maxClasses = 30;
const maxItems = 400;
const lessonDraftsPerDay = 30;

export const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const int = (value: unknown, min: number, max: number, fallback: number) => {
  const number = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
};
const list = (value: unknown, max: number) => Array.isArray(value) ? value.slice(0, max) : [];
const uuid = (value: unknown, label: string) => isUuid(value) ? value : fail(400, `Missing ${label}.`);
const slugs = (value: unknown) => list(value, 12).map((slug) => text(slug, 80)).filter((slug) => /^[a-z0-9-]+$/.test(slug));
const httpsUrl = (value: unknown) => { try { const url = new URL(text(value, 400)); return url.protocol === "https:" ? url.href : ""; } catch { return ""; } };

export function cleanQuestion(value: unknown, index: number): PaperQuestion | null {
  const raw = (value && typeof value === "object" ? value : {}) as Body;
  const q = text(raw.q, 1000);
  const options = list(raw.options, 6).map((option) => text(option, 300)).filter(Boolean);
  const answer = int(raw.answer, 0, 5, -1);
  if (!q || options.length < 2 || answer < 0 || answer >= options.length) return null;
  return { id: text(raw.id, 40) || `q${index + 1}`, topic: text(raw.topic, 120), q, options, answer, why: text(raw.why, 1500), lab: text(raw.lab, 80) || null };
}

/** Validates and trims the content a teacher saves. Returns null when it is not usable. */
export function cleanItemData(kind: ItemKind, value: unknown): Record<string, unknown> | null {
  const raw = (value && typeof value === "object" ? value : {}) as Body;
  const course = { board: text(raw.board, 60), level: text(raw.level, 60), subject: text(raw.subject, 60) };
  if (kind === "lesson") {
    const outline = text(raw.outline, 6000);
    const lesson: LessonData = { ...course, topic: text(raw.topic, 120), duration: int(raw.duration, 10, 240, 45), objective: text(raw.objective, 1000), outline, labSlugs: slugs(raw.labSlugs), videos: list(raw.videos, 8).map(httpsUrl).filter(Boolean) };
    return outline ? lesson : null;
  }
  if (kind === "paper") {
    const questions = list(raw.questions, 60).map(cleanQuestion);
    if (!questions.length || questions.some((question) => !question)) return null;
    const ids = new Set(questions.map((question) => question!.id));
    if (ids.size !== questions.length) return null;
    const paper: PaperData = { subject: course.subject, minutes: int(raw.minutes, 5, 240, 45), questions: questions as PaperQuestion[] };
    return paper;
  }
  if (kind === "question") {
    const question = cleanQuestion(raw, 0);
    return question ? { subject: course.subject, topic: question.topic, q: question.q, options: question.options, answer: question.answer, why: question.why } : null;
  }
  const modules: KitModule[] = list(raw.modules, 40).map((entry) => {
    const module = (entry && typeof entry === "object" ? entry : {}) as Body;
    return { topic: text(module.topic, 120), objective: text(module.objective, 1000), lesson: text(module.lesson, 4000), worksheet: text(module.worksheet, 4000), homework: text(module.homework, 2000), quiz: text(module.quiz, 4000), answerKey: text(module.answerKey, 4000), rubric: text(module.rubric, 2000), labSlugs: slugs(module.labSlugs) };
  }).filter((module) => module.topic);
  return modules.length ? { ...course, modules } : null;
}

/** Marks a paper. Returns null unless every question has a valid answer. */
export function markPaper(paper: PaperData, answers: unknown): { answers: Record<string, number>; score: number } | null {
  const given = (answers && typeof answers === "object" ? answers : {}) as Body;
  const kept: Record<string, number> = {};
  let score = 0;
  for (const question of paper.questions) {
    const choice = given[question.id];
    if (typeof choice !== "number" || !Number.isInteger(choice) || choice < 0 || choice >= question.options.length) return null;
    kept[question.id] = choice;
    if (choice === question.answer) score++;
  }
  return { answers: kept, score };
}

/** Students get the answer key and explanations only once they have submitted. */
export function paperForStudent(paper: PaperData, submitted: boolean): NonNullable<StudentAssignment["paper"]> {
  return { subject: paper.subject, minutes: paper.minutes, questions: paper.questions.map(({ answer, why, ...question }) => submitted ? { ...question, answer, why } : question) };
}

const joinAlphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function newJoinCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  return [...bytes].map((byte) => joinAlphabet[byte % joinAlphabet.length]).join("");
}

async function teacherOf(admin: Admin, user: SignedInUser, writing = true): Promise<TeacherProfile> {
  const [profile] = await selectRows<TeacherProfile>(admin, "teacher_profiles", { user_id: `eq.${user.id}` });
  if (!profile) return fail(403, "Create your teacher profile first.");
  if (writing && profile.suspended) return fail(403, "This teacher account is paused. Please contact LearnerKits support.");
  return profile;
}

async function teacherState(admin: Admin, teacherId: string, profile: TeacherProfile): Promise<TeacherState> {
  const [classes, items, assignments] = await Promise.all([
    selectRows<ClassRow>(admin, "classes", { teacher_id: `eq.${teacherId}`, order: "created_at.asc" }),
    selectRows<TeachingItem>(admin, "teaching_items", { teacher_id: `eq.${teacherId}`, order: "updated_at.desc" }),
    selectRows<Assignment>(admin, "assignments", { teacher_id: `eq.${teacherId}`, order: "created_at.desc" }),
  ]);
  const [members, submissions] = await Promise.all([
    classes.length ? selectRows<ClassMember>(admin, "class_members", { class_id: inList(classes.map((row) => row.id)), order: "joined_at.asc" }) : [],
    assignments.length ? selectRows<Submission>(admin, "submissions", { assignment_id: inList(assignments.map((row) => row.id)), order: "submitted_at.desc" }) : [],
  ]);
  return { profile, classes, members, items, assignments, submissions };
}
/** Everything on one teacher's dashboard; also used by the admin panel to view any teacher. */
export async function loadTeacherState(admin: Admin, teacherId: string): Promise<TeacherState | null> {
  const [profile] = await selectRows<TeacherProfile>(admin, "teacher_profiles", { user_id: `eq.${teacherId}` });
  return profile ? teacherState(admin, teacherId, profile) : null;
}

async function studentState(admin: Admin, user: SignedInUser): Promise<StudentState> {
  const memberships = await selectRows<ClassMember>(admin, "class_members", { student_id: `eq.${user.id}` });
  if (!memberships.length) return { classes: [], assignments: [] };
  const classes = await selectRows<ClassRow>(admin, "classes", { id: inList(memberships.map((row) => row.class_id)) });
  const [teachers, assignments] = await Promise.all([
    selectRows<TeacherProfile>(admin, "teacher_profiles", { user_id: inList([...new Set(classes.map((row) => row.teacher_id))]) }),
    selectRows<Assignment>(admin, "assignments", { class_id: inList(classes.map((row) => row.id)), order: "created_at.desc" }),
  ]);
  const [items, submissions] = assignments.length ? await Promise.all([
    selectRows<TeachingItem>(admin, "teaching_items", { id: inList([...new Set(assignments.map((row) => row.item_id))]) }),
    selectRows<Submission>(admin, "submissions", { student_id: `eq.${user.id}`, assignment_id: inList(assignments.map((row) => row.id)) }),
  ]) : [[], []];
  const teacherName = (id: string) => teachers.find((teacher) => teacher.user_id === id)?.display_name ?? "Teacher";
  return {
    classes: classes.map(({ id, name, board, level, subject, teacher_id }) => ({ id, name, board, level, subject, teacherName: teacherName(teacher_id) })),
    assignments: assignments.map((assignment) => {
      const item = items.find((row) => row.id === assignment.item_id);
      const submission = submissions.find((row) => row.assignment_id === assignment.id) ?? null;
      const group = classes.find((row) => row.id === assignment.class_id);
      return {
        ...assignment, className: group?.name ?? "Class", teacherName: teacherName(assignment.teacher_id), submission,
        ...(item?.kind === "lesson" ? { lesson: item.data as LessonData } : {}),
        ...(item?.kind === "paper" ? { paper: paperForStudent(item.data as PaperData, Boolean(submission)) } : {}),
      };
    }),
  };
}

async function ownedClass(admin: Admin, teacherId: string, id: unknown): Promise<ClassRow> {
  const [row] = await selectRows<ClassRow>(admin, "classes", { id: `eq.${uuid(id, "class")}`, teacher_id: `eq.${teacherId}` });
  return row ?? fail(404, "That class was not found.");
}

async function lessonDraft(env: ClassroomEnv, admin: Admin, user: SignedInUser, body: Body) {
  if (!env.AI && !(env.AI_BASE_URL && env.AI_API_KEY && env.AI_MODEL)) return fail(503, "AI drafting is not available right now.");
  const topic = text(body.topic, 120);
  if (!topic) return fail(400, "Enter a topic first.");
  const quota = await rpc(admin, "consume_ai_request", { p_user_id: user.id, p_daily_limit: lessonDraftsPerDay }).catch(() => null);
  if (!quota?.ok) return fail(503, "AI drafting is not available right now.");
  if (await quota.json() !== true) return fail(429, "You have used today's AI lesson drafts. Try again tomorrow.");
  const duration = int(body.duration, 10, 240, 45);
  const course = [text(body.board, 60), text(body.level, 60), text(body.subject, 60)].filter(Boolean).join(" ");
  const labs = list(body.labNames, 6).map((name) => text(name, 80)).filter(Boolean);
  const prompt = [
    `Write a ${duration}-minute science lesson plan for a teacher. Course: ${course || "secondary science"}. Topic: ${topic}.`,
    text(body.objective, 600) ? `Learning objective: ${text(body.objective, 600)}` : "",
    labs.length ? `Use these LearnerKits interactive simulations in the investigation step: ${labs.join(", ")}.` : "",
    `Output 5 to 7 lines. Each line starts with the minutes and a dash, for example "10 min — Explain …". The minutes must add up to ${duration}.`,
    "Include a starter, an explanation with one worked example, an investigation where students predict then test, guided practice, and an exit ticket.",
    "Plain text only. No headings, no Markdown, no preamble. Do not invent syllabus codes or exam-board requirements.",
    "/no_think",
  ].filter(Boolean).join("\n");
  const outline = await runModel(env, [{ role: "system", content: "You are an experienced secondary science teacher who writes concise, practical lesson plans." }, { role: "user", content: prompt }], 900).catch(() => "");
  return outline ? { outline: outline.slice(0, 6000) } : fail(502, "The AI did not return a draft. Please try again.");
}

async function run(action: string, body: Body, user: SignedInUser, admin: Admin, env: ClassroomEnv): Promise<Record<string, unknown>> {
  switch (action) {
    case "me": {
      const [[profile], membership] = await Promise.all([
        selectRows<TeacherProfile>(admin, "teacher_profiles", { user_id: `eq.${user.id}` }),
        countRows(admin, "class_members", { student_id: `eq.${user.id}` }),
      ]);
      return { teacher: profile ?? null, isStudent: membership > 0 };
    }
    case "becomeTeacher": {
      const row = { user_id: user.id, display_name: text(body.displayName, 80) || user.name || "Teacher", email: user.email ?? null };
      try { return { profile: await insertRow<TeacherProfile>(admin, "teacher_profiles", row) }; }
      catch (error) { if (!isUniqueViolation(error)) throw error; return { profile: await teacherOf(admin, user, false) }; }
    }
    case "teacherState": return { ...await teacherState(admin, user.id, await teacherOf(admin, user, false)) };
    case "createClass": {
      await teacherOf(admin, user);
      const name = text(body.name, 80) || fail(400, "Enter a class name.");
      if (await countRows(admin, "classes", { teacher_id: `eq.${user.id}` }) >= maxClasses) return fail(400, `You can have up to ${maxClasses} classes.`);
      for (let attempt = 0; attempt < 4; attempt++) {
        try { return { class: await insertRow<ClassRow>(admin, "classes", { teacher_id: user.id, name, board: text(body.board, 60), level: text(body.level, 60), subject: text(body.subject, 60), join_code: newJoinCode() }) }; }
        catch (error) { if (!isUniqueViolation(error)) throw error; }
      }
      return fail(500, "Could not create a class code. Please try again.");
    }
    case "deleteClass": {
      await teacherOf(admin, user);
      await deleteRows(admin, "classes", { id: `eq.${uuid(body.id, "class")}`, teacher_id: `eq.${user.id}` });
      return {};
    }
    case "removeStudent": {
      await teacherOf(admin, user);
      const group = await ownedClass(admin, user.id, body.classId);
      await deleteRows(admin, "class_members", { class_id: `eq.${group.id}`, student_id: `eq.${uuid(body.studentId, "student")}` });
      return {};
    }
    case "saveItem": {
      await teacherOf(admin, user);
      const kind = itemKinds.find((candidate) => candidate === body.kind) ?? fail(400, "Unknown resource type.");
      const data = cleanItemData(kind, body.data) ?? fail(400, kind === "paper" ? "Add at least one complete question." : "Please complete the required fields.");
      const title = text(body.title, 140) || fail(400, "Add a title.");
      if (JSON.stringify(data).length > 120_000) return fail(400, "This resource is too large to save.");
      if (body.id !== undefined && body.id !== null) {
        const [item] = await updateRows<TeachingItem>(admin, "teaching_items", { id: `eq.${uuid(body.id, "resource")}`, teacher_id: `eq.${user.id}`, kind: `eq.${kind}` }, { title, data, updated_at: new Date().toISOString() });
        return { item: item ?? fail(404, "That resource was not found.") };
      }
      if (await countRows(admin, "teaching_items", { teacher_id: `eq.${user.id}` }) >= maxItems) return fail(400, "Your library is full. Delete a resource first.");
      return { item: await insertRow<TeachingItem>(admin, "teaching_items", { teacher_id: user.id, kind, title, data }) };
    }
    case "deleteItem": {
      await teacherOf(admin, user);
      await deleteRows(admin, "teaching_items", { id: `eq.${uuid(body.id, "resource")}`, teacher_id: `eq.${user.id}` });
      return {};
    }
    case "createAssignment": {
      await teacherOf(admin, user);
      const group = await ownedClass(admin, user.id, body.classId);
      const [item] = await selectRows<TeachingItem>(admin, "teaching_items", { id: `eq.${uuid(body.itemId, "resource")}`, teacher_id: `eq.${user.id}` });
      if (!item || (item.kind !== "lesson" && item.kind !== "paper")) return fail(400, "Choose a saved lesson or question paper.");
      const due = text(body.due, 10);
      return { assignment: await insertRow<Assignment>(admin, "assignments", { teacher_id: user.id, class_id: group.id, item_id: item.id, kind: item.kind, title: item.title, instructions: text(body.instructions, 1500), due_date: /^\d{4}-\d{2}-\d{2}$/.test(due) ? due : null }) };
    }
    case "deleteAssignment": {
      await teacherOf(admin, user);
      await deleteRows(admin, "assignments", { id: `eq.${uuid(body.id, "assignment")}`, teacher_id: `eq.${user.id}` });
      return {};
    }
    case "gradeSubmission": {
      await teacherOf(admin, user);
      const [submission] = await selectRows<Submission>(admin, "submissions", { id: `eq.${uuid(body.id, "submission")}` });
      const [assignment] = submission ? await selectRows<Assignment>(admin, "assignments", { id: `eq.${submission.assignment_id}`, teacher_id: `eq.${user.id}` }) : [];
      if (!submission || !assignment) return fail(404, "That submission was not found.");
      const patch: Record<string, unknown> = { feedback: text(body.feedback, 2000), status: "graded" };
      if (assignment.kind === "lesson") {
        if (typeof body.score !== "number" || !Number.isInteger(body.score) || body.score < 0 || body.score > submission.total) return fail(400, `Enter a score from 0 to ${submission.total}.`);
        patch.score = body.score;
      }
      const [updated] = await updateRows<Submission>(admin, "submissions", { id: `eq.${submission.id}` }, patch);
      return { submission: updated };
    }
    case "generateLesson": {
      await teacherOf(admin, user);
      return lessonDraft(env, admin, user, body);
    }
    case "joinClass": {
      const code = text(body.code, 20).toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (code.length < 4) return fail(400, "Enter the class code from your teacher.");
      const [group] = await selectRows<ClassRow>(admin, "classes", { join_code: `eq.${code}` });
      if (!group) return fail(404, "That class code was not recognised. Check it with your teacher.");
      if (group.teacher_id === user.id) return fail(400, "You are the teacher of this class.");
      const [teacher] = await selectRows<TeacherProfile>(admin, "teacher_profiles", { user_id: `eq.${group.teacher_id}` });
      if (!teacher || teacher.suspended) return fail(403, "This class is not accepting students right now.");
      const classes = await selectRows<ClassRow>(admin, "classes", { teacher_id: `eq.${group.teacher_id}`, select: "id" });
      const members = await selectRows<ClassMember>(admin, "class_members", { class_id: inList(classes.map((row) => row.id)), select: "class_id,student_id" });
      if (members.some((member) => member.class_id === group.id && member.student_id === user.id)) return { className: group.name };
      const seated = members.some((member) => member.student_id === user.id);
      if (!seated && seatsUsed(members) >= plans[teacher.plan].seats) return fail(403, "This teacher's class list is full. Ask your teacher to free a seat.");
      const name = text(body.name, 80) || user.name || user.email?.split("@")[0] || "Student";
      try { await insertRow(admin, "class_members", { class_id: group.id, student_id: user.id, student_name: name, student_email: user.email ?? null }); }
      catch (error) { if (!isUniqueViolation(error)) throw error; }
      return { className: group.name };
    }
    case "leaveClass": {
      await deleteRows(admin, "class_members", { class_id: `eq.${uuid(body.classId, "class")}`, student_id: `eq.${user.id}` });
      return {};
    }
    case "studentState": return { ...await studentState(admin, user) };
    case "submitAssignment": {
      const [assignment] = await selectRows<Assignment>(admin, "assignments", { id: `eq.${uuid(body.assignmentId, "assignment")}` });
      const [membership] = assignment ? await selectRows<ClassMember>(admin, "class_members", { class_id: `eq.${assignment.class_id}`, student_id: `eq.${user.id}` }) : [];
      if (!assignment || !membership) return fail(404, "That assignment was not found.");
      const [item] = await selectRows<TeachingItem>(admin, "teaching_items", { id: `eq.${assignment.item_id}` });
      if (!item) return fail(404, "The assignment content is no longer available.");
      const base = { assignment_id: assignment.id, student_id: user.id, student_name: membership.student_name };
      let row: Record<string, unknown>;
      if (assignment.kind === "paper") {
        const paper = item.data as PaperData;
        const marked = markPaper(paper, body.answers) ?? fail(400, "Answer every question before submitting.");
        row = { ...base, answers: marked.answers, score: marked.score, total: paper.questions.length, status: "graded" };
      } else {
        const response = text(body.response, 4000);
        if (response.length < 8) return fail(400, "Write a short answer before submitting.");
        row = { ...base, response, score: null, total: 10, status: "awaiting_review" };
      }
      try { return { submission: await insertRow<Submission>(admin, "submissions", row) }; }
      catch (error) { return isUniqueViolation(error) ? fail(409, "You have already submitted this assignment.") : Promise.reject(error); }
    }
    case "saveMockAttempt": {
      const examId = text(body.examId, 40);
      const total = int(body.total, 1, 200, 0);
      if (!/^[a-z0-9-]+$/i.test(examId) || !total) return fail(400, "Invalid attempt.");
      await insertRow(admin, "mock_attempts", { user_id: user.id, exam_id: examId, score: int(body.score, 0, total, 0), total, seconds: int(body.seconds, 0, 20_000, 0) });
      return {};
    }
    case "mockAttempts": return { attempts: await selectRows<MockAttempt>(admin, "mock_attempts", { user_id: `eq.${user.id}`, order: "created_at.desc", limit: "50" }) };
    default: return fail(400, "Unknown action.");
  }
}

export async function handleClassroom(request: Request, env: ClassroomEnv): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (!isSameOrigin(request)) return json(403, { error: "Please use LearnerKits from the website." });
  const admin = supabaseAdmin(env);
  if (!admin) return json(503, { error: "Classrooms are not available yet. Please try again later." });
  const user = await userFromRequest(request, admin);
  if (!user) return json(401, { error: "Please sign in to continue." });
  const body = await readJsonBody(request, 200_000);
  if (!body || typeof body.action !== "string") return json(400, { error: "Invalid request." });
  try {
    return json(200, await run(body.action, body, user, admin, env));
  } catch (error) {
    if (error instanceof ApiError) return json(error.status, { error: error.message });
    // 42P01/PGRST205: the classroom migration has not been applied to this Supabase project.
    if (error instanceof DbError && (error.code === "42P01" || error.code === "PGRST205")) return json(503, { error: "Classrooms are not set up yet. Please try again later." });
    console.error("Classroom request failed", body.action, error);
    return json(500, { error: "Something went wrong. Please try again." });
  }
}
