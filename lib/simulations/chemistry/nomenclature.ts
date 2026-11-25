export type Compound = {
  name: string;
  formula: string;
  structure?: string;
  aliases?: string[];
};

export const inorganicCompounds: Compound[] = [
  { name: "Sodium chloride", formula: "NaCl", aliases: ["table salt"] },
  { name: "Potassium chloride", formula: "KCl" },
  { name: "Magnesium chloride", formula: "MgCl₂" },
  { name: "Calcium chloride", formula: "CaCl₂" },
  { name: "Calcium fluoride", formula: "CaF₂" },
  { name: "Magnesium oxide", formula: "MgO" },
  { name: "Aluminium oxide", formula: "Al₂O₃", aliases: ["aluminum oxide"] },
  { name: "Iron(II) chloride", formula: "FeCl₂" },
  { name: "Iron(III) chloride", formula: "FeCl₃" },
  { name: "Copper(I) oxide", formula: "Cu₂O" },
  { name: "Copper(II) oxide", formula: "CuO" },
  { name: "Calcium carbonate", formula: "CaCO₃" },
  { name: "Calcium hydroxide", formula: "Ca(OH)₂" },
  { name: "Sodium hydroxide", formula: "NaOH" },
  { name: "Sodium hydrogen carbonate", formula: "NaHCO₃", aliases: ["sodium bicarbonate", "baking soda"] },
  { name: "Potassium nitrate", formula: "KNO₃" },
  { name: "Ammonium sulfate", formula: "(NH₄)₂SO₄" },
  { name: "Carbon monoxide", formula: "CO" },
  { name: "Carbon dioxide", formula: "CO₂" },
  { name: "Sulfur dioxide", formula: "SO₂" },
  { name: "Sulfur trioxide", formula: "SO₃" },
  { name: "Dinitrogen monoxide", formula: "N₂O", aliases: ["nitrous oxide"] },
  { name: "Dinitrogen tetroxide", formula: "N₂O₄" },
];

export const organicCompounds: Compound[] = [
  { name: "Methane", formula: "CH₄" },
  { name: "Ethane", formula: "C₂H₆", structure: "CH₃–CH₃" },
  { name: "Propane", formula: "C₃H₈", structure: "CH₃–CH₂–CH₃" },
  { name: "Butane", formula: "C₄H₁₀", structure: "CH₃–CH₂–CH₂–CH₃" },
  { name: "2-Methylpropane", formula: "C₄H₁₀", structure: "CH₃–CH(CH₃)–CH₃", aliases: ["isobutane"] },
  { name: "Ethene", formula: "C₂H₄", structure: "CH₂=CH₂", aliases: ["ethylene"] },
  { name: "Propene", formula: "C₃H₆", structure: "CH₂=CH–CH₃" },
  { name: "But-1-ene", formula: "C₄H₈", structure: "CH₂=CH–CH₂–CH₃" },
  { name: "But-2-ene", formula: "C₄H₈", structure: "CH₃–CH=CH–CH₃" },
  { name: "Ethyne", formula: "C₂H₂", structure: "HC≡CH", aliases: ["acetylene"] },
  { name: "Methanol", formula: "CH₄O", structure: "CH₃OH" },
  { name: "Ethanol", formula: "C₂H₆O", structure: "CH₃–CH₂OH" },
  { name: "Methoxymethane", formula: "C₂H₆O", structure: "CH₃–O–CH₃", aliases: ["dimethyl ether"] },
  { name: "Propan-1-ol", formula: "C₃H₈O", structure: "CH₃–CH₂–CH₂OH" },
  { name: "Propan-2-ol", formula: "C₃H₈O", structure: "CH₃–CH(OH)–CH₃", aliases: ["isopropanol"] },
  { name: "Butan-2-ol", formula: "C₄H₁₀O", structure: "CH₃–CH(OH)–CH₂–CH₃" },
  { name: "Ethanal", formula: "C₂H₄O", structure: "CH₃–CHO" },
  { name: "Propanone", formula: "C₃H₆O", structure: "CH₃–CO–CH₃", aliases: ["acetone"] },
  { name: "Ethanoic acid", formula: "C₂H₄O₂", structure: "CH₃–COOH", aliases: ["acetic acid"] },
];

function formulaKey(value: string) {
  return value.normalize("NFKC").replace(/[\s–-]/g, "");
}

export function findCompounds(compounds: Compound[], input: string) {
  const query = input.trim().toLowerCase();
  const formula = formulaKey(input);
  if (!query) return compounds;
  return compounds.filter(compound =>
    [compound.formula, compound.structure].some(value => value && formulaKey(value) === formula) ||
    [compound.name, ...(compound.aliases ?? [])].some(name => name.toLowerCase().includes(query))
  );
}
