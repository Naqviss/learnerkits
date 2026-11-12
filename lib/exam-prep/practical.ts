// Model data and marking for the two virtual practical stations (original practice, not an official paper).
export const practicalKinds = ["circuit", "pendulum"] as const;
export type PracticalKind = (typeof practicalKinds)[number];
export const isPracticalKind = (value: string): value is PracticalKind => (practicalKinds as readonly string[]).includes(value);

export type Reading = { x: number; y: number; t2?: number };
export type Point = { x: number; y: number };

// Small fixed offsets stand in for measurement scatter so repeated visits give the same data.
const circuitOffsets: Record<number, number> = { 2: -0.01, 4: 0, 6: 0.01, 8: 0, 10: -0.01, 12: 0.01 };
const pendulumOffsets: Record<string, number> = { "0.2": -0.02, "0.4": 0.03, "0.6": -0.01, "0.8": 0.02, "1.0": 0 };
const round = (value: number, digits: number) => Number(value.toFixed(digits));

/** Ammeter reading for the fixed 8 Ω resistor. */
export function circuitCurrent(volts: number) {
  return round(volts / 8 + (circuitOffsets[volts] ?? 0), 2);
}

/** Timer reading for ten oscillations of a pendulum of this length (m). */
export function pendulumTenSwings(length: number) {
  return round(10 * 2 * Math.PI * Math.sqrt(length / 9.81) + (pendulumOffsets[length.toFixed(1)] ?? 0), 2);
}

export function takeReading(kind: PracticalKind, setting: number): Reading {
  if (kind === "circuit") return { x: setting, y: circuitCurrent(setting) };
  const length = round(setting, 1), ten = pendulumTenSwings(length);
  return { x: length, y: ten, t2: round((ten / 10) ** 2, 3) };
}

/** Graph points: V against I for the circuit, T² against L for the pendulum. */
export function graphPoints(kind: PracticalKind, readings: Reading[]): Point[] {
  return readings.map((reading) => kind === "circuit" ? { x: reading.y, y: reading.x } : { x: reading.x, y: reading.t2 ?? 0 });
}

/** Least-squares best-fit line, or null with fewer than two distinct x values. */
export function bestFit(points: Point[]): { slope: number; intercept: number } | null {
  const n = points.length;
  if (n < 2) return null;
  const xm = points.reduce((sum, p) => sum + p.x, 0) / n, ym = points.reduce((sum, p) => sum + p.y, 0) / n;
  const den = points.reduce((sum, p) => sum + (p.x - xm) ** 2, 0);
  if (!den) return null;
  const slope = points.reduce((sum, p) => sum + (p.x - xm) * (p.y - ym), 0) / den;
  return { slope, intercept: ym - slope * xm };
}

export type PracticalAnswers = { readings: Reading[]; plotted: boolean; estimate: string; unit: string; method: string };
export type PracticalMark = { score: number; total: 12; notes: string[] };

export const practicalExpected: Record<PracticalKind, { value: number; tolerance: number; unit: string; label: string }> = {
  circuit: { value: 8, tolerance: 0.8, unit: "ohm", label: "about 8 Ω" },
  pendulum: { value: 9.81, tolerance: 1, unit: "ms2", label: "about 9.81 m/s²" },
};

/** 12 marks: measurements 3, graph 3, calculation 3, units 1, evaluation 2. */
export function markPractical(kind: PracticalKind, answers: PracticalAnswers): PracticalMark {
  const circuit = kind === "circuit", expected = practicalExpected[kind], n = answers.readings.length, notes: string[] = [];
  let score = 0;
  if (n >= 5) { score += 3; notes.push("Measurements: 3/3 — five or more distinct readings."); }
  else notes.push(`Measurements: 0/3 — record at least five different settings (${n} recorded).`);
  if (answers.plotted && n >= 2) { score += 3; notes.push("Graph: 3/3 — plotted data and a best-fit line."); }
  else notes.push("Graph: 0/3 — plot the best-fit line after recording readings.");
  const value = Number(answers.estimate);
  if (answers.estimate.trim() !== "" && Number.isFinite(value) && Math.abs(value - expected.value) <= expected.tolerance) { score += 3; notes.push("Calculation: 3/3 — answer is within the model tolerance."); }
  else notes.push(`Calculation: 0/3 — ${circuit ? "the gradient of V against I is the resistance" : "from the gradient of T² against L, use g = 4π² ÷ gradient"}. Review the plotted data.`);
  if (answers.unit === expected.unit) { score += 1; notes.push("Units: 1/1 — appropriate unit selected."); }
  else notes.push("Units: 0/1 — check the dimension of your calculated quantity.");
  if (answers.method === "repeat") { score += 2; notes.push("Evaluation: 2/2 — repeating and averaging reduces the effect of random variation."); }
  else notes.push("Evaluation: 0/2 — consider repeated measurements and timing several oscillations where relevant.");
  const fit = bestFit(graphPoints(kind, answers.readings));
  if (fit) notes.push(circuit ? `Model gradient: ${fit.slope.toFixed(2)} V/A, which equals the resistance in Ω.` : `Model gradient: ${fit.slope.toFixed(3)} s²/m; g = 4π² ÷ gradient = ${(4 * Math.PI ** 2 / fit.slope).toFixed(2)} m/s².`);
  return { score, total: 12, notes };
}
