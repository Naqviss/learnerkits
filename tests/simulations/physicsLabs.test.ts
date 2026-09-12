import { describe, expect, it } from "vitest";
import { subjectsCatalog } from "@/lib/subjects/catalog";
import { activities, bridge, checkMission, circuit, collision, energyAt, energyTrack, initialValues, lens, period, projectile, ramp, waveAmplitude, type Values } from "@/lib/simulations/physicsLabs/model";

const completedAttempt={started:true,time:60,closed:true,installed:true,steps:[]};
const values=(slug:string,override:Values={})=>({...initialValues(activities.find(a=>a.slug===slug)!),...override});
describe("physics labs",()=>{
  it("replaces every physics topic and provides an achievable mission",()=>{
    expect(activities.map(a=>a.slug).sort()).toEqual(subjectsCatalog.physics.simulations.map(s=>s.slug).sort());
    const solutions:Record<string,Values>={
      "projectile-lab":{speed:20,angle:45},"circuit-builder":{resistance:14},"inclined-plane-friction":{angle:20,mu:.2},
      "momentum-collision":{massA:2,massB:2,speedB:0,restitution:1},"ray-optics-lens":{focal:20,distance:30},
      "newtons-laws-force-lab":{force:25,resistance:5,mass:10},"simple-machines-challenge":{advantage:4,effort:100},
      "wave-interference":{amplitudeA:1,amplitudeB:1,frequencyA:1,frequencyB:1,phase:180},"pendulum-physics":{length:1},
      "energy-track-challenge":{height:3,loss:40},"electromagnet-3d":{turns:500,current:2.5,length:.4},
      "bridge-builder-challenge":{span:6,rise:1.5,area:9,load:10},
    };
    for(const a of activities)expect(checkMission(a.slug,values(a.slug,solutions[a.slug]),completedAttempt).ok,a.slug).toBe(true);
    expect(checkMission("simple-machines-challenge",values("simple-machines-challenge",{machine:1,advantage:4,effort:100}),completedAttempt)).toMatchObject({ok:true,step:"1",required:2});
  });
  it("requires an actual run for motion challenges",()=>{
    for(const a of activities.filter(a=>a.duration>0))expect(checkMission(a.slug,values(a.slug),{...completedAttempt,started:false,time:0}).ok).toBe(false);
  });
  it("conserves momentum and bounds collision energy for every restitution",()=>{
    for(const e of [0,.2,.5,1])for(const massA of [1,2,5]){
      const v=values("momentum-collision",{restitution:e,massA}),r=collision(v);
      expect(v.massA*r.speedA+v.massB*r.speedB).toBeCloseTo(r.momentum,10);
      expect(r.speedB-r.speedA).toBeCloseTo(e*(v.speedA-v.speedB),10);
      expect(r.energyAfter).toBeLessThanOrEqual(r.energyBefore+1e-9);
      if(e===1)expect(r.energyAfter).toBeCloseTo(r.energyBefore);
      if(e===0)expect(r.speedA).toBeCloseTo(r.speedB);
    }
  });
  it("does not accelerate a block held by static friction",()=>{
    const r=ramp(values("inclined-plane-friction",{angle:5,mu:.5}));expect(r.acceleration).toBe(0);expect(r.finish).toBe(Infinity);expect(r.friction).toBeCloseTo(r.gravity);
    const light=ramp(values("inclined-plane-friction",{angle:30,mass:1})),heavy=ramp(values("inclined-plane-friction",{angle:30,mass:20}));expect(light.acceleration).toBeCloseTo(heavy.acceleration);
  });
  it("models open circuits and independent parallel branches",()=>{
    const v=values("circuit-builder");expect(circuit(v,false,true).current).toBe(0);expect(circuit(v,true,false).current).toBe(0);
    const parallel={...v,connection:1};expect(circuit(parallel,true,false).lampCurrent).toBeCloseTo(v.voltage/10);
    expect(circuit(parallel,true,true).current).toBeCloseTo(v.voltage/v.resistance+v.voltage/10);
  });
  it("handles real, virtual and infinite lens images",()=>{
    expect(lens(values("ray-optics-lens",{focal:20,distance:30}))).toMatchObject({magnification:expect.closeTo(-2),image:expect.closeTo(60)});
    expect(lens(values("ray-optics-lens",{lens:1})).image).toBeLessThan(0);
    expect(lens(values("ray-optics-lens",{focal:20,distance:20})).image).toBe(Infinity);
    expect(lens(values("ray-optics-lens",{focal:20,distance:10})).magnification).toBeGreaterThan(1);
  });
  it("conserves track energy including thermal loss and reaches the exit",()=>{
    for(const loss of [0,40,70]){const v=values("energy-track-challenge",{loss}),track=energyTrack(v);for(const fraction of [0,.2,.7,1]){const e=energyAt(v,track.duration*fraction);expect(e.potential+e.kinetic+e.heat).toBeCloseTo(track.initial,8);expect(e.u).toBeGreaterThanOrEqual(0);expect(e.u).toBeLessThanOrEqual(1);}const exit=energyAt(v,track.duration);expect(exit.height).toBe(0);expect(exit.heat).toBeCloseTo(track.initial*loss/100);expect(Math.sqrt(2*exit.kinetic/v.mass)).toBeCloseTo(track.speed);}
  });
  it("checks truss equilibrium and buckling, not just a visual strength score",()=>{
    const v=values("bridge-builder-challenge",{span:6,rise:1.5,area:9,load:10}),b=bridge(v);
    expect(2*b.compression*v.rise/b.side).toBeCloseTo(v.load*1000);
    expect(b.compression*(v.span/2)/b.side).toBeCloseTo(b.tension);
    expect(b.mass).toBeLessThan(100);expect(b.utilization).toBeLessThan(1);
    expect(bridge({...v,area:2}).utilization).toBeGreaterThan(1);
    expect(bridge({...v,area:18}).buckling).toBeCloseTo(b.buckling*4);
  });
  it("matches standard projectile, wave and pendulum limits",()=>{
    const p=projectile(values("projectile-lab",{speed:20,angle:45}));expect(p.range).toBeCloseTo(400/9.81);
    expect(waveAmplitude(values("wave-interference",{amplitudeA:1,amplitudeB:1,phase:180}))).toBeCloseTo(0);
    expect(period(values("pendulum-physics",{length:9.81/Math.PI**2}))).toBeCloseTo(2);
  });
});
