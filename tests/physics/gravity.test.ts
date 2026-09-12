import { describe, expect, it } from "vitest";
import { EARTH_MU, EARTH_RADIUS, MOON_GRAVITY } from "@/lib/physics/constants";
import { circularOrbitalVelocity, escapeVelocity, gravitationalAcceleration } from "@/lib/physics/gravity";

describe("gravity", () => {
  it("keeps lunar surface gravity at approximately 1.62 m/s²", () => { expect(MOON_GRAVITY).toBeCloseTo(1.62, 5); });
  it("computes Earth surface gravity from Newtonian gravity", () => {
    const a = gravitationalAcceleration({ x: EARTH_RADIUS, y: 0 });
    expect(Math.hypot(a.x, a.y)).toBeCloseTo(EARTH_MU / (EARTH_RADIUS ** 2), 7);
  });
  it("computes circular orbital velocity", () => {
    const r = EARTH_RADIUS + 400_000;
    expect(circularOrbitalVelocity(r)).toBeCloseTo(Math.sqrt(EARTH_MU / r), 8);
  });
  it("computes escape velocity", () => {
    const r = EARTH_RADIUS + 400_000;
    expect(escapeVelocity(r)).toBeCloseTo(Math.sqrt(2 * EARTH_MU / r), 8);
  });
});
