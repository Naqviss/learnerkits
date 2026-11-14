import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { boards, getBoard, getLevel, getSyllabus, isLevelIndexable, isVerified, subjectCode, subjects } from "@/lib/exam-prep/catalog";
import { Breadcrumbs, IndependenceNotice } from "@/components/exam-prep/Shell";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

type Props = { params: Promise<{ locale: string; board: string; level: string }> };
export function generateStaticParams() { return boards.flatMap((board) => board.levels.map((level) => ({ locale: "en", board: board.id, level: level.id }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, board: boardId, level: levelId } = await params, board = getBoard(boardId), level = getLevel(boardId, levelId);
  if (locale !== "en" || !board || !level) return {};
  const name = `${board.short} ${level.name.replace(" · ", " ")}`;
  return localizedMetadata("en", `/exam-prep/${boardId}/${levelId}`, `${name} Exam Prep: Science and Maths Topics`, `${name} exam preparation: choose Physics, Chemistry, Biology or Mathematics to browse syllabus topics with short lessons, interactive labs and practice questions.`, { englishOnly: true, noIndex: !isLevelIndexable(boardId, levelId) });
}

export default async function LevelPage({ params }: Props) {
  const { locale, board: boardId, level: levelId } = await params, board = getBoard(boardId), level = getLevel(boardId, levelId);
  if (locale !== "en" || !board || !level) notFound();
  return <main className={`container ${styles.page}`}>
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }, { name: board.name, path: `/exam-prep/${boardId}` }, { name: level.name, path: `/exam-prep/${boardId}/${levelId}` }]} />
    <header className={styles.hero}><span className="eyebrow">Step 3 of 4 · {board.short} · {level.name}</span><h1>What subject are you studying?</h1><p>{board.name} · {level.name} ({level.detail}). Choose a subject to see its topics.</p></header>
    <div className={styles.tiles}>{subjects.map((subject) => {
      const course = { board: boardId, level: levelId, subject: subject.id };
      const tint = { "--tint": subject.color } as React.CSSProperties;
      if (subject.soon) return <div key={subject.id} className={`${styles.tile} ${styles.soon}`} style={tint}><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.icon}</span><span className={styles.badge}>Coming soon</span></div><h2 style={{ fontSize: "1.15rem", margin: "6px 0 0" }}>{subject.name}</h2><p>{subject.desc}</p><span className={styles.subline} style={{ color: "var(--muted)" }}>Not in the current lab catalog</span></div>;
      const code = subjectCode(course);
      return <Link key={subject.id} className={styles.tile} style={tint} href={`/en/exam-prep/${boardId}/${levelId}/${subject.id}`}>
        <div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.icon}</span><span className={`${styles.badge} ${isVerified(course) ? styles.free : ""}`}>{isVerified(course) ? "Published syllabus" : "Illustrative preview"}</span></div>
        <h2 style={{ fontSize: "1.15rem", margin: "6px 0 0" }}>{subject.name}{code && ` · ${code}`}</h2><p>{subject.desc}</p><span className={styles.subline}>{getSyllabus(course).length} topics →</span>
      </Link>;
    })}</div>
    <IndependenceNotice />
  </main>;
}
