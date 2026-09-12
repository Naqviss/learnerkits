import { describe, expect, it } from "vitest";
import { semiImplicitEuler } from "@/lib/physics/integration";
describe("semi-implicit Euler",()=>{it("updates velocity before position",()=>{const r=semiImplicitEuler({x:0,y:10},{x:0,y:0},{x:0,y:-2},.5);expect(r.velocity.y).toBe(-1);expect(r.position.y).toBe(9.5)})});
