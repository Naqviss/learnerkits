import { describe, expect, it } from "vitest";
import { deviationTotals, hasHighOutlier, mean, median, modes, presets, range } from "@/lib/simulations/mathematicsLabs/statistics";

describe("mean, median and mode lab", () => {
  it("measures the three presets", () => {
    expect(mean([...presets.quiz])).toBeCloseTo(107 / 11);
    expect(median([...presets.quiz])).toBe(10);
    expect(modes([...presets.quiz])).toEqual([10]);
    expect(mean([...presets.outlier])).toBe(9);
    expect(median([...presets.outlier])).toBe(7.5);
    expect(modes([...presets.outlier])).toEqual([7]);
    expect(mean([...presets.symmetric])).toBe(10);
    expect(median([...presets.symmetric])).toBe(10);
    expect(range([...presets.quiz])).toBe(9);
  });

  it("averages the two middle values for an even count", () => {
    expect(median([1, 9, 3, 7])).toBe(5);
  });

  it("reports several modes or none", () => {
    expect(modes([2, 2, 5, 5, 9])).toEqual([2, 5]);
    expect(modes([1, 2, 3])).toEqual([]);
  });

  it("balances the distances on each side of the mean", () => {
    for (const data of [[...presets.quiz], [...presets.outlier], [3, 4, 20]]) {
      const { left, right } = deviationTotals(data);
      expect(left).toBeCloseTo(right, 10);
    }
    // Mean 5: the values below it are 3 and 1 short, the value above it is 4 over.
    expect(deviationTotals([2, 4, 9])).toEqual({ left: 4, right: 4 });
  });

  it("shows an outlier moving the mean far more than the median", () => {
    const before = [5, 6, 7, 7, 8, 9, 10, 11];
    const after = [5, 6, 7, 7, 8, 9, 10, 20];
    expect(median(after) - median(before)).toBe(0);
    expect(mean(after) - mean(before)).toBeCloseTo(9 / 8);
    expect(hasHighOutlier(after)).toBe(true);
    expect(hasHighOutlier(before)).toBe(false);
  });

  it("counts dragging the default data's largest value out to 18 as an outlier", () => {
    const quiz: number[] = [...presets.quiz], i = quiz.indexOf(Math.max(...quiz));
    expect(hasHighOutlier(quiz)).toBe(false);
    quiz[i] = 18;
    expect(hasHighOutlier(quiz)).toBe(true);
    expect(hasHighOutlier([...quiz.slice(0, i), 14, ...quiz.slice(i + 1)])).toBe(false);
  });
});
