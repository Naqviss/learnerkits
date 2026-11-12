"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { saveMockAttempt } from "@/lib/classroom/client";
import type { MockExam, MockQuestion } from "@/lib/mock-exams/catalog";
import { clockText, remainingSeconds, resultHeadline, scoreAttempt, type Answers } from "@/lib/mock-exams/engine";
import { readAttempts, storeAttempt, type StoredAttempt } from "@/lib/mock-exams/storage";
import styles from "./mockExams.module.css";

type Phase = "intro" | "running" | "results";
const letter = (index: number) => String.fromCharCode(65 + index);

// labTitles maps simulation slug → title (resolved on the server so the catalog stays out of this bundle).
export function MockExamRunner({ exam, questions: initialQuestions, labTitles }: { exam: MockExam; questions: MockQuestion[]; labTitles: Record<string, string> }) {
  const [questionSet, setQuestionSet] = useState(initialQuestions);
  const total = questionSet.length, limit = exam.minutes * 60;
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => Array(total).fill(null));
  const [flags, setFlags] = useState<number[]>([]);
  const [deadline, setDeadline] = useState(0);
  const [remaining, setRemaining] = useState(limit);
  const [elapsed, setElapsed] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [filter, setFilter] = useState<"incorrect" | "all">("incorrect");
  const [history, setHistory] = useState<StoredAttempt[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const top = useRef<HTMLDivElement>(null);
  // The timer callback must always mark the latest answers.
  const latest = useRef(answers);
  latest.current = answers;

  useEffect(() => { setHistory(readAttempts(exam.id)); }, [exam.id]);
  useEffect(() => {
    let live = true;
    fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "questions", examId: exam.id }) }).then((response) => response.ok ? response.json() as Promise<{ questions: MockQuestion[] }> : null).then((result) => {
      if (!live || !result?.questions?.length) return;
      setQuestionSet(result.questions);
      setAnswers(Array(result.questions.length).fill(null));
      setIndex(0);
    }).catch(() => {});
    return () => { live = false; };
  }, [exam.id]);

  const start = () => {
    setAnswers(Array(total).fill(null)); setFlags([]); setIndex(0); setTimedOut(false); setFilter("incorrect");
    setDeadline(Date.now() + limit * 1000); setRemaining(limit); setPhase("running");
  };

  const finish = (auto: boolean) => {
    dialog.current?.close();
    const seconds = Math.min(limit, limit - remainingSeconds(deadline, Date.now()));
    const result = scoreAttempt(questionSet, latest.current);
    setElapsed(seconds); setTimedOut(auto); setPhase("results");
    setHistory(storeAttempt({ examId: exam.id, score: result.correct, total, seconds, date: new Date().toISOString() }));
    void saveMockAttempt({ examId: exam.id, score: result.correct, total, seconds });
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    if (phase !== "running") return;
    const timer = window.setInterval(() => {
      const left = remainingSeconds(deadline, Date.now());
      setRemaining(left);
      if (left === 0) finishRef.current(true);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, deadline]);

  useEffect(() => { if (phase !== "intro") top.current?.scrollIntoView({ block: "start" }); }, [phase]);

  if (phase === "intro") return <div className={styles.intro}>
    <span className="eyebrow">{exam.premium ? "Premium practice set" : "Free sample"} · {exam.code}</span>
    <h2>Before you start</h2>
    <ul>
      <li>{total} original multiple-choice questions, {exam.minutes} minutes. The clock starts when you press Start.</li>
      <li>Answers are not checked until you submit. You can change them and flag questions to revisit.</li>
      <li>When time runs out the test is submitted automatically. Unanswered questions score zero.</li>
      <li>Your result is saved on this device, and to your account if you are signed in.</li>
    </ul>
    <button type="button" className="button primary" onClick={start}>Start test →</button>
    {history.length > 0 && <div className={styles.history}><h3>Your recent attempts</h3><ul>{history.map((attempt) => <li key={attempt.date}>{new Date(attempt.date).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}: {attempt.score}/{attempt.total} in {clockText(attempt.seconds)}</li>)}</ul></div>}
  </div>;

  if (phase === "running") {
    const question = questionSet[index], answered = answers.filter((answer) => answer !== null).length, flagged = flags.includes(index), left = total - answered;
    return <div ref={top} style={{ scrollMarginTop: 90 }}>
      <div className={styles.header}>
        <div><span className="eyebrow">Timed mock · {exam.code}</span><h2>{exam.title} — {exam.paper}</h2><small>Original practice questions · Question {index + 1} of {total}</small></div>
        <div className={`${styles.timer} ${remaining <= 60 ? styles.urgent : ""}`} role="timer" aria-label="Time remaining"><span>◷ REMAINING</span>{clockText(remaining)}</div>
      </div>
      <div className={styles.track} role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}><div className={styles.fill} style={{ width: `${answered * 100 / total}%` }} /></div>
      <div className={styles.runner}>
        <section className={styles.question} aria-label={`Question ${index + 1}`}>
          <div className={styles.meta}><span>QUESTION {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span><span>{question.topic} · 1 mark</span></div>
          <h3>{question.q}</h3>
          <div className={styles.answers} role="group" aria-label="Answer choices">
            {question.options.map((option, i) => <button type="button" key={option} className={styles.answer} aria-pressed={answers[index] === i} onClick={() => setAnswers(answers.map((value, at) => at === index ? i : value))}><span className={styles.letter}>{letter(i)}</span><span>{option}</span></button>)}
          </div>
          <div className={styles.questionFoot}>
            <button type="button" className="button" aria-pressed={flagged} onClick={() => setFlags(flagged ? flags.filter((value) => value !== index) : [...flags, index])}>{flagged ? "◆ Remove flag" : "◇ Flag for review"}</button>
            <div className={styles.row}>
              <button type="button" className="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>← Previous</button>
              {index === total - 1 ? <button type="button" className="button primary" onClick={() => dialog.current?.showModal()}>Submit test →</button> : <button type="button" className="button primary" onClick={() => setIndex(index + 1)}>Next question →</button>}
            </div>
          </div>
        </section>
        <aside className={styles.navigator} aria-label="Question navigator">
          <h3>Question navigator</h3>
          <p>{answered}/{total} answered · {flags.length} flagged</p>
          <div className={styles.numbers}>{questionSet.map((item, i) => <button type="button" key={item.id} className={`${styles.number} ${answers[i] !== null ? styles.answered : ""} ${flags.includes(i) ? styles.flagged : ""}`} aria-current={i === index ? "true" : undefined} aria-label={`Question ${i + 1}${answers[i] !== null ? ", answered" : ""}${flags.includes(i) ? ", flagged" : ""}`} onClick={() => setIndex(i)}>{i + 1}</button>)}</div>
          <div className={styles.legend}><span>Green: answered</span><span>◆ flagged</span><span>Outlined: current</span></div>
          <button type="button" className="button primary" onClick={() => dialog.current?.showModal()}>Finish and view results</button>
          <button type="button" className="button" onClick={() => { if (window.confirm("Exit this practice test? Your answers will not be saved.")) setPhase("intro"); }}>Exit this test</button>
        </aside>
      </div>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="submit-title">
        <span className="eyebrow">Submit mock exam</span>
        <h2 id="submit-title">Ready to see your results?</h2>
        <p>You have answered <strong>{answered} of {total}</strong> questions. {left ? `The ${left} unanswered question${left === 1 ? "" : "s"} will count as incorrect.` : "All questions have an answer."}</p>
        <p>Once submitted, your answers cannot be changed for this attempt.</p>
        <div className={styles.row}><button type="button" className="button primary" onClick={() => finish(false)}>Submit and mark →</button><button type="button" className="button" onClick={() => dialog.current?.close()}>Continue answering</button></div>
      </dialog>
    </div>;
  }

  const result = scoreAttempt(questionSet, answers);
  const rows = questionSet.map((question, i) => ({ question, i, given: answers[i], right: answers[i] === question.answer }));
  const missed = rows.filter((row) => !row.right), shown = filter === "all" ? rows : missed;
  return <div ref={top} style={{ scrollMarginTop: 90 }}>
    <div className={styles.resultHero}>
      <div><span className="eyebrow">Your marked practice test{timedOut && " · Time expired"}</span><h2>{resultHeadline(result.percent)}</h2><p>{exam.title} · {exam.paper} · {total}-question sample, not an official examination.</p>
        <div className={styles.row} style={{ marginTop: 16 }}><button type="button" className="button primary" onClick={start}>Try again ↻</button><Link className="button" href="/en/mock-exams">Browse other mocks →</Link></div></div>
      <div className={styles.circle} style={{ "--pct": `${result.percent}%` } as React.CSSProperties} role="img" aria-label={`Score ${result.percent} percent`}><strong>{result.percent}%</strong><small>YOUR SCORE</small></div>
    </div>
    <div className={styles.stats}>
      <div className={styles.stat}><b>{result.correct}/{total}</b><span>Correct answers</span></div>
      <div className={styles.stat}><b>{result.wrong}</b><span>Incorrect answers</span></div>
      <div className={styles.stat}><b>{result.unanswered}</b><span>Unanswered</span></div>
      <div className={styles.stat}><b>{clockText(elapsed)}</b><span>Time used</span></div>
    </div>
    <p className={styles.explain} role="status">{result.weakTopics.length ? <><strong>Your revision priorities:</strong> {result.weakTopics.join(" · ")}. Open the linked labs in the review below and test each idea again.</> : <><strong>Excellent accuracy:</strong> you answered every question correctly.</>}</p>
    <div className={styles.reviewTop}>
      <div><span className="eyebrow">Learn from your mistakes</span><h3>Answer review and explanations</h3></div>
      <div className={styles.switch} role="group" aria-label="Review filter"><button type="button" aria-pressed={filter === "incorrect"} onClick={() => setFilter("incorrect")}>Needs review ({missed.length})</button><button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All questions</button></div>
    </div>
    {shown.length ? shown.map(({ question, i, given, right }) => {
      const labTitle = question.lab ? labTitles[question.lab] : undefined;
      return <article key={question.id} className={styles.review}>
        <div className={styles.cardTop}><span className={styles.cardId}>Q{i + 1} · {question.topic}</span><span className={styles.cardId}>{right ? "✓ Correct" : given === null ? "◯ Unanswered" : "✕ Review"}</span></div>
        <h4>{question.q}</h4>
        <p><strong>Your answer:</strong> {given === null ? "Not answered" : `${letter(given)}. ${question.options[given]}`}</p>
        <p><strong>Correct answer:</strong> {letter(question.answer)}. {question.options[question.answer]}</p>
        <div className={styles.explain}><strong>Step-by-step explanation</strong><div>{question.why}</div></div>
        {labTitle && <Link className={styles.labLink} href={`/en/simulations/${question.lab}`}>Practise with {labTitle} →</Link>}
      </article>;
    }) : <div className={styles.empty}>Nothing to review — every answer was correct. Switch to “All questions” to reread the solutions.</div>}
    <p className={styles.reference} style={{ marginTop: 18 }}>Scores are marked against this original practice question bank, not official grade boundaries, and do not predict exam grades.</p>
  </div>;
}
