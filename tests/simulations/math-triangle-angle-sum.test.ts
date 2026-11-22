import { describe, expect, it } from "vitest";
import { angleType, exteriorAtC, isTriangle, roundAngles, sideType, triangleAngles } from "@/lib/simulations/mathematicsLabs/triangles";

const A = { x: 2, y: 1 }, B = { x: 10, y: 1 }, C = { x: 5, y: 7 };

describe("triangle angle sum lab", () => {
  it("always gives interior angles that add up to 180°", () => {
    const shapes = [[A, B, C], [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }], [{ x: 0, y: 0 }, { x: 12, y: 0.5 }, { x: 1, y: 1 }]];
    for (const [a, b, c] of shapes) {
      const t = triangleAngles(a, b, c);
      expect(t.A + t.B + t.C).toBeCloseTo(180, 9);
    }
  });
  it("matches the starting triangle's angles", () => {
    const t = triangleAngles(A, B, C);
    expect(t.A).toBeCloseTo(63.435, 3);
    expect(t.B).toBeCloseTo(50.194, 3);
    expect(t.C).toBeCloseTo(66.371, 3);
  });
  it("rounds to whole degrees that still sum to exactly 180", () => {
    expect(roundAngles({ A: 60.4, B: 59.9, C: 59.7 })).toEqual({ A: 60, B: 60, C: 60 });
    expect(roundAngles({ A: 60.4, B: 60.4, C: 59.2 })).toEqual({ A: 61, B: 60, C: 59 });
    expect(roundAngles({ A: 33.6, B: 33.6, C: 112.8 })).toEqual({ A: 34, B: 33, C: 113 });
    const r = roundAngles(triangleAngles(A, B, C));
    expect(r.A + r.B + r.C).toBe(180);
    // 63.43° + 50.19° + 66.37°: one label must round up, and ∠A is the closest to rounding up.
    expect(r).toEqual({ A: 64, B: 50, C: 66 });
  });
  it("classifies by angles and sides", () => {
    const right = triangleAngles({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
    expect(angleType(right)).toBe("right");
    expect(right.A).toBeCloseTo(90, 9);
    expect(angleType(triangleAngles({ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 1, y: 1 }))).toBe("obtuse");
    expect(angleType(triangleAngles(A, B, C))).toBe("acute");
    expect(sideType({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 2, y: 3 })).toBe("isosceles");
    expect(sideType(A, B, C)).toBe("scalene");
    expect(sideType({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: Math.sqrt(3) })).toBe("equilateral");
  });
  it("makes the exterior angle at C equal ∠A + ∠B", () => {
    const t = triangleAngles(A, B, C);
    expect(exteriorAtC(t)).toBeCloseTo(t.A + t.B, 9);
  });
  it("rejects flat triangles", () => {
    expect(isTriangle({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 })).toBe(false);
    expect(isTriangle(A, B, C)).toBe(true);
  });
});
