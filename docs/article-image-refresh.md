# Latest article image refresh — 2026-09-29

The five articles published on September 27 use explanatory diagrams. Keep the full diagrams visible: their labels and phase keys are meaningful content, so their article-card images use `object-fit: contain`, including the square mobile list layout. Earlier editorial illustrations retain their existing crop behavior.

Editable masters are in `output/article-images/`. Run `node scripts/build-article-images.mjs` to reproduce the branded SVGs and three WebP variants per article: 1200 × 800 for the article, 640 × 427 for smaller screens, and 1200 × 630 for social previews. Social images contain the complete composition rather than center-cropping it. The encoder adds LearnerKits branding and writes the descriptive filenames registered in `lib/articles/images.ts`. Previous image URLs remain available for existing links.

The circuit comparison now has a closed series loop, correct 100-ohm resistor bands, and amperes on the illustrative meter reading. The Moon diagram numbers the orbital positions and labels all eight matching phases. Physics labels net force and the assumptions behind the projectile comparison. Climate trends are identified as schematic rather than measured data.

Article metadata uses concise search titles, descriptive alt text, matching Open Graph/Twitter images, and ImageObject data with dimensions, creator, credit, and thumbnail URL. Existing canonical URLs and image-sitemap integration are preserved. Publication dates remain September 27; updated dates are September 29 in the page, Article schema, Open Graph, and sitemap.

Validation: `npm test -- tests/articles.test.tsx` checks article metadata, image files and decoded dimensions, and sitemap discovery. Visually inspect desktop cards, mobile lists, article figures, and social variants after changing diagram layouts. SVG subscripts should use `tspan` with a baseline shift rather than uncommon Unicode characters that may not exist in the encoder's font.
