import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, IndependenceNotice } from "@/components/exam-prep/Shell";
import { getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { faqJsonLd, jsonLd, localizedMetadata, localizedUrl, siteName, siteUrl } from "@/lib/seo/metadata";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";
import styles from "@/components/exam-prep/examPrep.module.css";

const title = "Exam Prep for Any Exam Board";
const description = "Prepare for any exam board with subject lessons, interactive activities, topic checks, AI study help and saved learning progress in your own language.";

const subjectTints = ["#5275e7", "#d69e09", "#22a06b", "#168aad", "#8758d5", "#d35f5f", "#53606f"] as const;
const publishedSubjects = visibleSubjectSlugs.map((slug, index) => {
  const subject = getLocalizedSubject("en", slug);
  return {
    slug,
    name: getLocalizedSubjectName("en", slug),
    concepts: subject.concepts.join(", "),
    tint: subjectTints[index % subjectTints.length],
  };
});

const faqs = [
  {
    q: "Can I use LearnerKits if my exam board is not listed?",
    a: "Yes. Use your official syllabus to identify the topic, then choose the matching LearnerKits subject lesson or interactive activity. New subjects appear here as they are published. Use your board's specification for exact assessment requirements.",
  },
  {
    q: "How do I match my syllabus topic to LearnerKits?",
    a: "Copy the main concept or learning objective from your specification, open the relevant subject library and compare its learning outcome with your syllabus requirement.",
  },
  {
    q: "Can the AI tutor explain my exact topic?",
    a: "Premium learners can ask the AI science tutor inside a simulation. It receives the current activity and topic context, but it does not replace the official specification, a teacher or an examiner's mark scheme.",
  },
  {
    q: "Will my board-neutral study activity be saved?",
    a: "Supported missions, evidence and scores are saved in the current browser. They do not currently sync automatically between devices and can be lost when browser data is cleared.",
  },
] as const;

const workflow = [
  ["01", "Open your official syllabus", "Use the specification or curriculum from your school or exam board as the source of truth."],
  ["02", "Identify the topic", "Reduce the syllabus statement to a searchable concept or learning objective."],
  ["03", "Learn and experiment", "Read the learning outcome, change variables in a matching lab and explain the evidence you observe."],
  ["04", "Check and record progress", "Complete available missions or questions, then note which syllabus statement needs another attempt."],
] as const;

export function generateStaticParams() { return [{ locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/exam-prep/any-board", title, description, {
    englishOnly: true,
    keywords: ["exam prep any board", "board exam preparation", "online subject revision", "AI study help", "interactive learning"],
  });
}

export default async function AnyBoardPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  const pageUrl = localizedUrl("en", "/exam-prep/any-board");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "LearningResource"],
    "@id": `${pageUrl}#learning-resource`,
    name: title,
    description,
    url: pageUrl,
    inLanguage: "en",
    isAccessibleForFree: true,
    learningResourceType: ["Revision guide", "Interactive learning resource"],
    educationalUse: ["revision", "practice", "assessment"],
    about: [...publishedSubjects.map((subject) => subject.name), "Board examinations"],
    audience: { "@type": "EducationalAudience", educationalRole: ["student", "teacher"] },
    isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteName },
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: publishedSubjects.length,
      itemListElement: publishedSubjects.map((subject, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "LearningResource", name: `${subject.name} learning and exam preparation`, url: localizedUrl("en", `/subjects/${subject.slug}`) },
      })),
    },
  };

  return <main className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd("en", [...faqs]))} />
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }, { name: "Any exam board", path: "/exam-prep/any-board" }]} />

    <header className={styles.hero}>
      <span className="eyebrow">Board-neutral exam preparation</span>
      <h1>Prepare for exams—even if your board is not listed</h1>
      <p>Bring the topic name from your official syllabus. LearnerKits helps you learn through structured content, interactive activities, topic checks, optional AI support and saved activity progress.</p>
      <div className={styles.actions}><a className="button primary" href="#choose-subject">Choose a subject →</a><Link className="button" href="/en/exam-prep">View mapped exam boards</Link></div>
    </header>

    <section className={styles.answerPanel} aria-labelledby="any-board-answer">
      <div><span className="eyebrow">Direct answer</span><h2 id="any-board-answer">Can LearnerKits help students from any exam board?</h2><p>Yes. Choose a published subject, find the topic from your official curriculum and use the lesson, activity, checks and AI study support to build understanding. Only pages labelled “Published syllabus” are verified board mappings.</p></div>
      <div className={styles.coverageList}><strong>What this route provides</strong><p>Concept explanations, interactive learning, supported checks, optional topic-aware AI help and browser-local activity progress.</p></div>
    </section>

    <section id="choose-subject" className={styles.contentSection} aria-labelledby="subject-heading">
      <div className={styles.sectionHead}><span className="eyebrow">Start from the concept</span><h2 id="subject-heading">Choose the subject in your syllabus</h2><p>Search each subject library by concept, activity name or learning outcome.</p></div>
      <div className={styles.tiles}>{publishedSubjects.map((subject) => <Link key={subject.slug} className={styles.tile} style={{ "--tint": subject.tint } as React.CSSProperties} href={`/en/subjects/${subject.slug}`}><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.name.slice(0, 1)}</span><span aria-hidden="true">↗</span></div><h3>{subject.name} exam preparation</h3><p>{subject.concepts}</p><span className={styles.subline}>Explore {subject.name} resources →</span></Link>)}</div>
    </section>

    <section className={styles.contentSection} aria-labelledby="workflow-heading">
      <div className={styles.sectionHead}><span className="eyebrow">Use your curriculum as the map</span><h2 id="workflow-heading">A study method that works across boards</h2><p>This keeps the official syllabus in control while LearnerKits helps make each concept understandable and testable.</p></div>
      <ol className={styles.stepGrid}>{workflow.map(([number, heading, copy]) => <li key={number}><span>{number}</span><h3>{heading}</h3><p>{copy}</p></li>)}</ol>
    </section>

    <section className={`${styles.contentSection} ${styles.faqSection}`} aria-labelledby="any-board-faq">
      <div className={styles.sectionHead}><span className="eyebrow">Questions from students</span><h2 id="any-board-faq">Using LearnerKits with another board</h2></div>
      <div className={styles.faqList}>{faqs.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
    </section>

    <IndependenceNotice />
  </main>;
}
