import { describe, expect, it } from "vitest";
import { MissionEngine } from "@/lib/missions/engine";

describe("mission engine", () => {
  it("completes only when every objective passes", () => {
    const engine = new MissionEngine<{ speed: number; fuel: number }>();
    const mission = {
      id: "safe-efficient",
      objectives: [
        { id: "safe", labelKey: "safe", test: (c: { speed: number; fuel: number }) => c.speed < 3 },
        { id: "fuel", labelKey: "fuel", test: (c: { speed: number; fuel: number }) => c.fuel > 30 },
      ],
    };
    expect(engine.evaluate(mission, { speed: 2, fuel: 50 }).complete).toBe(true);
    expect(engine.evaluate(mission, { speed: 4, fuel: 50 }).complete).toBe(false);
  });
});
