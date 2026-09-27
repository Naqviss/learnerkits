"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { buildTools, cellZone, MAP_SIZE, buildProblem, isRoad, reservedCells, type AssetKind, type BuildState, type editBuild } from "@/lib/simulations/environmentalLabs/builder";
import type { Sample } from "@/lib/simulations/environmentalLabs/engine";
import styles from "./environmental.module.css";
type Action=Parameters<typeof editBuild>[2];
export type WorldHandle={preview:(tool:string,x:number,y:number)=>void;cancel:()=>void;drop:(tool:string,x:number,y:number)=>void;rotate:(direction:number)=>void;zoom:(direction:number)=>void;reset:()=>void};
type Props={slug:string;state:BuildState;sample:Sample;running:boolean;selected:string|null;mode:"build"|"move"|"remove";onEdit:(action:Action)=>void;onNotice:(text:string)=>void};
const CELL=1.6,SPAN=MAP_SIZE*CELL,offset=(MAP_SIZE-1)*CELL/2;
export const EnvironmentalWorld=forwardRef<WorldHandle,Props>(function EnvironmentalWorld(props,ref){
 const host=useRef<HTMLDivElement>(null),live=useRef(props);live.current=props;
 const api=useRef<WorldHandle>({preview:()=>{},cancel:()=>{},drop:()=>{},rotate:()=>{},zoom:()=>{},reset:()=>{}});
 useImperativeHandle(ref,()=>({preview:(...args)=>api.current.preview(...args),cancel:()=>api.current.cancel(),drop:(...args)=>api.current.drop(...args),rotate:d=>api.current.rotate(d),zoom:d=>api.current.zoom(d),reset:()=>api.current.reset()}),[]);
 const [failed,setFailed]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{
  const container=host.current;if(!container)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
  const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute("role","application");canvas.setAttribute("aria-label","Interactive city map. Arrow keys choose a plot; Enter places the selected project; Delete removes a placed project. Drag projects to move them.");container.appendChild(canvas);
  const scene=new THREE.Scene();scene.background=new THREE.Color("#d5e8fb");scene.fog=new THREE.Fog("#d5e8fb",65,115);
  const camera=new THREE.OrthographicCamera(-20,20,15,-15,.1,150);camera.position.set(30,29,34);
  const orbit=new OrbitControls(camera,canvas);orbit.target.set(0,0,0);orbit.enableDamping=true;orbit.enableRotate=false;orbit.enablePan=false;orbit.minZoom=.7;orbit.maxZoom=2.4;orbit.update();orbit.saveState();
  const hemi=new THREE.HemisphereLight("#e8f5ff","#70849d",2.4);scene.add(hemi);
  const sun=new THREE.DirectionalLight("#f1f6ff",3.6);sun.position.set(-12,25,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-23;sun.shadow.camera.right=23;sun.shadow.camera.top=23;sun.shadow.camera.bottom=-23;sun.shadow.normalBias=.04;sun.shadow.bias=-.0002;scene.add(sun);
  const materials=new Map<string,THREE.MeshStandardMaterial>(),geometries=new Map<string,THREE.BufferGeometry>();
  const mat=(color:string,metal=0)=>{const key=color+metal;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.78,metalness:metal}));return materials.get(key)!;};
  function box(group:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,color:string){const key=`b${w},${h},${d}`;if(!geometries.has(key))geometries.set(key,new THREE.BoxGeometry(w,h,d));const mesh=new THREE.Mesh(geometries.get(key),mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;}
  function cylinder(group:THREE.Object3D,top:number,bottom:number,height:number,x:number,y:number,z:number,color:string,segments=10){const key=`c${top},${bottom},${height},${segments}`;if(!geometries.has(key))geometries.set(key,new THREE.CylinderGeometry(top,bottom,height,segments));const mesh=new THREE.Mesh(geometries.get(key),mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;}
  function crown(group:THREE.Object3D,r:number,x:number,y:number,z:number,color:string){const key=`s${r}`;if(!geometries.has(key))geometries.set(key,new THREE.IcosahedronGeometry(r,1));const mesh=new THREE.Mesh(geometries.get(key),mat(color));mesh.position.set(x,y,z);mesh.scale.set(1,1.12,.9);mesh.castShadow=true;group.add(mesh);return mesh;}
  function tree(group:THREE.Object3D,x:number,z:number,scale=1){const trunk=cylinder(group,.055*scale,.09*scale,.9*scale,x,.45*scale,z,"#78634a");crown(group,.43*scale,x,1.12*scale,z,"#447958");crown(group,.32*scale,x-.2*scale,.88*scale,z+.15*scale,"#67955d");crown(group,.3*scale,x+.18*scale,1.03*scale,z-.08*scale,"#548c64");return trunk;}
  function house(group:THREE.Object3D,height=1.1,roof="#8f6651",cool=false){box(group,1,height,1,0,height/2,0,"#e6e4ce");box(group,1.14,.14,1.14,0,height+.06,0,cool?"#f0f0df":roof);for(const x of [-.3,.3])for(const y of [.32,.74,1.17,1.57].filter(y=>y<height)) {box(group,.2,.22,.018,x,y,.51,"#71949a");box(group,.018,.22,.2,.51,y,x,"#60848e");}box(group,.2,.38,.02,0,.19,.51,"#59776f");if(!cool)box(group,.18,.23,.18,.28,height+.2,-.2,"#777a70");}
  const rotors:THREE.Group[]=[],batteryFills:THREE.Mesh[]=[];
  function asset(kind:AssetKind){const g=new THREE.Group();
   if(kind==="trees"||kind==="corridor"){box(g,1.43,.05,1.43,0,.025,0,"#6b9a65");tree(g,-.33,-.25,.8);tree(g,.31,.27,.9);tree(g,-.35,.4,.6);if(kind==="corridor")box(g,.3,.04,1.6,0,.065,0,"#b4b97f");}
   else if(kind==="house"||kind==="roof"){house(g,1.25,"#986552",kind==="roof");box(g,1.45,.05,1.45,0,.02,0,"#c3c9b9");}
   else if(kind==="solar"){box(g,1.4,.04,1.4,0,.02,0,"#879f75");for(const z of [-.36,.36]){const panel=new THREE.Group();panel.position.set(0,.36,z);panel.rotation.x=-.28;box(panel,1.24,.055,.51,0,0,0,"#254c6c");for(const x of [-.45,-.15,.15,.45])box(panel,.015,.065,.5,x,0,0,"#83b4c5");box(panel,1.25,.065,.012,0,0,0,"#83b4c5");g.add(panel);box(g,.06,.28,.07,-.45,.17,z,"#8c9b9e");box(g,.06,.28,.07,.45,.17,z,"#8c9b9e");}}
   else if(kind==="wind"){cylinder(g,.12,.23,.1,0,.05,0,"#c0c6bc");cylinder(g,.05,.1,1.85,0,.97,0,"#e7e8dc");const rotor=new THREE.Group();rotor.position.set(0,1.98,.1);cylinder(g,.11,.11,.2,0,1.96,0,"#cbd4ce");for(let i=0;i<3;i++){const blade=new THREE.Group();blade.rotation.z=i*Math.PI*2/3;const b=box(blade,.085,.8,.04,0,.45,0,"#f2f0dd");b.rotation.z=-.12;rotor.add(blade);}g.add(rotor);rotors.push(rotor);}
   else if(kind==="battery"){box(g,1.1,.82,.9,0,.41,0,"#dadfd9");box(g,.85,.58,.025,0,.44,.46,"#274b49");const fill=box(g,.66,.42,.04,0,.39,.48,"#6ddab8");batteryFills.push(fill);box(g,.2,.12,.38,0,.88,0,"#577971");}
   else if(kind==="factory"||kind==="capture"){box(g,1.25,.7,1.1,0,.35,0,kind==="capture"?"#8cacaa":"#9b9584");box(g,1.36,.1,1.2,0,.75,0,"#5e7378");cylinder(g,.1,.14,1.2,.37,1.08,-.28,"#bab1a1");cylinder(g,.08,.1,.9,-.1,.98,-.28,"#cec7b7");for(let i=0;i<3;i++)box(g,.18,.2,.03,-.4+i*.35,.46,.56,"#486974");if(kind==="capture"){cylinder(g,.21,.21,.95,-.46,.55,-.16,"#b2d4d0");box(g,.17,.35,.06,.1,.42,.6,"#75bda6");}}
   else if(kind==="garden"||kind==="wetland"){box(g,1.43,.08,1.43,0,.04,0,kind==="wetland"?"#518e91":"#779d6d");for(let i=0;i<7;i++){const x=Math.sin(i*7)*.55,z=Math.cos(i*11)*.52;cylinder(g,.012,.02,.4,x,.24,z,"#718b48",5);crown(g,.1,x,.38,z,"#8baa62");}if(kind==="garden")tree(g,-.34,.23,.65);}
   else if(kind==="water"){box(g,1.4,.35,.7,0,.1,0,"#9eada9");box(g,.45,.7,.55,.25,.35,0,"#d3d8cc");box(g,1.32,.035,.11,0,.3,.38,"#6caabd");}
   else if(kind==="road"||kind==="transit"){box(g,1.45,.06,1.45,0,.03,0,"#727e7a");for(const z of [-.5,0,.5])box(g,.055,.012,.25,0,.071,z,"#eee8cd");if(kind==="transit"){box(g,.45,.4,1.05,-.35,.27,0,"#68b9a4");box(g,.47,.15,.8,-.35,.34,0,"#496c77");}}
   else if(kind==="drain"){box(g,1.45,.1,1.45,0,.05,0,"#adb5a6");box(g,.43,.025,1.4,0,.11,0,"#4c777c");for(let z=-.6;z<.7;z+=.18)box(g,.47,.035,.045,0,.13,z,"#b8c9c2");}
   else if(kind==="barrier"){box(g,1.5,.6,.3,0,.3,0,"#b7b8a4");for(const x of [-.6,0,.6])box(g,.13,.75,.43,x,.375,0,"#d0d0bd");}
   else if(kind==="warning"){cylinder(g,.035,.07,1.7,0,.85,0,"#8c9e99");box(g,.45,.25,.4,0,1.75,0,"#e9c175");crown(g,.13,0,1.99,0,"#ed9470");box(g,.7,.08,.7,0,.04,0,"#bcc4b5");}
   else if(kind==="farm"){box(g,1.43,.06,1.43,0,.03,0,"#ac9970");for(let x=-.5;x<.6;x+=.2)box(g,.07,.14,1.3,x,.12,0,"#8c9f58");house(g,.5,"#995b47");g.scale.set(.9,.9,.9);}
   else if(kind==="pump"){cylinder(g,.25,.25,.32,0,.16,0,"#7eacac");box(g,.13,.7,.13,0,.55,0,"#b0c2b9");box(g,.7,.08,.08,.16,.87,0,"#658a91");}
   else {box(g,1.45,.08,1.45,0,.04,0,"#b49d77");cylinder(g,.14,.18,.15,-.3,.14,.2,"#9b7851");cylinder(g,.13,.15,.12,.3,.12,-.3,"#967249");}
   return g;
  }
  const ground=new THREE.Group();scene.add(ground);box(ground,SPAN+.3,.55,SPAN+.3,0,-.43,0,"#8798ac");box(ground,SPAN+.45,.22,SPAN+.45,0,-.81,0,"#667c9a");
  for(let col=0;col<MAP_SIZE;col++)for(let row=0;row<MAP_SIZE;row++){
   const x=col*CELL-offset,z=row*CELL-offset,water=col<3,road=isRoad(col,row);
   if(!water)box(ground,1.595,.34,1.595,x,.0,z,road?"#899bac":["#9db47b","#a3b981","#98ae78"][(col*7+row*3)%3]);
   if(road){
    if(row===5||row===11)box(ground,.65,.012,.045,x,.18,z+(row===5?.77:0),"#f6efc8");
    if(col===10&&!isRoad(col-1,row))box(ground,.045,.012,.65,x,.18,z,"#f6efc8");
   }
   if(!water&&!road){
    // Raised sidewalk edges separate construction plots from the streets.
    if(isRoad(col,row+1))box(ground,1.6,.07,.15,x,.205,z+.72,"#ccd9e4");
    if(isRoad(col,row-1))box(ground,1.6,.07,.15,x,.205,z-.72,"#ccd9e4");
    if(isRoad(col+1,row))box(ground,.15,.07,1.6,x+.72,.205,z,"#ccd9e4");
    if(isRoad(col-1,row))box(ground,.15,.07,1.6,x-.72,.205,z,"#ccd9e4");
   }
  }
  const waterGeometry=new THREE.PlaneGeometry(SPAN,SPAN,1,1),waterMaterial=new THREE.MeshStandardMaterial({color:"#428fca",roughness:.28,metalness:.15,transparent:true,opacity:.9});const water=new THREE.Mesh(waterGeometry,waterMaterial);water.rotation.x=-Math.PI/2;water.position.set(0,-.06,0);water.receiveShadow=true;scene.add(water);
  for(let i=0;i<25;i++){const mesh=box(ground,.25+(i%3)*.16,.015,.022,-offset-.2+(i*1.7)%4.1,.0,-offset+(i*3.17)%(SPAN-1),"#a7d6f4");mesh.userData.wave=true;}
  const scenery=new THREE.Group();ground.add(scenery);
  for(const key of [...reservedCells].filter(key=>!["4,1","5,1","4,9","5,9"].includes(key))){
   const [col,row]=key.split(",").map(Number),g=new THREE.Group();g.position.set(col*CELL-offset,.18,row*CELL-offset);
   if(row===15||row===0||(col===15&&row<3)){tree(g,-.3,-.15,.8);tree(g,.34,.35,.6);box(g,.65,.1,.22,0,.28,.56,"#aa8259");box(g,.06,.24,.18,-.24,.12,.56,"#667666");box(g,.06,.24,.18,.24,.12,.56,"#667666");}
   else {const h=col>=12?1.3+((col*3+row*7)%5)*.48:.8+((col+row)%3)*.5;
    box(g,1.5,.06,1.5,0,.03,0,"#c4d4e2");house(g,h,["#a96750","#708c87","#777a8e"][col%3]);
    if(col>=12){for(let y=1.8;y<h;y+=.45)for(const x of [-.3,.3]){box(g,.21,.24,.025,x,y,.52,"#679ba7");box(g,.025,.24,.21,.52,y,x,"#679ba7");}box(g,1.08,.12,.28,0,.64,.61,["#d4a157","#68a9a0","#cb8977"][row%3]);}
    cylinder(g,.12,.15,.15,-.6,.12,.5,"#b89470");crown(g,.19,-.6,.34,.5,"#75995d");
   }scenery.add(g);
  }
  // Quay, jetties, street furniture and crossings make the town readable at a glance.
  box(ground,.18,.36,SPAN,3*CELL-offset-.83,.01,0,"#b8cbdc");
  for(const row of [2,8,13]){const z=row*CELL-offset;box(ground,1.9,.15,.65,2*CELL-offset,.0,z,"#a28c6b");for(const x of [1.4,2.5])cylinder(ground,.05,.05,.8,x*CELL-offset,-.05,z+.22,"#82765c");}
  for(const col of [4,7,9,12,14])for(const row of [5,11]){const x=col*CELL-offset,z=row*CELL-offset-.85;cylinder(ground,.025,.045,1.15,x,.73,z,"#647d7a");box(ground,.3,.05,.14,x+.1,1.32,z,"#f3d697");}
  for(const row of [5,6,11])for(let i=0;i<5;i++)box(ground,.15,.015,1.25,10*CELL-offset-.52+i*.25,.18,row*CELL-offset,"#eeeaca");
  // Static scenery shares buffers by material instead of thousands of draw calls.
  const mergedGeometry:THREE.BufferGeometry[]=[];
  ground.updateMatrixWorld(true);const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();
  ground.traverse(obj=>{if(obj instanceof THREE.Mesh){const geometry=obj.geometry.clone().applyMatrix4(obj.matrixWorld);const material=obj.material as THREE.Material;const list=batches.get(material)??[];list.push(geometry);batches.set(material,list);}});
  ground.clear();for(const [material,parts] of batches){const geometry=mergeGeometries(parts);parts.forEach(part=>part.dispose());if(geometry){mergedGeometry.push(geometry);const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;ground.add(mesh);}}
  const boat=new THREE.Group();box(boat,.52,.18,1.4,0,0,0,"#e7e1c6");box(boat,.35,.27,.5,0,.2,-.15,"#859f9b");boat.position.set(1.2*CELL-offset,.04,3);scene.add(boat);
  const cars=Array.from({length:5},(_,i)=>{const g=new THREE.Group();box(g,.6,.2,.32,0,0,0,["#e9c58c","#e3ded0","#759ea6","#ba8068","#778c69"][i]);box(g,.32,.14,.29,0,.15,0,"#506f79");g.position.y=.36;scene.add(g);return g;});
  const projects=new THREE.Group(),reference=new THREE.Group();scene.add(projects,reference);let placedRef:BuildState["placements"]|null=null,referenceKey="";
  const startingAssets:Record<string,[AssetKind,string][]>={
   "greenhouse-effect-simulator":[["factory","co2"],["farm","methane"],["roof","albedo"]],
   "carbon-cycle-simulator":[["trees","forest"],["factory","emissions"],["capture","removal"],["trees","forest"]],
   "sea-level-rise-simulator":[["pump","subsidence"]],
   "ocean-acidification-simulator":[["factory","nutrients"],["garden","co2"]],
   "renewable-energy-grid-simulator":[["solar","solar"],["wind","wind"],["battery","storage"],["factory","gas"]],
   "air-pollution-smog-simulator":[["factory","industry"],["road","traffic"],["house","industry"]],
   "deforestation-water-cycle-simulator":[["trees","forest"],["trees","forest"],["clearing","compaction"]],
   "biodiversity-habitat-fragmentation":[["trees","habitat"],["trees","habitat"],["corridor","corridor"],["trees","habitat"]],
   "urban-heat-island-simulator":[["trees","trees"],["roof","coolRoofs"],["garden","permeable"]],
   "climate-resilience-city-builder":[["wetland","wetlands"],["drain","drainage"],["trees","shade"],["barrier","barriers"]],
  };
  const rainGeometry=new THREE.BufferGeometry(),rainPositions=new Float32Array(180*6);rainGeometry.setAttribute("position",new THREE.BufferAttribute(rainPositions,3));const rainMaterial=new THREE.LineBasicMaterial({color:"#b7d9e1",transparent:true,opacity:.65});const rain=new THREE.LineSegments(rainGeometry,rainMaterial);rain.frustumCulled=false;scene.add(rain);
  const floodGeometry=new THREE.PlaneGeometry((MAP_SIZE-3)*CELL,3.2),floodMaterial=new THREE.MeshStandardMaterial({color:"#74b5e7",transparent:true,opacity:.7,roughness:.28});const flood=new THREE.Mesh(floodGeometry,floodMaterial);flood.rotation.x=-Math.PI/2;flood.position.set(2.4,.21,5.5*CELL-offset);flood.visible=false;scene.add(flood);
  const hazeGeometry=new THREE.BoxGeometry(SPAN-1,3.6,SPAN-1),hazeMaterial=new THREE.MeshBasicMaterial({color:"#c3ad8d",transparent:true,opacity:0,depthWrite:false});const haze=new THREE.Mesh(hazeGeometry,hazeMaterial);haze.position.y=1.3;scene.add(haze);
  const grid=new THREE.GridHelper(SPAN,MAP_SIZE,"#ebf0ca","#d3deb0");grid.position.y=.192;const gm=grid.material as THREE.Material;gm.transparent=true;gm.opacity=.22;scene.add(grid);
  const ghost=box(scene,1.5,.035,1.5,0,.23,0,"#88dfb4");(ghost.material as THREE.MeshStandardMaterial)=new THREE.MeshStandardMaterial({color:"#70d5a4",transparent:true,opacity:.75,depthWrite:false});ghost.visible=false;
  const carried=new THREE.Group();scene.add(carried);let carriedKey="",carriedMaterials:THREE.MeshStandardMaterial[]=[];
  const targetGeometry=new THREE.BoxGeometry(1.36,.016,1.36),targetMaterial=new THREE.MeshBasicMaterial({color:"#82c765",transparent:true,opacity:.35,depthWrite:false});
  const targets=new THREE.InstancedMesh(targetGeometry,targetMaterial,MAP_SIZE*MAP_SIZE);targets.count=0;scene.add(targets);let targetKey="";const matrix=new THREE.Matrix4();
  const tooltip=document.createElement("div");tooltip.className=styles.placementPreview;tooltip.dataset.testid="placement-preview";tooltip.hidden=true;container.appendChild(tooltip);
  const previewName=document.createElement("strong"),previewHint=document.createElement("span");tooltip.append(previewName,previewHint);
  let previewTool:string|null=null,hovering=false,lastPointer:{x:number;y:number}|null=null;
  function hidePreview(){ghost.visible=false;carried.visible=false;tooltip.hidden=true;hovering=false;previewTool=null;}
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.18);
  let focus={col:4,row:4},drag:{id:number;x:number;y:number}|null=null,down:{x:number;y:number}|null=null,frame=0,last=performance.now(),animation=0,disposed=false;
  function locate(x:number,y:number){const rect=canvas.getBoundingClientRect();if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)return null;pointer.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const point=ray.ray.intersectPlane(plane,new THREE.Vector3());return point?{col:Math.round((point.x+offset)/CELL),row:Math.round((point.z+offset)/CELL)}:null;}
  function projectAt(x:number,y:number){locate(x,y);const hits=ray.intersectObjects(projects.children,true);for(const hit of hits){let obj:THREE.Object3D|null=hit.object;while(obj&&obj!==projects){if(typeof obj.userData.placementId==="number")return obj.userData.placementId as number;obj=obj.parent;}}return null;}
  function hover(col:number,row:number,toolId?:string,x?:number,y?:number){
   focus={col,row};const p=live.current,existing=drag?p.state.placements.find(item=>item.id===drag!.id):null,tool=buildTools[p.slug].find(t=>t.id===(toolId??existing?.tool??p.selected));
   if(!tool||(!drag&&p.mode!=="build"&&!toolId)){hidePreview();return;}
   previewTool=tool.id;hovering=true;const error=buildProblem(p.slug,p.state,tool,col,row,drag?.id),inside=col>=0&&col<MAP_SIZE&&row>=0&&row<MAP_SIZE;
   ghost.position.set(col*CELL-offset,.23,row*CELL-offset);ghost.visible=inside;
   (ghost.material as THREE.MeshStandardMaterial).color.set(error?"#f17c69":"#8ce69d");
   if(carriedKey!==tool.kind){carried.clear();carriedMaterials.forEach(m=>m.dispose());carriedMaterials=[];const r=rotors.length,b=batteryFills.length,object=asset(tool.kind);rotors.length=r;batteryFills.length=b;
    object.traverse(node=>{if(node instanceof THREE.Mesh){const m=(node.material as THREE.MeshStandardMaterial).clone();m.transparent=true;m.opacity=.78;node.material=m;node.castShadow=false;carriedMaterials.push(m);}});carried.add(object);carriedKey=tool.kind;
   }
   carried.visible=inside;carried.position.set(col*CELL-offset,.29,row*CELL-offset);carriedMaterials.forEach(m=>{m.emissive.set(error?"#c73d2a":"#2a7d49");m.emissiveIntensity=.2;});
   tooltip.hidden=false;tooltip.dataset.valid=String(!error);previewName.textContent=`${existing?"Move · ":""}${tool.label}`;
   previewHint.textContent=error??`Plot ${col+1}, ${row+1} · ${existing?"Release to relocate":"Drop or tap to build"}`;
   if(x!==undefined&&y!==undefined)lastPointer={x,y};
   if(lastPointer){const {x,y}=lastPointer;const rect=canvas.getBoundingClientRect(),width=tooltip.offsetWidth,height=tooltip.offsetHeight;
    const dock=container?.parentElement?.querySelector(`.${styles.camera}`)?.getBoundingClientRect();
    const rightLimit=dock?dock.left-rect.left-12:rect.width-8;
    // Reserve the camera dock's entire column: carried-item labels never cover controls.
    const left=Math.max(8,Math.min(rightLimit-width,x-rect.left+20));
    tooltip.style.left=`${left}px`;tooltip.style.top=`${Math.max(84,Math.min(rect.height-height-8,y-rect.top-height-18))}px`;}
   else {tooltip.style.left="14px";tooltip.style.top="90px";}
  }
  const pointerDown=(event:PointerEvent)=>{if(event.button!==0)return;down={x:event.clientX,y:event.clientY};const id=projectAt(event.clientX,event.clientY);if(id!==null&&live.current.mode!=="remove"){drag={id,x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);orbit.enabled=false;}};
  const pointerMove=(event:PointerEvent)=>{const cell=locate(event.clientX,event.clientY);if(cell)hover(cell.col,cell.row,undefined,event.clientX,event.clientY);else hidePreview();};
  const pointerUp=(event:PointerEvent)=>{const p=live.current,cell=locate(event.clientX,event.clientY),moved=down?Math.hypot(event.clientX-down.x,event.clientY-down.y)>5:false;if(drag&&cell&&moved)p.onEdit({type:"move",id:drag.id,...cell});else if(down&&!moved&&cell){const id=projectAt(event.clientX,event.clientY);if(p.mode==="remove"&&id!==null)p.onEdit({type:"remove",id});else if(id===null&&p.selected&&p.mode==="build")p.onEdit({type:"place",tool:p.selected,...cell});else if(id!==null)p.onNotice("Drag this project to move it, or choose Remove to demolish it.");}drag=null;down=null;orbit.enabled=true;hidePreview();};
  const cancel=()=>{drag=null;down=null;orbit.enabled=true;hidePreview();};
  const dragOver=(event:DragEvent)=>{event.preventDefault();const cell=locate(event.clientX,event.clientY);if(cell)hover(cell.col,cell.row,undefined,event.clientX,event.clientY);else hidePreview();};
  const drop=(event:DragEvent)=>{event.preventDefault();api.current.drop(event.dataTransfer?.getData("text/learnerkits-project")||live.current.selected||"",event.clientX,event.clientY);};
  const keyDown=(event:KeyboardEvent)=>{const p=live.current;if(event.key==="Escape"){cancel();return;}if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Delete","Backspace"].includes(event.key))event.preventDefault();if(event.key==="ArrowLeft")focus.col=Math.max(0,focus.col-1);if(event.key==="ArrowRight")focus.col=Math.min(MAP_SIZE-1,focus.col+1);if(event.key==="ArrowUp")focus.row=Math.max(0,focus.row-1);if(event.key==="ArrowDown")focus.row=Math.min(MAP_SIZE-1,focus.row+1);if(event.key==="Enter"&&p.selected)p.onEdit({type:"place",tool:p.selected,...focus});if(event.key==="Delete"||event.key==="Backspace"){const existing=p.state.placements.find(item=>item.col===focus.col&&item.row===focus.row);if(existing)p.onEdit({type:"remove",id:existing.id});}hover(focus.col,focus.row);if(event.key.startsWith("Arrow"))p.onNotice(`Plot ${focus.col+1}, ${focus.row+1}: ${cellZone(focus.col,focus.row)}. Enter to place.`);};
  canvas.addEventListener("pointerdown",pointerDown);canvas.addEventListener("pointermove",pointerMove);canvas.addEventListener("pointerup",pointerUp);canvas.addEventListener("pointercancel",cancel);canvas.addEventListener("dragover",dragOver);canvas.addEventListener("drop",drop);canvas.addEventListener("keydown",keyDown);canvas.addEventListener("pointerleave",()=>{if(!drag)hidePreview();});
  api.current={preview:(tool,x,y)=>{const cell=locate(x,y);if(cell)hover(cell.col,cell.row,tool,x,y);else hidePreview();},cancel,
   drop:(tool,x,y)=>{const cell=locate(x,y);if(cell&&tool)live.current.onEdit({type:"place",tool,...cell});else live.current.onNotice("Drop cancelled. Drag onto a highlighted plot inside the city.");hidePreview();},rotate:direction=>{const angle=direction*Math.PI/6,pos=camera.position.clone();camera.position.x=pos.x*Math.cos(angle)-pos.z*Math.sin(angle);camera.position.z=pos.x*Math.sin(angle)+pos.z*Math.cos(angle);orbit.update();},zoom:direction=>{camera.zoom=THREE.MathUtils.clamp(camera.zoom*(direction>0?1.2:1/1.2),.7,2.4);camera.updateProjectionMatrix();},reset:()=>{orbit.reset();camera.zoom=1;camera.updateProjectionMatrix();}};
  const resize=()=>{const width=container.clientWidth,height=container.clientHeight;if(!width||!height)return;const aspect=width/height,half=Math.max(13.8,20/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(width,height);};const observer=new ResizeObserver(resize);observer.observe(container);resize();
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function render(now:number){if(disposed)return;frame=requestAnimationFrame(render);if(document.hidden||now-last<30)return;const dt=Math.min(.1,(now-last)/1000);last=now;const p=live.current;
   const baseValues={...p.state.values};for(const item of p.state.placements){const tool=buildTools[p.slug].find(t=>t.id===item.tool)!;baseValues[tool.key]-=tool.delta;}const nextReference=JSON.stringify(baseValues);
   if(p.state.placements!==placedRef||referenceKey!==nextReference){projects.clear();reference.clear();rotors.length=0;batteryFills.length=0;const slots=[[4,1],[5,1],[4,9],[5,9]];startingAssets[p.slug].forEach(([kind,key],i)=>{if(baseValues[key]<=0)return;const object=asset(kind);object.position.set(slots[i][0]*CELL-offset,.18,slots[i][1]*CELL-offset);reference.add(object);});referenceKey=nextReference;for(const item of p.state.placements){const tool=buildTools[p.slug].find(t=>t.id===item.tool)!;const object=asset(tool.kind);object.position.set(item.col*CELL-offset,item.col<3?.0:.18,item.row*CELL-offset);object.userData.placementId=item.id;projects.add(object);}placedRef=p.state.placements;}
   if(p.running&&!reduce)animation+=dt;for(const rotor of rotors)rotor.rotation.z=animation*1.5;for(const fill of batteryFills){const ratio=Math.max(.025,Math.min(1,(p.sample.soc??0)/Math.max(1,p.state.values.storage??100)));fill.scale.y=ratio;fill.position.y=.18+.21*ratio;}
   cars.forEach((car,i)=>{car.position.x=3*CELL-offset+((animation*(i%2?-.8:.7)+i*4.1+200)%((MAP_SIZE-3)*CELL));car.position.z=(i<3?5.5:11)*CELL-offset+(i%2?-.38:.38);});boat.position.z=3+Math.sin(animation*.1)*4;
   const coastal=p.slug==="sea-level-rise-simulator"?(p.sample.total??0)*.75:0;water.position.y=-.06+coastal;
   const warmth=p.slug==="urban-heat-island-simulator"?(p.sample.anomaly??0)/10:0;sun.color.set(warmth>.2?"#ffdfb4":"#f1f6ff");
   const rainRate=p.sample.rainRate??0;rain.visible=rainRate>.1;rainGeometry.setDrawRange(0,Math.min(180,Math.round(rainRate*3))*2);if(rain.visible){for(let i=0;i<180;i++){const x=-offset+(i*7.31)%(SPAN-1),z=-offset+(i*5.17)%(SPAN-1),y=.3+(i*.731-animation*5+1000)%5;rainPositions.set([x,y,z,x+.07,y+.45,z],i*6);}rainGeometry.attributes.position.needsUpdate=true;}
   flood.visible=p.slug==="climate-resilience-city-builder"&&(p.sample.ponding??0)>.1;flood.position.y=.20+Math.min(.4,(p.sample.ponding??0)*.005);
   hazeMaterial.opacity=p.slug==="air-pollution-smog-simulator"?Math.min(.24,(p.sample.pm??0)/500):0;
   if(p.slug==="deforestation-water-cycle-simulator")water.position.y=-.06+Math.min(.12,(p.sample.runoff??0)*.002);
   const moving=drag?p.state.placements.find(item=>item.id===drag!.id):null,selectedTool=buildTools[p.slug].find(t=>t.id===(moving?.tool??previewTool??p.selected));
   const nextTargets=JSON.stringify([p.mode,selectedTool?.id,p.state.placements,p.state.values,drag?.id]);
   if(nextTargets!==targetKey){targets.count=0;if(selectedTool&&(p.mode==="build"||drag))for(let col=0;col<MAP_SIZE;col++)for(let row=0;row<MAP_SIZE;row++){if(!buildProblem(p.slug,p.state,selectedTool,col,row,drag?.id)){matrix.makeTranslation(col*CELL-offset,col<3?.07:.215,row*CELL-offset);targets.setMatrixAt(targets.count++,matrix);}}targets.instanceMatrix.needsUpdate=true;targets.computeBoundingSphere();targetKey=nextTargets;if(hovering)hover(focus.col,focus.row,selectedTool?.id);}
   if(!selectedTool&&hovering)hidePreview();
   grid.visible=p.mode==="build"||p.mode==="remove";orbit.update();renderer.render(scene,camera);
  }
  frame=requestAnimationFrame(render);setReady(true);
  const contextLost=(event:Event)=>{event.preventDefault();if(!disposed){cancelAnimationFrame(frame);setFailed(true);}};canvas.addEventListener("webglcontextlost",contextLost);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();orbit.dispose();for(const g of geometries.values())g.dispose();for(const m of materials.values())m.dispose();mergedGeometry.forEach(g=>g.dispose());carriedMaterials.forEach(m=>m.dispose());targetGeometry.dispose();targetMaterial.dispose();tooltip.remove();waterGeometry.dispose();waterMaterial.dispose();rainGeometry.dispose();rainMaterial.dispose();floodGeometry.dispose();floodMaterial.dispose();hazeGeometry.dispose();hazeMaterial.dispose();grid.geometry.dispose();gm.dispose();(ghost.material as THREE.Material).dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();api.current={preview:()=>{},cancel:()=>{},drop:()=>{},rotate:()=>{},zoom:()=>{},reset:()=>{}};};
 },[props.slug]);
 return <div className={styles.world} ref={host}>{!ready&&!failed&&<div className={styles.worldLoading}>Preparing your environmental world…</div>}{failed&&<div className={styles.worldFallback}><strong>3D view is unavailable on this device.</strong><p>You can still build using the accessible plot controls and open the graphs.</p></div>}</div>;
});
