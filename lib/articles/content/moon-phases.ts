export const moonPhases = `
The Moon doesn't actually change shape. The Sun always lights half of the Moon, and as the Moon orbits Earth, taking about 29.5 days to go from one new moon to the next, we see different amounts of that sunlit half. When the lit side faces us we see a full moon; when it faces away we see a new moon.

That answer is easy to repeat and harder to picture. This article explains moon phases step by step: how much of the Moon is lit at each point in its orbit, waxing vs waning, why Earth's shadow is not the cause, and why we always see the same face. It then gives 10 experiments for students in grades 6 to 12 and their teachers, using a lamp and a ball, two free 3D simulations, and real sky observations.

## What causes moon phases?

The Moon makes no light of its own; it reflects sunlight. At any moment, the half facing the Sun is in daylight and the other half is in night, just as on Earth. [NASA's Moon phases overview](https://science.nasa.gov/moon/moon-phases/) describes phases the same way: the lit half stays lit, and what changes is how much of it we can see from Earth.

As the Moon travels around Earth, the angle between the Sun, Earth, and the Moon changes. When the Moon is roughly between Earth and the Sun, its sunlit half faces away from us. When it is on the far side of Earth from the Sun, its sunlit half faces us. Every phase in between is a partial view of the same lit hemisphere. A phase is a viewing angle, not a change in the Moon.

## How much of the Moon is lit? The illuminated fraction

Let θ be the Moon's position around its orbit, measured from new moon. At θ = 0° the Moon is between Earth and the Sun; at θ = 180° it is opposite the Sun. The lit fraction of the visible disk is modeled by (1 − cos θ) ÷ 2.

- 0°: (1 − 1) ÷ 2 = 0, so 0% is lit: new moon.
- 45°: cos 45° ≈ 0.707, so (1 − 0.707) ÷ 2 ≈ 0.146, about 15%: a thin waxing crescent.
- 90°: cos 90° = 0, so the fraction is 0.5, or 50%: first quarter.
- 135°: cos 135° ≈ −0.707, so (1 + 0.707) ÷ 2 ≈ 0.854, about 85%: waxing gibbous.
- 180°: (1 + 1) ÷ 2 = 1, so 100% is lit: full moon.

The fraction does not grow evenly. The first 45° adds about 15% of the disk, while the next 45° adds about 35%, which is why a thin crescent seems to fatten quickly after a few days.

:::figure moon-phase-geometry

:::answer Check yourself: how much of the Moon is lit at 60°?
cos 60° = 0.5, so (1 − 0.5) ÷ 2 = 0.25. About 25% is lit, a waxing crescent. It is well under half even though 60° is two-thirds of the way to first quarter, because the fraction follows a cosine curve, not a straight line.
:::

## The eight moon phases in order

- New moon: the lit side faces away from Earth.
- Waxing crescent: a thin sliver that grows each night.
- First quarter: half the disk is lit; the Moon is a quarter of the way around its orbit.
- Waxing gibbous: more than half lit and growing.
- Full moon: the whole disk facing Earth is lit.
- Waning gibbous: more than half lit and shrinking.
- Last quarter: half lit again, on the opposite side.
- Waning crescent: a shrinking sliver seen before sunrise.

"Crescent" means less than half the disk is lit; "gibbous" means more than half but not all.

## Waxing vs waning: which side is lit?

Waxing means the lit part is growing, from new moon toward full. Waning means it is shrinking, from full back toward new. From the Northern Hemisphere, a waxing Moon is lit on the right and a waning Moon on the left. From the Southern Hemisphere the view is flipped, because observers there see the Moon "upside down" compared with northern observers. A waxing Moon is easiest to see in the evening; a waning Moon, late at night and in the morning.

## Why doesn't Earth's shadow cause moon phases?

A common explanation is that Earth's shadow covers part of the Moon. The geometry rules it out. Earth's shadow always points directly away from the Sun, so the Moon can only enter it at full moon. When the Sun, Earth, and Moon line up closely then, the result is a lunar eclipse, not a phase. The [NASA eclipses hub](https://science.nasa.gov/eclipses/) describes a lunar eclipse as Earth passing between the Sun and the Moon. The dark part of a crescent moon is simply the Moon's own night side.

## How long is the lunar cycle? Synodic vs sidereal month

The Moon completes one orbit relative to the stars in about 27.3 days, the sidereal month. From one new moon to the next takes about 29.5 days, the synodic month, which is the cycle of phases. The extra two days are needed because Earth moves along its own orbit meanwhile, so the Moon must travel a little farther to line up with the Sun again. [OpenStax Astronomy 2e](https://openstax.org/books/astronomy-2e/pages/4-5-phases-and-motions-of-the-moon) covers both months and the phase cycle in more detail.

## Why do we always see the same side of the Moon?

The Moon spins once on its axis in the same time it takes to orbit Earth. This is called synchronous rotation, and it keeps the same hemisphere facing us. The far side is not permanently dark: at new moon it is fully lit while the side facing us is in darkness.

## Why isn't there an eclipse every month?

The Moon's orbit is tilted about 5° to the plane of Earth's orbit. At most new moons the Moon passes a little above or below the Sun–Earth line, so its shadow misses Earth; at most full moons it misses Earth's shadow. At the Moon's average distance of about 384,400 km, that tilt can put it more than 30,000 km above or below the line. Eclipses happen only when a new or full moon falls near one of the two points where the Moon's orbit crosses Earth's orbital plane. The [OpenStax section on eclipses](https://openstax.org/books/astronomy-2e/pages/4-7-eclipses-of-the-sun-and-moon) explains this alignment and the difference between total and annular solar eclipses.

## 10 experiments to understand moon phases: models and simulations

Write a prediction before each experiment, then compare it with what you see.

### Experiment 1: Lamp-and-ball model in a dark room

- What you need: a lamp without its shade, a foam ball on a pencil, and a dark room. Use a lamp, never the real Sun.
- Steps: Your head is Earth, the lamp is the Sun, and the ball is the Moon. Hold the ball at arm's length between you and the lamp, slightly above your head, then turn slowly to your left.
- Prediction: Sketch the ball's appearance at a quarter, half, and three-quarter turn.
- What you should see: dark, then crescent, half, gibbous, fully lit opposite the lamp, and the sequence in reverse.
- What it shows: half the ball is always lit; only your viewing angle changes.

### Experiment 2: The four main phases in the Moon Phases 3D Simulator

- What you need: the [Moon Phases 3D Simulator](/en/simulations/moon-phases-3d). Its one control, the Moon orbital angle, runs from 0° to 360° in 5° steps and starts at 60°.
- Steps: Set 0°, 90°, 180°, and 270°, and record what the observer disk (the view from Earth) shows. This is the simulator's mission.
- Prediction: name each phase before moving the control.
- What you should see: new moon, first quarter, full moon, and last quarter.
- What it shows: each phase matches an orbital position. The 3D overview exaggerates sizes, so treat it as a diagram of positions, not a scale model.

### Experiment 3: Calculate the illuminated fraction

- What you need: a calculator and the same simulator.
- Steps: Use (1 − cos θ) ÷ 2 at 45° and 135°, then set those angles in the simulator.
- Prediction: 14.6% at 45° and 85.4% at 135°.
- What you should see: a thin crescent, then a nearly full gibbous moon.
- What it shows: the simulator's output is a model prediction assuming a coplanar orbit and a distant Sun. The real orbit's 5° tilt is left out.

### Experiment 4: Waxing vs waning

- What you need: the simulator or lamp model.
- Steps: Compare 45° with 315°, and 135° with 225°.
- Prediction: each pair has the same lit fraction. Calculate it to check.
- What you should see: equal but mirrored shapes. Seen from the Northern Hemisphere, angles under 180° are lit on the right and angles over 180° on the left.
- What it shows: the lit side, not the shape, tells you waxing from waning. In the Southern Hemisphere the sides flip.

### Experiment 5: The shadow misconception test

- What you need: the lamp model.
- Steps: Hold the ball at first quarter, beside you, and find your head's shadow.
- Prediction: Where would Earth's shadow be at first quarter?
- What you should see: the shadow falls behind you, pointing away from the lamp. The ball is outside it and still half lit. Only directly behind your head does it go dark, which models a lunar eclipse.
- What it shows: Earth's shadow points away from the Sun, so it cannot make crescents or quarters.

## Moon phases experiments with the real sky

### Experiment 6: A one-month moon diary

- What you need: a notebook or a [digital science notebook](/en/articles/how-to-create-a-digital-science-notebook) and a view of the sky.
- Steps: On as many days as possible, sketch the Moon's shape and record the date, time, and position. Observe the Moon only. Never look at the Sun or point binoculars near it, even when a crescent Moon is close to it.
- Prediction: When will a first quarter moon be visible? (Hint: afternoon and evening.)
- What you should see: the lit part grows, becomes full, and shrinks over about 29.5 days.
- What it shows: the sky follows the same sequence as the models. Cloudy gaps are normal.

### Experiment 7: The moonrise delay

- What you need: moonrise times for seven days from a local almanac or astronomy app.
- Steps: Find each day-to-day difference and the average.
- Prediction: 24 h ÷ 29.5 days ≈ 0.81 h, or about 49 minutes.
- What you should see: moonrise about 50 minutes later each day on average, with individual days varying by season and latitude.
- What it shows: the Moon moves east along its orbit, so Earth must turn a little longer to bring it back into view.

:::answer Check yourself: why is the delay close to 24 h ÷ 29.5?
Over one synodic month, the Moon goes once around the sky relative to the Sun, so its rising time slips through a full 24 hours. Spreading 24 hours over 29.5 days gives about 49 minutes per day.
:::

## Experiments on rotation and eclipses

### Experiment 8: Synchronous rotation with a chair

- What you need: a chair in open space.
- Steps: The chair is Earth and you are the Moon. Walk once around it, always facing it.
- Prediction: Will you rotate as you walk?
- What you should see: you face every wall of the room once, so you turn exactly once per circuit.
- What it shows: the Moon spins once per orbit, which keeps the same face toward Earth.

### Experiment 9: The Solar Eclipse 3D Simulator

- What you need: the [Solar Eclipse 3D Simulator](/en/simulations/solar-eclipse-3d).
- Steps: Set the sky alignment offset to 0° so the centers line up. Set the Earth–Moon center distance to 356,000 km, then 406,000 km. Then move the offset toward 0.8° or −0.8°.
- Prediction: At which distance will the Moon cover the Sun completely?
- What you should see: a total eclipse at 356,000 km and an annular eclipse at 406,000 km. As the offset grows, the report changes to partial and then no eclipse, and the percentage of the Sun's disk covered falls. The Earth–Sun distance is fixed at 1 AU.
- What it shows: a solar eclipse needs a new moon plus close alignment, and the Moon's distance decides whether it can be total.

### Experiment 10: Why there is no eclipse every month

- What you need: the lamp model plus a hula hoop or a paper plate with its center cut out.
- Steps: Hold the hoop around your head tilted about 5°, lamp at eye level. Move the ball along the hoop, then turn so the tilt points another way and repeat.
- Prediction: Will the ball cross the lamp–head line at every new and full moon?
- What you should see: usually the ball passes above or below the line. The model is far out of scale, so you may need to exaggerate the tilt to see this clearly.
- What it shows: eclipses need a new or full moon near a crossing point of the tilted orbit.

## A related sunlight effect: seasons

Seasons depend on a different sunlight angle. Earth's axial tilt of about 23.4° changes how directly sunlight strikes each hemisphere, and seasons are caused by that tilt, not by Earth's distance from the Sun. The [Earth Seasons & Tilt Simulator](/en/simulations/earth-seasons-tilt) lets you change orbital longitude, axial tilt (0° to 35°), and observer latitude (−70° to 70°), and the [seasons guide](/en/guides/earth-seasons-tilt) walks through the comparisons.

## Tips for teachers

Start with the lamp model before the simulator, so students do not read the 3D view as a scale picture. The [Moon phases simulator guide](/en/guides/moon-phases-3d) offers a structured route through the same ideas. Ask students to explain each phase using "lit half" and "viewing angle"; those words reveal quickly whether the shadow idea persists. For background, see [why visual learning helps science](/en/articles/why-visual-learning-helps-science) and [learning physics without memorizing formulas](/en/articles/learn-physics-without-memorizing-formulas), which fits treating (1 − cos θ) ÷ 2 as geometry. If students use AI tools, [checking AI-generated science answers](/en/articles/check-ai-generated-science-answers) includes separating lunar phases from eclipses.

## Frequently asked questions

### Why does the Moon change shape?

It doesn't. The Sun always lights one half of the Moon. As the Moon orbits Earth over about 29.5 days, we see that lit half from different angles. When the lit half faces us we see a full moon, when it faces away we see a new moon, and in between we see crescents, quarters, and gibbous shapes.

### Does Earth's shadow cause the phases of the Moon?

No. Earth's shadow points directly away from the Sun, so the Moon can only enter it at full moon, and when it does, the result is a lunar eclipse. Eclipses are much rarer than phases because the Moon's orbit is tilted. The dark part of a crescent or quarter moon is the Moon's own night side.

### How can I tell if the Moon is waxing or waning?

From the Northern Hemisphere, a waxing Moon is lit on the right and a waning Moon is lit on the left; from the Southern Hemisphere it is the reverse. Timing helps too. A waxing Moon is easiest to see in the evening after sunset, while a waning Moon is easiest to see late at night or in the morning.

### How long does it take the Moon to go through all its phases?

About 29.5 days, the synodic month, from one new moon to the next. The Moon orbits once relative to the stars in about 27.3 days, the sidereal month. The phase cycle is longer because Earth moves along its own orbit around the Sun, so the Moon must travel farther to line up with the Sun again.

### Why does the Moon rise later every day?

The Moon moves east along its orbit each day, so Earth has to rotate a little extra before the Moon rises again. On average, moonrise comes about 50 minutes later each day. A quick estimate, 24 hours divided by 29.5 days, gives about 49 minutes. The delay on any given day varies with season and latitude.

### Why don't we have an eclipse every month?

The Moon's orbit is tilted about 5° to Earth's orbit around the Sun. At most new and full moons, the Moon passes above or below the Sun–Earth line, so no eclipse occurs. Eclipses happen only when a new or full moon falls near a point where the Moon's orbit crosses Earth's orbital plane, which is why they come in seasons.

## Next steps: explore moon phases yourself

The Moon doesn't change shape; it is a half-lit sphere seen from a moving point of view. Start with the lamp and ball, check your predictions in the [Moon Phases 3D Simulator](/en/simulations/moon-phases-3d), test alignments in the [Solar Eclipse 3D Simulator](/en/simulations/solar-eclipse-3d), and keep a moon diary for a month. For more astronomy activities, browse the [space subject page](/en/subjects/space), and see [NASA's Moon phases page](https://science.nasa.gov/moon/moon-phases/) for background reading.
`;
