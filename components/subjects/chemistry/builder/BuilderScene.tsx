'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { elementBySymbol } from '@/lib/simulations/chemistry/elements';
import type { Structure } from '@/lib/simulations/chemistry/builder';
import { loadSettings, prefersReducedMotion, renderProfile } from '@/lib/settings/storage';
import styles from './builder.module.css';

export type SceneActions = { fit:()=>void; zoom:(factor:number)=>void; snapshot:()=>void };
export type Representation = 'Ball & stick' | 'Sticks' | 'Space filling';
type Props = { fitKey:number; structure:Structure; selected:number|null; measured:number[]; representation:Representation; labels:boolean; rotate:boolean; onPick:(id:number)=>void; onBond:(a:number,b:number)=>void };
function dispose(group:THREE.Group) {
  const geometries=new Set<THREE.BufferGeometry>(), materials=new Set<THREE.Material>();
  group.traverse(o=>{ if(o instanceof THREE.Mesh || o instanceof THREE.Line){geometries.add(o.geometry); (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));} if(o instanceof THREE.Sprite){o.material.map?.dispose();materials.add(o.material);} });
  geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose()); group.clear();
}
export const BuilderScene=forwardRef<SceneActions,Props>(function BuilderScene(props, ref) {
  const host=useRef<HTMLDivElement>(null), live=useRef(props); live.current=props;
  const runtime=useRef<{renderer:THREE.WebGLRenderer;scene:THREE.Scene;camera:THREE.PerspectiveCamera;controls:OrbitControls;group:THREE.Group}|null>(null);
  const [failed,setFailed]=useState(false);
  function fit() {
    const r=runtime.current; if(!r) return;
    const box=new THREE.Box3().setFromObject(r.group), center=box.isEmpty()?new THREE.Vector3():box.getCenter(new THREE.Vector3());
    const size=box.isEmpty()?3:box.getSize(new THREE.Vector3()).length();
    const fov=r.camera.fov*Math.PI/180, effective=2*Math.atan(Math.tan(fov/2)*Math.min(1,r.camera.aspect));
    const distance=Math.max(5,size/(2*Math.sin(effective/2))*1.15);
    r.controls.target.copy(center); r.camera.position.copy(center).add(new THREE.Vector3(.25,.18,1).normalize().multiplyScalar(distance)); r.controls.update();
  }
  useImperativeHandle(ref,()=>({fit,zoom(factor){const r=runtime.current;if(!r)return;const offset=r.camera.position.clone().sub(r.controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*factor,2,3000));r.camera.position.copy(r.controls.target).add(offset);r.controls.update();},snapshot(){const r=runtime.current;if(!r)return;r.renderer.render(r.scene,r.camera);r.renderer.domElement.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='molecular-structure.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});}}));
  useEffect(()=>{
    const container=host.current; if(!container)return;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);return;}
    const settings=loadSettings(),reduced=prefersReducedMotion(settings);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,renderProfile(settings.quality).pixelRatioCap));
    renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.25;
    container.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.05,10000),group=new THREE.Group();
    camera.position.set(2,1.5,9);scene.add(group);
    scene.add(new THREE.HemisphereLight(0xe5efff,0x21304b,3));
    const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-4,6,8);scene.add(key);
    const rim=new THREE.DirectionalLight(0x84b5ff,3);rim.position.set(4,1,-4);scene.add(rim);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enableZoom=false;controls.minDistance=2;controls.maxDistance=3000;controls.autoRotateSpeed=1;
    runtime.current={renderer,scene,camera,controls,group};
    const resize=()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(container);resize();
    let start={x:0,y:0};
    const down=(e:PointerEvent)=>{start={x:e.clientX,y:e.clientY};};
    const up=(e:PointerEvent)=>{if(e.button!==0 || Math.hypot(e.clientX-start.x,e.clientY-start.y)>5)return;const rect=renderer.domElement.getBoundingClientRect(),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(group.children).find(h=>h.object.userData.atom!==undefined || h.object.userData.bond);if(hit?.object.userData.atom!==undefined)live.current.onPick(hit.object.userData.atom);else if(hit?.object.userData.bond)live.current.onBond(...hit.object.userData.bond as [number,number]);};
    renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);
    let frame=0;
    const render=()=>{if(!document.hidden){controls.autoRotate=live.current.rotate&&!reduced;controls.update();renderer.render(scene,camera);}frame=requestAnimationFrame(render);};render();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',up);controls.dispose();dispose(group);renderer.dispose();renderer.domElement.remove();runtime.current=null;fittedKey.current=null;};
  },[]);
  const fittedKey=useRef<number|null>(null);
  useEffect(()=>{
    const r=runtime.current;if(!r)return;dispose(r.group);
    const sphere=new THREE.SphereGeometry(1,28,20),positions=new Map(props.structure.atoms.map(a=>[a.id,new THREE.Vector3(...a.position)]));
    for(const a of props.structure.atoms){
      const element=elementBySymbol[a.element],space=props.representation==='Space filling';
      const radius=props.representation==='Sticks'?.16:space?(a.element==='H'?.55:.9):(a.element==='H'?.24:.39);
      const mesh=new THREE.Mesh(sphere,new THREE.MeshStandardMaterial({color:element.color,roughness:.25,metalness:.12,emissive:a.id===props.selected?0x235366:0x000000}));mesh.position.copy(positions.get(a.id)!);mesh.scale.setScalar(radius);mesh.userData.atom=a.id;r.group.add(mesh);
      if(a.id===props.selected || props.measured.includes(a.id)){const halo=new THREE.Mesh(sphere,new THREE.MeshBasicMaterial({color:props.measured.includes(a.id)?0xffd486:0x8ce4d0,transparent:true,opacity:.22,side:THREE.BackSide,depthWrite:false}));halo.position.copy(mesh.position);halo.scale.setScalar(radius*1.22);r.group.add(halo);}
      if(props.labels){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const c=canvas.getContext('2d');if(c){c.font='600 42px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#f1f6ff';c.shadowColor='#08121f';c.shadowBlur=8;c.fillText(`${a.element}${a.id}${a.charge?` (${a.charge>0?'+':''}${a.charge})`:''}`,128,64);const texture=new THREE.CanvasTexture(canvas);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true}));sprite.position.copy(mesh.position).add(new THREE.Vector3(0,radius+.22,0));sprite.scale.set(1,.5,1);sprite.renderOrder=4;r.group.add(sprite);}}
    }
    if(!props.structure.atoms.length)sphere.dispose();
    if(props.representation!=='Space filling')for(const b of props.structure.bonds){
      const a=positions.get(b.a)!,end=positions.get(b.b)!,delta=end.clone().sub(a),length=delta.length();if(length<.001)continue;
      const direction=delta.clone().normalize(),side=direction.clone().cross(Math.abs(direction.z)<.9?new THREE.Vector3(0,0,1):new THREE.Vector3(0,1,0)).normalize();
      for(let i=0;i<b.order;i++){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,length,12),new THREE.MeshStandardMaterial({color:0x9baec4,roughness:.4,metalness:.3}));mesh.position.copy(a).add(end).multiplyScalar(.5).addScaledVector(side,(i-(b.order-1)/2)*.19);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);mesh.userData.bond=[b.a,b.b];r.group.add(mesh);}
    }
    if(props.measured.length>=2){const points=props.measured.map(id=>positions.get(id)).filter((p):p is THREE.Vector3=>!!p);r.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0xffd486,depthTest:false})));}
    if(fittedKey.current!==props.fitKey){fit();fittedKey.current=props.fitKey;}
  },[props.structure,props.selected,props.measured,props.labels,props.representation,props.fitKey]);
  return <div className={styles.canvas} ref={host} role="img" aria-label={`Interactive 3D structure with ${props.structure.atoms.length} atoms. Use the atom list for keyboard editing.`}>{failed&&<div className={styles.fallback}><strong>3D rendering is unavailable</strong><p>You can still build and edit using the atom list, inspect bonds, and export your structure.</p></div>}</div>;
});
