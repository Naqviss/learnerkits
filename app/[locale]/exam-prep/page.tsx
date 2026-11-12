import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { boards, subjects } from "@/lib/exam-prep/catalog";
import { Breadcrumbs, IndependenceNotice } from "@/components/exam-prep/Shell";
import { jsonLd, localizedMetadata, localizedUrl } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/exam-prep", "Exam Prep: Science Revision by Exam Board, with Simulations", "Choose your exam board and level, find your Physics or Chemistry syllabus topic, learn the concept, test it in an interactive lab, and practise exam-style questions.", { englishOnly: true });
}

export default async function ExamPrepPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  const collection = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "LearnerKits Exam Prep", url: localizedUrl("en", "/exam-prep"), inLanguage: "en",
    mainEntity: { "@type": "ItemList", itemListElement: boards.map((board, index) => ({ "@type": "ListItem", position: index + 1, name: board.name, url: localizedUrl("en", `/exam-prep/${board.id}`) })) },
  };
  return <main className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }]} />
    <header className={styles.hero}>
      <span className="eyebrow">Exam Prep · Learn by experimenting</span>
      <h1>Your syllabus. Your breakthrough.</h1>
      <p>Select your exam board, find the topic you are studying, understand the concept in minutes, then test it with an interactive science lab and practice questions.</p>
      <div className={styles.actions}><Link className="button primary" href="/en/mock-exams">Try a free mock exam →</Link><Link className="button" href="/en/exam-prep/cambridge/as/physics/papers">Choose an exam paper</Link></div>
    </header>
    <section aria-labelledby="boards-heading">
      <div className={styles.sectionHead}><span className="eyebrow">Step 1 of 4</span><h2 id="boards-heading">Which exam board do you study?</h2><p>Start with your curriculum. You can change it at any time.</p></div>
      <div className={styles.tiles}>{boards.map((board) => <Link key={board.id} className={styles.tile} style={{ "--tint": board.color } as React.CSSProperties} href={`/en/exam-prep/${board.id}`}>
        <div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{board.icon}</span><span aria-hidden="true">↗</span></div>
        <h3>{board.name}</h3><p>{board.sub}</p><span className={styles.subline}>Explore levels →</span>
      </Link>)}</div>
    </section>
    <section aria-labelledby="subjects-heading">
      <div className={styles.sectionHead}><span className="eyebrow">Subjects</span><h2 id="subjects-heading">What you can study</h2><p>Physics and Chemistry have topic lessons linked to live LearnerKits labs. Biology and Mathematics are in development.</p></div>
      <div className={styles.tiles}>{subjects.map((subject) => subject.soon
        ? <div key={subject.id} className={`${styles.tile} ${styles.soon}`} style={{ "--tint": subject.color } as React.CSSProperties}><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.icon}</span><span className={styles.badge}>Coming soon</span></div><h3>{subject.name}</h3><p>{subject.desc}</p></div>
        : <Link key={subject.id} className={styles.tile} style={{ "--tint": subject.color } as React.CSSProperties} href={`/en/exam-prep/cambridge/${subject.id === "physics" ? "as" : "igcse"}/${subject.id}`}><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.icon}</span><span className={`${styles.badge} ${styles.free}`}>Explore topics</span></div><h3>{subject.name}</h3><p>{subject.desc}</p><span className={styles.subline}>Cambridge {subject.id === "physics" ? "AS Level" : "IGCSE"} {subject.name} →</span></Link>)}</div>
    </section>
    <IndependenceNotice />
  </main>;
}
