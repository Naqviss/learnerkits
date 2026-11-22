// Fractions as numerator / denominator pairs, compared exactly with whole-number arithmetic.
export type Fraction = { n: number; d: number };

export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

export const value = (f: Fraction) => f.n / f.d;

/** Lowest terms; 0/d simplifies to 0/1. */
export function simplify(f: Fraction): Fraction {
  if (f.n === 0) return { n: 0, d: 1 };
  const g = gcd(f.n, f.d);
  return { n: f.n / g, d: f.d / g };
}

/** −1, 0 or 1 by cross-multiplication, so 1/3 and 2/6 compare as exactly equal. */
export function compare(a: Fraction, b: Fraction): -1 | 0 | 1 {
  const left = a.n * b.d, right = b.n * a.d;
  return left === right ? 0 : left > right ? 1 : -1;
}

/**
 * When one fraction is the other with top and bottom multiplied by the same whole number k ≥ 2,
 * returns which one is the larger-denominator copy and k (for example 1/2 → 3/6 gives { to: "B", k: 3 }).
 */
export function scaleFactor(a: Fraction, b: Fraction): { to: "A" | "B"; k: number } | null {
  if (b.d > a.d && b.d % a.d === 0) { const k = b.d / a.d; if (b.n === a.n * k) return { to: "B", k }; }
  if (a.d > b.d && a.d % b.d === 0) { const k = a.d / b.d; if (a.n === b.n * k) return { to: "A", k }; }
  return null;
}

/** Both fractions rewritten over their least common denominator. */
export function commonDenominator(a: Fraction, b: Fraction) {
  const d = lcm(a.d, b.d);
  return { d, a: a.n * (d / a.d), b: b.n * (d / b.d) };
}

export const label = (f: Fraction) => `${f.n}/${f.d}`;
