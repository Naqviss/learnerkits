"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SimulationCard, SubjectSlug } from "@/lib/subjects/catalog";
import type { LabClientCopy } from "@/lib/i18n/content";
import { ExpandedThreeScene } from "@/components/simulation/ExpandedThreeScene";
import { runtimeFormula, runtimeMetricValue, runtimeText } from "@/lib/i18n/runtimeText";

type NumericControl = { key: string; label: string; type?: "range"; min: number; max: number; step: number; initial: number; unit?: string };
type SelectControl = { key: string; label: string; type: "select"; initial: string; options: { label: string; value: string }[] };
type Control = NumericControl | SelectControl;
type Config = { controls: Control[]; formula: string; focus: string };
type Values = Record<string, number | string>;
type MetricValue = { label: string; value: string };

function moonExplanation(values: Values) {
  const angle = ((Number(values.angle) || 0) + 360) % 360;
  const inclination = Number(values.inclination) || 0;
  let body = "At this position the Moon is between quarter phases, so Earth sees a curved portion of its sunlit half.";
  if (angle < 45 || angle >= 315) body = "The Moon is close to the Sun–Earth line. Sunlight falls on its far side, so the side facing Earth is mostly dark: a new-moon view.";
  else if (angle < 135) body = "The Moon is moving away from the Sun–Earth line. More of its sunlit half turns toward Earth, growing from a crescent toward first quarter.";
  else if (angle < 225) body = "The Moon is opposite the Sun from Earth. Its Earth-facing side receives the most sunlight, reaching full moon near 180°.";
  else body = "The Moon is moving back toward the Sun–Earth line. The visible sunlit area is shrinking, from gibbous toward a crescent.";
  const orbitLine = inclination < 4 ? " Its low inclination keeps the orbit close to the reference plane." : inclination > 8 ? " Its higher inclination lifts the Moon above or below the reference plane; this changes its height, not the main phase cycle." : " Its inclination only nudges the Moon above or below the reference plane.";
  return body + orbitLine;
}

function escapeExplanation(values: Values) {
  const world = worlds[String(values.world)] ?? worlds.Earth;
  const altitude = n(values, "altitude");
  const launch = n(values, "launchSpeed");
  const radius = world.radius + altitude * 1000;
  const orbit = Math.sqrt(world.mu / radius) / 1000;
  const escape = Math.sqrt(2 * world.mu / radius) / 1000;
  if (launch < orbit) return `Low launch speed: ${launch.toFixed(1)} km/s is below circular-orbit speed (${orbit.toFixed(1)} km/s), so gravity bends the path back toward ${String(values.world)}.`;
  if (launch < escape) return `Middle launch speed: the spacecraft is fast enough to keep missing the surface, but not fast enough to escape. It follows a bound elliptical orbit.`;
  return `High launch speed: ${launch.toFixed(1)} km/s reaches or exceeds escape speed (${escape.toFixed(1)} km/s), so the path opens outward and the spacecraft will not return in this two-body model.`;
}

function seasonsExplanation(values: Values) {
  const angle = ((n(values, "orbitAngle") % 360) + 360) % 360;
  const tilt = n(values, "tilt");
  const latitude = n(values, "latitude");
  const season = angle < 45 || angle >= 315 ? "spring transition" : angle < 135 ? "Northern Hemisphere summer" : angle < 225 ? "autumn transition" : "Northern Hemisphere winter";
  const tiltText = tilt < 8 ? "With low tilt, the Sun stays close to the equator and the seasonal contrast is weak." : tilt > 28 ? "With high tilt, the hemispheres lean strongly toward or away from the Sun, making seasonal contrast larger." : "Earth’s moderate tilt changes the Sun’s angle and day length through the year.";
  return `At this orbital position, it is the ${season}. ${tiltText} At ${latitude}° latitude, that changing Sun angle is what sets the local seasonal sunlight—not Earth being much closer to the Sun.`;
}

function softControlTone(audioRef: React.MutableRefObject<AudioContext | null>, mutedRef: React.MutableRefObject<boolean>, lastToneRef: React.MutableRefObject<number>, value: number) {
  if (mutedRef.current || typeof window === "undefined") return;
  const now = performance.now();
  if (now - lastToneRef.current < 90) return;
  lastToneRef.current = now;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const audio = audioRef.current ?? (audioRef.current = new AudioContextClass());
  if (audio.state === "suspended") void audio.resume();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 260 + (Math.abs(value) % 12) * 22;
  gain.gain.setValueAtTime(.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(.018, audio.currentTime + .012);
  gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + .075);
  oscillator.connect(gain); gain.connect(audio.destination);
  oscillator.start(); oscillator.stop(audio.currentTime + .08);
}

const range = (key:string,label:string,min:number,max:number,step:number,initial:number,unit?:string):NumericControl => ({key,label,min,max,step,initial,unit});
const select = (key:string,label:string,initial:string,options:string[]):SelectControl => ({key,label,type:"select",initial,options:options.map(value=>({label:value,value}))});

const configs: Record<string, Config> = {
  "moon-phases-3d": { controls:[range("angle","Moon orbital angle",0,360,5,90,"°"),range("inclination","Orbit inclination",0,12,1,5,"°")], formula:"Illuminated fraction ≈ (1 − cos θ) / 2", focus:"Move the Moon around Earth and compare orbital position with the illuminated fraction visible from Earth." },
  "solar-eclipse-3d": { controls:[range("offset","Moon alignment offset",0,1.5,.02,.15,"°"),range("moonDistance","Moon distance",356000,406000,1000,384400,"km")], formula:"apparent angular size ≈ diameter / distance", focus:"Change the alignment and lunar distance to see why total eclipses require a narrow geometric configuration." },
  "escape-velocity": { controls:[select("world","World","Earth",["Earth","Moon","Mars","Jupiter"]),range("altitude","Altitude",0,3000,25,400,"km"),range("launchSpeed","Launch speed",0,80,.2,11.2,"km/s")], formula:"vₑ = √(2μ/r) · vₒ = √(μ/r)", focus:"Compare orbital and escape speed on worlds with very different mass and radius." },
  "gravity-slingshot": { controls:[range("planetSpeed","Planet orbital speed",5,40,.5,24,"km/s"),range("turnAngle","Flyby turn angle",5,150,1,60,"°"),range("approach","Approach speed",2,25,.5,8,"km/s")], formula:"Δv proxy ≈ 2vₚ sin(δ/2)", focus:"Change the flyby geometry to see how a gravity assist can redirect and change spacecraft speed." },
  "keplers-laws-orbit": { controls:[range("semiMajor","Semi-major axis",.4,6,.1,1,"AU"),range("eccentricity","Eccentricity",0,.85,.01,.2)], formula:"T² = a³ (when T is years and a is AU)", focus:"Compare orbital period, perihelion, and aphelion while changing orbit size and eccentricity." },
  "earth-seasons-tilt": { controls:[range("orbitAngle","Earth orbital position",0,360,5,90,"°"),range("tilt","Axial tilt",0,35,.5,23.5,"°"),range("latitude","Latitude",0,70,1,40,"°")], formula:"solar declination ≈ tilt × sin(orbital angle)", focus:"Separate the effect of Earth–Sun distance from the much stronger effect of axial tilt on seasonal sunlight." },
  "satellite-orbit-builder": { controls:[range("altitude","Orbit altitude",160,36000,100,500,"km"),range("speedScale","Velocity",50,150,1,100,"% circular"),range("inclination","Inclination",0,90,1,28,"°")], formula:"vₒ = √(μ/r) · T = 2π√(r³/μ)", focus:"Tune speed and altitude to build a stable orbit rather than falling back to Earth or escaping." },
  "planet-size-comparison-3d": { controls:[select("planetA","Planet A","Earth",["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]),select("planetB","Planet B","Jupiter",["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"])], formula:"volume ∝ radius³", focus:"Compare radius, diameter, and volume instead of judging size from separate planet images." },
  "black-hole-orbit": { controls:[range("mass","Black-hole mass",5,100,1,10,"M☉"),range("radius","Orbit radius",3,50,.5,12,"Schwarzschild radii")], formula:"rₛ = 2GM/c² · Newtonian v ≈ √(GM/r)", focus:"Explore how compact mass changes orbital scale and why very close orbits require extreme speeds." },
  "mars-landing-challenge": { controls:[range("altitude","Starting altitude",2,20,.5,10,"km"),range("descent","Descent speed",20,220,5,90,"m/s"),range("thrust","Thrust acceleration",0,12,.2,5,"m/s²")], formula:"a ≈ thrust − gMars − drag term", focus:"Balance braking and thrust so the lander reaches the surface with a survivable vertical speed." },

  "inclined-plane-friction": { controls:[range("angle","Ramp angle",0,50,1,25,"°"),range("mu","Friction coefficient",0,.9,.02,.25),range("mass","Mass",1,100,1,20,"kg")], formula:"a = g(sinθ − μcosθ)", focus:"Find the threshold where gravity down the slope overcomes friction." },
  "momentum-collision": { controls:[range("m1","Mass 1",.5,10,.5,2,"kg"),range("v1","Velocity 1",-10,15,.5,6,"m/s"),range("m2","Mass 2",.5,10,.5,3,"kg"),range("v2","Velocity 2",-10,10,.5,-2,"m/s"),range("e","Elasticity",0,1,.05,.8)], formula:"momentum before = momentum after; restitution e controls relative rebound", focus:"Change mass, velocity, and elasticity and test momentum conservation." },
  "ray-optics-lens": { controls:[select("lens","Lens","Convex",["Convex","Concave"]),range("focal","Focal length",5,40,1,15,"cm"),range("objectDistance","Object distance",6,100,1,40,"cm")], formula:"1/f = 1/dₒ + 1/dᵢ · m = −dᵢ/dₒ", focus:"Trace how focal length and object position determine image position, orientation, and magnification." },
  "newtons-laws-force-lab": { controls:[range("force","Net force",-100,100,2,40,"N"),range("mass","Mass",1,50,1,10,"kg"),range("friction","Friction force",0,50,1,8,"N")], formula:"ΣF = ma", focus:"Compare applied and resistive forces, then connect the remaining net force to acceleration." },
  "simple-machines-challenge": { controls:[select("machine","Machine","Lever",["Lever","Pulley","Inclined plane"]),range("load","Load",50,1000,10,300,"N"),range("advantage","Mechanical advantage",1,12,.5,4)], formula:"ideal input force = load / mechanical advantage", focus:"Trade input force for distance using ideal mechanical advantage." },
  "wave-interference": { controls:[range("amplitudeA","Wave A amplitude",.2,3,.1,1),range("amplitudeB","Wave B amplitude",.2,3,.1,1),range("phase","Phase difference",0,360,5,0,"°")], formula:"Aresult = √(A₁² + A₂² + 2A₁A₂cosφ)", focus:"Move from constructive to destructive interference by changing phase." },
  "pendulum-physics": { controls:[range("length","Pendulum length",.1,5,.05,1,"m"),range("gravity","Gravity",1.62,15,.1,9.81,"m/s²"),range("angle","Release angle",2,45,1,15,"°")], formula:"T ≈ 2π√(L/g) for small angles", focus:"Test which variables substantially affect a pendulum’s period." },
  "energy-track-challenge": { controls:[range("height","Starting height",1,30,.5,12,"m"),range("friction","Energy lost to friction",0,80,1,15,"%"),range("mass","Mass",1,100,1,20,"kg")], formula:"mgh → ½mv² + losses", focus:"Follow energy as height turns into speed and friction removes mechanical energy." },
  "electromagnet-3d": { controls:[range("current","Current",.1,10,.1,3,"A"),range("turns","Coil turns",20,1000,10,300),range("length","Coil length",.05,1,.01,.3,"m")], formula:"B ≈ μ₀NI/L", focus:"Increase current and coil turns to strengthen an idealized solenoid field." },
  "bridge-builder-challenge": { controls:[range("load","Center load",100,5000,50,1200,"N"),range("members","Truss members",4,30,1,12),range("span","Bridge span",2,20,.5,8,"m")], formula:"simplified member demand ∝ load × span / member count", focus:"See why longer spans and larger loads demand stronger or more efficient structures." },

  "volcano-eruption-3d": { controls:[range("gas","Gas content",1,10,.1,6,"%"),range("viscosity","Relative viscosity",1,100,1,55),range("pressure","Magma pressure",10,200,5,90,"MPa")], formula:"eruption intensity proxy ∝ gas × pressure × viscosity factor", focus:"Compare quiet and explosive eruption conditions by changing gas, pressure, and magma viscosity." },
  "earthquake-epicenter-finder": { controls:[range("gapA","Station A S−P gap",2,80,1,25,"s"),range("gapB","Station B S−P gap",2,80,1,38,"s"),range("gapC","Station C S−P gap",2,80,1,52,"s")], formula:"distance ≈ Δt / (1/vS − 1/vP)", focus:"Convert S–P arrival gaps to distance circles and use three stations to constrain the epicenter." },
  "plate-tectonics-3d": { controls:[select("boundary","Boundary","Convergent",["Convergent","Divergent","Transform"]),range("speed","Relative plate speed",5,120,1,45,"mm/yr"),range("time","Time",.1,20,.1,5,"Myr")], formula:"displacement = plate speed × time", focus:"Compare how different boundary directions transform crust over geologic time." },
  "tsunami-3d": { controls:[range("depth","Ocean depth",100,6000,50,4000,"m"),range("distance","Travel distance",100,8000,50,1500,"km"),range("displacement","Seafloor displacement",.2,15,.2,4,"m")], formula:"shallow-water wave speed c = √(gh)", focus:"Relate ocean depth to propagation speed and seafloor displacement to initial wave energy." },
  "hurricane-simulator": { controls:[range("seaTemp","Sea-surface temperature",22,33,.2,29,"°C"),range("pressure","Central pressure",880,1010,2,960,"hPa"),range("shear","Wind shear",0,40,1,10,"m/s")], formula:"intensity proxy rises with warm water and pressure deficit, falls with shear", focus:"Test why warm oceans and low wind shear favor stronger tropical cyclones." },
  "weather-front-simulator": { controls:[range("warm","Warm-air temperature",5,35,1,24,"°C"),range("cold","Cold-air temperature",-15,20,1,5,"°C"),range("humidity","Relative humidity",20,100,2,75,"%")], formula:"front strength proxy ∝ temperature contrast × humidity", focus:"Connect air-mass contrast and moisture with lifting and precipitation potential." },
  "river-erosion": { controls:[range("depth","Flow depth",.1,8,.1,2,"m"),range("slope","Channel slope",.0001,.05,.0005,.008),range("speed","Flow speed",.1,8,.1,2.5,"m/s")], formula:"bed shear τ ≈ ρghS", focus:"Investigate how slope, depth, and speed influence erosion and sediment transport." },
  "rock-cycle-challenge": { controls:[range("heat","Heat",0,100,1,40,"%"),range("pressure","Pressure",0,100,1,45,"%"),range("weathering","Weathering",0,100,1,30,"%")], formula:"dominant process selects likely rock transformation pathway", focus:"Change environmental processes and infer which rock-cycle pathway becomes most likely." },
  "water-cycle-adventure": { controls:[range("temperature","Air temperature",0,40,1,24,"°C"),range("humidity","Humidity",10,100,2,65,"%"),range("vegetation","Vegetation cover",0,100,2,45,"%")], formula:"water fluxes redistribute among evaporation, condensation, transpiration, and runoff", focus:"Follow how temperature and vegetation shift the balance among water-cycle pathways." },
  "ocean-currents-3d": { controls:[range("temperature","Water temperature",-2,30,.5,8,"°C"),range("salinity","Salinity",28,40,.1,35,"PSU"),range("wind","Wind forcing",0,30,.5,8,"m/s")], formula:"density proxy increases with salinity and decreases with temperature", focus:"Combine density differences and wind forcing to reason about ocean circulation." },

  "animal-cell-3d": { controls:[range("scale","Cell scale",1,10,.5,5,"relative"),range("organelle","Highlighted organelle",1,6,1,1)], formula:"cell structures are specialized for different functions", focus:"Rotate the cell model and connect visible organelles with their biological roles." },
  "cell-membrane-transport": { controls:[range("outside","Outside concentration",0,100,1,80,"mM"),range("inside","Inside concentration",0,100,1,20,"mM"),range("permeability","Membrane permeability",0,1,.02,.5),range("atp","ATP availability",0,100,1,50,"%")], formula:"passive flux J ∝ P(Cout − Cin); active transport requires energy", focus:"Compare diffusion, facilitated diffusion, osmosis-like gradients, and energy-dependent transport." },
  "mitosis-challenge": { controls:[range("cycle","Cell-cycle progress",0,100,1,35,"%"),range("chromosomes","Chromosome pairs",1,23,1,8)], formula:"DNA replicates before mitosis; sister chromatids separate during anaphase", focus:"Move through the cell cycle and track chromosome organization at each stage." },
  "dna-replication": { controls:[range("length","DNA segment length",100,10000,100,2400,"bp"),range("rate","Polymerase rate",20,1000,10,200,"bp/s"),range("forks","Replication forks",1,8,1,2)], formula:"replication time ≈ length / (rate × active forks)", focus:"See how replication speed and multiple forks change the time needed to copy DNA." },
  "protein-synthesis": { controls:[range("codons","mRNA codons",5,300,5,60),range("ribosomes","Ribosomes",1,20,1,4),range("rate","Translation rate",1,20,.5,6,"aa/s")], formula:"protein time ≈ codons / (rate × effective ribosomes)", focus:"Connect mRNA length and translation rate with the time required to synthesize protein." },
  "human-heart-3d": { controls:[range("heartRate","Heart rate",40,180,1,72,"bpm"),range("strokeVolume","Stroke volume",30,140,1,70,"mL"),range("oxygen","Oxygen saturation",70,100,1,98,"%")], formula:"cardiac output = heart rate × stroke volume", focus:"Trace one-way blood flow and connect heart rate and stroke volume to cardiac output." },
  "natural-selection": { controls:[range("initial","Initial trait frequency",1,99,1,30,"%"),range("selection","Selection advantage",-20,50,1,10,"%"),range("generations","Generations",1,100,1,30)], formula:"favored traits increase in frequency when they improve relative reproductive success", focus:"Change selection pressure and observe how trait frequency shifts over generations." },
  "food-web-builder": { controls:[range("producerEnergy","Producer energy",100,10000,100,5000,"kJ"),range("levels","Trophic levels",2,6,1,4),range("efficiency","Transfer efficiency",5,25,1,10,"%")], formula:"energy at next trophic level ≈ previous level × transfer efficiency", focus:"Build energy pyramids and predict which food webs can support higher-level consumers." },
  "photosynthesis-lab": { controls:[range("light","Light intensity",0,100,1,70,"%"),range("co2","CO₂ concentration",50,1200,10,400,"ppm"),range("temperature","Temperature",5,45,1,25,"°C")], formula:"rate is limited by light, CO₂, and enzyme-friendly temperature", focus:"Identify limiting factors by changing one environmental condition at a time." },
  "immune-system-defense": { controls:[range("pathogens","Initial pathogens",10,1000,10,250),range("innate","Innate response",0,100,1,55,"%"),range("adaptive","Adaptive response",0,100,1,35,"%")], formula:"net pathogen change ≈ growth − immune clearance", focus:"Compare rapid nonspecific defenses with slower but more targeted adaptive immunity." },

  "molecular-geometry-3d": { controls:[range("groups","Electron groups",2,6,1,4),range("lonePairs","Lone pairs",0,3,1,0)], formula:"VSEPR: electron groups arrange to reduce repulsion", focus:"Change electron groups and lone pairs to predict electron geometry, molecular shape, and bond angles." },
  "molecule-builder-3d": { controls:[range("carbon","Carbon atoms",0,8,1,2),range("oxygen","Oxygen atoms",0,8,1,1),range("hydrogen","Hydrogen atoms",0,20,1,6)], formula:"common valence: C≈4, O≈2, H≈1", focus:"Build simple molecular formulas and compare total bonding demand with available valence." },
  "chemical-bonding": { controls:[range("enA","Electronegativity A",.7,4,.1,1),range("enB","Electronegativity B",.7,4,.1,3.4)], formula:"bond character relates to electronegativity difference ΔEN", focus:"Use electronegativity difference as evidence for nonpolar covalent, polar covalent, or strongly ionic character." },
  "acid-base-ph": { controls:[range("ph","pH",0,14,.1,3)], formula:"pH = −log₁₀[H⁺]", focus:"Move along the logarithmic pH scale and connect pH with orders-of-magnitude changes in hydrogen-ion concentration." },
  "titration-simulator": { controls:[range("acidC","Acid concentration",.05,2,.05,.5,"M"),range("acidV","Acid volume",5,100,1,25,"mL"),range("baseC","Base concentration",.05,2,.05,.5,"M"),range("baseV","Base added",0,100,1,20,"mL")], formula:"at equivalence: n(H⁺) = n(OH⁻)", focus:"Add strong base to strong acid and use mole balance to identify the equivalence point." },
  "states-of-matter-3d": { controls:[range("temperature","Temperature",50,800,5,300,"K"),range("pressure","Pressure",.1,20,.1,1,"atm"),range("attraction","Intermolecular attraction",0,100,1,50,"%")], formula:"phase depends on kinetic energy, pressure, and intermolecular attraction", focus:"Compare particle motion and spacing while changing thermal energy and pressure." },
  "solubility-curve": { controls:[range("temperature","Temperature",0,100,1,40,"°C"),range("solute","Solute added",0,200,2,80,"g/100g water"),range("slope","Temperature sensitivity",.2,2,.05,.8,"g/°C")], formula:"solubility model S(T) = S₀ + kT", focus:"Move along a solubility curve and predict whether a solution is unsaturated, saturated, or supersaturated." },
  "limiting-reagent": { controls:[range("a","Reactant A",.1,10,.1,3,"mol"),range("b","Reactant B",.1,10,.1,2,"mol"),range("ratio","A:B stoichiometric ratio",.25,4,.25,2)], formula:"product is limited by the reactant that supplies fewer stoichiometric reaction units", focus:"Compare available moles with a reaction ratio to identify the limiting reactant." },
  "balance-equation": { controls:[range("h2","H₂ coefficient",1,8,1,2),range("o2","O₂ coefficient",1,8,1,1),range("h2o","H₂O coefficient",1,8,1,2)], formula:"2H₂ + O₂ → 2H₂O", focus:"Adjust coefficients until hydrogen and oxygen atom counts match on both sides." },
  "periodic-table-hunt": { controls:[range("atomic","Atomic number",1,36,1,8)], formula:"periodic position organizes repeating valence and property patterns", focus:"Use atomic number to locate an element and infer its period and broad family." },

  "geometry-slice-3d": { controls:[select("solid","Solid","Cube",["Cube","Cylinder","Sphere"]),range("offset","Slice offset",-100,100,2,0,"%"),range("angle","Plane angle",0,80,1,30,"°")], formula:"a plane intersecting a solid creates a 2D cross section", focus:"Move and rotate the cutting plane to predict the resulting cross-sectional shape." },
  "pythagorean-puzzle": { controls:[range("a","Leg a",1,20,.5,6),range("b","Leg b",1,20,.5,8)], formula:"a² + b² = c²", focus:"Change the legs of a right triangle and compare square areas with the hypotenuse." },
  "unit-circle-challenge": { controls:[range("angle","Angle",0,360,1,45,"°")], formula:"x = cosθ · y = sinθ", focus:"Connect an angle with its point on the unit circle and the values of sine and cosine." },
  "quadratic-transformation": { controls:[range("a","Vertical scale a",-4,4,.25,1),range("h","Horizontal shift h",-6,6,.25,0),range("k","Vertical shift k",-8,8,.25,0)], formula:"y = a(x − h)² + k", focus:"Transform a parent parabola using shifts, stretches, and reflections." },
  "slope-intercept-challenge": { controls:[range("m","Slope m",-6,6,.25,1),range("b","Intercept b",-10,10,.5,0),range("x","Test x",-10,10,.5,3)], formula:"y = mx + b", focus:"Connect slope and intercept parameters to the line’s visible direction and crossing point." },
  "geometry-transformation": { controls:[range("rotation","Rotation",-180,180,5,45,"°"),range("scale","Scale",.25,3,.05,1),range("translation","Horizontal translation",-10,10,.5,2)], formula:"transformations change position, orientation, or size according to defined rules", focus:"Apply multiple transformations and distinguish rigid motions from dilations." },
  "probability-experiment": { controls:[range("probability","Success probability",1,99,1,50,"%"),range("trials","Trials",10,10000,10,500),range("seed","Experiment seed",1,20,1,7)], formula:"expected successes = np; standard deviation = √(np(1−p))", focus:"Compare expected probability with a deterministic pseudo-experiment as sample size increases." },
  "derivative-tangent": { controls:[range("a","Quadratic coefficient",-.5,.5,.05,.15),range("x","Point x",-10,10,.25,2),range("c","Vertical offset",-10,10,.5,0)], formula:"for f(x)=ax²+c, f′(x)=2ax", focus:"Move the point along a curve and compare secant intuition with the instantaneous tangent slope." },
  "area-under-curve": { controls:[range("upper","Upper bound",.5,10,.25,5),range("rectangles","Rectangles",2,100,1,12),range("power","Power n",1,4,1,2)], formula:"Riemann sums approximate ∫₀ᵇ xⁿ dx", focus:"Increase the number of rectangles and watch the numerical approximation converge toward the exact integral." },
  "matrix-transformation": { controls:[range("a","Matrix a",-3,3,.1,1),range("b","Matrix b",-3,3,.1,.5),range("c","Matrix c",-3,3,.1,0),range("d","Matrix d",-3,3,.1,1),range("vx","Vector x",-3,3,.1,1),range("vy","Vector y",-3,3,.1,1)], formula:"[x′ y′]ᵀ = A[x y]ᵀ · det(A)=ad−bc", focus:"Transform the plane and a vector while tracking determinant, area scale, and orientation." },
};

const worlds: Record<string,{mu:number;radius:number}> = {
  Earth:{mu:3.986004418e14,radius:6_371_000}, Moon:{mu:4.9048695e12,radius:1_737_400}, Mars:{mu:4.282837e13,radius:3_389_500}, Jupiter:{mu:1.26686534e17,radius:69_911_000}
};
const planetRadii: Record<string,number> = {Mercury:2440,Venus:6052,Earth:6371,Mars:3390,Jupiter:69911,Saturn:58232,Uranus:25362,Neptune:24622};
const n = (v:Values,key:string) => Number(v[key] ?? 0);
const s = (v:Values,key:string) => String(v[key] ?? "");
const fmt = (value:number,digits=2) => Number.isFinite(value) ? value.toFixed(digits) : "—";

function metricsFor(slug:string,v:Values):MetricValue[] {
  switch(slug){
    case "moon-phases-3d": { const angle=((n(v,"angle")%360)+360)%360,theta=angle*Math.PI/180,lit=(1-Math.cos(theta))/2, age=angle/360*29.53, phase=angle<22.5||angle>=337.5?"New moon":angle<67.5?"Waxing crescent":angle<112.5?"First quarter":angle<157.5?"Waxing gibbous":angle<202.5?"Full moon":angle<247.5?"Waning gibbous":angle<292.5?"Last quarter":"Waning crescent"; return [{label:"Illuminated",value:`${fmt(lit*100,0)}%`},{label:"Lunar age",value:`${fmt(age,1)} days`},{label:"Phase",value:phase}]; }
    case "solar-eclipse-3d": { const moonAngular=.52*(384400/n(v,"moonDistance")), coverage=Math.max(0,Math.min(1,1-n(v,"offset")/(moonAngular+.27))); return [{label:"Moon angular size",value:`${fmt(moonAngular,3)}°`},{label:"Coverage proxy",value:`${fmt(coverage*100,0)}%`},{label:"Alignment",value:n(v,"offset")<.25?"Near central":"Partial / miss"}]; }
    case "escape-velocity": { const w=worlds[s(v,"world")]??worlds.Earth,r=w.radius+n(v,"altitude")*1000,vo=Math.sqrt(w.mu/r)/1000,ve=Math.sqrt(2*w.mu/r)/1000,launch=n(v,"launchSpeed"),outcome=launch<vo?"Falls back":launch<ve?"Bound orbit":"Escape trajectory";return[{label:"Launch speed",value:`${fmt(launch,1)} km/s`},{label:"Escape speed",value:`${fmt(ve,1)} km/s`},{label:"Circular speed",value:`${fmt(vo,1)} km/s`},{label:"Flight result",value:outcome}]; }
    case "gravity-slingshot": { const dv=2*n(v,"planetSpeed")*Math.sin(n(v,"turnAngle")*Math.PI/360),out=Math.sqrt(Math.max(0,n(v,"approach")**2+dv**2));return[{label:"Turn contribution",value:`${fmt(dv,1)} km/s`},{label:"Speed proxy",value:`${fmt(out,1)} km/s`},{label:"Geometry",value:n(v,"turnAngle")>90?"Deep turn":"Shallow turn"}]; }
    case "keplers-laws-orbit": { const a=n(v,"semiMajor"),e=n(v,"eccentricity"),T=Math.sqrt(a**3);return[{label:"Orbital period",value:`${fmt(T,2)} yr`},{label:"Perihelion",value:`${fmt(a*(1-e),2)} AU`},{label:"Aphelion",value:`${fmt(a*(1+e),2)} AU`}]; }
    case "earth-seasons-tilt": { const decl=n(v,"tilt")*Math.sin(n(v,"orbitAngle")*Math.PI/180), noon=90-Math.abs(n(v,"latitude")-decl);return[{label:"Solar declination",value:`${fmt(decl,1)}°`},{label:"Noon sun altitude",value:`${fmt(noon,1)}°`},{label:"Hemisphere season",value:decl>=0?"Northern summer tendency":"Northern winter tendency"}]; }
    case "satellite-orbit-builder": { const r=6_371_000+n(v,"altitude")*1000,vo=Math.sqrt(worlds.Earth.mu/r),actual=vo*n(v,"speedScale")/100,T=2*Math.PI*Math.sqrt(r**3/worlds.Earth.mu);return[{label:"Circular speed",value:`${fmt(vo/1000,2)} km/s`},{label:"Selected speed",value:`${fmt(actual/1000,2)} km/s`},{label:"Period",value:`${fmt(T/60,1)} min`}]; }
    case "planet-size-comparison-3d": { const ra=planetRadii[s(v,"planetA")]||6371,rb=planetRadii[s(v,"planetB")]||69911;return[{label:"Radius A",value:`${ra.toLocaleString()} km`},{label:"Radius B",value:`${rb.toLocaleString()} km`},{label:"Volume ratio B:A",value:`${fmt((rb/ra)**3,1)}×`}]; }
    case "black-hole-orbit": { const M=n(v,"mass")*1.98847e30,rs=2*6.6743e-11*M/299792458**2,r=n(v,"radius")*rs,vv=Math.sqrt(6.6743e-11*M/r);return[{label:"Schwarzschild radius",value:`${fmt(rs/1000,1)} km`},{label:"Orbit radius",value:`${fmt(r/1000,0)} km`},{label:"Newtonian speed",value:`${fmt(vv/299792458*100,1)}% c`}]; }
    case "mars-landing-challenge": { const drag=.0007*n(v,"descent")**2,acc=n(v,"thrust")-3.71+drag,impact=Math.max(0,n(v,"descent")-Math.max(0,acc)*Math.sqrt(2*n(v,"altitude")*1000/3.71));return[{label:"Net accel proxy",value:`${fmt(acc,2)} m/s²`},{label:"Impact-speed proxy",value:`${fmt(impact,1)} m/s`},{label:"Landing outlook",value:impact<5?"Soft":impact<20?"Hard":"Unsafe"}]; }

    case "inclined-plane-friction": { const th=n(v,"angle")*Math.PI/180,a=9.81*(Math.sin(th)-n(v,"mu")*Math.cos(th));return[{label:"Down-slope acceleration",value:`${fmt(Math.max(0,a),2)} m/s²`},{label:"Will slide?",value:a>0?"Yes":"No"},{label:"Mass effect",value:"Cancels in ideal model"}]; }
    case "momentum-collision": { const m1=n(v,"m1"),m2=n(v,"m2"),u1=n(v,"v1"),u2=n(v,"v2"),e=n(v,"e"),v1=(m1*u1+m2*u2-m2*e*(u1-u2))/(m1+m2),v2=(m1*u1+m2*u2+m1*e*(u1-u2))/(m1+m2);return[{label:"Object 1 after",value:`${fmt(v1,2)} m/s`},{label:"Object 2 after",value:`${fmt(v2,2)} m/s`},{label:"Total momentum",value:`${fmt(m1*u1+m2*u2,2)} kg·m/s`}]; }
    case "ray-optics-lens": { const f=n(v,"focal")*(s(v,"lens")==="Concave"?-1:1),d=n(v,"objectDistance"),di=1/(1/f-1/d),mag=-di/d;return[{label:"Image distance",value:`${fmt(di,1)} cm`},{label:"Magnification",value:`${fmt(mag,2)}×`},{label:"Image",value:di<0?"Virtual":"Real"}]; }
    case "newtons-laws-force-lab": { const net=n(v,"force")-Math.sign(n(v,"force")||1)*n(v,"friction"),a=net/n(v,"mass");return[{label:"Net force",value:`${fmt(net,1)} N`},{label:"Acceleration",value:`${fmt(a,2)} m/s²`},{label:"Direction",value:a>=0?"Positive":"Negative"}]; }
    case "simple-machines-challenge": { const input=n(v,"load")/n(v,"advantage");return[{label:"Ideal input force",value:`${fmt(input,1)} N`},{label:"Mechanical advantage",value:`${fmt(n(v,"advantage"),1)}×`},{label:"Machine",value:s(v,"machine")}]; }
    case "wave-interference": { const A=Math.sqrt(n(v,"amplitudeA")**2+n(v,"amplitudeB")**2+2*n(v,"amplitudeA")*n(v,"amplitudeB")*Math.cos(n(v,"phase")*Math.PI/180));return[{label:"Result amplitude",value:fmt(A,2)},{label:"Phase difference",value:`${n(v,"phase")}°`},{label:"Interference",value:n(v,"phase")<60||n(v,"phase")>300?"Mostly constructive":n(v,"phase")>120&&n(v,"phase")<240?"Mostly destructive":"Mixed"}]; }
    case "pendulum-physics": { const T=2*Math.PI*Math.sqrt(n(v,"length")/n(v,"gravity"));return[{label:"Period",value:`${fmt(T,2)} s`},{label:"Frequency",value:`${fmt(1/T,2)} Hz`},{label:"Small-angle model",value:n(v,"angle")<20?"Good":"Less accurate"}]; }
    case "energy-track-challenge": { const available=9.81*n(v,"height")*(1-n(v,"friction")/100),speed=Math.sqrt(Math.max(0,2*available));return[{label:"Speed at bottom",value:`${fmt(speed,1)} m/s`},{label:"Energy remaining",value:`${fmt(100-n(v,"friction"),0)}%`},{label:"Mass effect on speed",value:"Cancels ideally"}]; }
    case "electromagnet-3d": { const B=4*Math.PI*1e-7*n(v,"turns")*n(v,"current")/n(v,"length");return[{label:"Ideal B field",value:`${fmt(B*1000,2)} mT`},{label:"Ampere-turns",value:fmt(n(v,"turns")*n(v,"current"),0)},{label:"Field trend",value:"∝ NI/L"}]; }
    case "bridge-builder-challenge": { const demand=n(v,"load")*n(v,"span")/Math.max(1,n(v,"members"));return[{label:"Demand index",value:fmt(demand,0)},{label:"Load/member",value:`${fmt(n(v,"load")/n(v,"members"),1)} N`},{label:"Design trend",value:demand<800?"Comfortable":demand<1800?"Stressed":"High risk"}]; }

    case "volcano-eruption-3d": { const idx=n(v,"gas")*n(v,"pressure")*Math.log10(n(v,"viscosity")+1)/100;return[{label:"Eruption index",value:fmt(idx,1)},{label:"Likely style",value:idx>12?"Explosive":idx>5?"Mixed":"Effusive"},{label:"Dominant driver",value:n(v,"viscosity")>60?"Viscosity traps gas":"Gas/pressure"}]; }
    case "earthquake-epicenter-finder": { const k=1/(1/3.5-1/6), dist=(gap:number)=>gap*k;return[{label:"Station A radius",value:`${fmt(dist(n(v,"gapA")),0)} km`},{label:"Station B radius",value:`${fmt(dist(n(v,"gapB")),0)} km`},{label:"Station C radius",value:`${fmt(dist(n(v,"gapC")),0)} km`}]; }
    case "plate-tectonics-3d": { const km=n(v,"speed")*n(v,"time");return[{label:"Relative displacement",value:`${fmt(km,0)} km`},{label:"Boundary",value:s(v,"boundary")},{label:"Timescale",value:`${n(v,"time")} million yr`}]; }
    case "tsunami-3d": { const speed=Math.sqrt(9.81*n(v,"depth")),time=n(v,"distance")*1000/speed;return[{label:"Wave speed",value:`${fmt(speed,1)} m/s`},{label:"Travel time",value:`${fmt(time/3600,2)} h`},{label:"Source displacement",value:`${n(v,"displacement")} m`}]; }
    case "hurricane-simulator": { const heat=Math.max(0,n(v,"seaTemp")-26),deficit=Math.max(0,1013-n(v,"pressure")),idx=Math.max(0,heat*4+deficit*.18-n(v,"shear")*1.5);return[{label:"Intensity index",value:fmt(idx,0)},{label:"Ocean support",value:heat>2?"Strong":"Limited"},{label:"Shear effect",value:n(v,"shear")>20?"Disruptive":"Favorable"}]; }
    case "weather-front-simulator": { const contrast=Math.abs(n(v,"warm")-n(v,"cold")),rain=contrast*n(v,"humidity")/100;return[{label:"Temperature contrast",value:`${fmt(contrast,0)}°C`},{label:"Precipitation index",value:fmt(rain,1)},{label:"Front strength",value:contrast>15?"Strong":"Weak–moderate"}]; }
    case "river-erosion": { const shear=1000*9.81*n(v,"depth")*n(v,"slope");return[{label:"Bed shear stress",value:`${fmt(shear,1)} Pa`},{label:"Stream power proxy",value:fmt(shear*n(v,"speed"),1)},{label:"Erosion tendency",value:shear*n(v,"speed")>120?"High":"Lower"}]; }
    case "rock-cycle-challenge": { const vals=[["Metamorphism",n(v,"heat")+n(v,"pressure")],["Sediment pathway",n(v,"weathering")*2],["Melting/igneous",n(v,"heat")*1.5]] as const; const best=[...vals].sort((a,b)=>b[1]-a[1])[0];return[{label:"Dominant pathway",value:best[0]},{label:"Heat",value:`${n(v,"heat")}%`},{label:"Weathering",value:`${n(v,"weathering")}%`}]; }
    case "water-cycle-adventure": { const evap=Math.max(0,n(v,"temperature")-5)*(1-n(v,"humidity")/120),trans=evap*n(v,"vegetation")/100,runoff=Math.max(0,n(v,"humidity")-50)*(1-n(v,"vegetation")/150);return[{label:"Evaporation index",value:fmt(evap,1)},{label:"Transpiration index",value:fmt(trans,1)},{label:"Runoff index",value:fmt(runoff,1)}]; }
    case "ocean-currents-3d": { const density=1027+.78*(n(v,"salinity")-35)-.2*(n(v,"temperature")-10),idx=Math.abs(density-1027)+n(v,"wind")*.12;return[{label:"Density proxy",value:`${fmt(density,1)} kg/m³`},{label:"Circulation index",value:fmt(idx,1)},{label:"Water tendency",value:density>1027?"Denser / sinks":"Lighter / rises"}]; }

    case "animal-cell-3d": return [{label:"Model scale",value:`${n(v,"scale")}×`},{label:"Highlighted organelle",value:["Nucleus","Mitochondrion","Golgi apparatus","ER","Lysosome","Cell membrane"][Math.max(0,Math.round(n(v,"organelle"))-1)]},{label:"System",value:"Animal cell"}];
    case "cell-membrane-transport": { const passive=n(v,"permeability")*(n(v,"outside")-n(v,"inside")),active=n(v,"atp")/100*12;return[{label:"Passive flux proxy",value:fmt(passive,1)},{label:"Active capacity",value:fmt(active,1)},{label:"Net tendency",value:passive+active>=0?"Inward":"Outward"}]; }
    case "mitosis-challenge": { const p=n(v,"cycle"),stage=p<25?"Interphase":p<40?"Prophase":p<55?"Metaphase":p<75?"Anaphase":p<90?"Telophase":"Cytokinesis";return[{label:"Stage",value:stage},{label:"Chromosome pairs",value:fmt(n(v,"chromosomes"),0)},{label:"DNA copied?",value:p>=25?"Yes":"In progress"}]; }
    case "dna-replication": { const t=n(v,"length")/(n(v,"rate")*n(v,"forks"));return[{label:"Replication time",value:`${fmt(t,1)} s`},{label:"Total throughput",value:`${fmt(n(v,"rate")*n(v,"forks"),0)} bp/s`},{label:"Model",value:"Bidirectional forks"}]; }
    case "protein-synthesis": { const t=n(v,"codons")/(n(v,"rate")*Math.sqrt(n(v,"ribosomes")));return[{label:"Protein length",value:`${fmt(n(v,"codons"),0)} aa`},{label:"Time proxy",value:`${fmt(t,1)} s`},{label:"Ribosomes",value:fmt(n(v,"ribosomes"),0)}]; }
    case "human-heart-3d": { const co=n(v,"heartRate")*n(v,"strokeVolume")/1000;return[{label:"Cardiac output",value:`${fmt(co,2)} L/min`},{label:"Beats/min",value:fmt(n(v,"heartRate"),0)},{label:"O₂ saturation",value:`${fmt(n(v,"oxygen"),0)}%`}]; }
    case "natural-selection": { let p=n(v,"initial")/100,w=1+n(v,"selection")/100; for(let i=0;i<n(v,"generations");i++){p=(p*w)/(p*w+(1-p));}return[{label:"Final trait frequency",value:`${fmt(p*100,1)}%`},{label:"Selection coefficient",value:`${fmt(n(v,"selection"),0)}%`},{label:"Generations",value:fmt(n(v,"generations"),0)}]; }
    case "food-web-builder": { const top=n(v,"producerEnergy")*(n(v,"efficiency")/100)**(n(v,"levels")-1);return[{label:"Top-level energy",value:`${fmt(top,1)} kJ`},{label:"Transfer efficiency",value:`${n(v,"efficiency")}%`},{label:"Trophic levels",value:fmt(n(v,"levels"),0)}]; }
    case "photosynthesis-lab": { const light=n(v,"light")/100,co2=Math.min(1,n(v,"co2")/500),temp=Math.max(0,1-Math.abs(n(v,"temperature")-25)/25),rate=100*Math.min(light,co2,temp);return[{label:"Photosynthesis rate",value:`${fmt(rate,0)}%`},{label:"Limiting factor",value:light<=co2&&light<=temp?"Light":co2<=temp?"CO₂":"Temperature"},{label:"Temperature factor",value:`${fmt(temp*100,0)}%`}]; }
    case "immune-system-defense": { const clearance=n(v,"innate")*.7+n(v,"adaptive")*1.1,growth=n(v,"pathogens")*.08,net=growth-clearance;return[{label:"Net pathogen change",value:fmt(net,1)},{label:"Defense strength",value:fmt(clearance,1)},{label:"Outlook",value:net<0?"Clearing infection":"Pathogens growing"}]; }

    case "molecular-geometry-3d": { const g=Math.round(n(v,"groups")),lp=Math.min(Math.round(n(v,"lonePairs")),Math.max(0,g-1)); const key=`${g}-${lp}`; const shapes:Record<string,string>={"2-0":"Linear","3-0":"Trigonal planar","3-1":"Bent","4-0":"Tetrahedral","4-1":"Trigonal pyramidal","4-2":"Bent","5-0":"Trigonal bipyramidal","5-1":"Seesaw","5-2":"T-shaped","6-0":"Octahedral","6-1":"Square pyramidal","6-2":"Square planar"};return[{label:"Molecular shape",value:shapes[key]??"Explore arrangement"},{label:"Electron groups",value:String(g)},{label:"Lone pairs",value:String(lp)}]; }
    case "molecule-builder-3d": { const demand=n(v,"carbon")*4+n(v,"oxygen")*2+n(v,"hydrogen"),atoms=n(v,"carbon")+n(v,"oxygen")+n(v,"hydrogen");return[{label:"Atoms",value:fmt(atoms,0)},{label:"Valence demand",value:fmt(demand,0)},{label:"Formula",value:`C${n(v,"carbon")}H${n(v,"hydrogen")}O${n(v,"oxygen")}`}]; }
    case "chemical-bonding": { const d=Math.abs(n(v,"enA")-n(v,"enB"));return[{label:"Δ electronegativity",value:fmt(d,1)},{label:"Bond character",value:d<.4?"Mostly nonpolar covalent":d<1.7?"Polar covalent":"Strongly ionic tendency"},{label:"Polarity",value:d<.4?"Low":"Higher"}]; }
    case "acid-base-ph": { const ph=n(v,"ph"),h=10**(-ph);return[{label:"pH",value:fmt(ph,1)},{label:"[H⁺]",value:`${h.toExponential(2)} mol/L`},{label:"Classification",value:ph<7?"Acidic":ph>7?"Basic":"Neutral"}]; }
    case "titration-simulator": { const acid=n(v,"acidC")*n(v,"acidV")/1000,base=n(v,"baseC")*n(v,"baseV")/1000,vol=(n(v,"acidV")+n(v,"baseV"))/1000,diff=acid-base; let ph=7;if(Math.abs(diff)>1e-12){if(diff>0)ph=-Math.log10(diff/vol);else ph=14+Math.log10((-diff)/vol);}const eq=n(v,"acidC")*n(v,"acidV")/n(v,"baseC");return[{label:"pH (ideal strong/strong)",value:fmt(ph,2)},{label:"Equivalence volume",value:`${fmt(eq,1)} mL`},{label:"Base added",value:`${n(v,"baseV")} mL`}]; }
    case "states-of-matter-3d": { const score=n(v,"temperature")/(n(v,"pressure")+.5)/(1+n(v,"attraction")/80),phase=score<12?"Solid-like":score<80?"Liquid-like":"Gas-like";return[{label:"Particle regime",value:phase},{label:"Thermal/pressure index",value:fmt(score,1)},{label:"Attraction",value:`${n(v,"attraction")}%`}]; }
    case "solubility-curve": { const sol=25+n(v,"slope")*n(v,"temperature"),added=n(v,"solute"),status=added<sol*.98?"Unsaturated":added<=sol*1.02?"Saturated":"Supersaturated / excess solid";return[{label:"Solubility",value:`${fmt(sol,1)} g/100g water`},{label:"Solution status",value:status},{label:"Excess",value:`${fmt(Math.max(0,added-sol),1)} g`}]; }
    case "limiting-reagent": { const unitsA=n(v,"a")/n(v,"ratio"),unitsB=n(v,"b"),units=Math.min(unitsA,unitsB);return[{label:"Limiting reagent",value:unitsA<unitsB?"Reactant A":"Reactant B"},{label:"Reaction units",value:fmt(units,2)},{label:"Excess units",value:fmt(Math.abs(unitsA-unitsB),2)}]; }
    case "balance-equation": { const leftH=2*n(v,"h2"),leftO=2*n(v,"o2"),rightH=2*n(v,"h2o"),rightO=n(v,"h2o");return[{label:"Hydrogen balance",value:leftH===rightH?"Balanced":`${leftH} → ${rightH}`},{label:"Oxygen balance",value:leftO===rightO?"Balanced":`${leftO} → ${rightO}`},{label:"Equation",value:leftH===rightH&&leftO===rightO?"Balanced ✓":"Keep adjusting"}]; }
    case "periodic-table-hunt": { const z=Math.round(n(v,"atomic")); const elements=["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"]; const period=z<=2?1:z<=10?2:z<=18?3:4;return[{label:"Element",value:elements[z-1]??"—"},{label:"Atomic number",value:String(z)},{label:"Period",value:String(period)}]; }

    case "geometry-slice-3d": { const off=Math.abs(n(v,"offset"))/100,shape=s(v,"solid")==="Sphere"?"Circle":s(v,"solid")==="Cylinder"?(n(v,"angle")<10?"Circle":"Ellipse / rectangle-like depending orientation"):(n(v,"angle")<5?"Square":"Polygon");return[{label:"Likely section",value:shape},{label:"Plane angle",value:`${n(v,"angle")}°`},{label:"Offset",value:`${fmt(off*100,0)}%`}]; }
    case "pythagorean-puzzle": { const c=Math.hypot(n(v,"a"),n(v,"b"));return[{label:"Hypotenuse c",value:fmt(c,2)},{label:"a²+b²",value:fmt(n(v,"a")**2+n(v,"b")**2,2)},{label:"c²",value:fmt(c**2,2)}]; }
    case "unit-circle-challenge": { const r=n(v,"angle")*Math.PI/180;return[{label:"cos θ",value:fmt(Math.cos(r),3)},{label:"sin θ",value:fmt(Math.sin(r),3)},{label:"Radians",value:`${fmt(r/Math.PI,2)}π`}]; }
    case "quadratic-transformation": { return[{label:"Vertex",value:`(${fmt(n(v,"h"),2)}, ${fmt(n(v,"k"),2)})`},{label:"Opens",value:n(v,"a")>=0?"Up":"Down"},{label:"Width",value:Math.abs(n(v,"a"))>1?"Narrower":Math.abs(n(v,"a"))<1?"Wider":"Parent width"}]; }
    case "slope-intercept-challenge": { const y=n(v,"m")*n(v,"x")+n(v,"b");return[{label:"y at test x",value:fmt(y,2)},{label:"Slope",value:fmt(n(v,"m"),2)},{label:"y-intercept",value:fmt(n(v,"b"),2)}]; }
    case "geometry-transformation": { const det=n(v,"scale")**2;return[{label:"Area scale",value:`${fmt(det,2)}×`},{label:"Rotation",value:`${n(v,"rotation")}°`},{label:"Translation",value:fmt(n(v,"translation"),1)}]; }
    case "probability-experiment": { const p=n(v,"probability")/100,trials=Math.round(n(v,"trials")),seed=Math.round(n(v,"seed")); let wins=0,x=seed*9301+49297;for(let i=0;i<trials;i++){x=(x*233+17)%100003;if(x/100003<p)wins++;}return[{label:"Experimental probability",value:`${fmt(wins/trials*100,1)}%`},{label:"Theoretical probability",value:`${fmt(p*100,1)}%`},{label:"Successes",value:`${wins}/${trials}`}]; }
    case "derivative-tangent": { const slope=2*n(v,"a")*n(v,"x"),y=n(v,"a")*n(v,"x")**2+n(v,"c");return[{label:"Tangent slope",value:fmt(slope,3)},{label:"Point",value:`(${fmt(n(v,"x"),2)}, ${fmt(y,2)})`},{label:"Derivative",value:`f′(x)= ${fmt(2*n(v,"a"),2)}x`}]; }
    case "area-under-curve": { const b=n(v,"upper"),p=Math.round(n(v,"power")),N=Math.round(n(v,"rectangles")),dx=b/N;let sum=0;for(let i=0;i<N;i++)sum+=(i*dx)**p*dx;const exact=b**(p+1)/(p+1);return[{label:"Left Riemann sum",value:fmt(sum,4)},{label:"Exact integral",value:fmt(exact,4)},{label:"Absolute error",value:fmt(Math.abs(exact-sum),4)}]; }
    case "matrix-transformation": { const x=n(v,"a")*n(v,"vx")+n(v,"b")*n(v,"vy"),y=n(v,"c")*n(v,"vx")+n(v,"d")*n(v,"vy"),det=n(v,"a")*n(v,"d")-n(v,"b")*n(v,"c");return[{label:"Transformed vector",value:`(${fmt(x,2)}, ${fmt(y,2)})`},{label:"Determinant",value:fmt(det,2)},{label:"Orientation",value:det<0?"Reflected":det===0?"Collapsed":"Preserved"}]; }
  }
  return [{label:"Model",value:"Interactive"},{label:"Controls",value:"Live"},{label:"Evidence",value:"Observe change"}];
}

function ExpandedStage({ subject, simulation, values, ariaLabel }: { subject: SubjectSlug; simulation: SimulationCard; values: Values; ariaLabel: string }) {
  if (simulation.visualMode === "3d") return <ExpandedThreeScene subject={subject} slug={simulation.slug} values={values} ariaLabel={ariaLabel}/>;
  const nums=Object.values(values).filter((x):x is number=>typeof x==="number"); const p1=nums[0]??1,p2=nums[1]??1,p3=nums[2]??1;
  const h1=20+Math.abs(p1*7)%65,h2=20+Math.abs(p2*11)%65,h3=20+Math.abs(p3*13)%65;
  return <div className={`expandedModelStage expanded-${subject}`} aria-label={ariaLabel}>
    <div className="modelGrid"/><div className="modelOrb orb1" style={{transform:`translate(${(p1%20)-10}px,${(p2%18)-9}px) scale(${.8+(Math.abs(p1)%10)/25})`}}/><div className="modelOrb orb2" style={{transform:`translate(${(p2%24)-12}px,${(p3%20)-10}px)`}}/>
    <svg viewBox="0 0 600 280" role="img" aria-label={ariaLabel}><path className="modelAxis" d="M55 220H550M55 45V220"/><path className="modelCurve" d={`M55 ${220-h1*1.5} C180 ${230-h2*1.9}, 360 ${220-h3*1.7}, 550 ${70+((h1+h2+h3)%100)}`}/><circle className="modelPoint" cx={130+(Math.abs(p1)*17)%350} cy={220-h2*1.6} r="8"/></svg>
    <div className="modelBars"><i style={{height:`${h1}%`}}/><i style={{height:`${h2}%`}}/><i style={{height:`${h3}%`}}/></div>
  </div>;
}

export function ExpandedLabClient({ locale, copy, subject, simulation }: { locale: string; copy: LabClientCopy; subject: SubjectSlug; simulation: SimulationCard }) {
  const config=configs[simulation.slug];
  const initial=useMemo(()=>Object.fromEntries((config?.controls??[]).map(control=>[control.key,control.initial])) as Values,[config]);
  const [values,setValues]=useState<Values>(initial);
  const [muted,setMuted]=useState(true);
  const audioRef=useRef<AudioContext|null>(null);
  const mutedRef=useRef(true); mutedRef.current=muted;
  const lastToneRef=useRef(0);
  useEffect(()=>()=>{ if(audioRef.current) void audioRef.current.close(); },[]);
  if(!config) return <div className="expandedMissing">{copy.lab.notConfigured}</div>;
  const metrics=metricsFor(simulation.slug,values).map(metric=>({ label: runtimeText(locale, metric.label), value: runtimeMetricValue(locale, metric.value) }));
  const update=(key:string,value:number|string)=>{ if(typeof value === "number") softControlTone(audioRef,mutedRef,lastToneRef,value); setValues(current=>({...current,[key]:value})); };
  const stageLabel = `${simulation.title}: ${simulation.visualMode === "3d" ? copy.lab.interactive3d : copy.lab.liveResponse}`;
  const focusText = simulation.slug === "moon-phases-3d" && locale === "en" ? moonExplanation(values) : simulation.slug === "escape-velocity" && locale === "en" ? escapeExplanation(values) : simulation.slug === "earth-seasons-tilt" && locale === "en" ? seasonsExplanation(values) : (locale === "en" ? config.focus : simulation.outcome);
  return <>
    <div className="labStage expandedLabStage"><ExpandedStage subject={subject} simulation={simulation} values={values} ariaLabel={stageLabel}/></div>
    <div className="labControls expandedControls">{config.controls.map(control=>control.type==="select"?<label className="labControl" key={control.key}><span><b>{runtimeText(locale, control.label)}</b><output>{runtimeText(locale, String(values[control.key]))}</output></span><select value={String(values[control.key])} onChange={e=>update(control.key,e.target.value)}>{control.options.map(option=><option value={option.value} key={option.value}>{runtimeText(locale, option.label)}</option>)}</select></label>:<label className="labControl" key={control.key}><span><b>{runtimeText(locale, control.label)}</b><output>{Number(values[control.key]).toFixed(control.step<1?2:0)}{control.unit?` ${control.unit}`:""}</output></span><input type="range" min={control.min} max={control.max} step={control.step} value={Number(values[control.key])} onChange={e=>update(control.key,Number(e.target.value))}/></label>)}</div>
    <div className="labMetrics">{metrics.map(metric=><div className="labMetric" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}</div>
    <div className="expandedFocus"><div className="expandedFocusHeader"><span>{["moon-phases-3d","escape-velocity","earth-seasons-tilt"].includes(simulation.slug) && locale === "en" ? "What’s happening" : copy.lab.learningFocus}</span><button type="button" className="soundToggle" onClick={()=>setMuted(current=>!current)} aria-pressed={!muted}>{muted ? "🔇 Sound off" : "🔊 Sound on"}</button></div><p>{focusText}</p></div>
    <p className="labFormula">{runtimeFormula(locale, config.formula, simulation.outcome)}</p>
  </>;
}
