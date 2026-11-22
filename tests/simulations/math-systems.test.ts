import { describe, expect, it } from "vitest";
import { gymStory, lineLabel, solveSystem } from "@/lib/simulations/mathematicsLabs/systems";

describe("systems of equations lab", () => {
  it("finds the single crossing point of lines with different slopes", () => {
    expect(solveSystem({ m: 1, b: 1 }, { m: -1, b: 5 })).toEqual({ kind: "one", x: 2, y: 3 });
  });
  it("tells parallel lines from identical lines", () => {
    expect(solveSystem({ m: 2, b: 1 }, { m: 2, b: -3 })).toEqual({ kind: "none" });
    expect(solveSystem({ m: 2, b: 1 }, { m: 2, b: 1 })).toEqual({ kind: "infinite" });
  });
  it("solves the gym story at 4 visits and $40", () => {
    expect(solveSystem(gymStory.a, gymStory.b)).toEqual({ kind: "one", x: 4, y: 4 });
  });
  it("writes tidy equations", () => {
    expect(lineLabel({ m: 2, b: -3 })).toBe("y = 2x − 3");
    expect(lineLabel({ m: -1, b: 0 })).toBe("y = −x");
    expect(lineLabel({ m: 0, b: 4 })).toBe("y = 4");
    expect(lineLabel({ m: 0.5, b: 2 })).toBe("y = 0.5x + 2");
    expect(lineLabel({ m: 0, b: 0 })).toBe("y = 0");
  });
});
