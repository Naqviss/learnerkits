import { describe, expect, it } from "vitest";
import { molecules } from "@/lib/simulations/chemistry/model";
import { classMistake, getMoleculeReference, getVseprClasses, lewisSteps, moleculeCopy, moleculeFamily, moleculeReferences, moleculeSearchCopy } from "@/lib/seo/molecules";
import { moleculeAbout } from "@/lib/seo/molecule-about";
import { bondLengths } from "@/lib/simulations/chemistry/bondLengths";

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
  it("writes search titles and descriptions with the plain formula people type", () => {
    expect(moleculeSearchCopy(getMoleculeReference("phosphorus-pentafluoride-pf5")!).title).toBe("PF5 Molecular Geometry, Lewis Structure & Bond Angles (3D)");
    expect(moleculeSearchCopy(getMoleculeReference("hydrogen-sulfide-h2s")!).description).toMatch(/^Why is H2S bent\? .*Lewis structure step by step/);
    expect(moleculeSearchCopy(getMoleculeReference("carbon-dioxide-co2")!).description).toContain("Why is CO2 linear?");
    expect(moleculeSearchCopy(getMoleculeReference("sulfate-ion-so4")!).title).toMatch(/^SO4 2- /);
    expect(moleculeSearchCopy(getMoleculeReference("nitrate-ion-no3")!).title).toMatch(/^NO3- /);
    for (const m of moleculeReferences) {
      const { title, description } = moleculeSearchCopy(m);
      expect(title, m.slug).not.toMatch(/[₀-₉⁰¹²³⁴-⁹]/);
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(description.length, description).toBeLessThanOrEqual(160);
      expect(description.toLowerCase()).toContain("electron geometry");
    }
  });
  it("adds sourced background, Lewis bookkeeping, family trends, and a class-specific mistake", () => {
    expect(Object.keys(moleculeAbout).length).toBeGreaterThanOrEqual(100);
    for (const [formula, entry] of Object.entries(moleculeAbout)) {
      expect(moleculeReferences.some((m) => m.formula === formula), formula).toBe(true);
      expect(entry.source).toMatch(/^https:\/\//);
      expect(entry.about.split(/\s+/).length, formula).toBeGreaterThanOrEqual(70);
    }
    for (const [formula, entry] of Object.entries(bondLengths)) {
      expect(moleculeReferences.some((m) => m.formula === formula), formula).toBe(true);
      expect(entry.source).toMatch(/^https:\/\//);
    }
    expect(lewisSteps(getMoleculeReference("water-h2o")!)?.total).toBe(8);
    expect(lewisSteps(getMoleculeReference("sulfate-ion-so4")!)?.total).toBe(32);
    expect(lewisSteps(getMoleculeReference("xenon-tetrafluoride-xef4")!)?.total).toBe(36);
    expect(lewisSteps(getMoleculeReference("permanganate-ion-mno4")!)).toBeUndefined();
    expect(moleculeFamily(getMoleculeReference("water-h2o")!).map((m) => m.formula)).toEqual(["H₂O", "H₂S", "H₂Se", "H₂Te"]);
    expect(moleculeReferences.every((m) => classMistake(m))).toBe(true);
  });
});
