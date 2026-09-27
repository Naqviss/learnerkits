import { describe, expect, it } from "vitest";
import { activities } from "@/lib/simulations/environmentalLabs/model";
import { buildTools, buildProblem, MAP_SIZE, createBuildState, editBuild } from "@/lib/simulations/environmentalLabs/builder";
import { runExperiment } from "@/lib/simulations/environmentalLabs/engine";
describe("Environmental city builder",()=>{
 it("provides scenario-linked projects for all ten labs",()=>{for(const a of activities){expect(buildTools[a.slug].length).toBeGreaterThan(0);for(const t of buildTools[a.slug])expect(a.controls.some(c=>c.key===t.key)).toBe(true);}});
 it("builds a tree grove, changes the heat result, moves without changing totals, and reverses removal exactly",()=>{
  const slug="urban-heat-island-simulator",start=createBuildState(slug),built=editBuild(slug,start,{type:"place",tool:"trees",col:4,row:4});
  expect(built.ok).toBe(true);expect(start.values.trees).toBe(10);expect(built.state.values.trees).toBe(20);
  const before=runExperiment(slug,start.values),after=runExperiment(slug,built.state.values);expect(after.samples.at(-1)!.local).toBeLessThan(before.samples.at(-1)!.local);
  const moved=editBuild(slug,built.state,{type:"move",id:1,col:5,row:4});expect(moved.ok).toBe(true);expect(moved.state.values).toEqual(built.state.values);expect(moved.state.placements[0].col).toBe(5);
  const removed=editBuild(slug,moved.state,{type:"remove",id:1});expect(removed.state.values).toEqual(start.values);expect(removed.state.placements).toEqual([]);
 });
 it("rejects roads, occupied plots, wrong terrain and out-of-map coordinates without modifying state",()=>{
  const slug="urban-heat-island-simulator",start=createBuildState(slug),built=editBuild(slug,start,{type:"place",tool:"trees",col:4,row:4}).state;
  for(const [col,row] of [[1,1],[4,5],[4,4],[-1,0],[MAP_SIZE,3],[7,2]]){const result=editBuild(slug,built,{type:"place",tool:"trees",col,row});expect(result.ok).toBe(false);expect(result.state).toBe(built);}
 });
 it("enforces scientific control bounds and the city adaptation budget",()=>{
  const heat=createBuildState("urban-heat-island-simulator");heat.values.trees=60;expect(editBuild("urban-heat-island-simulator",heat,{type:"place",tool:"trees",col:4,row:4}).ok).toBe(false);
  const slug="climate-resilience-city-builder",city=createBuildState(slug);city.values={hazard:80,wetlands:20,drainage:20,shade:20,barriers:20,warning:20};const over=editBuild(slug,city,{type:"place",tool:"shade",col:4,row:4});expect(over.ok).toBe(false);expect(over.message).toContain("100-point budget");expect(over.state).toBe(city);
 });
 it("keeps placement previews consistent with terrain, occupied plots, model limits and budgets",()=>{
  for(const slug of ["urban-heat-island-simulator","climate-resilience-city-builder","renewable-energy-grid-simulator"]){
   const state=createBuildState(slug);
   if(slug==="climate-resilience-city-builder")for(const key of ["wetlands","drainage","shade","barriers","warning"])state.values[key]=20;
   if(slug==="urban-heat-island-simulator")state.values.trees=60;
   for(const tool of buildTools[slug])for(const [col,row] of [[1,4],[4,4],[10,4],[13,2],[15,12],[MAP_SIZE,3]]){
    expect(buildProblem(slug,state,tool,col,row)===null).toBe(editBuild(slug,state,{type:"place",tool:tool.id,col,row}).ok);
   }
  }
 });
 it("allows water infrastructure only on water and adds no free stored energy",()=>{
  const slug="renewable-energy-grid-simulator",state=createBuildState(slug);
  expect(editBuild(slug,state,{type:"place",tool:"hydro",col:4,row:4}).ok).toBe(false);
  expect(editBuild(slug,state,{type:"place",tool:"hydro",col:1,row:4}).ok).toBe(true);
  const battery=editBuild(slug,state,{type:"place",tool:"battery",col:4,row:4});expect(battery.state.values.storage).toBe(150);expect(runExperiment(slug,battery.state.values).samples[0].soc).toBe(0);
 });
});
