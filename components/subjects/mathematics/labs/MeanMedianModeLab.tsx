"use client";
import { useCallback, useState } from "react";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { deviationTotals, hasHighOutlier, mean, median, modes, presets, range, statMax, statMin, type PresetKey } from "@/lib/simulations/mathematicsLabs/statistics";
import { ActionButton, MathLabShell, Segmented } from "./MathLabShell";
import lab from "./mathLab.module.css";
import { colors, fmt, makePlot, px, Stage, unpx, useDrag } from "./svg";

const plot = makePlot(statMin, statMax, 0, 1, { left: 45, right: 605, top: 100, bottom: 300 });
const lineY = 300, dotR = 11, minValues = 3, maxValues = 15;
const presetLabels: Record<PresetKey, string> = { quiz: "Quiz scores", outlier: "With an outlier", symmetric: "Symmetric" };
const clampValue = (v: number) => Math.max(statMin, Math.min(statMax, Math.round(v)));
const show = (n: number) => (Number.isInteger(n) ? String(n) : fmt(n, Math.abs(n * 2 - Math.round(n * 2)) < 1e-9 ? 1 : 2));

export default function MeanMedianModeLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const [preset, setPreset] = useState<PresetKey>("quiz");
  const [values, setValues] = useState<number[]>([...presets.quiz]);
  const [distances, setDistances] = useState<"on" | "off">("on");
  const [seen, setSeen] = useState({ outlier: false, equal: false, twoModes: false, ten: false });

  // Checks count only changes the student makes, not a freshly loaded preset.
  const evaluate = useCallback((next: number[], draggedValue?: number) => {
    const m = mean(next), md = median(next);
    setSeen((old) => ({
      outlier: old.outlier || (draggedValue !== undefined && draggedValue >= 18 && hasHighOutlier(next)),
      equal: old.equal || (next.length >= 5 && Math.abs(m - md) < 1e-9),
      twoModes: old.twoModes || modes(next).length === 2,
      ten: old.ten || Math.abs(m - 10) < 1e-9,
    }));
  }, []);

  const drag = useDrag<string>(useCallback((id, sx) => {
    const index = Number(id.slice(1)), v = clampValue(unpx(plot, sx));
    setValues((prev) => {
      if (prev[index] === v) return prev;
      const next = prev.map((old, i) => (i === index ? v : old));
      evaluate(next, v);
      return next;
    });
  }, [evaluate]));

  function change(next: number[]) { setValues(next); evaluate(next); }
  function loadPreset(key: PresetKey) { setPreset(key); setValues([...presets[key]]); }

  const m = mean(values), md = median(values), mo = modes(values), totals = deviationTotals(values);
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const tallest = Math.max(1, ...counts.values()), spacing = Math.min(23, 170 / Math.max(1, tallest - 1));

  // Stack height of each dot, and which dots sit in the middle once the data are sorted.
  const stackIndex = values.map((v, i) => values.slice(0, i).filter((w) => w === v).length);
  const dotY = (i: number) => lineY - 15 - stackIndex[i] * spacing;
  const order = values.map((_, i) => i).sort((a, b) => values[a] - values[b] || stackIndex[a] - stackIndex[b]);
  const half = Math.floor(values.length / 2);
  const middle = new Set(values.length % 2 ? [order[half]] : [order[half - 1], order[half]]);
  const meanX = px(plot, m), medianX = px(plot, md);

  const stage = <Stage label={`Dot plot of ${values.length} values with mean ${fmt(m)} and median ${show(md)}`} svgRef={drag.svgRef} onPointerMove={drag.move} onPointerUp={drag.end}>
    <text x="45" y="36" fontSize="13">Drag any dot along the line · {values.length} values</text>
    {mo.map((v) => {
      const top = lineY - 15 - (tallest - 1) * spacing - 14;
      return <g key={`mode${v}`}><rect x={px(plot, v) - 16} y={top} width="32" height={lineY - top - 1} rx="10" fill="rgba(198,168,245,.14)" stroke={colors.violet} strokeWidth="1.5" /><text x={px(plot, v)} y={top - 6} textAnchor="middle" fill={colors.violet} fontSize="13" fontWeight="700">mode</text></g>;
    })}
    <line x1={medianX} x2={medianX} y1="84" y2={lineY} stroke={colors.white} strokeWidth="2" strokeDasharray="6 5" />
    <text x={medianX + (meanX <= medianX ? 6 : -6)} y="78" textAnchor={meanX <= medianX ? "start" : "end"} fill={colors.white} fontSize="14" fontWeight="700">median {show(md)}</text>
    <line x1={meanX} x2={meanX} y1="108" y2={lineY} stroke={colors.amber} strokeWidth="2.5" />
    <text x={meanX + (meanX <= medianX ? -6 : 6)} y="102" textAnchor={meanX <= medianX ? "end" : "start"} fill={colors.amber} fontSize="14" fontWeight="700">mean {fmt(m)}</text>
    {distances === "on" && values.map((v, i) => v === m ? null : <line key={`dev${i}`} x1={px(plot, v)} x2={meanX} y1={dotY(i)} y2={dotY(i)} stroke={v < m ? colors.pink : colors.green} strokeWidth="3" opacity=".75" />)}
    <line x1={plot.left - 10} x2={plot.right + 10} y1={lineY} y2={lineY} stroke={colors.axis} strokeWidth="4" strokeLinecap="round" />
    {Array.from({ length: statMax - statMin + 1 }, (_, k) => statMin + k).map((t) => <g key={`t${t}`}><line x1={px(plot, t)} x2={px(plot, t)} y1={lineY} y2={lineY + 7} stroke={colors.axis} /><text x={px(plot, t)} y={lineY + 46} textAnchor="middle" fontSize="13">{t}</text></g>)}
    <path d={`M${meanX} ${lineY + 3}L${meanX - 15} ${lineY + 30}H${meanX + 15}Z`} fill={colors.amber} />
    {values.map((v, i) => <g key={`dot${i}`} style={{ cursor: "grab" }} onPointerDown={drag.start(`d${i}`)} role="slider" aria-label={`Value ${i + 1}`} aria-valuenow={v} aria-valuemin={statMin} aria-valuemax={statMax}>
      <circle cx={px(plot, v)} cy={dotY(i)} r="16" fill="transparent" />
      <circle cx={px(plot, v)} cy={dotY(i)} r={dotR} fill={colors.blue} stroke={middle.has(i) ? colors.white : "#1b2a40"} strokeWidth={middle.has(i) ? 3.5 : 2} />
    </g>)}
    {distances === "on" && <text x="325" y="388" textAnchor="middle" fontSize="15" fontWeight="700"><tspan fill={colors.pink}>distances below the mean {fmt(totals.left, 1)}</tspan><tspan fill={colors.white}>  =  </tspan><tspan fill={colors.green}>distances above {fmt(totals.right, 1)}</tspan></text>}
    <text x="325" y="420" textAnchor="middle" fontSize="13">The amber triangle is the balance point. White-ringed dots are the middle values.</text>
  </Stage>;

  const sorted = [...values].sort((a, b) => a - b);
  const below = <div className={lab.panel}>
    <span>Sorted: <b>{sorted.join(", ")}</b></span>
    <span>Range = {sorted[sorted.length - 1]} − {sorted[0]} = <b>{range(values)}</b></span>
    <span>Mean − median = <b>{fmt(m - md)}</b></span>
  </div>;

  return <MathLabShell locale={locale} title={simulation.title} outcome={simulation.outcome} tag="CENTER OF DATA"
    question="Which middle value moves when one number in the data changes a lot?"
    metrics={[["Mean", fmt(m)], ["Median", show(md)], ["Mode", mo.length ? mo.join(", ") : "No mode"]]}
    stage={stage} below={below}
    caption="Values are whole numbers from 0 to 20. Stacked dots share a value. The mean is the sum divided by the count; the median is the middle of the sorted list."
    controls={<>
      <Segmented label="Data set" value={preset} options={(Object.keys(presetLabels) as PresetKey[]).map((key) => ({ value: key, label: presetLabels[key] }))} onChange={loadPreset} />
      <Segmented label="Distances to the mean" value={distances} options={[{ value: "on", label: "Show" }, { value: "off", label: "Hide" }]} onChange={setDistances} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 8 }}>
        <ActionButton onClick={() => change([...values, 10])} disabled={values.length >= maxValues}>+ Add a value (at 10)</ActionButton>
        <ActionButton onClick={() => change(values.slice(0, -1))} disabled={values.length <= minValues}>− Remove a value</ActionButton>
      </div>
    </>}
    checks={[
      { label: "Drag one value to 18 or more, far from the rest, and watch the mean move away from the median.", done: seen.outlier },
      { label: "Make the mean equal the median with at least 5 values.", done: seen.equal },
      { label: "Make a data set with exactly two modes.", done: seen.twoModes },
      { label: "Make the mean exactly 10.", done: seen.ten },
    ]}
    insight={{ title: "three kinds of middle", body: <><p>The mean is the balance point of the data: the distances of the values below it always add up to the same total as the distances above it.</p><p>The median is the middle value of the sorted list. Dragging the largest value much higher pulls the mean along but leaves the median where it was, which is why medians describe data with outliers, such as house prices, more fairly.</p><p>The mode is the most common value. A data set can have one mode, several, or none at all.</p></> }}
  />;
}
