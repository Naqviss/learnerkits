import { describe, expect, it } from "vitest";
import { apply, canApply, describeOp, equationLabel, imbalance, puzzles, solvedValue, startState, type BalanceState, type Op } from "@/lib/simulations/mathematicsLabs/balance";

const run = (s: BalanceState, ops: Op[]) => ops.reduce((state, op) => { expect(canApply(state, op).ok, describeOp(op)).toBe(true); return apply(state, op); }, s);

describe("equation balance scale", () => {
  it("starts every puzzle balanced at its hidden value", () => {
    for (const p of puzzles) {
      expect(imbalance(startState(p), p.x), p.label).toBe(0);
      expect(equationLabel(startState(p))).toBe(p.label);
    }
  });

  it("solves every puzzle in its stated fewest steps", () => {
    const routes: Op[][] = [
      [{ kind: "removeUnits", n: 3, target: "both" }, { kind: "divide", n: 2, target: "both" }],
      [{ kind: "removeUnits", n: 2, target: "both" }, { kind: "divide", n: 3, target: "both" }],
      [{ kind: "removeX", n: 1, target: "both" }, { kind: "removeUnits", n: 1, target: "both" }, { kind: "divide", n: 2, target: "both" }],
      [{ kind: "removeX", n: 2, target: "both" }, { kind: "removeUnits", n: 2, target: "both" }, { kind: "divide", n: 3, target: "both" }],
      [{ kind: "removeX", n: 1, target: "both" }, { kind: "removeUnits", n: 6, target: "both" }, { kind: "divide", n: 3, target: "both" }],
    ];
    puzzles.forEach((p, i) => {
      expect(routes[i]).toHaveLength(p.minSteps);
      const end = run(startState(p), routes[i]);
      expect(solvedValue(end, p.x), p.label).toBe(p.x);
    });
  });

  it("tips the scale when only one side changes and rebalances when the other catches up", () => {
    const p = puzzles[0];
    const tipped = apply(startState(p), { kind: "removeUnits", n: 3, target: "left" });
    expect(imbalance(tipped, p.x)).toBe(-3);
    const back = apply(tipped, { kind: "removeUnits", n: 3, target: "right" });
    expect(imbalance(back, p.x)).toBe(0);
    expect(equationLabel(back)).toBe("2x = 8");
  });

  it("refuses impossible removals and uneven divisions", () => {
    const s = startState(puzzles[0]);
    expect(canApply(s, { kind: "removeUnits", n: 4, target: "both" }).ok).toBe(false);
    expect(canApply(s, { kind: "removeX", n: 1, target: "right" }).ok).toBe(false);
    const divide = canApply(s, { kind: "divide", n: 2, target: "both" });
    expect(divide.ok).toBe(false);
    if (!divide.ok) expect(divide.reason).toContain("can’t be split into 2 equal groups");
    expect(canApply(s, { kind: "divide", n: 1, target: "both" }).ok).toBe(false);
  });

  it("does not call an unbalanced isolated x a solution", () => {
    const p = puzzles[0];
    const wrong: BalanceState = { left: { x: 1, u: 0 }, right: { x: 0, u: 7 } };
    expect(solvedValue(wrong, p.x)).toBeNull();
    expect(solvedValue({ left: { x: 0, u: 4 }, right: { x: 1, u: 0 } }, 4)).toBe(4);
  });

  it("describes steps in words", () => {
    expect(describeOp({ kind: "removeX", n: 1, target: "both" })).toBe("− x on both sides");
    expect(describeOp({ kind: "removeUnits", n: 3, target: "left" })).toBe("− 3 units on the left only");
    expect(describeOp({ kind: "divide", n: 2, target: "both" })).toBe("÷ 2 on both sides");
  });
});
