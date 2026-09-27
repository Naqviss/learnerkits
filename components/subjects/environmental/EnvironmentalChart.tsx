import type { Experiment, Reading } from "@/lib/simulations/environmentalLabs/engine";
import styles from "./environmental.module.css";
export function companionReadings(experiment:Experiment,reading:Reading):Reading[] {
 const keys:Record<string,string[]>={renewable:["demand"],local:["reference"],rainfall:["infiltration","runoff","interception"],surface:["deep"],total:["thermal","ice"]};
 return experiment.readings.filter(r=>(keys[reading.key]??[]).includes(r.key)&&r.unit===reading.unit);
}
export function EnvironmentalChart({experiment,baseline,index,reading}:{experiment:Experiment;baseline:Experiment|null;index:number;reading:Reading}){
 const companions=companionReadings(experiment,reading),numbers=[...experiment.samples.flatMap(s=>[reading,...companions].map(r=>s[r.key])),...(baseline?.samples.map(s=>s[reading.key])??[])],small=Math.min(...numbers),big=Math.max(...numbers),pad=Math.max((big-small)*.1,reading.key==="ph"?.02:.1),min=small-pad,max=big+pad,end=Math.max(experiment.duration,baseline?.duration??0);
 const x=(t:number)=>65+t/end*740,y=(value:number)=>225-(value-min)/(max-min)*190;
 const path=(samples:Experiment["samples"],key=reading.key)=>samples.map((s,i)=>`${i?"L":"M"}${x(s.time).toFixed(2)},${y(s[key]).toFixed(2)}`).join(" ");
 const current=experiment.samples[index];
 return <svg className={styles.chart} viewBox="0 0 860 280" role="img" aria-label={`${reading.label} versus ${experiment.timeUnit}. Solid line: current experiment. Dashed line: saved baseline. Exact readings are available in the data table.`}>
  {[0,1,2,3,4].map(i=>{const value=min+(max-min)*i/4;return <g key={i}><path d={`M65 ${y(value)}H805`} stroke="#355165" strokeDasharray="3 5"/><text x="56" y={y(value)+4} textAnchor="end">{value.toFixed(reading.digits>1?2:1)}</text><text x={x(end*i/4)} y="248" textAnchor="middle">{(end*i/4).toFixed(end<5?1:0)}</text></g>})}
  <text x="65" y="19">{reading.label} ({reading.unit})</text><text x="805" y="274" textAnchor="end">Elapsed {experiment.timeUnit}</text>
  {baseline&&<path d={path(baseline.samples)} fill="none" stroke="#bccad6" strokeWidth="2" strokeDasharray="7 6"/>}
  {companions.map(r=><path key={r.key} d={path(experiment.samples.slice(0,index+1),r.key)} fill="none" stroke={r.color} strokeWidth="2" strokeLinejoin="round"/>)}
  <path d={path(experiment.samples.slice(0,index+1))} fill="none" stroke={reading.color} strokeWidth="3" strokeLinejoin="round"/>
  <path d={`M${x(current.time)} 35V225`} stroke={reading.color} opacity=".4"/><circle cx={x(current.time)} cy={y(current[reading.key])} r="5" fill={reading.color}/>
 </svg>;
}
