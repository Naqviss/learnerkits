"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/session";
import { classroom } from "@/lib/classroom/client";
import type { MockAttempt } from "@/lib/classroom/types";
import { getMockExam } from "@/lib/mock-exams/catalog";
import { loadProgress, rankForXp, rankGoals, type ProgressState } from "@/lib/progression/storage";
import type { Messages } from "@/lib/i18n/getMessages";
import styles from "@/components/classroom/classroom.module.css";

function ExamHistory() {
  const [attempts, setAttempts] = useState<MockAttempt[] | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    void classroom<{ attempts: MockAttempt[] }>("mockAttempts").then((result) => {
      if (!active) return;
      if (result.ok) setAttempts(result.data.attempts);
      else setError(result.error);
    });
    return () => { active = false; };
  }, [retry]);

  return <section className={styles.panel}>
    <div className={styles.between}>
      <h2>Recent mock exams</h2>
      <Link className={styles.btn} href="/en/mock-exams">Browse mock exams</Link>
    </div>
    {error ? <p role="alert">{error} <button type="button" className={styles.btn} onClick={() => { setError(""); setRetry(retry + 1); }}>Try again</button></p>
      : attempts === null ? <p role="status">Loading your results…</p>
      : attempts.length === 0 ? <p>Complete a mock exam while signed in to see your results here.</p>
      : <ul className={styles.progressResults}>{attempts.slice(0, 6).map((attempt) => {
        const exam = getMockExam(attempt.exam_id);
        const date = new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(attempt.created_at));
        return <li className={styles.item} key={attempt.id}>
          <div><h3>{exam?.title ?? "Mock exam"}</h3><p>{exam ? `${exam.paper} · ${date}` : date}</p></div>
          <strong>{attempt.score} / {attempt.total}</strong>
        </li>;
      })}</ul>}
  </section>;
}

export function ProgressClient({ locale, m }: { locale: string; m: Messages }) {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const { status, session } = useAuth();
  useEffect(() => { setProgress(loadProgress()); }, []);

  const rank = progress ? m.progress[rankForXp(progress.xp)] : "—";
  const goal = progress && rankGoals.find((xp) => xp > progress.xp);
  const format = new Intl.NumberFormat(locale);

  return <div className={styles.progressPage}>
    <header className={`${styles.hero} ${styles.progressHero}`}>
      <div>
        <h1>{m.progress.title}</h1>
        <p>{m.progress.subtitle}</p>
        <Link className="button primary" href={`/${locale}/simulations`}>{m.home.explore}</Link>
      </div>
      <div className={styles.rankCard}>
        <span>{m.progress.rank}</span>
        <strong>{rank}</strong>
        {progress && goal && <div className={styles.completion}>
          <label htmlFor="rank-progress">{m.progress[rankForXp(goal)]} · {format.format(progress.xp)} / {format.format(goal)} XP</label>
          <progress id="rank-progress" value={progress.xp} max={goal} />
        </div>}
      </div>
    </header>
    <div className={styles.grid2}>
      <div className={styles.stat}><span>XP</span><strong>{progress ? format.format(progress.xp) : "—"}</strong></div>
      <div className={styles.stat}><span>{m.progress.completed}</span><strong>{progress ? format.format(progress.completedMissionIds.length) : "—"}</strong></div>
    </div>
    <p className={styles.hint}>{m.progress.local}</p>
    {locale === "en" && status === "signedIn" && session && <ExamHistory key={session.user.id} />}
    {locale === "en" && <section className={styles.panel}>
      <div className={styles.between}>
        <div><h2>My classroom</h2><p className={styles.hint}>See your assignments, marks and teacher feedback.</p></div>
        <Link className={styles.btn} href="/en/classroom">{status === "signedOut" ? "Sign in to your classroom" : "Open classroom"} →</Link>
      </div>
    </section>}
  </div>;
}
