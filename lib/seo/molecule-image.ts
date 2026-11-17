import type { MoleculeReference } from "@/lib/seo/molecules";
import { angleShort, plainFormula } from "@/lib/seo/molecules";
import { molecules } from "@/lib/simulations/chemistry/model";

// Static ball-and-stick picture of each molecule reference page, generated at build time from the
// same VSEPR data as the interactive 3D lab. The 3D model is drawn on a canvas, which search engines
// cannot see, so without this a molecule page had no image of the molecule for a result thumbnail,
// Google Images, or a social preview. Served as /images/molecules/{slug}.svg (on the page) and
// /images/molecules/{slug}.jpg (og:image), see app/images/molecules/[file]/route.ts.

export const moleculeImage = (slug: string) => ({
  svg: `/images/molecules/${slug}.svg`,
  jpg: `/images/molecules/${slug}.jpg`,
});
export const moleculeImageSize = { page: { width: 1200, height: 800 }, social: { width: 1200, height: 630 } } as const;

type Vec3 = [number, number, number];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const normalize = (a: Vec3): Vec3 => scale(a, 1 / Math.hypot(...a));

// The geometry, colors, atom sizes and camera below mirror components/subjects/chemistry/MolecularScene.tsx
// (directionsFor, loneDirectionsFor, colors, atom radii, default camera) so the picture matches the
// model a visitor can rotate. Keep the two in sync when either changes.
function bondDirections(count: number, lone: number, angleDeg: number): Vec3[] {
  const domains = count + lone;
  const rad = angleDeg * Math.PI / 180;
  if (domains <= 2) return ([[-1, 0, 0], [1, 0, 0]] as Vec3[]).slice(0, count);
  if (domains === 3) {
    if (lone === 0) return [0, 1, 2].map((i): Vec3 => [Math.cos(i * 2 * Math.PI / 3), Math.sin(i * 2 * Math.PI / 3), 0]);
    return [-1, 1].map((sign): Vec3 => [sign * Math.sin(rad / 2), -Math.cos(rad / 2), 0]);
  }
  if (domains === 4) {
    if (lone === 0) return ([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]] as Vec3[]).map(normalize);
    if (lone === 1) {
      const vertical = Math.sqrt(Math.max(0, (Math.cos(rad) + .5) / 1.5));
      const radius = Math.sqrt(Math.max(0, 1 - vertical ** 2));
      return [0, 1, 2].map((i): Vec3 => [radius * Math.cos(i * 2 * Math.PI / 3), -vertical, radius * Math.sin(i * 2 * Math.PI / 3)]);
    }
    return [-1, 1].map((sign): Vec3 => [sign * Math.sin(rad / 2), -Math.cos(rad / 2), 0]);
  }
  if (domains === 5) {
    const equatorial = [0, 1, 2].map((i): Vec3 => [Math.cos(i * 2 * Math.PI / 3), 0, Math.sin(i * 2 * Math.PI / 3)]);
    return [...equatorial, [0, 1, 0], [0, -1, 0] as Vec3].slice(lone, lone + count) as Vec3[];
  }
  return ([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]] as Vec3[]).slice(lone, lone + count);
}

function loneDirections(count: number, lone: number): Vec3[] | undefined {
  const domains = count + lone;
  if (domains === 5) return [...[0, 1, 2].map((i): Vec3 => [Math.cos(i * 2 * Math.PI / 3), 0, Math.sin(i * 2 * Math.PI / 3)]), [0, 1, 0] as Vec3, [0, -1, 0] as Vec3].slice(0, lone);
  if (domains === 6) return ([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]] as Vec3[]).slice(0, lone);
  return undefined;
}

const elementColors: Record<string, string> = {
  H: "#e9f2fa", O: "#f05d70", C: "#65788e", N: "#6388ff", F: "#8cdb95", B: "#f2bd82",
  Al: "#c9c2d6", Si: "#e0c98f", P: "#ffab5e", S: "#f5db6b", Cl: "#5fd97a", Ga: "#d9a8a8", Ge: "#9fc2c2",
  As: "#c9a0e0", Se: "#ffb870", Br: "#b5544f", Sn: "#8fa3a3", Sb: "#b98fd1", Te: "#d9b25e", I: "#a15fc2", Xe: "#6bc4d1",
  Be: "#9fd67f", Mg: "#7fbf7f", Ti: "#c7ccd6", Zn: "#9a9fd6", Cd: "#f0d9a1", Hg: "#c7c7dc", Pb: "#7a7d87",
  Mo: "#7fc2c2", W: "#5fa3c9", U: "#6f9fd1", Nb: "#8fd1c9", Mn: "#b583a8", Cr: "#6f93d1",
};

// Three-quarter view from the lab's default camera, so out-of-plane bonds stay visible.
const eye: Vec3 = [3.1, 2.2, 9.4];
const eyeDistance = Math.hypot(...eye);
const zAxis = normalize(eye);
const xAxis = normalize(cross([0, 1, 0], zAxis));
const yAxis = cross(zAxis, xAxis);
function project(p: Vec3) {
  const depth = dot(p, zAxis), perspective = eyeDistance / (eyeDistance - depth);
  return { x: dot(p, xAxis) * perspective, y: -dot(p, yAxis) * perspective, depth, perspective };
}

const escapeXml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const subscripts = "₀₁₂₃₄₅₆₇₈₉", superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";

// Draws subscript digits and superscript charges with real offsets instead of Unicode
// sub/superscript glyphs, which many fonts (and the build-time rasterizer) lack.
function chemicalText(text: string, size: number) {
  const shift = { base: 0, sub: size * .28, sup: -size * .42 };
  let current: keyof typeof shift = "base", out = "";
  for (const char of text) {
    const sub = subscripts.indexOf(char), sup = superscripts.indexOf(char);
    const kind: keyof typeof shift = sub >= 0 ? "sub" : sup >= 0 || char === "⁺" || char === "⁻" ? "sup" : "base";
    const glyph = sub >= 0 ? String(sub) : sup >= 0 ? String(sup) : char === "⁺" ? "+" : char === "⁻" ? "−" : char;
    const dy = shift[kind] - shift[current];
    out += `<tspan${dy ? ` dy="${dy.toFixed(1)}"` : ""}${kind === "base" ? "" : ` font-size="${(size * .66).toFixed(1)}"`}>${escapeXml(glyph)}</tspan>`;
    current = kind;
  }
  // Return to the baseline (a zero-width space carries the offset) so text after this run is not shifted.
  return current === "base" ? out : `${out}<tspan dy="${(-shift[current]).toFixed(1)}">\u200b</tspan>`;
}

function mix(hex: string, target: number, amount: number) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${channels.map((c) => Math.round(c + (target - c) * amount).toString(16).padStart(2, "0")).join("")}`;
}

type Shape =
  | { kind: "atom"; depth: number; x: number; y: number; r: number; element: string; center?: boolean }
  | { kind: "bond"; depth: number; x1: number; y1: number; x2: number; y2: number; r1: number; r2: number; width: number; order: number }
  | { kind: "lone"; depth: number; x: number; y: number; rx: number; ry: number; angle: number; dot: number };

function moleculeShapes(m: MoleculeReference): Shape[] {
  const data = molecules[m.index];
  const shapes: Shape[] = [];
  const center = project([0, 0, 0]);
  shapes.push({ kind: "atom", depth: 0, x: center.x, y: center.y, r: .56, element: m.center, center: true });
  for (const direction of bondDirections(m.bondingPairs, m.lonePairs, m.angleValue)) {
    const end = project(scale(direction, 2));
    const middle = project(scale(direction, 1));
    const outerRadius = (m.outer === "H" ? .34 : .48) * end.perspective;
    shapes.push({ kind: "bond", depth: middle.depth - .01, x1: center.x, y1: center.y, x2: end.x, y2: end.y, r1: .56, r2: outerRadius, width: .13 * middle.perspective, order: data.order });
    shapes.push({ kind: "atom", depth: end.depth, x: end.x, y: end.y, r: outerRadius, element: m.outer });
  }
  const lone = loneDirections(m.bondingPairs, m.lonePairs);
  for (let i = 0; i < m.lonePairs; i++) {
    // Small centers keep their lone pairs on top, as in the lab.
    const direction: Vec3 = lone?.[i] ?? [0, 1, 0];
    const position: Vec3 = lone?.[i] ? scale(direction, 1.15) : [(i - (m.lonePairs - 1) / 2) * 1.2, 1.1, -.3];
    const p = project(position);
    const along = Math.hypot(dot(direction, xAxis), dot(direction, yAxis));
    shapes.push({
      kind: "lone", depth: p.depth, x: p.x, y: p.y,
      rx: .45 * p.perspective, ry: .8 * p.perspective * Math.max(.45, along),
      angle: along < .05 ? 0 : Math.atan2(-dot(direction, yAxis), dot(direction, xAxis)) * 180 / Math.PI + 90,
      dot: .07 * p.perspective,
    });
  }
  return shapes.sort((a, b) => a.depth - b.depth);
}

const pairs = (n: number) => n === 0 ? "No lone pairs" : n === 1 ? "1 lone pair" : `${n} lone pairs`;

export function moleculeImageAlt(m: MoleculeReference) {
  const lower = m.name[0].toLowerCase() + m.name.slice(1);
  return `Ball-and-stick model of ${plainFormula(m)} (${lower}): ${m.shape.toLowerCase()} molecular geometry, with ${m.bondingPairs} ${m.outer} atom${m.bondingPairs === 1 ? "" : "s"} around the central ${m.center} atom and ${pairs(m.lonePairs).toLowerCase()}`;
}

export function moleculeImageSvg(m: MoleculeReference, size: { width: number; height: number } = moleculeImageSize.page) {
  const { width, height } = size;
  const shapes = moleculeShapes(m);
  // Fit the projected model into the drawing area below the heading and above the facts line.
  const box = { left: 60, top: 182, right: width - 60, bottom: height - 104 };
  const bounds = shapes.reduce((acc, s) => {
    const reach = s.kind === "atom" ? s.r : s.kind === "lone" ? Math.max(s.rx, s.ry) : s.width;
    const xs = s.kind === "bond" ? [s.x1, s.x2] : [s.x], ys = s.kind === "bond" ? [s.y1, s.y2] : [s.y];
    return {
      minX: Math.min(acc.minX, ...xs.map((x) => x - reach)), maxX: Math.max(acc.maxX, ...xs.map((x) => x + reach)),
      minY: Math.min(acc.minY, ...ys.map((y) => y - reach)), maxY: Math.max(acc.maxY, ...ys.map((y) => y + reach)),
    };
  }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  const unit = Math.min((box.right - box.left) / (bounds.maxX - bounds.minX), (box.bottom - box.top) / (bounds.maxY - bounds.minY), 150);
  const offsetX = (box.left + box.right) / 2 - unit * (bounds.minX + bounds.maxX) / 2;
  const offsetY = (box.top + box.bottom) / 2 - unit * (bounds.minY + bounds.maxY) / 2;
  const X = (x: number) => (offsetX + x * unit).toFixed(1), Y = (y: number) => (offsetY + y * unit).toFixed(1), L = (v: number) => (v * unit).toFixed(1);

  const elements = [...new Set([m.center, m.outer])];
  const gradients = elements.map((element) => {
    const base = elementColors[element] ?? elementColors.H;
    return `<radialGradient id="atom-${element}" cx="36%" cy="30%" r="74%"><stop offset="0" stop-color="${mix(base, 255, .55)}"/><stop offset=".5" stop-color="${base}"/><stop offset="1" stop-color="${mix(base, 0, .5)}"/></radialGradient>`;
  }).join("");

  // An outer atom mostly behind a nearer atom shows only a sliver, so it gets no symbol (the central
  // atom always keeps its symbol).
  const hidden = (s: Extract<Shape, { kind: "atom" }>, index: number) => !s.center && shapes.slice(index + 1)
    .some((other) => other.kind === "atom" && Math.hypot(other.x - s.x, other.y - s.y) < other.r + s.r * .35);
  const body = shapes.map((s, index) => {
    if (s.kind === "bond") {
      // Draw the stick only between the two atom outlines: inside a sphere it would be hidden in 3D.
      const length = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
      if (length <= (s.r1 + s.r2) * .92) return "";
      const ux = (s.x2 - s.x1) / length, uy = (s.y2 - s.y1) / length, nx = -uy, ny = ux;
      const start = s.r1 * .92, end = length - s.r2 * .92;
      return Array.from({ length: s.order }, (_, j) => {
        const offset = (j - (s.order - 1) / 2) * .2;
        const [x1, y1, x2, y2] = [s.x1 + ux * start + nx * offset, s.y1 + uy * start + ny * offset, s.x1 + ux * end + nx * offset, s.y1 + uy * end + ny * offset];
        return `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#3d5068" stroke-width="${L(s.width + .05)}"/>`
          + `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#b7c9da" stroke-width="${L(s.width)}"/>`;
      }).join("");
    }
    if (s.kind === "lone") {
      const across = (s.angle * Math.PI) / 180;
      const [dx, dy] = [Math.cos(across) * .12, Math.sin(across) * .12];
      return `<g><ellipse cx="${X(s.x)}" cy="${Y(s.y)}" rx="${L(s.rx)}" ry="${L(s.ry)}" transform="rotate(${s.angle.toFixed(1)} ${X(s.x)} ${Y(s.y)})" fill="#d2acff" fill-opacity=".26" stroke="#d2acff" stroke-opacity=".55" stroke-width="2"/>`
        + `<circle cx="${X(s.x - dx)}" cy="${Y(s.y - dy)}" r="${L(s.dot)}" fill="#e2c4ff"/><circle cx="${X(s.x + dx)}" cy="${Y(s.y + dy)}" r="${L(s.dot)}" fill="#e2c4ff"/></g>`;
    }
    const label = s.element.length > 1 ? .74 : .9;
    const circle = `<circle cx="${X(s.x)}" cy="${Y(s.y)}" r="${L(s.r)}" fill="url(#atom-${s.element})" stroke="#0b1224" stroke-opacity=".45" stroke-width="2"/>`;
    if (hidden(s, index)) return circle;
    return circle + `<text x="${X(s.x)}" y="${Y(s.y)}" dy="${L(s.r * label * .36)}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${L(s.r * label)}" font-weight="700" fill="#ffffff" stroke="#0a101c" stroke-opacity=".7" stroke-width="${L(s.r * .06)}" paint-order="stroke">${escapeXml(s.element)}</text>`;
  }).join("");

  const angle = angleShort(m);
  const facts = [m.shape, `Bond angle${angle.includes("&") ? "s" : ""} ${angle}`, m.axe, pairs(m.lonePairs)];
  const factsText = facts.map((fact, i) => `${i ? `<tspan fill="#6f83ad">   ·   </tspan>` : ""}${i === 2 ? chemicalText(fact, 30) : escapeXml(fact)}`).join("");
  const title = `${plainFormula(m)} (${m.name}) molecular geometry: ${m.shape.toLowerCase()}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t">`
    + `<title id="t">${escapeXml(title)}</title>`
    + `<defs>${gradients}<radialGradient id="glow" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#22336a"/><stop offset="1" stop-color="#0e1730"/></radialGradient></defs>`
    + `<rect width="${width}" height="${height}" fill="url(#glow)"/>`
    + `<g font-family="Arial, Helvetica, sans-serif">`
    + `<text x="56" y="62" font-size="20" font-weight="700" letter-spacing="3" fill="#8fb4ff">MOLECULAR GEOMETRY</text>`
    + `<text x="${width - 56}" y="62" text-anchor="end" font-size="24" font-weight="700" fill="#8fb4ff">LearnerKits</text>`
    + `<text x="56" y="122" font-size="58" font-weight="700" fill="#ffffff">${chemicalText(m.formula, 58)}</text>`
    + `<text x="56" y="162" font-size="28" fill="#c3cfea">${escapeXml(m.name)}</text>`
    + `</g>`
    + body
    + `<text x="56" y="${height - 46}" xml:space="preserve" style="white-space:pre" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#e8eefc">${factsText}</text>`
    + `</svg>`;
}
