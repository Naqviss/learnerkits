import type { SimulationContent } from "../types";

export const card = {
  slug: "circle-area-pi", title: "Circle Area & Pi Explorer", concepts: "Pi · circumference · area of a circle · πr²",
  difficulty: "Beginner", duration: "6–10 min", kind: "Geometry model", outcome: "Roll out a circle's circumference and rearrange its sectors to see where π, 2πr and πr² come from.",
  seoTarget: "area of a circle", visualMode: "graph",
} as const;

export const es = { title: "Explorador del área del círculo y pi", outcome: "Desenrolla la circunferencia de un círculo y reordena sus sectores para ver de dónde salen π, 2πr y πr².", concepts: "Pi · circunferencia · área del círculo · πr²", kind: "Modelo geométrico" };

export const description = "Roll a circle along a line to see its circumference is π diameters, then cut it into up to 48 sectors and rearrange them into a πr by r rectangle.";

export const content: SimulationContent = {
  question: "Where do the formulas C = 2πr and A = πr² for a circle come from?",
  answer: "Every circle's circumference is about 3.14 times its diameter, and that ratio is the number π, so C = πd = 2πr. For the area, cut the circle into many thin sectors and line them up alternately point-up and point-down. They form a shape close to a rectangle whose length is half the circumference, πr, and whose height is the radius r, so the area is πr × r = πr².",
  science: [
    "All circles have the same shape and differ only in size, so enlarging a circle stretches its circumference and its diameter by the same factor. Their ratio never changes. Ancient mathematicians measured it with string and wheels, and Archimedes trapped it between 3 10/71 and 3 1/7 using polygons with 96 sides.",
    "The rearranging argument works because the sectors' curved edges straighten out as they get thinner. With 8 sectors the shape is a wavy parallelogram; with 48 it is almost a rectangle. Half the sectors put their arcs along the bottom, which adds up to half the circumference, πr, while each sector's straight side is a radius r.",
    "Area grows with the square of the radius. A pizza with a 30 cm diameter has four times the area of a 15 cm one, not twice, which is why one large pizza often gives more food than two small ones. Engineers sizing pipes, wheels and round tanks use the same rule.",
  ],
  formula: { expression: "C = 2πr = πd, A = πr²", meaning: "C is the circumference, A the area, r the radius and d = 2r the diameter. π is about 3.14159 and is the same for every circle." },
  steps: [
    "With Mode on Unroll circumference and Radius r at 2, press ▶ Play and count how many blue diameter marks the rolled-out circumference passes.",
    "Change Radius r to 1 and then 4, unrolling each time, and check that C ÷ d still reads 3.1416 while Circumference changes.",
    "Switch to Rearrange area, set Sectors to 8 and drag Rearranged to 1. Then raise Sectors to 24 or more and replay.",
    "Compare the finished strip's width, labeled πr, and its height r with the Area readout.",
    "Note Area at a radius of 1.5, then double Radius r to 3 and predict the new Area before reading it.",
  ],
  misconception: { myth: "Doubling the radius doubles the area of a circle.", fact: "Area depends on the radius squared, so doubling the radius multiplies the area by 4. A circle of radius 3 has an area of 28.27 square units, four times the 7.07 of a radius 1.5 circle." },
  modelNote: "Radius runs from 1 to 4 units in half-unit steps, and sectors from 4 to 48. The rearranged shape is drawn exactly, so its wavy edges show that the rectangle is a limit reached only with infinitely many sectors. π is used to full precision.",
  faq: [
    { q: "What is pi and why is it about 3.14?", a: "Pi is the ratio of any circle's circumference to its diameter. Measuring carefully shows the circumference is a little more than three diameters, about 3.14159. Pi is irrational, so its decimal digits never end or repeat, and 22/7 or 3.14 are only approximations." },
    { q: "How do you find the area of a circle from its diameter?", a: "Halve the diameter to get the radius, square it and multiply by π. A circle with a 10 cm diameter has a radius of 5 cm, so its area is π × 25, about 78.5 square centimeters. Using the diameter directly needs the formula πd² ÷ 4." },
    { q: "How do you find the circumference of a circle?", a: "Multiply the diameter by π, or multiply the radius by 2π. A bicycle wheel with a 70 cm diameter has a circumference of about 220 cm, so one full turn of the wheel moves the bike forward roughly 2.2 meters." },
    { q: "Why is the area formula πr² and not 2πr?", a: "The expression 2πr is a length, the distance around the circle, while area measures the flat space inside. Rearranging thin sectors gives a near-rectangle πr long and r high, and multiplying those two lengths gives πr², measured in square units." },
  ],
};
