import { describe, expect, it } from "vitest";
import { area, circumference, ratio, sectorPoses, stripWidth } from "@/lib/simulations/mathematicsLabs/circle";

describe("circle area and pi lab", () => {
  it("keeps C ÷ d equal to π for every radius", () => {
    for (const r of [1, 1.5, 2.5, 4]) expect(ratio(r)).toBeCloseTo(Math.PI, 12);
    expect(circumference(2)).toBeCloseTo(12.566, 3);
    expect(area(3)).toBeCloseTo(28.274, 3);
  });
  it("quadruples the area when the radius doubles", () => {
    expect(area(4) / area(2)).toBeCloseTo(4, 12);
    expect(area(3) / area(1.5)).toBeCloseTo(4, 12);
  });
  it("starts every sector at the center, pointing along its own bisector", () => {
    const n = 8, poses = sectorPoses(n, 0);
    poses.forEach((p, i) => { expect(p.x).toBe(0); expect(p.y).toBe(0); expect(p.angle).toBeCloseTo((i + 0.5) * (2 * Math.PI / n)); });
  });
  it("ends as a strip about π wide and one radius high with alternating rows", () => {
    const n = 24, poses = sectorPoses(n, 1), half = Math.PI / n;
    const left = Math.min(...poses.map((p) => p.x - half)), right = Math.max(...poses.map((p) => p.x + half));
    expect(right - left).toBeCloseTo(stripWidth(n), 9);
    expect(left).toBeCloseTo(-right, 9);
    expect(poses.filter((p) => p.half === "top").every((p) => p.y === -0.5 && Math.abs(p.angle - Math.PI / 2) < 1e-12)).toBe(true);
    expect(poses.filter((p) => p.half === "bottom").every((p) => p.y === 0.5 && Math.abs(p.angle - 1.5 * Math.PI) < 1e-12)).toBe(true);
  });
  it("places neighbouring apexes half a sector apart so the rows interleave", () => {
    const n = 12, step = 2 * Math.PI / n;
    const xs = sectorPoses(n, 1).map((p) => p.x).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBeCloseTo(step / 2, 9);
  });
});
