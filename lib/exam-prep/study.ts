// Exam Prep courses, topic lessons, paper guides and practicals are for signed-in students only.
// They have no public page each: the signed-in view of /en/exam-prep shows them, chosen with these
// query parameters, and their content is loaded only after sign-in (components/exam-prep/ExamStudy).

export type StudyTarget = { board?: string; level?: string; subject?: string; topic?: string; view?: "papers"; practical?: string };

const keys = ["board", "level", "subject", "topic", "view", "practical"] as const;
const safe = /^[a-z0-9-]{1,120}$/;

/** The address of one part of Exam Prep inside the signed-in study view. */
export function studyHref(target: StudyTarget = {}): string {
  const params = new URLSearchParams();
  for (const key of keys) {
    const value = target[key];
    if (value && safe.test(value)) params.set(key, value);
  }
  const query = params.toString();
  return `/en/exam-prep${query ? `?${query}` : ""}`;
}

/** Reads a study target from a query string, dropping anything that is not a plain slug. */
export function readStudyTarget(params: { get(name: string): string | null }): StudyTarget {
  const target: StudyTarget = {};
  for (const key of keys) {
    const value = params.get(key);
    if (value && safe.test(value)) (target as Record<string, string>)[key] = value;
  }
  if (target.view !== "papers") delete target.view;
  return target;
}

/**
 * Where a retired public Exam Prep URL now points (/en/exam-prep/<board>/<level>/<subject>/<topic>,
 * …/papers and /en/exam-prep/practicals/<kind>), or null for any other path. The public guide for
 * other boards (/en/exam-prep/any-board) stays a page of its own.
 */
export function legacyExamPrepRedirect(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "en" || parts[1] !== "exam-prep" || parts.length < 3) return null;
  const rest = parts.slice(2);
  if (rest[0] === "any-board" || !rest.every((part) => safe.test(part))) return null;
  if (rest[0] === "practicals") return rest.length <= 2 ? studyHref({ practical: rest[1] }) : null;
  if (rest.length > 4) return null;
  const [board, level, subject, last] = rest;
  return last === "papers" ? studyHref({ board, level, subject, view: "papers" }) : studyHref({ board, level, subject, topic: last });
}
