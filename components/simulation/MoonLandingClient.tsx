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

function makeTerrain(quality: "low" | "medium" | "high") {
  const segments = quality === "low" ? 44 : quality === "medium" ? 60 : 76;
  const geometry = new THREE.PlaneGeometry(520, 150, segments, 22);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const z = positions.getY(i);
    const edgeFade = Math.min(1, Math.abs(x) / 120);
    const ripple = Math.sin(x * 0.12) * 0.18 + Math.cos(z * 0.2) * 0.11;
    positions.setZ(i, ripple * (0.45 + edgeFade * 1.2) + (Math.random() - 0.5) * 0.08);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createCrater(x: number, z: number, radius: number) {
  const group = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.7, 28), new THREE.MeshStandardMaterial({ color: 0x292a31, roughness: 1, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.04;
  const rim = new THREE.Mesh(new THREE.RingGeometry(radius * 0.7, radius, 28), new THREE.MeshStandardMaterial({ color: 0x666671, roughness: 1, metalness: 0, side: THREE.DoubleSide }));
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = 0.07;
  group.add(floor, rim);
  group.position.set(x, 0, z);
  return group;
}

export function MoonLandingClient({ m }: { m: Messages }) {
  const searchParams = useSearchParams();
  const selectedMission = missions.find((mission) => mission.id === searchParams.get("mission") && mission.simulation === "moonLanding");
  const host = useRef<HTMLDivElement>(null);
  const engineRef = useRef(new MoonLandingEngine());
  const runnerRef = useRef(new FixedStepRunner(1 / 120));
  const pausedRef = useRef(false);
  const timeScaleRef = useRef(1);
  const cameraModeRef = useRef<"close" | "third" | "overview">("third");
  const [state, setState] = useState<MoonLandingState>(initialState);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<"play" | "learn" | "experiment">("play");
  const [timeScale, setTimeScale] = useState(1);
  const [cameraMode, setCameraMode] = useState<"close" | "third" | "overview">("third");
  const [experiment, setExperiment] = useState({ altitude: 1200, verticalVelocity: -34, fuelMass: 2700, maxThrust: 45000 });

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    engineRef.current.handleInput({ throttle: 0.52 });
    setState(engineRef.current.getState());

    const key = (event: KeyboardEvent, down: boolean) => {
      if (["KeyW", "KeyS", "KeyA", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
      if (!down) {
        if (["KeyA", "KeyD", "ArrowLeft", "ArrowRight"].includes(event.code)) engineRef.current.handleInput({ rotate: 0 });
        return;
      }
      const engine = engineRef.current;
      const s = engine.getState();
      if (event.code === "KeyW" || event.code === "ArrowUp") engine.handleInput({ throttle: Math.min(1, s.throttle + 0.06) });
      if (event.code === "KeyS" || event.code === "ArrowDown") engine.handleInput({ throttle: Math.max(0, s.throttle - 0.06) });
      if (event.code === "KeyA" || event.code === "ArrowLeft") engine.handleInput({ rotate: -1 });
      if (event.code === "KeyD" || event.code === "ArrowRight") engine.handleInput({ rotate: 1 });
      if (event.code === "Space" && !event.repeat) {
        setPaused((value) => {
          pausedRef.current = !value;
          return !value;
        });
      }
      if (event.code === "KeyR" && !event.repeat) reset();
    };
    const down = (event: KeyboardEvent) => key(event, true);
    const up = (event: KeyboardEvent) => key(event, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    const settings = loadSettings();
    const profile = renderProfile(settings.quality);
    const reduceMotion = prefersReducedMotion(settings);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03060d);
    scene.fog = new THREE.FogExp2(0x03060d, 0.0011);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 5000);
    camera.position.set(0, 42, 92);

    const renderer = new THREE.WebGLRenderer({ antialias: settings.quality !== "low", powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, profile.pixelRatioCap));
    renderer.shadowMap.enabled = profile.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xaec9e9, 0x18151b, 1.45));
    const sun = new THREE.DirectionalLight(0xfff6dc, 3.3);
    sun.position.set(-95, 125, 60);
    sun.castShadow = profile.shadows;
    sun.shadow.mapSize.set(profile.shadows ? 2048 : 512, profile.shadows ? 2048 : 512);
    sun.shadow.camera.left = -90;
    sun.shadow.camera.right = 90;
    sun.shadow.camera.top = 90;
    sun.shadow.camera.bottom = -90;
    scene.add(sun);

    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x70717b, roughness: 1, metalness: 0 });
    const ground = new THREE.Mesh(makeTerrain(settings.quality), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.12;
    ground.receiveShadow = true;
    scene.add(ground);

    const craterCount = settings.quality === "low" ? 15 : settings.quality === "medium" ? 22 : 30;
    for (let i = 0; i < craterCount; i += 1) scene.add(createCrater((Math.random() - 0.5) * 370, (Math.random() - 0.5) * 84, 0.8 + Math.random() * 4.4));

    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x4b4c55, roughness: 1, metalness: 0 });
    for (let i = 0; i < (settings.quality === "low" ? 16 : 28); i += 1) {
      const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 + Math.random() * 1.6, 0), rockMaterial);
      rock.position.set((Math.random() - 0.5) * 380, 0.7, (Math.random() - 0.5) * 70);
      rock.scale.y = 0.45 + Math.random() * 0.7;
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = profile.shadows;
      scene.add(rock);
    }

    const target = new THREE.Group();
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(10.5, 10.5, 0.12, 64), new THREE.MeshStandardMaterial({ color: 0x293443, roughness: 0.72, metalness: 0.25, emissive: 0x07121f, emissiveIntensity: 0.8 }));
    pad.position.y = 0.06;
    pad.receiveShadow = true;
    target.add(pad);
    const padRing = new THREE.Mesh(new THREE.RingGeometry(9.25, 10.2, 64), new THREE.MeshBasicMaterial({ color: 0x8fd8ff, transparent: true, opacity: 0.82, side: THREE.DoubleSide }));
    padRing.rotation.x = -Math.PI / 2;
    padRing.position.y = 0.14;
    target.add(padRing);
    const beaconPole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 3.4, 8), new THREE.MeshStandardMaterial({ color: 0xc5e8f4, emissive: 0x2b8eb8, emissiveIntensity: 1.7, metalness: 0.55, roughness: 0.3 }));
    beaconPole.position.set(0, 1.7, -7.3);
    target.add(beaconPole);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), new THREE.MeshBasicMaterial({ color: 0xb9f2ff }));
    beacon.position.set(0, 3.45, -7.3);
    target.add(beacon);
    const beaconLight = new THREE.PointLight(0x55d7ff, 3.2, 30, 2);
    beaconLight.position.copy(beacon.position);
    target.add(beaconLight);
    scene.add(target);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    const starCount = reduceMotion ? Math.min(profile.starCount, 260) : profile.starCount;
    for (let i = 0; i < starCount; i += 1) starPositions.push((Math.random() - 0.5) * 560, Math.random() * 320 + 20, -115 - Math.random() * 340);
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xdbe9ff, size: 0.45, sizeAttenuation: true, transparent: true, opacity: 0.9 }));
    scene.add(stars);

    const earth = new THREE.Group();
    const earthCore = new THREE.Mesh(new THREE.SphereGeometry(7.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0x2674bd, roughness: 0.86, metalness: 0.05, emissive: 0x071d3b, emissiveIntensity: 0.55 }));
    earthCore.castShadow = true;
    earth.add(earthCore);
    earth.add(new THREE.Mesh(new THREE.SphereGeometry(7.9, 32, 32), new THREE.MeshBasicMaterial({ color: 0x6ebcff, transparent: true, opacity: 0.18, side: THREE.BackSide })));
    earth.position.set(77, 112, -174);
    scene.add(earth);

    const lander = new THREE.Group();
    const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: 0xd7dde3, roughness: 0.3, metalness: 0.64, clearcoat: 0.24 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x283340, roughness: 0.34, metalness: 0.8 });
    const goldFoil = new THREE.MeshStandardMaterial({ color: 0xd4a957, roughness: 0.48, metalness: 0.68 });
    const windowMaterial = new THREE.MeshPhysicalMaterial({ color: 0x071927, roughness: 0.15, metalness: 0.38, clearcoat: 0.55, emissive: 0x071c2b, emissiveIntensity: 1.1 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.5, 4.8, 8), bodyMaterial);
    body.castShadow = true;
    lander.add(body);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.5, 1.2, 8), goldFoil);
    tank.position.y = -2.45;
    tank.castShadow = true;
    lander.add(tank);
    const cabin = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.65, 2.15, 8), bodyMaterial);
    cabin.position.y = 3.35;
    cabin.castShadow = true;
    lander.add(cabin);
    const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.72, 0.12), windowMaterial);
    frontWindow.position.set(0, 3.45, 2.2);
    frontWindow.castShadow = true;
    lander.add(frontWindow);
    const instrumentBox = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.72, 0.66), darkMetal);
    instrumentBox.position.set(-2.1, 0.75, 0.6);
    instrumentBox.rotation.z = -0.18;
    instrumentBox.castShadow = true;
    lander.add(instrumentBox);
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 3.4, 8), darkMetal);
    antenna.position.set(1.25, 5.4, -0.3);
    antenna.rotation.z = -0.28;
    lander.add(antenna);
    const antennaDish = new THREE.Mesh(new THREE.SphereGeometry(0.52, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), bodyMaterial);
    antennaDish.position.set(1.72, 6.98, -0.3);
    antennaDish.rotation.x = Math.PI;
    lander.add(antennaDish);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0xabb7c4, roughness: 0.28, metalness: 0.86 });
    for (const x of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 4.75, 8), legMaterial);
      leg.position.set(x * 3.45, -3.25, 0);
      leg.rotation.z = x * 0.58;
      leg.castShadow = true;
      lander.add(leg);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.18, 12), darkMetal);
      foot.position.set(x * 4.8, -5.47, 0);
      foot.castShadow = true;
      lander.add(foot);
    }
    const nozzle = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.05, 16), darkMetal);
    nozzle.position.y = -3.2;
    nozzle.rotation.z = Math.PI;
    lander.add(nozzle);
    const flameOuter = new THREE.Mesh(new THREE.ConeGeometry(1.22, 6, 18), new THREE.MeshBasicMaterial({ color: 0x68d7ff, transparent: true, opacity: 0.72 }));
    flameOuter.position.y = -6;
    flameOuter.rotation.z = Math.PI;
    lander.add(flameOuter);
    const flameInner = new THREE.Mesh(new THREE.ConeGeometry(0.55, 4.4, 14), new THREE.MeshBasicMaterial({ color: 0xfff1a3, transparent: true, opacity: 0.96 }));
    flameInner.position.y = -5.85;
    flameInner.rotation.z = Math.PI;
    lander.add(flameInner);
    const flameLight = new THREE.PointLight(0x6ddaff, 4, 26, 2);
    flameLight.position.y = -4.9;
    lander.add(flameLight);
    scene.add(lander);

    let previous = performance.now();
    let raf = 0;
    let uiClock = 0;
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const loop = (now: number) => {
      const frameDt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      if (!pausedRef.current) runnerRef.current.advance(frameDt * timeScaleRef.current, (dt) => engineRef.current.update(dt));
      const s = engineRef.current.getState();
      const scale = 0.052;
      lander.position.set(s.position.x * scale, Math.max(0, s.position.y * scale) + 5.9, 0);
      lander.rotation.z = -s.angle;
      const flameScale = Math.max(0.03, s.throttle) * (s.status === "flying" && s.fuelMass > 0 ? 1 : 0.03);
      flameOuter.scale.set(0.72 + s.throttle * 0.3, flameScale, 0.72 + s.throttle * 0.3);
      flameInner.scale.set(0.7 + s.throttle * 0.25, flameScale * 0.72, 0.7 + s.throttle * 0.25);
      flameLight.intensity = s.status === "flying" && s.fuelMass > 0 ? 1.6 + s.throttle * 4 : 0;
      flameOuter.visible = s.status === "flying" && s.fuelMass > 0;
      flameInner.visible = flameOuter.visible;
      beaconLight.intensity = 2.2 + Math.sin(now * 0.005) * 0.9;
      if (!reduceMotion) stars.rotation.y += frameDt * 0.002;

      const mode = cameraModeRef.current;
      if (mode === "overview") {
        camera.position.x += (0 - camera.position.x) * 0.04;
        camera.position.y += (68 - camera.position.y) * 0.04;
        camera.position.z += (136 - camera.position.z) * 0.04;
        camera.lookAt(0, 27, 0);
      } else if (mode === "close") {
        camera.position.x += (lander.position.x + 15 - camera.position.x) * 0.06;
        camera.position.y += (lander.position.y + 7 - camera.position.y) * 0.06;
        camera.position.z += (39 - camera.position.z) * 0.06;
        camera.lookAt(lander.position.x, lander.position.y - 0.7, 0);
      } else {
        const desiredY = Math.max(31, Math.min(74, lander.position.y + 15));
        camera.position.x += (lander.position.x + 10 - camera.position.x) * 0.035;
        camera.position.y += (desiredY - camera.position.y) * 0.035;
        camera.position.z += (101 - camera.position.z) * 0.035;
        camera.lookAt(lander.position.x, Math.max(12, lander.position.y - 7), 0);
      }
      renderer.render(scene, camera);
      uiClock += frameDt;
      if (uiClock > 0.08) {
        uiClock = 0;
        setState(s);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      container.removeChild(renderer.domElement);
    };
  }, []);

  function reset() {
    engineRef.current.reset();
    engineRef.current.handleInput({ throttle: 0.52 });
    runnerRef.current.reset();
    pausedRef.current = false;
    setPaused(false);
    setState(engineRef.current.getState());
  }

  function applyExperiment() {
    const fuel = Math.max(100, experiment.fuelMass);
    engineRef.current = new MoonLandingEngine({ position: { x: 0, y: Math.max(100, experiment.altitude) }, velocity: { x: 11, y: experiment.verticalVelocity }, fuelMass: fuel, initialFuelMass: fuel, maxThrust: Math.max(5000, experiment.maxThrust) });
    engineRef.current.handleInput({ throttle: 0.52 });
    runnerRef.current.reset();
    pausedRef.current = false;
    setPaused(false);
    setState(engineRef.current.getState());
  }

  function setTimeScaleValue(value: number) {
    timeScaleRef.current = value;
    setTimeScale(value);
  }

  const fuelPct = 100 * state.fuelMass / Math.max(1, state.initialFuelMass);
  const missionComplete = selectedMission ? moonMissionComplete(selectedMission.id, state) : false;
  const score = moonScore(state);
  const attitude = Math.abs(state.angle) < 0.08 ? "STABLE" : Math.abs(state.angle) < 0.2 ? "TRIM" : "CORRECT";
  const displayStatus = state.status.replace("-", " ").toUpperCase();

  useEffect(() => {
    if (selectedMission && missionComplete) completeMission(selectedMission.id, selectedMission.xp, score);
  }, [selectedMission, missionComplete, score]);

  return (
    <main className="simLayout moonMissionShell">
      <section className="simViewport moonViewport" aria-label={m.moonLanding.title}>
        <div ref={host} className="threeHost" />
        <div className="overlayTop missionOverlay">
          <div className="missionOverlayTop"><span className="missionBadge"><i /> FLIGHT DECK</span><span className="missionClock">LUNAR APPROACH / 01</span></div>
          <h1>{m.moonLanding.title}</h1>
          <p>{m.moonLanding.instructions}</p>
        </div>
        <div className="sceneReadout"><span>TARGET ZONE</span><strong>PAD 01</strong><small>Keep lateral drift low</small></div>
        <div className="sceneLegend"><span><i className="legendDot cyan" />THRUST</span><span><i className="legendDot amber" />LANDING PAD</span></div>
        {state.status !== "flying" && <div className={`statusBanner ${state.status === "landed" ? "success" : "danger"}`}><strong>{state.status === "landed" ? m.moonLanding.resultSafe : state.status === "hard-landing" ? m.moonLanding.resultHard : m.moonLanding.resultCrash}</strong><span>{state.status === "landed" ? m.moonLanding.safeReason : state.status === "hard-landing" ? m.moonLanding.hardReason : m.moonLanding.crashReason} {m.moonLanding.retry}</span></div>}
      </section>

      <aside className="hud flightHud" aria-live="polite">
        <div className="hudHeader"><div><span className="eyebrow">MISSION CONTROL / TELEMETRY</span><h2>{m.moonLanding.telemetry}</h2></div><span className="livePill"><i /> LIVE</span></div>
        {selectedMission && <div className="missionCard"><div className="missionCardTop"><span className="eyebrow">{m.missions.active}</span><span className={missionComplete ? "missionState complete" : "missionState"}>{missionComplete ? "COMPLETE" : "IN PROGRESS"}</span></div><h3>{t(m, selectedMission.titleKey)}</h3><p>{t(m, selectedMission.descriptionKey)}</p>{score > 0 && <span className="scoreChip">{m.missions.score}: {score}</span>}</div>}
        <div className="statusStrip"><span className={`statusDot ${state.status}`} /><span>{m.common.status}</span><strong>{displayStatus}</strong></div>
        <div className="telemetryGrid">
          <div className="metric heroMetric"><span>{m.common.altitude}</span><strong>{fmt(state.position.y, 1)}<small> m AGL</small></strong></div>
          <div className="metric heroMetric"><span>{m.common.verticalVelocity}</span><strong className={state.velocity.y < -7 ? "warningValue" : ""}>{fmt(state.velocity.y, 1)}<small> m/s</small></strong></div>
          <div className="metric"><span>{m.common.horizontalVelocity}</span><strong>{fmt(state.velocity.x, 1)} m/s</strong></div>
          <div className="metric"><span>{m.common.acceleration}</span><strong>{fmt(Math.hypot(state.acceleration.x, state.acceleration.y), 2)} m/s²</strong></div>
          <div className="metric"><span>{m.common.fuel}</span><strong>{fmt(fuelPct, 0)}%</strong></div>
          <div className="metric"><span>{m.common.mass}</span><strong>{fmt(state.dryMass + state.fuelMass, 0)} kg</strong></div>
          <div className="metric"><span>{m.common.gravity}</span><strong>{MOON_GRAVITY.toFixed(2)} m/s²</strong></div>
          <div className="metric"><span>ATTITUDE</span><strong>{attitude}</strong></div>
        </div>
        <div className="attitudeCard"><div className="attitudeDial"><div className="dialTicks" /><div className="dialNeedle" style={{ transform: `rotate(${state.angle}rad)` }}><i /></div><span className="dialCenter">+</span></div><div><span className="eyebrow">ATTITUDE CONTROL</span><strong>{fmt(state.angle * 180 / Math.PI, 1)}°</strong><small>Keep the marker centered for a stable touchdown.</small></div></div>
        <div className="controlGroup throttleControl"><div className="controlHeading"><label htmlFor="throttle-range">{m.common.throttle}</label><output>{fmt(state.throttle * 100, 0)}%</output></div><input id="throttle-range" className="throttleRange" aria-label={m.common.throttle} type="range" min="0" max="1" step=".01" value={state.throttle} onChange={(event) => { engineRef.current.handleInput({ throttle: Number(event.target.value) }); setState(engineRef.current.getState()); }} /><div className="throttleScale"><span>IDLE</span><span>HOVER</span><span>MAX</span></div></div>
        <div className="controlGroup"><div className="controlHeading"><label>{m.common.controls}</label><span className="keyHint">A / D or ← / →</span></div><div className="pilotControls"><button aria-label="Rotate left" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); engineRef.current.handleInput({ rotate: -1 }); }} onPointerUp={() => engineRef.current.handleInput({ rotate: 0 })} onPointerCancel={() => engineRef.current.handleInput({ rotate: 0 })} onPointerLeave={() => engineRef.current.handleInput({ rotate: 0 })}>↶ <span>ROTATE</span></button><button aria-label="Rotate right" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); engineRef.current.handleInput({ rotate: 1 }); }} onPointerUp={() => engineRef.current.handleInput({ rotate: 0 })} onPointerCancel={() => engineRef.current.handleInput({ rotate: 0 })} onPointerLeave={() => engineRef.current.handleInput({ rotate: 0 })}><span>ROTATE</span> ↷</button></div></div>
        <div className="controlGroup modeControl"><div className="controlHeading"><label>{m.common.mode}</label><span className="keyHint">SPACE {paused ? "TO RESUME" : "TO PAUSE"}</span></div><div className="segmented threeWay"><button className={mode === "play" ? "active" : ""} onClick={() => setMode("play")}>{m.common.play}</button><button className={mode === "learn" ? "active" : ""} onClick={() => setMode("learn")}>{m.common.learn}</button><button className={mode === "experiment" ? "active" : ""} onClick={() => setMode("experiment")}>{m.common.experiment}</button></div></div>
        {mode === "learn" && <div className="card learnCard"><strong>{m.moonLanding.learnTitle}</strong><p className="muted">{m.moonLanding.learnBody}</p><div className="formula">a_net = F/m − 1.62 m/s²</div></div>}
        {mode === "experiment" && <div className="card experimentCard"><span className="eyebrow">{m.common.experimentPreset}</span><p>{m.moonLanding.experimentCopy}</p><div className="miniGrid"><div className="field"><label>{m.common.startAltitude} (m)</label><input className="numberInput" type="number" value={experiment.altitude} onChange={(event) => setExperiment((value) => ({ ...value, altitude: Number(event.target.value) }))} /></div><div className="field"><label>{m.common.startVelocity} (m/s)</label><input className="numberInput" type="number" value={experiment.verticalVelocity} onChange={(event) => setExperiment((value) => ({ ...value, verticalVelocity: Number(event.target.value) }))} /></div><div className="field"><label>{m.common.fuelMass} (kg)</label><input className="numberInput" type="number" value={experiment.fuelMass} onChange={(event) => setExperiment((value) => ({ ...value, fuelMass: Number(event.target.value) }))} /></div><div className="field"><label>{m.common.maxThrust} (N)</label><input className="numberInput" type="number" value={experiment.maxThrust} onChange={(event) => setExperiment((value) => ({ ...value, maxThrust: Number(event.target.value) }))} /></div></div><button className="button primary" onClick={applyExperiment}>{m.common.applyRestart}</button></div>}
        <div className="controlGroup cameraControl"><div className="controlHeading"><label>{m.common.camera}</label><span className="keyHint">VIEW</span></div><div className="segmented threeWay"><button className={cameraMode === "close" ? "active" : ""} onClick={() => setCameraMode("close")}>{m.common.closeCamera}</button><button className={cameraMode === "third" ? "active" : ""} onClick={() => setCameraMode("third")}>{m.common.thirdPerson}</button><button className={cameraMode === "overview" ? "active" : ""} onClick={() => setCameraMode("overview")}>{m.common.overview}</button></div></div>
        <div className="bottomControls"><select className="langSelect" aria-label={m.common.timeScale} value={timeScale} onChange={(event) => setTimeScaleValue(Number(event.target.value))}><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select><button className="button" onClick={() => { pausedRef.current = !paused; setPaused(!paused); }}>{paused ? m.common.resume : m.common.pause}</button><button className="button primary" onClick={reset}>{m.common.restart}</button></div>
      </aside>
    </main>
  );
}
