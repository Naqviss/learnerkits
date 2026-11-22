// A right triangle with the right angle at the bottom-right corner. `base` is the angle in degrees
// at the bottom-left corner; the angle at the top corner is 90 − base.
export type Corner = "base" | "top";

export function rightTriangle(base: number, hyp: number) {
  const r = (base * Math.PI) / 180;
  return { horizontal: hyp * Math.cos(r), vertical: hyp * Math.sin(r), hyp };
}

/** The angle θ at the chosen corner. */
export const thetaAt = (base: number, corner: Corner) => (corner === "base" ? base : 90 - base);
/** The bottom-left angle that gives θ at the chosen corner (the inverse of thetaAt). */
export const baseFor = (theta: number, corner: Corner) => (corner === "base" ? theta : 90 - theta);

/**
 * Opposite and adjacent are named from the angle you stand at: from the bottom-left corner the
 * vertical side is opposite, from the top corner the horizontal side is.
 */
export function sidesFor(base: number, hyp: number, corner: Corner) {
  const t = rightTriangle(base, hyp);
  return corner === "base" ? { opposite: t.vertical, adjacent: t.horizontal, hyp } : { opposite: t.horizontal, adjacent: t.vertical, hyp };
}

export function ratios(base: number, hyp: number, corner: Corner) {
  const s = sidesFor(base, hyp, corner);
  return { sin: s.opposite / s.hyp, cos: s.adjacent / s.hyp, tan: s.opposite / s.adjacent };
}
