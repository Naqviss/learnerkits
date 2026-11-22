import type { SimulationContent } from "../types";

export const card = {
  slug: "trigonometry-ratios", title: "SOH CAH TOA Trigonometry Explorer", concepts: "Sine · cosine · tangent · opposite · adjacent · hypotenuse",
  difficulty: "Intermediate", duration: "7–12 min", kind: "Geometry lab", outcome: "Resize and reshape a right triangle to discover why sine, cosine and tangent depend only on the angle.",
  seoTarget: "soh cah toa", visualMode: "graph",
} as const;

export const es = { title: "Explorador de trigonometría SOH CAH TOA", outcome: "Cambia el tamaño y la forma de un triángulo rectángulo para descubrir por qué el seno, el coseno y la tangente solo dependen del ángulo.", concepts: "Seno · coseno · tangente · cateto opuesto · cateto adyacente · hipotenusa", kind: "Laboratorio de geometría" };

export const description = "Learn SOH CAH TOA on a right triangle: label the opposite, adjacent and hypotenuse sides, resize it and see sin, cos and tan stay fixed for each angle.";

export const content: SimulationContent = {
  question: "What does SOH CAH TOA mean in trigonometry?",
  answer: "SOH CAH TOA is a memory aid for the three trigonometric ratios of a right triangle. Sine is opposite over hypotenuse, cosine is adjacent over hypotenuse and tangent is opposite over adjacent, where opposite and adjacent are named from the angle θ you are working with. For a 37° angle in a triangle with a hypotenuse of 5, the opposite side is about 3.01, so sin 37° ≈ 0.602.",
  science: [
    "Every right triangle has a hypotenuse, the longest side, across from the right angle. The other two sides change names depending on the acute angle you choose. The opposite side faces the angle and does not touch it, while the adjacent side runs from the angle to the right angle. Standing at the other acute corner swaps the two names.",
    "The ratios work because right triangles with the same acute angle are similar. Doubling the hypotenuse from 5 to 10 doubles the opposite and adjacent sides too, so each ratio keeps its value. That makes sin, cos and tan properties of the angle itself, which is why a calculator can return sin 37° without knowing any side lengths.",
    "Trigonometry turns one measured angle and one measured length into every other length. A surveyor standing 40 m from a tree who measures a 35° angle up to the top finds its height as 40 × tan 35° ≈ 28 m. Ramp designers, navigators and video game engines use the same three ratios every day.",
  ],
  formula: { expression: "sin θ = opp ÷ hyp, cos θ = adj ÷ hyp, tan θ = opp ÷ adj", meaning: "θ is an acute angle of the right triangle, opp the side opposite θ, adj the side next to θ that is not the hypotenuse, and hyp the side across from the right angle." },
  steps: [
    "Keep Angle θ at 37° and move Hypotenuse from 5 to 9. The side lengths grow, but the sin θ, cos θ and tan θ readouts stay at 0.602, 0.799 and 0.754.",
    "Drag the violet top corner along the hypotenuse and compare the triangle with the dashed half-size triangle, which shares the same θ.",
    "Switch θ is at to Top corner. Watch the pink Opposite and blue Adjacent labels trade sides while the amber Hypotenuse stays put.",
    "Move Angle θ until tan θ reads 1.000, then find the angle where sin θ reads 0.500, and check each fraction in the panel below.",
  ],
  misconception: { myth: "The opposite side is always the vertical side of the triangle.", fact: "Opposite means the side across from the angle you are using. From the bottom-left corner it is the vertical side, but from the top corner the horizontal side is opposite instead." },
  modelNote: "The angle moves in whole degrees from 5° to 85° and the hypotenuse from 2 to 10 grid units. The right angle is fixed at the bottom-right corner, and ratios are shown to three decimal places, so values such as sin 30° appear exactly as 0.500.",
  faq: [
    { q: "How do you know which side is opposite and which is adjacent?", a: "First mark the angle θ you are working with. The hypotenuse is always across from the right angle. The opposite side is the one that does not touch θ at all, and the adjacent side is the remaining side that runs from θ to the right angle." },
    { q: "Why are sine and cosine never bigger than 1?", a: "Both divide a leg of the right triangle by the hypotenuse, and the hypotenuse is always the longest side. A smaller number divided by a larger one is less than 1. Tangent divides one leg by the other, so it can be any positive size, about 11.43 at 85°." },
    { q: "When do you use sin, cos or tan to find a missing side?", a: "Pick the ratio that links the side you know with the side you want. Knowing the hypotenuse and wanting the opposite side calls for sine: opposite = hypotenuse × sin θ. Knowing the adjacent side and wanting the opposite calls for tangent: opposite = adjacent × tan θ." },
    { q: "How do you find an angle from two sides?", a: "Use an inverse trigonometric function. If the opposite side is 4 and the hypotenuse is 8, then sin θ = 0.5 and θ = sin⁻¹(0.5) = 30°. Calculators label these keys sin⁻¹, cos⁻¹ and tan⁻¹, sometimes written arcsin, arccos and arctan." },
    { q: "What is the connection between the sine and cosine of the two acute angles?", a: "The two acute angles of a right triangle add up to 90°, and the side opposite one of them is adjacent to the other. So the sine of one angle equals the cosine of the other: sin 37° and cos 53° are both about 0.602." },
  ],
};
