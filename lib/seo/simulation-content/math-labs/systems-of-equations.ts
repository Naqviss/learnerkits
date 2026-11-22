import type { SimulationContent } from "../types";

export const card = {
  slug: "systems-of-equations", title: "Systems of Equations Graphing Lab", concepts: "Simultaneous equations · intersection · parallel lines · substitution",
  difficulty: "Intermediate", duration: "8–12 min", kind: "Graph lab", outcome: "Drag two lines until they cross and explain why that point solves both equations.",
  seoTarget: "systems of equations graphing", visualMode: "graph",
} as const;

export const es = { title: "Laboratorio de sistemas de ecuaciones", outcome: "Arrastra dos rectas hasta que se crucen y explica por qué ese punto resuelve ambas ecuaciones.", concepts: "Ecuaciones simultáneas · intersección · rectas paralelas · sustitución", kind: "Laboratorio de gráficas" };

export const description = "Drag two lines on a grid to solve a system of equations by graphing. See one crossing point, parallel lines with no solution, or the same line twice.";

export const content: SimulationContent = {
  question: "How do you solve a system of two linear equations by graphing?",
  answer: "Graph both equations on the same axes and find where the lines cross. The crossing point is the solution, because its coordinates make both equations true at once. The system y = x + 1 and y = −x + 5 has the solution (2, 3). Lines with different slopes always cross exactly once, parallel lines never cross, and two copies of the same line share every point.",
  science: [
    "Each linear equation in two variables describes every point (x, y) that makes it true, and those points form a straight line. Solving a system means finding the points that are on both lines at the same time. With two different, non-parallel lines there is exactly one such point, so the system has a single ordered pair as its answer.",
    "Graphing shows the answer, and algebra confirms it. When both equations are written as y = mx + b, setting the right-hand sides equal removes y: x + 1 = −x + 5 gives 2x = 4, so x = 2 and then y = 3. This substitution step works even when the crossing point has awkward coordinates that are hard to read from a grid.",
    "Comparing two plans is the classic use. A gym that charges $20 to join plus $5 a visit costs 20 + 5v dollars, and a gym that charges $10 a visit costs 10v. The two cost lines cross at v = 4 visits and $40, so the second gym is cheaper for fewer than four visits and the first is cheaper after that.",
  ],
  formula: { expression: "m₁x + b₁ = m₂x + b₂ → x = (b₂ − b₁) ÷ (m₁ − m₂)", meaning: "m₁, b₁ and m₂, b₂ are the slopes and y-intercepts of the two lines. Substitute x back into either equation to find y. When m₁ = m₂ the formula would divide by zero, which is the parallel or identical case." },
  steps: [
    "Read the starting system in the Line 1 and Line 2 readouts, then predict roughly where the lines will meet before reading the Solution readout, (3.33, 2.33).",
    "Drag the blue dot on the y-axis, or use Line 1 intercept b₁, until Solution reads (2, 3). Check the substitution line under the graph.",
    "Give both lines the same slope with Line 1 slope m₁ and Line 2 slope m₂. Watch the graph report no solution, then match the intercepts too.",
    "Press Load the gym story and explain what the crossing point at 4 visits and $40 means for someone choosing a gym.",
  ],
  misconception: { myth: "Every system of two equations has exactly one solution.", fact: "Only lines with different slopes meet exactly once. Parallel lines have no common point, and two equations for the same line have infinitely many solutions." },
  modelNote: "Both equations are in slope-intercept form, so vertical lines such as x = 3 cannot be drawn. Slopes run from −4 to 4 in steps of 0.25 and intercepts from −6 to 6 in steps of 0.5; the grid shows x from −8 to 8.",
  faq: [
    { q: "What does the solution to a system of equations mean?", a: "The solution is the pair of values that satisfies every equation in the system at the same time. On a graph it is the point where the lines intersect. For y = 2x − 1 and y = x + 2, the solution x = 3, y = 5 works in both: 2 × 3 − 1 = 5 and 3 + 2 = 5." },
    { q: "How can you tell how many solutions a linear system has without graphing?", a: "Write both equations as y = mx + b and compare them. Different slopes mean exactly one solution. Equal slopes with different intercepts mean parallel lines and no solution. Equal slopes and equal intercepts mean the equations describe the same line, so there are infinitely many solutions." },
    { q: "What are the methods for solving systems of equations?", a: "The three standard methods are graphing, substitution and elimination. Graphing gives a quick picture of the answer. Substitution solves one equation for a variable and puts it into the other. Elimination adds or subtracts multiples of the equations so one variable cancels, which is often fastest when the coefficients line up." },
    { q: "Why is graphing sometimes not accurate enough?", a: "A crossing point with fractional coordinates, such as (10/3, 7/3), is hard to read exactly from grid lines, and a hand-drawn line can be slightly off. Graphing is best for estimating and for seeing how many solutions exist, while substitution or elimination gives the exact values." },
  ],
};
