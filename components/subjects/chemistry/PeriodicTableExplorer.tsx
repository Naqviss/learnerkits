"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";
import { elements, familyColors } from "@/lib/simulations/chemistry/elements";
import styles from "./periodic-table.module.css";

type View = "family" | "phase" | "block";
type Element = (typeof elements)[number];

const atomicMasses = `1.008,4.0026,6.94,9.0122,10.81,12.011,14.007,15.999,18.998,20.180,22.990,24.305,26.982,28.085,30.974,32.06,35.45,39.948,39.098,40.078,44.956,47.867,50.942,51.996,54.938,55.845,58.933,58.693,63.546,65.38,69.723,72.630,74.922,78.971,79.904,83.798,85.468,87.62,88.906,91.224,92.906,95.95,[98],101.07,102.91,106.42,107.87,112.41,114.82,118.71,121.76,127.60,126.90,131.29,132.91,137.33,138.91,140.12,140.91,144.24,[145],150.36,151.96,157.25,158.93,162.50,164.93,167.26,168.93,173.05,174.97,178.49,180.95,183.84,186.21,190.23,192.22,195.08,196.97,200.59,204.38,207.2,208.98,[209],[210],[222],[223],[226],[227],232.04,231.04,238.03,[237],[244],[243],[247],[247],[251],[252],[257],[258],[259],[266],[267],[268],[269],[270],[269],[278],[281],[282],[285],[286],[289],[290],[293],[294]`.split(",");

const gases = new Set([1,2,7,8,9,10,17,18,36,54,86]);
const liquids = new Set([35,80]);
const naturalPrimordial = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,90,91,92]);
const commonUses: Record<number,string> = {
  1:"Water, fuels and ammonia production",2:"Cryogenics, leak detection and balloons",3:"Rechargeable batteries and light alloys",6:"Life, fuels, steel and advanced materials",7:"Fertilizers and inert atmospheres",8:"Respiration, medicine and steelmaking",9:"Fluoropolymers and dental chemistry",10:"Lighting and lasers",11:"Salt chemistry and chemical manufacture",12:"Light alloys, flares and biology",13:"Lightweight structures and packaging",14:"Electronics, glass and solar cells",15:"Fertilizers, DNA and matches",16:"Sulfuric acid, fertilizers and proteins",17:"Water treatment and chemical synthesis",18:"Shielding gas and lighting",19:"Fertilizers and nerve function",20:"Bones, cement and metallurgy",26:"Steel and biological oxygen transport",27:"Superalloys, catalysts and vitamin B12",28:"Alloys, batteries and catalysts",29:"Electrical wiring and alloys",30:"Galvanizing, batteries and enzymes",35:"Flame retardants and photography",47:"Electronics, mirrors and photography",53:"Medicine, nutrition and chemical analysis",54:"Lighting and anesthesia research",74:"Hard tools, high-temperature alloys and filaments",78:"Catalysts, electronics and jewelry",79:"Electronics, dentistry and jewelry",80:"Specialized instruments; toxic and tightly controlled",82:"Batteries, radiation shielding and alloys",92:"Nuclear fuel and geological dating"
};
const familyNotes: Record<string,string> = {
  "Nonmetal":"Often forms covalent bonds; properties vary widely across the group.","Noble gas":"Has a filled outer shell in the usual ground-state model and is generally unreactive.","Alkali metal":"A reactive group 1 metal, commonly forming +1 ions.","Alkaline earth":"A reactive group 2 metal, commonly forming +2 ions.","Transition metal":"Often has variable oxidation states and forms colored compounds or useful catalysts.","Post-transition metal":"A relatively soft p-block metal with varied bonding behavior.","Metalloid":"Shows a mixture of metallic and nonmetallic behavior; several are semiconductors.","Halogen":"A reactive group 17 nonmetal, commonly forming −1 ions.","Lanthanide":"An f-block metal with closely related chemistry; many are useful in magnets and optics.","Actinide":"A radioactive f-block metal; several are synthetic or used in nuclear science."
};
const blockOf = (element:Element) => element.family === "Lanthanide" || element.family === "Actinide" ? "f" : element.column <= 2 ? "s" : element.column >= 13 ? "p" : "d";
const phaseOf = (z:number) => z >= 104 ? "Unknown" : gases.has(z) ? "Gas" : liquids.has(z) ? "Liquid" : "Solid";
const valenceOf = (e:Element) => e.family === "Noble gas" ? (e.number === 2 ? "2" : "8") : e.family === "Lanthanide" || e.family === "Actinide" || (e.column >= 3 && e.column <= 12) ? "Variable" : String(e.column <= 2 ? e.column : e.column - 10);
const colorFor = (e:Element,view:View) => view === "family" ? familyColors[e.family] : view === "phase" ? ({Solid:"#86b6d9",Liquid:"#d59bc5",Gas:"#e4bd78",Unknown:"#8c96a5"}[phaseOf(e.number)]) : ({s:"#e3ae86",p:"#8fc9b2",d:"#91b7df",f:"#c5a5d8"}[blockOf(e)]);
const categoryLabel = (e:Element,view:View) => view === "family" ? e.family : view === "phase" ? phaseOf(e.number) : `${blockOf(e)} block`;
const usesFor = (e:Element) => commonUses[e.number] ?? (naturalPrimordial.has(e.number) ? `Research, industry and compounds of the ${e.family.toLowerCase()} family` : "Scientific research; limited practical use because it is synthetic or short-lived");

export function PeriodicTableExplorer({locale,subject,simulation}:{locale:string;subject:SubjectDefinition;simulation:SimulationCard}) {
  const [view,setView] = useState<View>("family");
  const [query,setQuery] = useState("");
  const [family,setFamily] = useState("All families");
  const [selected,setSelected] = useState(6);
  const [compare,setCompare] = useState<number[]>([]);
  const [hideNames,setHideNames] = useState(false);
  const [hideNumbers,setHideNumbers] = useState(false);
  const current = elements[selected-1];
  const needle = query.trim().toLowerCase();
  const matches = useMemo(()=>new Set(elements.filter(e=>(family==="All families"||e.family===family)&&(!needle||`${e.name} ${e.symbol} ${e.number}`.toLowerCase().includes(needle))).map(e=>e.number)),[family,needle]);
  const legend = view === "family" ? Object.entries(familyColors) : view === "phase" ? [["Solid","#86b6d9"],["Liquid","#d59bc5"],["Gas","#e4bd78"],["Unknown / predicted","#8c96a5"]] : [["s block","#e3ae86"],["p block","#8fc9b2"],["d block","#91b7df"],["f block","#c5a5d8"]];
  function toggleCompare(z:number){setCompare(list=>list.includes(z)?list.filter(n=>n!==z):list.length<3?[...list,z]:[...list.slice(1),z]);}
  return <main className={styles.page}>
    <header className={styles.header}><div><Link href={`/${locale}/subjects/chemistry`}>← {subject.eyebrow}</Link><span>CHEMISTRY / INTERACTIVE REFERENCE</span><h1>{simulation.title}</h1><p>{simulation.outcome} Explore all 118 elements, investigate patterns, and compare properties.</p></div><div className={styles.headerStat}><strong>118</strong><span>elements<br/>one connected system</span></div></header>

    <section className={styles.tools} aria-label="Experiment controls"><label className={styles.search}><span>Search all elements</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name, symbol or atomic number…"/></label><label><span>Filter by family</span><select value={family} onChange={e=>setFamily(e.target.value)}><option>All families</option>{Object.keys(familyColors).map(name=><option key={name}>{name}</option>)}</select></label><div><span>Color the table by</span><div className={styles.segmented}>{(["family","phase","block"] as View[]).map(item=><button key={item} aria-pressed={view===item} onClick={()=>setView(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div></div><div className={styles.result}><strong>{matches.size}</strong><span>matching<br/>elements</span></div><details className={styles.toolMenu}><summary><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6"/></svg>Tools</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg></summary><div><button aria-pressed={hideNames} onClick={()=>setHideNames(v=>!v)}><span aria-hidden="true">Ab</span>{hideNames?"Show":"Hide"} element names</button><button aria-pressed={hideNumbers} onClick={()=>setHideNumbers(v=>!v)}><span aria-hidden="true">#</span>{hideNumbers?"Show":"Hide"} atomic numbers</button><button onClick={()=>window.print()}><span aria-hidden="true">⇩</span>Export table as PDF</button></div></details></section>

    <div className={styles.workspace}>
      <section className={styles.tablePanel} aria-label="Periodic table of all 118 chemical elements">
        <div className={styles.scroll}><div className={styles.grid}>
          {Array.from({length:18},(_,i)=><span className={styles.group} key={i} style={{gridColumn:i+2,gridRow:1}}>{i+1}</span>)}
          {Array.from({length:7},(_,i)=><span className={styles.period} key={i} style={{gridColumn:1,gridRow:i+2}}>{i+1}</span>)}
          <span className={styles.series} style={{gridColumn:4,gridRow:7}}>57–71</span><span className={styles.series} style={{gridColumn:4,gridRow:8}}>89–103</span>
          {elements.map(e=>{
            const active=selected===e.number,visible=matches.has(e.number);
            return <button key={e.symbol} className={styles.element} style={{gridColumn:e.column+1,gridRow:e.row+1,"--element-color":colorFor(e,view)} as CSSProperties} data-muted={!visible} aria-pressed={active} aria-label={`${e.name}, symbol ${e.symbol}, atomic number ${e.number}, group ${e.column}, period ${e.period}, ${e.family}`} onClick={()=>setSelected(e.number)}><small>{hideNumbers?"":e.number}</small><b>{e.symbol}</b><span>{hideNames?"":e.name}</span></button>
          })}
          <span className={styles.fLabel} style={{gridColumn:1,gridRow:10}}>La–Lu</span><span className={styles.fLabel} style={{gridColumn:1,gridRow:11}}>Ac–Lr</span>
        </div></div>
        <div className={styles.legend}>{legend.map(([name,color])=><span key={name}><i style={{background:color}}/>{name}</span>)}</div>
        <div className={styles.trends}><span>Atomic radius &amp; metallic character <b>← ↓ generally increase</b></span><span>Ionization energy &amp; electronegativity <b>generally increase ↑ →</b></span><small>Trends have important exceptions; use them as patterns, not absolute rules.</small></div>
        <div className={styles.printFooter}>LearnerKits.com</div>
      </section>

      <aside className={styles.detail} aria-live="polite">
        <div className={styles.elementHero} style={{"--element-color":colorFor(current,view)} as CSSProperties}><div><small>{current.number}</small><strong>{current.symbol}</strong></div><span>{categoryLabel(current,view)}</span></div>
        <div className={styles.detailTitle}><div><span>ELEMENT {current.number}</span><h2>{current.name}</h2></div><button aria-pressed={compare.includes(current.number)} onClick={()=>toggleCompare(current.number)}>{compare.includes(current.number)?"✓ Added":"+ Compare"}</button></div>
        <dl className={styles.facts}><div><dt>Atomic mass</dt><dd>{atomicMasses[current.number-1]} u</dd></div><div><dt>Group</dt><dd>{current.family==="Lanthanide"||current.family==="Actinide"?"f block":current.column}</dd></div><div><dt>Period</dt><dd>{current.period}</dd></div><div><dt>Block</dt><dd>{blockOf(current)}</dd></div><div><dt>Room-temp phase</dt><dd>{phaseOf(current.number)}</dd></div><div><dt>Valence electrons</dt><dd>{valenceOf(current)}</dd></div></dl>
        <div className={styles.note}><span>FAMILY PATTERN</span><p>{familyNotes[current.family]}</p></div><div className={styles.note}><span>COMMON CONTEXT</span><p>{usesFor(current)}</p></div><p className={styles.caution}>{current.number>=84?"Radioactive element. ":""}{naturalPrimordial.has(current.number)?"Occurs naturally in primordial terrestrial material.":"Known mainly from radioactive decay, trace occurrence, or laboratory synthesis."}</p>
      </aside>
    </div>

    <section className={styles.compare}><div><span>COMPARE ELEMENTS</span><h2>Build a side-by-side evidence set.</h2><p>Select an element, then choose Compare. Add up to three.</p></div>{compare.length?<div className={styles.compareTable}><table><thead><tr><th>Property</th>{compare.map(z=><th key={z}>{elements[z-1].symbol}<button aria-label={`Remove ${elements[z-1].name} from comparison`} onClick={()=>toggleCompare(z)}>×</button></th>)}</tr></thead><tbody>{[["Name",(e:Element)=>e.name],["Atomic number",(e:Element)=>e.number],["Atomic mass",(e:Element)=>`${atomicMasses[e.number-1]} u`],["Family",(e:Element)=>e.family],["Group / period",(e:Element)=>`${e.column} / ${e.period}`],["Block",(e:Element)=>blockOf(e)],["Phase",(e:Element)=>phaseOf(e.number)],["Valence electrons",valenceOf]].map(([label,value])=><tr key={label as string}><th>{label as string}</th>{compare.map(z=><td key={z}>{(value as (e:Element)=>string|number)(elements[z-1])}</td>)}</tr>)}</tbody></table></div>:<div className={styles.emptyCompare}><strong>No elements selected yet.</strong><span>Try comparing Li, Na and K—or C, Si and Ge—to inspect a group pattern.</span></div>}</section>

    <section className={styles.guide}><div><span>FOR STUDENTS</span><h2>Read the table as a map.</h2><ol><li><b>Atomic number</b> counts protons and defines the element.</li><li><b>Groups</b> are columns; main-group elements in a group often share valence patterns.</li><li><b>Periods</b> are rows and correspond to the highest occupied principal shell in the ground state.</li><li><b>Position</b> helps predict behavior, but measured data and exceptions still matter.</li></ol></div><div><span>FOR TEACHERS</span><h2>A ready five-minute routine.</h2><ol><li>Ask students to identify an element from position and family evidence.</li><li>Use the family and phase filters to reveal patterns.</li><li>Use Compare to test a claim across a group or period.</li><li>Ask students to justify predictions with visible table evidence.</li></ol></div></section>
    <p className={styles.source}>Element names and atomic numbers follow IUPAC. Atomic masses are conventional standard values or bracketed mass numbers for elements without a standard atomic weight. Phase and occurrence labels are simplified for classroom use near room conditions.</p>
  </main>;
}
