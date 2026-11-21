import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("site navigation", () => {
  it("uses one shared header on simulation and standard pages", () => {
    const source = readFileSync("components/navigation/Nav.tsx", "utf8");
    expect(source).toContain('className="navLinks"');
    expect(source).toContain('className="navActions"');
    expect(source).toContain('id="nav-search-desktop"');
    expect(source).toContain('className="mobileNav"');
    expect(source).not.toContain("simulationPrimaryNav");
    expect(source).not.toContain("simulationExploreCta");
  });
});
