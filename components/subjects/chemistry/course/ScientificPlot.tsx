import { useId } from "react";
export type Series = { name:string; points:[number,number][]; color?:string };
export function ScientificPlot({series,xLabel,yLabel,xMax,xMin=0,yMax,yMin=0,marker}:{series:Series[];xLabel:string;yLabel:string;xMax:number;xMin?:number;yMax:number;yMin?:number;marker?:[number,number]}) {
  const id=useId(); const x=(n:number)=>58+(n-xMin)/(xMax-xMin)*570,y=(n:number)=>245-(n-yMin)/(yMax-yMin)*200;
  const format=(n:number)=>Math.abs(n)>=1000?n.toFixed(0):Number(n.toPrecision(3)).toString();
  return <div className="coursePlot"><svg viewBox="0 0 680 295" role="img" aria-labelledby={id}><title id={id}>{`${yLabel} versus ${xLabel}`}</title>
    {[0,1,2,3,4].map(i=><g key={i}><path d={`M58 ${45+i*50}H628`} stroke="#344654" strokeDasharray="3 5"/><text x="48" y={49+i*50} textAnchor="end">{format(yMax-i*(yMax-yMin)/4)}</text><text x={58+i*142.5} y="264" textAnchor="middle">{format(xMin+i*(xMax-xMin)/4)}</text></g>)}
    <path d="M58 35V245H638" stroke="#8397a9" fill="none"/>
    {series.map((s,i)=><path key={s.name} d={s.points.map(([a,b],j)=>Number.isFinite(a)&&Number.isFinite(b)?`${j&&s.points[j-1].every(Number.isFinite)?"L":"M"}${x(a)},${y(b)}`:"").join(" ")} fill="none" stroke={s.color??["#91baff","#f0ba81","#a5dabb"][i%3]} strokeWidth="2.8"/>)}
    {marker&&<circle cx={x(marker[0])} cy={y(marker[1])} r="5" fill="white"/>}
    <text x="344" y="288" textAnchor="middle">{xLabel}</text><text transform="translate(14 145) rotate(-90)" textAnchor="middle">{yLabel}</text>
  </svg><div className="coursePlotLegend">{series.map((s,i)=><span key={s.name}><i style={{background:s.color??["#91baff","#f0ba81","#a5dabb"][i%3]}}/>{s.name}</span>)}</div></div>;
}
