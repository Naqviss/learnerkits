"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { buildTools, cellZone, MAP_SIZE, placementProblem, reservedCells, type AssetKind, type BuildState, type editBuild } from "@/lib/simulations/environmentalLabs/builder";
import type { Sample } from "@/lib/simulations/environmentalLabs/engine";
import styles from "./environmental.module.css";
type Action=Parameters<typeof editBuild>[2];
export type WorldHandle={drop:(tool:string,x:number,y:number)=>void;rotate:(direction:number)=>void;zoom:(direction:number)=>void;reset:()=>void};
type Props={slug:string;state:BuildState;sample:Sample;running:boolean;selected:string|null;mode:"build"|"move"|"remove";onEdit:(action:Action)=>void;onNotice:(text:string)=>void};
const CELL=1.6,offset=(MAP_SIZE-1)*CELL/2;
export const EnvironmentalWorld=forwardRef<WorldHandle,Props>(function EnvironmentalWorld(props,ref){
 const host=useRef<HTMLDivElement>(null),live=useRef(props);live.current=props;
 const api=useRef<WorldHandle>({drop:()=>{},rotate:()=>{},zoom:()=>{},reset:()=>{}});
 useImperativeHandle(ref,()=>({drop:(...args)=>api.current.drop(...args),rotate:d=>api.current.rotate(d),zoom:d=>api.current.zoom(d),reset:()=>api.current.reset()}),[]);
 const [failed,setFailed]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{
  const container=host.current;if(!container)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
  const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute("role","application");canvas.setAttribute("aria-label","Interactive city map. Arrow keys choose a plot; Enter places the selected project; Delete removes a placed project. Drag projects to move them.");container.appendChild(canvas);
  const scene=new THREE.Scene();scene.background=new THREE.Color("#cbdedb");scene.fog=new THREE.Fog("#cbdedb",65,115);
  const camera=new THREE.OrthographicCamera(-20,20,15,-15,.1,150);camera.position.set(26,27,30);
  const orbit=new OrbitControls(camera,canvas);orbit.target.set(0,0,0);orbit.enableDamping=true;orbit.enableRotate=false;orbit.enablePan=false;orbit.minZoom=.7;orbit.maxZoom=2.4;orbit.update();orbit.saveState();
  const hemi=new THREE.HemisphereLight("#e8f5ff","#718568",2.4);scene.add(hemi);
  const sun=new THREE.DirectionalLight("#fff2d8",3.6);sun.position.set(-12,25,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-17;sun.shadow.camera.right=17;sun.shadow.camera.top=17;sun.shadow.camera.bottom=-17;sun.shadow.normalBias=.04;sun.shadow.bias=-.0002;scene.add(sun);
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
  const ground=new THREE.Group();scene.add(ground);box(ground,19.5,.55,19.5,0,-.43,0,"#8c9380");box(ground,19.65,.22,19.65,0,-.81,0,"#68796e");
  for(let col=0;col<12;col++)for(let row=0;row<12;row++){
   const x=col*CELL-offset,z=row*CELL-offset,water=col<3,road=(row===5||row===6)&&!water;
   if(!water)box(ground,1.595,.34,1.595,x,.0,z,road?"#8d9890":["#9db47b","#a3b981","#98ae78"][(col*7+row*3)%3]);
   if(road&&row===5)box(ground,.7,.012,.045,x,.18,z+.77,"#e3e2bd");
  }
  const waterGeometry=new THREE.PlaneGeometry(19.2,19.2,1,1),waterMaterial=new THREE.MeshStandardMaterial({color:"#65aaa9",roughness:.28,metalness:.15,transparent:true,opacity:.9});const water=new THREE.Mesh(waterGeometry,waterMaterial);water.rotation.x=-Math.PI/2;water.position.set(0,-.06,0);water.receiveShadow=true;scene.add(water);
  for(let i=0;i<25;i++){const mesh=box(ground,.25+(i%3)*.16,.015,.022,-9+(i*1.7)%4.1,.0,-9+(i*3.17)%18,"#a6d2c3");mesh.userData.wave=true;}
  for(const key of [...reservedCells].filter(key=>!["4,1","5,1","4,9","5,9"].includes(key))){const [col,row]=key.split(",").map(Number),g=new THREE.Group();g.position.set(col*CELL-offset,.18,row*CELL-offset);house(g,.8+((col+row)%3)*.5,["#867c6b","#8f6c55","#768e81"][col%3]);scene.add(g);}
  for(const [col,row] of [[3,0],[4,0],[5,0],[10,0],[11,1],[11,10],[10,11],[4,11],[3,10]]){const g=new THREE.Group();g.position.set(col*CELL-offset,.18,row*CELL-offset);tree(g,.1,-.1,.7);tree(g,-.35,.3,.55);ground.add(g);}
  const boat=new THREE.Group();box(boat,.52,.18,1.4,0,0,0,"#e7e1c6");box(boat,.35,.27,.5,0,.2,-.15,"#859f9b");boat.position.set(-7.1,.04,3);scene.add(boat);
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
  const floodGeometry=new THREE.PlaneGeometry(14.4,3.2),floodMaterial=new THREE.MeshStandardMaterial({color:"#76b7b9",transparent:true,opacity:.7,roughness:.28});const flood=new THREE.Mesh(floodGeometry,floodMaterial);flood.rotation.x=-Math.PI/2;flood.position.set(2.4,.21,0);flood.visible=false;scene.add(flood);
  const hazeGeometry=new THREE.BoxGeometry(18,2.6,18),hazeMaterial=new THREE.MeshBasicMaterial({color:"#c3ad8d",transparent:true,opacity:0,depthWrite:false});const haze=new THREE.Mesh(hazeGeometry,hazeMaterial);haze.position.y=1.3;scene.add(haze);
  const grid=new THREE.GridHelper(19.2,12,"#ebf0ca","#d3deb0");grid.position.y=.192;const gm=grid.material as THREE.Material;gm.transparent=true;gm.opacity=.22;scene.add(grid);
  const ghost=box(scene,1.5,.035,1.5,0,.22,0,"#88dfb4");(ghost.material as THREE.MeshStandardMaterial)=new THREE.MeshStandardMaterial({color:"#70d5a4",transparent:true,opacity:.55,depthWrite:false});ghost.visible=false;
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.18);
  let focus={col:4,row:4},drag:{id:number;x:number;y:number}|null=null,down:{x:number;y:number}|null=null,frame=0,last=performance.now(),animation=0,disposed=false;
  function locate(x:number,y:number){const rect=canvas.getBoundingClientRect();if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)return null;pointer.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const point=ray.ray.intersectPlane(plane,new THREE.Vector3());return point?{col:Math.round((point.x+offset)/CELL),row:Math.round((point.z+offset)/CELL)}:null;}
  function projectAt(x:number,y:number){locate(x,y);const hits=ray.intersectObjects(projects.children,true);for(const hit of hits){let obj:THREE.Object3D|null=hit.object;while(obj&&obj!==projects){if(typeof obj.userData.placementId==="number")return obj.userData.placementId as number;obj=obj.parent;}}return null;}
  function hover(col:number,row:number,toolId?:string){focus={col,row};const p=live.current,existing=drag?p.state.placements.find(item=>item.id===drag!.id):null,tool=buildTools[p.slug].find(t=>t.id===(toolId??existing?.tool??p.selected));ghost.position.set(col*CELL-offset,.22,row*CELL-offset);ghost.visible=col>=0&&col<12&&row>=0&&row<12;if(tool)(ghost.material as THREE.MeshStandardMaterial).color.set(placementProblem(p.state,tool,col,row,drag?.id)?"#e2a38b":"#8be0aa");}
  const pointerDown=(event:PointerEvent)=>{if(event.button!==0)return;down={x:event.clientX,y:event.clientY};const id=projectAt(event.clientX,event.clientY);if(id!==null&&live.current.mode!=="remove"){drag={id,x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);orbit.enabled=false;}};
  const pointerMove=(event:PointerEvent)=>{const cell=locate(event.clientX,event.clientY);if(cell)hover(cell.col,cell.row);};
  const pointerUp=(event:PointerEvent)=>{const p=live.current,cell=locate(event.clientX,event.clientY),moved=down?Math.hypot(event.clientX-down.x,event.clientY-down.y)>5:false;if(drag&&cell&&moved)p.onEdit({type:"move",id:drag.id,...cell});else if(down&&!moved&&cell){const id=projectAt(event.clientX,event.clientY);if(p.mode==="remove"&&id!==null)p.onEdit({type:"remove",id});else if(id===null&&p.selected&&p.mode==="build")p.onEdit({type:"place",tool:p.selected,...cell});else if(id!==null)p.onNotice("Drag this project to move it, or choose Remove to demolish it.");}drag=null;down=null;orbit.enabled=true;};
  const cancel=()=>{drag=null;down=null;orbit.enabled=true;ghost.visible=false;};
  const dragOver=(event:DragEvent)=>{event.preventDefault();const cell=locate(event.clientX,event.clientY);if(cell)hover(cell.col,cell.row);};
  const drop=(event:DragEvent)=>{event.preventDefault();api.current.drop(event.dataTransfer?.getData("text/learnerkits-project")||live.current.selected||"",event.clientX,event.clientY);};
  const keyDown=(event:KeyboardEvent)=>{const p=live.current;if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Delete","Backspace"].includes(event.key))event.preventDefault();if(event.key==="ArrowLeft")focus.col=Math.max(0,focus.col-1);if(event.key==="ArrowRight")focus.col=Math.min(11,focus.col+1);if(event.key==="ArrowUp")focus.row=Math.max(0,focus.row-1);if(event.key==="ArrowDown")focus.row=Math.min(11,focus.row+1);if(event.key==="Enter"&&p.selected)p.onEdit({type:"place",tool:p.selected,...focus});if(event.key==="Delete"||event.key==="Backspace"){const existing=p.state.placements.find(item=>item.col===focus.col&&item.row===focus.row);if(existing)p.onEdit({type:"remove",id:existing.id});}hover(focus.col,focus.row);if(event.key.startsWith("Arrow"))p.onNotice(`Plot ${focus.col+1}, ${focus.row+1}: ${cellZone(focus.col,focus.row)}. Enter to place.`);};
  canvas.addEventListener("pointerdown",pointerDown);canvas.addEventListener("pointermove",pointerMove);canvas.addEventListener("pointerup",pointerUp);canvas.addEventListener("pointercancel",cancel);canvas.addEventListener("dragover",dragOver);canvas.addEventListener("drop",drop);canvas.addEventListener("keydown",keyDown);canvas.addEventListener("pointerleave",()=>{if(!drag)ghost.visible=false;});
  api.current={drop:(tool,x,y)=>{const cell=locate(x,y);if(cell&&tool)live.current.onEdit({type:"place",tool,...cell});},rotate:direction=>{const angle=direction*Math.PI/6,pos=camera.position.clone();camera.position.x=pos.x*Math.cos(angle)-pos.z*Math.sin(angle);camera.position.z=pos.x*Math.sin(angle)+pos.z*Math.cos(angle);orbit.update();},zoom:direction=>{camera.zoom=THREE.MathUtils.clamp(camera.zoom*(direction>0?1.2:1/1.2),.7,2.4);camera.updateProjectionMatrix();},reset:()=>{orbit.reset();camera.zoom=1;camera.updateProjectionMatrix();}};
  const resize=()=>{const width=container.clientWidth,height=container.clientHeight;if(!width||!height)return;const aspect=width/height,half=Math.max(11.5,15.6/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(width,height);};const observer=new ResizeObserver(resize);observer.observe(container);resize();
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function render(now:number){if(disposed)return;frame=requestAnimationFrame(render);if(document.hidden||now-last<30)return;const dt=Math.min(.1,(now-last)/1000);last=now;const p=live.current;
   const baseValues={...p.state.values};for(const item of p.state.placements){const tool=buildTools[p.slug].find(t=>t.id===item.tool)!;baseValues[tool.key]-=tool.delta;}const nextReference=JSON.stringify(baseValues);
   if(p.state.placements!==placedRef||referenceKey!==nextReference){projects.clear();reference.clear();rotors.length=0;batteryFills.length=0;const slots=[[4,1],[5,1],[4,9],[5,9]];startingAssets[p.slug].forEach(([kind,key],i)=>{if(baseValues[key]<=0)return;const object=asset(kind);object.position.set(slots[i][0]*CELL-offset,.18,slots[i][1]*CELL-offset);reference.add(object);});referenceKey=nextReference;for(const item of p.state.placements){const tool=buildTools[p.slug].find(t=>t.id===item.tool)!;const object=asset(tool.kind);object.position.set(item.col*CELL-offset,item.col<3?.0:.18,item.row*CELL-offset);object.userData.placementId=item.id;projects.add(object);}placedRef=p.state.placements;}
   if(p.running&&!reduce)animation+=dt;for(const rotor of rotors)rotor.rotation.z=animation*1.5;for(const fill of batteryFills){const ratio=Math.max(.025,Math.min(1,(p.sample.soc??0)/Math.max(1,p.state.values.storage??100)));fill.scale.y=ratio;fill.position.y=.18+.21*ratio;}
   cars.forEach((car,i)=>{car.position.x=((animation*(i%2?-.8:.7)+i*4.1+200)%14)-4.5;car.position.z=i%2?-.48:.48;});boat.position.z=3+Math.sin(animation*.1)*4;
   const coastal=p.slug==="sea-level-rise-simulator"?(p.sample.total??0)*.75:0;water.position.y=-.06+coastal;
   const warmth=p.slug==="urban-heat-island-simulator"?(p.sample.anomaly??0)/10:0;sun.color.set(warmth>.2?"#ffdfb4":"#fff2d8");
   const rainRate=p.sample.rainRate??0;rain.visible=rainRate>.1;rainGeometry.setDrawRange(0,Math.min(180,Math.round(rainRate*3))*2);if(rain.visible){for(let i=0;i<180;i++){const x=-8+(i*7.31)%16,z=-8+(i*5.17)%16,y=.3+(i*.731-animation*5+1000)%5;rainPositions.set([x,y,z,x+.07,y+.45,z],i*6);}rainGeometry.attributes.position.needsUpdate=true;}
   flood.visible=p.slug==="climate-resilience-city-builder"&&(p.sample.ponding??0)>.1;flood.position.y=.20+Math.min(.4,(p.sample.ponding??0)*.005);
   hazeMaterial.opacity=p.slug==="air-pollution-smog-simulator"?Math.min(.24,(p.sample.pm??0)/500):0;
   if(p.slug==="deforestation-water-cycle-simulator")water.position.y=-.06+Math.min(.12,(p.sample.runoff??0)*.002);
   grid.visible=p.mode==="build"||p.mode==="remove";orbit.update();renderer.render(scene,camera);
  }
  frame=requestAnimationFrame(render);setReady(true);
  const contextLost=(event:Event)=>{event.preventDefault();if(!disposed){cancelAnimationFrame(frame);setFailed(true);}};canvas.addEventListener("webglcontextlost",contextLost);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();orbit.dispose();for(const g of geometries.values())g.dispose();for(const m of materials.values())m.dispose();waterGeometry.dispose();waterMaterial.dispose();rainGeometry.dispose();rainMaterial.dispose();floodGeometry.dispose();floodMaterial.dispose();hazeGeometry.dispose();hazeMaterial.dispose();grid.geometry.dispose();gm.dispose();(ghost.material as THREE.Material).dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();api.current={drop:()=>{},rotate:()=>{},zoom:()=>{},reset:()=>{}};};
 },[props.slug]);
 return <div className={styles.world} ref={host}>{!ready&&!failed&&<div className={styles.worldLoading}>Preparing your environmental world…</div>}{failed&&<div className={styles.worldFallback}><strong>3D view is unavailable on this device.</strong><p>You can still build using the accessible plot controls and open the graphs.</p></div>}</div>;
});
