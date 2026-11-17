export type SolidStructureLayout =
  | "rocksalt" | "cesium-chloride" | "fcc" | "hcp" | "bcc"
  | "diamond" | "graphite" | "silica" | "graphene"
  | "fullerene" | "diatomic" | "ice" | "dry-ice";

export type SolidStructure = {
  name: string;
  formula: string;
  family: string;
  layout: SolidStructureLayout;
  elements: string[];
  note: string;
  distances: string[];
};

// Representative, simplified teaching models. Extended solids do not have one
// discrete molecular shape, so keep them separate from the VSEPR molecule library.
export const solidStructures: SolidStructure[] = [
  { name: "Sodium chloride", formula: "NaCl", family: "Giant ionic lattice", layout: "rocksalt", elements: ["Na", "Cl"], note: "Rock-salt lattice: alternating Na⁺ and Cl⁻ ions extend in all directions.", distances: ["Nearest Na⁺–Cl⁻ spacing: 282 pm"] },
  { name: "Magnesium oxide", formula: "MgO", family: "Giant ionic lattice", layout: "rocksalt", elements: ["Mg", "O"], note: "Rock-salt lattice: Mg²⁺ and O²⁻ alternate in a 1:1 repeating structure.", distances: ["Nearest Mg²⁺–O²⁻ spacing: 211 pm"] },
  { name: "Caesium chloride", formula: "CsCl", family: "Giant ionic lattice", layout: "cesium-chloride", elements: ["Cs", "Cl"], note: "CsCl-type lattice: one ion sits at the cube center among the opposite ions at the corners.", distances: ["Nearest Cs⁺–Cl⁻ spacing: 357 pm"] },
  { name: "Magnesium", formula: "Mg", family: "Giant metallic lattice", layout: "hcp", elements: ["Mg"], note: "Simplified hexagonal close-packed array of metal atoms.", distances: ["Nearest Mg–Mg spacing: 320 pm"] },
  { name: "Copper", formula: "Cu", family: "Giant metallic lattice", layout: "fcc", elements: ["Cu"], note: "Simplified face-centered cubic array of metal atoms.", distances: ["Nearest Cu–Cu spacing: 256 pm"] },
  { name: "Sodium", formula: "Na", family: "Giant metallic lattice", layout: "bcc", elements: ["Na"], note: "Simplified body-centered cubic array of metal atoms.", distances: ["Nearest Na–Na spacing: 372 pm"] },
  { name: "Diamond", formula: "C", family: "Giant covalent network", layout: "diamond", elements: ["C"], note: "A simplified 3D tetrahedral carbon network; each carbon has four covalent neighbors.", distances: ["C–C bond: 154 pm"] },
  { name: "Graphite", formula: "C", family: "Giant covalent network", layout: "graphite", elements: ["C"], note: "Layered hexagonal carbon sheets; weak attraction between the sheets is omitted.", distances: ["In-plane C–C bond: 142 pm", "Interlayer C···C spacing: 335 pm"] },
  { name: "Silicon dioxide", formula: "SiO₂", family: "Giant covalent network", layout: "silica", elements: ["Si", "O"], note: "Simplified corner-sharing SiO₄ network; each oxygen bridges neighboring silicon atoms.", distances: ["Si–O bond in quartz: about 161 pm"] },
  { name: "Graphene", formula: "C", family: "Giant covalent network", layout: "graphene", elements: ["C"], note: "A single hexagonal sheet of carbon atoms, shown as a finite patch.", distances: ["C–C bond: 142 pm"] },
  { name: "Fullerene", formula: "C₆₀", family: "Simple molecular solid", layout: "fullerene", elements: ["C"], note: "One representative carbon cage molecule; the surrounding crystal packing is omitted.", distances: ["C–C bonds: about 140 pm (6–6), 146 pm (5–6)"] },
  { name: "Iodine", formula: "I₂", family: "Simple molecular solid", layout: "diatomic", elements: ["I"], note: "Packed diatomic iodine molecules; the displayed bonds are within each molecule.", distances: ["I–I bond: 268 pm"] },
  { name: "Ice", formula: "H₂O", family: "Simple molecular solid", layout: "ice", elements: ["O", "H"], note: "A simplified array of bent water molecules; hydrogen bonds are not drawn.", distances: ["O–H bond: 96 pm", "Nearest O···O spacing: about 276 pm"] },
  { name: "Dry ice", formula: "CO₂", family: "Simple molecular solid", layout: "dry-ice", elements: ["C", "O"], note: "Packed linear carbon dioxide molecules; only intramolecular bonds are drawn.", distances: ["C=O bond: 116 pm"] },
];

