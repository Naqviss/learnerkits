"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SubjectDefinition, SimulationCard } from "@/lib/subjects/catalog";
import { ExpandedLabClient } from "@/components/simulation/ExpandedLabClient";
import type { LabClientCopy } from "@/lib/i18n/content";
import { runtimeMetricValue, runtimeText } from "@/lib/i18n/runtimeText";

type Props = { locale: string; subject: SubjectDefinition; simulation: SimulationCard; copy: LabClientCopy };
type Point = { x: number; y: number };

function Plot({ points, secondary, xLabel = "time", yLabel = "value", locale }: { points: Point[]; secondary?: Point[]; xLabel?: string; yLabel?: string; locale: string }) {
  const all = [...points, ...(secondary ?? [])];
  const xs = all.map((p) => p.x); const ys = all.map((p) => p.y);
  const minX = Math.min(...xs); const maxX = Math.max(...xs); const minY = Math.min(0, ...ys); const maxY = Math.max(...ys, 1);
  const sx = (x: number) => 46 + ((x - minX) / Math.max(1e-9, maxX - minX)) * 514;
  const sy = (y: number) => 270 - ((y - minY) / Math.max(1e-9, maxY - minY)) * 220;
  const path = (data: Point[]) => data.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ");
  const localizedX = runtimeText(locale, xLabel); const localizedY = runtimeText(locale, yLabel);
  return <svg className="labPlot" viewBox="0 0 600 310" role="img" aria-label={`${localizedY} / ${localizedX}`}>
    <path className="plotGrid" d="M46 50H560M46 105H560M46 160H560M46 215H560M46 270H560M46 50V270M174 50V270M303 50V270M431 50V270M560 50V270"/>
    <path className="plotAxis" d="M46 42V270H568"/><path className="plotLine" d={path(points)}/>{secondary && <path className="plotLine secondary" d={path(secondary)}/>}<text x="300" y="302">{localizedX}</text><text x="15" y="155" transform="rotate(-90 15 155)">{localizedY}</text>
  </svg>;
}

function Slider({ label, value, min, max, step, unit, onChange, locale }: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (value: number) => void; locale: string }) {
  return <label className="labControl"><span><b>{runtimeText(locale, label)}</b><output>{Number.isInteger(value) ? value : value.toFixed(2)}{unit ? ` ${unit}` : ""}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}/></label>;
}

function Metric({ label, value, locale }: { label: string; value: string; locale: string }) { return <div className="labMetric"><span>{runtimeText(locale, label)}</span><strong>{runtimeMetricValue(locale, value)}</strong></div>; }

function ProjectileLab({ locale }: { locale: string }) {
  const [speed, setSpeed] = useState(28); const [angle, setAngle] = useState(45); const [gravity, setGravity] = useState(9.81);
  const rad = angle * Math.PI / 180; const flight = 2 * speed * Math.sin(rad) / gravity; const range = speed * Math.cos(rad) * flight; const height = (speed * Math.sin(rad)) ** 2 / (2 * gravity);
  const points = useMemo(() => Array.from({ length: 61 }, (_, i) => { const t = flight * i / 60; return { x: speed * Math.cos(rad) * t, y: speed * Math.sin(rad) * t - .5 * gravity * t * t }; }), [speed, rad, gravity, flight]);
  return <><div className="labStage"><Plot locale={locale} points={points} xLabel="horizontal distance (m)" yLabel="height (m)"/></div><div className="labControls"><Slider locale={locale} label="Launch speed" value={speed} min={5} max={60} step={1} unit="m/s" onChange={setSpeed}/><Slider locale={locale} label="Launch angle" value={angle} min={5} max={85} step={1} unit="°" onChange={setAngle}/><Slider locale={locale} label="Gravity" value={gravity} min={1.6} max={15} step={.1} unit="m/s²" onChange={setGravity}/></div><div className="labMetrics"><Metric locale={locale} label="Range" value={`${range.toFixed(1)} m`}/><Metric locale={locale} label="Max height" value={`${height.toFixed(1)} m`}/><Metric locale={locale} label="Flight time" value={`${flight.toFixed(2)} s`}/></div><p className="labFormula">x = v cos(θ)t · y = v sin(θ)t − ½gt²</p></>;
}

function CircuitLab({ locale }: { locale: string }) {
  const [voltage, setVoltage] = useState(12); const [resistance, setResistance] = useState(8);
  const current = voltage / resistance; const power = voltage * current; const glow = Math.min(1, power / 40);
  return <><div className="labStage circuitStage"><svg viewBox="0 0 600 300" className="circuitSvg"><path d="M130 150H250M350 150H470M130 150V240H470V150"/><rect x="250" y="125" width="100" height="50" rx="8"/><circle cx="130" cy="150" r="30"/><path d="M118 140V160M142 135V165"/><circle className="bulbGlow" style={{ opacity: .18 + glow * .75 }} cx="470" cy="150" r="44"/><circle cx="470" cy="150" r="28"/><path d="M455 140Q470 125 485 140Q470 155 455 140"/><text x="285" y="157">R</text></svg></div><div className="labControls"><Slider locale={locale} label="Voltage" value={voltage} min={1} max={24} step={1} unit="V" onChange={setVoltage}/><Slider locale={locale} label="Resistance" value={resistance} min={1} max={40} step={1} unit="Ω" onChange={setResistance}/></div><div className="labMetrics"><Metric locale={locale} label="Current" value={`${current.toFixed(2)} A`}/><Metric locale={locale} label="Power" value={`${power.toFixed(1)} W`}/><Metric locale={locale} label="Electron-flow proxy" value={`${Math.round(glow * 100)}%`}/></div><p className="labFormula">I = V/R · P = VI</p></>;
}

function SeismicLab({ locale }: { locale: string }) {
  const [distance, setDistance] = useState(500); const [pSpeed, setPSpeed] = useState(6); const [sSpeed, setSSpeed] = useState(3.5);
  const p = distance / pSpeed; const s = distance / sSpeed; const gap = s - p;
  const max = Math.max(s, 1);
  return <><div className="labStage seismicStage"><div className="earthSlice"><i className="quakePoint"/><i className="station"/><span className="wave pWave" style={{ width: `${Math.min(86, 18 + distance / 9)}%` }}/><span className="wave sWave" style={{ width: `${Math.min(82, 14 + distance / 10)}%` }}/></div><div className="arrivalTimeline"><div><b>{runtimeText(locale, "P-wave")}</b><span style={{ width: `${p / max * 100}%` }}/><em>{p.toFixed(1)} s</em></div><div><b>{runtimeText(locale, "S-wave")}</b><span style={{ width: `${s / max * 100}%` }}/><em>{s.toFixed(1)} s</em></div></div></div><div className="labControls"><Slider locale={locale} label="Station distance" value={distance} min={50} max={1500} step={10} unit="km" onChange={setDistance}/><Slider locale={locale} label="P-wave speed" value={pSpeed} min={4} max={8} step={.1} unit="km/s" onChange={setPSpeed}/><Slider locale={locale} label="S-wave speed" value={sSpeed} min={2} max={5} step={.1} unit="km/s" onChange={setSSpeed}/></div><div className="labMetrics"><Metric locale={locale} label="P arrival" value={`${p.toFixed(1)} s`}/><Metric locale={locale} label="S arrival" value={`${s.toFixed(1)} s`}/><Metric locale={locale} label="Arrival gap" value={`${gap.toFixed(1)} s`}/></div><p className="labFormula">t = d / v</p></>;
}

function PlateLab({ locale }: { locale: string }) {
  const [velocity, setVelocity] = useState(35); const [millionYears, setMillionYears] = useState(2); const [mode, setMode] = useState<"convergent"|"divergent"|"transform">("convergent");
  const displacement = velocity * millionYears;
  const shift = Math.min(90, 15 + displacement / 4);
  return <><div className={`labStage plateStage plate-${mode}`}><div className="plate plateLeft" style={{ transform: mode === "divergent" ? `translateX(-${shift/3}px)` : mode === "transform" ? `translateY(-${shift/4}px)` : `translateX(${shift/4}px)` }}/><div className="plate plateRight" style={{ transform: mode === "divergent" ? `translateX(${shift/3}px)` : mode === "transform" ? `translateY(${shift/4}px)` : `translateX(-${shift/4}px)` }}/><i className="boundary"/><strong>{runtimeText(locale, mode === "convergent" ? "Convergent" : mode === "divergent" ? "Divergent" : "Transform")}</strong></div><div className="labControls"><Slider locale={locale} label="Plate speed" value={velocity} min={5} max={100} step={1} unit="mm/yr" onChange={setVelocity}/><Slider locale={locale} label="Time" value={millionYears} min={.1} max={10} step={.1} unit="million yr" onChange={setMillionYears}/><label className="labControl"><span><b>{runtimeText(locale, "Boundary type")}</b></span><select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}><option value="convergent">{runtimeText(locale, "Convergent")}</option><option value="divergent">{runtimeText(locale, "Divergent")}</option><option value="transform">{runtimeText(locale, "Transform")}</option></select></label></div><div className="labMetrics"><Metric locale={locale} label="Relative displacement" value={`${displacement.toFixed(1)} km`}/><Metric locale={locale} label="Boundary" value={mode === "convergent" ? "Convergent" : mode === "divergent" ? "Divergent" : "Transform"}/><Metric locale={locale} label="Scale" value="geologic time"/></div><p className="labFormula">1 mm/yr × 1 Myr = 1 km</p></>;
}

function PopulationLab({ locale }: { locale: string }) {
  const [initial, setInitial] = useState(60); const [rate, setRate] = useState(.35); const [capacity, setCapacity] = useState(500);
  const points = useMemo(() => Array.from({ length: 81 }, (_, i) => { const t = i * .25; const n = capacity / (1 + ((capacity - initial) / initial) * Math.exp(-rate * t)); return { x: t, y: n }; }), [initial, rate, capacity]);
  const final = points.at(-1)?.y ?? initial;
  return <><div className="labStage"><Plot locale={locale} points={points} xLabel="time" yLabel="population"/></div><div className="labControls"><Slider locale={locale} label="Initial population" value={initial} min={10} max={250} step={5} onChange={setInitial}/><Slider locale={locale} label="Growth rate" value={rate} min={.05} max={1} step={.05} onChange={setRate}/><Slider locale={locale} label="Carrying capacity" value={capacity} min={100} max={1000} step={25} onChange={setCapacity}/></div><div className="labMetrics"><Metric locale={locale} label="Population at t=20" value={final.toFixed(0)}/><Metric locale={locale} label="Carrying capacity" value={capacity.toFixed(0)}/><Metric locale={locale} label="Growth model" value="Logistic"/></div><p className="labFormula">N(t) = K / [1 + ((K−N₀)/N₀)e^(−rt)]</p></>;
}

function PredatorPreyLab({ locale }: { locale: string }) {
  const [preyGrowth, setPreyGrowth] = useState(.9); const [predatorLoss, setPredatorLoss] = useState(.7); const [interaction, setInteraction] = useState(.025);
  const data = useMemo(() => { let prey=40,pred=12; const a:Point[]=[]; const b:Point[]=[]; const dt=.03; for(let i=0;i<400;i++){const t=i*dt; a.push({x:t,y:prey});b.push({x:t,y:pred}); const dp=preyGrowth*prey-interaction*prey*pred; const dr=.012*prey*pred-predatorLoss*pred; prey=Math.max(.01,prey+dp*dt);pred=Math.max(.01,pred+dr*dt);} return {a,b}; }, [preyGrowth,predatorLoss,interaction]);
  return <><div className="labStage"><Plot locale={locale} points={data.a} secondary={data.b} xLabel="time" yLabel="population"/><div className="plotLegend"><span>{runtimeText(locale, "Prey")}</span><span>{runtimeText(locale, "Predators")}</span></div></div><div className="labControls"><Slider locale={locale} label="Prey growth" value={preyGrowth} min={.2} max={1.5} step={.05} onChange={setPreyGrowth}/><Slider locale={locale} label="Predator loss" value={predatorLoss} min={.2} max={1.2} step={.05} onChange={setPredatorLoss}/><Slider locale={locale} label="Interaction strength" value={interaction} min={.01} max={.05} step={.0025} onChange={setInteraction}/></div><div className="labMetrics"><Metric locale={locale} label="Model" value="Lotka–Volterra"/><Metric locale={locale} label="Prey start" value="40"/><Metric locale={locale} label="Predator start" value="12"/></div><p className="labFormula">dN/dt = αN − βNP · dP/dt = δNP − γP</p></>;
}

function GasLawLab({ locale }: { locale: string }) {
  const [moles, setMoles] = useState(1); const [temperature, setTemperature] = useState(300); const [volume, setVolume] = useState(24);
  const pressure = moles * 8.314 * temperature / volume;
  const density = moles / volume;
  const particles = Math.round(18 + Math.min(58, pressure / 8));
  return <><div className="labStage gasStage"><div className="gasContainer" style={{ height: `${Math.max(42, Math.min(88, volume / 40 * 100))}%` }}>{Array.from({length:particles},(_,i)=><i key={i} style={{left:`${8+(i*37)%84}%`,top:`${8+(i*53)%80}%`,transform:`scale(${.7+((i*17)%7)/10})`}}/> )}</div><div className="thermoBar"><span style={{width:`${(temperature-150)/(650-150)*100}%`}}/></div></div><div className="labControls"><Slider locale={locale} label="Amount" value={moles} min={.25} max={3} step={.25} unit="mol" onChange={setMoles}/><Slider locale={locale} label="Temperature" value={temperature} min={150} max={650} step={10} unit="K" onChange={setTemperature}/><Slider locale={locale} label="Volume" value={volume} min={5} max={40} step={1} unit="L" onChange={setVolume}/></div><div className="labMetrics"><Metric locale={locale} label="Pressure" value={`${pressure.toFixed(1)} kPa`}/><Metric locale={locale} label="Molar density" value={`${density.toFixed(3)} mol/L`}/><Metric locale={locale} label="Temperature" value={`${temperature} K`}/></div><p className="labFormula">PV = nRT · R = 8.314 kPa·L/(mol·K)</p></>;
}

function ReactionRateLab({ locale }: { locale: string }) {
  const [temperatureC, setTemperatureC] = useState(40); const [activation, setActivation] = useState(55); const [initial, setInitial] = useState(1);
  const tempK = temperatureC + 273.15; const A = 1e7; const k = A * Math.exp(-(activation*1000)/(8.314*tempK)); const halfLife = Math.log(2)/k; const tMax = Math.min(7200, Math.max(.1, 5/k));
  const points = useMemo(() => Array.from({length:81},(_,i)=>{const t=tMax*i/80;return{x:t,y:initial*Math.exp(-k*t)}}),[tMax,initial,k]);
  const unit = tMax < 120 ? "s" : "s";
  return <><div className="labStage"><Plot locale={locale} points={points} xLabel={`time (${unit})`} yLabel="concentration"/></div><div className="labControls"><Slider locale={locale} label="Temperature" value={temperatureC} min={0} max={120} step={2} unit="°C" onChange={setTemperatureC}/><Slider locale={locale} label="Activation energy" value={activation} min={35} max={80} step={1} unit="kJ/mol" onChange={setActivation}/><Slider locale={locale} label="Initial concentration" value={initial} min={.25} max={2} step={.05} unit="mol/L" onChange={setInitial}/></div><div className="labMetrics"><Metric locale={locale} label="Rate constant k" value={`${k.toExponential(2)} s⁻¹`}/><Metric locale={locale} label="Half-life" value={`${halfLife < 60 ? halfLife.toFixed(1)+" s" : (halfLife/60).toFixed(1)+" min"}`}/><Metric locale={locale} label="Model" value="First-order"/></div><p className="labFormula">k = Ae^(−Eₐ/RT) · [A]ₜ = [A]₀e^(−kt)</p></>;
}

function VectorLab({ locale }: { locale: string }) {
  const [magA, setMagA] = useState(7); const [angleA, setAngleA] = useState(25); const [magB, setMagB] = useState(5); const [angleB, setAngleB] = useState(120);
  const vec=(m:number,a:number)=>({x:m*Math.cos(a*Math.PI/180),y:m*Math.sin(a*Math.PI/180)}); const a=vec(magA,angleA),b=vec(magB,angleB),r={x:a.x+b.x,y:a.y+b.y}; const rm=Math.hypot(r.x,r.y); const ra=Math.atan2(r.y,r.x)*180/Math.PI;
  const scale=24, ox=300,oy=170; const line=(v:{x:number;y:number},cls:string)=><line className={cls} x1={ox} y1={oy} x2={ox+v.x*scale} y2={oy-v.y*scale}/>;
  return <><div className="labStage vectorStage"><svg viewBox="0 0 600 330" className="vectorSvg"><path className="plotGrid" d="M60 50H540M60 110H540M60 170H540M60 230H540M60 290H540M60 50V290M120 50V290M180 50V290M240 50V290M300 50V290M360 50V290M420 50V290M480 50V290M540 50V290"/><path className="plotAxis" d="M50 170H550M300 40V300"/>{line(a,"vectorA")}{line(b,"vectorB")}{line(r,"vectorR")}<circle cx={ox} cy={oy} r="5"/></svg><div className="plotLegend"><span>{runtimeText(locale, "Vector A")}</span><span>{runtimeText(locale, "Vector B")}</span><span>{runtimeText(locale, "Resultant")}</span></div></div><div className="labControls"><Slider locale={locale} label="A magnitude" value={magA} min={1} max={10} step={.5} onChange={setMagA}/><Slider locale={locale} label="A angle" value={angleA} min={0} max={360} step={5} unit="°" onChange={setAngleA}/><Slider locale={locale} label="B magnitude" value={magB} min={1} max={10} step={.5} onChange={setMagB}/><Slider locale={locale} label="B angle" value={angleB} min={0} max={360} step={5} unit="°" onChange={setAngleB}/></div><div className="labMetrics"><Metric locale={locale} label="Resultant magnitude" value={rm.toFixed(2)}/><Metric locale={locale} label="Resultant angle" value={`${((ra+360)%360).toFixed(1)}°`}/><Metric locale={locale} label="Components" value={`(${r.x.toFixed(1)}, ${r.y.toFixed(1)})`}/></div><p className="labFormula">R⃗ = A⃗ + B⃗ · |R⃗| = √(Rₓ² + Rᵧ²)</p></>;
}

function FunctionExplorer({ locale }: { locale: string }) {
  const [a,setA]=useState(1); const [b,setB]=useState(0); const [c,setC]=useState(-4);
  const points=useMemo(()=>Array.from({length:121},(_,i)=>{const x=-6+i*.1;return{x,y:a*x*x+b*x+c}}),[a,b,c]);
  const disc=b*b-4*a*c; const vertexX=-b/(2*a); const vertexY=a*vertexX*vertexX+b*vertexX+c;
  const roots=disc>=0?`${((-b+Math.sqrt(disc))/(2*a)).toFixed(2)}, ${((-b-Math.sqrt(disc))/(2*a)).toFixed(2)}`:runtimeText(locale, "no real roots");
  return <><div className="labStage"><Plot locale={locale} points={points} xLabel="x" yLabel="f(x)"/></div><div className="labControls"><Slider locale={locale} label="a" value={a} min={-3} max={3} step={.25} onChange={(v)=>setA(Math.abs(v)<.1?.25:v)}/><Slider locale={locale} label="b" value={b} min={-8} max={8} step={.5} onChange={setB}/><Slider locale={locale} label="c" value={c} min={-10} max={10} step={.5} onChange={setC}/></div><div className="labMetrics"><Metric locale={locale} label="Vertex" value={`(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`}/><Metric locale={locale} label="Discriminant" value={disc.toFixed(2)}/><Metric locale={locale} label="Roots" value={roots}/></div><p className="labFormula">f(x) = ax² + bx + c</p></>;
}

const labs: Record<string, React.ComponentType<{ locale: string }>> = {
  "projectile-lab": ProjectileLab,
  "circuit-builder": CircuitLab,
  "seismic-wave-lab": SeismicLab,
  "plate-motion-lab": PlateLab,
  "population-growth": PopulationLab,
  "predator-prey": PredatorPreyLab,
  "gas-law-lab": GasLawLab,
  "reaction-rate-lab": ReactionRateLab,
  "vector-lab": VectorLab,
  "function-explorer": FunctionExplorer,
};

export function ConceptLabClient({ locale, subject, simulation, copy }: Props) {
  const Lab = labs[simulation.slug];
  const badge = simulation.visualMode === "3d" ? copy.lab.interactive3d : simulation.visualMode === "game" ? copy.lab.challenge : copy.lab.interactiveModel;
  return <main className={`conceptLab subject-${subject.slug}`}>
    <section className="container labHeader"><div><Link className="backLink" href={`/${locale}/subjects/${subject.slug}`}>← {subject.eyebrow}</Link><div className="eyebrow">{simulation.kind || badge}</div><h1>{simulation.title}</h1>{simulation.concepts && <p>{simulation.concepts}</p>}<div className="labHeaderOutcome"><span>{copy.lab.learningOutcome}</span><strong>{simulation.outcome}</strong></div></div><div className="labBadge">{badge}</div></section>
    <section className="container labWorkspace"><div className="labCanvas">{Lab ? <Lab locale={locale}/> : <ExpandedLabClient locale={locale} copy={copy} subject={subject.slug} simulation={simulation}/>}</div><aside className="labExplain"><span className="eyebrow">{copy.lab.scientificMethod}</span><h2>{copy.lab.methodTitle}</h2><p>{copy.lab.methodBody}</p><div className="labRule"><b>{copy.lab.predict}</b><span>{copy.lab.predictBody}</span></div><div className="labRule"><b>{copy.lab.observe}</b><span>{copy.lab.observeBody}</span></div><div className="labRule"><b>{copy.lab.explain}</b><span>{copy.lab.explainBody}</span></div>{locale === "en" && simulation.seoTarget && <div className="labSeoNote"><span>{copy.lab.topic}</span><strong>{simulation.seoTarget}</strong></div>}</aside></section>
  </main>;
}
