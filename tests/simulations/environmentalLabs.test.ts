import { describe, expect, it } from "vitest";
import { subjectsCatalog } from "@/lib/subjects/catalog";
import { activities, initialValues, normalizeValues, type Values } from "@/lib/simulations/environmentalLabs/model";
import { carbonateChemistry, experimentCsv, habitatNetwork, runExperiment } from "@/lib/simulations/environmentalLabs/engine";
const activity=(slug:string)=>activities.find(a=>a.slug===slug)!;
const run=(slug:string,changes:Values={})=>runExperiment(slug,{...initialValues(activity(slug)),...changes});
const final=(slug:string,changes:Values={})=>run(slug,changes).samples.at(-1)!;

describe("Environmental experiments: physical behavior and bookkeeping",()=>{
 it("provides a deterministic finite trajectory for every catalog lab, scenario, and control boundary",()=>{
  expect(activities.map(a=>a.slug).sort()).toEqual(subjectsCatalog["environmental-science"].simulations.map(s=>s.slug).sort());
  for(const a of activities){
   const inputs=[initialValues(a),...a.presets.map(p=>({...initialValues(a),...p.values})),...["min","max"].map(end=>Object.fromEntries(a.controls.map(c=>[c.key,c[end as "min"|"max"]])))];
   for(const input of inputs){const e=runExperiment(a.slug,input);expect(e.samples).toHaveLength(121);expect(e.samples[0].time).toBe(0);expect(e.samples.at(-1)!.time).toBeCloseTo(e.duration);for(const s of e.samples)for(const value of Object.values(s))expect(Number.isFinite(value),`${a.slug}: ${value}`).toBe(true);}
   expect(run(a.slug)).toEqual(run(a.slug));
  }
 });
 it("keeps the preindustrial energy reference balanced and resolves slow ocean warming",()=>{
  const slug="greenhouse-effect-simulator",ref=run(slug,{co2:280,methane:700,albedo:.3});
  expect(ref.samples.every(s=>s.surface===0&&s.deep===0&&s.imbalance===0)).toBe(true);
  const double=run(slug,{co2:560,methane:700,albedo:.3});
  expect(double.samples[0].forcing).toBeCloseTo(5.35*Math.log(2));
  const last=double.samples.at(-1)!;expect(last.surface).toBeGreaterThan(last.deep);expect(last.imbalance).toBeLessThan(double.samples[0].imbalance);
  expect(final(slug,{co2:280,methane:700,albedo:.34}).surface).toBeLessThan(0);
  expect(last.absorbed-last.outgoing).toBeCloseTo(last.imbalance);
 });
 it("conserves atmospheric plus stored carbon and avoids an artificial 280 ppm floor",()=>{
  for(const changes of ([{},{emissions:0,removal:25}] as Values[])){
   const e=run("carbon-cycle-simulator",changes);for(const s of e.samples)expect((s.ppm-420)*7.8+s.stored).toBeCloseTo(s.emitted,7);
  }
  expect(final("carbon-cycle-simulator",{emissions:0,removal:25,forest:18,ocean:14}).ppm).toBeLessThan(280);
  expect(final("carbon-cycle-simulator",{emissions:19,forest:9,ocean:10,removal:0}).ppm).toBeCloseTo(420);
 });
 it("separates local subsidence from global sea-level contributions",()=>{
  const stable=final("sea-level-rise-simulator",{subsidence:0}),sinking=final("sea-level-rise-simulator",{subsidence:4});
  expect(sinking.total-stable.total).toBeCloseTo(4*80/1000,8);expect(sinking.thermal).toBe(stable.thermal);expect(sinking.ice).toBe(stable.ice);
  expect(sinking.total).toBeCloseTo(sinking.thermal+sinking.ice+sinking.local);
 });
 it("solves alkalinity balance, responds logarithmically in pH and reduces carbonate with added CO₂",()=>{
  for(const co2 of [280,420,900]){const m=carbonateChemistry(co2),h=m.hydrogen/1e9,dissolved=m.dissolved/1e6;expect(1e-6*dissolved/h+2*m.carbonate/1e6+1e-14/h-h).toBeCloseTo(.0023,10);expect(10**-m.ph*1e9).toBeCloseTo(m.hydrogen);}
  const a=carbonateChemistry(280),b=carbonateChemistry(560);expect(b.ph).toBeLessThan(a.ph);expect(b.carbonate).toBeLessThan(a.carbonate);expect(b.hydrogen).toBeGreaterThan(a.hydrogen);
 });
 it("never invents battery energy and balances every grid dispatch",()=>{
  for(const changes of ([{},{solar:300,wind:100,storage:500},{solar:0,wind:0,hydro:0,gas:0,storage:500}] as Values[])){
   const e=run("renewable-energy-grid-simulator",changes);
   expect(e.samples[0].soc).toBe(0);
   for(const s of e.samples){expect(s.soc).toBeGreaterThanOrEqual(0);expect(s.soc).toBeLessThanOrEqual(e.values.storage);expect(s.charge).toBeLessThanOrEqual(e.values.storage/4+1e-9);expect(s.discharge).toBeLessThanOrEqual(e.values.storage/4+1e-9);expect(Math.min(s.renewable,s.demand)+s.discharge+s.gas+s.unmet).toBeCloseTo(s.demand,8);expect(s.renewable).toBeCloseTo(Math.min(s.renewable,s.demand)+s.charge+s.curtail,8);}
   const charged=e.summary.find(x=>x.label==="Battery charged")!.value,discharged=e.summary.find(x=>x.label==="Battery discharged")!.value;
   expect(charged*Math.sqrt(.9)-discharged/Math.sqrt(.9)).toBeCloseTo(e.samples.at(-1)!.soc,7);
  }
  const empty=run("renewable-energy-grid-simulator",{solar:0,wind:0,hydro:0,gas:0,storage:500});expect(empty.samples.every(s=>s.soc===0&&s.discharge===0&&s.unmet===s.demand)).toBe(true);
 });
 it("ventilates pollution while preserving finite concentrations under still air",()=>{
  const still=run("air-pollution-smog-simulator",{wind:0}),wind=run("air-pollution-smog-simulator",{wind:8});
  expect(Math.max(...still.samples.map(s=>s.pm))).toBeGreaterThan(Math.max(...wind.samples.map(s=>s.pm)));
  expect(run("air-pollution-smog-simulator",{traffic:0,industry:0}).samples.every(s=>s.pm===4&&s.ozone===25)).toBe(true);
 });
 it("conserves every drop of storm rain and makes compaction increase runoff",()=>{
  for(const changes of ([{},{forest:100,compaction:0},{forest:0,compaction:100,rain:100}] as Values[]))for(const s of run("deforestation-water-cycle-simulator",changes).samples)expect(s.rainfall).toBeCloseTo(s.interception+s.infiltration+s.runoff,8);
  expect(final("deforestation-water-cycle-simulator",{compaction:90}).runoff).toBeGreaterThan(final("deforestation-water-cycle-simulator",{compaction:0}).runoff);
 });
 it("preserves total mapped habitat area and makes corridors improve colonization",()=>{
  const slug="biodiversity-habitat-fragmentation",values=initialValues(activity(slug));
  const area=(patches:number)=>habitatNetwork({...values,patches}).nodes.reduce((sum,n)=>sum+Math.PI*n.radius*n.radius,0);
  expect(area(2)).toBeCloseTo(area(12),8);
  expect(final(slug,{corridor:90}).occupancy).toBeGreaterThan(final(slug,{corridor:0}).occupancy);
  for(const s of run(slug).samples)expect(s.occupancy).toBeGreaterThanOrEqual(0);
 });
 it("retains heat after sunset and responds to shade without changing regional weather",()=>{
  const original=run("urban-heat-island-simulator"),green=run("urban-heat-island-simulator",{trees:60});
  const evening=original.samples.find(s=>s.time===22)!;expect(evening.anomaly).toBeGreaterThan(0);
  expect(green.samples.map(s=>s.reference)).toEqual(original.samples.map(s=>s.reference));expect(Math.max(...green.samples.map(s=>s.local))).toBeLessThan(Math.max(...original.samples.map(s=>s.local)));
 });
 it("enforces adaptation budget and does not let warning remove floodwater",()=>{
  const slug="climate-resilience-city-builder",plain=run(slug,{wetlands:0,drainage:0,shade:0,barriers:0,warning:0}),warn=run(slug,{wetlands:0,drainage:0,shade:0,barriers:0,warning:40});
  expect(plain.samples.map(s=>s.ponding)).toEqual(warn.samples.map(s=>s.ponding));expect(Math.max(...warn.samples.map(s=>s.exposure))).toBeLessThan(Math.max(...plain.samples.map(s=>s.exposure)));
  for(const s of warn.samples)expect(s.stormInput).toBeCloseTo(s.wetland+s.ponding+s.drained,8);
  const max=normalizeValues(activity(slug),{hazard:80,wetlands:40,drainage:40,shade:40,barriers:40,warning:40});expect(max.wetlands+max.drainage+max.shade+max.barriers+max.warning).toBeCloseTo(100);
 });
 it("exports reproducible inputs, units, time steps and a model-version label",()=>{
  const e=run("carbon-cycle-simulator"),csv=experimentCsv(e);expect(csv).toContain('"Model version","environmental-2"');expect(csv).toContain('"Input","emissions",');expect(csv).toContain('"time (years)"');expect(csv).toContain('"ppm (ppm)"');expect(csv.split("\r\n")).toHaveLength(3+activity(e.slug).controls.length+1+121);
 });
});
