import type { Activity } from "./model";

export type TeachingGuide = { question: string; investigate: string; misconception: string; evidence: string };
export const teachingGuides: Record<string, TeachingGuide> = {
  "gas-law-lab": {
    question: "What happens to pressure when you halve the volume of a sealed gas?",
    investigate: "Keep gas amount and temperature fixed. Record pressure at 30, 20, and 10 L, then compare P × V.",
    misconception: "Particles do not grow when heated. Their average kinetic energy increases. The ideal-gas model omits attractions and particle volume.",
    evidence: "At fixed n and T, P × V stays constant; halving V doubles P. Ask students to explain this through wall collisions.",
  },
  "reaction-rate-lab": {
    question: "Will a catalyst change how much product is possible, or how quickly it forms?",
    investigate: "Run at 298 K without a catalyst and record at 20 s. Repeat with a catalyst, keeping initial concentration fixed.",
    misconception: "In this first-order model, concentration changes the initial rate but not the rate constant or half-life. The catalyst speeds the approach to the same final yield.",
    evidence: "Compare conversions at equal times. A strong explanation separates rate, rate constant, and final amount.",
  },
  "molecular-geometry-3d": {
    question: "Why are methane, ammonia, and water different shapes even though each has four electron domains?",
    investigate: "Compare CH₄, NH₃, and H₂O. Show lone pairs and bond angles, then rotate each structure.",
    misconception: "Electron-domain geometry includes lone pairs; molecular shape describes atom positions. Displayed spheres are a model, not hard-edged atoms.",
    evidence: "Look for tetrahedral, trigonal pyramidal, and bent, with increasing numbers of lone pairs. Approximate bond angles decrease across this set.",
  },
  "molecule-builder-3d": {
    question: "Can carbon complete its usual valence using only two oxygen atoms?",
    investigate: "Build water, methane, and carbon dioxide. Compare the number of attached atoms with the sum of bond orders.",
    misconception: "A double bond counts as two toward valence, but as one bonding domain in VSEPR.",
    evidence: "Students should justify two double C=O bonds and distinguish bond order from number of neighboring atoms.",
  },
  "chemical-bonding": {
    question: "How is sharing an electron pair different from transferring an electron?",
    investigate: "Compare NaCl, H₂, and HCl. Record how electron density is distributed before classifying each bond.",
    misconception: "NaCl is an extended ionic lattice, not an isolated covalent molecule. Polar covalent bonds have partial charges, not full ionic charges.",
    evidence: "Students should distinguish transfer, equal sharing, and unequal sharing, with the shared pair closer to Cl in HCl.",
  },
  "acid-base-ph": {
    question: "Do equal concentrations of a strong acid and a weak acid produce the same pH?",
    investigate: "Compare HCl and acetic acid at log concentration −2. Then dilute HCl by a factor of ten and record the pH change.",
    misconception: "Strong means extensively dissociated, not concentrated. Near pH 7, water autoionization matters; dilution does not turn an acid into a base.",
    evidence: "At the same concentration, acetic acid has higher pH than HCl. A tenfold dilution of a sufficiently acidic strong acid raises pH by about one.",
  },
  "neutralization-station": {
    question: "Does neutralization remove all the ions from solution?",
    investigate: "Record at 0, 20, 24.95, 25.00, and 25.05 mL of base. Compare the pH jump and the indicator transition.",
    misconception: "Na⁺ and Cl⁻ remain as spectator ions. Equivalence means equal reacting amounts, while an indicator endpoint is an observed color change.",
    evidence: "25.00 mL gives stoichiometric equivalence and pH 7 at 25 °C. A single extra drop gives a large pH change.",
  },
  "titration-simulator": {
    question: "How can the volume of a known base reveal an unknown acid concentration?",
    investigate: "Make a rough trial, reset to a fresh sample, then repeat with 0.05 mL drops near the steep jump. Record both trials.",
    misconception: "An overshot sample cannot be repaired by subtracting volume on paper. The indicator endpoint and stoichiometric equivalence are distinct.",
    evidence: "Equivalence is 30.00 mL: Cacid = 0.100 × 30.00 / 25.00 = 0.120 mol/L. Compare repeat trials before accepting a result.",
  },
  "states-of-matter-3d": {
    question: "Do particles stop moving when water freezes?",
    investigate: "Compare −20, 25, and 120 °C. Record how particle spacing and motion differ at 1 atm.",
    misconception: "Solid particles still vibrate. Exactly at a phase boundary, phases can coexist; this simplified animation does not model latent heat or boiling time.",
    evidence: "Students should distinguish vibration around fixed positions, rearrangement in a liquid, and gas motion through the chamber.",
  },
  "solubility-curve": {
    question: "Where does dissolved solute go when a saturated solution cools?",
    investigate: "Set solute to 80 g. Compare dissolved and crystalline amounts at 80, 50, and 20 °C.",
    misconception: "Undissolved solute has not disappeared. The linear curve is an illustrative salt, not measured data for every real salt.",
    evidence: "Dissolved solute plus crystals always equals 80 g. At 50 °C, 60 g dissolves and 20 g remains as crystals.",
  },
  "limiting-reagent": {
    question: "Does the reactant with fewer moles always limit the reaction?",
    investigate: "React 4 mol H₂ with 4 mol O₂, then compare with 6 mol H₂ and 3 mol O₂. Account for every atom.",
    misconception: "The limiting reagent depends on the stoichiometric ratio, not simply the smaller starting number. This model assumes complete reaction and 100% yield.",
    evidence: "The first mixture yields 4 mol water with 2 mol oxygen left. The second gives 6 mol water with no excess reactant.",
  },
  "balance-equation": {
    question: "Why can you change coefficients but not subscripts when balancing a reaction?",
    investigate: "Balance each equation and use the atom ledger to explain each coefficient. Reduce to the smallest whole-number ratio.",
    misconception: "Changing a subscript changes the substance. Balancing conserves atoms of each element, not necessarily the number of molecules.",
    evidence: "Water: 2,1,2; ammonia: 1,3,2; methane combustion: 1,2,1,2. Ask for an atom count to support each result.",
  },
  "periodic-table-hunt": {
    question: "What can an element’s position tell you before you know its name?",
    investigate: "Solve each clue using group and period. Compare the positions of Cl, Ne, and Cu.",
    misconception: "Atomic number counts protons, not neutrons or atomic mass. Groups are columns; periods are rows.",
    evidence: "Cl is group 17, period 3; Ne is group 18, period 2; Cu is group 11, period 4. Students should explain their selection.",
  },
};

export type LabRecord = { id: number; conditions: string; readings: [string, string][]; observation: string };
export type Notebook = { prediction: string; observation: string; conclusion: string; records: LabRecord[] };
export const emptyNotebook = (): Notebook => ({ prediction: "", observation: "", conclusion: "", records: [] });
// Storage is user-controlled and may contain an older or malformed notebook.
export function parseNotebook(raw: string | null): Notebook {
  if (!raw) return emptyNotebook();
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data.prediction !== "string" || typeof data.conclusion !== "string" || !Array.isArray(data.records)) return emptyNotebook();
    const records = data.records.filter((r: LabRecord) => r && Number.isFinite(r.id) && typeof r.conditions === "string" && typeof r.observation === "string" && Array.isArray(r.readings) && r.readings.every(pair => Array.isArray(pair) && pair.length === 2 && pair.every(v => typeof v === "string"))).slice(-50);
    return { prediction: data.prediction.slice(0, 4000), observation: typeof data.observation === "string" ? data.observation.slice(0, 2000) : "", conclusion: data.conclusion.slice(0, 4000), records };
  } catch { return emptyNotebook(); }
}
export function describeConditions(activity: Activity, values: Record<string, number>) {
  return activity.controls.filter(c => c.key !== "answer").map(c => `${c.label}: ${c.options ? c.options[values[c.key]] : `${values[c.key]} ${c.unit ?? ""}`}`).join(" · ");
}
