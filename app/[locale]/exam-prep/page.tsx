import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { boards, courses, getSyllabus, isVerified } from "@/lib/exam-prep/catalog";
import { getPapers } from "@/lib/exam-prep/papers";
import { examPrepSeo, readableCourseName, verifiedBoardCourses } from "@/lib/exam-prep/seo";
import { mockExams } from "@/lib/mock-exams/catalog";
import { premiumEnabled } from "@/lib/billing/flags";
import { premiumPrice } from "@/lib/premium/copy";
import { Breadcrumbs, IndependenceNotice } from "@/components/exam-prep/Shell";
import { faqJsonLd, jsonLd, localizedMetadata, localizedUrl, siteName, siteUrl } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";
import sales from "@/components/exam-prep/sales.module.css";
import { LearningHub } from "@/components/workspace/LearningHub";
import { ExamStudyLoader } from "@/components/exam-prep/ExamStudyLoader";
import { StudySignIn } from "@/components/exam-prep/StudySignIn";
import { PremiumCta } from "@/components/premium/PremiumCta";

// Public sales page for Exam Prep (signed-out view). Courses and lessons themselves are for signed-in
// students and open in the study view below; this page describes them with real numbers from the
// catalog, so every figure stays true as courses are added.

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/exam-prep", examPrepSeo.title, examPrepSeo.description, {
    englishOnly: true,
    keywords: ["science exam prep", "exam board revision", "physics exam prep", "chemistry exam prep", "interactive science revision"],
  });
}

export default async function ExamPrepPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  const levels = boards.reduce((sum, board) => sum + board.levels.length, 0);
  const topics = courses.reduce((sum, course) => sum + getSyllabus(course).length, 0);
  const withLab = courses.reduce((sum, course) => sum + getSyllabus(course).filter((topic) => topic.lab).length, 0);
  const published = courses.filter(isVerified).length;
  const paperCourses = courses.filter((course) => getPapers(course)).length;
  const freeMocks = mockExams.filter((exam) => !exam.premium).length, premiumMocks = mockExams.length - freeMocks;

  const collection = {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "LearningResource"],
    "@id": `${localizedUrl("en", "/exam-prep")}#exam-prep`,
    name: "Science exam preparation by exam board",
    description: examPrepSeo.description,
    url: localizedUrl("en", "/exam-prep"),
    inLanguage: "en",
    isAccessibleForFree: true,
    learningResourceType: ["Revision guide", "Interactive learning resource", "Practice questions"],
    educationalUse: ["revision", "practice", "assessment"],
    about: ["Physics", "Chemistry", "Science examinations"],
    audience: { "@type": "EducationalAudience", educationalRole: ["student", "teacher"] },
    isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteName },
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: 1,
      itemListElement: [
        { "@type": "ListItem", position: 1, item: { "@type": "LearningResource", name: "Science exam preparation for any board", url: localizedUrl("en", "/exam-prep/any-board") } },
      ],
    },
  };

  const publicContent = <main className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd("en", [...examPrepSeo.faqs]))} />
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }]} />

    <section className={sales.hero} aria-labelledby="exam-prep-title">
      <div>
        <span className="eyebrow">Exam prep · Cambridge, Edexcel, AQA and IB</span>
        <h1 id="exam-prep-title">Revise the exact topic on your syllabus. Then prove you know it.</h1>
        <p className={sales.lead}>Choose your board, level and subject, and every syllabus topic becomes a short lesson: the idea explained simply, a simulation to test it, a worked example, and a five-question topic test that shows how well it has stuck.</p>
        <div className={sales.ctaRow}><StudySignIn label="Start free with Google" /><Link className="button" href="/en/mock-exams">Try a free mock exam</Link></div>
        <ul className={sales.reassure}><li>Free account</li><li>2 full lessons free in every course</li><li>No card needed</li></ul>
      </div>
      <figure className={sales.preview} aria-label="What a topic lesson contains">
        <div className={sales.previewTop}><span>Cambridge · AS Level · Physics 9702</span><span>Topic 2</span></div>
        <p className={sales.previewTitle}>Kinematics</p>
        <ol className={sales.previewList}>
          <li><span>Explained simply</span><small>3-minute read</small></li>
          <li><span>Try it in a mini simulation</span><small>Free lab</small></li>
          <li><span>Key relationship: <code>v = u + at</code></span><small>Worked example</small></li>
          <li><span>Topic test</span><small>5 questions</small></li>
          <li><span>Ask the AI tutor</span><small>Premium ✦</small></li>
        </ol>
        <div className={sales.meter}><div className={sales.meterRow}><span>Your understanding</span><span>4 / 5</span></div><div className={sales.meterTrack}><span style={{ width: "80%" }} /></div></div>
        <figcaption className={sales.caption}>The parts of every topic lesson. The score shown is an example.</figcaption>
      </figure>
    </section>

    <dl className={sales.stats} aria-label="Exam Prep in numbers">
      <div><dt>exam boards</dt><dd>{boards.length}</dd></div>
      <div><dt>qualifications, IGCSE to A Level and IB</dt><dd>{levels}</dd></div>
      <div><dt>courses across Physics, Chemistry, Biology and Maths</dt><dd>{courses.length}</dd></div>
      <div><dt>topic lessons</dt><dd>{topics}</dd></div>
      <div><dt>topics with a linked simulation</dt><dd>{withLab}</dd></div>
    </dl>
    <p className={sales.statNote}>{published} courses follow a board’s published specification topic by topic; the others are labelled illustrative previews until their mapping has been checked.</p>

    <section className={sales.section} aria-labelledby="inside-heading">
      <div className={sales.head}><span className="eyebrow">Inside every lesson</span><h2 id="inside-heading">Less rereading. More checking that you understand.</h2><p>Each topic lesson is built around one idea from your specification and moves you from reading about it to using it.</p></div>
      <div className={sales.features}>
        <article className={sales.feature}><b aria-hidden="true">01</b><h3>The idea, explained simply</h3><p>A three-minute explanation in plain language, the key points broken into steps, and the mistake students most often make on that topic.</p></article>
        <article className={sales.feature}><b aria-hidden="true">02</b><h3>A simulation to test it</h3><p>Where a lab fits the topic, a mini simulation sits inside the lesson and the full LearnerKits lab is one click away, so you change a variable and read the result instead of taking the rule on trust.</p></article>
        <article className={sales.feature}><b aria-hidden="true">03</b><h3>A worked example</h3><p>The key relationship written out, then one problem solved step by step with units, in the form an exam question usually takes.</p></article>
        <article className={sales.feature}><b aria-hidden="true">04</b><h3>A topic test that changes each time</h3><p>Five questions drawn from that topic’s bank in a new order on every attempt. Your best score is kept, so you can see at a glance which topics need another pass.</p></article>
        <article className={sales.feature}><b aria-hidden="true">05</b><h3>An AI tutor that knows the topic <span className={sales.tag}>Premium</span></h3><p>Ask a follow-up question in your own words. The tutor is told which course and topic you are revising, so it answers at the right level.</p></article>
        <article className={sales.feature}><b aria-hidden="true">06</b><h3>Practicals and paper guides</h3><p>Two virtual practicals mark your measurements, graph and evaluation out of 12, and {paperCourses} courses have a guide to each exam paper’s format, length and marks.</p></article>
      </div>
    </section>

    <section className={sales.section} id="exam-boards" aria-labelledby="boards-heading">
      <div className={sales.head}><span className="eyebrow">Boards and courses</span><h2 id="boards-heading">Find your qualification</h2><p>Every board has Physics, Chemistry, Biology and Mathematics courses at each level. Courses marked as published follow the current specification; you can still open the others as previews.</p></div>
      <div className={sales.boards}>{boards.map((board) => {
        const verified = verifiedBoardCourses(board.id);
        return <article key={board.id} className={sales.board} style={{ "--tint": board.color } as React.CSSProperties}>
          <div className={sales.boardTop}><span aria-hidden="true">{board.icon}</span><div><h3>{board.name}</h3><p>{board.sub}</p></div></div>
          <ul className={sales.levels}>{board.levels.map((level) => <li key={level.id}>{level.name.replace(" · ", " ")}</li>)}</ul>
          <p className={sales.published}>{verified.length ? <><strong>Published syllabus:</strong> {verified.map(readableCourseName).join(", ")}.</> : "All courses are illustrative previews for now."}</p>
        </article>;
      })}</div>
      <p className={sales.statNote}>Studying with a different board? <Link href="/en/exam-prep/any-board">Use the guide for any exam board →</Link></p>
    </section>

    <section className={sales.section} aria-labelledby="plans-heading">
      <div className={sales.head}><span className="eyebrow">Free and Premium</span><h2 id="plans-heading">Start free. Unlock every lesson when you are ready.</h2><p>A free account already covers a lot. Premium opens the full worked lessons and the tutor for every topic.</p></div>
      <div className={sales.compare}>
        <article className={sales.plan}>
          <h3>Free account</h3>
          <p className={sales.price}>$0 <small>with Google sign-in</small></p>
          <ul>
            <li>Two complete sample lessons in every course, worked example and topic test included</li>
            <li>The plain-language explanation for all {topics} topics, with its simulation where one exists</li>
            <li>Two marked virtual practicals and every exam paper guide</li>
            <li>{freeMocks} timed starter mock exams with instant marking</li>
            <li>Every simulation in the LearnerKits lab library</li>
          </ul>
          <div className={sales.planFoot}><StudySignIn label="Create a free account" /></div>
        </article>
        <article className={`${sales.plan} ${sales.featured}`}>
          <h3>Premium</h3>
          {premiumEnabled ? <p className={sales.price}>{premiumPrice.current} <small>/month for your first {premiumPrice.discountMonths} months, then {premiumPrice.regular}</small></p> : <p className={sales.price}>Coming soon</p>}
          <ul>
            <li>The worked example and key relationship for every topic</li>
            <li>The topic test and understanding score on every topic</li>
            <li>The AI tutor in every lesson and inside the simulations</li>
            <li>{premiumMocks} extra mock sets with harder, multi-step calculations</li>
            <li>No advertising while you study</li>
          </ul>
          <div className={sales.planFoot}>{premiumEnabled ? <PremiumCta locale="en" /> : <Link className="button" href="/en/premium">See what Premium includes</Link>}</div>
          <p className={sales.fine}>{premiumEnabled ? "Billed monthly in USD through Paddle; cancel anytime from your account menu. Under 18? Ask a parent or guardian first." : "Premium is not on sale yet. Everything in the free account is available today."}</p>
        </article>
      </div>
    </section>

    <section className={sales.section} aria-labelledby="start-heading">
      <div className={sales.head}><span className="eyebrow">Getting started</span><h2 id="start-heading">Open your first lesson in three steps</h2></div>
      <ol className={sales.steps}>
        <li><h3>Sign in with Google</h3><p>One click with the Google account you already use. There is nothing to pay and no card to enter.</p></li>
        <li><h3>Pick board, level and subject</h3><p>Use the qualification printed on your course or exam entry, such as Cambridge AS Level Physics 9702.</p></li>
        <li><h3>Start with a free lesson</h3><p>Two topics in every course are open in full. Or jump to the topic that worries you most and read its explanation.</p></li>
      </ol>
    </section>

    <section className={`${sales.section} ${styles.faqSection}`} aria-labelledby="faq-heading">
      <div className={sales.head}><span className="eyebrow">Before you sign in</span><h2 id="faq-heading">Questions students ask first</h2></div>
      <div className={styles.faqList}>{examPrepSeo.faqs.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
    </section>

    <section className={sales.band} aria-labelledby="band-heading">
      <div><h2 id="band-heading">Your syllabus, one topic at a time.</h2><p>Sign in free and two complete lessons in every course are yours to work through today.</p></div>
      <div className={sales.ctaRow}><StudySignIn label="Start free with Google" /></div>
    </section>

    <IndependenceNotice />
  </main>;
  return <LearningHub kind="exam-prep" title="Exam preparation" description="Choose your board and qualification, revise by topic and keep an eye on your practice scores." total={boards.length + 1} secondaryCount={4} secondaryLabel="Subjects" publicContent={publicContent}><ExamStudyLoader /></LearningHub>;
}
