// Linear equations as a two-pan balance. Each pan holds x-boxes (each weighing the hidden value x)
// and unit weights. An operation applied to both pans keeps the balance; to one pan, it tips it.
export type Side = { x: number; u: number };
export type BalanceState = { left: Side; right: Side };
export type OpKind = "removeUnits" | "removeX" | "addUnits" | "divide";
export type Target = "both" | "left" | "right";
export type Op = { kind: OpKind; n: number; target: Target };
export type Puzzle = { label: string; left: Side; right: Side; x: number; minSteps: number };

/** Most unit weights one pan can hold (keeps the drawing readable). */
export const maxUnits = 24;

export const puzzles: Puzzle[] = [
  { label: "2x + 3 = 11", left: { x: 2, u: 3 }, right: { x: 0, u: 11 }, x: 4, minSteps: 2 },
  { label: "3x + 2 = 14", left: { x: 3, u: 2 }, right: { x: 0, u: 14 }, x: 4, minSteps: 2 },
  { label: "3x + 1 = x + 9", left: { x: 3, u: 1 }, right: { x: 1, u: 9 }, x: 4, minSteps: 3 },
  { label: "5x + 2 = 2x + 11", left: { x: 5, u: 2 }, right: { x: 2, u: 11 }, x: 3, minSteps: 3 },
  { label: "4x + 6 = x + 15", left: { x: 4, u: 6 }, right: { x: 1, u: 15 }, x: 3, minSteps: 3 },
];

export const startState = (p: Puzzle): BalanceState => ({ left: { ...p.left }, right: { ...p.right } });
export const weight = (s: Side, x: number) => s.x * x + s.u;

export function sideLabel({ x, u }: Side) {
  const parts: string[] = [];
  if (x > 0) parts.push(x === 1 ? "x" : `${x}x`);
  if (u > 0) parts.push(String(u));
  return parts.join(" + ") || "0";
}
export const equationLabel = (s: BalanceState) => `${sideLabel(s.left)} = ${sideLabel(s.right)}`;

/** Positive when the left pan is heavier. */
export const imbalance = (s: BalanceState, x: number) => weight(s.left, x) - weight(s.right, x);

const sides = (t: Target): ("left" | "right")[] => (t === "both" ? ["left", "right"] : [t]);
const sideName = (k: "left" | "right") => (k === "left" ? "Left pan" : "Right pan");

export function canApply(s: BalanceState, op: Op): { ok: true } | { ok: false; reason: string } {
  if (op.n < 1) return { ok: false, reason: "Choose an amount of at least 1." };
  for (const k of sides(op.target)) {
    const side = s[k];
    if (op.kind === "removeUnits" && side.u < op.n) return { ok: false, reason: `${sideName(k)} has only ${side.u} unit ${side.u === 1 ? "weight" : "weights"}.` };
    if (op.kind === "removeX" && side.x < op.n) return { ok: false, reason: `${sideName(k)} has only ${side.x} x-${side.x === 1 ? "box" : "boxes"}.` };
    if (op.kind === "addUnits" && side.u + op.n > maxUnits) return { ok: false, reason: `A pan holds at most ${maxUnits} unit weights.` };
    if (op.kind === "divide") {
      if (op.n < 2) return { ok: false, reason: "Dividing needs an amount of 2 or more." };
      if (side.x % op.n !== 0 || side.u % op.n !== 0) return { ok: false, reason: `${sideName(k)}: ${sideLabel(side)} can’t be split into ${op.n} equal groups.` };
    }
  }
  return { ok: true };
}

export function apply(s: BalanceState, op: Op): BalanceState {
  const next: BalanceState = { left: { ...s.left }, right: { ...s.right } };
  for (const k of sides(op.target)) {
    const side = next[k];
    if (op.kind === "removeUnits") side.u -= op.n;
    if (op.kind === "removeX") side.x -= op.n;
    if (op.kind === "addUnits") side.u += op.n;
    if (op.kind === "divide") { side.x /= op.n; side.u /= op.n; }
  }
  return next;
}

/** "− 3 units on both sides" or "÷ 2 on the left only". */
export function describeOp(op: Op) {
  const where = op.target === "both" ? "on both sides" : `on the ${op.target} only`;
  if (op.kind === "removeUnits") return `− ${op.n} ${op.n === 1 ? "unit" : "units"} ${where}`;
  if (op.kind === "addUnits") return `+ ${op.n} ${op.n === 1 ? "unit" : "units"} ${where}`;
  if (op.kind === "removeX") return `− ${op.n === 1 ? "" : op.n}x ${where}`;
  return `÷ ${op.n} ${where}`;
}

/** The value of x when the scale is balanced and one pan holds a single x-box and nothing else holds an x. */
export function solvedValue(s: BalanceState, x: number): number | null {
  if (imbalance(s, x) !== 0) return null;
  if (s.left.x === 1 && s.left.u === 0 && s.right.x === 0) return s.right.u;
  if (s.right.x === 1 && s.right.u === 0 && s.left.x === 0) return s.left.u;
  return null;
}
