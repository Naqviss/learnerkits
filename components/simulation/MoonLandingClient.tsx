"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as THREE from "three";
import { MoonLandingEngine, type MoonLandingState } from "@/lib/simulations/moonLanding/engine";
import { FixedStepRunner } from "@/lib/simulations/fixedStep";
import { MOON_GRAVITY } from "@/lib/physics/constants";
import type { Messages } from "@/lib/i18n/getMessages";
import { missions } from "@/lib/missions/catalog";
import { moonMissionComplete, moonScore } from "@/lib/missions/successConditions";
import { completeMission } from "@/lib/progression/storage";
import { t } from "@/lib/i18n/t";
import { loadSettings, prefersReducedMotion, renderProfile } from "@/lib/settings/storage";

const initialState = new MoonLandingEngine().getState();
const fmt = (n: number, digits = 1) => Number.isFinite(n) ? n.toFixed(digits) : "—";

export function MoonLandingClient({ m }: { m: Messages }) {
  const searchParams = useSearchParams();
  const selectedMission = missions.find((mission) => mission.id === searchParams.get("mission") && mission.simulation === "moonLanding");
  const host = useRef<HTMLDivElement>(null);
  const engineRef = useRef(new MoonLandingEngine());
  const runnerRef = useRef(new FixedStepRunner(1/120));
  const [state, setState] = useState<MoonLandingState>(initialState);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<"play"|"learn"|"experiment">("play");
  const [timeScale, setTimeScale] = useState(1);
  const [cameraMode, setCameraMode] = useState<"close"|"third"|"overview">("third");
  const cameraModeRef = useRef(cameraMode);
  const [experiment, setExperiment] = useState({ altitude: 1200, verticalVelocity: -34, fuelMass: 2700, maxThrust: 45000 });
  useEffect(() => { cameraModeRef.current = cameraMode; }, [cameraMode]);

  useEffect(() => {
    engineRef.current.handleInput({ throttle: .52 });
    setState(engineRef.current.getState());
    const key = (event: KeyboardEvent, down: boolean) => {
      if (["KeyW","KeyS","KeyA","KeyD"].includes(event.code)) event.preventDefault();
      const engine = engineRef.current;
      const s = engine.getState();
      if (!down) {
        if (event.code === "KeyA" || event.code === "KeyD") engine.handleInput({ rotate: 0 });
        return;
      }
      if (event.code === "KeyW") engine.handleInput({ throttle: Math.min(1, s.throttle + .07) });
      if (event.code === "KeyS") engine.handleInput({ throttle: Math.max(0, s.throttle - .07) });
      if (event.code === "KeyA") engine.handleInput({ rotate: -1 });
      if (event.code === "KeyD") engine.handleInput({ rotate: 1 });
    };
    const down=(e:KeyboardEvent)=>key(e,true), up=(e:KeyboardEvent)=>key(e,false);
    window.addEventListener("keydown",down); window.addEventListener("keyup",up);
    return()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up)};
  },[]);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);
    scene.fog = new THREE.FogExp2(0x02040a, .0014);
    const camera = new THREE.PerspectiveCamera(52, 1, .1, 5000);
    camera.position.set(0, 45, 88);
    camera.lookAt(0, 35, 0);
    const visualSettings = loadSettings();
    const profile = renderProfile(visualSettings.quality);
    const reduceMotion = prefersReducedMotion(visualSettings);
    const renderer = new THREE.WebGLRenderer({ antialias: visualSettings.quality !== "low", powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, profile.pixelRatioCap));
    renderer.shadowMap.enabled = profile.shadows;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xb9d7ff,0x16131a,1.6));
    const keyLight = new THREE.DirectionalLight(0xffffff,2.2); keyLight.position.set(-60,90,50); keyLight.castShadow=profile.shadows; scene.add(keyLight);
    const groundMat = new THREE.MeshStandardMaterial({color:0x6d6d72,roughness:.95,metalness:0});
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(520,140,1,1), groundMat); ground.rotation.x=-Math.PI/2; ground.position.y=-.15; ground.receiveShadow=true; scene.add(ground);
    const craterCount = visualSettings.quality === "low" ? 18 : visualSettings.quality === "medium" ? 26 : 34;
    for(let i=0;i<craterCount;i++){
      const r=.7+Math.random()*3.5; const crater=new THREE.Mesh(new THREE.RingGeometry(r*.55,r,24),new THREE.MeshStandardMaterial({color:0x3d3d43,side:THREE.DoubleSide}));
      crater.rotation.x=-Math.PI/2; crater.position.set((Math.random()-.5)*360,.01,(Math.random()-.5)*80); scene.add(crater);
    }
    const stars = new THREE.BufferGeometry(); const pts=[] as number[]; const moonStarCount = reduceMotion ? Math.min(profile.starCount, 260) : profile.starCount; for(let i=0;i<moonStarCount;i++)pts.push((Math.random()-.5)*500,Math.random()*300+20,-100-Math.random()*300); stars.setAttribute("position",new THREE.Float32BufferAttribute(pts,3)); scene.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0xffffff,size:.45,sizeAttenuation:true})));
    const earth = new THREE.Mesh(new THREE.SphereGeometry(7,32,32),new THREE.MeshStandardMaterial({color:0x2b78bf,roughness:.8})); earth.position.set(72,110,-170); scene.add(earth);

    const lander = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(2.7,3.5,5.4,8),new THREE.MeshStandardMaterial({color:0xd7dde5,metalness:.7,roughness:.3})); body.castShadow=true; lander.add(body);
    const cabin = new THREE.Mesh(new THREE.CylinderGeometry(2,2.7,2.4,8),new THREE.MeshStandardMaterial({color:0xb7c7d6,metalness:.55,roughness:.32})); cabin.position.y=3.5; cabin.castShadow=true; lander.add(cabin);
    const legMat=new THREE.MeshStandardMaterial({color:0xbec7d1,metalness:.8,roughness:.25});
    for(const x of [-1,1]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.32,5,.32),legMat);leg.position.set(x*3.5,-3.2,0);leg.rotation.z=x*.58;lander.add(leg)}
    const flame = new THREE.Mesh(new THREE.ConeGeometry(1.55,5,16),new THREE.MeshBasicMaterial({color:0x9feaff,transparent:true,opacity:.82})); flame.rotation.z=Math.PI; flame.position.y=-5.1; lander.add(flame);
    scene.add(lander);

    let previous=performance.now(); let raf=0; let uiClock=0;
    const resize=()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix()};
    const ro=new ResizeObserver(resize); ro.observe(container); resize();
    const loop=(now:number)=>{const frameDt=(now-previous)/1000;previous=now;if(!paused) runnerRef.current.advance(frameDt*timeScale,(dt)=>engineRef.current.update(dt));
      const s=engineRef.current.getState(); const scale=.045; lander.position.set(s.position.x*scale,Math.max(0,s.position.y*scale)+3.8,0); lander.rotation.z=-s.angle; flame.scale.y=Math.max(.05,s.throttle); flame.visible=s.status==="flying"&&s.throttle>.02&&s.fuelMass>0;
      const mode=cameraModeRef.current;
      if(mode==="overview"){camera.position.x+=(0-camera.position.x)*.04;camera.position.y+=(60-camera.position.y)*.04;camera.position.z+=(125-camera.position.z)*.04;camera.lookAt(0,26,0)}
      else if(mode==="close"){camera.position.x+=(lander.position.x-camera.position.x)*.06;camera.position.y+=(lander.position.y+7-camera.position.y)*.06;camera.position.z+=(34-camera.position.z)*.06;camera.lookAt(lander.position.x,lander.position.y,0)}
      else {const desiredY=Math.max(28,Math.min(70,lander.position.y+12));camera.position.x+=(lander.position.x-camera.position.x)*.035;camera.position.y+=(desiredY-camera.position.y)*.035;camera.position.z+=(88-camera.position.z)*.035;camera.lookAt(lander.position.x,Math.max(10,lander.position.y-4),0)}
      renderer.render(scene,camera); uiClock+=frameDt;if(uiClock>.08){uiClock=0;setState(s)} raf=requestAnimationFrame(loop)};
    raf=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose(); const mat=o.material; if(Array.isArray(mat))mat.forEach(x=>x.dispose());else mat.dispose()}});container.removeChild(renderer.domElement)};
  },[paused,timeScale]);

  const reset=()=>{engineRef.current.reset();engineRef.current.handleInput({throttle:.52});runnerRef.current.reset();setPaused(false);setState(engineRef.current.getState())};
  const applyExperiment=()=>{
    const fuel=Math.max(100,experiment.fuelMass);
    engineRef.current=new MoonLandingEngine({position:{x:0,y:Math.max(100,experiment.altitude)},velocity:{x:11,y:experiment.verticalVelocity},fuelMass:fuel,initialFuelMass:fuel,maxThrust:Math.max(5000,experiment.maxThrust)});
    engineRef.current.handleInput({throttle:.52});runnerRef.current.reset();setPaused(false);setState(engineRef.current.getState());
  };
  const fuelPct=100*state.fuelMass/state.initialFuelMass;
  const missionComplete = selectedMission ? moonMissionComplete(selectedMission.id, state) : false;
  const score = moonScore(state);
  useEffect(() => { if (selectedMission && missionComplete) completeMission(selectedMission.id, selectedMission.xp, score); }, [selectedMission, missionComplete, score]);
  return <main className="simLayout">
    <section className="simViewport" aria-label={m.moonLanding.title}>
      <div ref={host} className="threeHost"/>
      <div className="overlayTop"><h1>{m.moonLanding.title}</h1><p>{m.moonLanding.instructions}</p></div>
      {state.status!=="flying" && <div className="statusBanner"><strong>{state.status==="landed"?m.moonLanding.resultSafe:state.status==="hard-landing"?m.moonLanding.resultHard:m.moonLanding.resultCrash}</strong><span className="muted">{state.status==="landed"?m.moonLanding.safeReason:state.status==="hard-landing"?m.moonLanding.hardReason:m.moonLanding.crashReason} {m.moonLanding.retry}</span></div>}
    </section>
    <aside className="hud" aria-live="polite">
      <h2>{m.moonLanding.telemetry}</h2>
      {selectedMission&&<div className="card" style={{padding:12,marginBottom:12}}><span className="eyebrow">{m.missions.active}</span><h3 style={{marginBottom:5}}>{t(m,selectedMission.titleKey)}</h3><p className="muted" style={{fontSize:'.82rem'}}>{t(m,selectedMission.descriptionKey)}</p><span className="pill">{missionComplete?m.missions.complete:m.missions.inProgress}</span>{score>0&&<span className="pill">{m.missions.score}: {score}</span>}</div>}
      <div className="metric"><span>{m.common.altitude}</span><strong>{fmt(state.position.y)} m</strong></div>
      <div className="metric"><span>{m.common.verticalVelocity}</span><strong>{fmt(state.velocity.y)} m/s</strong></div>
      <div className="metric"><span>{m.common.horizontalVelocity}</span><strong>{fmt(state.velocity.x)} m/s</strong></div>
      <div className="metric"><span>{m.common.acceleration}</span><strong>{fmt(Math.hypot(state.acceleration.x,state.acceleration.y),2)} m/s²</strong></div>
      <div className="metric"><span>{m.common.fuel}</span><strong>{fmt(fuelPct,0)}%</strong></div>
      <div className="metric"><span>{m.common.mass}</span><strong>{fmt(state.dryMass+state.fuelMass,0)} kg</strong></div>
      <div className="metric"><span>{m.common.gravity}</span><strong>{MOON_GRAVITY.toFixed(2)} m/s²</strong></div>
      <div className="metric"><span>{m.common.status}</span><strong>{state.status}</strong></div>
      <div className="controlGroup"><label>{m.common.throttle}: {fmt(state.throttle*100,0)}%</label><input aria-label={m.common.throttle} type="range" min="0" max="1" step=".01" value={state.throttle} onChange={e=>{engineRef.current.handleInput({throttle:Number(e.target.value)});setState(engineRef.current.getState())}}/></div>
      <div className="controlGroup"><label>{m.common.controls}</label><div className="segmented"><button onPointerDown={()=>engineRef.current.handleInput({rotate:-1})} onPointerUp={()=>engineRef.current.handleInput({rotate:0})}>↶ A</button><button onPointerDown={()=>engineRef.current.handleInput({rotate:1})} onPointerUp={()=>engineRef.current.handleInput({rotate:0})}>D ↷</button></div></div>
      <div className="controlGroup"><label>{m.common.mode}</label><div className="segmented"><button className={mode==="play"?"active":""} onClick={()=>setMode("play")}>{m.common.play}</button><button className={mode==="learn"?"active":""} onClick={()=>setMode("learn")}>{m.common.learn}</button><button className={mode==="experiment"?"active":""} onClick={()=>setMode("experiment")}>{m.common.experiment}</button></div></div>
      {mode==="learn"&&<div className="card" style={{marginTop:14,padding:14}}><strong>{m.moonLanding.learnTitle}</strong><p className="muted" style={{fontSize:'.85rem',lineHeight:1.5}}>{m.moonLanding.learnBody}</p><div className="formula">a_net = F/m − 1.62 m/s²</div></div>}
      {mode==="experiment"&&<div className="card" style={{marginTop:14,padding:14}}><span className="muted">{m.common.experimentPreset}</span><p style={{fontSize:'.86rem'}}>{m.moonLanding.experimentCopy}</p><div className="miniGrid"><div className="field"><label>{m.common.startAltitude} (m)</label><input className="numberInput" type="number" value={experiment.altitude} onChange={e=>setExperiment(v=>({...v,altitude:Number(e.target.value)}))}/></div><div className="field"><label>{m.common.startVelocity} (m/s)</label><input className="numberInput" type="number" value={experiment.verticalVelocity} onChange={e=>setExperiment(v=>({...v,verticalVelocity:Number(e.target.value)}))}/></div><div className="field"><label>{m.common.fuelMass} (kg)</label><input className="numberInput" type="number" value={experiment.fuelMass} onChange={e=>setExperiment(v=>({...v,fuelMass:Number(e.target.value)}))}/></div><div className="field"><label>{m.common.maxThrust} (N)</label><input className="numberInput" type="number" value={experiment.maxThrust} onChange={e=>setExperiment(v=>({...v,maxThrust:Number(e.target.value)}))}/></div></div><button className="button" style={{marginTop:10}} onClick={applyExperiment}>{m.common.applyRestart}</button></div>}
      <div className="controlGroup"><label>{m.common.camera}</label><div className="segmented"><button className={cameraMode==="close"?"active":""} onClick={()=>setCameraMode("close")}>{m.common.closeCamera}</button><button className={cameraMode==="third"?"active":""} onClick={()=>setCameraMode("third")}>{m.common.thirdPerson}</button><button className={cameraMode==="overview"?"active":""} onClick={()=>setCameraMode("overview")}>{m.common.overview}</button></div></div>
      <div className="controlGroup"><label>{m.common.timeScale}</label><select className="langSelect" value={timeScale} onChange={e=>setTimeScale(Number(e.target.value))}><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></div>
      <div className="actions"><button className="button" onClick={()=>setPaused(v=>!v)}>{paused?m.common.resume:m.common.pause}</button><button className="button" onClick={reset}>{m.common.restart}</button></div>
    </aside>
  </main>;
}
