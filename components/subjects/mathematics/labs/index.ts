import type { ComponentType } from "react";
import type { InteractiveMathSlug } from "@/lib/simulations/mathematicsLabs/interactive";
import type { SimulationCard } from "@/lib/subjects/catalog";
import SystemsOfEquationsLab from "./SystemsOfEquationsLab";
import MeanMedianModeLab from "./MeanMedianModeLab";
import AlgebraBalanceScaleLab from "./AlgebraBalanceScaleLab";
import CircleAreaPiLab from "./CircleAreaPiLab";
import FractionVisualizerLab from "./FractionVisualizerLab";
import TrigonometryRatiosLab from "./TrigonometryRatiosLab";
import TriangleAngleSumLab from "./TriangleAngleSumLab";
import ExponentialGrowthLab from "./ExponentialGrowthLab";

export type InteractiveMathLab = ComponentType<{ locale: string; simulation: SimulationCard }>;
export const interactiveMathLabs: Record<InteractiveMathSlug, InteractiveMathLab> = {
  "systems-of-equations": SystemsOfEquationsLab,
  "mean-median-mode": MeanMedianModeLab,
  "algebra-balance-scale": AlgebraBalanceScaleLab,
  "circle-area-pi": CircleAreaPiLab,
  "fraction-visualizer": FractionVisualizerLab,
  "trigonometry-ratios": TrigonometryRatiosLab,
  "triangle-angle-sum": TriangleAngleSumLab,
  "exponential-growth": ExponentialGrowthLab,
};
export const getInteractiveMathLab = (slug: string): InteractiveMathLab | undefined => (interactiveMathLabs as Record<string, InteractiveMathLab>)[slug];
