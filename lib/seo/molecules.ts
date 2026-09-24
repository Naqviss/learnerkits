import { molecules } from "@/lib/simulations/chemistry/model";

// Per-molecule reference pages are generated from the same dataset that drives the
// Molecular Geometry 3D lab, so the shape, angle, and 3D model can never disagree.
const names: Record<string, string> = {
  "CO₂": "Carbon dioxide", "BF₃": "Boron trifluoride", "CH₄": "Methane", "NH₃": "Ammonia", "H₂O": "Water",
  "CS₂": "Carbon disulfide", "BeF₂": "Beryllium fluoride", "BeCl₂": "Beryllium chloride", "BeBr₂": "Beryllium bromide",
  "MgCl₂": "Magnesium chloride", "MgBr₂": "Magnesium bromide", "ZnCl₂": "Zinc chloride", "ZnBr₂": "Zinc bromide",
  "CdCl₂": "Cadmium chloride", "HgCl₂": "Mercury(II) chloride", "N₃⁻": "Azide ion",
  "BCl₃": "Boron trichloride", "BBr₃": "Boron tribromide", "BI₃": "Boron triiodide", "AlCl₃": "Aluminum chloride",
  "AlF₃": "Aluminum fluoride", "GaCl₃": "Gallium trichloride", "SO₃": "Sulfur trioxide", "CO₃²⁻": "Carbonate ion",
  "NO₃⁻": "Nitrate ion", "BO₃³⁻": "Borate ion",
  "SO₂": "Sulfur dioxide", "O₃": "Ozone", "NO₂⁻": "Nitrite ion", "SnCl₂": "Tin(II) chloride", "SnBr₂": "Tin(II) bromide",
  "PbCl₂": "Lead(II) chloride", "GeCl₂": "Germanium dichloride", "GeF₂": "Germanium difluoride",
  "CCl₄": "Carbon tetrachloride", "CF₄": "Carbon tetrafluoride", "CBr₄": "Carbon tetrabromide", "SiH₄": "Silane",
  "SiCl₄": "Silicon tetrachloride", "SiF₄": "Silicon tetrafluoride", "SiBr₄": "Silicon tetrabromide", "GeH₄": "Germane",
  "GeCl₄": "Germanium tetrachloride", "GeF₄": "Germanium tetrafluoride", "SnCl₄": "Tin(IV) chloride", "SnBr₄": "Tin(IV) bromide",
  "TiCl₄": "Titanium tetrachloride", "NH₄⁺": "Ammonium ion", "PO₄³⁻": "Phosphate ion", "SO₄²⁻": "Sulfate ion",
  "ClO₄⁻": "Perchlorate ion", "BF₄⁻": "Tetrafluoroborate ion", "MnO₄⁻": "Permanganate ion", "CrO₄²⁻": "Chromate ion",
  "XeO₄": "Xenon tetroxide",
  "PH₃": "Phosphine", "AsH₃": "Arsine", "SbH₃": "Stibine", "NF₃": "Nitrogen trifluoride", "PF₃": "Phosphorus trifluoride",
  "PCl₃": "Phosphorus trichloride", "PBr₃": "Phosphorus tribromide", "AsF₃": "Arsenic trifluoride", "AsCl₃": "Arsenic trichloride",
  "ClO₃⁻": "Chlorate ion", "IO₃⁻": "Iodate ion",
  "H₂S": "Hydrogen sulfide", "H₂Se": "Hydrogen selenide", "H₂Te": "Hydrogen telluride", "OF₂": "Oxygen difluoride",
  "SCl₂": "Sulfur dichloride", "SBr₂": "Sulfur dibromide", "SeCl₂": "Selenium dichloride", "TeCl₂": "Tellurium dichloride",
  "PCl₅": "Phosphorus pentachloride", "PF₅": "Phosphorus pentafluoride", "PBr₅": "Phosphorus pentabromide",
  "AsF₅": "Arsenic pentafluoride", "SbCl₅": "Antimony pentachloride", "SbF₅": "Antimony pentafluoride", "NbCl₅": "Niobium pentachloride",
  "SF₄": "Sulfur tetrafluoride", "SeF₄": "Selenium tetrafluoride", "TeF₄": "Tellurium tetrafluoride",
  "ClF₃": "Chlorine trifluoride", "BrF₃": "Bromine trifluoride", "IF₃": "Iodine trifluoride",
  "XeF₂": "Xenon difluoride", "I₃⁻": "Triiodide ion", "ICl₂⁻": "Dichloroiodate ion",
  "SF₆": "Sulfur hexafluoride", "SeF₆": "Selenium hexafluoride", "TeF₆": "Tellurium hexafluoride", "MoF₆": "Molybdenum hexafluoride",
  "WF₆": "Tungsten hexafluoride", "UF₆": "Uranium hexafluoride", "PF₆⁻": "Hexafluorophosphate ion", "SiF₆²⁻": "Hexafluorosilicate ion",
  "BrF₅": "Bromine pentafluoride", "IF₅": "Iodine pentafluoride", "ClF₅": "Chlorine pentafluoride",
  "XeF₄": "Xenon tetrafluoride", "ICl₄⁻": "Tetrachloroiodate ion", "BrF₄⁻": "Tetrafluorobromate ion",
};

// Simple s/p/d hybridization labels are a poor description of transition-metal and
// actinide centers, so those pages omit the label instead of teaching a misconception.
const noHybridLabel = new Set(["Ti", "Mn", "Cr", "Mo", "W", "U", "Nb"]);

const electronGeometries = ["", "", "Linear", "Trigonal planar", "Tetrahedral", "Trigonal bipyramidal", "Octahedral"];
const hybridizations = ["", "", "sp", "sp²", "sp³", "sp³d", "sp³d²"];
const idealAngles = ["", "", "180°", "120°", "109.5°", "90° and 120°", "90°"];
const subscriptDigits: Record<string, string> = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
const toSubscript = (n: number) => String(n).split("").map((d) => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]).join("");

export type MoleculeReference = {
  index: number;
  slug: string;
  formula: string;
  asciiFormula: string;
  name: string;
  center: string;
  outer: string;
  bondingPairs: number;
  lonePairs: number;
  domains: number;
  axe: string;
  shape: string;
  electronGeometry: string;
  hybridization?: string;
  bondAngle: string;
  angleValue: number;
  isIon: boolean;
  polarity: "Polar" | "Nonpolar" | "Ion";
};

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function bondAngleFor(shape: string, angle: number) {
  switch (shape) {
    case "Trigonal bipyramidal": return "90° (axial) and 120° (equatorial)";
    case "Seesaw": return "Slightly less than 90° and 120° (lone pair compresses the ideal angles)";
    case "T-shaped": return "Slightly less than 90° (lone pairs compress the ideal angle)";
    case "Square pyramidal": return "Slightly less than 90° (lone pair compresses the ideal angle)";
    default: return `≈ ${angle}°`;
  }
}

// A molecule with no lone pairs on the central atom and identical outer atoms is symmetric,
// as are AX₂E₃ (linear) and AX₄E₂ (square planar): the bond dipoles cancel.
function polarityFor(isIon: boolean, lone: number, shape: string): MoleculeReference["polarity"] {
  if (isIon) return "Ion";
  if (lone === 0 || shape === "Linear" || shape === "Square planar") return "Nonpolar";
  return "Polar";
}

export const moleculeReferences: MoleculeReference[] = molecules.map((m, index) => {
  const name = names[m.formula] ?? m.formula;
  const asciiFormula = m.formula.replace(/[₀-₉]/g, (d) => subscriptDigits[d]).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, "").replace(/⁻/g, "-").replace(/⁺/g, "+");
  const isIon = /[⁺⁻]/.test(m.formula);
  const domains = m.count + m.lone;
  return {
    index,
    slug: `${slugify(name)}-${asciiFormula.replace(/[+-]/g, "").toLowerCase()}`,
    formula: m.formula,
    asciiFormula,
    name,
    center: m.center,
    outer: m.outer,
    bondingPairs: m.count,
    lonePairs: m.lone,
    domains,
    axe: `AX${toSubscript(m.count)}${m.lone ? `E${m.lone > 1 ? toSubscript(m.lone) : ""}` : ""}`,
    shape: m.shape,
    electronGeometry: electronGeometries[domains],
    hybridization: noHybridLabel.has(m.center) ? undefined : hybridizations[domains],
    bondAngle: bondAngleFor(m.shape, m.angle),
    angleValue: m.angle,
    isIon,
    polarity: polarityFor(isIon, m.lone, m.shape),
  };
});

export function getMoleculeReference(slug: string) {
  return moleculeReferences.find((m) => m.slug === slug);
}

export function getMoleculesWithShape(shape: string, axe: string) {
  return moleculeReferences.filter((m) => m.shape === shape && m.axe === axe);
}

// One row per VSEPR class, in electron-domain order, for the shapes chart.
export function getVseprClasses() {
  const seen = new Map<string, { axe: string; shape: string; electronGeometry: string; domains: number; lonePairs: number; hybridization: string; idealAngle: string; examples: MoleculeReference[] }>();
  for (const m of moleculeReferences) {
    const key = `${m.axe}|${m.shape}`;
    const row = seen.get(key);
    if (row) row.examples.push(m);
    else seen.set(key, { axe: m.axe, shape: m.shape, electronGeometry: m.electronGeometry, domains: m.domains, lonePairs: m.lonePairs, hybridization: hybridizations[m.domains], idealAngle: idealAngles[m.domains], examples: [m] });
  }
  return [...seen.values()].sort((a, b) => a.domains - b.domains || a.lonePairs - b.lonePairs);
}

const numberWords = ["zero", "one", "two", "three", "four", "five", "six"];
const pairs = (n: number, noun: string) => `${numberWords[n]} ${noun}${n === 1 ? "" : "s"}`;

export function moleculeCopy(m: MoleculeReference) {
  const label = `${m.name} (${m.formula})`;
  const lead = `${label} has a ${m.shape.toLowerCase()} molecular geometry with a bond angle of ${m.bondAngle.startsWith("≈") ? `about ${m.angleValue}°` : m.bondAngle[0].toLowerCase() + m.bondAngle.slice(1)}. Its central ${m.center} atom has ${pairs(m.bondingPairs, "bonding domain")} and ${pairs(m.lonePairs, "lone pair")}, so its VSEPR notation is ${m.axe}.`;
  const why = m.lonePairs === 0
    ? `The central ${m.center} atom has ${pairs(m.domains, "electron domain")}, all of them bonds to ${m.outer} atoms. With no lone pairs, the domains spread as far apart as possible and the molecular shape matches the electron geometry: ${m.electronGeometry.toLowerCase()}.`
    : `The central ${m.center} atom has ${pairs(m.domains, "electron domain")}: ${pairs(m.bondingPairs, "bonding domain")} and ${pairs(m.lonePairs, "lone pair")}. The domains arrange in a ${m.electronGeometry.toLowerCase()} electron geometry, but the molecular shape describes only where the atoms are, so the lone pairs turn it into a ${m.shape.toLowerCase()} shape. Lone pairs repel more strongly than bonding pairs, which is why the bond angle is squeezed below the ideal ${idealAngles[m.domains]}.`;
  const polarity = m.polarity === "Ion"
    ? `${m.formula} is a polyatomic ion, so it carries a net charge. "Polar or nonpolar" usually describes neutral molecules; what matters for an ion is its charge and how that charge is spread over the ${m.shape.toLowerCase()} structure.`
    : m.polarity === "Nonpolar"
      ? `${m.formula} is nonpolar. Its ${m.center}–${m.outer} bonds may be polar, but the ${m.shape.toLowerCase()} arrangement is symmetric, so the bond dipoles cancel and there is no net dipole moment.`
      : `${m.formula} is polar. The ${m.shape.toLowerCase()} shape is not symmetric because of the lone pair${m.lonePairs === 1 ? "" : "s"} on ${m.center}, so the bond dipoles do not cancel and the molecule has a net dipole moment.`;
  const faq = [
    { q: `What is the molecular geometry of ${m.formula}?`, a: `${label} has a ${m.shape.toLowerCase()} molecular geometry (VSEPR class ${m.axe}). The central ${m.center} atom has ${pairs(m.bondingPairs, "bonding domain")} and ${pairs(m.lonePairs, "lone pair")}.` },
    { q: `What is the bond angle of ${m.formula}?`, a: `The ${m.center}–${m.outer} bond angle in ${m.formula} is ${m.bondAngle.replace("≈ ", "about ")}.${m.lonePairs ? ` It is smaller than the ideal ${idealAngles[m.domains]} because lone pairs repel more strongly than bonding pairs.` : ""}` },
    { q: `What is the electron geometry of ${m.formula}?`, a: `${m.formula} has ${pairs(m.domains, "electron domain")} around the central ${m.center} atom, so its electron geometry is ${m.electronGeometry.toLowerCase()}.${m.lonePairs ? ` The molecular shape differs (${m.shape.toLowerCase()}) because lone pairs are not counted as part of the shape.` : " With no lone pairs, the molecular shape is the same."}` },
    ...(m.hybridization ? [{ q: `What is the hybridization of ${m.formula}?`, a: `In the hybridization model, the central ${m.center} atom in ${m.formula} is ${m.hybridization} hybridized because it has ${pairs(m.domains, "electron domain")}.${m.domains > 4 ? " Many chemists now describe expanded-octet bonding without d-orbital hybridization, but sp³d/sp³d² remains the label used in most school courses." : ""}` }] : []),
    { q: `Is ${m.formula} polar or nonpolar?`, a: polarity },
  ];
  return { label, lead, why, polarity, faq };
}
