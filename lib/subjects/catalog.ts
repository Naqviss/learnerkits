export const subjectSlugs = ["space", "physics", "geography", "biology", "chemistry", "mathematics"] as const;
export type SubjectSlug = (typeof subjectSlugs)[number];

export type SimulationCard = {
  slug: string;
  title: string;
  concepts: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  kind: string;
  outcome: string;
  seoTarget?: string;
  opportunity?: "Very High" | "High" | "Medium" | "Medium–High";
  featured?: boolean;
  visualMode?: "3d" | "simulation" | "game" | "graph";
};

export type SubjectDefinition = {
  slug: SubjectSlug;
  labelKey: SubjectSlug;
  eyebrow: string;
  headline: string;
  description: string;
  prompt: string;
  concepts: string[];
  gradeBand: string;
  learningObjectives: string[];
  simulations: SimulationCard[];
};

export const subjectsCatalog: Record<SubjectSlug, SubjectDefinition> = {
  space: {
    slug: "space",
    labelKey: "space",
    eyebrow: "Space & Astronomy",
    headline: "Pilot spacecraft. Read the sky. Understand gravity.",
    description: "Explore motion on planetary scales through missions and visual models where light, gravity, seasons, and orbital motion become observable.",
    prompt: "How do position, velocity, gravity, and light change what we observe in space?",
    concepts: ["Gravity", "Orbits", "Light & shadow", "Planetary motion"],
    gradeBand: "Grades 7–12",
    learningObjectives: ["Relate force, mass, and acceleration", "Explain orbital and seasonal patterns", "Use visual evidence and telemetry to test predictions"],
    simulations: [
      { slug: "moon-landing", title: "Moon Landing", concepts: "Gravity · thrust · mass · velocity", difficulty: "Intermediate", duration: "8–15 min", kind: "Flight lab", outcome: "Balance thrust and gravity to achieve a controlled lunar landing.", visualMode: "3d" },
      { slug: "orbital-rescue", title: "Orbital Rescue", concepts: "Orbits · delta-v · energy · rendezvous", difficulty: "Advanced", duration: "10–20 min", kind: "Mission simulator", outcome: "Plan burns and interpret orbital telemetry to rendezvous safely.", visualMode: "3d" },
      { slug: "moon-phases-3d", title: "Moon Phases 3D Simulator", concepts: "Moon phases · sunlight · orbit position · viewing angle", difficulty: "Beginner", duration: "5–10 min", kind: "3D simulation", outcome: "Explain why the Moon appears to change phase as its orbital position changes.", seoTarget: "moon phases simulator 3D", opportunity: "Very High", featured: true, visualMode: "3d" },
      { slug: "solar-eclipse-3d", title: "Solar Eclipse 3D Simulator", concepts: "Eclipses · umbra · penumbra · alignment", difficulty: "Beginner", duration: "5–10 min", kind: "3D simulation", outcome: "Predict when a Moon–Earth–Sun alignment can produce a solar eclipse.", seoTarget: "solar eclipse simulator", opportunity: "Very High", visualMode: "3d" },
      { slug: "escape-velocity", title: "Escape Velocity Simulator", concepts: "Gravity · orbital energy · launch speed · escape velocity", difficulty: "Intermediate", duration: "6–12 min", kind: "Interactive simulation", outcome: "Compare circular-orbit and escape speeds for different planets and altitudes.", seoTarget: "escape velocity simulator", opportunity: "Very High", featured: true, visualMode: "simulation" },
      { slug: "gravity-slingshot", title: "Gravity Slingshot Challenge", concepts: "Gravity assist · velocity · trajectory · momentum exchange", difficulty: "Advanced", duration: "8–15 min", kind: "Game + simulation", outcome: "Use a planetary flyby to redirect a spacecraft and change its heliocentric speed.", seoTarget: "gravity slingshot game", opportunity: "High", visualMode: "game" },
      { slug: "keplers-laws-orbit", title: "Kepler's Laws Orbit Simulator", concepts: "Ellipses · orbital period · swept area · semi-major axis", difficulty: "Intermediate", duration: "7–12 min", kind: "3D simulation", outcome: "Connect orbit shape and orbital speed with Kepler’s three laws.", seoTarget: "Kepler's laws simulator", opportunity: "Very High", visualMode: "3d" },
      { slug: "earth-seasons-tilt", title: "Earth Seasons & Tilt Simulator", concepts: "Axial tilt · seasons · sunlight angle · orbit", difficulty: "Beginner", duration: "6–10 min", kind: "3D simulation", outcome: "Explain why Earth’s axial tilt changes sunlight angle and day length across seasons.", seoTarget: "Earth tilt seasons simulator", opportunity: "Very High", featured: true, visualMode: "3d" },
      { slug: "satellite-orbit-builder", title: "Satellite Orbit Builder", concepts: "Altitude · orbital velocity · inclination · period", difficulty: "Intermediate", duration: "8–15 min", kind: "Game + 3D", outcome: "Build a stable satellite orbit by balancing altitude, direction, and velocity.", seoTarget: "satellite orbit simulator", opportunity: "High", visualMode: "3d" },
      { slug: "planet-size-comparison-3d", title: "Planet Size Comparison 3D", concepts: "Planet radius · scale · volume · relative size", difficulty: "Beginner", duration: "4–8 min", kind: "3D explorer", outcome: "Compare planetary radii and volumes using a common visual scale.", seoTarget: "planet size comparison 3D", opportunity: "High", visualMode: "3d" },
      { slug: "black-hole-orbit", title: "Black Hole Orbit Simulator", concepts: "Gravity · orbital speed · event horizon · accretion", difficulty: "Advanced", duration: "8–15 min", kind: "3D simulation", outcome: "Explore how stronger gravity changes the speed and shape of nearby orbits.", seoTarget: "black hole orbit simulator", opportunity: "High", visualMode: "3d" },
      { slug: "mars-landing-challenge", title: "Mars Landing Challenge", concepts: "Mars gravity · drag · thrust · descent", difficulty: "Advanced", duration: "10–18 min", kind: "Physics game + 3D", outcome: "Manage atmospheric braking and powered descent to land safely on Mars.", seoTarget: "Mars landing simulator game", opportunity: "Medium–High", visualMode: "game" },
    ],
  },
  physics: {
    slug: "physics",
    labelKey: "physics",
    eyebrow: "Physics & Engineering",
    headline: "Turn forces, motion, and energy into something you can manipulate.",
    description: "Build intuition by changing measurable variables and seeing equations become motion, current, waves, fields, and structures.",
    prompt: "Which variable changes the physical outcome most, and why?",
    concepts: ["Motion", "Forces", "Energy", "Engineering"],
    gradeBand: "Grades 6–12",
    learningObjectives: ["Predict motion from initial conditions", "Connect forces and energy to measurable change", "Use equations as models, not memorized rules"],
    simulations: [
      { slug: "projectile-lab", title: "Projectile Lab", concepts: "Velocity · angle · gravity · trajectory", difficulty: "Beginner", duration: "5–10 min", kind: "Motion lab", outcome: "Predict how launch speed and angle change range and flight time.", visualMode: "simulation" },
      { slug: "circuit-builder", title: "Circuit Builder", concepts: "Voltage · resistance · current · power", difficulty: "Beginner", duration: "5–10 min", kind: "Electricity lab", outcome: "Use Ohm’s law to explain changes in current and power.", visualMode: "simulation" },
      { slug: "inclined-plane-friction", title: "Inclined Plane & Friction Simulator", concepts: "Normal force · friction · slope angle · acceleration", difficulty: "Intermediate", duration: "6–12 min", kind: "3D simulation", outcome: "Predict when an object will slide and calculate its acceleration on an incline.", seoTarget: "inclined plane friction simulator", opportunity: "Very High", featured: true, visualMode: "3d" },
      { slug: "momentum-collision", title: "Momentum Collision Simulator", concepts: "Momentum · impulse · elasticity · collisions", difficulty: "Intermediate", duration: "6–12 min", kind: "3D simulation", outcome: "Test conservation of momentum across elastic and inelastic collisions.", seoTarget: "momentum collision simulator", opportunity: "Very High", featured: true, visualMode: "3d" },
      { slug: "ray-optics-lens", title: "Ray Optics & Lens Simulator", concepts: "Convex lens · concave lens · focal length · image distance", difficulty: "Intermediate", duration: "7–12 min", kind: "Interactive simulation", outcome: "Trace principal rays and predict image position, size, and orientation.", seoTarget: "lens ray diagram simulator", opportunity: "Very High", visualMode: "simulation" },
      { slug: "newtons-laws-force-lab", title: "Newton's Laws Force Lab", concepts: "Net force · mass · acceleration · action-reaction", difficulty: "Beginner", duration: "6–10 min", kind: "3D simulation", outcome: "Use force diagrams to explain acceleration with Newton’s laws.", seoTarget: "Newton's laws simulator", opportunity: "High", visualMode: "3d" },
      { slug: "simple-machines-challenge", title: "Simple Machines Challenge", concepts: "Levers · pulleys · mechanical advantage · work", difficulty: "Beginner", duration: "7–12 min", kind: "Educational game", outcome: "Choose machine configurations that reduce required input force.", seoTarget: "simple machines game online", opportunity: "High", visualMode: "game" },
      { slug: "wave-interference", title: "Wave Interference Lab", concepts: "Frequency · amplitude · phase · superposition", difficulty: "Intermediate", duration: "6–12 min", kind: "Simulation", outcome: "Predict constructive and destructive interference from wave phase and frequency.", seoTarget: "wave interference simulator", opportunity: "Medium", visualMode: "simulation" },
      { slug: "pendulum-physics", title: "Pendulum Physics Lab", concepts: "Period · length · gravity · amplitude", difficulty: "Beginner", duration: "5–10 min", kind: "Simulation", outcome: "Determine which variables affect a pendulum’s period.", seoTarget: "pendulum simulator online", opportunity: "Medium", visualMode: "simulation" },
      { slug: "energy-track-challenge", title: "Energy Track Challenge", concepts: "Kinetic energy · potential energy · friction · conservation", difficulty: "Intermediate", duration: "7–12 min", kind: "Physics game", outcome: "Design a track that converts potential and kinetic energy to reach a target.", seoTarget: "kinetic potential energy game", opportunity: "High", visualMode: "game" },
      { slug: "electromagnet-3d", title: "Electromagnet 3D Lab", concepts: "Current · turns · magnetic field · solenoid", difficulty: "Intermediate", duration: "7–12 min", kind: "3D simulation", outcome: "Explore how current and coil turns affect electromagnet field strength.", seoTarget: "electromagnet simulator", opportunity: "Very High", visualMode: "3d" },
      { slug: "bridge-builder-challenge", title: "Bridge Builder Physics Challenge", concepts: "Compression · tension · load · structure", difficulty: "Intermediate", duration: "10–20 min", kind: "Engineering game", outcome: "Balance structural forces to support a load with limited material.", seoTarget: "bridge building physics game", opportunity: "High", visualMode: "game" },
    ],
  },
  geography: {
    slug: "geography",
    labelKey: "geography",
    eyebrow: "Geography & Earth",
    headline: "Read Earth as a moving, changing system.",
    description: "Work with tectonics, weather, water, and hazards to connect maps and landscapes with the processes operating beneath and above them.",
    prompt: "How do slow Earth-system processes create visible patterns and sudden hazards?",
    concepts: ["Tectonics", "Weather", "Water systems", "Hazards"],
    gradeBand: "Grades 6–10",
    learningObjectives: ["Interpret Earth processes across different time scales", "Use observations to locate and explain geologic events", "Connect energy and flow to changing landscapes"],
    simulations: [
      { slug: "seismic-wave-lab", title: "Seismic Wave Lab", concepts: "P-waves · S-waves · distance · arrival time", difficulty: "Intermediate", duration: "6–12 min", kind: "Earth lab", outcome: "Use wave-arrival evidence to reason about earthquake distance.", visualMode: "simulation" },
      { slug: "plate-motion-lab", title: "Plate Motion Lab", concepts: "Plate speed · direction · geologic time · displacement", difficulty: "Beginner", duration: "5–10 min", kind: "Tectonics lab", outcome: "Connect slow plate motion with large geologic changes over time.", visualMode: "simulation" },
      { slug: "volcano-eruption-3d", title: "Volcano Eruption 3D Simulator", concepts: "Magma pressure · gas · viscosity · eruption style", difficulty: "Intermediate", duration: "7–12 min", kind: "3D simulation", outcome: "Relate magma properties and gas pressure to different eruption behaviors.", seoTarget: "volcano eruption simulator", opportunity: "Very High", visualMode: "3d" },
      { slug: "earthquake-epicenter-finder", title: "Earthquake Epicenter Finder", concepts: "P-waves · S-waves · triangulation · epicenter", difficulty: "Intermediate", duration: "8–15 min", kind: "Educational game", outcome: "Use three seismic stations to triangulate an earthquake epicenter.", seoTarget: "earthquake epicenter game", opportunity: "Very High", featured: true, visualMode: "game" },
      { slug: "plate-tectonics-3d", title: "Plate Tectonics 3D Explorer", concepts: "Divergent · convergent · transform · subduction", difficulty: "Beginner", duration: "7–12 min", kind: "3D simulation", outcome: "Compare plate-boundary motion and the landforms each boundary can create.", seoTarget: "plate tectonics simulator 3D", opportunity: "Very High", visualMode: "3d" },
      { slug: "tsunami-3d", title: "Tsunami 3D Simulator", concepts: "Seafloor displacement · wave speed · depth · run-up", difficulty: "Intermediate", duration: "7–12 min", kind: "3D simulation", outcome: "Explore how ocean depth and seafloor displacement influence tsunami propagation.", seoTarget: "tsunami simulator", opportunity: "High", visualMode: "3d" },
      { slug: "hurricane-simulator", title: "Hurricane Simulator", concepts: "Sea temperature · pressure · wind · Coriolis effect", difficulty: "Intermediate", duration: "7–12 min", kind: "Simulation", outcome: "Investigate how ocean heat and atmospheric conditions influence hurricane strength.", seoTarget: "hurricane simulator for students", opportunity: "Very High", visualMode: "simulation" },
      { slug: "weather-front-simulator", title: "Weather Front Simulator", concepts: "Air masses · fronts · temperature · precipitation", difficulty: "Beginner", duration: "6–10 min", kind: "Interactive simulation", outcome: "Predict weather changes as warm and cold air masses interact.", seoTarget: "weather fronts simulator", opportunity: "Very High", visualMode: "simulation" },
      { slug: "river-erosion", title: "River Erosion Simulator", concepts: "Flow speed · sediment · slope · erosion", difficulty: "Beginner", duration: "6–10 min", kind: "3D simulation", outcome: "Explain how flow speed and slope change erosion and sediment transport.", seoTarget: "erosion simulator", opportunity: "Very High", visualMode: "3d" },
      { slug: "rock-cycle-challenge", title: "Rock Cycle Challenge", concepts: "Igneous · sedimentary · metamorphic · processes", difficulty: "Beginner", duration: "6–10 min", kind: "Educational game", outcome: "Trace how rocks transform through melting, cooling, pressure, weathering, and deposition.", seoTarget: "rock cycle game", opportunity: "High", visualMode: "game" },
      { slug: "water-cycle-adventure", title: "Water Cycle Adventure", concepts: "Evaporation · condensation · precipitation · runoff", difficulty: "Beginner", duration: "6–10 min", kind: "Educational game", outcome: "Follow water through atmosphere, land, organisms, and oceans.", seoTarget: "water cycle game", opportunity: "Medium", visualMode: "game" },
      { slug: "ocean-currents-3d", title: "Ocean Currents 3D Simulator", concepts: "Temperature · salinity · density · circulation", difficulty: "Intermediate", duration: "7–12 min", kind: "3D simulation", outcome: "Relate temperature and salinity differences to global ocean circulation.", seoTarget: "ocean currents simulator", opportunity: "Very High", featured: true, visualMode: "3d" },
    ],
  },
  biology: {
    slug: "biology",
    labelKey: "biology",
    eyebrow: "Biology & Ecosystems",
    headline: "Watch living systems change from cells to ecosystems.",
    description: "Experiment with transport, genetics, physiology, populations, and ecosystems to see how living systems regulate, reproduce, and adapt.",
    prompt: "How do structure, information, and feedback keep living systems working?",
    concepts: ["Cells", "Genetics", "Physiology", "Ecosystems"],
    gradeBand: "Grades 6–12",
    learningObjectives: ["Connect cell structures to biological functions", "Explain how information flows from DNA to traits", "Interpret feedback and selection in living systems"],
    simulations: [
      { slug: "population-growth", title: "Population Growth", concepts: "Growth rate · carrying capacity · limiting factors", difficulty: "Beginner", duration: "5–10 min", kind: "Ecology lab", outcome: "Explain why population growth slows near carrying capacity.", visualMode: "graph" },
      { slug: "predator-prey", title: "Predator–Prey Dynamics", concepts: "Feedback · cycles · competition · stability", difficulty: "Intermediate", duration: "8–12 min", kind: "Ecosystem lab", outcome: "Interpret how predator and prey populations influence each other over time.", visualMode: "graph" },
      { slug: "animal-cell-3d", title: "Animal Cell 3D Explorer", concepts: "Organelles · cell structure · function · scale", difficulty: "Beginner", duration: "6–10 min", kind: "3D simulation", outcome: "Identify major animal-cell organelles and connect each structure with its function.", seoTarget: "animal cell 3D interactive", opportunity: "High", visualMode: "3d" },
      { slug: "cell-membrane-transport", title: "Cell Membrane Transport Lab", concepts: "Diffusion · osmosis · facilitated diffusion · active transport", difficulty: "Intermediate", duration: "8–15 min", kind: "Simulation + game", outcome: "Predict molecule movement from concentration, permeability, channels, and ATP availability.", seoTarget: "cell membrane transport game", opportunity: "Very High", featured: true, visualMode: "game" },
      { slug: "mitosis-challenge", title: "Mitosis Challenge", concepts: "Cell cycle · chromosomes · mitosis · cytokinesis", difficulty: "Beginner", duration: "6–10 min", kind: "Educational game", outcome: "Sequence mitosis stages and track chromosome behavior through cell division.", seoTarget: "mitosis game online", opportunity: "Medium", visualMode: "game" },
      { slug: "dna-replication", title: "DNA Replication Challenge", concepts: "Base pairing · helicase · polymerase · semiconservative replication", difficulty: "Intermediate", duration: "8–12 min", kind: "3D game", outcome: "Build complementary DNA strands while following the direction and rules of replication.", seoTarget: "DNA replication game", opportunity: "Very High", visualMode: "game" },
      { slug: "protein-synthesis", title: "Protein Synthesis Game", concepts: "Transcription · translation · codons · amino acids", difficulty: "Intermediate", duration: "8–15 min", kind: "Educational game", outcome: "Translate genetic information from DNA to mRNA to an amino-acid sequence.", seoTarget: "protein synthesis game", opportunity: "Very High", featured: true, visualMode: "game" },
      { slug: "human-heart-3d", title: "Human Heart 3D Simulator", concepts: "Chambers · valves · pulmonary flow · systemic flow", difficulty: "Intermediate", duration: "7–12 min", kind: "3D simulation", outcome: "Trace blood through the heart, lungs, and body while relating valves to one-way flow.", seoTarget: "heart blood flow simulator 3D", opportunity: "High", visualMode: "3d" },
      { slug: "natural-selection", title: "Natural Selection Simulator", concepts: "Variation · selection pressure · fitness · allele frequency", difficulty: "Intermediate", duration: "8–15 min", kind: "Simulation", outcome: "Observe how environmental selection changes trait frequencies over generations.", seoTarget: "natural selection simulator", opportunity: "Very High", visualMode: "simulation" },
      { slug: "food-web-builder", title: "Food Web Builder", concepts: "Producers · consumers · trophic levels · energy flow", difficulty: "Beginner", duration: "7–12 min", kind: "Ecosystem game", outcome: "Build a stable food web and predict how removing a species affects the network.", seoTarget: "food web builder game", opportunity: "High", visualMode: "game" },
      { slug: "photosynthesis-lab", title: "Photosynthesis Lab", concepts: "Light · carbon dioxide · temperature · glucose production", difficulty: "Intermediate", duration: "7–12 min", kind: "Simulation", outcome: "Investigate limiting factors that control photosynthesis rate.", seoTarget: "photosynthesis simulator", opportunity: "Very High", visualMode: "simulation" },
      { slug: "immune-system-defense", title: "Immune System Defense", concepts: "Pathogens · innate response · antibodies · memory cells", difficulty: "Intermediate", duration: "10–18 min", kind: "Strategy game", outcome: "Coordinate immune defenses and compare fast innate responses with specific adaptive immunity.", seoTarget: "immune system game", opportunity: "Very High", visualMode: "game" },
    ],
  },
  chemistry: {
    slug: "chemistry",
    labelKey: "chemistry",
    eyebrow: "Chemistry",
    headline: "Change conditions and see matter respond.",
    description: "Connect molecular structure, bonding, concentration, pH, and reaction conditions with interactive particle and laboratory models.",
    prompt: "How does changing matter at the particle level change what we measure?",
    concepts: ["Molecules", "Bonding", "Reactions", "Solutions"],
    gradeBand: "Grades 8–12",
    learningObjectives: ["Relate molecular structure to observable properties", "Use quantitative evidence to reason about reactions and solutions", "Connect particle-level models with laboratory measurements"],
    simulations: [
      { slug: "gas-law-lab", title: "Gas Law Lab", concepts: "Pressure · volume · temperature · moles", difficulty: "Beginner", duration: "5–10 min", kind: "Matter lab", outcome: "Predict pressure and volume changes using the ideal gas relationship.", visualMode: "simulation" },
      { slug: "reaction-rate-lab", title: "Reaction Rate Lab", concepts: "Temperature · activation energy · concentration · half-life", difficulty: "Intermediate", duration: "7–12 min", kind: "Kinetics lab", outcome: "Explain how temperature and concentration influence reaction speed.", visualMode: "graph" },
      { slug: "molecular-geometry-3d", title: "Molecular Geometry 3D Explorer", concepts: "VSEPR · bond angles · lone pairs · molecular shape", difficulty: "Intermediate", duration: "7–12 min", kind: "3D simulation", outcome: "Predict and inspect molecular shapes from electron groups and lone pairs.", seoTarget: "molecular geometry simulator 3D", opportunity: "Very High", featured: true, visualMode: "3d" },
      { slug: "molecule-builder-3d", title: "Molecule Builder 3D", concepts: "Atoms · valence · bonds · molecular models", difficulty: "Beginner", duration: "8–15 min", kind: "3D game", outcome: "Build stable molecules by satisfying common valence and bonding patterns.", seoTarget: "build molecules game", opportunity: "High", visualMode: "game" },
      { slug: "chemical-bonding", title: "Chemical Bonding Challenge", concepts: "Ionic · covalent · electronegativity · valence electrons", difficulty: "Intermediate", duration: "7–12 min", kind: "Game", outcome: "Classify and construct bonds from valence electrons and electronegativity differences.", seoTarget: "chemical bonding game", opportunity: "High", visualMode: "game" },
      { slug: "acid-base-ph", title: "Acid–Base & pH Simulator", concepts: "pH · H⁺ · OH⁻ · strong and weak acids", difficulty: "Intermediate", duration: "7–12 min", kind: "Simulation", outcome: "Relate hydrogen-ion concentration to pH and acid–base strength.", seoTarget: "pH simulator acids bases", opportunity: "Very High", visualMode: "simulation" },
      { slug: "neutralization-station", title: "Neutralization Station", concepts: "Moles · acid–base · endpoint · indicators", difficulty: "Beginner", duration: "7–12 min", kind: "Chemistry game", outcome: "Use particle and mole evidence to reach a neutral endpoint without overshooting.", seoTarget: "acid base neutralization game", opportunity: "High", featured: true, visualMode: "3d" },
      { slug: "titration-simulator", title: "Titration Simulator", concepts: "Equivalence point · indicator · concentration · neutralization", difficulty: "Advanced", duration: "10–18 min", kind: "Interactive simulation", outcome: "Determine an unknown concentration from titration volume and stoichiometry.", seoTarget: "acid base titration simulator", opportunity: "Very High", visualMode: "simulation" },
      { slug: "states-of-matter-3d", title: "States of Matter 3D Lab", concepts: "Particles · phase change · temperature · pressure", difficulty: "Beginner", duration: "6–10 min", kind: "3D simulation", outcome: "Compare particle motion and spacing in solids, liquids, and gases.", seoTarget: "states of matter particle simulator", opportunity: "High", visualMode: "3d" },
      { slug: "solubility-curve", title: "Solubility Curve Simulator", concepts: "Solubility · temperature · saturation · crystallization", difficulty: "Intermediate", duration: "7–12 min", kind: "Simulation", outcome: "Read and manipulate solubility curves to predict saturation and crystal formation.", seoTarget: "solubility curve simulator", opportunity: "Very High", featured: true, visualMode: "graph" },
      { slug: "limiting-reagent", title: "Limiting Reagent Challenge", concepts: "Stoichiometry · mole ratios · excess reagent · yield", difficulty: "Advanced", duration: "8–15 min", kind: "Chemistry game", outcome: "Identify the limiting reactant and predict product yield from mole ratios.", seoTarget: "limiting reagent game", opportunity: "Very High", visualMode: "game" },
      { slug: "balance-equation", title: "Balance the Equation", concepts: "Conservation of mass · coefficients · atoms · reactions", difficulty: "Beginner", duration: "5–10 min", kind: "Chemistry game", outcome: "Balance reaction equations while preserving the number of each atom.", seoTarget: "balancing chemical equations game", opportunity: "Medium", visualMode: "game" },
      { slug: "periodic-table-hunt", title: "Periodic Table Element Hunt", concepts: "Groups · periods · atomic number · element properties", difficulty: "Beginner", duration: "6–10 min", kind: "Game", outcome: "Locate elements from clues about groups, periods, and atomic properties.", seoTarget: "periodic table element game", opportunity: "Medium", visualMode: "game" },
    ],
  },
  mathematics: {
    slug: "mathematics",
    labelKey: "mathematics",
    eyebrow: "Mathematics",
    headline: "See abstract relationships move, rotate, and reshape.",
    description: "Manipulate geometry, probability, functions, calculus, and transformations so mathematical relationships become observable objects.",
    prompt: "What stays invariant when a mathematical representation changes?",
    concepts: ["Geometry", "Functions", "Probability", "Calculus"],
    gradeBand: "Grades 7–12",
    learningObjectives: ["Connect symbolic, graphical, and geometric representations", "Interpret how parameters transform mathematical objects", "Use visual evidence to explain rates, area, and probability"],
    simulations: [
      { slug: "vector-lab", title: "Vector Playground", concepts: "Magnitude · direction · components · addition", difficulty: "Beginner", duration: "5–10 min", kind: "Vector lab", outcome: "Build and add vectors by reasoning from components and direction.", visualMode: "graph" },
      { slug: "function-explorer", title: "Function Explorer", concepts: "Quadratics · coefficients · roots · graphs", difficulty: "Beginner", duration: "5–10 min", kind: "Graph lab", outcome: "Connect quadratic coefficients with graph shape, position, and roots.", visualMode: "graph" },
      { slug: "geometry-slice-3d", title: "3D Geometry Slice Explorer", concepts: "Cross sections · solids · planes · geometry", difficulty: "Intermediate", duration: "7–12 min", kind: "3D simulation", outcome: "Predict the 2D cross section created when a plane slices a 3D solid.", seoTarget: "cross sections of 3D shapes interactive", opportunity: "Very High", visualMode: "3d" },
      { slug: "pythagorean-puzzle", title: "Pythagorean Theorem Puzzle", concepts: "Right triangles · squares · distance · a²+b²=c²", difficulty: "Beginner", duration: "6–10 min", kind: "Math game", outcome: "Use area and distance relationships to solve right-triangle puzzles.", seoTarget: "Pythagorean theorem game", opportunity: "High", visualMode: "game" },
      { slug: "unit-circle-challenge", title: "Unit Circle Challenge", concepts: "Radians · sine · cosine · coordinates", difficulty: "Intermediate", duration: "7–12 min", kind: "Math game", outcome: "Connect angles with unit-circle coordinates, sine, and cosine.", seoTarget: "unit circle game", opportunity: "High", visualMode: "game" },
      { slug: "quadratic-transformation", title: "Quadratic Transformation Challenge", concepts: "Vertex form · translations · stretches · reflections", difficulty: "Intermediate", duration: "7–12 min", kind: "Graph game", outcome: "Match target parabolas by changing quadratic transformation parameters.", seoTarget: "quadratic transformation game", opportunity: "Very High", visualMode: "graph" },
      { slug: "slope-intercept-challenge", title: "Slope Intercept Challenge", concepts: "Slope · intercept · linear equations · graphing", difficulty: "Beginner", duration: "6–10 min", kind: "Graph game", outcome: "Build linear equations that match target lines from slope and intercept clues.", seoTarget: "slope intercept game", opportunity: "High", visualMode: "graph" },
      { slug: "geometry-transformation", title: "Geometry Transformation Game", concepts: "Translation · rotation · reflection · dilation", difficulty: "Beginner", duration: "7–12 min", kind: "Interactive game", outcome: "Apply transformations to move a figure onto a target while preserving specified properties.", seoTarget: "transformations geometry game", opportunity: "High", visualMode: "game" },
      { slug: "probability-experiment", title: "Probability Experiment Lab", concepts: "Experimental probability · theoretical probability · sample size · randomness", difficulty: "Beginner", duration: "6–12 min", kind: "Simulation", outcome: "Compare experimental and theoretical probability as the number of trials increases.", seoTarget: "probability simulator dice coins", opportunity: "Very High", visualMode: "simulation" },
      { slug: "derivative-tangent", title: "Derivative & Tangent Simulator", concepts: "Derivative · slope · tangent line · rate of change", difficulty: "Advanced", duration: "8–15 min", kind: "Simulation", outcome: "Connect the derivative at a point with the slope of the tangent line.", seoTarget: "derivative tangent line simulator", opportunity: "Very High", visualMode: "graph" },
      { slug: "area-under-curve", title: "Area Under Curve Explorer", concepts: "Riemann sums · definite integral · rectangles · area", difficulty: "Advanced", duration: "8–15 min", kind: "Simulation", outcome: "Approximate area with Riemann sums and observe convergence toward a definite integral.", seoTarget: "Riemann sum simulator", opportunity: "Very High", visualMode: "graph" },
      { slug: "matrix-transformation", title: "Matrix Transformation Visualizer", concepts: "Matrices · linear transformations · basis vectors · determinant", difficulty: "Advanced", duration: "8–15 min", kind: "2D/3D simulation", outcome: "Visualize how a 2×2 matrix rotates, scales, shears, and reflects the plane.", seoTarget: "matrix transformation visualizer", opportunity: "Very High", featured: true, visualMode: "3d" },
    ],
  },
};

export function isSubjectSlug(value: string): value is SubjectSlug {
  return (subjectSlugs as readonly string[]).includes(value);
}

export function getSubjectForSimulation(slug: string): SubjectDefinition | undefined {
  return Object.values(subjectsCatalog).find((subject) => subject.simulations.some((simulation) => simulation.slug === slug));
}

export function getSimulationCard(slug: string): SimulationCard | undefined {
  return getSubjectForSimulation(slug)?.simulations.find((simulation) => simulation.slug === slug);
}

export const allSimulations = subjectSlugs.flatMap((slug) => subjectsCatalog[slug].simulations);
export const featuredSimulations = allSimulations.filter((simulation) => simulation.featured);
