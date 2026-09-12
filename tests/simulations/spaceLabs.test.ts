import { describe, expect, it } from "vitest";
import { subjectsCatalog } from "@/lib/subjects/catalog";
import { FixedStepRunner } from "@/lib/simulations/fixedStep";
import { activities, initialValues, phaseFraction, eclipse, orbital, orbitTrace, flyby, kepler, seasons, blackHole, initialMars, stepMars, checkMission, type Values, type MarsState } from "@/lib/simulations/spaceLabs/model";

const values=(slug:string, override:Values={})=>({...initialValues(activities.find(a=>a.slug===slug)!),...override});
function descent(assist:number,fuel=400){let s:MarsState={...initialMars(),status:"flying",fuel};for(let i=0;i<120*300&&s.status==="flying";i++)s=stepMars(s,{assist,throttle:0},1/120);return s;}
describe("space laboratories",()=>{
  it("replaces all ten placeholders with achievable missions",()=>{
    expect(activities.map(a=>a.slug).sort()).toEqual(subjectsCatalog.space.simulations.map(s=>s.slug).filter(s=>!["moon-landing","orbital-rescue"].includes(s)).sort());
    const solutions:Record<string,Values>={"moon-phases-3d":{angle:90},"solar-eclipse-3d":{offset:0,distance:356000},"escape-velocity":{speed:11},"gravity-slingshot":{},"keplers-laws-orbit":{axis:1.59,eccentricity:.6},"earth-seasons-tilt":{latitude:60,longitude:90},"satellite-orbit-builder":{speedScale:100,inclination:28},"planet-size-comparison-3d":{planetB:4,answer:3},"black-hole-orbit":{radius:3.5},"mars-landing-challenge":{}};
    for(const a of activities)expect(checkMission(a.slug,values(a.slug,solutions[a.slug]),true,descent(1)).ok,a.slug).toBe(true);
  });
  it("records distinct phases and both eclipse geometries",()=>{
    [0,90,180,270].forEach((angle,i)=>{expect(phaseFraction(angle)).toBeCloseTo([0,.5,1,.5][i]);expect(checkMission("moon-phases-3d",{angle},false,initialMars())).toMatchObject({ok:true,step:String(i),required:4});});
    expect(eclipse({offset:0,distance:356000})).toMatchObject({kind:"Total",coverage:1});
    expect(eclipse({offset:0,distance:406000}).kind).toBe("Annular");
    expect(eclipse({offset:.8,distance:384000}).coverage).toBe(0);
    expect(eclipse({offset:.25,distance:384000}).kind).toBe("Partial");
  });
  it("integrates circular orbits and detects surface impacts and escape",()=>{
    const v=values("satellite-orbit-builder",{speedScale:100});const o=orbital(v,true);
    expect(o.eccentricity).toBeCloseTo(0);expect(o.perigee).toBeCloseTo(400);
    for(const p of orbitTrace(v,true).points)expect(Math.hypot(p.x,p.y)).toBeCloseTo(1,3);
    expect(orbitTrace({...v,speedScale:75},true).status).toBe("Surface impact");
    expect(orbitTrace(values("escape-velocity",{speed:11})).status).toBe("Outbound");
    expect(checkMission("escape-velocity",values("escape-velocity",{speed:11}),false,initialMars()).ok).toBe(false);
  });
  it("conserves planet-relative flyby speed while changing solar-frame speed",()=>{
    const f=flyby(values("gravity-slingshot"));expect(Math.hypot(...f.incoming)).toBeCloseTo(8);expect(Math.hypot(...f.outgoing)).toBeCloseTo(8);expect(f.gain).toBeGreaterThan(5);
  });
  it("matches Kepler perihelion, aphelion and period",()=>{
    const near=kepler(2,.5,0),far=kepler(2,.5,Math.PI);expect(near.radius).toBeCloseTo(1);expect(far.radius).toBeCloseTo(3);expect(near.speed).toBeCloseTo(far.speed*3);expect(near.period**2).toBeCloseTo(8);
  });
  it("bounds daylight and responds to opposite seasons",()=>{
    const v={latitude:60,tilt:23.5,longitude:90};expect(seasons(v).daylight).toBeGreaterThan(18);expect(seasons({...v,longitude:270}).daylight).toBeLessThan(6);expect(seasons({...v,tilt:0}).daylight).toBe(12);expect(seasons({...v,latitude:70}).daylight).toBe(24);
    expect(blackHole({mass:10,radius:3}).stable).toBe(false);expect(blackHole({mass:10,radius:3.5}).stable).toBe(true);
  });
  it("lands with feedback assist and crashes without thrust",()=>{
    const landed=descent(1);expect(landed.status).toBe("landed");expect(landed.fuel).toBeGreaterThan(0);expect(landed.impact).toBeLessThanOrEqual(3);expect(descent(1)).toEqual(landed);
    const crashed=descent(0,0);expect(crashed.status).toBe("crashed");expect(crashed.fuel).toBe(0);expect(crashed.altitude).toBe(0);expect(stepMars(crashed,{assist:1},1)).toEqual(crashed);
  });
  it("supports accelerated orbital time without clipping each frame to 0.25 seconds",()=>{
    const r=new FixedStepRunner(.25,32,5);let elapsed=0;r.advance(5,dt=>elapsed+=dt);expect(elapsed).toBe(5);r.advance(NaN,dt=>elapsed+=dt);r.advance(-1,dt=>elapsed+=dt);expect(elapsed).toBe(5);
  });
});
