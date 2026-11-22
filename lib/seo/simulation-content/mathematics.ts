import type { SimulationContent } from "./types";

// Each entry names the controls and readouts in lib/simulations/mathematicsLabs/model.ts and
// components/subjects/mathematics/MathematicsActivitiesClient.tsx. Recheck the numbers if those change.
export const mathematicsContent: Record<string, SimulationContent> = {
  "vector-lab": {
    question: "How do you add two vectors and find the magnitude of the result?",
    answer: "To add two vectors, add their x-components together and their y-components together. The resultant of A = ⟨2, 3⟩ and B = ⟨1, 1⟩ is R = ⟨3, 4⟩. Its magnitude comes from the Pythagorean theorem, √(3² + 4²) = 5, and its direction is the angle atan2(4, 3) ≈ 53.1° measured counterclockwise from the positive x-axis.",
    science: [
      "A vector carries a size and a direction, so it cannot be added like an ordinary number. Writing it in components splits it into a horizontal part and a vertical part that never interfere with each other. Adding A and B then means walking A’s arrow and starting B’s arrow at its tip; the resultant joins the start of A to the end of B.",
      "The magnitude of ⟨x, y⟩ is √(x² + y²) because the components form the two legs of a right triangle. Direction uses the two-argument arctangent, which keeps track of the quadrant: ⟨−3, −4⟩ also has magnitude 5, but its direction is about −126.9°, not 53.1°.",
      "Pilots and sailors combine vectors constantly. A plane heading north at 200 km/h in a 50 km/h wind blowing east has a ground velocity of ⟨50, 200⟩, so it travels at about 206 km/h on a heading roughly 14° east of north.",
    ],
    formula: { expression: "R = A + B = ⟨Aₓ + Bₓ, Aᵧ + Bᵧ⟩, |R| = √(Rₓ² + Rᵧ²)", meaning: "R is the resultant vector, A and B the vectors being added and |R| the length of the resultant. Components are added separately before the length is found." },
    steps: [
      "Leave the starting values in place and read the panel: Resultant shows ⟨3, 4⟩, Magnitude 5.00 and Direction 53.1°.",
      "Predict the resultant before you change Vector B · x to 4 and Vector B · y to 5, then compare your prediction with the Resultant readout.",
      "Notice that ⟨6, 8⟩ points in the same 53.1° direction as ⟨3, 4⟩ while its Magnitude doubles to 10.",
      "Set Vector B to the exact opposite of Vector A, such as ⟨−2, −3⟩, and check that the resultant collapses to ⟨0, 0⟩.",
      "Try a resultant in the third quadrant and watch Direction become a negative angle.",
    ],
    misconception: { myth: "The magnitude of A + B is the magnitude of A plus the magnitude of B.", fact: "Lengths only add when the vectors point the same way. ⟨3, 0⟩ and ⟨0, 4⟩ have lengths 3 and 4, but their sum ⟨3, 4⟩ has length 5, not 7." },
    modelNote: "Components are whole numbers from −10 to 10 on a grid with equal x and y scales, so angles on screen are true angles. The lab works in two dimensions only; three-dimensional vectors follow the same rules with an extra z-component.",
    faq: [
      { q: "What is a resultant vector?", a: "A resultant vector is the single vector that has the same effect as two or more vectors combined. You find it by adding the vectors component by component, or by drawing them tip to tail and joining the first tail to the last tip. Forces, velocities and displacements are all combined this way." },
      { q: "How do you find the direction of a vector from its components?", a: "Use θ = atan2(y, x), which gives the angle from the positive x-axis and places it in the correct quadrant. A plain arctan(y ÷ x) cannot tell ⟨3, 4⟩ from ⟨−3, −4⟩, because both ratios equal 4/3, even though the vectors point in opposite directions." },
      { q: "Can two nonzero vectors add up to zero?", a: "Yes. When two vectors have equal lengths and point in exactly opposite directions, every component cancels and the resultant is the zero vector. Two equal tension forces pulling a rope in opposite directions are a physical example, because the rope does not accelerate." },
      { q: "What is the difference between a scalar and a vector?", a: "A scalar is fully described by one number and a unit, such as a mass of 5 kg or a temperature of 20 °C. A vector also needs a direction: a displacement of 5 m north is different from 5 m east, even though both have the same size." },
    ],
  },

  "function-explorer": {
    question: "How do the coefficients a, b and c change the graph of a quadratic function?",
    answer: "In f(x) = ax² + bx + c, the sign of a decides whether the parabola opens upward or downward and its size sets how narrow the curve is. The constant c is the y-intercept. Together a and b fix the vertex at x = −b ÷ 2a, and the discriminant b² − 4ac tells you whether the graph crosses the x-axis twice, touches it once or misses it.",
    science: [
      "Every quadratic graph is a parabola that is symmetric about a vertical line through its vertex. The roots, where f(x) = 0, sit at equal distances on either side of that line, which is why their average is always −b ÷ 2a.",
      "The quadratic formula x = (−b ± √(b² − 4ac)) ÷ 2a finds the roots directly. The part under the square root decides how many real roots exist: positive gives two, zero gives one repeated root and negative gives none. For x² + x − 6 the discriminant is 1 + 24 = 25, so the roots are (−1 ± 5) ÷ 2, which are −3 and 2.",
      "Quadratics model anything whose rate of change grows steadily. A ball’s height over time, the area of a square pen as its side grows and the profit from a price that also cuts sales all trace parabolas, and the vertex marks the highest or lowest value.",
    ],
    formula: { expression: "x = (−b ± √(b² − 4ac)) ÷ 2a", meaning: "x gives the roots of ax² + bx + c = 0. The expression b² − 4ac is the discriminant, and the vertex lies at x = −b ÷ 2a, halfway between the roots." },
    steps: [
      "Start from y = x² and read the panel: Discriminant 0, Vertex (0, 0) and a single repeated root at 0.",
      "Raise Coefficient c to 4 and predict what happens to the roots before looking. The curve lifts off the x-axis and Roots reports no two real roots.",
      "Set Coefficient a = 1, Coefficient b = 1 and Coefficient c = −6. Check that Roots reads −3 and 2 and Vertex reads (−0.5, −6.25).",
      "Make Coefficient a negative and watch the parabola flip while the gold y-intercept point stays at c.",
      "Set Coefficient a to 0 and see Vertex change to Not quadratic, because the graph has become a straight line.",
    ],
    misconception: { myth: "Changing b moves the parabola straight left or right.", fact: "Changing b moves the vertex along a curved path, because the vertex height −b² ÷ 4a + c changes along with its x-position. Only vertex form y = a(x − h)² + k separates a pure horizontal shift." },
    modelNote: "Coefficient a runs from −3 to 3, b from −8 to 8 and c from −10 to 10. Only real roots are listed; when the discriminant is negative the complex roots are not shown, and the graph window is fixed rather than zooming.",
    faq: [
      { q: "What does the discriminant tell you about a quadratic?", a: "The discriminant b² − 4ac counts the real roots without solving the equation. A positive value means the parabola crosses the x-axis at two points, zero means its vertex just touches the axis, and a negative value means the graph sits entirely above or below the axis with no real roots." },
      { q: "How do you find the vertex of a parabola in standard form?", a: "For y = ax² + bx + c, the vertex has x-coordinate −b ÷ 2a. Substitute that value back into the equation to get the y-coordinate. For y = 2x² − 8x + 3, the vertex is at x = 2 and y = 8 − 16 + 3 = −5, giving (2, −5)." },
      { q: "How can you write a quadratic from its roots?", a: "If the roots are p and q, the quadratic a(x − p)(x − q) has exactly those roots for any nonzero a. Roots −3 and 2 give (x + 3)(x − 2), which expands to x² + x − 6. Choosing a negative a flips the parabola without moving the roots." },
      { q: "Why does a quadratic have at most two roots?", a: "A polynomial of degree two can be factored into at most two linear factors, and each factor produces one root. Geometrically, a parabola is a curve that changes direction only once, so a horizontal line such as the x-axis can meet it at most twice." },
    ],
  },

  "geometry-slice-3d": {
    question: "What cross-sections do you get when you slice a cylinder, cube, cone or sphere?",
    answer: "A cross-section is the flat shape where a plane cuts a solid. Slicing a cylinder parallel to its base gives a circle, while a vertical cut gives a rectangle. Any cut parallel to a cube’s faces gives a square. A cone cut horizontally gives a circle and a vertical cut through its tip gives a triangle, and every plane that cuts a sphere gives a circle.",
    science: [
      "The shape of a section depends on the solid and on the angle and position of the cutting plane. A cylinder and a cone both have circular bases, so horizontal cuts give circles, but the cone’s circles shrink to a point at the apex while the cylinder’s stay the same size all the way up.",
      "Moving the plane away from the center changes the size of a section and sometimes its type. A sphere cut 2 units from the center of a 2.5-unit sphere leaves a circle of radius √(2.5² − 2²) = 1.5. A vertical cut through a cone that misses the tip produces a curved hyperbola instead of a triangle.",
      "Cross-sections are how doctors read CT and MRI scans, which image the body as a stack of thin slices. Engineers use them to calculate the strength of beams, and geologists reconstruct rock layers from core samples in the same way.",
    ],
    steps: [
      "Choose Cylinder, keep Slice orientation on Horizontal and Plane offset at 0. The amber outline and the Cross-section readout both show a circle.",
      "Switch Slice orientation to Vertical and predict the new shape before the outline redraws as a rectangle.",
      "Pick Sphere and drag Plane offset toward 0.7. Watch the amber circle shrink while the readout still says Circle.",
      "Choose Cone with a Vertical slice at offset 0 to make a triangle, then drag the view to orbit the solid and see where the plane cuts it.",
    ],
    misconception: { myth: "A solid has only one cross-section.", fact: "The same solid gives different sections for different planes. A cylinder gives circles, rectangles and, with a tilted cut, ellipses, so you have to name the plane as well as the solid." },
    modelNote: "The solids are ideal shapes, and the planes are horizontal or vertical only. The Cross-section readout names the centered slice, so a vertical cone cut away from the tip still reads Triangle even though the true section is a hyperbola. Tilted planes, ellipses and parabolas are not shown.",
    faq: [
      { q: "What is a cross-section in geometry?", a: "A cross-section is the two-dimensional shape left when a plane cuts through a three-dimensional solid. Its outline is the set of points where the plane meets the surface of the solid. Slicing a loaf of bread shows the idea: every slice has roughly the same cross-section as the loaf." },
      { q: "Can a cube have a hexagonal cross-section?", a: "Yes. A plane that passes through the midpoints of six edges, tilted perpendicular to a long diagonal of the cube, cuts all six faces and leaves a regular hexagon. Other tilted planes give triangles, rectangles and pentagons, so a cube has a surprising variety of sections." },
      { q: "What shapes are conic sections?", a: "Conic sections are the curves made by cutting a double cone with a plane: circles, ellipses, parabolas and hyperbolas. A horizontal cut gives a circle, a slight tilt gives an ellipse, a cut parallel to the side gives a parabola and a steeper cut gives a hyperbola." },
    ],
  },

  "pythagorean-puzzle": {
    question: "How do you use the Pythagorean theorem to find the hypotenuse?",
    answer: "In a right triangle, the square of the hypotenuse equals the sum of the squares of the two legs, a² + b² = c². To find the hypotenuse, square both legs, add them and take the square root. Legs of 5 and 12 give 25 + 144 = 169, so the hypotenuse is √169 = 13. The rule works only when the angle between the legs is exactly 90°.",
    science: [
      "The theorem is a statement about areas. Build a square on each side of a right triangle and the two smaller squares together have exactly the same area as the square on the hypotenuse. Rearranging four copies of the triangle inside a large square is one classic proof.",
      "Whole-number solutions such as 3–4–5, 5–12–13 and 8–15–17 are called Pythagorean triples. Multiplying a triple by any whole number gives another one, so 6–8–10 and 9–12–15 also work. Builders still use a 3–4–5 rope or tape measure to check that a corner is square.",
      "The converse is equally useful: if a² + b² = c² for the three sides, the triangle must contain a right angle. The same idea gives the distance between two points on a graph, √((x₂ − x₁)² + (y₂ − y₁)²), which is how maps and GPS receivers measure straight-line distance.",
    ],
    formula: { expression: "a² + b² = c², so c = √(a² + b²)", meaning: "a and b are the two legs that meet at the right angle and c is the hypotenuse, the longest side, opposite the right angle." },
    steps: [
      "Choose Puzzle A in the Triangle menu. Leg a reads 3 and Leg b reads 4, and the diagram marks the hypotenuse c = ?.",
      "Read the a² + b² value of 25, then set Your hypotenuse to its square root and watch the triangle close.",
      "Switch to Puzzle B, estimate the hypotenuse before you calculate it, then check your estimate against √169.",
      "Finish Puzzle C with legs 8 and 15, and compare the area squares drawn on each side of the triangle.",
    ],
    misconception: { myth: "The hypotenuse equals a + b.", fact: "The hypotenuse is always shorter than the two legs added together, because a straight path is the shortest route. For legs 3 and 4 it is 5, not 7, which is why the theorem adds the squares instead of the lengths." },
    modelNote: "The three puzzles use the triples 3–4–5, 5–12–13 and 8–15–17, so every answer is a whole number. Your hypotenuse moves in steps of 0.1 from 0 to 25. Finding a missing leg, which uses a² = c² − b², is not included.",
    faq: [
      { q: "How do you find a missing leg with the Pythagorean theorem?", a: "Rearrange the formula to a = √(c² − b²). If the hypotenuse is 10 and one leg is 6, the missing leg is √(100 − 36) = √64 = 8. Always subtract from the square of the hypotenuse, because it is the longest side." },
      { q: "What is a Pythagorean triple?", a: "A Pythagorean triple is a set of three whole numbers that satisfy a² + b² = c², such as 3, 4, 5 or 7, 24, 25. Euclid’s formula generates them: for whole numbers m > n, the sides m² − n², 2mn and m² + n² always form a triple." },
      { q: "Does the Pythagorean theorem work for every triangle?", a: "No, only for right triangles. In other triangles the law of cosines, c² = a² + b² − 2ab cos C, takes its place. When angle C is 90°, cos C is 0 and the law of cosines reduces to the Pythagorean theorem." },
      { q: "How is the Pythagorean theorem used in real life?", a: "Carpenters use it to check that walls meet at right angles, and TV screen sizes are diagonal lengths found from width and height. A ladder 5 m long placed 3 m from a wall reaches 4 m up it, and navigation software uses the same rule for straight-line distances." },
    ],
  },

  "unit-circle-challenge": {
    question: "How does the unit circle give the sine and cosine of an angle?",
    answer: "The unit circle has radius 1 and is centered at the origin. Measure an angle θ counterclockwise from the positive x-axis, and the point where its terminal side meets the circle has coordinates (cos θ, sin θ). At 0° the point is (1, 0), at 90° it is (0, 1), at 180° it is (−1, 0) and at 270° it is (0, −1).",
    science: [
      "Drop a vertical line from the point on the circle to the x-axis and you form a right triangle with hypotenuse 1. The horizontal leg is cos θ and the vertical leg is sin θ, so the circle extends the triangle definitions of sine and cosine to every angle, including obtuse and negative ones.",
      "Because the point lies on a circle of radius 1, its coordinates always satisfy x² + y² = 1, which gives the identity sin²θ + cos²θ = 1. The signs of the coordinates follow the quadrant: both are positive between 0° and 90°, cosine turns negative between 90° and 270°, and sine is negative below the x-axis.",
      "Radians measure an angle by the arc length it cuts on the unit circle. A full turn is 2π radians, so 90° is π/2 and 45° is π/4. Engineers describe alternating current, sound waves and rotating machinery with sine and cosine because each traces the height or width of a point moving around a circle.",
    ],
    formula: { expression: "(x, y) = (cos θ, sin θ), cos²θ + sin²θ = 1", meaning: "θ is the angle measured counterclockwise from the positive x-axis, and (x, y) is the point where that angle meets the circle of radius 1." },
    steps: [
      "Start at the default Angle of 45° and read Radians 0.25π, cos θ 0.707 and sin θ 0.707.",
      "Set Angle to 90° and predict the coordinates before reading them, then pick the matching option from the Coordinate menu.",
      "Step Angle through 180° and 270°, choosing the Coordinate each time, and watch which readout turns negative.",
      "Try 30° and 150°. Compare their cos θ values, 0.866 and −0.866, while sin θ stays at 0.500.",
    ],
    misconception: { myth: "Sine and cosine can only be found for angles inside a right triangle.", fact: "A right triangle limits the angle to less than 90°, but the unit circle defines sine and cosine for every angle. sin 210° is −0.5, a value no right triangle can produce." },
    modelNote: "Angle moves in 15° steps from 0° to 360°, so you can reach every multiple of 30° and 45° but not angles such as 10°. The Coordinate menu offers only the four quadrantal points, and tangent is not displayed.",
    faq: [
      { q: "Why is the unit circle radius 1?", a: "With radius 1, the hypotenuse of every reference triangle is 1, so the coordinates of the point equal cos θ and sin θ directly with no scaling. On a circle of radius r the point would be (r cos θ, r sin θ), which makes every reading r times larger." },
      { q: "How do you convert degrees to radians?", a: "Multiply the angle in degrees by π ÷ 180. So 60° becomes π/3, 135° becomes 3π/4 and 360° becomes 2π. To go back, multiply radians by 180 ÷ π. One radian is the angle whose arc on the unit circle is one radius long, about 57.3°." },
      { q: "What are the exact values of sine and cosine at 30°, 45° and 60°?", a: "At 30°, cos is √3/2 ≈ 0.866 and sin is 1/2. At 45°, both are √2/2 ≈ 0.707. At 60° the values swap from 30°: cos is 1/2 and sin is √3/2. They come from half-squares and half-equilateral triangles." },
      { q: "How can you tell the sign of sine and cosine from the quadrant?", a: "Cosine is the x-coordinate, so it is positive on the right half of the circle and negative on the left. Sine is the y-coordinate, positive on the top half and negative on the bottom. In the second quadrant, for example, sine is positive and cosine is negative." },
    ],
  },

  "quadratic-transformation": {
    question: "How do a, h and k transform a parabola in vertex form?",
    answer: "In vertex form y = a(x − h)² + k, the vertex sits at (h, k). Increasing h moves the parabola right and increasing k moves it up. The value of a stretches the curve vertically: |a| > 1 makes it narrower, |a| < 1 makes it wider and a negative a reflects it across a horizontal line so it opens downward. The graph y = (x − 2)² − 3 is y = x² shifted 2 right and 3 down.",
    science: [
      "Vertex form is built by applying transformations to the parent graph y = x² in order: stretch by a, shift horizontally by h, then shift vertically by k. Each parameter does one job, which makes vertex form the easiest way to read a parabola’s turning point straight from its equation.",
      "The horizontal shift often looks backwards. In y = (x + 2)², h is −2, because x + 2 = x − (−2), and the vertex moves 2 units left. The output reaches its minimum when the bracket equals zero, which happens at x = −2.",
      "Any standard-form quadratic can be rewritten in vertex form by completing the square. For example x² − 4x + 1 = (x − 2)² − 3. Designers of satellite dishes and suspension bridges work in vertex form because it puts the turning point exactly where they need it.",
    ],
    formula: { expression: "y = a(x − h)² + k", meaning: "(h, k) is the vertex of the parabola. a is the vertical scale factor; its sign sets the direction of opening and its size sets the width." },
    steps: [
      "Pick Target A in the Target graph menu and read Target vertex (2, −3) and Target scale 1.",
      "Set Horizontal shift h and Vertical shift k so that Your vertex matches the target, keeping Vertical scale a at 1.",
      "Switch to Target B, which opens downward. Predict the sign of a from the picture before you move Vertical scale a toward −0.5.",
      "For Target C, set the vertex to (1, 1), then try a = 1 and a = 2 and compare how the width changes.",
    ],
    misconception: { myth: "In y = (x + 3)², the parabola moves 3 units to the right.", fact: "A plus sign inside the bracket moves the graph left. The vertex is where x + 3 = 0, at x = −3, so h is −3." },
    modelNote: "Vertical scale a runs from −3 to 3 in steps of 0.25, and h and k from −5 to 5 in steps of 0.5. The three targets are fixed parabolas, and horizontal stretches such as y = (2x)² are written as vertical stretches instead.",
    faq: [
      { q: "How do you find the vertex from vertex form?", a: "Read it directly: in y = a(x − h)² + k the vertex is (h, k). Watch the sign of h. The equation y = 3(x − 4)² + 7 has vertex (4, 7), while y = 3(x + 4)² − 7 has vertex (−4, −7), because the bracket is zero at x = −4." },
      { q: "How do you convert standard form to vertex form?", a: "Complete the square. For y = x² + 6x + 5, halve the 6 to get 3, so x² + 6x = (x + 3)² − 9. Then y = (x + 3)² − 9 + 5 = (x + 3)² − 4, with vertex (−3, −4). When a is not 1, factor it out of the x terms first." },
      { q: "What does a negative a do to a parabola?", a: "A negative a reflects the parabola across the horizontal line through its vertex, so it opens downward and the vertex becomes a maximum. The size of a still controls the width, so y = −0.5x² is a wide downward parabola and y = −3x² a narrow one." },
      { q: "What is the axis of symmetry in vertex form?", a: "The axis of symmetry is the vertical line x = h through the vertex. Points the same horizontal distance either side of it have equal heights. For y = 2(x − 1)² + 1, the axis is x = 1, and the points at x = 0 and x = 2 both have y = 3." },
    ],
  },

  "slope-intercept-challenge": {
    question: "What do m and b mean in the slope-intercept form y = mx + b?",
    answer: "In y = mx + b, m is the slope, the change in y for every 1-unit increase in x, and b is the y-intercept, the value of y where the line crosses the y-axis at x = 0. The line y = 2x − 3 crosses the y-axis at −3 and rises 2 units for every unit it moves right, so it also passes through (1, −1) and (2, 1).",
    science: [
      "Slope is rise over run between any two points on the line: m = (y₂ − y₁) ÷ (x₂ − x₁). Because a straight line has the same steepness everywhere, any two points give the same answer. A positive slope rises from left to right, a negative slope falls, a zero slope is horizontal, and a vertical line has no defined slope at all.",
      "The intercept b is a starting value and the slope is a constant rate of change, which makes linear equations natural models for steady processes. A taxi that charges $4 to start and $1.50 per kilometer has cost = 1.5d + 4, and a phone plan or a filling tank works the same way.",
    ],
    formula: { expression: "y = mx + b, m = (y₂ − y₁) ÷ (x₂ − x₁)", meaning: "m is the slope, the rise for each unit of run, and b is the y-intercept, the value of y when x = 0." },
    steps: [
      "Choose Target A in the Target line menu. Before reading Target slope, estimate the rise and run between the highlighted intercept and the second point on the target line.",
      "Set Intercept b first, so your line passes through the same y-axis point, then adjust Slope m until the two lines overlap.",
      "Check the Your equation readout against the targets: Target A is y = 2x − 3.",
      "Switch to Target B, which falls from left to right. Predict the sign of m before you move Slope m toward −1.5.",
      "Finish with Target C and compare a gentle slope of 0.5 with the steeper lines.",
    ],
    misconception: { myth: "A bigger y-intercept makes a line steeper.", fact: "The intercept only slides the line up or down; the steepness depends on m alone. The lines y = 2x + 1 and y = 2x + 7 are parallel, with the same slope of 2." },
    modelNote: "Slope m runs from −5 to 5 in steps of 0.25 and Intercept b from −8 to 8 in steps of 0.5. Vertical lines such as x = 3 cannot be written as y = mx + b and are not included.",
    faq: [
      { q: "How do you find the slope of a line from two points?", a: "Subtract the y-values and divide by the difference in the x-values, taken in the same order. For (1, 3) and (4, 9), m = (9 − 3) ÷ (4 − 1) = 6 ÷ 3 = 2. Swapping the order of both points gives the same result." },
      { q: "How do you write the equation of a line from its slope and one point?", a: "Substitute the point into y = mx + b and solve for b. With slope 3 through (2, 5), 5 = 3 × 2 + b, so b = −1 and the line is y = 3x − 1. The point-slope form y − y₁ = m(x − x₁) reaches the same equation." },
      { q: "How can you tell if two lines are parallel or perpendicular?", a: "Parallel lines have equal slopes and different intercepts. Perpendicular lines have slopes that multiply to −1, so a line with slope 2 is perpendicular to any line with slope −1/2. Horizontal and vertical lines are the special perpendicular pair." },
    ],
  },

  "geometry-transformation": {
    question: "What do translations, rotations, reflections and dilations do to a shape?",
    answer: "A translation slides every point by the same amount, a rotation turns the shape around a center and a reflection flips it across a line. All three keep lengths and angles, so the image is congruent to the original. A dilation scales every distance from a center by a factor k, keeping angles but multiplying lengths by k and area by k², so a scale factor of 2 makes the area four times larger.",
    science: [
      "Each transformation has a simple coordinate rule about the origin. Translating by ⟨4, −2⟩ sends (x, y) to (x + 4, y − 2). A 90° counterclockwise rotation sends (x, y) to (−y, x), reflecting across the y-axis sends it to (−x, y), and dilating by k sends it to (kx, ky).",
      "Translations, rotations and reflections are called rigid motions because they never stretch the shape. A reflection does reverse orientation, so the vertices of a triangle that read counterclockwise A, B, C before a flip read clockwise afterward. A dilation produces a similar figure: same shape, different size.",
      "Transformations are the basis of computer graphics, animation and map projections. Every time a game character moves, turns or grows, its vertex coordinates pass through exactly these rules, usually stored as matrices so that the computer can combine several in one step.",
    ],
    steps: [
      "Choose Translation in the Transformation menu and set Horizontal translation to 4 and Vertical translation to −2 to slide the blue image onto the target.",
      "Switch to Rotation and predict which way a positive angle turns the triangle before you drag Rotation to 90°.",
      "Pick Reflection, try both options in Reflection axis and see which one matches the target. The Invariant readout says lengths and angles are kept.",
      "Select Dilation and set Dilation factor to 2. Compare the Area scale readout of 4.00 with the factor itself.",
    ],
    misconception: { myth: "Doubling the side lengths of a shape doubles its area.", fact: "Area scales with the square of the factor. Doubling every length multiplies area by 4, and tripling multiplies it by 9, which is why the Area scale readout shows k² rather than k." },
    modelNote: "All rotations and dilations are centered on the origin, and reflections use only the x-axis or y-axis. Rotations move in 15° steps and dilation factors from 0.5 to 3. Combined transformations and glide reflections are not modeled.",
    faq: [
      { q: "What is the rule for rotating a point 90° counterclockwise?", a: "About the origin, (x, y) becomes (−y, x). The point (3, 1) moves to (−1, 3). Rotating 180° gives (−x, −y), and rotating 90° clockwise, which is the same as 270° counterclockwise, gives (y, −x). Checking one vertex on a grid is a quick way to confirm." },
      { q: "Which transformations produce congruent shapes?", a: "Translations, rotations and reflections, plus any combination of them, produce congruent images with the same side lengths and angles as the original. Dilations with a scale factor other than 1 produce similar shapes instead, which have equal angles but proportional side lengths." },
      { q: "What happens with a dilation scale factor less than 1?", a: "A scale factor between 0 and 1 shrinks the shape toward the center of dilation. A factor of 0.5 halves every length and divides the area by 4. Negative factors also exist; they shrink or enlarge the shape and rotate it 180° about the center." },
      { q: "How do you reflect a point across the x-axis?", a: "Keep the x-coordinate and change the sign of the y-coordinate, so (x, y) becomes (x, −y). The point (2, 5) reflects to (2, −5). Reflecting across the y-axis does the opposite, changing the sign of x, and reflecting across y = x swaps the coordinates." },
    ],
  },

  "probability-experiment": {
    question: "Why does experimental probability get closer to theoretical probability with more trials?",
    answer: "Experimental probability is the fraction of trials in which an event happens. Theoretical probability is what the event’s possible outcomes predict, such as 1/2 for heads or 1/3 for rolling a 5 or 6. By the law of large numbers, the experimental fraction tends to settle near the theoretical value as the number of trials grows. Results still vary: 100 coin flips often land 5 or more points away from 50%.",
    science: [
      "Each trial is random, but the typical gap between the experimental and theoretical fractions shrinks in proportion to 1/√n. For a fair coin, the standard error is about 5 percentage points after 100 flips and about 1.6 points after 1,000. Ten times as many trials make the estimate only about three times more precise.",
      "The law of large numbers describes the long run, not a single short run. A coin has no memory, so after five heads the next flip is still a 50% chance; the fraction drifts toward 50% because later flips outnumber the early streak, not because tails become more likely.",
      "Polling, clinical trials and quality control all depend on this idea. A survey of 1,000 people has a margin of error of about 3 percentage points at 95% confidence, which is why reputable polls report a sample size alongside their percentages.",
    ],
    formula: { expression: "P(experimental) = successes ÷ trials, standard error ≈ √(p(1 − p) ÷ n)", meaning: "p is the theoretical probability and n the number of trials. The standard error estimates the usual distance between the experimental fraction and p." },
    steps: [
      "Choose Coin: heads in the Random event menu, set Number of trials to 100 and press Run trials. Watch Experimental change as Trials complete counts up.",
      "Press Run a fresh experiment a few times, changing Experiment seed between runs, and note how far each result lands from the 50.0% Theoretical value.",
      "Raise Number of trials to 1,000, predict whether the spread of results will shrink, then run several seeds again.",
      "Switch to Die: 5 or 6 and Spinner: blue quarter, and compare their Experimental results with 33.3% and 25.0%.",
      "Reuse a seed you tried earlier and confirm that it reproduces the same result exactly.",
    ],
    misconception: { myth: "After several heads in a row, tails is more likely on the next flip.", fact: "Each fair coin flip is independent and stays at 50% heads. Believing that a streak must be balanced out is called the gambler’s fallacy." },
    modelNote: "The trials use a seeded pseudo-random number generator, so each seed repeats exactly and runs can be checked or shared. Number of trials runs from 10 to 1,000. The coin, die and spinner are perfectly fair; real objects can be slightly biased.",
    faq: [
      { q: "What is the difference between experimental and theoretical probability?", a: "Theoretical probability comes from reasoning about equally likely outcomes; a fair die has a 1/6 chance of showing a 3. Experimental probability comes from data: if a 3 appears 18 times in 100 rolls, its experimental probability is 0.18. The two usually differ by a little in any finite experiment." },
      { q: "What is the law of large numbers?", a: "The law of large numbers states that as an experiment is repeated more times, the average result tends to approach the expected value. It does not promise that any particular sample will be close, only that large samples are very likely to be closer than small ones." },
      { q: "How many trials do you need for an accurate probability estimate?", a: "It depends on how accurate you need to be. The standard error √(p(1 − p) ÷ n) halves when the number of trials is multiplied by four. To estimate a 50% chance to within about 3 percentage points most of the time, roughly 1,000 trials are needed." },
      { q: "What is a random seed?", a: "A random seed is the starting number for a pseudo-random number generator. The same seed always produces the same sequence of numbers, which makes a computer experiment repeatable. Changing the seed gives a different but equally random-looking sequence." },
    ],
  },

  "derivative-tangent": {
    question: "How does the derivative give the slope of the tangent line?",
    answer: "The derivative f′(x) is the slope of the tangent line, the straight line that just touches the curve at one point and points in the curve’s direction there. It is found as the limit of the slopes of secant lines through two nearby points. For f(x) = x² the derivative is 2x, so the tangent at x = 1 has slope 2 and the tangent at x = −1.5 has slope −3.",
    science: [
      "A secant line through (x, f(x)) and (x + h, f(x + h)) has slope (f(x + h) − f(x)) ÷ h. As h shrinks toward zero, the secant swings into the tangent and its slope approaches the derivative. For x², the secant slope simplifies to 2x + h, which becomes 2x when h reaches zero.",
      "Power functions follow a pattern called the power rule: the derivative of xⁿ is nxⁿ⁻¹, so x³ has derivative 3x². The sine function has derivative cos x, so the slope of sin x is 1 at the origin, zero at the peaks and −1 where the curve falls through π.",
      "Derivatives measure instantaneous rates of change. Velocity is the derivative of position and acceleration the derivative of velocity, and economists call the derivative of cost the marginal cost. Wherever a smooth curve has a peak or a valley, the derivative is zero and the tangent is horizontal.",
    ],
    formula: { expression: "f′(x) = lim₍ₕ→₀₎ (f(x + h) − f(x)) ÷ h", meaning: "f′(x) is the slope of the tangent at x. The fraction is the slope of a secant line over a gap h, and the limit lets that gap shrink to zero." },
    steps: [
      "Choose f(x) = x² in the Function menu and set Point x to 1. Predict the tangent’s slope, enter it with Your slope, then compare it with Exact derivative.",
      "Move Point x to 0 and to −2. Watch the tangent flatten at the bottom of the curve and the derivative turn negative on the left side.",
      "Switch to f(x) = x³ and set Point x to 0. Notice the tangent is horizontal even though the curve does not turn around.",
      "Choose f(x) = sin(x) and find a Point x where Exact derivative is close to zero, near x = 1.6.",
    ],
    misconception: { myth: "A tangent line touches the curve at only one point.", fact: "A tangent matches the curve’s direction at one point but can cross the curve elsewhere. The tangent to y = x³ at x = 0 is the x-axis, which the curve passes straight through." },
    modelNote: "Exact derivative is calculated analytically, not estimated from secants. Point x runs from −3 to 3 and Your slope from −10 to 15 in steps of 0.1, so slopes of x³ near the edges, up to 27, are shown but cannot be entered.",
    faq: [
      { q: "What is the power rule for derivatives?", a: "The power rule says the derivative of xⁿ is n·xⁿ⁻¹ for any constant n. So x⁵ has derivative 5x⁴, x has derivative 1 and a constant has derivative 0. It also works for negative and fractional powers, such as √x = x^(1/2), whose derivative is 1 ÷ (2√x)." },
      { q: "What is the difference between a secant line and a tangent line?", a: "A secant line passes through two points on a curve, and its slope is the average rate of change between them. A tangent line touches the curve at a single point with the same direction as the curve there, and its slope is the instantaneous rate of change." },
      { q: "What does it mean when the derivative is zero?", a: "A zero derivative means the tangent is horizontal and the function is momentarily neither rising nor falling. This happens at local maximums and minimums, such as the bottom of y = x², and also at some inflection points, such as x = 0 on y = x³." },
      { q: "Why is the derivative of sin x equal to cos x?", a: "On the unit circle, sin x is the height of a point moving at unit speed. Its upward speed is greatest when the point crosses the x-axis and zero at the top, which matches cos x exactly. The limit sin(h) ÷ h → 1 as h → 0 makes this precise." },
    ],
  },

  "area-under-curve": {
    question: "How do Riemann sums approximate the area under a curve?",
    answer: "A Riemann sum splits an interval into equal strips, builds a rectangle on each strip and adds their areas. Each rectangle is as tall as the function at a sample point: the left edge, the right edge or the midpoint. As the strips get narrower, the sum approaches the definite integral. With 10 midpoint rectangles, the integral of x² from 0 to 3 is estimated as 8.9775, against an exact value of 9.",
    science: [
      "Each rectangle has width Δx = (b − a) ÷ n and height f(xᵢ), so the sum is Σ f(xᵢ)Δx. On a rising curve like x² from 0 to 3, left sums sit below the curve and underestimate the area (7.695 with 10 rectangles), while right sums overshoot (10.395).",
      "Midpoint sums are usually far more accurate, because the bit each rectangle misses on one side is nearly balanced by the bit it adds on the other. For a straight line such as 2 + x, the midpoint sum is exact for any number of rectangles. Halving the width cuts the midpoint error to about a quarter.",
      "The fundamental theorem of calculus links these sums to antiderivatives: the exact area equals F(b) − F(a), where F′ = f. That is how the exact values 9, 2 and 16 are calculated. Riemann sums remain the method computers use when no antiderivative is available, for example to total distance from a speed log.",
    ],
    formula: { expression: "∫ₐᵇ f(x) dx = lim₍ₙ→∞₎ Σ f(xᵢ) Δx, Δx = (b − a) ÷ n", meaning: "n is the number of rectangles, Δx their width and xᵢ the sample point in each strip. The limit of the sum is the definite integral." },
    steps: [
      "Choose ∫₀³ x² dx in the Integral menu, set Rectangles to 10 and Sample point to Left. Read the Riemann sum, Exact integral and Absolute error.",
      "Change Sample point to Right, then Midpoint, and predict which will be closest to the exact value of 9.",
      "Keep Midpoint selected and raise Rectangles to 20 and then 40. Check that Absolute error falls to about a quarter each time the count doubles.",
      "Switch to ∫₀⁴ (2+x) dx and find out why the midpoint sum has zero error for every number of rectangles.",
      "Try ∫₀π sin(x) dx with Left and Right sampling, and explain why the two sums are equal.",
    ],
    misconception: { myth: "More rectangles always give a more accurate answer, whichever sample point is used.", fact: "More rectangles reduce the error, but the sample point matters a great deal. With 10 rectangles, the midpoint sum for x² is off by 0.0225 while the left sum is off by 1.305." },
    modelNote: "There are three fixed integrals with exact values of 9, 2 and 16. Rectangles runs from 2 to 50, and only left, midpoint and right sampling are offered. Trapezoids, Simpson’s rule and areas below the x-axis are not covered.",
    faq: [
      { q: "What is the difference between left, right and midpoint Riemann sums?", a: "They differ only in where each rectangle’s height is measured. A left sum uses the function value at the left edge of each strip, a right sum the right edge and a midpoint sum the center. On increasing functions left sums underestimate and right sums overestimate, while midpoint sums are usually closest." },
      { q: "How is a Riemann sum related to a definite integral?", a: "The definite integral is defined as the limit of Riemann sums as the width of every strip goes to zero. For a continuous function on a closed interval, left, right and midpoint sums all approach the same limit, which is the exact signed area between the curve and the x-axis." },
      { q: "What is the area under y = x² from 0 to 3?", a: "The antiderivative of x² is x³ ÷ 3, so the exact area is 3³ ÷ 3 − 0 = 9 square units. A midpoint sum with 10 rectangles gives 8.9775, and 50 midpoint rectangles give 8.9991, showing how the estimate closes in on 9." },
      { q: "When is a Riemann sum exact?", a: "Any Riemann sum is exact for a constant function, because every rectangle fits the curve perfectly. Midpoint sums are also exact for any straight line, because the triangle missed on one side of each midpoint equals the triangle added on the other side." },
    ],
  },

  "matrix-transformation": {
    question: "How does a 2×2 matrix transform points in the plane?",
    answer: "A 2×2 matrix [[a, b], [c, d]] sends each point (x, y) to (ax + by, cx + dy). Its first column, ⟨a, c⟩, is where the unit vector î lands, and its second column, ⟨b, d⟩, is where ĵ lands, so the columns show what happens to the whole grid. The matrix [[0, −1], [1, 0]] rotates every point 90° counterclockwise, and the determinant ad − bc tells you how area is scaled.",
    science: [
      "Every point can be written as xî + yĵ, so once you know where î and ĵ go, every other point follows. That is why a matrix transformation keeps grid lines straight, parallel and evenly spaced and always leaves the origin fixed. Rotations, reflections, shears and stretches are all of this type.",
      "The determinant ad − bc is the signed area of the unit square after the transformation. Rotations have determinant 1 and keep area, the horizontal shear [[1, 1], [0, 1]] also has determinant 1 even though it tilts the square, and the reflection [[−1, 0], [0, 1]] has determinant −1, where the minus sign means orientation has flipped.",
      "When the determinant is zero, the columns point along the same line and the whole plane collapses onto that line or a single point, so the transformation cannot be undone. Computer graphics, robotics and data compression all chain matrices like these to rotate, scale and project objects efficiently.",
    ],
    formula: { expression: "[[a, b], [c, d]] · (x, y) = (ax + by, cx + dy), det = ad − bc", meaning: "a, b, c and d are the matrix entries. The columns ⟨a, c⟩ and ⟨b, d⟩ are the images of î and ĵ, and the determinant is the factor by which signed area changes." },
    steps: [
      "Start from the identity matrix, with Matrix a and Matrix d at 1 and b and c at 0. The transformed grid matches the original and Determinant reads 1.",
      "Choose Rotate 90° in the Target transform menu. Predict where î must land, then set the four entries until Basis i image reads ⟨0, 1⟩ and Basis j image reads ⟨−1, 0⟩.",
      "Switch to Horizontal shear and set Matrix b to 1. The grid tilts, but Determinant stays at 1.",
      "Choose Reflect across y-axis and set Matrix a to −1. Determinant becomes −1 as the grid flips.",
      "Set the entries to a = 1, b = 2, c = 0.5 and d = 1, and watch the grid collapse onto a line as Determinant reaches 0.",
    ],
    misconception: { myth: "A determinant of zero means the matrix does nothing.", fact: "The identity matrix, which does nothing, has determinant 1. A determinant of zero means the opposite extreme: the plane is squashed onto a line or point and area becomes zero." },
    modelNote: "Entries run from −2 to 2 in steps of 0.25, and only linear transformations are shown, so the origin never moves. Translations need a 3×3 matrix in homogeneous coordinates, and composing two matrices is not included.",
    faq: [
      { q: "What does the determinant of a 2×2 matrix represent?", a: "The determinant ad − bc is the factor by which a matrix scales area. A determinant of 3 triples the area of any shape, 0.5 halves it and a negative value means the shape is also mirrored. A determinant of zero squashes everything flat, and such a matrix has no inverse." },
      { q: "What is the matrix for a rotation by angle θ?", a: "Rotating counterclockwise by θ about the origin uses [[cos θ, −sin θ], [sin θ, cos θ]]. For 90°, cos θ is 0 and sin θ is 1, giving [[0, −1], [1, 0]]. Every rotation matrix has determinant cos²θ + sin²θ = 1, so rotations never change area." },
      { q: "Why do the columns of a matrix show where the basis vectors go?", a: "Multiplying [[a, b], [c, d]] by î = (1, 0) picks out the first column, ⟨a, c⟩, and multiplying by ĵ = (0, 1) picks out the second, ⟨b, d⟩. Since every vector is a combination of î and ĵ, those two columns determine the whole transformation." },
      { q: "What is a shear transformation?", a: "A shear slides points parallel to an axis by an amount proportional to their distance from that axis. The horizontal shear [[1, k], [0, 1]] sends (x, y) to (x + ky, y), turning squares into parallelograms with the same base and height, so the area stays the same." },
    ],
  },
};
