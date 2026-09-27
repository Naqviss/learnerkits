export const climateExperiments = `
Climate change is the long-term shift in Earth's climate, and today's warming is driven mainly by human greenhouse-gas emissions, mostly carbon dioxide (CO₂) from burning fossil fuels. These gases trap more of the heat Earth radiates to space, creating an energy imbalance that warms the atmosphere, ocean, and land. The [IPCC Sixth Assessment Report](https://www.ipcc.ch/report/ar6/wg1/) states that it is unequivocal that human influence has warmed the atmosphere, ocean and land.

This guide explains climate change for students and teachers through four big ideas: energy balance, stocks and flows, delayed response, and the difference between reducing causes and managing effects. Each idea is paired with interactive climate simulations from LearnerKits, giving you ten experiments with clear questions, controls, and presets. You will also find guidance on reading model results honestly and a suggested lesson order for the classroom.

## What is the difference between weather and climate?

Weather is the condition of the atmosphere at a particular place and time: today's temperature, tomorrow's rain, this afternoon's wind. Climate is the pattern of weather over a long period, usually described with averages and ranges across about 30 years or more. A cold week does not disprove a warming climate, just as one hot afternoon does not demonstrate it. [OpenStax Biology 2e's climate section](https://openstax.org/books/biology-2e/pages/44-5-climate-and-the-effects-of-global-climate-change) draws the same line between a single weather event and long-term climate.

A helpful comparison is mood and personality. Your mood changes from hour to hour, while your personality describes what is typical over years. Climate scientists look at long records of temperature, rainfall, sea level, and ice so that short-term variation does not hide the long-term trend. When you run a climate simulation, you are usually looking at decades, not days.

## How does the greenhouse effect change Earth's energy balance?

Earth receives energy as sunlight. Some is reflected straight back to space by clouds, ice, and bright surfaces; the rest is absorbed and warms the planet. A warm planet emits infrared radiation. Greenhouse gases such as CO₂ and methane absorb some of that outgoing infrared and re-emit energy in all directions, including back toward the surface. Without any greenhouse effect, Earth would be far colder than it is.

The problem is not the greenhouse effect itself but its strengthening. Adding more greenhouse gas means that, for a while, less energy leaves than arrives. That gap is called an energy imbalance or radiative forcing, measured in watts per square meter (W/m²). The planet warms until it emits enough extra infrared to close the gap.

A standard simplified formula for CO₂ forcing is ΔF ≈ 5.35 × ln(C/C₀) W/m², where C is the new concentration and C₀ is the starting one. For a doubling from 280 to 560 ppm, ln 2 ≈ 0.693, so ΔF ≈ 5.35 × 0.693 ≈ 3.7 W/m². This is a widely used approximation, not necessarily the exact equation inside any particular simulator, but it shows why each doubling of CO₂ adds a similar amount of forcing.

## Why do stocks and flows matter in the carbon cycle?

A stock is an amount stored; a flow is a rate of change. The CO₂ in the atmosphere is a stock, measured in parts per million (ppm). Emissions and natural uptake are flows, measured in gigatonnes of CO₂ per year (GtCO₂/yr). [NOAA's carbon cycle resources](https://www.noaa.gov/education/resource-collections/climate/carbon-cycle) describe how carbon moves between the atmosphere, ocean, land, and living things.

Confusing stocks and flows leads to a common misconception: that cutting emissions immediately lowers the CO₂ concentration. It does not. If more flows in than flows out, the stock still rises, just more slowly. Picture a bathtub with the tap running and the drain open. The water level keeps rising until the inflow is no larger than the outflow.

## How to use these climate change experiments

Each experiment below starts with a question, lists the controls and presets you will use, and suggests an investigation. Before changing anything, write a prediction and a reason. Change one control at a time, record the settings beside every result, and keep the baseline run so you can compare. A [digital science notebook](/en/articles/how-to-create-a-digital-science-notebook) is a good place to keep these records.

If you want a visual walkthrough of every control, the illustrated [environmental science lab guide](/en/guides/environmental-city-builder) covers the controls and investigations for all ten environmental labs. All of them are collected on the [environmental science subject page](/en/subjects/environmental-science).

## Energy balance experiments with the greenhouse effect simulator

The [Greenhouse Effect Simulator](/en/simulations/greenhouse-effect-simulator) asks: "Why does warming continue after greenhouse gas concentrations stop rising?" Its controls are atmospheric CO₂ from 280 to 800 ppm (default 560), atmospheric methane from 700 to 2600 ppb (default 1900), and planetary reflectivity from 0.26 to 0.34 (default 0.30). The presets are Pre-industrial reference (280 ppm, 700 ppb, 0.30), Double CO₂ only (560 ppm, 700 ppb, 0.30), and Higher reflectivity (0.31). The [greenhouse effect simulator guide](/en/guides/greenhouse-effect-simulator) explains each setting.

The simulator uses a two-layer global energy-balance model: the surface and the deep ocean store heat separately. It is not a dated projection of future temperatures, and it leaves out aerosols, clouds, and ice feedbacks.

### Experiment 1: Double CO₂ and watch the ocean delay warming

Start with Pre-industrial reference to see the zero-forcing baseline. Then select Double CO₂ only. Notice that this preset keeps methane at 700 ppb, so CO₂ is the only gas that changes. That is a controlled comparison. The default setting of 1900 ppb methane would add a second variable.

Record the warming after 20 years and after 100 years. Look for the shape of the curve rather than a single number. The concentration is fixed from the start, yet the temperature keeps climbing. The reason is the deep ocean. Water has a large heat capacity, and the deep layer keeps absorbing heat from the surface, holding surface warming below its eventual level. As the deep ocean slowly warms, it absorbs less, and the surface moves closer to balance. This lag is why warming continues even after greenhouse gas concentrations stop rising.

### Experiment 2: Change planetary reflectivity

Reflectivity, also called albedo, is the fraction of incoming sunlight sent straight back to space. Run Double CO₂ only as your baseline, then raise reflectivity to 0.31 while keeping both gases fixed. Compare the warming at 20 and 100 years with the baseline.

A rough calculation shows why a small change matters. Averaged over the whole planet, about 340 W/m² of sunlight arrives at the top of the atmosphere. Increasing reflectivity by 0.01 reflects about 0.01 × 340 ≈ 3.4 W/m² more, which is similar in size to the 3.7 W/m² from doubling CO₂. Use this as a reason for your prediction, not as the simulator's output. Then discuss why real reflectivity is hard to control and why the model omits clouds and ice, which strongly influence reflectivity on the real Earth.

## Carbon cycle experiment: is halving emissions enough?

### Experiment 3: Stocks, flows, and the carbon bathtub

The [Carbon Cycle Simulator](/en/simulations/carbon-cycle-simulator) asks: "Is cutting emissions in half enough to stop atmospheric CO₂ rising?" Its controls are human emissions from 0 to 50 GtCO₂/yr (default 38), the land sink at 420 ppm from 0 to 18 (default 9), the ocean sink at 420 ppm from 0 to 14 (default 10), and engineered removal from 0 to 25 (default 0). The presets are Emissions halved (19), No human emissions (0), and Balance at start (emissions 19, land 9, ocean 10). The [carbon cycle simulator guide](/en/guides/carbon-cycle-simulator) describes the full setup.

:::figure carbon-stock-flow

Work through the bathtub arithmetic before pressing anything. With default settings, 38 GtCO₂/yr flows in. The land removes 9 and the ocean removes 10, so 9 + 10 = 19 GtCO₂/yr flows out. The net flow is 38 − 19 = +19 GtCO₂/yr, which accumulates in the atmosphere, so the stock in ppm keeps rising. Now halve emissions to 19. At the start, 19 in and 19 out gives a net flow of about zero. Halving emissions matches the starting sinks, which is why the concentration stops rising at first.

Next, try No human emissions and predict the direction of change at the start. Then add engineered removal and explain it as an extra outflow. Remember the model's assumptions: it starts at 420 ppm, treats reservoirs as linear, and omits sink saturation, fires, and land-use change. Real sinks may not keep pace in the same way, so treat the result as a demonstration of stock-and-flow reasoning rather than a forecast.

## Impact experiments: ocean acidification and sea level rise

### Experiment 4: Ocean acidification

The [Ocean Acidification Simulator](/en/simulations/ocean-acidification-simulator) asks: "How can seawater become more acidic while its pH remains above 7?" Its controls are atmospheric CO₂ from 280 to 900 ppm (default 620), warming above 25°C from 0 to 4°C, and a local respiration pressure index from 0 to 100. The presets are 280 ppm atmosphere, Double CO₂ (560), and Local nutrient pressure (80). The [ocean acidification simulator guide](/en/guides/ocean-acidification-simulator) explains the chemistry.

Acidification describes a direction of change, not a final state. Seawater remains basic, above pH 7, but its pH is falling. Because pH is logarithmic, a drop of 0.1 means hydrogen ion concentration is multiplied by 10^0.1 ≈ 1.26, about 26 percent more. [NOAA reports](https://oceanservice.noaa.gov/facts/acidification.html) that surface ocean pH has fallen by about 0.1 since the industrial revolution, roughly a 30 percent increase in acidity. The two figures differ because of rounding: a drop of 0.11 would give 10^0.11 ≈ 1.29, about 29 percent. The simulator uses simplified carbonate equilibrium and does not predict which species survive.

### Experiment 5: Sea level rise on two coasts

The [Sea Level Rise Simulator](/en/simulations/sea-level-rise-simulator) asks: "Why can two coasts experience different sea-level rise under the same warming?" Its controls are warming at the end of the scenario from 0.5 to 4.5°C (default 3), scenario length from 20 to 120 years (default 80), and land sinking rate from 0 to 5 mm/yr (default 1). The presets are Lower warming (1.5), Stable land (0), and Sinking coast (4).

The model separates three components: thermal expansion of warming seawater, melting land ice, and land subsidence. Compare Stable land with Sinking coast at the same warming. Subsidence of 4 mm/yr for 80 years adds 4 × 80 ÷ 1000 = 0.32 m of extra relative rise. The default of 1 mm/yr adds only 0.08 m. [NOAA's sea level explainer](https://oceanservice.noaa.gov/facts/sealevel.html) likewise names thermal expansion and melting land ice as the two major causes of global rise, and notes that local factors such as land subsidence make relative sea level rise differ from place to place. The simulator's rates are illustrative, not IPCC projections.

## Local climate experiments: urban heat and the water cycle

### Experiment 6: Urban heat island

The [Urban Heat Island Simulator](/en/simulations/urban-heat-island-simulator) asks: "Why does a paved neighborhood stay warm after sunset?" Its controls are tree canopy from 0 to 60 percent, reflective roofs from 0 to 100 percent of roofs, permeable ground from 0 to 80 percent, and a regional daily maximum from 28 to 44°C (default 39). The presets are Add shade (trees 50), Cool roofs (90), and Greener neighborhood.

Compare air temperatures at 15:00 and 22:00 for each preset, and check the runoff reading. Paving and dark roofs absorb heat during the day and release it in the evening, so the late reading is often the more revealing one. The [EPA's heat island reduction solutions](https://www.epa.gov/heatislands/heat-island-reduction-solutions) include trees and vegetation, green roofs, cool roofs, and cool pavements, which map onto the simulator's controls.

### Experiment 7: Deforestation and the water cycle

The [Deforestation & Water Cycle Simulator](/en/simulations/deforestation-water-cycle-simulator) asks: "Where does rain go when forest soil is compacted?" Its controls are forest cover from 0 to 100 percent, peak rainfall intensity from 10 to 100 mm/hr, hillslope angle from 0 to 35°, and a soil compaction index from 0 to 100. The presets are Forested soil, Cleared compacted, and Gentler rain.

Keep a water ledger: rainfall = interception + infiltration + runoff. Every millimeter must go somewhere. When canopy is removed and soil is compacted, less water is intercepted or soaks in, so more must run off. The [USGS explains](https://www.usgs.gov/water-science-school/science/infiltration-and-water-cycle) that infiltration depends on factors including soil compaction, land cover, slope, and rainfall intensity.

## Solution experiments: mitigation and adaptation

Responses to climate change fall into two groups. Mitigation reduces the cause, mainly by cutting greenhouse-gas emissions or removing CO₂. Adaptation reduces harm from changes that are already happening or cannot be avoided. Both are needed, and they answer different questions.

### Experiment 8: A renewable energy grid

The [Renewable Energy Grid Simulator](/en/simulations/renewable-energy-grid-simulator) asks: "Can a grid meet the evening peak after solar generation stops?" Its controls are demand (40–140 MW), solar (0–300 MW), wind (0–250 MW), hydro (0–100 MW), battery storage (0–500 MWh), and gas backup (0–150 MW). The presets are Solar-heavy no battery, Add a 400 MWh battery, and Diverse supply. The [renewable energy grid simulator guide](/en/guides/renewable-energy-grid-simulator) walks through each source.

Scrub to midday and then to 20:00. Judge each preset by its unmet-energy total, not by the midday picture alone. Note the units: MW is a rate of power, while MWh is stored energy. Imagine an evening shortfall of 50 MW lasting 4 hours; covering it would need 50 × 4 = 200 MWh. The model runs a single deterministic day and ignores costs, so it shows timing and balance rather than economics.

### Experiment 9: Climate resilience city builder

The [Climate Resilience City Builder](/en/simulations/climate-resilience-city-builder) asks: "How would you spend a limited budget to manage a severe storm?" You set storm severity and spend up to 100 budget points across wetland restoration, drainage upgrades, shade and cooling, a raised flood threshold, and early warning. The presets are Flood-focused plan, Balanced plan, and Warning alone.

This is an adaptation lab. Try Warning alone and notice that early warning reduces exposure, because people can move out of harm's way, without changing water depth. Then compare it with plans that change how water is stored or drained. Ask which outcome each point of spending improves.

## How does the ocean move heat around the planet?

### Experiment 10: Ocean currents in 3D

The [Ocean Currents 3D Simulator](/en/simulations/ocean-currents-3d) relates differences in temperature and salinity, which set seawater density, to global ocean circulation. Cold, salty water is denser and tends to sink, while warmer, fresher water stays nearer the surface. The resulting circulation moves heat around the planet. Connect it to Experiment 1: the ocean stores heat and also redistributes it. The [ocean currents 3D guide](/en/guides/ocean-currents-3d) gives more background.

## How to read climate model results honestly

Every simulator here is a simplified model built to show a mechanism clearly. Its outputs are predictions under stated assumptions, not measurements of the real Earth and not dated projections. When you report a result, write it as "in this model, with these settings, doubling CO₂ produced..." rather than "the Earth will warm by...".

Check what each model leaves out: aerosols, clouds, and ice in the greenhouse model; sink saturation and land-use change in the carbon model; species responses in the acidification model. Omissions do not make a model useless. They define what questions it can answer. Research-grade projections, such as those assessed by the IPCC, combine many models with observations. For more on what digital labs can and cannot show, see [what interactive learning simulations are](/en/articles/what-are-interactive-learning-simulations) and [virtual labs vs real labs](/en/articles/virtual-labs-vs-real-labs-what-students-learn).

## A climate change lesson sequence for teachers

A logical order moves from cause to consequence to response. Step 1: energy balance, using Experiments 1 and 2 to establish forcing and ocean lag. Step 2: the carbon stock, using Experiment 3 to separate stocks from flows. Step 3: impacts, using Experiments 4 and 5 for the ocean and coasts. Step 4: local systems, using Experiments 6 and 7 to show how land surfaces shape heat and water. Step 5: solutions, using Experiments 8 and 9 to contrast mitigation with adaptation. Experiment 10 fits well after Step 1 or as an extension.

Each step can fit one lesson: a prediction, a controlled run, a short written explanation, and a limitation statement. Ask students to reuse earlier ideas, for example explaining sea level rise with the heat stored in Experiment 1.

## Check your understanding

:::answer Emissions fall from 38 to 30 GtCO₂/yr while sinks remain 19. Does atmospheric CO₂ fall?
No. The net flow is 30 − 19 = +11 GtCO₂/yr, so the stock still rises, only more slowly than the +19 GtCO₂/yr at the start. The concentration stops rising only when inflow no longer exceeds outflow.
:::

:::answer Why keep methane at 700 ppb when testing doubled CO₂?
Holding methane fixed makes CO₂ the only gas that changes, so any difference from the pre-industrial run can be attributed to CO₂. Using the default 1900 ppb would mix two causes in one comparison.
:::

:::answer A coast sinks 3 mm/yr for 60 years. How much extra relative rise does this add?
3 × 60 = 180 mm, and 180 ÷ 1000 = 0.18 m. This adds to the rise from thermal expansion and land-ice melt.
:::

## Frequently asked questions

### What is climate change in simple terms?

Climate change is a long-term shift in Earth's typical weather patterns. The current warming is caused mainly by greenhouse gases from human activities, especially CO₂ from burning fossil fuels. These gases trap more outgoing heat, so the planet gains more energy than it loses until it warms enough to restore balance. The effects include heat extremes, sea level rise, and ocean acidification.

### What is a simple greenhouse effect experiment for students?

A safe option is the Greenhouse Effect Simulator. Run the Pre-industrial reference preset, then Double CO₂ only, and compare the warming after 20 and 100 years. Students see that warming continues after the concentration stops rising because the deep ocean absorbs heat. A second run with reflectivity raised to 0.31 shows how reflected sunlight affects the energy balance.

### Why doesn't cutting emissions immediately lower CO₂ levels?

Atmospheric CO₂ is a stock, while emissions are a flow. If emissions still exceed what land and ocean remove, the stock keeps rising. In the Carbon Cycle Simulator's starting state, sinks remove 19 GtCO₂/yr, so emissions must fall to about 19 before the concentration stops rising at first. Lowering it requires net removal: outflows greater than inflows.

### Are interactive climate simulations the same as climate projections?

No. Classroom simulations are simplified models designed to reveal one mechanism, such as ocean heat lag or stock-and-flow balance. They omit many processes and are not dated forecasts. Projections assessed by the IPCC use complex Earth system models combined with observations and scenarios. Use classroom models to explain how the system works, and cite assessed projections for real-world numbers.

### What is the difference between mitigation and adaptation?

Mitigation addresses the cause of climate change by reducing greenhouse-gas emissions or removing CO₂, as explored in the Renewable Energy Grid Simulator. Adaptation reduces harm from climate impacts, such as flood defenses, wetland restoration, cooling, and early warning, as explored in the Climate Resilience City Builder. Mitigation limits how much change occurs; adaptation manages the change that happens.

## Next steps for climate change experiments

Pick one question from this article, write a prediction, and run the matching lab with one variable changed at a time. Record the settings and the model's limitations alongside the result. Start with the [Greenhouse Effect Simulator](/en/simulations/greenhouse-effect-simulator), then follow the carbon, impact, and solution labs on the [environmental science subject page](/en/subjects/environmental-science). Together, these experiments explain climate change as energy, stocks, delays, and choices.
`;
