"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GameControlIcon } from "../../environmental/GameControlIcon";
import { loadSettings, renderProfile } from "@/lib/settings/storage";
import { clamp, type Values } from "@/lib/simulations/geographyLabs/model";
import { coastalHeight, coastalSurface, coastalWave, coastX } from "./coastalModel";
import { waterFragment, waterVertex } from "./waterShader";
import styles from "./tsunami.module.css";

type View="coast"|"wave"|"aerial";
type CameraActions={zoom:(direction:number)=>void;rotate:(direction:number)=>void;view:(view:View)=>void};
const presets:Record<View,{position:[number,number,number];target:[number,number,number]}>= {
 coast:{position:[-23,21,31],target:[2,0,0]},
 wave:{position:[-10,5,31],target:[-2,.1,0]},
 aerial:{position:[-9,43,20],target:[1,0,0]},
};
export function TsunamiScene({values,time}:{values:Values;time:number}){
 const host=useRef<HTMLDivElement>(null),live=useRef({values,time});live.current={values,time};
 const actions=useRef<CameraActions>({zoom:()=>{},rotate:()=>{},view:()=>{}});
 const [failed,setFailed]=useState(false),[view,setView]=useState<View>("coast");
 const wave=coastalWave(values,time);
 useEffect(()=>{
  const container=host.current;if(!container)return;
  const profile=renderProfile(loadSettings().quality);let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,profile.pixelRatioCap,1.5));renderer.setClearColor(0xbad7e9);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;renderer.shadowMap.enabled=profile.shadows;renderer.shadowMap.type=THREE.PCFShadowMap;
  const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute("aria-label","Coastal tsunami scene. Drag to orbit; use the camera controls to zoom or change the view.");container.appendChild(canvas);
  const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xbad7e9,.009);
  const camera=new THREE.PerspectiveCamera(43,1,.1,350);
  const orbit=new OrbitControls(camera,canvas);orbit.enableDamping=true;orbit.enablePan=false;orbit.enableZoom=false;orbit.minPolarAngle=.12;orbit.maxPolarAngle=Math.PI*.485;
  const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>(),materials=new Map<string,THREE.MeshStandardMaterial>();
  const color=(hex:number,roughness=.85)=>{const key=hex+":"+roughness;let material=materials.get(key);if(!material){material=new THREE.MeshStandardMaterial({color:hex,roughness});materials.set(key,material);mats.add(material);}return material;};
  function object(geometry:THREE.BufferGeometry,material:THREE.Material,parent:THREE.Object3D){geos.add(geometry);const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,hex:number){const mesh=object(new THREE.BoxGeometry(w,h,d),color(hex),parent);mesh.position.set(x,y,z);return mesh;}
  function cylinder(parent:THREE.Object3D,r1:number,r2:number,h:number,x:number,y:number,z:number,hex:number){const mesh=object(new THREE.CylinderGeometry(r1,r2,h,8),color(hex),parent);mesh.position.set(x,y,z);return mesh;}
  const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,vertexShader:`varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 vDirection;void main(){float h=normalize(vDirection).y;vec3 c=mix(vec3(.76,.87,.94),vec3(.28,.56,.82),smoothstep(-.02,.8,h));gl_FragColor=vec4(c,1.);#include <colorspace_fragment>}`.replace(';#include',';\n#include')});mats.add(skyMaterial);object(new THREE.SphereGeometry(230,24,14),skyMaterial,scene).castShadow=false;
  scene.add(new THREE.HemisphereLight(0xe7f3ff,0x697b63,2.1));
  const sun=new THREE.DirectionalLight(0xfff3dc,3.1);sun.position.set(-14,35,-20);sun.castShadow=profile.shadows;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:.5,far:120});sun.shadow.normalBias=.06;scene.add(sun);
  // An irregular seabed rises continuously into a beach and wooded coastal hills.
  const landGeo=new THREE.PlaneGeometry(94,112,188,180);landGeo.rotateX(-Math.PI/2);landGeo.translate(4,0,0);
  const position=landGeo.attributes.position,landColors=new Float32Array(position.count*3);
  const sand=new THREE.Color(0xcabb93),grass=new THREE.Color(0x748964),stone=new THREE.Color(0x83998e);
  for(let i=0;i<position.count;i++){const x=position.getX(i),z=position.getZ(i),d=x-coastX(z),height=coastalHeight(x,z);position.setY(i,height);const tint=d<0?stone.clone().lerp(sand,clamp((d+5)/5)):sand.clone().lerp(grass,clamp((d-1.6)/4));tint.multiplyScalar(.91+.075*Math.sin(x*2.3+z*1.7)+.05*Math.sin(z*5.3-x*3.1));landColors.set([tint.r,tint.g,tint.b],i*3);}
  landGeo.setAttribute("color",new THREE.BufferAttribute(landColors,3));landGeo.computeVertexNormals();const landMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1});mats.add(landMaterial);object(landGeo,landMaterial,scene);
  const scenery=new THREE.Group();scene.add(scenery);
  function palm(x:number,z:number,scale=1){const y=coastalHeight(x,z);cylinder(scenery,.06*scale,.1*scale,1.65*scale,x,y+.82*scale,z,0x8b7755);for(let k=0;k<7;k++){const a=k*Math.PI*2/7,points=[];for(let j=0;j<6;j++){const r=j/5*.92*scale;points.push(new THREE.Vector3(x+Math.cos(a)*r,y+1.65*scale+Math.sin(j/5*Math.PI)*.25*scale-j/5*.18*scale,z+Math.sin(a)*r));}const curve=new THREE.CatmullRomCurve3(points);object(new THREE.TubeGeometry(curve,8,.045*scale,3,false),color(k%2?0x52764b:0x648453),scenery);}}
  function tree(x:number,z:number,scale:number){const y=coastalHeight(x,z);cylinder(scenery,.07*scale,.13*scale,1.4*scale,x,y+.7*scale,z,0x7b7057);for(let k=0;k<3;k++){const crown=object(new THREE.IcosahedronGeometry((.55-k*.1)*scale,1),color(k%2?0x56764c:0x6b8957),scenery);crown.position.set(x+(k-1)*.16*scale,y+(1.2+k*.3)*scale,z);crown.scale.y=.85;}}
  function house(x:number,z:number,index:number){const y=coastalHeight(x,z),height=.85+(index%3)*.42,w=1.1+(index%2)*.22,d=1.25;
   box(scenery,w+.35,.09,d+.3,x,y+.05,z,0xc3c1ac);box(scenery,w,height,d,x,y+height/2+.08,z,[0xe9e5d8,0xddd3be,0xd4dfdc,0xdbdce4][index%4]);
   const rw=(w+.28)/2,rd=(d+.28)/2,roofGeo=new THREE.BufferGeometry();roofGeo.setAttribute("position",new THREE.Float32BufferAttribute([-rw,0,-rd,-rw,0,rd,-rw,.43,0,rw,0,-rd,rw,0,rd,rw,.43,0],3));roofGeo.setIndex([0,1,2,3,5,4,0,5,3,0,2,5,1,5,2,1,4,5]);roofGeo.computeVertexNormals();const roof=object(roofGeo,color([0x9f6750,0x98785d,0x627e8c][index%3]),scenery);roof.position.set(x,y+height+.08,z);
   for(let level=0;level<(height>1.2?2:1);level++)for(const sign of [-1,1]){box(scenery,.015,.26,.26,x-w/2-.01,y+.4+level*.5,z+sign*.32,0x527687);box(scenery,.23,.25,.015,x+sign*.3,y+.4+level*.5,z+d/2+.01,0x5a7d8e);}
   box(scenery,.02,.46,.25,x-w/2-.02,y+.26,z,0x8a795f);box(scenery,.14,.38,.2,x+.28,y+height+.43,z-.2,0xb6a490);
  }
  function road(x1:number,z1:number,x2:number,z2:number,width:number){const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),steps=Math.ceil(len*3),nx=-dz/len*width/2,nz=dx/len*width/2,points:number[]=[],indices:number[]=[];for(let i=0;i<=steps;i++){const x=x1+dx*i/steps,z=z1+dz*i/steps;for(const sign of [-1,1])points.push(x+nx*sign,coastalHeight(x+nx*sign,z+nz*sign)+.10,z+nz*sign);if(i<steps){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}}const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(points,3));geometry.setIndex(indices);geometry.computeVertexNormals();object(geometry,color(0x7d8990),scenery);for(let i=0;i<len;i+=1.3){const x=x1+dx*i/len,z=z1+dz*i/len;const mark=box(scenery,.06,.01,.55,x,coastalHeight(x,z)+.115,z,0xe5dfc6);mark.rotation.y=Math.atan2(dx,dz);}}
  for(const x of [12.3,21])road(x,-35,x,35,1.25);for(const z of [-17,4,24])road(8,z,32,z,1.1);
  for(let c=0;c<4;c++)for(let r=0;r<9;r++){const x=[9.2,15.4,18.2,24.2][c],z=-30+r*7;if(Math.abs(z-4)<2)continue;house(x,z,c*9+r);}
  for(let i=0;i<35;i++){const z=-36+i*2.15,x=coastX(z)+2.3+(i%2)*.5;palm(x,z,.75+(i%4)*.1);}
  for(let i=0;i<85;i++){const x=26+(i%9)*2.4,z=-43+Math.floor(i/9)*9+Math.sin(i*4)*2;tree(x,z,.75+(i%5)*.16);}
  // Shore rocks and lamps add scale cues without implying a protected coastline.
  for(let i=0;i<28;i++){const z=-38+i*2.8,x=coastX(z)+.4+Math.sin(i*7)*.24;const rock=object(new THREE.DodecahedronGeometry(.13+(i%4)*.07),color(0x8d978c),scenery);rock.position.set(x,coastalHeight(x,z)+.04,z);rock.scale.set(1.5,.6,1);}
  for(let i=0;i<18;i++){const z=-32+i*3.8,x=11.4,y=coastalHeight(x,z);cylinder(scenery,.026,.035,1.25,x,y+.625,z,0x647786);box(scenery,.23,.06,.12,x-.08,y+1.25,z,0xe3e3cd);}
  // Merge static town geometry by material to keep mobile draw calls modest.
  scenery.updateMatrixWorld(true);const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();scenery.traverse(node=>{if(node instanceof THREE.Mesh){const g=node.geometry.clone().applyMatrix4(node.matrixWorld),material=node.material as THREE.Material;const parts=batches.get(material)??[];parts.push(g);batches.set(material,parts);}});scenery.clear();for(const [material,parts] of batches){const geometry=mergeGeometries(parts);parts.forEach(g=>g.dispose());if(geometry)object(geometry,material,scenery);}
  const waterGeo=new THREE.PlaneGeometry(2,180,profile.shadows?320:200,profile.shadows?224:144);waterGeo.rotateX(-Math.PI/2);
  // Spend vertices on the observable wave and shelf, not the distant horizon.
  const waterPoints=waterGeo.attributes.position;for(let i=0;i<waterPoints.count;i++){const x=waterPoints.getX(i);waterPoints.setX(i,x<-.8?-90+(x+1)/.2*65:x>.8?12+(x-.8)/.2*78:-25+(x+.8)/1.6*37);}waterGeo.computeBoundingSphere();
  const uniforms={uTime:{value:0},uCenter:{value:-18},uAmplitude:{value:0},uAmplification:{value:1},uWidth:{value:3.3},uSun:{value:sun.position.clone().normalize()}};
  const waterMaterial=new THREE.ShaderMaterial({vertexShader:waterVertex,fragmentShader:waterFragment,uniforms,side:THREE.DoubleSide});mats.add(waterMaterial);const water=object(waterGeo,waterMaterial,scene);water.castShadow=false;water.frustumCulled=false;
  function buoy(x:number,z:number){const group=new THREE.Group();scene.add(group);cylinder(group,.16,.22,.19,0,0,0,0xc46c35);cylinder(group,.028,.028,.7,0,.37,0,0xd7ddda);box(group,.18,.12,.12,0,.75,0,0xf0d582);return {group,x,z};}
  const buoys=[buoy(-6,3),buoy(1,-5)];
  const boat=new THREE.Group();scene.add(boat);const hull=object(new THREE.SphereGeometry(1,16,10),color(0xe8e7df),boat);hull.scale.set(.32,.16,.85);box(boat,.36,.26,.47,0,.22,.12,0xe1e7e3);box(boat,.38,.13,.22,0,.27,-.12,0x4f7485);boat.rotation.y=-.3;
  function chooseView(next:View){const preset=presets[next];camera.position.set(...preset.position);orbit.target.set(...preset.target);camera.zoom=1;camera.updateProjectionMatrix();orbit.update();}
  chooseView("coast");
  actions.current={view:chooseView,zoom:direction=>{camera.zoom=clamp(camera.zoom*(direction>0?1.18:1/1.18),.7,2.2);camera.updateProjectionMatrix();},rotate:direction=>{const offset=camera.position.clone().sub(orbit.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),direction*Math.PI/9);camera.position.copy(orbit.target).add(offset);orbit.update();}};
  const resize=()=>{const width=container.clientWidth,height=container.clientHeight;if(!width||!height)return;camera.aspect=width/height;camera.fov=camera.aspect<1?58:43;camera.updateProjectionMatrix();renderer.setSize(width,height,false);};const observer=new ResizeObserver(resize);observer.observe(container);resize();
  let frame=0,last=0,disposed=false;
  const render=(now:number)=>{if(disposed)return;frame=requestAnimationFrame(render);if(document.hidden||now-last<30)return;last=now;const {values,time}=live.current,w=coastalWave(values,time);
   uniforms.uTime.value=time;uniforms.uCenter.value=w.center;uniforms.uAmplitude.value=w.amplitude;uniforms.uAmplification.value=w.amplification;uniforms.uWidth.value=w.width;
   for(const b of buoys){b.group.position.set(b.x,coastalSurface(b.x,b.z,time,values)+.04,b.z);b.group.rotation.z=(coastalSurface(b.x+.12,b.z,time,values)-coastalSurface(b.x-.12,b.z,time,values))*.5;}
   boat.position.set(-10,coastalSurface(-10,-11,time,values)+.09,-11);boat.rotation.z=(coastalSurface(-9.7,-11,time,values)-coastalSurface(-10.3,-11,time,values))*.5;
   orbit.update();renderer.render(scene,camera);
  };frame=requestAnimationFrame(render);
  const lost=(event:Event)=>{event.preventDefault();if(!disposed){cancelAnimationFrame(frame);setFailed(true);}};canvas.addEventListener("webglcontextlost",lost);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();orbit.dispose();geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove();actions.current={zoom:()=>{},rotate:()=>{},view:()=>{}};};
 },[]);
 function changeView(next:View){setView(next);actions.current.view(next);}
 return <div className={styles.scene}>
  <div ref={host} className={styles.canvas} role="img" aria-label="Detailed coastal tsunami model with an offshore wave, shallow shelf, beach, town, and wooded hills"/>
  <div className={styles.phase}><span>COASTAL OBSERVATORY</span><strong>{wave.phase}</strong><small>{time===0?"Press Run to launch the long wave":time<8?"Follow the wave toward shallow water":"Wave height grows over the shallow shelf"}</small></div>
  <div className={styles.camera} role="toolbar" aria-label="Tsunami camera controls"><div className={styles.presets}>{(["coast","wave","aerial"] as View[]).map(p=><button key={p} aria-label={`${p[0].toUpperCase()+p.slice(1)} view`} aria-pressed={view===p} onClick={()=>changeView(p)}>{p[0].toUpperCase()+p.slice(1)}</button>)}</div><div className={styles.cameraButtons}><button aria-label="Zoom in" title="Zoom in" onClick={()=>actions.current.zoom(1)}><GameControlIcon kind="plus"/></button><button aria-label="Zoom out" title="Zoom out" onClick={()=>actions.current.zoom(-1)}><GameControlIcon kind="minus"/></button><button aria-label="Rotate left" title="Rotate left" onClick={()=>actions.current.rotate(-1)}><GameControlIcon kind="left"/></button><button aria-label="Rotate right" title="Rotate right" onClick={()=>actions.current.rotate(1)}><GameControlIcon kind="right"/></button><button aria-label="Reset view" title="Reset view" onClick={()=>changeView("coast")}><GameControlIcon kind="home"/></button></div></div>
  <div className={styles.scale}>Heights exaggerated · scenic coast · coastal flooding not modeled</div>
  {failed&&<div className={styles.fallback}>The 3D view is unavailable on this device. You can still use the measurements and complete the travel-time investigation.</div>}
 </div>;
}
