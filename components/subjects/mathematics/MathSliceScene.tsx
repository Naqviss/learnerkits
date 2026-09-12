"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Values } from "@/lib/simulations/mathematicsLabs/model";
import { loadSettings, renderProfile } from "@/lib/settings/storage";

export function MathSliceScene({values}:{values:Values}){
 const host=useRef<HTMLDivElement>(null),live=useRef(values),orbit=useRef<OrbitControls|null>(null);live.current=values;const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const container=host.current;if(!container)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);return;}renderer.localClippingEnabled=true;renderer.setPixelRatio(Math.min(devicePixelRatio,renderProfile(loadSettings().quality).pixelRatioCap));renderer.toneMapping=THREE.ACESFilmicToneMapping;container.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,1,.1,100);camera.position.set(8,7,10);const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=true;controls.update();controls.saveState();orbit.current=controls;
  scene.add(new THREE.HemisphereLight(0xdce9ff,0x453f4b,2.3));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-5,9,6);scene.add(light);const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>();
  const clip=new THREE.Plane(new THREE.Vector3(0,-1,0),0);const solidMat=new THREE.MeshPhysicalMaterial({color:0x759ad0,roughness:.35,metalness:.05,transparent:true,opacity:.72,side:THREE.DoubleSide,clippingPlanes:[clip]});mats.add(solidMat);
  const make=(g:THREE.BufferGeometry)=>{geos.add(g);const o=new THREE.Mesh(g,solidMat);scene.add(o);return o;};
  const solids=[make(new THREE.CylinderGeometry(2.5,2.5,5,64)),make(new THREE.BoxGeometry(5,5,5)),make(new THREE.ConeGeometry(2.5,5,64)),make(new THREE.SphereGeometry(2.5,64,40))];
  const planeMat=new THREE.MeshBasicMaterial({color:0xd9e6fa,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false});mats.add(planeMat);const planeGeo=new THREE.PlaneGeometry(7,7);geos.add(planeGeo);const planeMesh=new THREE.Mesh(planeGeo,planeMat);scene.add(planeMesh);
  const lineGeo=new THREE.BufferGeometry(),lineMat=new THREE.LineBasicMaterial({color:0xf0bd7e,linewidth:2});geos.add(lineGeo);mats.add(lineMat);const outline=new THREE.LineLoop(lineGeo,lineMat);scene.add(outline);const grid=new THREE.GridHelper(12,12,0x607492,0x35445a);grid.position.y=-2.55;scene.add(grid);geos.add(grid.geometry);(Array.isArray(grid.material)?grid.material:[grid.material]).forEach(m=>mats.add(m));
  let signature="";function update(){const v=live.current,key=JSON.stringify(v);if(key===signature)return;signature=key;solids.forEach((o,i)=>o.visible=i===v.solid);const offset=v.offset*2.2,horizontal=v.plane===0;clip.normal.set(horizontal?0:-1,horizontal?-1:0,0);clip.constant=offset;planeMesh.rotation.set(horizontal?-Math.PI/2:0,horizontal?0:-Math.PI/2,0);planeMesh.position.set(horizontal?0:offset,horizontal?offset:0,0);
   let points:THREE.Vector3[]=[];const circle=(radius:number)=>Array.from({length:96},(_,i)=>new THREE.Vector3(radius*Math.cos(i*Math.PI/48),horizontal?offset:radius*Math.sin(i*Math.PI/48),horizontal?radius*Math.sin(i*Math.PI/48):0));
   if(v.solid===3)points=circle(Math.sqrt(Math.max(0,2.5**2-offset**2)));
   else if(v.solid===0)points=horizontal?circle(2.5):[new THREE.Vector3(offset,-2.5,-2.5),new THREE.Vector3(offset,2.5,-2.5),new THREE.Vector3(offset,2.5,2.5),new THREE.Vector3(offset,-2.5,2.5)];
   else if(v.solid===1)points=horizontal?[new THREE.Vector3(-2.5,offset,-2.5),new THREE.Vector3(2.5,offset,-2.5),new THREE.Vector3(2.5,offset,2.5),new THREE.Vector3(-2.5,offset,2.5)]:[new THREE.Vector3(offset,-2.5,-2.5),new THREE.Vector3(offset,2.5,-2.5),new THREE.Vector3(offset,2.5,2.5),new THREE.Vector3(offset,-2.5,2.5)];
   else if(horizontal){const radius=2.5*(1-(offset+2.5)/5);points=circle(Math.max(.04,radius));}else points=[new THREE.Vector3(offset,2.5,0),new THREE.Vector3(offset,-2.5,-2.5),new THREE.Vector3(offset,-2.5,2.5)];
   lineGeo.setFromPoints(points);outline.visible=points.length>0;
  }
  const resize=()=>{const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/Math.max(1,h);camera.fov=2*Math.atan(Math.tan(21.5*Math.PI/180)/Math.min(1,Math.max(.42,camera.aspect)))*180/Math.PI;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};const ro=new ResizeObserver(resize);ro.observe(container);resize();let raf=0;const frame=()=>{update();controls.update();renderer.render(scene,camera);raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();controls.dispose();orbit.current=null;geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="mathThree"><div ref={host} className="mathCanvas" role="img" aria-label="Interactive plane slicing a three-dimensional solid"/>{failed&&<p className="mathFallback">3D is unavailable. The cross-section name and controls still work.</p>}<div className="mathOrbit"><span>Drag to orbit · amber line is the section</span><button onClick={()=>orbit.current?.reset()}>Reset view</button></div></div>;
}
