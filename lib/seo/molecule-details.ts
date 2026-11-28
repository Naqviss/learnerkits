import { bondLengthText, bondLengths } from "@/lib/simulations/chemistry/bondLengths";
import { moleculeAbout } from "./molecule-about";
import { getMoleculeReference, lewisSteps, moleculeCopy } from "./molecules";

// Everything the molecule dialog on the VSEPR chart page (/en/molecules) shows beyond the table row.
// The chart page loads this module only when a visitor opens a molecule, so the 118 detail panels
// are not part of the page's HTML (they replaced 118 separate, template-built molecule pages).

export type MoleculeDetails = {
  lead: string;
  why: string;
  polarity: string;
  lewis?: { steps: string[]; resonance?: string };
  about?: { text: string; source: string; state: string };
  bondLength?: { text: string; source: string };
};

export function moleculeDetails(slug: string): MoleculeDetails | undefined {
  const molecule = getMoleculeReference(slug);
  if (!molecule) return undefined;
  const copy = moleculeCopy(molecule);
  const about = moleculeAbout[molecule.formula];
  const state = about && (about.stateNote ? `${molecule.formula} is ${about.stateNote}.` : about.state === "unstable" ? `${molecule.formula} is not stable at room temperature.` : about.state === "ion" ? `${molecule.formula} is a polyatomic ion, found in salts and solutions.` : `${molecule.formula} is a ${about.state} at room temperature.`);
  const lewis = lewisSteps(molecule);
  const length = bondLengthText(molecule.formula);
  return {
    lead: copy.lead,
    why: copy.why,
    polarity: copy.polarity,
    ...(lewis ? { lewis: { steps: lewis.steps, ...(lewis.resonance ? { resonance: lewis.resonance } : {}) } } : {}),
    ...(about ? { about: { text: about.about, source: about.source, state: state ?? "" } } : {}),
    ...(length ? { bondLength: { text: length, source: bondLengths[molecule.formula].source } } : {}),
  };
}
