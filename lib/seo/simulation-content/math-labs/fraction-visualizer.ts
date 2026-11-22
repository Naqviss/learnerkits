import type { SimulationContent } from "../types";

export const card = {
  slug: "fraction-visualizer", title: "Equivalent Fractions Visualizer", concepts: "Equivalent fractions · comparing fractions · number line · simplest form",
  difficulty: "Beginner", duration: "6–10 min", kind: "Fraction model", outcome: "Shade fraction bars and circles to discover when two fractions name the same amount and how to compare them.",
  seoTarget: "equivalent fractions visualizer", visualMode: "graph",
} as const;

export const es = { title: "Visualizador de fracciones equivalentes", outcome: "Colorea barras y círculos de fracciones para descubrir cuándo dos fracciones representan la misma cantidad y cómo compararlas.", concepts: "Fracciones equivalentes · comparar fracciones · recta numérica · forma simplificada", kind: "Modelo de fracciones" };

export const description = "Shade fraction bars and circles to see why 1/2 = 3/6. Compare fractions such as 1/2 and 2/5 on a number line and with a common denominator.";

export const content: SimulationContent = {
  question: "What are equivalent fractions and how can you tell if two fractions are equal?",
  answer: "Equivalent fractions name the same amount using different numbers, like 1/2, 2/4 and 3/6. You make one by multiplying the numerator and the denominator by the same whole number. Two fractions are equal when they shade the same part of equal-sized wholes, land on the same point of a number line, or give equal products when you cross-multiply: 2 × 6 = 3 × 4 shows that 2/4 = 3/6.",
  science: [
    "A fraction describes equal pieces of one whole. The denominator says how many equal pieces the whole is cut into, and the numerator says how many of those pieces you have. Doubling both numbers cuts each piece in half and takes twice as many of them, so the total amount stays exactly the same.",
    "Dividing the top and bottom by a common factor works in reverse and gives the simplest form. The fraction 6/8 shares the factor 2, so it simplifies to 3/4, and 3/4 cannot be simplified any further because 3 and 4 share no factor other than 1. Simplest form is the shortest name for an amount, not a different amount.",
    "Comparing fractions is easiest with a common denominator. To compare 3/4 and 2/3, rewrite both in twelfths: 3/4 = 9/12 and 2/3 = 8/12, so 3/4 is larger. Recipes, rulers marked in inches and music time signatures all depend on swapping between equivalent fractions like these.",
  ],
  formula: { expression: "a/b = (a × k)/(b × k), and a/b = c/d exactly when a × d = b × c", meaning: "a and c are numerators, b and d denominators, and k is any whole number other than 0. Multiplying top and bottom by k makes an equivalent fraction." },
  steps: [
    "Start from A = 1/2 and B = 2/3 with Picture set to Bars, and predict which is bigger before reading the Comparison readout.",
    "Use B denominator and B numerator to make 3/6. Watch the green dashed line join both bars to one point on the number line.",
    "Set A to 1/2 and B to 2/5, then explain why Comparison shows A > B although A numerator is the smaller number.",
    "Click parts of a bar to set a numerator directly, and shade every part of the first whole to make a fraction equal to 1.",
    "Switch Picture to Circles and shade past one whole to see an improper fraction such as 5/4, then read A as a decimal.",
  ],
  misconception: { myth: "A bigger denominator always means a bigger fraction.", fact: "A bigger denominator means the whole is cut into more pieces, so each piece is smaller. One fifth is less than one half, which is why 2/5 is smaller than 1/2 even though both of its numbers are bigger." },
  modelNote: "Denominators run from 1 to 12, and each picture shows two wholes, so fractions up to 2 fit. All parts are drawn exactly equal; negative fractions, mixed-number notation and denominators above 12 are not included.",
  faq: [
    { q: "How do you find an equivalent fraction?", a: "Multiply the numerator and denominator by the same whole number, or divide both by a common factor. From 2/3 you can make 4/6, 6/9 and 8/12 by multiplying by 2, 3 and 4. Every one of them marks the same point on the number line." },
    { q: "How do you compare two fractions with different denominators?", a: "Rewrite them with a common denominator, usually the least common multiple of the two denominators, and then compare numerators. For 5/6 and 3/4 the common denominator is 12, giving 10/12 and 9/12, so 5/6 is greater. Cross-multiplying gives the same answer." },
    { q: "What does simplest form mean for a fraction?", a: "A fraction is in simplest form when its numerator and denominator share no common factor other than 1. To simplify, divide both by their greatest common factor. For 12/18 that factor is 6, so the simplest form is 2/3." },
    { q: "What is an improper fraction?", a: "An improper fraction has a numerator equal to or larger than its denominator, so it is worth at least one whole. The fraction 5/4 means five quarters, which is one whole and one more quarter, or 1.25 as a decimal and 1 1/4 as a mixed number." },
  ],
};
