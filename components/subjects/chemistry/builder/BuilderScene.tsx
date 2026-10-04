'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { elementBySymbol } from '@/lib/simulations/chemistry/elements';
import type { Position, Structure } from '@/lib/simulations/chemistry/builder';
import { loadSettings, prefersReducedMotion, renderProfile } from '@/lib/settings/storage';
import styles from './builder.module.css';

export type SceneActions = { fit:()=>void; zoom:(factor:number)=>void; snapshot:()=>void };
export type Representation = 'Ball & stick' | 'Sticks' | 'Space filling';
type Props = { fitKey:number; structure:Structure; selected:number|null; measured:number[]; representation:Representation; labels:boolean; rotate:boolean; moveAtoms:boolean; onMove:(id:number,position:Position)=>void; onPick:(id:number)=>void; onBond:(a:number,b:number)=>void };
function dispose(group:THREE.Group) {
  const geometries=new Set<THREE.BufferGeometry>(), materials=new Set<THREE.Material>();
  group.traverse(o=>{ if(o instanceof THREE.Mesh || o instanceof THREE.Line){geometries.add(o.geometry); (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));} if(o instanceof THREE.Sprite){o.material.map?.dispose();materials.add(o.material);} });
  geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose()); group.clear();
}
export const BuilderScene=forwardRef<SceneActions,Props>(function BuilderScene(props, ref) {
  const host=useRef<HTMLDivElement>(null), live=useRef(props); live.current=props;
  const runtime=useRef<{renderer:THREE.WebGLRenderer;scene:THREE.Scene;camera:THREE.PerspectiveCamera;controls:OrbitControls;group:THREE.Group}|null>(null);
  const [failed,setFailed]=useState(false);
  function fit(preserveOrientation=false) {
    const r=runtime.current; if(!r) return;
    const box=new THREE.Box3().setFromObject(r.group), center=box.isEmpty()?new THREE.Vector3():box.getCenter(new THREE.Vector3());
    const size=box.isEmpty()?3:box.getSize(new THREE.Vector3()).length();
    const fov=r.camera.fov*Math.PI/180, effective=2*Math.atan(Math.tan(fov/2)*Math.min(1,r.camera.aspect));
    const distance=Math.max(5,size/(2*Math.sin(effective/2))*1.15);
    const direction=preserveOrientation?r.camera.position.clone().sub(r.controls.target):new THREE.Vector3(.25,.18,1);
    if(direction.lengthSq()<1e-8)direction.set(.25,.18,1);
    // Drain pending pan/rotation before positioning, so inertia cannot move the fitted view away.
    const damping=r.controls.enableDamping,autoRotate=r.controls.autoRotate;
    r.controls.enableDamping=false;r.controls.autoRotate=false;r.controls.update();
    r.controls.maxDistance=Math.max(3000,distance*1.25);
    r.camera.far=Math.max(10000,distance+size*2);r.camera.updateProjectionMatrix();
    r.controls.target.copy(center);r.camera.position.copy(center).add(direction.normalize().multiplyScalar(distance));r.controls.update();
    r.controls.enableDamping=damping;r.controls.autoRotate=autoRotate;
  }
  useImperativeHandle(ref,()=>({fit,zoom(factor){const r=runtime.current;if(!r)return;const offset=r.camera.position.clone().sub(r.controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*factor,r.controls.minDistance,r.controls.maxDistance));r.camera.position.copy(r.controls.target).add(offset);r.controls.update();},snapshot(){const r=runtime.current;if(!r)return;r.renderer.render(r.scene,r.camera);r.renderer.domElement.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='molecular-structure.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});}}));
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
    const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=!reduced;controls.dampingFactor=.12;controls.enableZoom=true;controls.zoomToCursor=true;controls.zoomSpeed=.7;controls.rotateSpeed=.65;controls.panSpeed=.8;controls.screenSpacePanning=true;controls.minDistance=2;controls.maxDistance=3000;controls.autoRotateSpeed=1;
    runtime.current={renderer,scene,camera,controls,group};
    const resize=()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(container);resize();
    const canvas=renderer.domElement;
    const pointers=new Set<number>();
    let start={x:0,y:0}, moved=false;
    let drag:{id:number;pointer:number;original:THREE.Vector3;position:THREE.Vector3;offset:THREE.Vector3;plane:THREE.Plane}|null=null;
    const rayAt=(e:PointerEvent)=>{
      const rect=canvas.getBoundingClientRect(),ray=new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);
      return ray;
    };
    const hitAt=(e:PointerEvent)=>rayAt(e).intersectObjects(group.children).find(h=>h.object.userData.atom!==undefined || h.object.userData.bond);
    // Move meshes in place during a drag; commit a single undoable edit on release.
    const previewAtom=(id:number,position:THREE.Vector3)=>{
      const original=live.current.structure.atoms.find(a=>a.id===id);
      if(!original)return;
      const delta=position.clone().sub(new THREE.Vector3(...original.position));
      for(const object of group.children){
        if(object.userData.atom===id || object.userData.owner===id){object.position.copy(new THREE.Vector3(...original.position)).add(delta);if(object.userData.labelOffset)object.position.y+=object.userData.labelOffset;}
        const endpoints=object.userData.bond as [number,number]|undefined;
        if(!endpoints?.includes(id))continue;
        const points=endpoints.map(atomId=>atomId===id?position:new THREE.Vector3(...live.current.structure.atoms.find(a=>a.id===atomId)!.position));
        const direction=points[1].clone().sub(points[0]),length=direction.length();
        object.visible=length>.001;
        if(!object.visible)continue;
        direction.normalize();
        const side=direction.clone().cross(Math.abs(direction.z)<.9?new THREE.Vector3(0,0,1):new THREE.Vector3(0,1,0)).normalize();
        object.position.copy(points[0]).add(points[1]).multiplyScalar(.5).addScaledVector(side,object.userData.lane);
        object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);
        object.scale.y=length;
      }
    };
    const endDrag=(commit:boolean)=>{
      if(!drag)return;
      const completed=drag;drag=null;controls.enabled=true;
      if(canvas.hasPointerCapture(completed.pointer))canvas.releasePointerCapture(completed.pointer);
      canvas.style.cursor=live.current.moveAtoms?'grab':'default';
      if(commit&&completed.position.distanceToSquared(completed.original)>1e-8)live.current.onMove(completed.id,completed.position.toArray() as Position);
      else{previewAtom(completed.id,completed.original);if(commit)live.current.onPick(completed.id);}
    };
    const down=(e:PointerEvent)=>{
      if(!pointers.size){start={x:e.clientX,y:e.clientY};moved=false;}
      pointers.add(e.pointerId);
      if(pointers.size>1){moved=true;endDrag(false);return;}
      if(e.button!==0||!live.current.moveAtoms||e.ctrlKey||e.metaKey||e.shiftKey)return;
      const hit=hitAt(e),id=hit?.object.userData.atom;
      if(id===undefined)return;
      const original=new THREE.Vector3(...live.current.structure.atoms.find(a=>a.id===id)!.position);
      const plane=new THREE.Plane().setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()),original);
      const intersection=rayAt(e).ray.intersectPlane(plane,new THREE.Vector3());
      if(!intersection)return;
      // Capture before OrbitControls sees this pointer, so atom movement never rotates the camera.
      controls.enabled=false;canvas.setPointerCapture(e.pointerId);e.stopImmediatePropagation();
      drag={id,pointer:e.pointerId,original,position:original.clone(),offset:original.clone().sub(intersection),plane};
      canvas.style.cursor='grabbing';
    };
    const move=(e:PointerEvent)=>{
      if(pointers.has(e.pointerId)&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>5)moved=true;
      if(drag&&e.pointerId===drag.pointer){
        const point=rayAt(e).ray.intersectPlane(drag.plane,new THREE.Vector3());
        if(point){point.add(drag.offset).clampScalar(-1000,1000);drag.position.copy(point);previewAtom(drag.id,point);}
        e.stopImmediatePropagation();return;
      }
      if(!e.buttons){const atom=hitAt(e)?.object.userData.atom;canvas.style.cursor=atom!==undefined?(live.current.moveAtoms?'grab':'pointer'):'grab';}
    };
    const up=(e:PointerEvent)=>{
      pointers.delete(e.pointerId);
      if(drag&&e.pointerId===drag.pointer){endDrag(true);e.stopImmediatePropagation();return;}
      if(e.button!==0||moved||pointers.size)return;
      const hit=hitAt(e);
      if(hit?.object.userData.atom!==undefined)live.current.onPick(hit.object.userData.atom);
      else if(hit?.object.userData.bond)live.current.onBond(...hit.object.userData.bond as [number,number]);
    };
    const cancel=(e:PointerEvent)=>{pointers.delete(e.pointerId);moved=true;endDrag(false);};
    const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){moved=true;endDrag(false);}};
    const blur=()=>{pointers.clear();moved=true;endDrag(false);};
    canvas.addEventListener('pointerdown',down,true);canvas.addEventListener('pointermove',move,true);canvas.addEventListener('pointerup',up,true);canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);
    window.addEventListener('keydown',escape);window.addEventListener('blur',blur);
    let frame=0;
    const render=()=>{if(!document.hidden){controls.autoRotate=live.current.rotate&&!reduced&&!drag&&!pointers.size;controls.update();renderer.render(scene,camera);}frame=requestAnimationFrame(render);};render();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('pointerdown',down,true);canvas.removeEventListener('pointermove',move,true);canvas.removeEventListener('pointerup',up,true);canvas.removeEventListener('pointercancel',cancel);canvas.removeEventListener('lostpointercapture',cancel);window.removeEventListener('keydown',escape);window.removeEventListener('blur',blur);controls.dispose();dispose(group);renderer.dispose();renderer.domElement.remove();runtime.current=null;fittedKey.current=null;knownAtoms.current.clear();};
  },[]);
  const fittedKey=useRef<number|null>(null);
  const knownAtoms=useRef(new Set<number>());
  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const addedAtoms=props.structure.atoms.some(atom=>!knownAtoms.current.has(atom.id));
    knownAtoms.current=new Set(props.structure.atoms.map(atom=>atom.id));
    dispose(r.group);
    const sphere=new THREE.SphereGeometry(1,28,20),positions=new Map(props.structure.atoms.map(a=>[a.id,new THREE.Vector3(...a.position)]));
    for(const a of props.structure.atoms){
      const element=elementBySymbol[a.element],space=props.representation==='Space filling';
      const radius=props.representation==='Sticks'?.16:space?(a.element==='H'?.55:.9):(a.element==='H'?.24:.39);
      const mesh=new THREE.Mesh(sphere,new THREE.MeshStandardMaterial({color:element.color,roughness:.25,metalness:.12,emissive:a.id===props.selected?0x193d81:0x000000}));mesh.position.copy(positions.get(a.id)!);mesh.scale.setScalar(radius);mesh.userData.atom=a.id;r.group.add(mesh);
      if(a.id===props.selected || props.measured.includes(a.id)){const halo=new THREE.Mesh(sphere,new THREE.MeshBasicMaterial({color:props.measured.includes(a.id)?0xffd486:0x73b5ff,transparent:true,opacity:.22,side:THREE.BackSide,depthWrite:false}));halo.position.copy(mesh.position);halo.scale.setScalar(radius*1.22);halo.userData.owner=a.id;r.group.add(halo);}
      if(props.labels){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const c=canvas.getContext('2d');if(c){c.font='600 42px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#f1f6ff';c.shadowColor='#08121f';c.shadowBlur=8;c.fillText(`${a.element}${a.charge?` (${a.charge>0?'+':''}${a.charge})`:''}`,128,64);const texture=new THREE.CanvasTexture(canvas);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true}));sprite.position.copy(mesh.position).add(new THREE.Vector3(0,radius+.22,0));sprite.scale.set(1,.5,1);sprite.renderOrder=4;sprite.userData.owner=a.id;sprite.userData.labelOffset=radius+.22;r.group.add(sprite);}}
    }
    if(!props.structure.atoms.length)sphere.dispose();
    if(props.representation!=='Space filling')for(const b of props.structure.bonds){
      const a=positions.get(b.a)!,end=positions.get(b.b)!,delta=end.clone().sub(a),length=delta.length();
      const direction=delta.clone().normalize(),side=direction.clone().cross(Math.abs(direction.z)<.9?new THREE.Vector3(0,0,1):new THREE.Vector3(0,1,0)).normalize();
      for(let i=0;i<b.order;i++){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,1,12),new THREE.MeshStandardMaterial({color:0x9baec4,roughness:.4,metalness:.3}));mesh.position.copy(a).add(end).multiplyScalar(.5).addScaledVector(side,(i-(b.order-1)/2)*.19);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);mesh.userData.bond=[b.a,b.b];mesh.userData.lane=(i-(b.order-1)/2)*.19;mesh.scale.y=length;mesh.visible=length>.001;r.group.add(mesh);}
    }
    if(props.measured.length>=2){const points=props.measured.map(id=>positions.get(id)).filter((p):p is THREE.Vector3=>!!p);r.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0xffd486,depthTest:false})));}
    if(fittedKey.current!==props.fitKey){fit();fittedKey.current=props.fitKey;}
    // Runs after new geometry exists, including attachments, separate atoms, hydrogen fill,
    // and atoms restored with undo/redo. Ordinary selection and bond edits keep the user's zoom.
    else if(addedAtoms)fit(true);
  },[props.structure,props.selected,props.measured,props.labels,props.representation,props.fitKey]);
  return <div className={styles.canvas} data-move={props.moveAtoms} ref={host} role="img" aria-label={`Interactive 3D structure with ${props.structure.atoms.length} atoms. Use the atom list for keyboard editing.`}>{failed&&<div className={styles.fallback}><strong>3D rendering is unavailable</strong><p>You can still build and edit using the atom list, inspect bonds, and export your structure.</p></div>}</div>;
});
