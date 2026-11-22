import type { SimulationCard } from "@/lib/subjects/catalog";
import type { SimulationContent } from "../types";
import * as systems from "./systems-of-equations";
import * as statsLab from "./mean-median-mode";
import * as balanceLab from "./algebra-balance-scale";
import * as circleLab from "./circle-area-pi";
import * as fractionLab from "./fraction-visualizer";
import * as trigLab from "./trigonometry-ratios";
import * as triangleLab from "./triangle-angle-sum";
import * as growth from "./exponential-growth";

// One module per interactive mathematics lab (components/subjects/mathematics/labs). Each module
// holds the lab's catalog card, its English page content and meta description, and its Spanish
// title, so adding a lab means adding one file here.
type MathLabModule = { card: SimulationCard; content: SimulationContent; description: string; es: { title: string; outcome: string; concepts: string; kind: string } };
// Listed in teaching order: number sense, geometry, algebra, trigonometry, statistics, functions.
const modules: MathLabModule[] = [fractionLab as MathLabModule, circleLab as MathLabModule, triangleLab as MathLabModule, balanceLab as MathLabModule, systems as MathLabModule, trigLab as MathLabModule, statsLab as MathLabModule, growth as MathLabModule];

export const mathLabCards: SimulationCard[] = modules.map((m) => ({ ...m.card }));
export const mathLabContent: Record<string, SimulationContent> = Object.fromEntries(modules.map((m) => [m.card.slug, m.content]));
export const mathLabDescriptions: Record<string, string> = Object.fromEntries(modules.map((m) => [m.card.slug, m.description]));
export const mathLabSpanish = Object.fromEntries(modules.map((m) => [m.card.slug, m.es]));
