import { useId, type CSSProperties } from 'react';
import type { Structure } from '@/lib/simulations/chemistry/builder';
import { elementBySymbol } from '@/lib/simulations/chemistry/elements';
import styles from './builder.module.css';

export type BuilderIconName = 'select' | 'bond' | 'measure' | 'delete' | 'undo' | 'redo' | 'import' | 'export' | 'new' | 'table' | 'attach' | 'atom' | 'close' | 'zoomIn' | 'zoomOut' | 'fit' | 'camera' | 'labels' | 'rotate' | 'molecule' | 'check' | 'info' | 'back';

/** Solid SVG artwork with an extruded edge and a shared blue enamel finish. */
export function BuilderIcon({ name, className = '' }: { name: BuilderIconName; className?: string }) {
  const id = useId().replace(/:/g, '');
  const art = (() => {
    switch (name) {
      case 'select': return <path d="M8 5v21l6-6 5 10 5-3-5-9h8Z"/>;
      case 'bond': return <><path d="m9 20 12-12 4 4-12 12Z"/><circle cx="8" cy="24" r="6"/><circle cx="25" cy="8" r="6"/></>;
      case 'measure': return <path d="m4 23 19-19 7 7-19 19Zm6-2 3 3m1-7 3 3m1-7 3 3m1-7 3 3" fillRule="evenodd"/>;
      case 'delete': return <><path d="M7 11h18l-2 18H9Zm-2-6h8V3h6v2h8v4H5Z"/><path d="M13 14v11m6-11v11" fill="none" stroke="#eaf5ff" strokeWidth="1.5"/></>;
      case 'undo': return <path d="M13 4 3 13l10 8v-6h7c5 0 7 5 5 11 7-7 5-17-5-17h-7Z"/>;
      case 'redo': return <path d="m19 4 10 9-10 8v-6h-7c-5 0-7 5-5 11C0 19 2 9 12 9h7Z"/>;
      case 'import': return <><path d="M13 3h6v11h6l-9 9-9-9h6Z"/><path d="M4 22h4v5h16v-5h4v9H4Z"/></>;
      case 'export': return <><path d="m16 2 9 9h-6v11h-6V11H7Z"/><path d="M4 22h4v5h16v-5h4v9H4Z"/></>;
      case 'new': return <><path d="M7 2h13l7 7v21H7Zm13 1v7h7"/><path d="M12 20h10m-5-5v10" fill="none" stroke="#fff" strokeWidth="2"/></>;
      case 'table': return <><rect x="3" y="5" width="27" height="23" rx="3"/><path d="M4 12h25M4 20h25M12 6v21m9-21v21" fill="none" stroke="#e6f3ff" strokeWidth="1.7"/></>;
      case 'attach': return <><circle cx="10" cy="20" r="8"/><path d="M15 12 23 5l4 4-8 8Z"/><path d="M24 18h5v4h-5v5h-4v-5h-5v-4h5v-5h4Z"/></>;
      case 'atom': return <><circle cx="16" cy="16" r="10"/><path d="M3 23c4 4 22-7 26-14M3 9c4-4 22 7 26 14" fill="none" strokeWidth="2.5"/><circle cx="27" cy="10" r="3"/></>;
      case 'close': return <path d="m8 4 8 8 8-8 4 4-8 8 8 8-4 4-8-8-8 8-4-4 8-8-8-8Z"/>;
      case 'zoomIn': case 'zoomOut': return <><path d="m21 19 10 9-4 4-10-10Z"/><circle cx="13" cy="13" r="10"/><path d={name==='zoomIn'?'M7 13h12m-6-6v12':'M7 13h12'} fill="none" stroke="#fff" strokeWidth="2.5"/></>;
      case 'fit': return <><path d="M2 11V2h9v4H6v5Zm19-9h9v9h-4V6h-5ZM2 21h4v5h5v4H2Zm24 0h4v9h-9v-4h5Z"/><path d="m16 9 7 4v8l-7 4-7-4v-8Z"/><path d="m9 13 7 4 7-4m-7 4v8" fill="none" stroke="#e6f3ff" strokeWidth="1.3"/></>;
      case 'camera': return <><path d="M3 9h7l3-5h8l3 5h5v20H3Z"/><circle cx="16" cy="19" r="6" fill="#164ea3"/><circle cx="16" cy="19" r="4" fill="#bce3ff"/><circle cx="26" cy="12" r="1" fill="#fff"/></>;
      case 'labels': return <><path d="M3 4h14l14 14-13 13L3 16Z"/><circle cx="10" cy="11" r="2.5" fill="#eaf5ff"/><path d="m15 17 7 7m-4-10 7 7" fill="none" stroke="#eaf5ff" strokeWidth="1.8"/></>;
      case 'rotate': return <><path d="M25 4v6C18 0 3 5 3 17h5c0-8 10-11 14-5h-6v5h14V4Z"/><path d="M26 21c-2 7-12 7-16 3l3-3H2v10l4-4c7 7 21 5 25-4Z"/></>;
      case 'molecule': return <><path d="m8 9 16 13-3 4L5 13Zm17-12 4 2-9 19-4-2Z"/><circle cx="8" cy="10" r="6"/><circle cx="25" cy="7" r="5"/><circle cx="21" cy="25" r="7"/></>;
      case 'check': return <path d="m3 17 5-5 6 6L26 5l5 5-17 18Z"/>;
      case 'info': return <><circle cx="16" cy="16" r="13"/><path d="M14 14h4v10h-4Z" fill="#fff"/><circle cx="16" cy="9" r="2" fill="#fff"/></>;
      case 'back': return <path d="M16 3 3 16l13 13v-9h14v-8H16Z"/>;
    }
  })();
  return <svg className={`${styles.icon} ${className}`} viewBox="0 0 36 38" aria-hidden="true" focusable="false">
    <defs><linearGradient id={`${id}-face`} x1="0" y1="0" x2=".65" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#d3f0ff"/><stop offset=".4" stopColor="#70b8ff"/><stop offset="1" stopColor="#3475df"/></linearGradient></defs>
    <g transform="translate(2 4)" fill="#174895" stroke="#174895" strokeWidth="1.4" strokeLinejoin="round">{art}</g>
    <g transform="translate(1 1)" fill={`url(#${id}-face)`} stroke="#91c9ff" strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round">{art}</g>
  </svg>;
}

export function ElementOrb({ color, className = '' }: { color:string; className?:string }) {
  const id=useId().replace(/:/g,'');
  return <svg className={`${styles.orb} ${className}`} viewBox="0 0 32 34" aria-hidden="true" focusable="false" style={{'--orb-color':color} as CSSProperties}>
    <defs><radialGradient id={id} cx="30%" cy="25%" r="75%"><stop stopColor="#fff"/><stop offset=".2" stopColor="color-mix(in srgb, var(--orb-color) 55%, white)"/><stop offset=".55" stopColor="var(--orb-color)"/><stop offset="1" stopColor="color-mix(in srgb, var(--orb-color) 55%, #10274f)"/></radialGradient></defs>
    <ellipse cx="16" cy="30" rx="11" ry="3" fill="#163366" opacity=".2"/><circle cx="16" cy="15" r="13" fill={`url(#${id})`}/><ellipse cx="11" cy="8" rx="4" ry="2.4" fill="#fff" opacity=".55" transform="rotate(-30 11 8)"/>
  </svg>;
}

/** Tiny ball-and-stick preview using each preset's actual atom and bond positions. */
export function MoleculeThumbnail({ structure }: { structure:Structure }) {
  const id=useId().replace(/:/g,'');
  const points=structure.atoms.map(a=>({ ...a, x:a.position[0]+a.position[2]*.35, y:-a.position[1]+a.position[2]*.22 }));
  const xs=points.map(a=>a.x),ys=points.map(a=>a.y),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
  const scale=Math.min(66/Math.max(1,Math.max(...xs)-Math.min(...xs)),44/Math.max(1,Math.max(...ys)-Math.min(...ys)));
  const position=(atom:typeof points[number])=>({x:50+(atom.x-cx)*scale,y:34+(atom.y-cy)*scale});
  return <svg className={styles.thumbnail} viewBox="0 0 100 72" aria-hidden="true" focusable="false">
    <defs>{[...new Set(points.map(a=>a.element))].map(e=><radialGradient key={e} id={`${id}-${e}`} cx="28%" cy="22%" r="80%"><stop stopColor="#fff"/><stop offset=".35" stopColor={elementBySymbol[e].color}/><stop offset="1" stopColor="#274779"/></radialGradient>)}</defs>
    <ellipse cx="50" cy="66" rx="29" ry="3" fill="#1c50a0" opacity=".13"/>
    {structure.bonds.map(b=>{const a=position(points.find(p=>p.id===b.a)!),c=position(points.find(p=>p.id===b.b)!);return <g key={`${b.a}-${b.b}`} strokeLinecap="round"><path d={`M${a.x} ${a.y+1}L${c.x} ${c.y+1}`} stroke="#356096" strokeWidth="4"/><path d={`M${a.x} ${a.y}L${c.x} ${c.y}`} stroke="#a7c7ea" strokeWidth="2.5"/></g>;})}
    {[...points].sort((a,b)=>a.position[2]-b.position[2]).map(a=>{const p=position(a);return <circle key={a.id} cx={p.x} cy={p.y} r={a.element==='H'?4.1:6.5} fill={`url(#${id}-${a.element})`}/>;})}
  </svg>;
}
