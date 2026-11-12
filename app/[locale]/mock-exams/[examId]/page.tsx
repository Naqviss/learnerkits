import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMockExam, mockBanks, mockExams } from "@/lib/mock-exams/catalog";
import { Breadcrumbs, Notice } from "@/components/exam-prep/Shell";
import { PremiumGate } from "@/components/exam-prep/PremiumGate";
import { MockExamRunner } from "@/components/mock-exams/MockExamRunner";
import { localizedMetadata } from "@/lib/seo/metadata";
import { getSimulationCard } from "@/lib/subjects/catalog";
import page from "@/components/exam-prep/examPrep.module.css";

type Props = { params: Promise<{ locale: string; examId: string }> };
export function generateStaticParams() { return mockExams.map((exam) => ({ locale: "en", examId: exam.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, examId } = await params, exam = getMockExam(examId);
  if (locale !== "en" || !exam) return {};
  const count = mockBanks[exam.bank].length;
  return localizedMetadata("en", `/mock-exams/${exam.id}`, `${exam.title} ${exam.code} Mock Exam: ${exam.paper.replace(" · ", " ")}`, `A ${exam.minutes}-minute timed mock with ${count} original ${exam.title} ${exam.code} multiple-choice questions, instant marking and worked explanations. ${exam.subtitle}.`, { englishOnly: true, noIndex: exam.premium });
}

export default async function MockExamPage({ params }: Props) {
  const { locale, examId } = await params, exam = getMockExam(examId);
  if (locale !== "en" || !exam) notFound();
  const questions = mockBanks[exam.bank];
  const labTitles = Object.fromEntries(questions.flatMap((question) => { const card = question.lab ? getSimulationCard(question.lab) : undefined; return card ? [[card.slug, card.title]] : []; }));
  const runner = <MockExamRunner exam={exam} questions={questions} labTitles={labTitles} />;
  return <main className={`container ${page.page}`}>
    <Breadcrumbs items={[{ name: "Mock Exams", path: "/mock-exams" }, { name: `${exam.title} ${exam.code}`, path: `/mock-exams/${exam.id}` }]} />
    <header className={page.hero}>
      <span className="eyebrow">Cambridge International · {exam.code} · {exam.premium ? "Premium set" : "Free sample"}</span>
      <h1>{exam.title} mock exam</h1>
      <p>{exam.paper} · {questions.length} original questions · {exam.minutes} minutes · {exam.subtitle}.</p>
    </header>
    {exam.premium ? <PremiumGate title="This practice set is part of Premium" description="Unlock extra timed practice sets with deeper calculations and worked explanations. The starter mock for this paper is free.">{runner}</PremiumGate> : runner}
    <Notice><strong>Original practice, not an official paper.</strong> The official paper has {exam.official} ({exam.year} syllabus, <a href={exam.source} target="_blank" rel="noopener noreferrer">source ↗</a>). This shorter set is independently written, is not endorsed by Cambridge, and does not predict exam grades.</Notice>
  </main>;
}
