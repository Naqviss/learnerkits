import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Source artwork and prompts live in output/article-images.
// Separate filenames keep these covers independent of the diagram build script.
const root = fileURLToPath(new URL('../', import.meta.url));
for (const name of ['physics-through-experiment', 'four-tools-science-study']) {
  const source = path.join(root, 'output/article-images', `${name}.png`);
  for (const [suffix, width, height] of [['', 1200, 800], ['-640', 640, 427], ['-social', 1200, 630]]) {
    const destination = path.join(root, 'public/images/articles', `${name}${suffix}.webp`);
    const result = await sharp(source)
      .resize(width, height, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82, effort: 6 })
      .toFile(destination);
    console.log(`${name}${suffix}.webp: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
}
