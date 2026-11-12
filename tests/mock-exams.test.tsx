import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { mockBanks, mockExamIndexablePaths, mockExams } from "@/lib/mock-exams/catalog";
import { clockText, remainingSeconds, resultHeadline, scoreAttempt } from "@/lib/mock-exams/engine";
import { getSimulationCard } from "@/lib/subjects/catalog";
import MockExamsPage from "@/app/[locale]/mock-exams/page";
import MockExamPage, { generateMetadata, generateStaticParams } from "@/app/[locale]/mock-exams/[examId]/page";

describe("mock exam catalog", () => {
  it("has well-formed questions with stable unique ids and real lab slugs", () => {
    const ids = Object.values(mockBanks).flat().map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const [name, questions] of Object.entries(mockBanks)) {
      expect(questions).toHaveLength(10);
      questions.forEach((question, index) => {
        expect(question.id).toBe(`${name}-${index + 1}`);
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options).size).toBe(4);
        expect(question.options[question.answer], question.id).toBeTruthy();
        expect(question.subject).toBe(name.startsWith("physics") ? "Physics" : "Chemistry");
        if (question.lab) expect(getSimulationCard(question.lab), question.lab).toBeDefined();
      });
    }
  });

  it("points every exam at an existing bank and lists only free sets for indexing", () => {
    for (const exam of mockExams) expect(mockBanks[exam.bank], exam.id).toBeDefined();
    expect(new Set(mockExams.map((exam) => exam.id)).size).toBe(mockExams.length);
    expect(mockExamIndexablePaths).toEqual(["/mock-exams", "/mock-exams/9702free", "/mock-exams/0620free"]);
    expect(generateStaticParams()).toHaveLength(mockExams.length);
  });
});

describe("mock exam engine", () => {
  const questions = mockBanks.physicsA;
  const right = questions.map((question) => question.answer);

  it("scores attempts and finds weak topics", () => {
    expect(scoreAttempt(questions, right)).toEqual({ correct: 10, wrong: 0, unanswered: 0, total: 10, percent: 100, weakTopics: [] });
    const mixed = right.map((answer, index) => index === 0 ? (answer + 1) % 4 : index === 1 || index === 4 ? null : answer);
    expect(scoreAttempt(questions, mixed)).toEqual({ correct: 7, wrong: 1, unanswered: 2, total: 10, percent: 70, weakTopics: ["Kinematics", "Momentum"] });
    expect(scoreAttempt(questions, [])).toMatchObject({ correct: 0, unanswered: 10, percent: 0 });
    expect(scoreAttempt([], [])).toMatchObject({ total: 0, percent: 0 });
  });

  it("formats the clock and counts down from a deadline", () => {
    expect(clockText(0)).toBe("00:00");
    expect(clockText(65)).toBe("01:05");
    expect(clockText(720)).toBe("12:00");
    expect(clockText(-5)).toBe("00:00");
    expect(remainingSeconds(10_000, 4_001)).toBe(6);
    expect(remainingSeconds(10_000, 10_000)).toBe(0);
    expect(remainingSeconds(10_000, 99_000)).toBe(0);
    expect(resultHeadline(80)).toBe("Excellent work!");
    expect(resultHeadline(60)).toContain("Solid start");
    expect(resultHeadline(10)).toContain("learning opportunity");
  });
});

describe("mock exam pages", () => {
  it("lists every set on the hub with the not-official notice", async () => {
    const html = renderToStaticMarkup(await MockExamsPage({ params: Promise.resolve({ locale: "en" }) }));
    for (const exam of mockExams) expect(html).toContain(`/en/mock-exams/${exam.id}`);
    expect(html).toContain("not endorsed by Cambridge");
  });

  it("opens a free set on its intro and soft-locks Premium sets", async () => {
    const free = renderToStaticMarkup(await MockExamPage({ params: Promise.resolve({ locale: "en", examId: "9702free" }) }));
    expect(free).toContain("Start test");
    expect(free).not.toContain(mockBanks.physicsA[0].q);
    const premium = renderToStaticMarkup(await MockExamPage({ params: Promise.resolve({ locale: "en", examId: "9702premium" }) }));
    expect(premium).toContain("part of Premium");
    expect(premium).not.toContain("Start test");
    expect((await generateMetadata({ params: Promise.resolve({ locale: "en", examId: "9702premium" }) })).robots).toEqual({ index: false, follow: false });
    expect((await generateMetadata({ params: Promise.resolve({ locale: "en", examId: "9702free" }) })).robots).toMatchObject({ index: true });
  });
});
