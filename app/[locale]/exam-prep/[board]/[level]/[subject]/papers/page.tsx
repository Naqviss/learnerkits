import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { coursePath, courseTitle, courses, getBoard, getLevel, getSubject, isCourse } from "@/lib/exam-prep/catalog";
import { getPapers, type Paper } from "@/lib/exam-prep/papers";
import { Breadcrumbs, Notice } from "@/components/exam-prep/Shell";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

type Props = { params: Promise<{ locale: string; board: string; level: string; subject: string }> };
// Only courses whose paper structure we have checked against the published specification get this page.
export function generateStaticParams() { return courses.filter((course) => getPapers(course)).map((course) => ({ locale: "en", ...course })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, ...course } = await params;
  if (locale !== "en" || !isCourse(course) || !getPapers(course)) return {};
  const title = courseTitle(course);
  return localizedMetadata("en", `${coursePath(course)}/papers`, `${title} Papers Explained: Format, Time & Marks | Exam Prep`, `See every ${title} exam paper: what it assesses, its duration and marks, and where to practise for it, including practical-skills papers.`, { englishOnly: true });
}

function action(paper: Paper, base: string, cambridge: boolean): { href: string; label: string } {
  if (paper.action === "mock") return { href: cambridge ? "/en/mock-exams/9702free" : "/en/mock-exams", label: "Try a sample MCQ mock →" };
  if (paper.action === "practical") return paper.type === "analysis" ? { href: "/en/exam-prep/practicals/pendulum", label: "Practise data analysis →" } : { href: "/en/exam-prep/practicals/circuit", label: "Practise practical skills →" };
  return { href: `/en${base}`, label: "Revise the topics →" };
}

export default async function PapersPage({ params }: Props) {
  const { locale, ...course } = await params, set = isCourse(course) ? getPapers(course) : null;
  if (locale !== "en" || !set) notFound();
  const board = getBoard(course.board)!, level = getLevel(course.board, course.level)!, subject = getSubject(course.subject)!, base = coursePath(course), cambridge = set.key === "cambridge9702";
  return <main className={`container ${styles.page}`}>
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }, { name: board.name, path: `/exam-prep/${board.id}` }, { name: level.name, path: `/exam-prep/${board.id}/${level.id}` }, { name: subject.name, path: base }, { name: "Exam papers", path: `${base}/papers` }]} />
    <header className={styles.hero}>
      <span className="eyebrow">Paper navigator · {courseTitle(course)}</span>
      <h1>Choose your exact exam paper.</h1>
      <p>See what each paper assesses, its format and official duration, then continue into timed practice, topic revision or practical-skills practice.{cambridge && " Details follow the published 2025–2027 syllabus."}</p>
    </header>
    {cambridge && <div style={{ marginBottom: 18 }}><Notice><strong>AS and A Level:</strong> AS Level assessment uses Papers 1–3. The full A Level also includes Papers 4 and 5. Follow your own component entry route.</Notice></div>}
    <div className={styles.paperGrid}>{set.papers.map((paper) => {
      const link = action(paper, base, cambridge), practical = paper.type === "practical" || paper.type === "analysis";
      return <article key={paper.n} className={`${styles.paperCard} ${practical ? styles.emphasis : ""}`}>
        <div className={styles.tileTop}><span className={styles.paperNum}>{paper.n.toUpperCase()}</span><span className={`${styles.badge} ${practical ? styles.paid : styles.free}`}>{practical ? "Practical skills" : "Exam format"}</span></div>
        <h2 style={{ fontSize: "1.15rem", margin: 0, letterSpacing: "-.03em" }}>{paper.name}</h2>
        <p>{paper.detail}</p>
        <div className={styles.chips}><span>◷ {paper.time}</span><span>▤ {paper.marks}</span><span>{paper.level}</span></div>
        <div className={styles.actions} style={{ marginTop: 4 }}><Link className="button primary" href={link.href}>{link.label}</Link><a className="textLink" href={set.source} target="_blank" rel="noopener noreferrer">Official specification ↗</a></div>
      </article>;
    })}</div>
    <Notice><strong>Source policy:</strong> paper names, durations and marks come from the board’s published specification. Always check your exam year and component entry rules. Practical papers require hands-on laboratory work; browser practice is supplementary. LearnerKits practice material is original and is not endorsed by {board.name}.</Notice>
  </main>;
}
