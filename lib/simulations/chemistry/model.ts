// Educational models: ideal gases, dilute solutions at 25 °C, and ideal VSEPR.
export type Values = Record<string, number>;
export type Control = { key: string; label: string; min: number; max: number; step: number; value: number; unit?: string; options?: string[] };
export type Activity = { slug: string; instrument: string; mission: string; hint: string; science: string; controls: Control[] };
const slider = (key: string, label: string, min: number, max: number, step: number, value: number, unit = ""): Control => ({ key, label, min, max, step, value, unit });
const choice = (key: string, label: string, options: string[], value = 0): Control => ({ key, label, options, value, min: 0, max: options.length - 1, step: 1 });
// VSEPR library: one entry per AXn(lone pairs) molecule or common ion. `count` is bonding
// domains, `lone` is lone pairs on the central atom; together they set the 3D geometry
// (see MolecularScene's directionsFor). `angle` is the commonly cited approximate bond
// angle shown in the UI; `order` is the uniform bond order drawn for every outer atom.
export const molecules = [
  { formula: "CO₂", center: "C", outer: "O", count: 2, lone: 0, angle: 180, shape: "Linear", order: 2 },
  { formula: "BF₃", center: "B", outer: "F", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "CH₄", center: "C", outer: "H", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "NH₃", center: "N", outer: "H", count: 3, lone: 1, angle: 107, shape: "Trigonal pyramidal", order: 1 },
  { formula: "H₂O", center: "O", outer: "H", count: 2, lone: 2, angle: 104.5, shape: "Bent", order: 1 },
  // Linear, AX2E0
  { formula: "CS₂", center: "C", outer: "S", count: 2, lone: 0, angle: 180, shape: "Linear", order: 2 },
  { formula: "BeF₂", center: "Be", outer: "F", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "BeCl₂", center: "Be", outer: "Cl", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "BeBr₂", center: "Be", outer: "Br", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "MgCl₂", center: "Mg", outer: "Cl", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "MgBr₂", center: "Mg", outer: "Br", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "ZnCl₂", center: "Zn", outer: "Cl", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "ZnBr₂", center: "Zn", outer: "Br", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "CdCl₂", center: "Cd", outer: "Cl", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "HgCl₂", center: "Hg", outer: "Cl", count: 2, lone: 0, angle: 180, shape: "Linear", order: 1 },
  { formula: "N₃⁻", center: "N", outer: "N", count: 2, lone: 0, angle: 180, shape: "Linear", order: 2 },
  // Trigonal planar, AX3E0
  { formula: "BCl₃", center: "B", outer: "Cl", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "BBr₃", center: "B", outer: "Br", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "BI₃", center: "B", outer: "I", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "AlCl₃", center: "Al", outer: "Cl", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "AlF₃", center: "Al", outer: "F", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "GaCl₃", center: "Ga", outer: "Cl", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "SO₃", center: "S", outer: "O", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 2 },
  { formula: "CO₃²⁻", center: "C", outer: "O", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "NO₃⁻", center: "N", outer: "O", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  { formula: "BO₃³⁻", center: "B", outer: "O", count: 3, lone: 0, angle: 120, shape: "Trigonal planar", order: 1 },
  // Bent, AX2E1 (3 domains)
  { formula: "SO₂", center: "S", outer: "O", count: 2, lone: 1, angle: 119, shape: "Bent", order: 1 },
  { formula: "O₃", center: "O", outer: "O", count: 2, lone: 1, angle: 117, shape: "Bent", order: 1 },
  { formula: "NO₂⁻", center: "N", outer: "O", count: 2, lone: 1, angle: 115, shape: "Bent", order: 1 },
  { formula: "SnCl₂", center: "Sn", outer: "Cl", count: 2, lone: 1, angle: 95, shape: "Bent", order: 1 },
  { formula: "SnBr₂", center: "Sn", outer: "Br", count: 2, lone: 1, angle: 98, shape: "Bent", order: 1 },
  { formula: "PbCl₂", center: "Pb", outer: "Cl", count: 2, lone: 1, angle: 98, shape: "Bent", order: 1 },
  { formula: "GeCl₂", center: "Ge", outer: "Cl", count: 2, lone: 1, angle: 100, shape: "Bent", order: 1 },
  { formula: "GeF₂", center: "Ge", outer: "F", count: 2, lone: 1, angle: 97, shape: "Bent", order: 1 },
  // Tetrahedral, AX4E0
  { formula: "CCl₄", center: "C", outer: "Cl", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "CF₄", center: "C", outer: "F", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "CBr₄", center: "C", outer: "Br", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "SiH₄", center: "Si", outer: "H", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "SiCl₄", center: "Si", outer: "Cl", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "SiF₄", center: "Si", outer: "F", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "SiBr₄", center: "Si", outer: "Br", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "GeH₄", center: "Ge", outer: "H", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "GeCl₄", center: "Ge", outer: "Cl", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "GeF₄", center: "Ge", outer: "F", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "SnCl₄", center: "Sn", outer: "Cl", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "SnBr₄", center: "Sn", outer: "Br", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "TiCl₄", center: "Ti", outer: "Cl", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "NH₄⁺", center: "N", outer: "H", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "PO₄³⁻", center: "P", outer: "O", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "SO₄²⁻", center: "S", outer: "O", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "ClO₄⁻", center: "Cl", outer: "O", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "BF₄⁻", center: "B", outer: "F", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "MnO₄⁻", center: "Mn", outer: "O", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "CrO₄²⁻", center: "Cr", outer: "O", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 1 },
  { formula: "XeO₄", center: "Xe", outer: "O", count: 4, lone: 0, angle: 109.5, shape: "Tetrahedral", order: 2 },
  // Trigonal pyramidal, AX3E1 (4 domains)
  { formula: "PH₃", center: "P", outer: "H", count: 3, lone: 1, angle: 93.5, shape: "Trigonal pyramidal", order: 1 },
  { formula: "AsH₃", center: "As", outer: "H", count: 3, lone: 1, angle: 91.8, shape: "Trigonal pyramidal", order: 1 },
  { formula: "SbH₃", center: "Sb", outer: "H", count: 3, lone: 1, angle: 91.5, shape: "Trigonal pyramidal", order: 1 },
  { formula: "NF₃", center: "N", outer: "F", count: 3, lone: 1, angle: 102.5, shape: "Trigonal pyramidal", order: 1 },
  { formula: "PF₃", center: "P", outer: "F", count: 3, lone: 1, angle: 97.8, shape: "Trigonal pyramidal", order: 1 },
  { formula: "PCl₃", center: "P", outer: "Cl", count: 3, lone: 1, angle: 100.3, shape: "Trigonal pyramidal", order: 1 },
  { formula: "PBr₃", center: "P", outer: "Br", count: 3, lone: 1, angle: 101, shape: "Trigonal pyramidal", order: 1 },
  { formula: "AsF₃", center: "As", outer: "F", count: 3, lone: 1, angle: 96, shape: "Trigonal pyramidal", order: 1 },
  { formula: "AsCl₃", center: "As", outer: "Cl", count: 3, lone: 1, angle: 98.9, shape: "Trigonal pyramidal", order: 1 },
  { formula: "ClO₃⁻", center: "Cl", outer: "O", count: 3, lone: 1, angle: 107, shape: "Trigonal pyramidal", order: 1 },
  { formula: "IO₃⁻", center: "I", outer: "O", count: 3, lone: 1, angle: 101, shape: "Trigonal pyramidal", order: 1 },
  // Bent, AX2E2 (4 domains)
  { formula: "H₂S", center: "S", outer: "H", count: 2, lone: 2, angle: 92.1, shape: "Bent", order: 1 },
  { formula: "H₂Se", center: "Se", outer: "H", count: 2, lone: 2, angle: 91, shape: "Bent", order: 1 },
  { formula: "H₂Te", center: "Te", outer: "H", count: 2, lone: 2, angle: 90, shape: "Bent", order: 1 },
  { formula: "OF₂", center: "O", outer: "F", count: 2, lone: 2, angle: 103.3, shape: "Bent", order: 1 },
  { formula: "SCl₂", center: "S", outer: "Cl", count: 2, lone: 2, angle: 103, shape: "Bent", order: 1 },
  { formula: "SBr₂", center: "S", outer: "Br", count: 2, lone: 2, angle: 100, shape: "Bent", order: 1 },
  { formula: "SeCl₂", center: "Se", outer: "Cl", count: 2, lone: 2, angle: 99, shape: "Bent", order: 1 },
  { formula: "TeCl₂", center: "Te", outer: "Cl", count: 2, lone: 2, angle: 97, shape: "Bent", order: 1 },
  // Trigonal bipyramidal, AX5E0
  { formula: "PCl₅", center: "P", outer: "Cl", count: 5, lone: 0, angle: 120, shape: "Trigonal bipyramidal", order: 1 },
  { formula: "PF₅", center: "P", outer: "F", count: 5, lone: 0, angle: 120, shape: "Trigonal bipyramidal", order: 1 },
  { formula: "PBr₅", center: "P", outer: "Br", count: 5, lone: 0, angle: 120, shape: "Trigonal bipyramidal", order: 1 },
  { formula: "AsF₅", center: "As", outer: "F", count: 5, lone: 0, angle: 120, shape: "Trigonal bipyramidal", order: 1 },
  { formula: "SbCl₅", center: "Sb", outer: "Cl", count: 5, lone: 0, angle: 120, shape: "Trigonal bipyramidal", order: 1 },
  { formula: "SbF₅", center: "Sb", outer: "F", count: 5, lone: 0, angle: 120, shape: "Trigonal bipyramidal", order: 1 },
  { formula: "NbCl₅", center: "Nb", outer: "Cl", count: 5, lone: 0, angle: 120, shape: "Trigonal bipyramidal", order: 1 },
  // Seesaw, AX4E1 (5 domains)
  { formula: "SF₄", center: "S", outer: "F", count: 4, lone: 1, angle: 90, shape: "Seesaw", order: 1 },
  { formula: "SeF₄", center: "Se", outer: "F", count: 4, lone: 1, angle: 90, shape: "Seesaw", order: 1 },
  { formula: "TeF₄", center: "Te", outer: "F", count: 4, lone: 1, angle: 90, shape: "Seesaw", order: 1 },
  // T-shaped, AX3E2 (5 domains)
  { formula: "ClF₃", center: "Cl", outer: "F", count: 3, lone: 2, angle: 90, shape: "T-shaped", order: 1 },
  { formula: "BrF₃", center: "Br", outer: "F", count: 3, lone: 2, angle: 90, shape: "T-shaped", order: 1 },
  { formula: "IF₃", center: "I", outer: "F", count: 3, lone: 2, angle: 90, shape: "T-shaped", order: 1 },
  // Linear, AX2E3 (5 domains)
  { formula: "XeF₂", center: "Xe", outer: "F", count: 2, lone: 3, angle: 180, shape: "Linear", order: 1 },
  { formula: "I₃⁻", center: "I", outer: "I", count: 2, lone: 3, angle: 180, shape: "Linear", order: 1 },
  { formula: "ICl₂⁻", center: "I", outer: "Cl", count: 2, lone: 3, angle: 180, shape: "Linear", order: 1 },
  // Octahedral, AX6E0
  { formula: "SF₆", center: "S", outer: "F", count: 6, lone: 0, angle: 90, shape: "Octahedral", order: 1 },
  { formula: "SeF₆", center: "Se", outer: "F", count: 6, lone: 0, angle: 90, shape: "Octahedral", order: 1 },
  { formula: "TeF₆", center: "Te", outer: "F", count: 6, lone: 0, angle: 90, shape: "Octahedral", order: 1 },
  { formula: "MoF₆", center: "Mo", outer: "F", count: 6, lone: 0, angle: 90, shape: "Octahedral", order: 1 },
  { formula: "WF₆", center: "W", outer: "F", count: 6, lone: 0, angle: 90, shape: "Octahedral", order: 1 },
  { formula: "UF₆", center: "U", outer: "F", count: 6, lone: 0, angle: 90, shape: "Octahedral", order: 1 },
  { formula: "PF₆⁻", center: "P", outer: "F", count: 6, lone: 0, angle: 90, shape: "Octahedral", order: 1 },
  { formula: "SiF₆²⁻", center: "Si", outer: "F", count: 6, lone: 0, angle: 90, shape: "Octahedral", order: 1 },
  // Square pyramidal, AX5E1 (6 domains)
  { formula: "BrF₅", center: "Br", outer: "F", count: 5, lone: 1, angle: 90, shape: "Square pyramidal", order: 1 },
  { formula: "IF₅", center: "I", outer: "F", count: 5, lone: 1, angle: 90, shape: "Square pyramidal", order: 1 },
  { formula: "ClF₅", center: "Cl", outer: "F", count: 5, lone: 1, angle: 90, shape: "Square pyramidal", order: 1 },
  // Square planar, AX4E2 (6 domains)
  { formula: "XeF₄", center: "Xe", outer: "F", count: 4, lone: 2, angle: 90, shape: "Square planar", order: 1 },
  { formula: "ICl₄⁻", center: "I", outer: "Cl", count: 4, lone: 2, angle: 90, shape: "Square planar", order: 1 },
  { formula: "BrF₄⁻", center: "Br", outer: "F", count: 4, lone: 2, angle: 90, shape: "Square planar", order: 1 },
];
export const builderMolecules = [4, 2, 0];
const moleculeFormulas = molecules.map(m => m.formula);
// Word-only color descriptions for the legend (matches MolecularScene's hex swatches).
export const elementColorNames: Record<string, string> = {
  H: "white", O: "red", C: "slate", N: "blue", F: "green", B: "tan",
  Al: "lavender", Si: "sand", P: "orange", S: "yellow", Cl: "jade", Ga: "rose", Ge: "teal-gray",
  As: "purple", Se: "amber", Br: "brick", Sn: "pewter", Sb: "mauve", Te: "gold", I: "violet", Xe: "cyan",
  Be: "sage", Mg: "moss", Ti: "steel", Zn: "periwinkle", Cd: "cream", Hg: "silver", Pb: "gray",
  Mo: "teal", W: "azure", U: "sky", Nb: "aqua", Mn: "plum", Cr: "cobalt",
};
export const activities: Activity[] = [
  { slug: "gas-law-lab", instrument: "Pressure chamber", mission: "Tune the chamber to 150 ± 3 kPa.", hint: "Compress the gas or warm it to increase pressure. Try 1 mol at 300 K in about 16.6 L.", science: "PV = nRT. Ideal gas; R = 8.314 kPa·L·mol⁻¹·K⁻¹. Particle count is illustrative.", controls: [slider("volume", "Chamber volume", 5, 40, .1, 25, "L"), slider("temperature", "Temperature", 200, 600, 1, 300, "K"), slider("moles", "Gas amount", .2, 2, .1, 1, "mol")] },
  { slug: "reaction-rate-lab", instrument: "Kinetics reactor", mission: "Reach at least 80% conversion within 20 simulated seconds.", hint: "Increase temperature or use a catalyst, then restart the reaction. Conditions are locked during a run.", science: "A → B, first-order model: [A] = [A]₀e⁻ᵏᵗ. k = 0.035 exp[(Eₐ/R)(1/298 − 1/T)] s⁻¹, Eₐ = 40 kJ/mol. Catalyst multiplies k by 3 in this teaching model.", controls: [slider("temperature", "Reactor temperature", 280, 340, 1, 298, "K"), slider("concentration", "Initial A concentration", .1, 2, .1, 1, "mol/L"), choice("catalyst", "Catalyst", ["Absent", "Present"])] },
  { slug: "molecular-geometry-3d", instrument: "Molecular observatory", mission: "Find the bent molecule with two lone pairs and identify its shape.", hint: "Choose water, inspect the lone pairs, and select Bent. Drag the model to inspect it from another angle.", science: "VSEPR models electron-domain repulsion. Displayed bond angles are approximate molecular values. Ball sizes and bond lengths are illustrative.", controls: [choice("molecule", "Inspect molecule", moleculeFormulas), choice("answer", "Identify its shape", ["Choose a shape", "Linear", "Trigonal planar", "Tetrahedral", "Trigonal pyramidal", "Bent", "Trigonal bipyramidal", "Seesaw", "T-shaped", "Octahedral", "Square pyramidal", "Square planar"])] },
  { slug: "molecule-builder-3d", instrument: "Molecule workshop", mission: "Build the displayed target by attaching the correct atoms and bond orders.", hint: "Water needs two single O–H bonds; methane four single C–H bonds; carbon dioxide two double C=O bonds. Select a socket to remove a bond.", science: "This guided builder uses common neutral valences: H = 1, O = 2, C = 4. It builds three specific target molecules, not arbitrary chemical structures.", controls: [choice("target", "Target molecule", ["H₂O · water", "CH₄ · methane", "CO₂ · carbon dioxide"])] },
  { slug: "chemical-bonding", instrument: "Electron exchange", mission: "Classify the bond in each of three pairs: NaCl, H₂, and HCl.", hint: "NaCl forms ions; H₂ shares equally; HCl shares unequally. Move through all three pairs and check each answer.", science: "Bond character is a continuum. These examples illustrate ionic, nonpolar covalent, and polar covalent bonding; NaCl represents a formula unit of an extended lattice.", controls: [choice("pair", "Atom pair", ["Na + Cl", "H + H", "H + Cl"]), choice("answer", "Bond type", ["Choose a bond", "Ionic", "Nonpolar covalent", "Polar covalent"])] },
  { slug: "acid-base-ph", instrument: "pH analysis bench", mission: "Prepare a strong-acid solution at pH 3.00 ± 0.10.", hint: "Select HCl and set log₁₀ concentration to −3. Compare with acetic acid at the same concentration.", science: "At 25 °C, Kᵥ = 10⁻¹⁴. HCl/NaOH fully dissociate. Acetic acid uses Kₐ = 1.8 × 10⁻⁵ and charge balance including water. Indicator colors are illustrative.", controls: [choice("solution", "Solution", ["HCl · strong acid", "CH₃COOH · weak acid", "NaOH · strong base"]), slider("logC", "log₁₀ concentration", -7, -1, .1, -2, "mol/L exponent")] },
  { slug: "neutralization-station", instrument: "Neutralization bench", mission: "Neutralize 25 mL of 0.100 M HCl with 0.100 M NaOH. Stop at pH 6–8.", hint: "Add 5 mL portions until near 25 mL, then use 0.05 mL drops. Overshot? Reset the experiment.", science: "H⁺ + OH⁻ → H₂O. A 1:1 strong acid–base reaction at 25 °C. Volume is additive; the pH calculation includes water autoionization.", controls: [] },
  { slug: "titration-simulator", instrument: "Volumetric analysis", mission: "Titrate 25.00 mL of unknown HCl using 0.100 M NaOH. Stop at pH 6–8 and report its concentration within 0.002 M.", hint: "Approach the sharp jump slowly. At equivalence, Cacid = Cbase × Vbase / Vacid. The pH probe helps locate the endpoint.", science: "Strong monoprotic acid–base titration at 25 °C. The pH curve uses excess acid/base and Kᵥ. A fresh sample is needed after overshooting.", controls: [slider("estimate", "Your concentration estimate", .02, .2, .001, .05, "mol/L")] },
  { slug: "states-of-matter-3d", instrument: "Thermal chamber", mission: "Observe solid, liquid, and gas water by changing temperature. Check each phase.", hint: "At 1 atm: try −20 °C, 25 °C, and 120 °C. Particle motion and spacing change with the phase.", science: "Water at 1 atm: freezing at 0 °C and boiling at 100 °C. This equilibrium illustration omits latent-heat plateaus and represents particles as spheres.", controls: [slider("temperature", "Temperature", -40, 140, 1, 25, "°C")] },
  { slug: "solubility-curve", instrument: "Crystallization bench", mission: "Leave 15–25 g of crystals from 80 g of solute in 100 g of water.", hint: "Fix the added solute at 80 g, then cool until capacity is about 60 g. Excess solute becomes crystals.", science: "Illustrative salt: solubility S = 20 + 0.8T grams per 100 g water. This teaching curve is not experimental data for a named substance. Equilibrium is immediate.", controls: [slider("temperature", "Water temperature", 0, 100, 1, 80, "°C"), slider("solute", "Added solute", 0, 120, 1, 40, "g")] },
  { slug: "limiting-reagent", instrument: "Stoichiometry reactor", mission: "Make 6 mol of water with no leftover hydrogen or oxygen.", hint: "The recipe is 2 H₂ + O₂ → 2 H₂O. You need twice as many moles of H₂ as O₂.", science: "Extent ξ = min(nH₂/2, nO₂). Water yield = 2ξ. Reactants are consumed in exact stoichiometric proportions; 100% yield is assumed.", controls: [slider("hydrogen", "Hydrogen H₂", 1, 12, 1, 4, "mol"), slider("oxygen", "Oxygen O₂", 1, 8, 1, 4, "mol")] },
  { slug: "balance-equation", instrument: "Atom conservation", mission: "Balance all three equations using the smallest whole-number coefficients.", hint: "Count each element on both sides. Change coefficients, never chemical subscripts.", science: "Atoms are conserved in chemical reactions. Coefficients multiply every atom in a formula. The challenge requires the lowest whole-number ratio.", controls: [choice("reaction", "Reaction", ["Water formation", "Ammonia synthesis", "Methane combustion"])] },
  { slug: "periodic-table-hunt", instrument: "Element detective", mission: "Solve three clues by selecting elements in the first 36 elements of the periodic table.", hint: "Find the group (column) and period (row) in each clue. The number in a tile is its atomic number.", science: "The first 36 elements retain their actual group and period positions. Atomic number equals proton count; shells shown for the selected examples are simplified.", controls: [] },
];
export const initialValues = (activity: Activity): Values => Object.fromEntries(activity.controls.map(c => [c.key, c.value]));
export const reactions = [
  { formula: ["H₂", "O₂", "H₂O"], atoms: [{ H: 2, O: 0 }, { H: 0, O: 2 }, { H: 2, O: 1 }], split: 2, solution: [2, 1, 2] },
  { formula: ["N₂", "H₂", "NH₃"], atoms: [{ N: 2, H: 0 }, { N: 0, H: 2 }, { N: 1, H: 3 }], split: 2, solution: [1, 3, 2] },
  { formula: ["CH₄", "O₂", "CO₂", "H₂O"], atoms: [{ C: 1, H: 4, O: 0 }, { C: 0, H: 0, O: 2 }, { C: 1, H: 0, O: 2 }, { C: 0, H: 2, O: 1 }], split: 2, solution: [1, 2, 1, 2] },
];
export const elementSymbols = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr".split(" ");
export const elementGroups = [1,18,1,2,13,14,15,16,17,18,1,2,13,14,15,16,17,18,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
export const elementPeriod = (z: number) => z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : 4;
export const clues = [{ text: "I am a period 3 halogen in group 17. Which element am I?", z: 17 }, { text: "I am the period 2 noble gas in group 18.", z: 10 }, { text: "I am in period 4, group 11. My symbol comes from cuprum.", z: 29 }];
export const rateConstant = (v: Values) => .035 * Math.exp(40000 / 8.314 * (1 / 298 - 1 / v.temperature)) * (v.catalyst ? 3 : 1);
export const phase = (temperature: number) => temperature < 0 ? "Solid" : temperature < 100 ? "Liquid" : "Gas";
export function strongPH(excessAcid: number) {
  const h = excessAcid >= 0 ? (excessAcid + Math.hypot(excessAcid, 2e-7)) / 2 : 2e-14 / (Math.hypot(excessAcid, 2e-7) - excessAcid);
  return -Math.log10(h);
}
export function solutionPH(v: Values) {
  const c = 10 ** v.logC;
  if (v.solution !== 1) return strongPH(v.solution === 2 ? -c : c);
  // Charge balance h = Ka*C/(Ka+h) + Kw/h; monotonic root.
  let lo = 1e-7, hi = c + 1e-7;
  for (let i = 0; i < 70; i++) { const h = (lo + hi) / 2; if (h - 1.8e-5 * c / (1.8e-5 + h) - 1e-14 / h > 0) hi = h; else lo = h; }
  return -Math.log10((lo + hi) / 2);
}
export const titrationPH = (ml: number, acid = .1) => strongPH((acid * 25 - .1 * ml) / (25 + ml));
export const phColor = (pH: number) => `hsl(${Math.max(0, Math.min(14, pH)) * 20}, 76%, 57%)`;
export function yieldResult(h: number, o: number) { const extent = Math.min(h / 2, o); return { water: extent * 2, hydrogen: h - extent * 2, oxygen: o - extent }; }
export function atomBalance(reaction: number, coefficients: number[]) {
  const r = reactions[reaction];
  const keys = [...new Set(r.atoms.flatMap(a => Object.keys(a)))];
  return keys.map(element => ({ element, left: r.atoms.slice(0, r.split).reduce((s, a, i) => s + ((a as Record<string, number>)[element] ?? 0) * coefficients[i], 0), right: r.atoms.slice(r.split).reduce((s, a, i) => s + ((a as Record<string, number>)[element] ?? 0) * coefficients[i + r.split], 0) }));
}
