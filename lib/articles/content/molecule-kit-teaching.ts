export const moleculeKitTeaching = `
A 3D molecule kit helps teachers teach molecules by turning valence, bonding, and molecular shape into things students can build, rotate, and test. Instead of memorizing that water is “bent,” students attach two hydrogen atoms to oxygen, count the lone pairs, and see why the molecule cannot be straight. The teacher’s role shifts from describing shapes to asking for predictions and evidence.

This guide shows how to use the free [Molecule Kit](/en/molecule-kit) in a chemistry classroom: what each lab is for, a ready-to-run 45-minute lesson, the misconceptions it exposes, exit questions with answers, and the limits students should know about any digital model.

## Why molecules are hard to teach from a flat page

Molecules are three-dimensional, but most of the representations students meet are flat. A Lewis structure shows which atoms are connected and where the electron pairs are, yet it deliberately ignores shape. Students who learn water as “H–O–H” on paper often assume it is linear, and many never connect the two lone pairs they drew to the 104.5° angle their textbook states.

Textbook perspective drawings help, but wedges and dashes are themselves a code that some students cannot read. Physical ball-and-stick kits solve the problem well, yet they are often limited to a few class sets, pieces go missing, and there is no quick way to measure an angle or switch to a space-filling view.

The underlying difficulty is that molecular structure links three ideas students tend to learn separately:

- Valence: how many bonds an atom usually forms.
- Bonding: whether pairs are shared as single, double, or triple bonds.
- Shape: how bonding pairs and lone pairs arrange in three dimensions.

A good molecule kit lets students move through all three with one structure in front of them. [OpenStax Chemistry 2e](https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity) presents VSEPR theory in the same order: draw the Lewis structure, count electron groups, then predict geometry.

## What the Molecule Kit includes

The Molecule Kit combines two free browser labs designed for grades 8–12. Neither requires student accounts, which removes a common barrier to using technology in a single lesson.

### Molecule Builder 3D

The [Molecule Builder 3D](/en/simulations/molecule-builder-3d) is a freeform editor. Students choose elements from a palette or the full periodic table, attach atoms, and connect them with single, double, or triple bonds. An inspector shows formal charge, and structure notes flag atoms that do not match a common neutral valence. The atom list displays each atom’s sum of bond orders, which makes “carbon forms four bonds” something students can check rather than recite.

Teachers will find several practical tools: a molecule library for quick starting points, a Measure tool for distances and angles, ball-and-stick, stick, and space-filling views, and export options (JSON, MOL, or XYZ) for saving work or collecting it as evidence.

### Molecular Geometry 3D Explorer

The [Molecular Geometry 3D Explorer](/en/simulations/molecular-geometry-3d) focuses on VSEPR. Students select a molecule, display its lone pairs and bond angles, and rotate it to compare electron-domain geometry with molecular shape. The kit also links to a [VSEPR shapes chart](/en/molecules) with reference pages for more than 100 molecules and ions, such as [water](/en/molecules/water-h2o) and [ammonia](/en/molecules/ammonia-nh3).

## Lesson idea 1: build before you name

Start with construction rather than vocabulary. Ask pairs to build water, methane, and carbon dioxide in the Molecule Builder without looking up the structures. Give them one constraint: every atom should end up with its usual number of bonds. Hydrogen forms one, oxygen two, nitrogen three, and carbon four.

Carbon dioxide is where the useful discussion begins. Many students first connect carbon to two oxygen atoms with single bonds, then see that carbon has a bond-order sum of only two. They must decide how to fix it. When they upgrade both bonds to double bonds, the atom list confirms that carbon now reaches four and each oxygen reaches two.

Ask the question the lab is built around: “Can carbon complete its usual valence using only two oxygen atoms?” A strong answer distinguishes the number of attached atoms (two) from the sum of bond orders (four). That distinction becomes essential in the next lesson, because a double bond counts as two toward valence but as only one electron domain in VSEPR.

[OpenStax’s section on Lewis structures](https://openstax.org/books/chemistry-2e/pages/7-3-lewis-symbols-and-structures) provides a useful follow-up reading after students have built the structures themselves.

## Lesson idea 2: four electron domains, three shapes

The most powerful comparison in introductory molecular geometry is methane, ammonia, and water. Each central atom has four electron domains, so each has a tetrahedral electron-domain geometry. Their molecular shapes differ because of lone pairs:

- Methane (CH₄): four bonding pairs, no lone pairs, tetrahedral, about 109.5°.
- Ammonia (NH₃): three bonding pairs, one lone pair, trigonal pyramidal, about 107°.
- Water (H₂O): two bonding pairs, two lone pairs, bent, about 104.5°.

Have students predict each shape on paper first. Then open the Geometry Explorer, display lone pairs, and rotate each molecule until the pattern is clear. Students can also load water in the Molecule Builder and use the Measure tool on three atoms to read the H–O–H angle from the model’s illustrative coordinates.

The question to pose is: “Why are methane, ammonia, and water different shapes even though each has four electron domains?” Look for the explanation that lone pairs occupy space and repel bonding pairs more strongly, which narrows the bond angle. Students should also say that molecular shape describes only atom positions, so lone pairs are “invisible” in the shape name even though they determine it.

Extend the lesson with molecules beyond four domains, such as [boron trifluoride](/en/molecules/boron-trifluoride-bf3) (trigonal planar, 120°) and [sulfur hexafluoride](/en/molecules/sulfur-hexafluoride-sf6) (octahedral, 90°).

## A 45-minute Molecule Kit lesson plan

This sequence works with pairs sharing one device or a single projected screen.

- Do now (5 minutes): Students draw Lewis structures for H₂O and CO₂ and predict whether each molecule is straight or bent.
- Build (12 minutes): Pairs build H₂O, CH₄, and CO₂ in the Molecule Builder and record each atom’s bond-order sum.
- Discuss (5 minutes): Compare CO₂ structures across groups. Agree on why carbon needs two double bonds.
- Predict and test (13 minutes): Students predict shapes for CH₄, NH₃, and H₂O, then check them in the Geometry Explorer and record bond angles in a table.
- Explain (5 minutes): Each pair writes one sentence linking lone pairs to bond angle.
- Exit check (5 minutes): Students answer two questions from the section below without using the lab.

For a class with one projector, run the build phase as a whole-class activity in which students vote on the next atom or bond. The prediction step matters most: a student who commits to an answer before rotating the model has something to confirm or revise.

## Misconceptions the kit makes visible

Molecule models help most when they expose ideas that a worksheet would hide. Watch for these:

- “Water is linear because the Lewis structure is drawn in a line.” Lewis structures show connectivity, not shape. Rotating the 3D model makes the bend unavoidable.
- “A double bond counts as two electron domains.” In VSEPR, a double or triple bond counts as one domain. CO₂ has two domains and is linear.
- “Lone pairs don’t matter because they aren’t atoms.” Lone pairs change both the bond angle and the shape name.
- “The model shows what a molecule really looks like.” Atoms are not hard spheres, and bonds are not sticks. Switch between ball-and-stick and space-filling views to show that every representation emphasizes some features and hides others.
- “If the valence checks pass, the molecule must exist.” A valence match does not prove a structure is stable.

Ask students to state a misconception in their own words and then use evidence from the model to correct it. That is more durable than hearing the correct statement from the teacher.

## Exit questions with answers

Use these after the lesson, or as a starter the following day.

:::answer Why is carbon dioxide linear while water is bent?
Carbon in CO₂ has two electron domains (two double bonds) and no lone pairs, so the domains point in opposite directions at 180°. Oxygen in water has four domains, two of which are lone pairs, so the two hydrogen atoms form a bent shape of about 104.5°.
:::

:::answer Ammonia and methane both have four electron domains. Why is the H–N–H angle smaller than the H–C–H angle?
Nitrogen in ammonia has one lone pair. A lone pair repels bonding pairs more strongly than a bonding pair does, pushing the N–H bonds closer together to about 107°, compared with 109.5° in methane.
:::

:::answer How many bonds does carbon have in CO₂, and how many electron domains?
Carbon has a bond-order sum of four (two double bonds) but only two electron domains, because each double bond counts as one domain in VSEPR.
:::

## Limits to tell your students

Being explicit about a model’s limits is part of teaching with it. The Molecule Builder is a structure editor, not a quantum chemistry program. Its coordinates and atom sizes are illustrative and are not energy-minimized, so measured angles may not match experimental values exactly. Valence guidance covers common neutral covalent atoms; charges and other elements are not validated, and the editor does not predict stability or simulate reactions.

Ionic compounds also need care. Sodium chloride forms an extended lattice rather than discrete molecules, which the [Chemical Bonding Challenge](/en/simulations/chemical-bonding) addresses more directly.

None of this undermines the kit. It gives students an authentic scientific habit: ask what a model shows, what it leaves out, and how its predictions compare with data.

## Getting started

You can use the Molecule Kit tomorrow without setup. Open the [Molecule Builder 3D](/en/simulations/molecule-builder-3d) on the projector, load water from the library, and ask the class whether it is straight or bent before you rotate it. That one question, followed by evidence from the model, is the core of the approach.

For a broader view of planning model-based lessons, see [how teachers can use AI to prepare science lessons](/en/articles/how-teachers-use-ai-to-prepare-science-lessons) and [why visual learning helps explain abstract science](/en/articles/why-visual-learning-helps-science).
`;
