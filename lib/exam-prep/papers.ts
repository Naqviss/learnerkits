import type { Course } from "./catalog";

export type PaperAction = "mock" | "guide" | "practical";
export type Paper = { n: string; name: string; time: string; marks: string; detail: string; level: string; action: PaperAction; type: "mcq" | "written" | "practical" | "analysis" };
export type PaperSetKey = "cambridge9702" | "aqa8463" | "pearsonIAL";

// Paper names, durations and marks follow each board's published specification.
export const paperCatalog: Record<PaperSetKey, Paper[]> = {
  cambridge9702: [
    { n: "Paper 1", name: "Multiple Choice", time: "1 h 15 min", marks: "40 marks", detail: "40 multiple-choice questions • AS Level content", level: "AS & A Level", action: "mock", type: "mcq" },
    { n: "Paper 2", name: "AS Level Structured Questions", time: "1 h 15 min", marks: "60 marks", detail: "Short and extended structured answers • AS content", level: "AS & A Level", action: "guide", type: "written" },
    { n: "Paper 3", name: "Advanced Practical Skills", time: "2 hours", marks: "40 marks", detail: "Practical work, measurements, graphs and evaluation", level: "AS & A Level", action: "practical", type: "practical" },
    { n: "Paper 4", name: "A Level Structured Questions", time: "2 hours", marks: "100 marks", detail: "A Level content with AS knowledge required", level: "Full A Level", action: "guide", type: "written" },
    { n: "Paper 5", name: "Planning, Analysis and Evaluation", time: "1 h 15 min", marks: "30 marks", detail: "Two compulsory questions testing experimental analysis and planning", level: "Full A Level", action: "practical", type: "analysis" },
  ],
  aqa8463: [
    { n: "Paper 1", name: "Energy, Electricity, Particle Model and Atomic Structure", time: "1 h 45 min", marks: "100 marks", detail: "GCSE Physics 8463 • Foundation and Higher tiers", level: "GCSE", action: "guide", type: "written" },
    { n: "Paper 2", name: "Forces, Waves, Magnetism and Space Physics", time: "1 h 45 min", marks: "100 marks", detail: "GCSE Physics 8463 • Foundation and Higher tiers", level: "GCSE", action: "guide", type: "written" },
  ],
  pearsonIAL: [
    { n: "Unit 1 · WPH11", name: "Mechanics and Materials", time: "See current timetable", marks: "Unit assessment", detail: "International Advanced Subsidiary • Unit 1", level: "IAS & IAL", action: "guide", type: "written" },
    { n: "Unit 2 · WPH12", name: "Waves and Electricity", time: "See current timetable", marks: "Unit assessment", detail: "International Advanced Subsidiary • Unit 2", level: "IAS & IAL", action: "guide", type: "written" },
    { n: "Unit 3 · WPH13", name: "Practical Skills in Physics I", time: "See current timetable", marks: "Unit assessment", detail: "International Advanced Subsidiary • Unit 3", level: "IAS & IAL", action: "practical", type: "practical" },
    { n: "Unit 4 · WPH14", name: "Further Mechanics, Fields and Particles", time: "See current timetable", marks: "Unit assessment", detail: "International A2 • Unit 4", level: "Full IAL", action: "guide", type: "written" },
    { n: "Unit 5 · WPH15", name: "Thermodynamics, Radiation, Oscillations and Cosmology", time: "See current timetable", marks: "Unit assessment", detail: "International A2 • Unit 5", level: "Full IAL", action: "guide", type: "written" },
    { n: "Unit 6 · WPH16", name: "Practical Skills in Physics II", time: "See current timetable", marks: "Unit assessment", detail: "International A2 • Unit 6", level: "Full IAL", action: "practical", type: "practical" },
  ],
};

export const paperSources: Record<PaperSetKey, string> = {
  cambridge9702: "https://www.cambridgeinternational.org/Images/664565-2025-2027-syllabus.pdf",
  aqa8463: "https://www.aqa.org.uk/subjects/physics/gcse/physics-8463/specification/specification-at-a-glance",
  pearsonIAL: "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Physics/2018/Specification%20and%20Sample%20Assessment/9781446957783_IAL_Physics_Iss3.pdf",
};

export function paperSetKey({ board, level, subject }: Course): PaperSetKey | null {
  if (subject !== "physics") return null;
  if (board === "cambridge" && (level === "as" || level === "a")) return "cambridge9702";
  if (board === "aqa" && level === "gcse") return "aqa8463";
  if (board === "pearson" && (level === "ias" || level === "ial")) return "pearsonIAL";
  return null;
}

/** Verified papers for a course, or null when we have not checked that specification. */
export function getPapers(course: Course): { key: PaperSetKey; papers: Paper[]; source: string } | null {
  const key = paperSetKey(course);
  if (!key) return null;
  const all = paperCatalog[key];
  return { key, papers: key === "pearsonIAL" && course.level === "ias" ? all.slice(0, 3) : all, source: paperSources[key] };
}
