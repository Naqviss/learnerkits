"use client";
import { useEffect, useState } from "react";
import type { ContentId } from "@/lib/exam-prep/catalog";
import { buildExam, examLength } from "@/lib/exam-prep/generators";
import type { Question } from "@/lib/exam-prep/question-bank";
import styles from "./examPrep.module.css";

type Props = { topicId: string; topicName: string; content: ContentId; pool: readonly Question[]; hint: string };
type Saved = { best: number; last: number; attempts: number };

// Scores stay in this browser, like the rest of LearnerKits progress.
const storageKey = "learnerkits-exam-prep-scores";
function readScores(): Record<string, Saved> {
  try { return JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Record<string, Saved>; } catch { return {}; }
}
function saveScore(topicId: string, percent: number): Saved {
  const scores = readScores(), previous = scores[topicId];
  const next = { best: Math.max(previous?.best ?? 0, percent), last: percent, attempts: (previous?.attempts ?? 0) + 1 };
  try { localStorage.setItem(storageKey, JSON.stringify({ ...scores, [topicId]: next })); } catch { /* private mode: the score still shows for this visit */ }
  return next;
}

export function understanding(percent: number) {
  return percent >= 80 ? "Strong understanding" : percent >= 60 ? "Good — a little more practice" : percent >= 40 ? "Getting there" : "Needs more practice";
}

/** A randomised topic test with a bar showing how well the student understands the topic. */
export function TopicExam({ topicId, topicName, content, pool, hint }: Props) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { setSaved(readScores()[topicId] ?? null); }, [topicId]);

  const start = () => { setQuestions(buildExam(content, pool)); setIndex(0); setChosen(null); setChecked(false); setScore(0); setDone(false); };
  const total = questions?.length ?? examLength;
  const current = questions?.[index];
  const check = () => { if (!current || chosen === null) return; setChecked(true); if (chosen === current.answer) setScore((value) => value + 1); };
  const next = () => {
    if (!questions) return;
    if (index + 1 < questions.length) { setIndex(index + 1); setChosen(null); setChecked(false); return; }
    setDone(true);
    setSaved(saveScore(topicId, Math.round(score / questions.length * 100)));
  };

  // While a test is running the bar shows progress so far; otherwise it shows the best saved score.
  const running = Boolean(questions) && !done;
  const percent = running ? Math.round(score / total * 100) : saved?.best ?? 0;
  const barLabel = running ? `${score} of ${total} correct so far` : saved ? `${understanding(saved.best)} · best score ${saved.best}%` : "Not tested yet";

  return <section className={styles.panel} aria-labelledby="topic-exam">
    <div className={styles.panelTop}><h2 id="topic-exam">Topic test</h2><span className={`${styles.badge} ${styles.paid}`}>{examLength} random questions</span></div>
    <div className={styles.meterBox}>
      <div className={styles.meterTop}><strong>Your understanding of this topic</strong><span aria-live="polite">{barLabel}</span></div>
      <div className={styles.meter} role="progressbar" aria-label={`Understanding of ${topicName}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} data-level={percent >= 80 ? "high" : percent >= 40 ? "mid" : "low"} /></div>
    </div>

    {!questions && <>
      <p>Answer {examLength} questions on {topicName}. The questions and their order change each time, and calculation questions use new numbers, so you can retake the test until the bar is full.</p>
      <div className={styles.actions} style={{ marginTop: 0 }}><button type="button" className="button primary" onClick={start}>{saved ? "Take the test again" : "Start the topic test"}</button></div>
      <div className={styles.result}><b>Before you start</b>{hint}</div>
    </>}

    {current && !done && <>
      <p className={styles.examCount}>Question {index + 1} of {total}</p>
      <p className={styles.examQuestion}>{current.question}</p>
      <div className={styles.options} role="group" aria-label="Answer choices">
        {current.options.map((option, optionIndex) => <button type="button" key={option} disabled={checked} aria-pressed={chosen === optionIndex} className={`${styles.option} ${checked && optionIndex === current.answer ? styles.correct : ""} ${checked && optionIndex === chosen && chosen !== current.answer ? styles.incorrect : ""}`} onClick={() => setChosen(optionIndex)}>{String.fromCharCode(65 + optionIndex)}. {option}</button>)}
      </div>
      <div className={styles.actions} style={{ marginTop: 0 }}>
        {!checked ? <button type="button" className="button primary" disabled={chosen === null} onClick={check}>Check answer</button>
          : <button type="button" className="button primary" onClick={next}>{index + 1 < total ? "Next question" : "See my score"}</button>}
      </div>
      <div aria-live="polite">{checked && <div className={`${styles.result} ${chosen === current.answer ? styles.right : styles.wrong}`}><b>{chosen === current.answer ? "✓ Correct" : "Not quite. Here is why:"}</b>{current.why}</div>}</div>
    </>}

    {done && questions && <div aria-live="polite">
      <p className={styles.score}>{score} / {total} · {Math.round(score / total * 100)}%</p>
      <p><strong>{understanding(Math.round(score / total * 100))}.</strong> {score === total ? "You answered every question correctly." : score / total >= 0.6 ? "Read the explanation for the questions you missed, then try a new set." : "Go back to the explanation at the top of the page, try the simulation if there is one, then take the test again."}</p>
      <div className={styles.actions} style={{ marginTop: 0 }}><button type="button" className="button primary" onClick={start}>Try new questions</button></div>
    </div>}
  </section>;
}
