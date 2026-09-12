"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";
import { activities, initialValues, metrics, mission, type Values } from "@/lib/simulations/environmentalLabs/model";
import { EnvironmentalDisplay } from "./EnvironmentalDisplay";
import styles from "../chemistry/chemistry.module.css";
import env from "./environmental.module.css";

const STORE="learnerkits-environmental-missions-v1";
type Journal={completed:string[]};
function readJournal():Journal{try{const parsed=JSON.parse(localStorage.getItem(STORE)||"{}");return{completed:Array.isArray(parsed.completed)?parsed.completed.filter((slug:unknown)=>typeof slug==="string"&&activities.some(a=>a.slug===slug)):[]};}catch{return{completed:[]};}}
const fmt=(value:number,digits=1)=>Number.isFinite(value)?value.toFixed(digits):"—";
function readouts(slug:string,v:Values):[string,string][]{const m=metrics(slug,v) as Record<string,number>;switch(slug){
 case"greenhouse-effect-simulator":return[["Radiative forcing",`${fmt(m.forcing,2)} W/m²`],["Equilibrium warming",`+${fmt(m.warming,2)} °C`],["Outgoing energy",`${fmt(m.outgoing,1)} W/m²`]];
 case"carbon-cycle-simulator":return[["Net annual flow",`${fmt(m.net)} GtCO₂/yr`],["CO₂ after 30 years",`${fmt(m.ppm,0)} ppm`],["Carbon captured",`${fmt(m.stored,0)} GtCO₂`]];
 case"sea-level-rise-simulator":return[["Local sea-level rise",`${fmt(m.total,2)} m`],["Thermal expansion",`${fmt(m.thermal,2)} m`],["Land-ice contribution",`${fmt(m.ice,2)} m`]];
 case"ocean-acidification-simulator":return[["Surface-ocean pH",fmt(m.ph,2)],["Shell health",`${fmt(m.shell,0)}%`],["Carbonate proxy",`${fmt(m.carbonate,0)}%`]];
 case"renewable-energy-grid-simulator":return[["Reliability",`${fmt(m.reliability,0)}%`],["Clean share",`${fmt(m.cleanShare,0)}%`],["Operational emissions",`${fmt(m.emissions,1)} tCO₂/h`]];
 case"air-pollution-smog-simulator":return[["AQI proxy",fmt(m.aqi,0)],["PM₂.₅",`${fmt(m.pm,1)} µg/m³`],["Ground-level ozone",`${fmt(m.ozone,0)} ppb`]];
 case"deforestation-water-cycle-simulator":return[["Infiltration",`${fmt(m.infiltration,0)}%`],["Storm runoff",`${fmt(m.runoff,0)}%`],["Soil loss",`${fmt(m.soilLoss,1)} t/ha`]];
 case"biodiversity-habitat-fragmentation":return[["Connectivity",`${fmt(m.connectivity,0)}%`],["Population viability",`${fmt(m.viability,0)}%`],["Edge exposure",`${fmt(m.edge,0)}%`]];
 case"urban-heat-island-simulator":return[["Heat anomaly",`+${fmt(m.anomaly,1)} °C`],["Local afternoon temp",`${fmt(m.local,1)} °C`],["Stormwater runoff",`${fmt(m.runoff,0)}%`]];
 default:return[["Residual risk",`${fmt(m.risk,0)} / 100`],["Investment",`${fmt(m.budget,0)} / 100`],["Flood · heat · storm",`${fmt(m.flood,0)} · ${fmt(m.heat,0)} · ${fmt(m.storm,0)}`]];
}}

export function EnvironmentalActivitiesClient({locale,subject,simulation}:{locale:string;subject:SubjectDefinition;simulation:SimulationCard}){
 const activity=activities.find(item=>item.slug===simulation.slug)!,slug=activity.slug;
 const [values,setValues]=useState(()=>initialValues(activity)),[time,setTime]=useState(0),[running,setRunning]=useState(false),[speed,setSpeed]=useState(1),[journal,setJournal]=useState<Journal>({completed:[]}),[feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null),[hint,setHint]=useState(false),[saved,setSaved]=useState(true);
 const live=useRef({running,speed});live.current={running,speed};
 useEffect(()=>setJournal(readJournal()),[]);
 useEffect(()=>{let last=performance.now();const timer=window.setInterval(()=>{const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;if(!document.hidden&&live.current.running)setTime(t=>Math.min(10,t+dt*live.current.speed));},50);return()=>clearInterval(timer);},[]);
 useEffect(()=>{if(time>=10)setRunning(false);},[time]);
 function update(key:string,value:number){setValues(current=>({...current,[key]:value}));setTime(0);setRunning(false);setFeedback(null);}
 function reset(){setValues(initialValues(activity));setTime(0);setRunning(false);setFeedback(null);}
 function check(){const result=mission(slug,values,time>=10);if(!result.ok){setFeedback(result);return;}const stored=readJournal(),next={completed:[...new Set([...stored.completed,...journal.completed,slug])]};setJournal(next);try{localStorage.setItem(STORE,JSON.stringify(next));setSaved(true);}catch{setSaved(false);}setFeedback({ok:true,text:`Mission complete · climate action badge earned! ${result.text}`});}
 const result=mission(slug,values,time>=10),complete=journal.completed.includes(slug),number=activities.findIndex(a=>a.slug===slug)+1;
 return <main className={`${styles.page} ${env.page}`}>
  <header className={styles.header}><div><Link className={styles.back} href={`/${locale}/subjects/environmental-science`}>← Environmental Science & Climate</Link><div className={styles.eyebrow}>PLANET SYSTEMS / MISSION {String(number).padStart(2,"0")}</div><h1>{simulation.title}</h1><p>{simulation.outcome}</p></div><div className={`${styles.notebook} ${env.dashboard}`}><span>YOUR CLIMATE DASHBOARD</span><strong>{journal.completed.length}<small> / 10</small></strong><span>{journal.completed.length===10?"Planet systems strategist":journal.completed.length>=6?"Climate solutions designer":journal.completed.length>=3?"Environmental analyst":"Systems explorer"}</span><div>{activities.map(a=><i key={a.slug} data-earned={journal.completed.includes(a.slug)}/>)}</div></div></header>
  <div className={env.ribbon}><span>◉ {activity.tag}</span><span>Change one driver. Run the system. Read the evidence.</span><span>+1 CLIMATE BADGE</span></div>
  <div className={styles.workspace}><section className={styles.scenePanel} aria-label="Interactive environmental systems model"><div className={styles.sceneTop}><span><i/>LIVE SYSTEM MODEL</span><span className={env.status}>{running?"● MODEL RUNNING":time>=10?"SCENARIO COMPLETE":"READY TO TEST"}</span></div><div className={`${styles.stage} ${env.stage}`}><EnvironmentalDisplay slug={slug} values={values} time={time}/></div>
   <div className={styles.metrics}>{readouts(slug,values).map(([name,value])=><div key={name}><span>{name}</span><strong>{value}</strong></div>)}</div>
   <div className={env.transport}><button onClick={()=>{if(time>=10)setTime(0);setRunning(value=>!value);}}>{running?"Ⅱ Pause":time>=10?"↻ Replay":"▶ Run"}</button><progress value={time} max="10" aria-label="Scenario progress"/><span>{fmt(time*10,0)}%</span><select aria-label="Playback speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value=".5">½×</option><option value="1">1×</option><option value="2">2×</option></select></div>
   <p className={env.caption}>This is a simplified educational model. Values update from the equations described in Model assumptions & science.</p>
  </section><aside className={styles.controlsPanel}><div className={styles.mission}><div className={styles.missionLabel}><span>MISSION OBJECTIVE</span><b>{complete?"✓ BADGE EARNED":"MISSION ACTIVE"}</b></div><h2>{activity.mission}</h2><button className={styles.hintButton} onClick={()=>setHint(value=>!value)} aria-expanded={hint}>{hint?"Hide systems guide":"Open systems guide ↗"}</button>{hint&&<p>{activity.hint}</p>}</div>
   <div className={styles.controlTitle}><h2>Scenario controls</h2><button onClick={reset}>↺ Reset</button></div><div className={styles.controls}>{activity.controls.map(control=><label key={control.key} className={styles.control}><span><b>{control.label}</b><output>{fmt(values[control.key],control.step<.1?2:control.step<1?1:0)} {control.unit}</output></span><input type="range" min={control.min} max={control.max} step={control.step} value={values[control.key]} onChange={e=>update(control.key,Number(e.target.value))}/></label>)}</div>
   <button className={styles.action} onClick={()=>{setTime(0);setRunning(true);setFeedback(null);}}>▶ Run scenario</button><button className={styles.checkButton} onClick={check}>Record evidence <span>→</span></button><div className={styles.feedback} aria-live="polite">{feedback?<div data-success={feedback.ok}><strong>{feedback.ok?"✓ Evidence recorded":"Keep investigating"}</strong><p>{feedback.text}</p></div>:<p>Adjust the drivers, run the complete scenario, then test the mission target.</p>}</div>{!saved&&<p className={styles.saveWarning}>Progress is available for this session only.</p>}
   <details className={styles.science}><summary>Model assumptions & science</summary><p>{activity.science}</p><a href={activity.source[1]} target="_blank" rel="noreferrer">{activity.source[0]} ↗</a></details>
  </aside></div>
  <section className={styles.library}><span className={styles.eyebrow}>CONTINUE THE CLIMATE PATHWAY</span><h2>10 interactive environmental science simulations</h2><div className={styles.labLinks}>{subject.simulations.map((sim,index)=><Link key={sim.slug} href={`/${locale}/simulations/${sim.slug}`} aria-current={sim.slug===slug?"page":undefined}><span>{String(index+1).padStart(2,"0")}</span><strong>{sim.title}</strong><small>{journal.completed.includes(sim.slug)?"✓ Badge earned":"Start mission ↗"}</small></Link>)}</div></section>
 </main>;
}
