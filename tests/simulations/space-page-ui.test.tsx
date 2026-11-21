import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SpaceActivitiesClient } from "@/components/subjects/space/SpaceActivitiesClient";
import { ProtectedFeaturePreview } from "@/components/simulation/ProtectedFeaturePreview";
import { SimulationGuide } from "@/components/seo/SimulationGuide";
import { activities } from "@/lib/simulations/spaceLabs/model";
import { getSimulationCard, subjectsCatalog } from "@/lib/subjects/catalog";

describe("Space and Astronomy simulation page integration", () => {
  const subject = subjectsCatalog.space;
  const simulation = getSimulationCard("moon-phases-3d")!;

  it("renders every shared Space lab without duplicate navigation or explorer headers", () => {
    for (const activity of activities) {
      const spaceSimulation = getSimulationCard(activity.slug)!;
      const html = renderToStaticMarkup(<SpaceActivitiesClient locale="en" subject={subject} simulation={spaceSimulation}/>);
      expect(html).not.toContain('aria-label="Space simulations"');
      expect(html).not.toContain("SPACE &amp; ASTRONOMY</span><strong>EXPLORER");
      expect(html).toMatch(/Tools &amp; controls|Flight controls/);
    }
  });

  it("uses the shared Guide and Measurements extension mounts", () => {
    const guide = renderToStaticMarkup(<SimulationGuide locale="en" subject={subject} simulation={simulation}/>);
    const measurements = renderToStaticMarkup(<ProtectedFeaturePreview feature="Measurements" simulation={simulation}/>);
    expect(guide).toContain('id="simulation-guide-extension"');
    expect(measurements).toContain('id="simulation-measurements-extension"');
  });

  it("lists four same-subject simulations under Learn More with a see-all link", () => {
    const html = renderToStaticMarkup(<SimulationGuide locale="en" subject={subject} simulation={simulation}/>);
    expect(html).toContain("Learn More");
    expect(html).not.toContain("Keep exploring");
    expect(html).not.toContain("Next simulations to try");
    const sameSubject = subject.simulations.filter((item) => item.slug !== simulation.slug);
    for (const related of sameSubject.slice(0, 4)) {
      expect(html).toContain(`/en/simulations/${related.slug}`);
    }
    expect(html).not.toContain(`/en/simulations/${sameSubject[4].slug}`);
    expect(html).toContain('class="button relatedSeeAll"');
    expect(html).toContain('href="/en/subjects/space"');
    expect(html).toContain("See all Space &amp; Astronomy simulations");
    expect(html).not.toContain("/en/simulations/greenhouse-effect-simulator");
  });
});
