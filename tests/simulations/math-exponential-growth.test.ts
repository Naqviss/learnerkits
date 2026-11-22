import { describe, expect, it } from "vitest";
import { axisMax, crossover, doublingMarks, doublingTime, exponentialValue, linearStartsAhead, linearValue, money, moneyShort, niceStep, ruleOf72 } from "@/lib/simulations/mathematicsLabs/growth";

describe("exponential vs linear growth lab", () => {
  it("adds a constant amount to Plan L and multiplies Plan E by a constant factor", () => {
    expect([0, 1, 2, 3].map((t) => linearValue(500, 50, t))).toEqual([500, 550, 600, 650]);
    expect([0, 1, 2, 3].map((t) => +exponentialValue(500, 0.06, t).toFixed(2))).toEqual([500, 530, 561.8, 595.51]);
    expect(+exponentialValue(1000, 0.1, 3).toFixed(2)).toBe(1331);
  });

  it("finds the year Plan E overtakes Plan L and the exact crossing between years", () => {
    // Default settings: $500, +$50 a year, 5 % a year.
    expect(linearStartsAhead(500, 50, 0.05)).toBe(true);
    const c = crossover(500, 50, 0.05)!;
    expect(c.year).toBe(27);
    expect(c.exact).toBeGreaterThan(26);
    expect(c.exact).toBeLessThan(27);
    expect(exponentialValue(500, 0.05, 26)).toBeLessThan(linearValue(500, 50, 26));
    expect(exponentialValue(500, 0.05, 27)).toBeGreaterThan(linearValue(500, 50, 27));
    expect(crossover(1000, 100, 0.08)!.year).toBe(7);
    expect(crossover(1000, 100, 0.05)!.year).toBe(27);
  });

  it("reports no overtaking when Plan E is level or ahead from the first year", () => {
    expect(linearStartsAhead(100, 10, 0.1)).toBe(false); // tie at $110 after year 1
    expect(crossover(100, 10, 0.1)).toBeNull();
    expect(crossover(1000, 10, 0.05)).toBeNull();
    expect(crossover(1000, 200, 0.01, 50)).toBeNull();
  });

  it("matches the doubling times and rule-of-72 estimates quoted in the lab", () => {
    expect(doublingTime(0.07)).toBeCloseTo(10.24, 2);
    expect(ruleOf72(0.07)).toBeCloseTo(10.29, 2);
    expect(doublingTime(0.05)).toBeCloseTo(14.21, 2);
    expect(doublingTime(0.1)).toBeCloseTo(7.27, 2);
    expect(doublingTime(0.2)).toBeCloseTo(3.80, 2);
    expect(doublingTime(0.01)).toBeCloseTo(69.66, 2);
    expect(Math.log(8) / Math.log(1.07)).toBeCloseTo(30.73, 2);
  });

  it("spaces the doubling marks equally in time", () => {
    const marks = doublingMarks(1000, 0.07, 40);
    expect(marks.map((m) => m.multiple)).toEqual([2, 4, 8]);
    expect(marks[1].t - marks[0].t).toBeCloseTo(marks[0].t, 9);
    expect(marks[2].t).toBeCloseTo(30.73, 2);
    for (const m of marks) expect(exponentialValue(1000, 0.07, m.t)).toBeCloseTo(m.value, 6);
    expect(doublingMarks(1000, 0.07, 30)).toHaveLength(2);
  });

  it("supports the numbers stated in the page content", () => {
    expect(Math.round(exponentialValue(1000, 0.07, 30))).toBe(7612);
    expect(Math.round(exponentialValue(1000, 0.07, 10))).toBe(1967);
    expect(+exponentialValue(1000, 0.1, 20).toFixed(2)).toBe(6727.5);
    expect(exponentialValue(1000, 0.2, 50)).toBeGreaterThan(9e6);
  });

  it("chooses round axis ticks and formats money", () => {
    expect(niceStep(1000)).toBe(200);
    expect(niceStep(1866)).toBe(500);
    expect(axisMax(1866).top).toBe(2000);
    expect(money(1234.5)).toBe("$1,235");
    expect(money(25, 2)).toBe("$25.00");
    expect(moneyShort(1500)).toBe("$1,500");
    expect(moneyShort(12500)).toBe("$12.5k");
    expect(moneyShort(250000)).toBe("$250k");
    expect(moneyShort(1_200_000)).toBe("$1.2M");
    expect(moneyShort(2_000_000)).toBe("$2M");
  });
});
