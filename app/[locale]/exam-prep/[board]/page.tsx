import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { boards, coursePath, getBoard, isBoardIndexable, isLevelIndexable } from "@/lib/exam-prep/catalog";
import { boardFaqs, getBoardSeo, readableCourseName, verifiedBoardCourses } from "@/lib/exam-prep/seo";
import { Breadcrumbs, IndependenceNotice } from "@/components/exam-prep/Shell";
import { faqJsonLd, jsonLd, localizedMetadata, localizedUrl, siteName, siteUrl } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

type Props = { params: Promise<{ locale: string; board: string }> };
export function generateStaticParams() { return boards.map((board) => ({ locale: "en", board: board.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, board: id } = await params;
  const board = getBoard(id), seo = getBoardSeo(id);
  if (locale !== "en" || !board || !seo) return {};
  return localizedMetadata("en", `/exam-prep/${id}`, seo.title, seo.description, {
    englishOnly: true,
    noIndex: !isBoardIndexable(id),
    keywords: [`${board.short} exam prep`, `${board.short} science revision`, `${board.short} physics`, `${board.short} chemistry`],
  });
}

const revisionSteps = [
  ["Find the right course", "Match the board and qualification on your course documents before choosing a subject."],
  ["Revise one topic", "Use the syllabus sequence to focus on the concept that needs attention today."],
  ["Test the model", "Change variables in a linked simulation and explain the pattern you observe."],
  ["Practise retrieval", "Answer the topic check, then continue to available paper or mock-exam practice."],
] as const;

export default async function BoardPage({ params }: Props) {
  const { locale, board: id } = await params;
  const board = getBoard(id), seo = getBoardSeo(id);
  if (locale !== "en" || !board || !seo) notFound();
  const verified = verifiedBoardCourses(id), faqs = boardFaqs(id), indexable = isBoardIndexable(id);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "LearningResource"],
    "@id": `${localizedUrl("en", `/exam-prep/${id}`)}#exam-prep`,
    name: seo.title,
    description: seo.description,
    url: localizedUrl("en", `/exam-prep/${id}`),
    inLanguage: "en",
    isAccessibleForFree: true,
    learningResourceType: ["Revision guide", "Interactive learning resource"],
    educationalUse: ["revision", "practice", "assessment"],
    about: [board.name, "Physics", "Chemistry", "Science examinations"],
    audience: { "@type": "EducationalAudience", educationalRole: ["student", "teacher"] },
    isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteName },
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: board.levels.length,
      itemListElement: board.levels.map((level, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "LearningResource", name: `${board.short} ${level.name.replace(" · ", " ")} exam preparation`, url: localizedUrl("en", `/exam-prep/${id}/${level.id}`) },
      })),
    },
  };

  return <main className={`container ${styles.page}`}>
    {indexable && <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd("en", faqs))} />
    </>}
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }, { name: board.name, path: `/exam-prep/${id}` }]} />

    <header className={styles.hero}>
      <span className="eyebrow">{board.short} revision · Physics, Chemistry, Biology and Mathematics</span>
      <h1>{board.name} exam preparation</h1>
      <p>{seo.lead}</p>
      <div className={styles.actions}><a className="button primary" href="#levels">Choose your level →</a><Link className="button" href="/en/mock-exams">Browse mock exams</Link></div>
    </header>

    <section className={styles.answerPanel} aria-labelledby="coverage-heading">
      <div><span className="eyebrow">Direct answer</span><h2 id="coverage-heading">What can I study for {board.short}?</h2><p>{seo.overview}</p></div>
      <div className={styles.coverageList}>
        <strong>{verified.length ? "Verified courses available now" : "Current coverage status"}</strong>
        {verified.length ? verified.map((course) => <Link key={`${course.level}-${course.subject}`} href={`/en${coursePath(course)}`}>{readableCourseName(course)} <span>→</span></Link>) : <p>Preview pathways are available to explore. Verified syllabus courses will appear here after review.</p>}
      </div>
    </section>

    <section id="levels" aria-labelledby="levels-heading" className={styles.contentSection}>
      <div className={styles.sectionHead}><span className="eyebrow">Choose the qualification on your course</span><h2 id="levels-heading">{board.short} levels and qualifications</h2><p>Published syllabus badges identify levels with at least one verified subject pathway.</p></div>
      <div className={styles.tiles}>{board.levels.map((level, index) => {
        const published = isLevelIndexable(id, level.id);
        return <Link key={level.id} className={styles.tile} style={{ "--tint": board.color } as React.CSSProperties} href={`/en/exam-prep/${id}/${level.id}`}>
          <div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className={`${styles.badge} ${published ? styles.free : ""}`}>{published ? "Published syllabus" : "Illustrative preview"}</span></div>
          <h3>{board.short} {level.name.replace(" · ", " ")} exam prep</h3><p>{level.detail}</p><span className={styles.subline}>View subjects →</span>
        </Link>;
      })}</div>
    </section>

    <section aria-labelledby="revision-heading" className={styles.contentSection}>
      <div className={styles.sectionHead}><span className="eyebrow">A practical study sequence</span><h2 id="revision-heading">How to revise for {board.short} science with LearnerKits</h2><p>Turn passive reading into a cycle of explanation, experimentation and retrieval.</p></div>
      <ol className={styles.stepGrid}>{revisionSteps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
    </section>

    <section aria-labelledby="faq-heading" className={`${styles.contentSection} ${styles.faqSection}`}>
      <div className={styles.sectionHead}><span className="eyebrow">Common questions</span><h2 id="faq-heading">{board.short} exam-prep answers</h2></div>
      <div className={styles.faqList}>{faqs.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
    </section>

    <nav className={styles.relatedLinks} aria-label="Related exam preparation resources"><strong>Continue studying</strong><Link href="/en/exam-prep">All exam boards</Link><Link href="/en/exam-prep/any-board">Different board</Link><Link href="/en/mock-exams">Mock exams</Link><Link href="/en/simulations">Science simulations</Link></nav>
    <IndependenceNotice />
  </main>;
}
