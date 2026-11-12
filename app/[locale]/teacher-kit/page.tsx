import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { planIds, plans } from "@/lib/classroom/plans";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/classroom/classroom.module.css";

const title = "Teacher Kit: Lesson Planner, Question Papers & Class Assignments";
const description = "Plan science lessons with interactive simulations, build question papers from an original question bank, assign work to your classes and review results in one workspace.";
const features: [string, string][] = [
  ["Lesson planner", "Draft a timed lesson plan with AI or a template, attach LearnerKits simulations and video links, then edit every line."],
  ["Whole-subject kits", "Start a full course outline with an editable chapter for each topic: lesson, worksheet, homework, quiz and rubric."],
  ["Question bank and papers", "Combine original practice questions with your own and save them as a paper that is marked automatically."],
  ["Classes and assignments", "Create classes, share a join code, and send lessons or papers to each group with a due date."],
  ["Marking and feedback", "See every submission, review written responses, and send a score with feedback."],
  ["Class insights and exports", "Find the topics where a class loses marks, and export lessons, papers and grades to Word or CSV."],
];
const faq = [
  { q: "How do students join my class?", a: "Each class has a join code. Students open My classroom on LearnerKits, sign in with their own Google account and enter the code." },
  { q: "Are the practice questions official exam questions?", a: "No. The question bank contains original LearnerKits practice questions and the questions you write. LearnerKits is independent and is not endorsed by any exam board." },
  { q: "Does the AI mark student work?", a: "No. Multiple-choice papers are marked against the answer key. Written responses are scored by the teacher. AI is used only to draft lesson plans, which you edit before saving." },
  { q: "How much does Teacher Kit cost?", a: "New teacher workspaces start on the Basic plan. Larger plans are not sold online yet; contact us if you need more student seats." },
];

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/teacher-kit", title, description, { englishOnly: true });
}

export default async function TeacherKitPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  return <main className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd("en", [{ name: "Home", path: "/" }, { name: "Teacher Kit", path: "/teacher-kit" }]))} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd("en", faq))} />
    <section className={styles.hero}>
      <div>
        <span className="eyebrow">LearnerKits · Teacher Kit</span>
        <h1>Teach with confidence. <span>All in one workspace.</span></h1>
        <p>Plan lessons around interactive simulations, build question papers, assign work to your classes and see where students need support.</p>
        <div className={styles.row} style={{ marginTop: 18 }}>
          <Link className="button primary" href="/en/teacher-kit/dashboard">Open teacher dashboard →</Link>
          <Link className="button" href="/en/classroom">I am a student</Link>
        </div>
      </div>
      <div className={styles.steps} aria-label="Example lesson">
        <div className={styles.step}><b>05 min</b><span><b>Starter</b><br />Predict what happens to acceleration</span></div>
        <div className={styles.step}><b>15 min</b><span><b>Investigate</b><br />Open the Newton&apos;s Laws Force Lab</span></div>
        <div className={styles.step}><b>10 min</b><span><b>Practice</b><br />Assign original exam-style questions</span></div>
        <div className={styles.step}><b>05 min</b><span><b>Exit ticket</b><br />One claim, one piece of evidence</span></div>
      </div>
    </section>
    <section className="section">
      <h2>What is in the Teacher Kit</h2>
      <div className={styles.grid3} style={{ marginTop: 16 }}>{features.map(([name, text]) => <article key={name} className={styles.panel}><h3>{name}</h3><p className={styles.hint}>{text}</p></article>)}</div>
    </section>
    <section className="section">
      <h2>Plans by class size</h2>
      <p className={styles.hint}>Seats are counted once per student across all of your classes. Every plan includes the full toolset.</p>
      <div className={styles.grid3}>{planIds.map((id) => <article key={id} className={`${styles.panel} ${styles.plan}`}>
        <span className={styles.badge} style={{ alignSelf: "flex-start" }}>{plans[id].name}</span>
        <strong>{plans[id].display}</strong>
        <ul><li>Multiple classes</li><li>Lesson planner and subject kits</li><li>Question bank and paper builder</li><li>Assignments, marking and insights</li></ul>
        {id === "basic" ? <Link className="button primary" href="/en/teacher-kit/dashboard">Start with Basic</Link> : <Link className="button" href="/en/contact">Contact us</Link>}
      </article>)}</div>
    </section>
    <section className="section">
      <h2>Questions teachers ask</h2>
      <div className={styles.rows}>{faq.map((item) => <details key={item.q} className={styles.item} style={{ display: "block" }}><summary style={{ cursor: "pointer", fontWeight: 760 }}>{item.q}</summary><p>{item.a}</p></details>)}</div>
      <p className={styles.notice}>LearnerKits is an independent education platform. Exam boards do not endorse it, and the practice material is original, not official examination content.</p>
    </section>
  </main>;
}
