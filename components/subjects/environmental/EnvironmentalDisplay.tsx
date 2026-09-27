import { useId, type ReactNode } from "react";
import { clamp, type Values } from "@/lib/simulations/environmentalLabs/model";
import { habitatNetwork, type Sample } from "@/lib/simulations/environmentalLabs/engine";
const mint="#72e0b5",gold="#ffd18b",blue="#79caff",white="#ebf7ff";
function Text({x,y,children,anchor="start",color=white,size=14}:{x:number;y:number;children:ReactNode;anchor?:"start"|"middle"|"end";color?:string;size?:number}){return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontFamily="system-ui,sans-serif">{children}</text>}
function Tree({x,y,scale=1}:{x:number;y:number;scale?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cy="3" rx="22" ry="6" fill="#051d25" opacity=".3"/><path d="M0 0V-45" stroke="#a9875e" strokeWidth="5"/><path d="M0-17L-15-35M0-27L13-45" stroke="#a9875e" strokeWidth="3"/><circle cy="-49" r="22" fill="#2d8e70"/><circle cx="-13" cy="-40" r="17" fill="#3aa786"/><circle cx="12" cy="-47" r="16" fill="#63c69a"/></g>}
function Building({x,y,w=65,h=100,roof="#66879b",lit=true}:{x:number;y:number;w?:number;h?:number;roof?:string;lit?:boolean}){return <g><path d={`M${x} ${y}v-${h}l${w} 0v${h}Z`} fill="#37556b"/><path d={`M${x+w} ${y}l18-10v-${h}l-18 10Z`} fill="#243e53"/><path d={`M${x} ${y-h}l18-10h${w}l-18 10Z`} fill={roof}/>{Array.from({length:Math.floor(h/22)},(_,row)=>Array.from({length:3},(_,col)=><rect key={`${row}-${col}`} x={x+9+col*w/3.6} y={y-h+13+row*22} width="9" height="11" rx="1" fill={lit?"#eed09a":"#172b40"} opacity={lit?.8:.9}/>))}</g>}
function Flow({x1,y1,x2,y2,color=mint,width=4}:{x1:number;y1:number;x2:number;y2:number;color?:string;width?:number}){const a=Math.atan2(y2-y1,x2-x1);return <g><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={color} strokeWidth={width} strokeLinecap="round"/><path d="M-12-6L0 0L-12 6" transform={`translate(${x2} ${y2}) rotate(${a*180/Math.PI})`} fill="none" stroke={color} strokeWidth="3"/></g>}
export function EnvironmentalDisplay({slug,values:v,sample:m}:{slug:string;values:Values;sample:Sample}) {
 const id=useId().replaceAll(":",""),sky=`${id}-sky`,water=`${id}-water`,glow=`${id}-glow`;
 const day=slug.includes("grid")||slug.includes("smog")||slug.includes("heat-island")?Math.max(0,Math.sin(Math.PI*(m.time-6)/12)):.7;
 let scene:ReactNode;
 const coast=<><path d="M0 280Q120 235 240 280T480 270T720 270T900 265V460H0Z" fill="#254c56"/><path d="M0 316Q200 284 400 315T900 310V460H0Z" fill="#355e5a"/></>;
 if(slug==="greenhouse-effect-simulator")scene=<>
  <circle cx="95" cy="102" r="53" fill={`url(#${glow})`}/><circle cx="95" cy="102" r="30" fill={gold}/>
  <ellipse cx="465" cy="384" rx="252" ry="180" fill="#28648a"/><path d="M280 320Q330 240 405 230L457 252L420 298L472 330L420 345L405 393L346 365Z" fill="#52997c"/><path d="M523 232L590 264L606 309L557 330L527 291Z" fill="#5faa85"/>
  <path d="M185 335Q455-10 745 335" fill="none" stroke={blue} strokeWidth="34" opacity=".12"/><path d="M203 330Q460 33 725 330" fill="none" stroke={blue} strokeWidth="2" strokeDasharray="5 9"/>
  <Flow x1={140} y1={123} x2={321} y2={272} color={gold} width={6}/><Flow x1={318} y1={247} x2={251} y2={102} color={gold} width={3}/>
  <Flow x1={500} y1={284} x2={590} y2={94} color="#ffb698" width={5}/><Flow x1={576} y1={147} x2={612} y2={288} color="#ffb698" width={3}/>
  <Text x={50} y={184}>Incoming sunlight</Text><Text x={204} y={76}>Reflected</Text><Text x={615} y={93}>Infrared to space</Text><Text x={650} y={207}>Atmosphere</Text>
  <Text x={465} y={365} anchor="middle" size={24}>{m.surface.toFixed(2)}°C surface anomaly</Text><Text x={465} y={392} anchor="middle">Deep ocean: {m.deep.toFixed(2)}°C</Text>
  <Text x={30} y={435}>Energy imbalance: {m.imbalance.toFixed(2)} W/m²</Text><Text x={870} y={435} anchor="end">Arrows show energy pathways, not particles</Text>
 </>;
 else if(slug==="carbon-cycle-simulator")scene=<>
  {coast}<path d="M465 320Q660 290 900 310V460H465Z" fill={`url(#${water})`}/>
  <rect x="240" y="40" width="410" height="86" rx="43" fill="#456176" opacity=".85"/><Text x={445} y={75} anchor="middle">ATMOSPHERIC RESERVOIR</Text><Text x={445} y={106} anchor="middle" size={25}>{m.ppm.toFixed(1)} ppm CO₂</Text>
  {[70,120,185,235].map((x,i)=><Tree key={x} x={x} y={315+(i%2)*20} scale={1.1}/>)}<Building x={715} y={303} h={115}/><path d="M754 190V131h22v59" fill="#527087"/>
  <Flow x1={750} y1={140} x2={657} y2={100} color={gold} width={3+v.emissions/15}/><Flow x1={288} y1={142} x2={180} y2={238} width={3+m.landFlow/10}/><Flow x1={555} y1={142} x2={611} y2={284} color={blue} width={3+m.oceanFlow/10}/>
  <rect x="280" y="335" width="176" height="60" rx="8" fill="#182e3e" stroke="#7795a7"/><Flow x1={390} y1={145} x2={365} y2={316} width={2+v.removal/10}/>
  <Text x={365} y={360} anchor="middle">Engineered storage</Text><Text x={365} y={382} anchor="middle">{m.removed.toFixed(0)} GtCO₂</Text><Text x={35} y={384}>Land: {m.landStored.toFixed(0)} GtCO₂ stored</Text><Text x={560} y={355}>Ocean: {m.oceanStored.toFixed(0)} GtCO₂ stored</Text><Text x={676} y={102} color={gold}>{v.emissions} GtCO₂/yr</Text>
  <Text x={35} y={433}>Stocks accumulate; arrows represent annual flows.</Text>
 </>;
 else if(slug==="sea-level-rise-simulator"){
  const level=350-m.total*155;
  scene=<><path d="M320 460L380 350L505 287L900 247V460Z" fill="#8b8868"/><path d="M380 350L505 287L900 247" stroke="#78a486" strokeWidth="9"/><Building x={510} y={288} h={82}/><Building x={650} y={272} h={110}/><Tree x={793} y={260}/>
   <path d={`M0 ${level}H900V460H0Z`} fill={`url(#${water})`} opacity=".8"/><path d={`M0 ${level}H900`} stroke={blue} strokeWidth="3"/>
   <path d="M0 350H450" stroke={white} strokeDasharray="7 6" opacity=".65"/><Text x={22} y={341}>Starting sea level</Text><Text x={22} y={level-13} size={24}>+{m.total.toFixed(3)} m</Text>
   <path d="M844 75V350" stroke={white}/>{[0,.5,1,1.5].map(x=><g key={x}><path d={`M835 ${350-x*155}h18`} stroke={white}/><Text x={829} y={355-x*155} anchor="end">{x} m</Text></g>)}
   <Text x={25} y={50}>EXPANSION + LAND ICE + SINKING LAND</Text><Text x={25} y={79}>Subsidence contribution: {m.local.toFixed(3)} m</Text><Text x={25} y={433}>Illustrative coast · vertical scale exaggerated · no tides or storm surge</Text>
  </>;
 } else if(slug==="ocean-acidification-simulator")scene=<>
  <rect y="146" width="900" height="314" fill={`url(#${water})`}/><path d="M0 146Q75 127 150 146T300 146T450 146T600 146T750 146T900 146" fill="none" stroke={blue} strokeWidth="3"/>
  <Text x={35} y={53}>CO₂ in air → dissolved CO₂ → bicarbonate + hydrogen ions</Text><Text x={35} y={83} color={gold}>More hydrogen ions shift carbonate toward bicarbonate.</Text>
  {[170,425,690].map(x=><Flow key={x} x1={x} y1={104} x2={x} y2={190} color={blue}/>)}
  {Array.from({length:22},(_,i)=><g key={i} transform={`translate(${60+i*37} ${205+(i*53+m.time*3)%132})`}><circle r={i%3?4:7} fill={i%3?blue:gold} opacity=".55"/>{i%7===0&&<Text x={12} y={5}>H⁺</Text>}</g>)}
  <path d="M0 413Q230 380 440 416T900 401V460H0Z" fill="#776f5b"/>
  {[250,480,700].map((x,i)=><g key={x}><path d={`M${x-42} 401Q${x-50} ${325+i*10} ${x} ${325+i*10}Q${x+50} ${325+i*10} ${x+42} 401Z`} fill="#d4c6af" stroke="#efe3c9" strokeWidth="2"/>{[-25,-12,0,12,25].map(d=><path key={d} d={`M${x} ${332+i*10}L${x+d} 396`} stroke="#9b8d79"/>)}</g>)}
  <Text x={36} y={267} size={28}>pH {m.ph.toFixed(2)}</Text><Text x={36} y={293}>Still alkaline</Text><Text x={870} y={432} anchor="end">Shells illustrate a biological connection, not predicted health</Text>
 </>;
 else if(slug==="renewable-energy-grid-simulator"){
  const charge=clamp(m.soc/Math.max(1,v.storage)),angle=m.time*90;
  scene=<>{coast}<circle cx="115" cy={120+(1-day)*130} r="30" fill={gold} opacity={.15+.85*day}/>
   {[50,120,190].map(x=><g key={x}><path d={`M${x} 310l20-48h62l-20 48Z`} fill="#326c9c" stroke={blue}/><path d={`M${x+18} 271h59M${x+12} 286h58M${x+34} 264l-19 43M${x+56} 264l-19 43`} stroke="#73aacd" strokeWidth="1"/></g>)}
   {[335,420].map((x,i)=><g key={x}><path d={`M${x} 295V${166+i*28}`} stroke="#c1d4df" strokeWidth="6"/><g transform={`translate(${x} ${166+i*28}) rotate(${angle})`}>{[0,120,240].map(a=><path key={a} transform={`rotate(${a})`} d="M0 0L-5-55L4-65L7-15Z" fill="#c5dbe6"/>)}</g></g>)}
   <rect x="478" y="242" width="92" height="92" rx="9" fill="#173344" stroke={blue} strokeWidth="2"/><rect x="487" y={324-charge*71} width="74" height={charge*71} rx="3" fill={mint} opacity=".8"/><Text x={524} y={230} anchor="middle">{m.soc.toFixed(0)} / {v.storage} MWh</Text>
   {[650,744,822].map((x,i)=><Building key={x} x={x} y={315} w={45} h={80+i%2*40} lit={m.unmet<1}/>)}
   <Flow x1={70} y1={351} x2={824} y2={351} color={m.unmet>1?"#ffab87":mint}/><Text x={44} y={395}>Solar {m.solar.toFixed(0)} MW</Text><Text x={270} y={395}>Wind {m.wind.toFixed(0)} MW</Text><Text x={500} y={395}>{m.charge>.1?`Charging ${m.charge.toFixed(0)} MW`:`Discharging ${m.discharge.toFixed(0)} MW`}</Text><Text x={44} y={431}>Hydro {m.hydro.toFixed(0)} MW · Gas {m.gas.toFixed(0)} MW · Unmet {m.unmet.toFixed(1)} MW</Text>
  </>;
 } else if(slug==="air-pollution-smog-simulator"){
  const lid=230-v.inversion*1.4;
  scene=<>{coast}{[80,205,570,718].map((x,i)=><Building key={x} x={x} y={326} h={70+i*20} w={70}/>)}<path d="M752 193V108h23v85" fill="#6f889c"/>
   <rect y={lid} width="900" height={330-lid} fill="#b9a582" opacity={clamp(m.pm/500,0,.35)}/><path d={`M20 ${lid}H880`} stroke={gold} strokeDasharray="8 7" opacity=".7"/><Text x={30} y={lid-13} color={gold}>Mixing layer: {m.mixing.toFixed(0)} m (schematic)</Text>
   {Array.from({length:Math.min(90,Math.round(m.pm))},(_,i)=><circle key={i} cx={25+(i*87+m.time*v.wind*12)%840} cy={lid+14+(i*39)%Math.max(20,310-lid)} r={2+i%3} fill="#e5c28e" opacity=".5"/>)}
   <path d="M0 350H900" stroke="#637686" strokeWidth="25"/>{[100,330,540].map((x,i)=><g key={x} transform={`translate(${(x+m.time*24)%850} 337)`}><rect width="43" height="15" rx="5" fill={i%2?blue:gold}/><rect x="10" y="-8" width="23" height="12" rx="5" fill="#a9c4d0"/><circle cx="9" cy="15" r="5" fill="#142334"/><circle cx="34" cy="15" r="5" fill="#142334"/></g>)}
   <Text x={35} y={405}>PM₂.₅ {m.pm.toFixed(1)} µg/m³ · Ozone {m.ozone.toFixed(1)} ppb</Text><Text x={35} y={435}>Particles illustrate accumulation; visibility is not an air-quality measurement.</Text>
  </>;
 } else if(slug==="deforestation-water-cycle-simulator"){
  const treeCount=Math.round(v.forest/7);
  scene=<><path d="M0 200L170 225L430 332L630 349L900 362V460H0Z" fill="#8b7658"/><path d="M0 200L170 225L430 332L630 349L900 362" stroke="#529d74" strokeWidth="13"/><path d="M0 365L900 419V460H0Z" fill="#435e68"/>
   {Array.from({length:treeCount},(_,i)=>{const x=25+i*37;return <Tree key={i} x={x} y={x<170?200+x*.147:225+(x-170)*.411} scale={.65}/>})}
   {Array.from({length:Math.round(m.rainRate/2)},(_,i)=><path key={i} d={`M${30+i*25} ${55+(i*23+m.time*75)%90}l-6 20`} stroke={blue} strokeWidth="2"/>)}
   <Flow x1={220} y1={238} x2={490} y2={341} color={blue} width={2+Math.min(m.runoff/10,9)}/>{[130,260,390].map(x=><Flow key={x} x1={x} y1={245+(x-130)*.3} x2={x-7} y2={342+(x-130)*.18} width={2+Math.min(m.infiltration/20,4)}/>)}
   <Text x={540} y={120} size={23}>{m.rainRate.toFixed(1)} mm/hour rain</Text><Text x={540} y={157}>Runoff: {m.runoff.toFixed(1)} mm</Text><Text x={540} y={185}>Infiltration: {m.infiltration.toFixed(1)} mm</Text><Text x={540} y={213}>Canopy: {m.interception.toFixed(1)} mm</Text><Text x={25} y={436}>Blue: surface flow · Green: infiltration · cumulative depths per unit land area</Text>
  </>;
 } else if(slug==="biodiversity-habitat-fragmentation"){
  const network=habitatNetwork(v);
  scene=<><rect x="20" y="24" width="860" height="390" rx="22" fill="#334d44"/><path d="M30 190L260 280L520 180L860 290" stroke="#6d7465" strokeWidth="32" fill="none"/><path d="M30 190L260 280L520 180L860 290" stroke="#b2b49c" strokeDasharray="9 10" fill="none"/>
   <g transform="translate(110 0)">{network.nodes.map((a,i)=>network.nodes.slice(i+1).map((b,k)=>{const j=i+k+1,w=network.weights[i][j];return w>.03?<path key={`${i}-${j}`} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={mint} strokeWidth={2+v.corridor/8} opacity={.15+w}/>:null;}))}
    {network.nodes.map((node,i)=><g key={i}><circle cx={node.x} cy={node.y} r={node.radius} fill="#37735b" stroke="#8acba2" strokeWidth="2"/><circle cx={node.x} cy={node.y} r={node.radius*.86} fill={mint} opacity={m[`patch${i}`]}/><Text x={node.x} y={node.y+5} anchor="middle" size={14}>{Math.round(m[`patch${i}`]*100)}%</Text></g>)}</g>
   <Text x={35} y={51}>Fixed total habitat area: {v.habitat}%</Text><Text x={35} y={440}>Patch size represents area · color and number show occupancy probability · lines show dispersal links</Text>
  </>;
 } else if(slug==="urban-heat-island-simulator")scene=<>
  {coast}<rect y="327" width="900" height="90" fill="#4d5960"/><path d="M0 367H900" stroke="#aeb9bb" strokeDasharray="20 18"/>
  {[60,220,390,555,715].map((x,i)=><Building key={x} x={x} y={323} w={92} h={100+i%2*48} roof={i*20<v.coolRoofs?"#e0e9dc":"#465b66"}/>)}
  <rect y="318" width={900*v.permeable/100} height="16" fill="#65966e"/>{Array.from({length:Math.round(v.trees/5)},(_,i)=><Tree key={i} x={33+i*73} y={345} scale={.85}/>)}
  {[140,330,510,690].map(x=><path key={x} d={`M${x} 140q-20-20 0-40t0-40`} stroke="#ffc487" strokeWidth="4" opacity={clamp(m.anomaly/6)} fill="none"/>)}
  <Text x={30} y={46} size={24}>Neighborhood air {m.local.toFixed(1)}°C</Text><Text x={30} y={75}>Regional air {m.reference.toFixed(1)}°C · difference {m.anomaly.toFixed(2)}°C</Text><Text x={30} y={435}>Trees shade streets · reflective roofs absorb less sunlight · green strips represent permeable ground</Text>
 </>;
 else scene=<>
  {coast}{[300,420,560,690].map((x,i)=><Building key={x} x={x} y={313} w={70} h={80+i%2*45}/>)}
  <path d="M0 300Q120 240 255 310V390H0Z" fill="#367967"/>{[25,75,145,208].map(x=><Tree key={x} x={x} y={310} scale={.7}/>)}
  <rect x="0" y={385-Math.min(70,m.wetland*2)} width="250" height={Math.min(70,m.wetland*2)} fill={blue} opacity=".55"/><rect x="258" y={380-Math.min(100,m.ponding)} width="642" height={Math.min(100,m.ponding)} fill={blue} opacity=".55"/>
  <path d="M290 326H890" stroke="#aabac3" strokeWidth={3+v.barriers/4}/>{Array.from({length:Math.round(v.shade/5)},(_,i)=><Tree key={i} x={325+i*72} y={336} scale={.65}/>)}
  {Array.from({length:Math.round(m.rainRate)},(_,i)=><path key={i} d={`M${20+i*24} ${70+(i*27+m.time*50)%130}l-8 21`} stroke={blue} opacity=".55"/>)}
  <Text x={30} y={44}>WETLAND STORAGE</Text><Text x={450} y={44}>STREET + BUILDING THRESHOLDS</Text><Text x={30} y={412}>{m.wetland.toFixed(1)} / {(v.wetlands*.8).toFixed(0)} mm stored</Text><Text x={320} y={412}>Ponding {m.ponding.toFixed(1)} mm · threshold {m.threshold.toFixed(0)} mm</Text><Text x={30} y={441}>Schematic catchment · warning changes exposure, not water level</Text>
 </>;
 return <svg viewBox="0 0 900 460" role="img" aria-label={`${activitiesLabel(slug)} at ${m.time.toFixed(1)} model time. Read exact values in the instruments below.`}>
  <defs><linearGradient id={sky} x2="0" y2="1"><stop stopColor="#102435"/><stop offset="1" stopColor={day>.1?"#285367":"#152c42"}/></linearGradient><linearGradient id={water} x2="0" y2="1"><stop stopColor="#388cb6"/><stop offset="1" stopColor="#15445e"/></linearGradient><radialGradient id={glow}><stop stopColor={gold}/><stop offset="1" stopColor={gold} stopOpacity="0"/></radialGradient></defs><rect width="900" height="460" fill={`url(#${sky})`}/>{scene}
 </svg>;
}
function activitiesLabel(slug:string){return slug.replaceAll("-"," ");}
