import * as THREE from "three";
import { seeded } from "./volcanoModel";

function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = seeded(ix + iy * 113), b = seeded(ix + 1 + iy * 113);
  const c = seeded(ix + (iy + 1) * 113), d = seeded(ix + 1 + (iy + 1) * 113);
  return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
}

/** Small procedural textures, generated once. No remote assets or per-frame canvas work. */
export function effectTexture(kind: "smoke" | "glow" | "rock") {
  const size = kind === "rock" ? 256 : 128;
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  const pixels = context.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size, r = Math.hypot(u * 2 - 1, v * 2 - 1);
    const n = noise(u * 7, v * 7) * .6 + noise(u * 17, v * 17) * .27 + noise(u * 43, v * 43) * .13;
    const i = (y * size + x) * 4;
    if (kind === "rock") {
      const shade = 115 + n * 110 + (seeded(i) - .5) * 28;
      pixels.data.set([shade, shade, shade, 255], i);
    } else if (kind === "smoke") {
      const shade = 145 + n * 105;
      const edge = Math.max(0, Math.min(1, (1 - r + (n - .5) * .25) * 2));
      pixels.data.set([shade, shade, shade, Math.min(255, edge ** 1.7 * (.4 + n * .6) * 255)], i);
    } else {
      pixels.data.set([255, 255, 255, Math.max(0, 1 - r) ** 2.5 * 255], i);
    }
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (kind === "rock") { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(17, 17); }
  return texture;
}
