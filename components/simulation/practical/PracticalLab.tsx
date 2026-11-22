"use client";
import { useEffect, useMemo, useState } from "react";
import { experimentSettings, measurements, pendulumFrame, simulate, type Experiment, type Frame } from "@/lib/simulations/practical/models";
import { BorderLab, GeographyQuiz } from "./Geography";
import { PhysicsScene } from "./PhysicsScene";
import { PracticalWorkspace } from "./PracticalWorkspace";
import { investigations, type InvestigationSlug } from "@/lib/simulations/practical/investigations";
import InvestigationLab from "./InvestigationLab";
import "./practical.css";

const colors = ["#6ee2c3", "#ffbc70", "#a7b9ff"];
const pointList = (points: number[][]) => points.map(p=>p.join(",")).join(" ");

function Scene({ kind, frames, index }: { kind: Experiment; frames: Frame[]; index: number }) {
  const frame = frames[index], history = frames.slice(0,index+1);
  if (kind === "pendulum-wave" || kind === "gravity-planet-orbit" || kind === "n-body-space") {
    return <PhysicsScene kind={kind} frames={frames} index={index}/>;
  }
  if (kind === "climate-change-scenarios") {
    const y = 184-frame.values[1]/20;
    return <><path d="M30 184 L230 9 L430 184Z" fill="#47635e"/><path d={`M230 9 L${230+(y-9)*200/175} ${y} H${230-(y-9)*200/175}Z`} fill="#d6efef"/>
      <line x1="46" x2="410" y1="84" y2="84" stroke={colors[1]} strokeDasharray="5 4"/><text x="12" y="77">2,000 m baseline</text><text x="290" y={y-6}>{Math.round(frame.values[1])} m</text></>;
  }
  const max = Math.max(1,...frames.flatMap(f=>f.values));
  return <><path d="M36 12 V169 H450" fill="none" stroke="#8098a3"/><text x="4" y="20">{Math.ceil(max)}</text><text x="17" y="171">0</text>
    {frame.values.map((_,j)=><polyline key={j} points={pointList(history.map((f,i)=>[36+i*414/(frames.length-1),169-150*f.values[j]/Math.ceil(max)]))} fill="none" stroke={colors[j]} strokeWidth="2.5"/>)}
    <text x="36" y="189">0</text><text x="448" textAnchor="end" y="189">{kind==="ecosystem-survival" ? "1,000 years" : "100 days"}</text></>;
}

function ExperimentPanel({kind}: {kind: Experiment}) {
  const config = experimentSettings[kind];
  const [control,setControl] = useState<number>(config.initial), [index,setIndex] = useState(0), [running,setRunning] = useState(false);
  const frames = useMemo(()=>simulate(kind,control),[kind,control]);
  const pendulum = kind === "pendulum-wave";
  const last = pendulum ? 60 : frames.length-1;
  const finished = index >= last;
  useEffect(() => {
    if (!pendulum || !running || finished) return;
    let previous = performance.now();
    let request: number;
    function animate(now: number) {
      const seconds = (now - previous) / 1000;
      previous = now;
      setIndex(time => Math.min(60, time + seconds));
      request = requestAnimationFrame(animate);
    }
    request = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(request);
  }, [pendulum, running, finished]);
  useEffect(()=>{
    if (pendulum || !running || index===last) return;
    const timer = window.setTimeout(()=>setIndex(index+1),50);
    return ()=>window.clearTimeout(timer);
  },[running,index,last,pendulum]);
  function reset(value: number) { setRunning(false); setIndex(0); setControl(value); }
  const frame = pendulum ? pendulumFrame(index, control) : frames[index];
  return <PracticalWorkspace scene={<svg viewBox="0 0 460 200" role="img" aria-label={config.label+" experiment view"}>{pendulum ? <PhysicsScene kind="pendulum-wave" frames={[frame]} index={0}/> : <Scene kind={kind} frames={frames} index={index}/>}</svg>}><h2>Test a prediction</h2><p>{config.question}</p>
    {kind==="aquarium-food-web" ? <label>{config.label}<select value={control} onChange={e=>reset(+e.target.value)}>{["No removal","Algae","Snails","Fish"].map((v,i)=><option key={v} value={i}>{v}</option>)}</select></label> :
      <label>{config.label} · {control}{config.unit}<input type="range" min={config.min} max={config.max} step={config.step} value={control} onChange={e=>reset(+e.target.value)}/></label>}
    <div className="practicalReadings">{measurements[kind].map((label,i)=><span key={label}><i style={{background:colors[i]}}/>{label} <b>{Number(frame.values[i].toFixed(2))}</b></span>)}</div>
    <label>{kind==="climate-change-scenarios" ? "Warming scenario reached" : "Model time"} · {Number(frame.time.toFixed(2))} {kind==="ecosystem-survival" ? "years" : kind==="aquarium-food-web" ? "days" : kind==="pendulum-wave" ? "s" : kind==="climate-change-scenarios" ? "%" : "time units"}<input type="range" min="0" max={last} step={pendulum ? 0.01 : 1} value={index} onChange={e=>{setRunning(false);setIndex(+e.target.value);}}/></label>
    <div><button onClick={()=>{if(index===last){setIndex(0);setRunning(true);} else setRunning(!running);}}>{index===last ? "Replay" : running ? "Pause" : "Run experiment"}</button> <button onClick={()=>reset(control)}>Restart trial</button></div>
    <small>{notes[kind]}</small></PracticalWorkspace>;
}

const notes: Record<Experiment,string> = {
  "gravity-planet-orbit": "A fixed star attracts one planet by inverse-square gravity. Distance is measured in initial orbital radii. The view expands to follow the planet.",
  "n-body-space": "Every pair attracts. Touching bodies merge and conserve mass and momentum. Each trial begins with the same spiral arrangement for a given count.",
  "pendulum-wave": "Each pendulum follows the small-angle approximation. Shorter pendulums complete more cycles per minute. Air resistance is omitted.",
  "ecosystem-survival": "Prey grow toward a carrying capacity and feed predators. Predator abundance below half an individual counts as local extinction.",
  "aquarium-food-web": "Algae grow under constant light, snails graze algae and fish eat snails. Curves show relative abundance in a closed, simplified food web.",
  "climate-change-scenarios": "The pale region marks habitat cooler than a temperature threshold. The model assumes uniform warming and a temperature drop of 6.5°C per kilometre of elevation.",
};

export default function PracticalLab({slug}: {slug:string}) {
  if (slug in investigations) return <InvestigationLab slug={slug as InvestigationSlug}/>;
  return slug==="world-border-lab" ? <BorderLab/> : slug in experimentSettings ? <ExperimentPanel kind={slug as Experiment}/> : <GeographyQuiz field={slug==="geography-field-detective"}/>;
}
