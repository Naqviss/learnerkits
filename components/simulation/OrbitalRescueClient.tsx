"use client";
import { SIMULATION_LEARNING_TOOLS_ENABLED } from "@/lib/settings/simulationFeatures";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { createApproachPractice, OrbitalRescueEngine, type BurnDirection, type OrbitalState } from "@/lib/simulations/orbitalRescue/engine";
import { FixedStepRunner } from "@/lib/simulations/fixedStep";
import { EARTH_MU, EARTH_RADIUS } from "@/lib/physics/constants";
import type { Messages } from "@/lib/i18n/getMessages";
import { missions } from "@/lib/missions/catalog";
import { orbitMissionComplete, orbitalScore } from "@/lib/missions/successConditions";
import { completeMission } from "@/lib/progression/storage";
import { t } from "@/lib/i18n/t";
import { loadSettings, prefersReducedMotion, renderProfile } from "@/lib/settings/storage";

const initialEngine = new OrbitalRescueEngine();
const fmt=(n:number,d=1)=>Number.isFinite(n)?n.toFixed(d):"—";
export function OrbitalRescueClient({m}:{m:Messages}){
  const searchParams=useSearchParams();
  const selectedMission=SIMULATION_LEARNING_TOOLS_ENABLED?missions.find((mission)=>mission.id===searchParams.get("mission")&&mission.simulation==="orbitalRescue") : undefined;
  const host=useRef<HTMLDivElement>(null); const engineRef=useRef(new OrbitalRescueEngine()); const runnerRef=useRef(new FixedStepRunner(.25,32,5));
  const [state,setState]=useState<OrbitalState>(initialEngine.getState()); const [telemetry,setTelemetry]=useState(initialEngine.telemetry());
  const [paused,setPaused]=useState(false); const [timeScale,setTimeScale]=useState(10); const [mode,setMode]=useState<"play"|"learn"|"experiment">("play");
  const [practice,setPractice]=useState(false);
  const [showInstructions,setShowInstructions]=useState(true);
  const [mapOnly,setMapOnly]=useState(false);
  const playback=useRef({paused,timeScale});playback.current={paused,timeScale};
  const [experiment,setExperiment]=useState({altitudeKm:400,targetAltitudeKm:430,dryMass:8000,fuelMass:3500,maxThrust:120000});
  const [portalTargets,setPortalTargets]=useState<{guide:HTMLElement|null;measurements:HTMLElement|null}>({guide:null,measurements:null});
  useEffect(()=>{setPortalTargets({guide:document.getElementById("simulation-guide-extension"),measurements:document.getElementById("simulation-measurements-extension")});},[]);
  useEffect(()=>{if(!host.current)return;const container=host.current;const scene=new THREE.Scene();scene.background=new THREE.Color(0x01040b);const camera=new THREE.OrthographicCamera(-10,10,10,-10,.1,100);camera.position.set(0,0,25);camera.lookAt(0,0,0);const visualSettings=loadSettings();const profile=renderProfile(visualSettings.quality);const reduceMotion=prefersReducedMotion(visualSettings);let renderer:THREE.WebGLRenderer|null=null;
    try {
      renderer=new THREE.WebGLRenderer({antialias:visualSettings.quality!=="low",powerPreference:"high-performance"});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,profile.pixelRatioCap));
      container.appendChild(renderer.domElement);
    } catch { setMapOnly(true); }
    scene.add(new THREE.AmbientLight(0x6e8fc7,1.2));const sun=new THREE.DirectionalLight(0xffffff,2.3);sun.position.set(-8,5,10);scene.add(sun);
    const loader = new THREE.TextureLoader();
    const surface = loader.load("/textures/earth-day.jpg");
    surface.colorSpace = THREE.SRGBColorSpace;
    const cloudMap = loader.load("/textures/earth-clouds.png");
    cloudMap.colorSpace = THREE.SRGBColorSpace;
    const earth = new THREE.Mesh(new THREE.SphereGeometry(5.35,64,48),new THREE.MeshStandardMaterial({map:surface,roughness:.83}));
    earth.rotation.set(.14,-1.25,.41);
    scene.add(earth);
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(5.38,64,48),new THREE.MeshStandardMaterial({map:cloudMap,transparent:true,opacity:.88,depthWrite:false}));
    earth.add(clouds);
    const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(5.52,48,48),new THREE.MeshBasicMaterial({color:0x70d9ff,transparent:true,opacity:.08,side:THREE.BackSide}));scene.add(atmosphere);
    const starGeo=new THREE.BufferGeometry();const pts=[] as number[];const orbitalStarCount=reduceMotion?Math.min(profile.starCount,300):profile.starCount;for(let i=0;i<orbitalStarCount;i++)pts.push((Math.random()-.5)*60,(Math.random()-.5)*40,-5-Math.random()*20);starGeo.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xffffff,size:.035})));
    const ship=new THREE.Mesh(new THREE.ConeGeometry(.13,.38,7),new THREE.MeshStandardMaterial({color:0xf2f4f8,metalness:.7,roughness:.25}));scene.add(ship);const target=new THREE.Mesh(new THREE.BoxGeometry(.26,.16,.12),new THREE.MeshStandardMaterial({color:0xffdb82,metalness:.65,roughness:.3}));scene.add(target);
    const panelMaterial = new THREE.MeshStandardMaterial({color:0x426caa,metalness:.35,roughness:.45});
    for (const side of [-1,1]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(.25,.12,.025),panelMaterial);
      panel.position.x = side * .26;
      target.add(panel);
    }
    const shipHistory:number[]=[];const lineGeo=new THREE.BufferGeometry();const lineMat=new THREE.LineBasicMaterial({color:0x86e8ff,transparent:true,opacity:.55});const line=new THREE.Line(lineGeo,lineMat);scene.add(line);
    const scale=5.35/EARTH_RADIUS;let previous=performance.now(),uiClock=0,historyClock=0,raf=0,lastElapsed=0;
    const resize=()=>{const w=container.clientWidth,h=container.clientHeight,aspect=w/Math.max(1,h);const extent=7.6/Math.min(1,aspect||1);camera.left=-extent*aspect;camera.right=extent*aspect;camera.top=extent;camera.bottom=-extent;camera.updateProjectionMatrix();renderer?.setSize(w,h,false)};const ro=new ResizeObserver(resize);ro.observe(container);resize();
    const loop=(now:number)=>{const frame=Math.min(.1,(now-previous)/1000);previous=now;if(!playback.current.paused&&!document.hidden)runnerRef.current.advance(frame*playback.current.timeScale,(dt)=>engineRef.current.update(dt));const s=engineRef.current.getState();if(s.elapsed<lastElapsed){shipHistory.length=0;lineGeo.setAttribute("position",new THREE.Float32BufferAttribute([],3));}lastElapsed=s.elapsed;ship.position.set(s.position.x*scale,s.position.y*scale,0);target.position.set(s.targetPosition.x*scale,s.targetPosition.y*scale,0);ship.rotation.z=Math.atan2(s.velocity.y,s.velocity.x)-Math.PI/2;target.rotation.z=Math.atan2(s.targetVelocity.y,s.targetVelocity.x);
      if(!playback.current.paused&&!document.hidden)historyClock+=frame;if(historyClock>.12){historyClock=0;shipHistory.push(ship.position.x,ship.position.y,0);if(shipHistory.length>900)shipHistory.splice(0,3);lineGeo.setAttribute("position",new THREE.Float32BufferAttribute(shipHistory,3))}
      earth.rotation.y=-1.25+s.elapsed*2*Math.PI/86164;renderer?.render(scene,camera);uiClock+=frame;if(uiClock>.1){uiClock=0;setState(s);setTelemetry(engineRef.current.telemetry())}raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer?.dispose();surface.dispose();cloudMap.dispose();lineGeo.dispose();lineMat.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points){o.geometry.dispose();const mat=o.material;if(Array.isArray(mat))mat.forEach(x=>x.dispose());else mat.dispose()}});if(renderer)container.removeChild(renderer.domElement)}
  },[]);
  const setDirection=(direction:BurnDirection)=>{engineRef.current.handleInput({direction});setState(engineRef.current.getState())};
  const reset=()=>{engineRef.current.reset();runnerRef.current.reset();setPaused(practice);setState(engineRef.current.getState());setTelemetry(engineRef.current.telemetry())};
  function changeScenario() {
    engineRef.current = practice ? new OrbitalRescueEngine() : createApproachPractice();
    runnerRef.current.reset();
    setTimeScale(practice ? 10 : 1);
    setPaused(!practice);
    setPractice(!practice);
    setState(engineRef.current.getState());
    setTelemetry(engineRef.current.telemetry());
  }
  const applyExperiment=()=>{
    setPractice(false);
    const r=EARTH_RADIUS+Math.max(120,experiment.altitudeKm)*1000;
    const tr=EARTH_RADIUS+Math.max(120,experiment.targetAltitudeKm)*1000;
    const speed=Math.sqrt(EARTH_MU/r);const targetSpeed=Math.sqrt(EARTH_MU/tr);const fuel=Math.max(100,experiment.fuelMass);
    engineRef.current=new OrbitalRescueEngine({position:{x:r,y:0},velocity:{x:0,y:speed*.995},targetPosition:{x:0,y:tr},targetVelocity:{x:-targetSpeed,y:0},dryMass:Math.max(500,experiment.dryMass),fuelMass:fuel,initialFuelMass:fuel,maxThrust:Math.max(1000,experiment.maxThrust)});
    runnerRef.current.reset();setPaused(false);setState(engineRef.current.getState());setTelemetry(engineRef.current.telemetry());
  };
  const fuelPct=100*state.fuelMass/state.initialFuelMass;
  const orbitContext={state,altitude:telemetry.altitude,targetDistance:telemetry.targetDistance,relativeVelocity:telemetry.relativeVelocity};
  const missionComplete=selectedMission?orbitMissionComplete(selectedMission.id,orbitContext):false;
  const score=orbitalScore(orbitContext);
  useEffect(()=>{if(selectedMission&&missionComplete)completeMission(selectedMission.id,selectedMission.xp,score)},[selectedMission,missionComplete,score]);
  return <div className="simLayout rescueLayout"><section className="simViewport" aria-label={m.orbitalRescue.title}><div ref={host} className="threeHost"/>{showInstructions&&<div id="rescue-flight-instructions" className="overlayTop"><strong className="simulationSceneTitle">{m.orbitalRescue.title}</strong><p>{m.orbitalRescue.instructions}</p></div>}{mapOnly&&<svg className="rescueMap" viewBox="-9 -9 18 18" role="img" aria-label="Orbital map with rescue ship in blue and target in gold">
      <circle r="5.35" fill="#235886"/>
      {[{pos:state.position,color:"#86e8ff"},{pos:state.targetPosition,color:"#ffdb82"}].map(({pos,color})=><circle key={color} cx={pos.x*5.35/EARTH_RADIUS} cy={-pos.y*5.35/EARTH_RADIUS} r=".14" fill={color}/>)}
    </svg>}{state.status!=="active"&&<div className="statusBanner"><strong>{state.status==="rescued"?m.orbitalRescue.rescued:state.status==="reentry"?m.orbitalRescue.reentry:m.orbitalRescue.escaped}</strong><span className="muted">{state.status==="rescued"?m.orbitalRescue.rescuedReason:state.status==="reentry"?m.orbitalRescue.reentryReason:m.orbitalRescue.escapedReason}</span></div>}</section>
    <aside className="hud rescueHud">
      <div className="rescueHeader"><h2>Flight controls</h2><label className="moonInstructionsToggle"><input type="checkbox" checked={showInstructions} onChange={event=>setShowInstructions(event.target.checked)} aria-controls="rescue-flight-instructions"/> Show instructions</label></div>
      {selectedMission&&<div className="card" style={{padding:12,marginBottom:12}}><span className="eyebrow">{m.missions.active}</span><h3 style={{marginBottom:5}}>{t(m,selectedMission.titleKey)}</h3><p className="muted" style={{fontSize:'.82rem'}}>{t(m,selectedMission.descriptionKey)}</p><span className="pill">{missionComplete?m.missions.complete:m.missions.inProgress}</span>{score>0&&<span className="pill">{m.missions.score}: {score}</span>}</div>}
      <div className="rescueReadings">
        <div><span>{m.orbitalRescue.distance}</span><strong>{fmt(telemetry.targetDistance/1000,1)} km</strong></div>
        <div><span>{m.orbitalRescue.relativeVelocity}</span><strong>{fmt(telemetry.relativeVelocity,1)} m/s</strong></div>
        <div><span>{m.common.altitude}</span><strong>{fmt(telemetry.altitude/1000,0)} km</strong></div>
        <div><span>{m.common.fuel}</span><strong>{fmt(fuelPct,0)}%</strong></div>
      </div>
      <div className="controlGroup"><label htmlFor="rescue-throttle">{m.common.throttle}: {fmt(state.thrust*100,0)}%</label><input id="rescue-throttle" type="range" min="0" max="1" step=".01" value={state.thrust} onChange={e=>{engineRef.current.handleInput({thrust:Number(e.target.value)});setState(engineRef.current.getState())}}/></div>
      <div className="controlGroup"><label>{m.orbitalRescue.direction}</label><div className="segmented">{([['none',m.orbitalRescue.none],['prograde',m.orbitalRescue.prograde],['retrograde',m.orbitalRescue.retrograde],['radial-out',m.orbitalRescue.radialOut],['radial-in',m.orbitalRescue.radialIn]] as [BurnDirection,string][]).map(([d,label])=><button key={d} type="button" aria-pressed={state.direction===d} className={state.direction===d?"active":""} onClick={()=>setDirection(d)}>{label}</button>)}</div></div>

      <div className="rescuePlayback">
        <label>{m.common.timeScale}<select className="langSelect" value={timeScale} onChange={e=>setTimeScale(Number(e.target.value))}><option value="1">1×</option><option value="10">10×</option><option value="25">25×</option><option value="50">50×</option></select></label>
        <button className="button" type="button" onClick={()=>setPaused(v=>!v)}>{paused?m.common.resume:m.common.pause}</button>
        <button className="button" type="button" onClick={reset}>{m.common.restart}</button>
      </div>
      <div className="rescueBrief"><strong>{practice?"Final approach practice":"Rendezvous objective"}</strong>
      <p>Bring the rescue ship within 4 km of the gold target at less than 8 m/s relative speed.</p>
      {practice&&<p>{state.status==="rescued"?"You matched the target’s motion. Compare your relative speed with your much higher speed around Earth.":"You start 3 km behind, moving faster than the target. Select Retrograde, set about 10% throttle, then resume at 1×. Watch relative speed fall."}</p>}
      {!selectedMission&&<button type="button" className="button" onClick={changeScenario}>{practice?"Return to full orbit":"Practice final approach"}</button>}
    </div>
      <details className="rescueMore"><summary>Learning &amp; experiment</summary>
      <div className="controlGroup"><label>{m.common.mode}</label><div className="segmented"><button className={mode==="play"?"active":""} onClick={()=>setMode("play")}>{m.common.play}</button><button className={mode==="learn"?"active":""} onClick={()=>setMode("learn")}>{m.common.learn}</button><button className={mode==="experiment"?"active":""} onClick={()=>setMode("experiment")}>{m.common.experiment}</button></div></div>
      {mode==="learn"&&<div className="card" style={{marginTop:14,padding:14}}><p className="muted" style={{fontSize:'.85rem'}}>{m.orbitalRescue.learnBody}</p><div className="formula">ε = v²/2 − μ/r</div></div>}
      {mode==="experiment"&&<div className="card" style={{marginTop:14,padding:14}}><p className="muted" style={{fontSize:'.85rem'}}>{m.orbitalRescue.experimentCopy}</p><div className="miniGrid"><div className="field"><label>{m.orbitalRescue.startAltitude} (km)</label><input className="numberInput" type="number" value={experiment.altitudeKm} onChange={e=>setExperiment(v=>({...v,altitudeKm:Number(e.target.value)}))}/></div><div className="field"><label>{m.orbitalRescue.targetAltitude} (km)</label><input className="numberInput" type="number" value={experiment.targetAltitudeKm} onChange={e=>setExperiment(v=>({...v,targetAltitudeKm:Number(e.target.value)}))}/></div><div className="field"><label>{m.common.spacecraftMass} (kg)</label><input className="numberInput" type="number" value={experiment.dryMass} onChange={e=>setExperiment(v=>({...v,dryMass:Number(e.target.value)}))}/></div><div className="field"><label>{m.common.fuelMass} (kg)</label><input className="numberInput" type="number" value={experiment.fuelMass} onChange={e=>setExperiment(v=>({...v,fuelMass:Number(e.target.value)}))}/></div><div className="field"><label>{m.common.maxThrust} (N)</label><input className="numberInput" type="number" value={experiment.maxThrust} onChange={e=>setExperiment(v=>({...v,maxThrust:Number(e.target.value)}))}/></div></div><button className="button" style={{marginTop:10}} onClick={applyExperiment}>{m.common.applyRestart}</button></div>}

      </details>
    </aside>
    {portalTargets.guide&&createPortal(<section className="spaceMissionExtension" aria-labelledby="orbital-rescue-guide-title"><header><span>SPACE MISSION GUIDE</span><h3 id="orbital-rescue-guide-title">Plan an orbital rendezvous</h3></header><p>{m.orbitalRescue.instructions}</p><h3>How to explore</h3><ol><li>Compare your altitude, orbital velocity, and the target orbit.</li><li>Choose a burn direction and apply a small amount of thrust.</li><li>Coast and observe how the orbit and relative velocity change.</li><li>Open Measurements to record the closest approach and remaining delta-v.</li></ol><h3>Physics represented by this model</h3><p>{m.orbitalRescue.learnBody}</p><div className="simulationConceptFormula">ε = v²/2 − μ/r</div></section>,portalTargets.guide)}
    {portalTargets.measurements&&createPortal(<section className="spaceMissionExtension" aria-labelledby="orbital-rescue-measurements-title"><header><span>LIVE MISSION TELEMETRY</span><h3 id="orbital-rescue-measurements-title">Measurements & orbital conditions</h3></header><dl><div><dt>{m.common.altitude}</dt><dd>{fmt(telemetry.altitude/1000,0)} km</dd></div><div><dt>{m.common.velocity}</dt><dd>{fmt(telemetry.speed/1000,3)} km/s</dd></div><div><dt>{m.orbitalRescue.orbitalVelocity}</dt><dd>{fmt(telemetry.circularSpeed/1000,3)} km/s</dd></div><div><dt>{m.orbitalRescue.deltaV}</dt><dd>{fmt(telemetry.deltaVRemaining,0)} m/s</dd></div><div><dt>{m.common.fuel}</dt><dd>{fmt(fuelPct,0)}%</dd></div><div><dt>{m.orbitalRescue.energy}</dt><dd>{fmt(telemetry.orbitalEnergy/1e6,2)} MJ/kg</dd></div><div><dt>{m.orbitalRescue.distance}</dt><dd>{fmt(telemetry.targetDistance/1000,1)} km</dd></div><div><dt>{m.orbitalRescue.relativeVelocity}</dt><dd>{fmt(telemetry.relativeVelocity,1)} m/s</dd></div></dl><a href="#simulation">Return to simulation</a></section>,portalTargets.measurements)}
    </div>
}
