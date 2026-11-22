import investigationContent from "./investigations.json";
import practicalContent from "./practical.json";
import { balancingFaq } from "@/lib/seo/balancing-equations";
import { chemistryContent } from "./chemistry";
import { simulationDescriptions } from "./descriptions";
import { environmentalContent } from "./environmental";
import { geographyContent } from "./geography";
import { mathematicsContent } from "./mathematics";
import { mathLabContent } from "./math-labs";
import { physicsContent } from "./physics";
import { spaceContent } from "./space";
import { simulationContentUpdated, type SimulationContent } from "./types";

export { simulationContentUpdated, type SimulationContent } from "./types";

// The balancing page keeps its long reference guide in lib/seo/balancing-equations.ts; this entry
// only adds the short sections every simulation page has, reusing that module's FAQ.
const balancing: SimulationContent = {
  question: "What does the balancing chemical equations game practice?",
  answer: "The balancing chemical equations game practices the one skill every equation needs: choosing whole-number coefficients so each element has the same number of atoms on both sides of the arrow. You adjust coefficients only, never formulas, and the game checks every element and, for ionic equations and half-equations, the total charge before it accepts an answer.",
  science: [
    "A balanced equation is a statement of the law of conservation of mass. Atoms are rearranged in a reaction, not created or destroyed, so the number of each kind of atom must be the same in the reactants and the products.",
    "The coefficients are also mole ratios. In 2H₂ + O₂ → 2H₂O, two moles of hydrogen react with one mole of oxygen to give two moles of water, which is the ratio used in every stoichiometry calculation.",
  ],
  steps: [
    "Pick a reaction from the reaction list, which runs from water formation and combustion to ionic equations and redox half-equations.",
    "Use the − and + buttons under each formula to change its coefficient; formulas themselves never change.",
    "Read the atom ledger: each element shows its reactant count in blue and product count in amber, with “✓ Balanced” or “Unequal”. Ionic equations add a ± charge row.",
    "When every row reads “✓ Balanced”, make sure the coefficients share no common factor, then press Check mission.",
  ],
  misconception: { myth: "You can change a subscript to make an equation balance.", fact: "A subscript is part of the formula. Changing H₂O to H₂O₂ turns water into hydrogen peroxide, so only coefficients may change." },
  modelNote: "The game checks atom and charge totals for a fixed bank of 43 equations. It does not predict products, so the formulas are always given.",
  faq: balancingFaq,
};

const content: Record<string, SimulationContent> = {
  ...practicalContent,
  ...investigationContent,
  ...spaceContent,
  ...physicsContent,
  ...geographyContent,
  ...environmentalContent,
  ...chemistryContent,
  ...mathematicsContent,
  ...mathLabContent,
  "balance-equation": balancing,
};

/** English reference content for a simulation page, or undefined if none has been written. */
export function getSimulationContent(slug: string): SimulationContent | undefined {
  return content[slug];
}

export const simulationContentSlugs = () => Object.keys(content);

/** The hand-written meta description for a simulation page. English only; other languages use their own copy. */
export function getSimulationDescription(slug: string, locale: string): string | undefined {
  return locale === "en" ? simulationDescriptions[slug] : undefined;
}

export function simulationReviewDate(slug: string) {
  return Object.hasOwn(investigationContent, slug) ? "2026-11-22" : simulationContentUpdated;
}
