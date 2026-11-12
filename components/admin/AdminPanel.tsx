"use client";
import { useCallback, useEffect, useState } from "react";
import type { AdminOverview } from "@/lib/admin/api";
import { planIds, plans } from "@/lib/classroom/plans";
import type { TeacherState } from "@/lib/classroom/types";
import { TeacherWorkspace } from "@/components/classroom/TeacherDashboard";
import { AdminRevenue } from "@/components/admin/AdminRevenue";
import { AdminContentManager } from "@/components/admin/AdminContentManager";
import { Field, formatDate, formValue, useToast } from "@/components/classroom/shared";
import styles from "@/components/classroom/classroom.module.css";
import dashboard from "@/components/admin/admin.module.css";

// The signed token lives only in this tab; closing it signs the admin out.
const tokenKey = "learnerkits-admin-token";
const readToken = () => { try { return sessionStorage.getItem(tokenKey); } catch { return null; } };
const tabs = [["overview", "Overview"], ["revenue", "Revenue"], ["articles", "Articles & news"], ["questions", "Question bank"], ["teachers", "Teachers"], ["classes", "Classes"], ["students", "Students"], ["mocks", "Mock exams"], ["subscriptions", "Subscriptions"]] as const;
type Tab = typeof tabs[number][0];

async function call<T>(token: string | null, action: string, payload: Record<string, unknown> = {}): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const response = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ action, ...payload }) });
    const data = await response.json().catch(() => ({})) as T & { error?: string };
    return response.ok ? { ok: true, data } : { ok: false, status: response.status, error: data.error || "The request failed." };
  } catch { return { ok: false, status: 0, error: "Could not reach the server." }; }
}

export function AdminPanel() {
  const { notify, toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<AdminOverview | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [viewing, setViewing] = useState<TeacherState | null>(null);

  useEffect(() => { setToken(readToken()); setReady(true); }, []);
  const signOut = useCallback(() => { try { sessionStorage.removeItem(tokenKey); } catch {} setToken(null); setData(null); setViewing(null); }, []);
  const load = useCallback(async (current: string) => {
    const result = await call<AdminOverview>(current, "overview");
    if (result.ok) setData(result.data);
    else if (result.status === 401) { signOut(); setLoginError(result.error); }
    else notify(result.error);
  }, [notify, signOut]);
  useEffect(() => { if (token) void load(token); }, [token, load]);

  const control = async (action: string, payload: Record<string, unknown>, success: string, warning?: string) => {
    if (!token || (warning && !confirm(warning))) return;
    const result = await call(token, action, payload);
    if (!result.ok) { if (result.status === 401) signOut(); return notify(result.error); }
    notify(success);
    await load(token);
  };
  const view = async (userId: string) => {
    const result = await call<TeacherState>(token, "teacher", { userId });
    if (result.ok) setViewing(result.data); else notify(result.error);
  };

  if (!ready) return null;
  if (!token) return <section className={styles.gate}>
    <span className="eyebrow">LearnerKits</span>
    <h1>Admin sign-in</h1>
    <p>For site administrators only. Sessions last eight hours and end when this tab closes.</p>
    <form className={styles.form} style={{ textAlign: "left", marginTop: 18 }} onSubmit={async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const result = await call<{ token: string }>(null, "login", { username: formValue(form, "username"), password: String(new FormData(form).get("password") ?? "") });
      if (!result.ok) return setLoginError(result.error);
      try { sessionStorage.setItem(tokenKey, result.data.token); } catch {}
      setLoginError(""); setToken(result.data.token);
    }}>
      <Field label="Username" full><input name="username" required autoComplete="username" /></Field>
      <Field label="Password" full><input name="password" type="password" required autoComplete="current-password" /></Field>
      <div className={styles.full}><button type="submit" className="button primary">Sign in</button></div>
    </form>
    {loginError && <p className={`${styles.notice} ${styles.error}`} role="alert">{loginError}</p>}
  </section>;

  if (viewing) return <>
    <header className={styles.head}><div><span className="eyebrow">Admin · read-only view</span><h1>{viewing.profile.display_name}&apos;s dashboard</h1><p>{viewing.profile.email ?? "No email"} · {plans[viewing.profile.plan].name} plan. You see what this teacher sees; changes are disabled here.</p></div><button type="button" className={styles.btn} onClick={() => setViewing(null)}>← Back to admin</button></header>
    <TeacherWorkspace state={viewing} readOnly notify={notify} act={async () => { notify("Read-only: use the admin controls to change this account."); return null; }} />
    {toast}
  </>;

  const className = (id: string) => data?.classes.find((group) => group.id === id)?.name ?? "—";
  const teacherName = (id: string) => data?.teachers.find((teacher) => teacher.user_id === id)?.display_name ?? "—";
  return <>
    <header className={styles.head}><div><span className="eyebrow">Admin panel</span><h1>LearnerKits control centre</h1><p>Monitor learning activity, subscription revenue, publishing and question banks.</p></div><div className={styles.row}><button type="button" className={styles.btn} onClick={() => void load(token)}>Refresh</button><button type="button" className={styles.btn} onClick={signOut}>Sign out</button></div></header>
    <div className={styles.tabs} role="tablist" aria-label="Admin sections">{tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>)}</div>
    {!data ? <p role="status" className={styles.empty}>Loading…</p> : <div role="tabpanel">
      {tab === "overview" && <>
        <div className={dashboard.dash}>
          <section className={dashboard.overviewHero}><div><span className="eyebrow">Admin workspace</span><h2>Good to see you. Here’s the site at a glance.</h2><p>Track learning activity, manage site content and check subscription revenue.</p></div><button type="button" className={dashboard.action} onClick={() => setTab("revenue")}>Open revenue report →</button></section>
          <div className={dashboard.metricGrid}>{([["Teacher workspaces", data.counts.teachers, "Total registered teachers"], ["Active classes", data.counts.classes, `${data.counts.students} enrolled students`], ["Resources created", data.counts.items, "Lessons, papers, questions and kits"], ["Class assignments", data.counts.assignments, `${data.counts.submissions} submissions received`], ["Mock attempts", data.counts.mockAttempts, "Recorded practice exam attempts"], ["Premium subscriptions", data.counts.subscriptions, "Stored subscription records"]] as const).map(([label, value, note]) => <article key={label} className={dashboard.metric}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div>
          <div className={dashboard.columns}><section className={dashboard.card}><h2>Recent teacher workspaces</h2><p>New signups and quick access to their read-only dashboards.</p>{data.teachers.length ? <div className={dashboard.rowList}>{data.teachers.slice(0, 6).map((teacher) => <div key={teacher.user_id} className={dashboard.row}><div><strong>{teacher.display_name}</strong><small>{teacher.email ?? "No email"} · {formatDate(teacher.created_at)}</small></div><button type="button" className={dashboard.action} onClick={() => void view(teacher.user_id)}>View →</button></div>)}</div> : <div className={dashboard.empty}>No teacher workspaces yet.</div>}</section><section className={dashboard.card}><h2>Content at a glance</h2><p>Publish science learning resources and keep practice material current.</p><div className={dashboard.row}><div><strong>Articles &amp; news</strong><small>Create, update or unpublish website articles.</small></div><button type="button" className={dashboard.action} onClick={() => setTab("articles")}>Manage →</button></div><div className={dashboard.row}><div><strong>Mock exam questions</strong><small>Edit explanations and answer choices used by students.</small></div><button type="button" className={dashboard.action} onClick={() => setTab("questions")}>Manage →</button></div><div className={dashboard.row}><div><strong>Payment status</strong><small>Review completed Paddle transactions and payout totals.</small></div><button type="button" className={dashboard.action} onClick={() => setTab("revenue")}>Open →</button></div></section></div>
        </div>
      </>}
      {tab === "revenue" && <AdminRevenue token={token} onUnauthorized={signOut} />}
      {(tab === "articles" || tab === "questions") && <AdminContentManager token={token} onUnauthorized={signOut} notify={notify} />}
      {tab === "teachers" && <section className={styles.panel}>
        <h2>Teachers</h2>
        <p>Change a plan to raise or lower the student seat limit. Pausing a teacher blocks changes and new students; deleting removes their classes, resources and submissions.</p>
        {data.teachers.length ? <div className={styles.tableWrap}><table className={styles.table}>
          <thead><tr><th>Teacher</th><th>Classes</th><th>Students</th><th>Plan</th><th>Status</th><th>Controls</th></tr></thead>
          <tbody>{data.teachers.map((teacher) => {
            const classIds = data.classes.filter((group) => group.teacher_id === teacher.user_id).map((group) => group.id);
            const students = new Set(data.members.filter((member) => classIds.includes(member.class_id)).map((member) => member.student_id)).size;
            return <tr key={teacher.user_id}>
              <td><b>{teacher.display_name}</b><small>{teacher.email ?? "No email"} · joined {formatDate(teacher.created_at)}</small></td>
              <td>{classIds.length}</td>
              <td>{students} / {plans[teacher.plan].seats}</td>
              <td><select aria-label={`Plan for ${teacher.display_name}`} value={teacher.plan} onChange={(event) => void control("setPlan", { userId: teacher.user_id, plan: event.target.value }, "Plan updated.")}>{planIds.map((id) => <option key={id} value={id}>{plans[id].name} ({plans[id].display})</option>)}</select></td>
              <td><span className={`${styles.badge} ${teacher.suspended ? styles.warn : styles.good}`}>{teacher.suspended ? "Paused" : "Active"}</span></td>
              <td><div className={styles.row}>
                <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => void view(teacher.user_id)}>View dashboard</button>
                <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => void control("setSuspended", { userId: teacher.user_id, suspended: !teacher.suspended }, teacher.suspended ? "Teacher reactivated." : "Teacher paused.")}>{teacher.suspended ? "Reactivate" : "Pause"}</button>
                <button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => void control("deleteTeacher", { userId: teacher.user_id }, "Teacher workspace deleted.", `Delete ${teacher.display_name}'s teacher workspace? Their classes, resources, assignments and student submissions are permanently removed.`)}>Delete</button>
              </div></td>
            </tr>;
          })}</tbody>
        </table></div> : <div className={styles.empty}>No teachers yet.</div>}
      </section>}
      {tab === "classes" && <section className={styles.panel}>
        <h2>Classes</h2>
        {data.classes.length ? <div className={styles.tableWrap}><table className={styles.table}>
          <thead><tr><th>Class</th><th>Teacher</th><th>Join code</th><th>Students</th><th>Created</th><th></th></tr></thead>
          <tbody>{data.classes.map((group) => <tr key={group.id}>
            <td><b>{group.name}</b><small>{[group.board, group.level, group.subject].filter(Boolean).join(" · ")}</small></td>
            <td>{teacherName(group.teacher_id)}</td>
            <td><span className={styles.code}>{group.join_code}</span></td>
            <td>{data.members.filter((member) => member.class_id === group.id).length}</td>
            <td>{formatDate(group.created_at)}</td>
            <td><button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => void control("deleteClass", { id: group.id }, "Class deleted.", `Delete "${group.name}" with its roster, assignments and submissions?`)}>Delete</button></td>
          </tr>)}</tbody>
        </table></div> : <div className={styles.empty}>No classes yet.</div>}
      </section>}
      {tab === "students" && <section className={styles.panel}>
        <h2>Enrolled students</h2>
        {data.members.length ? <div className={styles.tableWrap}><table className={styles.table}>
          <thead><tr><th>Student</th><th>Class</th><th>Joined</th><th></th></tr></thead>
          <tbody>{data.members.map((member) => <tr key={`${member.class_id}-${member.student_id}`}>
            <td><b>{member.student_name}</b><small>{member.student_email ?? "No email"}</small></td>
            <td>{className(member.class_id)}</td>
            <td>{formatDate(member.joined_at)}</td>
            <td><button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => void control("removeMember", { classId: member.class_id, studentId: member.student_id }, "Student removed from the class.", `Remove ${member.student_name} from ${className(member.class_id)}?`)}>Remove</button></td>
          </tr>)}</tbody>
        </table></div> : <div className={styles.empty}>No students have joined a class yet.</div>}
      </section>}
      {tab === "mocks" && <section className={styles.panel}>
        <h2>Recent mock exam attempts</h2>
        <p>Signed-in students only; the latest 200 attempts.</p>
        {data.mockAttempts.length ? <div className={styles.tableWrap}><table className={styles.table}>
          <thead><tr><th>Exam</th><th>Score</th><th>Time</th><th>User</th><th>Date</th></tr></thead>
          <tbody>{data.mockAttempts.map((attempt) => <tr key={attempt.id}><td><b>{attempt.exam_id}</b></td><td>{attempt.score} / {attempt.total}</td><td>{Math.floor(attempt.seconds / 60)} min {attempt.seconds % 60}s</td><td><small>{attempt.user_id}</small></td><td>{formatDate(attempt.created_at)}</td></tr>)}</tbody>
        </table></div> : <div className={styles.empty}>No attempts recorded yet.</div>}
      </section>}
      {tab === "subscriptions" && <section className={styles.panel}>
        <h2>Premium subscriptions</h2>
        <p>Read-only. Subscriptions are managed in Paddle; change or refund them there.</p>
        {data.subscriptions.length ? <div className={styles.tableWrap}><table className={styles.table}>
          <thead><tr><th>Subscription</th><th>Status</th><th>Environment</th><th>Renews</th><th>Started</th></tr></thead>
          <tbody>{data.subscriptions.map((subscription) => <tr key={subscription.provider_subscription_id}><td><b>{subscription.provider_subscription_id}</b><small>{subscription.user_id}</small></td><td><span className={`${styles.badge} ${subscription.status === "active" || subscription.status === "trialing" ? styles.good : styles.warn}`}>{subscription.status}</span></td><td>{subscription.environment ?? "—"}</td><td>{subscription.renews_at ? formatDate(subscription.renews_at) : "—"}</td><td>{formatDate(subscription.created_at)}</td></tr>)}</tbody>
        </table></div> : <div className={styles.empty}>No subscriptions yet.</div>}
      </section>}
    </div>}
    {toast}
  </>;
}
