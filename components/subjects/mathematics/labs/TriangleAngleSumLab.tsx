"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { angleType, exteriorAtC, isTriangle, roundAngles, sideType, triangleAngles, type Pt } from "@/lib/simulations/mathematicsLabs/triangles";
import { ActionButton, MathLabShell } from "./MathLabShell";
import lab from "./mathLab.module.css";
import { colors, Grid, Handle, makePlot, PlotClip, px, py, Stage, unpx, unpy, useDrag } from "./svg";

type Key = "A" | "B" | "C";
type Verts = Record<Key, Pt>;

// The triangle lives above y = 0; the strip below it is where the torn-off corners line up.
const plot = makePlot(-0.5, 13.5, -2.5, 8.5, { left: 30, right: 620, top: 15, bottom: 425 }, true);
const start: Verts = { A: { x: 2, y: 1 }, B: { x: 10, y: 1 }, C: { x: 5, y: 7 } };
const wedgeColor: Record<Key, string> = { A: colors.blue, B: colors.amber, C: colors.pink };
const others: Record<Key, [Key, Key]> = { A: ["B", "C"], B: ["C", "A"], C: ["A", "B"] };
const lineCenter = { x: 325, y: 412 }, fanRadius = 58;
const snap = (n: number) => Math.round(n * 2) / 2;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const TAU = Math.PI * 2;
const norm = (a: number) => ((a % TAU) + TAU) % TAU;
const screen = (p: Pt) => ({ x: px(plot, p.x), y: py(plot, p.y) });

/** A filled angle wedge drawn clockwise on screen from `from` through `span` radians. */
function wedgePath(cx: number, cy: number, r: number, from: number, span: number) {
  const x1 = cx + r * Math.cos(from), y1 = cy + r * Math.sin(from), x2 = cx + r * Math.cos(from + span), y2 = cy + r * Math.sin(from + span);
  return `M${cx} ${cy}L${x1} ${y1}A${r} ${r} 0 ${span > Math.PI ? 1 : 0} 1 ${x2} ${y2}Z`;
}

/** Screen-space start angle and span of the interior angle at `v` between rays to `p` and `q`. */
function cornerWedge(v: { x: number; y: number }, p: { x: number; y: number }, q: { x: number; y: number }) {
  const a1 = Math.atan2(p.y - v.y, p.x - v.x), a2 = Math.atan2(q.y - v.y, q.x - v.x);
  const d = norm(a2 - a1);
  return d <= Math.PI ? { from: a1, span: d } : { from: a2, span: TAU - d };
}

export default function TriangleAngleSumLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const [verts, setVerts] = useState<Verts>(start);
  const [torn, setTorn] = useState(false), [t, setT] = useState(0);
  const [exterior, setExterior] = useState(false);
  const [seen, setSeen] = useState({ obtuse: false, right: false, torn: false, exteriorMoved: false });
  const exteriorRef = useRef(exterior);
  exteriorRef.current = exterior;

  const angles = triangleAngles(verts.A, verts.B, verts.C), shown = roundAngles(angles);
  const kind = angleType(angles), sides = sideType(verts.A, verts.B, verts.C);

  useEffect(() => {
    if (kind === "obtuse" || kind === "right") setSeen((s) => (s[kind] ? s : { ...s, [kind]: true }));
  }, [kind]);

  // Animate the torn-off corners toward (or back from) the straight line over about a second.
  useEffect(() => {
    const target = torn ? 1 : 0;
    let id = 0, last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let done = false;
      setT((value) => {
        const next = target > value ? Math.min(1, value + dt) : Math.max(0, value - dt);
        done = next === target;
        return next;
      });
      if (!done) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [torn]);

  const drag = useDrag<Key>(useCallback((key, sx, sy) => {
    setVerts((prev) => {
      const p = { x: clamp(snap(unpx(plot, sx)), 0, 13), y: clamp(snap(unpy(plot, sy)), 0, 8) };
      if (p.x === prev[key].x && p.y === prev[key].y) return prev;
      const next = { ...prev, [key]: p };
      if (!isTriangle(next.A, next.B, next.C)) return prev;
      if (exteriorRef.current) setSeen((s) => (s.exteriorMoved ? s : { ...s, exteriorMoved: true }));
      return next;
    });
  }, []));

  const S = { A: screen(verts.A), B: screen(verts.B), C: screen(verts.C) };
  const centroid = { x: (S.A.x + S.B.x + S.C.x) / 3, y: (S.A.y + S.B.y + S.C.y) / 3 };
  const side = (p: { x: number; y: number }, q: { x: number; y: number }) => Math.hypot(p.x - q.x, p.y - q.y);
  const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

  // Each corner wedge moves from its vertex to a slot on the straight line: A, then B, then C.
  let offset = Math.PI;
  const wedges = (["A", "B", "C"] as Key[]).map((k) => {
    const [p, q] = others[k], v = S[k];
    const w = cornerWedge(v, S[p], S[q]);
    const r0 = Math.max(16, Math.min(34, 0.35 * Math.min(side(v, S[p]), side(v, S[q]))));
    let target = offset;
    offset += w.span;
    while (target - w.from > Math.PI) target -= TAU;
    while (w.from - target > Math.PI) target += TAU;
    const from = w.from + (target - w.from) * ease, r = r0 + (fanRadius - r0) * ease;
    const cx = v.x + (lineCenter.x - v.x) * ease, cy = v.y + (lineCenter.y - v.y) * ease;
    const mid = from + w.span / 2, labelR = r + 15;
    return { k, cx, cy, r, from, span: w.span, lx: cx + labelR * Math.cos(mid), ly: cy + labelR * Math.sin(mid) + 5, r0, w, v };
  });

  // Exterior angle at C: between the extension of BC beyond C and side CA.
  const dir = { x: verts.C.x - verts.B.x, y: verts.C.y - verts.B.y }, len = Math.hypot(dir.x, dir.y);
  const E = screen({ x: verts.C.x + (dir.x / len) * 4, y: verts.C.y + (dir.y / len) * 4 });
  const ext = cornerWedge(S.C, E, S.A), extR = 42, extMid = ext.from + ext.span / 2;
  const extLabel = { x: clamp(S.C.x + (extR + 30) * Math.cos(extMid), 70, 580), y: clamp(S.C.y + (extR + 30) * Math.sin(extMid), 30, 320) };

  const stage = <Stage label="A triangle with draggable corners and its three angles marked" svgRef={drag.svgRef} onPointerMove={drag.move} onPointerUp={drag.end}>
    <PlotClip plot={plot} id="triangle-grid-clip"><Grid plot={makePlot(-0.5, 13.5, 0, 8.5, { left: plot.left, right: plot.right, top: plot.top, bottom: py(plot, 0) })} step={1} labelEvery={100} /></PlotClip>
    {exterior && <PlotClip plot={plot} id="triangle-ext-clip">
      <line x1={S.C.x} y1={S.C.y} x2={E.x} y2={E.y} stroke={colors.green} strokeWidth="2.5" strokeDasharray="8 6" />
      <path d={wedgePath(S.C.x, S.C.y, extR, ext.from, ext.span)} fill={colors.green} fillOpacity=".35" stroke={colors.green} strokeWidth="2" />
    </PlotClip>}
    <polygon points={`${S.A.x},${S.A.y} ${S.B.x},${S.B.y} ${S.C.x},${S.C.y}`} fill="#4b658b" fillOpacity=".35" stroke={colors.white} strokeWidth="2.5" strokeLinejoin="round" />
    {t > 0 && wedges.map((w) => <path key={`ghost${w.k}`} d={wedgePath(w.v.x, w.v.y, w.r0, w.w.from, w.w.span)} fill="none" stroke={wedgeColor[w.k]} strokeWidth="1.5" strokeDasharray="3 4" opacity=".7" />)}
    {t > 0 && <g>
      <line x1={lineCenter.x - 120} x2={lineCenter.x + 120} y1={lineCenter.y} y2={lineCenter.y} stroke={colors.white} strokeWidth="2.5" opacity={0.4 + 0.6 * ease} />
      {t === 1 && <text x={lineCenter.x + 128} y={lineCenter.y - 8} fill={colors.white} fontSize="14" fontWeight="700">= 180°</text>}
      {t === 1 && <text x={lineCenter.x - 128} y={lineCenter.y - 8} textAnchor="end" fill={colors.white} fontSize="13">a straight line</text>}
    </g>}
    {wedges.map((w) => <g key={w.k}>
      <path d={wedgePath(w.cx, w.cy, w.r, w.from, w.span)} fill={wedgeColor[w.k]} fillOpacity=".55" stroke={wedgeColor[w.k]} strokeWidth="2" />
      <text x={w.lx} y={w.ly} textAnchor="middle" fill={wedgeColor[w.k]} fontSize="14" fontWeight="700">{shown[w.k]}°</text>
    </g>)}
    {exterior && <text x={extLabel.x} y={extLabel.y} textAnchor="middle" fill={colors.green} fontSize="14" fontWeight="700">
      <tspan x={extLabel.x}>{Math.round(exteriorAtC(angles))}°</tspan><tspan x={extLabel.x} dy="17">= ∠A + ∠B</tspan>
    </text>}
    {(["A", "B", "C"] as Key[]).map((k) => {
      const v = S[k], dx = v.x - centroid.x, dy = v.y - centroid.y, d = Math.hypot(dx, dy) || 1;
      return <g key={`v${k}`}>
        <text x={v.x + (dx / d) * 26} y={v.y + (dy / d) * 26 + 6} textAnchor="middle" fill={colors.white} fontSize="18" fontWeight="800">{k}</text>
        <Handle x={v.x} y={v.y} color={wedgeColor[k]} onPointerDown={drag.start(k)} label={`Vertex ${k}`} />
      </g>;
    })}
  </Stage>;

  const largest = (["A", "B", "C"] as Key[]).reduce((m, k) => (angles[k] > angles[m] ? k : m), "A" as Key);
  const kindLabel = `${kind[0].toUpperCase()}${kind.slice(1)}${sides === "scalene" ? " · scalene" : ` · ${sides}`}`;

  return <MathLabShell locale={locale} title={simulation.title} outcome={simulation.outcome} tag="TRIANGLE ANGLES"
    question="Does the total of a triangle's three angles change when you change its shape?"
    metrics={[["∠A + ∠B + ∠C", `${shown.A}° + ${shown.B}° + ${shown.C}° = 180°`], ["Triangle type", kindLabel], ["Largest angle", `∠${largest} = ${shown[largest]}°`]]}
    stage={stage}
    below={<div className={lab.panel}>
      <span>∠A = <b>{shown.A}°</b></span><span>∠B = <b>{shown.B}°</b></span><span>∠C = <b>{shown.C}°</b></span>
      {exterior && <span>Exterior angle at C = 180° − ∠C = <b>{Math.round(exteriorAtC(angles))}°</b> = ∠A + ∠B</span>}
    </div>}
    caption="Drag the corners A, B and C; they snap to half-grid points. Angles are shown to the nearest degree, rounded so the three labels always total 180°."
    controls={<>
      <ActionButton onClick={() => { setTorn((v) => !v); setSeen((s) => ({ ...s, torn: true })); }}>{torn ? "Put the corners back" : "Tear off the corners"}</ActionButton>
      <ActionButton onClick={() => setExterior((v) => !v)}>{exterior ? "Hide exterior angle" : "Show exterior angle"}</ActionButton>
      <ActionButton onClick={() => { setVerts(start); setTorn(false); setExterior(false); }}>Reset triangle</ActionButton>
    </>}
    checks={[
      { label: "Make an obtuse triangle, with one angle bigger than 90°.", done: seen.obtuse },
      { label: "Make a right triangle, with one angle of exactly 90°.", done: seen.right },
      { label: "Tear off the corners and line them up.", done: seen.torn },
      { label: "Show the exterior angle, then move a corner and watch it track ∠A + ∠B.", done: seen.exteriorMoved },
    ]}
    insight={{ title: "the angles fill a straight line", body: <>
      <p>However you drag the corners, ∠A + ∠B + ∠C = 180°. Torn off and placed side by side, the three corners always fill a straight line exactly.</p>
      <p>Why: draw a line through C parallel to AB. The two angles it makes with sides CA and CB are alternate angles, equal to ∠A and ∠B. Together with ∠C they sit on that straight line, so the three add up to 180°.</p>
      <p>The exterior angle at C also makes a straight line with ∠C, so it equals 180° − ∠C, which is ∠A + ∠B: the two interior angles opposite it.</p>
    </> }}
  />;
}
