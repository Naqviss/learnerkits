"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/session";
import { classroom } from "@/lib/classroom/client";
import { planIds, plans, seatsUsed } from "@/lib/classroom/plans";
import type { TeacherProfile, TeacherState } from "@/lib/classroom/types";
import { KitsTab, LessonsTab, PapersTab } from "./TeacherContent";
import { AssignmentsTab, InsightsTab, SubmissionsTab } from "./TeacherWork";
import { boards, Field, formatDate, formValue, levels, Select, SignInGate, subjects, useToast, type Act, type TeacherContext } from "./shared";
import styles from "./classroom.module.css";

const tabs = [["overview", "Overview"], ["classes", "Classes & students"], ["lessons", "Lessons"], ["kits", "Subject kits"], ["papers", "Question bank & papers"], ["assignments", "Assignments"], ["submissions", "Submissions"], ["insights", "Class insights"], ["plan", "Plan & seats"]] as const;
type Tab = typeof tabs[number][0];

function Overview({ state, go }: TeacherContext & { go: (tab: Tab) => void }) {
  const plan = plans[state.profile.plan];
  const review = state.submissions.filter((submission) => submission.status === "awaiting_review").length;
  return <>
    <div className={styles.grid4}>
      <div className={styles.stat}><span>Students</span><strong>{seatsUsed(state.members)} <small>/ {plan.display.replace(" students", "")}</small></strong><small>Across {state.classes.length} classes</small></div>
      <div className={styles.stat}><span>Lessons & papers</span><strong>{state.items.filter((item) => item.kind === "lesson" || item.kind === "paper").length}</strong><small>Ready to assign</small></div>
      <div className={styles.stat}><span>Assignments</span><strong>{state.assignments.length}</strong><small>{state.submissions.length} submissions</small></div>
      <div className={styles.stat}><span>Needs review</span><strong>{review}</strong><small>Written responses</small></div>
    </div>
    <div className={styles.grid2} style={{ marginTop: 16 }}>
      <section className={styles.panel}>
        <div className={styles.between}><h2>Your classes</h2><button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => go("classes")}>Manage</button></div>
        {state.classes.length ? <div className={styles.rows}>{state.classes.map((group) => <div key={group.id} className={styles.item}>
          <div><h3>{group.name}</h3><p>{[group.board, group.level, group.subject].filter(Boolean).join(" · ")}</p></div>
          <span className={styles.badge}>{state.members.filter((member) => member.class_id === group.id).length} students</span>
        </div>)}</div> : <div className={styles.empty}>Create your first class to get a join code for students.</div>}
      </section>
      <section className={styles.panel}>
        <h2>Quick actions</h2>
        <div className={styles.rows}>{([["kits", "Build a whole-subject kit", "Editable chapters for the full course"], ["lessons", "Plan a lesson", "Timed plan with simulations"], ["papers", "Build a question paper", "From the original question bank"], ["submissions", "Review submissions", "Mark work and give feedback"]] as const).map(([tab, title, note]) => <button key={tab} type="button" className={styles.item} style={{ cursor: "pointer", textAlign: "left", font: "inherit", color: "inherit" }} onClick={() => go(tab)}><div><h3>{title}</h3><p>{note}</p></div><span aria-hidden="true">→</span></button>)}</div>
      </section>
    </div>
  </>;
}

function Classes({ state, act, notify }: TeacherContext) {
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); notify("Copied to clipboard."); } catch { notify(text); } };
  const invite = (name: string, code: string) => `Join "${name}" on LearnerKits:\n1. Open ${window.location.origin}/en/classroom\n2. Sign in with Google\n3. Enter class code ${code}`;
  return <div className={styles.grid2} style={{ gridTemplateColumns: "minmax(0,.75fr) minmax(0,1.25fr)" }}>
    <section className={styles.panel}>
      <h2>Create a class</h2>
      <p>Each class gets a join code. Students sign in with their own Google account and enter it.</p>
      <form className={styles.form} onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; if (await act("createClass", { name: formValue(form, "name"), board: formValue(form, "board"), level: formValue(form, "level"), subject: formValue(form, "subject") }, "Class created.")) form.reset(); }}>
        <Field label="Class name" full><input name="name" required maxLength={80} placeholder="e.g. AS Physics · Group A" /></Field>
        <Field label="Board"><Select name="board" options={boards} defaultValue={boards[0]} /></Field>
        <Field label="Level"><Select name="level" options={levels} defaultValue="AS Level" /></Field>
        <Field label="Subject" full><Select name="subject" options={subjects} defaultValue="Physics" /></Field>
        <div className={styles.full}><button type="submit" className={`${styles.btn} ${styles.primary}`}>Create class</button></div>
      </form>
    </section>
    <section className={styles.panel}>
      <div className={styles.between}><h2>Classes and rosters</h2><span className={styles.badge}>{seatsUsed(state.members)} of {plans[state.profile.plan].display} used</span></div>
      {state.classes.length ? <div className={styles.rows}>{state.classes.map((group) => {
        const members = state.members.filter((member) => member.class_id === group.id);
        return <div key={group.id} className={styles.item} style={{ display: "block" }}>
          <div className={styles.between}>
            <div><h3>{group.name}</h3><p>{[group.board, group.level, group.subject].filter(Boolean).join(" · ")} · Join code <span className={styles.code}>{group.join_code}</span></p></div>
            <div className={styles.row}>
              <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => void copy(invite(group.name, group.join_code))}>Copy invite</button>
              <button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => { if (confirm(`Delete "${group.name}"? Its roster, assignments and submissions are removed.`)) void act("deleteClass", { id: group.id }, "Class deleted."); }}>Delete</button>
            </div>
          </div>
          {members.length ? <div className={styles.rows}>{members.map((member) => <div key={member.student_id} className={styles.item}>
            <div><h3>{member.student_name}</h3><p>{member.student_email ?? "No email"} · joined {formatDate(member.joined_at)}</p></div>
            <button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => { if (confirm(`Remove ${member.student_name} from this class?`)) void act("removeStudent", { classId: group.id, studentId: member.student_id }, "Student removed."); }}>Remove</button>
          </div>)}</div> : <p className={styles.hint}>No students yet. Share the invite.</p>}
        </div>;
      })}</div> : <div className={styles.empty}>No classes yet.</div>}
    </section>
  </div>;
}

function Plan({ state }: TeacherContext) {
  const used = seatsUsed(state.members);
  return <>
    <section className={styles.panel} style={{ marginBottom: 16 }}>
      <span className="eyebrow">Current plan</span>
      <h2 style={{ marginTop: 6 }}>{plans[state.profile.plan].name} · {used} of {plans[state.profile.plan].display} enrolled</h2>
      <p>Seats are counted once per student across all your classes. Teacher plans are not sold online yet: <Link className="textLink" href="/en/contact">contact us</Link> to change your plan.</p>
    </section>
    <div className={styles.grid3}>{planIds.map((id) => <section key={id} className={`${styles.panel} ${styles.plan}`}>
      <span className={`${styles.badge} ${state.profile.plan === id ? styles.accent : ""}`} style={{ alignSelf: "flex-start" }}>{state.profile.plan === id ? "Your plan" : plans[id].name}</span>
      <strong>{plans[id].display}</strong>
      <ul><li>Multiple classes</li><li>Lesson planner and subject kits</li><li>Question bank and paper builder</li><li>Assignments, marking and insights</li></ul>
    </section>)}</div>
  </>;
}

/** The teacher's tabs. The admin panel renders it too, with an `act` that refuses to change anything. */
export function TeacherWorkspace({ state, act, notify, readOnly }: TeacherContext) {
  const [tab, setTab] = useState<Tab>("overview");
  const [preset, setPreset] = useState<string | null>(null);
  const context = { state, act, notify, readOnly };
  const assign = (itemId: string) => { setPreset(itemId); setTab("assignments"); };
  return <>
    {state.profile.suspended && <p className={`${styles.notice} ${styles.error}`} role="alert">This teacher account is paused, so nothing can be changed. Contact LearnerKits support.</p>}
    <div className={styles.tabs} role="tablist" aria-label="Teacher Kit sections">{tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>)}</div>
    <div role="tabpanel">
      {tab === "overview" && <Overview {...context} go={setTab} />}
      {tab === "classes" && <Classes {...context} />}
      {tab === "lessons" && <LessonsTab {...context} onAssign={assign} />}
      {tab === "kits" && <KitsTab {...context} onAssign={assign} />}
      {tab === "papers" && <PapersTab {...context} onAssign={assign} />}
      {tab === "assignments" && <AssignmentsTab {...context} preset={preset} clearPreset={() => setPreset(null)} />}
      {tab === "submissions" && <SubmissionsTab {...context} />}
      {tab === "insights" && <InsightsTab {...context} />}
      {tab === "plan" && <Plan {...context} />}
    </div>
  </>;
}

function Workspace() {
  const { session } = useAuth();
  const { notify, toast } = useToast();
  const [profile, setProfile] = useState<TeacherProfile | null | undefined>(undefined);
  const [state, setState] = useState<TeacherState | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    const result = await classroom<TeacherState>("teacherState");
    if (result.ok) { setState(result.data); setProfile(result.data.profile); setError(""); }
    else if (result.status === 403) setProfile(null);
    else setError(result.error);
  }, []);
  useEffect(() => { void reload(); }, [reload]);

  const act = useCallback<Act>(async (action, payload = {}, success) => {
    const result = await classroom<Record<string, unknown>>(action, payload);
    if (!result.ok) { notify(result.error); return null; }
    if (success) notify(success);
    if (action !== "generateLesson") await reload();
    return result.data;
  }, [notify, reload]);

  if (error) return <p className={`${styles.notice} ${styles.error}`} role="alert">{error} <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => void reload()}>Try again</button></p>;
  if (profile === undefined) return <p role="status" className={styles.empty}>Loading your workspace…</p>;
  if (profile === null) return <section className={styles.gate}>
    <span className="eyebrow">Teacher Kit</span>
    <h1>Set up your teacher workspace</h1>
    <p>You get the Basic plan with {plans.basic.display} to start. Students join with a class code and their own Google account.</p>
    <form className={styles.form} style={{ textAlign: "left", marginTop: 18 }} onSubmit={async (event) => { event.preventDefault(); if (await act("becomeTeacher", { displayName: formValue(event.currentTarget, "displayName") }, "Welcome to Teacher Kit.")) await reload(); }}>
      <Field label="Name shown to students" full><input name="displayName" required maxLength={80} defaultValue={String(session?.user.user_metadata?.full_name ?? "")} placeholder="e.g. Ms Morgan" /></Field>
      <div className={styles.full}><button type="submit" className="button primary">Create teacher workspace</button></div>
    </form>
    {toast}
  </section>;
  return <>
    <header className={styles.head}><div><span className="eyebrow">Teacher Kit · {plans[profile.plan].name} plan</span><h1>Welcome, {profile.display_name.split(" ")[0]}</h1><p>Plan lessons, build papers, assign work and see how your classes are doing.</p></div><Link className={styles.btn} href="/en/teacher-kit">About Teacher Kit</Link></header>
    {state ? <TeacherWorkspace state={state} act={act} notify={notify} /> : <p role="status" className={styles.empty}>Loading…</p>}
    {toast}
  </>;
}

export function TeacherDashboard() {
  return <SignInGate title="Sign in to Teacher Kit" lead="Use your Google account to create classes, plan lessons and review student work."><Workspace /></SignInGate>;
}
