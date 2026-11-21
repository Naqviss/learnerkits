import type { SimulationContent } from "./types";

export const geographyContent: Record<string, SimulationContent> = {
  "seismic-wave-lab": {
    question: "How do P-waves and S-waves show how far away an earthquake is?",
    answer: "The distance to an earthquake comes from the gap between the P-wave and S-wave arrivals at a seismometer. Both waves leave the source together, but P-waves cross the crust at about 6 km/s and S-waves at about 3.5 km/s, so the S-wave falls further behind with every kilometer. At these speeds each second of S–P lag means about 8.4 km of distance, so a 33-second lag puts the earthquake roughly 280 km away.",
    science: [
      "P-waves, or primary waves, are compressional: they squeeze and stretch rock along the direction they travel, like sound. S-waves, or secondary waves, are shear waves that shake rock sideways, at right angles to their path. Rock resists being compressed more strongly than it resists being sheared, so P-waves are always faster. A liquid cannot be sheared at all, which is why S-waves cannot pass through Earth’s liquid outer core.",
      "A P-wave reaches a station 100 km away after 100 ÷ 6 = 16.7 s, and the S-wave after 100 ÷ 3.5 = 28.6 s, a lag of 11.9 s. At 500 km the lag grows to 59.5 s. Because both arrival times are proportional to distance, so is the gap between them: doubling the distance doubles the S–P lag. On a seismogram the P-wave appears as small, quick wiggles and the S-wave as a later, larger burst.",
      "A single station tells you how far away an earthquake was but not in which direction, so agencies such as the US Geological Survey combine readings from many stations to fix its position and depth. Earthquake early-warning systems such as ShakeAlert on the US West Coast use the same speed difference. They detect the fast P-wave near the source and send alerts before the stronger S-waves and surface waves reach cities farther away.",
    ],
    formula: {
      expression: "d = Δt ÷ (1/vS − 1/vP)",
      meaning: "d is the distance to the earthquake in km, Δt is the S–P lag in seconds, and vS and vP are the S- and P-wave speeds in km/s. With 3.5 and 6 km/s, d ≈ 8.4 × Δt.",
    },
    steps: [
      "Leave Source distance at 280 km and press Run. Watch the vertical record: the P-wave arrives first as small wiggles, then the larger S-wave follows.",
      "When the record finishes, read the S − P interval (33.3 s) and the P and S arrival times under the trace. Check them yourself with 280 ÷ 6 and 280 ÷ 3.5.",
      "Predict the S − P interval at half the distance. Set Source distance to 140 km, run again, and test whether the interval halves to about 16.7 s.",
      "Have a partner pick a Source distance and run it while you cover the control. Multiply the S − P interval by 8.4, type your answer into Your distance estimate, then compare.",
    ],
    misconception: {
      myth: "A longer S–P gap means a stronger earthquake.",
      fact: "The S–P lag depends on distance, not magnitude. A small and a large earthquake both 300 km from a station give the same lag of about 36 s; magnitude is judged from the size of the waves instead.",
    },
    modelNote: "Waves travel in straight lines through uniform rock at fixed speeds of 6 and 3.5 km/s, so the arrival times are exact calculations. The wiggly trace is illustrative. Earth’s layered interior, earthquake depth, surface waves and background noise are not modeled.",
    faq: [
      { q: "What is the difference between P-waves and S-waves?", a: "P-waves are compressional waves that push and pull rock in the direction they travel, and they can pass through solids, liquids and gases. S-waves shake rock at right angles to their direction of travel and can only cross solids. In the crust P-waves move at about 6 km/s and S-waves at about 3.5 km/s, so the P-wave always reaches a seismometer first." },
      { q: "Why can’t S-waves travel through Earth’s outer core?", a: "S-waves are shear waves, and a liquid has no rigidity to spring back when it is pushed sideways. Seismologists noticed that S-waves never arrive at stations more than about 104° of arc away from an earthquake. This S-wave shadow zone was key evidence that Earth’s outer core is liquid." },
      { q: "How do you calculate the distance to an earthquake from the S–P time?", a: "Divide the S–P lag by the extra travel time the S-wave needs per kilometer, which is 1/vS − 1/vP. With speeds of 3.5 and 6 km/s that is 0.119 s per km, so distance ≈ 8.4 × lag. A 24-second lag gives about 200 km. Classroom worksheets often use a travel-time graph instead, which allows for faster waves deeper in the Earth." },
      { q: "Which seismic waves cause the most damage?", a: "Surface waves usually do the most damage. Love waves shake the ground side to side, and Rayleigh waves roll it up and down like ocean swell. They travel more slowly than S-waves and arrive last, but they often have the largest amplitude and longest duration at the surface, where buildings stand. The earlier P-wave is often felt only as a sharp jolt." },
    ],
  },

  "plate-motion-lab": {
    question: "How fast do tectonic plates move?",
    answer: "Tectonic plates move about 2 to 10 centimeters per year, roughly as fast as fingernails grow. That seems tiny, but geologic time is long: a plate moving 5 cm per year travels 50 km in a million years and 500 km in 10 million years. Over the roughly 180 million years since the Atlantic Ocean began to open, slow seafloor spreading has carried the Americas thousands of kilometers away from Europe and Africa.",
    science: [
      "Plates are rigid slabs of lithosphere, the crust plus the uppermost mantle, resting on the weaker, slowly flowing asthenosphere. The main driving force is slab pull: old, cold oceanic lithosphere is denser than the mantle beneath it, so it sinks at subduction zones and drags the rest of the plate behind it. Ridge push at mid-ocean ridges adds a smaller force. Plates attached to long sinking slabs, such as the Pacific Plate, tend to move fastest.",
      "Converting plate speeds is a unit problem. Moving 1 cm per year for one million years gives 1,000,000 cm, which is 10 km. A plate moving at 4 cm per year for 8 million years therefore travels 320 km. Direction matters too: if that plate heads 30° north of east, cosine and sine split the distance into about 277 km east and 160 km north.",
      "GPS stations bolted to bedrock now track plate motion directly, to within about a millimeter per year. Longer-term averages come from the seafloor, where magnetic stripes of known age on both sides of a mid-ocean ridge show how fast new crust formed. The Hawaiian–Emperor seamount chain records the Pacific Plate sliding over a hotspot for about 80 million years, and its sharp bend marks a change in direction about 47 million years ago.",
    ],
    formula: {
      expression: "displacement (km) = speed (cm/year) × time (million years) × 10",
      meaning: "Multiplying centimeters per year by millions of years gives millions of centimeters. The factor 10 converts that to kilometers, because 1,000,000 cm equals 10 km.",
    },
    steps: [
      "Keep the defaults (Plate speed 4 cm/year, Elapsed geologic time 8 million years, Heading from east 30°) and predict the total distance. Press Run and read East displacement and North displacement when the track stops.",
      "Check the result with Pythagoras: √(277² + 160²) should match the 320 km you predicted from speed × time × 10.",
      "Set Heading from east to 0° and Elapsed geologic time to 10 million years. Work out the Plate speed needed to travel 500 km, set it, run and compare.",
      "Halve Plate speed to 2.5 cm/year and double Elapsed geologic time to 20 million years. Predict whether East displacement changes, then run and compare with the previous result.",
      "Try Heading from east at 90° and then 180°. Explain why the distance moves entirely into North displacement and then becomes a negative East displacement.",
    ],
    misconception: {
      myth: "Continents plow through the ocean floor like ships through water.",
      fact: "Continents do not push through the seafloor. They are part of plates that also include oceanic lithosphere, and the whole plate moves together, with new seafloor added at ridges and old seafloor destroyed at trenches.",
    },
    modelNote: "The plate moves at a constant speed and heading across a flat local map, so displacement is speed × time split into east and north parts. Real plates rotate about a pole on a curved Earth, change speed and direction over millions of years, and interact with neighbors. Playback is hugely accelerated.",
    faq: [
      { q: "Which tectonic plate moves the fastest?", a: "Among the large plates, the Pacific Plate is one of the fastest, moving northwest at roughly 7 to 10 cm per year relative to the hotspot beneath Hawaii. Parts of the East Pacific Rise spread at about 15 cm per year, and some small plates near Tonga in the southwest Pacific move faster still. The fastest plates are generally those with long subducting slabs pulling on them." },
      { q: "How do scientists measure how fast plates move?", a: "Today the main tool is satellite positioning. Permanent GPS stations fixed to bedrock record their position every day, and over a few years their drift reveals plate speed and direction to within about a millimeter per year. For averages over millions of years, geologists date magnetic stripes and volcanic rocks on the seafloor and divide each rock’s distance from the ridge by its age." },
      { q: "How long would it take a plate to move 1,000 km?", a: "At a typical speed of 5 cm per year a plate moves 50 km every million years, so 1,000 km takes about 20 million years. A slow plate moving 2 cm per year would need 50 million years for the same trip. These timescales explain why continents look fixed in a human lifetime yet have gathered into supercontinents and split apart several times in Earth’s history." },
      { q: "Why can’t we feel tectonic plates moving?", a: "Steady plate motion of a few centimeters per year is far too slow and smooth to sense: about 0.0001 mm per minute. Where plates lock together along a fault, though, the motion is stored as strain in the rock. When the fault finally slips, years or centuries of stored movement can be released in seconds, and that sudden release is what we feel as an earthquake." },
    ],
  },

  "volcano-eruption-3d": {
    question: "Why do some volcanoes erupt explosively while others ooze lava?",
    answer: "Whether a volcano explodes or oozes depends mainly on magma viscosity and dissolved gas. Runny basalt magma, with about 50% silica, lets gas bubbles escape gently, so lava pours out in flows and fountains, as at Kīlauea in Hawaii. Sticky dacite and rhyolite magma, with more than about 63% silica, traps the bubbles. As this magma rises and pressure falls, the gas expands violently and shatters the magma into ash, as at Mount St. Helens in 1980.",
    science: [
      "Magma holds dissolved gases, mostly water vapor with carbon dioxide and sulfur dioxide, much as a sealed soda bottle holds carbon dioxide. Deep underground, high pressure keeps the gas in solution. As magma rises, pressure drops and bubbles form. In fluid magma the bubbles rise and escape, feeding lava fountains and flows. In viscous magma they cannot escape, so pressure builds until the frothy magma fragments into ash and pumice.",
      "Silica controls viscosity. Silicon and oxygen link into chains and networks that make the melt resist flowing, and cooler magma is stiffer still. Basalt erupts at about 1,100–1,200 °C with a viscosity of roughly 10² Pa·s. Rhyolite erupts at roughly 700–850 °C with a viscosity of 10⁸ Pa·s or more, about a million times stiffer. Because the values span so many powers of ten, viscosity is compared on a logarithmic scale.",
      "Volcanologists rank eruptions with the Volcanic Explosivity Index (VEI), a scale from 0 to 8 based mainly on the volume of material erupted, where each step up is roughly ten times larger. Kīlauea’s lava flows usually rate 0 or 1. Mount St. Helens in 1980 rated 5, and Pinatubo in the Philippines in 1991 rated 6, releasing enough sulfur dioxide to cool global average temperatures by about 0.5 °C for around a year.",
    ],
    steps: [
      "Press the Lava flow example (gas 1%, viscosity 10² Pa·s). Watch lava spill down the flanks and note the Eruption style and Gas-retention index readouts.",
      "Press the Ash plume example (gas 6%, viscosity 10⁶ Pa·s). Compare the plume and the short, thick lava with the first run, and note the new Gas-retention index.",
      "Predict which matters more, gas or viscosity. Run Dissolved gas 6% with Log₁₀ magma viscosity 2, then Dissolved gas 1% with viscosity 7, and compare Eruption style for both.",
      "Set Log₁₀ magma viscosity to 6 and Dissolved gas to 0%. Raise the gas one step at a time, pressing Run each time, and record where Eruption style changes to Mixed and then Explosive.",
      "Switch between the Ridge, Crater and Aerial views during an explosive run to see where the ash plume and glowing fragments travel.",
    ],
    misconception: {
      myth: "Volcanic ash is soft, burnt material like ash from a fire.",
      fact: "Volcanic ash is made of tiny shards of rock and volcanic glass less than 2 mm across. It is hard and abrasive, does not dissolve in water, damages jet engines and lungs, and can collapse roofs when it is wet.",
    },
    modelNote: "Eruption style comes from a simple gas-retention index that multiplies dissolved gas by log viscosity and is shown out of 100: below 20 is effusive, above 50 explosive, and mixed in between. The 3D volcano, plume and fragment paths are illustrative. Temperature, silica, wind, fluid dynamics and real hazard zones are not calculated.",
    faq: [
      { q: "What makes magma viscous?", a: "Silica content and temperature control magma viscosity. In silica-rich magma, silicon–oxygen units link into long chains, so the melt resists flowing, and cooler magma is stiffer still. Basalt, with about 45–52% silica and temperatures above 1,100 °C, is runny. Rhyolite, with more than about 69% silica and temperatures near 750 °C, can be a million or more times more viscous. Crystals in the melt add stiffness too." },
      { q: "What are the main types of volcanic eruptions?", a: "Eruptions are grouped from gentle to violent. Hawaiian eruptions produce lava fountains and long flows. Strombolian eruptions throw out bursts of glowing lava clots every few seconds to minutes. Vulcanian eruptions are short, cannon-like blasts of ash from thicker magma. Plinian eruptions, named after Pliny the Younger’s account of Vesuvius in 79 CE, drive ash columns tens of kilometers high for hours." },
      { q: "Can scientists predict volcanic eruptions?", a: "Scientists can often forecast eruptions days to weeks ahead, but not to the exact hour. They watch for swarms of small earthquakes as magma breaks through rock, ground swelling measured by GPS and satellite radar, and rising sulfur dioxide output. Before Pinatubo erupted in 1991, warnings based on this monitoring allowed tens of thousands of people to be evacuated, saving thousands of lives." },
      { q: "What is the most dangerous part of a volcanic eruption?", a: "Pyroclastic flows are usually the deadliest. These avalanches of hot gas, ash and rock can travel faster than 100 km/h at temperatures of several hundred degrees Celsius, so they cannot be outrun. In 1902 a pyroclastic flow from Mount Pelée destroyed the town of Saint-Pierre on Martinique, killing about 28,000 people. Lahars, fast-moving volcanic mudflows, are another major killer." },
    ],
  },

  "earthquake-epicenter-finder": {
    question: "How do you find the epicenter of an earthquake using three seismic stations?",
    answer: "An earthquake epicenter is found by triangulation. Each seismic station measures the delay between the fast P-wave and the slower S-wave, and that S–P lag gives the station’s distance from the earthquake. A circle of that radius around each station marks every possible location. Two circles usually cross at two points, so a third station is needed: the one point where all three circles meet is the epicenter.",
    science: [
      "The method rests on one fact: P-waves outrun S-waves. In crustal rock P-waves travel at about 6 km/s and S-waves at about 3.5 km/s, so every kilometer of distance adds about 0.119 s to the gap between their arrivals. A station that records a 24-second lag must be about 200 km from the source, but the lag alone gives no direction. That is why each station contributes a circle rather than a point.",
      "Strictly, the technique is trilateration, because it uses distances rather than angles, although most textbooks call it triangulation. With perfect data the three circles meet at a single point. Real readings carry small timing errors, so the circles usually enclose a small triangle instead, and the best estimate lies inside it. Seismologists improve the fit by using dozens of stations and solving for the earthquake’s depth and origin time at the same time.",
      "Locating earthquakes quickly matters for public safety. National and global networks, such as those run by the US Geological Survey, publish a first location within minutes of a large earthquake. That location decides whether a tsunami warning is issued, where emergency teams are sent, and which faults are active. Over decades, plotted epicenters trace the edges of tectonic plates around the world.",
    ],
    formula: {
      expression: "r = Δt ÷ (1/3.5 − 1/6) ≈ 8.4 × Δt",
      meaning: "r is the radius of a station’s distance circle in kilometers and Δt is that station’s S–P lag in seconds, using S- and P-wave speeds of 3.5 and 6 km/s.",
    },
    steps: [
      "Choose Event A in Earthquake event and set Distance rings to Hide rings. Read ALPHA · S − P, BRAVO · S − P and CHARLIE · S − P.",
      "Predict which station is closest to the earthquake, then multiply each lag by 8.4 to get its distance in kilometers. Use the map grid to sketch each distance around its station.",
      "Place the crosshair where all three distances fit: drag it on the map, use the arrow keys, or type values into Marker east coordinate and Marker north coordinate.",
      "Set Distance rings to Show rings. Check whether your marker sits on the single point where all three circles cross, and adjust it if it does not.",
      "Repeat with Event B and Event C. Compare how each station’s S − P value changes as the epicenter moves closer to it or farther away.",
    ],
    misconception: {
      myth: "The epicenter is the place underground where an earthquake starts.",
      fact: "The rupture begins at the focus, or hypocenter, which can lie anywhere from near the surface to about 700 km deep. The epicenter is the point on Earth’s surface directly above the focus.",
    },
    modelNote: "Stations and earthquakes sit on a flat, fictional 600 × 350 km map, with each earthquake at the surface and constant P and S speeds of 6 and 3.5 km/s, so the rings meet exactly. Real location methods also solve for depth and origin time, use a layered Earth, and must handle timing errors from many stations.",
    faq: [
      { q: "Why do you need three seismic stations to locate an earthquake?", a: "One station gives only a distance, so the earthquake could lie anywhere on a circle around it. A second station’s circle usually crosses the first at two points. A third circle passes through only one of them, which identifies the epicenter. Real networks use many more stations, because extra readings reduce the effect of timing errors and reveal the earthquake’s depth." },
      { q: "How do you read P-wave and S-wave arrivals on a seismogram?", a: "On a seismogram the trace is nearly flat until the P-wave arrives as a set of small, rapid wiggles. The S-wave arrives later with larger swings, and the surface waves that follow are usually the biggest of all. Mark the first motion of the P-wave and of the S-wave, read both times from the time axis, and subtract to get the S–P interval." },
      { q: "How accurate are earthquake locations?", a: "Where seismic networks are dense, as in California or Japan, epicenters of well-recorded earthquakes are often accurate to within a kilometer or two. In remote oceans or regions with few stations, errors of 10 km or more are common. Depth is usually the hardest value to pin down, because all the stations sit on the surface above the source." },
      { q: "Is the shaking always strongest at the epicenter?", a: "Not always. Shaking is usually strongest near the epicenter, but large earthquakes rupture faults hundreds of kilometers long, so severe damage can occur far away along the rupture. Soft ground also amplifies shaking. In 1985 Mexico City suffered heavy damage about 350 km from the epicenter because it is built on soft old lake-bed sediments." },
    ],
  },

  "plate-tectonics-3d": {
    question: "What happens at divergent, convergent and transform plate boundaries?",
    answer: "At divergent boundaries plates move apart and rising magma forms new crust, building mid-ocean ridges and rift valleys. At convergent boundaries plates move together: dense oceanic plate sinks in a subduction zone, creating a deep trench and a chain of volcanoes, or two continents collide and push up mountains. At transform boundaries plates slide past each other sideways, offsetting the land along faults such as the San Andreas Fault in California.",
    science: [
      "As plates separate at a divergent boundary, pressure on the hot mantle below drops and some of it melts. The basalt magma rises, erupts and cools into new oceanic crust, so the youngest seafloor lies along ridge crests. The Mid-Atlantic Ridge opens about 2–5 cm per year, and Iceland sits right on top of it. On land, rifting can split a continent apart, as in the East African Rift.",
      "When oceanic lithosphere meets another plate, the older, colder and denser slab bends and sinks into the mantle. The Mariana Trench, formed this way, is almost 11,000 m deep. As the slab reaches about 100 km depth, water released from its minerals lowers the melting point of the mantle above, feeding volcanic arcs such as the Andes. Continental crust is too buoyant to sink far, so continent–continent collision builds mountains like the Himalayas instead.",
      "Transform boundaries neither create nor destroy lithosphere. Most link offset sections of mid-ocean ridges, but a few cross continents. Along the San Andreas Fault the Pacific Plate moves northwest past the North American Plate at about 5 cm per year across the whole boundary zone. Friction locks the fault for decades and then releases the strain in earthquakes, such as the 1906 San Francisco earthquake.",
    ],
    steps: [
      "Set Plate boundary to Divergent and predict the landform. Select your prediction in Identify the landform, then press Run and watch the plates pull apart above the rising magma.",
      "Switch Plate boundary to Convergent and run again. Use Rotate left and Rotate right to view the cross-section from the side and find the sinking slab and the volcano growing above it.",
      "Set Plate boundary to Transform and run. Confirm that the Motion readout says Slide past and that no ridge or volcano forms as the plates move sideways.",
      "Run one boundary with Relative motion at 2 cm/year and then at 10 cm/year. Predict how much farther the plates move in the faster run, then compare the two.",
    ],
    misconception: {
      myth: "Earth’s plates float on an ocean of molten lava.",
      fact: "The mantle beneath the plates is almost entirely solid rock. The asthenosphere is hot enough to flow very slowly, like putty, over millions of years, and only a tiny fraction of it is melted.",
    },
    modelNote: "Each boundary is a kinematic cross-section: blocks move apart, together or sideways at the chosen rate, while the ridge, sinking slab and volcano are drawn rather than calculated. The convergent case shows oceanic subduction only. Mantle convection, earthquakes and continental collision are not modeled, and motion and heights are exaggerated. The landform menu records a prediction but does not grade it.",
    faq: [
      { q: "What landforms are created at each type of plate boundary?", a: "Divergent boundaries create mid-ocean ridges, rift valleys and eventually new ocean basins. Ocean–continent convergence creates trenches and volcanic mountain ranges such as the Andes, while ocean–ocean convergence builds island arcs such as the Mariana Islands. Continent–continent collision raises fold mountains like the Himalayas. Transform boundaries create long fault lines with offset streams and ridges." },
      { q: "Why are there no volcanoes at transform boundaries?", a: "Volcanoes need magma, and transform boundaries have no way to make it. The plates slide horizontally, so the mantle is neither decompressed as at a ridge nor supplied with water from a sinking slab as at a subduction zone. Transform faults instead produce frequent shallow earthquakes, because friction locks the plates until the stored strain releases suddenly." },
      { q: "How were the Himalayas formed?", a: "The Himalayas formed when the Indian Plate collided with the Eurasian Plate, beginning about 50 million years ago. Both plates carry thick, buoyant continental crust, so neither sinks far; instead the crust crumples, folds and stacks up. India still pushes north at about 4 cm per year, and Mount Everest, at 8,849 m, is still rising by a few millimeters each year." },
      { q: "What is subduction?", a: "Subduction is the sinking of one tectonic plate beneath another into the mantle at a convergent boundary. The sinking plate is almost always oceanic, because old oceanic lithosphere is denser than the mantle while continental crust is too light to sink far. Subduction zones produce the deepest trenches, explosive volcanoes and the largest earthquakes on record, including the magnitude 9.5 Chile earthquake of 1960." },
    ],
  },

  "tsunami-3d": {
    question: "How fast does a tsunami travel across the ocean?",
    answer: "A tsunami’s speed depends on the depth of the water. In the open ocean it moves as a shallow-water wave with speed v = √(g × d), so over a typical seafloor 4,000 m deep it travels about 198 m/s, or 713 km/h, close to the speed of a jet airliner. Near the coast it slows sharply: in 20 m of water it moves at only about 50 km/h, and the slowing wave grows taller as it piles up.",
    science: [
      "A tsunami starts when the seafloor suddenly moves, usually during a large undersea earthquake at a subduction zone, and lifts the whole column of water above it. Underwater landslides and volcanic eruptions can also trigger one. The resulting waves can be more than 100 km long, far longer than the ocean is deep, so the entire water column moves. Waves like this behave as shallow-water waves even in the deepest ocean.",
      "For such long waves, speed depends only on gravity and depth: v = √(g × d). Because of the square root, quartering the depth halves the speed, from about 713 km/h at 4,000 m to 357 km/h at 1,000 m. As the wave slows over the continental shelf, its energy is squeezed into a shorter wave, so its height rises. Green’s law says amplitude grows with the fourth root of the depth ratio, so a 1 m wave from 4,000 m water grows to about 3.8 m at 20 m.",
      "The square-root rule lets warning centers predict arrival times hours in advance. After the 1960 Chile earthquake, the tsunami crossed the Pacific to strike Hilo, Hawaii, about 15 hours later and reached Japan after about 22 hours. Today, DART buoys anchored in the deep ocean detect the tiny pressure change of a passing tsunami, and forecast models run over detailed seafloor maps to estimate wave heights at each coast.",
    ],
    formula: {
      expression: "v = √(g × d)",
      meaning: "v is the wave speed in m/s, g is gravitational acceleration (9.81 m/s²) and d is the water depth in meters. Multiply v by 3.6 to convert it to km/h.",
    },
    steps: [
      "Start with Offshore water depth at 4,000 m and read Deep-water speed (713 km/h). Predict whether halving the depth halves the speed, then set 2,000 m and compare.",
      "Set Offshore water depth to 1,000 m, a quarter of the original. Check whether Deep-water speed falls to about half, near 357 km/h.",
      "Return to 4,000 m with Distance to coast at 200 km. Calculate the travel time, enter it in Your travel-time estimate, then press Run and compare with Simulated elapsed at the end.",
      "Raise Initial wave amplitude from 1 m to 2 m and note 20 m shelf amplitude. Then set the depth to 1,000 m and explain why the wave now grows less on the shelf.",
      "Switch to the Wave view and then the Coast view during a run to follow the wave from deep water onto the shallow shelf.",
    ],
    misconception: {
      myth: "A tsunami is a giant breaking wave that is easy to spot far out at sea.",
      fact: "In the deep ocean a tsunami is usually less than 1 m high and stretched over 100 km or more, so ships barely notice it pass. It only becomes tall and dangerous as it slows in shallow water near the coast.",
    },
    modelNote: "Speed uses v = √(g × d) over a constant offshore depth, so travel time is distance ÷ speed. Shelf height uses Green’s-law shoaling to a fixed 20 m depth. The 3D coast and town are scenery with exaggerated heights; reflections, wave breaking, run-up and coastal flooding are not solved. Never use it for evacuation decisions.",
    faq: [
      { q: "How do scientists simulate tsunamis?", a: "Tsunami simulations solve the shallow-water equations, which describe how a long wave moves over a seafloor of changing depth. Forecasters feed in the earthquake’s size and location, plus pressure readings from deep-ocean DART buoys, and run the model over detailed maps of the seafloor and coastline. NOAA’s MOST model works this way, producing expected arrival times and wave heights for coastal communities." },
      { q: "Why does a tsunami get taller near the shore?", a: "As a tsunami moves into shallower water it slows down, but the energy it carries cannot simply disappear. The front of the wave slows first while the water behind is still moving fast, so the wave shortens and its height grows. A wave less than a meter high in the open ocean can rise to several meters at the coast, and narrow bays can funnel it higher still." },
      { q: "What are the warning signs of a tsunami?", a: "Natural warnings include strong or long-lasting ground shaking near the coast, a loud roar from the ocean, and the sea suddenly drawing back to expose the seafloor. The drawback happens when the trough of the wave reaches shore first. If any of these occur, move inland or to high ground at once without waiting for an official alert, and stay away until authorities give the all-clear." },
      { q: "How long does it take a tsunami to reach the coast?", a: "It depends on distance and depth. A tsunami that starts 200 km offshore over water 4,000 m deep reaches the coast in about 17 minutes, leaving very little time for warnings. Crossing a whole ocean takes many hours; in 2004 the Indian Ocean tsunami reached Sri Lanka about two hours after the earthquake. Several waves usually follow, and the first is often not the largest." },
    ],
  },

  "hurricane-simulator": {
    question: "What conditions does a hurricane need to form?",
    answer: "A hurricane needs warm ocean water of at least about 26.5 °C, moist air, weak vertical wind shear and enough spin from Earth’s rotation. Warm water evaporates and fuels thunderstorms with heat released as the vapor condenses. Low shear keeps the storm’s column upright, and the Coriolis effect, which is zero at the equator, starts the rotation. That is why hurricanes almost never form within about 5° of the equator.",
    science: [
      "A hurricane works like a heat engine. Warm seawater evaporates into the air, and when that moist air rises inside thunderstorms the vapor condenses, releasing latent heat. The heated air rises faster, surface pressure falls, and more moist air spirals inward to replace it. While the storm stays over warm water and keeps its structure, this feedback continues. Over land or cooler water the fuel supply is cut off and the storm weakens.",
      "Earth’s rotation deflects moving air, and the Coriolis parameter measures how strongly. At 20° latitude it is about 5.0 × 10⁻⁵ s⁻¹, at 5° only 1.3 × 10⁻⁵ s⁻¹, and at the equator zero. Air flowing toward low pressure is turned to the right in the Northern Hemisphere, so the inflow curls into a counterclockwise spiral; south of the equator storms turn clockwise. Strong vertical wind shear, a change in wind speed or direction with height, tilts the storm and can tear its structure apart.",
      "Once sustained winds reach 119 km/h (74 mph), a tropical storm becomes a hurricane in the Atlantic and northeast Pacific, a typhoon in the northwest Pacific, and a cyclone in the Indian Ocean and South Pacific. These are the same kind of storm with different regional names. In the United States, water from storm surge and flooding rain, rather than wind, has caused most hurricane deaths.",
    ],
    formula: {
      expression: "f = 2Ω sin φ",
      meaning: "f is the Coriolis parameter in s⁻¹, Ω is Earth’s rotation rate (7.29 × 10⁻⁵ s⁻¹) and φ is latitude. It is positive in the Northern Hemisphere, negative in the Southern and zero at the equator.",
    },
    steps: [
      "Run the default storm (Sea-surface temperature 27 °C, Vertical wind shear 15 m/s, Latitude 20°). Note the Organization index and Environment readouts, and predict which single change would help the storm most.",
      "Set Sea-surface temperature to 29 °C and Vertical wind shear to 5 m/s, then run. Compare the Organization index and the spiral bands with the first run.",
      "Keep those settings but raise Vertical wind shear to 30 m/s. Predict the Environment readout before you run, then explain why the storm falls apart over warm water.",
      "Set Vertical wind shear back to 5 m/s and change Latitude to 5° and then 0°. Watch the Coriolis parameter shrink to zero and the Organization index fall with it.",
      "Set Latitude to −20° and run. Compare the spin direction shown on the satellite view and the sign of the Coriolis parameter with the Northern Hemisphere storm.",
    ],
    misconception: {
      myth: "Hurricanes can form anywhere the sea is warm enough, even right on the equator.",
      fact: "Even over very warm water, hurricanes almost never form within about 5° of the equator, because the Coriolis effect there is too weak to start rotation. Air flows straight into the low and fills it instead of spiraling around it.",
    },
    modelNote: "The organization index multiplies three factors from 0 to 1: water warmth above 26 °C (full at 30 °C), Coriolis rotation (full by 10° latitude) and low shear (zero at 30 m/s). It is not a wind-speed or intensity forecast. Humidity, ocean heat depth, land and steering winds are left out, and the satellite view is illustrative.",
    faq: [
      { q: "How do scientists simulate hurricanes?", a: "Forecasters use computer models that divide the atmosphere and ocean into a three-dimensional grid and solve the equations for air motion, heat and moisture at every point. Models such as the US GFS and HAFS are fed with satellite data, weather balloons and measurements from aircraft flying into the storm. Running many versions with slightly different starting conditions, called an ensemble, shows the range of likely tracks." },
      { q: "What is the Saffir–Simpson hurricane scale?", a: "The Saffir–Simpson scale rates hurricanes from Category 1 to 5 by one-minute sustained wind speed. Category 1 covers 119–153 km/h (74–95 mph), Category 3 starts at 178 km/h (111 mph) and counts as a major hurricane, and Category 5 means winds of 252 km/h (157 mph) or more. The scale ignores storm surge, rainfall and storm size, which can make a low-category hurricane very dangerous." },
      { q: "Why do hurricanes spin in opposite directions in each hemisphere?", a: "Air rushing toward a hurricane’s low-pressure center is deflected by the Coriolis effect, to the right in the Northern Hemisphere and to the left in the Southern Hemisphere. The deflected inflow curls into a counterclockwise spiral north of the equator and a clockwise spiral south of it. The same effect is far too weak to control which way water drains from a sink." },
      { q: "Why is the eye of a hurricane calm?", a: "In the eye, air sinks slowly from high altitude and warms as it descends, which clears the clouds and suppresses storms. Around it, the eyewall holds the strongest winds and heaviest rain. Most eyes are about 30–60 km across. When the eye passes overhead the wind drops suddenly, but the far side of the eyewall soon arrives with winds blowing from the opposite direction." },
    ],
  },

  "weather-front-simulator": {
    question: "What is the difference between a cold front and a warm front?",
    answer: "A cold front forms where cold, dense air pushes under warmer air and lifts it steeply, producing tall cumulonimbus clouds, heavy showers or thunderstorms, and a sharp drop in temperature after it passes. A warm front forms where warm air slides gently up over retreating cold air along a shallow slope. It brings layered stratus and nimbostratus clouds and long periods of light to moderate rain, followed by warmer, more humid weather.",
    science: [
      "A front is the boundary between two air masses with different temperatures and humidity. Cold air is denser than warm air, so the two do not mix easily. At a cold front the advancing cold air acts like a wedge and forces warm air upward quickly. At a warm front the warm air advances but cannot push the heavier cold air aside, so it rises gradually over it. Rising air expands and cools, and cloud forms once it cools to its dew point.",
      "Cloud base height can be estimated from the gap between air temperature and dew point. Rising unsaturated air cools by about 10 °C per kilometer while its dew point falls by about 2 °C per kilometer, so the gap closes by about 8 °C per kilometer: roughly 125 m of height per degree. Air at 25 °C with a dew point of 15 °C forms cloud near 1,250 m. More humid air has a smaller gap and a lower cloud base, leaving more of the lift to build deep, rain-producing cloud.",
      "Fronts usually travel with mid-latitude low-pressure systems. On weather maps a cold front is a blue line with triangles and a warm front is a red line with semicircles, both pointing the way the front is moving. Cold fronts are steep and usually pass within a few hours. Warm fronts slope so gently that high cirrus clouds can appear hundreds of kilometers ahead of the surface front, often a day before the rain arrives.",
    ],
    formula: {
      expression: "cloud base ≈ 125 × (T − Td)",
      meaning: "Cloud base is in meters above the ground, T is the air temperature and Td is the dew point, both in °C. Each degree between them adds about 125 m.",
    },
    steps: [
      "With Advancing air mass on Cold front and the default settings, press Run. Read Approx. dew point, Cloud base and Lift above cloud base, and check whether rain falls.",
      "Switch Advancing air mass to Warm front without changing anything else. Predict whether it will rain, run it, and compare Lift above cloud base with the cold front.",
      "Raise Warm air relative humidity one step at a time, running the warm front each time. Note the humidity at which rain first appears and the Cloud base at that point.",
      "Predict whether Warm air temperature moves Cloud base. Run with 20 °C and then 30 °C, and use the Approx. dew point readout to explain what you see.",
      "Set Warm air temperature to 20 °C and Cold air temperature to 14 °C, then run a cold front. Explain why the weak temperature contrast produces no rain here.",
    ],
    misconception: {
      myth: "A warm front always brings warm, sunny weather.",
      fact: "Weather at an approaching warm front is usually gray and wet, with hours of steady rain as warm air rises over the cold air. Warmer, more humid conditions arrive only after the front has passed.",
    },
    modelNote: "Each run follows one parcel of warm air. Dew point is estimated from humidity, cloud base is 125 m per degree of temperature–dew point gap, and a cold front lifts the parcel 3 km against 1.5 km for a warm front. Rain needs 800 m of cloud and a 10 °C contrast. Wind, pressure and real rainfall amounts are not modeled.",
    faq: [
      { q: "What weather does a cold front bring?", a: "As a cold front approaches, cumulus clouds build into towering cumulonimbus, and a narrow band of heavy showers, gusty winds, hail or thunderstorms often follows. After it passes, temperature and humidity drop quickly, air pressure starts to rise, and skies usually clear. In the Northern Hemisphere the wind typically veers from southwest to northwest as the front goes by." },
      { q: "What weather does a warm front bring?", a: "A warm front arrives slowly. High, wispy cirrus clouds appear first, then the cloud lowers and thickens through cirrostratus and altostratus to nimbostratus, and steady light to moderate rain or drizzle sets in for many hours. Once the front passes, the rain eases, temperatures rise and the air feels more humid. In winter, warm fronts can bring freezing rain or sleet." },
      { q: "What is an occluded front?", a: "An occluded front forms when a faster-moving cold front catches up with a warm front and lifts the warm air between them completely off the ground. It usually develops late in the life of a mid-latitude low-pressure system. Weather maps show it as a purple line with alternating triangles and semicircles, and it brings a mix of warm-front and cold-front weather." },
      { q: "Why do weather fronts cause rain?", a: "Fronts force air to rise. Air pressure falls with height, so rising air expands, and expanding air cools. Once it cools to its dew point, water vapor condenses into cloud droplets that can grow into raindrops or snowflakes. The more moisture the rising air holds and the farther it is lifted above its cloud base, the deeper the cloud and the greater the chance of precipitation." },
      { q: "How do you estimate dew point from relative humidity?", a: "A quick rule of thumb is Td ≈ T − (100 − RH) ÷ 5, which works well when relative humidity is above about 50%. Air at 25 °C and 85% humidity has a dew point near 22 °C. Exact values come from the Magnus formula, which accounts for the way air’s capacity for water vapor rises steeply with temperature." },
    ],
  },

  "river-erosion": {
    question: "How does flow speed affect river erosion?",
    answer: "Faster-flowing water erodes more because it pushes harder on the riverbed. That push is called bed shear stress, and it rises with both water depth and channel slope: τ = ρ × g × h × S. Each sediment size starts moving above its own threshold. In a river 1 m deep with a slope of 0.08%, bed shear is 7.85 Pa, enough to roll gravel along the bed, while a shallow, gentle stream may move only sand.",
    science: [
      "Flowing water drags on every grain resting on the riverbed, and faster water passing over the top of a grain also gives it some lift. When this push exceeds the grain’s weight and its friction with neighboring grains, it starts to move. Sand moves first, rolling and bouncing along the bed (traction and saltation) or lifting into suspension. Heavier gravel needs a stronger flow. When the current slows, grains drop out in order, largest first.",
      "Two relationships link the controls. Bed shear stress τ = ρghS grows in direct proportion to both depth h and slope S. Mean velocity follows Manning’s equation, rising with depth to the power 2/3 and with the square root of slope, and falling as the bed gets rougher. Doubling depth therefore doubles bed shear but raises velocity by only about 59%. In a wide channel, width changes neither value, but it does change discharge, the volume of water passing each second.",
      "The Hjulström curve, drawn from laboratory flume experiments, shows the flow speed needed to erode, carry or deposit grains of each size. Sand is the easiest to erode. Fine clay and silt need surprisingly fast water to lift them because the particles stick together, yet once moving they stay suspended even in slow water. That explains why muddy rivers stay brown far downstream and why deltas build up where rivers slow down at the sea.",
    ],
    formula: {
      expression: "τ = ρ × g × h × S",
      meaning: "τ is bed shear stress in pascals, ρ is water density (1,000 kg/m³), g is 9.81 m/s², h is flow depth in meters and S is channel slope as a fraction (0.08% = 0.0008).",
    },
    steps: [
      "Run the default river (Flow depth 1 m, Channel slope 0.08%, Channel width 15 m). Read Flow velocity, Bed shear and Discharge, and watch which sediment grains travel downstream.",
      "Predict whether doubling Channel width changes Bed shear. Set it to 30 m, run again, and compare all three readouts with the first run.",
      "Set Flow depth to 0.5 m and Channel slope to 0.03%, then run. Check that Bed shear (1.47 Pa) moves sand but leaves gravel resting, using the Sand and Gravel status in Measurements & observations.",
      "Double Flow depth to 1 m at the same slope. Predict the new Bed shear and Flow velocity before running, then explain why shear doubled but velocity did not.",
      "Set Flow depth to 0.2 m and Channel slope to 0.01%. Run and watch the sediment as Bed shear drops below the 0.4 Pa needed to move sand.",
    ],
    misconception: {
      myth: "Rivers always flow fastest in the steep mountains near their source.",
      fact: "Mountain streams look fast because they are turbulent, but shallow, boulder-filled channels create a lot of friction. Average velocity often stays similar or even increases downstream, where deeper, smoother channels carry more water with less drag.",
    },
    modelNote: "The channel is wide and uniform, so velocity follows Manning’s equation with a fixed roughness of 0.035 and bed shear is ρghS. Sand moves above 0.4 Pa and gravel above 4 Pa, both illustrative thresholds. The 3D riverbed deepens only qualitatively; meander migration, bank collapse, floods and real erosion rates are not calculated.",
    faq: [
      { q: "What are the four types of river erosion?", a: "The four main erosion processes are hydraulic action, abrasion, attrition and solution. Hydraulic action is the force of water dislodging material and forcing air into cracks. Abrasion is sediment grinding against the bed and banks. Attrition is carried stones knocking together and becoming smaller and rounder. Solution, also called corrosion, is the chemical dissolving of rocks such as limestone and chalk." },
      { q: "Why do rivers erode the outside of a bend?", a: "Water flowing round a bend is thrown toward the outer bank, where it runs deeper and faster and has more energy to erode, cutting a steep river cliff. On the inside of the bend the water is shallow and slow, so sediment is deposited as a gently sloping point bar. Over time this makes meanders migrate and grow, sometimes until a loop is cut off as an oxbow lake." },
      { q: "How do scientists model river erosion?", a: "River engineers and geomorphologists combine flow equations with sediment rules. Hydraulic models calculate velocity and bed shear stress from a channel’s depth, slope and roughness. Threshold rules such as the Shields criterion predict which grain sizes start to move, and transport formulas estimate how much sediment travels. Flume experiments and field measurements calibrate the models, which are used to design bridges and flood defenses." },
      { q: "Does a faster river carry bigger rocks?", a: "Yes. The largest particle a river can move, called its competence, rises steeply with flow speed: roughly with the sixth power of velocity. Doubling the velocity can therefore move stones about 64 times heavier. That is why floods roll boulders that stay still for years in normal flow. The total amount of sediment a river carries is a separate quantity, called its capacity." },
    ],
  },

  "rock-cycle-challenge": {
    question: "How do rocks change from one type to another in the rock cycle?",
    answer: "In the rock cycle, rocks change type through melting, cooling, weathering, deposition, compaction and heat with pressure. Magma cools and crystallizes into igneous rock. Weathering and erosion break any rock into sediment, which is buried, compacted and cemented into sedimentary rock. Heat and pressure deep underground transform rock into metamorphic rock without melting it, as when limestone becomes marble. If any rock melts, it becomes magma again and the cycle can restart.",
    science: [
      "Plate tectonics keeps the rock cycle moving. At subduction zones and mid-ocean ridges, rock melts into magma, which rises and cools as new igneous rock. Where plates collide, rock is buried, heated and squeezed into metamorphic rock, and mountains are pushed up. Uplifted rock is then attacked by rain, ice and wind, and the loose sediment is carried downhill to basins where it can become sedimentary rock.",
      "Sedimentary rocks build up in layers. Rivers, wind and glaciers deposit grains in lakes and seas, and as layers pile up the weight squeezes out water (compaction) while minerals such as calcite and quartz glue the grains together (cementation). Metamorphic rocks form when existing rock is heated to roughly 200–800 °C or squeezed deep underground, so its minerals recrystallize while it stays solid. Shale becomes slate, sandstone becomes quartzite and granite can become gneiss.",
      "Two energy sources drive the cycle. Heat from Earth’s interior melts and metamorphoses rock and powers the plate motions that bury and uplift it. Energy from the Sun drives the weather, flowing water and ice that wear rock down at the surface. Most steps take thousands to millions of years, and rocks rarely follow a neat loop around the whole cycle.",
    ],
    steps: [
      "You start as Magma. Read Current location, then press Cool to crystallize into Igneous rock. Notice that Transformations counts each process you choose.",
      "From Igneous, predict which process leads toward sedimentary rock. Press Weather to make Sediment, then Compact & cement to form Sedimentary rock.",
      "Press Heat & pressure to turn the sedimentary rock into Metamorphic rock. Notice that this route skips Magma, because metamorphism happens without melting.",
      "Press Melt and then Cool to finish as Igneous rock again. Check that Places visited reads 5, one for each place on the diagram.",
      "Press Reset and plan a different tour of all three rock families, such as going from Igneous straight to Metamorphic. Compare its Transformations count with your first route.",
    ],
    misconception: {
      myth: "Metamorphic rocks form when rock melts and then cools again.",
      fact: "Rock that melts and cools becomes igneous rock. Metamorphic rock forms while the rock stays solid: heat and pressure rearrange its atoms into new minerals and textures, such as the light and dark bands in gneiss.",
    },
    modelNote: "The game is a map of valid changes between five states: magma, igneous rock, sediment, sedimentary rock and metamorphic rock. Each button is one process with no time attached. Real paths branch further, for example metamorphic rock being metamorphosed again, and real changes take thousands to millions of years.",
    faq: [
      { q: "What are the three types of rock?", a: "The three types are igneous, sedimentary and metamorphic. Igneous rocks such as granite and basalt form when magma or lava cools. Sedimentary rocks such as sandstone, limestone and shale form from layers of sediment that are compacted and cemented, and they are the type most likely to contain fossils. Metamorphic rocks such as marble, slate and gneiss form when heat and pressure change existing rock." },
      { q: "How long does the rock cycle take?", a: "There is no single answer, because each step runs on its own timescale. Lava can cool into basalt within days to years, while a large body of granite deep underground may take thousands to millions of years to crystallize. Turning loose sediment into solid rock usually takes millions of years, and lifting deeply buried metamorphic rock back to the surface can take tens of millions." },
      { q: "Can a rock skip steps in the rock cycle?", a: "Yes. The rock cycle is a web of possible paths, not a fixed sequence. Igneous rock can be metamorphosed without ever becoming sediment, sedimentary rock can be weathered and redeposited as new sediment, and metamorphic rock can be heated further or melted. Which path a rock takes depends on where plate motion carries it: deeper into the crust, up to the surface, or down into the mantle." },
      { q: "Why do some igneous rocks have big crystals and others small ones?", a: "Crystal size depends on how fast magma cools. Deep underground, insulated by surrounding rock, magma cools slowly, giving atoms time to build large crystals visible to the eye, as in granite. Lava erupted at the surface cools quickly, producing tiny crystals as in basalt, or no crystals at all in volcanic glass such as obsidian. A rock with both sizes records two stages of cooling." },
    ],
  },

  "water-cycle-adventure": {
    question: "What are the main stages of the water cycle?",
    answer: "The main stages of the water cycle are evaporation, condensation, precipitation and collection. The Sun’s energy evaporates water from oceans, lakes and soil, and plants release more through transpiration. The vapor rises, cools and condenses into cloud droplets, which fall as rain, snow or hail. On land, water runs off into rivers, soaks into the ground as groundwater or freezes into ice, and eventually returns to the sea, where the cycle continues.",
    science: [
      "The Sun and gravity power the water cycle. Evaporating water absorbs a large amount of energy, about 2,260 kJ for every kilogram at 100 °C and about 2,450 kJ at 20 °C, without getting any hotter. That energy is carried upward with the vapor and released as latent heat when it condenses into cloud, warming the surrounding air. Gravity then pulls precipitation back down and drives rivers and groundwater downhill toward the sea.",
      "Earth’s water is shared very unevenly. About 96.5% is salty ocean water. Of the small freshwater fraction, roughly two-thirds is locked in ice sheets and glaciers and nearly all the rest is groundwater, so rivers, lakes and the atmosphere hold only a tiny share at any moment. Even so, the atmosphere passes huge amounts of water through quickly, because vapor is constantly evaporating and falling again as precipitation.",
      "Rain that infiltrates the ground recharges aquifers, which supply about half of the world’s drinking water, and slowly feeds rivers through springs and seepage. This groundwater flow keeps many rivers running through dry seasons. When cities pave over soil, more rain runs straight off roofs and roads into drains, raising flood risk and reducing the water that soaks in to refill aquifers.",
    ],
    steps: [
      "Your droplet starts in the Ocean. Press Evaporate to become Vapor, then Condense to form a Cloud, and watch Current location change at each step.",
      "From Cloud, predict where Precipitate and Snow will lead. Choose Precipitate to fall on Land, then Infiltrate to soak down into Groundwater.",
      "Press Groundwater discharge to seep into a River, then River outflow to return to the Ocean. Check Places visited and Transformations for the complete trip.",
      "Press Reset and take the Snow route: Evaporate, Condense, then Snow. Compare Melt with Sublimate and note which one returns water to the air without passing through liquid.",
      "From Land, try Plant uptake and then Transpire. Explain how this route returns water to the atmosphere without evaporating from an open water surface.",
    ],
    misconception: {
      myth: "Clouds are made of water vapor.",
      fact: "Water vapor is an invisible gas. Clouds are made of tiny liquid droplets or ice crystals that formed when the vapor cooled and condensed onto specks of dust, sea salt or smoke.",
    },
    modelNote: "The game follows one water parcel through eight places, from ocean and vapor to groundwater, plants and ice, with a button for each real process. Every move counts the same, so it does not show how long water stays in each reservoir or how much water takes each route. Lakes, glacier flow and human water use are left out.",
    faq: [
      { q: "What is the difference between evaporation and transpiration?", a: "Evaporation is liquid water turning into vapor from any open surface, such as the ocean, a lake, a puddle or wet soil. Transpiration is the release of water vapor from plants, mostly through tiny pores in their leaves called stomata, after the roots draw water up from the soil. Together the two are called evapotranspiration, and over forests transpiration is usually the larger part." },
      { q: "How does groundwater get into rivers?", a: "Rain that infiltrates the soil sinks until it reaches the water table, below which every pore in the rock is full of water. This groundwater moves slowly downhill, often only centimeters to meters a day, and seeps out where the water table meets a riverbed, spring or lake. This steady supply, called baseflow, keeps many rivers flowing between rainstorms." },
      { q: "How long does water stay in each part of the water cycle?", a: "Estimates of average residence time vary widely by reservoir. A water molecule spends about nine days in the atmosphere, one to two months as soil moisture, and two to six months in a river. Large lakes hold water for 50–100 years, the ocean for about 3,200 years, and the Antarctic ice sheet for around 20,000 years." },
      { q: "What is the difference between runoff and infiltration?", a: "When rain reaches the ground, it either soaks in or flows over the surface. Infiltration is water entering the soil, and it is fastest on dry, sandy or vegetated ground. Runoff is water flowing over the land into streams, and it increases when soil is saturated or frozen, when rain is very heavy, or when the ground is paved. High runoff after storms is a major cause of flash floods." },
    ],
  },

  "ocean-currents-3d": {
    question: "How do temperature and salinity drive ocean currents?",
    answer: "Temperature and salinity drive deep ocean currents by changing seawater density. Cold water is denser than warm water, and salty water is denser than fresh water. In the North Atlantic and around Antarctica, surface water becomes cold and salty enough to sink, spreading slowly along the seafloor and drawing surface water in to replace it. This density-driven loop, called thermohaline circulation, links all the oceans and takes about 1,000 years to complete.",
    science: [
      "Thermohaline circulation begins in polar seas. Winter winds chill the surface water, and when sea ice forms it leaves most of its salt behind, so the water beneath becomes colder and saltier at the same time. This dense water sinks to great depths, forming North Atlantic Deep Water near Greenland and Antarctic Bottom Water in the Weddell and Ross Seas. It spreads through the deep basins and slowly returns to the surface elsewhere, mainly through mixing and wind-driven upwelling.",
      "Near the surface, seawater density is about 1,020–1,029 kg/m³. A simple linear rule captures the two effects: warming water by 1 °C lowers its density by about 0.2 kg/m³, while adding 1 g/kg of salt raises it by about 0.8 kg/m³. So a drop of 5 g/kg in salinity can cancel the effect of cooling by 20 °C. In near-freezing water, density responds even less to temperature, which is why salinity often decides whether polar water sinks.",
      "Surface currents such as the Gulf Stream are driven mainly by wind, but they connect with the deep, density-driven flow. Together they form the Atlantic Meridional Overturning Circulation (AMOC), which carries tropical heat north through the Atlantic. Scientists monitor the AMOC closely because large amounts of fresh meltwater from Greenland could lower the salinity of North Atlantic surface water and weaken the sinking that drives it.",
    ],
    formula: {
      expression: "ρ ≈ 1027 − 0.2 × (T − 10) + 0.8 × (S − 35)",
      meaning: "ρ is seawater density in kg/m³, T is temperature in °C and S is salinity in g/kg. It is a linear approximation that works best near 10 °C and 35 g/kg.",
    },
    steps: [
      "Start with the defaults (Warm-side temperature 22 °C, Polar-side temperature 2 °C, both salinities 35 g/kg). Predict which side sinks, press Run, and read Density contrast (+4.00 kg/m³).",
      "Lower Polar-side salinity in steps, as melting ice would. Predict the salinity at which Density contrast reaches zero, then check your answer with the readout.",
      "Set Polar-side salinity to 27 g/kg and run. Compare the direction of the particle loop with the first run, and explain why the fresher polar water now floats.",
      "Press Reset, then set Warm-side temperature to 30 °C and Warm-side salinity to 37 g/kg. Predict whether Warm-side density rises or falls before reading it.",
    ],
    misconception: {
      myth: "Cold water always sinks below warmer water.",
      fact: "Salinity matters as well as temperature. Cold, fresh meltwater can be less dense than warmer, saltier seawater and float on top of it, as happens near melting glaciers and sea ice.",
    },
    modelNote: "Two boxes of water, one warm and one polar, are compared with a linear density rule, and the direction of the loop follows which side is denser. Animation speed is rescaled. Wind, Earth’s rotation, mixing, pressure effects and real ocean geography are left out, so it isolates the density driver and is not a forecast of global circulation.",
    faq: [
      { q: "What drives surface ocean currents?", a: "Surface currents are driven mainly by wind blowing over the sea. The Coriolis effect turns the moving water to the right in the Northern Hemisphere and to the left in the Southern Hemisphere, and continents block and deflect it. The result is large rotating loops called gyres in each ocean basin, such as the North Atlantic gyre, whose western edge forms the fast, warm Gulf Stream." },
      { q: "What is the global ocean conveyor belt?", a: "The global ocean conveyor belt is a nickname for thermohaline circulation joined up with surface currents around the world. Cold, dense water sinks in the North Atlantic, flows south along the seafloor, joins deep water from around Antarctica, and spreads into the Indian and Pacific Oceans. There it slowly rises and returns as warm surface flow, and one full loop takes roughly a thousand years." },
      { q: "Why does salt make seawater denser?", a: "Dissolved salts add mass to the water without adding much volume, because the ions pack closely among the water molecules. Ocean water averages about 35 g of salt per kilogram, which makes it roughly 2.5% denser than fresh water. That is why swimmers float more easily in the sea, and far more easily in the Dead Sea, which is almost ten times saltier than the ocean." },
      { q: "How do ocean currents affect climate?", a: "Ocean currents carry huge amounts of heat from the tropics toward the poles. The Gulf Stream and North Atlantic Drift bring warm water northeast, which helps explain why winters in the UK and Norway are milder than in eastern Canada at similar latitudes. Cold currents do the opposite: the Humboldt Current off Peru cools the coast and brings up nutrient-rich water that supports huge fisheries." },
    ],
  },
};
