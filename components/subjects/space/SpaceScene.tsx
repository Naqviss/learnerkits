"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { blackHole, flyby, kepler, orbitTrace, orbital, planets, rad, type MarsState, type Values } from "@/lib/simulations/spaceLabs/model";
import { loadSettings, renderProfile } from "@/lib/settings/storage";

export function SpaceScene({slug,values,time,mars}:{slug:string;values:Values;time:number;mars:MarsState}){
  const host=useRef<HTMLDivElement>(null),live=useRef({values,time,mars});live.current={values,time,mars};const orbit=useRef<OrbitControls|null>(null);
  const [failed,setFailed]=useState(false);const view=useRef<{position:THREE.Vector3;target:THREE.Vector3}|null>(null);
  const design=slug==="mars-landing-challenge"?slug:JSON.stringify(values);
  useEffect(()=>{
    const container=host.current;if(!container)return;let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);return;}
    const profile=renderProfile(loadSettings().quality);renderer.setPixelRatio(Math.min(devicePixelRatio,profile.pixelRatioCap));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;container.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,1,.1,200);camera.position.set(0,7,17);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=true;controls.target.set(0,0,0);controls.saveState();if(view.current){camera.position.copy(view.current.position);controls.target.copy(view.current.target);}orbit.current=controls;
    const ambient=new THREE.AmbientLight(0x95a7c5,.22);scene.add(ambient);const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(12,3,4);scene.add(sun);
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();let alive=true;
    function mesh(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D=scene){geometries.add(g);materials.add(m);const o=new THREE.Mesh(g,m);parent.add(o);return o;}
    const sphere=new THREE.SphereGeometry(1,40,28);geometries.add(sphere);
    const loader=new THREE.TextureLoader();
    function body(radius:number,color:number,map?:string,parent:THREE.Object3D=scene){const mat=new THREE.MeshStandardMaterial({color:map?0xffffff:color,roughness:.94});const o=mesh(sphere,mat,parent);o.scale.setScalar(radius);if(map){const tex=loader.load(map,loaded=>{if(!alive){loaded.dispose();return;}loaded.colorSpace=THREE.SRGBColorSpace;mat.needsUpdate=true;});textures.add(tex);mat.map=tex;}return o;}
    function line(points:THREE.Vector3[],color=0x81a9e9,parent:THREE.Object3D=scene){const g=new THREE.BufferGeometry().setFromPoints(points),m=new THREE.LineBasicMaterial({color,transparent:true,opacity:.7});geometries.add(g);materials.add(m);const l=new THREE.Line(g,m);parent.add(l);return l;}
    function ring(radius:number,color:number,parent:THREE.Object3D=scene){return line(Array.from({length:181},(_,i)=>new THREE.Vector3(radius*Math.cos(i*Math.PI/90),0,radius*Math.sin(i*Math.PI/90))),color,parent);}
    function rod(a:THREE.Vector3,b:THREE.Vector3,r:number,color:number,parent:THREE.Object3D=scene){const o=mesh(new THREE.CylinderGeometry(r,r,a.distanceTo(b),12),new THREE.MeshStandardMaterial({color,metalness:.45,roughness:.4}),parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());return o;}
    const starPoints:number[]=[];for(let i=0;i<240;i++){const a=i*2.39996,z=1-2*(i+.5)/240,r=Math.sqrt(1-z*z);starPoints.push(60*r*Math.cos(a),60*z,60*r*Math.sin(a));}const starsG=new THREE.BufferGeometry();starsG.setAttribute("position",new THREE.Float32BufferAttribute(starPoints,3));geometries.add(starsG);const starsM=new THREE.PointsMaterial({color:0xc5d6ef,size:.09});materials.add(starsM);scene.add(new THREE.Points(starsG,starsM));
    let update:()=>void=()=>{};
    if(slug==="moon-phases-3d"){
      ambient.intensity=.07;sun.position.set(50,0,0);body(1.25,0xffffff,"/textures/earth-day.jpg");const moon=body(.48,0xcccccc,"/textures/moon.jpg");ring(5,0x44536d);line([new THREE.Vector3(9,0,0),new THREE.Vector3(6,0,0)],0xe5c692);
      update=()=>{const a=rad(live.current.values.angle);moon.position.set(5*Math.cos(a),0,5*Math.sin(a));moon.rotation.y=-a;};
    }else if(slug==="solar-eclipse-3d"){
      sun.position.set(-30,0,0);ambient.intensity=.06;const earth=body(1.55,0xffffff,"/textures/earth-day.jpg");earth.position.x=4;
      const moon=body(.48,0xbbbbbb,"/textures/moon.jpg");moon.position.set(-1,live.current.values.offset*3,0);
      const solar=mesh(sphere,new THREE.MeshBasicMaterial({color:0xffdca1}));solar.scale.setScalar(1.7);solar.position.x=-7;
      const distance=live.current.values.distance,shadowLength=1737.4*(149597870-distance)/(695700-1737.4)/(distance-6371)*3.45;
      const cone=mesh(new THREE.ConeGeometry(.49,shadowLength,40,1,true),new THREE.MeshBasicMaterial({color:0x090d16,transparent:true,opacity:.65,side:THREE.DoubleSide,depthWrite:false}));cone.rotation.z=-Math.PI/2;cone.position.set(-1+shadowLength/2,moon.position.y,0);
      line([new THREE.Vector3(-7,0,0),new THREE.Vector3(6,0,0)],0x55677e);
    }else if(slug==="escape-velocity"||slug==="satellite-orbit-builder"){
      const satellite=slug==="satellite-orbit-builder",v=live.current.values,o=orbital(v,satellite),trace=orbitTrace(v,satellite);const extent=Math.max(...trace.points.map(p=>Math.hypot(p.x,p.y))),scale=6/Math.max(2,extent);const system=new THREE.Group();scene.add(system);if(satellite)system.rotation.x=rad(v.inclination);
      body(o.world.radius/o.radius*scale,0xc88268,o.world.name==="Earth"?"/textures/earth-day.jpg":o.world.name==="Moon"?"/textures/moon.jpg":undefined,system);
      const points=trace.points.map(p=>new THREE.Vector3(p.x*scale,0,p.y*scale));line(points,0x6489c7,system);const craft=mesh(new THREE.OctahedronGeometry(.1),new THREE.MeshStandardMaterial({color:0xf5cb88,metalness:.5,roughness:.3}),system);const trail=line([points[0],points[0]],0xd1e2ff,system);const trailArray=new Float32Array(points.length*3);trail.geometry.setAttribute("position",new THREE.BufferAttribute(trailArray,3));
      update=()=>{const i=Math.min(points.length-1,Math.floor(live.current.time/8*(points.length-1)));craft.position.copy(points[i]);for(let j=0;j<=i;j++)points[j].toArray(trailArray,j*3);trail.geometry.attributes.position.needsUpdate=true;trail.geometry.setDrawRange(0,i+1);trail.geometry.computeBoundingSphere();};
    }else if(slug==="keplers-laws-orbit"){
      const v=live.current.values,scale=3.1/v.axis;const star=mesh(sphere,new THREE.MeshBasicMaterial({color:0xf5d399}));star.scale.setScalar(.35);const planet=body(.2,0x91acdc);const path=Array.from({length:241},(_,i)=>{const p=kepler(v.axis,v.eccentricity,i*Math.PI/120);return new THREE.Vector3(p.x*scale,0,p.y*scale);});line(path);
      for(const start of [0,Math.PI]){const points=[new THREE.Vector3()];for(let i=0;i<=30;i++){const p=kepler(v.axis,v.eccentricity,start+i/30*.45);points.push(new THREE.Vector3(p.x*scale,0,p.y*scale));}points.push(new THREE.Vector3());line(points,0xbed5f8);}
      update=()=>{const p=kepler(v.axis,v.eccentricity,rad(v.anomaly)+live.current.time/12/(v.axis**1.5)*Math.PI*2);planet.position.set(p.x*scale,0,p.y*scale);};
    }else if(slug==="earth-seasons-tilt"){
      const v=live.current.values,globe=new THREE.Group();scene.add(globe);globe.rotation.z=-rad(v.tilt);const earth=body(2.5,0xffffff,"/textures/earth-day.jpg",globe);rod(new THREE.Vector3(0,-3.3,0),new THREE.Vector3(0,3.3,0),.025,0xbad0f0,globe);ring(2.52,0x7b91b8,globe);
      const latitude=rad(v.latitude),latRing=ring(2.54*Math.cos(latitude),0xedc18c,globe);latRing.position.y=2.54*Math.sin(latitude);
      sun.position.set(20*Math.sin(rad(v.longitude)),0,-20*Math.cos(rad(v.longitude)));ambient.intensity=.06;
      update=()=>{earth.rotation.y=live.current.time*.12;};
    }else if(slug==="planet-size-comparison-3d"){
      const v=live.current.values,a=planets[v.planetA],b=planets[v.planetB],max=Math.max(a.radius,b.radius),ar=2.6*a.radius/max,br=2.6*b.radius/max;
      const left=body(ar,a.color,a.name==="Earth"?"/textures/earth-day.jpg":undefined),right=body(br,b.color,b.name==="Earth"?"/textures/earth-day.jpg":undefined);left.position.x=-ar-.55;right.position.x=br+.55;ambient.intensity=.5;line([new THREE.Vector3(-6,-3,0),new THREE.Vector3(6,-3,0)],0x445571);
      update=()=>{left.rotation.y=right.rotation.y=live.current.time*.07;};
    }else if(slug==="black-hole-orbit"){
      const v=live.current.values,scale=5/Math.max(5,v.radius);const hole=mesh(sphere,new THREE.MeshBasicMaterial({color:0x010205}));hole.scale.setScalar(scale);ring(scale*1.5,0xc9a278);ring(scale*3,0x759aca);ring(scale*v.radius,0xb8d1f4);const probe=body(.12,0xe6bf8a);const b=blackHole(v);probe.visible=b.stable;
      update=()=>{const a=live.current.time*Math.PI/5;probe.position.set(Math.cos(a)*scale*v.radius,0,Math.sin(a)*scale*v.radius);};
    }else if(slug==="gravity-slingshot"){
      const v=live.current.values,f=flyby(v),limit=Math.acos(-1/f.e)-.16,sign=v.side?1:-1,rotation=rad(v.angle)-sign*(Math.PI/2-f.turn/2),rp=6371+v.altitude;
      const points=Array.from({length:161},(_,i)=>{const nu=-limit+2*limit*i/160,r=(1+f.e)/(1+f.e*Math.cos(nu)),x=r*Math.cos(nu),z=sign*r*Math.sin(nu);return new THREE.Vector3(x*Math.cos(rotation)-z*Math.sin(rotation),0,x*Math.sin(rotation)+z*Math.cos(rotation));});const extent=Math.max(...points.map(p=>p.length())),scale=6/extent;points.forEach(p=>p.multiplyScalar(scale));body(6371/rp*scale,0xffffff,"/textures/earth-day.jpg");line(points);const craft=body(.12,0xe8be7f);
      update=()=>craft.position.copy(points[Math.min(160,Math.floor(live.current.time/8*160))]);
    }else if(slug==="mars-landing-challenge"){
      ambient.intensity=.55;sun.position.set(-10,15,8);const ground=mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({color:0x8c5b45,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-2.5;
      for(let i=0;i<25;i++){const r=mesh(new THREE.IcosahedronGeometry(.15+(i%4)*.08),new THREE.MeshStandardMaterial({color:0x674638,roughness:1}));r.position.set(Math.sin(i*2.4)*12,-2.4,Math.cos(i*1.7)*10);r.scale.y=.55;}
      const ship=new THREE.Group();scene.add(ship);mesh(new THREE.CylinderGeometry(.45,.68,.65,8),new THREE.MeshStandardMaterial({color:0xd4dce6,metalness:.55,roughness:.35}),ship);const cabin=mesh(sphere,new THREE.MeshStandardMaterial({color:0x8296b2,metalness:.6,roughness:.25}),ship);cabin.scale.set(.34,.3,.34);cabin.position.y=.5;
      for(const x of [-1,1])for(const z of [-1,1]){rod(new THREE.Vector3(x*.35,-.1,z*.35),new THREE.Vector3(x*.85,-.65,z*.85),.025,0xc4b795,ship);const foot=mesh(new THREE.CylinderGeometry(.13,.13,.05,12),new THREE.MeshStandardMaterial({color:0x657286}),ship);foot.position.set(x*.85,-.65,z*.85);}
      const flame=mesh(new THREE.ConeGeometry(.24,1.5,18),new THREE.MeshBasicMaterial({color:0xa4c9ff,transparent:true,opacity:.7}),ship);flame.rotation.z=Math.PI;
      update=()=>{const s=live.current.mars;ship.position.set(0,-1.82+s.altitude*.008,0);ship.rotation.z=s.status==="crashed"?.7:0;flame.visible=s.status==="flying"&&s.throttle>.01;flame.scale.y=s.throttle;flame.position.y=-.4-.75*s.throttle;};
    }
    const resize=()=>{renderer.setSize(container.clientWidth,container.clientHeight,false);camera.aspect=container.clientWidth/Math.max(1,container.clientHeight);camera.fov=2*Math.atan(Math.tan(Math.PI/8)/Math.min(1,Math.max(.4,camera.aspect)))*180/Math.PI;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(container);resize();let raf=0;const frame=()=>{update();controls.update();renderer.render(scene,camera);raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
    return()=>{alive=false;view.current={position:camera.position.clone(),target:controls.target.clone()};cancelAnimationFrame(raf);ro.disconnect();controls.dispose();orbit.current=null;geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
  },[slug,design]);
  return <div className="spaceThree"><div className="spaceCanvas" ref={host} role="img" aria-label={`${slug.replaceAll("-"," ")} 3D view`}/>{failed&&<p className="spaceFallback">3D is unavailable on this device. You can still use the controls, measurements, and mission checks.</p>}<div className="spaceOrbit"><span>Drag to rotate · illustrative overview scale</span><button onClick={()=>orbit.current?.reset()}>Reset view</button></div></div>;
}
