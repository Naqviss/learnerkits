"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import styles from "../../chemistry/chemistry.module.css";
import math from "../mathematics.module.css";
import lab from "./mathLab.module.css";

export type Check = { label: string; done: boolean };

/**
 * Layout shared by the interactive mathematics labs: the same header, ribbon, stage, readouts and
 * control panel as the original maths labs, plus a short "Try this" list whose ticks are worked out
 * live from the lab state (nothing is saved) and a key idea that opens once every check is done.
 */
export function MathLabShell({ locale, title, outcome, tag, question, status, metrics, stage, below, controls, checks, insight, caption }: {
  locale: string; title: string; outcome: string; tag: string; question: string; status?: string;
  metrics: [string, string][]; stage: ReactNode; below?: ReactNode; controls: ReactNode;
  checks: Check[]; insight: { title: string; body: ReactNode }; caption: string;
}) {
  const [peek, setPeek] = useState(false);
  const done = checks.filter((c) => c.done).length, open = done === checks.length || peek;
  return <div className={`${styles.page} ${math.page} ${lab.page}`}>
    <header className={styles.header}><div><Link className={styles.back} href={`/${locale}/subjects/mathematics`}>← Mathematics</Link><div className={styles.eyebrow}>MATHEMATICS / INTERACTIVE LAB</div><h2>{title}</h2><p>{outcome}</p></div></header>
    <div className={math.ribbon}><strong>∑ {tag}</strong><span>Predict. Drag. Explain what changed.</span><b>{done} / {checks.length} CHECKS</b></div>
    <div className={styles.workspace}>
      <section className={styles.scenePanel}>
        <div className={styles.sceneTop}><span><i />LIVE MATHEMATICAL MODEL</span><span className={math.status}>{status ?? (open ? "KEY IDEA OPEN" : "EXPLORING")}</span></div>
        <div className={styles.stage}>{stage}</div>
        <div className={styles.metrics}>{metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        {below}
        <div className={math.caption}>{caption}</div>
      </section>
      <aside className={styles.controlsPanel}>
        <p className={lab.question}>{question}</p>
        <div className={styles.controls}>{controls}</div>
        <section className={lab.checks} aria-label="Try this">
          <h3>Try this</h3>
          <ol>{checks.map((c) => <li key={c.label} data-done={c.done}><span aria-hidden="true">{c.done ? "✓" : ""}</span>{c.label}{c.done && <em className={lab.sr}> (done)</em>}</li>)}</ol>
        </section>
        <section className={lab.insight} data-open={open} aria-live="polite">
          {open ? <><h3>Key idea · {insight.title}</h3><div>{insight.body}</div></> : <><h3>Key idea</h3><p>Finish the checks to see what they show, or <button type="button" onClick={() => setPeek(true)}>open it now</button>.</p></>}
        </section>
      </aside>
    </div>
  </div>;
}

/** A labelled range input in the same style as the original maths controls. */
export function Slider({ label, value, min, max, step = 1, unit = "", digits, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; digits?: number; onChange: (v: number) => void }) {
  const d = digits ?? (String(step).split(".")[1]?.length ?? 0);
  return <label className={styles.control}><span><b>{label}</b><output>{value.toFixed(d)}{unit && ` ${unit}`}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}

/** A row of mutually exclusive buttons (used instead of a select when there are 2–4 choices). */
export function Segmented<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: readonly { value: T; label: string }[]; onChange: (v: T) => void }) {
  return <div className={styles.control}><span><b>{label}</b></span><div className={lab.segmented} role="radiogroup" aria-label={label}>{options.map((o) => <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>)}</div></div>;
}

/** A − value + stepper for small whole numbers. */
export function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return <div className={`${styles.control} ${lab.stepper}`}><span><b>{label}</b></span><div><button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button><output>{value}</output><button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>+</button></div></div>;
}

export function ActionButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" className={`${styles.action} ${lab.action}`} onClick={onClick} disabled={disabled}>{children}</button>;
}
