"use client";
import { useState } from "react";
import styles from "./examPrep.module.css";

type Props = { question: string; options: readonly string[]; answer: number; hint: string; why: string };

export function TopicQuiz({ question, options, answer, hint, why }: Props) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const correct = chosen === answer;
  return <section className={styles.panel} aria-labelledby="topic-quiz">
    <div className={styles.panelTop}><h2 id="topic-quiz">Check your understanding</h2><span className={`${styles.badge} ${styles.paid}`}>Original practice question</span></div>
    <p>{question}</p>
    <div className={styles.options} role="group" aria-label="Answer choices">
      {options.map((option, index) => <button type="button" key={option} disabled={checked} aria-pressed={chosen === index} className={`${styles.option} ${checked && index === answer ? styles.correct : ""}`} onClick={() => setChosen(index)}>{String.fromCharCode(65 + index)}. {option}</button>)}
    </div>
    <div className={styles.actions} style={{ marginTop: 0 }}>
      <button type="button" className="button primary" disabled={chosen === null || checked} onClick={() => setChecked(true)}>Check answer</button>
      {!checked && <button type="button" className="button" aria-expanded={showHint} onClick={() => setShowHint(true)}>Give me a hint</button>}
      {checked && <button type="button" className="button" onClick={() => { setChecked(false); setChosen(null); setShowHint(false); }}>Try again</button>}
    </div>
    <div aria-live="polite">
      {checked ? <div className={`${styles.result} ${correct ? styles.right : styles.wrong}`}><b>{correct ? "✓ Correct — well done!" : "Not quite. Here is the worked solution:"}</b>{why}</div>
        : showHint && <div className={styles.result}><b>Hint</b>{hint}</div>}
    </div>
  </section>;
}
