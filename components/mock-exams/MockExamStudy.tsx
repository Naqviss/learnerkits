"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getBoard } from "@/lib/exam-prep/catalog";
import { getMockExam, mockBanks, mockExamHref, mockExams, type MockExam } from "@/lib/mock-exams/catalog";
import { getSimulationCard } from "@/lib/subjects/catalog";
import { Notice } from "@/components/exam-prep/Notices";
import { PremiumGate } from "@/components/exam-prep/PremiumGate";
import { MockExamRunner } from "./MockExamRunner";
import page from "@/components/exam-prep/examPrep.module.css";
import styles from "./mockExams.module.css";

// The signed-in mock exam area inside /en/mock-exams. Each practice set opens here with ?exam=<id>
// (the former public /en/mock-exams/<id> pages 301 here), and the questions load only for signed-in
// students (see MockExamStudyLoader), so they are not in the public HTML.

export function MockExamList() {
  return <div className={styles.grid}>{mockExams.map((exam) => <article key={exam.id} className={styles.card}>
    <div className={styles.cardTop}><span className={styles.cardId}>{getBoard(exam.board)?.name.toUpperCase()} · {exam.code}</span><span className={`${page.badge} ${exam.premium ? page.paid : page.free}`}>{exam.premium ? "✦ Premium" : "✓ Free sample"}</span></div>
    <div><h3>{exam.title}</h3><p style={{ color: "var(--text)", fontWeight: 750, marginTop: 4 }}>{exam.paper}</p><p style={{ marginTop: 8 }}>{exam.subtitle}</p></div>
    <div className={styles.pills}><span>▤ {mockBanks[exam.bank].length} questions</span><span>◷ {exam.minutes} min</span><span>✓ Auto marked</span></div>
    <div className={styles.foot}><span className={styles.cardId}>{exam.premium ? "Requires LearnerKits Premium" : "Ready to start"}</span><Link className={exam.premium ? "button" : "button primary"} href={mockExamHref(exam.id)} aria-label={`${exam.premium ? "Open" : "Start"} ${exam.title} ${exam.paper}`}>{exam.premium ? "Open set →" : "Start test →"}</Link></div>
  </article>)}</div>;
}

export function MockExamView({ exam }: { exam: MockExam }) {
  const questions = mockBanks[exam.bank];
  const labTitles = Object.fromEntries(questions.flatMap((question) => { const card = question.lab ? getSimulationCard(question.lab) : undefined; return card ? [[card.slug, card.title]] : []; }));
  const runner = <MockExamRunner exam={exam} questions={questions} labTitles={labTitles} />;
  return <div className={page.page}>
    <nav className={page.breadcrumbs} aria-label="Mock exam steps"><Link href={mockExamHref()}>All mock exams</Link><span aria-hidden="true">/</span><span aria-current="page">{exam.title} {exam.code}</span></nav>
    <header className={page.hero}>
      <span className="eyebrow">Cambridge International · {exam.code} · {exam.premium ? "Premium set" : "Free sample"}</span>
      <h2 style={{ fontSize: "clamp(1.6rem,3.2vw,2.4rem)", margin: "12px 0 14px" }}>{exam.title} mock exam</h2>
      <p>{exam.paper} · {questions.length} original questions · {exam.minutes} minutes · {exam.subtitle}.</p>
    </header>
    {exam.premium ? <PremiumGate title="This practice set is part of Premium" description="Unlock extra timed practice sets with deeper calculations and worked explanations. The starter mock for this paper is free.">{runner}</PremiumGate> : runner}
    <Notice><strong>Original practice, not an official paper.</strong> The official paper has {exam.official} ({exam.year} syllabus, <a href={exam.source} target="_blank" rel="noopener noreferrer">source ↗</a>). This shorter set is independently written, is not endorsed by Cambridge, and does not predict exam grades.</Notice>
  </div>;
}

export default function MockExamStudy() {
  const id = useSearchParams().get("exam");
  const exam = id ? getMockExam(id) : undefined;
  return exam ? <MockExamView key={exam.id} exam={exam} /> : <MockExamList />;
}
