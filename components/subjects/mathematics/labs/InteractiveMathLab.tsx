"use client";
import type { SimulationCard } from "@/lib/subjects/catalog";
import { getInteractiveMathLab } from "./index";

/** Client entry point the simulation page loads for slugs in interactiveMathSlugs. */
export function InteractiveMathLab({ locale, simulation }: { locale: string; simulation: SimulationCard }) {
  const Lab = getInteractiveMathLab(simulation.slug);
  return Lab ? <Lab locale={locale} simulation={simulation} /> : null;
}
