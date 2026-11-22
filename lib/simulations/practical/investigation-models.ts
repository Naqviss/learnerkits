import historicalPopulation from "./population-2000-2020.json";
import { populationNames, type InvestigationSlug } from "./investigations";

export type Reading = {label:string; value:number; unit:string};
const reading = (label:string,value:number,unit:string):Reading => ({label,value,unit});
export const dragCoefficients = [0.47,1.17,1.05,0.5,1.42,0.08,1.2,0.65,1.1,0.18];
export const populationSeries: Record<string, number[]> = historicalPopulation;

export function populationChange(name: string, yearIndex: number) {
  const values = populationSeries[name];
  return values ? 100 * (values[yearIndex] / values[0] - 1) : undefined;
}

export function planetEncounter(start:number,time:number) {
  // Radial free fall from rest: r = r0 cos²(theta), G(m1+m2) = 3.
  const scale = Math.sqrt(start**3/6);
  const elapsed = (angle:number)=>scale*(angle+Math.sin(2*angle)/2);
  const contactAngle = Math.acos(Math.sqrt(2/start));
  const impactTime = elapsed(contactAngle);
  let lo=0, hi=contactAngle;
  for(let i=0;i<30;i++){const middle=(lo+hi)/2;if(elapsed(middle)<time) lo=middle; else hi=middle;}
  const separation = time>=impactTime ? 2 : start*Math.cos((lo+hi)/2)**2;
  return {separation,impactTime,speed:Math.sqrt(Math.max(0,6*(1/separation-1/start)))};
}
export function meadow(treatment:number,time:number) {
  let grass=90,rabbits=treatment===2?0:24,foxes=treatment===1?0:8;
  const steps=Math.ceil(time*10),dt=steps?time/steps:0;
  for(let n=0;n<steps;n++){
    const grazed=0.003*grass*rabbits,hunted=0.009*rabbits*foxes;
    grass+=dt*(0.22*grass*(1-grass/130)-grazed);
    rabbits+=dt*(0.5*grazed-hunted-0.04*rabbits);
    foxes+=dt*(0.32*hunted-0.05*foxes);
  }
  return [grass,rabbits,foxes];
}
export function readings(slug:InvestigationSlug,c:number,t:number):Reading[] {
  switch(slug){
    case "fluid-dynamics-simulator": return [reading("Center speed",4/c,"cm/s"),reading("Half-radius speed",3/c,"cm/s"),reading("Wall speed",0,"cm/s")];
    case "water-impact-simulator": return [reading("Shape coefficient",dragCoefficients[c],""),reading("Drag force",20*dragCoefficients[c],"N"),reading("Impulse",20*dragCoefficients[c]*t,"N·s")];
    case "planet-collision-simulator": {const e=planetEncounter(c,t);return [reading("Center separation",e.separation,"radii"),reading("Closing speed",e.speed,"radii/time unit"),reading("Time to contact from release",e.impactTime,"time units")];}
    case "projectile-target-simulator": {const angle=c*Math.PI/180,vy=18*Math.sin(angle),flight=2*vy/9.81,elapsed=Math.min(t,flight),range=18*Math.cos(angle)*flight;
      return [reading("Downrange",18*Math.cos(angle)*elapsed,"m"),reading("Height",Math.max(0,vy*elapsed-4.905*elapsed**2),"m"),reading("Landing error",range-30,"m")];}
    case "pendulum-wave-designer": return [reading("Longest string",9.81*(c/(5*2*Math.PI))**2,"m"),reading("Shortest string",9.81*(c/(12*2*Math.PI))**2,"m"),reading("Completed reunions",Math.floor(t/c),"")];
    case "food-chain-simulator": return meadow(c,t).map((v,i)=>reading(["Grass","Rabbits","Foxes"][i],v,"index"));
    case "population-ecosystem-simulator": {const k=20*c;return [reading("Herd size",k/(1+(k/1000-1)*Math.exp(-.28*t)),"animals"),reading("Carrying capacity",k,"animals")];}
    case "deforestation-simulator": {const forest=1000*(1-c/100)**t;return [reading("Standing forest",forest,"ha"),reading("Cleared area",1000-forest,"ha"),reading("Carbon stored",80*forest,"t C")];}
    case "ocean-pollution-simulator": return [reading("Tracer concentration",10*(1-c/100)**t,"mg/L"),reading("First day at or below 1 mg/L",Math.ceil(Math.log(.1)/Math.log(1-c/100)),"days")];
    case "carbon-footprint-simulator": return [reading("Baseline total",6000*t,"t CO₂e"),reading("Reduced total",6000*(1-c/100)*t,"t CO₂e"),reading("Avoided emissions",6000*c/100*t,"t CO₂e")];
    case "animated-world-map": return [reading("Noon meridian",180-15*t,"° E"),reading("Local solar hour",(t+c/15+24)%24,"h")];
    case "country-border-simulator": {const capital=35+(c-35)*t/10,border=(capital-10)/2;return [reading("Eastern capital",capital,"° E"),reading("Boundary longitude",border,"° E"),reading("Settlements west of boundary",[1,5,9,13,17].filter(l=>l<border).length,"of 5")];}
    case "population-growth-map": {
      const yearIndex = Math.floor(t), name = populationNames[c];
      return [reading("Year", 2000 + yearIndex, ""), reading(name + " population", populationSeries[name][yearIndex]/1e6, "million"), reading("Change since 2000", populationChange(name, yearIndex)!, "%"), reading("World change", populationChange("World", yearIndex)!, "%")];
    }
    case "climate-zones-map": {const warming=c*t/100;return [reading("Warming applied",warming,"°C"),reading("20°C latitude",(10+warming)/.5,"° N/S"),reading("5°C latitude",(25+warming)/.5,"° N/S")];}
    case "natural-disaster-map": return [reading("Latitude",15+6*t/111,"° N"),reading("Longitude",-35-c*t/(111*Math.cos(18*Math.PI/180)),"° E"),reading("Westward displacement",c*t,"km")];
  }
}
