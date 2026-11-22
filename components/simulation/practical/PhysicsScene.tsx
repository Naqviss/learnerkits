import { memo } from "react";
import type { Frame } from "@/lib/simulations/practical/models";

export type PhysicsKind = "gravity-planet-orbit" | "n-body-space" | "pendulum-wave";

const Sky = memo(function Sky() {
  let seed = 317;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  return <>
    <defs>
      <radialGradient id="night"><stop stopColor="#14283f"/><stop offset=".58" stopColor="#0a1528"/><stop offset="1" stopColor="#030813"/></radialGradient>
      <radialGradient id="corona"><stop stopColor="#fff6be"/><stop offset=".22" stopColor="#ffab44" stopOpacity=".85"/><stop offset=".48" stopColor="#ff8038" stopOpacity=".17"/><stop offset="1" stopColor="#ff6423" stopOpacity="0"/></radialGradient>
      <radialGradient id="photosphere" cx=".42" cy=".42" r=".63"><stop stopColor="#fff9d9"/><stop offset=".69" stopColor="#ffdf89"/><stop offset=".94" stopColor="#ffac4c"/><stop offset="1" stopColor="#ee6f2c"/></radialGradient>
      <radialGradient id="shadow" cx=".16" cy=".42" r=".88"><stop stopColor="#c5e9ff" stopOpacity=".12"/><stop offset=".5" stopColor="#061023" stopOpacity=".04"/><stop offset=".77" stopColor="#020413" stopOpacity=".77"/><stop offset="1" stopColor="#00030a" stopOpacity=".96"/></radialGradient>
    </defs>
    <rect width="460" height="200" fill="url(#night)"/>
    {Array.from({length:180},(_,i)=><circle key={i} cx={random()*460} cy={random()*200} r={.13+random()**3*.55} opacity={.25+random()*.67} fill={i%5===0 ? "#ffdfaf" : "#cadeff"}/>)}
  </>;
});

const LabBench = memo(function LabBench() {
  return <>
    <defs>
      <linearGradient id="rail" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#d8e5ef"/><stop offset=".3" stopColor="#889dab"/><stop offset=".52" stopColor="#253746"/><stop offset="1" stopColor="#101821"/></linearGradient>
      <radialGradient id="brass" cx=".31" cy=".25" r=".77"><stop stopColor="#fff7d4"/><stop offset=".15" stopColor="#dab375"/><stop offset=".46" stopColor="#9c683b"/><stop offset=".75" stopColor="#382d2b"/><stop offset=".96" stopColor="#1a2027"/><stop offset="1" stopColor="#af8967"/></radialGradient>
      <linearGradient id="lab-wall" x2="1" y2="1"><stop stopColor="#eff2e9"/><stop offset="1" stopColor="#a8b7b4"/></linearGradient>
      <linearGradient id="bench-top" x2="0" y2="1"><stop stopColor="#ab825f"/><stop offset="1" stopColor="#dcb68b"/></linearGradient>
      <pattern id="lab-tiles" width="52" height="26" patternUnits="userSpaceOnUse"><path d="M0 26V0H52" fill="none" stroke="#748988" strokeWidth=".55" opacity=".32"/></pattern>
    </defs>
    <rect x="-500" y="-500" width="1460" height="700" fill="url(#lab-wall)"/>
    <rect x="-500" y="-500" width="1460" height="675" fill="url(#lab-tiles)"/>
    <rect x="-500" y="173" width="1460" height="32" fill="url(#bench-top)"/>
    <rect x="-500" y="205" width="1460" height="500" fill="#997555"/>
    <path d="M-500 175H960 M-500 204H960" stroke="#73583f" opacity=".5"/>
    <ellipse cx="230" cy="194" rx="222" ry="3.5" fill="#503827" opacity=".28"/>
  </>;
});

function Globe({x,y,r,angle,earth=false}: {x:number;y:number;r:number;angle:number;earth?:boolean}) {
  return <g transform={`translate(${x} ${y})`}>
    <image href={earth ? "/images/practical/earth.webp" : "/images/practical/moon.webp"} x={-r} y={-r} width={2*r} height={2*r}/>
    <circle r={r} fill="url(#shadow)" transform={`rotate(${angle})`}/>
    {earth && <circle r={r} fill="none" stroke="#8bc9ff" strokeWidth=".35" opacity=".65"/>}
  </g>;
}

export function PhysicsScene({kind,frames,index}: {kind:PhysicsKind;frames:Frame[];index:number}) {
  const frame = frames[index];
  if (kind === "pendulum-wave") return <><LabBench/>
    <path d="M12 189 L21 15 H28 L23 189Z M435 189 L431 15 H438 L447 189Z" fill="url(#rail)"/>
    <rect x="16" y="15" width="428" height="9" rx="2" fill="url(#rail)"/>
    {frame.dots.map((p,i)=>{
      const anchor = 34+i*37;
      return <g key={i}><circle cx={anchor} cy="23" r="1.5" fill="#e0c2a0"/>
        <line x1={anchor} y1="24" x2={p.x} y2={p.y} stroke="#465451" strokeWidth=".8"/>
        <circle cx={p.x} cy={p.y} r="6" fill="url(#brass)"/></g>;
    })}
    <path d="M6 187 H454 L458 194 H2Z" fill="url(#rail)"/></>;

  const history = frames.slice(0,index+1);
  const scale = 86 / Math.max(1.2,...history.map(f=>Math.max(...f.dots.map(p=>Math.max(Math.abs(p.y),Math.abs(p.x)/2)))));
  const orbit = kind === "gravity-planet-orbit";
  return <><Sky/>
    {orbit && <><polyline fill="none" stroke="#80b7cd" opacity=".65" strokeWidth=".7" points={history.map(f=>[230+scale*f.dots[0].x,100-scale*f.dots[0].y].join(",")).join(" ")}/>
      <circle cx="230" cy="100" r="37" fill="url(#corona)"/><circle cx="230" cy="100" r="9" fill="url(#photosphere)"/></>}
    {frame.dots.map((p,i)=><Globe key={i} x={230+scale*p.x} y={100-scale*p.y} r={orbit ? 7.5 : 2.2*p.size} earth={orbit} angle={orbit ? Math.atan2(-p.y,p.x)*180/Math.PI : 25}/>)}
  </>;
}
