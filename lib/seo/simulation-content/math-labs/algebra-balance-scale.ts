import type { SimulationContent } from "../types";

export const card = {
  slug: "algebra-balance-scale", title: "Equation Balance Scale", concepts: "Linear equations · inverse operations · balance model · variables on both sides",
  difficulty: "Beginner", duration: "6–10 min", kind: "Algebra game", outcome: "Solve linear equations on a balance scale by doing the same thing to both sides.",
  seoTarget: "solving equations balance scale", visualMode: "game",
} as const;

export const es = { title: "Balanza de ecuaciones", outcome: "Resuelve ecuaciones lineales en una balanza haciendo lo mismo en ambos lados.", concepts: "Ecuaciones lineales · operaciones inversas · modelo de balanza · incógnita en ambos lados", kind: "Juego de álgebra" };

export const description = "Solve 2x + 3 = 11 on a balance scale: remove weights and split groups on both sides, watch the beam tip when one side changes, and find x = 4.";

export const content: SimulationContent = {
  question: "How does a balance scale help you solve an equation like 2x + 3 = 11?",
  answer: "An equation works like a balanced scale: whatever sits on the left weighs the same as whatever sits on the right. To solve 2x + 3 = 11, take 3 units off both pans, leaving 2x = 8, then split both pans into two equal groups, leaving x = 4. Each move is made on both sides, so the scale stays level and the equation stays true at every step.",
  science: [
    "The equals sign is a claim that two quantities are the same size. Adding or subtracting the same amount on each side, or dividing both sides by the same nonzero number, keeps that claim true. These moves are called inverse operations because each one undoes something that was done to the unknown.",
    "Solving means reversing the order in which the unknown was built up. In 2x + 3 = 11, x was multiplied by 2 and then 3 was added, so the last operation is undone first: subtract 3, then divide by 2. Substituting the answer back, 2(4) + 3 = 11, confirms it.",
    "When the unknown appears on both sides, as in 3x + 1 = x + 9, first remove one x from each pan so the unknown sits on one side only, giving 2x + 1 = 9. The same two moves as before then give x = 4. Engineers, pharmacists and spreadsheet formulas rely on rearranging equations in exactly this way.",
  ],
  formula: { expression: "ax + b = c → x = (c − b) ÷ a", meaning: "a is the number of x-boxes, b the unit weights beside them and c the units on the other pan. Subtract b from both sides, then divide both sides by a." },
  steps: [
    "Choose 2x + 3 = 11 in the Puzzle menu. Keep Apply to on Both sides, set Amount n to 3 and press Remove 3 units. The Equation readout becomes 2x = 8.",
    "Set Amount n to 2 and press Divide by 2. The scale stays level, Steps reads 2 and a green x = 4 badge appears above the beam.",
    "Switch Apply to to Left only and remove 1 unit. Watch the beam swing, the Scale readout change to Tilts right and the equals sign become ≠.",
    "Press Undo, then pick 3x + 1 = x + 9. Remove one x-box from both sides before touching the units, and predict how many steps the full solution needs.",
    "Reset 2x + 3 = 11 and choose Divide by 2 first. Read the message under the buttons explaining why 3 unit weights cannot form two equal groups.",
  ],
  misconception: { myth: "You only need to change one side of an equation.", fact: "Changing one side alone makes the two sides unequal, so the equation is no longer true. Every operation must be applied to both sides, which is why the scale tips the moment only one pan changes." },
  modelNote: "The puzzles use whole numbers with answers of 3 or 4, and each pan holds up to 24 unit weights. Negative numbers, fractions and multiplying both sides are not modeled, because physical blocks cannot be negative or cut into pieces.",
  faq: [
    { q: "What are inverse operations in algebra?", a: "Inverse operations undo each other. Addition and subtraction are inverses, and so are multiplication and division. To solve 3x + 2 = 14, subtract 2 from both sides to undo the addition, giving 3x = 12, then divide both sides by 3 to undo the multiplication, giving x = 4." },
    { q: "How do you solve an equation with variables on both sides?", a: "Collect the variable terms on one side first. In 5x + 2 = 2x + 11, subtract 2x from both sides to get 3x + 2 = 11. Then subtract 2 from both sides to get 3x = 9, and divide by 3 to reach x = 3. Substituting gives 17 on each side." },
    { q: "Why do you have to do the same thing to both sides of an equation?", a: "An equation states that two expressions are equal. If you change only one of them, they are no longer equal, and any answer you reach afterward may be wrong. Applying the same operation to both keeps the equality, just as identical weights added to both pans keep a scale level." },
    { q: "How can you check the answer to an equation?", a: "Substitute the value back into the original equation and work out each side separately. For 4x + 6 = x + 15 and x = 3, the left side is 4(3) + 6 = 18 and the right side is 3 + 15 = 18. Because both sides match, x = 3 is the solution." },
  ],
};
