// Original explanatory diagrams. Their values are repeated in the surrounding
// article text so that the scientific information is accessible without images.
export const articleFigures = {
  "moon-phase-geometry": {
    title: "Same half lit, different view from Earth",
    file: "moon-phase-geometry",
    alt: "Five Moon positions with sunlight from the left: at 0° new moon 0% lit, 45° waxing crescent about 15%, 90° first quarter 50%, 135° waxing gibbous about 85%, and 180° full moon 100%.",
    caption: "Lit fraction = (1 − cos θ) ÷ 2 in a simple coplanar model; the view shown is from the Northern Hemisphere. Sizes and distances are not to scale.",
  },
  "carbon-stock-flow": {
    title: "CO₂ is a stock; emissions are a flow",
    file: "carbon-stock-flow",
    alt: "Two bathtub diagrams. Left: 38 GtCO₂ per year flows in while land removes 9 and ocean 10, so the net +19 raises the atmospheric level. Right: 19 in and 19 out keeps the level steady at the start.",
    caption: "Illustrative values from the Carbon Cycle Simulator's starting settings. Real sinks change over time; this is a teaching model, not a projection.",
  },
  "force-comparison": {
    title: "Same net force, different mass",
    file: "same-net-force-different-mass",
    alt: "Two carts receive 20 N net force. The 10 kg cart accelerates at 2 m/s²; the 20 kg cart accelerates at 1 m/s².",
    caption: "At fixed net force, doubling mass halves acceleration. These are illustrative model calculations; arrow lengths represent equal net forces.",
  },
  "gas-comparison": {
    title: "Halve the volume, double the pressure",
    file: "ideal-gas-volume-pressure-comparison",
    alt: "At 1 mol and 300 K, ideal gas pressure is about 124.7 kPa at 20 L and 249.4 kPa at 10 L.",
    caption: "The amount of gas and temperature stay fixed. The chambers are schematic; the pressures are calculated using the ideal-gas model.",
  },
  "motion-representations": {
    title: "One situation, three representations",
    file: "force-equation-velocity-time-graph",
    alt: "A 5 kg cart has 20 N applied force and 5 N resistance, giving 3 m/s² acceleration. Starting from rest, velocity rises from 0 to 6 m/s in 2 seconds.",
    caption: "A force sketch, an equation, and a velocity-time graph describe the same constant-acceleration model. The graph's horizontal axis is time, not position.",
  },
  "notebook-entry": {
    title: "A notebook entry you can reconstruct",
    file: "science-notebook-gas-investigation-example",
    alt: "Example notebook: compare pressure at 20 L and 10 L, hold 1 mol and 300 K fixed, predict double pressure, and record calculated values of 124.7 and 249.4 kPa.",
    caption: "An illustrative notebook entry separates the question, fixed conditions, prediction, and results. These are calculated examples, not a student's collected measurements.",
  },
} as const;

export type ArticleFigureId = keyof typeof articleFigures;
export function getArticleFigure(id: string) {
  if (!Object.hasOwn(articleFigures, id)) return undefined;
  const figure = articleFigures[id as ArticleFigureId];
  return { ...figure, id, src: `/images/articles/figures/${figure.file}.webp`, smallSrc: `/images/articles/figures/${figure.file}-640.webp`, width: 1200, height: 900 };
}
