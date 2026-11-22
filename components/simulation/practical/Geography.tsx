"use client";
import { useState } from "react";
import { PracticalWorkspace } from "./PracticalWorkspace";
import disputedAreas from "@/lib/simulations/practical/disputedAreas.json";
import countries from "@/lib/simulations/practical/countries.json";

const locations = [
  ["Italy", "I can see a boot-shaped peninsula stretching into the Mediterranean.", "The Alps rise to the north."],
  ["Japan", "My train crosses a volcanic island chain east of the Asian mainland.", "Mount Fuji rises above the Pacific coast."],
  ["Brazil", "I followed the Amazon downstream to a wide Atlantic estuary.", "The official language is Portuguese."],
  ["Egypt", "A broad river forms a triangular delta on the Mediterranean.", "My field notebook follows the Nile north."],
  ["Chile", "A narrow strip of land lies between the Pacific and the Andes.", "The Atacama Desert lies to my north."],
  ["Madagascar", "My field station is on a large island across the Mozambique Channel.", "Lemurs live in the surrounding forest."],
  ["Pakistan", "From the Karakoram I follow the Indus toward the Arabian Sea.", "The river passes through Sindh."],
  ["Norway", "Deep Atlantic fjords cut into the western side of a Scandinavian mountain range.", "My route continues north across the Arctic Circle."],
];
const mappedCountries = countries.filter(country => country.name !== "Antarctica");
const outline = (name: string) => countries.find(country => country.name === name)!;

// Natural Earth 1:10m Admin 0 disputed areas: claim, disputed, indeterminate and breakaway polygons.
export function DisputedAreas() {
  return <g fill="#43515d" stroke="white" strokeWidth="1.1" strokeLinejoin="round" pointerEvents="none">
    {disputedAreas.map((d,i) => <path key={i} d={d} vectorEffect="non-scaling-stroke"/>)}
  </g>;
}
export function MapLegend() {
  return <small className="mapLegend">White outlines mark disputed areas mapped by Natural Earth.</small>;
}

export function BorderLab() {
  const [longitude, setLongitude] = useState(0);
  const divided = mappedCountries.filter(c => c.spans.some(([min,max]) => min < longitude && max > longitude));
  const border = longitude === 0 ? "0°" : Math.abs(longitude) + (longitude < 0 ? "° W" : "° E");
  return <PracticalWorkspace scene={<svg viewBox="-180 -88 360 152" aria-label="World map showing the countries crossed by your border" role="img">
      <defs><linearGradient id="territory-colors" gradientUnits="userSpaceOnUse" x1="-180" x2="180"><stop offset={(longitude+180)/360} stopColor="#41848a"/><stop offset={(longitude+180)/360} stopColor="#626d9e"/></linearGradient></defs>
      {mappedCountries.map(c=><path key={c.name} d={c.path} fill="url(#territory-colors)" stroke={divided.includes(c) ? "#ffcf7c" : "#172733"} strokeWidth={divided.includes(c) ? 0.6 : 0.35}/>)}
      <DisputedAreas/>
      <line x1={longitude} x2={longitude} y1="-85" y2="60" stroke="white" strokeDasharray="2 1" strokeWidth=".7"/>
    </svg>}>
    <h2>Draw a border along a meridian</h2><p>Move the boundary between two imaginary territories. Predict whether 30° E cuts through more countries than 30° W.</p>
    <MapLegend/>
    <label>Fictional border · {border}<input type="range" min="-179" max="179" value={longitude} onChange={e=>setLongitude(+e.target.value)}/></label>
    <p><strong>{divided.length} mapped countries crossed</strong></p><p>{divided.map(c=>c.name).join(", ") || "This meridian crosses open water throughout the mapped territories."}</p>
    <small>Generalized Natural Earth outlines. The count excludes Antarctica and includes mapped islands.</small></PracticalWorkspace>;
}

function regionalView(path: string) {
  // Frame the main landmass first so distant territories do not shrink the target.
  const rings = path.split("M").filter(Boolean).map(ring => {
    const points = ring.match(/-?[\d.]+,-?[\d.]+/g)!.map(pair => pair.split(",").map(Number));
    const area = Math.abs(points.reduce((sum, [x, y], i) => {
      const next = points[(i + 1) % points.length];
      return sum + x * next[1] - y * next[0];
    }, 0));
    return { points, area };
  }).sort((a, b) => b.area - a.area);
  const points = rings[0].points;
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const left = Math.min(...xs), right = Math.max(...xs);
  const top = Math.min(...ys), bottom = Math.max(...ys);
  const height = Math.min(180, Math.max(9, (bottom-top)*1.8, right-left));
  const width = height*1.8;
  return [(left+right-width)/2, Math.max(-90, Math.min(90-height, (top+bottom-height)/2)), width, height].join(" ");
}

function SatelliteMap({ country }: { country: typeof countries[number] }) {
  return <svg viewBox={regionalView(country.path)} preserveAspectRatio="xMidYMid slice"
    style={{aspectRatio:"1.8"}} role="img" aria-label="Regional satellite map with the mystery country outlined in yellow">
    <defs><g id="quiz-satellite-tile">
      <image href="/textures/earth-day.jpg" x="-180" y="-90" width="360" height="180" preserveAspectRatio="none"/>
      <image href="/maps/country-quiz/boundaries.svg" x="-180" y="-90" width="360" height="180"/>
      <image href={`/maps/country-quiz/${encodeURIComponent(country.name)}.svg`} x="-180" y="-90" width="360" height="180"/>
      <DisputedAreas/>
    </g></defs>
    {[-360,0,360].map(x => <use key={x} href="#quiz-satellite-tile" x={x}/>)}
  </svg>;
}

export function GeographyQuiz({ field }: { field: boolean }) {
  const [round,setRound] = useState(0), [guess,setGuess] = useState(""), [score,setScore] = useState(0);
  const [offset,setOffset] = useState(0);
  const [worldwide,setWorldwide] = useState(false);
  const deck = worldwide ? mappedCountries.map(country => [country.name, "", ""]) : locations;
  const index = ((worldwide ? round : round * 3) + offset) % deck.length;
  const [name, observation, hint] = deck[index], country = outline(name);
  const count = field ? Math.min(8, 3 + round) : 4;
  const options = Array.from({length: count}, (_, i)=>deck[(index + i * 5) % deck.length][0]).sort();
  function advance() { setRound(round+1); setGuess(""); }
  if (round === deck.length) return <><h2>Expedition complete</h2><p>You identified {score} of {deck.length} destinations.</p><button onClick={()=>{setOffset((offset+1)%deck.length); setRound(0); setScore(0);}}>Play again</button></>;
  const referenceMap = <svg viewBox="-180 -85 360 145" role="img" aria-label={name+" highlighted on the world map"}>
    {mappedCountries.map(c=><path key={c.name} d={c.path} fill={c.name===name ? "#ffbc70" : "#425d69"} stroke="#142832" strokeWidth=".3"/>)}
    <DisputedAreas/>
  </svg>;
  const scene = field ? (guess ? referenceMap : <blockquote>{observation}</blockquote>) : <SatelliteMap country={country}/>;
  return <PracticalWorkspace scene={scene}>
    <div className="quizRoundBar">
      <p>Round {round+1} of {deck.length} · Score {score}</p>
      <button disabled={!guess} onClick={advance}>{round===deck.length-1 ? "See score" : "Next round"}</button>
    </div>
    {!field && <label>Country set<select value={worldwide ? "world" : "starter"} onChange={e=>{setWorldwide(e.target.value==="world");setScore(0);setGuess("");setRound(0);setOffset(0);}}><option value="starter">Starter set · 8 countries</option><option value="world">Full atlas · {mappedCountries.length} mapped outlines</option></select></label>}<h2>{field ? "Where was this field note written?" : "Which country is shown on this regional map?"}</h2>
    {!field && <details key={name}><summary>Show a location hint</summary><p>Look in {country.region}.</p></details>}
    <div className="quizChoices">{options.map(option=><button key={option} disabled={!!guess} onClick={()=>{setGuess(option); if(option===name) setScore(score+1);}}>{option}</button>)}</div>
    {guess && <div role="status"><p><strong>{guess===name ? "Correct." : "The answer is "+name+"."}</strong> {name} is in {country.region}. {hint}</p>
    {!field && referenceMap}
    </div>}
    {(!field || guess) && <MapLegend/>}</PracticalWorkspace>;
}
