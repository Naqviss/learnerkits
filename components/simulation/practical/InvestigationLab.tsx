"use client";
import { memo, useEffect, useMemo, useState } from "react";
import { investigations, populationNames, type Investigation, type InvestigationSlug } from "@/lib/simulations/practical/investigations";
import { populationChange, readings, type Reading } from "@/lib/simulations/practical/investigation-models";
import countries from "@/lib/simulations/practical/countries.json";
import { DisputedAreas, MapLegend } from "./Geography";
import { Globe, LabBench, Sky } from "./PhysicsScene";
import { PracticalWorkspace } from "./PracticalWorkspace";

const palette=["#72d9ae","#ffc172","#9eb9ff"];
const objectShapes=["M8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0","M14 -12h3v24h-3z","M5 -10h20v20H5z","M3 0l23 -12v24z","M6 -12q30 12 0 24q17 -12 0 -24","M0 0q9 -8 30 0q-21 8 -30 0","M6 -12h18v24H6z","M2 3l24 -12v18z","M4 -8l5 -5h15v23H4z","M0 0a16 6 0 1 0 32 0a16 6 0 1 0-32 0"];

function PhysicsView({slug,c,t,v}:{slug:InvestigationSlug;c:number;t:number;v:Reading[]}) {
  if(slug==="fluid-dynamics-simulator") return <><path d="M0 35H460 M0 165H460" stroke="#afbeca" strokeWidth="7"/>
    {Array.from({length:13},(_,row)=>{const y=36+row*128/12,speed=4/c*(1-((row-6)/6)**2);return <g key={row}>{Array.from({length:12},(_,i)=><circle key={i} cx={(i*40+row%3*8+t*speed*12)%480-10} cy={y} r="2.5" fill="#71d9ea"/>)}</g>;})}</>;
  if(slug==="water-impact-simulator") return <><rect width="460" height="200" fill="#164c60"/>{Array.from({length:11},(_,i)=>{const y=20+16*i;return <path key={i} d={`M0 ${y} Q160 ${y} 190 ${y+(i<5?-10:10)} T290 ${y} H460`} fill="none" stroke="#86dbe8" strokeDasharray="6 9" strokeDashoffset={-t*28} opacity=".6"/>;})}
    <g transform="translate(198 100) scale(2.1)"><path d={objectShapes[c]} fill="#ffc172" stroke="#794c32"/></g></>;
  if (slug === "planet-collision-simulator") {
    const separation = v[0].value * 24;
    return <><Sky/><line x1="230" x2="230" y1="64" y2="136" stroke="#91a6b9" strokeDasharray="2 3"/>
      <Globe x={230-separation/3} y={100} r={24} angle={30} earth/>
      <Globe x={230+2*separation/3} y={100} r={24} angle={30}/>
      <text x="230" y="158" textAnchor="middle">{t>=v[2].value ? "First contact" : "Falling toward one another"}</text></>;
  }
  if(slug==="projectile-target-simulator"){const a=c*Math.PI/180, total=Math.min(t,36*Math.sin(a)/9.81);
    const points=Array.from({length:61},(_,i)=>{const s=total*i/60;return [18+18*Math.cos(a)*s*12,173-(18*Math.sin(a)*s-4.905*s*s)*8].join(",");});
    return <><path d="M0 175H460" stroke="#889f8b"/><path d="M378 175v-20l13 5-13 5" fill="#ffc172" stroke="#ffc172"/><text x="378" y="192" textAnchor="middle">30 m</text><polyline points={points.join(" ")} fill="none" stroke="#76bbdc"/><circle cx={18+v[0].value*12} cy={173-v[1].value*8} r="5" fill="#ffbd7a"/></>;}
  return <><LabBench/><path d="M18 18H442 M20 18V178 M440 18V178" stroke="#526367" strokeWidth="5"/>
    {Array.from({length:8},(_,i)=>{const anchor=53+49*i,length=130*(c/24)**2*(5/(5+i))**2,angle=.31*Math.cos(2*Math.PI*(5+i)*t/c),x=anchor+length*Math.sin(angle),y=20+length*Math.cos(angle);
      return <g key={i}><line x1={anchor} y1="20" x2={x} y2={y} stroke="#394b4b"/><circle cx={x} cy={y} r="4" fill="url(#brass)"/></g>;})}</>;
}

const CountryLayer = memo(function CountryLayer({ year, selected }: {year?: number; selected?: string}) {
  return <>{countries.map(country => {
    const change = year === undefined ? undefined : populationChange(country.name, year);
    let fill = "#477580";
    if (year !== undefined) {
      if (change === undefined) fill = "#5a6069";
      else if (change < 0) fill = "#a184cb";
      else if (change < 10) fill = "#538c99";
      else if (change < 30) fill = "#59b5a2";
      else fill = "#e9a958";
    }
    const focused = country.name === selected;
    return <path key={country.name} d={country.path} fill={fill} stroke={focused ? "#fff4ae" : "#233f4d"} strokeWidth={focused ? 1.1 : .4}><title>{country.name}</title></path>;
  })}</>;
});
const MapDisputes = memo(DisputedAreas);

function MapView({slug,c,t,v}:{slug:InvestigationSlug;c:number;t:number;v:Reading[]}) {
  const regional=slug==="country-border-simulator";
  return <g transform={regional ? "translate(145 360) scale(6)" : slug==="natural-disaster-map" ? "translate(520 245) scale(6)" : "translate(230 104) scale(1.22)"}>
    <CountryLayer year={slug==="population-growth-map" ? Math.floor(t) : undefined} selected={slug==="population-growth-map" ? populationNames[c] : undefined}/>
    {slug==="animated-world-map" && <>{[-360,0,360].map(offset=><rect key={offset} x={v[0].value+90+offset} y="-90" width="180" height="180" fill="#030a22" opacity=".68"/>)}<line x1={c} x2={c} y1="-85" y2="78" stroke="#ffd67e"/></>}
    {regional && <><rect x="-24" y="-50" width={v[1].value+24} height="22" fill="#bb80ce" opacity=".48"/><rect x={v[1].value} y="-50" width={60-v[1].value} height="22" fill="#ffb558" opacity=".48"/><path d={`M${v[1].value} -50v22`} stroke="white" strokeDasharray="1 1" strokeWidth=".45"/>{[-10,v[0].value].map((x,i)=><rect key={i} x={x-.7} y="-40.7" width="1.4" height="1.4" fill="white"/>)}{[1,5,9,13,17].map(x=><circle key={x} cx={x} cy="-36" r=".55" fill="#112632" stroke="white" strokeWidth=".2"/>)}</>}
    {slug==="climate-zones-map" && <>{[[-90,180,"#afc9eb"],[-v[2].value,2*v[2].value,"#7ab987"],[-v[1].value,2*v[1].value,"#efac63"]].map(([y,h,color])=><rect key={String(color)} x="-180" y={Number(y)} width="360" height={Number(h)} fill={String(color)} opacity=".46"/>)}</>}
    <MapDisputes/>
    {slug==="natural-disaster-map" && <><line x1="-35" y1="-15" x2={v[1].value} y2={-v[0].value} stroke="#ffcf83" strokeWidth="1.5"/><circle cx={v[1].value} cy={-v[0].value} r="3" fill="#fff"/></>}
  </g>;
}

function EnvironmentView({slug,c,t,duration}:{slug:InvestigationSlug;c:number;t:number;duration:number}) {
  const series=useMemo(()=>Array.from({length:101},(_,i)=>readings(slug,c,duration*i/100)),[slug,c,duration]);
  const count=slug==="ocean-pollution-simulator"?1:slug==="deforestation-simulator"?2:series[0].length;
  const max=Math.max(1,...series.flatMap(row=>row.slice(0,count).map(metric=>metric.value)));
  const end=t/duration*100;
  const current=readings(slug,c,t);
  return <><path d="M42 18V168H444" fill="none" stroke="#8399a5"/><text x="5" y="22">{Math.ceil(max).toLocaleString("en-US")}</text><text x="26" y="170">0</text>
    {series[0].slice(0,count).map((metric,k)=>{const points=series.slice(0,Math.floor(end)+1).map((row,i)=>[42+4*i,168-148*row[k].value/max]);
    const x=42+4*end, y=168-148*current[k].value/max;
    points.push([x,y]);
    return <g key={metric.label}><polyline points={points.map(p=>p.join(",")).join(" ")} fill="none" stroke={palette[k]} strokeWidth="2.4"/><circle cx={x} cy={y} r="3.2" fill={palette[k]}/></g>;})}
    <text x="42" y="189">0</text><text x="444" y="189" textAnchor="end">{duration} {investigations[slug].clock}</text></>;
}

export default function InvestigationLab({slug}:{slug:InvestigationSlug}){
  const config:Investigation=investigations[slug];
  const [c,setControl]=useState(config.initial),[t,setTime]=useState(0),[running,setRunning]=useState(false);
  const finished=t>=config.duration;
  useEffect(()=>{
    if(!running||finished)return;
    let previous=performance.now(),id:number;
    const speed=slug==="pendulum-wave-designer"||slug==="projectile-target-simulator"?1:config.duration/15;
    function tick(now:number){const dt=Math.max(0,now-previous)/1000;previous=now;setTime(value=>Math.min(config.duration,value+dt*speed));id=requestAnimationFrame(tick);}
    id=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(id);
  },[running,finished,slug,config.duration]);
  function reset(value:number){setControl(value);setTime(0);setRunning(false);}
  const v=readings(slug,c,t),props={slug,c,t,v};
  const scene=config.subject==="physics"?<PhysicsView {...props}/>:config.subject==="geography"?<MapView {...props}/>:<EnvironmentView slug={slug} c={c} t={t} duration={config.duration}/>;
  return <PracticalWorkspace scene={<svg role="img" aria-label={config.title} viewBox="0 0 460 200">{scene}</svg>}>
    <h2>{config.question}</h2>
    <label>{config.control}{config.choices ? <select value={c} onChange={e=>slug==="population-growth-map" ? setControl(+e.target.value) : reset(+e.target.value)}>{config.choices.map((name,i)=><option key={name} value={i}>{name}</option>)}</select> :
      <>{c} {config.unit}<input type="range" min={config.min} max={config.max} value={c} onChange={e=>reset(+e.target.value)}/></>}</label>
    <div><button onClick={()=>{if(finished){setTime(0);setRunning(true);}else setRunning(!running);}}>{finished?"Replay":running?"Pause":"Run experiment"}</button> <button onClick={()=>reset(c)}>Restart</button></div>
    <label>{slug==="population-growth-map" ? 2000+Math.floor(t) : Number(t.toFixed(1))+" "+config.clock}<input aria-label="Experiment time" type="range" min="0" step=".01" max={config.duration} value={t} onChange={e=>{setRunning(false);setTime(+e.target.value);}}/></label>
    <div className="practicalReadings">{v.map((r,i)=><span key={r.label}><i style={{background:palette[i%3]}}/>{r.label} <b>{r.label==="Year" ? r.value : Number(r.value.toFixed(2)).toLocaleString("en-US")}</b> {r.unit}</span>)}</div>
    {slug==="population-growth-map" && <><p>Change since 2000 · Purple below 0% · Blue 0–10% · Green 10–30% · Amber 30% and above · Gray unavailable</p><small>Annual estimates from the <a href="https://data.worldbank.org/indicator/SP.POP.TOTL">World Bank population series</a>.</small></>}
    {slug==="country-border-simulator" && <small>Squares mark fictional capitals. Dots mark settlements. The dashed line divides their nearest-capital territories.</small>}
    {slug==="climate-zones-map" && <small>Amber exceeds 20°C. Green spans 5–20°C. Blue falls below 5°C in this latitude-only model.</small>}
    {config.subject==="geography" && <MapLegend/>}
  </PracticalWorkspace>;
}
