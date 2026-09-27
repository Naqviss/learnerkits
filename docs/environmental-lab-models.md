# Environmental labs, version 2

All ten Environmental Science routes use `lib/simulations/environmentalLabs/engine.ts` and the dedicated Environmental UI. The scene, chart, readouts and CSV share the same computed trajectory. The old static score functions and badge timer have been removed.

## Educational scope

These are deterministic teaching experiments, not measurements, location-specific forecasts or validated planning tools. Physical conservation is enforced where the model represents a quantity of matter or energy. Ecological and exposure indices remain explicitly hypothetical. Official source links explain the underlying mechanisms, not the choice of every classroom coefficient.

| Lab | Model | Main student comparison |
| --- | --- | --- |
| Greenhouse effect | Two heat reservoirs, logarithmic CO₂ forcing, methane approximation and solar/albedo forcing | Surface vs deep-ocean warming and delayed equilibrium |
| Carbon cycle | Atmospheric stock, concentration-dependent natural sinks and cumulative carbon storage | Emission reduction vs balanced flow vs removal |
| Sea level | Integrated expansion and ice rates, lagged ocean warming, local land subsidence | Equal warming with different land motion |
| Ocean acidification | Reduced carbonate equilibrium solved by bisection at fixed alkalinity | pH, hydrogen ions and carbonate as CO₂ changes |
| Renewable grid | 24-hour dispatch; solar/wind profiles; empty initial battery; power and energy constraints; 90% round-trip efficiency | Midday surplus vs evening shortage, supply vs demand |
| Air pollution | Time-dependent well-mixed box with emissions, ventilation, deposition and daylight-driven ozone | Equal emissions in different weather |
| Deforestation/water | Two-hour storm, canopy storage, Horton-style infiltration and excess runoff | Rainfall partition across forest/compaction choices |
| Habitat fragmentation | Spatial dispersal graph and deterministic patch occupancy dynamics | Corridors and patch size at conserved habitat area |
| Urban heat | Daily weather, delayed heat storage and independent design-storm runoff | Neighborhood vs regional temperature, including after sunset |
| City resilience | Rainfall-runoff-storage-drainage balance with threshold protection and exposure indices | Adaptation under a fixed storm and 100-point budget |

## Numerical method and interpretation

Each run computes 1,200 fixed integration steps and records 121 samples. Playback reveals those samples; pausing, stepping and scrubbing do not change the numerical result. Euler integration is used for coupled heat/carbon/habitat states, exact exponential relaxation where appropriate, and limited finite-volume updates for water and battery storage. There is no random seed or external data request. Heat storage runs three repeating days before the displayed day to reduce initialization transients.

Units are shown in controls, instruments, plots and main CSV readings. Additional CSV variables follow the same units as their corresponding process: grid power in MW; battery energy in MWh; carbon stores in GtCO₂ and carbon fluxes in GtCO₂/year; sea-level components in m; rainfall, storage and runoff depths in mm; air mixing depth in m; temperature in °C; carbonate and dissolved CO₂ in µmol/L; dissolved-water pCO₂ in µatm; patch occupancy as fractions 0–1. Relative pressure, edge, connectivity and exposure indices are dimensionless.

- The albedo forcing is solar constant × albedo change / 4. Cooling is allowed; temperature is not clamped to zero.
- Carbon sinks weaken near their reference concentration; the atmosphere is not artificially floored at 280 ppm. Atmospheric change plus captured carbon equals cumulative emissions.
- The marine chemistry constants are a reduced illustration, not a full seawater solver. Borate, salinity and most temperature dependencies are omitted. “Shell health” is no longer invented from pH.
- Grid batteries charge only from renewable surplus. State of charge starts at zero; capacity/4 defines the power rating. Both conversion losses and curtailment are counted. Clean share is energy-weighted, and excludes unserved demand from its denominator. Reliability describes only the example day.
- The air box has a 4 µg/m³ PM background and 25 ppb ozone background. Traffic and industry both contribute to the ozone precursor indices. No regulatory AQI, health category or pollutant measurement is claimed.
- Watershed rainfall equals intercepted water + infiltrated water + runoff. The erosion response is an index rather than an unsupported t/ha estimate.
- Habitat circles conserve total area as patch count changes. Their color/labels encode expected occupancy probability, not animal counts or extinction forecasts. Connectivity is a dispersal index, not a measured ecological percentage.
- Urban canopy coverage, roof coverage and permeable ground are separate surfaces; they need not sum to 100%. The 30 mm runoff comparison is separate from the hot-day time series.
- Resilience spending is capped at 100. Warning affects exposure but not water depth. Barriers change the threshold for exposure but do not remove water. Wetlands retain stored water during the short experiment; street drainage removes the remaining water. Shade affects a separate heat index.

## Student workflow

Predict, run, save a completed baseline, change one input, rerun, compare at the same elapsed time, and explain with evidence. Baselines retain their own inputs and time horizon; chart x positions use physical model time. Graphs automatically pair comparable measurements (e.g. demand with generation), never MW with MWh on a shared axis. A data table provides all recorded primary readings. CSV exports include model version, inputs, full time series and student notes. Notes and baselines stay in page memory; no progress/account storage is introduced.

Scenes are accessible SVG schematics with a zoom/scroll option on small screens. Artwork shows model state and is explicitly not a geographic or scaled engineering rendering.

## Sources and verification

The source list and equations are colocated with each activity in `model.ts` and rendered on the lab page. Mechanisms were checked against IPCC/NASA energy-balance explanations, NOAA carbon/ocean/coastal resources, NREL storage fundamentals, EPA ozone/heat/adaptation resources, and USGS water/habitat resources. Chosen toy coefficients are documented as such.

`tests/simulations/environmentalLabs.test.ts` verifies finite deterministic trajectories at defaults, presets and boundaries; carbon/water/energy bookkeeping; chemical alkalinity balance; physically expected comparative responses; conservation of mapped habitat area; budget limits; and CSV provenance.

## City-builder interface (version 3 UI)

The environmental routes now use a single-viewport Three.js isometric city. The previous inline graph/control column is replaced by a build dock and native modal dialogs for graphs, conditions, notebook, learning guidance and other labs. The underlying version-2 scientific trajectories are preserved.

`builder.ts` maps each placeable project to one documented model-input delta. A tree grove is a scenario-scale unit (for example +10 canopy percentage points), not a single tree that removes gigatonnes of carbon. Global climate input cards are scenario operators, not claims about individual factories. The guide explains this distinction.

- Desktop: drag a tool onto a valid plot or select then click. Placed projects can be dragged to another plot. Remove mode reverses their input delta.
- Touch: drag from the tool dock or select and tap a plot. Camera zoom/rotation buttons keep building separate from navigation.
- Keyboard: focus the map, use arrows to choose a plot, Enter to build and Delete to remove. The Conditions dialog also exposes plot-number placement and project removal controls, including a WebGL-unavailable fallback.
- Scientific bounds, a 100-point resilience budget, land/water zones, occupied plots, roads and baseline structures are validated before edits. Invalid actions leave state unchanged.
- Undo/redo restore both project layout and model inputs. Reset and loading a scenario can also be undone. Moving an asset is a visual layout change; science uses scenario-wide totals and is not a spatial street-level solver.
- Rainfall, accumulated street water, sea level, air haze, battery charge and turbine motion provide visual feedback. The terrain, colors and heights are illustrative, not GIS or engineering measurements. Starting city structures represent the fixed reference scenario; user-added projects are editable.
- Graphs are mounted only inside the graph modal. The dialog supports Escape, focus containment and close/focus restoration. A time selector replaces the old inline timeline slider. Comparisons, exact data and CSV export remain available.
- WebGL resources and animation listeners are disposed when leaving the lab. Reduced-motion preference disables ambient motion; explicit playback still updates scientific results.

Additional builder tests cover editable-project effects, removal reversibility, relocation invariance, bounds, budget and placement restrictions. Browser checks cover actual native drag/drop, moving/removing a project, undo/redo, keyboard placement, modal visibility and mobile viewport fit.
