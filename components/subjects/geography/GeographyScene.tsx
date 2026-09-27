"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ocean, river, tsunami, volcano, clamp, type Values } from "@/lib/simulations/geographyLabs/model";
import { GameControlIcon } from "../environmental/GameControlIcon";
import { loadSettings, renderProfile } from "@/lib/settings/storage";

export function GeographyScene({slug,values,time}:{slug:string;values:Values;time:number}){
 const host=useRef<HTMLDivElement>(null),live=useRef({values,time}),controlsRef=useRef<OrbitControls|null>(null);live.current={values,time};const [failed,setFailed]=useState(false);
 useEffect(()=>{
  if(!host.current)return;const container=host.current;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,renderProfile(loadSettings().quality).pixelRatioCap));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.setClearColor(0xd5e8fb);renderer.toneMappingExposure=1.1;renderer.domElement.tabIndex=0;renderer.domElement.setAttribute("aria-label","3D Earth model. Drag to orbit; use the camera buttons to zoom and rotate.");container.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(10,9,13);camera.zoom=.9;
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.5,0);controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.12;controls.maxPolarAngle=Math.PI*.75;controls.enableDamping=true;controls.update();controls.saveState();controlsRef.current=controls;
  scene.add(new THREE.HemisphereLight(0xdbe7fc,0x7e94a8,2));const light=new THREE.DirectionalLight(0xf1f7ff,3);light.position.set(-5,10,7);scene.add(light);const fill=new THREE.DirectionalLight(0x94baff,1);fill.position.set(8,3,-4);scene.add(fill);
  const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>();
  function mesh(g:THREE.BufferGeometry,color:number,parent:THREE.Object3D=scene,opacity=1){geos.add(g);const m=new THREE.MeshStandardMaterial({color,roughness:.78,transparent:opacity<1,opacity,side:THREE.DoubleSide});mats.add(m);const o=new THREE.Mesh(g,m);parent.add(o);return o;}
  function box(w:number,h:number,d:number,x:number,y:number,z:number,color:number,parent:THREE.Object3D=scene,opacity=1){const o=mesh(new THREE.BoxGeometry(w,h,d),color,parent,opacity);o.position.set(x,y,z);return o;}
  function ball(r:number,color:number){return mesh(new THREE.SphereGeometry(r,14,10),color);}
  function tree(x:number,z:number,y=-1.2,scale=.6){const trunk=mesh(new THREE.CylinderGeometry(.055*scale,.08*scale,.7*scale,7),0x866c52);trunk.position.set(x,y+.35*scale,z);for(let i=0;i<3;i++){const leaves=mesh(new THREE.ConeGeometry((.36-i*.075)*scale,.65*scale,9),i%2?0x679981:0x548672);leaves.position.set(x,y+(.7+i*.24)*scale,z);}}
  function rock(x:number,z:number,y:number,size=.15){const stone=mesh(new THREE.DodecahedronGeometry(size),0x8e948e);stone.position.set(x,y,z);stone.rotation.set(x*.7,z*.4,x+z);stone.scale.y=.65;}
  const base=box(12,.5,8,0,-1.5,0,0x7e95ae);const grid=new THREE.GridHelper(16,16,0x90aecb,0xb1c9e0);grid.position.y=-1.78;scene.add(grid);geos.add(grid.geometry);(Array.isArray(grid.material)?grid.material:[grid.material]).forEach(m=>mats.add(m));
  let update=()=>{};
  if(slug==="volcano-eruption-3d"){
   base.material.color.setHex(0x62564c);const terrain=new THREE.CylinderGeometry(.6,3.5,3.6,80,24),vertices=terrain.attributes.position,colors=[];
   for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i),angle=Math.atan2(z,x),f=(1.8-y)/3.6,detail=(Math.sin(angle*9+f*3)*.08+Math.sin(angle*17-f*5)*.035)*Math.sin(f*Math.PI);
    vertices.setXYZ(i,x*(1+detail),y,z*(1+detail));const shade=new THREE.Color().setHSL(.075+f*.025,.12+f*.08,.26+f*.12+Math.sin(angle*17)*.035);colors.push(shade.r,shade.g,shade.b);}
   terrain.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));terrain.computeVertexNormals();const mountain=mesh(terrain,0xffffff);mountain.material.vertexColors=true;mountain.position.y=.5;
   const crater=mesh(new THREE.CylinderGeometry(.5,.4,.12,40),0xe89d69);crater.position.y=2.34;crater.material.emissive.setHex(0xff650f);crater.material.emissiveIntensity=.8;
   const rim=mesh(new THREE.TorusGeometry(.6,.12,12,48),0x434049);rim.rotation.x=Math.PI/2;rim.position.y=2.35;
   for(let i=0;i<30;i++){const rock=mesh(new THREE.DodecahedronGeometry(.1+(i%4)*.08),0x514b46);rock.position.set(Math.sin(i*2.4)*4.5,-1.1,Math.cos(i*2.4)*3.4);}
   const streams=Array.from({length:5},(_,i)=>{const a=i*1.256;const points=Array.from({length:24},(_,k)=>{const f=k/23,r=.6+f*2.95;return new THREE.Vector3(Math.cos(a+Math.sin(f*8)*.025)*r,2.43-f*3.6,Math.sin(a+Math.sin(f*8)*.025)*r);});const flow=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),36,.048,7,false),0xff781f);flow.material.emissive.setHex(0xef4708);flow.material.emissiveIntensity=.8;return flow;});
   for(let i=0;i<16;i++){const x=-5.5+(i%8)*1.5,z=i<8?-3.3:3.3;if(Math.hypot(x,z)>4)tree(x,z,-1.2,.55+(i%3)*.12);}
   const ash=Array.from({length:42},()=>ball(.12,0xa9a6a2));const lava=Array.from({length:45},()=>ball(.09,0xf5a566));
   update=()=>{const {time:t,values:v}=live.current,e=volcano(v),active=t>0,flow=e.style!=="Explosive";streams.forEach(stream=>{stream.visible=active&&flow;});ash.forEach((o,i)=>{const p=(t*.35+i/42)%1;o.visible=active&&e.style!=="Effusive";o.position.set(Math.sin(i*2.4)*p*2,2.45+p*(2+e.index*3),Math.cos(i*2.4)*p*1.3);o.scale.setScalar(.5+p*2);});lava.forEach((o,i)=>{const p=(t*.13+i/45)%1,a=(i%5)*1.256;o.visible=active&&flow;const radius=.6+p*2.9;o.position.set(Math.cos(a)*radius,2.4-p*3.6,Math.sin(a)*radius);});};
  }else if(slug==="plate-tectonics-3d"){
   base.material.color.setHex(0x875647);const left=new THREE.Group(),right=new THREE.Group();scene.add(left,right);
   for(const [group,x,color] of [[left,-2.7,0x7d898e],[right,2.7,0x9d8d77]] as const){box(5.1,.8,6,x,-.6,0,color,group);box(5.1,.13,6.02,x,-.38,0,0xaab6bc,group);box(5.1,.1,6.03,x,-.72,0,0x8c7870,group);box(5.1,.2,6,x,-.1,0,0xb8b3a5,group);for(let i=0;i<7;i++)box(.03,.025,6,x-2+i*.65,.02,0,0x596b83,group);}
   const ridge=mesh(new THREE.ConeGeometry(.9,1.5,4),0xa89a86);ridge.scale.z=4;ridge.position.y=.4;
   const slab=box(4,.6,5,1,-1.1,0,0x728491);slab.rotation.z=-.45;
   const vent=mesh(new THREE.ConeGeometry(.7,1.6,28),0x9d8a74);vent.position.set(2.4,.65,0);
   const magma=box(.5,.5,5,0,-.3,0,0xe6a17b);
   update=()=>{const {time:t,values:v}=live.current,move=t/10*v.rate/10;
    left.position.set(0,0,0);right.position.set(0,0,0);ridge.visible=v.boundary===0;slab.visible=vent.visible=v.boundary===1;magma.visible=v.boundary===0;
    if(v.boundary===0){left.position.x=-move;right.position.x=move;ridge.scale.y=.6+move*.5;}
    else if(v.boundary===1){left.position.x=move*.6;right.position.x=-move*.15;slab.position.y=-1.1-move*.3;vent.scale.y=.6+move*.5;}
    else{left.position.z=move;right.position.z=-move;}
   };
  }else if(slug==="tsunami-3d"){
   base.material.color.setHex(0x756857);box(2.7,1.4,8,4.65,-.55,0,0xa99d85);
   const sea=mesh(new THREE.PlaneGeometry(9.3,8,100,25),0x4779b4,scene,.84);sea.rotation.x=-Math.PI/2;sea.position.set(-1.35,-.3,0);const pos=sea.geometry.attributes.position;
   box(.35,.08,8,3.46,.19,0,0xdccba1);box(.22,.035,8,5.1,.17,0,0x9aaebc);
   for(let i=0;i<5;i++){const x=4.1+(i%2)*.6,z=-2+i;box(.32,.4,.4,x,.35,z,0xe5e5d6);box(.4,.08,.48,x,.59,z,0x7a9db2);box(.16,.13,.02,x,.39,z+.21,0x548aa6);tree(5.65,z,.15,.65);}
   update=()=>{const {values:v,time:t}=live.current,a=tsunami(v),center=-4.65+9.3*t/10;for(let i=0;i<pos.count;i++){const x=pos.getX(i),shoal=1+clamp((x-2)/2.65)*(a.coastal/v.uplift-1),wave=t>0?v.uplift*.13*shoal*Math.exp(-(((x-center)/.55)**2)):0;pos.setZ(i,wave);}pos.needsUpdate=true;sea.geometry.computeVertexNormals();};
  }else if(slug==="river-erosion"){
   base.material.color.setHex(0x88745b);const bed=mesh(new THREE.PlaneGeometry(12,8,100,70),0xa59479);bed.rotation.x=-Math.PI/2;bed.position.y=-.65;const pos=bed.geometry.attributes.position;
   const water=mesh(new THREE.PlaneGeometry(12,8,100,70),0x598fbd,scene,.72);water.rotation.x=-Math.PI/2;water.position.y=-.6;const wp=water.geometry.attributes.position;
   for(let i=0;i<16;i++){const x=-5.6+(i%8)*1.6,z=i<8?-3.55:3.55;tree(x,z,-.62,.65+(i%3)*.12);rock(x+.3,z-.2,-.6,.12+(i%3)*.05);}
   const sediment=Array.from({length:45},(_,i)=>ball(i%3===0?.085:.035,i%3===0?0x635c53:0xe2c095));
   update=()=>{const {values:v,time:t}=live.current,r=river(v),width=.25+v.width/50,erosion=clamp(r.shear/8)*t/10;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getY(i),center=Math.sin(x*.65)*1.4,d=Math.abs(z-center);pos.setZ(i,-Math.exp(-((d/width)**4))*(.2+erosion*.6));wp.setZ(i,d<width?0:-1.6);}
    pos.needsUpdate=true;wp.needsUpdate=true;bed.geometry.computeVertexNormals();water.geometry.computeVertexNormals();sediment.forEach((o,i)=>{const moving=i%3===0?r.gravel:r.sand,x=((i/45*12+(moving?t*r.velocity:0))%12)-6;o.position.set(x,-.55,Math.sin(x*.65)*-1.4+Math.sin(i*3)*width*.6);});};
  }else{
   base.visible=false;box(11,.3,5,0,-1.65,0,0x586777);box(11,3.6,5,0,.3,0,0x5284b9,scene,.12);
   box(.18,3.7,5,-5.6,.3,0,0x8494a8,scene,.4);box(.18,3.7,5,5.6,.3,0,0x8494a8,scene,.4);
   const particles=Array.from({length:90},(_,i)=>ball(.06,i<45?0xe6b58b:0x9ec7fc));
   update=()=>{const {time:t,values:v}=live.current,d=ocean(v).delta;particles.forEach((o,i)=>{const a=(i/90*2*Math.PI-(Math.abs(d)<.01?0:t*.3*clamp(d,-5,5))),x=4.5*Math.cos(a),y=1.25*Math.sin(a);o.position.set(x,y,Math.sin(i*9)*1.6);o.material.color.setHex(y>0?0xe6b58b:0x91bfff);});};
  }
  const resize=()=>{const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/Math.max(1,h);camera.fov=2*Math.atan(Math.tan(21*Math.PI/180)/Math.min(1,Math.max(.4,camera.aspect)))*180/Math.PI;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};const ro=new ResizeObserver(resize);ro.observe(container);resize();let raf=0;
  let previousValues:Values|undefined,previousTime=-1;
  let lastFrame=0;const frame=(now:number)=>{raf=requestAnimationFrame(frame);if(document.hidden||now-lastFrame<30)return;lastFrame=now;if(previousValues!==live.current.values||previousTime!==live.current.time){update();previousValues=live.current.values;previousTime=live.current.time;}controls.update();renderer.render(scene,camera);};raf=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();controls.dispose();controlsRef.current=null;geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
 },[slug]);
 function zoom(direction:number){const controls=controlsRef.current;if(!controls)return;const camera=controls.object as THREE.PerspectiveCamera;camera.zoom=clamp(camera.zoom*(direction>0?1.2:1/1.2),.65,2.6);camera.updateProjectionMatrix();}
 function rotate(direction:number){const controls=controlsRef.current;if(!controls)return;const position=controls.object.position.clone().sub(controls.target);position.applyAxisAngle(new THREE.Vector3(0,1,0),direction*Math.PI/6);controls.object.position.copy(controls.target).add(position);controls.update();}
 return <div className="geoThree"><div ref={host} className="geoCanvas" role="img" aria-label={`${slug.replaceAll("-"," ")} interactive 3D model`}/>{failed&&<p className="geoFallback">3D is unavailable on this device. The data panel and mission controls still work.</p>}<div className="geoCamera" role="toolbar" aria-label="Camera controls"><button aria-label="Zoom in" title="Zoom in" onClick={()=>zoom(1)}><GameControlIcon kind="plus"/></button><button aria-label="Zoom out" title="Zoom out" onClick={()=>zoom(-1)}><GameControlIcon kind="minus"/></button><button aria-label="Rotate left" title="Rotate left" onClick={()=>rotate(-1)}><GameControlIcon kind="left"/></button><button aria-label="Rotate right" title="Rotate right" onClick={()=>rotate(1)}><GameControlIcon kind="right"/></button><button aria-label="Reset view" title="Reset view" onClick={()=>controlsRef.current?.reset()}><GameControlIcon kind="home"/></button></div></div>;
}
