"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";
import type { Control, Values } from "@/lib/simulations/chemistry/model";
import { getCourseLab, type CourseLab } from "@/lib/simulations/chemistry/course/catalog";
import { atom, elements, heating, vaporExchange, diffusionProfile, moleAmounts, buffer, equilibrium, calorimetry, electrochemistry, dilution, enzyme, organic, redoxExamples, metalReaction, reactionExamples } from "@/lib/simulations/chemistry/course/models";
import { ScientificPlot } from "./ScientificPlot";
import { CourseScene } from "./CourseScene";
import base from "../chemistry.module.css";
import styles from "./course.module.css";
const fmt=(n:number,d=3)=>Math.abs(n)>0&&Math.abs(n)<.001?n.toExponential(2):n.toLocaleString("en-US",{maximumFractionDigits:d});
function visibleControl(slug:string,key:string,v:Values){
 if(slug==="phase-changes-diffusion")return key==="mode"|| (v.mode===0?key==="heat":v.mode===1?["temperature","elapsed"].includes(key):v.mode===2?["direction","progress"].includes(key):["surfaceTemperature","humidity"].includes(key));
 if(slug==="thermochemistry-calorimetry")return key!=="enthalpy"&&key!=="formed"||key===(v.mode===0?"enthalpy":"formed");
 if(slug==="electrochemistry")return key==="mode"||(v.mode===0?["zinc","copper"].includes(key):["current","minutes","efficiency"].includes(key));
 if(slug==="organic-chemistry")return key==="family"||(v.family===4?key==="group":v.family>=3&&key==="step");
 if(slug==="biochemistry")return key==="molecule"||(v.molecule===0?["substrate","enzyme","inhibitor"].includes(key):v.molecule===4&&key==="base");
 return true;
}
function NumericControl({c,value,onChange}:{c:Control;value:number;onChange:(v:number)=>void}){
 const [draft,setDraft]=useState(String(value));useEffect(()=>setDraft(String(value)),[value]);
 const commit=()=>{const n=Number(draft);if(!draft.trim()||!Number.isFinite(n)){setDraft(String(value));return;}const normalized=Number(Math.max(c.min,Math.min(c.max,c.min+Math.round((n-c.min)/c.step)*c.step)).toFixed(6));onChange(normalized);setDraft(String(normalized));};
 return <div className={styles.numericControl}><div><label htmlFor={`chem-${c.key}`}>{c.label}</label><span><input id={`chem-${c.key}`} type="number" min={c.min} max={c.max} step={c.step} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")e.currentTarget.blur();}}/>{c.unit&&<small>{c.unit}</small>}</span></div><input type="range" aria-label={`${c.label} slider`} min={c.min} max={c.max} step={c.step} value={value} onChange={e=>onChange(Number(e.target.value))}/></div>;
}
export function courseReadings(slug:string,v:Values):[string,string][] {
 switch(slug){
  case"atomic-structure":{const a=atom(v);return[["Element",a.element.name],["Isotope",`${a.element.symbol}-${a.mass}`],["Net charge",`${a.charge>0?"+":""}${a.charge}`],["Configuration",a.configuration]];}
  case"periodic-trends":{const e=elements[v.element-1];return[["Covalent radius",`${e.radius} pm`],["1st ionization energy",`${e.ionization} kJ/mol`],["Electronegativity",e.en?.toFixed(2)??"Not assigned"],["Electron affinity",e.affinity===null?"Not favorable / unavailable":`${e.affinity} kJ/mol released`]];}
  case"phase-changes-diffusion":{const h=heating(v.heat);if(v.mode===3){const e=vaporExchange(v);return [["Saturation vapor pressure",`${fmt(e.saturation)} kPa`],["Actual vapor pressure",`${fmt(e.vapor)} kPa`],["Surface exchange",e.state]];}return v.mode===0?[["Temperature",`${fmt(h.temperature,1)} °C`],["State",h.phase],["Heat supplied",`${v.heat} J`]]:v.mode===1?[["Temperature",`${v.temperature} K`],["Elapsed time",`${v.elapsed} s`],["Blue fraction at center",`${fmt(diffusionProfile(.5,v.elapsed,v.temperature)*100,1)}%`]]:[["Pathway",v.direction===0?"Solid → gas":"Gas → solid"],["Transformation",`${v.progress}%`],["Liquid intermediate","None"]];}
  case"mole-mass-converter":{const m=moleAmounts(v);return[["Moles",`${fmt(m.moles)} mol`],[m.compound.entity,m.particles.toExponential(3)],["Formal concentration",`${fmt(m.concentration)} mol/L`]];}
  case"chemical-reactions":return[["Reaction type",reactionExamples[v.reaction].type],["Progress",`${v.extent}%`],["Atom balance","Conserved"]];
  case"buffer-solutions":{const b=buffer(v);return[["pH",b.ph.toFixed(3)],["[CH₃COOH]",`${fmt(b.acid)} M`],["[CH₃COO⁻]",`${fmt(b.acetate)} M`]];}
  case"chemical-equilibrium":{const e=equilibrium(v);return[["[A]",`${fmt(e.a,4)} M`],["[B]",`${fmt(e.b,4)} M`],["Kc (dimensionless)",fmt(e.k)],["Pressure",`${fmt(e.pressure,1)} kPa`]];}
  case"thermochemistry-calorimetry":{const c=calorimetry(v);return[["Reaction ΔH",`${fmt(c.dh)} kJ/mol`],["Heat to surroundings",`${fmt(-c.heat/1000)} kJ`],["Final temperature",`${fmt(c.final,2)} °C`]];}
  case"electrochemistry":{const e=electrochemistry(v);return v.mode===0?[["Open-circuit potential",`${e.voltage.toFixed(3)} V`],["Anode · oxidation","Zn → Zn²⁺"],["Cathode · reduction","Cu²⁺ → Cu"]]:[["Charge passed",`${fmt(e.charge)} C`],["Electrons passed",`${fmt(e.electrons)} mol`],["Copper deposited",`${fmt(e.mass)} g`]];}
  case"organic-chemistry":{const o=organic(v);return[["Structure / step",o.name],["Reaction family",o.kind]];}
  case"solution-concentration":{const d=dilution(v);return[["Final concentration",`${fmt(d.concentration,4)} M`],["Solute amount",`${fmt(d.mmol)} mmol`],["Dilution factor",`${fmt(d.factor)}×`]];}
  case"redox-reactions":{const r=redoxExamples[v.reaction];return[["Reducing agent",r.reducing],["Oxidizing agent",r.oxidizing],["Electrons transferred",String(r.electrons)]];}
  case"metal-reactivity":{const r=metalReaction(v);return[["Standard cell potential",`${r.voltage.toFixed(2)} V`],["Direction",r.favorable?"Spontaneous at standard state":"Not spontaneous as written"],["Electron exchange",`${r.electrons} per balanced event`]];}
  case"biochemistry":{const e=enzyme(v);return v.molecule===0?[["Initial rate",`${fmt(e.rate)} mM/min`],["Vmax",`${fmt(e.vmax)} mM/min`],["Apparent Km",`${fmt(e.km)} mM`]]:[["Biomolecule",["Enzyme","Carbohydrate","Protein","Lipid","DNA"][v.molecule]],["Building blocks",["Amino acids","Monosaccharides","Amino acids","Glycerol + fatty acids","Nucleotides"][v.molecule]],["Link / interaction",["Active-site binding","Glycosidic bonds","Peptide bonds","Ester bonds","Phosphodiester backbone"][v.molecule]]];}
  default:return[];
 }
}
function CourseChart({slug,v}:{slug:string;v:Values}){
 const chart=useMemo(()=>{
  if(slug==="phase-changes-diffusion"&&v.mode===0)return <ScientificPlot series={[{name:"Water heating curve",points:[[0,-20],[42,0],[376,0],[794.4,100],[3051.4,100],[3300,224.3]]}]} xLabel="Heat supplied to 1 g (J)" yLabel="Temperature (°C)" xMax={3300} yMax={230} yMin={-20} marker={[v.heat,heating(v.heat).temperature]}/>;
  if(slug==="phase-changes-diffusion"&&v.mode===1)return <ScientificPlot series={[{name:"Blue gas fraction",points:Array.from({length:81},(_,i)=>[i/80,diffusionProfile(i/80,v.elapsed,v.temperature)])},{name:"Amber gas fraction",points:Array.from({length:81},(_,i)=>[i/80,1-diffusionProfile(i/80,v.elapsed,v.temperature)])}]} xLabel="Position across sealed chamber" yLabel="Local mole fraction" xMax={1} yMax={1}/>;
  if(slug==="phase-changes-diffusion"&&v.mode===3)return <ScientificPlot series={[{name:"Saturation vapor pressure above liquid water",points:Array.from({length:71},(_,i)=>[i+10,vaporExchange({...v,surfaceTemperature:i+10}).saturation])}]} xLabel="Water surface temperature (°C)" yLabel="Vapor pressure (kPa)" xMin={10} xMax={80} yMax={50} marker={[v.surfaceTemperature,vaporExchange(v).saturation]}/>;
  if(slug==="periodic-trends"){
   const key=["radius","ionization","en","affinity"][v.property] as "radius"|"ionization"|"en"|"affinity";const points=elements.map(e=>[e.z,e[key]??NaN] as [number,number]);
   return <ScientificPlot series={[{name:"Rounded reference values · gaps omitted",points}]} xLabel="Atomic number" yLabel={["Covalent radius (pm)","First IE (kJ/mol)","Pauling electronegativity","EA (kJ/mol released)"][v.property]} xMax={20} yMax={Math.max(...points.map(p=>p[1]).filter(Number.isFinite))*1.1}/>;
  }
  if(slug==="buffer-solutions")return <ScientificPlot series={[{name:"Buffer response to strong acid/base",points:Array.from({length:121},(_,i)=>[i*2-120,buffer({...v,dose:i*2-120}).ph])}]} xLabel="Strong-base dose (mmol; negative = acid)" yLabel="pH" xMin={-120} xMax={120} yMax={14} marker={[v.dose,buffer(v).ph]}/>;
  if(slug==="chemical-equilibrium"){
   const samples=Array.from({length:61},(_,i)=>({t:i*100/60,e:equilibrium(v,i*100/60)})),e=equilibrium(v);
   return <><ScientificPlot series={[{name:"Forward rate",points:samples.map(s=>[s.t,s.e.forward])},{name:"Reverse rate",points:samples.map(s=>[s.t,s.e.reverse])}]} xLabel="Time after mixing (s)" yLabel="Rate (mol L⁻¹ s⁻¹)" xMax={100} yMax={Math.max(...samples.flatMap(s=>[s.e.forward,s.e.reverse]))*1.1||1}/><p className={styles.chartNote}>Predicted equilibrium: [A] = {e.eqA.toFixed(4)} M, [B] = {e.eqB.toFixed(4)} M. Pressure is calculated from total gas amount. At equilibrium, Q approaches K.</p></>;
  }
  if(slug==="thermochemistry-calorimetry"){
   const c=calorimetry(v);return <ScientificPlot series={[{name:"Relative enthalpy (no activation barrier shown)",points:[[0,0],[.35,0],[.65,c.dh],[1,c.dh]]}]} xLabel="Reaction progress (schematic)" yLabel="Enthalpy (kJ/mol)" xMax={1} yMin={Math.min(0,c.dh)-20} yMax={Math.max(0,c.dh)+20}/>;
  }
  if(slug==="biochemistry"&&v.molecule===0)return <ScientificPlot series={[{name:"Selected inhibitor amount",points:Array.from({length:101},(_,i)=>[i/10,enzyme(v,i/10).rate])},{name:"No inhibitor",points:Array.from({length:101},(_,i)=>[i/10,enzyme(v,i/10).uninhibited])}]} xLabel="Substrate (mmol/L)" yLabel="Initial rate (mmol L⁻¹ min⁻¹)" xMax={10} yMax={v.enzyme*1.1} marker={[v.substrate,enzyme(v).rate]}/>;
  if(slug==="solution-concentration")return <ScientificPlot series={[{name:"Dilution at fixed solute amount",points:Array.from({length:101},(_,i)=>[v.aliquot+i*9,dilution({...v,water:i*9}).concentration])}]} xLabel="Final total volume (mL)" yLabel="Concentration (mol/L)" xMax={v.aliquot+900} yMax={v.stock*1.05} marker={[v.aliquot+v.water,dilution(v).concentration]}/>;
  return null;
 },[slug,v]);
 return chart?<div className={styles.chartPanel}>{chart}</div>:null;
}
function motionControl(lab:CourseLab,v:Values):Control|undefined{
 const key=lab.slug==="phase-changes-diffusion"?(v.mode===0?"heat":v.mode===1?"elapsed":v.mode===2?"progress":undefined):lab.slug==="chemical-equilibrium"?"elapsed":lab.slug==="chemical-reactions"?"extent":lab.slug==="metal-reactivity"?"progress":undefined;
 return lab.controls.find(c=>c.key===key);
}
export function ChemistryCourseClient({locale,subject,simulation}:{locale:string;subject:SubjectDefinition;simulation:SimulationCard}){
 const lab=getCourseLab(simulation.slug)!;
 const initial=()=>Object.fromEntries(lab.controls.map(c=>[c.key,c.value]));
 const [v,setValues]=useState<Values>(initial),[playing,setPlaying]=useState(false);
 const motion=motionControl(lab,v);
 useEffect(()=>{
  if(!playing||!motion)return;
  const timer=setInterval(()=>{if(document.hidden)return;setValues(old=>({...old,[motion.key]:Math.min(motion.max,Number((old[motion.key]+Math.max(motion.step,Math.round((motion.max-motion.min)/100/motion.step)*motion.step)).toFixed(6)))}));},100);
  return()=>clearInterval(timer);
 },[playing,motion]);
 useEffect(()=>{if(motion&&v[motion.key]>=motion.max)setPlaying(false);},[v,motion]);
 function update(key:string,value:number){setPlaying(false);setValues(old=>({...old,[key]:value,...(key==="family"?{step:0}:lab.slug==="chemical-equilibrium"&&key!=="elapsed"?{elapsed:0}:{})}));}
 const readings=courseReadings(lab.slug,v);
 return <main className={`${base.page} ${styles.page}`}>
  <header className={base.header}><div><Link className={base.back} href={`/${locale}/subjects/chemistry`}>← {subject.eyebrow}</Link><div className={base.eyebrow}>{lab.topic.toUpperCase()} · INTERACTIVE LAB</div><h1>{simulation.title}</h1><p>{simulation.outcome}</p></div></header>
  <div className={base.workspace}>
   <section className={base.scenePanel} aria-label={simulation.title}>
    <div className={base.sceneTop}><span><i/>{lab.topic}</span><span className={styles.modelBadge}>LIVE MODEL</span></div>
    <div className={styles.stage}><CourseScene slug={lab.slug} v={v} onChange={update}/></div>
    <div className={styles.readings} style={{gridTemplateColumns:`repeat(${readings.length},minmax(0,1fr))`}}>{readings.map(([name,value])=><div key={name}><span>{name}</span><strong>{value}</strong></div>)}</div>
    <CourseChart slug={lab.slug} v={v}/>
    <p className={styles.formula}>{lab.formula}</p>
   </section>
   <aside className={base.controlsPanel}>
    <div className={base.controlTitle}><h2>Experiment controls</h2><button onClick={()=>{setValues(initial());setPlaying(false);}}>↺ Reset</button></div>
    <div className={styles.controls}>{lab.controls.filter(c=>visibleControl(lab.slug,c.key,v)).map(c=>c.options?<label key={c.key} className={base.control}><span><b>{c.label}</b></span><select value={v[c.key]} onChange={e=>update(c.key,Number(e.target.value))}>{c.options.map((name,i)=><option key={name} value={i}>{name}</option>)}</select></label>:<NumericControl key={c.key} c={c} value={v[c.key]} onChange={n=>update(c.key,n)}/>)}</div>
    {motion&&<button className={base.action} onClick={()=>{if(v[motion.key]>=motion.max)setValues(old=>({...old,[motion.key]:motion.min}));setPlaying(p=>!p);}} aria-pressed={playing}>{playing?"Ⅱ Pause":"▶ Play progression"}</button>}
    <div className={styles.exploreNote}><h3>Try changing one thing</h3><p>{lab.steps[0]}</p></div>
    <details className={base.science}><summary>Model assumptions</summary><p>{lab.assumptions}</p><a href={lab.source} target="_blank" rel="noreferrer">{lab.sourceTitle} ↗</a>{lab.slug==="periodic-trends"&&<a href="https://pubchem.ncbi.nlm.nih.gov/periodic-table" target="_blank" rel="noreferrer">PubChem element reference ↗</a>}{lab.slug==="periodic-trends"&&<a href="https://doi.org/10.1039/B801115J" target="_blank" rel="noreferrer">Cordero et al. · Covalent radii ↗</a>}{lab.slug==="phase-changes-diffusion"&&<a href="https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&amp;Mask=4&amp;Type=ANTOINE" target="_blank" rel="noreferrer">NIST · Water vapor pressure ↗</a>}</details>
   </aside>
  </div>
  <section className={styles.scienceSection}><div><span className={base.eyebrow}>THE CHEMISTRY BEHIND THE MODEL</span><h2>{lab.topic}</h2><p>{lab.explanation}</p><div className={styles.topicChips}>{lab.concepts.map(c=><span key={c}>{c}</span>)}</div></div><div><h3>Explore the relationships</h3><ol>{lab.steps.map(s=><li key={s}>{s}</li>)}</ol></div></section>
 </main>;
}
