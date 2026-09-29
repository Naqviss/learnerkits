"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { loadSettings, renderProfile } from "@/lib/settings/storage";
import { clamp, type Values } from "@/lib/simulations/geographyLabs/model";
import { GameControlIcon } from "../../environmental/GameControlIcon";
import { eruptionVisuals, lavaFragment, seeded, volcanoHeight, type EruptionExample } from "./volcanoModel";
import { effectTexture } from "./effectTextures";
import { lavaVertex, lavaFragmentShader } from "./lavaShader";
import styles from "./volcano.module.css";

type View = "ridge" | "crater" | "aerial";
const views: Record<View, { position: [number, number, number]; target: [number, number, number] }> = {
  ridge: { position: [18, 12, 24], target: [0, 5, 0] },
  crater: { position: [9, 12, 13], target: [0, 5.5, 0] },
  aerial: { position: [9, 30, 17], target: [0, 2, 0] },
};
const idleActions = { zoom: (_: number) => {}, rotate: (_: number) => {}, view: (_: View) => {} };

export function VolcanoScene({ values, time, onExample }: {
  values: Values; time: number; onExample: (example: EruptionExample) => void;
}) {
  const host = useRef<HTMLDivElement>(null), live = useRef({ values, time }); live.current = { values, time };
  const actions = useRef(idleActions);
  const [view, setView] = useState<View>("ridge"), [failed, setFailed] = useState(false);
  const state = eruptionVisuals(values, time);

  useEffect(() => {
    const container = host.current; if (!container) return;
    const profile = renderProfile(loadSettings().quality);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, profile.pixelRatioCap, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = profile.shadows; renderer.shadowMap.type = THREE.PCFShadowMap;
    const canvas = renderer.domElement; canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", "Volcanic landscape. Drag to orbit, or use the camera buttons to zoom and change view.");
    container.appendChild(canvas);
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x61788e); scene.fog = new THREE.FogExp2(0x61788e, .013);
    const camera = new THREE.PerspectiveCamera(43, 1, .1, 250);
    const orbit = new OrbitControls(camera, canvas);
    orbit.enablePan = false; orbit.enableZoom = false; orbit.enableDamping = true;
    orbit.minPolarAngle = .1; orbit.maxPolarAngle = Math.PI * .46;
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
    function mesh(geometry: THREE.BufferGeometry, material: THREE.Material) {
      geometries.add(geometry); materials.add(material);
      const result = new THREE.Mesh(geometry, material); scene.add(result); return result;
    }
    const rockTexture = effectTexture("rock"), smokeTexture = effectTexture("smoke"), glowTexture = effectTexture("glow");
    [rockTexture, smokeTexture, glowTexture].forEach(t => textures.add(t));
    const sky = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: `varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec3 vDirection;void main(){float h=normalize(vDirection).y;vec3 color=mix(vec3(.48,.55,.61),vec3(.10,.20,.33),smoothstep(-.02,.75,h));gl_FragColor=vec4(color,1.);\n#include <colorspace_fragment>\n}`,
    });
    mesh(new THREE.SphereGeometry(190, 24, 14), sky);
    scene.add(new THREE.HemisphereLight(0xc1d9ef, 0x34302c, 2.2));
    const sun = new THREE.DirectionalLight(0xffd8b1, 2.6); sun.position.set(-16, 22, 12); sun.castShadow = profile.shadows;
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -23, right: 23, top: 23, bottom: -23, near: 1, far: 85 });
    sun.shadow.normalBias = .05; scene.add(sun);
    const rimLight = new THREE.DirectionalLight(0x82a6d6, 1.3); rimLight.position.set(10, 8, -15); scene.add(rimLight);
    const ventLight = new THREE.PointLight(0xff5912, 0, 12, 1.5); ventLight.position.set(0, 6.6, 0); scene.add(ventLight);

    // Dense radial rings resolve the crater and gullies; the distant foothills need fewer vertices.
    const rings = profile.shadows ? 185 : 130, segments = profile.shadows ? 224 : 144;
    const vertices: number[] = [], colors: number[] = [], uvs: number[] = [], indices: number[] = [];
    const basalt = new THREE.Color(0x716960), moss = new THREE.Color(0x566352), ash = new THREE.Color(0x554f4b);
    for (let i = 0; i <= rings; i++) for (let j = 0; j <= segments; j++) {
      const p = i / rings, r = p <= .82 ? 38 * (p / .82) ** 1.6 : 38 + (p - .82) / .18 * 142;
      const a = j / segments * Math.PI * 2, x = r * Math.cos(a), z = r * Math.sin(a);
      vertices.push(x, volcanoHeight(x, z), z); uvs.push(x / 76 + .5, z / 76 + .5);
      const shade = basalt.clone().lerp(moss, clamp((r - 8) / 12)).lerp(ash, clamp((4 - r) / 3));
      shade.multiplyScalar(.85 + .18 * Math.sin(a * 21 + r * .8) + .1 * Math.sin(r * 15 + Math.sin(a * 7)));
      colors.push(shade.r, shade.g, shade.b);
      if (i < rings && j < segments) { const k = i * (segments + 1) + j; indices.push(k, k + 1, k + segments + 1, k + 1, k + segments + 2, k + segments + 1); }
    }
    const terrainGeometry = new THREE.BufferGeometry();
    terrainGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    terrainGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    terrainGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    terrainGeometry.setIndex(indices); terrainGeometry.computeVertexNormals();
    const terrain = mesh(terrainGeometry, new THREE.MeshStandardMaterial({ vertexColors: true, map: rockTexture, bumpMap: rockTexture, bumpScale: .18, roughness: .98 }));
    terrain.receiveShadow = true; terrain.castShadow = true;

    // Boulders and distant vegetation establish the volcano's scale without placing people in danger.
    const rockGeometry = new THREE.DodecahedronGeometry(1, 0), rockMaterial = new THREE.MeshStandardMaterial({ color: 0x64615b, map: rockTexture, roughness: 1 });
    geometries.add(rockGeometry); materials.add(rockMaterial);
    const rocks = new THREE.InstancedMesh(rockGeometry, rockMaterial, 175), dummy = new THREE.Object3D();
    rocks.castShadow = rocks.receiveShadow = true; scene.add(rocks);
    for (let i = 0; i < 175; i++) {
      const a = seeded(i + 24) * Math.PI * 2, r = 2.4 + seeded(i + 230) * 21, x = Math.cos(a) * r, z = Math.sin(a) * r;
      const size = .06 + seeded(i + 500) * .3;
      dummy.position.set(x, volcanoHeight(x, z), z); dummy.scale.set(size * 1.5, size * .8, size);
      dummy.rotation.set(i, i * .7, i * .3); dummy.updateMatrix(); rocks.setMatrixAt(i, dummy.matrix);
    }
    const crownParts = [0, 1, 2].map(level => new THREE.ConeGeometry(.38 - level * .085, .8 - level * .13, 9).translate(0, .15 + level * .3, 0));
    const treeGeometry = mergeGeometries(crownParts)!; crownParts.forEach(part => part.dispose());
    const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x455e4c, roughness: 1 });
    geometries.add(treeGeometry); materials.add(treeMaterial);
    const trees = new THREE.InstancedMesh(treeGeometry, treeMaterial, 260); trees.castShadow = true; scene.add(trees);
    const trunkGeometry = new THREE.CylinderGeometry(.035, .065, .8, 6), trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x605047, roughness: 1 });
    geometries.add(trunkGeometry); materials.add(trunkMaterial);
    const trunks = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, 260); scene.add(trunks);
    for (let i = 0; i < 260; i++) {
      const a = seeded(i + 730) * Math.PI * 2, r = 17 + seeded(i + 1100) * 17, x = Math.cos(a) * r, z = Math.sin(a) * r;
      const size = .6 + seeded(i + 321) * .9;
      dummy.position.set(x, volcanoHeight(x, z) + .55 * size, z); dummy.rotation.set(0, i, 0); dummy.scale.set(size, size, size); dummy.updateMatrix(); trees.setMatrixAt(i, dummy.matrix);
      dummy.position.y = volcanoHeight(x, z) + .4 * size; dummy.updateMatrix(); trunks.setMatrixAt(i, dummy.matrix);
    }

    const lavaUniforms = { uTime: { value: 0 }, uReach: { value: 0 }, uLake: { value: 0 } };
    const lavaMaterial = new THREE.ShaderMaterial({ vertexShader: lavaVertex, fragmentShader: lavaFragmentShader, uniforms: lavaUniforms, side: THREE.DoubleSide });
    // Surface-following ribbons replace the old straight tubes. The front advances as playback runs.
    const streams: THREE.Mesh[] = [];
    for (let stream = 0; stream < 5; stream++) {
      const positions: number[] = [], uv: number[] = [], faces: number[] = [], steps = 125;
      const angle = [.72, 1.5, 2.55, 3.7, 5.6][stream];
      for (let i = 0; i <= steps; i++) {
        const p = i / steps, r = 1.26 + p * (9 + stream * .45), a = angle + Math.sin(p * 7 + stream) * p * .1;
        const width = (.16 + p * .22) * (1 + .2 * Math.sin(p * 44 + stream));
        for (const side of [-1, 0, 1]) {
          const x = Math.cos(a) * r - Math.sin(a) * width * side, z = Math.sin(a) * r + Math.cos(a) * width * side;
          positions.push(x, volcanoHeight(x, z) + .055, z); uv.push((side + 1) / 2, p);
        }
        if (i < steps) for (let j = 0; j < 2; j++) { const k = i * 3 + j; faces.push(k, k + 3, k + 1, k + 1, k + 3, k + 4); }
      }
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(faces);
      streams.push(mesh(geometry, lavaMaterial));
    }
    const lakeUniforms = { uTime: { value: 0 }, uReach: { value: 1 }, uLake: { value: 1 } };
    const lake = mesh(new THREE.CircleGeometry(1.08, 80), new THREE.ShaderMaterial({ vertexShader: lavaVertex, fragmentShader: lavaFragmentShader, uniforms: lakeUniforms }));
    lake.rotation.x = -Math.PI / 2; lake.position.y = 5.35;

    function sprite(texture: THREE.Texture, color: number, additive = false) {
      const material = new THREE.SpriteMaterial({ map: texture, color, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: !additive });
      materials.add(material); const item = new THREE.Sprite(material); scene.add(item); return item;
    }
    const ventGlow = sprite(glowTexture, 0xff5b0c, true); ventGlow.position.set(0, 5.8, 0); ventGlow.scale.set(4, 4, 1);
    const smoke = Array.from({ length: profile.shadows ? 72 : 42 }, () => sprite(smokeTexture, 0x909394));
    const hotJets = Array.from({ length: 18 }, () => sprite(glowTexture, 0xff6614, true));
    const fragments = Array.from({ length: profile.shadows ? 100 : 60 }, (_, i) => {
      const ember = sprite(glowTexture, i % 3 ? 0xff7418 : 0xffc44a, true); ember.scale.setScalar(.13 + seeded(i) * .12); return ember;
    });
    const ashGeometry = new THREE.BufferGeometry(), ashPositions = new Float32Array(180 * 3);
    ashGeometry.setAttribute("position", new THREE.BufferAttribute(ashPositions, 3)); geometries.add(ashGeometry);
    const ashMaterial = new THREE.PointsMaterial({ color: 0xa7a6a0, size: .045, transparent: true, opacity: .5, depthWrite: false }); materials.add(ashMaterial);
    const ashFall = new THREE.Points(ashGeometry, ashMaterial); ashFall.frustumCulled = false; scene.add(ashFall);

    function chooseView(next: View) {
      camera.position.set(...views[next].position); orbit.target.set(...views[next].target);
      camera.zoom = 1; camera.updateProjectionMatrix(); orbit.update();
    }
    chooseView("ridge");
    actions.current = {
      view: chooseView,
      zoom: direction => { camera.zoom = clamp(camera.zoom * (direction > 0 ? 1.18 : 1 / 1.18), .7, 2.1); camera.updateProjectionMatrix(); },
      rotate: direction => { const offset = camera.position.clone().sub(orbit.target); offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), direction * Math.PI / 9); camera.position.copy(orbit.target).add(offset); orbit.update(); },
    };
    const resize = () => {
      const width = container.clientWidth, height = container.clientHeight; if (!width || !height) return;
      camera.aspect = width / height; camera.fov = camera.aspect < 1 ? 57 : 43; camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    let frame = 0, lastFrame = 0, previousTime = -1, previousValues: Values | undefined, disposed = false;
    function updateEffects() {
      const { time: t, values: v } = live.current, e = eruptionVisuals(v, t);
      lavaUniforms.uTime.value = lakeUniforms.uTime.value = t; lavaUniforms.uReach.value = e.flowReach;
      streams.forEach(stream => { stream.visible = t > 0; });
      lake.position.y = 5.1 + e.active * .53;
      ventLight.intensity = 6 + e.active * (25 + Math.sin(t * 13) * 3);
      ventGlow.material.opacity = .18 + e.active * .48;
      for (let i = 0; i < smoke.length; i++) {
        const delay = seeded(i + 46) * 5, age = Math.max(0, t - delay) % 5, p = age / 5;
        const puff = smoke[i], a = i * 2.399, spread = .12 + p * p * (1.2 + e.ash * 2.7);
        puff.visible = t > delay;
        puff.position.set(Math.cos(a) * spread + p * p * 2.8, 5.8 + p * e.plumeHeight, Math.sin(a) * spread - p * p * .8);
        const size = .65 + p * (2.7 + e.ash * 3.8); puff.scale.set(size, size * (1.1 + seeded(i) * .25), 1);
        puff.material.rotation = seeded(i) * 6 + t * .045;
        puff.material.opacity = Math.min(1, age * 2) * (1 - p) ** .5 * (.3 + e.ash * .58);
        puff.material.color.setHSL(.09, .025, .69 - e.ash * .3 + p * .07);
      }
      for (let i = 0; i < hotJets.length; i++) {
        const jet = hotJets[i], p = (t * .8 + i / hotJets.length) % 1, a = i * 2.399;
        jet.visible = t > 0 && v.gas > 0; jet.position.set(Math.cos(a) * p * .3, 5.65 + p * e.fountain, Math.sin(a) * p * .3);
        jet.scale.set(.45 * (1 - p) + .08, .65 * (1 - p) + .15, 1);
        jet.material.opacity = e.active * (1 - p) * .68;
      }
      fragments.forEach((ember, i) => {
        const particle = lavaFragment(i, t, v); ember.visible = particle.visible;
        ember.position.set(particle.x, particle.y, particle.z); ember.material.opacity = Math.max(.25, 1 - particle.age / 3);
      });
      ashFall.visible = t > 1 && e.ash > .1;
      for (let i = 0; i < 180; i++) {
        const p = (t * .085 + seeded(i + 12)) % 1, a = i * 2.399, radius = .8 + p * 6;
        ashPositions.set([Math.cos(a) * radius + p * 3, 5.8 + e.plumeHeight * (1 - p), Math.sin(a) * radius - p * 2], i * 3);
      }
      ashGeometry.attributes.position.needsUpdate = true;
    }
    const render = (now: number) => {
      if (disposed) return; frame = requestAnimationFrame(render); if (document.hidden || now - lastFrame < 30) return; lastFrame = now;
      if (previousTime !== live.current.time || previousValues !== live.current.values) {
        updateEffects(); previousTime = live.current.time; previousValues = live.current.values;
      }
      orbit.update(); renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);
    const onLost = (event: Event) => { event.preventDefault(); if (!disposed) { cancelAnimationFrame(frame); setFailed(true); } };
    canvas.addEventListener("webglcontextlost", onLost);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); orbit.dispose();
      canvas.removeEventListener("webglcontextlost", onLost); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
      sun.shadow.map?.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); actions.current = idleActions;
    };
  }, []);

  function changeView(next: View) { setView(next); actions.current.view(next); }
  return <div className={styles.scene}>
    <div ref={host} className={styles.canvas} role="img" aria-label="Rugged volcano with a glowing crater, lava flows, incandescent fragments and drifting volcanic gas and ash" />
    <div className={styles.phase}>
      <span>VOLCANO OBSERVATORY</span>
      <strong>{time === 0 ? "A restless crater" : `${state.style} eruption`}</strong>
      <small>{time === 0 ? "Press Run, or launch an example below." : state.style === "Explosive" ? "Trapped gas drives a dense ash plume." : state.style === "Effusive" ? "Fluid lava spills down the rocky flanks." : "Lava fountains and ash erupt together."}</small>
      <div className={styles.examples}>
        <button aria-label="Run lava-flow example" title="Run with gas 1% and viscosity 10² Pa·s" onClick={() => onExample("effusive")}><b aria-hidden="true">●</b>Lava flow</button>
        <button aria-label="Run ash-plume example" title="Run with gas 6% and viscosity 10⁶ Pa·s" onClick={() => onExample("explosive")}><b aria-hidden="true">●</b>Ash plume</button>
      </div>
    </div>
    <div className={styles.camera} role="toolbar" aria-label="Volcano camera controls">
      <div className={styles.presets}>{(["ridge", "crater", "aerial"] as View[]).map(p => <button key={p} aria-label={`${p[0].toUpperCase() + p.slice(1)} view`} aria-pressed={view === p} onClick={() => changeView(p)}>{p[0].toUpperCase() + p.slice(1)}</button>)}</div>
      <div className={styles.cameraButtons}>
        <button aria-label="Zoom in" title="Zoom in" onClick={() => actions.current.zoom(1)}><GameControlIcon kind="plus" /></button>
        <button aria-label="Zoom out" title="Zoom out" onClick={() => actions.current.zoom(-1)}><GameControlIcon kind="minus" /></button>
        <button aria-label="Rotate left" title="Rotate left" onClick={() => actions.current.rotate(-1)}><GameControlIcon kind="left" /></button>
        <button aria-label="Rotate right" title="Rotate right" onClick={() => actions.current.rotate(1)}><GameControlIcon kind="right" /></button>
        <button aria-label="Reset view" title="Reset view" onClick={() => changeView("ridge")}><GameControlIcon kind="home" /></button>
      </div>
    </div>
    <div className={styles.legend}><div><span><i />Glowing molten rock</span><span><i />Volcanic gas & ash</span></div><small>Illustrative eruption · time and scale compressed</small></div>
    {failed && <div className={styles.fallback}>The 3D view is unavailable on this device. You can still change the settings, compare measurements, and complete the eruption investigation.</div>}
  </div>;
}
