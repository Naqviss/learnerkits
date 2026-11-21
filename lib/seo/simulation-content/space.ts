import type { SimulationContent } from "./types";

export const spaceContent: Record<string, SimulationContent> = {
  "moon-landing": {
    question: "How does a spacecraft land safely on the Moon?",
    answer: "A spacecraft lands safely on the Moon by firing its descent engine to cancel its speed, because the Moon has no air for parachutes or wings. Lunar gravity is 1.62 m/s², about one-sixth of Earth’s, so a lander hovers only when its thrust equals its mass × 1.62 m/s². A 7,400 kg lander needs about 12,000 N just to hover. The pilot also tilts the craft to cancel sideways drift and must touch down upright at no more than about 3 m/s.",
    science: [
      "Two forces act on a descending lander: its weight pulls it down and the engine pushes along the lander’s axis. When thrust is less than weight, the craft speeds up as it falls; when thrust is greater, the descent slows. The Moon has no atmosphere, so there is no drag to help, and every meter per second of speed has to be removed by burning propellant.",
      "The lander gets lighter as it flies. At full thrust a 45,000 N engine with a specific impulse of 311 s burns about 14.8 kg of propellant per second, so the same thrust produces more acceleration as the tanks empty. The throttle needed to hover drops from about 27% with full tanks to about 17% when they are nearly empty, which is why pilots keep trimming the throttle instead of setting it once.",
      "Apollo 11’s Lunar Module touched down on July 20, 1969, after Neil Armstrong took over steering to fly past a boulder field near a crater. Tilting the lander points part of the thrust sideways, which is the only way to remove horizontal velocity. Robotic landers solve the same thrust-and-tilt problem automatically, using radar or laser altimeters to measure their height and speed.",
    ],
    formula: { expression: "a = F/m − g", meaning: "For an upright lander, a is the vertical acceleration, F the engine thrust in newtons, m the current mass in kilograms and g the Moon’s gravity, 1.62 m/s². The lander hovers when F = m × g." },
    steps: [
      "The lander starts 1,200 m up, falling at 34 m/s and drifting sideways at 11 m/s. Predict the Throttle needed to hover, then move the Throttle slider until Acceleration reads close to 0 m/s².",
      "Compare your hover setting with 7,400 kg × 1.62 m/s² ÷ 45,000 N ≈ 27%. Keep watching Mass and Fuel: as they fall, the same Throttle starts pushing the lander upward.",
      "Press the ↶ ROTATE button (or A) briefly to tilt a few degrees against the drift, then rotate back upright as Horizontal velocity approaches 0 m/s.",
      "Near the surface, keep Vertical velocity slower than about 3 m/s, Horizontal velocity under 2 m/s and the attitude dial within 8° of upright to earn a Safe touchdown instead of a Hard landing.",
      "Open Experiment Mode, double Fuel mass to 5,400 kg and press Apply & restart. Predict the new hover Throttle, then test it; the heavier lander needs about 36%.",
    ],
    misconception: { myth: "A lunar lander could use parachutes like a capsule returning to Earth.", fact: "Parachutes need air to push against, and the Moon has almost none. All of the braking, from orbital speed down to touchdown, has to come from rocket thrust." },
    modelNote: "Two-dimensional flight with constant 1.62 m/s² gravity, a 45 kN throttleable engine, propellant use that lowers the mass, and slow attitude rotation. Touchdown is judged on vertical speed, horizontal speed and tilt. Surface height, the Moon’s curvature, engine response delay and the separate ascent stage are not modeled.",
    faq: [
      { q: "What is the gravity on the Moon?", a: "Surface gravity on the Moon is 1.62 m/s², about 16.5% of Earth’s 9.81 m/s², or roughly one-sixth. The Moon has only about 1.2% of Earth’s mass, but its radius is also much smaller, 1,737 km, and surface gravity depends on both. A 60 kg student would weigh about 97 N on the Moon instead of about 589 N on Earth." },
      { q: "Why do lunar landers tilt before touchdown?", a: "A lander’s engine pushes along its own axis, so tilting the craft sends part of the thrust sideways. That sideways push is the only way to cancel horizontal speed left over from orbit. The pilot tilts against the drift and then returns upright before contact, because a lander touching down while leaning or sliding can tip over." },
      { q: "Why does a lander accelerate more as it burns fuel?", a: "Acceleration equals force divided by mass. Burning propellant removes mass, so the same engine thrust gives a larger acceleration later in the descent. A lander that starts at 7,400 kg and ends near 4,700 kg gets about 6.1 m/s² from a 45,000 N engine at the start and about 9.6 m/s² when its tanks are nearly empty." },
      { q: "Why is landing on the Moon so hard?", a: "The pilot has to remove all vertical and sideways speed with a limited supply of propellant and no air to help. Braking too early wastes fuel on hovering, while braking too late leaves too little height to stop. The lander must also be nearly upright at contact, so throttle and attitude have to be controlled together." },
    ],
  },

  "orbital-rescue": {
    question: "How do spacecraft meet up with each other in orbit?",
    answer: "Spacecraft meet in orbit through a rendezvous: a series of short engine burns that changes the chaser’s orbit until it reaches the target’s position with the same velocity. A prograde burn, along the direction of travel, adds energy and raises the far side of the orbit; a retrograde burn lowers it. Lower orbits are faster, so a chaser below its target gains on it. At 400 km one orbit takes about 92.4 minutes, while at 430 km it takes about 93.0 minutes.",
    science: [
      "In orbit, speed and height are linked. A circular orbit needs v = √(GM/r), so a higher orbit is slower and takes longer to complete. A prograde burn does not push the spacecraft straight up; it raises the opposite side of the orbit half a revolution later, stretching a circle into an ellipse. Radial burns, toward or away from Earth, reshape the ellipse while barely changing its energy, so they are an inefficient way to change altitude.",
      "Specific orbital energy, ε = v²/2 − μ/r, shows the effect of each burn; for Earth μ = 398,600 km³/s². A circular orbit at 400 km has ε ≈ −29.4 MJ/kg and one at 430 km about −29.3 MJ/kg, a small difference. A two-burn Hohmann transfer between those orbits needs only about 17 m/s of delta-v in total, roughly 8.5 m/s at each burn, made half an orbit apart.",
      "Real rendezvous missions follow the same rules. Cargo and crew vehicles heading for the International Space Station launch into a lower orbit, catch up over hours or days, then raise their orbit in steps to match the station. The propellant budget, measured as delta-v, limits how many corrections a mission can afford, so planners favor small, well-timed burns.",
    ],
    formula: { expression: "Δv = Isp × g₀ × ln(m₀ ÷ m₁)", meaning: "The rocket equation gives the total velocity change Δv a spacecraft can make. Isp is the engine’s specific impulse in seconds, g₀ = 9.81 m/s², m₀ the mass with propellant and m₁ the mass when the tanks are empty." },
    steps: [
      "Before any burn, compare Velocity with Circular velocity: you start at 400 km about 0.04 km/s too slow for a circle. Predict what Altitude will do over the next half orbit, then watch it.",
      "Press Restart, choose Prograde and set Throttle to about 5%. Select Coast when Velocity matches Circular velocity, then check that Altitude now stays close to 400 km.",
      "The target circles 30 km higher, a quarter orbit ahead. Predict whether speeding up brings you closer, then make a short Prograde burn, Coast with Time scale at 50× and track Distance to target.",
      "Restart and repeat with a short Retrograde burn. Compare Specific orbital energy, the lowest Altitude and Distance to target with the prograde run, and note how much Delta-v remaining each burn costs.",
      "A rescue needs Distance to target under 4 km while Relative velocity is below 8 m/s, so finish with short trim burns. Too much Retrograde thrust ends in Reentry below 80 km.",
    ],
    misconception: { myth: "To catch a spacecraft ahead of you in orbit, you should speed up toward it.", fact: "Speeding up raises your orbit and lengthens its period, so you drift further behind. A chaser slows down to drop into a lower, faster orbit, gains ground, then raises its orbit again to meet the target." },
    modelNote: "Newtonian gravity from a point-mass Earth in a single orbital plane, with finite thrust, propellant use from the rocket equation and a 340 s specific impulse. Rescue counts within 4 km and 8 m/s of the target. Atmospheric drag, Earth’s equatorial bulge, plane changes and docking contact are not modeled; dropping below 80 km counts as reentry.",
    faq: [
      { q: "Why does a lower orbit go faster?", a: "Gravity is stronger closer to Earth, so a satellite in a lower circular orbit needs more speed, v = √(GM/r), to keep falling around the planet instead of into it. Its path is also shorter. At 400 km the circular speed is about 7.67 km/s and one orbit takes about 92 minutes; at the geostationary radius of 42,164 km the speed is only about 3.07 km/s." },
      { q: "What is delta-v in space travel?", a: "Delta-v is the total change in velocity a spacecraft can make with the propellant it carries, measured in meters per second. It comes from the rocket equation. A craft with 8,000 kg of dry mass, 3,500 kg of propellant and a 340 s engine has about 1,210 m/s, and mission planners spend that amount like a budget across every burn." },
      { q: "What is the difference between a prograde and a retrograde burn?", a: "A prograde burn fires so the thrust points along the direction of travel, increasing speed and orbital energy and raising the far side of the orbit. A retrograde burn thrusts against the direction of travel and lowers the far side. Retrograde burns are also used to deorbit, lowering the low point into the atmosphere so drag can finish slowing the spacecraft." },
      { q: "Why is matching position not enough for a rendezvous?", a: "Two spacecraft can pass within a few hundred meters of each other and still separate again within seconds if their velocities differ. A rendezvous matches both position and velocity, so the chaser’s final burns cut the relative velocity almost to zero before docking or before a robotic arm captures the visiting vehicle." },
    ],
  },

  "moon-phases-3d": {
    question: "What causes the phases of the Moon?",
    answer: "The phases of the Moon are caused by the changing angle between the Sun, the Moon and Earth as the Moon orbits Earth. Sunlight always lights half of the Moon, but from Earth we see a different share of that lit half through the month. At new moon the lit side faces away from us, and at full moon it faces us. One full cycle of phases, the synodic month, takes about 29.5 days.",
    science: [
      "Picture the Moon as a ball lit from one side by a very distant lamp. As it travels around Earth, the boundary between its day and night halves, called the terminator, turns relative to us. When the Moon is roughly between Earth and the Sun we face its dark half. A quarter of an orbit later we see the lit hemisphere side-on, which appears as a half-disk called a quarter moon.",
      "The lit share of the disk depends on the Sun–Moon–Earth angle. With the orbital angle θ measured from new moon, the illuminated fraction is (1 − cos θ)/2: 0 at 0°, 0.5 at 90°, 1 at 180° and 0.5 again at 270°. The change is not linear. At 45°, halfway to first quarter, only about 15% of the disk is lit, and at 135° about 85% is lit.",
      "Phases follow a reliable timetable. From the Northern Hemisphere a waxing Moon is lit on the right and a waning Moon on the left, and observers in the Southern Hemisphere see the pattern reversed. A first-quarter Moon rises around noon and is highest at sunset, so it is easy to spot in the evening. The 29.53-day synodic month is longer than the 27.3-day orbit because Earth is also moving around the Sun.",
    ],
    formula: { expression: "Illuminated fraction = (1 − cos θ) ÷ 2", meaning: "θ is the Moon’s orbital angle measured from new moon, so the fraction runs from 0 at new moon to 1 at full moon. It assumes a very distant Sun and a Moon orbiting in the same plane as Earth’s orbit." },
    steps: [
      "Press the New moon quick scenario and switch to Top view. Check that the Moon sits between Earth and the Sun with its lit half facing away from Earth.",
      "Predict the Illuminated percentage at 45°, halfway to first quarter. Set Moon orbital angle to 45° and check whether the readout is 25%, and explain the difference.",
      "Press Quarter and confirm that Illuminated reads 50% while Synodic age is about 7.4 days. Note which side of the disk is lit in the VIEW FROM EARTH panel.",
      "Move Moon orbital angle through 180° and on to 270°. Compare the two 50% readings and explain why the lit side switches from right to left.",
      "Press Full moon and drag the 3D view. Earth sits between the Sun and Moon here, so explain why a real full moon is usually not eclipsed.",
    ],
    misconception: { myth: "Earth’s shadow causes the phases of the Moon.", fact: "Earth’s shadow reaches the Moon only during a lunar eclipse, which can happen only at full moon. Phases come from viewing angle: as the Moon orbits, we see different amounts of the half that faces the Sun." },
    modelNote: "The Sun, Earth and Moon share one flat plane and the Sun is treated as infinitely far away, so the lit fraction follows (1 − cos θ)/2 exactly. Sizes and the Earth–Moon distance are exaggerated in the 3D view. Earth’s shadow, the Moon’s 5° orbital tilt and its slight wobble, called libration, are not modeled.",
    faq: [
      { q: "What are the 8 phases of the Moon in order?", a: "The eight named phases are new moon, waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, last quarter and waning crescent. Waxing means the lit part is growing toward full, and waning means it is shrinking. The four main phases are about 7.4 days apart, and the whole cycle repeats every 29.5 days." },
      { q: "Why do we always see the same side of the Moon?", a: "The Moon is tidally locked: it spins once on its axis in the same 27.3 days it takes to orbit Earth, so one hemisphere always faces us. The far side is not permanently dark. It gets as much sunlight as the near side, and at new moon it is fully lit while the side facing us is dark." },
      { q: "How long does a full cycle of Moon phases take?", a: "One cycle, from new moon to the next new moon, takes about 29.53 days and is called the synodic month. The Moon completes one orbit relative to the stars in about 27.32 days, but Earth moves roughly 27° around the Sun in that time, so the Moon needs about two more days to line up with the Sun again." },
      { q: "Why is a half moon called a quarter moon?", a: "First and last quarter moons look like half-disks from Earth. They are named quarters because the Moon has completed one quarter or three quarters of its cycle, not because a quarter of the disk is lit. At those points the Sun–Moon–Earth angle is about 90°, so half of the visible disk is lit." },
    ],
  },

  "solar-eclipse-3d": {
    question: "What causes a solar eclipse?",
    answer: "A solar eclipse happens when the Moon passes directly between the Sun and Earth and its shadow falls on Earth’s surface. It can occur only at new moon, and only when that new moon is near one of the two points where the Moon’s tilted orbit crosses Earth’s orbital plane. The Sun is about 400 times wider than the Moon but also about 400 times farther away, so both span roughly half a degree of sky. A closer Moon can hide the Sun completely; a farther Moon leaves a bright ring.",
    science: [
      "The Moon casts two kinds of shadow. Inside the umbra, a narrow cone where the Sun is completely blocked, observers see a total eclipse. The much wider penumbra blocks only part of the Sun and gives a partial eclipse. When the Moon is too far away for the umbra to reach Earth, observers in the antumbra beyond the cone’s tip see an annular eclipse, a thin ring of Sun around the dark Moon.",
      "Apparent size decides the eclipse type. An object’s angular diameter is about 2 × asin(R ÷ d), and the Sun spans about 0.533° from Earth. Seen from Earth’s surface, the Moon spans about 0.569° when its center is 356,000 km from Earth’s center and about 0.498° at 406,000 km. The crossover is near 380,000 km: any closer, and a well-centered Moon can cover the Sun completely.",
      "The Moon’s orbit is tilted about 5.1° to Earth’s orbit, so at most new moons its shadow passes above or below Earth. Eclipses therefore cluster in eclipse seasons about 173 days apart, when the line where the two orbits cross points toward the Sun. Totality never lasts longer than about 7.5 minutes at one place, and the April 8, 2024 eclipse across North America reached about 4 minutes 28 seconds.",
    ],
    formula: { expression: "Angular diameter ≈ 2 × asin(R ÷ d)", meaning: "R is the radius of the Sun or Moon and d its distance from the observer. A total eclipse needs the Moon’s angular diameter to be at least the Sun’s, with the two centers aligned closely enough that no part of the Sun shows." },
    steps: [
      "Start with the Partial quick scenario. Read Eclipse and the solar coverage percentage in the observer’s sky panel, then predict what happens as Sky alignment offset moves toward 0°.",
      "Set Sky alignment offset to 0° and Earth–Moon center distance to 356,000 km. Compare Moon diameter with Sun diameter and confirm that Eclipse reads Total.",
      "Keep the offset at 0° and raise Earth–Moon center distance to 406,000 km. Predict the eclipse type, then compare the new Moon diameter, about 0.498°, with the Sun’s 0.533°.",
      "Find the crossover: change Earth–Moon center distance in 1,000 km steps until Eclipse switches between Total and Annular, and record the Moon diameter on each side.",
      "At 356,000 km, raise Sky alignment offset from 0° in 0.005° steps. Note the small offset where Total becomes Partial and the much larger one where No eclipse appears.",
    ],
    misconception: { myth: "A solar eclipse happens every month at new moon.", fact: "The Moon’s orbit is tilted about 5° to Earth’s, so at most new moons the Moon passes above or below the Sun in our sky. An eclipse needs a new moon that falls close to one of the two orbit crossing points." },
    modelNote: "The observer’s sky view uses true angular sizes from the real radii of the Sun and Moon, a fixed Sun distance of 1 AU and an observer on the side of Earth facing the Moon. The 3D overview is not to scale. The Moon’s orbital tilt, the Sun’s small yearly size change and eclipse tracks across Earth are not modeled.",
    faq: [
      { q: "What is the difference between a total and an annular solar eclipse?", a: "In a total eclipse the Moon’s disk looks at least as large as the Sun’s and hides it completely, revealing the faint outer corona. In an annular eclipse the Moon is farther from Earth, so its disk looks slightly smaller and a bright ring of Sun stays visible. Both need the same close alignment; only the Moon’s distance differs." },
      { q: "How often do solar eclipses happen?", a: "Somewhere on Earth there are between two and five solar eclipses every year, though many are only partial. Total eclipses happen somewhere roughly every 18 months, but the path of totality is never more than about 270 km wide, so most places wait a very long time between total eclipses." },
      { q: "Is it safe to look at a solar eclipse?", a: "Not without protection. Even when the Moon covers 99% of the Sun, the remaining crescent can burn the retina, and the damage is painless at first. Eclipse glasses meeting the ISO 12312-2 standard, or indirect viewing with a pinhole projector, are needed during partial and annular phases. Only during the brief totality of a total eclipse is it safe to look without them." },
      { q: "Can a solar eclipse happen at full moon?", a: "No. A solar eclipse needs the Moon between the Sun and Earth, which is the new moon position. At full moon the order is reversed, with Earth between the Sun and Moon, and the event that can happen then is a lunar eclipse, when Earth’s shadow darkens the Moon." },
    ],
  },

  "escape-velocity": {
    question: "What is escape velocity and how is it calculated?",
    answer: "Escape velocity is the minimum speed an unpowered object needs to coast away from a planet or moon forever, ignoring air resistance. It is calculated with v = √(2GM/r), where M is the body’s mass and r is the distance from its center. At Earth’s surface it is about 11.2 km/s. Escape speed is always √2, about 1.41, times the circular orbit speed at the same distance, so at 400 km altitude a spacecraft needs 10.85 km/s to escape but only 7.67 km/s to orbit.",
    science: [
      "Escape is an energy problem. A moving object has kinetic energy ½mv², and gravity gives it a negative potential energy, −GMm/r, that becomes less negative as it climbs. If the total is negative the object is bound and will fall back or orbit; if the total is zero or positive it never returns. Dividing by mass gives the specific energy ε = v²/2 − μ/r, which is the same for a pebble or a rocket.",
      "Because r sits under the square root, escape speed falls with height. From Earth it is 11.10 km/s at 100 km altitude and 9.22 km/s at 3,000 km. Smaller worlds are easier to leave: from 100 km above the Moon the escape speed is only about 2.31 km/s, and from 400 km above Mars about 4.75 km/s. In ideal two-body gravity the launch direction does not matter, as long as the path clears the surface.",
      "Real rockets never leave at escape speed in one instant. They burn for several minutes, climb above most of the atmosphere and launch eastward to borrow Earth’s rotation, worth about 0.46 km/s at the equator. Apollo crews reached just under escape speed during their trans-lunar injection burn, low above Earth, and coasted most of the way to the Moon; probes bound for other planets leave slightly faster than escape speed.",
    ],
    formula: { expression: "v_esc = √(2GM ÷ r)", meaning: "G is the gravitational constant (6.674 × 10⁻¹¹ N·m²/kg²), M the mass of the planet or moon and r the distance from its center. The circular orbit speed at the same distance is √(GM ÷ r), smaller by a factor of √2." },
    steps: [
      "With Launch world set to Earth and Starting altitude at 400 km, read Circular speed and Escape speed. Divide one by the other and check that the ratio is close to 1.41.",
      "Predict the path for a Tangential speed of 8 km/s, which lies between the two readouts. Press Launch trajectory and compare the curve with Specific energy, which stays negative.",
      "Launch again at 10.8 km/s and then 10.9 km/s. Watch Specific energy cross zero and the trajectory status change from Bound orbit to Outbound.",
      "Predict which world is easiest to leave, then switch Launch world to Moon and to Mars at the same Starting altitude and compare their Escape speed readouts.",
      "Back on Earth, raise Starting altitude from 400 km to 3,000 km. Compare how far Escape speed falls and explain the change using v = √(2GM/r).",
    ],
    misconception: { myth: "Heavier rockets need a higher escape velocity.", fact: "Escape velocity depends only on the planet’s mass and your distance from its center. A heavier spacecraft needs more energy in total, but the threshold speed is identical for a pebble and a space station." },
    modelNote: "Two-body gravity around a perfect sphere, a sideways (tangential) launch, and trajectories integrated step by step with the velocity-Verlet method for Earth, the Moon and Mars. Air drag, the planet’s rotation, thrust during the climb and the Sun’s gravity are left out. A trace stops at the surface or when it leaves the view.",
    faq: [
      { q: "What is Earth’s escape velocity?", a: "Earth’s escape velocity at the surface is about 11.2 km/s, roughly 40,300 km/h or 25,000 mph. From 400 km up, where the International Space Station orbits, it is about 10.85 km/s because the spacecraft is already farther from Earth’s center. These values ignore air resistance, which would make a surface launch at that speed impossible in practice." },
      { q: "Does escape velocity depend on the mass of the object?", a: "No. In v = √(2GM/r), M is the mass of the planet, not of the object being launched. The object’s own mass cancels because its kinetic energy and its gravitational potential energy are both proportional to it. A heavier craft needs more total energy, and a bigger rocket to supply it, but its escape speed is unchanged." },
      { q: "What is the difference between orbital velocity and escape velocity?", a: "Orbital velocity is the speed needed for a circular orbit at a given distance, √(GM/r). Escape velocity is the speed needed to leave and never come back, √(2GM/r), which is about 41% higher at any distance. Speeds between the two give elliptical orbits that swing farther out on the far side but still return." },
      { q: "Do you need escape velocity to reach space?", a: "No. Reaching space only means climbing above the atmosphere, and staying there takes orbital speed, about 7.7 km/s in low Earth orbit. Escape velocity matters only for leaving Earth’s gravity for good, as missions to Mars do. A rocket that keeps firing can also climb away more slowly, because escape speed is the threshold for coasting without thrust." },
    ],
  },

  "gravity-slingshot": {
    question: "How does a gravity assist speed up a spacecraft?",
    answer: "A gravity assist speeds up a spacecraft by sending it close past a moving planet, whose gravity bends the craft’s path. Relative to the planet, the spacecraft leaves with the same speed it arrived with, only in a new direction. Relative to the Sun, the planet’s orbital velocity adds to that new direction, so a pass behind the planet can raise the craft’s speed by several kilometers per second. With Earth moving at 29.78 km/s, a well-aimed 8 km/s flyby can gain about 7 km/s.",
    science: [
      "In the planet’s frame, a flyby is symmetric. The spacecraft falls in, swings around on a hyperbola and climbs out with the same speed, v∞, pointing a new way. The Sun-frame velocity is the planet’s velocity plus the craft’s velocity relative to the planet, so turning the relative velocity changes the total. Turning it toward the planet’s direction of motion adds speed; turning it away removes speed.",
      "How far the path bends depends on how close and how fast the pass is. The turning angle is δ = 2 asin[1/(1 + rₚv∞²/μ)], where rₚ is the closest distance from the planet’s center and μ = GM. For Earth, an 8 km/s approach with 1,000 km of clearance bends the path by about 54.5°. A wider or faster pass bends it less, and the heliocentric speed can change by at most 2v∞ sin(δ/2).",
      "Gravity assists opened up the outer Solar System. Voyager 2 used Jupiter, Saturn, Uranus and Neptune in turn, and Cassini flew past Venus twice, Earth once and Jupiter on its way to Saturn. Each pass slows the planet by an unmeasurably small amount, because Earth’s mass is about 6 × 10²¹ times that of a one-tonne probe, so momentum and energy are still conserved overall.",
    ],
    formula: { expression: "δ = 2 asin[1 ÷ (1 + rₚ × v∞² ÷ μ)]", meaning: "δ is the turning angle of the flyby, rₚ the closest distance from the planet’s center, v∞ the approach speed relative to the planet and μ = GM, which is 398,600 km³/s² for Earth." },
    steps: [
      "Load the Gain speed quick scenario and press Launch trajectory. Read Deflection and Speed change, then compare the BEFORE FLYBY and AFTER FLYBY heliocentric speeds below the 3D view.",
      "Predict whether a closer pass gives a bigger gain. Lower Closest surface clearance from 1,000 km to 300 km, then raise it to 5,000 km, recording Deflection and Speed change each time.",
      "Return clearance to 1,000 km and switch Deflection direction to Counterclockwise. Explain why the same approach now bends the other way and Speed change turns slightly negative.",
      "Load the Lose speed scenario and compare its Speed change with Gain speed. Decide which geometry a probe heading inward to Venus or Mercury would choose.",
      "With Incoming relative direction at 150°, change Approach speed at infinity from 4 km/s to 15 km/s. Record how Deflection shrinks as the craft passes faster.",
    ],
    misconception: { myth: "A spacecraft gains speed in a flyby because the planet’s gravity pulls it faster on the way out.", fact: "Relative to the planet, the pull on the way in exactly cancels the pull on the way out, so the craft leaves at its arrival speed. The gain appears only in the Sun’s frame, because the flyby turns the craft’s velocity relative to a moving planet." },
    modelNote: "A patched-conic Earth flyby: the hyperbolic path uses Earth’s gravity alone, and Earth’s 29.78 km/s orbital velocity is added before and after to give heliocentric speeds. Earth’s motion is treated as a straight line during the pass. The Sun’s pull during the encounter, the Moon, atmospheric drag and course-correction burns are not included.",
    faq: [
      { q: "Does a gravity assist break the law of conservation of energy?", a: "No. In the planet’s frame the spacecraft has the same kinetic energy before and after the flyby. In the Sun’s frame the spacecraft gains energy and the planet loses exactly the same amount, slowing by a tiny fraction because it is so massive. The total energy and momentum of the planet and spacecraft together are conserved." },
      { q: "Which spacecraft have used gravity assists?", a: "Most deep-space missions have. Voyager 1 and 2 used Jupiter and Saturn, and Voyager 2 went on to Uranus and Neptune. Galileo flew past Venus once and Earth twice before reaching Jupiter. New Horizons used Jupiter to shorten its trip to Pluto, and Parker Solar Probe uses repeated Venus flybys to lose speed and dive closer to the Sun." },
      { q: "Can a gravity assist slow a spacecraft down?", a: "Yes. If the spacecraft passes in front of the planet, relative to the planet’s motion, the flyby turns its velocity against the planet’s orbital direction and lowers its speed around the Sun. MESSENGER used one Earth flyby, two Venus flybys and three Mercury flybys to slow down enough to enter orbit around Mercury." },
      { q: "Why is a gravity assist called a slingshot?", a: "The path looks like a slingshot shot: the spacecraft swings around the planet and is flung away in a new direction. The name is a little misleading, because nothing stores and releases energy the way a stretched elastic band does. The extra speed comes from the planet’s own orbital motion, shared with the craft through gravity during the close pass." },
    ],
  },

  "keplers-laws-orbit": {
    question: "What are Kepler’s three laws of planetary motion?",
    answer: "Kepler’s three laws describe how planets orbit the Sun. First, each orbit is an ellipse with the Sun at one focus. Second, a line from the Sun to the planet sweeps out equal areas in equal times, so a planet moves fastest at perihelion and slowest at aphelion. Third, the square of the orbital period is proportional to the cube of the semi-major axis; with the period in years and the axis in astronomical units, T² = a³. Mars, at 1.52 AU, takes about 1.88 years.",
    science: [
      "Newton later showed that all three laws follow from an inverse-square gravitational force. The second law is conservation of angular momentum: when the planet is closer to the star, it must move faster to sweep the same area. In an orbit of eccentricity e, the speed at perihelion is (1 + e)/(1 − e) times the speed at aphelion, a factor of 4 for e = 0.6 but only about 1.03 for Earth, whose eccentricity is 0.017.",
      "Speed at any distance r comes from the vis-viva equation, v = √[GM(2/r − 1/a)]. Around a star of one solar mass, a circular orbit at 1 AU moves at about 29.8 km/s. An orbit with a = 1.59 AU and e = 0.6 reaches about 47 km/s at perihelion, 0.64 AU from the star, and slows to about 12 km/s at aphelion, 2.54 AU away. Its period is about 2.0 years whatever its eccentricity.",
      "Kepler published the laws between 1609 and 1619 after fitting Tycho Brahe’s careful observations of Mars. Astronomers now use the third law in reverse to weigh objects: measuring a moon’s or planet’s period and orbit size gives the mass of the body it circles. Halley’s Comet has a semi-major axis of about 17.8 AU, so its period is √(17.8³) ≈ 75 years.",
    ],
    formula: { expression: "T² = a³", meaning: "T is the orbital period in Earth years and a is the semi-major axis in astronomical units, for any body orbiting a star of one solar mass. In SI units the law becomes T² = 4π²a³ ÷ (GM)." },
    steps: [
      "Load the Earth-like quick scenario and watch Distance and Orbital speed for one simulated year, which takes 12 playback seconds. Note how little either value changes on a nearly circular orbit.",
      "Load Comet-like (a = 2 AU, e = 0.8). Predict where Orbital speed peaks, then compare the readout near the star, about 63 km/s, with the value at the far end, about 7 km/s.",
      "Look at the two blue swept sectors drawn from the star. Each covers the same time interval, so judge whether the short, wide sector and the long, thin one enclose equal areas.",
      "Set Semi-major axis to 1.59 AU and move Eccentricity from 0 to 0.8. Predict whether Period changes, then confirm it stays at about 2.0 years.",
      "Test the third law: set Semi-major axis to 0.5, 1, 2 and 3 AU and record Period each time. Check that Period² equals a³ in every case.",
    ],
    misconception: { myth: "Planetary orbits are long, stretched ellipses like the ones in textbook diagrams.", fact: "Most planetary orbits are close to circles. Earth’s eccentricity is about 0.017, so its distance from the Sun varies by only about 3%. Strongly elongated orbits belong to comets such as Halley’s, with an eccentricity of about 0.97." },
    modelNote: "One planet orbits a fixed star of one solar mass. Positions come from solving Kepler’s equation, M = E − e sin E, and speeds from the vis-viva equation, so the motion is calculated rather than drawn by hand. Pulls from other planets, the star’s own wobble and relativistic effects are ignored, and the star and planet are drawn far larger than scale.",
    faq: [
      { q: "What is Kepler’s second law in simple terms?", a: "Kepler’s second law says a planet sweeps out equal areas in equal times. Imagine a string stretched from the Sun to the planet: in any month, the string covers the same area. Near the Sun the string is short, so the planet must travel farther along its orbit to cover that area, which means it moves faster." },
      { q: "How do you use Kepler’s third law to find a planet’s period?", a: "Cube the semi-major axis in astronomical units, then take the square root to get the period in years. This works for anything orbiting the Sun. Jupiter has a semi-major axis of 5.20 AU, so its period is √(5.20³) ≈ 11.9 years, close to its observed 11.86 years." },
      { q: "Does Kepler’s third law work for moons?", a: "Yes, as long as the mass of the central body is included. The general form is T² = 4π²a³ ÷ (GM). Jupiter’s moon Io orbits at 421,700 km with a period of 1.77 days, and putting those numbers into the formula gives Jupiter’s mass, about 1.9 × 10²⁷ kg." },
      { q: "Why are planetary orbits elliptical?", a: "Any object moving under an inverse-square force, such as gravity from a single star, follows a conic section: a circle, ellipse, parabola or hyperbola. Which one depends on its energy. A bound planet has negative total energy and follows a closed ellipse; a circle is the special case with eccentricity 0, which real planets never match exactly." },
    ],
  },

  "earth-seasons-tilt": {
    question: "Why does Earth have seasons?",
    answer: "Earth has seasons because its axis is tilted about 23.4° from the perpendicular to its orbit and keeps pointing the same way in space as Earth circles the Sun. For half the year the Northern Hemisphere leans toward the Sun, so the Sun climbs higher and days last longer; six months later the Southern Hemisphere gets that advantage. At 40° N the noon Sun reaches about 73° in June but only about 27° in December, and daylight shrinks from roughly 15 hours to 9 hours.",
    science: [
      "Sunlight arriving at a steep angle is concentrated on a small patch of ground; at a low angle the same beam spreads over a larger area and passes through more air. Energy per square meter is proportional to the sine of the Sun’s altitude, so a noon Sun at 73° delivers about twice as much power to each square meter of ground as one at 27°. Longer days add more hours of heating.",
      "The latitude where the noon Sun is overhead is the solar declination, δ = asin(sin tilt × sin L), with L the orbital longitude measured from the March equinox. It swings between about +23.4° and −23.4°, marking the Tropics of Cancer and Capricorn. Day length at latitude φ follows from cos H = −tan φ × tan δ: at 60° N a 23.5° tilt gives about 18.5 hours of daylight in June and 5.5 hours in December.",
      "Temperatures lag behind sunlight. The June solstice brings the Northern Hemisphere its most daylight, yet the warmest weeks usually come in July or August, because land and oceans keep gaining more energy than they lose for several weeks. Planets with little tilt, such as Jupiter at about 3°, have almost no seasons, while Uranus, tilted about 98°, has extreme ones.",
    ],
    formula: { expression: "δ = asin(sin ε × sin L)", meaning: "δ is the solar declination, the latitude where the noon Sun is overhead; ε is the axial tilt and L the orbital longitude measured from the March equinox. The noon Sun’s altitude at latitude φ is then 90° − |φ − δ|." },
    steps: [
      "Load the June solstice quick scenario, which sets Observer latitude to 40°. Record Solar declination, Daylight and Noon Sun altitude, then predict each value for the December solstice.",
      "Load December solstice and compare. Daylight should fall from 14.85 h to 9.15 h and Noon Sun altitude from 73.5° to 26.5°, while Solar declination flips sign.",
      "Set Axial tilt to 0° and move Orbital longitude all the way around. Predict what happens to Daylight, then confirm it stays at 12 hours, meaning no seasons.",
      "Return Axial tilt to 23.5° and set Observer latitude to −40°. Compare Daylight at an Orbital longitude of 90° with the northern result to see opposite seasons.",
      "Set Observer latitude to 70° and Orbital longitude to 90°. Explain the 24-hour Daylight reading, then move to 270° to find the polar night.",
    ],
    misconception: { myth: "Summer happens when Earth is closest to the Sun.", fact: "Earth is closest to the Sun in early January, during northern winter, and the two hemispheres always have opposite seasons. The roughly 3% change in distance matters far less than the tilt, which sets the Sun’s height and the length of the day." },
    modelNote: "Daylight and declination come from spherical-geometry formulas for a tilted axis that holds a fixed direction in space. The orbit is treated as a circle, so the Earth–Sun distance never changes, and atmospheric refraction, which adds a few minutes of daylight, is left out. It shows sunlight geometry only, not weather or temperature.",
    faq: [
      { q: "Why are summer days longer than winter days?", a: "When your hemisphere tilts toward the Sun, more than half of your circle of latitude lies on Earth’s sunlit side, so you spend more of each rotation in daylight. At the equator day and night stay close to 12 hours each all year, but near London, at about 51° N, June days last around 16 hours and December days around 8." },
      { q: "Is Earth closer to the Sun in summer?", a: "Not for the Northern Hemisphere. Earth reaches perihelion, about 147 million km from the Sun, in early January and aphelion, about 152 million km, in early July. That distance change alters incoming sunlight by only about 7%. The Southern Hemisphere’s summer does coincide with perihelion, but its seasons are still driven by tilt." },
      { q: "What would happen if Earth had no axial tilt?", a: "With zero tilt the Sun would stay over the equator all year, every place would get about 12 hours of daylight every day, and the noon Sun’s height would never change. Seasons would almost disappear, apart from a small effect of Earth’s changing distance from the Sun. The poles would stay cold year-round, with the Sun always skimming the horizon." },
      { q: "What are the solstices and equinoxes?", a: "The solstices, around June 21 and December 21, are when one hemisphere is tilted most directly toward the Sun, giving the longest and shortest days of the year. The equinoxes, around March 20 and September 22, are when neither hemisphere tilts toward the Sun, the noon Sun is overhead at the equator, and day and night are nearly equal everywhere." },
    ],
  },

  "satellite-orbit-builder": {
    question: "How fast does a satellite need to go to stay in orbit?",
    answer: "A satellite at 400 km altitude needs about 7.7 km/s, roughly 27,600 km/h, to stay in a circular orbit around Earth. The required speed is v = √(GM/r), so it falls as altitude rises: about 6.9 km/s at 2,000 km and about 3.07 km/s at the geostationary altitude of 35,786 km. Slightly too slow, and the orbit dips into the atmosphere; slightly too fast, and it stretches into an ellipse. At about 41% above circular speed, the satellite escapes Earth completely.",
    science: [
      "A satellite is falling all the time. Gravity bends its straight-line path toward Earth, and at the right speed the curved surface drops away exactly as fast as the satellite falls, so its height stays the same. This is Newton’s cannonball idea. Gravity provides the centripetal force, so GMm/r² = mv²/r, which gives v = √(GM/r).",
      "If a satellite is released sideways at the wrong speed, the release point becomes one end of an ellipse. With the injection speed a fraction q of circular speed, the eccentricity is |q² − 1|. At 400 km, 101% of circular speed gives e ≈ 0.02 and a high point near 680 km, while 99% drops the low point to about 136 km, deep enough in the atmosphere for drag to bring the satellite down quickly. A 400 km circle takes 92.4 minutes.",
      "Inclination, the tilt of the orbit relative to the equator, controls which latitudes a satellite passes over. A rocket launched due east gets an inclination equal to its launch latitude, so many launches from Cape Canaveral, at 28.5° N, begin near 28.5°. Changing inclination later is costly: a 10° plane change in low orbit takes about 1.3 km/s of delta-v.",
    ],
    formula: { expression: "v = √(GM ÷ r)", meaning: "v is the circular orbit speed, G the gravitational constant, M Earth’s mass (GM ≈ 398,600 km³/s²) and r the distance from Earth’s center, which is Earth’s 6,371 km radius plus the altitude." },
    steps: [
      "Load the Circular quick scenario and press Launch trajectory. Check that Eccentricity reads 0.000, Perigee altitude 400 km and Orbital period 92.4 min.",
      "Predict what a 1% speed error does. Set Injection speed to 99% and then 101%, launching each time, and compare Eccentricity and Perigee altitude.",
      "Load the Reentry scenario, which injects at 85% of circular speed, and launch. Explain why the trace ends in Surface impact even though Orbital period still shows a value.",
      "Return to 100% and raise Injection altitude from 400 km to 2,000 km. Predict how Orbital period changes, then compare the readout with Kepler’s third law.",
      "Change Orbit inclination from 28° to 60° and relaunch. Check whether Eccentricity or Orbital period changes, and describe what inclination alters instead.",
    ],
    misconception: { myth: "Astronauts float in orbit because there is no gravity in space.", fact: "At 400 km altitude gravity is still about 89% as strong as at Earth’s surface. Astronauts float because they and their spacecraft are falling around Earth together, so nothing presses them against the floor." },
    modelNote: "A satellite is injected sideways at a chosen altitude above a spherical Earth with point-mass gravity, and its path is integrated from gravity rather than drawn as a preset circle. Inclination tilts the orbital plane. Air drag, Earth’s equatorial bulge, the Moon’s pull and later engine burns are left out, so low orbits do not decay over time.",
    faq: [
      { q: "Why don’t satellites fall out of the sky?", a: "Satellites are falling, but they also move sideways so fast that they keep missing Earth. At 400 km altitude a speed of about 7.7 km/s carries a satellite far enough sideways that the curved surface drops away as fast as it falls. Without that sideways speed it would drop straight down like any other object." },
      { q: "What is a geostationary orbit?", a: "A geostationary orbit is a circular orbit above the equator at 35,786 km altitude, where one trip around Earth takes one sidereal day, about 23 hours 56 minutes. Because the satellite keeps pace with Earth’s rotation, it stays over the same point on the equator, so ground dishes can point at it without tracking. Many weather and communications satellites use it." },
      { q: "How long does it take a satellite to orbit Earth?", a: "It depends on altitude. In low Earth orbit, from 200 to 2,000 km, one orbit takes about 88 to 127 minutes, and the International Space Station takes about 92 minutes. GPS satellites, about 20,200 km up, take roughly 12 hours, and geostationary satellites take about 24 hours." },
      { q: "What is orbital inclination?", a: "Inclination is the angle between a satellite’s orbital plane and Earth’s equator. An inclination of 0° keeps the satellite over the equator, 90° carries it over both poles, and values in between let it reach latitudes up to that angle north and south. The International Space Station, at 51.6°, passes over most of the world’s population." },
    ],
  },

  "planet-size-comparison-3d": {
    question: "How do the planets compare in size to Earth?",
    answer: "The planets range from Mercury, with a radius of about 2,440 km or 0.38 Earths, to Jupiter, with a mean radius of about 69,911 km or 11 Earths. Because volume grows with the cube of the radius, Jupiter could hold about 1,300 Earths and Saturn about 760. Uranus and Neptune each have about 4 times Earth’s radius and roughly 60 times its volume. Venus is nearly Earth’s twin at 0.95 Earth radii, while Mars has about half Earth’s radius and only 15% of its volume.",
    science: [
      "Size comparisons get tricky because radius, surface area and volume scale differently. If one sphere has k times another’s radius, it has k² times the surface area and k³ times the volume. Jupiter’s radius is about 11 times Earth’s, so its disk covers about 120 times more area in a picture, while its volume is about 1,321 times larger. People who say “11 times bigger” are usually picturing width.",
      "Size does not reveal mass. Jupiter packs about 318 Earth masses into 1,321 Earth volumes, so its average density is only about 1.33 g/cm³, compared with Earth’s 5.51 g/cm³. Saturn averages about 0.69 g/cm³, less than water. The four inner planets are small rocky worlds, while the four outer planets are giants made mostly of hydrogen and helium, plus ices such as water, ammonia and methane in Uranus and Neptune.",
      "Even Jupiter is small next to the Sun, whose radius of about 696,000 km is 109 times Earth’s. A scale model helps: if Earth were a marble 1 cm across, Jupiter would be about 11 cm across and the Sun about 1.1 m. Distances are harder to picture, since at that scale Earth would orbit the Sun about 117 m away.",
    ],
    formula: { expression: "V = (4/3)πr³, so V₁ ÷ V₂ = (r₁ ÷ r₂)³", meaning: "V is a planet’s volume and r its mean radius. Because the ratio is cubed, a planet with twice Earth’s radius has eight times Earth’s volume." },
    steps: [
      "Load the Earth / Jupiter quick scenario. Before reading the numbers, predict how many Earths would fit inside Jupiter, then check Volume ratio B / A.",
      "Divide Jupiter radius by Earth radius to get about 11. Cube that number and check that the result matches the Volume ratio B / A readout of about 1,321×.",
      "Load Earth / Mars. Predict whether Mars has half Earth’s volume because it has about half its radius, then compare with the readout of about 0.151×.",
      "Load Ice giants to compare Uranus and Neptune. Note how a radius difference of only 3% becomes a Volume ratio B / A of about 0.915×, a difference near 9%.",
      "Set Planet A to Mercury and Planet B to Saturn. Drag and zoom the 3D view to compare the two spheres, then record the Volume ratio B / A.",
    ],
    misconception: { myth: "Jupiter is about 11 times bigger than Earth in every way.", fact: "Jupiter is about 11 times wider than Earth, but volume depends on the radius cubed, so it has roughly 1,300 times Earth’s volume. Its mass, about 318 Earths, is smaller still because Jupiter is much less dense." },
    modelNote: "Planets are drawn as perfect spheres on one true radius scale using mean radii, so the size ratios are accurate. Distances between planets are not shown, Saturn’s rings and the slight flattening of spinning planets are left out, and colors other than Earth’s surface texture are illustrative.",
    faq: [
      { q: "What is the largest planet in the solar system?", a: "Jupiter is the largest planet, with a mean radius of about 69,911 km, roughly 11 times Earth’s. Its mass, about 318 Earth masses, is more than twice that of all the other planets combined. Saturn is second at about 58,232 km, or 9.1 Earth radii, though its rings make it look larger in pictures." },
      { q: "What is the smallest planet in the solar system?", a: "Mercury is the smallest planet, with a radius of about 2,440 km, only 38% of Earth’s. It is even smaller than Jupiter’s moon Ganymede and Saturn’s moon Titan, although both moons have less mass. Mercury has held the title since Pluto was reclassified as a dwarf planet in 2006, and about 18 Mercurys would fit inside Earth by volume." },
      { q: "How many Earths can fit inside the Sun?", a: "About 1.3 million Earths would fit inside the Sun by volume, because the Sun’s radius is about 109 times Earth’s and 109³ is roughly 1.3 million. That figure imagines the Earths melted together; solid spheres packed with gaps would fit fewer. The Sun holds about 99.8% of all the mass in the solar system." },
      { q: "Is Venus the same size as Earth?", a: "Venus comes very close: its radius of about 6,052 km is 95% of Earth’s, and its volume is about 86% of Earth’s, which is why it is often called Earth’s twin. Beyond size the two are very different. Venus has a dense carbon dioxide atmosphere with about 92 times Earth’s surface pressure and surface temperatures near 465 °C." },
    ],
  },

  "black-hole-orbit": {
    question: "How close can something orbit a black hole?",
    answer: "Around a nonrotating black hole, nothing can follow a stable circular orbit closer than 3 Schwarzschild radii, a boundary called the innermost stable circular orbit. Inside it, circular orbits are unstable and orbiting gas plunges toward the black hole. At 1.5 Schwarzschild radii only light can circle, and at 1 Schwarzschild radius, the event horizon, nothing can escape. The Schwarzschild radius is rₛ = 2GM/c², about 2.95 km per solar mass, so a black hole of 10 solar masses has a horizon radius of about 29.5 km.",
    science: [
      "Far from the horizon, a black hole’s gravity is ordinary: an orbit hundreds of Schwarzschild radii out behaves almost exactly as Newton predicts. Close in, general relativity strengthens the attraction, and below 3rₛ an orbit has no stable resting distance, so a small nudge sends it inward or outward. That radius marks the inner edge of a black hole’s accretion disk, where hot gas stops orbiting and falls in.",
      "The readouts follow from the Schwarzschild solution of general relativity. The horizon radius is rₛ = 2GM/c², or 29.5 km for 10 solar masses. An observer hovering at radius r would see a circular orbit pass at c/√[2(r/rₛ − 1)], which is 26.7% of light speed at 8rₛ and 50% at 3rₛ. A clock held stationary at r ticks at √(1 − rₛ/r) of a distant clock’s rate, 0.935 at 8rₛ.",
      "Real black holes span a huge range. Stellar black holes, left behind when massive stars collapse, have masses from about 5 to several tens of Suns. Sagittarius A*, at the center of the Milky Way, has about 4 million solar masses and a Schwarzschild radius near 12 million km; the Event Horizon Telescope released an image of the glowing gas around it in 2022.",
    ],
    formula: { expression: "rₛ = 2GM ÷ c²", meaning: "rₛ is the Schwarzschild radius, the radius of the event horizon of a nonrotating black hole; G is the gravitational constant, M the black hole’s mass and c the speed of light. It works out to about 2.95 km for every solar mass." },
    steps: [
      "Start with the Safe orbit quick scenario, 10 solar masses at 8 rₛ. Find the dark horizon sphere, the amber photon-orbit ring and the blue innermost-stable-orbit ring in the 3D view.",
      "Predict whether doubling Black hole mass from 10 to 20 changes Local orbit speed at 8 rₛ. Compare: Horizon radius doubles to about 59.1 km, while Local orbit speed stays at 26.7% c.",
      "Move Circular orbit radius slowly from 8 rₛ toward 3 rₛ. Record Local orbit speed and Stationary clock / far clock at 8, 5, 4 and 3.1 rₛ.",
      "Load the Unstable scenario at 2.5 rₛ. Explain why the notice reads No stable circular orbit at this radius and the probe disappears, even though the probe is still outside the horizon.",
      "Set Circular orbit radius to its minimum, 2 rₛ, and read Stationary clock / far clock, 0.707. Predict its value at the horizon, where √(1 − rₛ/r) reaches zero.",
    ],
    misconception: { myth: "Black holes suck in everything around them like cosmic vacuum cleaners.", fact: "Beyond a few Schwarzschild radii, a black hole pulls like any other object of the same mass. If the Sun were replaced by a black hole of equal mass, Earth would keep the same orbit, just in darkness." },
    modelNote: "A nonrotating (Schwarzschild) black hole with exact formulas for the horizon radius, the 3 rₛ stability limit, local orbit speed and the stationary-clock rate. The probe’s animation speed is rescaled for viewing and only circular orbits are shown. Black hole spin, gravitational lensing, tidal stretching and an accretion disk are not drawn.",
    faq: [
      { q: "What is the event horizon of a black hole?", a: "The event horizon is the boundary around a black hole from which nothing, not even light, can escape. For a nonrotating black hole it is a sphere whose radius is the Schwarzschild radius, rₛ = 2GM/c². The horizon is not a solid surface; a falling object would not hit anything there, but once inside it could never send a signal back out." },
      { q: "How big would the Sun be if it became a black hole?", a: "If all of the Sun’s mass were squeezed into a black hole, its Schwarzschild radius would be about 2.95 km, so the horizon would be under 6 km across. Earth’s mass would make a black hole only about 9 mm in radius. The Sun is far too small to collapse this way; only stars many times more massive end their lives as black holes." },
      { q: "Does time slow down near a black hole?", a: "Yes. Clocks deeper in a gravitational field tick more slowly than distant clocks. A stationary clock at radius r outside a nonrotating black hole runs at √(1 − rₛ/r) of the far-away rate: about 0.935 at 8 Schwarzschild radii and 0.707 at 2. The same effect, much weaker, exists around Earth, and GPS satellites must correct for it." },
      { q: "What is the innermost stable circular orbit?", a: "The innermost stable circular orbit, or ISCO, is the closest distance at which matter can keep circling a black hole without spiraling in. For a nonrotating black hole it lies at 3 Schwarzschild radii, which equals 6GM/c². A fast-spinning black hole pulls it much closer for matter orbiting in the same direction as the spin." },
    ],
  },

  "mars-landing-challenge": {
    question: "Why is landing on Mars so difficult?",
    answer: "Landing on Mars is difficult because its atmosphere is thick enough to heat a spacecraft but too thin to slow it fully. Surface air density is only about 0.020 kg/m³, under 2% of Earth’s, so parachutes cannot bring a lander down to a safe speed. Gravity of 3.71 m/s², about 38% of Earth’s, keeps pulling, so rocket engines must remove the last tens of meters per second. Radio signals take between about 3 and 22 minutes to reach Earth, so the landing must run automatically.",
    science: [
      "A Mars landing happens in stages. A heat shield slows the spacecraft from about 5 to 6 km/s during atmospheric entry, a supersonic parachute brings it to under about 100 m/s, and rockets handle the rest. The final powered descent is what the challenge simulates: engine thrust, gravity and a little drag decide the vertical speed, and the craft must reach the ground at no more than 3 m/s.",
      "The lander starts with 1,300 kg of mass, so its weight on Mars is 1,300 × 3.71 ≈ 4,820 N. A 9,000 N engine therefore hovers at about 54% throttle and can brake the craft by at most about 3.2 m/s². Stopping from 45 m/s at that rate takes v²/(2a) ≈ 315 m, and every second of delay lets gravity add speed. Drag helps only a little, about 0.3 m/s² at 45 m/s near the ground.",
      "NASA’s Curiosity (2012) and Perseverance (2021) rovers were too heavy for airbags, so a rocket-powered sky crane hovered above the surface and lowered each rover on cables. Engineers call the entry, descent and landing sequence “seven minutes of terror” because it is over before the first radio signal about it reaches Earth. Both landings relied on onboard feedback control that adjusted thrust automatically.",
    ],
    formula: { expression: "a = (F + D) ÷ m − g", meaning: "a is the lander’s upward acceleration, F the engine thrust, D the upward drag force ½ρC_dAv², m the current mass and g Mars gravity, 3.71 m/s². Thin air keeps D small, so F does almost all of the braking." },
    steps: [
      "Leave Landing assist on Assisted descent and press Begin descent. Watch Vertical velocity shrink from −45 m/s while thrust stays near 65%, and note the Fuel left at touchdown, about 304 kg.",
      "Load Manual flight and begin the descent with Manual throttle at 35%. Predict whether the lander slows down, then read the impact speed in the crash notice.",
      "Work out the hover throttle from 1,300 kg × 3.71 m/s² and the 9 kN maximum thrust. Fly at that setting and check that Vertical velocity changes only slowly instead of reaching zero.",
      "For a manual landing, hold Manual throttle at 100% from about 550 m, then switch between about 45% and 60% to keep Vertical velocity near −2 m/s. The ↑ and ↓ keys move throttle 5%.",
      "Compare the Fuel left after your best manual landing with the assisted one, and explain why braking later uses less propellant but leaves a smaller safety margin.",
    ],
    misconception: { myth: "Parachutes alone can land a spacecraft safely on Mars.", fact: "Mars’s air is so thin that even huge parachutes leave a lander falling at tens of meters per second. Every successful Mars lander has fired rockets for the final part of its descent, some with airbags as well." },
    modelNote: "Straight-down powered descent from 800 m at 45 m/s, with Mars gravity of 3.71 m/s², an exponential atmosphere starting at 0.020 kg/m³, quadratic drag, a 9 kN engine and 400 kg of propellant that lightens the craft as it burns. Heat-shield entry, parachutes, sideways motion, wind and terrain are left out, and the lander and ground are drawn larger than scale.",
    faq: [
      { q: "What is the gravity on Mars compared to Earth?", a: "Mars’s surface gravity is 3.71 m/s², about 38% of Earth’s 9.81 m/s². A person who weighs 600 N on Earth would weigh about 227 N on Mars. Mars has only about 11% of Earth’s mass, but its smaller radius, 3,390 km, puts its surface closer to its center, which raises its surface gravity." },
      { q: "How long does it take to land on Mars?", a: "Entry, descent and landing take about seven minutes from the top of the atmosphere to the ground. In that time the spacecraft slows from roughly 20,000 km/h to walking pace using a heat shield, a parachute and rockets. Because radio signals need several minutes to reach Earth, the sequence is finished before mission control hears that it began." },
      { q: "Why can’t a Mars landing be controlled from Earth?", a: "Radio signals travel at the speed of light, but Mars is between about 55 million and 400 million km from Earth, so a one-way message takes several minutes or more. A command sent after seeing a problem would arrive far too late. Landers therefore carry their own radar, cameras and software that adjust thrust and steering by themselves." },
      { q: "Does Mars have an atmosphere?", a: "Yes, but it is thin and made of about 95% carbon dioxide. Average surface pressure is about 0.6 kPa, less than 1% of Earth’s sea-level pressure. That is enough to drive dust storms and to heat an entering spacecraft until it glows, but not enough for parachutes alone to land one safely." },
    ],
  },
};
