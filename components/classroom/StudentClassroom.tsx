"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/session";
import { classroom } from "@/lib/classroom/client";
import type { MockAttempt, StudentAssignment, StudentState } from "@/lib/classroom/types";
import { Field, formatDate, formValue, labTitle, SignInGate, useToast } from "./shared";
import styles from "./classroom.module.css";

const letter = (index: number) => String.fromCharCode(65 + index);

function AssignmentView({ assignment, submit, close }: { assignment: StudentAssignment; submit: (payload: Record<string, unknown>) => Promise<boolean>; close: () => void }) {
  const { submission, paper, lesson } = assignment;
  const [busy, setBusy] = useState(false);
  const send = async (form: HTMLFormElement) => {
    const data = new FormData(form);
    const payload = paper ? { answers: Object.fromEntries(paper.questions.map((question) => [question.id, Number(data.get(`answer-${question.id}`))])) } : { response: formValue(form, "response") };
    setBusy(true);
    await submit({ assignmentId: assignment.id, ...payload });
    setBusy(false);
  };
  return <section className={styles.panel}>
    <div className={styles.between}>
      <div><span className={`${styles.badge} ${styles.accent}`}>{assignment.kind === "paper" ? "Question paper" : "Lesson"}</span><h2 style={{ marginTop: 8 }}>{assignment.title}</h2><p className={styles.hint}>{assignment.className} · {assignment.teacherName}{assignment.due_date ? ` · Due ${assignment.due_date}` : ""}</p></div>
      <button type="button" className={`${styles.btn} ${styles.small}`} onClick={close}>← All assignments</button>
    </div>
    {assignment.instructions && <p>{assignment.instructions}</p>}
    {lesson && <>
      {lesson.objective && <p><b>Objective:</b> {lesson.objective}</p>}
      <div className={styles.preview}>{lesson.outline}</div>
      {(lesson.labSlugs?.length ?? 0) > 0 && <div className={styles.row} style={{ marginTop: 12 }}>{lesson.labSlugs.map((slug) => <Link key={slug} className={`${styles.btn} ${styles.small}`} href={`/en/simulations/${slug}`} target="_blank">Open {labTitle(slug)} ↗</Link>)}</div>}
      {(lesson.videos?.length ?? 0) > 0 && <div className={styles.row} style={{ marginTop: 10 }}>{lesson.videos.filter((url) => url.startsWith("https://")).map((url, index) => <a key={url} className={`${styles.btn} ${styles.small}`} href={url} target="_blank" rel="noopener noreferrer">▶ Video {index + 1}</a>)}</div>}
    </>}
    {submission ? <>
      <p className={styles.notice} role="status"><strong>{submission.status === "graded" ? `Result: ${submission.score} / ${submission.total}` : "Submitted. Waiting for your teacher's review."}</strong>{submission.feedback ? <><br />Teacher feedback: {submission.feedback}</> : null}</p>
      {paper ? <div className={styles.rows}>{paper.questions.map((question, index) => {
        const given = submission.answers?.[question.id];
        return <div key={question.id} className={styles.question}>
          <b>{index + 1}. {question.q}</b>
          {question.options.map((option, choice) => <div key={choice} className={`${styles.option} ${choice === question.answer ? styles.right : choice === given ? styles.wrong : ""}`}>{letter(choice)}. {option}{choice === given ? " (your answer)" : ""}</div>)}
          {question.why && <span className={styles.hint} style={{ margin: 0 }}>{question.why}</span>}
        </div>;
      })}</div> : <div className={styles.preview}>{submission.response}</div>}
    </> : <form style={{ marginTop: 14 }} onSubmit={(event) => { event.preventDefault(); void send(event.currentTarget); }}>
      {paper ? <div className={styles.rows}>{paper.questions.map((question, index) => <fieldset key={question.id} className={styles.question} style={{ margin: 0 }}>
        <legend style={{ fontWeight: 760, padding: 0 }}>{index + 1}. {question.q}</legend>
        {question.options.map((option, choice) => <label key={choice} className={styles.option}><input type="radio" name={`answer-${question.id}`} value={choice} required />{letter(choice)}. {option}</label>)}
      </fieldset>)}</div> : <div className={styles.form}><Field label="Your observations and answer" full><textarea name="response" required minLength={8} maxLength={4000} style={{ minHeight: 150 }} placeholder="What did you change, what did you observe, and what does it show?" /></Field></div>}
      <div className={styles.row} style={{ marginTop: 14 }}><button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={busy}>{busy ? "Submitting…" : "Submit →"}</button><span className={styles.hint} style={{ margin: 0 }}>You can submit once.</span></div>
    </form>}
  </section>;
}

function Classroom() {
  const { session } = useAuth();
  const { notify, toast } = useToast();
  const [state, setState] = useState<StudentState | null>(null);
  const [attempts, setAttempts] = useState<MockAttempt[]>([]);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const result = await classroom<StudentState>("studentState");
    if (result.ok) { setState(result.data); setError(""); } else setError(result.error);
  }, []);
  useEffect(() => {
    void reload();
    void classroom<{ attempts: MockAttempt[] }>("mockAttempts").then((result) => { if (result.ok) setAttempts(result.data.attempts); });
  }, [reload]);

  const act = async (action: string, payload: Record<string, unknown>, success: string) => {
    const result = await classroom(action, payload);
    notify(result.ok ? success : result.error);
    if (result.ok) await reload();
    return result.ok;
  };

  if (error) return <p className={`${styles.notice} ${styles.error}`} role="alert">{error} <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => void reload()}>Try again</button></p>;
  if (!state) return <p role="status" className={styles.empty}>Loading your classroom…</p>;
  const open = state.assignments.find((assignment) => assignment.id === openId);
  const graded = state.assignments.filter((assignment) => assignment.submission?.status === "graded");
  const average = graded.length ? Math.round(graded.reduce((sum, assignment) => sum + assignment.submission!.score! / assignment.submission!.total, 0) / graded.length * 100) : null;

  return <>
    <header className={styles.head}><div><span className="eyebrow">My classroom</span><h1>Your classes and assignments</h1><p>Open work from your teacher, submit your answers and see your results and feedback.</p></div></header>
    {open ? <AssignmentView assignment={open} close={() => setOpenId(null)} submit={(payload) => act("submitAssignment", payload, "Submitted.")} /> : <>
      <div className={styles.grid4} style={{ marginBottom: 16 }}>
        <div className={styles.stat}><span>Classes</span><strong>{state.classes.length}</strong></div>
        <div className={styles.stat}><span>To do</span><strong>{state.assignments.filter((assignment) => !assignment.submission).length}</strong></div>
        <div className={styles.stat}><span>Submitted</span><strong>{state.assignments.filter((assignment) => assignment.submission).length}</strong></div>
        <div className={styles.stat}><span>Average mark</span><strong>{average === null ? "—" : `${average}%`}</strong></div>
      </div>
      <div className={styles.grid2} style={{ gridTemplateColumns: "minmax(0,1.25fr) minmax(0,.75fr)" }}>
        <section className={styles.panel}>
          <h2>Assignments</h2>
          {state.assignments.length ? <div className={styles.rows}>{state.assignments.map((assignment) => <div key={assignment.id} className={styles.item}>
            <div><h3>{assignment.title}</h3><p>{assignment.className} · {assignment.kind === "paper" ? "Question paper" : "Lesson"}{assignment.due_date ? ` · Due ${assignment.due_date}` : ""}</p></div>
            <div className={styles.row}>
              <span className={`${styles.badge} ${assignment.submission ? assignment.submission.status === "graded" ? styles.good : styles.warn : ""}`}>{assignment.submission ? assignment.submission.status === "graded" ? `${assignment.submission.score} / ${assignment.submission.total}` : "Awaiting review" : "To do"}</span>
              <button type="button" className={`${styles.btn} ${styles.small} ${styles.primary}`} onClick={() => setOpenId(assignment.id)}>{assignment.submission ? "View" : "Open"}</button>
            </div>
          </div>)}</div> : <div className={styles.empty}>{state.classes.length ? "Your teacher has not assigned any work yet." : "Join a class with the code from your teacher to see assignments."}</div>}
        </section>
        <div className={styles.rows} style={{ marginTop: 0 }}>
          <section className={styles.panel}>
            <h2>Join a class</h2>
            <form className={styles.form} onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; if (await act("joinClass", { code: formValue(form, "code"), name: formValue(form, "name") }, "You joined the class.")) form.reset(); }}>
              <Field label="Class code" full><input name="code" required maxLength={20} autoComplete="off" placeholder="e.g. K7QM2XP" style={{ textTransform: "uppercase" }} /></Field>
              <Field label="Your name (shown to your teacher)" full><input name="name" required maxLength={80} defaultValue={String(session?.user.user_metadata?.full_name ?? "")} /></Field>
              <div className={styles.full}><button type="submit" className={`${styles.btn} ${styles.primary}`}>Join class</button></div>
            </form>
            {state.classes.length > 0 && <div className={styles.rows}>{state.classes.map((group) => <div key={group.id} className={styles.item}>
              <div><h3>{group.name}</h3><p>{group.teacherName} · {[group.level, group.subject].filter(Boolean).join(" ")}</p></div>
              <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => { if (confirm(`Leave "${group.name}"?`)) void act("leaveClass", { classId: group.id }, "You left the class."); }}>Leave</button>
            </div>)}</div>}
          </section>
          <section className={styles.panel}>
            <div className={styles.between}><h2>Mock exam history</h2><Link className="textLink" href="/en/mock-exams">Mock exams →</Link></div>
            {attempts.length ? <div className={styles.rows}>{attempts.slice(0, 6).map((attempt) => <div key={attempt.id} className={styles.item}><div><h3>{attempt.exam_id}</h3><p>{formatDate(attempt.created_at)} · {Math.floor(attempt.seconds / 60)} min</p></div><span className={`${styles.badge} ${styles.accent}`}>{attempt.score} / {attempt.total}</span></div>)}</div> : <p className={styles.hint}>Finish a mock exam while signed in to track it here.</p>}
          </section>
        </div>
      </div>
    </>}
    {toast}
  </>;
}

export function StudentClassroom() {
  return <SignInGate title="Sign in to your classroom" lead="Use your Google account, then enter the class code from your teacher."><Classroom /></SignInGate>;
}
