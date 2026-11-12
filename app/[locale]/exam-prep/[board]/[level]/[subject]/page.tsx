import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { coursePath, courseTitle, courses, getBoard, getLevel, getSubject, getSyllabus, isCourse, isFreeTopic, isVerified, labs, sources, subjectCode, syllabusKey, topicPath } from "@/lib/exam-prep/catalog";
import { getPapers } from "@/lib/exam-prep/papers";
import { Breadcrumbs, IllustrativeNotice, Notice } from "@/components/exam-prep/Shell";
import { jsonLd, localizedMetadata, localizedUrl } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

type Props = { params: Promise<{ locale: string; board: string; level: string; subject: string }> };
export function generateStaticParams() { return courses.map((course) => ({ locale: "en", ...course })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, ...course } = await params;
  if (locale !== "en" || !isCourse(course)) return {};
  const title = courseTitle(course);
  return localizedMetadata("en", coursePath(course), `${title} Topics, Labs & Practice | Exam Prep`, `Browse ${title} topics. Each one has a short concept lesson, a worked example, a practice question and a linked interactive LearnerKits lab.`, { englishOnly: true, noIndex: !isVerified(course) });
}

export default async function CoursePage({ params }: Props) {
  const { locale, ...course } = await params;
  if (locale !== "en" || !isCourse(course)) notFound();
  const board = getBoard(course.board)!, level = getLevel(course.board, course.level)!, subject = getSubject(course.subject)!;
  const topics = getSyllabus(course), verified = isVerified(course), source = sources[syllabusKey(course)], code = subjectCode(course), path = coursePath(course), papers = getPapers(course);
  const list = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: `${courseTitle(course)} topics`, url: localizedUrl("en", path), inLanguage: "en",
    mainEntity: { "@type": "ItemList", numberOfItems: topics.length, itemListElement: topics.map((topic, index) => ({ "@type": "ListItem", position: index + 1, name: topic.name, url: localizedUrl("en", topicPath(course, topic)) })) },
  };
  return <main className={`container ${styles.page}`}>
    {verified && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(list)} />}
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }, { name: board.name, path: `/exam-prep/${board.id}` }, { name: level.name, path: `/exam-prep/${board.id}/${level.id}` }, { name: subject.name, path }]} />
    <header className={styles.hero}>
      <span className="eyebrow">Step 4 of 4 · {board.short} · {level.name}</span>
      <h1>{subject.name}{code && <small>{code}</small>}</h1>
      <p>{board.name} · {level.name} · {topics.length} {verified ? "published syllabus topic and unit headings" : "illustrative topic previews"}.</p>
    </header>
    {!verified && <div style={{ marginBottom: 18 }}><IllustrativeNotice /></div>}
    <div className={styles.layout}>
      <div>
        <div className={styles.strip}><div><span className="eyebrow">Exam practice</span><strong>Ready to test your knowledge?</strong><small>Try a timed mock with original exam-style questions.</small></div><Link className="button primary" href="/en/mock-exams">Explore mock exams →</Link></div>
        {papers && <div className={styles.strip}><div><span className="eyebrow">Choose exam component</span><strong>Study for the paper you will actually sit.</strong><small>Paper formats from the published specification, with practical-skills practice.</small></div><Link className="button" href={`/en${path}/papers`}>View exam papers →</Link></div>}
        <section className={styles.topicList} aria-labelledby="syllabus-heading">
          <div className={styles.listHead}><div><h2 id="syllabus-heading" style={{ fontSize: "1rem", margin: 0 }}>Browse your syllabus</h2><small>2 sample lessons free · the rest are part of Premium</small></div><span className={styles.badge}>{topics.length} topics</span></div>
          {topics.map((topic, index) => {
            const free = isFreeTopic(course, topic, index);
            return <Link key={topic.slug} className={styles.topicRow} href={`/en${topicPath(course, topic)}`}>
              <span className={styles.topicNum} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.topicTitle}>{topic.name}<small>{topic.section} · {topic.lab ? labs[topic.lab].name : "Concept lesson and practice question"}</small></span>
              <span className={`${styles.badge} ${free ? styles.free : styles.paid}`}>{free ? "Free" : "Premium"}</span>
            </Link>;
          })}
        </section>
        {verified
          ? <Notice><strong>Curriculum source:</strong> topic names follow the published specification.{source && <> <a href={source} target="_blank" rel="noopener noreferrer">View the official syllabus ↗</a></>} Lab recommendations are LearnerKits editorial matches, not exam-board endorsements, and some related labs cover only part of a topic. LearnerKits is independent and is not affiliated with {board.name}.</Notice>
          : <Notice>LearnerKits is independent and is not affiliated with or endorsed by {board.name}. Verify the exact specification and exam year with your teacher or the awarding body.</Notice>}
      </div>
      <aside className={styles.promo} aria-label="LearnerKits Premium">
        <span className="eyebrow">Premium study path</span>
        <h2>Understand more. Remember longer.</h2>
        <p>Guided lessons for every topic, in-lesson experiments, practice questions with worked answers, and more mock exam sets.</p>
        <ul><li>Every board-specific topic lesson</li><li>Mini experiments inside each lesson</li><li>Exam-style questions and explanations</li><li>Extra timed mock exam sets</li><li>AI science tutor on simulations</li></ul>
        <Link className="button primary" href="/en/premium">See Premium →</Link>
        <p style={{ marginTop: 10, fontSize: ".76rem" }}>All LearnerKits simulations stay free to use.</p>
      </aside>
    </div>
  </main>;
}
