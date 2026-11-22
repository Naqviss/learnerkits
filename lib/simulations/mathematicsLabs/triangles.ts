// Angles of a triangle from its three vertices, in degrees.
export type Pt = { x: number; y: number };
export type Angles = { A: number; B: number; C: number };

const deg = (rad: number) => (rad * 180) / Math.PI;

/** Interior angle at P between the rays P→Q and P→R. */
export function angleAt(p: Pt, q: Pt, r: Pt) {
  const ux = q.x - p.x, uy = q.y - p.y, vx = r.x - p.x, vy = r.y - p.y;
  return deg(Math.atan2(Math.abs(ux * vy - uy * vx), ux * vx + uy * vy));
}

export function triangleAngles(a: Pt, b: Pt, c: Pt): Angles {
  return { A: angleAt(a, b, c), B: angleAt(b, c, a), C: angleAt(c, a, b) };
}

/** Twice the signed area; near zero means the three points are (almost) in a line. */
export const doubleArea = (a: Pt, b: Pt, c: Pt) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

/** A usable triangle: area of at least `minArea` square units. */
export const isTriangle = (a: Pt, b: Pt, c: Pt, minArea = 0.5) => Math.abs(doubleArea(a, b, c)) / 2 >= minArea;

/**
 * Whole-degree labels that always add up to exactly 180: round down, then give the leftover
 * degrees to the angles with the largest fractional parts (largest-remainder rounding).
 */
export function roundAngles(angles: Angles): Angles {
  const keys = ["A", "B", "C"] as const;
  const floors = keys.map((k) => Math.floor(angles[k] + 1e-9));
  let left = 180 - floors.reduce((s, n) => s + n, 0);
  const order = keys.map((k, i) => ({ i, frac: angles[k] - floors[i] })).sort((p, q) => q.frac - p.frac);
  for (const { i } of order) { if (left <= 0) break; floors[i] += 1; left -= 1; }
  return { A: floors[0], B: floors[1], C: floors[2] };
}

export type AngleType = "acute" | "right" | "obtuse";
export type SideType = "equilateral" | "isosceles" | "scalene";

/** Right when an angle is within `tolerance` degrees of 90. */
export function angleType(angles: Angles, tolerance = 0.5): AngleType {
  const largest = Math.max(angles.A, angles.B, angles.C);
  if (Math.abs(largest - 90) <= tolerance) return "right";
  return largest > 90 ? "obtuse" : "acute";
}

export function sideType(a: Pt, b: Pt, c: Pt): SideType {
  const d = (p: Pt, q: Pt) => (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
  const s = [d(b, c), d(c, a), d(a, b)], eq = (x: number, y: number) => Math.abs(x - y) <= 1e-9;
  if (eq(s[0], s[1]) && eq(s[1], s[2])) return "equilateral";
  return eq(s[0], s[1]) || eq(s[1], s[2]) || eq(s[0], s[2]) ? "isosceles" : "scalene";
}

/** Exterior angle at C, between the extension of BC beyond C and side CA. */
export const exteriorAtC = (angles: Angles) => 180 - angles.C;
