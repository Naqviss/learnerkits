import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const images = [
  ['virtual-and-real-circuit-labs', 'virtual-vs-real-science-labs', '#eef2ff'],
  ['four-learning-tools', 'choosing-science-study-tools', '#f5f4fd'],
  ['physics-reasoning-notebook', 'physics-concepts-and-experiments', '#f7f4ec'],
  ['moon-phases-orbit-view', 'moon-phases-sunlight-and-orbit', '#101a38'],
  ['climate-energy-balance', 'climate-change-earth-energy-balance', '#f5f7ff'],
];
const destination = path.join(root, 'public/images/articles');
await mkdir(destination, { recursive: true });
for (const [source, filename, background] of images) {
  const svg = await readFile(path.join(root, 'output/article-images', `${source}.svg`), 'utf8');
  const art = svg.replace(/^.*?<svg[^>]*>/s, '').replace(/<\/svg>\s*$/, '');
  const dark = background === '#101a38';
  const branded = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="${background}"/>
    <g transform="translate(36 10) scale(.94)">${art}</g>
    <g font-family="Arial, Helvetica, sans-serif">
      <path d="M36 766 H1164" stroke="${dark ? '#344363' : '#d6deef'}"/>
      <text x="38" y="791" font-size="16" fill="${dark ? '#a8badc' : '#536483'}">Predict. Experiment. Explain.</text>
      <text x="1162" y="791" text-anchor="end" font-size="21" font-weight="700" fill="${dark ? '#e4ebff' : '#263b78'}">LearnerKits</text>
    </g>
  </svg>`);
  await writeFile(path.join(root, 'output/article-images', `${filename}-branded.svg`), branded);
  for (const [suffix, width, height] of [['', 1200, 800], ['-640', 640, 427], ['-social', 1200, 630]]) {
    const file = path.join(destination, `${filename}${suffix}.webp`);
    // Contain preserves labels and diagrams; social previews must never crop the artwork.
    const result = await sharp(branded, { density: 144 }).resize(width, height, { fit: 'contain', background }).webp({ quality: 86, effort: 6 }).toFile(file);
    console.log(`${filename}${suffix}.webp: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
}
