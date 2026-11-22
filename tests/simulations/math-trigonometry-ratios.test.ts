import { describe, expect, it } from "vitest";
import { baseFor, ratios, rightTriangle, sidesFor, thetaAt } from "@/lib/simulations/mathematicsLabs/trig";

describe("trigonometry ratios lab", () => {
  it("builds the triangle from the angle and hypotenuse", () => {
    const t = rightTriangle(37, 5);
    expect(t.horizontal).toBeCloseTo(3.993, 3);
    expect(t.vertical).toBeCloseTo(3.009, 3);
    expect(t.horizontal ** 2 + t.vertical ** 2).toBeCloseTo(25, 9);
  });
  it("keeps the ratios the same when only the size changes", () => {
    const small = ratios(37, 2, "base"), large = ratios(37, 10, "base");
    expect(large.sin).toBeCloseTo(small.sin, 12);
    expect(large.cos).toBeCloseTo(small.cos, 12);
    expect(large.tan).toBeCloseTo(small.tan, 12);
  });
  it("matches the values quoted on the page", () => {
    expect(ratios(37, 5, "base").sin).toBeCloseTo(0.602, 3);
    expect(ratios(45, 6, "base").tan).toBeCloseTo(1, 12);
    expect(ratios(30, 8, "base").sin).toBeCloseTo(0.5, 12);
    expect(ratios(60, 8, "base").cos).toBeCloseTo(0.5, 12);
    expect(ratios(30, 8, "base").cos).toBeCloseTo(0.866, 3);
    expect(ratios(60, 8, "base").tan).toBeCloseTo(1.732, 3);
    expect(ratios(85, 5, "base").tan).toBeCloseTo(11.43, 2);
  });
  it("swaps opposite and adjacent when θ moves to the other acute corner", () => {
    const fromBase = sidesFor(37, 5, "base"), fromTop = sidesFor(37, 5, "top");
    expect(fromTop.opposite).toBeCloseTo(fromBase.adjacent, 12);
    expect(fromTop.adjacent).toBeCloseTo(fromBase.opposite, 12);
    expect(thetaAt(37, "top")).toBe(53);
    expect(baseFor(53, "top")).toBe(37);
    expect(ratios(37, 5, "top").sin).toBeCloseTo(ratios(37, 5, "base").cos, 12);
  });
});
