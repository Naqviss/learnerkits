import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { boards, getBoard, isBoardIndexable } from "@/lib/exam-prep/catalog";
import { Breadcrumbs, IndependenceNotice } from "@/components/exam-prep/Shell";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

type Props = { params: Promise<{ locale: string; board: string }> };
export function generateStaticParams() { return boards.map((board) => ({ locale: "en", board: board.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, board: id } = await params, board = getBoard(id);
  if (locale !== "en" || !board) return {};
  return localizedMetadata("en", `/exam-prep/${id}`, `${board.name} Exam Prep: Choose Your Level`, `Science exam preparation for ${board.name} (${board.sub}): pick your level to see Physics and Chemistry topics with interactive labs and practice questions.`, { englishOnly: true, noIndex: !isBoardIndexable(id) });
}

export default async function BoardPage({ params }: Props) {
  const { locale, board: id } = await params, board = getBoard(id);
  if (locale !== "en" || !board) notFound();
  return <main className={`container ${styles.page}`}>
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }, { name: board.name, path: `/exam-prep/${id}` }]} />
    <header className={styles.hero}><span className="eyebrow">Step 2 of 4 · {board.short}</span><h1>{board.name} levels</h1><p>Choose the qualification or school level that matches your exam. Levels are specific to each board and are not interchangeable.</p></header>
    <div className={styles.tiles}>{board.levels.map((level, index) => <Link key={level.id} className={styles.tile} style={{ "--tint": board.color } as React.CSSProperties} href={`/en/exam-prep/${id}/${level.id}`}>
      <div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true">↗</span></div>
      <h2 style={{ fontSize: "1.15rem", margin: "6px 0 0" }}>{level.name}</h2><p>{level.detail}</p><span className={styles.subline}>View subjects →</span>
    </Link>)}</div>
    <IndependenceNotice />
  </main>;
}
