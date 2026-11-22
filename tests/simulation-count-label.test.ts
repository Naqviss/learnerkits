import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/config";
import { getEducationCopy } from "@/lib/i18n/content";
import { liveSimulationCount, simulationCountLabel } from "@/lib/subjects/catalog";

describe("site-wide simulation count", () => {
  it("rounds the total down to the hundred with a plus", () => {
    expect(simulationCountLabel(95)).toBe("95");
    expect(simulationCountLabel(100)).toBe("100+");
    expect(simulationCountLabel(103)).toBe("100+");
    expect(simulationCountLabel(212)).toBe("200+");
  });
  it("shows the rounded total, never the exact one, in home and library copy", () => {
    const label = simulationCountLabel(), exact = String(liveSimulationCount());
    expect(liveSimulationCount()).toBeGreaterThanOrEqual(100);
    for (const locale of locales) {
      const c = getEducationCopy(locale);
      for (const text of [c.home.labCount, c.seo.homeDescription, c.seo.libraryDescription, c.library.body(label, 6)]) {
        expect(text).not.toMatch(new RegExp(`\\b(70|${exact})\\b`));
      }
      expect(c.seo.libraryDescription + c.home.labCount).toContain(label);
    }
  });
});
