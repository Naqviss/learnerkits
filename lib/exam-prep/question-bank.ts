import type { ContentId } from "./catalog";

export type Question = { question: string; options: readonly string[]; answer: number; why: string };

const q = (question: string, options: string[], answer: number, why: string): Question => ({ question, options, answer, why });

/**
 * Original LearnerKits practice questions for the topic test, in addition to each lesson's check question.
 * Calculation topics have two here plus freshly generated ones (generators.ts); the others have four.
 */
export const questionBank: Record<ContentId, readonly Question[]> = {
  quantities: [
    q("Which of these is an SI base unit?", ["Newton", "Kilogram", "Joule", "Watt"], 1, "The kilogram is the SI base unit of mass. The others are built from base units."),
    q("What does the prefix “milli” mean?", ["× 1000", "÷ 100", "÷ 1000", "× 100"], 2, "Milli means one thousandth, so 1 mm = 0.001 m."),
  ],
  kinematics: [
    q("What does the gradient of a velocity–time graph show?", ["Distance", "Acceleration", "Speed", "Force"], 1, "Gradient is change in velocity divided by time, which is acceleration."),
    q("A car travels 150 m in 10 s at steady speed. What is its speed?", ["1.5 m/s", "15 m/s", "140 m/s", "1500 m/s"], 1, "speed = distance ÷ time = 150 ÷ 10 = 15 m/s."),
  ],
  dynamics: [
    q("The forces on a moving car are balanced. What happens to the car?", ["It speeds up", "It stops at once", "It keeps a steady speed", "It slows down"], 2, "With no resultant force there is no acceleration, so the speed stays the same."),
    q("The same resultant force acts on a larger mass. What happens to the acceleration?", ["It increases", "It decreases", "It stays the same", "It becomes zero"], 1, "a = F ÷ m, so a larger mass gives a smaller acceleration."),
  ],
  forces: [
    q("The same force is applied over a smaller area. What happens to the pressure?", ["It increases", "It decreases", "It stays the same", "It becomes zero"], 0, "Pressure = force ÷ area, so a smaller area gives a larger pressure."),
    q("A block has a mass of 200 g and a volume of 100 cm³. What is its density?", ["0.5 g/cm³", "2 g/cm³", "100 g/cm³", "20 000 g/cm³"], 1, "density = mass ÷ volume = 200 ÷ 100 = 2 g/cm³."),
  ],
  energy: [
    q("A ball falls from a shelf. Which energy transfer takes place?", ["Kinetic to gravitational", "Gravitational to kinetic", "Chemical to elastic", "Thermal to nuclear"], 1, "The gravitational store empties as the kinetic store fills."),
    q("A motor transfers 600 J of energy in 30 s. What is its power?", ["20 W", "570 W", "630 W", "18 000 W"], 0, "power = energy ÷ time = 600 ÷ 30 = 20 W."),
  ],
  deformation: [
    q("A spring is 10 cm long unstretched and 14 cm long with a load. What is the extension?", ["4 cm", "10 cm", "14 cm", "24 cm"], 0, "Extension = new length − original length = 14 − 10 = 4 cm."),
    q("What does a large spring constant tell you about a spring?", ["It is long", "It is stiff", "It is easy to stretch", "It is broken"], 1, "A large k means a large force is needed for a small extension, so the spring is stiff."),
  ],
  waves: [
    q("What do waves transfer from place to place?", ["Matter", "Energy", "Particles", "Mass"], 1, "Waves transfer energy; the particles only vibrate about a fixed position."),
    q("What is the unit of frequency?", ["Metre", "Second", "Hertz", "Newton"], 2, "Frequency is the number of waves per second, measured in hertz (Hz)."),
  ],
  superposition: [
    q("Two waves meet with displacements of +3 cm and −3 cm. What is the resultant displacement?", ["−6 cm", "0 cm", "+3 cm", "+6 cm"], 1, "Displacements add: +3 + (−3) = 0, so the waves cancel."),
    q("What is it called when two waves combine to give a larger amplitude?", ["Destructive interference", "Refraction", "Constructive interference", "Reflection"], 2, "Waves that meet in step reinforce each other: constructive interference."),
    q("Two waves meet with displacements of +4 cm and −1 cm. What is the resultant displacement?", ["−5 cm", "+3 cm", "+4 cm", "+5 cm"], 1, "+4 + (−1) = +3 cm."),
    q("After two waves pass through each other, what happens to them?", ["They disappear", "They carry on unchanged", "They join into one wave", "They reverse direction"], 1, "Each wave continues as if the other had not been there."),
  ],
  electricity: [
    q("What is the unit of electrical resistance?", ["Volt", "Ampere", "Ohm", "Watt"], 2, "Resistance is measured in ohms (Ω)."),
    q("The voltage across a fixed resistor is doubled. What happens to the current?", ["It halves", "It stays the same", "It doubles", "It becomes zero"], 2, "I = V ÷ R, so doubling V doubles I when R is fixed."),
  ],
  circuits: [
    q("In a series circuit, how does the current compare at different points?", ["It is the same everywhere", "It is largest near the battery", "It is zero after the first lamp", "It doubles at each component"], 0, "There is only one path, so the same current flows through every component."),
    q("Two identical 6 Ω resistors are connected in parallel. What is their combined resistance?", ["3 Ω", "6 Ω", "12 Ω", "36 Ω"], 0, "Two equal resistors in parallel give half the resistance of one: 3 Ω."),
  ],
  particles: [
    q("Which particle has no electric charge?", ["Proton", "Electron", "Neutron", "Alpha particle"], 2, "Neutrons are neutral; protons are positive and electrons are negative."),
    q("What decides which element an atom is?", ["Number of neutrons", "Number of protons", "Number of shells", "Its mass"], 1, "The proton number identifies the element."),
    q("An atom has 6 protons and 8 neutrons. What is its nucleon number?", ["2", "6", "8", "14"], 3, "Nucleon number = protons + neutrons = 6 + 8 = 14."),
    q("What are atoms of the same element with different numbers of neutrons called?", ["Ions", "Isotopes", "Molecules", "Compounds"], 1, "Isotopes have the same number of protons but different numbers of neutrons."),
  ],
  gas: [
    q("What causes the pressure of a gas in a container?", ["Particles hitting the walls", "Particles getting bigger", "Particles sticking together", "Gravity pulling the gas down"], 0, "Each collision with the wall exerts a small force; together they produce the pressure."),
    q("What is 27 °C in kelvin?", ["−246 K", "27 K", "246 K", "300 K"], 3, "Add 273: 27 + 273 = 300 K."),
  ],
  states: [
    q("In which state are the particles far apart and moving freely?", ["Solid", "Liquid", "Gas", "All three"], 2, "Gas particles are far apart and move quickly in all directions."),
    q("What is the change from liquid to gas called?", ["Melting", "Freezing", "Condensing", "Evaporating"], 3, "A liquid becoming a gas is evaporation (or boiling)."),
    q("Why does the temperature stay constant while a solid melts?", ["No energy is supplied", "The energy is used to separate the particles", "The particles stop moving", "The thermometer is faulty"], 1, "The energy overcomes the forces between particles instead of raising the temperature."),
    q("Why can a gas be compressed easily?", ["Its particles are soft", "There are large spaces between its particles", "Its particles are very small", "Its particles are not moving"], 1, "The particles are far apart, so they can be pushed closer together."),
  ],
  bonding: [
    q("Which type of bond forms when atoms share pairs of electrons?", ["Ionic", "Covalent", "Metallic", "Hydrogen"], 1, "Sharing electron pairs is covalent bonding."),
    q("Which type of bond forms when a metal transfers electrons to a non-metal?", ["Ionic", "Covalent", "Metallic", "Double"], 0, "Electron transfer makes oppositely charged ions that attract: ionic bonding."),
    q("Sodium chloride has a high melting point. Why?", ["Its molecules are small", "It has strong attractions between oppositely charged ions", "It contains a metal", "It has weak forces between molecules"], 1, "A lot of energy is needed to overcome the strong ionic bonds in the lattice."),
    q("How many electrons are shared in a single covalent bond?", ["1", "2", "4", "8"], 1, "A single covalent bond is one shared pair: 2 electrons."),
  ],
  acids: [
    q("What is the pH of a neutral solution?", ["0", "1", "7", "14"], 2, "Pure water is neutral, with a pH of 7."),
    q("What are the products when an acid reacts with an alkali?", ["Salt and hydrogen", "Salt and water", "Water and oxygen", "Carbon dioxide only"], 1, "Neutralisation gives a salt and water."),
  ],
  chemical: [
    q("In the equation 2H₂ + O₂ → 2H₂O, how many hydrogen atoms are on the left?", ["1", "2", "4", "6"], 2, "2 molecules of H₂ contain 2 × 2 = 4 hydrogen atoms."),
    q("Which change makes a reaction faster?", ["Lowering the temperature", "Using larger lumps", "Diluting the solution", "Raising the temperature"], 3, "Hotter particles collide more often and with more energy."),
    q("10 g of reactants react completely in a sealed container. What is the mass of the products?", ["Less than 10 g", "10 g", "More than 10 g", "It cannot be known"], 1, "Mass is conserved: atoms are only rearranged."),
    q("What does a catalyst do?", ["It is used up in the reaction", "It speeds up the reaction without being used up", "It stops the reaction", "It increases the mass of product"], 1, "A catalyst increases the rate and is unchanged at the end."),
  ],
  orbit: [
    q("Which force keeps a planet in orbit around the Sun?", ["Friction", "Magnetism", "Gravity", "Air resistance"], 2, "The gravitational pull of the Sun holds the planet in its orbit."),
    q("How does a planet's orbital period change the further it is from the Sun?", ["It gets shorter", "It gets longer", "It stays the same", "It becomes zero"], 1, "Distant planets move more slowly and travel further, so their year is longer."),
  ],
  cells: [
    q("Which structure is found in a plant cell but not in an animal cell?", ["Nucleus", "Cell membrane", "Cell wall", "Mitochondrion"], 2, "Plant cells have a cell wall, chloroplasts and a large vacuole."),
    q("What is the job of the nucleus?", ["It releases energy", "It controls the cell and holds the genetic material", "It makes food", "It supports the cell"], 1, "The nucleus contains DNA and controls the cell's activities."),
  ],
  membranes: [
    q("What is diffusion?", ["Movement of particles from high to low concentration", "Movement of particles from low to high concentration", "Movement of water only", "Movement that needs energy"], 0, "Particles spread from where there are many to where there are few."),
    q("Which process needs energy from respiration?", ["Diffusion", "Osmosis", "Active transport", "Evaporation"], 2, "Active transport moves substances against the concentration gradient, which needs energy."),
    q("A plant cell is placed in pure water. What happens?", ["It loses water and shrinks", "It gains water and becomes firm", "Nothing changes", "It bursts immediately"], 1, "Water enters by osmosis; the cell wall stops it bursting, so it becomes turgid."),
    q("Which change speeds up diffusion?", ["A lower temperature", "A smaller surface area", "A steeper concentration gradient", "A thicker membrane"], 2, "A bigger difference in concentration gives faster net movement."),
  ],
  biomolecules: [
    q("Which reagent is used to test for starch?", ["Benedict's solution", "Iodine solution", "Biuret solution", "Ethanol"], 1, "Iodine turns blue-black when starch is present."),
    q("What colour does biuret solution turn when protein is present?", ["Blue-black", "Brick-red", "Purple", "Green"], 2, "Biuret changes from blue to purple with protein."),
    q("Which smaller units make up starch?", ["Amino acids", "Glucose", "Fatty acids", "Glycerol"], 1, "Starch is a long chain of glucose molecules."),
    q("What are fats (lipids) made from?", ["Glucose", "Amino acids", "Fatty acids and glycerol", "Nucleotides"], 2, "A lipid molecule is built from fatty acids joined to glycerol."),
  ],
  enzymes: [
    q("What happens to an enzyme at a very high temperature?", ["It works faster for ever", "It is denatured", "It turns into substrate", "It multiplies"], 1, "The active site changes shape, so the substrate no longer fits."),
    q("What is the part of an enzyme where the substrate fits called?", ["Nucleus", "Active site", "Membrane", "Product"], 1, "The substrate binds at the active site."),
  ],
  photosynthesis: [
    q("Which two substances does a plant need for photosynthesis?", ["Oxygen and glucose", "Carbon dioxide and water", "Nitrogen and water", "Oxygen and water"], 1, "Carbon dioxide and water are the raw materials."),
    q("Where in a plant cell does photosynthesis take place?", ["Nucleus", "Mitochondria", "Chloroplasts", "Cell wall"], 2, "Chloroplasts contain chlorophyll, which absorbs light."),
    q("What is the green pigment that absorbs light called?", ["Haemoglobin", "Chlorophyll", "Glucose", "Cellulose"], 1, "Chlorophyll absorbs light energy for photosynthesis."),
    q("A plant has plenty of light and warmth but photosynthesis is slow. What is most likely limiting it?", ["Oxygen", "Carbon dioxide", "Glucose", "Nitrogen gas"], 1, "With enough light and warmth, carbon dioxide is the likely limiting factor."),
  ],
  respiration: [
    q("Where does aerobic respiration mainly take place?", ["Nucleus", "Mitochondria", "Chloroplasts", "Cell membrane"], 1, "Mitochondria are the site of aerobic respiration."),
    q("What is made in muscles during anaerobic respiration?", ["Ethanol", "Lactic acid", "Oxygen", "Starch"], 1, "Glucose is broken down to lactic acid when oxygen is short."),
    q("Which statement about respiration is correct?", ["It happens only in the lungs", "It happens in every living cell", "It happens only at night", "It happens only in animals"], 1, "All living cells respire to release energy."),
    q("Which type of respiration releases more energy from each glucose molecule?", ["Aerobic", "Anaerobic", "Both release the same", "Neither releases energy"], 0, "Aerobic respiration breaks glucose down completely, releasing far more energy."),
  ],
  circulation: [
    q("Which blood vessels carry blood away from the heart?", ["Veins", "Arteries", "Capillaries", "Valves"], 1, "Arteries carry blood away from the heart at high pressure."),
    q("Which part of the blood carries oxygen?", ["Plasma", "Platelets", "White blood cells", "Red blood cells"], 3, "Red blood cells contain haemoglobin, which carries oxygen."),
  ],
  exchange: [
    q("Which feature helps the alveoli exchange gases quickly?", ["Thick walls", "A small surface area", "Very thin walls", "A poor blood supply"], 2, "Thin walls give a short distance for diffusion."),
    q("As an organism gets larger, what happens to its surface area to volume ratio?", ["It increases", "It decreases", "It stays the same", "It doubles"], 1, "Volume grows faster than surface area, so the ratio falls."),
  ],
  immunity: [
    q("What is a pathogen?", ["A type of white blood cell", "A microorganism that causes disease", "A medicine", "A vaccine"], 1, "Pathogens are disease-causing microorganisms."),
    q("Which type of medicine kills bacteria?", ["Painkillers", "Antibiotics", "Vaccines", "Antiseptic cream only"], 1, "Antibiotics kill bacteria but do not work on viruses."),
    q("What does a vaccine contain?", ["Antibodies only", "A dead or weakened form of the pathogen", "Antibiotics", "White blood cells"], 1, "The harmless pathogen triggers the body to make memory cells."),
    q("Why is a second infection by the same pathogen usually fought off faster?", ["The pathogen is weaker", "Memory cells respond quickly", "Red blood cells remember it", "Antibiotics stay in the blood"], 1, "Memory cells make the right antibodies quickly."),
  ],
  homeostasis: [
    q("What is homeostasis?", ["Growing taller", "Keeping internal conditions steady", "Breaking down food", "Making new cells"], 1, "Homeostasis keeps conditions such as temperature and glucose within narrow limits."),
    q("Which organ releases insulin?", ["Liver", "Kidney", "Pancreas", "Stomach"], 2, "The pancreas releases insulin when blood glucose is high."),
    q("How do hormones travel around the body?", ["Along nerves", "In the blood", "Through the lungs", "In the bones"], 1, "Hormones are carried in the bloodstream to their target organs."),
    q("Which response helps cool the body down?", ["Shivering", "Sweating", "Hairs standing up", "Narrowing blood vessels in the skin"], 1, "Sweat evaporating from the skin takes heat away."),
  ],
  reproduction: [
    q("Which type of cell division makes gametes?", ["Mitosis", "Meiosis", "Binary fission", "Budding"], 1, "Meiosis halves the chromosome number to make gametes."),
    q("A human body cell has 46 chromosomes. How many does a human gamete have?", ["23", "46", "92", "12"], 0, "Gametes have half the number: 23."),
  ],
  dna: [
    q("Which base pairs with cytosine (C) in DNA?", ["Adenine", "Thymine", "Guanine", "Uracil"], 2, "C always pairs with G."),
    q("What does a gene code for?", ["A cell", "A protein", "A chromosome", "A nucleus"], 1, "The base sequence of a gene codes for the amino acid sequence of a protein."),
  ],
  inheritance: [
    q("What are different versions of the same gene called?", ["Chromosomes", "Alleles", "Gametes", "Phenotypes"], 1, "Alleles are alternative forms of a gene."),
    q("An organism has two identical alleles for a gene. What is it described as?", ["Heterozygous", "Homozygous", "Dominant", "Recessive"], 1, "Two identical alleles means homozygous."),
    q("A parent with genotype AA is crossed with a parent with genotype aa. What genotype do all the offspring have?", ["AA", "Aa", "aa", "A mixture of AA and aa"], 1, "Each offspring gets A from one parent and a from the other: Aa."),
    q("What does the word “phenotype” mean?", ["The alleles an organism has", "The features an organism shows", "A type of cell division", "A change in DNA"], 1, "Phenotype is the observable characteristic; genotype is the alleles."),
  ],
  evolution: [
    q("What is natural selection?", ["Organisms choosing to change", "Better-adapted individuals surviving and reproducing", "Humans breeding animals", "All individuals surviving equally"], 1, "Individuals with helpful features are more likely to pass on their alleles."),
    q("What is the original source of new alleles?", ["Mutation", "Exercise", "Diet", "Learning"], 0, "Mutations are random changes in DNA that create new alleles."),
    q("Which piece of evidence supports evolution?", ["Fossils", "Weather records", "Tides", "Rainbows"], 0, "Fossils show how organisms have changed over time."),
    q("What is it called when humans choose which animals or plants breed?", ["Natural selection", "Selective breeding", "Mutation", "Extinction"], 1, "Selective breeding is artificial selection by humans."),
  ],
  ecology: [
    q("What is always at the start of a food chain?", ["A predator", "A producer", "A decomposer", "A herbivore"], 1, "Producers, usually green plants, make the food that enters the chain."),
    q("In a food chain, what do the arrows show?", ["Which animal is bigger", "The direction of energy transfer", "Where animals live", "Which animal is faster"], 1, "Arrows point from the food to the organism that eats it, showing energy flow."),
  ],
  classification: [
    q("Which is the smallest group in classification?", ["Kingdom", "Genus", "Species", "Family"], 2, "Species is the smallest group."),
    q("Which kingdom do mushrooms belong to?", ["Plants", "Animals", "Fungi", "Bacteria"], 2, "Mushrooms are fungi."),
    q("Which feature do all vertebrates share?", ["Feathers", "A backbone", "Fur", "Gills"], 1, "Vertebrates are animals with a backbone."),
    q("What defines a species?", ["Organisms that look the same", "Organisms that live together", "Organisms that can breed to produce fertile offspring", "Organisms that eat the same food"], 2, "Members of a species can interbreed and their offspring are fertile."),
  ],
  number: [
    q("What is 2⁵?", ["10", "16", "25", "32"], 3, "2 × 2 × 2 × 2 × 2 = 32."),
    q("What is 3/4 as a percentage?", ["34%", "43%", "75%", "133%"], 2, "3 ÷ 4 = 0.75 = 75%."),
    q("What is 6 × 10³ as an ordinary number?", ["60", "600", "6000", "60 000"], 2, "10³ = 1000, so 6 × 1000 = 6000."),
    q("What is 0.25 as a fraction?", ["1/2", "1/4", "2/5", "1/25"], 1, "0.25 = 25/100 = 1/4."),
  ],
  ratio: [
    q("Share 40 in the ratio 3 : 5. What is the larger share?", ["15", "20", "25", "30"], 2, "8 parts = 40, so 1 part = 5 and the larger share is 5 × 5 = 25."),
    q("y is directly proportional to x. When x = 2, y = 10. What is y when x = 5?", ["13", "20", "25", "50"], 2, "y = 5x, so y = 5 × 5 = 25."),
  ],
  algebra: [
    q("Expand 3(x + 4).", ["3x + 4", "3x + 7", "3x + 12", "x + 12"], 2, "Multiply each term in the bracket by 3: 3x + 12."),
    q("Factorise x² + 5x + 6.", ["(x + 1)(x + 6)", "(x + 2)(x + 3)", "(x − 2)(x − 3)", "(x + 5)(x + 1)"], 1, "2 and 3 multiply to 6 and add to 5."),
  ],
  functions: [
    q("f(x) = 3x − 2. What is f(4)?", ["5", "10", "12", "14"], 1, "3 × 4 − 2 = 10."),
    q("What is the inverse of f(x) = x + 5?", ["x − 5", "5x", "x ÷ 5", "5 − x"], 0, "Adding 5 is undone by subtracting 5."),
  ],
  coordinate: [
    q("What is the y-intercept of the line y = 3x − 4?", ["−4", "3", "4", "−3"], 0, "In y = mx + c, c is the y-intercept: −4."),
    q("Which line is parallel to y = 2x + 1?", ["y = −2x + 1", "y = 2x − 5", "y = x + 2", "y = ½x + 1"], 1, "Parallel lines have the same gradient, 2."),
  ],
  geometry: [
    q("Two angles of a triangle are 50° and 60°. What is the third angle?", ["60°", "70°", "110°", "250°"], 1, "180 − 50 − 60 = 70°."),
    q("What do the angles around a point add up to?", ["90°", "180°", "270°", "360°"], 3, "A full turn is 360°."),
  ],
  mensuration: [
    q("A rectangle is 8 cm long and 5 cm wide. What is its area?", ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], 2, "Area = length × width = 8 × 5 = 40 cm²."),
    q("Which formula gives the area of a circle?", ["2πr", "πd", "πr²", "2πr²"], 2, "Area = π × radius²."),
  ],
  trigonometry: [
    q("Which ratio is adjacent ÷ hypotenuse?", ["Sine", "Cosine", "Tangent", "None of these"], 1, "CAH: cosine = adjacent ÷ hypotenuse."),
    q("What is tan 45°?", ["0", "0.5", "1", "2"], 2, "At 45° the opposite and adjacent sides are equal, so the ratio is 1."),
  ],
  vectorsMath: [
    q("What is (2, 3) + (4, 1)?", ["(6, 4)", "(8, 3)", "(2, 2)", "(6, 3)"], 0, "Add the matching parts: 2 + 4 = 6 and 3 + 1 = 4."),
    q("What does a vector have that a scalar does not?", ["Size", "Units", "Direction", "A value"], 2, "A vector has both size and direction."),
  ],
  sequences: [
    q("What is the common difference of the sequence 4, 9, 14, 19?", ["4", "5", "9", "10"], 1, "Each term is 5 more than the one before."),
    q("What is the next term of the sequence 2, 6, 18, 54?", ["72", "108", "162", "216"], 2, "Each term is multiplied by 3: 54 × 3 = 162."),
  ],
  logs: [
    q("What is log₁₀ 100?", ["1", "2", "10", "100"], 1, "10² = 100, so the answer is 2."),
    q("What is log x + log y equal to?", ["log(x + y)", "log(xy)", "log(x − y)", "log(x ÷ y)"], 1, "Adding logs multiplies the numbers inside."),
  ],
  differentiation: [
    q("What is the derivative of x³?", ["x²", "3x", "3x²", "x⁴ ÷ 4"], 2, "Multiply by the power and reduce the power by one: 3x²."),
    q("What is the gradient of a curve at a stationary point?", ["0", "1", "−1", "It cannot be found"], 0, "The curve is flat at a stationary point, so dy/dx = 0."),
  ],
  integration: [
    q("What is the integral of 3x² with respect to x?", ["6x + c", "x³ + c", "3x³ + c", "x² + c"], 1, "Add one to the power and divide by the new power: 3x³ ÷ 3 = x³."),
    q("What must you add to every indefinite integral?", ["+ x", "+ c", "+ 1", "+ dx"], 1, "The constant of integration, + c."),
  ],
  probability: [
    q("A fair coin is flipped. What is the probability of getting heads?", ["1/4", "1/3", "1/2", "1"], 2, "There are 2 equally likely outcomes and 1 is heads."),
    q("A bag holds 3 red and 2 blue balls. One is taken at random. What is the probability it is red?", ["2/5", "3/5", "1/3", "3/2"], 1, "3 of the 5 balls are red."),
    q("The probability of rain is 0.3. What is the probability that it does not rain?", ["0.3", "0.6", "0.7", "1.3"], 2, "1 − 0.3 = 0.7."),
    q("A fair dice is rolled. What is the probability of an even number?", ["1/6", "1/3", "1/2", "2/3"], 2, "2, 4 and 6 are even: 3 out of 6 = 1/2."),
  ],
  statistics: [
    q("What is the median of 2, 9, 4, 7, 5?", ["4", "5", "7", "9"], 1, "In order: 2, 4, 5, 7, 9. The middle value is 5."),
    q("What is the range of 3, 8, 12, 15?", ["3", "9.5", "12", "15"], 2, "Range = largest − smallest = 15 − 3 = 12."),
  ],
};
