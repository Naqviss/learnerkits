import { describe, expect, it } from "vitest";
import { activities, atomBalance, initialValues, rateConstant, reactions, solutionPH, strongPH, titrationPH, yieldResult } from "@/lib/simulations/chemistry/model";
import { subjectsCatalog } from "@/lib/subjects/catalog";

describe("chemistry experiments", () => {
  it("covers every chemistry catalog route with distinct activity controls", () => {
    expect(activities.map(a=>a.slug).sort()).toEqual(subjectsCatalog.chemistry.simulations.map(s=>s.slug).sort());
    expect(new Set(activities.map(a=>a.slug)).size).toBe(13);
    for (const a of activities) for (const c of a.controls) expect(initialValues(a)[c.key]).toBeGreaterThanOrEqual(c.min);
  });
  it("keeps dilute acids acidic and resolves neutral equivalence without log(0)", () => {
    expect(strongPH(0)).toBe(7);
    expect(strongPH(1e-7)).toBeLessThan(7);
    expect(strongPH(-1e-7)).toBeGreaterThan(7);
    expect(titrationPH(25)).toBe(7);
    expect(titrationPH(24.95)).toBeLessThan(6);
    expect(titrationPH(25.05)).toBeGreaterThan(8);
    expect(titrationPH(30,.12)).toBe(7);
    expect(titrationPH(50,.12)).toBeGreaterThan(12);
  });
  it("distinguishes weak and strong acids at equal concentration", () => {
    expect(solutionPH({solution:0,logC:-3})).toBeCloseTo(3,5);
    expect(solutionPH({solution:1,logC:-2})).toBeGreaterThan(solutionPH({solution:0,logC:-2}));
    expect(solutionPH({solution:1,logC:-7})).toBeLessThan(7);
    expect(solutionPH({solution:2,logC:-3})).toBeCloseTo(11,5);
  });
  it("conserves reactants and caps water yield at the limiting reagent", () => {
    expect(yieldResult(6,3)).toEqual({water:6,hydrogen:0,oxygen:0});
    expect(yieldResult(4,4)).toEqual({water:4,hydrogen:0,oxygen:2});
    for(let h=1;h<=12;h++) for(let o=1;o<=8;o++) {
      const r=yieldResult(h,o);
      expect(r.hydrogen*2+r.water*2).toBe(h*2);
      expect(r.oxygen*2+r.water).toBe(o*2);
      expect(Math.min(r.hydrogen,r.oxygen)).toBe(0);
    }
  });
  it("balances each reaction without altering subscripts", () => {
    reactions.forEach((r,i)=>expect(atomBalance(i,r.solution).every(a=>a.left===a.right)).toBe(true));
    expect(atomBalance(2,[1,1,1,1]).some(a=>a.left!==a.right)).toBe(true);
  });
  it("makes the kinetics mission achievable and responds to temperature and catalyst", () => {
    const baseline=rateConstant({temperature:298,catalyst:0});
    const warm=rateConstant({temperature:320,catalyst:0});
    expect(warm).toBeGreaterThan(baseline);
    expect(1-Math.exp(-warm*20)).toBeGreaterThan(.8);
    expect(rateConstant({temperature:298,catalyst:1})).toBeCloseTo(3*baseline);
  });
});
