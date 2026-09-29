import { describe, expect, it } from "vitest";
import { eruptionExamples, eruptionVisuals, lavaFragment, volcanoHeight } from "@/components/subjects/geography/volcano/volcanoModel";

describe("volcanic scene", () => {
  it("offers contrasting investigations: a fluid lava flow and an ash-rich explosive eruption", () => {
    const fluid = eruptionVisuals(eruptionExamples.effusive, 10);
    const explosive = eruptionVisuals(eruptionExamples.explosive, 10);
    expect(fluid.style).toBe("Effusive");
    expect(explosive.style).toBe("Explosive");
    expect(fluid.flowReach).toBeGreaterThan(explosive.flowReach);
    expect(explosive.plumeHeight).toBeGreaterThan(fluid.plumeHeight);
    expect(explosive.ash).toBeGreaterThan(fluid.ash);
  });
  it("resets eruption effects and advances the lava front without reversing it", () => {
    for (const values of Object.values(eruptionExamples)) {
      const ready = eruptionVisuals(values, 0);
      expect(ready.active).toBe(0); expect(ready.flowReach).toBe(0); expect(ready.plumeHeight).toBe(0);
      let previous = 0;
      for (let time = 0; time <= 10; time += .1) {
        const state = eruptionVisuals(values, time);
        expect(state.flowReach).toBeGreaterThanOrEqual(previous);
        expect(state.flowReach).toBeLessThanOrEqual(1); previous = state.flowReach;
      }
    }
  });
  it("has an open summit basin, continuous rim, and lower surrounding terrain", () => {
    expect(volcanoHeight(0, 0)).toBeLessThan(volcanoHeight(1.25, 0));
    for (let angle = 0; angle < Math.PI * 2; angle += .2) {
      const height = (r: number) => volcanoHeight(Math.cos(angle) * r, Math.sin(angle) * r);
      expect(Math.abs(height(1.2499) - height(1.2501))).toBeLessThan(.005);
      expect(height(12)).toBeLessThan(height(4));
    }
  });
  it("keeps ballistic fragments repeatable, finite and above terrain when visible", () => {
    for (const gas of [0, 8]) for (const viscosity of [2, 7]) for (const time of [0, .5, 2, 6, 10]) for (let i = 0; i < 100; i++) {
      const values = { gas, viscosity }, fragment = lavaFragment(i, time, values);
      expect(fragment).toEqual(lavaFragment(i, time, values));
      expect([fragment.x, fragment.y, fragment.z, fragment.age].every(Number.isFinite)).toBe(true);
      if (time === 0) expect(fragment.visible).toBe(false);
      if (gas === 0) expect(fragment.visible).toBe(false);
      if (fragment.visible) expect(fragment.y).toBeGreaterThan(volcanoHeight(fragment.x, fragment.z));
    }
  });
});
