// Shapes shared by the classroom API (server) and the Teacher Kit / classroom / admin screens (browser).
export type PlanId = "basic" | "famous" | "premium";
export type ItemKind = "lesson" | "paper" | "question" | "kit";

export type TeacherProfile = { user_id: string; display_name: string; email: string | null; plan: PlanId; suspended: boolean; created_at: string };
export type ClassMember = { class_id: string; student_id: string; student_name: string; student_email: string | null; joined_at: string };
export type ClassRow = { id: string; teacher_id: string; name: string; board: string; level: string; subject: string; join_code: string; created_at: string };

export type PaperQuestion = { id: string; topic: string; q: string; options: string[]; answer: number; why: string; lab?: string | null };
export type LessonData = { board: string; level: string; subject: string; topic: string; duration: number; objective: string; outline: string; labSlugs: string[]; videos: string[] };
export type PaperData = { subject: string; minutes: number; questions: PaperQuestion[] };
export type QuestionData = { subject: string; topic: string; q: string; options: string[]; answer: number; why: string };
export type KitModule = { topic: string; objective: string; lesson: string; worksheet: string; homework: string; quiz: string; answerKey: string; rubric: string; labSlugs: string[] };
export type KitData = { board: string; level: string; subject: string; modules: KitModule[] };

export type TeachingItem = { id: string; teacher_id: string; kind: ItemKind; title: string; data: Record<string, unknown>; created_at: string; updated_at: string };
export type Assignment = { id: string; teacher_id: string; class_id: string; item_id: string; kind: "lesson" | "paper"; title: string; instructions: string; due_date: string | null; created_at: string };
export type Submission = { id: string; assignment_id: string; student_id: string; student_name: string; answers: Record<string, number> | null; response: string | null; score: number | null; total: number; status: "graded" | "awaiting_review"; feedback: string; submitted_at: string };
export type MockAttempt = { id: string; user_id: string; exam_id: string; score: number; total: number; seconds: number; created_at: string };

export type TeacherState = { profile: TeacherProfile; classes: ClassRow[]; members: ClassMember[]; items: TeachingItem[]; assignments: Assignment[]; submissions: Submission[] };

/** What a student sees: a paper's answers and explanations are included only after they submit. */
export type StudentAssignment = Assignment & { className: string; teacherName: string; lesson?: LessonData; paper?: { subject: string; minutes: number; questions: (Omit<PaperQuestion, "answer" | "why"> & { answer?: number; why?: string })[] }; submission: Submission | null };
export type StudentState = { classes: (Pick<ClassRow, "id" | "name" | "board" | "level" | "subject"> & { teacherName: string })[]; assignments: StudentAssignment[] };
