import type { AssetKind } from "@/lib/simulations/environmentalLabs/builder";
export function BuildIcon({kind}:{kind:AssetKind}){
 let paths;
 if(["trees","corridor","garden","wetland"].includes(kind))paths=<><path d="M9 28L25 36L41 28L25 20Z" fill="#b7d0ac"/><path d="M18 28V15M31 29V17" stroke="#7e7558" strokeWidth="3"/><path d="M8 19L18 3L28 19Z" fill="#5c9a78"/><path d="M23 21L31 8L39 21Z" fill="#83b295"/>{kind==="wetland"&&<path d="M9 30Q20 24 36 30" fill="none" stroke="#68aeba" strokeWidth="4"/>}</>;
 else if(kind==="solar")paths=<><path d="M8 25L13 8H39L34 25Z" fill="#416c8a" stroke="#91b8c6"/><path d="M11 17H36M20 8L15 25M29 8L24 25" stroke="#bad6d8"/><path d="M15 26V34M30 26V34" stroke="#6a8993" strokeWidth="3"/></>;
 else if(kind==="wind")paths=<><path d="M24 16V37" stroke="#718d96" strokeWidth="3"/><path d="M24 17L21 1L27 1ZM24 17L40 20L38 26ZM24 17L11 29L7 24Z" fill="#bfd4d4" stroke="#6f959c"/><circle cx="24" cy="17" r="3" fill="#577a86"/></>;
 else if(kind==="battery")paths=<><rect x="12" y="7" width="25" height="31" rx="4" fill="#b4c7bd" stroke="#567d74"/><path d="M19 3H30V7H19Z" fill="#638d80"/><rect x="17" y="13" width="15" height="19" rx="2" fill="#6ba991"/><path d="M26 14L21 24H27L23 31" fill="none" stroke="#e3efbf" strokeWidth="2"/></>;
 else if(kind==="water"||kind==="pump"||kind==="drain")paths=<><path d="M9 15L24 7L39 15V31L24 39L9 31Z" fill="#8ca9a3"/><path d="M24 7V32M9 15L24 23L39 15" stroke="#d6e3d5"/><path d="M5 31Q12 25 19 31T33 31T47 31" stroke="#65aeba" strokeWidth="4" fill="none"/></>;
 else if(kind==="road"||kind==="transit")paths=<><path d="M8 32L29 5L43 12L22 40Z" fill="#82958d"/><path d="M15 36L36 9" stroke="#edeac8" strokeDasharray="5 4"/>{kind==="transit"&&<rect x="17" y="16" width="17" height="12" rx="3" fill="#75b8a6"/>}</>;
 else if(kind==="barrier")paths=<><path d="M7 31V14L37 8L42 13V30L12 37Z" fill="#b3bbae"/><path d="M7 14L12 19L42 13M12 19V37M23 17V34M33 15V32" fill="none" stroke="#708b81"/></>;
 else if(kind==="warning")paths=<><path d="M24 15V39" stroke="#7d9896" strokeWidth="4"/><path d="M14 11L24 5L35 11V21L24 27L14 21Z" fill="#d5b775"/><path d="M9 6Q0 15 9 24M40 6Q49 15 40 24" fill="none" stroke="#719b94" strokeWidth="2"/></>;
 else if(kind==="clearing")paths=<><path d="M6 30L25 39L42 30L24 21Z" fill="#c2ae8d"/><ellipse cx="24" cy="24" rx="9" ry="5" fill="#9d8967"/><path d="M15 24V31Q24 38 33 31V24" fill="#ad936e"/></>;
 else paths=<><path d="M9 17L26 9L39 16V34L23 41L9 34Z" fill={kind==="roof"?"#c0d0c5":"#b6beb0"}/><path d="M9 17L23 24L39 16M23 24V41" fill="none" stroke="#718c84"/>{kind==="factory"||kind==="capture"?<path d="M28 13V2H35V17" fill="#8eaca8"/>:<path d="M7 16L25 5L41 15L23 24Z" fill={kind==="roof"?"#e2e8d7":"#b49173"}/>}<path d="M13 23V28M18 26V31M28 26V31M34 23V28" stroke="#587b85" strokeWidth="3"/></>;
 return <svg viewBox="0 0 50 44" width="43" height="38" aria-hidden="true">{paths}</svg>;
}
