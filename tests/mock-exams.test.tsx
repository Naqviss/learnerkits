import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getMockExam, mockBanks, mockExamHref, mockExamIndexablePaths, mockExams } from "@/lib/mock-exams/catalog";
import { clockText, remainingSeconds, resultHeadline, scoreAttempt } from "@/lib/mock-exams/engine";
import { getSimulationCard } from "@/lib/subjects/catalog";
import MockExamsPage from "@/app/[locale]/mock-exams/page";
import { MockExamList, MockExamView } from "@/components/mock-exams/MockExamStudy";
import { legacyRedirect } from "@/lib/seo/legacy-redirects";

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
    // Practice sets are for signed-in students; only the public hub is listed.
    expect(mockExamIndexablePaths).toEqual(["/mock-exams"]);
    expect(mockExamHref("9702free")).toBe("/en/mock-exams?exam=9702free");
    expect(mockExamHref("bad id")).toBe("/en/mock-exams");
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
  it("describes every set on the public hub without any question text", async () => {
    const html = renderToStaticMarkup(await MockExamsPage({ params: Promise.resolve({ locale: "en" }) }));
    for (const exam of mockExams) expect(html).toContain(exam.paper);
    for (const bank of Object.values(mockBanks)) for (const question of bank) expect(html).not.toContain(question.q);
    expect(html).not.toContain('href="/en/mock-exams/');
    expect(html).toContain("not endorsed by Cambridge");
    expect(html).toContain("How long you have for each question");
  });

  it("opens a free set on its intro and soft-locks Premium sets in the signed-in view", () => {
    const list = renderToStaticMarkup(<MockExamList />);
    for (const exam of mockExams) expect(list).toContain(mockExamHref(exam.id));
    const free = renderToStaticMarkup(<MockExamView exam={getMockExam("9702free")!} />);
    expect(free).toContain("Start test");
    expect(free).not.toContain(mockBanks.physicsA[0].q);
    const premium = renderToStaticMarkup(<MockExamView exam={getMockExam("9702premium")!} />);
    expect(premium).toContain("part of Premium");
    expect(premium).not.toContain("Start test");
  });

  it("sends the retired practice-set URLs into the signed-in view", () => {
    expect(legacyRedirect("/en/mock-exams/0620free")).toBe("/en/mock-exams?exam=0620free");
    expect(legacyRedirect("/en/mock-exams")).toBeNull();
  });
});
