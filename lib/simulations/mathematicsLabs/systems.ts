// Two lines in slope-intercept form, y = m x + b, and how they meet.
export type Line = { m: number; b: number };
export type SystemSolution = { kind: "one"; x: number; y: number } | { kind: "none" } | { kind: "infinite" };

const near = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) <= tol;

export function solveSystem(l1: Line, l2: Line): SystemSolution {
  if (near(l1.m, l2.m)) return near(l1.b, l2.b) ? { kind: "infinite" } : { kind: "none" };
  const x = (l2.b - l1.b) / (l1.m - l2.m);
  return { kind: "one", x, y: l1.m * x + l1.b };
}

/** "y = 2x − 3" with tidy signs and no "1x" or "+ 0". */
export function lineLabel({ m, b }: Line, y = "y") {
  const num = (n: number) => (Number.isInteger(n) ? String(Math.abs(n)) : Math.abs(n).toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
  const slope = m === 0 ? "" : `${m < 0 ? "−" : ""}${Math.abs(m) === 1 ? "" : num(m)}x`;
  const intercept = b === 0 ? (m === 0 ? "0" : "") : `${slope ? (b < 0 ? " − " : " + ") : b < 0 ? "−" : ""}${num(b)}`;
  return `${y} = ${slope}${intercept}`;
}

/** Story preset: gym A costs $20 to join plus $5 a visit; gym B costs $10 a visit. Units: $10 per grid step. */
export const gymStory = { a: { m: 0.5, b: 2 }, b: { m: 1, b: 0 } };
