export const experimentSettings = {
  "gravity-planet-orbit": { label: "Gravitational pull", unit: "×", min: 0.4, max: 2, step: 0.1, initial: 1, question: "At the same launch speed, will doubling gravity make the planet travel farther from its star or closer to it?" },
  "n-body-space": { label: "Starting bodies", unit: "", min: 10, max: 100, step: 10, initial: 100, question: "Start with 50 bodies, then try 100. What fraction merges in the same amount of time?" },
  "pendulum-wave": { label: "Extra cycles between neighbors per minute", unit: "", min: 0, max: 3, step: 1, initial: 1, question: "Release the pendulums together. When will they line up again if each neighbor completes one extra cycle per minute?" },
  "ecosystem-survival": { label: "Prey carrying capacity", unit: "", min: 20, max: 160, step: 5, initial: 100, question: "Can predators persist for 1,000 years? Find the smallest carrying capacity that sustains them." },
  "climate-change-scenarios": { label: "Global warming scenario", unit: "°C", min: 0, max: 5, step: 0.5, initial: 3, question: "If mountain air warms by the global average, how far uphill must you travel to find the original temperature?" },
  "aquarium-food-web": { label: "Remove at day zero", unit: "", min: 0, max: 3, step: 1, initial: 0, question: "Compare an intact tank with one missing its grazing snails. Predict what happens to algae and fish." },
} as const;

export type Experiment = keyof typeof experimentSettings;
export type Dot = { x: number; y: number; size: number };
export type Frame = { time: number; dots: Dot[]; values: number[] };
export const measurements: Record<Experiment, string[]> = {
  "gravity-planet-orbit": ["Distance (initial radii)"], "n-body-space": ["Bodies remaining", "Mergers"],
  "pendulum-wave": ["Elapsed seconds"], "ecosystem-survival": ["Prey", "Predators"],
  "climate-change-scenarios": ["Temperature rise (°C)", "Habitat boundary (m)"], "aquarium-food-web": ["Algae", "Snails", "Fish"],
};

function gravityFrames(cluster: boolean, control: number): Frame[] {
  const bodies = Array.from({ length: cluster ? control : 1 }, (_, i) => {
    const angle = i * 2.39996;
    const radius = cluster ? Math.sqrt((i + 1) / control) : 1;
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), vx: -0.32 * Math.sin(angle), vy: cluster ? 0.32 * Math.cos(angle) : 1, mass: 1 };
  });
  const frames: Frame[] = [];
  const dt = 0.01;
  for (let step = 0; step <= 800; step++) {
    if (step % 4 === 0) frames.push({ time: step * dt, dots: bodies.map(b => ({ x: b.x, y: b.y, size: Math.sqrt(b.mass) })), values: cluster ? [bodies.length, control - bodies.length] : [Math.hypot(bodies[0].x, bodies[0].y)] });
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      if (!cluster) {
        const pull = control * dt / Math.hypot(a.x, a.y) ** 3;
        a.vx -= pull * a.x; a.vy -= pull * a.y;
      }
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j], dx = b.x - a.x, dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 0.027 * (Math.sqrt(a.mass) + Math.sqrt(b.mass))) {
          const share = b.mass / (a.mass + b.mass);
          a.x += share * dx; a.y += share * dy;
          a.vx += share * (b.vx - a.vx); a.vy += share * (b.vy - a.vy);
          a.mass += b.mass; bodies.splice(j--, 1);
        } else {
          const pull = dt * 0.012 / (distance ** 2 + 0.003) ** 1.5;
          a.vx += pull * b.mass * dx; a.vy += pull * b.mass * dy;
          b.vx -= pull * a.mass * dx; b.vy -= pull * a.mass * dy;
        }
      }
    }
    for (const b of bodies) { b.x += b.vx * dt; b.y += b.vy * dt; }
  }
  return frames;
}

export function pendulumFrame(time: number, control: number): Frame {
  const dots = Array.from({ length: 12 }, (_, k) => {
    const cycles = 24 + k * control, length = 135 * (24 / cycles) ** 2;
    const angle = 0.28 * Math.cos(2 * Math.PI * cycles * time / 60);
    return { x: 34 + k * 37 + length * Math.sin(angle), y: 24 + length * Math.cos(angle), size: 5 };
  });
  return { time, dots, values: [time] };
}

export function simulate(kind: Experiment, control: number): Frame[] {
  if (kind === "gravity-planet-orbit" || kind === "n-body-space") return gravityFrames(kind === "n-body-space", control);
  let prey = 40, predators = 8;
  let algae = control === 1 ? 0 : 65, snails = control === 2 ? 0 : 22, fish = control === 3 ? 0 : 7;
  const frames: Frame[] = [];
  for (let i = 0; i <= 200; i++) {
    const fraction = i / 200;
    if (kind === "pendulum-wave") {
      const time = 60 * fraction;
      frames.push(pendulumFrame(time, control));
    } else if (kind === "climate-change-scenarios") {
      const warming = control * fraction;
      frames.push({ time: fraction * 100, dots: [], values: [warming, 2000 + warming * 1000 / 6.5] });
    } else if (kind === "ecosystem-survival") {
      frames.push({ time: i * 5, dots: [], values: [prey, predators] });
      for (let j = 0; j < 50; j++) {
        const eaten = 0.007 * prey * predators;
        const growth = 0.35 * prey * (1 - prey / control);
        prey = Math.max(0, prey + 0.1 * (growth - eaten));
        predators = Math.max(0, predators + 0.1 * (0.3 * eaten - 0.095 * predators));
        if (predators < 0.5) predators = 0;
      }
    } else {
      frames.push({ time: i / 2, dots: [], values: [algae, snails, fish] });
      const grazed = 0.004 * algae * snails, hunted = 0.008 * snails * fish;
      algae += 0.5 * (0.22 * algae * (1 - algae / 100) - grazed);
      snails += 0.5 * (0.5 * grazed - hunted - 0.045 * snails);
      fish += 0.5 * (0.35 * hunted - 0.04 * fish);
    }
  }
  return frames;
}
