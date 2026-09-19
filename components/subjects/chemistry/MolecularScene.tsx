"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { molecules, phase } from "@/lib/simulations/chemistry/model";
import { loadSettings, prefersReducedMotion, renderProfile } from "@/lib/settings/storage";

export type Attachment = { atom: string; order: number };
const colors: Record<string, number> = {
  H: 0xe9f2fa, O: 0xf05d70, C: 0x65788e, N: 0x6388ff, F: 0x8cdb95, B: 0xf2bd82,
  Al: 0xc9c2d6, Si: 0xe0c98f, P: 0xffab5e, S: 0xf5db6b, Cl: 0x5fd97a, Ga: 0xd9a8a8, Ge: 0x9fc2c2,
  As: 0xc9a0e0, Se: 0xffb870, Br: 0xb5544f, Sn: 0x8fa3a3, Sb: 0xb98fd1, Te: 0xd9b25e, I: 0xa15fc2, Xe: 0x6bc4d1,
  Be: 0x9fd67f, Mg: 0x7fbf7f, Ti: 0xc7ccd6, Zn: 0x9a9fd6, Cd: 0xf0d9a1, Hg: 0xc7c7dc, Pb: 0x7a7d87,
  Mo: 0x7fc2c2, W: 0x5fa3c9, U: 0x6f9fd1, Nb: 0x8fd1c9, Mn: 0xb583a8, Cr: 0x6f93d1,
};

// Generic VSEPR direction table: given bonding domains (`count`) and lone pairs (`lone`),
// returns unit vectors for the bonding directions. Lone pairs are removed from the front of
// each domain-count's canonical position list, in the order real molecules prefer them
// (equatorial-first for 5 domains; a trans pair for the second lone pair at 6 domains) —
// this reproduces the correct idealized geometry for every AXnEm combination up to 6 domains.
function directionsFor(count: number, lone: number, angleDeg: number): THREE.Vector3[] {
  const domains = count + lone;
  const rad = angleDeg * Math.PI / 180;
  if (domains <= 2) return [new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 0, 0)].slice(0, count);
  if (domains === 3) {
    if (lone === 0) return [0, 1, 2].map(i => new THREE.Vector3(Math.cos(i * 2 * Math.PI / 3), Math.sin(i * 2 * Math.PI / 3), 0));
    return [-1, 1].map(sign => new THREE.Vector3(sign * Math.sin(rad / 2), -Math.cos(rad / 2), 0));
  }
  if (domains === 4) {
    if (lone === 0) return [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(p => new THREE.Vector3(...(p as [number,number,number])).normalize());
    if (lone === 1) {
      const vertical = Math.sqrt(Math.max(0, (Math.cos(rad) + .5) / 1.5));
      const radius = Math.sqrt(Math.max(0, 1 - vertical ** 2));
      return [0, 1, 2].map(i => new THREE.Vector3(radius * Math.cos(i * 2 * Math.PI / 3), -vertical, radius * Math.sin(i * 2 * Math.PI / 3)));
    }
    return [-1, 1].map(sign => new THREE.Vector3(sign * Math.sin(rad / 2), -Math.cos(rad / 2), 0));
  }
  if (domains === 5) {
    const equatorial = [0, 1, 2].map(i => new THREE.Vector3(Math.cos(i * 2 * Math.PI / 3), 0, Math.sin(i * 2 * Math.PI / 3)));
    const axial = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)];
    return [...equatorial, ...axial].slice(lone, lone + count);
  }
  // domains === 6 (octahedral family): drop `lone` positions, taking the second lone pair
  // from the opposite (trans) side of the first so two lone pairs always end up square planar.
  const oct = [new THREE.Vector3(1,0,0), new THREE.Vector3(-1,0,0), new THREE.Vector3(0,1,0), new THREE.Vector3(0,-1,0), new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,-1)];
  return oct.slice(lone, lone + count);
}

export function MolecularScene({ molecule = 0, attachments, matter, temperature = 25, paused, resetKey }: { molecule?: number; attachments?: Attachment[]; matter?: boolean; temperature?: number; paused: boolean; resetKey: number }) {
  const host = useRef<HTMLDivElement>(null);
  const live = useRef({ paused, temperature });
  live.current = { paused, temperature };
  const cameraControls = useRef<OrbitControls | null>(null);
  const [failed, setFailed] = useState(false);
  const attached = attachments?.map(a => `${a.atom}:${a.order}`).join(",");

  // Buttons drive zoom instead of scroll/pinch (enableZoom stays off) so the page
  // keeps scrolling normally when the pointer is over the 3D stage.
  const zoomBy = (factor: number) => {
    const controls = cameraControls.current;
    if (!controls) return;
    const camera = controls.object as THREE.PerspectiveCamera;
    const offset = camera.position.clone().sub(controls.target);
    const distance = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
    offset.setLength(distance);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  };

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { setFailed(true); return; }
    setFailed(false);
    const settings = loadSettings(), profile = renderProfile(settings.quality);
    const reduced = prefersReducedMotion(settings);
    renderer.setPixelRatio(Math.min(devicePixelRatio, profile.pixelRatioCap));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    camera.position.set(0, 1, 12);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 6; controls.maxDistance = 18;
    controls.enableZoom = false; // Let normal page scrolling work over the stage.
    cameraControls.current = controls;
    scene.add(new THREE.HemisphereLight(0xe8eeff, 0x303540, 3));
    const key = new THREE.DirectionalLight(0xffffff, 4); key.position.set(-4, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x7e9fe8, 3); rim.position.set(4, 1, -3); scene.add(rim);
    const model = new THREE.Group(); scene.add(model);
    const sphere = new THREE.SphereGeometry(1, settings.quality === "low" ? 16 : 32, 24);
    const materials = Object.fromEntries(Object.entries(colors).map(([atom, color]) => [atom, new THREE.MeshStandardMaterial({ color, roughness: .24, metalness: .12 })]));
    const bondMaterial = new THREE.MeshStandardMaterial({ color: 0xabc1d3, metalness: .45, roughness: .3 });
    const particles: THREE.Mesh[] = [];
    const atom = (element: string, pos: THREE.Vector3, radius: number) => { const mesh = new THREE.Mesh(sphere, materials[element] ?? materials.H); mesh.position.copy(pos); mesh.scale.setScalar(radius); model.add(mesh); return mesh; };
    const bond = (end: THREE.Vector3, order: number) => {
      for (let j = 0; j < order; j++) {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(.065, .065, end.length(), 12), bondMaterial);
        mesh.position.copy(end).multiplyScalar(.5); mesh.position.z += (j - (order - 1) / 2) * .2;
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().normalize()); model.add(mesh);
      }
    };
    if (matter) {
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6, 4, 3)), new THREE.LineBasicMaterial({ color: 0x89a5cf, transparent: true, opacity: .5 }));
      model.add(edges);
      for (let i = 0; i < 64; i++) particles.push(atom("O", new THREE.Vector3(), .14));
    } else {
      const m = molecules[molecule];
      atom(m.center, new THREE.Vector3(), .56);
      const directions = directionsFor(m.count, m.lone, m.angle);
      const items = attached === undefined ? directions.map(() => ({ atom: m.outer, order: m.order })) : attached ? attached.split(",").map(s => ({ atom: s.split(":")[0], order: Number(s.split(":")[1]) })) : [];
      items.forEach((item, i) => { const end = directions[i]?.clone().multiplyScalar(2); if (!end) return; bond(end, item.order); atom(item.atom, end, item.atom === "H" ? .34 : .48); });
      if (attachments === undefined) for (let i = 0; i < m.lone; i++) {
        const lobe = new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({ color: 0xd2acff, transparent: true, opacity: .25, depthWrite: false }));
        lobe.scale.set(.45,.8,.4); lobe.position.set((i - (m.lone - 1)/2)*1.2, 1.1, -.3); model.add(lobe);
        for (const dx of [-.12,.12]) { const electron = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xd5a9ff })); electron.scale.setScalar(.07); electron.position.copy(lobe.position); electron.position.x += dx; model.add(electron); }
      }
    }
    const resize = () => { const w = container.clientWidth, h = container.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    let raf = 0, clock = 0, last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(.05, (now-last)/1000); last=now;
      if (!live.current.paused && !reduced) clock += dt;
      if (matter) {
        const state = phase(live.current.temperature);
        particles.forEach((p,i) => {
          const seed = i * 2.39996;
          const speed = Math.sqrt((live.current.temperature + 273.15)/298);
          if (state === "Solid") p.position.set((i%8-3.5)*.48 + Math.sin(clock*8+seed)*.025, -1.5 + Math.floor(i/16)*.42 + Math.cos(clock*8+seed)*.025, (Math.floor(i/8)%2-.5)*.55);
          else if (state === "Liquid") p.position.set(Math.sin(seed+clock*.55*speed)*2.5, -1.6 + (Math.sin(seed*3+clock*speed)+1)*.55, Math.cos(seed*2+clock*.4)*1.15);
          else { const bounce = (v:number, span:number) => Math.abs(((v% (4*span)) + 4*span)%(4*span)-2*span)-span; p.position.set(bounce(seed+clock*speed*1.9,2.7),bounce(seed*2+clock*speed*1.3,1.7),bounce(seed*3+clock*speed,1.2)); }
        });
      }
      controls.update(); renderer.render(scene,camera); raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); controls.dispose(); cameraControls.current=null; const geometries = new Set<THREE.BufferGeometry>(); const mats = new Set<THREE.Material>([...Object.values(materials),bondMaterial]); scene.traverse(o=>{ if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) { geometries.add(o.geometry); (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m)); } }); geometries.add(sphere); geometries.forEach(g=>g.dispose()); mats.forEach(m=>m.dispose()); renderer.dispose(); renderer.domElement.remove(); };
  // Rebuild geometry only for a changed molecule/build, not for temperature or playback.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [molecule, attached, matter, resetKey]);
  return <div className="chemMolecular"><div className="chemWebgl" ref={host} role="img" aria-label={matter ? `Water particles: ${phase(temperature)}` : `${molecules[molecule].formula} molecular model`} />{failed && <p className="chemRenderFallback">3D rendering is unavailable on this device. The controls, molecular data, and mission still work.</p>}<div className="chemOrbitBar"><span>Drag to rotate · touch to explore</span><div className="chemZoomGroup"><button onClick={() => zoomBy(1 / 1.2)} aria-label="Zoom in">+</button><button onClick={() => zoomBy(1.2)} aria-label="Zoom out">−</button><button onClick={() => cameraControls.current?.reset()}>Reset view</button></div></div></div>;
}
