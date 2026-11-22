"use client";
import { useEffect, useRef, useState } from "react";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { area, circumference, ratio, sectorPoses, stripWidth } from "@/lib/simulations/mathematicsLabs/circle";
import { ActionButton, MathLabShell, Segmented, Slider } from "./MathLabShell";
import lab from "./mathLab.module.css";
import { colors, fmt, Stage } from "./svg";

type Mode = "unroll" | "area";
// Fixed scales, so a bigger radius really draws a bigger circle.
const U = { scale: 20, x0: 40, base: 300 }; // unroll: 20 px per unit; the full roll of r = 4 still fits
const A = { scale: 40, cx: 325, cy: 215 }; // rearrange: 40 px per unit
const PLAY_SECONDS = 3;

/** Sector of radius R from apex (x, y) in stage pixels, bisector at `angle` (math convention, y up). */
function sector(x: number, y: number, R: number, angle: number, spread: number) {
  const point = (a: number) => `${x + R * Math.cos(a)} ${y - R * Math.sin(a)}`;
  return `M${x} ${y}L${point(angle - spread / 2)}A${R} ${R} 0 0 0 ${point(angle + spread / 2)}Z`;
}

export default function CircleAreaPiLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const [mode, setMode] = useState<Mode>("unroll");
  const [r, setR] = useState(2);
  const [roll, setRoll] = useState(0);
  const [rearrange, setRearrange] = useState(0);
  const [sectors, setSectors] = useState(8);
  const [playing, setPlaying] = useState(false);
  const [seen, setSeen] = useState({ unrolled: false, rollRadii: [] as number[], rearranged: false, areaRadii: [] as number[] });
  const live = useRef({ mode, playing });
  live.current = { mode, playing };

  // Play animates whichever progress slider belongs to the current mode, then stops at the end.
  useEffect(() => {
    if (!playing) return;
    let last = performance.now(), id = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000 / PLAY_SECONDS;
      last = now;
      const step = (p: number) => Math.min(1, p + dt);
      if (live.current.mode === "unroll") setRoll(step); else setRearrange(step);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);
  useEffect(() => { if ((mode === "unroll" ? roll : rearrange) >= 1) setPlaying(false); }, [mode, roll, rearrange]);

  useEffect(() => {
    setSeen((old) => ({
      unrolled: old.unrolled || (mode === "unroll" && roll >= 0.999),
      rollRadii: mode === "unroll" && !old.rollRadii.includes(r) ? [...old.rollRadii, r] : old.rollRadii,
      rearranged: old.rearranged || (mode === "area" && rearrange >= 0.999 && sectors >= 24),
      areaRadii: mode === "area" && !old.areaRadii.includes(r) ? [...old.areaRadii, r] : old.areaRadii,
    }));
  }, [mode, r, roll, rearrange, sectors]);

  const play = () => {
    if (mode === "unroll" && roll >= 1) setRoll(0);
    if (mode === "area" && rearrange >= 1) setRearrange(0);
    setPlaying((p) => !p);
  };
  const doubled = seen.areaRadii.some((x) => seen.areaRadii.includes(x * 2));
  const C = circumference(r), d = 2 * r;

  const unrollStage = () => {
    const s = U.scale, R = r * s, laid = roll * C * s, cx = U.x0 + laid, cy = U.base - R;
    const theta = roll * 2 * Math.PI; // rolling right turns the circle clockwise
    const at = (a: number) => [cx + R * Math.cos(a), cy + R * Math.sin(a)] as const; // SVG angles, y down
    const P = at(Math.PI / 2 + theta), contact = at(Math.PI / 2);
    const remaining = 1 - roll;
    const diameterEnds = [at(theta), at(theta + Math.PI)];
    const ticks = Array.from({ length: Math.floor(C / d) + 1 }, (_, k) => k);
    return <>
      <line x1={U.x0 - 20} x2={630} y1={U.base} y2={U.base} stroke={colors.axis} strokeWidth="2" />
      {ticks.map((k) => <g key={k}>
        <line x1={U.x0 + k * d * s} x2={U.x0 + k * d * s} y1={U.base - 6} y2={U.base + 12} stroke={colors.blue} strokeWidth="2" />
        <text x={U.x0 + k * d * s} y={U.base + 30} textAnchor="middle" fill={colors.blue} fontSize="14" fontWeight="700">{k === 0 ? "0" : `${k}d`}</text>
      </g>)}
      <line x1={U.x0 + C * s} x2={U.x0 + C * s} y1={U.base - 10} y2={U.base + 44} stroke={colors.green} strokeWidth="2" strokeDasharray="4 4" />
      <text x={U.x0 + C * s} y={U.base + 62} textAnchor="middle" fill={colors.green} fontSize="14" fontWeight="700">C = π × d ≈ 3.14d</text>
      <line x1={U.x0} x2={U.x0 + laid} y1={U.base} y2={U.base} stroke={colors.amber} strokeWidth="6" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={R} fill="#2b3a52" fillOpacity=".55" stroke="#55657e" strokeWidth="2" />
      {remaining >= 0.999
        ? <circle cx={cx} cy={cy} r={R} fill="none" stroke={colors.amber} strokeWidth="6" />
        : remaining > 0.001 && <path d={`M${P[0]} ${P[1]}A${R} ${R} 0 ${remaining > 0.5 ? 1 : 0} 1 ${contact[0]} ${contact[1]}`} fill="none" stroke={colors.amber} strokeWidth="6" />}
      <line x1={diameterEnds[0][0]} y1={diameterEnds[0][1]} x2={diameterEnds[1][0]} y2={diameterEnds[1][1]} stroke={colors.blue} strokeWidth="3" />
      <text x={cx} y={cy - R - 10} textAnchor="middle" fill={colors.blue} fontSize="14" fontWeight="700">d = {fmt(d, 1)}</text>
      <circle cx={P[0]} cy={P[1]} r="6" fill={colors.pink} stroke="#141c26" strokeWidth="2" />
      <text x="325" y="40" textAnchor="middle" fill={colors.white} fontSize="16" fontWeight="700">Unrolled {fmt(roll * C)} of {fmt(C)} units = {fmt((roll * C) / d)} diameters</text>
    </>;
  };

  const areaStage = () => {
    const R = r * A.scale, spread = (2 * Math.PI) / sectors, poses = sectorPoses(sectors, rearrange), done = rearrange >= 0.999;
    const halfWidth = (stripWidth(sectors) / 2) * R, halfArc = (Math.PI / 2) * R;
    return <>
      {poses.map((p, i) => <path key={i} d={sector(A.cx + p.x * R, A.cy - p.y * R, R, p.angle, spread)} fill={p.half === "top" ? colors.blue : colors.amber} fillOpacity=".85" stroke="#141c26" strokeWidth="1.5" />)}
      {rearrange === 0 && <><line x1={A.cx} y1={A.cy} x2={A.cx + R} y2={A.cy} stroke={colors.white} strokeWidth="2.5" /><text x={A.cx + R / 2} y={A.cy - 8} textAnchor="middle" fill={colors.white} fontSize="15" fontWeight="700">r = {fmt(r, 1)}</text></>}
      {done && <>
        <line x1={A.cx - halfArc} x2={A.cx + halfArc} y1={A.cy + R / 2 + 16} y2={A.cy + R / 2 + 16} stroke={colors.amber} strokeWidth="2" markerStart="url(#lab-arrow-amber)" markerEnd="url(#lab-arrow-amber)" />
        <text x={A.cx} y={A.cy + R / 2 + 38} textAnchor="middle" fill={colors.amber} fontSize="15" fontWeight="700">πr ≈ {fmt(Math.PI * r)} (half the circumference)</text>
        <line x1={A.cx - halfWidth - 14} x2={A.cx - halfWidth - 14} y1={A.cy - R / 2} y2={A.cy + R / 2} stroke={colors.white} strokeWidth="2" markerStart="url(#lab-arrow-white)" markerEnd="url(#lab-arrow-white)" />
        <text x={A.cx - halfWidth - 22} y={A.cy + 5} textAnchor="end" fill={colors.white} fontSize="15" fontWeight="700">r</text>
      </>}
      <text x="325" y="36" textAnchor="middle" fill={colors.white} fontSize="16" fontWeight="700">{done ? `Area ≈ πr × r = πr² = ${fmt(area(r))} square units` : `${sectors} equal sectors · rearranged ${Math.round(rearrange * 100)}%`}</text>
    </>;
  };

  const panel = mode === "unroll"
    ? <div className={lab.panel}><span>C ÷ d = <b>{fmt(C)} ÷ {fmt(d, 1)} = {fmt(ratio(r), 4)}</b></span><span>Radii tried while unrolling: <b>{seen.rollRadii.length ? seen.rollRadii.map((x) => fmt(x, 1)).join(", ") : "—"}</b></span></div>
    : <div className={lab.panel}><span>Strip ≈ <b>{fmt(Math.PI * r)} wide × {fmt(r, 1)} high = {fmt(area(r))}</b> square units</span><span>Radii tried here: <b>{seen.areaRadii.map((x) => `${fmt(x, 1)} → ${fmt(area(x))}`).join(" · ")}</b></span></div>;

  return <MathLabShell locale={locale} title={simulation.title} outcome={simulation.outcome} tag="CIRCLES AND PI"
    question="Why is every circle's circumference about 3.14 diameters, and where does πr² come from?"
    metrics={[["Circumference", `${fmt(C)} units`], ["Area", `${fmt(area(r))} sq units`], ["C ÷ d", fmt(ratio(r), 4)]]}
    stage={<Stage label={mode === "unroll" ? "A circle rolling along a line, laying its circumference out next to diameter marks" : "A circle cut into sectors that slide into a near-rectangle"}>{mode === "unroll" ? unrollStage() : areaStage()}</Stage>}
    below={panel}
    caption={mode === "unroll" ? "The pink dot starts at the bottom of the circle. Rolling one full turn lays the whole circumference along the line; blue marks are spaced one diameter apart." : "Top-half sectors are blue and bottom-half sectors amber. More sectors make the edges straighter, so the shape gets closer to a rectangle πr wide and r high."}
    controls={<>
      <Segmented label="Mode" value={mode} options={[{ value: "unroll", label: "Unroll circumference" }, { value: "area", label: "Rearrange area" }]} onChange={(m) => { setPlaying(false); setMode(m); }} />
      <Slider label="Radius r" value={r} min={1} max={4} step={0.5} unit="units" onChange={setR} />
      {mode === "unroll"
        ? <Slider label="Unrolled" value={roll} min={0} max={1} step={0.01} onChange={(v) => { setPlaying(false); setRoll(v); }} />
        : <>
          <Slider label="Sectors" value={sectors} min={4} max={48} step={2} onChange={setSectors} />
          <Slider label="Rearranged" value={rearrange} min={0} max={1} step={0.01} onChange={(v) => { setPlaying(false); setRearrange(v); }} />
        </>}
      <ActionButton onClick={play}>{playing ? "Ⅱ Pause" : (mode === "unroll" ? roll : rearrange) >= 1 ? "↻ Play again" : "▶ Play"}</ActionButton>
    </>}
    checks={[
      { label: "Unroll the circle all the way.", done: seen.unrolled },
      { label: "Unroll circles with three different radii and compare C ÷ d.", done: seen.rollRadii.length >= 3 },
      { label: "Fully rearrange a circle cut into at least 24 sectors.", done: seen.rearranged },
      { label: "In Rearrange area, try a radius and then double it. How many times bigger is the area?", done: doubled },
    ]}
    insight={{ title: "one ratio for every circle", body: <><p>Every circle&apos;s circumference is π ≈ 3.14 times its diameter, whatever its size, because all circles are scaled copies of one another. That is why C = πd = 2πr.</p><p>Cut a circle into sectors and line them up top-to-tail: half the circumference runs along the bottom (πr) and the sectors are r tall. With more sectors the shape gets closer to a rectangle, so the area is πr × r = πr². Doubling the radius multiplies the area by 4.</p></> }}
  />;
}
