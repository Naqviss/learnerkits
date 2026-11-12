// Mock exam practice questions are original and independently written; they are not official
// examination papers and are not endorsed by any exam board.
export type MockQuestion = { id: string; topic: string; subject: "Physics" | "Chemistry"; q: string; options: string[]; answer: number; why: string; lab: string | null };
export type MockExam = { id: string; board: string; level: string; subject: string; code: string; title: string; paper: string; subtitle: string; bank: string; minutes: number; premium: boolean; official: string; year: string; source: string };

type Row = [topic: string, q: string, options: string[], answer: number, why: string, lab: string | null];
const bank = (name: string, subject: MockQuestion["subject"], rows: Row[]): MockQuestion[] =>
  rows.map(([topic, q, options, answer, why, lab], index) => ({ id: `${name}-${index + 1}`, topic, subject, q, options, answer, why, lab }));

// Simulation slugs (lib/subjects/catalog.ts).
const projectile = "projectile-lab", force = "newtons-laws-force-lab", friction = "inclined-plane-friction", momentum = "momentum-collision", circuit = "circuit-builder", waves = "wave-interference", energy = "energy-track-challenge", gas = "gas-law-lab", states = "states-of-matter-3d", ph = "acid-base-ph", titration = "titration-simulator", molecule = "molecule-builder-3d";

export const mockBanks: Record<string, MockQuestion[]> = {
  physicsA: bank("physicsA", "Physics", [
    ["Kinematics", "A student walks 3 m east and then 4 m north. What is the magnitude of the displacement?", ["1 m", "5 m", "7 m", "12 m"], 1, "The displacement is the straight-line vector from start to finish. Using Pythagoras: √(3² + 4²) = 5 m.", projectile],
    ["Kinematics", "A car starts from rest and accelerates uniformly at 4.0 m/s² for 3.0 s. What is its final speed?", ["0.75 m/s", "7.0 m/s", "12 m/s", "36 m/s"], 2, "Use v = u + at. With u = 0, a = 4.0 m/s² and t = 3.0 s, v = 12 m/s.", projectile],
    ["Dynamics", "A 2.0 kg trolley experiences a resultant force of 10 N. What is its acceleration?", ["0.20 m/s²", "5.0 m/s²", "12 m/s²", "20 m/s²"], 1, "Newton’s second law: F = ma. Rearrange to a = F/m = 10/2 = 5.0 m/s².", force],
    ["Dynamics", "Which statement describes an object moving at constant velocity in a straight line?", ["The resultant force is zero", "Its acceleration is increasing", "A forward force must be bigger than friction", "Its momentum must be zero"], 0, "Constant velocity means zero acceleration. Therefore the resultant force is zero even if individual forces are present.", force],
    ["Momentum", "A 0.50 kg ball moves at 8.0 m/s. What is the magnitude of its momentum?", ["0.0625 kg m/s", "4.0 kg m/s", "8.5 kg m/s", "16 kg m/s"], 1, "Momentum p = mv = 0.50 × 8.0 = 4.0 kg m/s.", momentum],
    ["Work, energy and power", "A constant force of 12 N moves an object 3.0 m in the direction of the force. How much work is done?", ["4.0 J", "9.0 J", "15 J", "36 J"], 3, "Work done W = Fs for a force parallel to the displacement: 12 × 3.0 = 36 J.", energy],
    ["Waves", "A wave has frequency 25 Hz and wavelength 0.40 m. What is its speed?", ["0.016 m/s", "6.25 m/s", "10 m/s", "62.5 m/s"], 2, "Wave speed v = fλ = 25 × 0.40 = 10 m/s.", waves],
    ["D.C. circuits", "Two resistors, 2.0 Ω and 4.0 Ω, are connected in series. What is their combined resistance?", ["1.3 Ω", "2.0 Ω", "4.0 Ω", "6.0 Ω"], 3, "For resistors in series, R(total) = R1 + R2 = 2.0 + 4.0 = 6.0 Ω.", circuit],
    ["Electricity", "A current of 3.0 A flows for 4.0 s. What charge passes a point in the circuit?", ["0.75 C", "7.0 C", "12 C", "24 C"], 2, "Charge Q = It = 3.0 × 4.0 = 12 C.", circuit],
    ["Physical quantities and units", "Which of the following is an SI base quantity?", ["Force", "Energy", "Electric current", "Speed"], 2, "Electric current is an SI base quantity measured in amperes. Force, energy and speed are derived quantities.", null],
  ]),
  physicsB: bank("physicsB", "Physics", [
    ["Kinematics", "An object begins from rest and accelerates at 2.0 m/s² over 9.0 m. What speed does it reach?", ["3.0 m/s", "4.5 m/s", "6.0 m/s", "18 m/s"], 2, "Use v² = u² + 2as = 0 + 2 × 2.0 × 9.0 = 36, so v = 6.0 m/s.", projectile],
    ["Forces, density and pressure", "Two perpendicular forces act on a particle: 6 N east and 8 N north. What is the magnitude of the resultant?", ["2 N", "7 N", "10 N", "14 N"], 2, "For perpendicular forces, use Pythagoras: √(6²+8²) = 10 N.", force],
    ["Momentum", "A 2.0 kg cart moving at 3.0 m/s hits a stationary 1.0 kg cart. The carts stick together. Find their common speed.", ["1.0 m/s", "2.0 m/s", "3.0 m/s", "6.0 m/s"], 1, "Conserve momentum: (2 × 3 + 1 × 0) = (2 + 1)v, giving v = 2.0 m/s.", momentum],
    ["Work, energy and power", "A motor transfers 150 J of energy in 5.0 seconds. What is its average power?", ["0.033 W", "30 W", "145 W", "750 W"], 1, "Power = energy transferred / time = 150 / 5.0 = 30 W.", energy],
    ["Forces, density and pressure", "A force of 200 N acts normally on an area of 0.50 m². What pressure is produced?", ["100 Pa", "200 Pa", "400 Pa", "800 Pa"], 2, "Pressure = normal force / area = 200 / 0.50 = 400 Pa.", friction],
    ["Deformation of solids", "A spring obeys Hooke’s law with stiffness 150 N/m. What force stretches it by 0.020 m?", ["0.003 N", "3.0 N", "7.5 N", "7500 N"], 1, "Hooke’s law F = kx = 150 × 0.020 = 3.0 N.", null],
    ["Waves", "A wave travels at 300 m/s and has frequency 50 Hz. What is its wavelength?", ["0.17 m", "6.0 m", "250 m", "15 000 m"], 1, "Use λ = v/f = 300/50 = 6.0 m.", waves],
    ["D.C. circuits", "A current of 2.0 A flows through a 4.0 Ω resistor. What is its electrical power dissipation?", ["2.0 W", "8.0 W", "16 W", "32 W"], 2, "Use P = I²R = 2.0² × 4.0 = 16 W.", circuit],
    ["Electricity", "A potential difference of 9.0 V transfers 45 J to charges. How much charge passes?", ["0.20 C", "5.0 C", "36 C", "405 C"], 1, "Potential difference V = W/Q, so Q = W/V = 45/9.0 = 5.0 C.", circuit],
    ["Forces, density and pressure", "An object of mass 0.80 kg occupies a volume of 0.0010 m³. What is its density?", ["0.0008 kg/m³", "0.80 kg/m³", "80 kg/m³", "800 kg/m³"], 3, "Density = mass / volume = 0.80 / 0.0010 = 800 kg/m³.", null],
  ]),
  chemistryA: bank("chemistryA", "Chemistry", [
    ["States of matter", "Which statement best describes particles in a gas?", ["They vibrate about fixed points", "They are far apart and move randomly", "They are arranged in a rigid lattice", "They cannot be compressed"], 1, "Gas particles are widely separated and move freely in random directions. Gases can be compressed.", states],
    ["Atoms, elements and compounds", "What does the atomic number tell you about an atom?", ["Number of neutrons", "Total number of nucleons", "Number of protons", "Number of electron shells"], 2, "The atomic number is the number of protons in the nucleus; this determines the element.", molecule],
    ["Atoms, elements and compounds", "An atom contains 6 protons and 6 neutrons. What is its mass number?", ["0", "6", "12", "36"], 2, "Mass number = protons + neutrons = 6 + 6 = 12.", molecule],
    ["Atoms, elements and compounds", "Which type of bonding forms when sodium transfers an electron to chlorine?", ["Metallic", "Ionic", "Covalent", "Hydrogen bonding"], 1, "Electron transfer creates Na⁺ and Cl⁻ ions. Their electrostatic attraction is ionic bonding.", molecule],
    ["The Periodic Table", "Which group contains lithium and sodium?", ["Group I", "Group VII", "Group VIII", "Transition metals"], 0, "Lithium and sodium are Group I (alkali) metals and have one electron in their outer shell.", null],
    ["Stoichiometry", "Using C = 12 and O = 16, what is the relative molecular mass of CO₂?", ["16", "28", "32", "44"], 3, "CO₂ contains one carbon atom and two oxygen atoms: 12 + 2(16) = 44.", titration],
    ["Stoichiometry", "What is the mass of 2.0 mol of CO₂? (Mᵣ = 44)", ["22 g", "44 g", "88 g", "176 g"], 2, "Mass = amount × molar mass = 2.0 × 44 = 88 g.", titration],
    ["Acids, bases and salts", "An aqueous solution has pH 3. Which description is correct?", ["Acidic", "Neutral", "Alkaline", "Cannot be determined"], 0, "Solutions with pH below 7 are acidic; pH 7 is neutral under typical aqueous conditions.", ph],
    ["Experimental techniques and analysis", "Why does a dye usually diffuse faster through hot water than through cold water?", ["Particles become larger", "Particles have more kinetic energy", "The water stops moving", "The density of dye must double"], 1, "Higher temperature means faster random particle motion, so diffusion generally happens more quickly.", states],
    ["Chemical reactions", "In the reaction magnesium + oxygen → magnesium oxide, which substance is a reactant?", ["Magnesium oxide", "Neither substance", "Magnesium", "Both magnesium oxide and oxygen"], 2, "Reactants are written to the left of the reaction arrow. Magnesium and oxygen are reactants.", null],
  ]),
  chemistryB: bank("chemistryB", "Chemistry", [
    ["Atoms, elements and compounds", "Atoms of the same element may be different isotopes. What differs between them?", ["Number of protons", "Number of neutrons", "Atomic number", "Chemical symbol"], 1, "Isotopes have the same proton number but different neutron numbers.", molecule],
    ["Metals", "Why do metals conduct electricity when solid?", ["Their protons can move freely", "They contain mobile delocalised electrons", "Their atoms are uncharged", "They have no electron shells"], 1, "Delocalised electrons move through a metal lattice and carry electric charge.", null],
    ["Stoichiometry", "For 2H₂ + O₂ → 2H₂O, 4.0 mol H₂ reacts completely with 2.0 mol O₂. How many moles of water form?", ["1.0 mol", "2.0 mol", "4.0 mol", "8.0 mol"], 2, "The equation has a 2:2 ratio of H₂ to H₂O. 4.0 mol H₂ therefore forms 4.0 mol H₂O.", titration],
    ["Stoichiometry", "A compound contains carbon, hydrogen and oxygen in the mole ratio 1:2:1. What is its empirical formula?", ["CHO", "CH₂O", "C₂H₂O", "CH₄O"], 1, "The simplest whole-number ratio C:H:O = 1:2:1 gives CH₂O.", titration],
    ["Stoichiometry", "At room temperature and pressure, one mole of gas occupies approximately 24 dm³. What volume does 0.50 mol occupy?", ["6.0 dm³", "12 dm³", "24 dm³", "48 dm³"], 1, "Volume = moles × 24 dm³/mol = 0.50 × 24 = 12 dm³.", gas],
    ["Acids, bases and salts", "What products are normally formed when an acid reacts with an alkali?", ["Salt and hydrogen", "Salt and water", "Oxygen and water", "Carbon dioxide only"], 1, "Neutralisation between an acid and an alkali produces a salt and water.", ph],
    ["Electrochemistry", "Which definition of oxidation is correct?", ["Gain of electrons", "Loss of electrons", "Loss of oxygen", "Gain of hydrogen"], 1, "In electron-transfer terms oxidation is loss of electrons; reduction is gain of electrons.", null],
    ["The Periodic Table", "How does the reactivity of Group VII halogens generally change down the group?", ["It increases", "It decreases", "It remains identical", "It depends only on mass number"], 1, "Down Group VII, the outer shell is farther from the nucleus and incoming electrons are attracted less strongly.", null],
    ["Chemical reactions", "How does a catalyst increase the rate of a chemical reaction?", ["Raises activation energy", "Lowers activation energy", "Makes the reaction release more energy", "Gets used up in every reaction"], 1, "A catalyst provides an alternative reaction pathway with a lower activation energy and is not used up overall.", null],
    ["Atoms, elements and compounds", "Which formula represents a compound made of one magnesium ion Mg²⁺ and chloride ions Cl⁻?", ["MgCl", "MgCl₂", "Mg₂Cl", "Mg₂Cl₂"], 1, "Charge neutrality requires two Cl⁻ ions for every Mg²⁺ ion, giving MgCl₂.", molecule],
  ]),
};

const cambridge9702 = "https://www.cambridgeinternational.org/Images/664565-2025-2027-syllabus.pdf";
const cambridge0620 = "https://www.cambridgeinternational.org/Images/697205-2026-2028-syllabus.pdf";

export const mockExams: MockExam[] = [
  { id: "9702free", board: "cambridge", level: "as", subject: "physics", code: "9702", title: "AS Level Physics", paper: "Paper 1 · Multiple Choice", subtitle: "Forces, motion, waves, electricity and more", bank: "physicsA", minutes: 12, premium: false, official: "40 questions · 75 minutes", year: "2025–2027", source: cambridge9702 },
  { id: "9702premium", board: "cambridge", level: "as", subject: "physics", code: "9702", title: "AS Level Physics", paper: "Paper 1 · Applied Practice Set", subtitle: "Extra calculations and deeper explanations", bank: "physicsB", minutes: 12, premium: true, official: "40 questions · 75 minutes", year: "2025–2027", source: cambridge9702 },
  { id: "0620free", board: "cambridge", level: "igcse", subject: "chemistry", code: "0620", title: "IGCSE Chemistry", paper: "Paper 2 · Extended MCQ", subtitle: "Atoms, bonding, moles, acids and particles", bank: "chemistryA", minutes: 10, premium: false, official: "40 questions · 45 minutes", year: "2026–2028", source: cambridge0620 },
  { id: "0620premium", board: "cambridge", level: "igcse", subject: "chemistry", code: "0620", title: "IGCSE Chemistry", paper: "Paper 2 · Advanced Practice Set", subtitle: "Stoichiometry, electrochemistry and reasoning", bank: "chemistryB", minutes: 10, premium: true, official: "40 questions · 45 minutes", year: "2026–2028", source: cambridge0620 },
];

export const getMockExam = (id: string) => mockExams.find((exam) => exam.id === id);

/** Sitemap paths (no locale prefix). Premium sets are soft-locked, so only the hub and free sets are listed. */
export const mockExamIndexablePaths: string[] = ["/mock-exams", ...mockExams.filter((exam) => !exam.premium).map((exam) => `/mock-exams/${exam.id}`)];
