"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { SubjectSlug } from "@/lib/subjects/catalog";

function moonPhasePath(angle: number) {
  const radians = angle * Math.PI / 180;
  const terminatorRadius = Math.abs(Math.cos(radians) * 48).toFixed(2);
  if (angle <= 180) {
    const sweep = angle < 90 ? 0 : 1;
    return `M50 2 A48 48 0 0 1 50 98 A${terminatorRadius} 48 0 0 ${sweep} 50 2 Z`;
  }
  const sweep = angle < 270 ? 0 : 1;
  return `M50 2 A48 48 0 0 0 50 98 A${terminatorRadius} 48 0 0 ${sweep} 50 2 Z`;
}

const escapeWorlds = {
  Earth: { mu: 3.986004418e14, radius: 6_371_000, displayRadius: 1.05, color: 0x2f80c9, texture: "earth" },
  Moon: { mu: 4.9048695e12, radius: 1_737_400, displayRadius: .82, color: 0x9da3ad, texture: "moon" },
  Mars: { mu: 4.282837e13, radius: 3_389_500, displayRadius: .92, color: 0xb75b46, texture: "moon" },
  Jupiter: { mu: 1.26686534e17, radius: 69_911_000, displayRadius: 1.45, color: 0xc88e67, texture: "none" },
} as const;

function escapeProfile(values: Record<string, number | string>) {
  const worldName = String(values.world) as keyof typeof escapeWorlds;
  const world = escapeWorlds[worldName] ?? escapeWorlds.Earth;
  const altitude = Number(values.altitude) || 0;
  const launchSpeed = Number(values.launchSpeed) || 0;
  const distance = world.radius + altitude * 1000;
  const circularSpeed = Math.sqrt(world.mu / distance) / 1000;
  const escapeSpeed = Math.sqrt(2 * world.mu / distance) / 1000;
  const outcome = launchSpeed < circularSpeed ? "suborbital" : launchSpeed < escapeSpeed ? "orbit" : "escape";
  return { worldName, world, altitude, launchSpeed, circularSpeed, escapeSpeed, outcome };
}

function escapeTrajectory(profile: ReturnType<typeof escapeProfile>, t: number) {
  const radius = profile.world.displayRadius;
  if (profile.outcome === "suborbital") {
    return new THREE.Vector3((t - .5) * radius * 2.6, radius * 1.05 + Math.sin(t * Math.PI) * radius * 1.5, 0);
  }
  if (profile.outcome === "orbit") {
    const ratio = Math.max(.72, Math.min(.99, profile.launchSpeed / profile.escapeSpeed));
    const semiMajor = radius * (1.7 + ratio * .55);
    const eccentricity = .08 + (1 - ratio) * .22;
    const theta = t * Math.PI * 2;
    return new THREE.Vector3(Math.sin(theta) * semiMajor, Math.cos(theta) * semiMajor * Math.sqrt(1 - eccentricity * eccentricity), 0);
  }
  return new THREE.Vector3(t * radius * 4.2, radius * 1.05 + t * radius * 2.9 - t * t * radius * .8, 0);
}

function seasonProfile(values: Record<string, number | string>) {
  const angle = ((Number(values.orbitAngle) || 0) % 360 + 360) % 360;
  const tilt = Math.max(0, Number(values.tilt) || 0);
  const latitude = Math.max(0, Number(values.latitude) || 0);
  const season = angle < 45 || angle >= 315 ? "March equinox" : angle < 135 ? "June solstice" : angle < 225 ? "September equinox" : "December solstice";
  const declination = tilt * Math.sin(THREE.MathUtils.degToRad(angle));
  return { angle, tilt, latitude, season, declination };
}

export function ExpandedThreeScene({ subject, slug, values, ariaLabel }: { subject: SubjectSlug; slug: string; values: Record<string, number | string>; ariaLabel: string }) {
  const host = useRef<HTMLDivElement>(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const numeric = Object.values(values).filter((value): value is number => typeof value === "number");
  const a = numeric[0] ?? 1; const b = numeric[1] ?? 1; const c = numeric[2] ?? 1;

  useEffect(() => {
    const node = host.current; if (!node) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 3.2, 8.4);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(node.clientWidth || 640, node.clientHeight || 360);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    node.appendChild(renderer.domElement);
    const controls = slug === "moon-phases-3d" || slug === "escape-velocity" || slug === "earth-seasons-tilt" ? new OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = .08;
      controls.enablePan = false;
      controls.minDistance = 4.4;
      controls.maxDistance = 12;
      controls.target.set(0, .1, 0);
    }
    scene.add(new THREE.AmbientLight(0xffffff, 0.14));
    const key = new THREE.DirectionalLight(0xffffff, 1.35); key.position.set(4, 6, 5); scene.add(key);
    const group = new THREE.Group(); scene.add(group);
    let moonObject: THREE.Mesh | null = null;
    let sunTimeUniform: { value: number } | null = null;
    let escapePlanet: THREE.Mesh | null = null;
    let escapeAtmosphere: THREE.Mesh | null = null;
    let escapeCraft: THREE.Group | null = null;
    let escapePath: THREE.Line | null = null;
    let escapePathMaterial: THREE.LineBasicMaterial | null = null;
    let escapeEarthMap: THREE.Texture | null = null;
    let escapeMoonMap: THREE.Texture | null = null;
    let seasonEarth: THREE.Mesh | null = null;
    let seasonAtmosphere: THREE.Mesh | null = null;
    let seasonAxis: THREE.Line | null = null;
    let seasonAxisArrow: THREE.ArrowHelper | null = null;
    let seasonMarker: THREE.Mesh | null = null;

    const sphere = (radius: number, color: number, x = 0, y = 0, z = 0) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 20), new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: .05 }));
      mesh.position.set(x, y, z); group.add(mesh); return mesh;
    };
    const box = (x: number, y: number, z: number, color: number, px = 0, py = 0, pz = 0) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), new THREE.MeshStandardMaterial({ color, roughness: .6 }));
      mesh.position.set(px, py, pz); group.add(mesh); return mesh;
    };
    const lineLoop = (rx: number, rz: number, color = 0x7388a8) => {
      const pts = Array.from({ length: 97 }, (_, i) => { const t = i / 96 * Math.PI * 2; return new THREE.Vector3(Math.cos(t) * rx, 0, Math.sin(t) * rz); });
      const geo = new THREE.BufferGeometry().setFromPoints(pts); const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .55 })); group.add(line); return line;
    };

    if (subject === "space") {
      const sun = sphere(slug.includes("black-hole") ? .75 : .62, slug.includes("black-hole") ? 0x111827 : 0xf6b73c) as THREE.Mesh;
      if (slug === "moon-phases-3d") {
        scene.background = new THREE.Color(0x06111d);
        const starPositions = new Float32Array(360 * 3);
        for (let i = 0; i < 360; i++) {
          const radius = 18 + (i % 9) * 1.4; const theta = i * 2.39996; const phi = Math.acos(1 - 2 * ((i + 1) / 361));
          starPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
          starPositions[i * 3 + 1] = Math.cos(phi) * radius;
          starPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
        }
        const starGeometry = new THREE.BufferGeometry(); starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xdbeafe, size: .045, sizeAttenuation: true, transparent: true, opacity: .82 })));
        // A to-scale-in-spirit classroom model: the Sun illuminates the Moon,
        // while the camera observes from Earth. At 0° the Moon is between the
        // Sun and Earth (new moon); at 180° it is opposite the Sun (full moon).
        sun.position.set(-4.6, 1.15, -0.35);
        sun.scale.setScalar(1.18);
        key.position.copy(sun.position);
        sunTimeUniform = { value: 0 };
        sun.material = new THREE.ShaderMaterial({
          uniforms: { time: sunTimeUniform },
          vertexShader: `varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
          fragmentShader: `uniform float time; varying vec3 vNormal; void main(){float bands=sin(vNormal.x*13.0+time*1.8)+sin(vNormal.y*19.0-time*1.35)+sin(vNormal.z*23.0+time*.8);float flare=clamp(bands*.16+.5,0.0,1.0);vec3 color=mix(vec3(1.0,.18,.015),vec3(1.0,.92,.34),flare);float rim=pow(1.0-max(dot(vNormal,vec3(0.0,0.0,1.0)),0.0),2.0);gl_FragColor=vec4(color*(1.05+rim*.55),1.0);}`,
        });
        const corona = new THREE.Mesh(new THREE.SphereGeometry(.95, 32, 20), new THREE.MeshBasicMaterial({ color: 0xffa31a, transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending }));
        corona.position.copy(sun.position); group.add(corona);
        const innerCorona = new THREE.Mesh(new THREE.SphereGeometry(.82, 32, 20), new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: .12, depthWrite: false, blending: THREE.AdditiveBlending }));
        innerCorona.position.copy(sun.position); group.add(innerCorona);
        const sunlight = new THREE.PointLight(0xfff4d6, 55, 30, 1.3);
        sunlight.position.copy(sun.position);
        scene.add(sunlight);

        const orbitRadius = 3.15;
        lineLoop(orbitRadius, orbitRadius, 0x46647b);
        const earth = sphere(.72, 0x2563eb, 0, 0, 0) as THREE.Mesh;
        earth.scale.setScalar(1.24);
        const textureLoader = new THREE.TextureLoader();
        const earthMap = textureLoader.load("/textures/earth-day.jpg");
        const normalMap = textureLoader.load("/textures/earth-normal.jpg");
        const specularMap = textureLoader.load("/textures/earth-specular.jpg");
        earthMap.colorSpace = THREE.SRGBColorSpace;
        const earthMaterial = new THREE.MeshPhongMaterial({ map: earthMap, normalMap, normalScale: new THREE.Vector2(.42, .42), specularMap, specular: new THREE.Color(0x7fb8d8), shininess: 18 });
        earth.material = earthMaterial;
        earth.rotation.y = -.68;
        const cloudMap = textureLoader.load("/textures/earth-clouds.png");
        const cloudLayer = new THREE.Mesh(new THREE.SphereGeometry(.91, 32, 20), new THREE.MeshPhongMaterial({ map: cloudMap, transparent: true, opacity: .42, depthWrite: false, shininess: 0 }));
        cloudLayer.rotation.y = -.42; group.add(cloudLayer);
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(.96, 32, 20), new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: .13, side: THREE.BackSide }));
        group.add(atmosphere);

        const theta = THREE.MathUtils.degToRad(Number(values.angle) || 0);
        const moonPosition = new THREE.Vector3(-Math.cos(theta) * orbitRadius, Math.sin(theta) * orbitRadius * Math.sin(THREE.MathUtils.degToRad(Number(values.inclination) || 0)), Math.sin(theta) * orbitRadius);
        const moon = sphere(.28, 0xcbd5e1, moonPosition.x, moonPosition.y, moonPosition.z) as THREE.Mesh;
        moonObject = moon;
        const moonMap = textureLoader.load("/textures/moon.jpg");
        moonMap.colorSpace = THREE.SRGBColorSpace;
        moon.material = new THREE.MeshPhongMaterial({ map: moonMap, color: 0xffffff, shininess: 4, specular: new THREE.Color(0x30343b) });
        moon.rotation.y = .48;
        const observer = new THREE.Mesh(new THREE.SphereGeometry(.055, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        observer.position.set(0, .56, .02); group.add(observer);
        const ray = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), sun.position, 1.1, 0xfbbf24, .12, .07); ray.position.set(0, .1, 0); group.add(ray);
      } else if (slug === "escape-velocity") {
        scene.background = new THREE.Color(0x030914);
        sun.visible = false;
        const starPositions = new Float32Array(260 * 3);
        for (let i = 0; i < 260; i++) {
          const radius = 17 + (i % 7) * 1.8; const theta = i * 2.41; const phi = Math.acos(1 - 2 * ((i + 1) / 261));
          starPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
          starPositions[i * 3 + 1] = Math.cos(phi) * radius;
          starPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
        }
        const starGeometry = new THREE.BufferGeometry(); starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xcfe3ff, size: .05, sizeAttenuation: true, transparent: true, opacity: .8 })));
        const textureLoader = new THREE.TextureLoader();
        escapeEarthMap = textureLoader.load("/textures/earth-day.jpg"); escapeEarthMap.colorSpace = THREE.SRGBColorSpace;
        escapeMoonMap = textureLoader.load("/textures/moon.jpg"); escapeMoonMap.colorSpace = THREE.SRGBColorSpace;
        const initialProfile = escapeProfile(values);
        const planetMaterial = new THREE.MeshPhongMaterial({ map: escapeEarthMap, color: 0xffffff, normalMap: textureLoader.load("/textures/earth-normal.jpg"), normalScale: new THREE.Vector2(.3, .3), specular: new THREE.Color(0x6da9cc), shininess: 16 });
        const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), planetMaterial);
        planet.scale.setScalar(initialProfile.world.displayRadius); group.add(planet); escapePlanet = planet;
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 40), new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: .16, side: THREE.BackSide }));
        atmosphere.scale.setScalar(initialProfile.world.displayRadius); group.add(atmosphere); escapeAtmosphere = atmosphere;
        lineLoop(1.65, 1.65, 0x214566); lineLoop(2.1, 2.1, 0x16334f);
        const initialPoints = Array.from({ length: 80 }, (_, i) => escapeTrajectory(initialProfile, i / 79));
        escapePathMaterial = new THREE.LineBasicMaterial({ color: initialProfile.outcome === "escape" ? 0x38bdf8 : initialProfile.outcome === "orbit" ? 0xa78bfa : 0xfb7185, transparent: true, opacity: .78 });
        escapePath = new THREE.Line(new THREE.BufferGeometry().setFromPoints(initialPoints), escapePathMaterial); group.add(escapePath);
        const craft = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(.1, .14, .42, 16), new THREE.MeshStandardMaterial({ color: 0xe5edf5, metalness: .4, roughness: .3 })); craft.add(body);
        const nose = new THREE.Mesh(new THREE.ConeGeometry(.1, .22, 16), new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: .15, roughness: .35 })); nose.position.y = .31; craft.add(nose);
        const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x2563eb, emissive: 0x0b2b75, emissiveIntensity: .4, metalness: .45, roughness: .25 });
        const panelA = new THREE.Mesh(new THREE.BoxGeometry(.62, .025, .22), panelMaterial); panelA.position.x = -.38; craft.add(panelA);
        const panelB = new THREE.Mesh(new THREE.BoxGeometry(.62, .025, .22), panelMaterial); panelB.position.x = .38; craft.add(panelB);
        craft.scale.setScalar(.78); group.add(craft); escapeCraft = craft;
      } else if (slug === "earth-seasons-tilt") {
        scene.background = new THREE.Color(0x020b16);
        const starPositions = new Float32Array(280 * 3);
        for (let i = 0; i < 280; i++) {
          const radius = 17 + (i % 8) * 1.6; const theta = i * 2.39996; const phi = Math.acos(1 - 2 * ((i + 1) / 281));
          starPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
          starPositions[i * 3 + 1] = Math.cos(phi) * radius;
          starPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
        }
        const starGeometry = new THREE.BufferGeometry(); starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xdbeafe, size: .05, sizeAttenuation: true, transparent: true, opacity: .82 })));

        // Put the Sun at the center so the changing axial tilt can be read
        // directly from every point on Earth's orbit.
        sun.visible = true; sun.position.set(0, 0, 0); sun.scale.setScalar(1.28);
        key.intensity = .18;
        sunTimeUniform = { value: 0 };
        sun.material = new THREE.ShaderMaterial({
          uniforms: { time: sunTimeUniform },
          vertexShader: `varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
          fragmentShader: `uniform float time; varying vec3 vNormal; void main(){float bands=sin(vNormal.x*13.0+time*1.8)+sin(vNormal.y*19.0-time*1.35)+sin(vNormal.z*23.0+time*.8);float flare=clamp(bands*.16+.5,0.0,1.0);vec3 color=mix(vec3(1.0,.16,.01),vec3(1.0,.94,.38),flare);float rim=pow(1.0-max(dot(vNormal,vec3(0.0,0.0,1.0)),0.0),2.0);gl_FragColor=vec4(color*(1.08+rim*.62),1.0);}`,
        });
        const corona = new THREE.Mesh(new THREE.SphereGeometry(1.02, 32, 20), new THREE.MeshBasicMaterial({ color: 0xff9f1a, transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending }));
        group.add(corona);
        const innerCorona = new THREE.Mesh(new THREE.SphereGeometry(.84, 32, 20), new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: .12, depthWrite: false, blending: THREE.AdditiveBlending }));
        group.add(innerCorona);
        const sunlight = new THREE.PointLight(0xfff3cf, 65, 28, 1.25); scene.add(sunlight);

        const orbitRadius = 3.25;
        lineLoop(orbitRadius, orbitRadius, 0x46647b);
        const initial = seasonProfile(values);
        const textureLoader = new THREE.TextureLoader();
        const earthMap = textureLoader.load("/textures/earth-day.jpg"); earthMap.colorSpace = THREE.SRGBColorSpace;
        const earthNormal = textureLoader.load("/textures/earth-normal.jpg");
        const earthSpecular = textureLoader.load("/textures/earth-specular.jpg");
        const earth = new THREE.Mesh(new THREE.SphereGeometry(.86, 64, 40), new THREE.MeshPhongMaterial({ map: earthMap, normalMap: earthNormal, normalScale: new THREE.Vector2(.35, .35), specularMap: earthSpecular, specular: new THREE.Color(0x80bed8), shininess: 20 }));
        earth.position.set(Math.cos(THREE.MathUtils.degToRad(initial.angle)) * orbitRadius, 0, -Math.sin(THREE.MathUtils.degToRad(initial.angle)) * orbitRadius);
        earth.rotation.z = THREE.MathUtils.degToRad(initial.tilt); earth.rotation.y = -.5; group.add(earth); seasonEarth = earth;
        const cloudMap = textureLoader.load("/textures/earth-clouds.png");
        const clouds = new THREE.Mesh(new THREE.SphereGeometry(.89, 48, 32), new THREE.MeshPhongMaterial({ map: cloudMap, transparent: true, opacity: .43, depthWrite: false, shininess: 0 }));
        clouds.rotation.y = -.18; earth.add(clouds);
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(.94, 48, 32), new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: .15, side: THREE.BackSide }));
        atmosphere.position.copy(earth.position); group.add(atmosphere); seasonAtmosphere = atmosphere;

        const axisGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -1.32, 0), new THREE.Vector3(0, 1.32, 0)]);
        const axis = new THREE.Line(axisGeometry, new THREE.LineBasicMaterial({ color: 0xfde68a, transparent: true, opacity: .9 }));
        axis.position.copy(earth.position); axis.rotation.z = THREE.MathUtils.degToRad(initial.tilt); group.add(axis); seasonAxis = axis;
        const axisArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1.18, 0), .34, 0xfde68a, .12, .07);
        axisArrow.position.copy(earth.position); axisArrow.rotation.z = THREE.MathUtils.degToRad(initial.tilt); group.add(axisArrow); seasonAxisArrow = axisArrow;
        const observer = new THREE.Mesh(new THREE.SphereGeometry(.075, 16, 10), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        const initialLatitude = THREE.MathUtils.degToRad(initial.latitude);
        observer.position.set(0, Math.sin(initialLatitude) * .91, Math.cos(initialLatitude) * .91); earth.add(observer); seasonMarker = observer;
        const markerRing = new THREE.Mesh(new THREE.TorusGeometry(.94, .012, 8, 64), new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: .3 }));
        markerRing.rotation.z = Math.PI / 2; earth.add(markerRing);
        sunlight.position.set(0, 0, 0);
      } else if (slug === "solar-eclipse-3d") {
        const earth=sphere(.45,0x2563eb,2.9,0,0); const offset=Number(values.offset||0); sphere(.15,0xcbd5e1,1.95,offset*1.4,0); const ray=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(.7,0,0),1.7,0xfbbf24,.18,.1); group.add(ray); earth.rotation.z=.15;
      } else if (slug.includes("black-hole")) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, .16, 14, 80), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x6b2c00, emissiveIntensity: .8 })); ring.rotation.x = Math.PI / 2.4; group.add(ring); lineLoop(2.4, 1.45); sphere(.16, 0xe2e8f0, 2.2, .1, 0);
      } else if (slug.includes("planet-size")) {
        sun.visible = false; const radii:Record<string,number>={Mercury:.38,Venus:.95,Earth:1,Mars:.53,Jupiter:2.2,Saturn:1.85,Uranus:1.35,Neptune:1.3}; const ra=radii[String(values.planetA)]??1,rb=radii[String(values.planetB)]??2.2; sphere(.72*ra,0x3b82f6,-1.7,0,0); sphere(.72*rb,0xd8a35d,1.65,0,0);
      } else if (slug.includes("mars-landing")) {
        sun.visible = false; const mars = sphere(2.4, 0xb85b3b, 0, -2.6, 0); mars.scale.y = .38; const craft = box(.5, .4, .5, 0xe2e8f0, 0, .6 + Math.min(2.4, a / 20), 0); craft.rotation.z = (b / 100) * .35;
      } else {
        const eccentric = slug.includes("kepler") ? Math.max(.2, 1-Number(values.eccentricity||0)) : 1;
        const orbitRadius=slug.includes("kepler")?Math.min(3.6,1.8+Number(values.semiMajor||1)*.32):2.9;
        lineLoop(orbitRadius, orbitRadius * eccentric); const theta = ((a % 360) / 180) * Math.PI; const earth = sphere(.42, 0x2563eb, Math.cos(theta) * orbitRadius, 0, Math.sin(theta) * orbitRadius * eccentric);
        if (slug.includes("seasons")) earth.rotation.z = THREE.MathUtils.degToRad(Number(values.tilt||23.44));
      }
    } else if (subject === "physics") {
      if (slug.includes("inclined")) { const ramp = box(5.2, .25, 2, 0x94a3b8, 0, -.8, 0); ramp.rotation.z = THREE.MathUtils.degToRad(Math.min(40, a)); const block = box(.7, .7, .7, 0x2563eb, -1.2, .25, 0); block.rotation.z = ramp.rotation.z; }
      else if (slug.includes("collision")) { sphere(.55, 0x2563eb, -2 + Math.min(1.4, a / 10), 0, 0); sphere(.55, 0xf97316, 2 - Math.min(1.4, b / 10), 0, 0); box(6, .12, 1.6, 0x94a3b8, 0, -.7, 0); }
      else if (slug.includes("bridge")) { for (let i = -3; i <= 3; i++) box(.12, 1.3, .16, 0x334155, i * .7, -.1 + Math.abs(i) * .12, 0); box(5.1, .18, 1.2, 0x64748b, 0, -.65, 0); sphere(.38, 0xef4444, 0, -.18, 0); }
      else if (slug.includes("electromagnet")) { for (let i = -10; i <= 10; i++) { const tor = new THREE.Mesh(new THREE.TorusGeometry(.7, .055, 10, 26), new THREE.MeshStandardMaterial({ color: 0xb45309 })); tor.position.x = i * .16; tor.rotation.y = Math.PI / 2; group.add(tor); } box(3.8, .38, .38, 0x475569); }
      else { box(1.15, 1.15, 1.15, 0x2563eb); box(6, .12, 2, 0x94a3b8, 0, -.8, 0); const arrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(-1.8,.2,0), 2.3, 0xef4444, .3, .2); group.add(arrow); }
    } else if (subject === "geography") {
      if (slug.includes("volcano")) { const cone = new THREE.Mesh(new THREE.ConeGeometry(2.1, 3, 44), new THREE.MeshStandardMaterial({ color: 0x785d42, roughness: 1 })); cone.position.y = -.7; group.add(cone); sphere(.28 + Math.min(.5, a / 100), 0xef4444, 0, 1.15, 0); }
      else if (slug.includes("plate")) { const left = box(3.1,.35,3,0x9a7b56,-1.7,0,0); const right = box(3.1,.35,3,0x6f8a55,1.7,0,0); left.rotation.z = .05; right.rotation.z = -.05; }
      else { const earth = sphere(2.25, 0x3b82f6); const land = sphere(2.29, 0x4d7c4a); land.scale.set(.75,.24,.65); land.position.set(-.3,.3,1.75); if (slug.includes("ocean")) { for (let i=0;i<6;i++){ const tor=new THREE.Mesh(new THREE.TorusGeometry(2.55+i*.04,.015,6,80),new THREE.MeshBasicMaterial({color:0x38bdf8})); tor.rotation.x=Math.PI/2 + i*.12; group.add(tor); } } earth.rotation.y = a / 40; }
    } else if (subject === "biology") {
      if (slug.includes("dna") || slug.includes("protein")) { for (let i=0;i<26;i++){ const t=i*.42; sphere(.11,0x2563eb,Math.cos(t)*.75,(i-13)*.16,Math.sin(t)*.75); sphere(.11,0xef4444,-Math.cos(t)*.75,(i-13)*.16,-Math.sin(t)*.75); } group.rotation.z = Math.PI/2; }
      else { const cell = sphere(2.1, 0x77a88b); (cell.material as THREE.MeshStandardMaterial).transparent = true; (cell.material as THREE.MeshStandardMaterial).opacity = .28; sphere(.72,0x7c3aed,.2,.1,.1); for(let i=0;i<12;i++){const t=i/12*Math.PI*2;sphere(.16,i%2?0xf59e0b:0x22c55e,Math.cos(t)*1.35,Math.sin(t)*.8,Math.sin(t*2)*.7);} }
    } else if (subject === "chemistry") {
      const centers: THREE.Vector3[] = [];
      const count = slug.includes("molecular") ? Math.max(2, Math.min(6, Math.round(a))) : 4;
      for (let i=0;i<count;i++){ const t=i/count*Math.PI*2; centers.push(new THREE.Vector3(Math.cos(t)*1.5,Math.sin(t)*1.1,(i%2-.5)*.9)); }
      sphere(.58,0x334155); centers.forEach((p,i)=>{sphere(.35,i%2?0xef4444:0x2563eb,p.x,p.y,p.z); const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),p]); group.add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x64748b})));});
      if (slug.includes("states")) group.children.forEach((obj,i)=>{obj.position.x += ((i*37)%10-5)*Math.min(.15,a/500);});
    } else {
      if (slug.includes("geometry-slice")) { const solid = new THREE.Mesh(new THREE.BoxGeometry(3,3,3),new THREE.MeshStandardMaterial({color:0x2563eb,transparent:true,opacity:.38})); group.add(solid); const plane=new THREE.Mesh(new THREE.PlaneGeometry(4.5,4.5),new THREE.MeshStandardMaterial({color:0xf59e0b,transparent:true,opacity:.42,side:THREE.DoubleSide})); plane.rotation.x=THREE.MathUtils.degToRad(55); plane.position.y=(a-50)/25; group.add(plane); }
      else { const grid = new THREE.GridHelper(6,12,0x64748b,0xcbd5e1); group.add(grid); const frame=box(1.8,.08,1.8,0x2563eb); frame.position.y=.4; frame.rotation.y=(a/100)*Math.PI; frame.scale.x=Math.max(.25,Math.min(2,b/5)); frame.scale.z=Math.max(.25,Math.min(2,c/5)); }
    }

    group.rotation.x = slug === "moon-phases-3d" || slug === "earth-seasons-tilt" ? 0 : -.12;
    group.rotation.y = slug === "moon-phases-3d" || slug === "earth-seasons-tilt" ? 0 : .35;
    let frame = 0;
    let escapeStartedAt = performance.now();
    let lastEscapeWorld = "";
    const startedAt = performance.now();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const liveValues = valuesRef.current;
      if (sunTimeUniform) sunTimeUniform.value = (performance.now() - startedAt) * .001;
      if (moonObject) {
        const liveAngle = THREE.MathUtils.degToRad(Number(liveValues.angle) || 0);
        const liveInclination = THREE.MathUtils.degToRad(Number(liveValues.inclination) || 0);
        const targetMoon = new THREE.Vector3(-Math.cos(liveAngle) * 3.15, Math.sin(liveAngle) * 3.15 * Math.sin(liveInclination), Math.sin(liveAngle) * 3.15);
        moonObject.position.lerp(targetMoon, .16);
      } else if (escapePlanet && escapeCraft && escapePath && escapePathMaterial) {
        const profile = escapeProfile(liveValues);
        const planetMaterial = escapePlanet.material as THREE.MeshPhongMaterial;
        if (profile.worldName !== lastEscapeWorld) {
          const map = profile.world.texture === "earth" ? escapeEarthMap : profile.world.texture === "moon" ? escapeMoonMap : null;
          planetMaterial.map = map; planetMaterial.color.set(profile.world.color); planetMaterial.needsUpdate = true;
          if (escapeAtmosphere) (escapeAtmosphere.material as THREE.MeshBasicMaterial).color.set(profile.worldName === "Mars" ? 0xd97757 : profile.worldName === "Jupiter" ? 0xf0b78b : 0x60a5fa);
          lastEscapeWorld = profile.worldName; escapeStartedAt = performance.now();
        }
        const scale = profile.world.displayRadius;
        escapePlanet.scale.lerp(new THREE.Vector3(scale, scale, scale), .12);
        if (escapeAtmosphere) escapeAtmosphere.scale.lerp(new THREE.Vector3(scale, scale, scale), .12);
        const pathPositions = (escapePath.geometry as THREE.BufferGeometry).getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < pathPositions.count; i++) { const point = escapeTrajectory(profile, i / Math.max(1, pathPositions.count - 1)); pathPositions.setXYZ(i, point.x, point.y, point.z); }
        pathPositions.needsUpdate = true;
        escapePathMaterial.color.set(profile.outcome === "escape" ? 0x38bdf8 : profile.outcome === "orbit" ? 0xa78bfa : 0xfb7185);
        const elapsed = (performance.now() - escapeStartedAt) / 1000;
        const cycle = profile.outcome === "orbit" ? (elapsed / 7) % 1 : (elapsed / 4) % 1;
        escapeCraft.position.lerp(escapeTrajectory(profile, cycle), .2);
        escapeCraft.rotation.z = profile.outcome === "orbit" ? -cycle * Math.PI * 2 : -.25;
      } else if (seasonEarth && seasonAtmosphere && seasonAxis && seasonAxisArrow && seasonMarker) {
        const profile = seasonProfile(liveValues);
        const orbitRadius = 3.25;
        const angle = THREE.MathUtils.degToRad(profile.angle);
        const earthTarget = new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, -Math.sin(angle) * orbitRadius);
        seasonEarth.position.lerp(earthTarget, .14);
        seasonAtmosphere.position.lerp(earthTarget, .14);
        seasonEarth.rotation.z = THREE.MathUtils.lerp(seasonEarth.rotation.z, THREE.MathUtils.degToRad(profile.tilt), .12);
        seasonEarth.rotation.y += .0018;
        const markerLatitude = THREE.MathUtils.degToRad(profile.latitude);
        const markerTarget = new THREE.Vector3(0, Math.sin(markerLatitude) * .91, Math.cos(markerLatitude) * .91);
        seasonMarker.position.lerp(markerTarget, .14);
        seasonAxis.position.lerp(earthTarget, .14);
        seasonAxis.rotation.z = THREE.MathUtils.lerp(seasonAxis.rotation.z, THREE.MathUtils.degToRad(profile.tilt), .12);
        seasonAxisArrow.position.lerp(earthTarget, .14);
        seasonAxisArrow.rotation.z = THREE.MathUtils.lerp(seasonAxisArrow.rotation.z, THREE.MathUtils.degToRad(profile.tilt), .12);
      } else {
        const liveNumeric = Object.values(liveValues).filter((value): value is number => typeof value === "number");
        const drive = liveNumeric[0] ?? 1;
        const targetScale = 1 + Math.min(.12, Math.abs(drive) / 800);
        const targetTilt = ((drive % 360) / 360) * .22;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), .08);
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -.12 + targetTilt, .08);
        if (slug !== "moon-phases-3d" && slug !== "earth-seasons-tilt" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) group.rotation.y += .0018;
      }
      controls?.update(); renderer.render(scene, camera);
    }; animate();
    const resize = () => { const w=node.clientWidth||640,h=node.clientHeight||360; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); }; window.addEventListener("resize",resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize",resize); controls?.dispose(); renderer.dispose(); renderer.domElement.remove(); scene.traverse((obj) => { if (obj instanceof THREE.Mesh) { obj.geometry.dispose(); const mat=obj.material; if (Array.isArray(mat)) mat.forEach(m=>m.dispose()); else mat.dispose(); } }); };
  }, [subject, slug]);

  const phaseAngle = slug === "moon-phases-3d" ? ((Number(values.angle) || 0) + 360) % 360 : 0;
  const phase = phaseAngle < 22.5 || phaseAngle >= 337.5 ? "New moon" : phaseAngle < 67.5 ? "Waxing crescent" : phaseAngle < 112.5 ? "First quarter" : phaseAngle < 157.5 ? "Waxing gibbous" : phaseAngle < 202.5 ? "Full moon" : phaseAngle < 247.5 ? "Waning gibbous" : phaseAngle < 292.5 ? "Last quarter" : "Waning crescent";
  const illuminated = (1 - Math.cos(phaseAngle * Math.PI / 180)) / 2;
  const liveEscape = slug === "escape-velocity" ? escapeProfile(values) : null;
  const liveSeason = slug === "earth-seasons-tilt" ? seasonProfile(values) : null;
  return <div className="expandedThreeSceneWrap">
    <div ref={host} className="expandedThreeScene" role="img" aria-label={ariaLabel}/>
    {slug === "moon-phases-3d" && <><div className="moonPhaseMapLabels" aria-hidden="true"><span><i className="sunSwatch"/>Sunlight</span><span><i className="earthSwatch"/>Earth / observer</span><span><i className="moonSwatch"/>Moon orbit</span></div><div className="moonPhaseNavHint" aria-hidden="true">Drag to orbit · Scroll to zoom</div></>}
    {slug === "moon-phases-3d" && <div className="moonPhaseLegend" aria-live="polite"><svg className="moonPhasePreview" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#273241"/><path d={moonPhasePath(phaseAngle)} fill="#eef1f3"/></svg><span><b>{phase}</b><small>{Math.round(illuminated * 100)}% illuminated · {Math.round(phaseAngle)}° orbital position</small></span></div>}
    {liveEscape && <><div className="escapeVelocityLegend" aria-live="polite"><i className={`escapeStatusDot ${liveEscape.outcome}`}/><span><b>{liveEscape.worldName}</b><small>{liveEscape.outcome === "escape" ? "Open escape path" : liveEscape.outcome === "orbit" ? "Bound orbit" : "Falls back to the surface"}</small></span></div><div className="escapeVelocityNavHint" aria-hidden="true">Drag to orbit · Scroll to zoom</div></>}
    {liveSeason && <><div className="seasonsMapLabels" aria-hidden="true"><span><i className="sunSwatch"/>Sunlight</span><span><i className="earthSwatch"/>Earth + observer</span><span><i className="tiltSwatch"/>Axial tilt</span></div><div className="seasonsLegend" aria-live="polite"><i className="seasonStatusDot"/><span><b>{liveSeason.season}</b><small>{Math.round(liveSeason.tilt)}° axial tilt · {Math.round(liveSeason.declination * 10) / 10}° solar declination</small></span></div><div className="seasonsNavHint" aria-hidden="true">Drag to orbit · Scroll to zoom</div></>}
  </div>;
}
