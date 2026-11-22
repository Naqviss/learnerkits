import { describe, expect, it } from "vitest";
import { investigations, investigationSlugs, populationNames } from "@/lib/simulations/practical/investigations";
import { readings, planetEncounter, populationChange } from "@/lib/simulations/practical/investigation-models";

describe("investigation models", () => {
  it.each(investigationSlugs)("%s gives finite measurements across its controls and timeline", slug => {
    const lab = investigations[slug];
    for (const control of [lab.min,lab.initial,lab.max]) {
      for (const time of [0,lab.duration/2,lab.duration]) {
        expect(readings(slug,control,time).every(r => Number.isFinite(r.value))).toBe(true);
      }
    }
  });
  it("reproduces the numerical examples used by learners", () => {
    expect(readings("fluid-dynamics-simulator",2,0).map(r=>r.value)).toEqual([2,1.5,0]);
    expect(readings("water-impact-simulator",1,5)[2].value).toBeCloseTo(117);
    expect(planetEncounter(10,40).separation).toBe(2);
    expect(planetEncounter(10,40).speed).toBeGreaterThan(planetEncounter(3,40).speed);
    expect(readings("projectile-target-simulator",33,4)[2].value).toBeCloseTo(readings("projectile-target-simulator",57,4)[2].value);
    expect(readings("population-ecosystem-simulator",50,20)[0].value).toBe(1000);
    expect(readings("deforestation-simulator",2,100)[0].value).toBeCloseTo(132.62,2);
    expect(readings("ocean-pollution-simulator",10,100)[1].value).toBe(22);
    expect(readings("carbon-footprint-simulator",50,30)[2].value).toBe(90000);
    expect(readings("animated-world-map",-90,18)[1].value).toBe(12);
    expect(readings("country-border-simulator",50,10)[1].value).toBe(20);
    expect(readings("climate-zones-map",3,100)[1].value).toBe(26);
    expect(readings("natural-disaster-map",20,24)[2].value).toBe(480);
    expect(readings("population-growth-map",populationNames.indexOf("Nigeria"),20)[2].value).toBeCloseTo(69.32,2);
    expect(populationChange("World",20)).toBeCloseTo(27.47,2);
  });
});
