"use client";
import Link from "next/link";
import { useState } from "react";
import { effectiveActivation, rateConstant, solutionPH, solubilityResult, yieldResult, type Values } from "@/lib/simulations/chemistry/model";
import { chemistryCoursePublished, getCourseLab } from "@/lib/simulations/chemistry/course/catalog";
import { ScientificPlot } from "./ScientificPlot";
import styles from "./course.module.css";
function Readings({items}:{items:[string,string][]}){return <div className={styles.legacyMetrics}>{items.map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>;}
function GasLaws({v}:{v:Values}){
 const [law,setLaw]=useState(0);
 const pressure=(t:number,volume:number)=>v.moles*8.314*t/volume;
 const points:[number,number][]=Array.from({length:81},(_,i)=>law===0?[5+i*35/80,pressure(v.temperature,5+i*35/80)]:law===1?[i*600/80,v.volume*i*600/80/v.temperature]:[i*600/80,pressure(i*600/80,v.volume)]);
 return <section className={styles.legacyPanel}><h2>Explore the gas laws</h2><div className={styles.gasLawTabs}>{["Boyle’s law","Charles’s law","Pressure–temperature law"].map((name,i)=><button key={name} aria-pressed={law===i} onClick={()=>setLaw(i)}>{name}</button>)}</div><ScientificPlot series={[{name:["P ∝ 1/V at fixed T and n","V ∝ T at fixed P and n","P ∝ T at fixed V and n"][law],points}]} xLabel={law===0?"Volume (L)":"Absolute temperature (K)"} yLabel={law===1?"Volume (L)":"Pressure (kPa)"} xMax={law===0?40:600} yMax={Math.max(...points.map(p=>p[1]))*1.05} marker={law===0?[v.volume,pressure(v.temperature,v.volume)]:law===1?[v.temperature,v.volume]:[v.temperature,pressure(v.temperature,v.volume)]}/><p>{["At fixed temperature and gas amount, halving volume doubles pressure. More frequent wall collisions account for the pressure increase.","At the pressure of your current chamber, volume is proportional to absolute temperature. Doubling kelvin temperature doubles volume.","With volume and gas amount fixed, pressure is proportional to kelvin temperature. Hotter particles transfer more momentum to the walls."][law]} These ideal-gas relationships become less accurate near condensation and at high pressure. The zero-kelvin intercept is an extrapolation.</p></section>;
}
export function LegacyEnhancements({slug,values:v,time,reacted,locale}:{slug:string;values:Values;time:number;reacted:boolean;locale:string}){
 // Course labs have no route while the course is unpublished, so drop links to them.
 const link=(id:string,label:string)=>!chemistryCoursePublished&&getCourseLab(id)?null:<Link href={`/${locale}/simulations/${id}`}>{label} →</Link>;
 if(slug==="gas-law-lab")return <GasLaws v={v}/>;
 if(slug==="reaction-rate-lab"){
  const ea=effectiveActivation(v)/1000,k=rateConstant(v),rate=k*v.concentration*Math.exp(-k*time);
  // Smooth schematic barrier; reactants 0, transition state Ea, products −20 kJ/mol.
  const profile=(barrier:number):[number,number][]=>Array.from({length:81},(_,i)=>{const x=i/80;return[x,x<=.5?barrier*Math.sin(Math.PI*x)**2:-20+(barrier+20)*Math.sin(Math.PI*x)**2];});
  return <section className={styles.legacyPanel}><h2>Collisions, activation energy and reaction rate</h2><Readings items={[["Effective activation energy",`${ea.toFixed(2)} kJ/mol`],["Current reaction rate",`${rate.toExponential(3)} mol L⁻¹ s⁻¹`],["Relative exposed area",`${v.rateMode===1?v.area:1}×`]]}/><ScientificPlot series={[{name:"Uncatalyzed pathway",points:profile(v.activation)},{name:"Selected pathway",points:profile(ea)}]} xLabel="Reaction coordinate (schematic)" yLabel="Potential energy (kJ/mol)" xMax={1} yMax={v.activation+10} yMin={-30}/><p>Collisions need enough energy and a suitable orientation to react. A catalyst provides a lower-barrier pathway; it does not change the reactant or product energy. The illustrative profile has ΔH = −20 kJ/mol. Temperature changes the energy distribution; it does not lower the barrier.</p><ScientificPlot series={[{name:"Rate = k[A]",points:Array.from({length:81},(_,i)=>[i/4,k*v.concentration*Math.exp(-k*i/4)])}]} xLabel="Time (s)" yLabel="Rate (mol L⁻¹ s⁻¹)" xMax={20} yMax={k*v.concentration*1.05} marker={[time,rate]}/><p>Doubling initial concentration doubles the initial rate in this first-order model. Exposed surface area only affects the surface-controlled model: crushing a solid exposes more reaction sites. It is an illustrative multiplier, not a universal rate law.</p></section>;
 }
 if(slug==="acid-base-ph"){
  const ph=solutionPH(v),weak=v.solution===1||v.solution===3,ion=v.solution===3?10**(ph-14):10**-ph;
  const fraction=weak?1.8e-5/(1.8e-5+ion):1;
  return <section className={styles.legacyPanel}><h2>Strength, concentration and dissociation</h2><Readings items={[["Hydroxide [OH⁻]",`${(10**(ph-14)).toExponential(3)} M`],["Ionized solute",`${(fraction*100).toFixed(2)}%`],["Acid/base strength",weak?"Weak · partial ionization":"Strong · complete dissociation"]]}/><p>{["HCl + H₂O → H₃O⁺ + Cl⁻", "CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻", "NaOH → Na⁺ + OH⁻", "NH₃ + H₂O ⇌ NH₄⁺ + OH⁻"][v.solution]}</p><p>Strength describes the extent of ionization; concentration describes how much solute is present per volume. At equal concentration, the weak acid has a higher pH than HCl, and ammonia has a lower pH than NaOH. Dilution increases the fraction ionized in a weak acid or base while moving its pH toward 7. One pH unit represents a tenfold change in hydrogen-ion activity; this dilute model uses concentration in its place.</p><div className={styles.legacyLinks}>{link("buffer-solutions","Explore buffers")}{link("titration-simulator","Explore titration")}</div></section>;
 }
 if(slug==="limiting-reagent"){
  const y=yieldResult(v.hydrogen,v.oxygen),actual=reacted?y.water*v.recovery/100:0;
  return <section className={styles.legacyPanel}><h2>Theoretical yield and collected product</h2><Readings items={[["Maximum possible water",`${y.water.toFixed(2)} mol`],["Collected water",`${actual.toFixed(2)} mol · ${(actual*18.015).toFixed(2)} g`],["Not collected",`${(reacted?y.water-actual:0).toFixed(2)} mol`]]}/><p>Percentage yield = collected product ÷ theoretical product × 100. Here the reaction goes to completion, and the collection slider models water lost during isolation. It changes the amount collected, while the limiting reactant and excess reactant remain determined by the original mole ratio.</p>{link("mole-mass-converter","Convert between mass and moles")}</section>;
 }
 if(slug==="solubility-curve"){
  const r=solubilityResult(v);
  return <section className={styles.legacyPanel}><h2>Solute, solvent and saturation</h2><Readings items={[["Solution state",v.solute<r.capacity?"Unsaturated":"Saturated"],["Dissolved + solid",`${(r.dissolved+r.crystals).toFixed(1)} g`],["Solvent mass",`${v.water} g water`]]}/><p>Capacity = solubility per 100 g water × water mass ÷ 100. The graph uses the same 100 g basis for both lines. Add water to dissolve more solute, or cool to form crystals once the capacity falls below the total added. Not every substance becomes more soluble on heating; this curve represents an illustrative salt. Gases often show the opposite trend.</p>{link("solution-concentration","Explore concentration and dilution")}</section>;
 }
 if(slug==="states-of-matter-3d")return <section className={styles.legacyPanel}><h2>From particle motion to phase changes</h2><p>Heating increases average particle kinetic energy within a phase. During melting or boiling at fixed pressure, added energy changes intermolecular separation while temperature stays constant until the transition is complete. Evaporation can occur at a liquid surface below its boiling point; condensation is the reverse process. Sublimation takes a solid directly to gas, and deposition reverses it.</p>{link("phase-changes-diffusion","Explore latent heat, sublimation and diffusion")}</section>;
 return null;
}
