"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { signInWithGoogle, useAuth } from "@/lib/auth/session";
import type { SimulationCard } from "@/lib/subjects/catalog";
import {
  createMeasurement,
  loadMeasurements,
  loadMissionProgress,
  missionDefinitions,
  removeMeasurement,
  saveMissionProgress,
  type MissionId,
  type SimulationMeasurement,
  type SimulationMissionProgress,
} from "@/lib/simulations/progress";

type Feature = "Measurements" | "Missions";
type LoadState = "loading" | "ready" | "error";

export function ProtectedFeaturePreview({ feature, simulation, available = true, children, prompts }: { children?: React.ReactNode; prompts?: string[]; feature: Feature; simulation: SimulationCard; available?: boolean }) {
  const auth = useAuth();
  const measurements = feature === "Measurements";
  const title = measurements ? "Measurements & observations" : "Missions";

  return <section id={feature.toLowerCase()} className="protectedSimulationSection" aria-labelledby={`${feature.toLowerCase()}-title`}>
    <header>
      <div><h2 id={`${feature.toLowerCase()}-title`}>{title}</h2></div>
    </header>
    {children}
    {measurements && <div id="simulation-measurements-extension" className="simulationFeatureExtension"/>}
    {auth.status !== "signedIn" || !auth.session ? <SignedOutFeature feature={feature} measurements={measurements} failed={auth.failed}/> : !available ? <UnavailableFeature feature={feature}/> : measurements
      ? <MeasurementsNotebook simulation={simulation} userId={auth.session.user.id}/>
      : <MissionNotebook prompts={prompts} simulation={simulation} userId={auth.session.user.id}/>
    }
  </section>;
}

function SignedOutFeature({ feature, measurements, failed }: { feature: Feature; measurements: boolean; failed: boolean }) {
  return <div className="protectedFeatureFrame protectedFeatureModal" data-feature={feature.toLowerCase()}>
    <FeatureSkeleton measurements={measurements}/>
    <div className="protectedFeatureOverlay"><div className="protectedFeatureCard">
      <span className="protectedLock" aria-hidden="true"><LockIcon/></span>
      <h3>Sign in to unlock {feature}</h3>
      <button className="button primary googleSignInIconButton" type="button" aria-label="Sign in with Google" title="Sign in with Google" onClick={() => void signInWithGoogle()}><GoogleIcon/><span>Sign in with Google</span></button>
      {failed && <small role="alert">Sign-in could not start. Please try again.</small>}
    </div></div>
  </div>;
}

function LockIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="5" y="10" width="14" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="15.2" r="1.25" fill="currentColor"/>
    <path d="M12 16.4v1.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>;
}

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"/>
    <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.64-2.43l-3.24-2.54c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"/>
    <path fill="#FBBC05" d="M6.39 13.86A6 6 0 0 1 6.08 12c0-.65.11-1.28.31-1.86V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.62Z"/>
    <path fill="#EA4335" d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.88-2.88A9.66 9.66 0 0 0 12 2 10 10 0 0 0 3.04 7.52l3.35 2.62C7.18 7.77 9.39 6.01 12 6.01Z"/>
  </svg>;
}

function FeatureSkeleton({ measurements }: { measurements: boolean }) {
  return <div className="protectedFeaturePreview" aria-hidden="true">{measurements ? <>
    <div className="previewToolbar"><span>Experiment record</span><i/><i/></div><div className="previewChart"><i/><i/><i/><i/></div><div className="previewRows"><span/><span/><span/></div>
  </> : <><div className="previewMission"><i>01</i><span/><b/></div><div className="previewMission"><i>02</i><span/><b/></div><div className="previewMission"><i>03</i><span/><b/></div></>}</div>;
}

function UnavailableFeature({ feature }: { feature: Feature }) {
  return <div className="protectedFeatureFrame"><div className="protectedFeatureOverlay signedInFeatureState"><div className="protectedFeatureCard"><span className="protectedLock" aria-hidden="true">!</span><h3>{feature} are unavailable</h3><p>This activity does not currently have a progress module.</p><a className="button" href="#simulation">Return to simulation</a></div></div></div>;
}

function MeasurementsNotebook({ simulation, userId }: { simulation: SimulationCard; userId: string }) {
  const [records, setRecords] = useState<SimulationMeasurement[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [conditions, setConditions] = useState("");
  const [observation, setObservation] = useState("");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    loadMeasurements(simulation.slug).then((data) => { if (!cancelled) { setRecords(data); setState("ready"); } }).catch(() => { if (!cancelled) setState("error"); });
    return () => { cancelled = true; };
  }, [simulation.slug, userId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const record = await createMeasurement(userId, simulation.slug, { title: title.trim(), conditions: conditions.trim(), observation: observation.trim() });
      setRecords((current) => [record, ...current]);
      setTitle(""); setConditions(""); setObservation(""); setState("ready");
    } catch { setState("error"); }
    finally { setBusy(false); }
  };

  const remove = async (record: SimulationMeasurement) => {
    if (!window.confirm(`Delete “${record.title}” from your experiment notebook?`)) return;
    setBusy(true);
    try { await removeMeasurement(record.id); setRecords((current) => current.filter((item) => item.id !== record.id)); }
    catch { setState("error"); }
    finally { setBusy(false); }
  };

  return <div className="simulationProgressWorkspace">
    <form className="measurementForm" onSubmit={submit}>
      <div className="progressPanelHeading"><div><small>NEW TRIAL</small><h3>Record an experiment</h3></div><span>{records.length} saved</span></div>
      <label>Trial name<input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Higher temperature trial"/></label>
      <label>Conditions and control values<textarea maxLength={1000} rows={3} value={conditions} onChange={(event) => setConditions(event.target.value)} placeholder="Record the variables you used."/></label>
      <label>Measurement or observation<textarea maxLength={2000} rows={4} value={observation} onChange={(event) => setObservation(event.target.value)} placeholder="What did you measure or notice?"/></label>
      <button className="button primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save trial"}</button>
      {state === "error" && <ProgressError/>}
    </form>
    <section className="measurementHistory" aria-label="Saved experiment trials">
      <div className="progressPanelHeading"><div><small>YOUR NOTEBOOK</small><h3>Saved trials</h3></div></div>
      {state === "loading" ? <p className="progressEmpty">Loading your notebook…</p> : records.length === 0 ? <p className="progressEmpty">No trials saved yet. Run the simulation, then record your first result.</p> : <div className="measurementList">{records.map((record, index) => <article key={record.id}>
        <header><span>Trial {records.length - index}</span><time dateTime={record.created_at}>{new Date(record.created_at).toLocaleDateString()}</time></header>
        <h4>{record.title}</h4>{record.conditions && <p><b>Conditions</b>{record.conditions}</p>}{record.observation && <p><b>Observation</b>{record.observation}</p>}
        <button type="button" disabled={busy} onClick={() => void remove(record)}>Delete</button>
      </article>)}</div>}
    </section>
  </div>;
}

function MissionNotebook({ simulation, userId, prompts }: { prompts?: string[]; simulation: SimulationCard; userId: string }) {
  const definitions = useMemo(() => missionDefinitions(simulation.title, simulation.outcome, simulation.concepts), [simulation]);
  const [progress, setProgress] = useState<Record<MissionId, Pick<SimulationMissionProgress, "completed" | "evidence">>>({ predict: { completed: false, evidence: "" }, compare: { completed: false, evidence: "" }, explain: { completed: false, evidence: "" } });
  const [state, setState] = useState<LoadState>("loading");
  const [saving, setSaving] = useState<MissionId | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    loadMissionProgress(simulation.slug).then((rows) => {
      if (cancelled) return;
      setProgress((current) => { const next = { ...current }; for (const row of rows) next[row.mission_id] = { completed: row.completed, evidence: row.evidence }; return next; });
      setState("ready");
    }).catch(() => { if (!cancelled) setState("error"); });
    return () => { cancelled = true; };
  }, [simulation.slug, userId]);

  const save = async (id: MissionId) => {
    setSaving(id);
    try {
      const saved = await saveMissionProgress(userId, simulation.slug, { mission_id: id, ...progress[id] });
      setProgress((current) => ({ ...current, [id]: { completed: saved.completed, evidence: saved.evidence } })); setState("ready");
    } catch { setState("error"); }
    finally { setSaving(null); }
  };
  const completed = definitions.filter((definition) => progress[definition.id].completed).length;

  return <div className="missionWorkspace">
    <div className="missionProgressSummary"><div><small>MISSION PROGRESS</small><strong>{completed} of {definitions.length} complete</strong></div><progress max={definitions.length} value={completed} aria-label={`${completed} of ${definitions.length} missions complete`}/></div>
    <div className="missionCards">{definitions.map((mission, i) => <article key={mission.id} data-complete={progress[mission.id].completed}>
      <header><span>{mission.number}</span><div><small>{progress[mission.id].completed ? "COMPLETE" : "IN PROGRESS"}</small><h3>{mission.title}</h3></div></header><p>{prompts?.[i] ?? mission.prompt}</p>
      <label>{mission.evidenceLabel}<textarea maxLength={2000} rows={4} value={progress[mission.id].evidence} onChange={(event) => setProgress((current) => ({ ...current, [mission.id]: { ...current[mission.id], evidence: event.target.value } }))}/></label>
      <div><label className="missionCompleteCheck"><input type="checkbox" checked={progress[mission.id].completed} onChange={(event) => setProgress((current) => ({ ...current, [mission.id]: { ...current[mission.id], completed: event.target.checked } }))}/> Mark complete</label><button className="button" type="button" disabled={saving !== null} onClick={() => void save(mission.id)}>{saving === mission.id ? "Saving…" : "Save progress"}</button></div>
    </article>)}</div>
    {state === "loading" && <p className="progressEmpty">Loading your mission progress…</p>}{state === "error" && <ProgressError/>}
  </div>;
}

function ProgressError() {
  return <p className="progressError" role="alert">Progress could not be saved. Confirm the simulation-progress database migration has been applied, then try again.</p>;
}
