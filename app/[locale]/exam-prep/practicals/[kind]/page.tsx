import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPracticalKind, practicalKinds, type PracticalKind } from "@/lib/exam-prep/practical";
import { paperSources } from "@/lib/exam-prep/papers";
import { Breadcrumbs, Notice } from "@/components/exam-prep/Shell";
import { PracticalStation } from "@/components/exam-prep/PracticalStation";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

const copy: Record<PracticalKind, { tab: string; title: string; lead: string; seoTitle: string; seoDescription: string; lab: string; labName: string }> = {
  circuit: { tab: "Resistance experiment", title: "Determine the resistance of an unknown resistor", lead: "Measure the current for several voltages, plot V against I and calculate the resistance from the gradient.", seoTitle: "Virtual Physics Practical: Find Resistance from a V–I Graph", seoDescription: "Practise physics practical skills online: take voltage and current readings, plot a best-fit V–I graph, find resistance from the gradient and get marked feedback.", lab: "circuit-builder", labName: "Circuit Builder" },
  pendulum: { tab: "Pendulum experiment", title: "Investigate the period of a simple pendulum", lead: "Time ten oscillations at different lengths, plot T² against L and estimate gravitational acceleration.", seoTitle: "Virtual Physics Practical: Pendulum T² vs L Graph and g", seoDescription: "Practise data analysis for physics practical papers: time a pendulum, plot T² against length, find g from the gradient and get marked feedback.", lab: "pendulum-physics", labName: "Pendulum Physics Lab" },
};

type Props = { params: Promise<{ locale: string; kind: string }> };
export function generateStaticParams() { return practicalKinds.map((kind) => ({ locale: "en", kind })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, kind } = await params;
  if (locale !== "en" || !isPracticalKind(kind)) return {};
  return localizedMetadata("en", `/exam-prep/practicals/${kind}`, `${copy[kind].seoTitle} | Exam Prep`, copy[kind].seoDescription, { englishOnly: true });
}

export default async function PracticalPage({ params }: Props) {
  const { locale, kind } = await params;
  if (locale !== "en" || !isPracticalKind(kind)) notFound();
  const text = copy[kind];
  return <main className={`container ${styles.page}`}>
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }, { name: "Practical skills", path: `/exam-prep/practicals/${kind}` }]} />
    <header className={styles.hero}>
      <span className="eyebrow">Practical skills · Original short practice</span>
      <h1>{text.title}</h1>
      <p>{text.lead} Collect data with interactive apparatus and get feedback on measurement, graph and evaluation skills.</p>
    </header>
    <nav className={styles.tabs} aria-label="Practical experiments">{practicalKinds.map((item) => <Link key={item} href={`/en/exam-prep/practicals/${item}`} aria-current={item === kind ? "page" : undefined}>{copy[item].tab}</Link>)}</nav>
    {/* key: switching experiment starts a fresh station */}
    <PracticalStation key={kind} kind={kind} />
    <Notice><strong>Assessment context:</strong> Cambridge Physics 9702 Paper 3 is a 2-hour laboratory practical worth 40 marks and Paper 5 is a 75-minute paper worth 30 marks (<a href={paperSources.cambridge9702} target="_blank" rel="noopener noreferrer">2025–2027 syllabus ↗</a>). This 20-minute virtual activity is original LearnerKits practice. It is not an official paper, is not endorsed by any exam board, and does not replace experiments with real equipment. Want the full experiment? <Link href={`/en/simulations/${text.lab}`}>Open the {text.labName} →</Link></Notice>
  </main>;
}
