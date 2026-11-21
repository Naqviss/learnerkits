import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GeographyActivitiesClient } from "@/components/subjects/geography/GeographyActivitiesClient";
import { ProtectedFeaturePreview } from "@/components/simulation/ProtectedFeaturePreview";
import { SimulationGuide } from "@/components/seo/SimulationGuide";
import { getSimulationCard, subjectsCatalog } from "@/lib/subjects/catalog";

describe("Geography and Earth simulation page integration", () => {
  const subject = subjectsCatalog.geography;
  const simulation = getSimulationCard("seismic-wave-lab")!;

  it("removes duplicate internal Guide and Measurements controls from every Earth lab", () => {
    for (const earthSimulation of subject.simulations) {
      const html = renderToStaticMarkup(<GeographyActivitiesClient locale="en" subject={subject} simulation={earthSimulation}/>);
      expect(html).not.toContain('aria-label="Field guide"');
      expect(html).not.toContain('aria-label="Measurements"');
      expect(html).toContain('aria-label="More Earth labs"');
    }
  });

  it("uses the shared Guide and Measurements extension mounts", () => {
    const guide = renderToStaticMarkup(<SimulationGuide locale="en" subject={subject} simulation={simulation}/>);
    const measurements = renderToStaticMarkup(<ProtectedFeaturePreview feature="Measurements" simulation={simulation}/>);
    expect(guide).toContain('id="simulation-guide-extension"');
    expect(measurements).toContain('id="simulation-measurements-extension"');
  });
});
