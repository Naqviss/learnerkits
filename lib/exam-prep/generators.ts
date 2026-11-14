import type { ContentId } from "./catalog";
import type { Question } from "./question-bank";

/** A source of numbers in [0, 1); Math.random in the browser, a fixed sequence in tests. */
export type Rand = () => number;

const int = (rand: Rand, low: number, high: number) => low + Math.floor(rand() * (high - low + 1));
const pick = <T,>(rand: Rand, items: readonly T[]) => items[Math.floor(rand() * items.length)];
const fmt = (value: number) => String(Number(value.toFixed(3)));

/** A calculation question: the correct value first, then three different wrong values. The test shuffles the options. */
function numeric(question: string, correct: number, unit: string, wrong: number[], why: string): Question {
  const values = [correct];
  for (const value of [...wrong, correct + 1, correct + 2, correct * 2 + 3, correct + 5]) {
    if (values.length < 4 && Number.isFinite(value) && !values.some((existing) => fmt(existing) === fmt(value))) values.push(value);
  }
  return { question, options: values.map((value) => `${fmt(value)}${unit ? ` ${unit}` : ""}`), answer: 0, why };
}

const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]] as const;

/** Topics whose questions can be made with new numbers on every attempt. */
export const generators: Partial<Record<ContentId, (rand: Rand) => Question>> = {
  quantities: (r) => { const cm = int(r, 2, 95) * 10; return numeric(`How many metres are in ${cm} cm?`, cm / 100, "m", [cm / 10, cm / 1000, cm * 100], `Divide by 100: ${cm} ÷ 100 = ${fmt(cm / 100)} m.`); },
  kinematics: (r) => { const a = int(r, 2, 6), t = int(r, 3, 9); return numeric(`An object starts from rest and accelerates at ${a} m/s² for ${t} s. What is its final speed?`, a * t, "m/s", [a + t, t / a, a * t * t], `v = u + at = 0 + ${a} × ${t} = ${a * t} m/s.`); },
  dynamics: (r) => { const m = int(r, 2, 9), a = int(r, 2, 8); return numeric(`A resultant force of ${m * a} N acts on a ${m} kg object. What is its acceleration?`, a, "m/s²", [m * a * m, m * a + m, m * a - m], `a = F ÷ m = ${m * a} ÷ ${m} = ${a} m/s².`); },
  forces: (r) => { const area = int(r, 2, 8), p = int(r, 5, 40); return numeric(`A force of ${area * p} N acts over an area of ${area} m². What is the pressure?`, p, "Pa", [area * p * area, area * p + area, area * p - area], `p = F ÷ A = ${area * p} ÷ ${area} = ${p} Pa.`); },
  energy: (r) => { const f = int(r, 4, 25), d = int(r, 2, 9); return numeric(`A force of ${f} N moves an object ${d} m in the direction of the force. How much work is done?`, f * d, "J", [f + d, f / d, f * d * 10], `W = F × d = ${f} × ${d} = ${f * d} J.`); },
  deformation: (r) => { const k = int(r, 2, 9) * 50, cm = int(r, 1, 6) * 5; return numeric(`A spring has a spring constant of ${k} N/m and extends by ${cm} cm. What force is applied?`, k * cm / 100, "N", [k * cm, k / cm, k + cm], `Convert ${cm} cm to ${fmt(cm / 100)} m, then F = kx = ${k} × ${fmt(cm / 100)} = ${fmt(k * cm / 100)} N.`); },
  waves: (r) => { const f = int(r, 2, 12), w = int(r, 2, 9); return numeric(`A wave has a frequency of ${f} Hz and a wavelength of ${w} m. What is its speed?`, f * w, "m/s", [f + w, f / w, w / f], `v = fλ = ${f} × ${w} = ${f * w} m/s.`); },
  electricity: (r) => { const i = int(r, 2, 6), res = int(r, 2, 12); return numeric(`A ${i * res} V supply is connected across a ${res} Ω resistor. What is the current?`, i, "A", [i * res * res, i * res + res, i * res - res], `I = V ÷ R = ${i * res} ÷ ${res} = ${i} A.`); },
  circuits: (r) => { const a = int(r, 2, 12), b = int(r, 2, 12); return numeric(`Resistors of ${a} Ω and ${b} Ω are connected in series. What is the total resistance?`, a + b, "Ω", [a * b, Math.abs(a - b), a * b / (a + b)], `Series resistances add: ${a} + ${b} = ${a + b} Ω.`); },
  gas: (r) => { const p = int(r, 1, 5) * 100, n = pick(r, [2, 4, 5]); return numeric(`A gas at ${p} kPa is compressed at constant temperature to 1/${n} of its volume. What is the new pressure?`, p * n, "kPa", [p / n, p, p + n], `Pressure × volume stays constant, so the pressure becomes ${n} times larger: ${p * n} kPa.`); },
  acids: (r) => { const n = int(r, 1, 6); return numeric(`What is the pH of a strong acid with a hydrogen ion concentration of 10⁻${"⁰¹²³⁴⁵⁶"[n]} mol/L?`, n, "", [14 - n, n + 7, n * 2], `pH = −log₁₀[H⁺] = ${n}.`); },
  orbit: (r) => { const [a, t] = pick(r, [[4, 8], [9, 27], [16, 64], [25, 125]] as const); return numeric(`A body orbits the Sun with a semi-major axis of ${a} AU. About how many years is its orbital period?`, t, "years", [a, a * 2, a * a], `T² = a³ = ${a ** 3}, so T = ${t} years.`); },
  cells: (r) => { const mag = pick(r, [100, 200, 400, 500, 1000]), microns = int(r, 2, 9) * 10; return numeric(`A cell is really ${microns} µm long. Under a microscope its image is ${fmt(microns * mag / 1000)} mm long. What is the magnification?`, mag, "times", [mag / 10, mag * 10, microns * mag / 1000], `Convert the image to micrometres: ${microns * mag} µm. Then ${microns * mag} ÷ ${microns} = ×${mag}.`); },
  enzymes: (r) => { const rate = int(r, 2, 9), time = int(r, 4, 12); return numeric(`An enzyme reaction produces ${rate * time} cm³ of gas in ${time} s. What is the rate of reaction?`, rate, "cm³/s", [rate * time * time, rate * time - time, time / rate], `rate = volume ÷ time = ${rate * time} ÷ ${time} = ${rate} cm³/s.`); },
  circulation: (r) => { const rate = int(r, 6, 12) * 10, stroke = int(r, 5, 9) * 10; return numeric(`A heart beats ${rate} times per minute with a stroke volume of ${stroke} cm³. What is the cardiac output?`, rate * stroke, "cm³/min", [rate + stroke, rate * stroke / 10, rate * stroke * 10], `cardiac output = heart rate × stroke volume = ${rate} × ${stroke} = ${rate * stroke} cm³/min.`); },
  exchange: (r) => { const side = pick(r, [1, 2, 3, 6]); return numeric(`A cube has sides of ${side} cm. What is its surface area ÷ volume?`, 6 / side, "", [6 * side, side ** 3, 6 * side * side], `Surface area = ${6 * side * side} cm² and volume = ${side ** 3} cm³, so the ratio is ${fmt(6 / side)}.`); },
  reproduction: (r) => { const n = int(r, 2, 7); return numeric(`One cell divides by mitosis ${n} times. How many cells are there?`, 2 ** n, "cells", [2 * n, n * n + 1, 2 ** (n + 1)], `The number doubles each time: 2 to the power ${n} = ${2 ** n}.`); },
  dna: (r) => { const a = int(r, 2, 8) * 5; return numeric(`In a DNA molecule, ${a}% of the bases are adenine. What percentage are guanine?`, 50 - a, "%", [a, 100 - a, 100 - 2 * a], `A = T, so A + T = ${2 * a}%. C + G = ${100 - 2 * a}%, and guanine is half of that: ${50 - a}%.`); },
  ecology: (r) => { const percent = pick(r, [5, 10, 20]), available = int(r, 2, 9) * 1000; return numeric(`One trophic level contains ${available} kJ of energy. The next level gains ${available * percent / 100} kJ. What is the transfer efficiency?`, percent, "%", [100 - percent, percent * 2 + 1, percent / 10], `${available * percent / 100} ÷ ${available} × 100 = ${percent}%.`); },
  ratio: (r) => { const original = pick(r, [20, 40, 50, 80, 200]), percent = pick(r, [10, 20, 25, 50]); return numeric(`A value rises from ${original} to ${original + original * percent / 100}. What is the percentage increase?`, percent, "%", [original * percent / 100, 100 + percent, percent / 2], `The change is ${original * percent / 100}. ${original * percent / 100} ÷ ${original} × 100 = ${percent}%.`); },
  algebra: (r) => { const a = int(r, 2, 6), x = int(r, 2, 9), b = int(r, 1, 9); return numeric(`Solve ${a}x + ${b} = ${a * x + b}.`, x, "", [a * x, x + b, (a * x + 2 * b) / a], `Subtract ${b} to get ${a}x = ${a * x}, then divide by ${a}: x = ${x}.`); },
  functions: (r) => { const a = int(r, 2, 5), b = int(r, 1, 6), x = int(r, 2, 4); return numeric(`f(x) = ${a}x + ${b} and g(x) = x². What is fg(${x})?`, a * x * x + b, "", [(a * x + b) ** 2, a * x + b, x * x], `g(${x}) = ${x * x}, then f(${x * x}) = ${a} × ${x * x} + ${b} = ${a * x * x + b}.`); },
  coordinate: (r) => { const m = int(r, 2, 5), dx = int(r, 2, 5), x1 = int(r, 0, 4), y1 = int(r, 0, 6); return numeric(`What is the gradient of the line through (${x1}, ${y1}) and (${x1 + dx}, ${y1 + m * dx})?`, m, "", [1 / m, m * dx, dx], `Change in y ÷ change in x = ${m * dx} ÷ ${dx} = ${m}.`); },
  geometry: (r) => { const [a, b, c] = pick(r, triples); return numeric(`A right-angled triangle has shorter sides of ${a} cm and ${b} cm. How long is the hypotenuse?`, c, "cm", [a + b, a * b, c * c], `${a}² + ${b}² = ${c * c}, and √${c * c} = ${c} cm.`); },
  mensuration: (r) => { const a = int(r, 2, 6), b = int(r, 2, 7), c = int(r, 3, 9); return numeric(`A cuboid measures ${a} cm × ${b} cm × ${c} cm. What is its volume?`, a * b * c, "cm³", [a + b + c, 2 * (a * b + b * c + a * c), a * b + c], `Volume = ${a} × ${b} × ${c} = ${a * b * c} cm³.`); },
  trigonometry: (r) => { const h = int(r, 3, 15) * 2; return numeric(`In a right-angled triangle the hypotenuse is ${h} cm and one angle is 30°. How long is the side opposite that angle?`, h / 2, "cm", [h * 2, h, h / 4], `opposite = hypotenuse × sin 30° = ${h} × 0.5 = ${h / 2} cm.`); },
  vectorsMath: (r) => { const [a, b, c] = pick(r, triples); return numeric(`What is the magnitude of the vector (${a}, ${b})?`, c, "", [a + b, a * b, b - a], `√(${a}² + ${b}²) = √${c * c} = ${c}.`); },
  sequences: (r) => { const a = int(r, 2, 9), d = int(r, 2, 6), n = pick(r, [10, 15, 20, 25]); return numeric(`What is term ${n} of the sequence ${a}, ${a + d}, ${a + 2 * d}, …?`, a + (n - 1) * d, "", [a + n * d, n * d, a * n], `a + (n − 1)d = ${a} + ${n - 1} × ${d} = ${a + (n - 1) * d}.`); },
  logs: (r) => { const base = pick(r, [2, 3, 10]), power = int(r, 2, base === 2 ? 6 : 4); return numeric(`What is log${"₀₁₂₃₄₅₆₇₈₉"[base] ?? "₁₀"} ${base ** power}?`, power, "", [base ** power / base, base * power, power + base], `${base} to the power ${power} is ${base ** power}, so the answer is ${power}.`); },
  differentiation: (r) => { const a = int(r, 2, 6), x = int(r, 2, 5); return numeric(`y = ${a}x². What is dy/dx when x = ${x}?`, 2 * a * x, "", [a * x * x, a * x, 2 * a], `dy/dx = ${2 * a}x, and ${2 * a} × ${x} = ${2 * a * x}.`); },
  integration: (r) => { const a = int(r, 1, 4) * 2, b = int(r, 2, 5); return numeric(`What is the integral of ${a}x from x = 0 to x = ${b}?`, a * b * b / 2, "", [a * b, a * b * b, a], `The integral of ${a}x is ${a / 2}x². At x = ${b} this is ${a * b * b / 2}, and at x = 0 it is 0.`); },
  statistics: (r) => { const mean = int(r, 8, 15), a = int(r, 1, 3), b = int(r, 1, 3); return numeric(`What is the mean of ${mean - a - b}, ${mean - a}, ${mean + a} and ${mean + a + b}?`, mean, "", [mean * 4, mean + a + b, mean - 1], `The total is ${mean * 4}, and ${mean * 4} ÷ 4 = ${mean}.`); },
};

export const examLength = 5;

function shuffle<T>(items: readonly T[], rand: Rand): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}

/**
 * One attempt at a topic test: questions drawn at random from the topic's pool (plus two freshly
 * generated calculations where the topic has a generator), with the answer options shuffled.
 */
export function buildExam(content: ContentId, pool: readonly Question[], rand: Rand = Math.random, length = examLength): Question[] {
  const make = generators[content];
  const generated: Question[] = [];
  for (let tries = 0; make && generated.length < 2 && tries < 12; tries++) {
    const next = make(rand);
    // Skip a repeat, including one that happens to match a fixed question in the pool.
    if (![...generated, ...pool].some((item) => item.question === next.question)) generated.push(next);
  }
  // Generated questions always appear, so a calculation topic has new numbers on every attempt.
  const chosen = [...generated, ...shuffle(pool, rand).slice(0, Math.max(0, length - generated.length))];
  return shuffle(chosen, rand).map((item) => {
    const correct = item.options[item.answer], options = shuffle(item.options, rand);
    return { ...item, options, answer: options.indexOf(correct) };
  });
}
