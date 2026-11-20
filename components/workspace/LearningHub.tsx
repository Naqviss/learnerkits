"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/session";
import { classroom } from "@/lib/classroom/client";
import type { MockAttempt } from "@/lib/classroom/types";
import styles from "./learningHub.module.css";

type HubKind = "simulations" | "exam-prep" | "mock-exams";
type Progress = { completed: number; attempts: number; average: number | null; recent: { title: string; detail: string }[] };

const emptyProgress: Progress = { completed: 0, attempts: 0, average: null, recent: [] };

function readCompletedSimulations() {
  const keys = [
    "learnerkits-physics-missions-v1",
    "learnerkits-chemistry-missions-v1",
    "learnerkits-space-labs-v1",
    "learnerkits-biology-missions-v1",
    "learnerkits-earth-expeditions-v1",
    "learnerkits-mathematics-missions-v1",
  ];
  const completed = new Set<string>();
  for (const key of keys) {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
      const list = Array.isArray(value) ? value : value && typeof value === "object" && Array.isArray((value as { completed?: unknown }).completed) ? (value as { completed: unknown[] }).completed : [];
      for (const item of list) if (typeof item === "string") completed.add(item);
    } catch { /* A missing or older notebook simply contributes no completed labs. */ }
  }
  return completed.size;
}

function readTopicProgress(): Progress {
  try {
    const scores = JSON.parse(localStorage.getItem("learnerkits-exam-prep-scores") ?? "{}") as Record<string, { best?: number; last?: number; attempts?: number }>;
    const entries = Object.entries(scores).filter(([, value]) => value && typeof value === "object");
    const attempts = entries.reduce((sum, [, value]) => sum + (Number(value.attempts) || 0), 0);
    const average = entries.length ? Math.round(entries.reduce((sum, [, value]) => sum + (Number(value.best) || 0), 0) / entries.length) : null;
    return {
      completed: entries.length,
      attempts,
      average,
      recent: entries.slice(-5).reverse().map(([topic, value]) => ({ title: topic.replace(/[-_]/g, " "), detail: `Best score ${Number(value.best) || 0}% · ${Number(value.attempts) || 0} attempts` })),
    };
  } catch { return emptyProgress; }
}

export function LearningHub({ kind, title, description, total, secondaryCount, secondaryLabel, publicContent, children }: {
  kind: HubKind;
  title: string;
  description: string;
  total: number;
  secondaryCount: number;
  secondaryLabel: string;
  publicContent: ReactNode;
  children: ReactNode;
}) {
  const { status } = useAuth();
  const [tab, setTab] = useState<"overview" | "progress">("overview");
  const [progress, setProgress] = useState<Progress>(emptyProgress);

  useEffect(() => {
    if (status !== "signedIn") return;
    if (kind === "simulations") {
      const completed = readCompletedSimulations();
      setProgress({ completed, attempts: completed, average: total ? Math.round(completed / total * 100) : null, recent: [] });
      return;
    }
    if (kind === "exam-prep") {
      setProgress(readTopicProgress());
      return;
    }
    void classroom<{ attempts: MockAttempt[] }>("mockAttempts").then((result) => {
      if (!result.ok) return;
      const attempts = result.data.attempts;
      const average = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.total ? attempt.score / attempt.total * 100 : 0), 0) / attempts.length) : null;
      setProgress({
        completed: new Set(attempts.map((attempt) => attempt.exam_id)).size,
        attempts: attempts.length,
        average,
        recent: attempts.slice(0, 5).map((attempt) => ({ title: attempt.exam_id, detail: `${attempt.score} / ${attempt.total} · ${Math.floor(attempt.seconds / 60)} min` })),
      });
    });
  }, [kind, status, total]);

  const copy = useMemo(() => kind === "simulations"
    ? { item: "Labs", completed: "Missions completed", attempt: "Activities finished", average: "Library progress", list: "Simulation library" }
    : kind === "exam-prep"
      ? { item: "Exam boards", completed: "Topics tested", attempt: "Topic-test attempts", average: "Average best score", list: "Choose an exam board" }
      : { item: "Practice papers", completed: "Papers attempted", attempt: "Total attempts", average: "Average score", list: "Available mock exams" }, [kind]);

  if (status !== "signedIn") return <>{publicContent}</>;

  const percent = progress.average === null ? "—" : `${progress.average}%`;
  return <main className={styles.page}>
    <header className={styles.header}>
      <div><span className={styles.eyebrow}>Learning workspace</span><h1>{title}</h1><p>{description}</p></div>
    </header>
    <div className={styles.tabs} role="tablist" aria-label={`${title} sections`}>
      <button type="button" role="tab" aria-selected={tab === "overview"} onClick={() => setTab("overview")}>Overview</button>
      <button type="button" role="tab" aria-selected={tab === "progress"} onClick={() => setTab("progress")}>My progress</button>
      <a href="#learning-list">All {copy.item.toLowerCase()}</a>
    </div>

    <section className={styles.tabPanel} role="tabpanel">
      {tab === "overview" ? <>
        <div className={styles.stats}>
          <article><span>{copy.item}</span><strong>{total}</strong><small>Available now</small></article>
          <article><span>{secondaryLabel}</span><strong>{secondaryCount}</strong><small>Browse and choose</small></article>
          <article><span>{copy.completed}</span><strong>{progress.completed}</strong><small>Saved progress</small></article>
          <article><span>{copy.average}</span><strong>{percent}</strong><small>{progress.attempts ? `${progress.attempts} ${copy.attempt.toLowerCase()}` : "Start an activity below"}</small></article>
        </div>
      </> : <div className={styles.progressPanel}>
        <div>
          <span>Overall progress</span><strong>{percent}</strong>
          <div className={styles.track} role="progressbar" aria-label="Overall progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.average ?? 0}><span style={{ width: `${progress.average ?? 0}%` }} /></div>
          <p>{progress.attempts ? `${progress.attempts} ${copy.attempt.toLowerCase()} recorded.` : "Complete an activity and your progress will appear here."}</p>
        </div>
        <div><h2>Recent activity</h2>{progress.recent.length ? <ul>{progress.recent.map((item, index) => <li key={`${item.title}-${index}`}><strong>{item.title}</strong><span>{item.detail}</span></li>)}</ul> : <p>No recent activity yet.</p>}</div>
      </div>}
    </section>

    <section id="learning-list" className={styles.list} aria-labelledby="learning-list-title">
      <div className={styles.listHeading}><div><span className={styles.eyebrow}>Continue learning</span><h2 id="learning-list-title">{copy.list}</h2></div><span>{total} available</span></div>
      {children}
    </section>
  </main>;
}
