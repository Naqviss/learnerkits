import { describe, expect, it } from "vitest";
import { subjectsCatalog } from "@/lib/subjects/catalog";
import { FixedStepRunner } from "@/lib/simulations/fixedStep";
import { activities, initialValues, phaseFraction, eclipse, orbital, orbitTrace, flybyTrace, sampleTrajectory, flyby, kepler, seasons, blackHole, initialMars, stepMars, checkMission, type Values, type MarsState } from "@/lib/simulations/spaceLabs/model";

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

describe("flight dynamics regression checks",()=>{
  it("conserves orbital energy and angular momentum across an elliptical orbit",()=>{
    const v=values("satellite-orbit-builder",{speedScale:120});
    const o=orbital(v,true),trace=orbitTrace(v,true),energy=o.q**2/2-1;
    expect(trace.points.at(-1)!.t).toBeCloseTo(o.period,5);
    for(const p of trace.points){
      expect(((p.vx??0)**2+(p.vy??0)**2)/2-1/Math.hypot(p.x,p.y)).toBeCloseTo(energy,5);
      expect(p.x*(p.vy??0)-p.y*(p.vx??0)).toBeCloseTo(o.q,8);
    }
    expect(trace.points.at(-1)!.x).toBeCloseTo(1,3);
    expect(trace.points.at(-1)!.y).toBeCloseTo(0,3);
  });
  it("stops at the surface, without drawing a path through the planet",()=>{
    const v=values("satellite-orbit-builder",{speedScale:75}),o=orbital(v,true),trace=orbitTrace(v,true);
    expect(trace.status).toBe("Surface impact");
    expect(Math.hypot(trace.points.at(-1)!.x,trace.points.at(-1)!.y)*o.radius).toBeCloseTo(o.world.radius,7);
  });
  it("rejects invalid time and clamps manual thrust to available fuel",()=>{
    const state={...initialMars(),status:"flying" as const};
    for(const dt of [NaN,Infinity,-1,0])expect(stepMars(state,{assist:0,throttle:100},dt)).toEqual(state);
    expect(stepMars(state,{assist:0,throttle:-100},.1).throttle).toBe(0);
    expect(stepMars(state,{assist:0,throttle:500},.1).throttle).toBeLessThanOrEqual(1);
    const empty=stepMars({...state,fuel:.001},{assist:0,throttle:100},1);
    expect(empty.fuel).toBe(0);expect(empty.throttle).toBe(0);
  });
  it("produces the same descent with coarse and fine caller timesteps",()=>{
    let coarse={...initialMars(),status:"flying" as MarsState["status"]},fine={...coarse};
    for(let i=0;i<20;i++)coarse=stepMars(coarse,{assist:1},.5);
    for(let i=0;i<1200;i++)fine=stepMars(fine,{assist:1},1/120);
    expect(coarse.altitude).toBeCloseTo(fine.altitude,7);
    expect(coarse.velocity).toBeCloseTo(fine.velocity,7);
    expect(coarse.fuel).toBeCloseTo(fine.fuel,7);
  });
});


describe("trajectory playback",()=>{
  it("samples hyperbolic motion in equal time and accelerates near periapsis",()=>{
    const v=values("gravity-slingshot"),points=flybyTrace(v),mid=points[240];
    expect(Math.hypot(mid.x,mid.y)).toBeCloseTo(1,10);
    const distance=(a:typeof mid,b:typeof mid)=>Math.hypot(a.x-b.x,a.y-b.y);
    expect(distance(points[240],points[241])).toBeGreaterThan(distance(points[0],points[1]));
    for(let i=2;i<points.length;i++)expect(points[i].t-points[i-1].t).toBeCloseTo(points[1].t,8);
    const rp=6371+v.altitude,dt=points[241].t-mid.t;
    const speed=distance(points[239],points[241])*rp/(2*dt);
    expect(speed).toBeCloseTo(Math.sqrt(v.speed**2+2*398600.44/rp),1);
    for(const side of [0,1]){
      const path=flybyTrace({...v,side});
      const tangent=[path[1].x-path[0].x,path[1].y-path[0].y];
      const angle=Math.atan2(tangent[1],tangent[0])*180/Math.PI;
      expect(angle).toBeCloseTo(v.angle,0);
    }
  });
  it("interpolates by elapsed time and clamps scrub endpoints",()=>{
    const points=[{x:0,y:0,t:0},{x:2,y:4,t:1},{x:4,y:0,t:4}];
    expect(sampleTrajectory(points,.125)).toEqual({x:1,y:2,t:.5});
    expect(sampleTrajectory(points,-1)).toEqual(points[0]);
    expect(sampleTrajectory(points,2)).toEqual(points[2]);
  });
});
