"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";
import { runtimeText } from "@/lib/i18n/runtimeText";
import { loadSettings, prefersReducedMotion } from "@/lib/settings/storage";
import { activities, bridge, checkMission, circuit, collision, energyAt, energyTrack, field, force, initialValues, lens, period, projectile, ramp, waveAmplitude, type Values } from "@/lib/simulations/physicsLabs/model";
import { PhysicsThreeScene } from "./PhysicsThreeScene";
import { PhysicsBench } from "./PhysicsBench";
import styles from "../chemistry/chemistry.module.css";
import physics from "./physics.module.css";

const STORAGE="learnerkits-physics-missions-v1";
const threeSlugs=new Set(["inclined-plane-friction","momentum-collision","newtons-laws-force-lab","electromagnet-3d","bridge-builder-challenge"]);
const format=(n:number,d=2)=>Number.isFinite(n)?n.toFixed(d):"∞";
function endTime(slug:string,v:Values,fallback:number){switch(slug){case "projectile-lab":return projectile(v).flight;case "inclined-plane-friction":return Math.min(60,ramp(v).finish);case "momentum-collision":return collision(v).at+1;case "pendulum-physics":return period(v)*3;case "energy-track-challenge":return energyTrack(v).duration;default:return fallback;}}

function readouts(slug:string,v:Values,time:number,closed:boolean,installed:boolean):[string,string][]{
  switch(slug){
    case "projectile-lab":{const p=projectile(v),t=Math.min(time,p.flight);return [["Range prediction",`${format(p.range,1)} m`],["Height",`${format(Math.max(0,p.vy*t-v.gravity*t*t/2),1)} m`],["Flight time",`${format(p.flight)} s`]];}
    case "circuit-builder":{const c=circuit(v,closed,installed);return [["Lamp current",`${format(c.lampCurrent,3)} A`],["Supply current",`${format(c.current,3)} A`],["Lamp power",`${format(c.power)} W`]];}
    case "inclined-plane-friction":{const r=ramp(v);return[["Speed",`${format(r.acceleration*Math.min(time,r.finish))} m/s`],["Normal force",`${format(r.normal,1)} N`],["Friction force",`${format(r.friction,1)} N`]];}
    case "momentum-collision":{const c=collision(v),after=time>=c.at;return[["Cart A velocity",`${format(after?c.speedA:v.speedA)} m/s`],["Cart B velocity",`${format(after?c.speedB:v.speedB)} m/s`],["Total momentum",`${format(c.momentum)} kg·m/s`]];}
    case "ray-optics-lens":{const l=lens(v);return[["Image distance",`${format(l.image)} cm`],["Magnification",`${format(l.magnification)} ×`],["Image",!Number.isFinite(l.image)?"At infinity":l.image>0?"Real · inverted":"Virtual · upright"]];}
    case "newtons-laws-force-lab":{const f=force(v);return[["Net force",`${format(f.net,1)} N`],["Acceleration",`${format(f.acceleration)} m/s²`],["Velocity",`${format(f.acceleration*time)} m/s`]];}
    case "simple-machines-challenge":{const distance=v.effort*v.advantage>=400?Math.min(1,time/4)*.5:0;return[["Output force",`${v.effort*v.advantage} N`],["Load lifted",`${format(distance)} m`],["Effort travel",`${format(distance*v.advantage)} m`]];}
    case "wave-interference":return [["Wave A",`${format(v.amplitudeA,1)} m`],["Wave B",`${format(v.amplitudeB,1)} m`],["Resultant amplitude",v.frequencyA===v.frequencyB?`${format(waveAmplitude(v),3)} m`:"Variable · beating"]];
    case "pendulum-physics":{const t=period(v);return[["Period",`${format(t,3)} s`],["Complete swings",String(Math.floor((time+1e-9)/t))],["Measured time",`${format(time)} s`]];}
    case "energy-track-challenge":{const e=energyAt(v,time);return[["Speed",`${format(Math.sqrt(2*e.kinetic/v.mass))} m/s`],["Height",`${format(e.height)} m`],["Total energy",`${format(e.initial,1)} J`]];}
    case "electromagnet-3d":return[["Internal field",`${format(field(v,closed)*1000)} mT`],["Ampere-turns",`${closed?v.current*v.turns:0} A·turn`],["Polarity",v.polarity?"Reversed":"Forward"]];
    case "bridge-builder-challenge":{const b=bridge(v);return[["Steel mass",`${format(b.mass,1)} kg`],["Applied load",`${format(v.load*Math.min(1,time/4),1)} kN`],["Capacity used",`${format(b.utilization*Math.min(1,time/4)*100,1)}%`]];}
    default:return[];
  }
}

export function PhysicsActivitiesClient({locale,subject,simulation}:{locale:string;subject:SubjectDefinition;simulation:SimulationCard}){
  const activity=activities.find(a=>a.slug===simulation.slug)!;const slug=activity.slug;
  const [values,setValues]=useState<Values>(()=>initialValues(activity));
  const [time,setTime]=useState(0),[running,setRunning]=useState(false),[started,setStarted]=useState(false),[paused,setPaused]=useState(false);
  const [closed,setClosed]=useState(false),[installed,setInstalled]=useState(false),[steps,setSteps]=useState<string[]>([]),[completed,setCompleted]=useState<string[]>([]);
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null),[showHint,setShowHint]=useState(false),[saved,setSaved]=useState(true),[reduced,setReduced]=useState(false);
  const duration=endTime(slug,values,activity.duration);const live=useRef({running,paused,duration,reduced});live.current={running,paused,duration,reduced};
  useEffect(()=>{try{const parsed:unknown=JSON.parse(localStorage.getItem(STORAGE)||"[]");if(Array.isArray(parsed))setCompleted(parsed.filter((s):s is string=>typeof s==="string"&&activities.some(a=>a.slug===s)));}catch{/* Session progress is still usable. */}setReduced(prefersReducedMotion(loadSettings()));},[]);
  useEffect(()=>{let last=performance.now();const timer=window.setInterval(()=>{const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;const s=live.current;if(document.hidden||s.paused)return;if(s.duration>0){if(s.running)setTime(t=>Math.min(s.duration,t+dt));}else if(!s.reduced)setTime(t=>t+dt);},50);return()=>clearInterval(timer);},[]);
  useEffect(()=>{if(running&&time>=duration)setRunning(false);},[running,time,duration]);
  function update(key:string,value:number){setValues(v=>({...v,[key]:value}));setTime(0);setStarted(false);setFeedback(null);}
  function reset(){setValues(initialValues(activity));setTime(0);setRunning(false);setStarted(false);setPaused(false);setClosed(false);setInstalled(false);setFeedback(null);setSteps([]);}
  function start(){setTime(0);setStarted(true);setRunning(true);setPaused(false);setFeedback(null);}
  function check(){const result=checkMission(slug,values,{time,started,closed,installed,steps});if(result.ok){const next=[...new Set([...steps,result.step??"done"])];setSteps(next);if(next.length>=(result.required??1)){const list=[...new Set([...completed,slug])];setCompleted(list);try{localStorage.setItem(STORAGE,JSON.stringify(list));setSaved(true);}catch{setSaved(false);}setFeedback({ok:true,text:`Mission complete. ${result.text}`});}else setFeedback({ok:true,text:`${next.length}/${result.required} recorded. ${result.text}`});}else setFeedback(result);}
  const metrics=readouts(slug,values,time,closed,installed);const index=activities.findIndex(a=>a.slug===slug);const tr=(text:string)=>runtimeText(locale,text);
  const energy=slug==="energy-track-challenge"?energyAt(values,time):null;
  const collisionData=slug==="momentum-collision"?collision(values):null;
  const structure=slug==="bridge-builder-challenge"?bridge(values):null;
  return <main className={`${styles.page} ${physics.page}`}>
    <header className={styles.header}><div><Link className={styles.back} href={`/${locale}/subjects/physics`}>← {subject.eyebrow}</Link><div className={styles.eyebrow}>INTERACTIVE LABORATORY / {String(index+1).padStart(2,"0")}</div><h1>{simulation.title}</h1><p>{simulation.outcome}</p></div><div className={styles.notebook}><span>YOUR PHYSICS NOTEBOOK</span><strong>{completed.length}<small> / {activities.length}</small></strong><span>missions completed on this device</span></div></header>
    <div className={styles.workspace}>
      <section className={styles.scenePanel} aria-label={simulation.title}><div className={styles.sceneTop}><span><i/>{activity.instrument}</span><button aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?"▶ Resume":"Ⅱ Pause"}</button></div>
        <div className={styles.stage}>{threeSlugs.has(slug)?<PhysicsThreeScene slug={slug} values={values} time={time} closed={closed}/>:<PhysicsBench slug={slug} values={values} time={time} started={started} closed={closed} installed={installed}/>}</div>
        <div className={styles.metrics}>{metrics.map(([label,value])=><div key={label}><span>{tr(label)}</span><strong>{value}</strong></div>)}</div>
        {activity.duration>0&&<div className={physics.timeline}><span>{!started?"Ready to run":running?paused?"Paused":"Experiment running":"Run finished"}</span><progress max={duration} value={time} aria-label="Experiment progress"/><output>{format(time)} / {format(duration)} s</output></div>}
        {energy&&<div className={physics.energy}><h3>Energy account <span>Always sums to {format(energy.initial,1)} J</span></h3>{[["Potential",energy.potential,"#8fb8fb"],["Kinetic",energy.kinetic,"#edbc84"],["Thermal",energy.heat,"#a4afc3"]].map(([label,value,color])=><div key={String(label)}><span>{label}</span><div><i style={{width:`${Number(value)/energy.initial*100}%`,background:String(color)}}/></div><output>{format(Number(value),1)} J</output></div>)}</div>}
        {collisionData&&<div className={physics.explanation}><strong>Momentum conserved · kinetic energy can change</strong><p>Before: {format(collisionData.energyBefore)} J · After impact: {format(collisionData.energyAfter)} J · Converted to deformation/heat: {format(collisionData.energyBefore-collisionData.energyAfter)} J.</p></div>}
        {structure&&<div className={physics.explanation}><strong>{started&&time>=4?(structure.utilization>1?"Load test failed — member capacity exceeded":"Load test complete — members within capacity"):"Triangular truss · compression in amber, tension in blue"}</strong><p>At the selected full load: side compression {format(structure.compression/1000)} kN · tie tension {format(structure.tension/1000)} kN · buckling limit {format(structure.buckling/1000)} kN.</p></div>}
        {slug==="electromagnet-3d"&&<div className={styles.legend}><span>Blue field loops · direction cones follow current</span><span>Winding display samples the actual turn count</span></div>}
        {slug==="newtons-laws-force-lab"&&<div className={styles.legend}><span>Blue arrow: applied force</span><span>Amber arrow: resistance</span><span>Travel is fitted to the viewport</span></div>}
      </section>
      <aside className={styles.controlsPanel}><div className={styles.mission}><div className={styles.missionLabel}><span>YOUR MISSION</span><b>{completed.includes(slug)?"✓ COMPLETE":"IN PROGRESS"}</b></div><h2>{activity.mission}</h2><button className={styles.hintButton} aria-expanded={showHint} onClick={()=>setShowHint(v=>!v)}>{showHint?"Hide hint":"Need a hint?"}</button>{showHint&&<p>{activity.hint}</p>}</div>
        <div className={styles.controlTitle}><h2>Experiment controls</h2><button onClick={reset}>↺ Reset</button></div>
        {running&&<p className={physics.locked}>Conditions stay fixed during a run. Reset to change them.</p>}
        <div className={styles.controls}>{activity.controls.map(c=><label key={c.key} className={styles.control}><span><b>{tr(c.label)}</b>{!c.options&&<output>{format(values[c.key],c.step<.1?2:c.step<1?1:0)} {c.unit}</output>}</span>{c.options?<select value={values[c.key]} disabled={running} onChange={e=>update(c.key,Number(e.target.value))}>{c.options.map((o,i)=><option key={o} value={i}>{tr(o)}</option>)}</select>:<input type="range" min={c.min} max={c.max} step={c.step} value={values[c.key]} disabled={running} onChange={e=>update(c.key,Number(e.target.value))}/>}</label>)}</div>
        {slug==="circuit-builder"&&<div className={physics.switches}><button aria-pressed={installed} onClick={()=>{setInstalled(v=>!v);setFeedback(null);}}>{installed?"✓ Resistor installed · remove":"+ Install resistor in socket"}</button><button aria-pressed={closed} onClick={()=>{setClosed(v=>!v);setFeedback(null);}}>{closed?"● Circuit closed · open switch":"○ Circuit open · close switch"}</button></div>}
        {slug==="electromagnet-3d"&&<div className={physics.switches}><button aria-pressed={closed} onClick={()=>{setClosed(v=>!v);setFeedback(null);}}>{closed?"● Coil energized · power off":"○ Power off · energize coil"}</button></div>}
        {activity.duration>0&&<button className={styles.action} disabled={running} onClick={start}>{running?"Experiment running…":slug==="projectile-lab"?"▶ Launch ball":slug==="momentum-collision"?"▶ Run collision":slug==="bridge-builder-challenge"?"▶ Test structure":slug==="pendulum-physics"?"▶ Measure three swings":slug==="simple-machines-challenge"?"▶ Lift load":"▶ Run experiment"}</button>}
        <button className={styles.checkButton} onClick={check}>Check mission <span>→</span></button><div className={styles.feedback} aria-live="polite" aria-atomic="true">{feedback?<div data-success={feedback.ok}><strong>{feedback.ok?"✓ Target achieved":"Try another approach"}</strong><p>{feedback.text}</p></div>:<p>Adjust the controls, observe the experiment, then check your mission.</p>}</div>
        {!saved&&<p className={styles.saveWarning}>Completed for this session. Browser storage is unavailable, so progress could not be saved.</p>}
        <details className={styles.science}><summary>How the physics works</summary><p>{activity.science}</p></details>
      </aside>
    </div>
    <section className={styles.library}><span className={styles.eyebrow}>KEEP EXPERIMENTING</span><h2>Explore all {activities.length} physics labs</h2><div className={styles.labLinks}>{subject.simulations.map((sim,i)=><Link key={sim.slug} href={`/${locale}/simulations/${sim.slug}`} aria-current={sim.slug===slug?"page":undefined}><span>{String(i+1).padStart(2,"0")}</span><strong>{sim.title}</strong><small>{completed.includes(sim.slug)?"✓ Completed":"Open lab ↗"}</small></Link>)}</div></section>
  </main>;
}
