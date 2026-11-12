"use client";
import { useState } from "react";
import { csv, download, topicStats } from "@/lib/classroom/templates";
import type { PaperData, Submission } from "@/lib/classroom/types";
import { Field, formatDate, formValue, Select, type TeacherContext } from "./shared";
import styles from "./classroom.module.css";

export function AssignmentsTab({ state, act, preset, clearPreset }: TeacherContext & { preset: string | null; clearPreset: () => void }) {
  const assignable = state.items.filter((item) => item.kind === "lesson" || item.kind === "paper");
  const create = async (form: HTMLFormElement) => {
    const sent = await act("createAssignment", { classId: formValue(form, "classId"), itemId: formValue(form, "itemId"), due: formValue(form, "due"), instructions: formValue(form, "instructions") }, "Assignment sent to the class.");
    if (sent) { form.reset(); clearPreset(); }
  };
  return <div className={styles.grid2} style={{ gridTemplateColumns: "minmax(0,.8fr) minmax(0,1.2fr)" }}>
    <section className={styles.panel}>
      <h2>Send an assignment</h2>
      {state.classes.length && assignable.length ? <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void create(event.currentTarget); }}>
        <Field label="Class" full><Select name="classId" options={state.classes.map((group) => [group.id, group.name] as const)} /></Field>
        <Field label="Saved lesson or paper" full><Select key={preset ?? "none"} name="itemId" options={assignable.map((item) => [item.id, `${item.kind === "paper" ? "Paper" : "Lesson"} · ${item.title}`] as const)} defaultValue={preset ?? assignable[0].id} /></Field>
        <Field label="Due date (optional)" full><input name="due" type="date" /></Field>
        <Field label="Instructions" full><textarea name="instructions" maxLength={1500} defaultValue="Complete the activity and submit your answers." /></Field>
        <div className={styles.full}><button type="submit" className={`${styles.btn} ${styles.primary}`}>Assign to class →</button></div>
      </form> : <div className={styles.empty}>You need a class and at least one saved lesson or question paper first.</div>}
    </section>
    <section className={styles.panel}>
      <div className={styles.between}><h2>Assignments</h2><span className={styles.badge}>{state.assignments.length}</span></div>
      {state.assignments.length ? <div className={styles.tableWrap}><table className={styles.table}>
        <thead><tr><th>Assignment</th><th>Class</th><th>Due</th><th>Submitted</th><th></th></tr></thead>
        <tbody>{state.assignments.map((assignment) => {
          const members = state.members.filter((member) => member.class_id === assignment.class_id).length;
          return <tr key={assignment.id}>
            <td><b>{assignment.title}</b><small>{assignment.kind === "paper" ? "Question paper" : "Lesson"} · sent {formatDate(assignment.created_at)}</small></td>
            <td>{state.classes.find((group) => group.id === assignment.class_id)?.name ?? "—"}</td>
            <td>{assignment.due_date ?? "No deadline"}</td>
            <td>{state.submissions.filter((submission) => submission.assignment_id === assignment.id).length} / {members}</td>
            <td><button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => { if (confirm(`Remove "${assignment.title}" and its submissions?`)) void act("deleteAssignment", { id: assignment.id }, "Assignment removed."); }}>Remove</button></td>
          </tr>;
        })}</tbody>
      </table></div> : <div className={styles.empty}>Nothing assigned yet.</div>}
    </section>
  </div>;
}

function Review({ submission, state, act, close }: TeacherContext & { submission: Submission; close: () => void }) {
  const assignment = state.assignments.find((row) => row.id === submission.assignment_id);
  const paper = assignment?.kind === "paper" ? state.items.find((item) => item.id === assignment.item_id)?.data as PaperData | undefined : undefined;
  const save = async (form: HTMLFormElement) => {
    const payload: Record<string, unknown> = { id: submission.id, feedback: formValue(form, "feedback") };
    if (assignment?.kind === "lesson") payload.score = Number(formValue(form, "score"));
    if (await act("gradeSubmission", payload, "Feedback saved.")) close();
  };
  return <section className={styles.panel}>
    <div className={styles.between}><h2>{submission.student_name} — {assignment?.title}</h2><button type="button" className={`${styles.btn} ${styles.small}`} onClick={close}>Close</button></div>
    {paper ? <>
      <p>Marked automatically: <b>{submission.score} / {submission.total}</b></p>
      <div className={styles.rows}>{paper.questions.map((question, index) => {
        const given = submission.answers?.[question.id];
        return <div key={question.id} className={styles.question}>
          <b>{index + 1}. {question.q}</b>
          <span className={`${styles.badge} ${given === question.answer ? styles.good : styles.warn}`} style={{ justifySelf: "start" }}>{given === question.answer ? "Correct" : "Incorrect"}</span>
          <span className={styles.hint} style={{ margin: 0 }}>Answered: {given === undefined ? "—" : question.options[given]} · Correct: {question.options[question.answer]}</span>
        </div>;
      })}</div>
    </> : <div className={styles.preview}>{submission.response}</div>}
    <form className={styles.form} style={{ marginTop: 14 }} onSubmit={(event) => { event.preventDefault(); void save(event.currentTarget); }}>
      {assignment?.kind === "lesson" && <Field label={`Score (0–${submission.total})`}><input name="score" type="number" min={0} max={submission.total} step={1} required defaultValue={submission.score ?? ""} /></Field>}
      <Field label="Feedback for the student" full><textarea name="feedback" maxLength={2000} defaultValue={submission.feedback} placeholder="What went well, and what to revise next." /></Field>
      <div className={styles.full}><button type="submit" className={`${styles.btn} ${styles.primary}`}>Save feedback</button></div>
    </form>
  </section>;
}

export function SubmissionsTab(context: TeacherContext) {
  const { state } = context;
  const [openId, setOpenId] = useState<string | null>(null);
  const open = state.submissions.find((submission) => submission.id === openId);
  const exportGrades = () => download("LearnerKits grades.csv", csv([["Student", "Assignment", "Class", "Score", "Total", "Status", "Feedback", "Submitted"], ...state.submissions.map((submission) => {
    const assignment = state.assignments.find((row) => row.id === submission.assignment_id);
    return [submission.student_name, assignment?.title, state.classes.find((group) => group.id === assignment?.class_id)?.name, submission.score, submission.total, submission.status, submission.feedback, submission.submitted_at];
  })]), "text/csv;charset=utf-8");
  if (open) return <Review {...context} submission={open} close={() => setOpenId(null)} />;
  return <section className={styles.panel}>
    <div className={styles.between}><h2>Student submissions</h2><button type="button" className={`${styles.btn} ${styles.small}`} disabled={!state.submissions.length} onClick={exportGrades}>↓ Grades CSV</button></div>
    <p>Question papers are marked automatically. Written lesson responses wait for your score and feedback.</p>
    {state.submissions.length ? <div className={styles.tableWrap}><table className={styles.table}>
      <thead><tr><th>Student</th><th>Assignment</th><th>Result</th><th>Submitted</th><th></th></tr></thead>
      <tbody>{state.submissions.map((submission) => <tr key={submission.id}>
        <td><b>{submission.student_name}</b></td>
        <td>{state.assignments.find((row) => row.id === submission.assignment_id)?.title ?? "—"}</td>
        <td><span className={`${styles.badge} ${submission.status === "graded" ? styles.accent : styles.warn}`}>{submission.status === "graded" ? `${submission.score} / ${submission.total}` : "Awaiting review"}</span></td>
        <td>{formatDate(submission.submitted_at)}</td>
        <td><button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => setOpenId(submission.id)}>Review</button></td>
      </tr>)}</tbody>
    </table></div> : <div className={styles.empty}>No submissions yet. They appear here as students hand in work.</div>}
  </section>;
}

export function InsightsTab({ state }: TeacherContext) {
  const [classId, setClassId] = useState("all");
  const stats = topicStats(state.assignments, state.items, state.submissions, classId === "all" ? undefined : classId);
  const answers = stats.reduce((sum, row) => sum + row.total, 0);
  return <>
    <section className={styles.panel} style={{ marginBottom: 16 }}>
      <div className={styles.between}>
        <div><h2>Where the class loses marks</h2><p className={styles.hint}>Accuracy by topic across submitted question papers. Treat topics with only a few answers as low evidence.</p></div>
        <div className={styles.field}><Select name="class" options={[["all", "All classes"] as const, ...state.classes.map((group) => [group.id, group.name] as const)]} value={classId} onChange={setClassId} /></div>
      </div>
    </section>
    <div className={styles.grid3} style={{ marginBottom: 16 }}>
      <div className={styles.stat}><span>Answers analysed</span><strong>{answers}</strong></div>
      <div className={styles.stat}><span>Topics with results</span><strong>{stats.length}</strong></div>
      <div className={styles.stat}><span>Topics below 60%</span><strong>{stats.filter((row) => row.correct / row.total < 0.6).length}</strong></div>
    </div>
    <section className={styles.panel}>
      {stats.length ? <div className={styles.rows} style={{ marginTop: 0 }}>{stats.map((row) => {
        const percent = Math.round(row.correct / row.total * 100);
        return <div key={row.topic} className={styles.item} style={{ display: "block" }}>
          <div className={styles.between}><div><h3>{row.topic}</h3><p>{row.correct} correct of {row.total} answers</p></div><strong style={{ fontSize: "1.2rem" }}>{percent}%</strong></div>
          <div className={styles.track}><span style={{ width: `${percent}%` }} /></div>
          <span className={`${styles.badge} ${row.total < 5 ? "" : percent < 60 ? styles.warn : styles.good}`} style={{ marginTop: 9 }}>{row.total < 5 ? "Low evidence" : percent < 60 ? "Needs revision" : "Secure"}</span>
        </div>;
      })}</div> : <div className={styles.empty}>No marked papers yet. Assign a question paper to see topic-level results.</div>}
    </section>
  </>;
}
