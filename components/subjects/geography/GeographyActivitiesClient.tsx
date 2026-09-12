"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SubjectDefinition, SimulationCard } from "@/lib/subjects/catalog";
import { activities, arrivals, front, hurricane, initialJourney, initialValues, mission, ocean, plate, river, rockEdges, stationData, travel, tsunami, volcano, waterEdges, type Values, type Journey } from "@/lib/simulations/geographyLabs/model";
import { GeographyScene } from "./GeographyScene";
import { FieldDisplay } from "./FieldDisplay";
import styles from "../chemistry/chemistry.module.css";
import geo from "./geography.module.css";

const STORE="learnerkits-earth-expeditions-v1";
type Journal={completed:string[];observations:Record<string,string[]>};
function readJournal():Journal{try{const p=JSON.parse(localStorage.getItem(STORE)||"{}");return{completed:Array.isArray(p.completed)?p.completed.filter((s:unknown)=>typeof s==="string"&&activities.some(a=>a.slug===s)):[],observations:p.observations&&typeof p.observations==="object"&&!Array.isArray(p.observations)?Object.fromEntries(Object.entries(p.observations).filter((entry):entry is [string,string[]]=>{const [k,v]=entry;return activities.some(a=>a.slug===k)&&Array.isArray(v)&&v.every(s=>typeof s==="string");})):{}};}catch{return{completed:[],observations:{}};}}
const threeSlugs=["volcano-eruption-3d","plate-tectonics-3d","tsunami-3d","river-erosion","ocean-currents-3d"];
const fmt=(n:number,d=1)=>Number.isFinite(n)?n.toFixed(d):"—";
function readouts(slug:string,v:Values,t:number,j:Journey):[string,string][]{switch(slug){
 case"seismic-wave-lab":{const a=arrivals(v.distance);return[["P-wave speed","6 km/s"],["S-wave speed","3.5 km/s"],["S − P interval",t>=10?`${fmt(a.gap)} s`:"Awaiting record"]];}
 case"plate-motion-lab":{const p=plate(v);return[["Elapsed time",`${fmt(v.years*t/10)} Myr`],["East displacement",`${fmt(p.x*t/10,0)} km`],["North displacement",`${fmt(p.y*t/10,0)} km`]];}
 case"volcano-eruption-3d":{const e=volcano(v);return[["Eruption style",t>0?e.style:"Ready"],["Gas-retention index",`${fmt(e.index*100,0)} / 100`],["Viscosity",`${e.viscosity.toExponential(1)} Pa·s`]];}
 case"earthquake-epicenter-finder":return stationData(v.event).map(s=>[`${s.name} · S − P`,`${fmt(s.gap,2)} s`]);
 case"plate-tectonics-3d":return[["Boundary",["Divergent","Convergent","Transform"][v.boundary]],["Relative speed",`${v.rate} cm/year`],["Motion",["Apart","Together","Slide past"][v.boundary]]];
 case"tsunami-3d":{const a=tsunami(v);return[["Deep-water speed",`${fmt(a.speed*3.6,0)} km/h`],["Simulated elapsed",`${fmt(a.minutes*t/10)} min`],["20 m shelf amplitude",`${fmt(a.coastal)} m`]];}
 case"hurricane-simulator":{const h=hurricane(v);return[["Organization index",`${fmt(h.index*100,0)} / 100`],["Coriolis parameter",`${h.coriolis.toExponential(1)} s⁻¹`],["Environment",h.organized?"Favorable":h.index<=.1?"Hostile":"Marginal"]];}
 case"weather-front-simulator":{const f=front(v);return[["Approx. dew point",`${fmt(f.dew)} °C`],["Cloud base",`${fmt(f.base,0)} m`],["Lift above cloud base",`${fmt(f.cloud,0)} m`]];}
 case"river-erosion":{const r=river(v);return[["Flow velocity",`${fmt(r.velocity,2)} m/s`],["Bed shear",`${fmt(r.shear,2)} Pa`],["Discharge",`${fmt(r.flow)} m³/s`]];}
 case"ocean-currents-3d":{const o=ocean(v);return[["Warm-side density",`${fmt(o.warm,2)} kg/m³`],["Polar-side density",`${fmt(o.polar,2)} kg/m³`],["Density contrast",`${fmt(o.delta,2)} kg/m³`]];}
 default:return[["Current location",j.state],["Places visited",String(j.visited.length)],["Transformations",String(j.moves)]];
}}

export function GeographyActivitiesClient({locale,subject,simulation}:{locale:string;subject:SubjectDefinition;simulation:SimulationCard}){
 const activity=activities.find(a=>a.slug===simulation.slug)!,slug=activity.slug,water=slug==="water-cycle-adventure",journeyGame=water||slug==="rock-cycle-challenge";
 const [values,setValues]=useState(()=>initialValues(activity)),[time,setTime]=useState(0),[running,setRunning]=useState(false),[speed,setSpeed]=useState(1),[journey,setJourney]=useState(()=>initialJourney(water));
 const [journal,setJournal]=useState<Journal>({completed:[],observations:{}}),[feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null),[hint,setHint]=useState(false),[saved,setSaved]=useState(true);
 const live=useRef({running,speed});live.current={running,speed};
 useEffect(()=>{setJournal(readJournal());},[]);
 useEffect(()=>{let last=performance.now();const timer=window.setInterval(()=>{const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;if(document.hidden||!live.current.running)return;setTime(t=>Math.min(10,t+dt*live.current.speed));},50);return()=>clearInterval(timer);},[]);
 useEffect(()=>{if(time>=10)setRunning(false);},[time]);
 function update(key:string,value:number){setValues(v=>({...v,[key]:value}));setFeedback(null);if(!["estimate","landform","x","y","rings","event"].includes(key)){setRunning(false);setTime(0);}}
 function reset(){setValues(initialValues(activity));setTime(0);setRunning(false);setJourney(initialJourney(water));setFeedback(null);}
 function check(){const result=mission(slug,values,time>=10,journey);if(!result.ok){setFeedback(result);return;}
  const stored=readJournal(),steps=[...new Set([...(stored.observations[slug]||[]),...(journal.observations[slug]||[]),result.step])],complete=steps.length>=result.required;
  const next={completed:[...new Set([...stored.completed,...journal.completed,...(complete?[slug]:[])])],observations:{...stored.observations,...journal.observations,[slug]:steps}};setJournal(next);
  try{localStorage.setItem(STORE,JSON.stringify(next));setSaved(true);}catch{setSaved(false);}
  setFeedback({ok:true,text:`${complete?"Expedition complete · field badge earned!":`${steps.length}/${result.required} evidence stamps collected.`} ${result.text}`});
 }
 const result=mission(slug,values,time>=10,journey),stamps=journal.observations[slug]||[],complete=journal.completed.includes(slug),number=activities.findIndex(a=>a.slug===slug)+1;
 const actions=Object.keys((water?waterEdges:rockEdges)[journey.state]||{});
 return <main className={`${styles.page} ${geo.page}`}>
  <header className={styles.header}><div><Link className={styles.back} href={`/${locale}/subjects/geography`}>← Geography & Earth</Link><div className={styles.eyebrow}>EARTH EXPEDITIONS / FIELD STATION {String(number).padStart(2,"0")}</div><h1>{simulation.title}</h1><p>{simulation.outcome}</p></div><div className={`${styles.notebook} ${geo.passport}`}><span>YOUR FIELD PASSPORT</span><strong>{journal.completed.length}<small> / 12</small></strong><span>{journal.completed.length===12?"Master explorer":journal.completed.length>=6?"Earth systems specialist":journal.completed.length>=3?"Field researcher":"Junior explorer"}</span><div className={geo.passportDots}>{activities.map(a=><i key={a.slug} data-earned={journal.completed.includes(a.slug)} title={a.slug.replaceAll("-"," ")}/>)}</div></div></header>
  <div className={geo.ribbon}><span>◈ {activity.tag}</span><span>{journeyGame?"Choose a process. Build your journey.":"Predict. Experiment. Collect evidence."}</span><span>+1 FIELD BADGE</span></div>
  <div className={styles.workspace}><section className={styles.scenePanel} aria-label="Interactive Earth field station"><div className={styles.sceneTop}><span><i/>{journeyGame?"Journey map":threeSlugs.includes(slug)?"3D field model":"Live instrument display"}</span><span className={geo.status}>{running?"● EXPERIMENT RUNNING":time>=10?"RECORD COMPLETE":"READY TO EXPLORE"}</span></div>
   <div className={styles.stage}>{threeSlugs.includes(slug)?<GeographyScene slug={slug} values={values} time={time}/>:<FieldDisplay slug={slug} values={values} time={time} journey={journey} onPin={(x,y)=>{setValues(v=>({...v,x,y}));setFeedback(null);}}/>}</div>
   <div className={styles.metrics}>{readouts(slug,values,time,journey).map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
   {activity.run&&<div className={geo.transport}><button onClick={()=>{if(time>=10)setTime(0);setRunning(r=>!r);}} aria-label={running?"Pause experiment":"Run experiment"}>{running?"Ⅱ Pause":time>=10?"↻ Replay":"▶ Run"}</button><progress value={time} max="10" aria-label="Experiment playback"/><span>{fmt(time/10*100,0)}%</span><select aria-label="Playback speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value="1">1× speed</option><option value="2">2× speed</option><option value="0.5">½× speed</option></select></div>}
   {slug==="earthquake-epicenter-finder"&&<div className={geo.evidence}><span className={styles.eyebrow}>THREE STATIONS · ONE SOURCE</span><div>{stationData(values.event).map(s=><article key={s.name}><strong style={{color:s.color}}>{s.name}</strong><span>P: {fmt(s.p,2)} s · S: {fmt(s.s,2)} s</span><small>Radius = S–P gap ÷ (1/3.5 − 1/6)</small></article>)}</div></div>}
   {slug==="river-erosion"&&<div className={geo.legend}><span>● Blue: flowing water</span><span>● Sand: {river(values).sand?"moving":"resting"}</span><span>● Gravel: {river(values).gravel?"moving":"resting"}</span></div>}
   {slug==="ocean-currents-3d"&&<div className={geo.legend}><span>Left: warm box · right: polar box</span><span>{Math.abs(ocean(values).delta)<.01?"Equal density: no driven circulation":ocean(values).delta>0?"Polar water sinks ↓":"Warm-side water sinks ↓"}</span></div>}
   <div className={geo.caption}>{journeyGame?"Blue nodes mark visited places. Choose your next process in the mission panel.":slug==="earthquake-epicenter-finder"?"Distances and arrival gaps are calculated; the local map is fictional.":"Time and visual scale are accelerated for exploration. Read the model assumptions below."}</div>
  </section><aside className={styles.controlsPanel}><div className={styles.mission}><div className={styles.missionLabel}><span>EXPEDITION OBJECTIVE</span><b>{complete?"✓ BADGE EARNED":"MISSION ACTIVE"}</b></div><h2>{activity.mission}</h2><div className={geo.stamps}>{Array.from({length:result.required},(_,i)=><span key={i} data-filled={stamps.length>i}>{stamps.length>i?"✓":"◇"}</span>)}<small>{Math.min(stamps.length,result.required)} / {result.required} evidence stamps</small></div><button className={styles.hintButton} onClick={()=>setHint(h=>!h)} aria-expanded={hint}>{hint?"Hide field guide":"Open field guide ↗"}</button>{hint&&<p>{activity.hint}</p>}</div>
   <div className={styles.controlTitle}><h2>{journeyGame?"Choose your next move":"Experiment controls"}</h2><button onClick={reset}>↺ Reset</button></div>
   {journeyGame?<div className={geo.journeyActions}><p>You are at <strong>{journey.state}</strong>. What happens next?</p>{actions.map(action=><button key={action} onClick={()=>{setJourney(j=>travel(j,action,water));setFeedback(null);}}><span>{action}</span><span>→</span></button>)}<small>Only processes possible from your current state are available.</small></div>:<div className={styles.controls}>{activity.controls.map(c=><label key={c.key} className={styles.control}><span><b>{c.label}</b>{!c.options&&<output>{fmt(values[c.key],c.step<.1?2:c.step<1?1:0)} {c.unit}</output>}</span>{c.options?<select value={values[c.key]} onChange={e=>update(c.key,Number(e.target.value))}>{c.options.map((option,i)=><option key={option} value={i}>{option}</option>)}</select>:<input type="range" min={c.min} max={c.max} step={c.step} value={values[c.key]} onChange={e=>update(c.key,Number(e.target.value))}/>}</label>)}</div>}
   {activity.run&&<button className={styles.action} onClick={()=>{setTime(0);setRunning(true);setFeedback(null);}}>{time>0?"↻ Run a fresh experiment":"▶ Start experiment"}</button>}
   <button className={styles.checkButton} onClick={check}>Record evidence <span>→</span></button><div className={styles.feedback} aria-live="polite" aria-atomic="true">{feedback?<div data-success={feedback.ok}><strong>{feedback.ok?"✓ Field journal updated":"Keep investigating"}</strong><p>{feedback.text}</p></div>:<p>{journeyGame?"Complete the journey, then record your evidence.":"Make a prediction, test your settings, and record the result."}</p>}</div>{!saved&&<p className={styles.saveWarning}>Progress is kept for this session. Browser storage is unavailable.</p>}
   <details className={styles.science}><summary>Model assumptions & science</summary><p>{activity.science}</p>{activity.source&&<a href={activity.source[1]} target="_blank" rel="noreferrer">{activity.source[0]} ↗</a>}</details>
  </aside></div>
  <section className={styles.library}><span className={styles.eyebrow}>YOUR NEXT EXPEDITION</span><h2>12 ways to explore a changing planet</h2><div className={styles.labLinks}>{subject.simulations.map((sim,i)=><Link key={sim.slug} href={`/${locale}/simulations/${sim.slug}`} aria-current={sim.slug===slug?"page":undefined}><span>{String(i+1).padStart(2,"0")}</span><strong>{sim.title}</strong><small>{journal.completed.includes(sim.slug)?"✓ Field badge earned":"Begin expedition ↗"}</small></Link>)}</div></section>
 </main>;
}
