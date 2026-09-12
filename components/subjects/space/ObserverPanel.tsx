import { eclipse, flyby, phaseFraction, rad, seasons, type Values } from "@/lib/simulations/spaceLabs/model";

export function ObserverPanel({slug,values:v}:{slug:string;values:Values}){
  if(slug==="moon-phases-3d"){
    const angle=rad(v.angle),right=Math.sin(angle)>=0;
    return <div className="spaceObserver"><svg viewBox="0 0 540 220" role="img" aria-label={`Moon from Earth: ${(phaseFraction(v.angle)*100).toFixed(0)}% illuminated`}><circle cx="130" cy="108" r="75" fill="#101725" stroke="#54627b"/>{Array.from({length:150},(_,i)=>{const y=(i+.5)/75-1,edge=Math.sqrt(Math.max(0,1-y*y))*75,terminator=Math.cos(angle)*edge;return <path key={i} d={`M${130+(right?terminator:-edge)} ${33+i+.5}H${130+(right?edge:-terminator)}`} stroke="#cfd6e3" strokeWidth="1.05"/>;})}<text x="251" y="81" fill="#92a9cc" fontSize="11" letterSpacing="1">VIEW FROM EARTH</text><text x="251" y="119" fill="#dce7f7" fontSize="28">{(phaseFraction(v.angle)*100).toFixed(0)}% illuminated</text><text x="251" y="148" fill="#a6b4cb" fontSize="12">Sunlight changes the visible phase.</text><text x="251" y="168" fill="#a6b4cb" fontSize="12">Earth’s shadow does not cause phases.</text></svg></div>;
  }
  if(slug==="solar-eclipse-3d"){
    const e=eclipse(v),scale=75/e.sun;
    return <div className="spaceObserver"><svg viewBox="0 0 540 220" role="img" aria-label={`${e.kind}, ${(e.coverage*100).toFixed(1)}% solar coverage`}><circle cx="137" cy="108" r="78" fill="#f1c57d" opacity=".14"/><circle cx="137" cy="108" r="75" fill="#f3cc8b"/><circle cx={137+v.offset*scale} cy="108" r={e.moon*scale} fill="#151c29" stroke="#52617b"/><rect x="279" y="25" width="255" height="178" fill="#1d2532"/><text x="295" y="75" fill="#91a8c9" fontSize="11">OBSERVER’S SKY · TRUE ANGULAR SCALE</text><text x="295" y="111" fill="#d9e6fb" fontSize="26">{e.kind}</text><text x="295" y="141" fill="#c2d0e7" fontSize="13">{(e.coverage*100).toFixed(1)}% solar coverage</text><text x="295" y="169" fill="#94a7c1" fontSize="11">Move the alignment toward 0°.</text></svg></div>;
  }
  if(slug==="earth-seasons-tilt"){
    const s=seasons(v);return <div className="spaceObserver"><div className="spaceDayTitle"><span>DAYLIGHT AT {v.latitude}° LATITUDE</span><strong>{s.daylight.toFixed(2)} hours</strong></div><div className="spaceDayBar"><i style={{left:`${(24-s.daylight)/48*100}%`,width:`${s.daylight/24*100}%`}}/></div><div className="spaceDayScale"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div><p>Blue: daylight · dark: night · amber ring: observer latitude</p></div>;
  }
  if(slug==="gravity-slingshot"){
    const f=flyby(v);return <div className="spaceObserver"><svg viewBox="0 0 540 220" role="img" aria-label="Incoming and outgoing heliocentric velocity vectors">{[f.incoming,f.outgoing].map((relative,i)=>{const ox=35+i*270,oy=145,scale=4,ex=ox+(29.78+relative[0])*scale,ey=oy-relative[1]*scale;return <g key={i}><text x={ox} y="35" fill="#a9bfdf" fontSize="12">{i?"AFTER FLYBY":"BEFORE FLYBY"}</text><path d={`M${ox} ${oy}h${29.78*scale}`} stroke="#697a94" strokeWidth="2"/><path d={`M${ox+29.78*scale} ${oy}L${ex} ${ey}`} stroke="#edbe88" strokeWidth="2"/><path d={`M${ox} ${oy}L${ex} ${ey}`} stroke="#91baff" strokeWidth="3"/><circle cx={ex} cy={ey} r="4" fill="#d9e8ff"/><text x={ox} y="192" fill="#c6dafa" fontSize="18">{(i?f.after:f.before).toFixed(2)} km/s</text></g>;})}</svg><p>Gray: Earth’s orbital velocity · Amber: planet-relative velocity · Blue: heliocentric sum</p></div>;
  }
  return null;
}
