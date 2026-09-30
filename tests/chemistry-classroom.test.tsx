import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ChemistryActivitiesClient } from "@/components/subjects/chemistry/ChemistryActivitiesClient";
import { LabNotebook } from "@/components/subjects/chemistry/LabNotebook";
import { subjectsCatalog } from "@/lib/subjects/catalog";

describe("chemistry classroom rendering", () => {
  it("keeps public chemistry routes focused on experiments without classroom tools", () => {
    const subject = subjectsCatalog.chemistry;
    for (const simulation of subject.simulations) {
      const html = renderToStaticMarkup(<ChemistryActivitiesClient locale="en" subject={subject} simulation={simulation}/>);
      expect(html, simulation.slug).not.toContain("Predict. Observe. Explain.");
      expect(html, simulation.slug).not.toContain("Check mission");
      expect(html, simulation.slug).toContain("Experiment controls");
      expect(html, simulation.slug).not.toContain('aria-label="Learning view"');
      expect(html, simulation.slug).not.toMatch(/\bNaN\b/);
      expect(html, simulation.slug).not.toContain("Expected evidence &amp; assessment");
    }
  });
  it("reveals expected results only when teacher view is selected", () => {
    const html = renderToStaticMarkup(<LabNotebook slug="titration-simulator" title="Titration" teacher readings={[["pH", "7.00"]]} conditions="30 mL"/>);
    expect(html).toContain("Teacher discussion guide");
    expect(html).toContain("0.120 mol/L");
    expect(html).toContain("Success criteria");
  });
});
