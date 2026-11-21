import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProtectedFeaturePreview } from "@/components/simulation/ProtectedFeaturePreview";
import { missionDefinitions } from "@/lib/simulations/progress";
import { getSimulationCard } from "@/lib/subjects/catalog";

describe("universal simulation progress", () => {
  it("creates the three evidence-based missions for any simulation", () => {
    const missions = missionDefinitions(
      "Solubility Curve Simulator",
      "Predict saturation and crystal formation.",
      "Solubility · temperature · saturation · crystallization",
    );
    expect(missions.map((mission) => mission.id)).toEqual(["predict", "compare", "explain"]);
    expect(missions[1].prompt).toContain("Solubility, temperature, saturation");
    expect(missions[2].prompt).toContain("Predict saturation and crystal formation.");
  });

  it("protects both progress tables with per-user row-level security", () => {
    const migration = readFileSync("supabase/migrations/202611210001_simulation_progress.sql", "utf8");
    for (const table of ["simulation_measurements", "simulation_mission_progress"]) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
      expect(migration).toContain(`on public.${table} for select to authenticated`);
      expect(migration).toContain(`on public.${table} for insert to authenticated`);
      expect(migration).toContain(`on public.${table} for update to authenticated`);
      expect(migration).toContain(`on public.${table} for delete to authenticated`);
    }
    expect(migration.match(/auth\.uid\(\)/g)?.length).toBeGreaterThanOrEqual(8);
  });

  it("keeps the signed-out Missions card focused on Google sign-in", () => {
    const simulation = getSimulationCard("projectile-lab")!;
    const html = renderToStaticMarkup(createElement(ProtectedFeaturePreview, { feature: "Missions", simulation }));
    expect(html).toContain('data-feature="missions"');
    expect(html).toContain('class="protectedLock"');
    expect(html).toContain("Sign in to unlock Missions");
    expect(html).toContain('aria-label="Sign in with Google"');
    expect(html).toContain('fill="#4285F4"');
    expect(html).toContain(">Sign in with Google<");
    expect(html).not.toContain("Guided learning challenges");
    expect(html).not.toContain("Complete learning challenges and track your progress");
    expect(html).not.toContain("Progress follows your account across devices");
  });

  it("uses the same focused Google sign-in modal for Measurements", () => {
    const simulation = getSimulationCard("projectile-lab")!;
    const html = renderToStaticMarkup(createElement(ProtectedFeaturePreview, { feature: "Measurements", simulation }));
    expect(html).toContain('data-feature="measurements"');
    expect(html).toContain("Sign in to unlock Measurements");
    expect(html).toContain('aria-label="Sign in with Google"');
    expect(html).toContain('fill="#4285F4"');
    expect(html).toContain(">Sign in with Google<");
    expect(html).not.toContain("Personal experiment notebook");
    expect(html).not.toContain("Your simulation stays free");
  });
});
