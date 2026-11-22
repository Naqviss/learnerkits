"use client";
import { useEffect, useRef, useState } from "react";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { apply, canApply, describeOp, equationLabel, imbalance, puzzles, solvedValue, startState, weight, type BalanceState, type Op, type OpKind, type Side, type Target } from "@/lib/simulations/mathematicsLabs/balance";
import { ActionButton, MathLabShell, Segmented, Stepper } from "./MathLabShell";
import styles from "../../chemistry/chemistry.module.css";
import lab from "./mathLab.module.css";
import { colors, Stage } from "./svg";

const pivot = { x: 325, y: 140 }, arm = 200, drop = 150, perRow = 7, gap = 25;
type Step = { op: Op; before: BalanceState; after: BalanceState };

/** Degrees to rotate the beam: negative (counterclockwise) when the left pan is heavier. */
function targetAngle(diff: number) {
  if (diff === 0) return 0;
  return -Math.sign(diff) * Math.min(16, 4 + Math.abs(diff) * 1.5);
}

/** Smoothly eases the drawn angle toward the target so the beam visibly swings. */
function useEasedAngle(target: number) {
  const [angle, setAngle] = useState(target), current = useRef(target);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const next = current.current + (target - current.current) * 0.14;
      current.current = Math.abs(target - next) < 0.05 ? target : next;
      setAngle(current.current);
      if (current.current !== target) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return angle;
}

/** Gold x-boxes first, then blue unit weights, stacked in rows of seven above the pan. */
function PanContents({ side, cx, top }: { side: Side; cx: number; top: number }) {
  const items = [...Array(side.x).fill("x"), ...Array(side.u).fill("1")] as ("x" | "1")[];
  return <g>{items.map((kind, i) => {
    const row = Math.floor(i / perRow), inRow = Math.min(perRow, items.length - row * perRow), col = i % perRow;
    const x = cx - ((inRow - 1) * gap) / 2 + col * gap, y = top - 13 - row * gap;
    return kind === "x"
      ? <g key={i}><rect x={x - 11} y={y - 11} width="22" height="22" rx="4" fill={colors.amber} stroke="#6b4a24" strokeWidth="1.5" /><text x={x} y={y + 5} textAnchor="middle" fill="#2a1d0e" fontSize="14" fontWeight="800" fontStyle="italic">x</text></g>
      : <g key={i}><circle cx={x} cy={y} r="10" fill={colors.blue} stroke="#2a4570" strokeWidth="1.5" /><text x={x} y={y + 4.5} textAnchor="middle" fill="#14243c" fontSize="12" fontWeight="800">1</text></g>;
  })}</g>;
}

function Pan({ side, end }: { side: Side; end: { x: number; y: number } }) {
  const top = end.y + drop;
  return <g>
    <path d={`M${end.x} ${end.y}L${end.x - 92} ${top}M${end.x} ${end.y}L${end.x + 92} ${top}`} stroke="#7d8ea8" strokeWidth="1.5" />
    <PanContents side={side} cx={end.x} top={top} />
    <path d={`M${end.x - 98} ${top}Q${end.x} ${top + 30} ${end.x + 98} ${top}Z`} fill="#56657d" stroke="#8fa0ba" strokeWidth="2" />
  </g>;
}

export default function AlgebraBalanceScaleLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = puzzles[puzzleIndex];
  const [state, setState] = useState<BalanceState>(() => startState(puzzles[0]));
  const [history, setHistory] = useState<Step[]>([]);
  const [amount, setAmount] = useState(1);
  const [target, setTarget] = useState<Target>("both");
  const [tipped, setTipped] = useState(false);
  const [seen, setSeen] = useState({ first: false, rebalanced: false, bothSides: false, fewest: false });

  const diff = imbalance(state, puzzle.x), value = solvedValue(state, puzzle.x);
  const angle = useEasedAngle(targetAngle(diff)), rad = (angle * Math.PI) / 180;
  const leftEnd = { x: pivot.x - arm * Math.cos(rad), y: pivot.y - arm * Math.sin(rad) };
  const rightEnd = { x: pivot.x + arm * Math.cos(rad), y: pivot.y + arm * Math.sin(rad) };

  function choosePuzzle(i: number) {
    setPuzzleIndex(i); setState(startState(puzzles[i])); setHistory([]); setTipped(false);
  }

  function run(kind: OpKind) {
    const op: Op = { kind, n: amount, target };
    if (!canApply(state, op).ok) return;
    const after = apply(state, op), nextHistory = [...history, { op, before: state, after }];
    const balanced = imbalance(after, puzzle.x) === 0, solved = solvedValue(after, puzzle.x) !== null;
    const wasTipped = tipped || !balanced;
    setState(after); setHistory(nextHistory); setTipped(wasTipped);
    setSeen((old) => ({
      first: old.first || (solved && puzzleIndex === 0),
      rebalanced: old.rebalanced || (tipped && balanced),
      bothSides: old.bothSides || (solved && puzzle.right.x > 0),
      fewest: old.fewest || (solved && nextHistory.length === puzzle.minSteps),
    }));
  }

  function undo() {
    const last = history[history.length - 1];
    if (!last) return;
    setState(last.before); setHistory(history.slice(0, -1));
  }

  const checkOf = (kind: OpKind) => canApply(state, { kind, n: amount, target });
  const divideCheck = checkOf("divide");
  const scale = diff === 0 ? "Balanced" : diff > 0 ? "Tilts left" : "Tilts right";
  const where = target === "both" ? "both sides" : `the ${target} side only`;

  const stage = <Stage label={`Balance scale showing ${equationLabel(state)}`}>
    <text x="325" y="50" textAnchor="middle" fill={diff === 0 ? colors.white : colors.pink} fontSize="28" fontWeight="700">{equationLabel(state).replace(" = ", diff === 0 ? " = " : " ≠ ")}</text>
    {value !== null && <g><rect x="250" y="66" width="150" height="34" rx="17" fill="#245c45" /><text x="325" y="89" textAnchor="middle" fill={colors.green} fontSize="17" fontWeight="800">x = {value} ✓</text></g>}
    {diff !== 0 && <text x="325" y="88" textAnchor="middle" fill={colors.pink} fontSize="14">Not balanced: the equation is no longer true</text>}
    <rect x={pivot.x - 6} y={pivot.y} width="12" height="262" fill="#6d7d96" />
    <path d={`M${pivot.x - 60} 412H${pivot.x + 60}L${pivot.x + 36} 396H${pivot.x - 36}Z`} fill="#6d7d96" />
    <Pan side={state.left} end={leftEnd} />
    <Pan side={state.right} end={rightEnd} />
    <line x1={leftEnd.x} y1={leftEnd.y} x2={rightEnd.x} y2={rightEnd.y} stroke="#c5d2e6" strokeWidth="8" strokeLinecap="round" />
    <path d={`M${pivot.x} ${pivot.y - 14}L${pivot.x - 13} ${pivot.y + 8}H${pivot.x + 13}Z`} fill={colors.amber} />
    <text x="30" y="430" fontSize="13">Each gold box weighs the same mystery number x. Each blue weight is 1.</text>
  </Stage>;

  const below = <div className={lab.panel}>
    {history.length === 0
      ? <span>Start: <b>{puzzle.label}</b>. Pick an amount and where to apply it, then press an operation.</span>
      : <ol style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 4 }}>{history.map((s, i) => <li key={i}>{describeOp(s.op)} → <b>{equationLabel(s.after)}</b>{imbalance(s.after, puzzle.x) !== 0 && " (tipped)"}</li>)}</ol>}
    {value !== null && <span>Check by substituting: {substitute(puzzle.left, puzzle.x)} = {weight(puzzle.left, puzzle.x)} and {substitute(puzzle.right, puzzle.x)} = {weight(puzzle.right, puzzle.x)}.</span>}
  </div>;

  return <MathLabShell locale={locale} title={simulation.title} outcome={simulation.outcome} tag="EQUATION BALANCE"
    question="What can you do to an equation without changing its answer?"
    status={value !== null ? "SOLVED" : diff === 0 ? "BALANCED" : "TIPPED"}
    metrics={[["Equation", equationLabel(state)], ["Steps", String(history.length)], ["Scale", scale]]}
    stage={stage} below={below}
    caption="The scale knows the hidden value of x and tips toward the heavier pan. Removing more than a pan holds, or splitting blocks unevenly, is not allowed."
    controls={<>
      <label className={styles.control}><span><b>Puzzle</b></span>
        <select value={puzzleIndex} onChange={(e) => choosePuzzle(Number(e.target.value))}>
          {puzzles.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
        </select>
      </label>
      <Segmented label="Apply to" value={target} options={[{ value: "both", label: "Both sides" }, { value: "left", label: "Left only" }, { value: "right", label: "Right only" }]} onChange={setTarget} />
      <Stepper label="Amount n" value={amount} min={1} max={12} onChange={setAmount} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 8 }}>
        <ActionButton onClick={() => run("removeUnits")} disabled={!checkOf("removeUnits").ok}>Remove {amount} {amount === 1 ? "unit" : "units"}</ActionButton>
        <ActionButton onClick={() => run("removeX")} disabled={!checkOf("removeX").ok}>Remove {amount} x-{amount === 1 ? "box" : "boxes"}</ActionButton>
        <ActionButton onClick={() => run("addUnits")} disabled={!checkOf("addUnits").ok}>Add {amount} {amount === 1 ? "unit" : "units"}</ActionButton>
        <ActionButton onClick={() => run("divide")} disabled={!divideCheck.ok}>Divide by {amount}</ActionButton>
      </div>
      <p style={{ margin: "10px 0 0", fontSize: ".8rem", color: "var(--muted)" }} aria-live="polite">
        {divideCheck.ok ? `Each operation applies to ${where}.` : `Divide by ${amount}: ${divideCheck.reason}`}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 8 }}>
        <ActionButton onClick={undo} disabled={!history.length}>↶ Undo</ActionButton>
        <ActionButton onClick={() => choosePuzzle(puzzleIndex)}>↺ Reset</ActionButton>
      </div>
    </>}
    checks={[
      { label: "Solve 2x + 3 = 11.", done: seen.first },
      { label: "Tip the scale by changing one side only, then get it balanced again.", done: seen.rebalanced },
      { label: "Solve a puzzle with x on both sides.", done: seen.bothSides },
      { label: "Solve any puzzle in the fewest steps: 2 when x is on one side, 3 when it is on both.", done: seen.fewest },
    ]}
    insight={{ title: "keep the scale balanced", body: <><p>An equation is a balanced scale: both sides weigh the same. Removing, adding or splitting the same amount on both sides keeps it balanced, so the equation stays true and its answer does not change.</p><p>To isolate x, undo what was done to it in reverse order. In 2x + 3 = 11, x was doubled and then 3 was added, so remove 3 from both sides first (2x = 8), then divide both sides by 2 (x = 4).</p><p>When x appears on both sides, first remove the smaller number of x-boxes from both pans so x is left on one side only.</p></> }}
  />;
}

function substitute(side: Side, x: number) {
  const parts: string[] = [];
  if (side.x > 0) parts.push(side.x === 1 ? `${x}` : `${side.x}(${x})`);
  if (side.u > 0) parts.push(String(side.u));
  return parts.join(" + ") || "0";
}
