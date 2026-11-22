import { describe, expect, it } from "vitest";
import { commonDenominator, compare, gcd, lcm, scaleFactor, simplify, value } from "@/lib/simulations/mathematicsLabs/fractions";

describe("fraction visualizer lab", () => {
  it("compares fractions exactly", () => {
    expect(compare({ n: 1, d: 3 }, { n: 2, d: 6 })).toBe(0);
    expect(compare({ n: 1, d: 2 }, { n: 2, d: 5 })).toBe(1);
    expect(compare({ n: 3, d: 4 }, { n: 7, d: 8 })).toBe(-1);
  });
  it("simplifies to lowest terms", () => {
    expect(simplify({ n: 6, d: 8 })).toEqual({ n: 3, d: 4 });
    expect(simplify({ n: 12, d: 12 })).toEqual({ n: 1, d: 1 });
    expect(simplify({ n: 0, d: 7 })).toEqual({ n: 0, d: 1 });
  });
  it("finds the whole-number scale factor between equivalent fractions", () => {
    expect(scaleFactor({ n: 1, d: 2 }, { n: 3, d: 6 })).toEqual({ to: "B", k: 3 });
    expect(scaleFactor({ n: 8, d: 12 }, { n: 2, d: 3 })).toEqual({ to: "A", k: 4 });
    expect(scaleFactor({ n: 2, d: 4 }, { n: 3, d: 6 })).toBeNull(); // equal, but neither is a multiple of the other
    expect(scaleFactor({ n: 1, d: 2 }, { n: 2, d: 6 })).toBeNull();
  });
  it("rewrites both fractions over the least common denominator", () => {
    expect(gcd(12, 8)).toBe(4);
    expect(lcm(4, 6)).toBe(12);
    expect(commonDenominator({ n: 3, d: 4 }, { n: 2, d: 3 })).toEqual({ d: 12, a: 9, b: 8 });
  });
  it("gives the decimal values quoted in the page content", () => {
    expect(value({ n: 3, d: 4 })).toBe(0.75);
    expect(value({ n: 5, d: 4 })).toBe(1.25);
    expect(value({ n: 2, d: 5 })).toBe(0.4);
  });
});
