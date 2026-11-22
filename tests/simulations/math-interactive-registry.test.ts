import { describe, expect, it } from "vitest";
import { interactiveMathSlugs } from "@/lib/simulations/mathematicsLabs/interactive";
import { interactiveMathLabs } from "@/components/subjects/mathematics/labs";
import { activities } from "@/lib/simulations/mathematicsLabs/model";

describe("interactive mathematics lab registry", () => {
  it("has exactly one component for every interactive slug and no overlap with the slider labs", () => {
    expect(Object.keys(interactiveMathLabs).sort()).toEqual([...interactiveMathSlugs].sort());
    for (const slug of interactiveMathSlugs) expect(activities.some((a) => a.slug === slug), slug).toBe(false);
  });
});
