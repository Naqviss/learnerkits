import styles from "./space.module.css";
import { eclipse, flyby, phaseFraction, rad, seasons, type Values } from "@/lib/simulations/spaceLabs/model";

export function ObserverPanel({slug,values:v}:{slug:string;values:Values}){
  if(slug==="moon-phases-3d"){
    const angle = ((v.angle % 360) + 360) % 360;
    const fraction = phaseFraction(angle);
    const phase = angle === 0 ? "New moon" : angle === 180 ? "Full moon"
      : angle === 90 ? "First quarter" : angle === 270 ? "Last quarter"
      : angle < 90 ? "Waxing crescent" : angle < 180 ? "Waxing gibbous"
      : angle < 270 ? "Waning gibbous" : "Waning crescent";
    const terminator = Math.abs(Math.cos(rad(angle)) * 75);
    const waxing = angle <= 180;
    const litDisk = `M130 33 A75 75 0 0 ${waxing ? 1 : 0} 130 183 A${terminator} 75 0 0 ${fraction > .5 ? Number(waxing) : Number(!waxing)} 130 33Z`;
    return <section className={styles.lunarObserver} aria-label="View from Earth">
      <svg viewBox="50 28 160 160" aria-hidden="true">
        <defs><clipPath id="lunar-observer-light"><path d={litDisk}/></clipPath></defs>
        <circle cx="130" cy="108" r="76" fill="#293447"/>
        <image href="/textures/moon-observer.webp" x="55" y="33" width="150" height="150" opacity=".12"/>
        {angle !== 0 && <image href="/textures/moon-observer.webp" x="55" y="33" width="150" height="150"
          clipPath={angle === 180 ? undefined : "url(#lunar-observer-light)"}/>}
      </svg>
      <div><small>View from Earth</small><h3>{phase}</h3>
        <span>{Math.round(fraction * 100)}% illuminated · Day {(angle / 360 * 29.53).toFixed(1)}</span>
      </div>
    </section>;
  }
  if(slug==="solar-eclipse-3d"){
    const {kind, sun, moon, coverage} = eclipse(v);
    const scale = 40 / sun;
    return <section className={styles.lunarObserver} aria-label="View from Earth">
      <svg viewBox="-60 -60 120 120" aria-hidden="true">
        <image href="/textures/lunar-lab-sun.webp" x="-80" y="-80" width="160" height="160"/>
        <circle cx={v.offset * scale} cy="0" r={moon * scale} fill="#101724"/>
      </svg>
      <div><small>View from Earth</small><h3>{kind === "No eclipse" ? kind : kind + " eclipse"}</h3>
        <span>{(coverage * 100).toFixed(1)}% of the Sun covered</span>
      </div>
    </section>;
  }
  if(slug==="earth-seasons-tilt"){
    const s=seasons(v);return <div className="spaceObserver"><div className="spaceDayTitle"><span>DAYLIGHT AT {v.latitude}° LATITUDE</span><strong>{s.daylight.toFixed(2)} hours</strong></div><div className="spaceDayBar"><i style={{left:`${(24-s.daylight)/48*100}%`,width:`${s.daylight/24*100}%`}}/></div><div className="spaceDayScale"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div><p>Blue: daylight · dark: night · amber ring: observer latitude</p></div>;
  }
  if(slug==="gravity-slingshot"){
    const f=flyby(v);return <div className="spaceObserver"><svg viewBox="0 0 540 220" role="img" aria-label="Incoming and outgoing heliocentric velocity vectors">{[f.incoming,f.outgoing].map((relative,i)=>{const ox=35+i*270,oy=145,scale=4,ex=ox+(29.78+relative[0])*scale,ey=oy-relative[1]*scale;return <g key={i}><text x={ox} y="35" fill="#a9bfdf" fontSize="12">{i?"AFTER FLYBY":"BEFORE FLYBY"}</text><path d={`M${ox} ${oy}h${29.78*scale}`} stroke="#697a94" strokeWidth="2"/><path d={`M${ox+29.78*scale} ${oy}L${ex} ${ey}`} stroke="#edbe88" strokeWidth="2"/><path d={`M${ox} ${oy}L${ex} ${ey}`} stroke="#91baff" strokeWidth="3"/><circle cx={ex} cy={ey} r="4" fill="#d9e8ff"/><text x={ox} y="192" fill="#c6dafa" fontSize="18">{(i?f.after:f.before).toFixed(2)} km/s</text></g>;})}</svg><p>Gray: Earth’s orbital velocity · Amber: planet-relative velocity · Blue: heliocentric sum</p></div>;
  }
  return null;
}
