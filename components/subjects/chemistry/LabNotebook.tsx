"use client";

import { useEffect, useState } from "react";
import { emptyNotebook, parseNotebook, teachingGuides, type Notebook } from "@/lib/simulations/chemistry/learning";
import styles from "./chemistry.module.css";

export function LabNotebook({ slug, title, readings, conditions, teacher }: { slug: string; title: string; readings: [string, string][]; conditions: string; teacher: boolean }) {
  const [book, setBook] = useState<Notebook>(emptyNotebook);
  const [ready, setReady] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const [status, setStatus] = useState("");
  const guide = teachingGuides[slug];
  const storageKey = `learnerkits-chemistry-notebook-v1:${slug}`;
  useEffect(() => {
    try { setBook(parseNotebook(localStorage.getItem(storageKey))); } catch { setStorageFailed(true); }
    setReady(true);
  }, [storageKey]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(book)); setStorageFailed(false); } catch { setStorageFailed(true); }
  }, [book, ready, storageKey]);
  function record() {
    setBook(b => ({ ...b, records: [...b.records, { id: Math.max(Date.now(), ...b.records.map(r => r.id + 1)), conditions, readings: readings.map(([label, value]) => [label, value] as [string, string]), observation: b.observation }], observation: "" }));
    setStatus("Reading recorded. Change one variable, then record again to compare.");
  }
  function download() {
    const lines = [title, "LAB NOTEBOOK", "", "Prediction", book.prediction || "Not entered", "", ...book.records.flatMap((r, i) => [`Reading ${i + 1}`, r.conditions, ...r.readings.map(([k, v]) => `${k}: ${v}`), `Observation: ${r.observation || "Not entered"}`, ""]), "Unrecorded observation", book.observation || "None", "", "Conclusion · claim, evidence, reasoning", book.conclusion || "Not entered"];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `${slug}-lab-notebook.txt`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Notebook downloaded.");
  }
  return <section className={styles.learningSection} aria-label="Experiment notebook">
    <div className={styles.learningHeading}><div><span className={styles.eyebrow}>THINK LIKE A CHEMIST</span><h2>Predict. Observe. Explain.</h2></div><span className={styles.localBadge}>{storageFailed ? "Session only" : "Saved on this device"}</span></div>
    <div className={styles.learningGrid}>
      <div className={styles.inquiry}>
        <h3>{guide.question}</h3><p>{guide.investigate}</p>
        <label>1. Make a prediction<textarea maxLength={4000} disabled={!ready} value={book.prediction} onChange={e => setBook(b => ({ ...b, prediction: e.target.value }))} placeholder="I predict… because…" /></label>
        <label>2. Describe what you observe<textarea maxLength={2000} disabled={!ready} value={book.observation} onChange={e => setBook(b => ({ ...b, observation: e.target.value }))} placeholder="What changed? What stayed the same?" /></label>
        <button className={styles.recordButton} onClick={record} disabled={!ready || book.records.length >= 50}>＋ Record current readings <span>{book.records.length} / 50</span></button>
        <p className={styles.notebookStatus} role="status">{storageFailed ? "Browser storage is unavailable. Download your notes before leaving." : status || "Resetting the experiment keeps your recorded readings."}</p>
      </div>
      <div className={styles.evidence}>
        <div className={styles.learningHeading}><h3>Your evidence</h3><button className={styles.smallButton} onClick={download} disabled={!ready}>Download notes ↓</button></div>
        {book.records.length ? <div className={styles.records}><table><caption>Recorded experimental conditions and results</caption><thead><tr><th scope="col">Trial</th><th scope="col">Conditions & readings</th><th scope="col">Observation</th></tr></thead><tbody>{book.records.map((r, i) => <tr key={r.id}><th scope="row">{i + 1}</th><td><small>{r.conditions}</small>{r.readings.map(([k, v]) => <div key={k}><b>{k}:</b> {v}</div>)}</td><td>{r.observation || "—"}<button className={styles.removeReading} onClick={() => { setBook(b => ({ ...b, records: b.records.filter(item => item.id !== r.id) })); setStatus(`Reading ${i + 1} removed.`); }} aria-label={`Remove reading ${i + 1}`}>Remove</button></td></tr>)}</tbody></table></div> : <div className={styles.emptyEvidence}><span aria-hidden="true">↗</span><strong>Your next discovery starts with a reading.</strong><p>Record two or more conditions to compare your results.</p></div>}
        <label>3. Explain using your evidence<textarea maxLength={4000} disabled={!ready} value={book.conclusion} onChange={e => setBook(b => ({ ...b, conclusion: e.target.value }))} placeholder="My claim is… My readings show… This happens because…" /></label>
      </div>
    </div>
    {teacher && <section className={styles.teacherGuide} aria-label="Teacher discussion guide"><div><span className={styles.eyebrow}>TEACHER GUIDE · 15–20 MIN</span><h3>Turn the experiment into a discussion</h3><p>Predict individually (3 min), investigate in pairs (8 min), then compare evidence as a class (5 min). Use the downloaded notes as an exit ticket.</p></div><div><h4>Listen for this misconception</h4><p>{guide.misconception}</p><h4>Expected evidence & assessment</h4><p>{guide.evidence}</p><p><b>Success criteria:</b> a testable prediction, at least two recorded conditions, and a conclusion that connects the measurements to the chemistry.</p></div></section>}
  </section>;
}
