import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { boards, isVerified, subjects } from "@/lib/exam-prep/catalog";

// The subject tiles link to a Cambridge course; label it honestly when that topic list is still a preview.
const verifiedSubject = (subject: string) => isVerified({ board: "cambridge", level: subject === "physics" ? "as" : "igcse", subject });
import { examPrepSeo } from "@/lib/exam-prep/seo";
import { Breadcrumbs, IndependenceNotice } from "@/components/exam-prep/Shell";
import { faqJsonLd, jsonLd, localizedMetadata, localizedUrl, siteName, siteUrl } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/exam-prep", examPrepSeo.title, examPrepSeo.description, {
    englishOnly: true,
    keywords: ["science exam prep", "exam board revision", "physics exam prep", "chemistry exam prep", "interactive science revision"],
  });
}

const steps = [
  ["01", "Choose your exam board", "Start with the curriculum and qualification printed on your course or exam entry."],
  ["02", "Open one syllabus topic", "Revise a focused concept instead of searching through a generic science library."],
  ["03", "Experiment with the idea", "Use a linked browser-based simulation to change variables and observe the result."],
  ["04", "Apply what you learned", "Answer a check question, then move into exam-paper or mock-exam practice."],
] as const;

const platformFeatures = [
  ["文", "Learn in a supported language", "Use the site language to read learning goals, explanations and activity instructions. English and Spanish are currently published."],
  ["01", "Follow structured content", "Move from board and qualification to subject and syllabus topic instead of revising from disconnected resources."],
  ["✦", "Ask a topic-aware AI tutor", "Premium learners can ask questions inside simulations, where the tutor receives the current activity and topic context."],
  ["✓", "Check your understanding", "Use topic questions, missions and available exam-style practice to apply what you have learned."],
  ["↗", "Keep an activity record", "Supported activities save completed missions, evidence and scores in this browser so you can see what you have practised."],
  ["◎", "Make difficult ideas visible", "Use interactive models to change variables, compare outcomes and connect evidence to the scientific explanation."],
] as const;

export default async function ExamPrepPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
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
      numberOfItems: boards.length + 1,
      itemListElement: [
        ...boards.map((board, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@type": "LearningResource", name: `${board.name} exam preparation`, url: localizedUrl("en", `/exam-prep/${board.id}`) },
        })),
        { "@type": "ListItem", position: boards.length + 1, item: { "@type": "LearningResource", name: "Science exam preparation for any board", url: localizedUrl("en", "/exam-prep/any-board") } },
      ],
    },
  };

  return <main className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd("en", [...examPrepSeo.faqs]))} />
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }]} />

    <header className={styles.hero}>
      <span className="eyebrow">Science exam prep · organised by syllabus</span>
      <h1>Revise for your science exam by board and topic</h1>
      <p>{examPrepSeo.answer}</p>
      <div className={styles.actions}><a className="button primary" href="#exam-boards">Choose your exam board →</a><Link className="button" href="/en/mock-exams">Try a free mock exam</Link></div>
      <dl className={styles.factGrid} aria-label="Exam preparation at a glance">
        <div><dt>Exam boards</dt><dd>Mapped boards plus a universal route</dd></div>
        <div><dt>Available now</dt><dd>Physics, Chemistry, Biology and Mathematics</dd></div>
        <div><dt>Learning format</dt><dd>Learn, experiment and practise</dd></div>
      </dl>
    </header>

    <section id="exam-boards" aria-labelledby="boards-heading" className={styles.contentSection}>
      <div className={styles.sectionHead}><span className="eyebrow">Start here</span><h2 id="boards-heading">Choose your exam board</h2><p>Each route separates published syllabus coverage from illustrative previews, so you can see exactly what has been checked.</p></div>
      <div className={styles.tiles}>{boards.map((board) => <Link key={board.id} className={styles.tile} style={{ "--tint": board.color } as React.CSSProperties} href={`/en/exam-prep/${board.id}`}>
        <div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{board.icon}</span><span aria-hidden="true">↗</span></div>
        <h3>{board.name} exam prep</h3><p>{board.sub}</p><span className={styles.subline}>Explore levels →</span>
      </Link>)}<Link className={styles.tile} style={{ "--tint": "#5275e7" } as React.CSSProperties} href="/en/exam-prep/any-board"><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">+</span><span className={styles.badge}>Universal route</span></div><h3>Another exam board</h3><p>Match any official syllabus topic to the subject resources currently published on LearnerKits.</p><span className={styles.subline}>Prepare with another board →</span></Link></div>
    </section>

    <section aria-labelledby="method-heading" className={styles.contentSection}>
      <div className={styles.sectionHead}><span className="eyebrow">A repeatable revision method</span><h2 id="method-heading">From syllabus point to exam practice</h2><p>Use the same four-step flow for a full course review or a single difficult topic.</p></div>
      <ol className={styles.stepGrid}>{steps.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
    </section>

    <section aria-labelledby="platform-heading" className={styles.contentSection}>
      <div className={styles.sectionHead}><span className="eyebrow">One connected learning platform</span><h2 id="platform-heading">Content, support, practice and progress in one place</h2><p>LearnerKits is designed to help a student move from “I do not understand this” to evidence of what they can do next.</p></div>
      <div className={styles.featureGrid}>{platformFeatures.map(([icon, title, copy]) => <article key={title}><span aria-hidden="true">{icon}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <p className={styles.disclosure}>Progress is stored on this device for supported activities and does not currently sync automatically across devices. AI tutoring is a Premium feature and can make mistakes.</p>
    </section>

    <section aria-labelledby="subjects-heading" className={styles.contentSection}>
      <div className={styles.sectionHead}><span className="eyebrow">Science subjects</span><h2 id="subjects-heading">Build understanding before memorising answers</h2><p>Every subject has concise topic lessons with a worked example and a check question. Physics and Chemistry topics also link to relevant simulations; Biology and Mathematics labs are in development.</p></div>
      <div className={styles.tiles}>{subjects.map((subject) => subject.soon
        ? <div key={subject.id} className={`${styles.tile} ${styles.soon}`} style={{ "--tint": subject.color } as React.CSSProperties}><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.icon}</span><span className={styles.badge}>Coming soon</span></div><h3>{subject.name}</h3><p>{subject.desc}</p></div>
        : <Link key={subject.id} className={styles.tile} style={{ "--tint": subject.color } as React.CSSProperties} href={`/en/exam-prep/cambridge/${subject.id === "physics" ? "as" : "igcse"}/${subject.id}`}><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.icon}</span><span className={`${styles.badge} ${verifiedSubject(subject.id) ? styles.free : ""}`}>{verifiedSubject(subject.id) ? "Published syllabus" : "Illustrative preview"}</span></div><h3>{subject.name} exam prep</h3><p>{subject.desc}</p><span className={styles.subline}>{verifiedSubject(subject.id) ? "Browse a verified course →" : "Browse a preview course →"}</span></Link>)}</div>
    </section>

    <section aria-labelledby="faq-heading" className={`${styles.contentSection} ${styles.faqSection}`}>
      <div className={styles.sectionHead}><span className="eyebrow">Clear answers</span><h2 id="faq-heading">Science exam-prep questions</h2><p>What students and teachers need to know before choosing a pathway.</p></div>
      <div className={styles.faqList}>{examPrepSeo.faqs.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
    </section>

    <IndependenceNotice />
  </main>;
}
