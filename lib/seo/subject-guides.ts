import type { SubjectSlug } from "@/lib/subjects/catalog";

// English guide for each subject page, written for that subject alone. It replaces the generic
// "learning journey", "inquiry" and "study tips" blocks that every subject page used to share word for
// word (2026-11-28 clean-up for AdSense: every public page needs 800+ words of its own and no
// repeated text). Each section groups real labs by topic; every fact comes from those labs' models.

export type SubjectGuideSection = {
  /** Topic heading specific to this subject (never a shared heading). */
  title: string;
  /** 60–160 words: what the labs in this group model, with concrete numbers or settings from them. */
  body: string;
  /** Slugs of the labs this section is about (they must belong to the subject). */
  labs: string[];
};

export type SubjectGuide = {
  heading: string;
  /** 50–140 words introducing what this subject's labs let a student do. */
  intro: string;
  sections: SubjectGuideSection[];
};

export const subjectGuides: Partial<Record<SubjectSlug, SubjectGuide>> = {
  space: {
    heading: "Space science, from Moon phases to black holes",
    intro: "The twelve space labs start with what anyone can see from a backyard and work outward. The first group explains the sky itself: why the Moon changes shape through the month, why eclipses are rare and why summer days run long. The middle group turns to orbits and to the speeds that keep a satellite up or send it away for good. The last groups put you at the controls of real mission problems, from a lunar touchdown to a rendezvous 400 km up, and finish with the sizes of the planets and the edge of a black hole.",
    sections: [
      {
        title: "Sun, Earth and Moon in the sky",
        body: "Three labs use the same three bodies and change only what you watch. In Moon Phases 3D you move the Moon along its orbit and see its sunlit half swing toward or away from Earth over a cycle of about 29.5 days. Solar Eclipse 3D adds the tilt of the lunar orbit, which is why most new moons slip above or below the Sun instead of covering it. Earth Seasons & Tilt leaves the Moon out and tilts Earth by 23.4°: at 40° N the midday Sun climbs to roughly 73° in June yet only about 27° in December. Doing phases before eclipses makes the eclipse condition far easier to follow.",
        labs: ["moon-phases-3d", "solar-eclipse-3d", "earth-seasons-tilt"],
      },
      {
        title: "Orbits, escape speed and Kepler’s rules",
        body: "Kepler’s Laws Orbit is the natural starting point. It draws an ellipse with the Sun at one focus, speeds the planet up near perihelion, and lets you test T² = a³ with Mars at 1.52 AU taking close to 1.88 years. Satellite Orbit Builder brings the same physics down to Earth, where a craft 400 km up must travel near 7.7 km/s to stay on a circle but only about 3.07 km/s at geostationary height. Escape Velocity finishes the set by asking how much faster than orbital speed you need to leave altogether. The factor is always √2, so 7.67 km/s for orbit at 400 km becomes 10.85 km/s for escape.",
        labs: ["keplers-laws-orbit", "satellite-orbit-builder", "escape-velocity"],
      },
      {
        title: "Changing orbits on purpose",
        body: "Two challenges turn orbital mechanics into piloting. Orbital Rescue asks you to catch a target with prograde and retrograde burns, and the logic feels backward at first: dropping lower makes you quicker, because one lap at 400 km lasts about 92.4 minutes and one at 430 km about 93.0. Gravity Slingshot works on the scale of the solar system, where a close pass behind a planet moving at 29.78 km/s can add around 7 km/s to a probe’s speed relative to the Sun without burning fuel. Try the satellite builder first, since both challenges assume you already know why lower orbits are faster.",
        labs: ["orbital-rescue", "gravity-slingshot"],
      },
      {
        title: "Touching down on the Moon and on Mars",
        body: "The two landing games share a goal and differ in their air. The Moon has none, so a 7,400 kg lander hovers on about 12,000 N of thrust in gravity of 1.62 m/s² and has to settle below 3 m/s. Mars pulls at 3.71 m/s² and has surface air of only about 0.020 kg/m³, dense enough to heat a capsule but too thin for parachutes to finish the job, so engines handle the last stage. Radio delays of several minutes mean the real descent runs on its own. Flying the Moon first teaches throttle control without drag, which makes the Mars descent easier to read.",
        labs: ["moon-landing", "mars-landing-challenge"],
      },
      {
        title: "Planet sizes and gravity at its most extreme",
        body: "Planet Size Comparison 3D puts every planet on one scale, and the volumes are the surprise: Jupiter is 11 Earths wide yet has room for about 1,300 of them, while Mars, half as wide as Earth, holds only 15% of its volume. Uranus and Neptune sit in between, each about four Earths wide with space for roughly 60 of them. Black Hole Orbit pushes gravity to its limit. Stable circular orbits end at 3 Schwarzschild radii, light alone can circle at 1.5, and the horizon of a 10-solar-mass black hole lies about 29.5 km from the center. Seen together, the two labs show one gravity law acting at very different strengths.",
        labs: ["planet-size-comparison-3d", "black-hole-orbit"],
      },
    ],
  },
  physics: {
    heading: "Physics labs grouped by the law they test",
    intro: "Twenty physics labs cover mechanics, waves, electricity, light and gravity. Most of them reduce a topic to one relationship you can change and measure, such as F = ma, T = 2π√(L/g) or I = V/R, and the groups below put labs that test related laws side by side. A sensible route is forces first, then energy, then oscillations and waves, because each group reuses ideas from the one before it. The gravity and fluid groups at the end apply the same reasoning to planets and to moving water.",
    sections: [
      {
        title: "Forces, friction and collisions",
        body: "Newton’s Laws Force Lab isolates net force: a 25 N push against 5 N of resistance on a 10 kg cart leaves 20 N and an acceleration of 2 m/s². The inclined plane adds a slope, where sliding begins once tan θ is larger than the static friction coefficient; with μₛ = 0.30 that happens near 16.7°, whatever the block weighs. Momentum Collision then looks at what happens during an impact. Total momentum survives while kinetic energy may not, so a 2 kg cart at 3 m/s that sticks to a 3 kg cart keeps 6 kg·m/s but loses 5.4 J.",
        labs: ["newtons-laws-force-lab", "inclined-plane-friction", "momentum-collision"],
      },
      {
        title: "Projectile paths and landing spots",
        body: "Projectile Lab tests the range equation directly. At 45°, raising the launch speed from 10 m/s to 20 m/s stretches the range from 10.2 m to 40.8 m, four times as far for twice the speed. The target simulator turns that into a puzzle: an 18 m/s ball can reach a spot 30 m away on two different arcs, near 33° and near 57°, because angles that add to 90° share a range. Do the open lab first so the two-arc answer is not a surprise.",
        labs: ["projectile-lab", "projectile-target-simulator"],
      },
      {
        title: "Energy, machines and loaded structures",
        body: "Energy Track Challenge follows a cart as height turns into speed: a 4 m drop gives about 8.9 m/s with no friction and about 8.2 m/s when 15% of the energy is lost. Simple Machines shows why a lever or a pulley trades distance for force, so 100 N can raise 400 N if you pull four times as much rope. Bridge Builder studies forces that produce no motion at all, inside a loaded truss: 10 kN on a 6 m span with a 1 m rise puts about 15.8 kN into each sloping member, more than the load itself.",
        labs: ["energy-track-challenge", "simple-machines-challenge", "bridge-builder-challenge"],
      },
      {
        title: "Pendulums, rhythm and interference",
        body: "Pendulum Physics sets out the rule the next three labs rely on: the period depends on length and gravity, so a 1 m pendulum swings in about 2.0 s and a 0.25 m one in about 1.0 s. The pendulum wave hangs a row of slightly different lengths so their phases drift apart and line up again after 60 s, and the designer asks you to pick the reunion time and find string lengths for eight bobs swinging five to twelve times. Wave Interference moves from bobs to overlapping waves, where amplitudes of 1.0 m and 0.6 m give 1.6 m in phase and 0.4 m out of phase.",
        labs: ["pendulum-physics", "pendulum-wave", "pendulum-wave-designer", "wave-interference"],
      },
      {
        title: "Circuits, magnets and lenses",
        body: "Circuit Builder applies I = V/R to series and parallel wiring: a 12 V battery pushes 0.5 A through a 14 Ω resistor and a 10 Ω lamp in series, yet the lamp on its own parallel branch draws 1.2 A. Electromagnet 3D shows a current producing a field, about 3.9 mT inside a 500-turn coil 0.4 m long at 2.5 A, which doubles when the current doubles. Ray Optics & Lens is the light lab: with a 20 cm focal length, an object 30 cm away forms an upside-down image 60 cm behind the lens at twice the size.",
        labs: ["circuit-builder", "electromagnet-3d", "ray-optics-lens"],
      },
      {
        title: "Gravity between planets and stars",
        body: "These three labs share one force law and add bodies one at a time. The planet orbit lab varies how strongly a star pulls on a single planet, giving a steady circle, an inward swoop or an open escape path. Planet Collision releases two planets from rest and shows that a longer fall ends in a faster impact, even though the pull is weaker at the start. N-Body Space then releases as many as 100 bodies that all attract one another, where small differences in spacing lead to very different outcomes and merged bodies carry on with their combined momentum.",
        labs: ["gravity-planet-orbit", "planet-collision-simulator", "n-body-space"],
      },
      {
        title: "Liquids flowing past solid surfaces",
        body: "The two fluid labs look at liquid meeting a solid boundary. In the pipe flow simulator the wall holds the liquid almost still and the speed profile becomes a parabola, so halfway between the center and the wall the flow always runs at three quarters of the center speed. The water impact lab lines up 10 obstacle shapes with equal frontal area in the same current, so any change in drag comes from shape alone through the drag coefficient.",
        labs: ["fluid-dynamics-simulator", "water-impact-simulator"],
      },
    ],
  },
  geography: {
    heading: "Earth science and world geography labs",
    intro: "Geography here covers two kinds of question. The Earth science labs ask how the planet works: why plates move, how seismometers locate an earthquake, what feeds a hurricane and where rainwater goes after it lands. The map labs ask how places are arranged and compared, using real outlines, borders and population figures. Several labs reuse a single measurement in different ways, such as the S–P time gap that appears in both earthquake labs, so it helps to work through each group in order.",
    sections: [
      {
        title: "Plates, volcanoes and the rock cycle",
        body: "Plate Motion Lab sets the timescale: at 5 cm a year a plate covers 50 km in a million years, which is how the Atlantic widened over about 180 million years. Plate Tectonics 3D shows what happens where plates meet, with ridges at divergent boundaries, trenches and volcanic arcs at subduction zones, and offset faults along transform boundaries. Volcano Eruption 3D explains why some volcanoes explode while others pour out lava, comparing basalt near 50% silica with dacite and rhyolite above about 63%. The Rock Cycle Challenge ties these processes to the igneous, sedimentary and metamorphic rocks they leave behind.",
        labs: ["plate-motion-lab", "plate-tectonics-3d", "volcano-eruption-3d", "rock-cycle-challenge"],
      },
      {
        title: "Locating earthquakes and following tsunamis",
        body: "Start with the Seismic Wave Lab, which turns the delay between P-waves and S-waves into a distance: every second of lag adds about 8.4 km, so 33 seconds means roughly 280 km. The Epicenter Finder repeats that at three stations and draws a circle around each one; two circles cross at two points, and only the third circle settles which is real. Tsunami 3D follows the energy into the sea, where a wave over water 4,000 m deep travels near 713 km/h and slows to about 50 km/h in 20 m of water close to shore.",
        labs: ["seismic-wave-lab", "earthquake-epicenter-finder", "tsunami-3d"],
      },
      {
        title: "Fronts, hurricanes and storm tracks",
        body: "Weather Front Simulator contrasts a steep cold front, with towering cumulonimbus and a sudden temperature drop, against a gentle warm front that brings layered cloud and long, light rain. Hurricane Simulator lists what a tropical storm needs, including sea water of at least about 26.5 °C and enough Coriolis spin, which explains why such storms almost never form within about 5° of the equator. The natural disaster map then follows a hypothetical Atlantic storm for five days and shows how a stronger westward steering wind carries its center farther west.",
        labs: ["weather-front-simulator", "hurricane-simulator", "natural-disaster-map"],
      },
      {
        title: "Rivers, rain and deep ocean currents",
        body: "Water Cycle Adventure traces evaporation, condensation, precipitation and the routes water takes across land. River Erosion zooms in on one of those routes and measures how hard moving water pushes on its bed: a channel 1 m deep on a 0.08% slope exerts about 7.85 Pa, enough to roll gravel. Ocean Currents 3D covers the slowest loop of all, a circulation driven by density that sinks cold, salty water in the North Atlantic and near Antarctica and needs about 1,000 years to pass through every ocean.",
        labs: ["water-cycle-adventure", "river-erosion", "ocean-currents-3d"],
      },
      {
        title: "Reading outlines, borders and field clues",
        body: "Four map labs train the eye. The country shape quiz asks you to name an outline from combined clues such as peninsulas, islands and bends in the coast. The world border lab slides a north–south line over real map polygons and counts the countries it cuts through, first on the prime meridian and then 30° farther west. In the border simulator two fictional capitals divide the land by nearest distance, so moving one capital shifts the boundary by half as much. Geography Field Detective writes a field note from landforms, rivers and directions and asks which destination fits every clue at once.",
        labs: ["country-shape-quiz", "world-border-lab", "country-border-simulator", "geography-field-detective"],
      },
      {
        title: "Daylight, climate belts and population change",
        body: "The animated world map follows daylight around the globe as solar noon moves west by about 15° of longitude each hour. The climate zones map uses an idealized gradient of 0.5 °C per degree of latitude, so 3 °C of warming pushes each temperature threshold 6° toward the poles. The population map compares 2000 with 2020 using World Bank estimates, a rise from about 6.16 to 7.85 billion people, with Nigeria up around 69% and Japan ending slightly lower than it began.",
        labs: ["animated-world-map", "climate-zones-map", "population-growth-map"],
      },
    ],
  },
  "environmental-science": {
    heading: "Environmental science and climate labs",
    intro: "The environmental labs connect three scales: a single food web, a landscape that people reshape, and the climate of the whole planet. Many start with arithmetic you can check by hand, such as a forest losing a fixed share each year or a bay replacing a tenth of its water each day. The climate labs then bring in measured values, including the rise in carbon dioxide from about 280 ppm before industrialization to more than 420 ppm today. The city labs at the end ask how communities cope once those changes are under way.",
    sections: [
      {
        title: "Food webs and the limits on populations",
        body: "These four labs begin with who eats whom. Aquarium Food Web takes out the snails that link algae to fish, so the algae spread while the fish lose their only modeled food. The Food Chain Simulator removes foxes from a meadow, and the rabbits that follow overgraze grass the foxes never touched. Ecosystem Survival tracks a predator and its prey together over a long run, where a low prey carrying capacity can leave the predators starving. The population simulator makes carrying capacity explicit: at 20 animals per square kilometer, a 50 km² reserve supports exactly the 1,000 animals released, so any smaller reserve means a shrinking herd.",
        labs: ["aquarium-food-web", "food-chain-simulator", "ecosystem-survival", "population-ecosystem-simulator"],
      },
      {
        title: "Forests, fragmented habitat and rainfall",
        body: "Deforestation Simulator shows how steady clearing compounds over time: taking 2% of whatever forest remains each year leaves about 133 of 1,000 hectares after a century, and each year’s loss is smaller than the last. Biodiversity & Habitat Fragmentation asks what happens to wildlife when one forest is cut into isolated patches, and why land-use change ranks as the largest driver of species loss on land. The deforestation and water cycle lab follows the rain itself, showing how cleared, compacted soil lets less water soak in and sends more of it racing over the surface toward rivers.",
        labs: ["deforestation-simulator", "biodiversity-habitat-fragmentation", "deforestation-water-cycle-simulator"],
      },
      {
        title: "Carbon dioxide, greenhouse warming and footprints",
        body: "The Greenhouse Effect Simulator explains why Earth averages about 15 °C instead of about −18 °C, and the Carbon Cycle Simulator follows emitted CO₂ to its destinations, with land and ocean taking up roughly half and the air keeping the rest. Climate Change Scenarios applies warming to a mountainside, where a lapse rate of 6.5 °C per kilometer moves a temperature boundary about 462 m uphill for 3 °C of warming. The carbon footprint lab brings the totals home: a town of 1,000 residents that halves a 6-tonne annual footprint avoids 90,000 tonnes over 30 years. Start with the greenhouse lab, because the others assume its idea of trapped infrared energy.",
        labs: ["greenhouse-effect-simulator", "carbon-cycle-simulator", "climate-change-scenarios", "carbon-footprint-simulator"],
      },
      {
        title: "Oceans taking the strain",
        body: "Three labs follow what ends up in the sea. Ocean Acidification shows why a pH drop from about 8.2 to 8.1 means roughly 26% more hydrogen ions, since each pH unit is a tenfold step. Sea Level Rise separates warming water from melting land ice and adds sinking land, set against a global rise of about 20 cm between 1901 and 2018. The ocean pollution lab tracks a bay that swaps 10% of its water daily; a tracer starting at 10 mg/L first falls to 1 mg/L or below on day 22, provided nothing new is added.",
        labs: ["ocean-acidification-simulator", "sea-level-rise-simulator", "ocean-pollution-simulator"],
      },
      {
        title: "Clean air, power grids and resilient cities",
        body: "The city labs bring the global picture down to street level. The smog simulator shows how still air, or a warm layer sitting over cooler air, traps traffic and industrial pollution close to the ground. The renewable grid lab asks you to cover the evening, when solar output reaches zero just as demand peaks, using wind, hydropower, storage and backup. The urban heat island lab explains why a large city can average 1–3 °C warmer than its countryside, and the resilience city builder spreads a limited budget across wetlands, drains, flood barriers and warnings while planning for downpours that grow about 7% heavier per degree of warming.",
        labs: ["air-pollution-smog-simulator", "renewable-energy-grid-simulator", "urban-heat-island-simulator", "climate-resilience-city-builder"],
      },
    ],
  },
  chemistry: {
    heading: "Chemistry labs from atoms to reactions",
    intro: "The chemistry labs move from what particles are to how they react and how much of each you need. Early labs build atoms, bonds and molecular shapes. The middle ones treat matter in bulk through gases, changes of state and dissolving. The later ones count moles, balance equations and measure acids and bases. The periodic table and the two naming labs support all of it, because the vocabulary has to come before the calculations make sense.",
    sections: [
      {
        title: "Names, symbols and the periodic table",
        body: "The Interactive Periodic Table orders all 118 elements by proton number and lets you color them by block or family to see why lithium, sodium and potassium behave alike. The two IUPAC naming labs then turn symbols into words. The inorganic one works from charges, so FeCl₃ is iron(III) chloride because three chloride ions need a metal carrying +3. The organic one names carbon chains from the longest chain and the position of the functional group, as in butan-2-ol. Learning the names early saves confusion in every lab that follows.",
        labs: ["periodic-table-hunt", "iupac-inorganic-nomenclature", "iupac-organic-nomenclature"],
      },
      {
        title: "Bonds and the shapes molecules take",
        body: "Chemical Bonding compares handing electrons over with sharing them, using electronegativity gaps of 0 for H₂, 0.96 for HCl and 2.23 for NaCl. Molecule Builder 3D checks how many bonds each atom normally makes: one for hydrogen, two for oxygen, three for nitrogen and four for carbon. Molecular Geometry 3D then predicts shape from electron domains, so methane is tetrahedral at 109.5°, ammonia is pyramidal at about 107° and water is bent at about 104.5°. Build a few molecules before predicting shapes, since the domain count starts from a correct structure.",
        labs: ["chemical-bonding", "molecule-builder-3d", "molecular-geometry-3d"],
      },
      {
        title: "Particles, gas pressure and changes of state",
        body: "States of Matter 3D shows particles vibrating in a solid, sliding past each other in a liquid and spreading apart in a gas, with water melting at 0 °C and boiling at 100 °C at 1 atm. The Gas Law Lab puts numbers on the gas picture through PV = nRT: 1 mol at 300 K in a 25 L chamber gives about 99.8 kPa, and halving the volume doubles that. Seeing the particles first explains why gas laws use kelvin and why pressure is nothing more than collisions with the walls.",
        labs: ["states-of-matter-3d", "gas-law-lab"],
      },
      {
        title: "Dissolving and the speed of reactions",
        body: "The Solubility Curve Simulator reads the largest mass of a salt that dissolves in 100 g of water at each temperature. If solubility falls from 60 g at 50 °C to 36 g at 20 °C, cooling a saturated solution through that range drops 24 g of crystals. The Reaction Rate Lab asks how quickly a change happens rather than how far it goes: warming from 298 K to 308 K raises the rate constant about 1.7 times for an activation energy of 40 kJ/mol, and a catalyst lowers the energy barrier itself instead of adding energy.",
        labs: ["solubility-curve", "reaction-rate-lab"],
      },
      {
        title: "Balancing equations and finding the limiting reagent",
        body: "Balancing Chemical Equations practices the rule behind every equation, that atoms are rearranged and never created, by changing coefficients and leaving formulas alone. Limiting Reagent Challenge then reads those coefficients as mole ratios. With 4 mol of hydrogen and 4 mol of oxygen forming water, hydrogen runs out first, so 4 mol of water forms and 2 mol of oxygen is left unused. Balance first, because a limiting reagent calculation built on an unbalanced equation is wrong from the start.",
        labs: ["balance-equation", "limiting-reagent"],
      },
      {
        title: "Acids, bases, neutralization and titration",
        body: "These three labs build from one idea to a full laboratory method. Acid–Base & pH shows that each pH unit is a tenfold change, with 0.010 mol/L hydrochloric acid at pH 2.00 while acetic acid of the same concentration sits near pH 3.4. Neutralization Station adds sodium hydroxide to the acid in steps of 5 mL, 1 mL and 0.05 mL so you can reach a neutral endpoint without overshooting. The Titration Simulator then turns the measured volume into an unknown concentration: 22.40 mL of 0.100 mol/L NaOH for 25.00 mL of acid gives 0.0896 mol/L.",
        labs: ["acid-base-ph", "neutralization-station", "titration-simulator"],
      },
    ],
  },
  mathematics: {
    heading: "Mathematics labs you can drag and test",
    intro: "The mathematics labs turn equations into shapes you can move. Each one has a target or a live reading that checks your answer, so a wrong guess shows up straight away instead of at the end of a worksheet. They run from fractions and simple equations through graphs, geometry and trigonometry to vectors, matrices, statistics and the first ideas of calculus, and the groups below follow roughly that order.",
    sections: [
      {
        title: "Fractions, equations and growth",
        body: "Equivalent Fractions shows 1/2, 2/4 and 3/6 as equal shaded parts of the same whole and confirms the match by cross-multiplying. The Equation Balance Scale solves 2x + 3 = 11 by lifting 3 off both pans and then splitting each pan in half, which leaves x = 4. Exponential vs Linear Growth compares adding $50 a year with earning 5% a year on $500; the compound plan trails for decades and only pulls ahead in year 27, a useful warning about judging growth too early.",
        labs: ["fraction-visualizer", "algebra-balance-scale", "exponential-growth"],
      },
      {
        title: "Lines, parabolas and their equations",
        body: "Slope Intercept Challenge builds lines from m and b, such as y = 2x − 3 crossing the vertical axis at −3. Systems of Equations puts two lines on one grid, where y = x + 1 and y = −x + 5 meet at (2, 3). Function Explorer moves on to curves, changing a, b and c in ax² + bx + c while the vertex and discriminant update, and the quadratic challenge uses vertex form instead, where y = (x − 2)² − 3 is the basic parabola moved 2 right and 3 down.",
        labs: ["slope-intercept-challenge", "systems-of-equations", "function-explorer", "quadratic-transformation"],
      },
      {
        title: "Angles, areas and moving shapes",
        body: "Triangle Angle Sum shows why angles of 63° and 50° force the third to be 67°, and the Pythagorean puzzle builds squares on the sides of a 5–12–13 triangle so 25 + 144 can be seen to equal 169. Circle Area & Pi rearranges thin sectors into a near-rectangle to explain A = πr². Geometry Transformation sorts moves that keep size from moves that scale it, with a dilation by 2 multiplying area by 4, and the 3D slice explorer cuts solids with a plane to reveal the circles, squares, rectangles and triangles inside them.",
        labs: ["triangle-angle-sum", "pythagorean-puzzle", "circle-area-pi", "geometry-transformation", "geometry-slice-3d"],
      },
      {
        title: "Trigonometry in triangles and on the circle",
        body: "SOH CAH TOA names the three ratios in a right triangle; with a 37° angle and a hypotenuse of 5, the opposite side comes out near 3.01. The Unit Circle Challenge extends those ratios to any angle by reading the point (cos θ, sin θ) on a circle of radius 1, from (1, 0) at 0° round to (0, −1) at 270°. Work through the triangle version first, since the unit circle is that same triangle with its hypotenuse fixed at 1.",
        labs: ["trigonometry-ratios", "unit-circle-challenge"],
      },
      {
        title: "Vectors and matrices on a grid",
        body: "Vector Playground adds arrows by components, so ⟨2, 3⟩ and ⟨1, 1⟩ combine into ⟨3, 4⟩ with a length of 5. Matrix Transformation treats a 2×2 matrix as a rule that moves the whole grid at once: its columns record where the two unit vectors land, [[0, −1], [1, 0]] turns everything 90° counterclockwise, and the determinant tells you how much areas grow or shrink.",
        labs: ["vector-lab", "matrix-transformation"],
      },
      {
        title: "Averages, chance and calculus",
        body: "Mean, Median & Mode works with eleven quiz scores whose mean is about 9.73 while the median and mode are both 10, a reminder that the three averages answer different questions. Probability Experiment flips coins, rolls dice and spins spinners up to 1,000 times, so you can watch results drift toward 1/2 or 1/3 and see that 100 flips often miss 50% by 5 points or more. Derivative & Tangent reads the slope of x² as 2 at x = 1 and −3 at x = −1.5, and Area Under Curve shows 10 midpoint rectangles estimating the area under x² from 0 to 3 as 8.9775, close to the exact 9.",
        labs: ["mean-median-mode", "probability-experiment", "derivative-tangent", "area-under-curve"],
      },
    ],
  },
};

export const getSubjectGuide = (subject: SubjectSlug) => subjectGuides[subject];
