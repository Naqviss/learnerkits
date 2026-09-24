import { describe, expect, it } from "vitest";
import { molecules } from "@/lib/simulations/chemistry/model";
import { getMoleculeReference, getVseprClasses, moleculeCopy, moleculeReferences } from "@/lib/seo/molecules";

describe("molecule reference pages", () => {
  it("covers every lab molecule with a real name and a unique URL-safe slug", () => {
    expect(moleculeReferences).toHaveLength(molecules.length);
    for (const m of moleculeReferences) {
      expect(m.name).not.toBe(m.formula);
      expect(m.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    expect(new Set(moleculeReferences.map((m) => m.slug)).size).toBe(moleculeReferences.length);
  });
  it("derives textbook VSEPR facts", () => {
    const water = getMoleculeReference("water-h2o")!;
    expect(water).toMatchObject({ shape: "Bent", electronGeometry: "Tetrahedral", axe: "AX₂E₂", hybridization: "sp³", polarity: "Polar" });
    expect(getMoleculeReference("ammonia-nh3")).toMatchObject({ axe: "AX₃E", shape: "Trigonal pyramidal", polarity: "Polar" });
    expect(getMoleculeReference("carbon-dioxide-co2")).toMatchObject({ electronGeometry: "Linear", hybridization: "sp", polarity: "Nonpolar" });
    expect(getMoleculeReference("xenon-tetrafluoride-xef4")).toMatchObject({ axe: "AX₄E₂", electronGeometry: "Octahedral", polarity: "Nonpolar" });
    expect(getMoleculeReference("xenon-difluoride-xef2")).toMatchObject({ electronGeometry: "Trigonal bipyramidal", polarity: "Nonpolar" });
    expect(getMoleculeReference("ammonium-ion-nh4")).toMatchObject({ isIon: true, polarity: "Ion" });
    expect(getMoleculeReference("mercury-ii-chloride-hgcl2")).toBeDefined();
    expect(getMoleculeReference("permanganate-ion-mno4")?.hybridization).toBeUndefined();
  });
  it("groups the chart by electron domains and keeps FAQ answers specific", () => {
    const classes = getVseprClasses();
    expect(classes.map((c) => c.domains)).toEqual([...classes.map((c) => c.domains)].sort((a, b) => a - b));
    expect(classes).toHaveLength(13);
    const faq = moleculeCopy(getMoleculeReference("water-h2o")!).faq;
    expect(faq.map((f) => f.q)).toContain("Is H₂O polar or nonpolar?");
    expect(faq.every((f) => f.a.includes("H₂O") || f.a.includes("Water"))).toBe(true);
  });
});
