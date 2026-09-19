import { subjectsCatalog, visibleSubjectSlugs, type SimulationCard, type SubjectDefinition } from "@/lib/subjects/catalog";

export type TopicGuide = {
  slug: string;
  title: string;
  target: string;
  subject: SubjectDefinition;
  simulation: SimulationCard;
  answer: string;
  whyItMatters: string;
  investigate: string[];
  method: string[];
  modelNote: string;
  faq: { q: string; a: string }[];
};

type TopicEditorial = Omit<TopicGuide, "slug" | "subject" | "simulation">;

const editorial: Record<string, TopicEditorial> = {
  "moon-phases-3d": {
    title: "Moon phases simulator: why the Moon changes shape",
    target: "moon phases simulator 3D",
    answer: "Moon phases are caused by the changing angle between the Sun, Moon, and observer as the Moon orbits Earth. The Moon is always round; the phase is the portion of its sunlit half that faces us.",
    whyItMatters: "A movable 3D model separates the cause of a phase from the common misconception that Earth’s shadow makes the Moon change shape.",
    investigate: ["Rotate the Moon through a complete orbit and name the phase at each position.", "Keep the light source fixed, then change the observer position and compare what is illuminated.", "Predict the next phase before moving the model to test your explanation."],
    method: ["Place the observer on Earth and identify the direction of sunlight.", "Move the Moon in small steps while watching the lit fraction from the observer.", "Record the orbital position, visible phase, and whether an eclipse is occurring."],
    modelNote: "The scene is a geometry model: distances and sizes are adjusted for visibility, while the illumination relationship is preserved.",
    faq: [
      { q: "What causes Moon phases?", a: "The Moon’s orbital position changes which part of its sunlit half is visible from Earth." },
      { q: "Is a full Moon caused by Earth’s shadow?", a: "No. A full Moon occurs when the visible side is facing the Sun; Earth’s shadow causes a lunar eclipse only during a special alignment." },
    ],
  },
  "escape-velocity": {
    title: "Escape velocity simulator: how launch speed beats gravity",
    target: "escape velocity simulator",
    answer: "Escape velocity is the minimum initial speed needed for an object to move away from a body without additional propulsion, assuming no drag and no later thrust. It depends on the body’s mass and the launch distance from its center.",
    whyItMatters: "Changing planet mass and altitude makes the energy idea visible: a larger gravitational well requires more launch energy.",
    investigate: ["Compare the required speed at the surface and farther from the planet.", "Launch below, at, and above the threshold and inspect the resulting path.", "Compare escape speed with the speed needed for a circular orbit at the same altitude."],
    method: ["Choose a planet and launch altitude.", "Set an initial speed and predict whether the object remains bound.", "Use the trajectory and energy readout to revise the prediction."],
    modelNote: "The model uses ideal two-body gravity and ignores atmosphere, rotation, and staged propulsion so the energy threshold is isolated.",
    faq: [
      { q: "Does escape velocity depend on the object’s mass?", a: "Not in the ideal model. A heavier object needs more total energy, but the threshold speed is the same." },
      { q: "Can an object escape without reaching escape velocity instantly?", a: "Yes, continuous thrust can add energy over time; escape velocity is the equivalent one-time starting-speed threshold." },
    ],
  },
  "earth-seasons-tilt": {
    title: "Earth tilt seasons simulator: why seasons change",
    target: "Earth tilt seasons simulator",
    answer: "Earth’s seasons are primarily caused by its roughly 23.5-degree axial tilt. As Earth orbits the Sun, the tilt changes the angle and duration of sunlight received by each hemisphere.",
    whyItMatters: "The model lets learners hold distance nearly constant while changing tilt, making sunlight angle and day length the key variables.",
    investigate: ["Compare sunlight angle in both hemispheres on the same orbital date.", "Change axial tilt and observe how seasonal contrast changes.", "Check why a hemisphere’s summer has longer days and more direct sunlight."],
    method: ["Select a location and identify its hemisphere.", "Advance Earth around the orbit and record the light angle and day length.", "Explain each seasonal change using tilt rather than Earth–Sun distance."],
    modelNote: "The visualization emphasizes geometry and relative sunlight; it is not a weather or climate forecast.",
    faq: [
      { q: "Are seasons caused by Earth being closer to the Sun?", a: "No. Earth’s axial tilt is the main cause. Both hemispheres experience opposite seasons at the same time." },
      { q: "Why are summer days warmer?", a: "The Sun is higher in the sky and remains above the horizon longer, so energy is concentrated over a larger part of the day." },
    ],
  },
  "inclined-plane-friction": {
    title: "Inclined plane friction simulator: when does an object slide?",
    target: "inclined plane friction simulator",
    answer: "An object begins to slide when the downhill component of gravity exceeds the maximum static friction available at the surface. Once moving, kinetic friction usually provides a different force.",
    whyItMatters: "The incline makes force components observable: increasing the angle increases the downhill component while reducing the normal force.",
    investigate: ["Find the critical angle for several surface materials.", "Compare static and kinetic friction after motion begins.", "Change mass and test which measurements change and which remain the same."],
    method: ["Predict whether the block will remain at rest.", "Increase the slope in small steps until motion starts.", "Use the force vectors and acceleration to explain the result."],
    modelNote: "The model treats the block as a point-like object on a rigid plane and does not include deformation or rolling.",
    faq: [
      { q: "What determines the critical angle?", a: "In the simple model, the critical angle is set by the coefficient of static friction between the surfaces." },
      { q: "Does a heavier block slide faster?", a: "With the same surfaces and angle, mass cancels from the ideal friction equations, so acceleration is approximately independent of mass." },
    ],
  },
  "momentum-collision": {
    title: "Momentum collision simulator: test conservation in crashes",
    target: "momentum collision simulator",
    answer: "In an isolated collision, total momentum before the event equals total momentum after it. Kinetic energy is conserved in elastic collisions but may become sound, heat, or deformation in inelastic collisions.",
    whyItMatters: "The simulator lets learners distinguish a conservation law from the separate question of how much kinetic energy remains useful for motion.",
    investigate: ["Run equal-mass and unequal-mass collisions with the same total momentum.", "Change the restitution and compare speed, momentum, and kinetic energy.", "Predict the final velocity of a sticking collision before running it."],
    method: ["Record each object’s mass and velocity before impact.", "Predict total momentum and classify the collision.", "Compare the prediction with the post-collision readouts."],
    modelNote: "The collision is modeled in one dimension with no external impulse during contact.",
    faq: [
      { q: "Is kinetic energy always conserved in a collision?", a: "No. Momentum is conserved in an isolated system; kinetic energy is conserved only for an ideal elastic collision." },
      { q: "What does restitution represent?", a: "It describes how much relative speed remains after impact compared with before impact." },
    ],
  },
  "earthquake-epicenter-finder": {
    title: "Earthquake epicenter game: triangulate the source",
    target: "earthquake epicenter game",
    answer: "An earthquake epicenter can be located by comparing the arrival-time difference between faster P-waves and slower S-waves at multiple stations. Each station gives a distance; three circles can intersect near the epicenter.",
    whyItMatters: "Triangulation turns a real seismic method into a constraint-solving problem instead of a map-memorization exercise.",
    investigate: ["Use P–S arrival differences to estimate station distance.", "Draw the distance circles and identify where they overlap.", "Add timing uncertainty and decide how precisely the epicenter can be reported."],
    method: ["Read the P-wave and S-wave arrival times at each station.", "Convert the time gap into distance using the provided wave speeds.", "Triangulate the intersection and check it against the hidden answer."],
    modelNote: "The game assumes a simplified, uniform crust and idealized wave speeds; real location services account for layered Earth structure.",
    faq: [
      { q: "Why are three stations needed?", a: "Two distances usually intersect at two possible points; a third station resolves the ambiguity." },
      { q: "What is the difference between focus and epicenter?", a: "The focus is the underground origin of rupture. The epicenter is the point on the surface directly above it." },
    ],
  },
  "ocean-currents-3d": {
    title: "Ocean currents 3D simulator: follow heat and water flow",
    target: "ocean currents 3D simulator",
    answer: "Ocean currents move heat and matter through the ocean. Surface currents are strongly influenced by wind and Earth’s rotation, while density differences from temperature and salinity help drive deeper circulation.",
    whyItMatters: "A 3D flow view connects an abstract global circulation pattern with the local variables that change direction and speed.",
    investigate: ["Trace a parcel of water through a surface current.", "Change wind direction and observe the surface response.", "Compare warm, cold, salty, and fresh water in the density control."],
    method: ["Choose a region and predict the current direction.", "Adjust one driver at a time while keeping the others fixed.", "Explain the resulting flow using wind, rotation, temperature, and salinity."],
    modelNote: "This is an educational flow model, not a forecast or a replacement for measured oceanographic data.",
    faq: [
      { q: "What drives surface ocean currents?", a: "Wind is a major driver, with coastlines and Earth’s rotation redirecting the flow." },
      { q: "Why do temperature and salinity matter?", a: "They change water density, which can cause sinking and rising that contribute to deep circulation." },
    ],
  },
  "greenhouse-effect-simulator": {
    title: "Greenhouse effect simulator: how gases affect heat flow",
    target: "greenhouse effect simulator",
    answer: "Greenhouse gases absorb and re-emit some outgoing infrared radiation, changing the balance between energy arriving from the Sun and energy leaving Earth. The natural greenhouse effect keeps Earth warmer than it would otherwise be.",
    whyItMatters: "The model separates incoming sunlight from outgoing infrared energy so learners can test an energy-balance explanation.",
    investigate: ["Compare incoming and outgoing energy at different gas concentrations.", "Wait for the model to reach a new balance after a change.", "Explain why a warmer surface can still be losing energy to space."],
    method: ["Set a baseline atmosphere and record the surface temperature.", "Change one greenhouse-gas control and predict the direction of change.", "Use the energy arrows to explain the new equilibrium."],
    modelNote: "This is a simplified energy-balance model; it does not reproduce every atmospheric layer, cloud process, or regional climate effect.",
    faq: [
      { q: "Does the greenhouse effect mean heat is trapped forever?", a: "No. Greenhouse gases slow the escape of infrared energy, but Earth still emits energy to space." },
      { q: "Is the natural greenhouse effect harmful?", a: "The natural effect is essential for a habitable surface; the scientific concern is the additional warming from increased concentrations." },
    ],
  },
  "carbon-cycle-simulator": {
    title: "Carbon cycle simulator: track carbon between Earth systems",
    target: "carbon cycle simulator",
    answer: "Carbon moves among the atmosphere, oceans, soil, rocks, and living organisms through processes such as photosynthesis, respiration, decomposition, combustion, and ocean exchange.",
    whyItMatters: "A stock-and-flow model shows why a small imbalance in annual flows can build into a large change in atmospheric carbon over time.",
    investigate: ["Track a carbon atom through multiple reservoirs.", "Change photosynthesis, respiration, combustion, or ocean uptake one at a time.", "Compare a short-term pulse with a sustained change in a flow."],
    method: ["Record the starting carbon stock in each reservoir.", "Change one process and predict which reservoirs respond first.", "Use the time series to identify accumulation and feedback."],
    modelNote: "Reservoir sizes and flows are illustrative learning values rather than a calibrated carbon-budget forecast.",
    faq: [
      { q: "What is a carbon reservoir?", a: "It is a place where carbon is stored, such as the atmosphere, ocean, soil, rocks, or living tissue." },
      { q: "Why can carbon emissions accumulate?", a: "If sources add carbon faster than sinks remove it, the difference increases the stock in the atmosphere." },
    ],
  },
  "ocean-acidification-simulator": {
    title: "Ocean acidification simulator: connect CO₂ and seawater pH",
    target: "ocean acidification simulator",
    answer: "When seawater absorbs more carbon dioxide, chemical reactions increase hydrogen-ion concentration and lower pH. Lower pH can also reduce the carbonate ion availability used by some organisms to build shells and skeletons.",
    whyItMatters: "The simulation links an atmospheric gas change to a chemical equilibrium and then to a biological-material consequence.",
    investigate: ["Compare carbon dioxide uptake with the pH response.", "Inspect hydrogen, bicarbonate, and carbonate changes together.", "Test why a small pH change represents a substantial change in acidity."],
    method: ["Set a baseline CO₂ concentration and record pH.", "Increase dissolved CO₂ while keeping temperature fixed.", "Explain the result using hydrogen ions and carbonate availability."],
    modelNote: "The chemistry is intentionally simplified and does not represent every buffer, organism, temperature, or location in the real ocean.",
    faq: [
      { q: "Does ocean acidification mean the ocean becomes an acid?", a: "No. It means seawater becomes less alkaline as pH decreases; the ocean remains slightly basic on the pH scale." },
      { q: "Why does carbonate matter?", a: "Many shell-building organisms use carbonate ions with calcium to form calcium carbonate structures." },
    ],
  },
  "renewable-energy-grid-simulator": {
    title: "Renewable energy grid simulator: balance supply and demand",
    target: "renewable energy grid simulator",
    answer: "A reliable grid must balance electricity supply and demand continuously. Wind and solar output varies, so storage, flexible generation, transmission, and demand response can help maintain that balance.",
    whyItMatters: "The model reframes renewable integration as a systems problem involving timing, storage, and demand rather than a single technology choice.",
    investigate: ["Match a daily demand curve with wind and solar generation.", "Change storage capacity and inspect curtailment or shortage.", "Compare a calm day with a windy or cloudy day."],
    method: ["Predict the hours when supply will exceed or fall below demand.", "Add storage or flexible generation and run the scenario.", "Explain the reliability result using the balance chart."],
    modelNote: "The grid is an educational dispatch model; it omits local network constraints, market rules, and detailed weather forecasting.",
    faq: [
      { q: "Why does a grid need storage?", a: "Storage can move energy from times of surplus generation to times when demand is higher than current renewable output." },
      { q: "Does more renewable capacity guarantee reliability?", a: "Not by itself. Reliability depends on timing, diversity, storage, transmission, and other balancing resources." },
    ],
  },
  "molecular-geometry-3d": {
    title: "Molecular geometry 3D simulator: predict VSEPR shapes",
    target: "molecular geometry simulator 3D",
    answer: "Molecular geometry depends on how electron groups arrange around a central atom. VSEPR reasoning predicts that electron groups spread out to reduce repulsion; lone pairs can change the observable molecular shape.",
    whyItMatters: "Rotating a molecule makes the difference between electron-domain geometry and molecular geometry easier to see.",
    investigate: ["Count bonding and lone-pair domains around the central atom.", "Compare electron geometry with the positions of bonded atoms.", "Rotate the 3D model and identify bond angles that differ from ideal values."],
    method: ["Choose a molecule and draw its Lewis structure.", "Count electron domains and predict the geometry.", "Use the model to check the shape and explain lone-pair effects."],
    modelNote: "The model uses idealized ball-and-stick geometry; bond lengths, angles, and electron density are not to scale.",
    faq: [
      { q: "What does VSEPR stand for?", a: "Valence Shell Electron Pair Repulsion: electron groups around a central atom arrange to minimize repulsion." },
      { q: "Why can lone pairs change molecular shape?", a: "Lone pairs occupy space around the central atom and repel bonding pairs, changing bond angles and the visible shape." },
    ],
  },
  "molecule-builder-3d": {
    title: "Molecule builder game: build stable molecules in 3D",
    target: "build molecules game",
    answer: "A stable molecule forms when its atoms combine so that each one satisfies its typical valence — often the octet rule for main-group atoms — by sharing or transferring electrons through bonds.",
    whyItMatters: "Building a molecule piece by piece, instead of only labeling a finished diagram, turns valence and bonding capacity into a testable constraint rather than a fact to memorize.",
    investigate: ["Try adding more bonds to an atom than its valence allows and see what happens.", "Compare how many bonds hydrogen, oxygen, and carbon typically form.", "Build the same set of atoms two different ways and check which arrangement is stable."],
    method: ["Pick a target molecule or a set of available atoms.", "Predict how many bonds each atom needs before connecting anything.", "Build the structure and use the model's feedback to fix any unstable atom."],
    modelNote: "The builder enforces common valence and bonding patterns for teaching purposes; it does not model every exception, resonance structure, or expanded-octet case found in real chemistry.",
    faq: [
      { q: "What determines how many bonds an atom can form?", a: "For most main-group atoms, the number of bonds relates to valence electrons and the tendency to reach a stable octet (or a pair, for hydrogen)." },
      { q: "Why did my structure fail?", a: "Usually because an atom has too few or too many bonds for its valence — check each atom's bond count against its typical valence." },
    ],
  },
  "neutralization-station": {
    title: "Acid-base neutralization game: reach the endpoint",
    target: "acid base neutralization game",
    answer: "In a neutralization reaction, acid and base react in stoichiometric proportions. At an ideal strong acid–strong base equivalence point, the acid and base have supplied equal amounts of reacting hydrogen and hydroxide equivalents.",
    whyItMatters: "A game-like endpoint task makes mole ratios, indicators, and the cost of overshooting part of one decision.",
    investigate: ["Predict the volume needed from concentration and stoichiometry.", "Add titrant in large and small steps near the endpoint.", "Compare indicator color, particle counts, and calculated moles."],
    method: ["Read the unknown sample concentration or volume.", "Calculate a target amount before dispensing.", "Approach the endpoint carefully and explain any excess reagent."],
    modelNote: "The station uses idealized strong acid and base behavior; real titrations also depend on activity, temperature, mixing, and indicator choice.",
    faq: [
      { q: "What is the equivalence point?", a: "It is the point where reactants have been combined in the stoichiometric ratio required by the balanced reaction." },
      { q: "Is the endpoint exactly the same as equivalence?", a: "The endpoint is an observed signal, such as an indicator color change, chosen to approximate the equivalence point." },
    ],
  },
  "solubility-curve": {
    title: "Solubility curve simulator: predict saturation and crystals",
    target: "solubility curve simulator",
    answer: "A solubility curve shows the maximum amount of solute that can dissolve in a fixed amount of solvent at each temperature. A solution above the curve is supersaturated in the simplified model and may form crystals.",
    whyItMatters: "Interactive temperature changes turn a graph into a prediction tool for unsaturated, saturated, and crystallizing solutions.",
    investigate: ["Read the solubility at several temperatures.", "Classify a sample as unsaturated, saturated, or supersaturated.", "Cool a hot solution and predict how much solute crystallizes out."],
    method: ["Choose a solute and temperature.", "Use the curve to estimate the maximum dissolved mass.", "Change temperature and compare the graph prediction with the particle view."],
    modelNote: "The curves are instructional datasets and should not be used as laboratory preparation instructions without verified reference data.",
    faq: [
      { q: "What does a point above the solubility curve mean?", a: "It represents more dissolved solute than the model predicts can remain stable at that temperature, so crystallization may occur." },
      { q: "Why does temperature affect solubility?", a: "Temperature changes the energy balance of dissolving; the direction and size of the effect depend on the solute and solvent." },
    ],
  },
  "matrix-transformation": {
    title: "Matrix transformation visualizer: see linear algebra move",
    target: "matrix transformation visualizer",
    answer: "A matrix transformation maps vectors and points to new positions. The matrix columns show where the basis vectors land, revealing how the transformation rotates, scales, shears, or reflects the plane.",
    whyItMatters: "Dragging matrix entries gives a geometric meaning to multiplication, determinant, basis vectors, and invertibility.",
    investigate: ["Change one matrix entry and identify the visual effect.", "Track the unit square and its area after transformation.", "Find a matrix with determinant zero and explain why the plane collapses to a line."],
    method: ["Predict where the basis vectors will move.", "Apply the matrix to the grid and compare the transformed shape.", "Use the determinant and inverse controls to explain area and reversibility."],
    modelNote: "The visualizer uses exact 2D linear transformations; numerical rounding may affect very small values on screen.",
    faq: [
      { q: "What do the columns of a transformation matrix represent?", a: "They are the images of the standard basis vectors, which determine the image of every vector by linearity." },
      { q: "What does a zero determinant mean geometrically?", a: "The transformation loses area and collapses the plane into a lower-dimensional shape, so it has no inverse." },
    ],
  },
};

export function getTopicGuides(): TopicGuide[] {
  return visibleSubjectSlugs.flatMap((subjectSlug) => {
    const subject = subjectsCatalog[subjectSlug];
    return subject.simulations.flatMap((simulation) => {
      if (!simulation.featured || !editorial[simulation.slug]) return [];
      return [{ slug: simulation.slug, subject, simulation, ...editorial[simulation.slug] }];
    });
  });
}

export function getTopicGuide(slug: string) {
  return getTopicGuides().find((guide) => guide.slug === slug);
}
