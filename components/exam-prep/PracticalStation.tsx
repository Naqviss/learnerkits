"use client";
import { useEffect, useState } from "react";
import { bestFit, circuitCurrent, graphPoints, markPractical, pendulumTenSwings, practicalExpected, takeReading, type PracticalKind, type PracticalMark, type Reading } from "@/lib/exam-prep/practical";
import { clockText, remainingSeconds } from "@/lib/mock-exams/engine";
import styles from "./examPrep.module.css";

const practiceMinutes = 20;
const unitOptions: Record<PracticalKind, [string, string][]> = {
  circuit: [["ohm", "Ω (ohms)"], ["v", "V (volts)"], ["a", "A (amperes)"]],
  pendulum: [["ms2", "m/s²"], ["s", "s (seconds)"], ["m", "m (metres)"]],
};
const methodOptions: Record<PracticalKind, [string, string][]> = {
  circuit: [["repeat", "Repeat measurements and average readings"], ["single", "Use only one voltage setting"], ["change", "Change the resistor between readings"]],
  pendulum: [["repeat", "Time 10 oscillations, repeat and average"], ["single", "Time just one oscillation once"], ["change", "Change the mass during each reading"]],
};

function Apparatus({ kind, setting }: { kind: PracticalKind; setting: number }) {
  if (kind === "pendulum") {
    const theta = 28 * Math.PI / 180, px = 168, py = 37, scale = 165 * setting, x = px + scale * Math.sin(theta), y = py + scale * Math.cos(theta);
    return <svg className={styles.apparatus} viewBox="0 0 360 220" role="img" aria-label={`Pendulum of length ${setting.toFixed(1)} metres with a digital timer`}><path d="M100 30H225" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity=".65" /><circle cx={px} cy={py} r="5" fill="currentColor" /><path d={`M${px} ${py} L${x.toFixed(1)} ${y.toFixed(1)}`} stroke="var(--accent)" strokeWidth="2.5" /><path d={`M${px} ${py}V205`} stroke="currentColor" opacity=".18" strokeDasharray="6 5" /><circle cx={x} cy={y} r="13" fill="#ddac57" stroke="#966c20" strokeWidth="2" /><text x="235" y="93" fill="currentColor" fontSize="12">Length: {setting.toFixed(1)} m</text><text x="235" y="111" fill="currentColor" fontSize="11">10 oscillations</text><text x="235" y="154" fill="var(--accent)" fontSize="15" fontWeight="bold">{pendulumTenSwings(setting).toFixed(2)} s</text></svg>;
  }
  return <svg className={styles.apparatus} viewBox="0 0 360 200" role="img" aria-label="Series resistor circuit with an ammeter and a voltmeter"><path d="M65 67H112L122 56L134 78L146 56L158 78L170 56L182 67H292V153H65V67" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" /><circle cx="240" cy="153" r="22" fill="var(--surface)" stroke="var(--accent)" strokeWidth="3" /><text x="240" y="159" fill="currentColor" textAnchor="middle" fontSize="18">A</text><path d="M120 67V28H189V67" fill="none" stroke="currentColor" strokeWidth="2" opacity=".6" /><circle cx="156" cy="28" r="17" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" /><text x="156" y="34" textAnchor="middle" fill="currentColor" fontSize="17">V</text><text x="131" y="96" fill="currentColor" opacity=".7" fontSize="12">fixed resistor</text><text x="74" y="174" fill="var(--accent)" fontSize="13">{setting.toFixed(1)} V supply</text><text x="236" y="192" fill="var(--accent)" fontSize="12">{circuitCurrent(setting).toFixed(2)} A</text></svg>;
}

function Graph({ kind, readings, plotted }: { kind: PracticalKind; readings: Reading[]; plotted: boolean }) {
  const circuit = kind === "circuit", points = graphPoints(kind, readings), fit = plotted ? bestFit(points) : null;
  const xmax = circuit ? 1.7 : 1.1, ymax = circuit ? 13 : 4.6, W = 540, H = 305, pad = 48;
  const at = (x: number, y: number) => [pad + (W - pad - 18) * x / xmax, (H - pad) - (H - pad - 15) * y / ymax];
  const xs = points.map((p) => p.x);
  const line = fit && [at(Math.min(...xs), fit.slope * Math.min(...xs) + fit.intercept), at(Math.max(...xs), fit.slope * Math.max(...xs) + fit.intercept)];
  return <div className={styles.graph}>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${circuit ? "Voltage against current" : "Period squared against length"} graph with ${points.length} plotted readings${fit ? " and a best-fit line" : ""}`}>
      {Array.from({ length: 6 }, (_, i) => { const x = pad + (W - pad - 18) * i / 5, y = (H - pad) - (H - pad - 15) * i / 5; return <g key={i}><line x1={x} y1="15" x2={x} y2={H - pad} stroke="currentColor" opacity=".09" /><line x1={pad} y1={y} x2={W - 18} y2={y} stroke="currentColor" opacity=".09" /><text x={x} y={H - 29} textAnchor="middle" fill="currentColor" opacity=".7" fontSize="10">{(xmax * i / 5).toFixed(1)}</text><text x={pad - 7} y={y + 4} textAnchor="end" fill="currentColor" opacity=".7" fontSize="10">{(ymax * i / 5).toFixed(1)}</text></g>; })}
      <line x1={pad} y1="15" x2={pad} y2={H - pad} stroke="currentColor" opacity=".6" /><line x1={pad} y1={H - pad} x2={W - 18} y2={H - pad} stroke="currentColor" opacity=".6" />
      {points.map((p) => { const [x, y] = at(p.x, p.y); return <circle key={p.x} cx={x} cy={y} r="5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />; })}
      {line && <line x1={line[0][0]} y1={line[0][1]} x2={line[1][0]} y2={line[1][1]} stroke="var(--success,#18845e)" strokeWidth="2.5" strokeDasharray="7 4" />}
      <text x={W / 2} y={H - 5} textAnchor="middle" fill="currentColor" fontSize="12">{circuit ? "Current / A" : "Length / m"}</text>
      <text x="14" y={H / 2} transform={`rotate(-90,14,${H / 2})`} textAnchor="middle" fill="currentColor" fontSize="12">{circuit ? "Voltage / V" : "Period² / s²"}</text>
    </svg>
    <p className={styles.note}>{points.length < 2 ? "Record two readings to display a graph." : `Dots: recorded measurements. ${fit ? "Dashed line: least-squares best fit." : "Select “Plot best-fit line” to show the trend."}`}</p>
  </div>;
}

export function PracticalStation({ kind }: { kind: PracticalKind }) {
  const circuit = kind === "circuit";
  const [setting, setSetting] = useState(circuit ? 2 : 0.2);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [plotted, setPlotted] = useState(false);
  const [estimate, setEstimate] = useState("");
  const [unit, setUnit] = useState(unitOptions[kind][0][0]);
  const [method, setMethod] = useState("");
  const [mark, setMark] = useState<PracticalMark | null>(null);
  const [message, setMessage] = useState("");
  const [remaining, setRemaining] = useState(practiceMinutes * 60);

  useEffect(() => {
    const deadline = Date.now() + practiceMinutes * 60_000;
    const timer = window.setInterval(() => {
      const left = remainingSeconds(deadline, Date.now());
      setRemaining(left);
      if (!left) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const settingText = circuit ? `${setting.toFixed(1)} V` : `${setting.toFixed(1)} m`;
  const record = () => {
    const reading = takeReading(kind, setting);
    if (readings.some((row) => row.x === reading.x)) { setMessage("You have already recorded this setting. Choose a different one."); return; }
    setReadings([...readings, reading].sort((a, b) => a.x - b.x));
    setPlotted(false); setMark(null); setMessage("");
  };
  const clear = () => { setReadings([]); setPlotted(false); setMark(null); setMessage(""); };

  return <div className={styles.practical}>
    <section className={styles.panel}>
      <div className={styles.step}>
        <span className="eyebrow">Step 1 · Experiment setup</span>
        <h2>Adjust the apparatus</h2>
        <p>{circuit ? "Change the supply voltage, record the current, then plot voltage against current." : "Vary the pendulum length. Record the time for 10 oscillations and plot period squared against length."}</p>
        <Apparatus kind={kind} setting={setting} />
        <label className={styles.field}><span>{circuit ? "Supply voltage" : "Pendulum length"}<output>{settingText}</output></span>
          <input type="range" min={circuit ? 2 : 0.2} max={circuit ? 12 : 1} step={circuit ? 2 : 0.2} value={setting} onChange={(event) => setSetting(Number(event.target.value))} /></label>
        <div className={styles.measure} aria-live="polite">
          <div><small>{circuit ? "VOLTMETER" : "LENGTH"}</small><strong>{settingText}</strong></div>
          <div><small>{circuit ? "AMMETER" : "TIME / 10 OSCILLATIONS"}</small><strong>{circuit ? `${circuitCurrent(setting).toFixed(2)} A` : `${pendulumTenSwings(setting).toFixed(2)} s`}</strong></div>
        </div>
        <div className={styles.actions} style={{ marginTop: 8 }}><button type="button" className="button primary" onClick={record}>＋ Record reading</button><button type="button" className="button" onClick={clear} disabled={!readings.length}>Clear readings</button></div>
        <p className={styles.note} role="status">{message}</p>
      </div>
      <div className={styles.step}>
        <span className="eyebrow">Step 2 · Results table</span>
        <h2>Your measured data <span className={styles.badge}>{readings.length} / 5 minimum</span></h2>
        <table className={styles.table}>
          <thead><tr><th scope="col">#</th><th scope="col">{circuit ? "Voltage / V" : "Length / m"}</th><th scope="col">{circuit ? "Current / A" : "Time for 10 / s"}</th>{!circuit && <th scope="col">T² / s²</th>}</tr></thead>
          <tbody>{readings.length ? readings.map((row, index) => <tr key={row.x}><td>{index + 1}</td><td>{row.x.toFixed(circuit ? 1 : 2)}</td><td>{row.y.toFixed(2)}</td>{!circuit && <td>{row.t2?.toFixed(3)}</td>}</tr>)
            : <tr><td colSpan={circuit ? 3 : 4} style={{ textAlign: "center", color: "var(--muted)", padding: 18 }}>No readings yet. Record at least five different settings.</td></tr>}</tbody>
        </table>
      </div>
      <div className={styles.step}>
        <span className="eyebrow">Step 3 · Graph and trend</span>
        <h2>{circuit ? "Voltage against current" : "Period squared against length"}</h2>
        <Graph kind={kind} readings={readings} plotted={plotted} />
        <button type="button" className="button" disabled={readings.length < 2} onClick={() => setPlotted(true)}>Plot best-fit line</button>
      </div>
    </section>
    <aside className={styles.panel}>
      <div className={styles.panelTop}><span className="eyebrow">Step 4 · Practical task</span><span className={styles.timer} role="timer" aria-label="Practice time remaining">◷ {clockText(remaining)}</span></div>
      <h2>Show what you learned</h2>
      <p>A 12-mark original practical-skills check. Collect at least five distinct readings before submitting.{remaining === 0 && " Time is up, but you may still review and submit."}</p>
      <label className={styles.field}><span>{circuit ? "Estimate the resistance from the gradient" : "Estimate gravitational acceleration from the gradient"}</span><input type="number" step="0.01" min="0" inputMode="decimal" placeholder="Enter a number" value={estimate} onChange={(event) => setEstimate(event.target.value)} /></label>
      <label className={styles.field}><span>Correct unit</span><select value={unit} onChange={(event) => setUnit(event.target.value)}>{unitOptions[kind].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className={styles.field}><span>Which change most improves reliability?</span><select value={method} onChange={(event) => setMethod(event.target.value)}><option value="">Select one</option>{methodOptions[kind].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <div className={styles.actions}><button type="button" className="button primary" onClick={() => setMark(markPractical(kind, { readings, plotted, estimate, unit, method }))}>Mark my practical</button></div>
      <div aria-live="polite">{mark && <div className={styles.feedback}><div className={styles.score}>{mark.score}/{mark.total} marks</div><ul>{mark.notes.map((note) => <li key={note}>{note}</li>)}</ul><p className={styles.note}>Expected {circuit ? "resistance" : "gravitational acceleration"}: {practicalExpected[kind].label}. Auto-marked against model data, not an official mark scheme.</p></div>}</div>
    </aside>
  </div>;
}
