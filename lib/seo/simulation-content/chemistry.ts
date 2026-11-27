import type { SimulationContent } from "./types";

export const chemistryContent: Record<string, SimulationContent> = {
  "gas-law-lab": {
    question: "How does the ideal gas law PV = nRT connect pressure, volume and temperature?",
    answer: "The ideal gas law, PV = nRT, says that pressure times volume equals the amount of gas times the gas constant times the absolute temperature. Halve the volume of a sealed gas at constant temperature and its pressure doubles; double its kelvin temperature at constant volume and the pressure doubles too. For example, 1 mol of gas at 300 K in a 25 L container exerts about 99.8 kPa, close to normal air pressure.",
    science: [
      "Gas pressure is the combined push of countless particle collisions with the container walls. Squeezing the gas into a smaller volume means each patch of wall is hit more often, so pressure rises. Heating the gas raises the particles’ average kinetic energy, so they strike harder as well as more often. Adding more gas at the same volume simply adds more collisions.",
      "Temperature must be in kelvin because pressure and volume are proportional to absolute temperature, which starts at absolute zero (0 K = −273.15 °C). With R = 8.314 kPa·L·mol⁻¹·K⁻¹, one mole of an ideal gas at 273 K and 101.3 kPa fills about 22.4 L. For a fixed amount of gas the law becomes P₁V₁/T₁ = P₂V₂/T₂, which combines Boyle’s law, Charles’s law and the pressure–temperature law.",
      "Car tire pressure rises after a long drive because the air inside warms at nearly constant volume. Ten meters under the sea the pressure is about twice that at the surface, so a sealed balloon carried down there shrinks to roughly half its volume. Real gases depart from PV = nRT at high pressure or close to condensation, where particle size and attractions start to matter.",
    ],
    formula: { expression: "PV = nRT", meaning: "P is pressure (kPa), V is volume (L), n is the amount of gas (mol), T is absolute temperature (K) and R is the gas constant, 8.314 kPa·L·mol⁻¹·K⁻¹." },
    steps: [
      "Leave Gas amount at 1 mol and Temperature at 300 K, and set Chamber volume to 25 L. Record Pressure, about 99.8 kPa.",
      "Predict the pressure if the volume is halved, then set Chamber volume to 12.5 L. Compare Pressure with your prediction and with the 25 L reading.",
      "Return to 25 L and raise Temperature from 300 K to 600 K. Check whether doubling the kelvin temperature doubles Pressure, and watch the particles speed up.",
      "Open the Boyle’s law, Charles’s law and Pressure–temperature law tabs under Explore the gas laws. Find your chamber’s marker on each graph and describe each curve’s shape.",
      "At 300 K and 25 L, change Gas amount from 1 to 2 mol. Predict the new Pressure first, then compare it with your halved-volume result.",
    ],
    misconception: {
      myth: "Heating a gas from 20 °C to 40 °C doubles its pressure.",
      fact: "Pressure is proportional to kelvin temperature, not Celsius. Going from 20 °C to 40 °C means 293 K to 313 K, which raises the pressure in a sealed, rigid container by only about 7%.",
    },
    modelNote: "Treats the gas as ideal, with R = 8.314 kPa·L·mol⁻¹·K⁻¹: particles have no size and no attractions, so the gas never condenses or deviates at high pressure. The piston, chamber and particle count are illustrative (about 28 drawn particles per mole), and temperature changes take effect instantly.",
    faq: [
      { q: "Why do gas law calculations use kelvin instead of Celsius?", a: "Gas pressure and volume are proportional to absolute temperature, which is zero at absolute zero, −273.15 °C. The Celsius scale has an arbitrary zero at the freezing point of water, so using it would wrongly predict that a gas at 0 °C has zero volume. Add 273 to a Celsius reading before using PV = nRT or the combined gas law." },
      { q: "What is the difference between Boyle’s law and Charles’s law?", a: "Boyle’s law describes a gas at constant temperature: pressure and volume are inversely proportional, so P × V stays constant. Charles’s law describes a gas at constant pressure: volume is directly proportional to kelvin temperature, so V ÷ T stays constant. Both are special cases of PV = nRT with the amount of gas held fixed." },
      { q: "What is the value of R in the ideal gas law?", a: "R is 8.314 J·mol⁻¹·K⁻¹, which equals 8.314 kPa·L·mol⁻¹·K⁻¹ because one kilopascal-liter is one joule. If pressure is measured in atmospheres and volume in liters, use 0.08206 L·atm·mol⁻¹·K⁻¹ instead. Always choose the value whose units match your pressure and volume." },
      { q: "When does the ideal gas law stop being accurate?", a: "PV = nRT works best for gases at low pressure and well above their boiling points. At high pressure the particles’ own volume becomes a significant share of the container, and at low temperature intermolecular attractions pull particles together and lower the pressure. Near condensation these effects grow large, and corrected equations such as the van der Waals equation are needed." },
    ],
  },

  "reaction-rate-lab": {
    question: "What factors affect the rate of a chemical reaction?",
    answer: "The rate of a chemical reaction depends on temperature, concentration, surface area and the presence of a catalyst, because each changes how often particles collide or how many collisions carry enough energy to react. Particles must collide with at least the activation energy and the right orientation. Warming a reaction with an activation energy of 40 kJ/mol from 298 K to 308 K raises its rate constant about 1.7 times, while a catalyst speeds it up by offering a lower-energy pathway.",
    science: [
      "Collision theory explains rate in two parts: how often particles meet, and what fraction of those meetings succeed. Raising concentration or gas pressure crowds particles together, and grinding a solid exposes more of its surface, so collisions become more frequent. Raising temperature makes collisions slightly more frequent but, more importantly, gives a much larger fraction of particles energy above the activation barrier.",
      "The Arrhenius equation links the rate constant to temperature and activation energy. Because Eₐ sits in an exponent, small changes matter a lot: with Eₐ = 40 kJ/mol, k rises from 0.035 s⁻¹ at 298 K to about 0.059 s⁻¹ at 308 K. For a first-order reaction, [A] = [A]₀e⁻ᵏᵗ and the half-life is ln 2 ÷ k, which does not depend on the starting concentration.",
      "Refrigerators slow the reactions that spoil food, and flour or coal dust can explode because a fine powder exposes an enormous surface area. A car’s catalytic converter uses platinum, palladium and rhodium to speed up the conversion of carbon monoxide and nitrogen oxides into less harmful gases. Enzymes do the same job in living cells, often speeding reactions by many orders of magnitude.",
    ],
    formula: { expression: "k = A × e^(−Eₐ / RT)", meaning: "k is the rate constant, A is a frequency factor, Eₐ is the activation energy in J/mol, R is 8.314 J·mol⁻¹·K⁻¹ and T is the temperature in kelvin. A lower Eₐ or a higher T gives a larger k." },
    steps: [
      "Keep Reactor temperature at 298 K and Catalyst Absent. Press Start reaction and record Conversion after 20 s (about 50%), along with Rate constant and Half-life.",
      "Predict whether a 10 K rise doubles the rate. Set Reactor temperature to 308 K, run again, and compare Rate constant (about 0.059 s⁻¹) and Conversion with your first run.",
      "Return to 298 K and set Catalyst to Present. Compare Effective activation energy and the two energy-profile curves, then run and compare Conversion at 20 s.",
      "Change Initial A concentration from 1 to 2 mol/L. Predict which readouts will change, then check Current reaction rate, Rate constant and Half-life.",
      "Switch Reaction model to Surface-controlled and set Relative exposed area to 2×. Predict the new Half-life before reading it.",
    ],
    misconception: {
      myth: "Heating a reaction lowers its activation energy.",
      fact: "Temperature leaves the energy barrier unchanged; it raises the share of collisions with enough energy to cross it. Only a catalyst lowers the barrier, by providing a different pathway, which is why Effective activation energy changes with Catalyst but not with Reactor temperature.",
    },
    modelNote: "Models one irreversible first-order reaction, A → B, with Arrhenius kinetics calibrated so k = 0.035 s⁻¹ at 298 K and 40 kJ/mol. The catalyst lowers the barrier by 2.72 kJ/mol, tripling k at 298 K. Surface area is an illustrative multiplier, the energy profile is schematic and the moving particles are not a collision simulation.",
    faq: [
      { q: "How does a catalyst speed up a reaction?", a: "A catalyst provides an alternative reaction pathway with a lower activation energy, so a larger fraction of collisions have enough energy to react at the same temperature. It is not used up, and it speeds up the forward and reverse reactions equally, so it changes how quickly completion or equilibrium is reached but not how much product is finally possible." },
      { q: "Does a 10 °C rise always double the rate of a reaction?", a: "No. The doubling rule fits reactions with an activation energy of roughly 50 kJ/mol near room temperature. A reaction with a higher activation energy speeds up more than twofold for the same 10 °C rise, and one with a lower barrier speeds up less. At 40 kJ/mol, going from 298 K to 308 K multiplies the rate constant by about 1.7." },
      { q: "What is activation energy?", a: "Activation energy, Eₐ, is the minimum energy colliding particles need for old bonds to start breaking so a reaction can proceed. On an energy profile it is the height of the barrier between the reactants and the transition state. Reactions with a high Eₐ are slow at room temperature, even when the products are much lower in energy than the reactants." },
      { q: "Why does increasing surface area increase reaction rate?", a: "Only particles on the surface of a solid can collide with particles of the other reactant. Cutting a solid into smaller pieces or grinding it into powder exposes more surface particles, so more collisions happen each second. A 1 cm cube cut into 1 mm cubes has ten times the surface area, which is why powdered marble reacts with acid much faster than marble chips." },
    ],
  },

  "molecular-geometry-3d": {
    question: "How do you predict molecular geometry using VSEPR theory?",
    answer: "To predict molecular geometry with VSEPR theory, count the electron domains around the central atom: each bonded atom counts as one, whatever the bond order, and so does each lone pair. The domains spread as far apart as possible, giving the electron geometry, and the molecular shape is named from the atoms alone. Methane (four bonds) is tetrahedral at 109.5°, ammonia (three bonds, one lone pair) is trigonal pyramidal at about 107°, and water (two bonds, two lone pairs) is bent at about 104.5°.",
    science: [
      "VSEPR stands for valence shell electron pair repulsion. Electron domains around a central atom repel one another, so they spread out as far as possible. Two domains point in opposite directions (linear, 180°), three form a trigonal plane (120°), four a tetrahedron (109.5°), five a trigonal bipyramid (90° and 120°) and six an octahedron (90°). A single, double or triple bond each counts as one domain, which is why CO₂ is linear.",
      "Lone pairs are held closer to the central atom than bonding pairs, so they push harder. Repulsion falls in the order lone pair–lone pair, lone pair–bond pair, bond pair–bond pair, and each extra lone pair squeezes the bond angles further below 109.5°. With five domains, lone pairs take the roomier equatorial positions, giving the seesaw shape of SF₄, the T shape of ClF₃ and the linear XeF₂. With six, two lone pairs sit opposite each other, so XeF₄ is square planar.",
      "Shape decides whether bond dipoles cancel. Linear CO₂ and trigonal planar BF₃ are nonpolar even though their bonds are polar, while bent H₂O and pyramidal NH₃ are polar. Water’s polarity, together with the hydrogen bonds it allows, is why water dissolves salts and boils at 100 °C despite being such a small molecule. Shape also controls how molecules fit enzyme active sites and receptors, so it matters in drug design.",
    ],
    formula: { expression: "Steric number = bonded atoms + lone pairs on the central atom", meaning: "The steric number sets the electron geometry. NH₃ has 3 + 1 = 4, so its electron domains are arranged tetrahedrally, while its molecular shape, counting atoms only, is trigonal pyramidal." },
    steps: [
      "Type “methane” in the search box under Inspect molecule or solid and select it. Count four bonds and no purple lone pairs, then read Shape and Bond angle (109.5°).",
      "Predict how one lone pair changes the shape, then select ammonia (NH₃). Compare its Shape and Bond angle with methane’s and drag the model to view it from the side.",
      "Select water (H₂O) and press Hide lone pairs. Use the atoms that remain to explain why the shape is bent, then press Show lone pairs to see all four electron domains.",
      "With Bond angles on, compare the five-domain molecules PCl₅, SF₄, ClF₃ and XeF₂. Note where each lone pair sits and how the Shape readout changes as lone pairs are added.",
      "Pick a structure such as Sodium chloride or Diamond. The readouts switch to Structure and Type because an extended lattice has no single VSEPR shape.",
    ],
    misconception: {
      myth: "Water is linear because its two hydrogen atoms push each other to opposite sides.",
      fact: "Oxygen in water carries two lone pairs as well as two bonds, so it has four electron domains arranged roughly tetrahedrally. Describing only where the atoms are gives a bent shape with an H–O–H angle of about 104.5°.",
    },
    modelNote: "Covers 117 molecules and ions plus 14 crystal structures. Up to four domains, bonds are drawn at the listed approximate angle; five- and six-domain shapes use ideal 90° and 120° directions. Bond lengths are measured values where one is available, but atom sizes, lone-pair lobes and spacing are not to scale. Crystals are simplified fragments of extended lattices.",
    faq: [
      { q: "What is the difference between electron geometry and molecular geometry?", a: "Electron geometry describes how all the electron domains around the central atom are arranged, lone pairs included. Molecular geometry describes only where the atoms are. They match when there are no lone pairs, as in methane. Ammonia has a tetrahedral electron geometry but a trigonal pyramidal molecular shape, because one of its four domains is a lone pair." },
      { q: "What are the five basic electron geometries in VSEPR theory?", a: "The five parent geometries are linear (2 domains, 180°), trigonal planar (3 domains, 120°), tetrahedral (4 domains, 109.5°), trigonal bipyramidal (5 domains, 90° and 120°) and octahedral (6 domains, 90°). Every other shape, such as bent, seesaw or square planar, comes from one of these with some positions occupied by lone pairs instead of atoms." },
      { q: "Why is the bond angle in water smaller than in methane?", a: "Both molecules have four electron domains, but water’s oxygen has two lone pairs while methane’s carbon has none. Lone pairs repel more strongly than bonding pairs, so they push the two O–H bonds closer together, from the ideal tetrahedral 109.5° down to about 104.5°. Ammonia, with one lone pair, sits in between at about 107°." },
      { q: "Does a double bond count as one electron domain in VSEPR?", a: "Yes. A double or triple bond points in one direction between two atoms, so it counts as a single electron domain, just like a single bond. Carbon dioxide has two double bonds and no lone pairs on carbon, giving two domains and a linear shape at 180°. Multiple bonds do repel slightly more, which can widen the angles next to them a little." },
      { q: "Why does a Lewis structure not show a molecule’s real shape?", a: "A Lewis structure is a flat map of which atoms are bonded and where the lone pairs are, not a picture of the molecule in space. Methane drawn as a flat cross suggests 90° angles, but its hydrogens actually point to the corners of a tetrahedron at 109.5°. Rotating a 3D model reveals the angles that a flat drawing hides." },
    ],
  },

  "molecule-builder-3d": {
    question: "How many bonds does each atom form when you build a molecule?",
    answer: "In a neutral molecule, each atom usually forms enough covalent bonds to complete its outer shell: hydrogen forms 1, oxygen 2, nitrogen 3 and carbon 4. A double bond counts as two toward that total and a triple bond as three, so carbon in carbon dioxide forms two double bonds (O=C=O) and nitrogen gas holds its two atoms together with a triple bond. Checking these numbers is the first test that a molecular model is chemically reasonable.",
    science: [
      "A covalent bond is a pair of electrons shared between two atoms. Most main-group atoms keep sharing until they are surrounded by eight outer electrons, an octet, while hydrogen is complete with two. The usual number of bonds is therefore eight minus the number of outer electrons: 4 for carbon, 3 for nitrogen, 2 for oxygen and 1 for fluorine or chlorine. Bond order counts the shared pairs, from one in C–H to two in C=O and three in N≡N.",
      "Matching valences does not make a structure unique. Ethanol and dimethyl ether share the formula C₂H₆O, yet ethanol boils at 78 °C and dimethyl ether at −24 °C because their atoms are connected differently. Some atoms also break the octet pattern: boron in BF₃ has only six outer electrons, and sulfur in SF₆ is surrounded by twelve. A charged atom, such as nitrogen in NH₄⁺, follows different counts again.",
      "Chemists build 3D models to study shape, plan syntheses and design drugs that fit protein pockets. Ball-and-stick models show bonds and angles clearly, stick models show the framework alone, and space-filling models show how much room each atom occupies. Structures travel between programs as files that record each atom’s element and position, often with bonds and charges as well.",
    ],
    formula: { expression: "Formal charge = V − N − B ÷ 2", meaning: "V is the number of valence electrons in the free atom, N is its nonbonding electrons and B is the electrons in its bonds. Nitrogen in NH₄⁺ has 5 − 0 − 8 ÷ 2 = +1." },
    steps: [
      "Load Ethanol from the Molecule library. Read YOUR STRUCTURE (C₂H₆O) and check the Atom list: each carbon shows 4 bonds, oxygen 2 and each hydrogen 1.",
      "Press New, pick C from Elements and press Add separate atom. Predict how many hydrogens carbon needs, then press Fill with hydrogen and compare YOUR STRUCTURE.",
      "Press New and add a separate C. Set New bond order to Double, pick O, and press Attach O to C twice. Confirm that Structure check reports no notes.",
      "Build an isomer: press New, add a separate O, attach two C atoms with Single bonds, then press Fill with hydrogen. Compare YOUR STRUCTURE with ethanol’s formula.",
      "Load Water, choose the Measure tool and select H, O, then H. Compare the angle reading (about 104.4°) with methane’s H–C–H angle measured the same way.",
    ],
    misconception: {
      myth: "Every atom in a stable molecule must have exactly eight outer electrons.",
      fact: "Hydrogen is stable with two electrons, boron in BF₃ has six, and sulfur in SF₆ shares twelve, so the octet rule is a strong guide for carbon, nitrogen, oxygen and fluorine rather than a law for every element.",
    },
    modelNote: "A freeform editor with all 118 elements, up to 200 atoms and single, double or triple bonds. Valence checks cover only neutral H, B, C, N, O, F, Si, P, S, Cl, Br and I. New atoms are placed at illustrative positions, not energy-minimized geometry, so measured angles can differ from real ones. Stability and reactions are not predicted.",
    faq: [
      { q: "What is the difference between ball-and-stick and space-filling models?", a: "A ball-and-stick model shows atoms as small spheres joined by rods, which makes bonds, bond order and angles easy to see. A space-filling model scales each atom to its approximate van der Waals radius, so the spheres merge and show the molecule’s overall size and surface. Chemists switch between them depending on whether connections or overall shape matter more." },
      { q: "Why does carbon form four bonds?", a: "Carbon has four electrons in its outer shell and needs four more to reach a stable octet, so it shares four electron pairs. Those four bonds can be four singles, as in methane, a double and two singles, as in ethene, or a triple and a single, as in acetylene. This flexibility is why carbon builds so many chains and rings." },
      { q: "What are structural isomers?", a: "Structural isomers have the same molecular formula but their atoms are joined in a different order. Butane and 2-methylpropane are both C₄H₁₀, one a straight chain and the other branched. Because connectivity changes a molecule’s shape and intermolecular forces, isomers can have different boiling points, smells and reactivity, even though the formula alone cannot tell them apart." },
      { q: "What is the difference between a MOL file and an XYZ file?", a: "Both store a molecule’s 3D coordinates for chemistry software. An XYZ file lists only each atom’s element and its x, y and z position, so programs must guess where the bonds are. A MOL file also records which atoms are bonded, each bond’s order and any formal charges, which keeps double bonds and ions intact when a structure moves between programs." },
    ],
  },

  "chemical-bonding": {
    question: "What is the difference between ionic, covalent and polar covalent bonds?",
    answer: "An ionic bond forms when one atom transfers electrons to another, creating oppositely charged ions that attract, as in sodium chloride. A covalent bond forms when atoms share a pair of electrons: equally in a nonpolar bond such as H–H, or unequally in a polar bond such as H–Cl, where chlorine pulls the pair closer and gains a partial negative charge. The electronegativity difference decides which happens: 0 for H₂, 0.96 for HCl and 2.23 for NaCl.",
    science: [
      "Electronegativity measures how strongly an atom attracts the electrons in a bond. On the Pauling scale fluorine is highest at 3.98, chlorine is 3.16, hydrogen 2.20 and sodium 0.93. When two atoms attract the shared pair equally, it sits midway between them. When one atom pulls harder, the electron density shifts toward it, leaving partial charges written δ+ and δ−.",
      "Many textbooks use the electronegativity difference as a guide: below about 0.4 a bond is treated as nonpolar covalent, between 0.4 and 1.7 as polar covalent, and above about 1.7 as mainly ionic. These cutoffs are conventions rather than sharp boundaries, because bond character changes gradually. Hydrogen chloride, at 0.96, is clearly polar, while sodium chloride, at 2.23, is ionic.",
      "Bond type shows up in physical properties. Sodium chloride is a giant lattice in which each Na⁺ ion is surrounded by six Cl⁻ ions, so it melts at 801 °C and conducts electricity when molten or dissolved. Hydrogen chloride is made of small polar molecules and boils at −85 °C, while nonpolar hydrogen boils at −253 °C because the attractions between its molecules are so weak.",
    ],
    formula: { expression: "ΔEN = |EN(A) − EN(B)|", meaning: "ΔEN is the difference between the Pauling electronegativities of the two bonded atoms. For H–Cl it is |2.20 − 3.16| = 0.96; the larger the difference, the more ionic the bond’s character." },
    steps: [
      "Set Atom pair to Na + Cl. Watch the electron move from sodium to chlorine, then read Electron behavior and Bond character and note the Na⁺ and Cl⁻ labels.",
      "Predict whether two identical atoms can share electrons unequally. Choose H + H, then check where the shared pair sits and what Bond character reports.",
      "Choose H + Cl and find the δ+ and δ− labels. Explain why the electron pair sits nearer chlorine, then confirm that Electron behavior reads Unequal sharing.",
      "Using Na 0.93, H 2.20 and Cl 3.16, calculate the electronegativity difference for each Atom pair. Rank the three pairs and compare your ranking with Bond character.",
    ],
    misconception: {
      myth: "Every bond is either completely ionic or completely covalent.",
      fact: "Bond character is a continuum set by the electronegativity difference. Polar covalent bonds such as H–Cl share electrons unequally and carry partial charges, and even sodium chloride has a small amount of covalent character.",
    },
    modelNote: "Shows three fixed atom pairs: Na + Cl, H + H and H + Cl. The moving electrons are schematic markers, not orbitals or measured electron density, and no electronegativity values are calculated on screen. Sodium chloride is drawn as a single ion pair, although the real solid is an extended lattice of ions.",
    faq: [
      { q: "How can you tell if a bond is ionic or covalent?", a: "Start with the elements involved: a metal bonded to a nonmetal, such as sodium and chlorine, usually forms an ionic bond, while two nonmetals share electrons covalently. For a closer judgment, subtract the Pauling electronegativities. A difference above about 1.7 suggests mostly ionic character, and a smaller nonzero difference points to a polar covalent bond." },
      { q: "Why is HCl polar but H₂ nonpolar?", a: "In H₂ both atoms are identical, so they attract the shared electron pair equally and no charge separation develops. In HCl chlorine is more electronegative (3.16 against 2.20 for hydrogen), so the pair spends more time near chlorine. Chlorine gains a partial negative charge and hydrogen a partial positive charge, making the molecule a dipole." },
      { q: "Does sodium chloride exist as molecules?", a: "No. Solid sodium chloride is a giant ionic lattice of Na⁺ and Cl⁻ ions in a 1:1 ratio, with no separate NaCl molecules. The formula NaCl describes a formula unit, the simplest ratio of ions. Each ion is attracted to all its oppositely charged neighbors, which is why the solid is hard and has a high melting point." },
      { q: "What is electronegativity?", a: "Electronegativity is the ability of an atom in a bond to attract the shared electrons toward itself. It generally increases across a period and decreases down a group, which makes fluorine the most electronegative element. Electronegativity differences predict which end of a bond becomes slightly negative and how ionic the bond is." },
    ],
  },

  "acid-base-ph": {
    question: "How is pH related to hydrogen ion concentration?",
    answer: "pH is the negative base-10 logarithm of the hydrogen ion concentration: pH = −log₁₀[H⁺]. Each step of one pH unit is a tenfold change, so a solution at pH 3 has ten times more H⁺ than one at pH 4. A strong acid such as HCl ionizes completely, so 0.010 mol/L HCl has [H⁺] = 0.010 mol/L and pH 2.00. A weak acid such as acetic acid ionizes only partly, so the same concentration gives about pH 3.4.",
    science: [
      "Water itself ionizes slightly: H₂O ⇌ H⁺ + OH⁻. At 25 °C the product [H⁺][OH⁻] is always 1.0 × 10⁻¹⁴, so pH + pOH = 14 and pure water, with equal amounts of both ions, sits at pH 7. Adding an acid raises [H⁺] and lowers [OH⁻]; adding a base does the reverse. Because water keeps supplying its own ions, even a very dilute acid never rises above pH 7.",
      "Strength and concentration are separate ideas. A strong acid or base dissociates completely, while a weak one reaches an equilibrium with only a fraction ionized. Acetic acid has Ka = 1.8 × 10⁻⁵, so at 0.010 mol/L only about 4% of its molecules release H⁺. Diluting a weak acid raises that percentage, even as its pH climbs toward 7. Ammonia is a weak base with Kb = 1.8 × 10⁻⁵, and it behaves the same way.",
      "The pH scale runs through daily life. Gastric juice in the stomach is around pH 1.5 to 3.5, vinegar is around pH 2.5 to 3, and human blood is kept between pH 7.35 and 7.45. Seawater averages about pH 8.1, and household ammonia cleaners are around pH 11 to 12. Because the scale is logarithmic, lemon juice at about pH 2 has roughly 100,000 times more H⁺ than pure water.",
    ],
    formula: { expression: "pH = −log₁₀[H⁺]", meaning: "[H⁺] is the hydrogen ion concentration in mol/L, so [H⁺] = 1.0 × 10⁻³ mol/L gives pH 3.00. At 25 °C, pOH = −log₁₀[OH⁻] and pH + pOH = 14." },
    steps: [
      "Select HCl · strong acid and set log₁₀ concentration to −2.0. Record pH and [H⁺], then predict the pH after a tenfold dilution and test it at −3.0.",
      "Return to −2.0 and switch Solution to CH₃COOH · weak acid. Compare pH (about 3.38) and Ionized solute (about 4%) with the HCl readings.",
      "Dilute the acetic acid in steps to −5.0. Track how Ionized solute rises while pH moves toward 7, and explain why dilution helps a weak acid ionize.",
      "Switch to NaOH · strong base, then NH₃ · weak base, at the same concentration. Compare pH and Hydroxide [OH⁻] to see that strength matters for bases as well.",
      "Select HCl at −7.0 and predict whether the pH will reach 7. Explain the reading of about 6.79 using the H⁺ ions that water supplies on its own.",
    ],
    misconception: {
      myth: "A strong acid is the same thing as a concentrated acid.",
      fact: "Strength describes how completely an acid ionizes, while concentration describes how much is dissolved. Dilute 0.0001 mol/L HCl is still strong but has pH 4.00, while 0.10 mol/L acetic acid is weak yet more acidic, at about pH 2.88.",
    },
    modelNote: "Four dilute solutions at 25 °C from 10⁻⁷ to 0.1 mol/L, with Kw = 1.0 × 10⁻¹⁴. HCl and NaOH dissociate completely; acetic acid (Ka = 1.8 × 10⁻⁵) and ammonia (Kb = 1.8 × 10⁻⁵) are solved by charge balance, including water’s own ions. Concentration stands in for activity, and the indicator color is illustrative.",
    faq: [
      { q: "What is the pH of 0.01 M hydrochloric acid?", a: "Hydrochloric acid is a strong acid, so every HCl molecule gives one H⁺ ion and [H⁺] equals 0.01 mol/L, or 1 × 10⁻² mol/L. Taking the negative logarithm gives pH = 2.00. Diluting it tenfold to 0.001 mol/L raises the pH by one unit, to 3.00, as long as the acid supplies far more H⁺ than water does." },
      { q: "Why does a weak acid have a higher pH than a strong acid of the same concentration?", a: "A weak acid releases only a small fraction of its hydrogen ions; most molecules stay intact in an equilibrium. At 0.010 mol/L, hydrochloric acid gives 0.010 mol/L of H⁺, but acetic acid gives only about 4 × 10⁻⁴ mol/L. Less H⁺ means a higher pH: about 3.4 for the acetic acid compared with 2.0 for HCl." },
      { q: "Can pH be negative or higher than 14?", a: "Yes. The 0 to 14 range covers most everyday solutions, but it is not a hard limit. Hydrochloric acid at 2 mol/L has a calculated pH of about −0.3, and 2 mol/L sodium hydroxide about 14.3. At such high concentrations ions interact strongly, so measured values depart from the simple concentration calculation." },
      { q: "What is the difference between pH and pOH?", a: "pH measures hydrogen ion concentration and pOH measures hydroxide ion concentration, each as a negative logarithm. In water at 25 °C the two always add up to 14, because [H⁺] × [OH⁻] = 1.0 × 10⁻¹⁴. A 0.001 mol/L sodium hydroxide solution has pOH 3 and therefore pH 11." },
    ],
  },

  "neutralization-station": {
    question: "What happens when an acid and a base neutralize each other?",
    answer: "When an acid neutralizes a base, hydrogen ions from the acid combine with hydroxide ions from the base to form water: H⁺ + OH⁻ → H₂O. The remaining ions make up a salt that stays dissolved. Hydrochloric acid and sodium hydroxide react in a 1:1 ratio, so 25.00 mL of 0.100 mol/L HCl needs exactly 25.00 mL of 0.100 mol/L NaOH. At that equivalence point the solution is sodium chloride in water at pH 7.00.",
    science: [
      "Hydrochloric acid supplies H⁺ (strictly H₃O⁺) and Cl⁻ ions; sodium hydroxide supplies Na⁺ and OH⁻. Only H⁺ and OH⁻ actually react, so the net ionic equation is H⁺ + OH⁻ → H₂O, while Na⁺ and Cl⁻ are spectator ions. The reaction is exothermic, releasing about 57 kJ for every mole of water formed from a strong acid and a strong base.",
      "Amount equals concentration times volume. A 25.00 mL sample of 0.100 mol/L HCl holds 2.50 mmol of H⁺, so 2.50 mmol of OH⁻, delivered by 25.00 mL of 0.100 mol/L NaOH, completes the reaction. One drop short, at 24.95 mL, only 0.005 mmol of acid is left in about 50 mL, giving pH 4.00. One drop past equivalence leaves the same small excess of hydroxide and pH 10.00.",
      "Neutralization is used wherever acidity has to be controlled. Antacid tablets contain bases such as magnesium hydroxide or calcium carbonate that react with excess stomach acid. Farmers spread lime on acidic soils to raise their pH, and water treatment plants adjust pH before water reaches homes. Acid spills in laboratories are neutralized with sodium hydrogen carbonate before cleanup.",
    ],
    formula: { expression: "n = c × V", meaning: "n is the amount in moles, c is concentration in mol/L and V is volume in liters. For 25.00 mL of 0.100 mol/L HCl, n = 0.100 × 0.02500 = 0.00250 mol, which the same amount of NaOH must match." },
    steps: [
      "Calculate the NaOH volume needed for 2.50 mmol of HCl before adding anything. Then press + 5 mL four times and compare pH and Base amount with your plan.",
      "Use + 1 mL to reach 24 mL while watching Excess acid fall in the reaction strip below Your titration curve. Then switch to + 0.05 mL drops.",
      "With Bromothymol blue selected, add single drops until Base added reads 25.00 mL. Check that pH reads 7.00, the Indicator shows Green transition, and both excess values are zero.",
      "Predict the pH after one more drop, then press + 0.05 mL. Compare this jump with the change from 20 to 24 mL and explain it using Excess base.",
      "Press Reset, choose Phenolphthalein and repeat. Record Base added when it first turns from Colorless, and compare it with the 25.00 mL equivalence volume.",
    ],
    misconception: {
      myth: "Neutralization leaves nothing but pure water in the beaker.",
      fact: "Only the H⁺ and OH⁻ ions combine into water. The Na⁺ and Cl⁻ ions stay dissolved as spectators, so the neutral solution is dilute salt water; evaporating it would leave about 0.15 g of sodium chloride.",
    },
    modelNote: "Models 25.00 mL of 0.100 mol/L HCl reacting with 0.100 mol/L NaOH at 25 °C, added in 5, 1 or 0.05 mL portions from a 50 mL burette. pH comes from the excess acid or base plus water’s autoionization, with additive volumes and instant mixing. The heat released is ignored, and indicator colors follow approximate transition ranges.",
    faq: [
      { q: "Is the solution always pH 7 after neutralization?", a: "Only when a strong acid reacts with a strong base, as with hydrochloric acid and sodium hydroxide. When sodium hydroxide neutralizes a weak acid such as acetic acid, the acetate ions left behind make the solution slightly basic, above pH 7. A strong acid neutralized by ammonia leaves ammonium ions, so that solution ends up slightly acidic." },
      { q: "What salt forms when hydrochloric acid reacts with sodium hydroxide?", a: "The products are sodium chloride and water: HCl + NaOH → NaCl + H₂O. The sodium comes from the base and the chloride from the acid. In solution the salt exists as separate Na⁺ and Cl⁻ ions, and it only appears as solid crystals if the water is evaporated. Other pairs give other salts, such as potassium nitrate from nitric acid and potassium hydroxide." },
      { q: "Is neutralization exothermic?", a: "Yes. Forming water from H⁺ and OH⁻ releases energy, about 57 kJ per mole of water for any strong acid with any strong base. Mixing 50 mL of 1.0 mol/L hydrochloric acid with 50 mL of 1.0 mol/L sodium hydroxide warms the solution by roughly 7 °C. Most weak acids and bases release slightly less, because some energy is used to ionize them." },
      { q: "What is a spectator ion?", a: "A spectator ion is present in the solution before and after a reaction but takes no part in it. When hydrochloric acid neutralizes sodium hydroxide, Na⁺ and Cl⁻ are spectators, so they are left out of the net ionic equation. Every strong acid–strong base neutralization, such as nitric acid with potassium hydroxide, shares the same net equation, H⁺ + OH⁻ → H₂O." },
    ],
  },

  "titration-simulator": {
    question: "How do you find an unknown concentration using titration?",
    answer: "In an acid–base titration, a base of known concentration is added from a burette to a measured volume of acid until the reaction is exactly complete, at the equivalence point. For a 1:1 reaction the moles of base used then equal the moles of acid, so c(acid) = c(base) × V(base) ÷ V(acid). For example, if 22.40 mL of 0.100 mol/L NaOH neutralizes 25.00 mL of HCl, the acid concentration is 0.0896 mol/L.",
    science: [
      "A titration starts with an accurately measured sample, usually from a pipette, and a burette filled with a standard solution of known concentration. Titrant is added quickly at first, then drop by drop as the endpoint nears. The endpoint is detected with an indicator color change or a pH meter. Chemists repeat the titration until two results agree closely, usually within 0.10 mL.",
      "A strong acid–strong base titration curve stays fairly flat, then rises almost vertically from about pH 4 to pH 10 within a drop or two around the equivalence point, which sits at pH 7. Any indicator that changes color inside this steep section gives an accurate result: bromothymol blue changes between pH 6.0 and 7.6, and phenolphthalein between 8.2 and 10.",
      "The mole ratio matters. Sulfuric acid is diprotic, so one mole of H₂SO₄ needs two moles of NaOH, and its concentration is half what a 1:1 calculation would give. Weak acids shift the equivalence pH: titrating acetic acid with NaOH gives equivalence near pH 8.7, where phenolphthalein works and methyl orange would fail. Titrations are used to check vinegar acidity, water hardness and the purity of medicines.",
    ],
    formula: { expression: "c(acid) = c(base) × V(base) ÷ V(acid)", meaning: "c is concentration in mol/L and V is volume, in the same units for acid and base. It applies to a 1:1 reaction such as HCl + NaOH; other mole ratios need an extra factor." },
    steps: [
      "Do a rough run first: press + 5 mL repeatedly and note between which readings pH jumps sharply on Your titration curve.",
      "Press Reset for a fresh sample. Add + 5 mL portions to just below the jump you found, then + 1 mL, then + 0.05 mL drops near the steep rise.",
      "With Bromothymol blue as the Indicator, stop when pH reads 7.00 and the color reads Green transition. Record Base added and Base amount.",
      "Calculate the acid concentration: Base amount in mmol divided by the 25.00 mL sample volume gives mol/L. Set Your concentration estimate to your answer.",
      "Repeat with Phenolphthalein and record Base added at its first color change. Compare it with your pH 7.00 volume to see the gap between endpoint and equivalence.",
    ],
    misconception: {
      myth: "The indicator changes color exactly at the equivalence point.",
      fact: "Equivalence is when the moles of base added equal the moles of acid; the endpoint is when the indicator visibly changes. Phenolphthalein turns pink above about pH 8.2, after the pH 7 equivalence of HCl with NaOH, but the steep jump keeps the volume error to about one drop.",
    },
    modelNote: "Titrates a 25.00 mL sample of HCl of unknown concentration with 0.100 mol/L NaOH at 25 °C, from a 50 mL burette in 5, 1 or 0.05 mL portions. pH is calculated from the excess acid or base plus water’s autoionization. Reading errors, drop-size variation, absorbed CO₂ and temperature effects are omitted, so repeated trials agree exactly.",
    faq: [
      { q: "What is the difference between the endpoint and the equivalence point?", a: "The equivalence point is a calculated condition: the moment the added titrant has supplied exactly the moles needed by the balanced equation. The endpoint is what you observe, usually an indicator color change. A good indicator is chosen so the endpoint falls within the steep part of the titration curve, making the two volumes differ by no more than a drop." },
      { q: "How do you choose an indicator for a titration?", a: "Pick an indicator whose color-change range lies inside the steep jump of the titration curve. For a strong acid with a strong base, bromothymol blue or phenolphthalein both work. For a weak acid with a strong base, use phenolphthalein; for a strong acid with a weak base, use methyl orange, which changes between pH 3.1 and 4.4." },
      { q: "Why do you add titrant drop by drop near the endpoint?", a: "Close to equivalence, a single 0.05 mL drop can move the pH of a strong acid–strong base titration by several units. Adding larger portions there would overshoot, so the recorded volume could be too large by up to the size of that portion. A rough titration shows approximately where the jump is, so later runs can slow down at the right place." },
      { q: "What are concordant titration results?", a: "Concordant results are titres that agree closely, typically within 0.10 mL of each other. Chemists average only the concordant titres, ignoring the rough run and any obvious outlier, to calculate the final concentration. Close agreement between repeats shows that random errors, such as misjudging the endpoint color, are small." },
    ],
  },

  "states-of-matter-3d": {
    question: "How do particles move in solids, liquids and gases?",
    answer: "In a solid, particles are packed in fixed positions and vibrate in place. In a liquid, they stay close together but slide past one another, so a liquid flows and takes the shape of its container. In a gas, particles are far apart and move rapidly in straight lines until they collide, filling any container. Heating speeds all particles up; for water at 1 atm, the solid melts at 0 °C and the liquid boils at 100 °C.",
    science: [
      "The kinetic particle model explains the three states by balancing particle motion against the attractions between particles. In a solid, attractions win and hold each particle in place. In a liquid, particles have enough energy to leave fixed positions but not to escape one another. In a gas, motion overwhelms the attractions, so particles spread out until the container walls stop them.",
      "Temperature measures the average kinetic energy of the particles, which is proportional to absolute temperature. During a phase change the temperature stops rising, because the energy goes into separating particles instead: melting 1 g of ice at 0 °C takes 334 J, and boiling 1 g of water at 100 °C takes about 2,260 J. Steam at 100 °C fills roughly 1,600 times the volume of the liquid it came from.",
      "Boiling points depend on pressure. Near the summit of Mount Everest, where air pressure is about a third of that at sea level, water boils at around 70 °C, while a pressure cooker raises the boiling point to about 120 °C so food cooks faster. Some substances skip the liquid state at normal pressure: dry ice, solid carbon dioxide, turns straight into gas at −78.5 °C, a change called sublimation.",
    ],
    formula: { expression: "Eₖ(average) = 3⁄2 × k × T", meaning: "Eₖ is the average translational kinetic energy of a gas particle, k is the Boltzmann constant (1.38 × 10⁻²³ J/K) and T is temperature in kelvin. Doubling the kelvin temperature doubles the average kinetic energy." },
    steps: [
      "Set Temperature to −20 °C. Observe the particles locked in a grid, vibrating in place, and check that Phase reads Solid.",
      "Predict how the particles will behave at 25 °C, then set it. Phase reads Liquid: particles stay in the lower part of the chamber but move past one another.",
      "Raise Temperature to 120 °C. Describe how the particles now spread through the whole chamber and bounce off its walls, and confirm that Phase reads Gas.",
      "Set Temperature to exactly 0 °C, then to exactly 100 °C. Explain why Phase reads Solid + liquid and then Liquid + gas at these two values.",
      "Press Pause in each phase and drag the chamber to rotate it. Compare how much of the chamber the particles fill as a solid, a liquid and a gas.",
    ],
    misconception: {
      myth: "Particles in a solid do not move at all.",
      fact: "Particles in a solid keep vibrating about fixed positions at every temperature above absolute zero (−273.15 °C). Heating a solid makes those vibrations larger until, at the melting point, the particles break out of their positions.",
    },
    modelNote: "Shows water at a fixed 1 atm as 64 identical spheres, not H₂O molecules. The phase changes sharply at 0 °C and 100 °C, with coexistence shown only at exactly those values. Latent-heat plateaus, evaporation below boiling, supercooling and ice’s open, low-density structure are not modeled; liquid and gas particle speed scales with the square root of kelvin temperature.",
    faq: [
      { q: "What are the bubbles in boiling water made of?", a: "The bubbles are water vapor, not air. At the boiling point, water molecules inside the liquid gain enough energy to form pockets of gas whose pressure matches the air pressure above, so the pockets can grow and rise. The small bubbles that appear earlier, while water is only warming, are dissolved air coming out of solution." },
      { q: "Why does the temperature stay the same while ice melts?", a: "Energy added at the melting point goes into breaking the attractions that hold water molecules in the ice lattice, not into making them move faster. Until all the ice has melted, a mixture of ice and water stays at 0 °C at normal pressure. Each gram of ice absorbs about 334 J in the process, called the latent heat of fusion." },
      { q: "What is the difference between evaporation and boiling?", a: "Evaporation happens only at a liquid’s surface and at any temperature, as the fastest-moving molecules escape. Boiling happens throughout the liquid, but only at the boiling point, when the vapor pressure equals the surrounding pressure and bubbles of vapor form inside. A puddle drying on a cool day is evaporating; a pan of water at 100 °C is boiling." },
      { q: "Why does ice float on water?", a: "When water freezes, hydrogen bonds lock the molecules into an open hexagonal arrangement that takes up more space than the liquid. Ice therefore has a density of about 0.92 g/cm³, compared with about 1.00 g/cm³ for liquid water, so it floats with about 8% of its volume above the surface. Most other substances are denser as solids than as liquids." },
    ],
  },

  "solubility-curve": {
    question: "How do you read a solubility curve?",
    answer: "A solubility curve shows the maximum mass of solute that dissolves in 100 g of water at each temperature. A point on the curve is a saturated solution, a point below it is unsaturated, and any solute above the curve stays undissolved or crystallizes. For a salt whose solubility rises from 36 g at 20 °C to 60 g at 50 °C, cooling a saturated 50 °C solution in 100 g of water to 20 °C forms 24 g of crystals.",
    science: [
      "Dissolving is a balance between solute particles leaving the solid and particles returning to it. In a saturated solution the two rates are equal, so the amount dissolved stops changing. For most solid salts, warming the water shifts that balance toward dissolving, which is why their curves usually slope upward; the exact shape depends on the energy needed to break up the solid and the energy released when water surrounds the ions.",
      "Curves are drawn per 100 g of water, so scale them for other amounts. A salt with a solubility of 60 g per 100 g at 50 °C dissolves 120 g in 200 g of water. To find the crystals formed on cooling, subtract the new capacity from the mass dissolved. Real curves vary widely: potassium nitrate climbs from about 32 g at 20 °C to about 110 g at 60 °C, while sodium chloride barely changes, from about 36 g to 39 g between 0 °C and 100 °C.",
      "Chemists use these curves to purify solids by recrystallization: dissolve an impure sample in the minimum amount of hot solvent, then cool it so the main compound crystallizes while small amounts of impurity stay dissolved. Gases follow the opposite pattern. Oxygen dissolves less in warm water, which is why warm rivers hold less oxygen for fish and why a warm soda goes flat faster.",
    ],
    formula: { expression: "crystals = m(solute) − S(T) × m(water) ÷ 100", meaning: "S(T) is the solubility in grams per 100 g of water at temperature T, so S(T) × m(water) ÷ 100 is the most that can dissolve. A negative result means the solution is unsaturated and no crystals form. In the model, S(T) = 20 + 0.8T." },
    steps: [
      "Keep Water mass at 100 g and Water temperature at 80 °C, then set Added solute to 80 g. Predict whether it all dissolves, and compare Dissolved with Capacity.",
      "Lower Water temperature to 50 °C. Predict the Crystals reading from the new Capacity (60 g) before you look, then check it.",
      "Cool to 20 °C. Confirm that Dissolved + solid still reads 80 g, showing that crystallization moves solute out of solution without destroying any.",
      "At 50 °C, raise Water mass to 200 g. Predict the new Capacity, then watch Crystals return to zero and Solution state switch to Unsaturated.",
      "With Water mass back at 100 g, find where the amber added-solute line crosses the blue capacity line on the Solubility curve. Explain why crystals first appear at that temperature, 75 °C.",
    ],
    misconception: {
      myth: "Every solid dissolves better as the water gets hotter.",
      fact: "Most solid salts do, but sodium chloride’s solubility hardly changes with temperature and calcium hydroxide actually becomes less soluble on heating. Gases such as oxygen and carbon dioxide also dissolve less in warm water.",
    },
    modelNote: "Uses one illustrative salt with a straight-line curve, S = 20 + 0.8T grams per 100 g water, not data for a real compound. Dissolving and crystallizing reach equilibrium instantly, so supersaturation, stirring and dissolving rate are not modeled. Water stays liquid from 0 to 100 °C and never evaporates.",
    faq: [
      { q: "What is the difference between saturated, unsaturated and supersaturated solutions?", a: "An unsaturated solution holds less solute than its solubility limit, so more can dissolve. A saturated solution holds exactly the limit and is in equilibrium with any undissolved solid. A supersaturated solution holds more than the limit, usually made by cooling a hot saturated solution very carefully; it is unstable, and a seed crystal makes the excess crystallize quickly." },
      { q: "How do you calculate the mass of crystals formed when a solution cools?", a: "Read the solubility at the starting and final temperatures, then subtract. Potassium nitrate in 100 g of water holds about 110 g at 60 °C but only about 32 g at 20 °C, so cooling a saturated solution forms roughly 78 g of crystals. For a different mass of water, multiply both solubilities by the water mass divided by 100 first." },
      { q: "Why are gases less soluble in warm water?", a: "Dissolving a gas releases energy as its molecules are surrounded by water, so the process is exothermic. Raising the temperature gives dissolved gas molecules more kinetic energy, letting more of them escape from the liquid. That is why fizzy drinks lose carbon dioxide faster when warm, and why warm water holds less oxygen for aquatic life." },
      { q: "Why do solubility curves use grams per 100 g of water?", a: "A fixed 100 g of solvent lets solubilities of different substances and temperatures be compared directly, whatever the batch size. To apply a curve to another amount, scale it in proportion: 250 g of water dissolves 2.5 times as much solute as 100 g at the same temperature. Some tables give grams per 100 mL or mol/L instead, so always check the units." },
    ],
  },

  "limiting-reagent": {
    question: "How do you find the limiting reagent in a chemical reaction?",
    answer: "To find the limiting reagent, convert each reactant to moles and divide by its coefficient in the balanced equation; the reactant with the smallest result runs out first and limits the product. In 2H₂ + O₂ → 2H₂O, 4 mol H₂ and 4 mol O₂ give 4 ÷ 2 = 2 for hydrogen and 4 ÷ 1 = 4 for oxygen. Hydrogen is limiting, so 4 mol of water forms and 2 mol of oxygen is left over.",
    science: [
      "A balanced equation works like a recipe: in 2H₂ + O₂ → 2H₂O, every 2 mol of hydrogen needs exactly 1 mol of oxygen. If the reactants are mixed in any other ratio, one is used up while some of the other remains. The reactant that runs out first is the limiting reagent, and it alone decides the theoretical yield, the most product the reaction can make.",
      "Masses must be converted to moles before comparing. Take 10 g of each gas: 10 g of H₂ is 4.96 mol, but 10 g of O₂ is only 0.3125 mol. Oxygen is limiting despite the equal masses, so the reaction can form at most 0.625 mol, or 11.3 g, of water, and about 8.7 g of hydrogen is left unreacted.",
      "In practice the actual yield is usually smaller than the theoretical yield, because of incomplete reactions, side reactions and product lost during filtering or transfer. Percentage yield compares the two. Industry often adds an excess of the cheaper reactant so the expensive one is fully used; furnaces and engines, for example, are supplied with excess air so the fuel burns completely.",
    ],
    formula: { expression: "percentage yield = actual yield ÷ theoretical yield × 100", meaning: "Both yields must be in the same units, moles or grams. The theoretical yield comes from the limiting reagent, so collecting 4.5 mol of water when 6 mol was possible is a 75% yield." },
    steps: [
      "Set Hydrogen H₂ to 4 mol and Oxygen O₂ to 4 mol. Predict which reactant runs out, then press React mixture and read Theoretical water and Leftover after reaction.",
      "Set Hydrogen H₂ to 5 mol and Oxygen O₂ to 3 mol. Oxygen has fewer moles, so predict whether it limits the reaction, then react and check the Limiting reagent readout.",
      "Find a mixture that makes 6 mol of water with nothing left over. React it and confirm that Leftover after reaction shows 0 H₂ and 0 O₂.",
      "Keeping that mixture, lower Collection yield to 75% and press React mixture again. Use Collected water and Maximum possible water to check the percentage yield.",
      "Set 12 mol H₂ and 8 mol O₂. Calculate the leftover reactant on paper, then react and compare with the amounts shown under the H₂, O₂ and H₂O containers.",
    ],
    misconception: {
      myth: "The reactant with fewer moles is always the limiting reagent.",
      fact: "The limiting reagent depends on the mole ratio in the equation. With 5 mol H₂ and 3 mol O₂, oxygen has fewer moles, but the hydrogen needs only 2.5 mol of it, so hydrogen runs out first and 0.5 mol of oxygen remains.",
    },
    modelNote: "Covers a single reaction, 2H₂ + O₂ → 2H₂O, with whole-mole amounts from 1 to 12 mol H₂ and 1 to 8 mol O₂, always reacting to completion. Collection yield only scales how much water is recovered afterward. Side reactions, energy release and gas volumes are not modeled; collected mass uses 18.015 g/mol for water.",
    faq: [
      { q: "What is the difference between the limiting reagent and the excess reagent?", a: "The limiting reagent is completely used up and sets the maximum amount of product. The excess reagent is present in more than the required amount, so some of it remains when the reaction stops. Mixing 8 mol of hydrogen with 2 mol of oxygen uses all the oxygen but only 4 mol of hydrogen, leaving 4 mol of hydrogen in excess." },
      { q: "What is the difference between theoretical yield and actual yield?", a: "Theoretical yield is the maximum product calculated from the limiting reagent, assuming the reaction goes to completion with no losses. Actual yield is the amount really collected and weighed at the end of the experiment. Dividing actual by theoretical and multiplying by 100 gives the percentage yield, which is almost always below 100% in a real laboratory." },
      { q: "Why is percentage yield usually less than 100%?", a: "Some reactions are reversible and never go to completion, and some reactants are consumed by side reactions that make unwanted products. Product is also lost in practical steps: some stays dissolved in the solution, sticks to glassware or filter paper, or escapes during heating. A yield above 100% usually means the product is still wet or contains impurities." },
      { q: "How do you find the limiting reagent when you are given masses?", a: "Divide each mass by its molar mass to get moles, then divide each amount by its coefficient in the balanced equation; the smallest result marks the limiting reagent. For 2Mg + O₂ → 2MgO with 6.0 g of each, magnesium gives 0.247 mol ÷ 2 = 0.123 and oxygen gives 0.1875 mol ÷ 1 = 0.188, so magnesium is limiting." },
    ],
  },

  "periodic-table-hunt": {
    question: "How is the periodic table organized?",
    answer: "The periodic table arranges all 118 known elements in order of increasing atomic number, the number of protons in each atom’s nucleus. Rows are periods, numbered 1 to 7, and each new period starts a new outer electron shell. Columns are groups, numbered 1 to 18, and main-group elements in the same group have the same number of outer electrons, so they react in similar ways. Lithium, sodium and potassium in group 1, for example, all have one outer electron.",
    science: [
      "The table’s shape follows electron structure. The two left-hand groups form the s block, groups 13 to 18 the p block, the transition metals the d block and the lanthanides and actinides the f block, named for the subshell being filled. Metals sit on the left and in the center, nonmetals on the right, and a staircase of metalloids such as silicon and germanium lies between them.",
      "Position predicts trends. Across a period, atoms gain protons while adding electrons to the same shell, so atomic radius shrinks and first ionization energy rises, from 496 kJ/mol for sodium to 1,521 kJ/mol for argon. Down a group, each new shell puts the outer electrons farther from the nucleus, so atoms get larger and metals become more reactive, which is why potassium reacts with water far more violently than lithium.",
      "Dmitri Mendeleev published his table in 1869 and left gaps for elements nobody had yet found. He predicted the properties of “eka-silicon,” and germanium, discovered in 1886, matched them closely. Henry Moseley showed in 1913 that atomic number, not atomic mass, is the true ordering principle. The seventh period was completed in 2016, when elements 113, 115, 117 and 118 received their names.",
    ],
    formula: { expression: "A = Z + N", meaning: "A is the mass number of one isotope, Z is the atomic number (protons) and N is the number of neutrons. The atomic mass listed for an element is an average over its natural isotopes, which is why chlorine’s is 35.45 u rather than a whole number." },
    steps: [
      "Select lithium and press + Compare, then do the same for sodium and potassium. Compare their Group, Valence electrons and Family in the comparison table.",
      "Set Color the table by to Block. Predict which block iron is in, then select Fe and check the Block fact in the detail panel.",
      "Switch Color the table by to Phase. Find the two elements that are liquid at room temperature, then count the gases and describe where they cluster.",
      "Select argon and potassium and compare their Atomic mass values. Explain why potassium comes after argon even though its atoms are lighter.",
      "Open Tools and choose Hide element names and Hide atomic numbers. Then identify a mystery element from its position, block and family color alone.",
    ],
    misconception: {
      myth: "The periodic table lists elements in order of atomic mass.",
      fact: "It is ordered by atomic number, the proton count. Because isotope mixtures vary, a few neighbors are out of mass order: argon (39.948 u) comes before potassium (39.098 u), and tellurium (127.60 u) before iodine (126.90 u).",
    },
    modelNote: "Lists all 118 elements with IUPAC names, conventional atomic masses (bracketed mass numbers where no standard value exists), group, period, block and a simplified room-temperature phase. Valence electrons are given for main-group elements only; transition and f-block metals show Variable. Trend arrows are qualitative, and no radius or ionization-energy values are shown.",
    faq: [
      { q: "Why do elements in the same group have similar properties?", a: "Chemical reactions involve the outer electrons, and main-group elements in the same group have the same number of them. Every halogen in group 17 has seven outer electrons and tends to gain one more, forming a 1− ion, so fluorine, chlorine, bromine and iodine all react with sodium to make similar white salts. Properties still change gradually down the group." },
      { q: "What is the difference between a group and a period?", a: "A group is a vertical column and a period is a horizontal row. Elements in a group share a pattern of outer electrons and similar chemistry, such as the unreactive noble gases in group 18. Elements in a period have their outer electrons in the same shell, and their properties change steadily from metal to nonmetal from left to right." },
      { q: "How many elements are on the periodic table?", a: "There are 118 confirmed elements, from hydrogen (atomic number 1) to oganesson (118). Roughly 90 occur naturally on Earth; the rest have been made in laboratories or nuclear reactors, and the heaviest last only fractions of a second. The four most recent names, nihonium, moscovium, tennessine and oganesson, were approved by IUPAC in 2016." },
      { q: "Where are metals, nonmetals and metalloids on the periodic table?", a: "Metals make up most of the table, filling the left side and the center, including all the transition metals, lanthanides and actinides. Nonmetals are clustered at the upper right, with hydrogen as the exception at the top left. Between them a diagonal staircase of metalloids, such as boron, silicon, germanium, arsenic, antimony and tellurium, shows mixed properties." },
    ],
  },

  "iupac-inorganic-nomenclature": {
    question: "How do you name inorganic compounds using IUPAC rules?",
    answer: "To name an ionic compound, write the metal or positive ion first and the negative ion second, changing a single-element anion’s ending to -ide: NaCl is sodium chloride. If the metal can form more than one ion, a Roman numeral in brackets gives its charge, so FeCl₃ is iron(III) chloride. Polyatomic ions keep their own names, as in calcium carbonate, CaCO₃. Compounds of two nonmetals use number prefixes instead: CO is carbon monoxide and SO₃ is sulfur trioxide.",
    science: [
      "Ionic compounds are named from their ions, positive ion first. A metal keeps its element name, and a nonmetal that forms a single-atom anion takes the ending -ide: chlorine becomes chloride, oxygen becomes oxide and fluorine becomes fluoride. Because the charges must cancel, the formula already fixes how many of each ion there are, so ionic names never use number prefixes. MgCl₂ is magnesium chloride, and Al₂O₃ is aluminium oxide (aluminum oxide in US spelling).",
      "Transition metals such as iron and copper form ions with different charges, and the name has to say which one is present. The Stock system puts the charge, as a Roman numeral, in brackets after the metal. Work it out from the anions: in Cu₂O the single oxide ion is −2, so each copper is +1 and the compound is copper(I) oxide, while CuO is copper(II) oxide. The difference is visible, because copper(I) oxide is red and copper(II) oxide is black.",
      "Polyatomic ions keep their own names, and brackets in a formula show more than one of them: Ca(OH)₂ is calcium hydroxide and (NH₄)₂SO₄ is ammonium sulfate. An -ate ending means the ion contains oxygen, so sodium chlorate (NaClO₃) is a different substance from sodium chloride. Two nonmetals bonded covalently are named with prefixes (mono-, di-, tri-, tetra-), dropping mono- on the first element: SO₂ is sulfur dioxide, and N₂O, the laughing gas used as an anesthetic, is dinitrogen monoxide.",
    ],
    formula: { expression: "Σ (ion charge × number of ions) = 0", meaning: "The charges in an ionic formula add up to zero. In FeCl₃, iron’s charge x satisfies x + 3 × (−1) = 0, so x = +3 and the name is iron(III) chloride." },
    steps: [
      "Read the worked example under Name a simple salt: KCl splits into K, potassium, and Cl, which becomes chloride. Then name NaCl the same way in the first practice question.",
      "For each formula, choose one of the two names. If you are unsure, press Give me a hint, then Show the next hint; every formula has two hints.",
      "On FeCl₃, add up the charge of the three chloride ions before choosing between Iron(II) chloride and Iron(III) chloride, then read the explanation that appears after your choice.",
      "Work through all four compounds, from Compound 1 of 4 to 4 of 4, then press Practise again and try to answer each one without a hint.",
      "Under Look up a compound, type CuO and then Cu2O. Compare the two names and use the oxide ion’s −2 charge to work out the charge on copper in each.",
    ],
    misconception: {
      myth: "The Roman numeral in a name tells you how many negative ions there are.",
      fact: "The numeral is the metal’s charge, not a count of anions. Copper(II) oxide, CuO, has a II but only one oxide ion, because one −2 oxide balances one Cu²⁺. The numeral matches the number of anions in iron(III) chloride only because each chloride is −1.",
    },
    modelNote: "Four practice formulas, each with two candidate names and two hints, plus a lookup list of 23 compounds: salts of single-charge metals, iron and copper compounds that need a numeral, common polyatomic ions and binary nonmetal oxides. It does not name acids, hydrates or complex ions, and it can only find compounds in that list rather than naming any formula you type.",
    faq: [
      { q: "What does the Roman numeral in a compound name mean?", a: "It gives the oxidation state, or ion charge, of the metal in front of it. Iron(II) chloride, FeCl₂, contains Fe²⁺ ions, and iron(III) chloride, FeCl₃, contains Fe³⁺ ions. The numeral is needed only for metals that commonly form more than one ion, such as iron, copper, tin and lead. Sodium, potassium, magnesium, calcium and aluminium each form one common ion, so their names have no numeral." },
      { q: "When do you use prefixes like di- and tri- in chemical names?", a: "Use number prefixes only for compounds of two nonmetals, such as carbon dioxide (CO₂) or sulfur trioxide (SO₃), because the same two elements can combine in several ratios. Leave out mono- on the first element, so CO is carbon monoxide. Many textbooks shorten tetraoxide to tetroxide, as in dinitrogen tetroxide (N₂O₄), but the 2005 IUPAC recommendations keep the full prefix, with monoxide as the one exception." },
      { q: "What is the difference between chloride and chlorate?", a: "Chloride is the single-atom ion Cl⁻, formed when a chlorine atom gains one electron. Chlorate is the polyatomic ion ClO₃⁻, which contains one chlorine and three oxygen atoms. The -ate ending signals the oxygen, so sodium chloride (NaCl) is table salt, while sodium chlorate (NaClO₃) is a strong oxidizer used to make bleaching chemicals for paper pulp." },
      { q: "Why is NaHCO₃ called sodium hydrogen carbonate?", a: "NaHCO₃ contains Na⁺ and the hydrogen carbonate ion, HCO₃⁻, which is a carbonate ion that still carries one hydrogen. Its name follows the usual order of positive ion first, then the polyatomic ion. Sodium bicarbonate is the older common name, and baking soda is the kitchen name for the same white powder, which gives off carbon dioxide when it meets an acid or is heated." },
    ],
  },

  "iupac-organic-nomenclature": {
    question: "How do you name organic compounds using IUPAC rules?",
    answer: "An IUPAC organic name is built in three parts. Find the longest continuous carbon chain and give it a stem: meth-, eth-, prop- or but- for one to four carbons. Add a suffix for the bond type or functional group, such as -ane, -ene, -yne, -ol, -al, -one or -oic acid. Then number the chain so the functional group or double bond gets the lowest number and put branches in front, so CH₃–CH(OH)–CH₂–CH₃ is butan-2-ol and CH₃–CH(CH₃)–CH₃ is 2-methylpropane.",
    science: [
      "An organic name has a stem, a suffix and sometimes prefixes. The stem counts the carbons in the longest continuous chain: meth- (1), eth- (2), prop- (3), but- (4), pent- (5). The suffix names the bond type or main functional group: -ane for single bonds only, -ene for a C=C double bond, -yne for a C≡C triple bond, -ol for an alcohol, -al for an aldehyde, -one for a ketone and -oic acid for a carboxylic acid.",
      "Numbers called locants say where things are. Number the chain from the end that gives the functional group or multiple bond the lowest number, and write the locant just before the suffix: CH₂=CH–CH₂–CH₃ is but-1-ene, and in butan-2-ol the OH is on carbon 2 counting from the nearer end. A side group is named as an alkyl prefix with its own locant, such as the methyl group in 2-methylpropane.",
      "Names matter because one molecular formula can describe several compounds, called isomers. C₂H₆O is both ethanol, a liquid that boils at 78 °C, and methoxymethane, a gas that boils at about −24 °C, because the oxygen sits between a carbon and a hydrogen in one and between two carbons in the other. IUPAC’s 2013 recommendations keep a few traditional names, such as acetic acid and acetone, as preferred names; ethanoic acid and propanone are the systematic forms most school courses use.",
    ],
    formula: { expression: "CₙH₂ₙ₊₂ (alkanes) · CₙH₂ₙ (alkenes)", meaning: "n is the number of carbon atoms. Butane, with n = 4, is C₄H₁₀, while but-1-ene and but-2-ene are both C₄H₈: each C=C double bond removes two hydrogens from the alkane formula." },
    steps: [
      "Start with the worked example under Name a carbon chain: CH₃–CH₃ has two carbons, giving eth-, and only single bonds, giving -ane, so it is ethane.",
      "In the practice set, count the carbons in CH₃–CH₂–CH₃ and choose between Propane and Propene. Press Give me a hint if the bond type is unclear.",
      "For CH₃–CH(OH)–CH₂–CH₃, count from both ends to the OH group before choosing Butan-1-ol or Butan-2-ol, then read the explanation after you answer.",
      "On CH₃–CH(CH₃)–CH₃, trace the longest chain without going back over a carbon, and decide whether the bracketed CH₃ belongs to the chain or is a branch.",
      "Under Look up a compound, type C2H6O. Two matches appear, Ethanol and Methoxymethane; compare their structures to see where the oxygen sits in each.",
    ],
    misconception: {
      myth: "A compound is named after the total number of carbon atoms it contains.",
      fact: "The stem comes from the longest continuous chain only. 2-Methylpropane has four carbons, but its longest chain has three, so it is named as propane with a methyl branch; butane is its unbranched isomer, CH₃–CH₂–CH₂–CH₃.",
    },
    modelNote: "Four practice structures, each with two candidate names and two hints, plus a lookup list of 19 compounds with one to four carbons: alkanes, alkenes, ethyne, alcohols, an ether, an aldehyde, a ketone and a carboxylic acid. Names put the locant before the suffix, as in propan-2-ol. Rings, longer chains and cis/trans isomers, such as the two forms of but-2-ene, are not covered.",
    faq: [
      { q: "What do the numbers in names like but-1-ene mean?", a: "They are locants: the numbers of the carbon atoms where a double bond, functional group or branch is found. In but-1-ene, CH₂=CH–CH₂–CH₃, the double bond starts at carbon 1 of a four-carbon chain. The chain is always numbered from the end that gives the lowest locant, so the same molecule is never called but-3-ene." },
      { q: "How do you find the longest carbon chain in a branched molecule?", a: "Trace every path from one end carbon to another without going back over a carbon, and count the atoms in each. The longest path is the main chain, even if it bends through a branch point in the written formula. Anything left over is a substituent named with -yl, such as methyl (CH₃–) or ethyl (CH₃CH₂–). If two paths tie, choose the one with more branches." },
      { q: "What is the difference between propan-1-ol and propan-2-ol?", a: "Both have the formula C₃H₈O, but the OH group sits on an end carbon in propan-1-ol and on the middle carbon in propan-2-ol. That changes their properties: propan-1-ol boils at about 97 °C and propan-2-ol at about 82 °C. Propan-2-ol, also called isopropanol or isopropyl alcohol, is the main ingredient of rubbing alcohol and many hand sanitizers." },
      { q: "What is the difference between an alkane, an alkene and an alkyne?", a: "All three are hydrocarbons, containing only carbon and hydrogen. Alkanes have only single C–C bonds and end in -ane, like propane. Alkenes contain at least one C=C double bond and end in -ene, like ethene, which plants release to ripen fruit. Alkynes contain a C≡C triple bond and end in -yne, like ethyne, also called acetylene, the fuel in oxy-acetylene welding torches." },
    ],
  },
};
