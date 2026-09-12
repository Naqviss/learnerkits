"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { SubjectDefinition } from "@/lib/subjects/catalog";

type ChemistryValues = {
  acidM: number;
  acidVolume: number;
  baseM: number;
  baseVolume: number;
  temperature: number;
};

type Trial = Pick<ChemistryValues, "acidM" | "acidVolume" | "baseM"> & { name: string };

const trials: Trial[] = [
  { name: "Dilute sample", acidM: 0.15, acidVolume: 60, baseM: 0.30 },
  { name: "Concentrated sample", acidM: 0.32, acidVolume: 35, baseM: 0.16 },
  { name: "Large sample", acidM: 0.24, acidVolume: 80, baseM: 0.12 },
];

const chemistrySteps = [
  { number: "01", title: "Read the sample", body: "The acid contains H⁺ particles. Its concentration and volume set the total amount of acid in the flask." },
  { number: "02", title: "Dose the base", body: "Add NaOH a little at a time. OH⁻ neutralizes H⁺ in a 1:1 reaction, forming water." },
  { number: "03", title: "Hit the endpoint", body: "At equivalence, neither reagent is left over. The indicator shifts into the neutral zone." },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeChemistry(values: ChemistryValues) {
  const acidMoles = values.acidM * values.acidVolume / 1000;
  const baseMoles = values.baseM * values.baseVolume / 1000;
  const totalVolume = Math.max(0.001, (values.acidVolume + values.baseVolume) / 1000);
  const excess = acidMoles - baseMoles;
  const endpointVolume = values.acidM * values.acidVolume / Math.max(0.001, values.baseM);
  let ph = 7;
  if (Math.abs(excess) > 1e-9) {
    const concentration = Math.max(1e-7, Math.abs(excess) / totalVolume);
    ph = excess > 0 ? -Math.log10(concentration) : 14 + Math.log10(concentration);
  }
  ph = clamp(ph, 0, 14);
  const neutralScore = Math.round(clamp(100 - Math.abs(ph - 7) * 22, 0, 100));
  const reacted = Math.min(acidMoles, baseMoles);
  return { acidMoles, baseMoles, totalVolume, excess, endpointVolume, ph, neutralScore, reacted };
}

function colorForPh(ph: number) {
  const stops = [0xef476f, 0xf28f3b, 0xf4d35e, 0x70c1a1, 0x4d96ff, 0x7657d9].map((hex) => new THREE.Color(hex));
  const position = clamp(ph / 14, 0, 1) * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(position));
  return stops[index].clone().lerp(stops[index + 1], position - index);
}

function formatMoles(value: number) {
  return value.toFixed(3);
}

function ChemistryLabScene({ values, ph, ariaLabel }: { values: ChemistryValues; ph: number; ariaLabel: string }) {
  const host = useRef<HTMLDivElement>(null);
  const valuesRef = useRef(values);
  const phRef = useRef(ph);
  valuesRef.current = values;
  phRef.current = ph;

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071421);
    scene.fog = new THREE.Fog(0x071421, 8, 17);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(4.8, 3.7, 7.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(node.clientWidth || 760, node.clientHeight || 520);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    node.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 4.8;
    controls.maxDistance = 11;
    controls.target.set(0, 1.25, 0);

    scene.add(new THREE.HemisphereLight(0xa9d7ff, 0x142033, 1.15));
    const key = new THREE.PointLight(0xffead0, 80, 13, 1.6);
    key.position.set(-3.5, 6.5, 4.2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const rim = new THREE.PointLight(0x699cff, 42, 10, 2);
    rim.position.set(4.5, 2.8, -3.5);
    scene.add(rim);

    const lab = new THREE.Group();
    scene.add(lab);
    const standard = (color: number, roughness = 0.45, metalness = 0.05) => new THREE.MeshStandardMaterial({ color, roughness, metalness });

    const table = new THREE.Mesh(new THREE.BoxGeometry(11, 0.28, 8), standard(0x142b3a, 0.3, 0.18));
    table.position.y = -0.2;
    table.receiveShadow = true;
    lab.add(table);
    const tableEdge = new THREE.Mesh(new THREE.BoxGeometry(11, 0.07, 8.02), standard(0x26516a, 0.26, 0.3));
    tableEdge.position.y = -0.02;
    lab.add(tableEdge);

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xbdeaff,
      roughness: 0.08,
      metalness: 0.02,
      transmission: 0.8,
      thickness: 0.16,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beaker = new THREE.Mesh(new THREE.CylinderGeometry(1.34, 1.16, 2.55, 64, 1, true), matGlass);
    beaker.position.y = 1.42;
    beaker.castShadow = true;
    lab.add(beaker);
    const rimMaterial = new THREE.MeshPhysicalMaterial({ color: 0xcceeff, roughness: 0.08, transmission: 0.76, thickness: 0.12, transparent: true, opacity: 0.7 });
    const beakerRim = new THREE.Mesh(new THREE.TorusGeometry(1.34, 0.045, 12, 72), rimMaterial);
    beakerRim.rotation.x = Math.PI / 2;
    beakerRim.position.y = 2.7;
    lab.add(beakerRim);
    const beakerBase = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.035, 12, 72), rimMaterial);
    beakerBase.rotation.x = Math.PI / 2;
    beakerBase.position.y = 0.15;
    lab.add(beakerBase);

    const liquidMaterial = new THREE.MeshPhysicalMaterial({ color: 0xef476f, roughness: 0.2, metalness: 0.02, transmission: 0.12, clearcoat: 0.35, clearcoatRoughness: 0.18, transparent: true, opacity: 0.88 });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(1.13, 0.99, 1.9, 56), liquidMaterial);
    liquid.castShadow = true;
    lab.add(liquid);
    const liquidSurfaceMaterial = new THREE.MeshPhysicalMaterial({ color: 0xef476f, roughness: 0.12, metalness: 0.01, transmission: 0.2, transparent: true, opacity: 0.95 });
    const liquidSurface = new THREE.Mesh(new THREE.CylinderGeometry(1.13, 1.13, 0.025, 56), liquidSurfaceMaterial);
    lab.add(liquidSurface);

    const stirrer = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.5), standard(0x213c4f, 0.25, 0.38));
    stirrer.position.set(0, 0.08, 0);
    lab.add(stirrer);
    const stirLight = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.03), new THREE.MeshBasicMaterial({ color: 0x66d9ff }));
    stirLight.position.set(0, 0.13, 0.24);
    lab.add(stirLight);

    const dropper = new THREE.Group();
    dropper.position.set(2.6, 3.1, 0.15);
    dropper.rotation.z = -0.22;
    const dropperGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.55, 24), new THREE.MeshPhysicalMaterial({ color: 0xbeeaff, roughness: 0.08, transmission: 0.7, transparent: true, opacity: 0.5 }));
    dropperGlass.position.y = 0.25;
    dropper.add(dropperGlass);
    const dropperTop = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 14), new THREE.MeshStandardMaterial({ color: 0x315bd6, roughness: 0.32, metalness: 0.15 }));
    dropperTop.position.y = 1.08;
    dropper.add(dropperTop);
    const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.52, 24), new THREE.MeshPhysicalMaterial({ color: 0xbdeaff, roughness: 0.08, transmission: 0.72, transparent: true, opacity: 0.55 }));
    nozzle.position.y = -0.8;
    dropper.add(nozzle);
    const droplet = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0x71d7ff, emissive: 0x0b4b6f, emissiveIntensity: 0.24, roughness: 0.1, transmission: 0.18 }));
    droplet.position.set(2.6, 2.05, 0.15);
    lab.add(dropper, droplet);

    const particles = Array.from({ length: 54 }, (_, index) => {
      const kind = index % 3;
      const material = new THREE.MeshStandardMaterial({ color: kind === 0 ? 0xff7096 : kind === 1 ? 0x70d7ff : 0xf9d65c, emissive: kind === 0 ? 0x5c102b : kind === 1 ? 0x0c4160 : 0x5c3a06, emissiveIntensity: 0.42, roughness: 0.28, metalness: 0.06 });
      const particle = new THREE.Mesh(new THREE.SphereGeometry(kind === 2 ? 0.055 : 0.038, 12, 8), material);
      const angle = index * 2.39996;
      particle.userData = { angle, radius: 0.18 + (index % 8) * 0.095, height: 0.24 + (index % 9) * 0.18, speed: 0.65 + (index % 5) * 0.11, phase: index * 0.73, kind };
      lab.add(particle);
      return particle;
    });

    const indicator = new THREE.Mesh(new THREE.RingGeometry(1.21, 1.27, 64), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.19, side: THREE.DoubleSide }));
    indicator.rotation.x = Math.PI / 2;
    indicator.position.y = 0.75;
    lab.add(indicator);

    const initial = valuesRef.current;
    const updateLiquid = (live: ChemistryValues, livePh: number, immediate = false) => {
      const fill = clamp(0.2 + live.baseVolume / 180 * 0.68, 0.2, 0.88);
      const targetColor = colorForPh(livePh);
      liquidMaterial.color.lerp(targetColor, immediate ? 1 : 0.08);
      liquidSurfaceMaterial.color.lerp(targetColor, immediate ? 1 : 0.08);
      liquid.scale.y = immediate ? fill : THREE.MathUtils.lerp(liquid.scale.y, fill, 0.1);
      liquid.position.y = 0.16 + 0.95 * (immediate ? fill : liquid.scale.y);
      liquidSurface.position.y = 0.16 + 1.9 * (immediate ? fill : liquid.scale.y);
      indicator.position.y = liquidSurface.position.y + 0.018;
      const volume = Math.max(0.05, live.acidVolume + live.baseVolume);
      const particleScale = clamp(0.7 + volume / 160, 0.72, 1.35);
      particles.forEach((particle) => {
        const data = particle.userData as { height: number };
        const maxHeight = clamp(0.26 + data.height * particleScale, 0.28, 2.05);
        particle.visible = maxHeight < 0.16 + 1.9 * liquid.scale.y;
      });
    };
    updateLiquid(initial, phRef.current, true);

    const startedAt = performance.now();
    let animationFrame = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      const now = (performance.now() - startedAt) / 1000;
      const live = valuesRef.current;
      const livePh = phRef.current;
      updateLiquid(live, livePh);
      const motion = 0.55 + live.temperature / 45;
      particles.forEach((particle) => {
        const data = particle.userData as { angle: number; radius: number; height: number; speed: number; phase: number; kind: number };
        const fillHeight = Math.max(0.25, liquid.scale.y * 1.72);
        const y = 0.23 + (data.height / 2.25) * fillHeight + Math.sin(now * data.speed * motion + data.phase) * 0.055;
        const spread = data.radius * (0.9 + 0.08 * Math.sin(now * 0.8 + data.phase));
        particle.position.set(Math.cos(data.angle + now * 0.12 * motion) * spread, y, Math.sin(data.angle + now * 0.12 * motion) * spread);
        particle.rotation.y += 0.006 * motion;
        particle.visible = y < liquidSurface.position.y - 0.03;
      });
      stirrer.rotation.y += 0.016 * motion;
      stirLight.scale.x = 0.92 + Math.sin(now * 5) * 0.08;
      const dropCycle = (now * (0.48 + live.baseVolume / 130)) % 3;
      droplet.position.y = dropCycle < 2.1 ? 2.07 - dropCycle * 0.06 : 2.07;
      droplet.visible = dropCycle < 2.2;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      const width = node.clientWidth || 760;
      const height = node.clientHeight || 520;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
    };
  }, []);

  return <div ref={host} className="chemistryThreeScene" role="img" aria-label={ariaLabel}/>;
}

function RangeControl({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (value: number) => void }) {
  return <label className="chemistryControl"><span><b>{label}</b><output>{value.toFixed(step < 1 ? 2 : 0)}{unit ? ` ${unit}` : ""}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))}/></label>;
}

export function NeutralizationLabClient({ locale, subject }: { locale: string; subject: SubjectDefinition }) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [acidM, setAcidM] = useState(trials[0].acidM);
  const [acidVolume, setAcidVolume] = useState(trials[0].acidVolume);
  const [baseM, setBaseM] = useState(trials[0].baseM);
  const [baseVolume, setBaseVolume] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [checked, setChecked] = useState(false);

  const values = useMemo<ChemistryValues>(() => ({ acidM, acidVolume, baseM, baseVolume, temperature }), [acidM, acidVolume, baseM, baseVolume, temperature]);
  const result = useMemo(() => computeChemistry(values), [values]);
  const status = result.ph < 6.85 ? "Acid remains" : result.ph > 7.15 ? "Base in excess" : "Neutralization zone";
  const statusClass = result.ph < 6.85 ? "acidic" : result.ph > 7.15 ? "basic" : "neutral";
  const feedback = result.neutralScore >= 97 ? "Excellent endpoint. Your H⁺ and OH⁻ amounts are essentially equal." : result.ph < 7 ? "Still acidic. Add more hydroxide, or increase the base concentration." : "Too basic. You passed the endpoint, so OH⁻ is now in excess.";
  const explanation = result.ph < 6.85
    ? "Low base dose: acid is still in excess. The remaining H⁺ particles keep the solution acidic."
    : result.ph > 7.15
      ? "High base dose: the endpoint has been passed. Extra OH⁻ particles now make the solution basic."
      : "At the endpoint, H⁺ and OH⁻ have reacted in equal amounts to make water. The mixture is near neutral.";

  const updateTrial = () => {
    const nextIndex = (trialIndex + 1) % trials.length;
    const next = trials[nextIndex];
    setTrialIndex(nextIndex);
    setAcidM(next.acidM);
    setAcidVolume(next.acidVolume);
    setBaseM(next.baseM);
    setBaseVolume(0);
    setTemperature(25);
    setChecked(false);
  };

  const resetDose = () => {
    setBaseVolume(0);
    setChecked(false);
  };

  return <main className="chemistryLabPage">
    <section className="container chemistryLabHeader">
      <div>
        <Link className="backLink" href={`/${locale}/subjects`}>← {subject.eyebrow}</Link>
        <div className="eyebrow">Interactive chemistry lab</div>
        <h1>Neutralization station</h1>
        <p>Use particle evidence and mole balance to make a mystery acid neutral. Your goal: reach the endpoint without guessing.</p>
      </div>
      <div className="chemistryMissionBadge"><span>Mission {String(trialIndex + 1).padStart(2, "0")}</span><strong>{trials[trialIndex].name}</strong></div>
    </section>

    <section className="container chemistryWorkspace">
      <div className="chemistrySceneCard">
        <div className="chemistrySceneTop"><span className="eyebrow">Live molecular view</span><span className="sceneHint">Drag to orbit · Scroll to zoom</span></div>
        <div className="chemistrySceneViewport"><ChemistryLabScene values={values} ph={result.ph} ariaLabel={`3D neutralization lab. The solution is ${status.toLowerCase()} at pH ${result.ph.toFixed(2)}.`}/><div className="chemistrySceneOverlay"><span>Target endpoint</span><strong>pH 7.00</strong><small>H⁺ + OH⁻ → H₂O</small></div><div className={`chemistrySceneStatus ${statusClass}`}><i/>{status}<b>pH {result.ph.toFixed(2)}</b></div></div>
        <div className="particleLegend"><span><i className="particleSwatch hydrogen"/>H⁺ acid</span><span><i className="particleSwatch hydroxide"/>OH⁻ base</span><span><i className="particleSwatch water"/>H₂O formed</span></div>
      </div>

      <aside className="chemistryControlPanel">
        <div className="chemistryPanelHeading"><div><span className="eyebrow">Your challenge</span><h2>Balance the flask</h2></div><button type="button" className="chemistryTextButton" onClick={updateTrial}>New challenge ↗</button></div>
        <p className="chemistryPrompt">Predict the volume of NaOH needed, then add it with the slider. Watch the color and pH respond.</p>
        <div className="chemistryControls">
          <RangeControl label="Acid concentration" value={acidM} min={0.05} max={0.5} step={0.01} unit="M" onChange={(value) => { setAcidM(value); setChecked(false); }}/>
          <RangeControl label="Acid sample" value={acidVolume} min={20} max={100} step={1} unit="mL" onChange={(value) => { setAcidVolume(value); setChecked(false); }}/>
          <RangeControl label="Base concentration" value={baseM} min={0.05} max={0.5} step={0.01} unit="M" onChange={(value) => { setBaseM(value); setChecked(false); }}/>
          <RangeControl label="NaOH added" value={baseVolume} min={0} max={180} step={1} unit="mL" onChange={(value) => { setBaseVolume(value); setChecked(false); }}/>
          <RangeControl label="Temperature" value={temperature} min={10} max={50} step={1} unit="°C" onChange={setTemperature}/>
        </div>
        <div className="phMeterBlock"><div className="phMeterHeader"><span>Live pH</span><strong>{result.ph.toFixed(2)}</strong></div><div className="phMeter" aria-label={`pH ${result.ph.toFixed(2)} of 14`}><span className="phMeterThumb" style={{ left: `${result.ph / 14 * 100}%` }}/><i className="phNeutralZone"/></div><div className="phScale"><span>0 acid</span><b>7 neutral</b><span>14 base</span></div></div>
        <div className="chemistryMetrics"><div><span>H⁺ in sample</span><strong>{formatMoles(result.acidMoles)} mol</strong></div><div><span>OH⁻ added</span><strong>{formatMoles(result.baseMoles)} mol</strong></div><div><span>Endpoint at</span><strong>{result.endpointVolume.toFixed(1)} mL</strong></div></div>
        <div className="chemistryActions"><button type="button" className="button primary" onClick={() => setChecked(true)}>Check my mix</button><button type="button" className="button" onClick={resetDose}>Reset dose</button></div>
        {checked && <div className={`chemistryFeedback ${result.neutralScore >= 97 ? "success" : "tryAgain"}`} role="status"><strong>{result.neutralScore >= 97 ? "Endpoint reached" : `${result.neutralScore}% match`}</strong><span>{feedback}</span></div>}
        <div className="chemistryExplain"><div><span className="eyebrow">What is happening</span><b>{explanation}</b></div><small>Temperature changes particle motion in this model; it does not change the strong acid–base mole balance.</small></div>
      </aside>
    </section>

    <section className="container chemistryLearning"><div className="chemistryLearningHeader"><div><span className="eyebrow">Learn by doing</span><h2>From particles to proof</h2></div><p>Change one variable, observe the evidence, and explain why the indicator moved.</p></div><div className="chemistryStepGrid">{chemistrySteps.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div><div className="chemistryFormula"><span>Core relationship</span><strong>n = C × V</strong><b>At equivalence: n(H⁺) = n(OH⁻)</b></div></section>

  </main>;
}
