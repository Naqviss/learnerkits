import type { ReactNode } from "react";
export type ControlKind="play"|"pause"|"step"|"fast"|"speed"|"undo"|"redo"|"reset"|"move"|"remove"|"graphs"|"guide"|"conditions"|"plus"|"minus"|"left"|"right"|"home"|"fullscreen"|"labs"|"close";
/** Small sculpted game pieces; labels stay on the controls for assistive technology. */
export function GameControlIcon({kind}:{kind:ControlKind}) {
 let art:ReactNode;
 switch(kind){
 case "play": art=<path d="M17 10 Q14 8 14 12V34Q14 38 18 36L36 26Q40 23 36 21Z" fill="#ffdf61"/>;break;
 case "pause":art=<g fill="#ffdf61"><rect x="12" y="10" width="9" height="27" rx="3"/><rect x="27" y="10" width="9" height="27" rx="3"/></g>;break;
 case "step":case "fast":art=<g fill="#66c9ed"><path d="M9 12 27 24 9 36Z"/>{kind==="fast"?<path d="M24 12 42 24 24 36Z"/>:<rect x="31" y="12" width="7" height="24" rx="2"/>}</g>;break;
 case "undo":case "redo":case "left":case "right":case "reset":art=<g transform={kind==="redo"||kind==="right"?"translate(48 0) scale(-1 1)":undefined}><path d="M10 20C11 5 36 5 39 22Q43 38 26 40L24 32Q34 31 31 23Q28 15 19 20L24 24 7 28 5 11Z" fill={kind==="reset"?"#ffbf65":"#87c9ed"}/></g>;break;
 case "move":art=<path d="M17 25V13Q17 8 21 10V22 7Q25 3 27 8V22 11Q31 8 33 12V24 17Q38 14 39 19V31Q39 39 30 40H22Q16 39 12 32L7 24Q6 19 11 20Z" fill="#ffe4a9"/>;break;
 case "remove":art=<g><path d="M8 25H34V35H8Z" fill="#f8b742"/><path d="M15 13H28L33 26H12Z" fill="#ffdb61"/><path d="M18 16H26L29 23H17Z" fill="#6db4c1"/><path d="M37 23 43 19V37H33Z" fill="#e98d4d"/><rect x="6" y="31" width="30" height="10" rx="5" fill="#53676e"/>{[12,21,30].map(x=><circle key={x} cx={x} cy="36" r="2.5" fill="#b6c9c7"/>)}</g>;break;
 case "graphs":art=<g><rect x="7" y="7" width="34" height="34" rx="5" fill="#fff0c9"/><path d="M14 31V23M24 31V16M34 31V11" stroke="#49b2a0" strokeWidth="6"/></g>;break;
 case "guide":art=<g><path d="M7 9Q17 5 24 10 31 5 41 9V37Q31 34 24 39 16 34 7 37Z" fill="#ffd670"/><path d="M24 11V35M12 16 20 15M12 23 20 22M29 16 36 15M29 23 36 22" stroke="#b9854b" strokeWidth="2"/></g>;break;
 case "conditions":art=<g><circle cx="30" cy="16" r="10" fill="#ffd263"/><path d="M8 35Q0 27 12 24 12 12 25 20 39 15 41 29Q46 37 35 38H12Z" fill="#d5f2fb"/><path d="M17 29H32M22 24V34" stroke="#659cba" strokeWidth="3"/></g>;break;
 case "plus":case "minus":art=<g><circle cx="22" cy="21" r="14" fill="#c9eff0"/><path d="m33 32 9 9" stroke="#e6aa56" strokeWidth="8"/><path d="M14 21H30" stroke="#447e92" strokeWidth="4"/>{kind==="plus"&&<path d="M22 13V29" stroke="#447e92" strokeWidth="4"/>}</g>;break;
 case "home":case "labs":art=<g><path d="M10 22H38V40H10Z" fill="#ffe6a9"/><path d="m5 23 19-18 19 18Z" fill="#df8165"/><path d="M20 40V28H28V40" fill="#73a8aa"/>{kind==="labs"&&<path d="M12 26H17V31H12M31 26H36V31H31" fill="#73a8aa"/>}</g>;break;
 case "fullscreen":art=<path d="M6 19V7H19M29 7H41V19M41 29V41H29M19 41H7V29" fill="none" stroke="#a3dbea" strokeWidth="7"/>;break;
 case "close":art=<path d="m13 13 22 22m0-22L13 35" stroke="#f6bb87" strokeWidth="8"/>;break;
 case "speed":art=<g><path d="M6 36A19 19 0 1 1 42 36Z" fill="#d2eeee"/><path d="m23 30 11-15-5 19Z" fill="#ee9470"/><circle cx="24" cy="32" r="4" fill="#54869a"/></g>;break;
 }
 return <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true" focusable="false"><g transform="translate(0 2)" opacity=".28" stroke="#294744" strokeWidth="3" strokeLinejoin="round">{art}</g><g stroke="#44616c" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">{art}</g></svg>;
}
