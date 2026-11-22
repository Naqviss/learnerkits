import populationData from "./population-2000-2020.json";
import type { SubjectSlug } from "@/lib/subjects/catalog";

export type Investigation = {
  subject: SubjectSlug; title: string; keywords: string; description: string; question: string;
  control: string; unit: string; min: number; max: number; initial: number; duration: number; clock: string;
  choices?: readonly string[];
};

export const populationNames = ["World", ...Object.keys(populationData).filter(name => name !== "World").sort()];

export const investigations = {
  "fluid-dynamics-simulator": {
    subject:"physics", title:"Fluid Dynamics Simulator · Pipe Flow", keywords:"Fluid simulation · fluid dynamics · viscosity",
    description:"Trace fluid parcels through a pipe and vary viscosity at a fixed pressure gradient. Compare the speed at the wall, halfway out, and at the center.",
    question:"Which part of a pipe carries the fastest fluid?", control:"Dynamic viscosity",unit:"mPa·s",min:1,max:8,initial:2,duration:12,clock:"s",
  },
  "water-impact-simulator": {
    subject:"physics", title:"Water Simulation · Ten Objects in a Current", keywords:"Water simulation · physics simulation · drag force",
    description:"Compare the drag on ten objects in a water current. Keep speed and frontal area fixed to isolate how the assumed shape coefficient changes force.",
    question:"Which object feels the greatest force in the same current?",control:"Object facing the current",unit:"",min:0,max:9,initial:0,duration:10,clock:"s",
    choices:["Sphere","Flat disk","Cube","Cone, tip first","Hemisphere, hollow upstream","Streamlined pod","Cylinder sideways","Angled wedge","Blunt prism","Ellipsoid, long axis upstream"],
  },
  "planet-collision-simulator": {
    subject:"physics", title:"Planet Collision Simulator · Two-Body Impact", keywords:"Gravity · planets · orbit simulator · collision speed",
    description:"Release two rocky planets from rest and change their starting separation. Track their shared center of mass and measure their speed at first contact.",
    question:"Does a longer fall give two planets a faster impact?",control:"Initial center separation",unit:"radii",min:3,max:10,initial:6,duration:40,clock:"model time",
  },
  "projectile-target-simulator": {
    subject:"physics",title:"Projectile Motion Simulator · Land on Target",keywords:"Projectile motion · physics · motion simulation",
    description:"Aim a ball at a target 30 metres away. Adjust the launch angle, compare the predicted landing error, and find two arcs that reach the same spot.",
    question:"Can two launch angles land the ball on the same target?",control:"Launch angle",unit:"°",min:5,max:85,initial:30,duration:4,clock:"s",
  },
  "pendulum-wave-designer": {
    subject:"physics",title:"Pendulum Wave Designer · Tune the Reunion",keywords:"Pendulum simulation · physics experiment · satisfying simulation",
    description:"Design a pendulum wave around a chosen reunion time. Compare the string lengths and watch eight brass bobs separate in phase and return together.",
    question:"How short must the strings be to reunite after twelve seconds?",control:"Reunion time",unit:"s",min:6,max:24,initial:12,duration:24,clock:"s",
  },
  "food-chain-simulator": {
    subject:"environmental-science",title:"Food Chain Simulator · Meadow Species Removal",keywords:"Food chain · food web · ecosystem simulation",
    description:"Remove foxes or rabbits from a meadow food chain. Follow grass, grazer and predator abundance for 60 weeks to uncover an indirect ecological effect.",
    question:"How can fox removal affect grass that foxes never eat?",control:"Starting community",unit:"",min:0,max:2,initial:0,duration:60,clock:"weeks",choices:["Intact meadow","Remove foxes","Remove rabbits"],
  },
  "population-ecosystem-simulator": {
    subject:"environmental-science",title:"Population Ecosystem Simulator · Habitat Capacity",keywords:"Ecosystem · population simulation · carrying capacity",
    description:"Introduce 1,000 animals to a reserve and change the area available for grazing. Compare herd size with carrying capacity over twenty model years.",
    question:"How much grazing land can support a herd of 1,000 animals?",control:"Grazing area",unit:"km²",min:10,max:100,initial:40,duration:20,clock:"years",
  },
  "deforestation-simulator": {
    subject:"environmental-science",title:"Deforestation Simulator · A Century of Forest Loss",keywords:"Deforestation · climate change · environment simulation",
    description:"Clear a percentage of the remaining forest each year for a century. Measure surviving canopy area and estimate aboveground carbon storage in the stand.",
    question:"How much forest remains after a century of percentage losses?",control:"Annual clearing",unit:"%",min:0,max:5,initial:2,duration:100,clock:"years",
  },
  "ocean-pollution-simulator": {
    subject:"environmental-science",title:"Ocean Pollution Simulator · Coastal Recovery",keywords:"Ocean pollution · environment · water simulation",
    description:"Flush a polluted coastal bay with clean seawater. Change its daily exchange rate and measure how long a dissolved tracer takes to fall below a threshold.",
    question:"When will a bay fall below one tenth of its initial concentration?",control:"Daily water exchange",unit:"%",min:1,max:25,initial:10,duration:100,clock:"days",
  },
  "carbon-footprint-simulator": {
    subject:"environmental-science",title:"Carbon Footprint Simulator · Community Emissions",keywords:"Carbon footprint · climate change · climate science",
    description:"Cut the annual carbon footprint of a model town and compare cumulative emissions with its baseline. Test a 50 percent reduction over thirty years.",
    question:"If everyone halves their footprint, what happens to cumulative emissions?",control:"Per-person reduction",unit:"%",min:0,max:100,initial:50,duration:30,clock:"years",
  },
  "animated-world-map": {
    subject:"geography",title:"Animated World Map · Follow the Daylight",keywords:"Map animation · map simulation · world map",
    description:"Animate a day on an equinox world map. Set a reference longitude and follow the daylight boundary while comparing UTC with local mean solar time.",
    question:"Which longitudes experience noon together as Earth rotates?",control:"Reference longitude",unit:"° E",min:-180,max:180,initial:0,duration:24,clock:"UTC hours",
  },
  "country-border-simulator": {
    subject:"geography",title:"Country Border Simulator · Redraw a Boundary",keywords:"Country borders · geography · map simulation",
    description:"Move a fictional capital across a regional map. Watch two nearest-capital territories change size and trace the boundary where travel distances match.",
    question:"Which settlements switch sides when a capital moves?",control:"Eastern capital longitude",unit:"° E",min:10,max:50,initial:35,duration:10,clock:"relocation steps",
  },
  "population-growth-map": {
    subject:"geography",title:"Population Growth Map · World Population 2000–2020",keywords:"Population map · world population · geography",
    description:"Explore World Bank population estimates from 2000 to 2020. Compare each country's percentage change with its total population and the world trend.",
    question:"Which places grew fastest relative to their population in 2000?",control:"Compare population",unit:"",min:0,max:populationNames.length-1,initial:0,duration:20,clock:"years since 2000",choices:populationNames,
  },
  "climate-zones-map": {
    subject:"geography",title:"Climate Zones Map Simulator · Temperature Belts",keywords:"Climate zones · world map · climate change",
    description:"Warm an idealized world and track a temperature boundary toward the poles. Compare the latitude of the warm belt across six degrees of warming.",
    question:"How far can a temperature belt move toward the poles?",control:"Final warming",unit:"°C",min:0,max:6,initial:3,duration:100,clock:"% of scenario",
  },
  "natural-disaster-map": {
    subject:"geography",title:"Natural Disaster Map Simulator · Hurricane Track",keywords:"Hurricane simulation · natural disaster map · geography map",
    description:"Steer a hypothetical Atlantic hurricane with an east–west wind. Follow its projected position for five days and compare tracks under different winds.",
    question:"How does a change in steering wind shift a hurricane track?",control:"Westward steering speed",unit:"km/h",min:5,max:35,initial:20,duration:120,clock:"hours",
  },
} satisfies Record<string, Investigation>;
export type InvestigationSlug = keyof typeof investigations;
export const investigationSlugs = Object.keys(investigations) as InvestigationSlug[];
