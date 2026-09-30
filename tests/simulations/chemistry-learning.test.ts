import { describe, expect, it } from "vitest";
import { activities, indicatorAppearance, titrationInventory, titrationPH, initialValues } from "@/lib/simulations/chemistry/model";
import { describeConditions, parseNotebook, teachingGuides } from "@/lib/simulations/chemistry/learning";

describe("chemistry classroom tools", () => {
  it("keeps indicator endpoints separate from neutral equivalence", () => {
    expect(indicatorAppearance(titrationPH(25), 1).label).toBe("Colorless");
    expect(indicatorAppearance(titrationPH(25.05), 1).label).toBe("Pale pink");
    expect(indicatorAppearance(2, 0).label).toBe("Yellow");
    expect(indicatorAppearance(7, 0).label).toBe("Green transition");
    expect(indicatorAppearance(12, 0).label).toBe("Blue");
    for (const ph of [1, 7, 13]) expect(indicatorAppearance(ph, 2).label).toBe("Colorless");
  });
  it("conserves reacting amounts, spectator ions, and solution volume throughout titration", () => {
    for (const acid of [.1, .12]) for (const ml of [0, 20, 24.95, 25, 25.05, 30, 30.05, 50]) {
      const r = titrationInventory(ml, acid);
      expect(r.totalVolume).toBe(25 + ml);
      expect(r.reactedMmol + r.excessAcidMmol).toBeCloseTo(acid * 25, 12);
      expect(r.reactedMmol + r.excessBaseMmol).toBeCloseTo(.1 * ml, 12);
      expect(r.sodiumMmol + r.excessAcidMmol).toBeCloseTo(r.chlorideMmol + r.excessBaseMmol, 12);
    }
  });
  it("provides specific teaching guidance for every chemistry lab", () => {
    for (const a of activities) {
      expect(teachingGuides[a.slug].question).toContain("?");
      expect(teachingGuides[a.slug].evidence.length).toBeGreaterThan(30);
      expect(teachingGuides[a.slug].misconception.length).toBeGreaterThan(30);
    }
  });
  it("restores evidence and rejects corrupt stored rows without losing valid notes", () => {
    const row = { id: 1, conditions: "25 °C", readings: [["pH", "7.00"]], observation: "Green" };
    const book = { prediction: "pH rises", observation: "Unfinished observation", conclusion: "Neutral at equivalence", records: [row] };
    expect(parseNotebook(JSON.stringify(book))).toEqual(book);
    expect(parseNotebook(JSON.stringify({ ...book, records: [null, row, { ...row, readings: [null] }, { ...row, readings: [["pH", 7]] }] }))).toEqual(book);
    expect(parseNotebook("broken").records).toEqual([]);
    expect(parseNotebook("null").records).toEqual([]);
    expect(parseNotebook(null).prediction).toBe("");
  });
  it("records readable conditions with units and chemical names, omitting answer controls", () => {
    const acid = activities.find(a => a.slug === "acid-base-ph")!;
    expect(describeConditions(acid, initialValues(acid))).toContain("HCl · strong acid");
    const gas = activities.find(a => a.slug === "gas-law-lab")!;
    expect(describeConditions(gas, initialValues(gas))).toContain("300 K");
    const bonding = activities.find(a => a.slug === "chemical-bonding")!;
    expect(describeConditions(bonding, initialValues(bonding))).not.toContain("Bond type");
  });
});
