import type { SimulationContent } from "../types";

export const card = {
  slug: "triangle-angle-sum", title: "Triangle Angle Sum Explorer", concepts: "Interior angles · 180° · exterior angle · triangle types",
  difficulty: "Beginner", duration: "6–10 min", kind: "Geometry lab", outcome: "Drag the corners of a triangle and prove that its three angles always add up to 180°.",
  seoTarget: "triangle angle sum", visualMode: "graph",
} as const;

export const es = { title: "Explorador de la suma de ángulos de un triángulo", outcome: "Arrastra los vértices de un triángulo y comprueba que sus tres ángulos siempre suman 180°.", concepts: "Ángulos interiores · 180° · ángulo exterior · tipos de triángulos", kind: "Laboratorio de geometría" };

export const description = "Drag the corners of a triangle and watch its three angles change while their total stays 180°. Tear off the corners and see them form a straight line.";

export const content: SimulationContent = {
  question: "Why do the angles in a triangle always add up to 180 degrees?",
  answer: "The three interior angles of any flat triangle add up to 180°, the angle of a straight line. Cut off the three corners and place them side by side, and they fit together into a straight line with no gap or overlap. A triangle with angles of 63° and 50° must therefore have a third angle of 67°, whatever its size or shape.",
  science: [
    "The classic proof uses parallel lines. Draw a line through one corner, C, parallel to the opposite side AB. Where sides CA and CB meet that line, they form alternate angles, and alternate angles between parallel lines are equal. So the two angles beside ∠C on the new line equal ∠A and ∠B, and the three angles together make one straight line.",
    "The same fact gives the exterior angle theorem. If you extend side BC past C, the outside angle at C and the inside angle ∠C sit on a straight line, so they add to 180°. The outside angle is therefore 180° − ∠C, which equals ∠A + ∠B, the two interior angles that are not next to it.",
    "Because the total is fixed, one angle limits the others. A triangle can hold at most one right angle or one obtuse angle, since two of them would already reach 180°. Surveyors and roof builders use the rule to find a missing angle from two measured ones without measuring the third.",
  ],
  formula: { expression: "∠A + ∠B + ∠C = 180°, exterior angle at C = ∠A + ∠B", meaning: "∠A, ∠B and ∠C are the interior angles at the three corners. The exterior angle at C lies between side CA and the extension of side BC beyond C." },
  steps: [
    "Drag corner C and watch the colored angle labels change. The ∠A + ∠B + ∠C readout keeps reaching exactly 180°.",
    "Pull one corner until Triangle type reads Obtuse, then make one angle exactly 90° so it reads Right.",
    "Press Tear off the corners. The three colored wedges slide down and line up on a straight line marked 180°.",
    "Press Show exterior angle. A green angle appears outside corner C; move any corner and compare its value with ∠A + ∠B.",
  ],
  misconception: { myth: "A bigger triangle has bigger angles that add up to more.", fact: "Scaling a triangle up or down changes its side lengths but not its angles. A tiny triangle and a huge one with the same shape have identical angles, and both totals are 180°." },
  modelNote: "Corners snap to a half-unit grid, and angles are rounded to whole degrees so the three labels always total 180°. The triangle lies on a flat plane; on a curved surface such as a globe, triangle angles add up to more than 180°.",
  faq: [
    { q: "How do you find the third angle of a triangle?", a: "Add the two angles you know and subtract the result from 180°. If a triangle has angles of 48° and 75°, the third angle is 180° − 123° = 57°. The rule works for every triangle drawn on a flat surface, including right and obtuse ones." },
    { q: "What is the exterior angle theorem?", a: "The exterior angle theorem says an exterior angle of a triangle equals the sum of the two interior angles that are not adjacent to it. In a triangle with angles of 40° and 70°, the exterior angle beside the third corner is 40° + 70° = 110°." },
    { q: "Can a triangle have two right angles?", a: "No. Two right angles already total 180°, leaving 0° for the third corner, so the two sides would never meet. For the same reason a triangle can have at most one obtuse angle, and every triangle has at least two acute angles." },
    { q: "What are the angles in an equilateral triangle?", a: "All three are 60°. An equilateral triangle has equal sides, which forces equal angles, and 180° shared equally between three corners gives 60° each. An isosceles triangle has two equal angles opposite its two equal sides." },
    { q: "Do the angles of a triangle always add up to 180°?", a: "They do on a flat surface, which is the geometry taught in school. On a sphere they add up to more: a triangle on a globe joining the North Pole to two points on the equator a quarter-turn apart has three right angles, totaling 270°." },
  ],
};
