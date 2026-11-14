import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canonicalTopicCourse, coursePath, courseTitle, courses, getBoard, getLevel, getSubject, getSyllabus, isCourse, isFreeTopic, isVerified, labs, lessonContent, topicPath, type Course } from "@/lib/exam-prep/catalog";
import { Breadcrumbs, IllustrativeNotice, IndependenceNotice } from "@/components/exam-prep/Shell";
import { MiniSim } from "@/components/exam-prep/MiniSim";
import { PremiumGate } from "@/components/exam-prep/PremiumGate";
import { TopicExam } from "@/components/exam-prep/TopicExam";
import { TopicTutor } from "@/components/exam-prep/TopicTutor";
import { lessonDetail } from "@/lib/exam-prep/lessons";
import { questionBank } from "@/lib/exam-prep/question-bank";
import { jsonLd, localizedMetadata, localizedUrl, siteName, siteUrl } from "@/lib/seo/metadata";
import styles from "@/components/exam-prep/examPrep.module.css";

type Props = { params: Promise<{ locale: string; board: string; level: string; subject: string; topic: string }> };
export function generateStaticParams() { return courses.flatMap((course) => getSyllabus(course).map((topic) => ({ locale: "en", ...course, topic: topic.slug }))); }

function find(course: Course, slug: string) {
  if (!isCourse(course)) return null;
  const topics = getSyllabus(course), index = topics.findIndex((topic) => topic.slug === slug);
  return index < 0 ? null : { topics, index, topic: topics[index] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, topic: slug, ...course } = await params, found = find(course, slug);
  if (locale !== "en" || !found) return {};
  const content = lessonContent[found.topic.content], title = `${found.topic.name} – ${courseTitle(course)} | Exam Prep`;
  const metadata = localizedMetadata("en", topicPath(course, found.topic), title, `${found.topic.name} for ${courseTitle(course)}: ${content.brief}`.slice(0, 300), { englishOnly: true, noIndex: !isVerified(course) });
  // A level that repeats an earlier level's topic points search engines at that single page.
  const owner = canonicalTopicCourse(course, found.topic);
  return { ...metadata, title: { absolute: `${title} | ${siteName}` }, ...(owner ? { alternates: { ...metadata.alternates, canonical: localizedUrl("en", topicPath(owner, found.topic)) } } : {}) };
}

export default async function TopicPage({ params }: Props) {
  const { locale, topic: slug, ...course } = await params, found = find(course, slug);
  if (locale !== "en" || !found) notFound();
  const { topics, index, topic } = found;
  const board = getBoard(course.board)!, level = getLevel(course.board, course.level)!, subject = getSubject(course.subject)!;
  const content = lessonContent[topic.content], lab = topic.lab ? labs[topic.lab] : null, free = isFreeTopic(course, topic, index), verified = isVerified(course);
  const path = topicPath(course, topic), base = coursePath(course);
  const resource = {
    "@context": "https://schema.org", "@type": "LearningResource", name: `${topic.name} – ${courseTitle(course)}`, description: content.brief, url: localizedUrl("en", path), inLanguage: "en",
    learningResourceType: "Lesson", educationalLevel: `${board.name} ${level.name}`, teaches: topic.name, about: [subject.name, topic.name], isAccessibleForFree: free,
    audience: { "@type": "EducationalAudience", educationalRole: "student" }, provider: { "@type": "Organization", name: siteName, url: siteUrl },
    ...(lab ? { hasPart: { "@type": "LearningResource", name: lab.name, learningResourceType: "Interactive simulation", url: localizedUrl("en", `/simulations/${lab.slug}`) } } : {}),
  };
  const detail = lessonDetail[topic.content];
  // The lesson's own check question joins the bank, so every topic has at least five to draw from.
  const pool = [{ question: content.question, options: content.options, answer: content.answer, why: content.why }, ...questionBank[topic.content]];
  const lesson = <>
    <section className={styles.panel} aria-labelledby="worked">
      <div className={styles.panelTop}><h2 id="worked">Key relationship and worked example</h2></div>
      <div className={styles.formula}>{content.formula}</div>
      <div className={styles.example}><strong>Worked example</strong>{content.example}</div>
    </section>
    <TopicExam topicId={path} topicName={topic.name} content={topic.content} pool={pool} hint={content.hint} />
    <TopicTutor topic={topic.name} course={courseTitle(course)} subject={subject.name} concepts={content.brief} />
  </>;
  return <main className={`container ${styles.page}`}>
    {verified && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(resource)} />}
    <Breadcrumbs items={[{ name: "Exam Prep", path: "/exam-prep" }, { name: board.name, path: `/exam-prep/${board.id}` }, { name: level.name, path: `/exam-prep/${board.id}/${level.id}` }, { name: subject.name, path: base }, { name: topic.name, path }]} />
    <header className={styles.hero}>
      <span className="eyebrow">{board.short} · {level.name} · {subject.name}</span>
      <h1>{topic.name}</h1>
      <p>{topic.section !== "Sample" && <>Syllabus section {topic.section} · </>}{courseTitle(course)} · {free ? "Free sample lesson" : "Premium lesson"}</p>
    </header>
    {!verified && <div style={{ marginBottom: 18 }}><IllustrativeNotice /></div>}
    <div className={styles.lessonGrid}>
      <aside className={styles.side}>
        <nav aria-label="Topics in this syllabus"><h2>In this syllabus</h2>
          <div className={styles.chapterNav}>{topics.map((item, i) => <Link key={item.slug} href={`/en${topicPath(course, item)}`} aria-current={i === index ? "page" : undefined}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{item.name}</span>{!isFreeTopic(course, item, i) && <span aria-label="Premium">✦</span>}</Link>)}</div>
        </nav>
        <Link className={styles.backLink} href={`/en${base}`}>← All topics</Link>
      </aside>
      <div className={styles.main}>
        <section className={styles.panel} aria-labelledby="concept">
          <div className={styles.panelTop}><h2 id="concept">{topic.name} explained simply</h2><span className={`${styles.badge} ${styles.free}`}>3-minute read</span></div>
          <p>{content.brief}</p>
          <ol className={styles.points}>{detail.explain.map((point) => <li key={point}>{point}</li>)}</ol>
          <div className={styles.mistake}><strong>Common mistake</strong>{detail.mistake}</div>
        </section>
        <section className={styles.panel} aria-labelledby="experiment">
          <div className={styles.panelTop}><h2 id="experiment">Try it: interactive simulation</h2>{lab && <span className={`${styles.badge} ${styles.free}`}>Free lab</span>}</div>
          {lab && <><p>Change one variable, predict the result, then check the reading.</p><MiniSim kind={lab.kind} /></>}
          <div className={styles.labCard} style={lab ? { marginTop: 14 } : undefined}>
            {lab ? <>
              <div className={styles.labTop}><div><div className={styles.status}>● FREE LEARNERKITS LAB{!topic.direct && " · RELATED LAB"}</div><h3>{lab.name}</h3></div></div>
              <p>Use the full interactive lab to observe, measure and test this idea.{!topic.direct && " This lab is related to the topic but does not cover all of its syllabus requirements."}</p>
              <Link className="textLink" href={`/en/simulations/${lab.slug}`}>Open {lab.name} →</Link>
            </> : <>
              <div className={styles.status} style={{ color: "var(--muted)" }}>NO DIRECT LAB YET</div><h3>A dedicated simulation is planned</h3>
              <p>This topic does not yet have a closely matching LearnerKits lab.</p>
              <Link className="textLink" href="/en/simulations">Browse the free lab library →</Link>
            </>}
          </div>
        </section>
        {free ? lesson : <PremiumGate title="The rest of this lesson is part of Premium" description="Unlock the key formula and worked example, the randomised topic test with your understanding score, and the AI tutor for this topic.">{lesson}</PremiumGate>}
        <IndependenceNotice />
      </div>
    </div>
  </main>;
}
