import type { MockQuestion } from "./catalog";

export type Answers = (number | null)[];
export type MockResult = { correct: number; wrong: number; unanswered: number; total: number; percent: number; weakTopics: string[] };

/** Marks a finished attempt. Unanswered questions score zero. */
export function scoreAttempt(questions: MockQuestion[], answers: Answers): MockResult {
  let correct = 0, unanswered = 0;
  const weak: string[] = [];
  questions.forEach((question, index) => {
    const answer = answers[index] ?? null;
    if (answer === question.answer) { correct++; return; }
    if (answer === null) unanswered++;
    if (!weak.includes(question.topic)) weak.push(question.topic);
  });
  const total = questions.length;
  return { correct, unanswered, wrong: total - correct - unanswered, total, percent: total ? Math.round(correct * 100 / total) : 0, weakTopics: weak };
}

/** "07:05" for a number of seconds. */
export function clockText(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

/** Whole seconds left before a deadline (ms timestamp), never negative. */
export function remainingSeconds(deadline: number, now: number) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function resultHeadline(percent: number) {
  return percent >= 80 ? "Excellent work!" : percent >= 60 ? "Solid start. Keep improving." : "Every mistake is a learning opportunity.";
}
