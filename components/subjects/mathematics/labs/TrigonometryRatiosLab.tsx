"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { baseFor, ratios, rightTriangle, sidesFor, thetaAt, type Corner } from "@/lib/simulations/mathematicsLabs/trig";
import { MathLabShell, Segmented, Slider } from "./MathLabShell";
import lab from "./mathLab.module.css";
import { colors, fmt, Grid, Handle, makePlot, px, py, Stage, unpx, unpy, useDrag } from "./svg";

const plot = makePlot(-0.6, 13, -1, 10.8, { left: 30, right: 620, top: 18, bottom: 422 }, true);
const role = { opposite: colors.pink, adjacent: colors.blue, hyp: colors.amber };
const TAU = Math.PI * 2;
const norm = (a: number) => ((a % TAU) + TAU) % TAU;

/** Filled wedge for the interior angle at v between rays to p and q (screen coordinates). */
function angleWedge(v: { x: number; y: number }, p: { x: number; y: number }, q: { x: number; y: number }, r: number) {
  const a1 = Math.atan2(p.y - v.y, p.x - v.x), a2 = Math.atan2(q.y - v.y, q.x - v.x), d = norm(a2 - a1);
  const from = d <= Math.PI ? a1 : a2, span = d <= Math.PI ? d : TAU - d, mid = from + span / 2;
  const path = `M${v.x} ${v.y}L${v.x + r * Math.cos(from)} ${v.y + r * Math.sin(from)}A${r} ${r} 0 0 1 ${v.x + r * Math.cos(from + span)} ${v.y + r * Math.sin(from + span)}Z`;
  return { path, mid };
}

export default function TrigonometryRatiosLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const [base, setBase] = useState(37); // angle at the bottom-left corner, in whole degrees
  const [hyp, setHyp] = useState(5);
  const [corner, setCorner] = useState<Corner>("base");
  const [seen, setSeen] = useState({ size: false, switched: false, tan1: false, sinHalf: false });
  const sizeRef = useRef({ base: 37, hyp: 5 });

  const theta = thetaAt(base, corner);
  useEffect(() => {
    // The size check counts only hypotenuse changes made since the angle last changed.
    if (base !== sizeRef.current.base) sizeRef.current = { base, hyp };
    else if (Math.abs(hyp - sizeRef.current.hyp) >= 2 - 1e-9) setSeen((s) => (s.size ? s : { ...s, size: true }));
  }, [base, hyp]);
  useEffect(() => {
    if (theta === 45) setSeen((s) => (s.tan1 ? s : { ...s, tan1: true }));
    if (theta === 30) setSeen((s) => (s.sinHalf ? s : { ...s, sinHalf: true }));
  }, [theta]);

  // Dragging the top corner slides it along the hypotenuse, so only the size changes.
  const drag = useDrag<"top">(useCallback((_id, sx, sy) => {
    const r = (base * Math.PI) / 180, x = unpx(plot, sx), y = unpy(plot, sy);
    const along = x * Math.cos(r) + y * Math.sin(r);
    setHyp(Math.max(2, Math.min(10, Math.round(along * 10) / 10)));
  }, [base]));

  const tri = rightTriangle(base, hyp), sides = sidesFor(base, hyp, corner), q = ratios(base, hyp, corner);
  const P = { x: px(plot, 0), y: py(plot, 0) }, R = { x: px(plot, tri.horizontal), y: py(plot, 0) }, T = { x: px(plot, tri.horizontal), y: py(plot, tri.vertical) };
  const half = rightTriangle(base, hyp / 2);
  const Rh = { x: px(plot, half.horizontal), y: py(plot, 0) }, Th = { x: px(plot, half.horizontal), y: py(plot, half.vertical) };
  const bottomRole = corner === "base" ? "adjacent" : "opposite", verticalRole = corner === "base" ? "opposite" : "adjacent";
  const name = { opposite: "Opposite", adjacent: "Adjacent" } as const;
  const thetaWedge = corner === "base" ? angleWedge(P, R, T, 44) : angleWedge(T, P, R, 44);
  const otherWedge = corner === "base" ? angleWedge(T, P, R, 26) : angleWedge(P, R, T, 26);
  const at = corner === "base" ? P : T, other = corner === "base" ? T : P;
  const hypNormal = { x: -Math.sin((base * Math.PI) / 180), y: -Math.cos((base * Math.PI) / 180) }; // up-left of the hypotenuse on screen
  const sq = 14;

  const stage = <Stage label="A right triangle with its opposite, adjacent and hypotenuse sides labelled" svgRef={drag.svgRef} onPointerMove={drag.move} onPointerUp={drag.end}>
    <Grid plot={plot} step={1} labelEvery={2} />
    {hyp >= 4 && <g opacity=".75">
      <polygon points={`${P.x},${P.y} ${Rh.x},${Rh.y} ${Th.x},${Th.y}`} fill="none" stroke={colors.white} strokeWidth="1.5" strokeDasharray="5 5" />
      <text x={Th.x + 8} y={Th.y + 4} fill={colors.white} fontSize="13">½ size, same θ</text>
    </g>}
    <polygon points={`${P.x},${P.y} ${R.x},${R.y} ${T.x},${T.y}`} fill="#4b658b" fillOpacity=".3" />
    <path d={thetaWedge.path} fill={colors.green} fillOpacity=".4" stroke={colors.green} strokeWidth="2" />
    <path d={otherWedge.path} fill="none" stroke={colors.muted} strokeWidth="1.5" />
    <line x1={P.x} y1={P.y} x2={R.x} y2={R.y} stroke={role[bottomRole]} strokeWidth="5" strokeLinecap="round" />
    <line x1={R.x} y1={R.y} x2={T.x} y2={T.y} stroke={role[verticalRole]} strokeWidth="5" strokeLinecap="round" />
    <line x1={P.x} y1={P.y} x2={T.x} y2={T.y} stroke={role.hyp} strokeWidth="5" strokeLinecap="round" />
    <path d={`M${R.x - sq} ${R.y}V${R.y - sq}H${R.x}`} fill="none" stroke={colors.white} strokeWidth="1.5" />
    <text x={(P.x + R.x) / 2} y={P.y + 34} textAnchor="middle" fill={role[bottomRole]} fontSize="15" fontWeight="700">{name[bottomRole]} {fmt(tri.horizontal)}</text>
    <text x={R.x + 12} y={(R.y + T.y) / 2 + 5} fill={role[verticalRole]} fontSize="15" fontWeight="700">{name[verticalRole]} {fmt(tri.vertical)}</text>
    <text x={(P.x + T.x) / 2 + hypNormal.x * 18} y={(P.y + T.y) / 2 + hypNormal.y * 18} textAnchor="end" fill={role.hyp} fontSize="15" fontWeight="700">Hypotenuse {fmt(hyp)}</text>
    <text x={at.x + 64 * Math.cos(thetaWedge.mid)} y={at.y + 64 * Math.sin(thetaWedge.mid) + 5} textAnchor="middle" fill={colors.green} fontSize="15" fontWeight="800">θ = {theta}°</text>
    <text x={other.x + 42 * Math.cos(otherWedge.mid)} y={other.y + 42 * Math.sin(otherWedge.mid) + 5} textAnchor="middle" fill={colors.muted} fontSize="13">{90 - theta}°</text>
    <text x={T.x + 16} y={T.y - 10} fill={colors.violet} fontSize="13">drag to resize</text>
    <Handle x={T.x} y={T.y} color={colors.violet} onPointerDown={drag.start("top")} label="Top corner: drag to change the size" />
  </Stage>;

  const line = (fn: string, top: string, bottom: string, a: number, b: number, value: number) =>
    <span>{fn} {theta}° = {top} ÷ {bottom} = {fmt(a)} ÷ {fmt(b)} = <b>{fmt(value, 3)}</b></span>;

  return <MathLabShell locale={locale} title={simulation.title} outcome={simulation.outcome} tag="SOH CAH TOA"
    question="Do the side ratios of a right triangle depend on its size, or only on its angle?"
    metrics={[["sin θ", fmt(q.sin, 3)], ["cos θ", fmt(q.cos, 3)], ["tan θ", fmt(q.tan, 3)]]}
    stage={stage}
    below={<div className={lab.panel}>
      {line("sin", "opp", "hyp", sides.opposite, hyp, q.sin)}
      {line("cos", "adj", "hyp", sides.adjacent, hyp, q.cos)}
      {line("tan", "opp", "adj", sides.opposite, sides.adjacent, q.tan)}
    </div>}
    caption="Drag the top corner to resize the triangle without changing its angles, or use the sliders. Side lengths are in grid units; the dashed triangle is half the size with the same angle."
    controls={<>
      <Slider label="Angle θ" value={theta} min={5} max={85} step={1} unit="°" onChange={(v) => setBase(baseFor(v, corner))} />
      <Slider label="Hypotenuse" value={hyp} min={2} max={10} step={0.5} onChange={setHyp} />
      <Segmented label="θ is at" value={corner} options={[{ value: "base", label: "Bottom-left corner" }, { value: "top", label: "Top corner" }] as const}
        onChange={(c) => { setCorner(c); setSeen((s) => ({ ...s, switched: true })); }} />
    </>}
    checks={[
      { label: "Change the hypotenuse by at least 2 without changing θ. Do sin, cos and tan change?", done: seen.size },
      { label: "Move θ to the other corner and see which sides swap names.", done: seen.switched },
      { label: "Find the angle where tan θ = 1.", done: seen.tan1 },
      { label: "Find the angle where sin θ = 0.5.", done: seen.sinHalf },
    ]}
    insight={{ title: "the ratios belong to the angle", body: <>
      <p>Right triangles with the same angle θ are similar: every side scales by the same factor, so opp ÷ hyp, adj ÷ hyp and opp ÷ adj never change with size. That is why sin, cos and tan are functions of the angle alone.</p>
      <p>SOH CAH TOA: <strong>s</strong>in = <strong>o</strong>pposite ÷ <strong>h</strong>ypotenuse, <strong>c</strong>os = <strong>a</strong>djacent ÷ <strong>h</strong>ypotenuse, <strong>t</strong>an = <strong>o</strong>pposite ÷ <strong>a</strong>djacent.</p>
      <p>The hypotenuse is always the side across from the right angle, but opposite and adjacent depend on where you stand: moving θ to the other corner swaps them, so the sine of one acute angle is the cosine of the other.</p>
    </> }}
  />;
}
