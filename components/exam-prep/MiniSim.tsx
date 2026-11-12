"use client";
import { useState, type ReactNode } from "react";
import type { LabKind } from "@/lib/exam-prep/catalog";
import styles from "./examPrep.module.css";

type Values = { force: number; resistance: number; mass: number; speed: number; angle: number; volts: number; ohms: number; temp: number; volume: number };
const initial: Values = { force: 15, resistance: 5, mass: 10, speed: 16, angle: 40, volts: 12, ohms: 6, temp: 300, volume: 25 };
type Slider = { id: keyof Values; label: string; min: number; max: number; step: number; unit: string };

const sliders: Partial<Record<LabKind, Slider[]>> = {
  force: [{ id: "force", label: "Applied force", min: 0, max: 50, step: 1, unit: " N" }, { id: "resistance", label: "Opposing force", min: 0, max: 20, step: 1, unit: " N" }, { id: "mass", label: "Cart mass", min: 1, max: 25, step: 1, unit: " kg" }],
  projectile: [{ id: "speed", label: "Launch speed", min: 2, max: 35, step: 1, unit: " m/s" }, { id: "angle", label: "Launch angle", min: 5, max: 85, step: 1, unit: "°" }],
  circuit: [{ id: "volts", label: "Battery voltage", min: 1, max: 24, step: 1, unit: " V" }, { id: "ohms", label: "Resistance", min: 1, max: 20, step: 1, unit: " Ω" }],
  gas: [{ id: "temp", label: "Temperature", min: 200, max: 500, step: 10, unit: " K" }, { id: "volume", label: "Volume", min: 10, max: 50, step: 1, unit: " L" }],
};

const Readout = ({ label, value }: { label: string; value: string }) => <div className={styles.readout}><small>{label}</small><strong>{value}</strong></div>;

function model(kind: LabKind, v: Values): { graph: ReactNode; metrics: ReactNode; label: string; note?: string } {
  if (kind === "force") {
    const net = Math.max(0, v.force - v.resistance);
    return {
      label: "Force applied to a cart",
      graph: <><rect x="0" y="114" width="300" height="2" fill="currentColor" opacity=".3" /><rect x="125" y="51" width="76" height="59" rx="10" fill="#8aa6d5" stroke="#4e6a98" strokeWidth="2" /><circle cx="143" cy="112" r="7" fill="#45638a" /><circle cx="184" cy="112" r="7" fill="#45638a" /><path d="M30 76H118" stroke="#e9a630" strokeWidth="5" strokeLinecap="round" /><path d="M104 66L120 76L104 86" stroke="#e9a630" strokeWidth="5" strokeLinejoin="round" fill="none" /><text x="57" y="61" fontWeight="800" fontSize="11" fill="currentColor">{v.force} N</text><text x="163" y="83" textAnchor="middle" fontWeight="800" fontSize="14" fill="#243850">{v.mass} kg</text></>,
      metrics: <><Readout label="Resultant force" value={`${net.toFixed(1)} N`} /><Readout label="Acceleration" value={`${(net / v.mass).toFixed(2)} m/s²`} /></>,
    };
  }
  if (kind === "projectile") {
    const g = 9.81, rad = v.angle * Math.PI / 180, range = v.speed ** 2 * Math.sin(2 * rad) / g, height = v.speed ** 2 * Math.sin(rad) ** 2 / (2 * g);
    const points = Array.from({ length: 33 }, (_, k) => { const x = k / 32; return `${(18 + x * 270).toFixed(1)},${(107 - Math.min(72, 4 * height * x * (1 - x) * 5.5)).toFixed(1)}`; }).join(" ");
    return {
      label: "Trajectory of an ideal projectile",
      graph: <><path d="M10 109H306" stroke="currentColor" strokeWidth="2" opacity=".4" /><polyline fill="none" stroke="#497be6" strokeWidth="3" strokeLinecap="round" points={points} /><circle cx="18" cy="107" r="8" fill="#e8a632" /><text x="20" y="17" fontSize="10" fill="currentColor" opacity=".7">Ideal projectile (no air resistance)</text></>,
      metrics: <><Readout label="Horizontal range" value={`${range.toFixed(1)} m`} /><Readout label="Flight time" value={`${(2 * v.speed * Math.sin(rad) / g).toFixed(2)} s`} /></>,
    };
  }
  if (kind === "circuit") return {
    label: "Series circuit with one resistor",
    graph: <><rect x="38" y="31" width="219" height="76" rx="4" stroke="var(--accent)" strokeWidth="3" fill="none" /><rect x="114" y="22" width="72" height="18" rx="3" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" /><path d="M131 22l6 18 8-18 8 18 8-18 8 18" stroke="var(--accent)" fill="none" strokeWidth="2" /><path d="M26 75H49M38 61V89M30 67V83" stroke="#df9b23" strokeWidth="3" /><circle cx="206" cy="107" r="8" fill="#eecb68" stroke="#df9b23" strokeWidth="2" /><text x="154" y="16" textAnchor="middle" fontSize="10" fill="currentColor" opacity=".7">Resistor</text></>,
    metrics: <><Readout label="Electric current" value={`${(v.volts / v.ohms).toFixed(2)} A`} /><Readout label="Power" value={`${(v.volts ** 2 / v.ohms).toFixed(1)} W`} /></>,
  };
  if (kind === "gas") return {
    label: "Gas particles in a chamber",
    graph: <><rect x="54" y="14" width="194" height="111" rx="12" fill="none" stroke="var(--accent)" strokeWidth="3" />{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={68 + (i * 47 % 165)} cy={27 + (i * 29 % 82)} r="5" fill={i % 2 ? "#e2a837" : "#6c8fea"} opacity=".85" />)}</>,
    metrics: <><Readout label="Pressure (1 mol)" value={`${(8.314 * v.temp / v.volume).toFixed(1)} kPa`} /><Readout label="Temperature" value={`${v.temp} K`} /></>,
    note: "Ideal-gas mini-model: n = 1 mol, R = 8.314 kPa·L/(mol·K). The full lab has its own controls.",
  };
  return {
    label: "Illustrative curve",
    graph: <><path d="M17 93 Q78 15 146 81 T290 40" fill="none" stroke="var(--accent)" strokeWidth="3" /><path d="M15 113H294" stroke="currentColor" opacity=".4" /><circle cx="146" cy="81" r="6" fill="#dca531" /></>,
    metrics: <Readout label="Next step" value="Open the full lab" />,
  };
}

// A quick model for the topic page; the linked LearnerKits lab is the full experiment.
export function MiniSim({ kind }: { kind: LabKind }) {
  const [values, setValues] = useState(initial);
  const view = model(kind, values);
  const controls = sliders[kind] ?? [];
  return <>
    <div className={styles.monitor}>
      <svg viewBox="0 0 310 135" role="img" aria-label={view.label}>{view.graph}</svg>
      <div className={styles.metrics} aria-live="polite">{view.metrics}</div>
    </div>
    {controls.length > 0 && <div className={styles.controls}>
      {controls.map((slider) => <div className={styles.control} key={slider.id}>
        <label htmlFor={`sim-${slider.id}`}><span>{slider.label}</span><output>{values[slider.id]}{slider.unit}</output></label>
        <input id={`sim-${slider.id}`} type="range" min={slider.min} max={slider.max} step={slider.step} value={values[slider.id]} onChange={(event) => setValues({ ...values, [slider.id]: Number(event.target.value) })} />
      </div>)}
    </div>}
    <p className={styles.note}>{view.note ?? "Illustrative mini-model. Open the full LearnerKits lab below for the complete experiment."}</p>
  </>;
}
