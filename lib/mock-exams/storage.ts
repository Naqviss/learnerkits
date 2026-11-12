// Recent mock exam attempts kept in this browser (signed-in users also get them saved to their account).
export type StoredAttempt = { examId: string; score: number; total: number; seconds: number; date: string };
const key = "learnerkits-mock-attempts-v1";
const maxStored = 30;

function readAll(): StoredAttempt[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is StoredAttempt => Boolean(item) && typeof item.examId === "string" && typeof item.score === "number" && typeof item.total === "number" && typeof item.seconds === "number" && typeof item.date === "string") : [];
  } catch { return []; }
}

/** The five most recent attempts at one exam, newest first. */
export function readAttempts(examId: string): StoredAttempt[] {
  return readAll().filter((attempt) => attempt.examId === examId).slice(0, 5);
}

/** Stores an attempt and returns the updated recent list for that exam. Never throws. */
export function storeAttempt(attempt: StoredAttempt): StoredAttempt[] {
  const all = [attempt, ...readAll()].slice(0, maxStored);
  try { localStorage.setItem(key, JSON.stringify(all)); } catch { /* storage blocked: keep it for this page only */ }
  return all.filter((item) => item.examId === attempt.examId).slice(0, 5);
}
