"use client";
import { useEffect, useState, type ReactElement } from "react";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { commonDenominator, compare, label, scaleFactor, simplify, value, type Fraction } from "@/lib/simulations/mathematicsLabs/fractions";
import { ActionButton, MathLabShell, Segmented, Stepper } from "./MathLabShell";
import lab from "./mathLab.module.css";
import { colors, fmt, Stage } from "./svg";

// One whole is 260 px wide, so the bars, pies and number line all share the same 0–2 scale.
const X0 = 65, UNIT = 260;
const xOf = (v: number) => X0 + v * UNIT;
const rows = { A: { bar: 58, pie: 92, color: colors.blue }, B: { bar: 172, pie: 210, color: colors.amber } } as const;
const BAR_H = 56, PIE_R = 50, LINE_Y = 340;
const start = { A: { n: 1, d: 2 }, B: { n: 2, d: 3 } };
type Key = "A" | "B";

function sectorPath(cx: number, cy: number, r: number, from: number, to: number) {
  const p = (a: number) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
  return `M${cx} ${cy}L${p(from)}A${r} ${r} 0 ${to - from > Math.PI ? 1 : 0} 1 ${p(to)}Z`;
}

/** Two wholes of one fraction, as bars or pies. Clicking a part shades up to it (click the last shaded part to unshade it). */
function FractionPicture({ name, f, mode, onPick }: { name: Key; f: Fraction; mode: "bars" | "circles"; onPick: (n: number) => void }) {
  const row = rows[name], parts: ReactElement[] = [];
  for (let whole = 0; whole < 2; whole++) {
    for (let j = 0; j < f.d; j++) {
      const index = whole * f.d + j, shaded = index < f.n, pick = () => onPick(index + 1 === f.n ? index : index + 1);
      const fill = shaded ? row.color : "#2a3646", opacity = whole === 1 && f.n <= f.d ? 0.45 : 1;
      const common = { fill, opacity, stroke: "#141c26", strokeWidth: 2, style: { cursor: "pointer" }, onClick: pick };
      if (mode === "bars") parts.push(<rect key={index} x={xOf(whole) + (j * UNIT) / f.d} y={row.bar} width={UNIT / f.d} height={BAR_H} {...common}><title>{`Shade ${index + 1}/${f.d}`}</title></rect>);
      else {
        const cx = xOf(whole + 0.5), from = -Math.PI / 2 + (j * 2 * Math.PI) / f.d, to = from + (2 * Math.PI) / f.d;
        parts.push(f.d === 1
          ? <circle key={index} cx={cx} cy={row.pie} r={PIE_R} {...common}><title>{`Shade ${index + 1}/1`}</title></circle>
          : <path key={index} d={sectorPath(cx, row.pie, PIE_R, from, to)} {...common}><title>{`Shade ${index + 1}/${f.d}`}</title></path>);
      }
    }
  }
  const top = mode === "bars" ? row.bar : row.pie - PIE_R;
  return <g>
    <text x={X0} y={top - 10} fill={row.color} fontSize="16" fontWeight="700">{name} = {label(f)}</text>
    {parts}
    {/* Mark where the first whole ends so "more than 1" is visible at a glance. */}
    {mode === "bars" && <g pointerEvents="none">
      <line x1={xOf(1)} x2={xOf(1)} y1={row.bar - 6} y2={row.bar + BAR_H + 6} stroke={colors.white} strokeWidth="3" />
      <text x={xOf(0.5)} y={row.bar + BAR_H + 18} textAnchor="middle" fill={colors.muted} fontSize="12">1st whole</text>
      <text x={xOf(1.5)} y={row.bar + BAR_H + 18} textAnchor="middle" fill={colors.muted} fontSize="12">2nd whole</text>
    </g>}
  </g>;
}

export default function FractionVisualizerLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const [fr, setFr] = useState<Record<Key, Fraction>>(start);
  const [mode, setMode] = useState<"bars" | "circles">("bars");
  const [seen, setSeen] = useState({ equal: false, bigger: false, whole: false, improper: false });
  const a = fr.A, b = fr.B, cmp = compare(a, b);

  useEffect(() => {
    setSeen((old) => ({
      equal: old.equal || (cmp === 0 && a.d !== b.d && a.n > 0),
      bigger: old.bigger || (cmp === 1 && a.n < b.n),
      whole: old.whole || a.n === a.d || b.n === b.d,
      improper: old.improper || a.n > a.d || b.n > b.d,
    }));
  }, [a, b, cmp]);

  const set = (key: Key, patch: Partial<Fraction>) => setFr((prev) => {
    const next = { ...prev[key], ...patch };
    next.n = Math.min(next.n, next.d * 2); // up to two wholes
    return { ...prev, [key]: next };
  });

  const scale = scaleFactor(a, b), common = commonDenominator(a, b), sa = simplify(a), sb = simplify(b);
  const sign = cmp === 0 ? "=" : cmp > 0 ? ">" : "<";

  const ticks = (f: Fraction, above: boolean, color: string) => Array.from({ length: f.d * 2 + 1 }, (_, i) => {
    const x = xOf(i / f.d), len = i % f.d === 0 ? 14 : 8;
    return <line key={i} x1={x} x2={x} y1={LINE_Y} y2={LINE_Y + (above ? -len : len)} stroke={color} strokeWidth="2" />;
  });

  const stage = <Stage label="Two fractions shown as shaded parts of two wholes, above a number line from 0 to 2">
    <FractionPicture name="A" f={a} mode={mode} onPick={(n) => set("A", { n })} />
    <FractionPicture name="B" f={b} mode={mode} onPick={(n) => set("B", { n })} />
    {scale && <text x={xOf(2)} y={mode === "bars" ? 152 : 158} textAnchor="end" fill={colors.green} fontSize="15" fontWeight="700">{scale.to} = {scale.to === "B" ? "A" : "B"} with ×{scale.k} top and bottom</text>}
    {cmp === 0 && a.n > 0 && <line x1={xOf(value(a))} x2={xOf(value(a))} y1={mode === "bars" ? rows.A.bar : rows.A.pie} y2={LINE_Y} stroke={colors.green} strokeWidth="2" strokeDasharray="6 6" />}
    {mode === "bars" && cmp !== 0 && <>
      <line x1={xOf(value(a))} x2={xOf(value(a))} y1={rows.A.bar + BAR_H} y2={LINE_Y - 16} stroke={colors.blue} strokeDasharray="3 5" opacity=".7" />
      <line x1={xOf(value(b))} x2={xOf(value(b))} y1={rows.B.bar + BAR_H} y2={LINE_Y + 16} stroke={colors.amber} strokeDasharray="3 5" opacity=".7" />
    </>}
    <line x1={xOf(0)} x2={xOf(2)} y1={LINE_Y} y2={LINE_Y} stroke={colors.white} strokeWidth="2" />
    {ticks(a, true, colors.blue)}
    {ticks(b, false, colors.amber)}
    {[0, 1, 2].map((n) => <text key={n} x={xOf(n)} y={LINE_Y + 36} textAnchor="middle" fill={colors.white} fontSize="16" fontWeight="700">{n}</text>)}
    <path d={`M${xOf(value(a))} ${LINE_Y - 20}l-8 -14h16z`} fill={colors.blue} />
    <text x={xOf(value(a))} y={LINE_Y - 40} textAnchor="middle" fill={colors.blue} fontSize="14" fontWeight="700">A</text>
    <path d={`M${xOf(value(b))} ${LINE_Y + 20}l-8 14h16z`} fill={colors.amber} />
    <text x={xOf(value(b)) + (cmp === 0 ? 14 : 0)} y={LINE_Y + 66} textAnchor="middle" fill={colors.amber} fontSize="14" fontWeight="700">B</text>
    <text x="325" y="425" textAnchor="middle" fill={colors.white} fontSize="16" fontWeight="700">{label(a)} {sign} {label(b)}</text>
  </Stage>;

  const panel = <div className={lab.panel}>
    <span>Common denominator {common.d}: <b>A = {common.a}/{common.d}</b>, <b>B = {common.b}/{common.d}</b>, so <b>A {sign} B</b></span>
    <span>Simplest forms: <b>{label(sa)}</b> and <b>{label(sb)}</b></span>
  </div>;

  return <MathLabShell locale={locale} title={simulation.title} outcome={simulation.outcome} tag="EQUIVALENT FRACTIONS"
    question="Can two fractions with different numbers name exactly the same amount?"
    metrics={[["A as a decimal", fmt(value(a), 3)], ["B as a decimal", fmt(value(b), 3)], ["Comparison", `A ${sign} B`]]}
    stage={stage} below={panel}
    caption="Click any part of a bar or circle to shade up to it. Each picture shows two wholes, so fractions up to 2 fit; the number line below uses the same scale."
    controls={<>
      <Segmented label="Picture" value={mode} options={[{ value: "bars", label: "Bars" }, { value: "circles", label: "Circles" }]} onChange={setMode} />
      <Stepper label="A numerator" value={a.n} min={0} max={a.d * 2} onChange={(n) => set("A", { n })} />
      <Stepper label="A denominator" value={a.d} min={1} max={12} onChange={(d) => set("A", { d })} />
      <Stepper label="B numerator" value={b.n} min={0} max={b.d * 2} onChange={(n) => set("B", { n })} />
      <Stepper label="B denominator" value={b.d} min={1} max={12} onChange={(d) => set("B", { d })} />
      <ActionButton onClick={() => setFr(start)}>Reset to 1/2 and 2/3</ActionButton>
    </>}
    checks={[
      { label: "Make B equal to A using a different denominator.", done: seen.equal },
      { label: "Make A greater than B even though A has the smaller numerator.", done: seen.bigger },
      { label: "Make a fraction that equals exactly one whole.", done: seen.whole },
      { label: "Find an improper fraction, one greater than 1.", done: seen.improper },
    ]}
    insight={{ title: "same amount, smaller pieces", body: <><p>Multiplying the top and bottom of a fraction by the same number cuts every piece into that many equal smaller pieces. There are more pieces, each one smaller, so the shaded amount does not change: 1/2, 2/4 and 3/6 all reach the same point on the number line.</p><p>To compare fractions, rewrite them over a common denominator or look at the number line. A bigger numerator only means a bigger fraction when the pieces are the same size, which is why 1/2 is greater than 2/5.</p></> }}
  />;
}
