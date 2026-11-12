import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockBanks, mockExams } from "@/lib/mock-exams/catalog";
import { getBoard } from "@/lib/exam-prep/catalog";
import { Breadcrumbs, Notice } from "@/components/exam-prep/Shell";
import { jsonLd, localizedMetadata, localizedUrl } from "@/lib/seo/metadata";
import page from "@/components/exam-prep/examPrep.module.css";
import styles from "@/components/mock-exams/mockExams.module.css";

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/mock-exams", "Free Timed Mock Exams: Physics & Chemistry MCQ Practice", "Timed mock exams with original exam-style questions for Cambridge AS Physics 9702 and IGCSE Chemistry 0620. Instant marking, worked explanations and linked labs.", { englishOnly: true });
}

export default async function MockExamsPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  const list = { "@context": "https://schema.org", "@type": "CollectionPage", name: "LearnerKits mock exams", url: localizedUrl("en", "/mock-exams"), inLanguage: "en", mainEntity: { "@type": "ItemList", itemListElement: mockExams.map((exam, index) => ({ "@type": "ListItem", position: index + 1, name: `${exam.title} — ${exam.paper}`, url: localizedUrl("en", `/mock-exams/${exam.id}`) })) } };
  return <main className={`container ${page.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(list)} />
    <Breadcrumbs items={[{ name: "Mock Exams", path: "/mock-exams" }]} />
    <header className={page.hero}>
      <span className="eyebrow">Mock exam centre</span>
      <h1>Practise like it’s exam day.</h1>
      <p>Choose a paper, start the clock, answer original exam-style questions and get marked instantly. Review each mistake with a worked explanation and a related science lab.</p>
      <div className={page.actions}><span className={`${page.badge} ${page.free}`}>✓ Free timed starter mocks</span><span className={`${page.badge} ${page.paid}`}>✦ More practice sets in Premium</span></div>
    </header>
    <div className={page.sectionHead}><h2>Choose your practice paper</h2><p>The official paper format is referenced for context; every question is independently written.</p></div>
    <div className={styles.grid}>{mockExams.map((exam) => <article key={exam.id} className={styles.card}>
      <div className={styles.cardTop}><span className={styles.cardId}>{getBoard(exam.board)?.name.toUpperCase()} · {exam.code}</span><span className={`${page.badge} ${exam.premium ? page.paid : page.free}`}>{exam.premium ? "✦ Premium" : "✓ Free sample"}</span></div>
      <div><h3>{exam.title}</h3><p style={{ color: "var(--text)", fontWeight: 750, marginTop: 4 }}>{exam.paper}</p><p style={{ marginTop: 8 }}>{exam.subtitle}</p></div>
      <div className={styles.pills}><span>▤ {mockBanks[exam.bank].length} questions</span><span>◷ {exam.minutes} min</span><span>✓ Auto marked</span></div>
      <div className={styles.reference}><b>Official paper:</b> {exam.official} · {exam.year}. This shorter practice set is <b>not</b> an official or complete paper. <a href={exam.source} target="_blank" rel="noopener noreferrer">Syllabus ↗</a></div>
      <div className={styles.foot}><span className={styles.cardId}>{exam.premium ? "Requires LearnerKits Premium" : "No sign-up needed"}</span><Link className={exam.premium ? "button" : "button primary"} href={`/en/mock-exams/${exam.id}`} aria-label={`${exam.premium ? "Open" : "Start"} ${exam.title} ${exam.paper}`}>{exam.premium ? "Open set →" : "Start test →"}</Link></div>
    </article>)}</div>
    <Notice><strong>Important:</strong> these are shortened mock exams with original questions. The official Cambridge Physics 9702 Paper 1 has 40 questions in 75 minutes and IGCSE Chemistry 0620 Paper 2 has 40 questions in 45 minutes. These sets are not official papers, are not endorsed by Cambridge, and do not predict exam grades. Revising a topic first? <Link href="/en/exam-prep">Go to Exam Prep →</Link></Notice>
  </main>;
}
