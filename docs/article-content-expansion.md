# Practical article expansion

All eleven articles were expanded on 2026-09-26, preserving their original publication dates. The visible table of contents, reading times, word counts, source citations, and article schema are derived from the bodies.

## New teaching situations

- Student AI study: applying a familiar shopping-trolley analogy and explaining the idea to an absent classmate.
- Tutors and simulations: separating conceptual questions from controlled gas comparisons; roles for two learners sharing a device.
- Checking answers: separating lunar phases from eclipses and distinguishing a source's limited claim from an overgeneralization.
- Lesson planning: one-projector teaching, mixed-confidence participation, and targeted responses to hypothetical misconceptions.
- Practice questions: repairing incomplete everyday problems and using different reasoning errors to choose follow-up practice.
- Interactive simulations: investigating complementary projectile angles after a game-like task; discussion with a parent or study partner.
- Virtual labs: reconciling classmates' different outputs by comparing settings, units, and rounding.
- Lab comparison: planning a virtual pre-lab and an honest alternative for an absent student.
- Self-study: a short revision session and independent predictions before paired work.
- Visual learning: distinguishing a velocity-time graph from a picture of a trajectory.
- Digital notebooks: repairing an incomplete screenshot and reviewing entries for reproducibility.

These are illustrative scenarios and suggested activities, not reports of actual students, classroom trials, or measured learning outcomes.

## Further reading

New external reading was checked for relevance before linking:

- [NASA Moon phases](https://science.nasa.gov/moon/moon-phases/): lunar illumination and viewing geometry.
- [PhET facilitation](https://phet.colorado.edu/en/teaching-resources/teaching-with-phet/facilitation): teacher questioning and discussion resources.
- [PhET science activity design](https://phet.colorado.edu/en/teaching-resources/virtual-workshop/science-activity-design): planning investigations around a particular simulation.
- [The Learning Scientists: six strategies](https://www.learningscientists.org/blog/2016/8/18-1): links to study-strategy explanations.
- [The Learning Scientists: classroom guest post](https://www.learningscientists.org/blog/2017/3/21-1): a practitioner's experience, explicitly distinguished from research evidence.
- [The Learning Scientists: when strategies work best](https://www.learningscientists.org/blog/2017/4/20-1): ideas for combining review activities.

Existing OpenStax, UNESCO, IES, and research references remain beside the claims they support. External resources are linked, not copied wholesale; no external illustrations were reused.

## Original explanatory figures

Four original diagrams accompany five of the articles. They were drawn as SVG and encoded as WebP, rather than generated as photographic illustrations. Editable SVG sources are in `output/article-figures/`; responsive 1200 × 900 and 640 × 480 WebP files are in `public/images/articles/figures/`. The existing eleven hero illustrations remain.

Register figures in `lib/articles/figures.ts`, then insert `:::figure figure-id` on its own paragraph in a body. Figure values are also explained in the surrounding prose and alt text. The article renderer provides captions and a full-size link; registered figures are included in Article ImageObject data and the image sitemap automatically.

Checked values: 20 N / 10 kg = 2 m/s²; 20 N / 20 kg = 1 m/s²; 1 × 8.314 × 300 / 20 = 124.71 kPa; at 10 L, 249.42 kPa; (20 − 5) N / 5 kg = 3 m/s², reaching 6 m/s after 2 s from rest. The complementary-angle activity uses the existing level-ground, no-drag projectile model.
