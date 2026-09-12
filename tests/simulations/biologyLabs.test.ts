import { describe, expect, it } from "vitest";
import { subjectsCatalog } from "@/lib/subjects/catalog";
import { activities, dnaComplement, heartRoute, immuneTurn, initialImmune, initialValues, logistic, mission, photosynthesis, predatorPrey, rechallenge, rnaTarget, proteinTarget, selection, sequenceMove, transport, validFoodEdges, type ImmuneAction, type Values } from "@/lib/simulations/biologyLabs/model";

const values=(slug:string,changes:Values={})=>({...initialValues(activities.find(a=>a.slug===slug)!),...changes});
function immunity(){let state=initialImmune();for(const action of ["Activate B cells","Antibody strike","Antibody strike"] as ImmuneAction[])state=immuneTurn(state,action);state=rechallenge(state);for(const action of ["Antibody strike","Antibody strike"] as ImmuneAction[])state=immuneTurn(state,action);return state;}
describe("biology missions",()=>{
 it("replaces every biology placeholder and makes every badge achievable",()=>{
  expect(activities.map(a=>a.slug).sort()).toEqual(subjectsCatalog.biology.simulations.map(s=>s.slug).sort());
  const solutions:Record<string,{v?:Values;extra?:Parameters<typeof mission>[3]}>={
   "population-growth":{},"predator-prey":{},"animal-cell-3d":{v:{organelle:0,function:1}},"cell-membrane-transport":{},
   "mitosis-challenge":{extra:{sequence:{index:6,mistakes:0}}},"dna-replication":{extra:{dna:dnaComplement}},"protein-synthesis":{extra:{rna:rnaTarget,protein:proteinTarget}},
   "human-heart-3d":{extra:{heart:heartRoute.length-1}},"natural-selection":{},"food-web-builder":{v:{removed:1,prediction:1},extra:{edges:validFoodEdges}},
   "photosynthesis-lab":{v:{light:70,co2:600,temperature:25}},"immune-system-defense":{extra:{immune:immunity()}},
  };
  for(const a of activities){const x=solutions[a.slug];expect(mission(a.slug,values(a.slug,x.v),true,x.extra).ok,a.slug).toBe(true);}
 });
 it("requires an actual completed run for dynamic experiments",()=>{for(const a of activities.filter(a=>a.run))expect(mission(a.slug,initialValues(a),false).ok,a.slug).toBe(false);});
 it("approaches carrying capacity without crossing it",()=>{const v=values("population-growth");expect(logistic(v,0)).toBeCloseTo(v.initial);expect(logistic(v,20)).toBeGreaterThan(.9*v.capacity);for(let t=0;t<=100;t++)expect(logistic(v,t)).toBeLessThanOrEqual(v.capacity);expect(logistic({...v,initial:v.capacity},20)).toBe(v.capacity);});
 it("produces a persistent coupled predator–prey cycle",()=>{const p=predatorPrey(values("predator-prey")),prey=p.map(x=>x.a),pred=p.map(x=>x.b!);expect(Math.min(...prey)).toBeGreaterThan(10);expect(Math.min(...pred)).toBeGreaterThan(5);expect(Math.max(...prey)-Math.min(...prey)).toBeGreaterThan(100);expect(Math.max(...pred)-Math.min(...pred)).toBeGreaterThan(20);expect(p).toHaveLength(61);});
 it("allows passive movement only downhill and active movement only with ATP",()=>{
  expect(transport(values("cell-membrane-transport"))).toMatchObject({valid:true,kind:"Simple diffusion",downhill:true});
  expect(transport(values("cell-membrane-transport",{molecule:1,transport:1}))).toMatchObject({valid:true,kind:"Facilitated diffusion"});
  expect(transport(values("cell-membrane-transport",{molecule:1,transport:1,open:0})).valid).toBe(false);
  expect(transport(values("cell-membrane-transport",{molecule:2,transport:2,outside:20,inside:80,direction:0,atp:1}))).toMatchObject({valid:true,kind:"Active transport",downhill:false});
  expect(transport(values("cell-membrane-transport",{molecule:2,transport:2,outside:20,inside:80,direction:0,atp:0})).valid).toBe(false);
 });
 it("rejects skipped mitosis stages",()=>{let state={index:0,mistakes:0};state=sequenceMove(state,3);expect(state).toEqual({index:0,mistakes:1});for(let i=1;i<=6;i++)state=sequenceMove(state,i);expect(state).toEqual({index:6,mistakes:1});});
 it("changes trait frequency through differential fitness, not acquired change",()=>{const rise=selection(values("natural-selection")).at(-1)!.a,fall=selection(values("natural-selection",{darkFitness:.75,lightFitness:1.25})).at(-1)!.a;expect(rise).toBeGreaterThan(99);expect(fall).toBeLessThan(1);expect(selection(values("natural-selection",{darkFitness:1,lightFitness:1})).every(p=>p.a===50)).toBe(true);});
 it("combines limiting factors and honors the resource-budget target",()=>{const target={light:70,co2:600,temperature:25};expect(photosynthesis(target)).toBeGreaterThan(80);expect(photosynthesis({...target,light:0})).toBe(0);expect(photosynthesis({...target,co2:0})).toBe(0);expect(photosynthesis({...target,temperature:0})).toBeLessThan(photosynthesis(target));expect(mission("photosynthesis-lab",{...target,light:100},true).ok).toBe(false);});
 it("requires exact food-web direction and the trophic prediction",()=>{expect(mission("food-web-builder",{removed:1,prediction:1},false,{edges:validFoodEdges}).ok).toBe(true);expect(mission("food-web-builder",{removed:1,prediction:1},false,{edges:[...validFoodEdges,"Hawk→Rabbit"]}).ok).toBe(false);expect(mission("food-web-builder",{removed:1,prediction:2},false,{edges:validFoodEdges}).ok).toBe(false);});
 it("creates immune memory and clears a second exposure while preserving tissue",()=>{const won=immunity();expect(won).toMatchObject({exposure:2,cleared:true,won:true,memory:1});expect(won.tissue).toBeGreaterThan(80);expect(rechallenge(initialImmune())).toEqual(initialImmune());expect(immuneTurn({...initialImmune(),energy:0},"Innate cells")).toEqual({...initialImmune(),energy:0});});
 it("uses unique evidence stamps for all comparison missions",()=>{
  const cell=Array.from({length:6},(_,organelle)=>mission("animal-cell-3d",{organelle,function:organelle+1},false));expect(cell.every(r=>r.ok)).toBe(true);expect(new Set(cell.map(r=>r.step)).size).toBe(6);
  const membrane:Values[]=[{}, {molecule:1,transport:1}, {molecule:2,transport:2,outside:20,inside:80,direction:0}];const membraneResults=membrane.map(v=>mission("cell-membrane-transport",values("cell-membrane-transport",v),true));expect(membraneResults.every(r=>r.ok)).toBe(true);expect(new Set(membraneResults.map(r=>r.step)).size).toBe(3);
  const selectionCases:Values[]=[{}, {darkFitness:.75,lightFitness:1.25}];const selectionResults=selectionCases.map(v=>mission("natural-selection",values("natural-selection",v),true));expect(selectionResults.every(r=>r.ok)).toBe(true);expect(new Set(selectionResults.map(r=>r.step)).size).toBe(2);
 });
});
