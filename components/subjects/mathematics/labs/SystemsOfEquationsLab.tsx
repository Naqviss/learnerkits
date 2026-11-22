"use client";
import { useCallback, useState } from "react";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { lineLabel, solveSystem, type Line } from "@/lib/simulations/mathematicsLabs/systems";
import { ActionButton, MathLabShell, Slider } from "./MathLabShell";
import lab from "./mathLab.module.css";
import { colors, fmt, Grid, Handle, makePlot, PlotClip, px, py, Stage, unpx, unpy, useDrag } from "./svg";

const plot = makePlot(-8, 8, -6, 6, { left: 40, right: 610, top: 22, bottom: 418 }, true);
const snap = (n: number, step: number) => Math.round(n / step) * step;
const start = { a: { m: 1, b: -1 }, b: { m: -0.5, b: 4 } };

export default function SystemsOfEquationsLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const [lines, setLines] = useState<{ a: Line; b: Line }>(start);
  const [seen, setSeen] = useState({ point: false, none: false, infinite: false, third: false });
  const set = useCallback((key: "a" | "b", patch: Partial<Line>) => setLines((prev) => {
    const next = { ...prev, [key]: { ...prev[key], ...patch } };
    const s = solveSystem(next.a, next.b);
    setSeen((old) => ({
      point: old.point || (s.kind === "one" && Math.abs(s.x - 2) < 1e-6 && Math.abs(s.y - 3) < 1e-6),
      none: old.none || s.kind === "none",
      infinite: old.infinite || s.kind === "infinite",
      third: old.third || (s.kind === "one" && s.x < 0 && s.y < 0),
    }));
    return next;
  }), []);

  // Drag the y-intercept handle up and down, or the slope handle at x = 2 to tilt the line.
  const drag = useDrag<"ab" | "am" | "bb" | "bm">(useCallback((id, sx, sy) => {
    const key = id[0] as "a" | "b", y = unpy(plot, sy);
    if (id.endsWith("b")) set(key, { b: Math.max(-6, Math.min(6, snap(y, 0.5))) });
    else {
      // Slope = rise ÷ run from the intercept to the pointer; ignore the pointer near the y-axis.
      const x = unpx(plot, sx);
      if (Math.abs(x) >= 0.4) set(key, { m: Math.max(-4, Math.min(4, snap((y - lines[key].b) / x, 0.25))) });
    }
  }, [lines, set]));

  const s = solveSystem(lines.a, lines.b);
  const segment = (l: Line) => `M${px(plot, -8)} ${py(plot, l.m * -8 + l.b)}L${px(plot, 8)} ${py(plot, l.m * 8 + l.b)}`;
  const solution = s.kind === "one" ? `(${fmt(s.x)}, ${fmt(s.y)})` : s.kind === "none" ? "No solution" : "Infinitely many";
  const inView = s.kind === "one" && Math.abs(s.x) <= 8 && Math.abs(s.y) <= 6;

  const stage = <Stage label="Two lines on a coordinate grid and the point where they cross" svgRef={drag.svgRef} onPointerMove={drag.move} onPointerUp={drag.end}>
    <Grid plot={plot} step={1} labelEvery={2} />
    <PlotClip plot={plot} id="systems-clip">
      <path d={segment(lines.a)} stroke={colors.blue} strokeWidth="3.5" />
      <path d={segment(lines.b)} stroke={colors.amber} strokeWidth="3.5" strokeDasharray={s.kind === "infinite" ? "10 8" : undefined} />
    </PlotClip>
    {inView && s.kind === "one" && <g><line x1={px(plot, s.x)} x2={px(plot, s.x)} y1={py(plot, 0)} y2={py(plot, s.y)} stroke={colors.white} strokeDasharray="4 5" opacity=".6" /><line y1={py(plot, s.y)} y2={py(plot, s.y)} x1={px(plot, 0)} x2={px(plot, s.x)} stroke={colors.white} strokeDasharray="4 5" opacity=".6" /><circle cx={px(plot, s.x)} cy={py(plot, s.y)} r="8" fill={colors.green} stroke="#13202a" strokeWidth="3" /><text x={px(plot, s.x) + 12} y={py(plot, s.y) - 12} fill={colors.white} fontSize="15" fontWeight="700">{solution}</text></g>}
    {s.kind === "none" && <text x="325" y="40" textAnchor="middle" fill={colors.pink} fontSize="16" fontWeight="700">Parallel lines never meet: no solution</text>}
    {s.kind === "infinite" && <text x="325" y="40" textAnchor="middle" fill={colors.green} fontSize="16" fontWeight="700">Same line: every point is a solution</text>}
    {s.kind === "one" && !inView && <text x="325" y="40" textAnchor="middle" fill={colors.white} fontSize="14">The lines cross off the grid at {solution}</text>}
    {(["a", "b"] as const).map((k) => <g key={k}>
      <Handle x={px(plot, 0)} y={py(plot, lines[k].b)} color={k === "a" ? colors.blue : colors.amber} onPointerDown={drag.start(`${k}b`)} label={`Line ${k === "a" ? 1 : 2} y-intercept`} />
      <Handle x={px(plot, 2)} y={py(plot, lines[k].m * 2 + lines[k].b)} color={k === "a" ? colors.blue : colors.amber} onPointerDown={drag.start(`${k}m`)} label={`Line ${k === "a" ? 1 : 2} slope`} />
    </g>)}
    <text x="52" y="44" fill={colors.blue} fontSize="15" fontWeight="700">{lineLabel(lines.a)}</text>
    <text x="52" y="66" fill={colors.amber} fontSize="15" fontWeight="700">{lineLabel(lines.b)}</text>
  </Stage>;

  // Live algebra that mirrors the picture: set the right-hand sides equal and solve for x.
  const algebra = s.kind === "one"
    ? <>Set them equal: <b>{lineLabel(lines.a, "").slice(3)} = {lineLabel(lines.b, "").slice(3)}</b> → <b>x = {fmt(s.x)}</b>, then <b>y = {fmt(s.y)}</b></>
    : s.kind === "none" ? <>Equal slopes ({lines.a.m}) but different intercepts: setting them equal gives <b>{lines.a.b} = {lines.b.b}</b>, which is false.</>
      : <>Both equations are <b>{lineLabel(lines.a)}</b>: setting them equal gives <b>0 = 0</b>, true for every x.</>;

  return <MathLabShell locale={locale} title={simulation.title} outcome={simulation.outcome} tag="SYSTEMS OF EQUATIONS"
    question="Where do two lines meet, and what does that point mean for both equations?"
    metrics={[["Line 1", lineLabel(lines.a)], ["Line 2", lineLabel(lines.b)], ["Solution", solution]]}
    stage={stage} below={<div className={lab.panel}>{algebra}</div>}
    caption="Drag the dot on the y-axis to move a line up or down, and the dot at x = 2 to change its slope. Slopes snap to 0.25 and intercepts to 0.5."
    controls={<>
      <Slider label="Line 1 slope m₁" value={lines.a.m} min={-4} max={4} step={0.25} onChange={(m) => set("a", { m })} />
      <Slider label="Line 1 intercept b₁" value={lines.a.b} min={-6} max={6} step={0.5} onChange={(b) => set("a", { b })} />
      <Slider label="Line 2 slope m₂" value={lines.b.m} min={-4} max={4} step={0.25} onChange={(m) => set("b", { m })} />
      <Slider label="Line 2 intercept b₂" value={lines.b.b} min={-6} max={6} step={0.5} onChange={(b) => set("b", { b })} />
      <ActionButton onClick={() => { set("a", { m: 0.5, b: 2 }); set("b", { m: 1, b: 0 }); }}>Load the gym story</ActionButton>
    </>}
    checks={[
      { label: "Make the lines cross at exactly (2, 3).", done: seen.point },
      { label: "Make a system with no solution.", done: seen.none },
      { label: "Make a system with infinitely many solutions.", done: seen.infinite },
      { label: "Move the solution into quadrant III, where x and y are both negative.", done: seen.third },
    ]}
    insight={{ title: "the crossing point solves both", body: <><p>A point lies on a line exactly when its coordinates make that equation true, so the crossing point is the only pair (x, y) that satisfies both equations at once.</p><p>Different slopes always cross once. Equal slopes with different intercepts are parallel and never meet. Equal slopes and equal intercepts are the same line, so every point works.</p><p>In the gym story, gym A charges $20 plus $5 a visit and gym B $10 a visit (one grid step is $10). The lines cross at 4 visits and $40: fewer visits favor gym B, more favor gym A.</p></> }}
  />;
}
