// Browser helpers for the signed-in classroom API (POST /api/classroom, see lib/classroom/api.ts).
import { postWithSession } from "@/lib/billing/premium";

export type ClassroomResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

/** Calls one classroom action as the signed-in user. Never throws. */
export async function classroom<T = Record<string, unknown>>(action: string, payload: Record<string, unknown> = {}): Promise<ClassroomResult<T>> {
  try {
    const { ok, status, data } = await postWithSession<Record<string, unknown>>("/api/classroom", { action, ...payload });
    if (ok) return { ok: true, data: data as T };
    return { ok: false, status, error: data.error || (status === 401 ? "Please sign in to continue." : "Something went wrong. Please try again.") };
  } catch {
    return { ok: false, status: 0, error: "You appear to be offline. Please try again." };
  }
}

export type MockAttemptInput = { examId: string; score: number; total: number; seconds: number };

/** Saves a finished mock exam to the signed-in account. Does nothing (and never throws) when signed out. */
export async function saveMockAttempt(attempt: MockAttemptInput): Promise<void> {
  await classroom("saveMockAttempt", attempt);
}
