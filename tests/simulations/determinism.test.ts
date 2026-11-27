import { describe, expect, it } from "vitest";
import { MoonLandingEngine } from "@/lib/simulations/moonLanding/engine";
import { createApproachPractice, OrbitalRescueEngine } from "@/lib/simulations/orbitalRescue/engine";
function runMoon(){const e=new MoonLandingEngine();e.handleInput({throttle:.55,rotate:0});for(let i=0;i<1200;i++)e.update(1/120);return e.getState()}
function runOrbit(){const e=new OrbitalRescueEngine();e.handleInput({thrust:.12,direction:"prograde"});for(let i=0;i<1200;i++)e.update(.25);return e.getState()}
describe("deterministic simulations",()=>{
  it("repeats lunar state exactly for identical inputs",()=>{expect(runMoon()).toEqual(runMoon())});
  it("repeats orbital state exactly for identical inputs",()=>{expect(runOrbit()).toEqual(runOrbit())});
});

describe("orbital rescue final approach", () => {
  it("lets a student complete the guided retrograde burn from the starting approach", () => {
    const engine = createApproachPractice();
    expect(engine.telemetry().targetDistance).toBeCloseTo(3000, 1);
    expect(engine.telemetry().relativeVelocity).toBeGreaterThan(8);
    engine.handleInput({ direction: "retrograde", thrust: .1 });
    for (let step = 0; step < 80; step++) engine.update(.25);
    expect(engine.checkMissionConditions().rescued).toBe(true);
    expect(engine.telemetry().targetDistance).toBeLessThan(4000);
    expect(engine.telemetry().relativeVelocity).toBeLessThan(8);
  });
});
