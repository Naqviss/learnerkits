"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";
import { runtimeText } from "@/lib/i18n/runtimeText";
import { loadSettings, prefersReducedMotion } from "@/lib/settings/storage";
import { activities, atomBalance, builderMolecules, clues, elementGroups, elementPeriod, elementSymbols, initialValues, molecules, phase, rateConstant, reactions, solutionPH, titrationPH, yieldResult, type Values } from "@/lib/simulations/chemistry/model";
import { BenchScene, Chart } from "./BenchScene";
import { MolecularScene, type Attachment } from "./MolecularScene";
import styles from "./chemistry.module.css";

const STORAGE = "learnerkits-chemistry-missions-v1";
const format = (v:number, digits=2) => v.toFixed(digits);

export function ChemistryActivitiesClient({ locale, subject, simulation }: { locale:string; subject:SubjectDefinition; simulation:SimulationCard }) {
  const activity = activities.find(a=>a.slug===simulation.slug)!;
  const slug = activity.slug;
  const tr = (text:string) => runtimeText(locale,text);
  const [values,setValues] = useState<Values>(()=>initialValues(activity));
  const [time,setTime] = useState(0);
  const [paused,setPaused] = useState(false);
  const [running,setRunning] = useState(false);
  const [added,setAdded] = useState(0);
  const [reacted,setReacted] = useState(false);
  const [attachments,setAttachments] = useState<Attachment[]>([]);
  const [coefficients,setCoefficients] = useState([1,1,1,1]);
  const [selected,setSelected] = useState(0);
  const [round,setRound] = useState(0);
  const [steps,setSteps] = useState<string[]>([]);
  const [completed,setCompleted] = useState<string[]>([]);
  const [feedback,setFeedback] = useState<{success:boolean;text:string}|null>(null);
  const [showHint,setShowHint] = useState(false);
  const [resetKey,setResetKey] = useState(0);
  const [saved,setSaved] = useState(true);
  const [reduced,setReduced] = useState(false);
  const animation=useRef({paused,running}); animation.current={paused,running};
  useEffect(()=>{
    try { const parsed:unknown=JSON.parse(localStorage.getItem(STORAGE)||"[]"); if(Array.isArray(parsed)) setCompleted(parsed.filter((s):s is string=>typeof s==="string"&&activities.some(a=>a.slug===s))); } catch { /* A fresh local notebook works without storage. */ }
    setReduced(prefersReducedMotion(loadSettings()));
  },[]);
  useEffect(()=>{
    let last=performance.now();
    const timer=window.setInterval(()=>{
      const now=performance.now(), dt=Math.min(.1,(now-last)/1000); last=now;
      if(document.hidden||animation.current.paused) return;
      if(slug==="reaction-rate-lab") { if(animation.current.running) setTime(t=>Math.min(20,t+dt)); }
      else if(!reduced) setTime(t=>t+dt);
    },50);
    return()=>clearInterval(timer);
  },[slug,reduced]);
  useEffect(()=>{if(slug==="reaction-rate-lab"&&time>=20) setRunning(false);},[time,slug]);

  function update(key:string,value:number) {
    setValues(v=>({...v,[key]:value})); setFeedback(null);
    if(key==="target") setAttachments([]);
    if(key==="reaction") setCoefficients([1,1,1,1]);
    if(slug==="limiting-reagent") setReacted(false);
    if(slug==="reaction-rate-lab") setTime(0);
  }
  function reset() {
    setValues(initialValues(activity)); setTime(0); setAdded(0); setPaused(false); setRunning(false); setReacted(false); setAttachments([]); setCoefficients([1,1,1,1]); setSelected(0); setRound(0); setSteps([]); setFeedback(null); setResetKey(k=>k+1);
  }
  function complete() {
    const next=[...new Set([...completed,slug])]; setCompleted(next);
    try { localStorage.setItem(STORAGE,JSON.stringify(next)); setSaved(true); } catch { setSaved(false); }
  }
  function check() {
    let ok=false, detail="", step="", required=1;
    switch(slug) {
      case "gas-law-lab": { const p=values.moles*8.314*values.temperature/values.volume; ok=Math.abs(p-150)<=3; detail=`Pressure is ${format(p,1)} kPa; target 147–153 kPa. ${p<147?"Decrease volume or increase temperature.":p>153?"Increase volume or decrease temperature.":"You balanced amount, volume, and temperature."}`; break; }
      case "reaction-rate-lab": { const conversion=1-Math.exp(-rateConstant(values)*time); ok=time>0&&time<=20&&conversion>=.8; detail=`${format(conversion*100,1)}% converted at ${format(time,1)} s. ${ok?"Your reaction meets the time limit.":"Run the reactor with warmer conditions or a catalyst to reach 80% by 20 s."}`; break; }
      case "molecular-geometry-3d": ok=values.molecule===4&&values.answer===5; detail=ok?"Water has two bonds and two lone pairs: its molecular shape is bent, about 104.5°.":"Find a molecule with two lone pairs, then identify the shape made by its atoms."; break;
      case "molecule-builder-3d": { const m=molecules[builderMolecules[values.target]]; ok=attachments.length===m.count&&attachments.every(a=>a.atom===m.outer&&a.order===m.order); detail=ok?`${m.formula} is complete. Every atom has the correct common valence.`:`${m.formula} needs ${m.count} ${m.outer} atoms, each attached by a ${m.order===2?"double":"single"} bond. Your central atom currently has bond-order sum ${attachments.reduce((s,a)=>s+a.order,0)}.`; break; }
      case "chemical-bonding": ok=values.answer===values.pair+1; step=String(values.pair); required=3; detail=ok?["NaCl forms oppositely charged ions in a lattice.","Identical H atoms share electrons equally.","Chlorine attracts the shared pair more strongly than hydrogen."][values.pair]:"Look at whether the electron is transferred or shared, and whether the atoms attract it equally."; break;
      case "acid-base-ph": {const p=solutionPH(values); ok=values.solution===0&&Math.abs(p-3)<=.1; detail=ok?"A 0.001 M strong acid is approximately pH 3 at 25 °C.":`Measured pH ${format(p)}. Select HCl and adjust concentration toward 0.001 mol/L.`;break;}
      case "neutralization-station": {const p=titrationPH(added);ok=p>=6&&p<=8;detail=ok?"Equal moles of H⁺ and OH⁻ reacted. You reached the neutral endpoint.":`${format(added)} mL added; pH ${format(p)}. ${added>25?"You overshot. Reset for a fresh sample.":"Add base in smaller portions as you approach the endpoint."}`;break;}
      case "titration-simulator": {const p=titrationPH(added,.12);ok=p>=6&&p<=8&&Math.abs(values.estimate-.12)<=.002;detail=ok?"At 30.00 mL, the sample is neutral: 0.100 × 30.00 / 25.00 = 0.120 M HCl.":p>8?"The endpoint has been passed. Reset the sample and add smaller portions near the pH jump.":p<6?"Continue dispensing toward neutral pH, then calculate the acid concentration from the base volume.":"Endpoint reached. Use 0.100 × added volume / 25.00 to calculate the unknown concentration.";break;}
      case "states-of-matter-3d": {const p=phase(values.temperature);ok=values.temperature!==0&&values.temperature!==100;step=p;required=3;detail=ok?`${p} observed. ${p==="Solid"?"Particles vibrate around fixed positions.":p==="Liquid"?"Particles remain close but rearrange.":"Particles move throughout the chamber."}`:"At a phase boundary two phases can coexist. Move away from exactly 0 or 100 °C to record a single phase.";break;}
      case "solubility-curve": {const crystals=Math.max(0,values.solute-20-.8*values.temperature);ok=values.solute===80&&crystals>=15&&crystals<=25;detail=`${format(crystals,1)} g crystals remain. ${ok?"Cooling lowered the solubility capacity.":"Set added solute to 80 g, then adjust temperature to leave 15–25 g undissolved."}`;break;}
      case "limiting-reagent": {const y=yieldResult(values.hydrogen,values.oxygen);ok=reacted&&y.water===6&&y.hydrogen===0&&y.oxygen===0;detail=reacted?`${y.water} mol water; ${y.hydrogen} mol H₂ and ${y.oxygen} mol O₂ left. ${ok?"Exact stoichiometric quantities—nothing left over.":"Aim for 6 mol H₂ and 3 mol O₂, then react."}`:"Choose the amounts, then press React mixture to test your recipe.";break;}
      case "balance-equation": {const r=reactions[values.reaction];ok=r.solution.every((c,i)=>c===coefficients[i]);step=String(values.reaction);required=3;const atoms=atomBalance(values.reaction,coefficients); detail=ok?"Both sides contain the same number of every atom, in the lowest whole-number ratio.":atoms.every(a=>a.left===a.right)?"Atom counts match. Reduce all coefficients to their smallest whole-number ratio.":atoms.filter(a=>a.left!==a.right).map(a=>`${a.element}: ${a.left} left, ${a.right} right`).join(" · ");break;}
      case "periodic-table-hunt": ok=selected===clues[round].z;step=String(round);required=3;detail=ok?`${elementSymbols[selected-1]} is in group ${elementGroups[selected-1]}, period ${elementPeriod(selected)}. Clue solved.`:selected?`${elementSymbols[selected-1]} is group ${elementGroups[selected-1]}, period ${elementPeriod(selected)}. Compare with the clue.`:"Select an element tile before checking.";break;
    }
    if(ok) {const next=[...new Set([...steps,step||"done"])];setSteps(next);if(next.length>=required) complete();else detail+=` ${next.length}/${required} recorded. Try the next ${slug==="states-of-matter-3d"?"phase":slug==="balance-equation"?"reaction":slug==="chemical-bonding"?"pair":"clue"}.`;}
    setFeedback({success:ok,text:detail});
  }

  const titration=slug==="titration-simulator"||slug==="neutralization-station";
  const builder=slug==="molecule-builder-3d";
  const molecular=builder||slug==="molecular-geometry-3d";
  const molecule=molecules[builder?builderMolecules[values.target]:values.molecule??0];
  const reaction=reactions[values.reaction??0];
  const y=slug==="limiting-reagent"?yieldResult(values.hydrogen,values.oxygen):null;
  const index=activities.findIndex(a=>a.slug===slug);
  const currentDone=completed.includes(slug);
  const metrics: [string,string][] = slug==="gas-law-lab"?[["Pressure",`${format(values.moles*8.314*values.temperature/values.volume,1)} kPa`],["Volume",`${format(values.volume,1)} L`],["Temperature",`${values.temperature} K`]]
    :slug==="reaction-rate-lab"?[["Conversion",`${format((1-Math.exp(-rateConstant(values)*time))*100,1)}%`],["Rate constant",`${format(rateConstant(values),3)} s⁻¹`],["Half-life",`${format(Math.LN2/rateConstant(values),1)} s`]]
    :molecular?[["Molecule",molecule.formula],[builder?"Attached atoms":"Shape",builder?`${attachments.length} / ${molecule.count}`:molecule.shape],[builder?"Bond-order sum":"Bond angle",builder?String(attachments.reduce((s,a)=>s+a.order,0)):`${molecule.angle}°`]]
    :slug==="chemical-bonding"?[["Pair",["NaCl","H₂","HCl"][values.pair]],["Electron behavior",["Transfer","Equal sharing","Unequal sharing"][values.pair]],["Pairs solved",`${steps.length}/3`]]
    :titration?[["pH",format(titrationPH(added,slug==="titration-simulator"?.12:.1))],["Base added",`${format(added)} mL`],["Base amount",`${format(added*.1,3)} mmol`]]
    :slug==="acid-base-ph"?[["pH",format(solutionPH(values))],["Concentration",`${(10**values.logC).toExponential(2)} M`],["[H⁺]",`${(10**-solutionPH(values)).toExponential(2)} M`]]
    :slug==="states-of-matter-3d"?[["Phase",phase(values.temperature)],["Temperature",`${values.temperature} °C`],["Pressure","1 atm"]]
    :slug==="solubility-curve"?[["Capacity",`${format(20+.8*values.temperature,1)} g`],["Dissolved",`${format(Math.min(values.solute,20+.8*values.temperature),1)} g`],["Crystals",`${format(Math.max(0,values.solute-20-.8*values.temperature),1)} g`]]
    :y?[["Water yield",`${reacted?y.water:0} mol`],["Limiting reagent",values.hydrogen===2*values.oxygen?"Exact ratio":values.hydrogen<2*values.oxygen?"H₂":"O₂"],["Leftover after reaction",reacted?`${y.hydrogen} H₂ / ${y.oxygen} O₂ mol`:"Not reacted"]]
    :slug==="balance-equation"?atomBalance(values.reaction,coefficients).map(a=>[`${a.element} atoms`,`${a.left} left / ${a.right} right`] as [string,string])
    :[["Selected",selected?elementSymbols[selected-1]:"—"],["Atomic number",selected?String(selected):"—"],["Clues solved",`${steps.length}/3`]];

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.back} href={`/${locale}/subjects/chemistry`}>← {subject.eyebrow}</Link><div className={styles.eyebrow}>INTERACTIVE LABORATORY / {String(index+1).padStart(2,"0")}</div><h1>{simulation.title}</h1><p>{simulation.outcome}</p></div><div className={styles.notebook}><span>YOUR LAB NOTEBOOK</span><strong>{completed.length}<small> / {activities.length}</small></strong><span>missions completed on this device</span></div></header>
    <div className={styles.workspace}>
      <section className={styles.scenePanel} aria-label={simulation.title}>
        <div className={styles.sceneTop}><span><i/> {activity.instrument}</span><button onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?"▶ Resume":"Ⅱ Pause"}</button></div>
        <div className={styles.stage}>
          {molecular?<MolecularScene molecule={builder?builderMolecules[values.target]:values.molecule} attachments={builder?attachments:undefined} paused={paused} resetKey={resetKey}/>
          :slug==="states-of-matter-3d"?<MolecularScene matter temperature={values.temperature} paused={paused} resetKey={resetKey}/>
          :slug==="periodic-table-hunt"?<div className={styles.periodicStage}><p className={styles.clue}>CLUE {round+1} / 3 <strong>{clues[round].text}</strong></p><div className={styles.tableScroll}><div className={styles.periodicGrid}>{Array.from({length:18},(_,i)=><span className={styles.groupLabel} key={`g${i}`} style={{gridColumn:i+1,gridRow:1}}>{i+1}</span>)}{elementSymbols.map((symbol,i)=><button key={symbol} className={`${styles.element} ${[1,2].includes(elementGroups[i])?styles.metal:elementGroups[i]===18?styles.noble:styles.other}`} style={{gridColumn:elementGroups[i],gridRow:elementPeriod(i+1)+1}} aria-pressed={selected===i+1} aria-label={`${symbol}, atomic number ${i+1}, group ${elementGroups[i]}, period ${elementPeriod(i+1)}`} onClick={()=>{setSelected(i+1);setFeedback(null);}}><small>{i+1}</small><b>{symbol}</b></button>)}</div></div><div className={styles.tableLegend}><span>Groups → · Periods ↓</span><span>First 36 elements · scroll sideways on mobile</span></div><div className={styles.clueActions}>{clues.map((_,i)=><button key={i} aria-pressed={round===i} onClick={()=>{setRound(i);setSelected(0);setFeedback(null);}}>Clue {i+1} {steps.includes(String(i))?"✓":""}</button>)}</div></div>
          :slug==="balance-equation"?<div className={styles.equationStage}><span className={styles.eyebrow}>CONSERVE EVERY ATOM</span><div className={styles.equation}>{reaction.formula.map((formula,i)=><div className={styles.reagent} key={`${values.reaction}-${i}`}><span className={styles.operator}>{i===0?"":i===reaction.split?"→":"+"}</span><div><strong>{formula}</strong><div className={styles.stepper}><button aria-label={`Decrease ${formula} coefficient`} disabled={coefficients[i]<=1} onClick={()=>{setCoefficients(c=>c.map((v,j)=>j===i?v-1:v));setFeedback(null);}}>−</button><output aria-label={`${formula} coefficient`}>{coefficients[i]}</output><button aria-label={`Increase ${formula} coefficient`} disabled={coefficients[i]>=8} onClick={()=>{setCoefficients(c=>c.map((v,j)=>j===i?v+1:v));setFeedback(null);}}>+</button></div></div></div>)}</div><div className={styles.atomLedger}>{atomBalance(values.reaction,coefficients).map(a=><div key={a.element}><b>{a.element}</b><span className={styles.atomBar} style={{width:`${a.left/32*100}%`}}/><span>{a.left}</span><span className={`${styles.atomBar} ${styles.productBar}`} style={{width:`${a.right/32*100}%`}}/><span>{a.right}</span><em>{a.left===a.right?"✓ Balanced":"Unequal"}</em></div>)}</div><p>Blue: reactant atoms · Amber: product atoms</p></div>
          :<BenchScene slug={slug} values={values} time={time} added={added} reacted={reacted}/>}
        </div>
        <div className={styles.metrics}>{metrics.map(([label,value])=><div key={label}><span>{tr(label)}</span><strong>{value}</strong></div>)}</div>
        {slug==="reaction-rate-lab"&&<div className={styles.chartPanel}><h3>Reaction progress <span>A → B</span></h3><Chart points={Array.from({length:81},(_,i)=>[i/4,values.concentration*Math.exp(-rateConstant(values)*i/4)])} secondary={Array.from({length:81},(_,i)=>[i/4,values.concentration*(1-Math.exp(-rateConstant(values)*i/4))])} xMax={20} yMax={values.concentration} xLabel="Time (s)" yLabel="Concentration (mol/L)" marker={[time,values.concentration*Math.exp(-rateConstant(values)*time)]}/><p>Blue: reactant A · Amber: product B · Curves predict the selected conditions.</p></div>}
        {titration&&<div className={styles.chartPanel}><h3>Your titration curve <span>pH PROBE</span></h3><Chart points={Array.from({length:Math.max(1,Math.ceil(added*20)+1)},(_,i)=>{const volume=Math.min(added,i*.05);return [volume,titrationPH(volume,slug==="titration-simulator"?.12:.1)];})} xMax={50} yMax={14} xLabel="NaOH added (mL)" yLabel="pH" marker={[added,titrationPH(added,slug==="titration-simulator"?.12:.1)]}/></div>}
        {slug==="solubility-curve"&&<div className={styles.chartPanel}><h3>Solubility curve <span>ILLUSTRATIVE SALT</span></h3><Chart points={[[0,20],[100,100]]} secondary={[[0,values.solute],[100,values.solute]]} marker={[values.temperature,20+.8*values.temperature]} xMax={100} yMax={120} xLabel="Temperature (°C)" yLabel="g per 100 g water"/><p>Blue: solubility capacity · Amber: total added solute. Above capacity, crystals remain.</p></div>}
        {molecular&&<div className={styles.legend}><span>● H · white</span><span>● O · red</span><span>● C · slate</span><span>● N · blue</span><span>● F · green</span><span>● B · tan</span>{!builder&&<span>◌ Purple · lone pairs</span>}</div>}
      </section>
      <aside className={styles.controlsPanel}>
        <div className={styles.mission}><div className={styles.missionLabel}><span>YOUR MISSION</span><b>{currentDone?"✓ COMPLETE":"IN PROGRESS"}</b></div><h2>{activity.mission}</h2><button className={styles.hintButton} aria-expanded={showHint} onClick={()=>setShowHint(v=>!v)}>{showHint?"Hide hint":"Need a hint?"}</button>{showHint&&<p>{activity.hint}</p>}</div>
        <div className={styles.controlTitle}><h2>Experiment controls</h2><button onClick={reset}>↺ Reset</button></div>
        <div className={styles.controls}>{activity.controls.map(c=><label key={c.key} className={styles.control}><span><b>{tr(c.label)}</b>{!c.options&&<output>{format(values[c.key],c.step<.01?3:c.step<1?1:0)} {c.unit}</output>}</span>{c.options?<select value={values[c.key]} disabled={slug==="reaction-rate-lab"&&running} onChange={e=>update(c.key,Number(e.target.value))}>{c.options.map((o,i)=><option key={o} value={i}>{tr(o)}</option>)}</select>:<input type="range" min={c.min} max={c.max} step={c.step} value={values[c.key]} disabled={slug==="reaction-rate-lab"&&running} onChange={e=>update(c.key,Number(e.target.value))}/>}</label>)}</div>
        {builder&&<div className={styles.builderTools}><p>Central atom: <b>{molecule.center}</b>. Add atoms to the model, then check your build.</p><div className={styles.addAtoms}>{[{atom:"H",order:1},{atom:"O",order:1},{atom:"O",order:2}].map(a=><button key={`${a.atom}${a.order}`} disabled={attachments.length>=molecule.count} onClick={()=>{setAttachments(v=>[...v,a]);setFeedback(null);}}>+ {a.order===2?"=":"–"}{a.atom}</button>)}</div><div className={styles.sockets}>{Array.from({length:molecule.count},(_,i)=><button key={i} disabled={!attachments[i]} aria-label={`Remove atom from socket ${i+1}`} onClick={()=>{setAttachments(v=>v.filter((_,j)=>j!==i));setFeedback(null);}}>{attachments[i]?`${attachments[i].order===2?"=":"–"}${attachments[i].atom} ×`:`Socket ${i+1}`}</button>)}</div></div>}
        {titration&&<div className={styles.dispenser}><span>DISPENSE NaOH</span><p>Use large portions first. Switch to single drops near the endpoint.</p><div>{[5,1,.05].map(amount=><button key={amount} disabled={added>=50||paused} onClick={()=>{setAdded(a=>Math.min(50,Math.round((a+amount)*100)/100));setFeedback(null);}}>+ {amount} mL</button>)}</div><small>{added>=50?"Burette empty. Reset for a fresh sample.":"One drop = 0.05 mL · capacity 50 mL"}</small></div>}
        {slug==="reaction-rate-lab"&&<button className={styles.action} disabled={running} onClick={()=>{setTime(0);setPaused(false);setRunning(true);setFeedback(null);}}>{running?"Reaction running…":"▶ Start reaction · 20 s"}</button>}
        {slug==="limiting-reagent"&&<button className={styles.action} disabled={reacted} onClick={()=>{setReacted(true);setFeedback(null);}}>{reacted?"Mixture reacted":"▶ React mixture"}</button>}
        <button className={styles.checkButton} onClick={check}>Check mission <span>→</span></button>
        <div className={styles.feedback} aria-live="polite" aria-atomic="true">{feedback?<div data-success={feedback.success}><strong>{feedback.success?"✓ Good work":"Try another approach"}</strong><p>{feedback.text}</p></div>:<p>Adjust the experiment, observe the result, then check your mission.</p>}</div>
        {!saved&&<p className={styles.saveWarning}>Completed for this session. Browser storage is unavailable, so progress cannot be saved.</p>}
        <details className={styles.science}><summary>How the science works</summary><p>{activity.science}</p><a href="https://openstax.org/books/chemistry-2e/pages/1-introduction" target="_blank" rel="noreferrer">Explore chemistry concepts ↗</a></details>
      </aside>
    </div>
    <section className={styles.library}><div><span className={styles.eyebrow}>KEEP EXPERIMENTING</span><h2>Explore all {activities.length} chemistry labs</h2></div><div className={styles.labLinks}>{subject.simulations.map((sim,i)=><Link key={sim.slug} href={`/${locale}/simulations/${sim.slug}`} aria-current={sim.slug===slug?"page":undefined}><span>{String(i+1).padStart(2,"0")}</span><strong>{sim.title}</strong><small>{completed.includes(sim.slug)?"✓ Completed":"Open lab ↗"}</small></Link>)}</div></section>
  </main>;
}
