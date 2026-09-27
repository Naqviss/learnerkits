import { clamp, volcano, type Values } from "@/lib/simulations/geographyLabs/model";

export type EruptionExample = "effusive" | "explosive";
export const eruptionExamples: Record<EruptionExample, Values> = {
  effusive: { gas: 1, viscosity: 2 },
  explosive: { gas: 6, viscosity: 6 },
};
export const seeded = (n: number) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** Scenic terrain units. No real volcano's topography or hazard footprint is implied. */
export function volcanoHeight(x: number, z: number) {
  const r = Math.hypot(x, z), a = Math.atan2(z, x);
  if (r < 1.25) return 4.45 + 1.4 * (r / 1.25) ** 2;
  const flank = 5.85 * Math.exp(-((r - 1.25) / 4.6) ** 1.15);
  const ridges = Math.sin(Math.min(1, (r - 1.25) / 2) * Math.PI / 2)
    * Math.exp(-r / 9) * (.42 * Math.sin(a * 11 + r * .27) + .19 * Math.sin(a * 23 - r * .5));
  const foothills = clamp((r - 12) / 15) * (.25 + .22 * Math.sin(x * .3) * Math.cos(z * .25));
  return flank + ridges + foothills;
}

export function eruptionVisuals(values: Values, time: number) {
  const model = volcano(values), active = clamp(time / .9), explosive = model.style === "Explosive";
  return {
    ...model, active,
    plumeHeight: (explosive ? 8.5 : model.style === "Mixed" ? 5.7 : 3.2) * active,
    ash: explosive ? .85 : model.style === "Mixed" ? .5 : .08,
    // Long fluid flows versus a short, thick deposit near a viscous vent.
    flowReach: clamp(time / (explosive ? 18 : 9)) * (explosive ? .28 : 1),
    fountain: (.65 + values.gas * .17 + model.index * 1.8) * active,
  };
}

/** Deterministic ballistic fragments: pause/step/reset uses the experiment clock. */
export function lavaFragment(index: number, time: number, values: Values) {
  const state = eruptionVisuals(values, time), delay = seeded(index + 12) * 1.8;
  const age = ((Math.max(0, time - delay)) % 2.7), angle = seeded(index + 3) * Math.PI * 2;
  const horizontal = (.35 + seeded(index + 5) * 1.2) * (1 + state.index);
  const upward = 1.3 + state.fountain * (1 + seeded(index + 19));
  const x = Math.cos(angle) * (.18 + horizontal * age), z = Math.sin(angle) * (.18 + horizontal * age);
  const y = 5.8 + upward * age - 2.8 * age * age;
  return { x, y, z, age, visible: time > delay && y > volcanoHeight(x, z) + .08 };
}
