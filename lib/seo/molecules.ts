import { moleculeNames as names, molecules } from "@/lib/simulations/chemistry/model";
import { bondLengthText, bondLengths } from "@/lib/simulations/chemistry/bondLengths";

// Per-molecule reference pages are generated from the same dataset that drives the
// Molecular Geometry 3D lab, so the shape, angle, and 3D model can never disagree.

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

// Short bond-angle label for search titles and descriptions.
function angleShort(m: MoleculeReference) {
  switch (m.shape) {
    case "Trigonal bipyramidal": return "90° & 120°";
    case "Seesaw": return "<90° & <120°";
    case "T-shaped": case "Square pyramidal": return "<90°";
    default: return `${m.angleValue}°`;
  }
}

const superscriptDigits: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
const titleCase = (text: string) => text.replace(/(^|[\s-])([a-z])/g, (_, gap: string, letter: string) => gap + letter.toUpperCase());
// Shape names that start with a letter label ("T-shaped") keep it capitalized mid-sentence.
const sentenceShape = (shape: string) => (/^[A-Z]-/.test(shape) ? shape : shape.toLowerCase());

// Search results show the plain formula people type ("PF5", "SO4 2-", not "PF₅") so the query
// terms match, and a description short enough (≤ 160 characters) that the reason to click is not truncated.
export function moleculeSearchCopy(m: MoleculeReference) {
  const [, magnitude = "", sign = ""] = m.formula.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/) ?? [];
  const ascii = m.asciiFormula.replace(/[+-]$/, "");
  const charge = `${magnitude.replace(/./g, (d) => superscriptDigits[d])}${sign === "⁻" ? "-" : sign === "⁺" ? "+" : ""}`;
  // Single charges read like "NO3-"; larger ones get a space so the digit is not read as a subscript ("SO4 2-").
  const formula = magnitude ? `${ascii} ${charge}` : `${ascii}${charge}`;
  const angle = angleShort(m);
  const plural = angle.includes("&") ? "s" : "";
  const base = `${formula} Molecular Geometry: ${titleCase(m.shape)}`;
  const withAngle = `${base}, ${angle} Bond Angle${plural}`;
  const core = withAngle.length <= 56 ? withAngle : `${base}, ${angle}`;
  const title = core.length <= 60 ? `${core} (3D)` : core;
  const geometry = m.shape === m.electronGeometry
    ? `${sentenceShape(m.shape)} molecular and electron geometry`
    : `${sentenceShape(m.shape)} molecular geometry, ${m.electronGeometry.toLowerCase()} electron geometry`;
  const polarity = m.polarity === "Ion" ? "polyatomic ion" : m.polarity.toLowerCase();
  const facts = `${formula} (${m.name.toLowerCase()}): ${geometry}, ${angle} bond angle${plural}${m.hybridization ? `, ${m.hybridization}` : ""}, ${polarity}.`;
  const description = [`${facts} See why in a free 3D model you can rotate.`, `${facts} Rotate the free 3D model.`, facts].find((text) => text.length <= 160)!;
  return { title, description };
}

export function moleculeCopy(m: MoleculeReference) {
  const label = `${m.name} (${m.formula})`;
  const geometry = m.shape === m.electronGeometry
    ? `${m.shape.toLowerCase()} molecular geometry and electron geometry`
    : `${m.shape.toLowerCase()} molecular geometry and a ${m.electronGeometry.toLowerCase()} electron geometry`;
  const lead = `${label} has a ${geometry}, with a bond angle of ${m.bondAngle.startsWith("≈") ? `about ${m.angleValue}°` : m.bondAngle[0].toLowerCase() + m.bondAngle.slice(1)}. Its central ${m.center} atom has ${pairs(m.bondingPairs, "bonding domain")} and ${pairs(m.lonePairs, "lone pair")}, so its VSEPR notation is ${m.axe}.`;
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
    ...(bondLengths[m.formula] ? [{ q: `What is the bond length in ${m.formula}?`, a: `The ${m.center}–${m.outer} bond length in ${m.formula} is about ${bondLengthText(m.formula)!.replace(" · ", " and ")} (1 pm = 10⁻¹² m).${bondLengths[m.formula].pm === undefined ? ` The ${m.shape.toLowerCase()} shape has two kinds of positions, so the axial and equatorial bonds differ in length.` : ""}` }] : []),
    { q: `What is the electron geometry of ${m.formula}?`, a: `${m.formula} has ${pairs(m.domains, "electron domain")} around the central ${m.center} atom, so its electron geometry is ${m.electronGeometry.toLowerCase()}.${m.lonePairs ? ` The molecular shape differs (${m.shape.toLowerCase()}) because lone pairs are not counted as part of the shape.` : " With no lone pairs, the molecular shape is the same."}` },
    ...(m.hybridization ? [{ q: `What is the hybridization of ${m.formula}?`, a: `In the hybridization model, the central ${m.center} atom in ${m.formula} is ${m.hybridization} hybridized because it has ${pairs(m.domains, "electron domain")}.${m.domains > 4 ? " Many chemists now describe expanded-octet bonding without d-orbital hybridization, but sp³d/sp³d² remains the label used in most school courses." : ""}` }] : []),
    { q: `Is ${m.formula} polar or nonpolar?`, a: polarity },
  ];
  return { label, lead, why, polarity, faq };
}
