import { describe, expect, it } from "vitest";
import { subjectsCatalog } from "@/lib/subjects/catalog";
import { activities, acidification, air, biodiversity, carbon, greenhouse, grid, initialValues, metrics, mission, resilience, seaLevel, urbanHeat, watershed, type Values } from "@/lib/simulations/environmentalLabs/model";

const values=(slug:string,changes:Values={})=>({...initialValues(activities.find(activity=>activity.slug===slug)!),...changes});
const solutions:Record<string,Values>={
 "greenhouse-effect-simulator":{co2:380,methane:900,albedo:.32},
 "carbon-cycle-simulator":{emissions:20,forest:10,ocean:8,removal:5},
 "sea-level-rise-simulator":{warming:1,years:80,subsidence:0},
 "ocean-acidification-simulator":{co2:350,warming:.5,nutrients:10},
 "renewable-energy-grid-simulator":{demand:100,solar:200,wind:100,hydro:40,storage:30,gas:20},
 "air-pollution-smog-simulator":{traffic:10,industry:10,wind:8,inversion:10,sunlight:40},
 "deforestation-water-cycle-simulator":{forest:90,rain:40,slope:5,compaction:10},
 "biodiversity-habitat-fragmentation":{habitat:90,patches:2,corridor:90,pollution:10},
 "urban-heat-island-simulator":{trees:60,coolRoofs:100,permeable:80,temperature:30},
 "climate-resilience-city-builder":{hazard:30,wetlands:20,drainage:20,shade:20,barriers:20,warning:20},
};

describe("Environmental Science & Climate missions",()=>{
 it("replaces every catalog card with exactly one working model",()=>{
  expect(activities).toHaveLength(10);
  expect(activities.map(a=>a.slug).sort()).toEqual(subjectsCatalog["environmental-science"].simulations.map(s=>s.slug).sort());
  for(const activity of activities)expect(mission(activity.slug,values(activity.slug,solutions[activity.slug]),true).ok,activity.slug).toBe(true);
 });
 it("requires a complete run and does not pass at the default settings",()=>{for(const activity of activities){expect(mission(activity.slug,initialValues(activity),false).ok,activity.slug).toBe(false);expect(mission(activity.slug,initialValues(activity),true).ok,activity.slug).toBe(false);}});
 it("responds in the expected direction to climate and pollution drivers",()=>{
  expect(greenhouse({co2:560,methane:700,albedo:.3}).forcing).toBeGreaterThan(greenhouse({co2:280,methane:700,albedo:.3}).forcing);
  expect(carbon({emissions:40,forest:5,ocean:5,removal:0}).ppm).toBeGreaterThan(carbon({emissions:20,forest:10,ocean:8,removal:5}).ppm);
  expect(seaLevel({warming:3,years:80,subsidence:0}).total).toBeGreaterThan(seaLevel({warming:1,years:80,subsidence:0}).total);
  expect(acidification({co2:800,warming:2,nutrients:50}).ph).toBeLessThan(acidification({co2:350,warming:1,nutrients:10}).ph);
  expect(air({traffic:80,industry:70,wind:1,inversion:80,sunlight:90}).aqi).toBeGreaterThan(air({traffic:10,industry:10,wind:8,inversion:10,sunlight:40}).aqi);
 });
 it("keeps conservation and adaptation indices bounded and finite",()=>{
  const gridResult=grid(solutions["renewable-energy-grid-simulator"]),waterResult=watershed(solutions["deforestation-water-cycle-simulator"]),habitatResult=biodiversity(solutions["biodiversity-habitat-fragmentation"]);
  const samples=[gridResult,waterResult,habitatResult,urbanHeat(solutions["urban-heat-island-simulator"]),resilience(solutions["climate-resilience-city-builder"])];
  for(const sample of samples)for(const value of Object.values(sample))expect(Number.isFinite(value)).toBe(true);
  expect(gridResult.reliability).toBeLessThanOrEqual(100);expect(waterResult.infiltration).toBeLessThanOrEqual(100);expect(habitatResult.connectivity).toBeLessThanOrEqual(100);
 });
 it("evaluates safely at every control boundary",()=>{for(const activity of activities)for(const end of ["min","max"] as const){const v=Object.fromEntries(activity.controls.map(control=>[control.key,control[end]]));expect(()=>metrics(activity.slug,v)).not.toThrow();expect(()=>mission(activity.slug,v,true)).not.toThrow();}});
});
