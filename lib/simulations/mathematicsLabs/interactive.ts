// Mathematics labs built on components/subjects/mathematics/labs/MathLabShell.tsx instead of the
// slider-only activities in ./model.ts. components/subjects/mathematics/labs/index.ts maps each slug
// to its component (tests/simulations/mathematicsLabs.test.ts keeps the two lists in sync).
export const interactiveMathSlugs = ["systems-of-equations", "exponential-growth", "triangle-angle-sum", "trigonometry-ratios", "fraction-visualizer", "circle-area-pi", "algebra-balance-scale", "mean-median-mode"] as const;
export type InteractiveMathSlug = (typeof interactiveMathSlugs)[number];
