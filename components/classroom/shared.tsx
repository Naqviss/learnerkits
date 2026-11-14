"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { authEnabled } from "@/lib/auth/client";
import { signInWithGoogle, useAuth } from "@/lib/auth/session";
import { classroom } from "@/lib/classroom/client";
import type { TeacherState } from "@/lib/classroom/types";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import styles from "./classroom.module.css";

export const boards = ["Cambridge International", "Pearson Edexcel", "AQA", "International Baccalaureate", "Other"];
export const levels = ["IGCSE", "O Level", "GCSE", "AS Level", "A Level", "IB SL", "IB HL", "Other"];
export const subjects = ["Physics", "Chemistry", "Biology", "Mathematics"];
export const labs = visibleSubjectSlugs.flatMap((slug) => subjectsCatalog[slug].simulations.map((simulation) => ({ slug: simulation.slug, title: simulation.title })));
export const labTitle = (slug: string) => labs.find((lab) => lab.slug === slug)?.title ?? slug;
export const formatDate = (iso: string) => new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

/** Runs an action for the teacher dashboard: shows the result and reloads the data. Resolves to the response, or null on failure. */
export type Act = (action: string, payload?: Record<string, unknown>, success?: string) => Promise<Record<string, unknown> | null>;
export type TeacherContext = { state: TeacherState; act: Act; notify: (message: string) => void; readOnly?: boolean };

export function useToast() {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const notify = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(""), 4000);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { notify, toast: message ? <div className={styles.toast} role="status">{message}</div> : null };
}

/** Loads one classroom action for the signed-in user and exposes a reload. */
export function useClassroomData<T>(action: string, enabled: boolean) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const reload = useCallback(async () => {
    const result = await classroom<T>(action);
    if (result.ok) { setData(result.data); setError(null); } else setError({ status: result.status, message: result.error });
    return result.ok;
  }, [action]);
  useEffect(() => { if (enabled) void reload(); }, [enabled, reload]);
  return { data, error, reload };
}

/** Shows `children` only to a signed-in user; otherwise explains and offers Google sign-in. */
export function SignInGate({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  const { status, failed } = useAuth();
  const [busy, setBusy] = useState(false);
  if (status === "signedIn") return <>{children}</>;
  return <section className={styles.gate}>
    <span className="eyebrow">LearnerKits account</span>
    <h1>{title}</h1>
    <p>{lead}</p>
    {status === "loading" ? <p role="status">Checking your sign-in…</p> : !authEnabled
      ? <p className={`${styles.notice} ${styles.error}`}>Sign-in is not configured on this site yet.</p>
      : <button type="button" className="button primary" disabled={busy} onClick={() => { setBusy(true); signInWithGoogle().catch(() => setBusy(false)); }}>{busy ? "Opening Google…" : "Sign in with Google"}</button>}
    {failed && <p className={`${styles.notice} ${styles.error}`} role="alert">Sign-in did not complete. Please try again.</p>}
  </section>;
}

export function Field({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) {
  return <label className={`${styles.field} ${full ? styles.full : ""}`}><span>{label}</span>{children}</label>;
}

export function Select({ name, options, defaultValue, value, onChange }: { name: string; options: readonly (string | readonly [string, string])[]; defaultValue?: string; value?: string; onChange?: (value: string) => void }) {
  return <select name={name} defaultValue={value === undefined ? defaultValue : undefined} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined}>
    {options.map((option) => { const [id, text] = typeof option === "string" ? [option, option] : option; return <option key={id} value={id}>{text}</option>; })}
  </select>;
}

export const formValue = (form: HTMLFormElement, name: string) => String(new FormData(form).get(name) ?? "").trim();
