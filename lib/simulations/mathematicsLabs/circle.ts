// Circle measurements and the classic "cut into sectors and rearrange" picture of πr².
export const circumference = (r: number) => 2 * Math.PI * r;
export const area = (r: number) => Math.PI * r * r;
export const ratio = (r: number) => circumference(r) / (2 * r);

/** A sector drawn from its apex: position (y up, units of the radius) and the angle its bisector points. */
export type SectorPose = { x: number; y: number; angle: number; half: "top" | "bottom" };

/**
 * Pose of every sector of a unit circle cut into `n` equal sectors (n even), at `progress` 0–1.
 * At 0 every apex sits at the center and sector i points along (i + ½)·2π/n. At 1 the top half
 * points up as a row of "V" shapes and the bottom half points down as interleaved "Λ" shapes,
 * forming a strip about π wide and 1 high, centered on the origin. Apex and angle move linearly.
 */
export function sectorPoses(n: number, progress: number): SectorPose[] {
  const step = (2 * Math.PI) / n, half = n / 2, t = Math.max(0, Math.min(1, progress));
  const shift = (half * step - step / 2) / 2; // centers the strip, which runs from −step/2 to π
  const poses: SectorPose[] = [];
  for (let i = 0; i < n; i++) {
    const start = (i + 0.5) * step, top = i < half;
    // Top sectors run right to left as i grows; place them right to left so nothing crosses.
    const k = top ? half - 1 - i : i - half;
    const end = top
      ? { x: k * step - shift, y: -0.5, angle: Math.PI / 2 }
      : { x: k * step + step / 2 - shift, y: 0.5, angle: (3 * Math.PI) / 2 };
    // "+ 0" turns −0 into 0 at progress 0.
    poses.push({ x: end.x * t + 0, y: end.y * t + 0, angle: start + (end.angle - start) * t, half: top ? "top" : "bottom" });
  }
  return poses;
}

/** Horizontal extent of the finished strip in radius units: half the circumference plus half a sector. */
export const stripWidth = (n: number) => Math.PI + Math.PI / n;
