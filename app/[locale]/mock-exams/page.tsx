import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockBanks, mockExams, type MockExam } from "@/lib/mock-exams/catalog";
import { getBoard } from "@/lib/exam-prep/catalog";
import { premiumEnabled } from "@/lib/billing/flags";
import { premiumPrice } from "@/lib/premium/copy";
import { Breadcrumbs, Notice } from "@/components/exam-prep/Shell";
import { StudySignIn } from "@/components/exam-prep/StudySignIn";
import { MockExamStudyLoader } from "@/components/mock-exams/MockExamStudyLoader";
import { PremiumCta } from "@/components/premium/PremiumCta";
import { jsonLd, localizedMetadata, localizedUrl } from "@/lib/seo/metadata";
import page from "@/components/exam-prep/examPrep.module.css";
import sales from "@/components/exam-prep/sales.module.css";
import styles from "@/components/mock-exams/mockExams.module.css";
import { LearningHub } from "@/components/workspace/LearningHub";

// Public sales page for the mock exams (signed-out view). The practice sets are for signed-in students
// and open inside the signed-in view below (?exam=<id>); their questions are not in this page's HTML.

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/mock-exams", "Timed Mock Exams: Physics & Chemistry MCQ Practice", "Timed mock exams with original questions for Cambridge AS Physics 9702 and IGCSE Chemistry 0620: what each set covers, how marking works and how to pace yourself.", { englishOnly: true });
}

/** Topics a set draws on, in the order they first appear in its question bank. */
const topicsOf = (exam: MockExam) => [...new Set(mockBanks[exam.bank].map((question) => question.topic))];
const officialCount = (exam: MockExam) => Number(exam.official.match(/^(\d+) questions/)?.[1] ?? 0);
const officialMinutes = (exam: MockExam) => Number(exam.official.match(/(\d+) minutes/)?.[1] ?? 0);
const perQuestion = (minutes: number, questions: number) => {
  const seconds = Math.round(minutes * 60 / questions);
  return seconds >= 60 ? `${Math.floor(seconds / 60)} min ${seconds % 60} s` : `${seconds} s`;
};

export default async function MockExamsPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  const list = { "@context": "https://schema.org", "@type": "CollectionPage", name: "LearnerKits mock exams", url: localizedUrl("en", "/mock-exams"), inLanguage: "en", mainEntity: { "@type": "ItemList", itemListElement: mockExams.map((exam, index) => ({ "@type": "ListItem", position: index + 1, name: `${exam.title} — ${exam.paper}` })) } };
  const physics = mockExams.find((exam) => exam.id === "9702free")!, chemistry = mockExams.find((exam) => exam.id === "0620free")!;
  const free = mockExams.filter((exam) => !exam.premium), premium = mockExams.filter((exam) => exam.premium);
  const sizes = [...new Set(mockExams.map((exam) => mockBanks[exam.bank].length))];
  const minutes = mockExams.map((exam) => exam.minutes);
  const papers = new Set(mockExams.map((exam) => exam.code)).size;

  const publicContent = <main className={`container ${page.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(list)} />
    <Breadcrumbs items={[{ name: "Mock Exams", path: "/mock-exams" }]} />

    <section className={sales.hero} aria-labelledby="mock-title">
      <div>
        <span className="eyebrow">Mock exams · Cambridge 9702 and 0620</span>
        <h1 id="mock-title">Practise like it’s exam day.</h1>
        <p className={sales.lead}>Short, timed multiple-choice mocks for Cambridge AS Level Physics and IGCSE Chemistry, written from scratch by LearnerKits. The clock runs, the paper marks itself the moment you submit, and every mistake comes back with a worked explanation and the topic to revise next.</p>
        <div className={sales.ctaRow}><StudySignIn label="Sign in free to start a mock" lessonLabel="Sign in to open this mock exam" lessonNote="Mock exams are for signed-in students. Sign in with Google (free) and the practice set you followed opens here." /><Link className="button" href="/en/exam-prep">Revise topics first</Link></div>
        <ul className={sales.reassure}><li>{free.length} starter mocks free</li><li>Marked instantly</li><li>No card needed</li></ul>
      </div>
      <figure className={sales.preview} aria-label="Example of a mock exam results screen">
        <div className={sales.previewTop}><span>AS Level Physics · Paper 1</span><span>Results</span></div>
        <p className={sales.previewTitle}>Well paced. Two topics to revisit.</p>
        <div className={sales.result}>
          <div className={sales.ring} style={{ "--score": 80 } as React.CSSProperties}><span>8/10</span></div>
          <dl className={sales.resultFacts}>
            <div><dt>Time used</dt><dd>9:12 of 12:00</dd></div>
            <div><dt>Correct</dt><dd>8</dd></div>
            <div><dt>Wrong</dt><dd>1</dd></div>
            <div><dt>Unanswered</dt><dd>1</dd></div>
          </dl>
        </div>
        <div className={sales.chips} aria-label="Revision priorities"><span>Waves</span><span>D.C. circuits</span></div>
        <figcaption className={sales.caption}>An example of the results screen. Your own score and topics will differ.</figcaption>
      </figure>
    </section>

    <dl className={sales.stats} aria-label="Mock exams in numbers">
      <div><dt>timed practice sets</dt><dd>{mockExams.length}</dd></div>
      <div><dt>Cambridge papers covered</dt><dd>{papers}</dd></div>
      <div><dt>questions in each set</dt><dd>{sizes.join("–")}</dd></div>
      <div><dt>minutes on the clock</dt><dd>{Math.min(...minutes)}–{Math.max(...minutes)}</dd></div>
      <div><dt>free starter sets</dt><dd>{free.length}</dd></div>
    </dl>

    <section className={sales.section} aria-labelledby="sets-heading">
      <div className={sales.head}><span className="eyebrow">Choose a paper</span><h2 id="sets-heading">Four sets, two papers, two levels of difficulty</h2><p>Each paper has a free starter set and a harder Premium set. The official format is quoted for context; every question is independently written.</p></div>
      <div className={styles.grid}>{mockExams.map((exam) => <article key={exam.id} className={styles.card}>
        <div className={styles.cardTop}><span className={styles.cardId}>{getBoard(exam.board)?.name.toUpperCase()} · {exam.code}</span><span className={`${page.badge} ${exam.premium ? page.paid : page.free}`}>{exam.premium ? "✦ Premium" : "✓ Free sample"}</span></div>
        <div><h3>{exam.title}</h3><p style={{ color: "var(--text)", fontWeight: 750, marginTop: 4 }}>{exam.paper}</p><p style={{ marginTop: 8 }}>{exam.subtitle}. Topics: {topicsOf(exam).join(", ")}.</p></div>
        <div className={styles.pills}><span>▤ {mockBanks[exam.bank].length} questions</span><span>◷ {exam.minutes} min</span><span>✓ Auto marked</span></div>
        <div className={styles.reference}><b>Official paper:</b> {exam.official} · {exam.year} syllabus. This shorter practice set is <b>not</b> an official or complete paper. <a href={exam.source} target="_blank" rel="noopener noreferrer">Syllabus ↗</a></div>
      </article>)}</div>
    </section>

    <section className={sales.section} aria-labelledby="how-heading">
      <div className={sales.head}><span className="eyebrow">How a mock runs</span><h2 id="how-heading">From the first question to your revision list</h2></div>
      <ol className={page.stepGrid}>
        <li><span>01</span><h3>Start the clock</h3><p>The timer begins only when you press Start, and it keeps running if you switch tabs, the way an exam hall clock would. When it reaches zero the test submits itself and any question left blank scores zero.</p></li>
        <li><span>02</span><h3>Answer, change, flag</h3><p>Nothing is marked while you work, so you can change an answer as often as you like. Flag a question you want to come back to; the numbered grid shows which questions are answered, which are flagged and where you are.</p></li>
        <li><span>03</span><h3>Submit and see the score</h3><p>After you confirm, the set is marked at once: questions right, wrong and unanswered, your percentage and the time you took. Your result is kept on this device, and in your account as well when you are signed in.</p></li>
        <li><span>04</span><h3>Review the mistakes</h3><p>The review opens on the questions you got wrong. Each shows the correct option, a worked explanation and, where one exists, a link to the LearnerKits lab that models the idea, so you can test it rather than just reread it.</p></li>
      </ol>
    </section>

    <section className={sales.section} aria-labelledby="pace-heading">
      <div className={sales.head}><span className="eyebrow">Pacing</span><h2 id="pace-heading">How long you have for each question</h2><p>Multiple-choice papers test timing as much as knowledge, so the starter sets are deliberately a little tighter than the real thing.</p></div>
      <div className={sales.split}>
        <article className={sales.feature}><b aria-hidden="true">9702</b><h3>{physics.title}, {physics.paper.split(" · ")[0]}</h3><p>The official paper gives {officialMinutes(physics)} minutes for {officialCount(physics)} questions, about {perQuestion(officialMinutes(physics), officialCount(physics))} each. The starter mock gives {physics.minutes} minutes for {mockBanks[physics.bank].length}, about {perQuestion(physics.minutes, mockBanks[physics.bank].length)} each. Calculation questions such as v = u + at or Q = It take longer than definitions, so bank time on the quick ones.</p></article>
        <article className={sales.feature}><b aria-hidden="true">0620</b><h3>{chemistry.title}, {chemistry.paper.split(" · ")[0]}</h3><p>The official paper gives {officialMinutes(chemistry)} minutes for {officialCount(chemistry)} questions, about {perQuestion(officialMinutes(chemistry), officialCount(chemistry))} each. The starter mock gives {chemistry.minutes} minutes for {mockBanks[chemistry.bank].length}, a flat {perQuestion(chemistry.minutes, mockBanks[chemistry.bank].length)} each. Mole and formula questions reward writing the working in the margin even when only the letter is marked.</p></article>
      </div>
    </section>

    <section className={sales.section} aria-labelledby="use-heading">
      <div className={sales.head}><span className="eyebrow">Using your result</span><h2 id="use-heading">Turning a score into a revision plan</h2></div>
      <div className={sales.features}>
        <article className={sales.feature}><b aria-hidden="true">→</b><h3>Read the list, not the percentage</h3><p>The results screen names the topics behind every question you missed or left blank. A 7 out of 10 with three misses in one topic says more than the score itself, so make that topic the plan for your next session.</p></article>
        <article className={sales.feature}><b aria-hidden="true">✎</b><h3>Rebuild each mistake</h3><p>Read the explanation, cover it, and write the reasoning out yourself. If a lab is linked, set up the situation from the question; watching a current change or a reaction slow down makes the rule easier to recall under time pressure.</p></article>
        <article className={sales.feature}><b aria-hidden="true">↻</b><h3>Retest after a gap</h3><p>Leave a few days before sitting the same set again. A retake after a gap shows whether the idea has stuck; an immediate one mostly measures what you remember of the answer key.</p></article>
      </div>
    </section>

    <section className={sales.section} aria-labelledby="plans-heading">
      <div className={sales.head}><span className="eyebrow">Free and Premium</span><h2 id="plans-heading">Two papers free. Harder sets when you want more.</h2></div>
      <div className={sales.compare}>
        <article className={sales.plan}>
          <h3>Free account</h3>
          <p className={sales.price}>$0 <small>with Google sign-in</small></p>
          <ul>
            {free.map((exam) => <li key={exam.id}>{exam.title} {exam.code} starter set: {mockBanks[exam.bank].length} questions in {exam.minutes} minutes</li>)}
            <li>Instant marking, worked explanations and your revision priorities</li>
            <li>Results saved to your account, so past attempts stay with you</li>
            <li>A link from each explanation to the lab that models the idea</li>
          </ul>
          <div className={sales.planFoot}><StudySignIn label="Create a free account" lessonLabel="Sign in to open this mock exam" lessonNote="Mock exams are for signed-in students. Sign in with Google (free) and the practice set you followed opens here." /></div>
        </article>
        <article className={`${sales.plan} ${sales.featured}`}>
          <h3>Premium</h3>
          {premiumEnabled ? <p className={sales.price}>{premiumPrice.current} <small>/month for your first {premiumPrice.discountMonths} months, then {premiumPrice.regular}</small></p> : <p className={sales.price}>Coming soon</p>}
          <ul>
            {premium.map((exam) => <li key={exam.id}>{exam.title} {exam.paper.split(" · ")[1]}: {exam.subtitle.toLowerCase()}</li>)}
            <li>Every exam-prep topic lesson, worked example and topic test</li>
            <li>The AI tutor inside lessons and simulations</li>
            <li>No advertising while you practise</li>
          </ul>
          <div className={sales.planFoot}>{premiumEnabled ? <PremiumCta locale="en" /> : <Link className="button" href="/en/premium">See what Premium includes</Link>}</div>
          <p className={sales.fine}>{premiumEnabled ? "Billed monthly in USD through Paddle; cancel anytime from your account menu. Under 18? Ask a parent or guardian first." : "Premium is not on sale yet. Both starter mocks are free to take today."}</p>
        </article>
      </div>
    </section>

    <section className={sales.section} aria-labelledby="limits-heading">
      <div className={sales.head}><span className="eyebrow">Be clear about what this is</span><h2 id="limits-heading">What these mocks are not</h2></div>
      <p className={sales.lead}>These are short practice sets, about a quarter of the length of the real papers, and they cover a selection of syllabus topics rather than the whole specification. They are not past papers, they are not endorsed by Cambridge, and a score on them does not predict an exam grade. Use them to practise timing and to find weak topics, and use your school’s past papers and the official syllabus to check full coverage.</p>
    </section>

    <section className={sales.band} aria-labelledby="mock-band-heading">
      <div><h2 id="mock-band-heading">Find your weak topics before the exam does.</h2><p>Sign in free, start the clock, and have your revision priorities in under 15 minutes.</p></div>
      <div className={sales.ctaRow}><StudySignIn label="Start a free mock" lessonLabel="Sign in to open this mock exam" lessonNote="Mock exams are for signed-in students. Sign in with Google (free) and the practice set you followed opens here." /></div>
    </section>

    <Notice><strong>Important:</strong> these are shortened mock exams with original questions. The official Cambridge Physics 9702 Paper 1 has 40 questions in 75 minutes and IGCSE Chemistry 0620 Paper 2 has 40 questions in 45 minutes. These sets are not official papers, are not endorsed by Cambridge, and do not predict exam grades. Revising a topic first? <Link href="/en/exam-prep">Go to Exam Prep →</Link></Notice>
  </main>;
  return <LearningHub kind="mock-exams" title="Mock exams" description="Start a timed practice paper, review your attempts and monitor your scores." total={mockExams.length} secondaryCount={free.length} secondaryLabel="Free papers" publicContent={publicContent}><MockExamStudyLoader /></LearningHub>;
}
