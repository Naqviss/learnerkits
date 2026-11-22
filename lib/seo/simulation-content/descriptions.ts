import { investigations } from "@/lib/simulations/practical/investigations";
import { mathLabDescriptions } from "./math-labs";

// Meta descriptions for the English simulation pages, written one by one for each lab. Keep them
// 120–158 characters so Google shows them in full, lead with what the visitor will find out, and
// quote the lab's own numbers or controls. Do not build them from a shared template or add a common
// tagline: identical descriptions are flagged by Bing and rewritten by Google, and repeated
// boilerplate is what the September 2026 spam update demoted this site for.
// balance-equation is not listed: it uses balancingSeo.description (lib/seo/balancing-equations.ts).
export const simulationDescriptions: Record<string, string> = {
  ...Object.fromEntries(Object.entries(investigations).map(([slug, lab]) => [slug, lab.description])),
  // Space
  "moon-landing": "Land a 7,400 kg lunar module in one-sixth gravity: set the throttle to hover, cancel sideways drift and touch down upright below 3 m/s.",
  "orbital-rescue": "Catch a target in orbit with short prograde and retrograde burns, and see why dropping to a lower, faster orbit is how a chaser catches up.",
  "moon-phases-3d": "See what causes the phases of the Moon: move it around Earth in 3D, compare the top view with the view from Earth and predict the lit percentage.",
  "solar-eclipse-3d": "Line up the Sun, Moon and Earth in 3D to see why a solar eclipse needs a new moon near an orbital node, and why a closer Moon makes it total.",
  "escape-velocity": "Compare orbit and escape speed for Earth and other worlds, then launch a probe to see why escape velocity is √2 × circular speed: v = √(2GM/r).",
  "gravity-slingshot": "Fly a spacecraft past a moving planet and measure how a gravity assist bends its path and changes its speed around the Sun. Try close and wide passes.",
  "keplers-laws-orbit": "Watch Kepler's three laws at work: compare an Earth-like orbit with a comet at e = 0.8 that speeds up from 7 km/s to 63 km/s as it swings past its star.",
  "earth-seasons-tilt": "Why does Earth have seasons? Tilt the axis 23.4° and compare the noon Sun height and day length at the June and December solstices for any latitude.",
  "satellite-orbit-builder": "How fast must a satellite go? Launch one at 400 km (7.7 km/s, a 92.4-minute orbit) and see how a 1% speed error stretches the circle into an ellipse.",
  "planet-size-comparison-3d": "Compare planet sizes in 3D on one scale: Jupiter is 11 Earths wide yet could hold about 1,300 Earths. Pick any two planets to compare radius and volume.",
  "black-hole-orbit": "Orbit a black hole: find the event horizon, the photon ring and the innermost stable orbit at 3 Schwarzschild radii, and test what changes with mass.",
  "mars-landing-challenge": "Land on Mars, where the air is under 2% as dense as Earth's: fly assisted or on manual throttle to slow from −45 m/s and touch down with fuel left.",
  "gravity-planet-orbit": "Hold a planet's launch speed fixed and change the strength of gravity. A weak pull lets the path swing wide, a strong one drags it in. Find the circle.",
  "n-body-space": "Release up to 100 bodies and let mutual gravity pull them into collisions. Count the mergers and see why tiny differences in spacing change the outcome.",

  // Physics
  "pendulum-wave": "A satisfying pendulum wave: tune a row of pendulums so they drift out of phase into snaking patterns, then watch them swing back into a single line.",
  "projectile-lab": "Launch a ball at any angle and speed to test R = v² sin 2θ / g. See why 45° goes farthest and why doubling speed quadruples range, from 10.2 m to 40.8 m.",
  "circuit-builder": "Wire a battery, resistor and lamp in series or parallel and test Ohm's law, I = V/R: 12 V across 24 Ω drives 0.5 A, and doubling the voltage doubles it.",
  "inclined-plane-friction": "Tilt a ramp until the block slides. Compare mg sin θ with static friction, see why the block's mass cancels, and calculate its acceleration down the slope.",
  "momentum-collision": "Collide two carts and check that momentum is conserved. Make them bounce or stick, and see 9 J of kinetic energy drop to 3.6 J when they lock together.",
  "ray-optics-lens": "Draw ray diagrams for converging and diverging lenses. Move the object past 2f, f and inside f to get real, virtual, inverted and magnified images.",
  "newtons-laws-force-lab": "Push a cart against resistance to test Newton's laws: 25 N against 5 N on 10 kg gives 2 m/s², and balanced forces leave it standing still.",
  "simple-machines-challenge": "Lift a 400 N load with only 100 N of effort. Choose a lever or a pulley, set its mechanical advantage and find the smallest setting that works.",
  "wave-interference": "Add two waves and watch them interfere. Shift the phase from 0° to 180° to turn constructive interference (1.6 m) into destructive interference (0.4 m).",
  "pendulum-physics": "What sets a pendulum's period? Change length, gravity and release angle to test T = 2π√(L/g): a 1 m pendulum takes 2.0 s per swing, a 0.25 m one 1.0 s.",
  "energy-track-challenge": "Drop a roller coaster cart and follow its potential energy turning into kinetic energy and heat. Predict its speed from v = √(2gh), then hit the target.",
  "electromagnet-3d": "Make an electromagnet stronger in 3D: raise the current, add turns or shorten the coil, then check the field strength against B = μ₀NI/L.",
  "bridge-builder-challenge": "Load a bridge truss and see which members are in tension and which in compression. Change the span, rise and cross-section until the sides stop buckling.",

  // Geography and Earth science
  "country-shape-quiz": "Guess countries from their outlines alone. Use coastlines, peninsulas and island chains to rule out the wrong answers in this map shape quiz.",
  "world-border-lab": "Drag a north–south border across a world map and see which countries it splits. Start on the prime meridian, move to 30° west and count the crossings.",
  "geography-field-detective": "Read a field note of mountains, rivers and compass directions, then work out which country it describes as the list of possible places grows.",
  "seismic-wave-lab": "Watch P-waves and S-waves reach a seismometer and use the S − P gap to find how far away an earthquake struck: 280 km gives a 33.3-second delay.",
  "plate-motion-lab": "Tectonic plates move 2–10 cm a year. Set a plate's speed, heading and time span, and see 4 cm a year carry it 320 km in 8 million years.",
  "volcano-eruption-3d": "Change gas content and magma viscosity in a 3D volcano to see why runny basalt makes lava flows while sticky, gas-rich magma blasts out ash plumes.",
  "earthquake-epicenter-finder": "Find an earthquake's epicenter by triangulation: turn the S − P lag at three seismic stations into distances and see where the three circles meet.",
  "plate-tectonics-3d": "Run divergent, convergent and transform plate boundaries in 3D. Predict the landform, then watch ridges, trenches, volcanoes and mountains form.",
  "tsunami-3d": "How fast is a tsunami? Change the ocean depth to test v = √(g × d): about 713 km/h over 4,000 m of water, as fast as a jet, and slower in shallow seas.",
  "hurricane-simulator": "Grow a hurricane over the ocean. Change sea-surface temperature, wind shear and latitude to find the conditions that let a storm organize and spin up.",
  "weather-front-simulator": "Push a cold front or a warm front into another air mass and compare cloud base, lift and rain to see why cold fronts bring sharper, stormier weather.",
  "river-erosion": "Change a river's depth, slope and width to see which grains it can carry. Bed shear stress, τ = ρghS, shows why faster, steeper rivers erode more.",
  "rock-cycle-challenge": "Guide a rock through the rock cycle: cool magma into igneous rock, weather it to sediment, then compact, heat and melt your way around again.",
  "water-cycle-adventure": "Follow one droplet through the water cycle: evaporate from the ocean, condense into a cloud, fall as rain or snow and soak down into groundwater.",
  "ocean-currents-3d": "See how temperature and salinity drive deep ocean currents in 3D. Cool or freshen the polar water and watch which side sinks as its density changes.",

  // Environmental science
  "ecosystem-survival": "Can a predator and its prey survive together for 1,000 years? Change the size of the prey's habitat and watch both populations rise and crash.",
  "climate-change-scenarios": "Warm a mountain by 3 °C and watch a temperature boundary climb about 462 m uphill. Compare warming scenarios and measure how far habitats shift.",
  "aquarium-food-web": "Remove the snails from a model aquarium and follow the ripple effect: algae grow unchecked and the fish lose their food, across three trophic levels.",
  "greenhouse-effect-simulator": "See how the greenhouse effect works: double CO₂ to 560 ppm and watch a 3.7 W/m² energy imbalance warm the surface by about 2.3 °C over 100 years.",
  "carbon-cycle-simulator": "Set human CO₂ emissions against land and ocean sinks for 30 years. At 38 Gt a year the air reaches about 477 ppm; see what halving emissions does.",
  "sea-level-rise-simulator": "Split sea level rise into thermal expansion, melting land ice and sinking land. Run 80 years of warming and see why some coasts face a faster rise.",
  "ocean-acidification-simulator": "Add CO₂ to seawater and watch pH fall as hydrogen ions build up. At double CO₂, pH drops to about 8.02 and carbonate ions fall by over a third.",
  "renewable-energy-grid-simulator": "Keep the lights on after sunset with solar, wind, batteries and gas backup, and see how a 400 MWh battery cuts unmet demand at the evening peak.",
  "air-pollution-smog-simulator": "Compare PM₂.₅ and ozone on a breezy day and on a still day under an inversion, with the same emissions, to see what traps smog near the ground.",
  "deforestation-water-cycle-simulator": "Clear a forest, compact the soil and run a 3-hour storm: water soaking in drops from about 56 mm to 16 mm, and surface runoff rises to about 73 mm.",
  "biodiversity-habitat-fragmentation": "Split a habitat into isolated patches and watch occupancy fall from 40% to 9% in 30 years, then restore wildlife corridors to bring species back.",
  "urban-heat-island-simulator": "Why are cities hotter? Compare a 10% tree-canopy neighborhood at 42.8 °C with the 39 °C region around it, then test trees and cool roofs.",
  "climate-resilience-city-builder": "Split a limited budget between wetlands, drainage, flood barriers and early warnings, then test your city against a 12-hour storm and the heat.",

  // Chemistry
  "gas-law-lab": "Squeeze a sealed gas to test PV = nRT: halve the volume from 25 L to 12.5 L and the pressure doubles from about 100 kPa. Then change the temperature.",
  "reaction-rate-lab": "Does a 10 K rise double a reaction's rate? Change the temperature and add a catalyst, then compare rate constants, half-lives and energy profiles.",
  "molecular-geometry-3d": "Predict molecular shapes with VSEPR theory in 3D. Count bonds and lone pairs, then compare methane's 109.5° with ammonia and many other molecules.",
  "molecule-builder-3d": "Build molecules in 3D from all 118 elements with single, double and triple bonds. Live valence checks show when each atom has the right bonds.",
  "chemical-bonding": "Pair atoms such as Na + Cl or H + Cl and watch electrons transfer or share. Classify each bond as ionic, polar covalent or nonpolar covalent.",
  "acid-base-ph": "Change acid concentration and watch pH shift one unit per tenfold dilution. Compare strong HCl with weak acetic acid at the same concentration.",
  "neutralization-station": "Add NaOH to HCl in 5 mL, 1 mL and 0.05 mL steps to reach a neutral endpoint without overshooting, and watch H⁺ and OH⁻ ions form water.",
  "titration-simulator": "Run an acid–base titration: find the sharp pH jump, add single drops near the endpoint and work out the unknown acid concentration from c × V.",
  "states-of-matter-3d": "Heat particles from −20 °C to 120 °C in 3D: a vibrating solid lattice melts into a sliding liquid, then spreads out as a gas that fills the chamber.",
  "solubility-curve": "Learn to read a solubility curve by experiment: dissolve 80 g of solute at 80 °C, cool the water to 50 °C and predict how many grams crystallize.",
  "limiting-reagent": "Mix hydrogen and oxygen in any amounts and find the limiting reagent. See why 5 mol H₂ with 3 mol O₂ runs out of hydrogen first, not oxygen.",
  "periodic-table-hunt": "Explore all 118 elements on an interactive periodic table. Color it by block or family, and compare lithium, sodium and potassium side by side.",
  // Mathematics
  "vector-lab": "Add vectors by components on a grid: combine ⟨2, 3⟩ and ⟨4, 5⟩ into ⟨6, 8⟩, then read its magnitude of 10 and its direction of 53.1°.",
  "function-explorer": "Change a, b and c in ax² + bx + c and watch the parabola move. Read the discriminant, vertex and roots, and build x² + x − 6 with roots −3 and 2.",
  "geometry-slice-3d": "Slice a cylinder, cube, cone or sphere with a moving plane in 3D and see which cross-section appears: circle, square, rectangle or triangle.",
  "pythagorean-puzzle": "Find the hypotenuse of 3–4–5, 5–12–13 and 8–15–17 right triangles with a² + b² = c², and see the squares on each side add up as areas.",
  "unit-circle-challenge": "Turn an angle around the unit circle in 15° steps and read cos θ, sin θ and radians. Find the exact coordinates at 0°, 90°, 180° and 270°.",
  "quadratic-transformation": "Match three target parabolas with y = a(x − h)² + k: shift the vertex with h and k, then stretch, shrink or flip the curve with a.",
  "slope-intercept-challenge": "Match three target lines with y = mx + b. Set the y-intercept, then the slope, from 2 for y = 2x − 3 down to a falling slope of −1.5.",
  "geometry-transformation": "Translate, rotate, reflect and dilate a triangle on a coordinate grid. See which moves keep lengths and why a scale factor of 2 makes area 4 times larger.",
  "probability-experiment": "Flip coins, roll dice and spin a spinner up to 1,000 times. Watch experimental probability approach 50%, 33.3% and 25% as trials add up.",
  "derivative-tangent": "Move a point along x², x³ and sin(x) to see the tangent line and its slope. Estimate the derivative, then compare it with the exact value.",
  "area-under-curve": "Approximate integrals with up to 50 left, right or midpoint rectangles. Watch 10 midpoint strips estimate the area under x² from 0 to 3 as 8.9775.",
  ...mathLabDescriptions,
  "matrix-transformation": "Set a 2×2 matrix and watch the grid rotate, shear or reflect. See the basis vectors move and the determinant measure how area changes.",
};
