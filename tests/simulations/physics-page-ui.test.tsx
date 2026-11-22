import { practicalSlugs } from "@/lib/simulations/practical/catalog";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PhysicsActivitiesClient } from "@/components/subjects/physics/PhysicsActivitiesClient";
import { ProtectedFeaturePreview } from "@/components/simulation/ProtectedFeaturePreview";
import { SimulationGuide } from "@/components/seo/SimulationGuide";
import { getSimulationCard, subjectsCatalog } from "@/lib/subjects/catalog";

describe("Physics simulation page integration", () => {
  const subject = subjectsCatalog.physics;
  const simulation = getSimulationCard("projectile-lab")!;

  it("renders every Physics lab without the legacy device notebook", () => {
    for (const physicsSimulation of subject.simulations.filter(item => !practicalSlugs.has(item.slug))) {
      const html = renderToStaticMarkup(<PhysicsActivitiesClient locale="en" subject={subject} simulation={physicsSimulation}/>);
      expect(html).not.toContain("YOUR PHYSICS NOTEBOOK");
      expect(html).toContain("Tools &amp; controls");
    }
  });

  it("uses the shared Guide and Measurements extension mounts", () => {
    const guide = renderToStaticMarkup(<SimulationGuide locale="en" subject={subject} simulation={simulation}/>);
    const measurements = renderToStaticMarkup(<ProtectedFeaturePreview feature="Measurements" simulation={simulation}/>);
    expect(guide).toContain('id="simulation-guide-extension"');
    expect(measurements).toContain('id="simulation-measurements-extension"');
  });
});
