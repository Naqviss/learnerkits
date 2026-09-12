import { describe, expect, it } from "vitest";
import { G0 } from "@/lib/physics/constants";
import { deltaV, massFlowRate } from "@/lib/physics/rocketEquation";
describe("rocket equation",()=>{
  it("computes ideal delta-v",()=>{expect(deltaV(311,7400,4700)).toBeCloseTo(311*G0*Math.log(7400/4700),8)});
  it("computes propellant mass flow",()=>{expect(massFlowRate(45000,311)).toBeCloseTo(45000/(311*G0),8)});
});
