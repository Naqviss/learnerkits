// Exam Prep data. Syllabus names and codes come from published curricula; topic-to-lab matches are
// LearnerKits editorial choices. Mappings where isVerified() is false are illustrative and stay noindex.

export type LabKind = "force" | "projectile" | "circuit" | "waves" | "gas" | "general";
export type Lab = { name: string; slug: string; kind: LabKind };

/** Every slug must exist in lib/subjects/catalog.ts (asserted in tests/exam-prep.test.ts). */
export const labs = {
  projectile: { name: "Projectile Lab", slug: "projectile-lab", kind: "projectile" },
  force: { name: "Newton's Laws Force Lab", slug: "newtons-laws-force-lab", kind: "force" },
  friction: { name: "Inclined Plane & Friction Simulator", slug: "inclined-plane-friction", kind: "force" },
  momentum: { name: "Momentum Collision Simulator", slug: "momentum-collision", kind: "force" },
  circuit: { name: "Circuit Builder", slug: "circuit-builder", kind: "circuit" },
  waves: { name: "Wave Interference Lab", slug: "wave-interference", kind: "waves" },
  pendulum: { name: "Pendulum Physics Lab", slug: "pendulum-physics", kind: "waves" },
  energy: { name: "Energy Track Challenge", slug: "energy-track-challenge", kind: "force" },
  gas: { name: "Gas Law Lab", slug: "gas-law-lab", kind: "gas" },
  states: { name: "States of Matter 3D Lab", slug: "states-of-matter-3d", kind: "gas" },
  ph: { name: "Acid–Base & pH Simulator", slug: "acid-base-ph", kind: "gas" },
  titration: { name: "Titration Simulator", slug: "titration-simulator", kind: "gas" },
  molecule: { name: "Molecule Builder 3D", slug: "molecule-builder-3d", kind: "general" },
  kepler: { name: "Kepler's Laws Orbit Simulator", slug: "keplers-laws-orbit", kind: "general" },
} as const satisfies Record<string, Lab>;
export type LabId = keyof typeof labs;

export type LessonContent = { brief: string; formula: string; example: string; question: string; options: string[]; answer: number; hint: string; why: string };

export const lessonContent = {
  quantities: { brief: "Every physical measurement has a number and a unit. SI units make it possible to compare results and verify equations.", formula: "speed = distance ÷ time", example: "A distance of 500 cm is 5 m because 100 cm = 1 m.", question: "How many metres are in 250 cm?", options: ["0.25 m", "2.5 m", "25 m", "250 m"], answer: 1, hint: "Divide the number of centimetres by 100.", why: "250 ÷ 100 = 2.5 m." },
  kinematics: { brief: "Kinematics describes how position, velocity and acceleration change, without needing to explain what caused the motion.", formula: "v = u + at", example: "Starting from rest, an object accelerating at 2 m/s² for 4 s reaches a speed of 8 m/s.", question: "An object starts from rest and accelerates at 3 m/s² for 4 s. What is its final speed?", options: ["0.75 m/s", "7 m/s", "12 m/s", "24 m/s"], answer: 2, hint: "Use final speed = initial speed + acceleration × time.", why: "v = 0 + (3 × 4) = 12 m/s." },
  dynamics: { brief: "The acceleration of an object depends on the resultant force acting on it and its mass. More net force increases acceleration; more mass reduces it.", formula: "F = ma", example: "A 20 N resultant force on a 5 kg cart produces an acceleration of 4 m/s².", question: "A 20 N resultant force acts on a 5 kg object. What is its acceleration?", options: ["2 m/s²", "4 m/s²", "25 m/s²", "100 m/s²"], answer: 1, hint: "Rearrange F = ma to a = F ÷ m.", why: "a = 20 ÷ 5 = 4 m/s²." },
  forces: { brief: "Forces change motion or shape. Pressure is the force applied perpendicular to a surface divided by its area.", formula: "pressure = force ÷ area", example: "A 100 N force over 2 m² creates a pressure of 50 Pa.", question: "A force of 100 N acts over an area of 2 m². What is the pressure?", options: ["50 Pa", "100 Pa", "200 Pa", "0.02 Pa"], answer: 0, hint: "Pressure is force divided by area, not multiplied.", why: "p = 100 ÷ 2 = 50 Pa." },
  energy: { brief: "Work is energy transferred when a force acts through a distance. Energy can change form, but the total in an isolated system is conserved.", formula: "work done = force × distance", example: "Pushing with 15 N through 3 m transfers 45 J of energy.", question: "A constant force of 10 N moves an object 3 m along the force direction. How much work is done?", options: ["3 J", "13 J", "30 J", "300 J"], answer: 2, hint: "Multiply force by displacement in the direction of the force.", why: "W = 10 × 3 = 30 J." },
  deformation: { brief: "For many springs within their elastic limit, extension is proportional to the applied force. The spring constant measures stiffness.", formula: "F = kx", example: "A spring with k = 200 N/m stretches 0.05 m under a force of 10 N.", question: "A spring has k = 100 N/m and extends 0.2 m. What force is applied?", options: ["5 N", "20 N", "100 N", "500 N"], answer: 1, hint: "Use F = k × x, with extension measured in metres.", why: "F = 100 × 0.2 = 20 N." },
  waves: { brief: "Waves transfer energy. Wave speed is frequency multiplied by wavelength, while amplitude and frequency describe different wave properties.", formula: "v = fλ", example: "A 5 Hz wave with a wavelength of 2 m travels at 10 m/s.", question: "A wave has a frequency of 5 Hz and wavelength 2 m. What is its speed?", options: ["2.5 m/s", "7 m/s", "10 m/s", "25 m/s"], answer: 2, hint: "Wave speed = frequency × wavelength.", why: "v = 5 × 2 = 10 m/s." },
  superposition: { brief: "When waves overlap, their displacements add. In-phase waves reinforce each other; waves in opposite phase can cancel.", formula: "resultant displacement = y₁ + y₂", example: "Two in-phase waves each producing 2 cm displacement combine to produce 4 cm.", question: "Two identical waves each have a displacement of +2 cm at the same point. What is the resultant displacement?", options: ["0 cm", "2 cm", "4 cm", "8 cm"], answer: 2, hint: "Add the displacements algebraically.", why: "+2 cm + +2 cm = +4 cm." },
  electricity: { brief: "Current is the rate of charge flow. Potential difference transfers energy per unit charge, and resistance opposes current.", formula: "V = IR", example: "A 12 V supply across a 6 Ω resistor produces a current of 2 A.", question: "A 12 V supply is connected across a 6 Ω resistor. What is the current?", options: ["0.5 A", "2 A", "6 A", "72 A"], answer: 1, hint: "Rearrange Ohm’s law to I = V ÷ R.", why: "I = 12 ÷ 6 = 2 A." },
  circuits: { brief: "In a series circuit, current is the same through each component. In a parallel circuit, branch currents add at junctions.", formula: "I = V ÷ R", example: "Two 3 Ω resistors in series have a combined resistance of 6 Ω.", question: "Two resistors of 3 Ω and 4 Ω are connected in series. What is the total resistance?", options: ["0.75 Ω", "1 Ω", "7 Ω", "12 Ω"], answer: 2, hint: "Series resistances add together.", why: "R = 3 + 4 = 7 Ω." },
  particles: { brief: "Particle physics investigates the fundamental constituents of matter and how they interact. Use particle models to distinguish families and charges.", formula: "charge is conserved in interactions", example: "The proton carries charge +1e; an electron carries charge −1e.", question: "What electric charge does an electron carry?", options: ["+1e", "0", "−1e", "+2e"], answer: 2, hint: "An electron has the opposite charge to a proton.", why: "An electron carries one negative elementary charge (−1e)." },
  gas: { brief: "For a fixed amount of ideal gas, pressure, volume and absolute temperature are related. Use kelvin for temperature calculations.", formula: "PV = nRT", example: "At constant temperature, halving a gas volume doubles its pressure.", question: "At constant temperature, an ideal gas is compressed to half its initial volume. What happens to its pressure?", options: ["Halves", "Doubles", "Stays the same", "Becomes zero"], answer: 1, hint: "At constant temperature, pressure and volume are inversely proportional.", why: "Because PV is constant, halving V doubles P." },
  states: { brief: "Solid, liquid and gas are states of matter. Heating generally increases particle kinetic energy and can lead to phase changes.", formula: "energy transferred = mass × specific latent heat", example: "At normal atmospheric pressure, pure water boils at about 100 °C.", question: "What usually happens to particle motion when a substance is heated within one phase?", options: ["It slows down", "It stops", "Average kinetic energy increases", "Mass disappears"], answer: 2, hint: "Think about temperature and average particle kinetic energy.", why: "As temperature rises within a phase, the average kinetic energy of particles increases." },
  bonding: { brief: "Atoms form bonds by sharing or transferring electrons. Molecular shape depends on bonding pairs and lone pairs around the central atom.", formula: "H₂O = two H atoms + one O atom", example: "A water molecule consists of one oxygen atom bonded to two hydrogen atoms.", question: "How many hydrogen atoms are present in one molecule of H₂O?", options: ["1", "2", "3", "4"], answer: 1, hint: "The small subscript after H tells you how many hydrogen atoms there are.", why: "H₂O has two hydrogen atoms and one oxygen atom." },
  acids: { brief: "Acids increase the hydrogen ion concentration in water. The pH scale is logarithmic, so a change of one pH unit represents a tenfold change in [H⁺].", formula: "pH = −log₁₀[H⁺]", example: "For [H⁺] = 0.001 mol/L, the pH is 3.", question: "What is the pH of a strong acid with [H⁺] = 10⁻³ mol/L?", options: ["1", "3", "7", "11"], answer: 1, hint: "Take the negative base-10 logarithm of 10⁻³.", why: "pH = −log₁₀(10⁻³) = 3." },
  chemical: { brief: "Chemical reactions rearrange atoms while conserving them. Correct equations have the same number of each atom on both sides.", formula: "mass of reactants = mass of products", example: "2H₂ + O₂ → 2H₂O balances hydrogen and oxygen atoms.", question: "Which statement is true for a balanced chemical equation?", options: ["Atoms are destroyed", "Only products contain atoms", "Each element has equal atom counts on both sides", "Mass always doubles"], answer: 2, hint: "Count each type of atom on both sides of the equation.", why: "A balanced equation has the same number of atoms of each element on each side." },
  orbit: { brief: "Orbital motion results from gravity providing centripetal acceleration. For Keplerian orbits around the same star, longer semi-major axes have longer orbital periods.", formula: "T² ∝ a³", example: "For solar orbits measured in years and AU, an orbit with a = 4 AU has T = 8 years.", question: "For a solar orbit with semi-major axis 4 AU, approximately how many years is the orbital period?", options: ["2 years", "4 years", "8 years", "16 years"], answer: 2, hint: "Use T² = a³ for a solar orbit in years and AU.", why: "T² = 4³ = 64, so T = 8 years." },
} as const satisfies Record<string, LessonContent>;
export type ContentId = keyof typeof lessonContent;

export type Topic = { name: string; slug: string; content: ContentId; lab: LabId | null; section: string; /** false = the lab is related but does not cover the whole topic. */ direct: boolean };

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/['’.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const t = (name: string, content: ContentId, lab: LabId | null = null, section = "", direct = true): Topic => ({ name, slug: slugify(name), content, lab, section, direct });

export const syllabi = {
  cambridge_as_physics: [t("Physical quantities and units", "quantities", null, "1"), t("Kinematics", "kinematics", "projectile", "2"), t("Dynamics", "dynamics", "force", "3"), t("Forces, density and pressure", "forces", "friction", "4"), t("Work, energy and power", "energy", "energy", "5"), t("Deformation of solids", "deformation", null, "6"), t("Waves", "waves", "pendulum", "7"), t("Superposition", "superposition", "waves", "8"), t("Electricity", "electricity", "circuit", "9"), t("D.C. circuits", "circuits", "circuit", "10"), t("Particle physics", "particles", null, "11")],
  cambridge_a_physics: [t("Physical quantities and units", "quantities", null, "1"), t("Kinematics", "kinematics", "projectile", "2"), t("Dynamics", "dynamics", "force", "3"), t("Forces, density and pressure", "forces", "friction", "4"), t("Work, energy and power", "energy", "energy", "5"), t("Deformation of solids", "deformation", null, "6"), t("Waves", "waves", "pendulum", "7"), t("Superposition", "superposition", "waves", "8"), t("Electricity", "electricity", "circuit", "9"), t("D.C. circuits", "circuits", "circuit", "10"), t("Particle physics", "particles", null, "11"), t("Motion in a circle", "orbit", "kepler", "12", false), t("Gravitational fields", "orbit", "kepler", "13", false), t("Temperature", "states", "states", "14"), t("Ideal gases", "gas", "gas", "15"), t("Thermodynamics", "gas", "gas", "16", false), t("Oscillations", "waves", "pendulum", "17"), t("Electric fields", "electricity", null, "18"), t("Capacitance", "electricity", "circuit", "19", false), t("Magnetic fields", "electricity", null, "20"), t("Alternating currents", "circuits", "circuit", "21", false), t("Quantum physics", "particles", null, "22"), t("Nuclear physics", "particles", null, "23"), t("Medical physics", "waves", null, "24"), t("Astronomy and cosmology", "orbit", "kepler", "25", false)],
  cambridge_igcse_physics: [t("Motion", "kinematics", "projectile", "1.2"), t("Mass and weight", "dynamics", "force", "1.3"), t("Forces", "forces", "friction", "1.5"), t("Momentum", "dynamics", "momentum", "1.6"), t("Energy, work and power", "energy", "energy", "1.7"), t("Thermal physics", "states", "states", "2"), t("General wave properties", "waves", "waves", "3.1"), t("Light", "waves", null, "3.2"), t("Electric circuits", "circuits", "circuit", "4.3"), t("Electromagnetic effects", "electricity", null, "4.6"), t("Nuclear physics", "particles", null, "5"), t("Space physics", "orbit", "kepler", "6", false)],
  cambridge_igcse_chemistry: [t("States of matter", "states", "states", "1"), t("Atoms, elements and compounds", "bonding", "molecule", "2"), t("Stoichiometry", "chemical", "titration", "3", false), t("Electrochemistry", "electricity", null, "4"), t("Chemical energetics", "energy", null, "5"), t("Chemical reactions", "chemical", null, "6"), t("Acids, bases and salts", "acids", "ph", "7"), t("The Periodic Table", "bonding", "molecule", "8", false), t("Metals", "bonding", null, "9"), t("Chemistry of the environment", "chemical", null, "10"), t("Organic chemistry", "bonding", "molecule", "11", false), t("Experimental techniques and analysis", "acids", "titration", "12", false)],
  cambridge_as_chemistry: [t("Atomic structure", "bonding", "molecule", "1", false), t("Atoms, molecules and stoichiometry", "chemical", "titration", "2", false), t("Chemical bonding", "bonding", "molecule", "3"), t("States of matter", "states", "states", "4"), t("Chemical energetics", "energy", null, "5"), t("Electrochemistry", "electricity", null, "6"), t("Equilibria", "chemical", null, "7"), t("Reaction kinetics", "chemical", null, "8"), t("Organic chemistry foundations", "bonding", "molecule", "9", false), t("Acids and bases", "acids", "ph", "10")],
  aqa_gcse_physics: [t("Energy", "energy", "energy", "4.1"), t("Electricity", "electricity", "circuit", "4.2"), t("Particle model of matter", "states", "states", "4.3"), t("Atomic structure", "particles", null, "4.4"), t("Forces", "dynamics", "force", "4.5"), t("Waves", "waves", "waves", "4.6"), t("Magnetism and electromagnetism", "electricity", null, "4.7"), t("Space physics", "orbit", "kepler", "4.8", false)],
  aqa_alevel_physics: [t("Measurements and their errors", "quantities", null, "3.1"), t("Particles and radiation", "particles", null, "3.2"), t("Waves", "waves", "waves", "3.3"), t("Mechanics and materials", "dynamics", "force", "3.4"), t("Electricity", "circuits", "circuit", "3.5"), t("Further mechanics and thermal physics", "gas", "gas", "3.6"), t("Fields and their consequences", "orbit", "kepler", "3.7", false), t("Nuclear physics", "particles", null, "3.8")],
  pearson_ial_physics: [t("Unit 1: Mechanics and Materials", "dynamics", "force", "WPH11"), t("Unit 2: Waves and Electricity", "waves", "waves", "WPH12"), t("Unit 3: Practical Skills in Physics I", "quantities", "projectile", "WPH13", false), t("Unit 4: Further Mechanics, Fields and Particles", "orbit", "kepler", "WPH14", false), t("Unit 5: Thermodynamics, Radiation, Oscillations and Cosmology", "gas", "gas", "WPH15", false), t("Unit 6: Practical Skills in Physics II", "quantities", null, "WPH16")],
  ib_dp_physics: [t("A. Space, time and motion", "kinematics", "projectile", "Theme A"), t("B. The particulate nature of matter", "states", "states", "Theme B"), t("C. Wave behaviour", "waves", "waves", "Theme C"), t("D. Fields", "orbit", "kepler", "Theme D", false), t("E. Nuclear and quantum physics", "particles", null, "Theme E")],
  sample_physics: [t("Motion and kinematics", "kinematics", "projectile", "Sample"), t("Forces and Newton's laws", "dynamics", "force", "Sample"), t("Energy and work", "energy", "energy", "Sample"), t("Waves and oscillations", "waves", "waves", "Sample"), t("Electric circuits", "circuits", "circuit", "Sample"), t("Gravitation and orbits", "orbit", "kepler", "Sample", false)],
  sample_chemistry: [t("States of matter", "states", "states", "Sample"), t("Atoms and bonding", "bonding", "molecule", "Sample"), t("Gases and gas laws", "gas", "gas", "Sample"), t("Chemical reactions", "chemical", null, "Sample"), t("Acids, bases and pH", "acids", "ph", "Sample"), t("Quantitative chemistry", "acids", "titration", "Sample", false)],
} as const satisfies Record<string, readonly Topic[]>;
export type SyllabusKey = keyof typeof syllabi;

export type Level = { id: string; name: string; detail: string };
export type Board = { id: string; name: string; short: string; sub: string; icon: string; color: string; levels: Level[] };

export const boards: Board[] = [
  { id: "cambridge", name: "Cambridge International", short: "Cambridge", sub: "IGCSE, O Level, AS & A Level", icon: "C", color: "#245bff", levels: [{ id: "igcse", name: "IGCSE", detail: "International General Certificate" }, { id: "olevel", name: "O Level", detail: "Cambridge O Level" }, { id: "as", name: "AS Level", detail: "Advanced Subsidiary" }, { id: "a", name: "A Level", detail: "Advanced Level (AS + A2)" }] },
  { id: "pearson", name: "Pearson Edexcel", short: "Edexcel", sub: "GCSE, International GCSE and IAL", icon: "E", color: "#6f45d8", levels: [{ id: "igcse", name: "International GCSE", detail: "Edexcel International GCSE" }, { id: "gcse", name: "GCSE", detail: "UK General Certificate" }, { id: "ias", name: "International AS", detail: "IAL Units 1–3" }, { id: "ial", name: "International A Level", detail: "IAL Units 1–6" }] },
  { id: "aqa", name: "AQA", short: "AQA", sub: "GCSE, AS & A Level", icon: "A", color: "#d96532", levels: [{ id: "gcse", name: "GCSE", detail: "Grades 9–1" }, { id: "as", name: "AS Level", detail: "Advanced Subsidiary" }, { id: "a", name: "A Level", detail: "Advanced Level" }] },
  { id: "ib", name: "International Baccalaureate", short: "IB", sub: "Diploma Programme SL & HL", icon: "IB", color: "#269353", levels: [{ id: "dp-sl", name: "Diploma · SL", detail: "Standard Level" }, { id: "dp-hl", name: "Diploma · HL", detail: "Higher Level" }] },
  { id: "fbise", name: "FBISE Pakistan", short: "FBISE", sub: "SSC and HSSC · Grades 9–12", icon: "F", color: "#286fc4", levels: [{ id: "ssc1", name: "SSC-I", detail: "Grade 9" }, { id: "ssc2", name: "SSC-II", detail: "Grade 10" }, { id: "hssc1", name: "HSSC-I", detail: "Grade 11" }, { id: "hssc2", name: "HSSC-II", detail: "Grade 12" }] },
];

export type Subject = { id: string; name: string; icon: string; color: string; desc: string; soon?: boolean };
export const subjects: Subject[] = [
  { id: "physics", name: "Physics", icon: "F", color: "#d69e09", desc: "Motion, forces, electricity, energy and waves" },
  { id: "chemistry", name: "Chemistry", icon: "⚗", color: "#8758d5", desc: "Particles, reactions, bonding, pH and gases" },
  { id: "biology", name: "Biology", icon: "◉", color: "#269353", desc: "Cells, ecosystems, genetics and human systems", soon: true },
  { id: "maths", name: "Mathematics", icon: "π", color: "#286fc4", desc: "Algebra, functions, geometry and probability", soon: true },
];
export const liveSubjects = subjects.filter((subject) => !subject.soon);

export const sources: Partial<Record<SyllabusKey, string>> = {
  cambridge_as_physics: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-physics-9702/",
  cambridge_a_physics: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-physics-9702/",
  cambridge_igcse_physics: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-physics-0625/",
  cambridge_igcse_chemistry: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-chemistry-0620/",
  cambridge_as_chemistry: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-chemistry-9701/",
  aqa_gcse_physics: "https://www.aqa.org.uk/subjects/physics/gcse/physics-8463/specification/specification-at-a-glance",
  aqa_alevel_physics: "https://www.aqa.org.uk/subjects/physics",
  pearson_ial_physics: "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/physics-2018.html",
  ib_dp_physics: "https://www.ibo.org/programmes/diploma-programme/curriculum/sciences/physics/",
};

export type Course = { board: string; level: string; subject: string };

export const getBoard = (id: string) => boards.find((board) => board.id === id);
export const getLevel = (boardId: string, levelId: string) => getBoard(boardId)?.levels.find((level) => level.id === levelId);
export const getSubject = (id: string) => subjects.find((subject) => subject.id === id);

export function syllabusKey({ board, level, subject }: Course): SyllabusKey {
  if (board === "cambridge" && subject === "physics") return level === "as" ? "cambridge_as_physics" : level === "a" ? "cambridge_a_physics" : level === "olevel" ? "sample_physics" : "cambridge_igcse_physics";
  if (board === "cambridge" && subject === "chemistry") return level === "as" || level === "a" ? "cambridge_as_chemistry" : level === "olevel" ? "sample_chemistry" : "cambridge_igcse_chemistry";
  if (board === "aqa" && subject === "physics") return level === "gcse" ? "aqa_gcse_physics" : "aqa_alevel_physics";
  if (board === "pearson" && subject === "physics" && (level === "ias" || level === "ial")) return "pearson_ial_physics";
  if (board === "ib" && subject === "physics") return "ib_dp_physics";
  return subject === "chemistry" ? "sample_chemistry" : "sample_physics";
}

export function getSyllabus(course: Course): readonly Topic[] {
  const key = syllabusKey(course);
  // International AS covers IAL Units 1–3 only.
  return key === "pearson_ial_physics" && course.level === "ias" ? syllabi[key].slice(0, 3) : syllabi[key];
}

/** True when topic names follow a published specification we have checked; false = illustrative mapping (noindex). */
export function isVerified(course: Course) {
  const key = syllabusKey(course);
  return !key.startsWith("sample_") && key !== "cambridge_as_chemistry" && !(course.board === "aqa" && course.level === "as");
}

export function subjectCode({ board, level, subject }: Course) {
  if (board === "cambridge") {
    if (subject === "physics") return level === "igcse" ? "0625" : level === "olevel" ? "5054" : "9702";
    if (subject === "chemistry") return level === "igcse" ? "0620" : level === "olevel" ? "5070" : "9701";
  }
  if (board === "aqa") {
    if (subject === "physics") return level === "gcse" ? "8463" : level === "as" ? "7407" : "7408";
    if (subject === "chemistry") return level === "gcse" ? "8462" : level === "as" ? "7404" : "7405";
  }
  if (board === "pearson") {
    if (subject === "physics") return level === "igcse" ? "4PH1" : level === "gcse" ? "1PH0" : "WPH11–WPH16";
    if (subject === "chemistry") return level === "igcse" ? "4CH1" : level === "gcse" ? "1CH0" : "WCH11–WCH16";
  }
  return "";
}

/** Two sample lessons per syllabus are free; the rest are part of Premium. */
export function isFreeTopic(course: Course, topic: Topic, index: number) {
  if (course.subject === "physics" && course.board === "cambridge" && (course.level === "as" || course.level === "a")) return topic.name === "Kinematics" || topic.name === "Dynamics";
  return index < 2;
}

/** Every board × level × live-subject combination that has pages. */
export const courses: Course[] = boards.flatMap((board) => board.levels.flatMap((level) => liveSubjects.map((subject) => ({ board: board.id, level: level.id, subject: subject.id }))));

export function isCourse(course: Course) {
  return courses.some((item) => item.board === course.board && item.level === course.level && item.subject === course.subject);
}

export const coursePath = (course: Course) => `/exam-prep/${course.board}/${course.level}/${course.subject}`;
export const topicPath = (course: Course, topic: Topic) => `${coursePath(course)}/${topic.slug}`;

/** "Cambridge AS Level Physics 9702" */
export function courseTitle(course: Course) {
  const board = getBoard(course.board), level = getLevel(course.board, course.level), subject = getSubject(course.subject), code = subjectCode(course);
  return `${board?.short ?? ""} ${level?.name.replace(" · ", " ") ?? ""} ${subject?.name ?? ""}${code ? ` ${code}` : ""}`.trim();
}

/** Level and board hubs are indexable only when they lead to at least one verified syllabus. */
/**
 * Some levels repeat an earlier level's topics word for word (Cambridge A Level includes the AS topics,
 * Pearson IAL includes the IAS units). Returns the earlier course that owns the canonical page, if any.
 */
export function canonicalTopicCourse(course: Course, topic: Topic): Course | null {
  const levels = getBoard(course.board)?.levels ?? [];
  for (const level of levels.slice(0, levels.findIndex((entry) => entry.id === course.level))) {
    const earlier = { ...course, level: level.id };
    if (isVerified(earlier) && getSyllabus(earlier).some((entry) => entry.slug === topic.slug && entry.content === topic.content && entry.name === topic.name)) return earlier;
  }
  return null;
}

export const isLevelIndexable = (board: string, level: string) => liveSubjects.some((subject) => isVerified({ board, level, subject: subject.id }));
export const isBoardIndexable = (board: string) => Boolean(getBoard(board)?.levels.some((level) => isLevelIndexable(board, level.id)));
