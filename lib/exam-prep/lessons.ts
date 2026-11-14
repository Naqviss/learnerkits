import type { ContentId } from "./catalog";

/** The easy, step-by-step explanation shown at the top of every topic page, plus the mistake students most often make. */
export type LessonDetail = { explain: readonly string[]; mistake: string };

export const lessonDetail: Record<ContentId, LessonDetail> = {
  quantities: {
    explain: [
      "A measurement is always a number and a unit together. “5” means nothing on its own; “5 m” tells you a length.",
      "Scientists agree on SI base units: metre for length, kilogram for mass, second for time, ampere for current and kelvin for temperature. Every other unit is built from these.",
      "Prefixes save writing long numbers: kilo means × 1000, centi means ÷ 100 and milli means ÷ 1000. Convert everything to base units before you calculate.",
    ],
    mistake: "Mixing units in one calculation, such as using centimetres for one length and metres for another.",
  },
  kinematics: {
    explain: [
      "Kinematics describes how something moves. Speed tells you how fast; velocity tells you how fast and in which direction.",
      "Acceleration is how quickly velocity changes. An acceleration of 2 m/s² means the velocity rises by 2 m/s every second.",
      "On a velocity–time graph, the gradient is the acceleration and the area under the line is the distance travelled.",
    ],
    mistake: "Forgetting that an object which starts from rest has an initial velocity of zero, and that slowing down is a negative acceleration.",
  },
  dynamics: {
    explain: [
      "A force is a push or a pull. What matters is the resultant force: the single force left over after all the forces are combined.",
      "If the resultant force is zero, the object stays still or keeps moving at a steady speed in a straight line.",
      "If there is a resultant force, the object accelerates. A bigger force gives more acceleration, and a bigger mass gives less.",
    ],
    mistake: "Using one of the forces instead of the resultant force, for example ignoring friction when it acts against the push.",
  },
  forces: {
    explain: [
      "Forces can change an object's speed, direction or shape. Weight is the force of gravity on a mass.",
      "Pressure tells you how concentrated a force is. The same force on a smaller area gives a larger pressure, which is why a sharp knife cuts better.",
      "Density is mass divided by volume. An object floats when its density is lower than the liquid it is in.",
    ],
    mistake: "Multiplying force by area when finding pressure. Pressure is force divided by area.",
  },
  energy: {
    explain: [
      "Energy is never created or destroyed. It is only transferred from one store to another, such as from a gravitational store to a kinetic store.",
      "Work done is the energy transferred when a force moves something. Push harder or further and you transfer more energy.",
      "Power is how quickly energy is transferred. A more powerful motor does the same work in less time.",
    ],
    mistake: "Using a distance that is not in the direction of the force, or forgetting that some energy is always wasted as heat.",
  },
  deformation: {
    explain: [
      "A force can stretch, squash or bend an object. Extension is how much longer the object becomes, not its total length.",
      "For a spring, doubling the force doubles the extension. This is Hooke's law, and it works up to the limit of proportionality.",
      "The spring constant k measures stiffness. A stiff spring has a large k and needs a large force for a small extension.",
    ],
    mistake: "Using the total length of the spring instead of the extension, or leaving the extension in centimetres.",
  },
  waves: {
    explain: [
      "A wave carries energy from place to place without carrying matter. The particles only vibrate about a fixed position.",
      "Wavelength is the length of one complete wave. Frequency is how many waves pass a point each second, measured in hertz.",
      "Wave speed links the two: a wave with a higher frequency or a longer wavelength travels faster in the same time.",
    ],
    mistake: "Confusing amplitude with wavelength. Amplitude is the height from the middle to a peak; wavelength is the length of one whole wave.",
  },
  superposition: {
    explain: [
      "When two waves meet, their displacements simply add together at each point. Afterwards each wave carries on unchanged.",
      "If two peaks meet, they combine into a bigger peak. This is constructive interference.",
      "If a peak meets a trough of the same size, they cancel. This is destructive interference, and it is why some places are quiet or dark.",
    ],
    mistake: "Adding amplitudes without their signs. A displacement below the middle line is negative.",
  },
  electricity: {
    explain: [
      "Electric current is a flow of charge. It is measured in amperes and is the same on both sides of a component.",
      "Potential difference, or voltage, is the energy given to each unit of charge. It is what pushes the current around the circuit.",
      "Resistance opposes the current. For the same voltage, more resistance means less current.",
    ],
    mistake: "Rearranging V = IR incorrectly. Cover the quantity you want: I = V ÷ R and R = V ÷ I.",
  },
  circuits: {
    explain: [
      "In a series circuit there is only one path, so the current is the same everywhere and the voltage is shared between the components.",
      "In a parallel circuit the current splits between the branches, and each branch gets the full supply voltage.",
      "Resistances in series add together. Adding a resistor in parallel gives the current another path, so the total resistance goes down.",
    ],
    mistake: "Adding resistances in parallel as if they were in series. Two equal resistors in parallel give half the resistance of one.",
  },
  particles: {
    explain: [
      "An atom has a tiny nucleus of protons and neutrons, with electrons around it. Protons are positive, electrons are negative and neutrons have no charge.",
      "The number of protons decides which element it is. Atoms of the same element with different numbers of neutrons are called isotopes.",
      "Unstable nuclei give out radiation. Alpha, beta and gamma radiation differ in what they are, their charge and how far they travel.",
    ],
    mistake: "Mixing up proton number and nucleon number. Nucleon number counts protons and neutrons together.",
  },
  gas: {
    explain: [
      "Gas particles move quickly in all directions. Pressure is caused by the particles hitting the walls of the container.",
      "Squash a gas into a smaller volume and the particles hit the walls more often, so the pressure goes up.",
      "Heat a gas and the particles move faster and hit harder, so the pressure rises if the volume cannot change.",
    ],
    mistake: "Using degrees Celsius in gas calculations. Always convert to kelvin by adding 273.",
  },
  states: {
    explain: [
      "In a solid the particles are packed closely in fixed positions and only vibrate. In a liquid they are close but can slide past each other.",
      "In a gas the particles are far apart and move freely, which is why a gas fills its container and can be compressed.",
      "Heating gives the particles more energy. During melting and boiling the temperature stays constant because the energy is used to separate the particles.",
    ],
    mistake: "Saying the particles themselves expand when heated. The particles stay the same size; they move further apart.",
  },
  bonding: {
    explain: [
      "Atoms bond to get a full outer shell of electrons. How they do it depends on whether they are metals or non-metals.",
      "In ionic bonding a metal gives electrons to a non-metal, making oppositely charged ions that attract strongly.",
      "In covalent bonding non-metal atoms share pairs of electrons. The shape of the molecule depends on how those pairs repel each other.",
    ],
    mistake: "Saying covalent bonds break when a simple molecular substance melts. Only the weak forces between the molecules are overcome.",
  },
  acids: {
    explain: [
      "Acids release hydrogen ions in water and alkalis release hydroxide ions. The pH scale runs from 0 to 14, with 7 being neutral.",
      "A lower pH means a stronger acid solution. Each step of 1 on the pH scale is a ten times change in hydrogen ion concentration.",
      "An acid and an alkali neutralise each other to make a salt and water. A titration measures exactly how much is needed.",
    ],
    mistake: "Thinking pH 2 is twice as acidic as pH 4. It is one hundred times more acidic.",
  },
  chemical: {
    explain: [
      "In a chemical reaction atoms are rearranged into new substances. No atoms are made or lost, so the total mass stays the same.",
      "A balanced equation has the same number of each type of atom on both sides. Change only the big numbers in front, never the small numbers in a formula.",
      "Reactions go faster when particles collide more often or with more energy: higher temperature, higher concentration, larger surface area or a catalyst.",
    ],
    mistake: "Changing a formula's subscripts to balance an equation. That changes the substance itself.",
  },
  orbit: {
    explain: [
      "Gravity pulls every mass towards every other mass. It is the force that keeps planets, moons and satellites in orbit.",
      "An orbiting object is always falling towards the body it orbits, but it moves sideways fast enough to keep missing it.",
      "Objects further from the Sun move more slowly and have further to travel, so their year is much longer.",
    ],
    mistake: "Thinking there is no gravity in orbit. Gravity is exactly what holds the object in its orbit.",
  },
  cells: {
    explain: [
      "All living things are made of cells. The nucleus controls the cell, the cell membrane controls what enters and leaves, and mitochondria release energy.",
      "Plant cells have three extra parts: a cell wall for support, chloroplasts for photosynthesis and a large vacuole filled with cell sap.",
      "Cells are too small to see without a microscope. Magnification tells you how many times bigger the image is than the real object.",
    ],
    mistake: "Dividing with different units. Convert millimetres to micrometres (× 1000) before calculating magnification.",
  },
  membranes: {
    explain: [
      "Diffusion is the spreading out of particles from where there are many to where there are few. It needs no energy from the cell.",
      "Osmosis is the diffusion of water through a partially permeable membrane, from a dilute solution to a more concentrated one.",
      "Active transport moves substances from a low concentration to a high one. It needs energy from respiration, like pumping water uphill.",
    ],
    mistake: "Saying water moves to where there is more water. In osmosis water moves towards the more concentrated solution.",
  },
  biomolecules: {
    explain: [
      "Large food molecules are built from smaller units: starch from glucose, proteins from amino acids, and fats from fatty acids and glycerol.",
      "Each one has a food test. Iodine turns blue-black with starch, Benedict's turns brick-red with reducing sugar, and biuret turns purple with protein.",
      "Digestion breaks the large molecules back into the small units so they can be absorbed into the blood.",
    ],
    mistake: "Forgetting to heat the mixture in the Benedict's test. It does not change colour at room temperature.",
  },
  enzymes: {
    explain: [
      "Enzymes are proteins that speed up reactions in living things without being used up.",
      "Each enzyme has an active site with a special shape. Only the right substrate fits, like a key in a lock.",
      "Warmer conditions speed the reaction up to the optimum temperature. Too hot, or the wrong pH, changes the shape of the active site and the enzyme stops working.",
    ],
    mistake: "Saying enzymes are killed by heat. Enzymes are not alive; they are denatured.",
  },
  photosynthesis: {
    explain: [
      "Photosynthesis is how plants make their own food. It happens in chloroplasts, which contain green chlorophyll to absorb light.",
      "The plant takes in carbon dioxide and water and uses light energy to turn them into glucose and oxygen.",
      "The rate depends on light, carbon dioxide and temperature. Whichever is in shortest supply holds the rate back and is called the limiting factor.",
    ],
    mistake: "Saying plants photosynthesise instead of respiring. Plants respire all the time and photosynthesise only in the light.",
  },
  respiration: {
    explain: [
      "Respiration is a chemical reaction in every living cell that releases energy from glucose. It is not the same as breathing.",
      "Aerobic respiration uses oxygen and releases a lot of energy. It happens in the mitochondria.",
      "Anaerobic respiration happens without oxygen and releases much less energy. In muscles it makes lactic acid; in yeast it makes ethanol and carbon dioxide.",
    ],
    mistake: "Writing that respiration “makes” energy. Energy is released from glucose, not created.",
  },
  circulation: {
    explain: [
      "The heart is a muscular pump. The right side sends blood to the lungs and the left side sends it around the body.",
      "Arteries carry blood away from the heart at high pressure, veins bring it back and have valves, and thin-walled capillaries let substances pass in and out.",
      "Red blood cells carry oxygen, white blood cells fight infection, platelets help clotting and plasma carries dissolved substances.",
    ],
    mistake: "Saying all arteries carry oxygenated blood. The pulmonary artery carries deoxygenated blood to the lungs.",
  },
  exchange: {
    explain: [
      "Living things must swap substances such as oxygen, carbon dioxide and water with their surroundings.",
      "Good exchange surfaces have a large surface area, very thin walls and a good supply to keep the concentration difference high.",
      "A small organism has a large surface area compared with its volume, so diffusion is enough. Large organisms need lungs, gills or roots.",
    ],
    mistake: "Saying a bigger organism has a bigger surface area to volume ratio. The ratio gets smaller as size increases.",
  },
  immunity: {
    explain: [
      "Pathogens are microorganisms that cause disease: bacteria, viruses, fungi and protists. They spread through air, water, food and contact.",
      "The skin, mucus and stomach acid keep most pathogens out. White blood cells deal with those that get in by engulfing them or making antibodies.",
      "A vaccine contains a harmless form of the pathogen. The body makes memory cells, so a real infection is fought off quickly.",
    ],
    mistake: "Saying antibiotics kill viruses. Antibiotics only work on bacteria.",
  },
  homeostasis: {
    explain: [
      "Homeostasis means keeping conditions inside the body steady, such as temperature, water and blood glucose.",
      "Receptors detect a change, a coordinator such as the brain decides what to do, and effectors (muscles or glands) carry out the response.",
      "Nerves send fast electrical signals for quick, short responses. Hormones travel in the blood and act more slowly but for longer.",
    ],
    mistake: "Mixing up insulin and glucagon. Insulin lowers blood glucose; glucagon raises it.",
  },
  reproduction: {
    explain: [
      "Body cells divide by mitosis to make two identical cells. This is used for growth, repair and asexual reproduction.",
      "Sex cells, or gametes, are made by meiosis. Each has half the usual number of chromosomes and is genetically different.",
      "At fertilisation two gametes join, so the new cell has the full number of chromosomes again, half from each parent.",
    ],
    mistake: "Mixing up mitosis and meiosis. Meiosis makes gametes; mitosis makes identical body cells.",
  },
  dna: {
    explain: [
      "DNA is the molecule that carries genetic instructions. It is shaped like a twisted ladder, called a double helix.",
      "The rungs of the ladder are pairs of bases. A always pairs with T, and C always pairs with G.",
      "A gene is a length of DNA that codes for one protein. The order of the bases decides the order of amino acids in that protein.",
    ],
    mistake: "Pairing the bases wrongly. Remember A–T and C–G, so the amounts of A and T are always equal.",
  },
  inheritance: {
    explain: [
      "You inherit two copies of each gene, one from each parent. Different versions of a gene are called alleles.",
      "A dominant allele shows even if you have only one copy. A recessive allele shows only if you have two copies.",
      "A Punnett square lists the possible combinations from two parents, so you can work out the chance of each result.",
    ],
    mistake: "Treating the predicted ratio as certain. A 3 : 1 ratio is a probability, not a guarantee for a small family.",
  },
  evolution: {
    explain: [
      "Individuals of the same species are all slightly different, and some of those differences are inherited.",
      "Individuals with features that suit their environment are more likely to survive and have offspring. This is natural selection.",
      "Over many generations the helpful features become more common, and the species gradually changes.",
    ],
    mistake: "Saying organisms change because they need to. Variation comes first by chance; the environment then selects.",
  },
  ecology: {
    explain: [
      "A food chain shows what eats what. It always starts with a producer, usually a green plant, which makes food from sunlight.",
      "Energy is lost at every step through movement, heat and waste, so only about a tenth passes to the next level.",
      "That is why food chains are short and why there are far fewer top predators than plants.",
    ],
    mistake: "Drawing food chain arrows the wrong way. The arrow points from the food to the animal that eats it.",
  },
  classification: {
    explain: [
      "Scientists sort living things into groups by the features they share. The main groups run from kingdom down to species.",
      "Every species has a two-part scientific name. The first part is the genus and the second is the species.",
      "A species is a group of organisms that can breed together to produce fertile offspring.",
    ],
    mistake: "Writing the species name with a capital letter. Only the genus has a capital, as in Homo sapiens.",
  },
  number: {
    explain: [
      "Fractions, decimals and percentages are three ways of writing the same value. One half is 0.5 and 50%.",
      "Powers are a short way to write repeated multiplication: 2⁵ means 2 × 2 × 2 × 2 × 2.",
      "Standard form writes very big or very small numbers as a number between 1 and 10 multiplied by a power of ten.",
    ],
    mistake: "Giving the wrong sign on the power. Numbers smaller than 1 have a negative power of ten.",
  },
  ratio: {
    explain: [
      "A ratio compares parts. To share an amount in the ratio 2 : 3, split it into 5 equal parts and give out 2 and 3 of them.",
      "Two quantities are in direct proportion when doubling one doubles the other.",
      "For a percentage change, find the change, divide by the original value and multiply by 100.",
    ],
    mistake: "Dividing by the new value instead of the original value when finding a percentage change.",
  },
  algebra: {
    explain: [
      "A letter stands for a number you do not know yet. An equation says that two things are equal.",
      "To solve an equation, undo each step in reverse order, always doing the same thing to both sides.",
      "A quadratic has an x² term and usually two solutions. Try factorising first; if that fails, use the quadratic formula.",
    ],
    mistake: "Forgetting to change the sign when a term moves to the other side of the equation.",
  },
  functions: {
    explain: [
      "A function is a rule that turns each input into exactly one output. f(3) means “put 3 into the rule”.",
      "For a composite function such as fg(x), work from the inside out: do g first, then put the answer into f.",
      "An inverse function undoes the original function and takes you back to the number you started with.",
    ],
    mistake: "Applying the functions in the wrong order. In fg(x), g is done first.",
  },
  coordinate: {
    explain: [
      "The gradient of a line measures its steepness: how far it goes up for every 1 it goes across.",
      "In y = mx + c, m is the gradient and c is where the line crosses the y-axis.",
      "Parallel lines have the same gradient. For perpendicular lines the gradients multiply to give −1.",
    ],
    mistake: "Dividing the change in x by the change in y. Gradient is change in y divided by change in x.",
  },
  geometry: {
    explain: [
      "Angles on a straight line add up to 180° and angles in a triangle add up to 180°. Angles around a point add up to 360°.",
      "Similar shapes have the same angles and their sides are in the same ratio. Congruent shapes are exactly the same size.",
      "In a right-angled triangle, the square of the longest side equals the sum of the squares of the other two sides.",
    ],
    mistake: "Using Pythagoras' theorem in a triangle that has no right angle, or forgetting to take the square root at the end.",
  },
  mensuration: {
    explain: [
      "Perimeter is the distance around a shape. Area is the amount of surface inside it, measured in square units.",
      "Volume is the space inside a solid, measured in cubic units. For any prism it is the area of the end multiplied by the length.",
      "For circles, the circumference is π × diameter and the area is π × radius².",
    ],
    mistake: "Using the diameter instead of the radius in the area formula for a circle.",
  },
  trigonometry: {
    explain: [
      "In a right-angled triangle, label the sides from the angle you are using: opposite, adjacent and hypotenuse (the longest side).",
      "SOH CAH TOA reminds you which ratio to use: sine is opposite ÷ hypotenuse, cosine is adjacent ÷ hypotenuse, tangent is opposite ÷ adjacent.",
      "Pick the ratio that links the side you know to the side you want, then rearrange.",
    ],
    mistake: "Leaving the calculator in radians when the question is in degrees.",
  },
  vectorsMath: {
    explain: [
      "A vector has a size and a direction. It is written as a column with a horizontal part on top and a vertical part underneath.",
      "To add vectors, add the top numbers together and the bottom numbers together.",
      "The length of a vector, called its magnitude, comes from Pythagoras' theorem using the two parts.",
    ],
    mistake: "Adding the two parts to get the magnitude. You must square them, add, then square root.",
  },
  sequences: {
    explain: [
      "A sequence is a list of numbers that follows a rule. Each number is called a term.",
      "In an arithmetic sequence you add the same amount every time. That amount is the common difference.",
      "The nth term formula lets you jump straight to any term without writing out all the terms before it.",
    ],
    mistake: "Multiplying the common difference by n instead of (n − 1) in the nth term formula.",
  },
  logs: {
    explain: [
      "A logarithm answers the question “what power do I need?”. log₂ 8 = 3 because 2³ = 8.",
      "Logarithms and powers undo each other, which is why logs are used to solve equations where the unknown is a power.",
      "The log of a product is the sum of the logs, and the log of a power brings the power down to the front.",
    ],
    mistake: "Writing log(a + b) as log a + log b. The rule only works for multiplication: log(ab) = log a + log b.",
  },
  differentiation: {
    explain: [
      "Differentiation finds the gradient of a curve at any point, which tells you how fast something is changing.",
      "To differentiate a power of x, multiply by the power and then reduce the power by one.",
      "Where the gradient is zero the curve is flat. These stationary points are the maximum and minimum points.",
    ],
    mistake: "Forgetting that a constant on its own differentiates to zero.",
  },
  integration: {
    explain: [
      "Integration is the reverse of differentiation. To integrate a power of x, add one to the power and divide by the new power.",
      "An indefinite integral needs “+ c”, because any constant would have disappeared when differentiating.",
      "A definite integral has limits. Substitute the top limit, subtract the result for the bottom limit, and you get the area under the curve.",
    ],
    mistake: "Leaving out the + c in an indefinite integral, or subtracting the limits the wrong way round.",
  },
  probability: {
    explain: [
      "Probability is a number from 0 (impossible) to 1 (certain). It is the number of ways an event can happen divided by the total number of outcomes.",
      "For “A and B” with independent events, multiply the probabilities. For “A or B” with events that cannot happen together, add them.",
      "The probability that something does not happen is 1 minus the probability that it does.",
    ],
    mistake: "Adding probabilities when you should multiply. “And” means multiply for independent events.",
  },
  statistics: {
    explain: [
      "The mean is the total divided by how many values there are. The median is the middle value when they are in order. The mode is the most common value.",
      "The range is the biggest value minus the smallest, and it shows how spread out the data is.",
      "Choose the average that suits the data. One very large or very small value can pull the mean away from a typical value.",
    ],
    mistake: "Finding the median without first putting the values in order.",
  },
};
