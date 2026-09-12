"use client";

import { useId, type ReactNode } from "react";
import { phColor, rateConstant, solutionPH, titrationPH, yieldResult, type Values } from "@/lib/simulations/chemistry/model";

export function Chart({ points, xMax, yMax, xLabel, yLabel, marker, secondary }: { points: [number, number][]; xMax: number; yMax: number; xLabel: string; yLabel: string; marker?: [number, number]; secondary?: [number, number][] }) {
  const x = (v:number)=>52+v/xMax*490, y=(v:number)=>218-v/yMax*180;
  const line=(p:[number,number][])=>p.map(([a,b],i)=>`${i?"L":"M"}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(" ");
  return <svg className="chemChart" viewBox="0 0 580 265" role="img" aria-label={`${yLabel} versus ${xLabel}`}>
    {[0,1,2,3,4].map(i=><g key={i}><path d={`M52 ${y(i*yMax/4)} H542`} stroke="#284353" strokeDasharray="3 5"/><text x="42" y={y(i*yMax/4)+4} textAnchor="end">{Number((i*yMax/4).toFixed(2))}</text><text x={x(i*xMax/4)} y="235" textAnchor="middle">{Number((i*xMax/4).toFixed(1))}</text></g>)}
    <path d="M52 30V218H548" fill="none" stroke="#537587"/><path d={line(points)} fill="none" stroke="#8bb5fb" strokeWidth="3"/>{secondary && <path d={line(secondary)} fill="none" stroke="#e7ae79" strokeWidth="2" strokeDasharray="5 4"/>}{marker && <circle cx={x(marker[0])} cy={y(marker[1])} r="6" fill="#fff" stroke="#8bb5fb" strokeWidth="3"/>}<text x="300" y="257" textAnchor="middle">{xLabel}</text><text x="16" y="135" transform="rotate(-90 16 135)" textAnchor="middle">{yLabel}</text>
  </svg>;
}

function Stage({ children, label }: { children: ReactNode; label: string }) {
  const id = useId().replace(/:/g, "");
  return <svg className="chemBenchSvg" viewBox="0 0 720 430" role="img" aria-label={label}>
    <defs><linearGradient id={`${id}-glass`} x1="0" x2="1"><stop stopColor="#e4ecff" stopOpacity=".24"/><stop offset=".2" stopColor="#b2c5df" stopOpacity=".04"/><stop offset=".8" stopColor="#b2c5df" stopOpacity=".09"/><stop offset="1" stopColor="#f0f4ff" stopOpacity=".3"/></linearGradient><linearGradient id={`${id}-steel`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#77818f"/><stop offset=".45" stopColor="#485260"/><stop offset="1" stopColor="#29313d"/></linearGradient></defs>
    <path d="M0 368H720V430H0Z" fill="#20252e"/><path d="M0 369H720" stroke="#404a59"/><ellipse cx="365" cy="371" rx="235" ry="18" fill="#14181f" opacity=".6"/>
    <g style={{ "--glass": `url(#${id}-glass)`, "--steel": `url(#${id}-steel)` } as React.CSSProperties}>{children}</g>
  </svg>;
}

function Readout({ x, y, label, value, color = "#bfd5ff" }: { x:number; y:number; label:string; value:string; color?:string }) {
  return <g transform={`translate(${x} ${y})`}><rect width="163" height="78" rx="9" fill="#202630" stroke="#4a5a72"/><text x="14" y="23" fill="#92adbd" fontSize="10" letterSpacing="1">{label}</text><text x="14" y="53" fill={color} fontFamily="monospace" fontSize="23">{value}</text></g>;
}

function Beaker({ color, crystals = 0 }: { color: string; crystals?:number }) {
  return <g><path d="M235 170V335Q235 352 253 352H437Q455 352 455 335V170" fill="var(--glass)" stroke="#a8cfdd" strokeWidth="2"/><path d="M238 235Q345 249 452 235V335Q452 349 437 349H253Q238 349 238 335Z" fill={color} opacity=".35"/><ellipse cx="345" cy="236" rx="106" ry="9" fill={color} opacity=".35"/><path d="M230 169H460M245 178V323" stroke="#d4f6ff" strokeWidth="3" opacity=".65"/>{[0,1,2,3,4].map(i=><g key={i}><path d={`M423 ${205+i*27}H441`} stroke="#b6d2dd" opacity=".7"/><text x="416" y={208+i*27} textAnchor="end" fill="#b6d2dd" fontSize="9">{100-i*20}</text></g>)}{Array.from({length:Math.min(35,Math.ceil(crystals))},(_,i)=><path key={i} d="M-5 0L0 -8L5 0L0 5Z" transform={`translate(${257+i%15*12} ${338-Math.floor(i/15)*9})`} fill="#d5e8f2" stroke="#85b2c9"/>)}</g>;
}

export function BenchScene({ slug, values: v, time, added, reacted }: { slug: string; values: Values; time: number; added: number; reacted: boolean }) {
  if (slug === "gas-law-lab") {
    const pressure = v.moles*8.314*v.temperature/v.volume;
    const top = 310 - v.volume/40*235;
    return <Stage label="Gas chamber with a movable piston and pressure gauge">
      <rect x="186" y="52" width="268" height="303" rx="12" fill="var(--glass)" stroke="#94bfce" strokeWidth="2"/>
      <rect x="308" y="22" width="24" height={top-9} fill="var(--steel)" stroke="#6f8b9b"/>
      <rect x="190" y={top} width="260" height="16" rx="3" fill="var(--steel)" stroke="#91b5c5"/>
      {Array.from({length:Math.round(v.moles*28)},(_,i)=>{ const speed=Math.sqrt(v.temperature/300), bounce=(n:number)=>Math.abs(((n%2)+2)%2-1); return <circle key={i} cx={204+bounce(i*.618+time*.13*speed)*232} cy={top+28+bounce(i*.381+time*.11*speed)*(322-top-28)} r="4.5" fill="#a0c3ff"/>; })}
      <path d="M454 248H510V178" fill="none" stroke="#6b8c9d" strokeWidth="7"/><circle cx="510" cy="128" r="50" fill="#142c3b" stroke="#6d94a9" strokeWidth="6"/><path d="M472 147A43 43 0 0 1 548 147" fill="none" stroke="#a1c4ce" strokeWidth="3"/><line x1="510" y1="128" x2={510+34*Math.sin(-1.2+Math.min(pressure,600)/600*2.4)} y2={128-34*Math.cos(-1.2+Math.min(pressure,600)/600*2.4)} stroke="#efbd7d" strokeWidth="3"/><circle cx="510" cy="128" r="5" fill="#edf5fa"/><text x="510" y="157" textAnchor="middle" fill="#8babbc" fontSize="10">kPa</text>
      <Readout x={492} y={261} label="PRESSURE" value={`${pressure.toFixed(1)} kPa`}/><text x="320" y="389" textAnchor="middle" fill="#91b9c9" fontSize="12">SEALED IDEAL GAS · VARIABLE VOLUME</text>
    </Stage>;
  }
  if (slug === "reaction-rate-lab") {
    const fraction=1-Math.exp(-rateConstant(v)*time);
    return <Stage label="Reaction vessel converting reactant A to product B">
      <rect x="225" y="343" width="245" height="27" rx="6" fill="var(--steel)"/><Beaker color="#9fbbea"/>
      {Array.from({length:40},(_,i)=><circle key={i} cx={260+(Math.sin(i*2.4+time*.4)+1)*82} cy={256+(Math.cos(i*3.8+time*.6)+1)*36} r="5" fill={i/40<fraction?"#eab07c":"#8bb5fb"}/>)}
      <path d="M344 73V319" stroke="#b4cddd" strokeWidth="5"/><path d="M326 317H362" stroke="#b4cddd" strokeWidth="5"/>
      <Readout x={491} y={103} label="CONVERSION" value={`${(fraction*100).toFixed(1)} %`}/><Readout x={491} y={195} label="ELAPSED" value={`${time.toFixed(1)} s`}/>
      <text x="345" y="396" textAnchor="middle" fill="#a5c4d2" fontSize="12">A (BLUE) → B (AMBER) · FIRST-ORDER REACTION</text>
    </Stage>;
  }
  if (slug === "chemical-bonding") {
    const ionic=v.pair===0, polar=v.pair===2;
    const symbols=ionic?["Na⁺","Cl⁻"]:polar?["H δ+","Cl δ−"]:["H","H"];
    return <Stage label={`${symbols.join(" and ")} electron sharing or transfer`}>
      <ellipse cx="360" cy="205" rx="146" ry="60" fill={ionic?"none":"#8faee5"} opacity=".13"/>
      {[245,475].map((x,i)=><g key={x}><circle cx={x} cy="205" r={i===0?58:74} fill={i===0?"#263c50":"#304c78"} stroke={i===0?"#94b5d3":"#88adea"} strokeWidth="2"/><text x={x} y="213" textAnchor="middle" fill="#edfaff" fontSize="25">{symbols[i]}</text></g>)}
      {ionic ? <><path d="M307 116Q360 60 433 116" stroke="#c4a4f0" fill="none" strokeWidth="2"/><path d="M424 106L434 117L420 119" stroke="#c4a4f0" fill="none"/><circle cx={325+(time%3)/3*85} cy={95-Math.sin(time%3/3*Math.PI)*12} r="5" fill="#d8b1ff"/><text x="360" y="65" textAnchor="middle" fill="#d3b4f3">Electron transfer</text></> : <>{[-1,1].map(sign=><circle key={sign} cx={(polar?388:360)+sign*8} cy={205+Math.sin(time*2)*10} r="6" fill="#d8b1ff"/>)}<text x="360" y="100" textAnchor="middle" fill="#d3b4f3">{polar?"Unequal sharing":"Equal sharing"}</text></>}
      <text x="360" y="324" textAnchor="middle" fill="#aecbd7" fontSize="14">{ionic?"Electrostatic attraction between opposite ions":polar?"Electron density shifts toward chlorine":"A shared electron pair holds the atoms together"}</text>
    </Stage>;
  }
  if (slug === "limiting-reagent") {
    const result=yieldResult(v.hydrogen,v.oxygen);
    return <Stage label="Molecular inventory before and after a stoichiometric reaction">
      {[{x:70,name:"H₂",n:reacted?result.hydrogen:v.hydrogen,color:"#d2e7ef"},{x:290,name:"O₂",n:reacted?result.oxygen:v.oxygen,color:"#e7818b"},{x:510,name:"H₂O",n:reacted?result.water:0,color:"#9abbf0"}].map(b=><g key={b.name}><rect x={b.x} y="108" width="150" height="215" rx="12" fill="var(--glass)" stroke="#567e93"/><text x={b.x+75} y="82" textAnchor="middle" fill="#d2e8f2" fontSize="23">{b.name}</text>{Array.from({length:b.n},(_,i)=><g key={i} transform={`translate(${b.x+30+(i%3)*44} ${296-Math.floor(i/3)*43})`}><circle r="10" fill={b.color}/><circle cx="14" r={b.name==="H₂O"?6:10} fill={b.name==="H₂O"?"#e4f0f6":b.color}/>{b.name==="H₂O"&&<circle cx="-9" cy="9" r="6" fill="#e4f0f6"/>}</g>)}<text x={b.x+75} y="352" textAnchor="middle" fill={b.color} fontSize="18">{b.n} mol</text></g>)}
    </Stage>;
  }
  const titration=slug==="neutralization-station"||slug==="titration-simulator";
  const solubility=slug==="solubility-curve";
  const pH=titration?titrationPH(added,slug==="titration-simulator"?.12:.1):solubility?7:solutionPH(v);
  const crystal=solubility?Math.max(0,v.solute-(20+.8*v.temperature)):0;
  const color=solubility?"#70c7ea":phColor(pH);
  return <Stage label={titration?"Burette dispensing base into an acid sample":solubility?"Solubility beaker with dissolved solute and crystals":"pH probe in a solution with indicator"}>
    <Beaker color={color} crystals={crystal}/>
    {titration?<><path d="M160 55V355M125 358H203" stroke="#637f91" strokeWidth="8"/><path d="M161 87H336" stroke="#748d9e" strokeWidth="5"/><rect x="325" y="25" width="28" height="164" rx="3" fill="var(--glass)" stroke="#a3c8d8"/><rect x="329" y={35+added*2.7} width="20" height={Math.max(0,149-added*2.7)} fill="#9cd9ef" opacity=".5"/><path d="M339 189V215M325 193H352" stroke="#aad3de" strokeWidth="3"/>{Array.from({length:8},(_,i)=><path key={i} d={`M343 ${43+i*18}H352`} stroke="#afcedd"/>)}<Readout x={491} y={96} label="NaOH · 0.100 M" value={`${added.toFixed(2)} mL`}/></>:<><path d="M389 250V110Q390 70 490 75" fill="none" stroke="#7795a5" strokeWidth="6"/><rect x="381" y="195" width="16" height="65" rx="5" fill="#d5e9ec" opacity=".9"/></>}
    <Readout x={491} y={solubility?109:207} label={solubility?"DISSOLVED": "pH · 25 °C"} value={solubility?`${Math.min(v.solute,20+.8*v.temperature).toFixed(1)} g`:pH.toFixed(2)} color={color}/>
    {solubility&&<Readout x={491} y={203} label="CRYSTALS" value={`${crystal.toFixed(1)} g`} />}
    <text x="345" y="393" textAnchor="middle" fill="#9bb9c9" fontSize="12">{solubility?"100 g WATER · EQUILIBRIUM SOLUBILITY":titration?"25.00 mL HCl SAMPLE · 1:1 NEUTRALIZATION":"DILUTE AQUEOUS SOLUTION · INDICATOR VIEW"}</text>
  </Stage>;
}
