import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { courseLabs, chemistryTopics } from "@/lib/simulations/chemistry/course/catalog";
import { atom, AVOGADRO, heating, vaporExchange, diffusionProfile, moleAmounts, dilution, buffer, equilibrium, equilibriumK, calorimetry, electrochemistry, enzyme, metalReaction } from "@/lib/simulations/chemistry/course/models";
import { rateConstant, solutionPH, solubilityResult } from "@/lib/simulations/chemistry/model";
import { courseReadings } from "@/components/subjects/chemistry/course/ChemistryCourseClient";
import { CourseScene } from "@/components/subjects/chemistry/course/CourseScene";
import { subjectsCatalog, hiddenSimulationSlugs } from "@/lib/subjects/catalog";
const defaults=(slug:string)=>Object.fromEntries(courseLabs.find(l=>l.slug===slug)!.controls.map(c=>[c.key,c.value]));

describe("chemistry course models",()=>{
 it("preserves particle counts and Hund occupancy across all supported electron counts",()=>{
  for(let electrons=0;electrons<=18;electrons++){
   const a=atom({protons:6,neutrons:8,electrons});
   expect(a.shells.reduce((s,n)=>s+n,0)).toBe(electrons);
   expect(a.orbitals.flatMap(o=>o.occupancy).reduce((s,n)=>s+n,0)).toBe(electrons);
   expect(a.mass).toBe(14);expect(a.charge).toBe(6-electrons);
  }
  expect(atom({protons:7,neutrons:7,electrons:7}).orbitals[2].occupancy).toEqual([1,1,1]);
  expect(atom({protons:8,neutrons:8,electrons:8}).orbitals[2].occupancy).toEqual([2,1,1]);
 });
 it("accounts for latent heat and conserves the two gas populations during diffusion",()=>{
  expect(heating(0).temperature).toBe(-20);
  expect(heating(209).temperature).toBe(0);expect(heating(209).fraction).toBeCloseTo(.5);
  expect(heating(1922.9).temperature).toBe(100);expect(heating(1922.9).fraction).toBeCloseTo(.5);
  expect(heating(794.4-1e-6).temperature).toBeCloseTo(100);
  for(const t of [0,.01,1,10,30])for(const T of [200,300,600]){
   const mean=Array.from({length:200},(_,i)=>diffusionProfile((i+.5)/200,t,T)).reduce((a,b)=>a+b,0)/200;
   expect(mean).toBeCloseTo(.5,10);
  }
  expect(diffusionProfile(0,10,600)).toBeLessThan(diffusionProfile(0,10,200));
 });
 it("distinguishes evaporation and condensation below boiling",()=>{
  const v={surfaceTemperature:25,humidity:50};
  expect(vaporExchange(v).saturation).toBeCloseTo(3.167,0);
  expect(vaporExchange(v).difference).toBeGreaterThan(0);
  expect(vaporExchange({...v,humidity:100}).difference).toBe(0);
  expect(vaporExchange({...v,humidity:120}).difference).toBeLessThan(0);
  expect(vaporExchange({...v,surfaceTemperature:80}).saturation).toBeGreaterThan(vaporExchange(v).saturation);
 });
 it("uses molar masses and conserves solute on dilution",()=>{
  const m=moleAmounts({...defaults("mole-mass-converter"),mass:18.015});
  expect(m.moles).toBe(1);expect(m.particles).toBe(AVOGADRO);
  const v=defaults("solution-concentration"),d=dilution(v);
  expect(d.concentration).toBeCloseTo(.1);expect(d.mmol).toBe(25);
  expect(dilution({...v,water:900}).mmol).toBe(d.mmol);
  expect(d.concentration*d.volume).toBeCloseTo(v.stock*v.aliquot);
 });
 it("satisfies buffer mass balance, charge balance and Ka even after exhaustion",()=>{
  const v=defaults("buffer-solutions");
  expect(buffer(v).ph).toBeCloseTo(-Math.log10(1.8e-5),2);
  for(const acid of [1,50,100])for(const base of [1,50,100])for(const dose of [-120,-50,0,50,120])for(const volume of [.5,2]){
   const b=buffer({...v,acid,base,dose,volume}),h=10**-b.ph;
   expect(b.acid+b.acetate).toBeCloseTo((acid+base)/1000/volume,12);
   expect(h+(base+dose)/1000/volume).toBeCloseTo(b.acetate+1e-14/h,10);
   expect(h*b.acetate/b.acid).toBeCloseTo(1.8e-5,9);
  }
  expect(buffer({...v,dose:120}).ph).toBeGreaterThan(12);
  expect(buffer({...v,dose:-120}).ph).toBeLessThan(2);
 });
 it("conserves equilibrium inventory with positive concentrations and convergent rates",()=>{
  const v=defaults("chemical-equilibrium");
  for(const a of [.1,3])for(const b of [0,3])for(const volume of [.5,5])for(const temperature of [270,400])for(const enthalpy of [0,1]){
   const input={...v,a,b,volume,temperature,enthalpy},e=equilibrium(input,1000);
   const start=equilibrium(input,0),later=equilibrium(input,100);
   expect(Math.abs(later.forward-later.reverse)).toBeLessThanOrEqual(Math.abs(start.forward-start.reverse));
   expect(e.a).toBeGreaterThan(0);expect(e.b).toBeGreaterThan(0);
   expect((e.a+e.b/2)*volume).toBeCloseTo(a+b/2,10);
   expect(e.forward).toBeCloseTo(e.reverse,5);
   expect(e.a).toBeCloseTo(e.eqA,5);expect(e.b).toBeCloseTo(e.eqB,5);
   expect(e.quotient).toBeCloseTo(e.k,4);
  }
  expect(equilibriumK({...v,temperature:350})).toBeGreaterThan(4);
  expect(equilibriumK({...v,temperature:350,enthalpy:1})).toBeLessThan(4);
  expect(equilibrium({...v,volume:.5}).eqB*.5).toBeLessThan(equilibrium({...v,volume:5}).eqB*5);
 });
 it("conserves calorimeter energy and estimates bond energy with the correct sign",()=>{
  const v=defaults("thermochemistry-calorimetry");
  for(const enthalpy of [-100,0,100])for(const mass of [100,500]){
   const c=calorimetry({...v,enthalpy,mass});
   expect(c.heat+c.capacity*c.delta).toBeCloseTo(0,10);
   expect(c.final).toBeGreaterThan(0);expect(c.final).toBeLessThan(100);
  }
  expect(calorimetry({...v,mode:1}).dh).toBe(-183);
 });
 it("uses the Nernst concentration direction and Faraday copper stoichiometry",()=>{
  const v=defaults("electrochemistry"),e=electrochemistry(v);
  expect(e.voltage).toBe(1.1);expect(e.mass).toBeCloseTo(.19758,4);
  expect(electrochemistry({...v,zinc:.01}).voltage).toBeGreaterThan(e.voltage);
  expect(electrochemistry({...v,current:2}).mass).toBeCloseTo(2*e.mass);
  expect(electrochemistry({...v,efficiency:50}).mass).toBeCloseTo(e.mass/2);
  for(let metal=0;metal<5;metal++)for(let ion=0;ion<5;ion++){
   const r=metalReaction({metal,ion});expect(r.stripCoefficient*r.metal.z).toBe(r.ionCoefficient*r.ion.z);
   expect(r.voltage).toBeCloseTo(-metalReaction({metal:ion,ion:metal}).voltage);
  }
 });
 it("models saturable enzyme kinetics and competitive inhibition",()=>{
  const v=defaults("biochemistry");
  expect(enzyme(v,0).rate).toBe(0);
  expect(enzyme(v,1).rate).toBe(.5);
  expect(enzyme({...v,inhibitor:3},1).rate).toBe(.2);
  expect(enzyme({...v,inhibitor:3}).vmax).toBe(enzyme(v).vmax);
  expect(enzyme(v,1e9).rate).toBeCloseTo(v.enzyme);
 });
 it("improves weak bases, area-dependent kinetics and solvent-dependent saturation",()=>{
  expect(solutionPH({solution:3,logC:-2})).toBeLessThan(solutionPH({solution:2,logC:-2}));
  expect(solutionPH({solution:3,logC:-7})).toBeGreaterThan(7);
  expect(solutionPH({solution:3,logC:-2})+solutionPH({solution:1,logC:-2})).toBeCloseTo(14);
  const v={temperature:298,catalyst:0,activation:40,area:3,rateMode:0};
  expect(rateConstant(v)).toBeCloseTo(.035);
  expect(rateConstant({...v,rateMode:1})).toBeCloseTo(3*.035);
  expect(rateConstant({...v,activation:50})).toBeLessThan(.035);
  const s=solubilityResult({temperature:50,water:50,solute:80});
  expect(s).toEqual({capacity:30,dissolved:30,crystals:50});
 });
 it("provides valid public links for every topic and excludes the hidden hunt",()=>{
  const slugs=subjectsCatalog.chemistry.simulations.map(s=>s.slug);
  expect(slugs).toHaveLength(26);
  for(const topic of chemistryTopics)for(const slug of topic.slugs){expect(slugs).toContain(slug);expect(hiddenSimulationSlugs.has(slug)).toBe(false);}
 });
 it.each(courseLabs.map(l=>[l.slug,l] as const))("renders every %s control endpoint without invalid model output",(_slug,lab)=>{
  const initial=defaults(lab.slug);
  for(const c of lab.controls)for(const value of c.options?c.options.map((_,i)=>i):[c.min,c.max]){
   const v={...initial,[c.key]:value};
   expect(JSON.stringify(courseReadings(lab.slug,v))).not.toMatch(/\b(?:NaN|Infinity|undefined)\b/);
   const html=renderToStaticMarkup(<CourseScene slug={lab.slug} v={v} onChange={()=>{}}/>);
   expect(html).not.toMatch(/\b(?:NaN|Infinity|undefined)\b/);
  }
 });
});
