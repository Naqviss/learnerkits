// Two savings plans that start with the same amount `a`:
// Plan L adds a fixed deposit `d` every year (linear): L(t) = a + d·t.
// Plan E grows by a rate `r` (as a fraction) compounded once a year (exponential): E(t) = a·(1 + r)^t.

const EPS = 1e-9;

export const linearValue = (a: number, d: number, t: number) => a + d * t;
export const exponentialValue = (a: number, r: number, t: number) => a * Math.pow(1 + r, t);

/** Exact doubling time of E in years, ln 2 ÷ ln(1 + r). */
export const doublingTime = (r: number) => Math.log(2) / Math.log(1 + r);
/** Rule-of-72 estimate, 72 ÷ (rate in percent). */
export const ruleOf72 = (r: number) => 72 / (r * 100);

/** True when Plan L is strictly ahead after the first year, d > a·r. */
export const linearStartsAhead = (a: number, d: number, r: number) => linearValue(a, d, 1) - exponentialValue(a, r, 1) > EPS;

export type Crossover = {
  /** First whole year in which Plan E's balance is at least Plan L's. */
  year: number;
  /** Where the two curves actually cross, somewhere between `year − 1` and `year`. */
  exact: number;
};

/**
 * When Plan E catches Plan L. Returns null when E is level or ahead from year 1 (no overtaking),
 * or when it has not caught up within `maxYears`.
 */
export function crossover(a: number, d: number, r: number, maxYears = 1000): Crossover | null {
  if (!linearStartsAhead(a, d, r)) return null;
  const gap = (t: number) => exponentialValue(a, r, t) - linearValue(a, d, t);
  for (let year = 2; year <= maxYears; year++) {
    if (gap(year) >= -EPS) {
      let lo = year - 1, hi = year;
      for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        if (gap(mid) >= 0) hi = mid; else lo = mid;
      }
      return { year, exact: (lo + hi) / 2 };
    }
  }
  return null;
}

/** Times at which E reaches 2a, 4a, 8a … up to `years`. They are equally spaced by the doubling time. */
export function doublingMarks(a: number, r: number, years: number) {
  const step = doublingTime(r), marks: { multiple: number; t: number; value: number }[] = [];
  for (let k = 1; k * step <= years + EPS && k < 60; k++) marks.push({ multiple: 2 ** k, t: k * step, value: a * 2 ** k });
  return marks;
}

/** A round tick step (1, 2 or 5 × 10ⁿ) giving about `target` ticks up to `max`. */
export function niceStep(max: number, target = 5) {
  const raw = Math.max(max, 1e-9) / target, mag = 10 ** Math.floor(Math.log10(raw)), norm = raw / mag;
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
}

/** Top of the y-axis: the next tick above the largest value shown, with a little headroom. */
export function axisMax(max: number, target = 5) {
  const step = niceStep(max * 1.04, target);
  return { step, top: Math.ceil((max * 1.04) / step) * step };
}

/** "$1,250" for balances; compact "$12.5k" / "$1.2M" for axis labels. */
export const money = (n: number, digits = 0) => `$${n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
export function moneyShort(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (n >= 1e4) return `$${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, "")}k`;
  return money(n);
}
