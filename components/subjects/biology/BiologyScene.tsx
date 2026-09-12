"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { heartRoute, organelles, transport, type Values } from "@/lib/simulations/biologyLabs/model";
import { loadSettings, renderProfile } from "@/lib/settings/storage";

export function BiologyScene({slug,values,time,heart,onSelect}:{slug:string;values:Values;time:number;heart:number;onSelect?:(index:number)=>void}){
 const host=useRef<HTMLDivElement>(null),live=useRef({values,time,heart}),orbit=useRef<OrbitControls|null>(null),select=useRef(onSelect);live.current={values,time,heart};select.current=onSelect;const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const container=host.current;if(!container)return;let renderer:THREE.WebGLRenderer,disposed=false;setFailed(false);
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);return;}
  const profile=renderProfile(loadSettings().quality);renderer.setPixelRatio(Math.min(devicePixelRatio,profile.pixelRatioCap));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;container.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,1,.1,100);camera.position.set(9,6,12);const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableZoom=true;controls.minDistance=7;controls.maxDistance=23;controls.enableDamping=true;controls.target.set(0,0,0);controls.update();controls.saveState();orbit.current=controls;
  scene.add(new THREE.HemisphereLight(0xe4edff,0x493f50,2.1));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-5,9,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);const rim=new THREE.DirectionalLight(0x7ea8ef,1.5);rim.position.set(7,2,-6);scene.add(rim);
  const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>();
  function material(color:number,opacity=1,emissive=0){const m=new THREE.MeshStandardMaterial({color,roughness:.5,metalness:.04,transparent:opacity<1,opacity,side:THREE.DoubleSide,emissive,emissiveIntensity:.25});mats.add(m);return m;}
  function mesh(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D=scene){geos.add(g);const o=new THREE.Mesh(g,m);parent.add(o);return o;}
  function sphere(r:number,color:number,p:THREE.Vector3,parent:THREE.Object3D=scene,opacity=1){const o=mesh(new THREE.SphereGeometry(r,32,22),material(color,opacity),parent);o.position.copy(p);return o;}
  const selectable=new Map<THREE.Object3D,number>();let update=()=>{};
  if(slug==="animal-cell-3d"){
   const cell=mesh(new THREE.SphereGeometry(4.2,56,38),material(0x7396c7,.18));cell.scale.set(1.2,.82,1);const inner=mesh(new THREE.SphereGeometry(4.05,48,32),material(0x6b7695,.12));inner.scale.copy(cell.scale);
   const objects:THREE.Object3D[][]=organelles.map(()=>[]);
   const nucleus=sphere(1.28,organelles[0].color,new THREE.Vector3(-.7,.35,0));objects[0].push(nucleus);sphere(.55,0xd8c9ee,new THREE.Vector3(-.85,.45,.6));
   for(const p of [[2,.7,.4],[1.8,-1.25,-.6],[-2,-1,.6]]){const g=new THREE.CapsuleGeometry(.34,1.05,8,18),o=mesh(g,material(organelles[1].color));o.position.set(...p as [number,number,number]);o.rotation.z=Math.PI/2;o.rotation.y=p[0];objects[1].push(o);for(let i=-1;i<=1;i++){const fold=mesh(new THREE.TorusGeometry(.24,.035,8,22,Math.PI),material(0xf2c1a4),o);fold.position.y=i*.28;fold.rotation.x=Math.PI/2;}}
   for(let i=0;i<5;i++){const g=mesh(new THREE.TorusGeometry(.7-i*.075,.07,10,34,Math.PI*1.45),material(organelles[2].color));g.position.set(.75,-.15+i*.18,.8);g.rotation.set(Math.PI/2,0,.3);objects[2].push(g);}
   for(let i=0;i<28;i++){const p=new THREE.Vector3(Math.sin(i*5.1)*3.2,Math.cos(i*2.7)*2.2,Math.sin(i*3.3)*2.1),o=sphere(.075,organelles[3].color,p);objects[3].push(o);}
   for(const p of [[-2,1.45,-.5],[2.4,-.45,.7],[.3,1.8,-1.1]])objects[4].push(sphere(.33,organelles[4].color,new THREE.Vector3(...p as [number,number,number])));
   objects[5].push(cell);const baseScales=new Map<THREE.Object3D,THREE.Vector3>();objects.forEach((group,i)=>group.forEach(o=>{selectable.set(o,i);baseScales.set(o,o.scale.clone());}));
   update=()=>{const selected=live.current.values.organelle;objects.forEach((group,i)=>group.forEach(o=>{const pulse=i===selected?1.08+Math.sin(performance.now()*.006)*.07:1;o.scale.copy(baseScales.get(o)!).multiplyScalar(pulse);if(o instanceof THREE.Mesh){const m=o.material as THREE.MeshStandardMaterial;m.emissive.setHex(i===selected?organelles[i].color:0);m.emissiveIntensity=i===selected?.35:0;}}));inner.rotation.y+=.001;};
  }else if(slug==="cell-membrane-transport"){
   camera.position.set(8,4,12);const membrane=new THREE.Group();scene.add(membrane);
   for(let row=0;row<2;row++)for(let i=0;i<15;i++)for(const side of [-1,1]){const x=-5+i*.72,z=-1.4+row*2.8;sphere(.16,0x8fb8ed,new THREE.Vector3(x,side*.58,z),membrane);const tail=mesh(new THREE.CylinderGeometry(.035,.035,.5,7),material(0xb99b79),membrane);tail.position.set(x,side*.28,z);}
   const channel=mesh(new THREE.TorusGeometry(.5,.18,12,30),material(0xc398d5));channel.rotation.x=Math.PI/2;channel.scale.y=1.8;
   const outside=Array.from({length:24},(_,i)=>sphere(.11,0xe4bb82,new THREE.Vector3(-4.5+(i%8)*1.25,1.5+(i%3)*.45,-1.6+Math.floor(i/8)*1.6)));
   const inside=Array.from({length:24},(_,i)=>sphere(.11,0x9ac3fa,new THREE.Vector3(-4.5+(i%8)*1.25,-1.5-(i%3)*.45,-1.6+Math.floor(i/8)*1.6)));
   const movers=Array.from({length:12},()=>sphere(.14,0xf0d39e,new THREE.Vector3()));
   update=()=>{const {values:v,time:t}=live.current,m=transport(v);channel.scale.x=channel.scale.z=v.open?1:.35;outside.forEach((o,i)=>o.visible=i<Math.round(v.outside/100*24));inside.forEach((o,i)=>o.visible=i<Math.round(v.inside/100*24));movers.forEach((o,i)=>{o.visible=t>0&&m.valid;const p=(t*.12+i/12)%1,start=m.direction==="into cell"?2.3:-2.3,end=-start;o.position.set((i%4-1.5)*.35,start+(end-start)*p,(Math.floor(i/4)-1)*.45);});};
  }else{
   camera.position.set(8.8,4.5,12.5);controls.target.set(0,.25,0);controls.update();controls.saveState();
   const specimen=new THREE.Group(),anatomy=new THREE.Group();scene.add(specimen);specimen.add(anatomy);specimen.rotation.y=-.08;
   const floor=mesh(new THREE.CircleGeometry(4.8,64),material(0x1a2431,.42));floor.rotation.x=-Math.PI/2;floor.position.y=-3.85;floor.receiveShadow=true;
   const loadingRing=mesh(new THREE.TorusGeometry(.62,.035,10,64),material(0x96bdf1,.72,0x668fca),anatomy);loadingRing.rotation.x=Math.PI/2;
   new GLTFLoader().load("/models/biology/bodyparts-heart.glb",gltf=>{
    if(disposed){gltf.scene.traverse(node=>{if(node instanceof THREE.Mesh){node.geometry.dispose();const list=Array.isArray(node.material)?node.material:[node.material];list.forEach(m=>m.dispose());}});return;}
    gltf.scene.traverse(node=>{if(node instanceof THREE.Mesh){node.castShadow=true;node.receiveShadow=true;geos.add(node.geometry);const list=Array.isArray(node.material)?node.material:[node.material];list.forEach(m=>mats.add(m));}});
    loadingRing.visible=false;anatomy.add(gltf.scene);
   },undefined,()=>{if(!disposed)setFailed(true);});
   const routePositions=[new THREE.Vector3(4.2,-2.65,.2),new THREE.Vector3(-2.1,3.45,1.2),new THREE.Vector3(-1.45,1.05,2.45),new THREE.Vector3(-.72,.3,2.7),new THREE.Vector3(-1.12,-1.25,2.5),new THREE.Vector3(-1.45,1.8,2.55),new THREE.Vector3(-4.1,2.75,.45),new THREE.Vector3(3.8,2.35,1.05),new THREE.Vector3(1.25,1.05,2.35),new THREE.Vector3(.72,.15,2.65),new THREE.Vector3(.82,-1.4,2.45),new THREE.Vector3(.8,1.65,2.55),new THREE.Vector3(4.2,-2.65,.2)];
   const checkpoints=routePositions.map((p,i)=>sphere(i===0||i===12?.1:.075,i>=7||i===0||i===12?0xd77583:0x729acb,p,specimen,.42));
   const blood=sphere(.22,0xf07c8e,routePositions[0],specimen),glow=sphere(.38,0xf07c8e,routePositions[0],specimen,.14);(blood.material as THREE.MeshStandardMaterial).emissiveIntensity=.55;(glow.material as THREE.MeshStandardMaterial).depthWrite=false;
   update=()=>{const now=performance.now(),i=Math.min(heartRoute.length-1,live.current.heart),p=routePositions[i],oxygenated=i>=7||i===0||i===12,color=oxygenated?0xf07c8e:0x76a4df;blood.position.lerp(p,.12);glow.position.copy(blood.position);(blood.material as THREE.MeshStandardMaterial).color.setHex(color);(blood.material as THREE.MeshStandardMaterial).emissive.setHex(color);(glow.material as THREE.MeshStandardMaterial).color.setHex(color);checkpoints.forEach((point,index)=>{const active=index===i,mat=point.material as THREE.MeshStandardMaterial;point.scale.setScalar(active?1.7+Math.sin(now*.008)*.16:1);mat.opacity=active?.85:.32;mat.emissive.setHex(active?color:0);mat.emissiveIntensity=active?.55:0;});anatomy.scale.setScalar(1+Math.sin(now*.0055)*.018);loadingRing.rotation.z+=.025;};
  }
  const click=(event:PointerEvent)=>{if(!selectable.size)return;const rect=renderer.domElement.getBoundingClientRect(),pointer=new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects([...selectable.keys()]),hit=hits.find(h=>selectable.get(h.object)!==5)||hits[0];if(hit)select.current?.(selectable.get(hit.object)!);};renderer.domElement.addEventListener("pointerup",click);
  const resize=()=>{const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/Math.max(1,h);camera.fov=2*Math.atan(Math.tan(21.5*Math.PI/180)/Math.min(1,Math.max(.42,camera.aspect)))*180/Math.PI;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};const ro=new ResizeObserver(resize);ro.observe(container);resize();let raf=0;const frame=()=>{update();controls.update();renderer.render(scene,camera);raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
  return()=>{disposed=true;cancelAnimationFrame(raf);ro.disconnect();renderer.domElement.removeEventListener("pointerup",click);controls.dispose();orbit.current=null;geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[slug]);
 return <div className="bioThree"><div ref={host} className="bioCanvas" role="img" aria-label={`${slug.replaceAll("-"," ")} interactive 3D model`}/>{failed&&<p className="bioFallback">The 3D specimen could not be loaded. You can still complete the activity with the mission controls.</p>}<div className="bioOrbit"><span>Drag to rotate · wheel or pinch to zoom</span><button onClick={()=>orbit.current?.reset()}>Reset view</button></div></div>;
}
