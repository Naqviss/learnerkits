// Mean, median and mode for small whole-number data sets on a 0–20 number line.
export const statMin = 0, statMax = 20;

export function mean(values: number[]) {
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : NaN;
}

export function median(values: number[]) {
  if (!values.length) return NaN;
  const sorted = [...values].sort((a, b) => a - b), mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Every value tied for the highest count, smallest first. Empty when each value appears once. */
export function modes(values: number[]) {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const top = Math.max(0, ...counts.values());
  if (top <= 1) return [];
  return [...counts].filter(([, c]) => c === top).map(([v]) => v).sort((a, b) => a - b);
}

export const range = (values: number[]) => (values.length ? Math.max(...values) - Math.min(...values) : NaN);

/** Total distance of the values below the mean and above it. The two totals are always equal. */
export function deviationTotals(values: number[]) {
  const m = mean(values);
  let left = 0, right = 0;
  for (const v of values) { if (v < m) left += m - v; else right += v - m; }
  return { left, right };
}

export const presets = {
  quiz: [6, 7, 7, 8, 9, 10, 10, 10, 12, 13, 15],
  outlier: [5, 6, 7, 7, 8, 9, 10, 20],
  symmetric: [4, 6, 8, 8, 10, 10, 10, 12, 12, 14, 16],
} as const;
export type PresetKey = keyof typeof presets;

/** An outlier here: exactly one value of 18 or more that sits at least 5 above every other value. */
export function hasHighOutlier(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b), top = sorted[sorted.length - 1], next = sorted[sorted.length - 2];
  return sorted.length >= 3 && top >= 18 && top - next >= 5;
}
