import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EnvironmentalActivitiesClient } from "@/components/subjects/environmental/EnvironmentalActivitiesClient";
import { ProtectedFeaturePreview } from "@/components/simulation/ProtectedFeaturePreview";
import { SimulationGuide } from "@/components/seo/SimulationGuide";
import { getSimulationCard, subjectsCatalog } from "@/lib/subjects/catalog";

describe("environmental simulation page integration", () => {
  const subject = subjectsCatalog["environmental-science"];
  const simulation = getSimulationCard("greenhouse-effect-simulator")!;

  it("keeps conditions inline and removes the duplicate condition, guide and graph buttons", () => {
    const html = renderToStaticMarkup(<EnvironmentalActivitiesClient locale="en" subject={subject} simulation={simulation}/>);
    expect(html).toContain("Scenario conditions");
    expect(html).not.toContain('aria-label="Conditions"');
    expect(html).not.toContain('aria-label="View graphs"');
    expect(html).not.toContain("Game guide (opens in a new tab)");
  });

  it("provides extension mounts for Guide and Measurements tab content", () => {
    const guide = renderToStaticMarkup(<SimulationGuide locale="en" subject={subject} simulation={simulation}/>);
    const measurements = renderToStaticMarkup(<ProtectedFeaturePreview feature="Measurements" simulation={simulation}/>);
    expect(guide).toContain('id="simulation-guide-extension"');
    expect(measurements).toContain('id="simulation-measurements-extension"');
  });
});
