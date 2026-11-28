"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { boards, courseTitle, getBoard, getLevel, getSubject, getSyllabus, isCourse, isFreeTopic, isLevelIndexable, isVerified, labs, lessonContent, sources, subjectCode, subjects, syllabusKey, topicPath, type Board, type Course, type Level } from "@/lib/exam-prep/catalog";
import { lessonDetail } from "@/lib/exam-prep/lessons";
import { mockExamHref } from "@/lib/mock-exams/catalog";
import { getPapers, paperSources, type Paper } from "@/lib/exam-prep/papers";
import { isPracticalKind, practicalKinds, type PracticalKind } from "@/lib/exam-prep/practical";
import { questionBank } from "@/lib/exam-prep/question-bank";
import { getBoardSeo } from "@/lib/exam-prep/seo";
import { readStudyTarget, studyHref, type StudyTarget } from "@/lib/exam-prep/study";
import { MiniSim } from "./MiniSim";
import { IllustrativeNotice, IndependenceNotice, Notice } from "./Notices";
import { PracticalStation } from "./PracticalStation";
import { PremiumGate } from "./PremiumGate";
import { TopicExam } from "./TopicExam";
import { TopicTutor } from "./TopicTutor";
import styles from "./examPrep.module.css";

// The signed-in Exam Prep study area. It replaces the former public board, level, course, topic,
// papers and practical pages: one view inside /en/exam-prep, chosen by query parameters, and only
// loaded for signed-in students (see ExamStudyLoader), so none of it is in the public HTML.

type Crumb = { name: string; target?: StudyTarget };

function Trail({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Exam boards", target: {} }, ...items];
  return <nav className={styles.breadcrumbs} aria-label="Exam prep steps">
    {all.map((item, index) => index === all.length - 1
      ? <span key={item.name} aria-current="page">{item.name}</span>
      : <span key={item.name} style={{ display: "contents" }}><Link href={studyHref(item.target)}>{item.name}</Link><span aria-hidden="true">/</span></span>)}
  </nav>;
}

const practicalCopy: Record<PracticalKind, { tab: string; title: string; lead: string; lab: string; labName: string }> = {
  circuit: { tab: "Resistance experiment", title: "Determine the resistance of an unknown resistor", lead: "Measure the current for several voltages, plot V against I and calculate the resistance from the gradient.", lab: "circuit-builder", labName: "Circuit Builder" },
  pendulum: { tab: "Pendulum experiment", title: "Investigate the period of a simple pendulum", lead: "Time ten oscillations at different lengths, plot T² against L and estimate gravitational acceleration.", lab: "pendulum-physics", labName: "Pendulum Physics Lab" },
};

function BoardList() {
  return <>
    <div className={styles.tiles}>{boards.map((board) => <Link key={board.id} className={styles.tile} style={{ "--tint": board.color } as CSSProperties} href={studyHref({ board: board.id })}>
      <div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{board.icon}</span><span aria-hidden="true">↗</span></div>
      <h3>{board.name}</h3><p>{board.sub}</p><span className={styles.subline}>Choose your level →</span>
    </Link>)}
      <Link className={styles.tile} style={{ "--tint": "#5275e7" } as CSSProperties} href="/en/exam-prep/any-board"><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">+</span><span className={styles.badge}>Universal route</span></div><h3>Another exam board</h3><p>Match any official syllabus topic to the subject resources on LearnerKits.</p><span className={styles.subline}>Open the guide →</span></Link>
    </div>
    <div className={styles.strip} style={{ marginTop: 18 }}><div><span className="eyebrow">Practical skills</span><strong>Practise a physics practical.</strong><small>Take readings, plot the graph and get marked feedback.</small></div><div className={styles.actions}>{practicalKinds.map((kind) => <Link key={kind} className="button" href={studyHref({ practical: kind })}>{practicalCopy[kind].tab} →</Link>)}</div></div>
  </>;
}

function BoardView({ board }: { board: Board }) {
  const seo = getBoardSeo(board.id);
  return <>
    <Trail items={[{ name: board.name }]} />
    <header className={styles.hero}><span className="eyebrow">Step 1 of 3 · {board.short}</span><h2>{board.name}: choose your level</h2>{seo && <p>{seo.lead}</p>}</header>
    {seo && <p className={styles.disclosure}>{seo.overview}</p>}
    <div className={styles.tiles}>{board.levels.map((level, index) => {
      const published = isLevelIndexable(board.id, level.id);
      return <Link key={level.id} className={styles.tile} style={{ "--tint": board.color } as CSSProperties} href={studyHref({ board: board.id, level: level.id })}>
        <div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className={`${styles.badge} ${published ? styles.free : ""}`}>{published ? "Published syllabus" : "Illustrative preview"}</span></div>
        <h3>{board.short} {level.name.replace(" · ", " ")}</h3><p>{level.detail}</p><span className={styles.subline}>View subjects →</span>
      </Link>;
    })}</div>
  </>;
}

function LevelView({ board, level }: { board: Board; level: Level }) {
  return <>
    <Trail items={[{ name: board.name, target: { board: board.id } }, { name: level.name }]} />
    <header className={styles.hero}><span className="eyebrow">Step 2 of 3 · {board.short} · {level.name}</span><h2>What subject are you studying?</h2><p>{board.name} · {level.name} ({level.detail}). Choose a subject to see its topics.</p></header>
    <div className={styles.tiles}>{subjects.map((subject) => {
      const course = { board: board.id, level: level.id, subject: subject.id };
      const tint = { "--tint": subject.color } as CSSProperties;
      if (subject.soon) return <div key={subject.id} className={`${styles.tile} ${styles.soon}`} style={tint}><div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.icon}</span><span className={styles.badge}>Coming soon</span></div><h3>{subject.name}</h3><p>{subject.desc}</p></div>;
      const code = subjectCode(course);
      return <Link key={subject.id} className={styles.tile} style={tint} href={studyHref(course)}>
        <div className={styles.tileTop}><span className={styles.glyph} aria-hidden="true">{subject.icon}</span><span className={`${styles.badge} ${isVerified(course) ? styles.free : ""}`}>{isVerified(course) ? "Published syllabus" : "Illustrative preview"}</span></div>
        <h3>{subject.name}{code && ` · ${code}`}</h3><p>{subject.desc}</p><span className={styles.subline}>{getSyllabus(course).length} topics →</span>
      </Link>;
    })}</div>
  </>;
}

function CourseView({ course }: { course: Course }) {
  const board = getBoard(course.board)!, level = getLevel(course.board, course.level)!, subject = getSubject(course.subject)!;
  const topics = getSyllabus(course), verified = isVerified(course), source = sources[syllabusKey(course)], code = subjectCode(course), papers = getPapers(course);
  return <>
    <Trail items={[{ name: board.name, target: { board: board.id } }, { name: level.name, target: { board: board.id, level: level.id } }, { name: subject.name }]} />
    <header className={styles.hero}><span className="eyebrow">Step 3 of 3 · {board.short} · {level.name}</span><h2>{subject.name}{code && <small> {code}</small>}</h2><p>{board.name} · {level.name} · {topics.length} {verified ? "published syllabus topic and unit headings" : "illustrative topic previews"}.</p></header>
    {!verified && <div style={{ marginBottom: 18 }}><IllustrativeNotice /></div>}
    <div className={styles.strip}><div><span className="eyebrow">Exam practice</span><strong>Ready to test your knowledge?</strong><small>Try a timed mock with original exam-style questions.</small></div><Link className="button primary" href="/en/mock-exams">Explore mock exams →</Link></div>
    {papers && <div className={styles.strip}><div><span className="eyebrow">Choose exam component</span><strong>Study for the paper you will actually sit.</strong><small>Paper formats from the published specification, with practical-skills practice.</small></div><Link className="button" href={studyHref({ ...course, view: "papers" })}>View exam papers →</Link></div>}
    <section className={styles.topicList} aria-labelledby="syllabus-heading">
      <div className={styles.listHead}><div><h3 id="syllabus-heading" style={{ fontSize: "1rem", margin: 0 }}>Your syllabus</h3><small>2 sample lessons free · the rest are part of Premium</small></div><span className={styles.badge}>{topics.length} topics</span></div>
      {topics.map((topic, index) => {
        const free = isFreeTopic(course, topic, index);
        return <Link key={topic.slug} className={styles.topicRow} href={studyHref({ ...course, topic: topic.slug })}>
          <span className={styles.topicNum} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.topicTitle}>{topic.name}<small>{topic.section} · {topic.lab ? labs[topic.lab].name : "Concept lesson and practice question"}</small></span>
          <span className={`${styles.badge} ${free ? styles.free : styles.paid}`}>{free ? "Free" : "Premium"}</span>
        </Link>;
      })}
    </section>
    {verified
      ? <Notice><strong>Curriculum source:</strong> topic names follow the published specification.{source && <> <a href={source} target="_blank" rel="noopener noreferrer">View the official syllabus ↗</a></>} Lab recommendations are LearnerKits editorial matches, not exam-board endorsements, and some related labs cover only part of a topic. LearnerKits is independent and is not affiliated with {board.name}.</Notice>
      : <Notice>LearnerKits is independent and is not affiliated with or endorsed by {board.name}. Verify the exact specification and exam year with your teacher or the awarding body.</Notice>}
  </>;
}

function TopicView({ course, slug }: { course: Course; slug: string }) {
  const topics = getSyllabus(course), index = topics.findIndex((topic) => topic.slug === slug);
  if (index < 0) return <CourseView course={course} />;
  const topic = topics[index];
  const board = getBoard(course.board)!, level = getLevel(course.board, course.level)!, subject = getSubject(course.subject)!;
  const content = lessonContent[topic.content], detail = lessonDetail[topic.content], lab = topic.lab ? labs[topic.lab] : null;
  const free = isFreeTopic(course, topic, index), verified = isVerified(course), id = topicPath(course, topic);
  // The lesson's own check question joins the bank, so every topic has at least five to draw from.
  const pool = [{ question: content.question, options: content.options, answer: content.answer, why: content.why }, ...questionBank[topic.content]];
  const lesson = <>
    <section className={styles.panel} aria-labelledby="worked">
      <div className={styles.panelTop}><h3 id="worked">Key relationship and worked example</h3></div>
      <div className={styles.formula}>{content.formula}</div>
      <div className={styles.example}><strong>Worked example</strong>{content.example}</div>
    </section>
    <TopicExam topicId={id} topicName={topic.name} content={topic.content} pool={pool} hint={content.hint} />
    <TopicTutor topic={topic.name} course={courseTitle(course)} subject={subject.name} concepts={content.brief} />
  </>;
  return <>
    <Trail items={[{ name: board.name, target: { board: board.id } }, { name: level.name, target: { board: board.id, level: level.id } }, { name: subject.name, target: course }, { name: topic.name }]} />
    <header className={styles.hero}>
      <span className="eyebrow">{board.short} · {level.name} · {subject.name}</span>
      <h2>{topic.name}</h2>
      <p>{topic.section !== "Sample" && <>Syllabus section {topic.section} · </>}{courseTitle(course)} · {free ? "Free sample lesson" : "Premium lesson"}</p>
    </header>
    {!verified && <div style={{ marginBottom: 18 }}><IllustrativeNotice /></div>}
    <div className={styles.lessonGrid}>
      <aside className={styles.side}>
        <nav aria-label="Topics in this syllabus"><h3>In this syllabus</h3>
          <div className={styles.chapterNav}>{topics.map((item, i) => <Link key={item.slug} href={studyHref({ ...course, topic: item.slug })} aria-current={i === index ? "page" : undefined}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{item.name}</span>{!isFreeTopic(course, item, i) && <span aria-label="Premium">✦</span>}</Link>)}</div>
        </nav>
        <Link className={styles.backLink} href={studyHref(course)}>← All topics</Link>
      </aside>
      <div className={styles.main}>
        <section className={styles.panel} aria-labelledby="concept">
          <div className={styles.panelTop}><h3 id="concept">{topic.name} explained simply</h3><span className={`${styles.badge} ${styles.free}`}>3-minute read</span></div>
          <p>{content.brief}</p>
          <ol className={styles.points}>{detail.explain.map((point) => <li key={point}>{point}</li>)}</ol>
          <div className={styles.mistake}><strong>Common mistake</strong>{detail.mistake}</div>
        </section>
        <section className={styles.panel} aria-labelledby="experiment">
          <div className={styles.panelTop}><h3 id="experiment">Try it: interactive simulation</h3>{lab && <span className={`${styles.badge} ${styles.free}`}>Free lab</span>}</div>
          {lab && <><p>Change one variable, predict the result, then check the reading.</p><MiniSim kind={lab.kind} /></>}
          <div className={styles.labCard} style={lab ? { marginTop: 14 } : undefined}>
            {lab ? <>
              <div className={styles.labTop}><div><div className={styles.status}>● FREE LEARNERKITS LAB{!topic.direct && " · RELATED LAB"}</div><h4>{lab.name}</h4></div></div>
              <p>Use the full interactive lab to observe, measure and test this idea.{!topic.direct && " This lab is related to the topic but does not cover all of its syllabus requirements."}</p>
              <Link className="textLink" href={`/en/simulations/${lab.slug}`}>Open {lab.name} →</Link>
            </> : <>
              <div className={styles.status} style={{ color: "var(--muted)" }}>NO DIRECT LAB YET</div><h4>A dedicated simulation is planned</h4>
              <p>This topic does not yet have a closely matching LearnerKits lab.</p>
              <Link className="textLink" href="/en/simulations">Browse the free lab library →</Link>
            </>}
          </div>
        </section>
        {free ? lesson : <PremiumGate title="The rest of this lesson is part of Premium" description="Unlock the key formula and worked example, the randomised topic test with your understanding score, and the AI tutor for this topic.">{lesson}</PremiumGate>}
      </div>
    </div>
  </>;
}

function paperAction(paper: Paper, course: Course, cambridge: boolean): { href: string; label: string } {
  if (paper.action === "mock") return { href: mockExamHref(cambridge ? "9702free" : undefined), label: "Try a sample MCQ mock →" };
  if (paper.action === "practical") return paper.type === "analysis" ? { href: studyHref({ practical: "pendulum" }), label: "Practise data analysis →" } : { href: studyHref({ practical: "circuit" }), label: "Practise practical skills →" };
  return { href: studyHref(course), label: "Revise the topics →" };
}

function PapersView({ course }: { course: Course }) {
  const set = getPapers(course);
  if (!set) return <CourseView course={course} />;
  const board = getBoard(course.board)!, level = getLevel(course.board, course.level)!, subject = getSubject(course.subject)!, cambridge = set.key === "cambridge9702";
  return <>
    <Trail items={[{ name: board.name, target: { board: board.id } }, { name: level.name, target: { board: board.id, level: level.id } }, { name: subject.name, target: course }, { name: "Exam papers" }]} />
    <header className={styles.hero}>
      <span className="eyebrow">Paper navigator · {courseTitle(course)}</span>
      <h2>Choose your exact exam paper.</h2>
      <p>See what each paper assesses, its format and official duration, then continue into timed practice, topic revision or practical-skills practice.{cambridge && " Details follow the published 2025–2027 syllabus."}</p>
    </header>
    {cambridge && <div style={{ marginBottom: 18 }}><Notice><strong>AS and A Level:</strong> AS Level assessment uses Papers 1–3. The full A Level also includes Papers 4 and 5. Follow your own component entry route.</Notice></div>}
    <div className={styles.paperGrid}>{set.papers.map((paper) => {
      const link = paperAction(paper, course, cambridge), practical = paper.type === "practical" || paper.type === "analysis";
      return <article key={paper.n} className={`${styles.paperCard} ${practical ? styles.emphasis : ""}`}>
        <div className={styles.tileTop}><span className={styles.paperNum}>{paper.n.toUpperCase()}</span><span className={`${styles.badge} ${practical ? styles.paid : styles.free}`}>{practical ? "Practical skills" : "Exam format"}</span></div>
        <h3 style={{ fontSize: "1.15rem", margin: 0, letterSpacing: "-.03em" }}>{paper.name}</h3>
        <p>{paper.detail}</p>
        <div className={styles.chips}><span>◷ {paper.time}</span><span>▤ {paper.marks}</span><span>{paper.level}</span></div>
        <div className={styles.actions} style={{ marginTop: 4 }}><Link className="button primary" href={link.href}>{link.label}</Link><a className="textLink" href={set.source} target="_blank" rel="noopener noreferrer">Official specification ↗</a></div>
      </article>;
    })}</div>
    <Notice><strong>Source policy:</strong> paper names, durations and marks come from the board’s published specification. Always check your exam year and component entry rules. Practical papers require hands-on laboratory work; browser practice is supplementary. LearnerKits practice material is original and is not endorsed by {board.name}.</Notice>
  </>;
}

function PracticalView({ kind }: { kind: PracticalKind }) {
  const text = practicalCopy[kind];
  return <>
    <Trail items={[{ name: "Practical skills" }]} />
    <header className={styles.hero}>
      <span className="eyebrow">Practical skills · Original short practice</span>
      <h2>{text.title}</h2>
      <p>{text.lead} Collect data with interactive apparatus and get feedback on measurement, graph and evaluation skills.</p>
    </header>
    <nav className={styles.tabs} aria-label="Practical experiments">{practicalKinds.map((item) => <Link key={item} href={studyHref({ practical: item })} aria-current={item === kind ? "page" : undefined}>{practicalCopy[item].tab}</Link>)}</nav>
    {/* key: switching experiment starts a fresh station */}
    <PracticalStation key={kind} kind={kind} />
    <Notice><strong>Assessment context:</strong> Cambridge Physics 9702 Paper 3 is a 2-hour laboratory practical worth 40 marks and Paper 5 is a 75-minute paper worth 30 marks (<a href={paperSources.cambridge9702} target="_blank" rel="noopener noreferrer">2025–2027 syllabus ↗</a>). This 20-minute virtual activity is original LearnerKits practice. It is not an official paper, is not endorsed by any exam board, and does not replace experiments with real equipment. Want the full experiment? <Link href={`/en/simulations/${text.lab}`}>Open the {text.labName} →</Link></Notice>
  </>;
}

/** Picks the deepest valid step for a study target; unknown parts fall back to the step above. */
export function StudyView({ target }: { target: StudyTarget }) {
  if (target.practical && isPracticalKind(target.practical)) return <PracticalView kind={target.practical} />;
  const board = target.board ? getBoard(target.board) : undefined;
  if (!board) return <BoardList />;
  const level = target.level ? getLevel(board.id, target.level) : undefined;
  if (!level) return <BoardView board={board} />;
  const course = { board: board.id, level: level.id, subject: target.subject ?? "" };
  if (!target.subject || !isCourse(course)) return <LevelView board={board} level={level} />;
  if (target.view === "papers") return <PapersView course={course} />;
  if (target.topic) return <TopicView course={course} slug={target.topic} />;
  return <CourseView course={course} />;
}

export default function ExamStudy() {
  const params = useSearchParams();
  const target = readStudyTarget(params);
  const key = studyHref(target);
  const top = useRef<HTMLDivElement>(null);
  // Moving to another step keeps the student at the top of the study area, not deep in the old page.
  useEffect(() => { if (key !== "/en/exam-prep") top.current?.scrollIntoView({ block: "start" }); }, [key]);
  return <div ref={top} className={`${styles.page} ${styles.study}`}>
    <StudyView target={target} />
    <IndependenceNotice />
  </div>;
}
