import { describe, expect, it } from "vitest";
import { subjectsCatalog } from "@/lib/subjects/catalog";
import { activities, arrivals, distanceFromGap, initialValues, initialJourney, mission, ocean, plate, river, tsunami, volcano, hurricane, front, stationData, stations, events, travel, type Values } from "@/lib/simulations/geographyLabs/model";

const values=(slug:string,changes:Values={})=>({...initialValues(activities.find(a=>a.slug===slug)!),...changes});
const rockTour=()=>["Cool","Weather","Compact & cement","Heat & pressure","Melt","Cool"].reduce((j,a)=>travel(j,a),initialJourney());
const waterTour=()=>["Evaporate","Condense","Precipitate","Infiltrate","Groundwater discharge","River outflow"].reduce((j,a)=>travel(j,a,true),initialJourney(true));
describe("Geography & Earth expeditions",()=>{
 it("replaces every catalog placeholder with an achievable expedition",()=>{
  expect(activities.map(a=>a.slug).sort()).toEqual(subjectsCatalog.geography.simulations.map(s=>s.slug).sort());
  const solutions:Record<string,Values>={"seismic-wave-lab":{estimate:280},"plate-motion-lab":{speed:5,years:10,heading:0},"volcano-eruption-3d":{gas:1,viscosity:2},"earthquake-epicenter-finder":{x:350,y:220},"plate-tectonics-3d":{landform:1},"tsunami-3d":{estimate:17},"hurricane-simulator":{temperature:29,shear:5},"weather-front-simulator":{humidity:85},"river-erosion":{depth:.5,slope:.03},"rock-cycle-challenge":{},"water-cycle-adventure":{},"ocean-currents-3d":{}};
  for(const a of activities)expect(mission(a.slug,values(a.slug,solutions[a.slug]),true,a.slug==="water-cycle-adventure"?waterTour():rockTour()).ok,a.slug).toBe(true);
 });
 it("requires a completed run for all experiment missions",()=>{for(const a of activities.filter(a=>a.run))expect(mission(a.slug,initialValues(a),false,initialJourney()).ok,a.slug).toBe(false);});
 it("inverts S–P gaps and triangulates all three earthquakes",()=>{
  for(const d of [0,10,100,280,600]){const a=arrivals(d);expect(a.s).toBeGreaterThanOrEqual(a.p);expect(distanceFromGap(a.gap)).toBeCloseTo(d);}
  events.forEach((e,i)=>{stationData(i).forEach((s,k)=>expect(distanceFromGap(s.gap)).toBeCloseTo(Math.hypot(e.x-stations[k].x,e.y-stations[k].y)));expect(mission("earthquake-epicenter-finder",{event:i,...e},false,initialJourney())).toMatchObject({ok:true,required:3,step:String(i)});});
 });
 it("converts plate velocity and rotates its displacement vector",()=>{expect(plate({speed:5,years:10,heading:0})).toMatchObject({distance:500,x:500,y:0});expect(plate({speed:5,years:10,heading:90}).y).toBeCloseTo(500);expect(plate({speed:5,years:10,heading:180}).x).toBeCloseTo(-500);});
 it("supports all evidence stamps for comparison missions",()=>{
  const attempts:Record<string,Values[]>={"volcano-eruption-3d":[{gas:1,viscosity:2},{gas:6,viscosity:6}],"plate-tectonics-3d":[{boundary:0,landform:1},{boundary:1,landform:2},{boundary:2,landform:3}],"hurricane-simulator":[{temperature:29,shear:5},{temperature:29,shear:30}],"weather-front-simulator":[{front:0,humidity:85},{front:1,humidity:85}],"ocean-currents-3d":[{fresh:35},{fresh:27}]};
  for(const [slug,vs] of Object.entries(attempts)){const results=vs.map(v=>mission(slug,values(slug,v),true,initialJourney()));expect(results.every(r=>r.ok),slug).toBe(true);expect(new Set(results.map(r=>r.step)).size,slug).toBe(results[0].required);}
 });
 it("makes deep-water waves faster without making speed depend on amplitude",()=>{
  const v=values("tsunami-3d"),a=tsunami(v),b=tsunami({...v,depth:v.depth*4});expect(b.speed).toBeCloseTo(a.speed*2);expect(b.minutes).toBeCloseTo(a.minutes/2);expect(tsunami({...v,uplift:2}).speed).toBe(a.speed);expect(tsunami({...v,uplift:2}).coastal).toBeCloseTo(a.coastal*2);
 });
 it("responds to shear, equatorial rotation and cloud-base humidity",()=>{
  const v=values("hurricane-simulator",{temperature:30,shear:0});expect(hurricane(v).index).toBe(1);expect(hurricane({...v,shear:30}).index).toBe(0);expect(hurricane({...v,latitude:0}).index).toBe(0);expect(hurricane({...v,latitude:-20}).coriolis).toBeCloseTo(-hurricane(v).coriolis);
  expect(front(values("weather-front-simulator",{humidity:100})).base).toBe(0);expect(front(values("weather-front-simulator",{front:1,humidity:20})).rain).toBe(false);
 });
 it("computes bed shear, flow continuity and the sand-only transport window",()=>{const v=values("river-erosion",{depth:.5,slope:.03}),r=river(v);expect(r.shear).toBeCloseTo(1.4715);expect(r.sand).toBe(true);expect(r.gravel).toBe(false);expect(r.flow).toBeCloseTo(r.velocity*v.depth*v.width);expect(river({...v,width:30}).shear).toBe(r.shear);});
 it("reverses density circulation with cooling or freshening and stops at equilibrium",()=>{const v=values("ocean-currents-3d");expect(ocean(v).delta).toBeGreaterThan(0);expect(ocean({...v,fresh:27}).delta).toBeLessThan(0);expect(ocean({...v,cold:v.warm,fresh:v.salty}).delta).toBe(0);});
 it("enforces valid rock and water transitions without inventing shortcuts",()=>{
  expect(travel(initialJourney(),"Weather")).toEqual(initialJourney());expect(travel(initialJourney(true),"Condense",true)).toEqual(initialJourney(true));
  expect(rockTour()).toMatchObject({state:"Igneous",moves:6});expect(waterTour()).toMatchObject({state:"Ocean",moves:6});
  expect(mission("rock-cycle-challenge",{},false,travel(initialJourney(),"Cool")).ok).toBe(false);expect(mission("water-cycle-adventure",{},false,initialJourney(true)).ok).toBe(false);
 });
 it("keeps all bounded teaching indices finite across control extremes",()=>{for(const gas of [0,8])for(const viscosity of [2,7]){const v=volcano({gas,viscosity});expect(v.index).toBeGreaterThanOrEqual(0);expect(v.index).toBeLessThanOrEqual(1);}for(const a of activities)for(const end of ["min","max"] as const){const v=Object.fromEntries(a.controls.map(c=>[c.key,c[end]]));expect(()=>mission(a.slug,v,true,initialJourney())).not.toThrow();}});
});
