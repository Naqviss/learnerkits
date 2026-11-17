import { activities, reactions } from "@/lib/simulations/chemistry/model";

// Reference content for the balancing-equations lab (/en/simulations/balance-equation). Every
// equation is generated from the lab's own equation bank (`reactions`), whose coefficients are
// checked against atom and charge totals in tests/seo/balancing-equations.test.ts, so the page
// can never show an answer the game would reject. This is deliberately one strong page, not a
// page per equation: Google's September 2026 spam update demoted this site for templated pages
// published at scale.

export const balancingSeo = {
  title: "How to Balance Chemical Equations: Steps, Examples & Practice",
  description: "Balance chemical equations step by step: count atoms, change only coefficients, check charge. 43 worked answers, from combustion to redox half-equations.",
  updated: "2026-11-17",
} as const;

// Answer-first summary: the paragraph search engines and AI assistants can quote on its own.
export const balancingAnswer =
  "To balance a chemical equation, write the correct formula for every reactant and product, then change only the coefficients (the numbers in front of the formulas) until each element has the same number of atoms on both sides. Balance elements that appear in only one substance on each side first, leave hydrogen and oxygen until last, and reduce the coefficients to the smallest whole-number ratio. In an ionic equation the total charge must match as well.";

export const balancingMethod = [
  "Write the unbalanced equation with correct formulas. Never change a formula to make it balance.",
  "List each element and count its atoms on the left and on the right.",
  "Balance one element at a time by placing a coefficient in front of a whole formula. Start with metals, then other non-metals; balance hydrogen and oxygen last.",
  "Treat a polyatomic ion that stays intact (such as SO₄ or NO₃) as one unit.",
  "If you need a fraction, multiply every coefficient by the same number to clear it.",
  "For ionic equations and half-equations, check that the total charge is equal on both sides.",
  "Recount every atom, then divide the coefficients by any common factor to get the smallest whole numbers.",
];

export const balancingWorkedExamples = [
  {
    title: "Combustion: propane burning in oxygen",
    start: "C₃H₈ + O₂ → CO₂ + H₂O",
    steps: [
      "Carbon: there are 3 C atoms on the left, so put 3 in front of CO₂: C₃H₈ + O₂ → 3CO₂ + H₂O.",
      "Hydrogen: there are 8 H atoms on the left and each H₂O has 2, so put 4 in front of H₂O: C₃H₈ + O₂ → 3CO₂ + 4H₂O.",
      "Oxygen last: the right side now has 3 × 2 + 4 × 1 = 10 O atoms. Each O₂ has 2, so put 5 in front of O₂.",
      "Check: C 3 = 3, H 8 = 8, O 10 = 10. The coefficients 1, 5, 3, 4 share no common factor.",
    ],
    result: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
  },
  {
    title: "Half-equation: permanganate in acid",
    start: "MnO₄⁻ + H⁺ + e⁻ → Mn²⁺ + H₂O",
    steps: [
      "Manganese: one Mn atom on each side, so it is already balanced.",
      "Oxygen: MnO₄⁻ has 4 O atoms, so add 4H₂O on the right.",
      "Hydrogen: 4H₂O contains 8 H atoms, so put 8 in front of H⁺ on the left.",
      "Charge: the left is −1 + 8 = +7 before electrons and the right is +2. Adding 5 electrons to the left brings it to +2.",
    ],
    result: "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O",
  },
] as const;

export const balancingMistakes = [
  "Changing a subscript. Turning H₂O into H₂O₂ balances the oxygen count but describes hydrogen peroxide, a different substance.",
  "Forgetting brackets. In Ca(OH)₂ the 2 multiplies both O and H, so one formula unit contains 2 O and 2 H atoms.",
  "Writing diatomic elements as single atoms. Hydrogen, nitrogen, oxygen and the halogens are H₂, N₂, O₂, F₂, Cl₂, Br₂ and I₂.",
  "Stopping at a correct but unreduced ratio. 4H₂ + 2O₂ → 4H₂O conserves atoms but should be written 2H₂ + O₂ → 2H₂O.",
  "Ignoring charge in ionic equations. Atoms can match while the charges do not; electrons balance the charge in half-equations.",
];

export const balancingFaq = [
  {
    q: "How do you balance a chemical equation step by step?",
    a: "Write correct formulas, count the atoms of each element on both sides, then add coefficients one element at a time. Balance metals first, then other non-metals, then hydrogen and oxygen. Recount every atom and reduce the coefficients to the smallest whole-number ratio.",
  },
  {
    q: "Why can't you change subscripts when balancing an equation?",
    a: "A subscript is part of the formula, so changing it changes the substance. H₂O is water, but H₂O₂ is hydrogen peroxide. Coefficients only change how many units of each substance react, which is why balancing uses coefficients.",
  },
  {
    q: "Which element should you balance first?",
    a: "Start with an element that appears in only one substance on each side, usually a metal. Balance hydrogen and oxygen last, because they often appear in several substances. A polyatomic ion that is unchanged on both sides, such as sulfate, can be balanced as one unit.",
  },
  {
    q: "What do you do if a coefficient comes out as a fraction?",
    a: "Multiply every coefficient by the same number. Ethane combustion, C₂H₆ + 3½O₂ → 2CO₂ + 3H₂O, becomes 2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O after multiplying by 2.",
  },
  {
    q: "How do you balance an ionic equation or a half-equation?",
    a: "Balance the atoms first, then make the total charge equal on both sides. For a half-equation in acid, balance oxygen with H₂O, hydrogen with H⁺, and charge with electrons (e⁻).",
  },
  {
    q: "Why do chemical equations have to be balanced?",
    a: "Atoms are not created or destroyed in a chemical reaction (the law of conservation of mass), so every atom in the reactants must appear in the products. The balanced coefficients also give the mole ratios used in stoichiometry calculations.",
  },
  {
    q: "Is the balancing chemical equations game free?",
    a: "Yes. The game runs in the browser without an account and checks your answer against atom and charge counts. It has 43 equations, from simple combustion and decomposition to ionic equations and redox half-equations.",
  },
];

type Reaction = (typeof reactions)[number];

const reactionNames = (activities.find((activity) => activity.slug === "balance-equation")?.controls.find((control) => control.key === "reaction")?.options ?? []) as string[];

export const balancingCategories = ["Combustion", "Thermal decomposition", "Reactions with acids", "Organic reactions", "Synthesis, displacement and precipitation", "Ionic equations", "Half-equations and redox"] as const;
type Category = (typeof balancingCategories)[number];

function categoryOf(name: string, reaction: Reaction): Category {
  const charged = "charges" in reaction;
  if (reaction.formula.includes("e⁻") || (charged && /permanganate|dichromate|disproportionation/i.test(name))) return "Half-equations and redox";
  if (charged) return "Ionic equations";
  if (/combustion/i.test(name)) return "Combustion";
  if (/decomposition/i.test(name)) return "Thermal decomposition";
  if (/ethene|ethanol oxidation|esterification/i.test(name)) return "Organic reactions";
  if (/acid/i.test(name)) return "Reactions with acids";
  return "Synthesis, displacement and precipitation";
}

const side = (reaction: Reaction, from: number, to: number) => reaction.formula.slice(from, to)
  .map((formula, i) => `${reaction.solution[from + i] === 1 ? "" : reaction.solution[from + i]}${formula}`).join(" + ");

export const formatBalanced = (reaction: Reaction) => `${side(reaction, 0, reaction.split)} → ${side(reaction, reaction.split, reaction.formula.length)}`;
export const formatUnbalanced = (reaction: Reaction) => `${reaction.formula.slice(0, reaction.split).join(" + ")} → ${reaction.formula.slice(reaction.split).join(" + ")}`;

export function balancedEquations() {
  return reactions.map((reaction, index) => ({
    index,
    name: reactionNames[index] ?? `Reaction ${index + 1}`,
    unbalanced: formatUnbalanced(reaction),
    balanced: formatBalanced(reaction),
    category: categoryOf(reactionNames[index] ?? "", reaction),
  }));
}

export function balancedEquationsByCategory() {
  const all = balancedEquations();
  return balancingCategories.map((category) => ({ category, equations: all.filter((equation) => equation.category === category) })).filter((group) => group.equations.length);
}
