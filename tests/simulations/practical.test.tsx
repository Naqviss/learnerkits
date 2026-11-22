import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PracticalLab from "@/components/simulation/practical/PracticalLab";
import { practicalSlugs } from "@/lib/simulations/practical/catalog";
import { simulate } from "@/lib/simulations/practical/models";
import { getSimulationCard } from "@/lib/subjects/catalog";

describe("practical investigations", () => {
  it.each([...practicalSlugs])("opens the catalog activity %s", slug => {
    expect(getSimulationCard(slug)).toBeDefined();
    const html = renderToStaticMarkup(<PracticalLab slug={slug}/>);
    expect(html).toContain("<h2>");
    expect(html).toMatch(/type="range"|<button/);
  });
  it("keeps a circular orbit and returns all pendulums to their launch phase", () => {
    for (const frame of simulate("gravity-planet-orbit",1)) expect(frame.values[0]).toBeCloseTo(1,1);
    const wave = simulate("pendulum-wave",2);
    wave[0].dots.forEach((dot,i)=>expect(wave.at(-1)!.dots[i].x).toBeCloseTo(dot.x));
  });
  it("accounts for mergers, persistence, habitat elevation and species removal", () => {
    const end = simulate("n-body-space",100).at(-1)!;
    expect(end.values[1]).toBeGreaterThan(0);
    expect(end.values[0]+end.values[1]).toBe(100);
    expect(simulate("ecosystem-survival",20).at(-1)!.values[1]).toBe(0);
    expect(simulate("ecosystem-survival",100).at(-1)!.values[1]).toBeGreaterThan(0);
    expect(simulate("climate-change-scenarios",3).at(-1)!.values[1]).toBeCloseTo(2461.54,2);
    expect(simulate("aquarium-food-web",2).at(-1)!.values[0]).toBeGreaterThan(simulate("aquarium-food-web",0).at(-1)!.values[0]);
  });
});
