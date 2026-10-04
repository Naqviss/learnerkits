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
  // Titles promise what the page adds (Lewis steps, 3D model) instead of stating the shape: the SERP
  // answer alone was satisfying "x molecular geometry" searches without a click.
  const extra = lewisSteps(m) ? "Lewis Structure" : "Shape";
  const title = [
    `${formula} Molecular Geometry, ${extra} & Bond Angle${plural} (3D)`,
    `${formula} Molecular Geometry, ${extra} & Bond Angle${plural}`,
    `${formula} Molecular Geometry & ${extra} (3D Model)`,
  ].find((text) => text.length <= 60) ?? `${formula} Molecular Geometry & ${extra}`;
  const checks = m.polarity === "Ion" ? "electron geometry, bond angles and hybridization" : "electron geometry, bond angles, hybridization and polarity";
  const lewis = lewisSteps(m) ? ", draw its Lewis structure step by step," : "";
  const description = [
    `Why is ${formula} ${m.shape.toLowerCase()}? Rotate a free 3D model of ${m.name.toLowerCase()}${lewis} and check its ${checks}.`,
    `Why is ${formula} ${m.shape.toLowerCase()}? Rotate a free 3D model${lewis} and check its ${checks}.`,
    `Why is ${formula} ${m.shape.toLowerCase()}? Rotate a free 3D model and check its ${checks}.`,
  ].find((text) => text.length <= 160)!;
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
    ...(lewisSteps(m) ? [{ q: `How many valence electrons does ${m.formula} have?`, a: `${m.formula} has ${lewisSteps(m)!.total} valence electrons: ${lewisSteps(m)!.steps[0].replace(/^Count the valence electrons\. /, "").replace(/ That gives .*$/, "")} In the Lewis structure they form ${pairs(m.bondingPairs, "bond")} to ${m.center} and leave ${pairs(m.lonePairs, "lone pair")} on the central atom.` }] : []),
    { q: `What is the electron geometry of ${m.formula}?`, a: `${m.formula} has ${pairs(m.domains, "electron domain")} around the central ${m.center} atom, so its electron geometry is ${m.electronGeometry.toLowerCase()}.${m.lonePairs ? ` The molecular shape differs (${m.shape.toLowerCase()}) because lone pairs are not counted as part of the shape.` : " With no lone pairs, the molecular shape is the same."}` },
    ...(m.hybridization ? [{ q: `What is the hybridization of ${m.formula}?`, a: `In the hybridization model, the central ${m.center} atom in ${m.formula} is ${m.hybridization} hybridized because it has ${pairs(m.domains, "electron domain")}.${m.domains > 4 ? " Many chemists now describe expanded-octet bonding without d-orbital hybridization, but sp³d/sp³d² remains the label used in most school courses." : ""}` }] : []),
    { q: `Is ${m.formula} polar or nonpolar?`, a: polarity },
  ];
  return { label, lead, why, polarity, faq };
}

// Valence electrons for main-group central/outer atoms. Transition-metal and actinide centers are
// left out: a simple octet count does not describe their bonding.
const valenceElectrons: Record<string, number> = {
  H: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, Mg: 2, Al: 3, Si: 4, P: 5, S: 6, Cl: 7, Zn: 2, Ga: 3, Ge: 4, As: 5,
  Se: 6, Br: 7, Cd: 2, Sn: 4, Sb: 5, Te: 6, I: 7, Xe: 8, Hg: 2, Pb: 4,
};
const groupOf: Record<string, number> = {
  H: 1, Be: 2, Mg: 2, Zn: 12, Cd: 12, Hg: 12, B: 13, Al: 13, Ga: 13, C: 14, Si: 14, Ge: 14, Sn: 14, Pb: 14,
  N: 15, P: 15, As: 15, Sb: 15, O: 16, S: 16, Se: 16, Te: 16, F: 17, Cl: 17, Br: 17, I: 17, Xe: 18,
};
const superDigits = "⁰¹²³⁴⁵⁶⁷⁸⁹";
function chargeOf(formula: string) {
  const match = formula.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/);
  if (!match) return 0;
  const size = match[1] ? Number([...match[1]].map((d) => superDigits.indexOf(d)).join("")) : 1;
  return match[2] === "⁻" ? -size : size;
}
const electrons = (n: number) => `${n} electron${n === 1 ? "" : "s"}`;

// Step-by-step valence-electron bookkeeping that reproduces the lone pairs used by the model.
// Returns undefined when the simple count does not match (so the page never shows wrong arithmetic).
export function lewisSteps(m: MoleculeReference) {
  const center = valenceElectrons[m.center], outer = valenceElectrons[m.outer];
  if (center === undefined || outer === undefined) return undefined;
  const order = molecules[m.index].order, charge = chargeOf(m.formula);
  const total = center + m.bondingPairs * outer - charge;
  const bondElectrons = 2 * m.bondingPairs * order;
  const outerLone = m.outer === "H" ? 0 : 8 - 2 * order;
  const remaining = total - bondElectrons - m.bondingPairs * outerLone;
  if (remaining !== 2 * m.lonePairs || outerLone < 0) return undefined;
  const bondWord = order === 2 ? "double bond" : "single bond";
  const around = bondElectrons + 2 * m.lonePairs;
  const steps = [
    `Count the valence electrons. ${m.center} has ${center}, and ${m.bondingPairs === 1 ? "the" : `each of the ${m.bondingPairs}`} ${m.outer} atom${m.bondingPairs === 1 ? " has" : "s has"} ${outer} (${m.bondingPairs * outer} in total).${charge ? ` ${charge < 0 ? `Add ${-charge}` : `Subtract ${charge}`} for the ${Math.abs(charge) > 1 ? Math.abs(charge) : ""}${charge < 0 ? "−" : "+"} charge.` : ""} That gives ${electrons(total)}.`,
    `Put ${m.center} in the center and join each ${m.outer} with a ${bondWord}. ${m.bondingPairs} ${bondWord}${m.bondingPairs === 1 ? "" : "s"} use ${bondElectrons}, leaving ${total - bondElectrons}.`,
    m.outer === "H"
      ? total - bondElectrons ? `Each H is complete with one bond (2 electrons), so the remaining ${electrons(total - bondElectrons)} go to ${m.center}.` : "Each H is complete with one bond (2 electrons), and every electron has now been used."
      : `Complete each ${m.outer} with ${outerLone / 2} lone pair${outerLone === 2 ? "" : "s"} (${outerLone} electrons). That uses ${m.bondingPairs * outerLone}, leaving ${remaining}.`,
    remaining ? `Place the last ${electrons(remaining)} on ${m.center} as ${pairs(m.lonePairs, "lone pair")}.` : `No electrons remain, so ${m.center} has no lone pairs.`,
    `Check: ${m.center} is surrounded by ${around} electrons${around < 8 ? `, fewer than an octet. That is normal for ${m.center}, which has only ${center} valence electrons of its own.` : around > 8 ? `, more than an octet. Atoms from period 3 and below, such as ${m.center}, can hold more than eight.` : ", a full octet."} Its ${pairs(m.domains, "electron domain")} give the ${m.shape.toLowerCase()} shape.`,
  ];
  const resonance = m.outer === "O" && order === 1 && m.bondingPairs > 1
    ? `This single-bond structure keeps the domain count simple. In the real ${m.isIon ? "ion" : "molecule"} the bonds are equivalent and partly double (resonance), which changes bond lengths but not the shape.`
    : undefined;
  return { total, steps, resonance };
}

// Molecules with the same VSEPR class, the same outer atom, and a central atom from the same group,
// ordered down the group, so trends in angle and bond length can be compared.
export function moleculeFamily(m: MoleculeReference) {
  const group = groupOf[m.center];
  if (group === undefined) return [];
  return moleculeReferences
    .filter((other) => other.axe === m.axe && other.shape === m.shape && other.outer === m.outer && groupOf[other.center] === group && chargeOf(other.formula) === chargeOf(m.formula))
    .sort((a, b) => (valenceElectrons[a.center] ?? 0) - (valenceElectrons[b.center] ?? 0) || a.index - b.index);
}

// One common misconception per VSEPR class, explained for that shape.
const classMistakes: Record<string, string> = {
  "AX₂|Linear": "A common mistake is counting a double bond as two electron domains. Each bond counts once, whether it is single, double, or triple, so two bonded atoms and no lone pairs on the center always give a straight line at 180°.",
  "AX₃|Trigonal planar": "A common mistake is assuming every AX₃ molecule is pyramidal. With no lone pair on the central atom, all four atoms lie in one flat plane at 120°. Only a lone pair, as in ammonia, pushes the three bonds down into a pyramid.",
  "AX₂E|Bent": "A common mistake is calling this shape linear because it has only two bonds. The lone pair still takes up one of the three electron domains, so the two bonds are pushed together to a little under 120°.",
  "AX₄|Tetrahedral": "A common mistake is reading the flat Lewis drawing literally and giving 90° angles. In three dimensions the four bonds point to the corners of a tetrahedron, 109.5° apart, which is as far apart as four domains can get.",
  "AX₃E|Trigonal pyramidal": "A common mistake is giving the electron geometry (tetrahedral) as the answer. The lone pair counts toward the electron geometry, but the molecular shape describes only where the atoms are, and those make a pyramid.",
  "AX₂E₂|Bent": "A common mistake is expecting 180° because there are two bonds, or exactly 109.5° because there are four domains. Two lone pairs repel the bonding pairs more strongly and squeeze the angle below the tetrahedral value.",
  "AX₅|Trigonal bipyramidal": "A common mistake is treating all five bonds as identical. Three equatorial bonds lie 120° apart in a plane, while two axial bonds sit at 90° to that plane. The positions differ, and the axial bonds are often slightly longer.",
  "AX₄E|Seesaw": "A common mistake is putting the lone pair in an axial position. A lone pair has more room in an equatorial position, with two neighbors at 90° instead of three, so it goes there and the four atoms form a seesaw.",
  "AX₃E₂|T-shaped": "A common mistake is predicting trigonal planar because there are three bonds. With five domains, the two lone pairs take equatorial positions, leaving three atoms in a T with angles slightly under 90°.",
  "AX₂E₃|Linear": "A common mistake is expecting a bent shape because the center has lone pairs. Three lone pairs spread evenly around the equator balance one another, so the two bonded atoms sit directly opposite each other at 180°.",
  "AX₆|Octahedral": "A common mistake is picturing six bonds as a flat hexagon. The six bonds point along the positive and negative x, y, and z directions, so every neighboring pair of bonds meets at 90°.",
  "AX₅E|Square pyramidal": "A common mistake is calling this shape trigonal bipyramidal because there are five bonds. There are six electron domains, and one is a lone pair, so the atoms form a square base with a single atom at the apex.",
  "AX₄E₂|Square planar": "A common mistake is predicting tetrahedral because there are four bonds. The two lone pairs sit on opposite sides of the central atom, leaving the four bonded atoms in a flat square at 90°.",
};
export const classMistake = (m: MoleculeReference) => classMistakes[`${m.axe}|${m.shape}`];
