"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { axisMax, crossover, doublingMarks, doublingTime, exponentialValue, linearStartsAhead, linearValue, money, moneyShort, niceStep, ruleOf72 } from "@/lib/simulations/mathematicsLabs/growth";
import { ActionButton, MathLabShell, Slider } from "./MathLabShell";
import lab from "./mathLab.module.css";
import { colors, Handle, makePlot, PlotClip, px, py, Stage, unpx, useDrag } from "./svg";

const box = { left: 82, right: 588, top: 62, bottom: 372 };
const PLAY_SECONDS = 6;

export default function ExponentialGrowthLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const [start, setStart] = useState(500);
  const [deposit, setDeposit] = useState(50);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(20);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seen, setSeen] = useState({ overtake: false, seven: false, eight: false, played: false });

  const r = rate / 100;
  const L = (t: number) => linearValue(start, deposit, t);
  const E = (t: number) => exponentialValue(start, r, t);
  const year = Math.min(years, Math.floor(cursor + 1e-9));

  // Keep the cursor on the graph when the number of years shrinks.
  useEffect(() => { setCursor((c) => Math.min(c, years)); }, [years]);

  // Timeline animation: the cursor sweeps the whole range in about six seconds.
  const yearsRef = useRef(years);
  yearsRef.current = years;
  useEffect(() => {
    if (!playing) return;
    let last = performance.now(), id = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      let finished = false;
      setCursor((c) => {
        const next = Math.min(yearsRef.current, c + (dt * yearsRef.current) / PLAY_SECONDS);
        finished = next >= yearsRef.current;
        return next;
      });
      if (finished) { setPlaying(false); setSeen((s) => ({ ...s, played: true })); return; }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  const cross = crossover(start, deposit, r, 1000);
  const startsAhead = linearStartsAhead(start, deposit, r);
  const overtakesInView = !!cross && cross.year <= years;
  const reachesEight = E(years) >= 8 * start - 1e-9;

  useEffect(() => {
    setSeen((s) => ({
      overtake: s.overtake || overtakesInView,
      seven: s.seven || rate === 7,
      eight: s.eight || reachesEight,
      played: s.played,
    }));
  }, [overtakesInView, rate, reachesEight]);

  // The y-axis is fixed by the largest balance in the range, so it does not jump during playback.
  const { top, step } = axisMax(Math.max(L(years), E(years)));
  const plot = useMemo(() => makePlot(0, years, 0, top, box), [years, top]);
  const xStep = years <= 10 ? 1 : years <= 25 ? 5 : 10;

  const drag = useDrag<"cursor">(useCallback((_id, sx) => {
    setPlaying(false);
    setCursor(Math.max(0, Math.min(years, Math.round(unpx(plot, sx)))));
  }, [plot, years]));

  const curve = (f: (t: number) => number, to: number) => {
    const n = 160, pts: string[] = [];
    for (let i = 0; i <= n; i++) { const t = (to * i) / n; pts.push(`${px(plot, t).toFixed(1)},${py(plot, f(t)).toFixed(1)}`); }
    return `M${pts.join("L")}`;
  };

  const marks = doublingMarks(start, r, years).filter((m) => m.value <= top);
  const multiples = [1, ...marks.map((m) => m.multiple)];
  const dbl = doublingTime(r);
  const dotR = years > 30 ? 2.5 : 3.5;
  const wholeYears = Array.from({ length: year + 1 }, (_, t) => t);

  const message = overtakesInView ? null
    : !startsAhead ? "Plan E is level or ahead from year 1: a·r ≥ the deposit"
      : cross ? `Plan E catches up in year ${cross.year}: show more years or raise the rate`
        : "Plan E needs more than 1,000 years to catch up";

  const stage = <Stage label="Balances of a linear and an exponential savings plan over time" svgRef={drag.svgRef} onPointerMove={drag.move} onPointerUp={drag.end}>
    {/* Axes and round ticks */}
    {Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).map((v) => <g key={`y${v}`}>
      <line x1={plot.left} x2={plot.right} y1={py(plot, v)} y2={py(plot, v)} stroke={colors.grid} />
      <text x={plot.left - 8} y={py(plot, v) + 4} textAnchor="end">{moneyShort(v)}</text>
    </g>)}
    {Array.from({ length: Math.floor(years / xStep) + 1 }, (_, i) => i * xStep).map((t) => <g key={`x${t}`}>
      <line x1={px(plot, t)} x2={px(plot, t)} y1={plot.top} y2={plot.bottom} stroke={colors.grid} />
      <text x={px(plot, t)} y={plot.bottom + 18} textAnchor="middle">{t}</text>
    </g>)}
    <line x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} stroke={colors.axis} strokeWidth="1.5" />
    <line x1={plot.left} x2={plot.left} y1={plot.top} y2={plot.bottom} stroke={colors.axis} strokeWidth="1.5" />
    <text x={(plot.left + plot.right) / 2} y={plot.bottom + 40} textAnchor="middle" fontSize="14">Years</text>
    <text x="18" y={(plot.top + plot.bottom) / 2} textAnchor="middle" fontSize="14" transform={`rotate(-90 18 ${(plot.top + plot.bottom) / 2})`}>Balance</text>

    {/* Doubling levels: start, 2×, 4×, 8× … The markers on Plan E land at equal time intervals. */}
    {multiples.map((m) => <g key={`m${m}`}>
      <line x1={plot.left} x2={plot.right} y1={py(plot, start * m)} y2={py(plot, start * m)} stroke={colors.violet} strokeDasharray="5 6" opacity=".7" />
      <text x={plot.right + 6} y={py(plot, start * m) + 4} fill={colors.violet} fontSize="13" fontWeight="700">{m}×</text>
    </g>)}
    {marks.map((m, i) => {
      const prev = i === 0 ? 0 : marks[i - 1].t, gap = px(plot, m.t) - px(plot, prev);
      return <g key={`d${m.multiple}`}>
        <line x1={px(plot, m.t)} x2={px(plot, m.t)} y1={py(plot, m.value)} y2={plot.bottom} stroke={colors.violet} strokeDasharray="3 4" opacity=".75" />
        <circle cx={px(plot, m.t)} cy={py(plot, m.value)} r="6" fill={colors.violet} stroke="#18202b" strokeWidth="2" />
        {gap >= 46 && <text x={(px(plot, prev) + px(plot, m.t)) / 2} y={plot.bottom - 9} textAnchor="middle" fill={colors.violet} fontSize="13" fontWeight="700">{dbl.toFixed(1)} yr</text>}
      </g>;
    })}

    <PlotClip plot={{ ...plot, top: plot.top - 4 }} id="growth-clip">
      {/* Whole range faint, the part up to the cursor solid. */}
      <path d={curve(L, years)} stroke={colors.amber} strokeWidth="2" fill="none" opacity=".3" strokeDasharray="6 6" />
      <path d={curve(E, years)} stroke={colors.blue} strokeWidth="2" fill="none" opacity=".3" strokeDasharray="6 6" />
      <path d={curve(L, cursor)} stroke={colors.amber} strokeWidth="3.5" fill="none" />
      <path d={curve(E, cursor)} stroke={colors.blue} strokeWidth="3.5" fill="none" />
      {wholeYears.map((t) => <g key={`dot${t}`}>
        <circle cx={px(plot, t)} cy={py(plot, L(t))} r={dotR} fill={colors.amber} />
        <circle cx={px(plot, t)} cy={py(plot, E(t))} r={dotR} fill={colors.blue} />
      </g>)}
    </PlotClip>

    {/* Crossover: where Plan E pulls ahead of Plan L. */}
    {overtakesInView && cross && (() => {
      const cx = px(plot, cross.exact), cy = py(plot, E(cross.exact)), lx = Math.min(Math.max(cx, plot.left + 120), plot.right - 120);
      return <g>
        <circle cx={cx} cy={cy} r="9" fill="none" stroke={colors.green} strokeWidth="3" />
        <text x={lx} y={Math.max(plot.top + 16, cy - 30)} textAnchor="middle" fill={colors.green} fontSize="14" fontWeight="700">Plan E overtakes in year {cross.year}</text>
        <text x={lx} y={Math.max(plot.top + 32, cy - 14)} textAnchor="middle" fill={colors.green} fontSize="13">curves cross at about {cross.exact.toFixed(1)} years</text>
      </g>;
    })()}

    {/* Cursor with the two balances for the current year. */}
    <line x1={px(plot, cursor)} x2={px(plot, cursor)} y1={plot.top} y2={plot.bottom} stroke={colors.white} strokeWidth="1.5" opacity=".75" />
    <rect x={px(plot, cursor) - 14} y={plot.top} width="28" height={plot.bottom - plot.top} fill="transparent" style={{ cursor: "ew-resize" }} onPointerDown={drag.start("cursor")} />
    <Handle x={px(plot, cursor)} y={plot.bottom} color={colors.white} onPointerDown={drag.start("cursor")} label="Year cursor" />

    {/* Legend and status */}
    <text x={box.left} y="24" fill={colors.amber} fontSize="15" fontWeight="700">Plan L: + {money(deposit)} every year</text>
    <text x={box.left} y="45" fill={colors.blue} fontSize="15" fontWeight="700">Plan E: × {(1 + r).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")} every year ({rate}%)</text>
    <text x={plot.right} y="24" textAnchor="end" fill={colors.white} fontSize="15" fontWeight="700">Year {year}</text>
    {message && <text x={plot.right} y="45" textAnchor="end" fill={colors.pink} fontSize="13">{message}</text>}
  </Stage>;

  // Table: L changes by the same amount each year; E changes by the same factor.
  const rows = [0, 1, 2, 3].filter((t) => t <= years);
  if (year > 3) rows.push(year);
  const cell = { padding: "4px 10px", textAlign: "right" as const, fontVariantNumeric: "tabular-nums" as const };
  const table = <div className={lab.panel}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr style={{ color: colors.muted }}>
        <th style={{ ...cell, textAlign: "left" }}>Year</th>
        <th style={cell}>Plan L</th><th style={cell}>Change</th>
        <th style={cell}>Plan E</th><th style={cell}>Change</th>
      </tr></thead>
      <tbody>{rows.map((t, i) => {
        const gapRow = i > 0 && t - rows[i - 1] > 1;
        return <tr key={t} style={{ borderTop: gapRow ? "1px dashed #4a5a70" : undefined }}>
          <td style={{ ...cell, textAlign: "left" }}>{t}</td>
          <td style={{ ...cell, color: colors.amber }}>{money(L(t))}</td>
          <td style={{ ...cell, color: colors.amber }}>{t === 0 ? "—" : `+ ${money(deposit)}`}</td>
          <td style={{ ...cell, color: colors.blue }}>{money(E(t), 2)}</td>
          <td style={{ ...cell, color: colors.blue }}>{t === 0 ? "—" : `× ${(1 + r).toFixed(3)} (+ ${money(E(t) - E(t - 1), 2)})`}</td>
        </tr>;
      })}</tbody>
    </table>
  </div>;

  return <MathLabShell locale={locale} title={simulation.title} outcome={simulation.outcome} tag="EXPONENTIAL GROWTH"
    question="Plan L adds the same deposit every year; Plan E grows by the same percentage. Which one wins, and when?"
    status={playing ? "● TIMELINE RUNNING" : undefined}
    metrics={[[`Plan L · year ${year}`, money(L(year))], [`Plan E · year ${year}`, money(E(year))], ["Doubling time", `${dbl.toFixed(1)} yr (72 ÷ ${rate} ≈ ${ruleOf72(r).toFixed(1)})`]]}
    stage={stage} below={table}
    caption="Both plans start with the same amount and are paid once a year; the dots are the year-end balances. Drag the white handle or use Year to move through time. Violet lines mark 2×, 4× and 8× the start."
    controls={<>
      <Slider label="Starting amount" value={start} min={100} max={1000} step={50} unit="$" onChange={setStart} />
      <Slider label="Yearly deposit (Plan L)" value={deposit} min={10} max={200} step={10} unit="$" onChange={setDeposit} />
      <Slider label="Growth rate (Plan E)" value={rate} min={1} max={20} step={0.5} unit="%" onChange={setRate} />
      <Slider label="Years shown" value={years} min={5} max={50} step={1} onChange={setYears} />
      <Slider label="Year" value={year} min={0} max={years} step={1} onChange={(v) => { setPlaying(false); setCursor(v); }} />
      <ActionButton onClick={() => { if (playing) { setPlaying(false); return; } if (cursor >= years) setCursor(0); setPlaying(true); }}>
        {playing ? "Ⅱ Pause timeline" : cursor >= years ? "↻ Replay timeline" : "▶ Play timeline"}
      </ActionButton>
    </>}
    checks={[
      { label: "Find settings where Plan L starts ahead but Plan E overtakes within the years shown.", done: seen.overtake },
      { label: "Set the growth rate to 7% and read the doubling time: about 10 years.", done: seen.seven },
      { label: "Make Plan E reach at least 8 times the starting amount (three doublings) within the years shown.", done: seen.eight },
      { label: "Play the timeline all the way to the end.", done: seen.played },
    ]}
    insight={{ title: "adding vs multiplying", body: <>
      <p>Linear growth adds the same amount every step, so its graph is a straight line with equal differences. Exponential growth multiplies by the same factor every step, so each year’s increase is bigger than the last.</p>
      <p>Because the factor never changes, the time to double never changes either: the violet markers are equally spaced. That steady doubling is why exponential growth eventually overtakes any linear growth, however large the deposit.</p>
    </> }}
  />;
}
