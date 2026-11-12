// Offline drafting helpers and analysis for the Teacher Kit. Pure functions: no network, no storage.
import type { Assignment, KitModule, PaperData, PaperQuestion, Submission, TeachingItem } from "./types";

/** Editable starter topics for a whole-subject kit. Teachers must check them against their own syllabus. */
export const starterTopics: Record<string, string[]> = {
  Physics: ["Physical quantities and units", "Kinematics", "Dynamics and Newton's laws", "Forces, density and pressure", "Work, energy and power", "Deformation of solids", "Waves", "Superposition", "Electricity", "D.C. circuits", "Particle physics"],
  Chemistry: ["Atomic structure", "Chemical bonding", "States of matter", "Chemical energetics", "Reaction kinetics", "Chemical equilibrium", "Acids and bases", "Organic chemistry"],
  Biology: ["Cell structure", "Biological molecules", "Enzymes", "Cell membranes", "Transport in plants", "Transport in mammals", "Gas exchange", "Immunity"],
  Mathematics: ["Algebra and functions", "Coordinate geometry", "Trigonometry", "Differentiation", "Integration", "Vectors", "Statistics"],
};

/** A timed lesson outline that adds up to `duration` minutes (five blocks of at least 5 minutes, so 25 is the shortest). */
export function lessonOutline({ topic, duration, labNames }: { topic: string; duration: number; labNames: string[] }) {
  const total = Math.max(25, Math.round(duration) || 45);
  // Starter and exit ticket take 5 minutes each; the investigation gets whatever the other blocks leave.
  const explain = Math.max(5, Math.floor((total - 10) * 0.3));
  const practice = explain;
  const investigate = total - 10 - explain - practice;
  const lab = labNames.length ? `open ${labNames.join(" and ")}, change one variable at a time` : "run a short class demonstration or thought experiment";
  return [
    `5 min — Starter: students predict what will happen in a short ${topic} scenario and note their reasoning.`,
    `${explain} min — Explain: introduce the key idea and vocabulary for ${topic} with one worked example.`,
    `${investigate} min — Investigate: ${lab}, record three results and compare them with the predictions.`,
    `${practice} min — Guided practice: solve exam-style questions on ${topic}; discuss common errors and units.`,
    `5 min — Exit ticket: each student writes one claim supported by an observation, and one question for next lesson.`,
  ].join("\n");
}

export function kitModule(topic: string, labSlugs: string[] = []): KitModule {
  return {
    topic,
    objective: `Students explain the key concepts of ${topic}, apply them to examples and justify their conclusions.`,
    lesson: lessonOutline({ topic, duration: 45, labNames: [] }),
    worksheet: `1. Define the central principle of ${topic}.\n2. Give one example in a new context.\n3. Interpret a set of observations or numerical data.`,
    homework: `Explain ${topic} in your own words and solve two practice questions, showing every step.`,
    quiz: `Write three check-for-understanding questions about ${topic}.`,
    answerKey: "Draft: add worked solutions and mark allocations before sharing with students.",
    rubric: "3 marks concept accuracy · 2 marks reasoning · 1 mark correct scientific terminology.",
    labSlugs,
  };
}

export type TopicStat = { topic: string; correct: number; total: number };

/** Per-topic accuracy across submitted papers, weakest first. */
export function topicStats(assignments: Assignment[], items: TeachingItem[], submissions: Submission[], classId?: string): TopicStat[] {
  const stats = new Map<string, TopicStat>();
  for (const assignment of assignments) {
    if (assignment.kind !== "paper" || (classId && assignment.class_id !== classId)) continue;
    const paper = items.find((item) => item.id === assignment.item_id)?.data as PaperData | undefined;
    if (!paper?.questions) continue;
    for (const submission of submissions) {
      if (submission.assignment_id !== assignment.id || !submission.answers) continue;
      for (const question of paper.questions) {
        const topic = question.topic || "General";
        const row = stats.get(topic) ?? { topic, correct: 0, total: 0 };
        row.total++;
        if (submission.answers[question.id] === question.answer) row.correct++;
        stats.set(topic, row);
      }
    }
  }
  return [...stats.values()].sort((a, b) => a.correct / a.total - b.correct / b.total);
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** A Word-compatible HTML document. Sections are plain text; everything is escaped. */
export function wordDocument(title: string, sections: { heading: string; body: string }[]) {
  const body = sections.map((section) => `<h2>${escapeHtml(section.heading)}</h2><pre>${escapeHtml(section.body)}</pre>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Calibri,Arial,sans-serif;line-height:1.5;margin:30px}h2{border-bottom:1px solid #ccc;padding-bottom:6px}pre{font-family:inherit;white-space:pre-wrap}</style></head><body><h1>${escapeHtml(title)}</h1>${body}</body></html>`;
}

export function paperSections(questions: PaperQuestion[]) {
  const letter = (index: number) => String.fromCharCode(65 + index);
  return [
    { heading: "Questions", body: questions.map((question, index) => `${index + 1}. ${question.q}\n${question.options.map((option, choice) => `   ${letter(choice)}. ${option}`).join("\n")}`).join("\n\n") },
    { heading: "Teacher answer key", body: questions.map((question, index) => `${index + 1}. ${letter(question.answer)} — ${question.why}`).join("\n") },
  ];
}

/** CSV with every cell quoted; cells that a spreadsheet could run as a formula are neutralised. */
export function csv(rows: (string | number | null | undefined)[][]) {
  return rows.map((row) => row.map((cell) => {
    const value = String(cell ?? "");
    return `"${(/^[=+\-@\t\r]/.test(value) ? `'${value}` : value).replace(/"/g, '""')}"`;
  }).join(",")).join("\r\n");
}

/** Browser-only: hands the user a generated file. */
export function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
