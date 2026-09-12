import { describe, expect, it } from "vitest";
import { MoonLandingEngine } from "@/lib/simulations/moonLanding/engine";
import { OrbitalRescueEngine } from "@/lib/simulations/orbitalRescue/engine";
function runMoon(){const e=new MoonLandingEngine();e.handleInput({throttle:.55,rotate:0});for(let i=0;i<1200;i++)e.update(1/120);return e.getState()}
function runOrbit(){const e=new OrbitalRescueEngine();e.handleInput({thrust:.12,direction:"prograde"});for(let i=0;i<1200;i++)e.update(.25);return e.getState()}
describe("deterministic simulations",()=>{
  it("repeats lunar state exactly for identical inputs",()=>{expect(runMoon()).toEqual(runMoon())});
  it("repeats orbital state exactly for identical inputs",()=>{expect(runOrbit()).toEqual(runOrbit())});
});
