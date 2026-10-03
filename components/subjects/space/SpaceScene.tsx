"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { blackHole, flybyTrace, sampleTrajectory, kepler, orbitTrace, orbital, planets, rad, type MarsState, type Values } from "@/lib/simulations/spaceLabs/model";
import { loadSettings, renderProfile } from "@/lib/settings/storage";

export function SpaceScene({slug,values,time,mars}:{slug:string;values:Values;time:number;mars:MarsState}){
  const host=useRef<HTMLDivElement>(null),live=useRef({values,time,mars});live.current={values,time,mars};const orbit=useRef<OrbitControls|null>(null);
  const cameraRef=useRef<THREE.PerspectiveCamera|null>(null),rendererRef=useRef<THREE.WebGLRenderer|null>(null);
  const [failed,setFailed]=useState(false),[cameraMode,setCameraMode]=useState("perspective");const view=useRef<{position:THREE.Vector3;target:THREE.Vector3}|null>(null);
  const design=slug==="mars-landing-challenge"?slug:JSON.stringify(values);
  useEffect(()=>{
    const container=host.current;if(!container)return;let renderer:THREE.WebGLRenderer;
    try{renderer=rendererRef.current??new THREE.WebGLRenderer({antialias:true,alpha:true});rendererRef.current=renderer;}catch{setFailed(true);return;}
    const profile=renderProfile(loadSettings().quality);renderer.setPixelRatio(Math.min(devicePixelRatio,profile.pixelRatioCap));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;container.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,1,.1,200);camera.position.set(0,7,17);cameraRef.current=camera;
    const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableZoom=true;controls.minDistance=3;controls.maxDistance=40;controls.zoomSpeed=.7;controls.rotateSpeed=.65;controls.enableDamping=true;controls.target.set(0,0,0);controls.saveState();if(view.current){camera.position.copy(view.current.position);controls.target.copy(view.current.target);}orbit.current=controls;
    const focus=()=>container.closest("main")?.focus({preventScroll:true});renderer.domElement.addEventListener("pointerdown",focus);
    const ambient=new THREE.AmbientLight(0x95a7c5,.22);scene.add(ambient);const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(12,3,4);scene.add(sun);
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();let alive=true;
    function mesh(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D=scene){geometries.add(g);materials.add(m);const o=new THREE.Mesh(g,m);parent.add(o);return o;}
    const sphere=new THREE.SphereGeometry(1,64,48);geometries.add(sphere);
    const loader=new THREE.TextureLoader();
    function texture(path:string){const tex=loader.load(path,loaded=>{if(!alive)loaded.dispose();});tex.colorSpace=THREE.SRGBColorSpace;textures.add(tex);return tex;}
    function body(radius:number,color:number,map?:string,parent:THREE.Object3D=scene){
      const mat=new THREE.MeshStandardMaterial({color:map?0xffffff:color,roughness:.86});
      const o=mesh(sphere,mat,parent);o.scale.setScalar(radius);
      if(map)mat.map=texture(map);
      if(map==="/textures/earth-day.jpg"){
        mat.normalMap=texture("/textures/earth-normal.jpg");mat.normalMap.colorSpace=THREE.NoColorSpace;mat.normalScale.set(.35,.35);
        const clouds=mesh(sphere,new THREE.MeshStandardMaterial({map:texture("/textures/earth-clouds.png"),transparent:true,opacity:.6,depthWrite:false}),o);clouds.scale.setScalar(1.008);
        const atmosphere=mesh(sphere,new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,
          vertexShader:"varying vec3 n; varying vec3 eye; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal); eye=normalize(-p.xyz); gl_Position=projectionMatrix*p; }",
          fragmentShader:"varying vec3 n; varying vec3 eye; void main(){ float rim=pow(1.0-abs(dot(normalize(n),normalize(eye))),3.0); gl_FragColor=vec4(0.15,0.48,1.0,rim*0.5); }"}),o);atmosphere.scale.setScalar(1.035);
      }
      if(!map){
        // Deterministic illustrative cloud bands / rocky albedo; no remote assets.
        const canvas=document.createElement("canvas");canvas.width=512;canvas.height=256;
        const ctx=canvas.getContext("2d");if(ctx){
          const base=new THREE.Color(color),gasGiant=[0xd6b590,0xe0cba0,0x9ecbd8,0x587fde].includes(color);
          for(let y=0;y<256;y++){
            const band=gasGiant?.82+.13*Math.sin(y*.19)+.05*Math.sin(y*.57):.95+.04*Math.sin(y*.04);
            ctx.fillStyle=`rgb(${Math.round(base.r*255*band)},${Math.round(base.g*255*band)},${Math.round(base.b*255*band)})`;ctx.fillRect(0,y,512,1);
          }
          for(let i=0;i<400;i++){ctx.fillStyle=i%2?"#ffffff09":"#0000000c";ctx.beginPath();ctx.ellipse((i*137.5)%512,(i*71.3)%256,3+i%12,1+i%3,0,0,Math.PI*2);ctx.fill();}
          const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;textures.add(tex);mat.map=tex;mat.color.set(0xffffff);
        }
      }
      return o;
    }
    function spacecraft(parent:THREE.Object3D=scene){
      const craft=new THREE.Group();parent.add(craft);
      mesh(new THREE.BoxGeometry(.16,.16,.24),new THREE.MeshStandardMaterial({color:0xe8d2a0,metalness:.65,roughness:.3}),craft);
      for(const side of [-1,1]){const panel=mesh(new THREE.BoxGeometry(.3,.018,.23),new THREE.MeshStandardMaterial({color:0x2567a9,metalness:.65,roughness:.25}),craft);panel.position.x=side*.25;}
      const antenna=mesh(new THREE.ConeGeometry(.08,.06,16),new THREE.MeshStandardMaterial({color:0xe7eff9,metalness:.6,roughness:.35}),craft);antenna.position.y=.14;
      return craft;
    }
    function line(points:THREE.Vector3[],color=0x81a9e9,parent:THREE.Object3D=scene){const g=new THREE.BufferGeometry().setFromPoints(points),m=new THREE.LineBasicMaterial({color,transparent:true,opacity:.7});geometries.add(g);materials.add(m);const l=new THREE.Line(g,m);parent.add(l);return l;}
    function ring(radius:number,color:number,parent:THREE.Object3D=scene){return line(Array.from({length:181},(_,i)=>new THREE.Vector3(radius*Math.cos(i*Math.PI/90),0,radius*Math.sin(i*Math.PI/90))),color,parent);}
    function rod(a:THREE.Vector3,b:THREE.Vector3,r:number,color:number,parent:THREE.Object3D=scene){const o=mesh(new THREE.CylinderGeometry(r,r,a.distanceTo(b),12),new THREE.MeshStandardMaterial({color,metalness:.45,roughness:.4}),parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());return o;}
    const starPoints:number[]=[];for(let i=0;i<profile.starCount;i++){const a=i*2.39996,z=1-2*(i+.5)/profile.starCount,r=Math.sqrt(1-z*z);starPoints.push(60*r*Math.cos(a),60*z,60*r*Math.sin(a));}const starsG=new THREE.BufferGeometry();starsG.setAttribute("position",new THREE.Float32BufferAttribute(starPoints,3));geometries.add(starsG);const starsM=new THREE.PointsMaterial({color:0xc5d6ef,size:.12,transparent:true,opacity:.85});materials.add(starsM);scene.add(new THREE.Points(starsG,starsM));
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
      const satellite=slug==="satellite-orbit-builder",v=live.current.values,o=orbital(v,satellite),trace=orbitTrace(v,satellite);const extent=Math.max(...trace.points.map(p=>Math.hypot(p.x,p.y))),scale=6/Math.max(1.4,extent);const system=new THREE.Group();scene.add(system);if(satellite)system.rotation.x=rad(v.inclination);
      body(o.world.radius/o.radius*scale,0xc88268,o.world.name==="Earth"?"/textures/earth-day.jpg":o.world.name==="Moon"?"/textures/moon.jpg":undefined,system);
      const points=trace.points.map(p=>new THREE.Vector3(p.x*scale,0,p.y*scale));const planned=line(points,0x52758c,system);planned.material.opacity=.35;
      const craft=spacecraft(system);const trail=line(points,0x69f5d3,system);trail.geometry.setDrawRange(0,1);
      const marker=mesh(sphere,new THREE.MeshBasicMaterial({color:trace.status==="Surface impact"?0xff795f:0x6af0d0}));marker.scale.setScalar(.065);system.add(marker);marker.position.copy(points[points.length-1]);
      update=()=>{
        const t=live.current.time/8,p=sampleTrajectory(trace.points,t);craft.position.set(p.x*scale,0,p.y*scale);
        const next=sampleTrajectory(trace.points,Math.min(1,t+.002));if(t<1)craft.lookAt(system.localToWorld(new THREE.Vector3(next.x*scale,0,next.y*scale)));
        const count=trace.points.findIndex(point=>point.t>=p.t);trail.geometry.setDrawRange(0,count<0?points.length:count+1);
      };
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
      update=()=>{const a=live.current.time*Math.PI/5*(8/v.radius)**1.5;probe.position.set(Math.cos(a)*scale*v.radius,0,Math.sin(a)*scale*v.radius);};
    }else if(slug==="gravity-slingshot"){
      const v=live.current.values,trace=flybyTrace(v),rp=6371+v.altitude,scale=.5;
      const points=trace.map(p=>new THREE.Vector3(p.x*scale,0,p.y*scale));
      body(6371/rp*scale,0xffffff,"/textures/earth-day.jpg");line(points,0x52758c);
      const craft=spacecraft(),trail=line(points,0x69f5d3);
      update=()=>{const t=live.current.time/8,p=sampleTrajectory(trace,t);craft.position.set(p.x*scale,0,p.y*scale);const next=sampleTrajectory(trace,Math.min(1,t+.002));if(t<1)craft.lookAt(next.x*scale,0,next.y*scale);trail.geometry.setDrawRange(0,Math.max(1,Math.ceil(t*(points.length-1))+1));};
    }else if(slug==="mars-landing-challenge"){
      ambient.intensity=.55;sun.position.set(-10,15,8);const ground=mesh(new THREE.PlaneGeometry(60,60,60,60),new THREE.MeshStandardMaterial({color:0x8c5b45,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-2.5;
      const terrain=ground.geometry.attributes.position;for(let i=0;i<terrain.count;i++){const x=terrain.getX(i),y=terrain.getY(i),distance=Math.hypot(x,y);terrain.setZ(i,distance<2?0:Math.sin(x*.8)*Math.cos(y*.65)*.35+Math.sin(x*.2+y*.3)*.45);}ground.geometry.computeVertexNormals();
      const pad=mesh(new THREE.CylinderGeometry(1.5,1.6,.05,48),new THREE.MeshStandardMaterial({color:0x3d4549,metalness:.4,roughness:.8}));pad.position.y=-2.47;const target=ring(1.15,0x7affd2);target.position.y=-2.43;
      scene.fog=new THREE.FogExp2(0x241913,.017);
      for(let i=0;i<25;i++){const r=mesh(new THREE.IcosahedronGeometry(.15+(i%4)*.08),new THREE.MeshStandardMaterial({color:0x674638,roughness:1}));r.position.set(Math.sin(i*2.4)*12,-2.4,Math.cos(i*1.7)*10);r.scale.y=.55;}
      const ship=new THREE.Group();scene.add(ship);mesh(new THREE.CylinderGeometry(.45,.68,.65,8),new THREE.MeshStandardMaterial({color:0xd4dce6,metalness:.55,roughness:.35}),ship);const cabin=mesh(sphere,new THREE.MeshStandardMaterial({color:0x8296b2,metalness:.6,roughness:.25}),ship);cabin.scale.set(.34,.3,.34);cabin.position.y=.5;
      for(const x of [-1,1])for(const z of [-1,1]){rod(new THREE.Vector3(x*.35,-.1,z*.35),new THREE.Vector3(x*.85,-.65,z*.85),.025,0xc4b795,ship);const foot=mesh(new THREE.CylinderGeometry(.13,.13,.05,12),new THREE.MeshStandardMaterial({color:0x657286}),ship);foot.position.set(x*.85,-.65,z*.85);}
      const flame=mesh(new THREE.ConeGeometry(.24,1.5,18),new THREE.MeshBasicMaterial({color:0xa4c9ff,transparent:true,opacity:.7}),ship);flame.rotation.z=Math.PI;
      update=()=>{const s=live.current.mars;ship.position.set(0,-1.82+s.altitude*.008,0);ship.rotation.z=s.status==="crashed"?.7:0;flame.visible=s.status==="flying"&&s.throttle>.01;flame.scale.y=s.throttle;flame.position.y=-.4-.75*s.throttle;};
    }
    const resize=()=>{renderer.setSize(container.clientWidth,container.clientHeight,false);camera.aspect=container.clientWidth/Math.max(1,container.clientHeight);camera.fov=2*Math.atan(Math.tan(Math.PI/8)/Math.min(1,Math.max(.4,camera.aspect)))*180/Math.PI;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(container);resize();let raf=0;const frame=()=>{update();controls.update();if(!document.hidden)renderer.render(scene,camera);raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
    return()=>{alive=false;view.current={position:camera.position.clone(),target:controls.target.clone()};cancelAnimationFrame(raf);ro.disconnect();controls.dispose();orbit.current=null;geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.domElement.removeEventListener("pointerdown",focus);};
  },[slug,design]);
  useEffect(()=>()=>{rendererRef.current?.dispose();rendererRef.current?.domElement.remove();rendererRef.current=null;},[]);
  function cameraView(mode:string){const c=cameraRef.current,o=orbit.current;if(!c||!o)return;setCameraMode(mode);o.target.set(0,0,0);c.position.set(0,mode==="top"?18:7,mode==="top"?.01:17);o.update();}
  function zoom(factor:number){const c=cameraRef.current,o=orbit.current;if(!c||!o)return;const offset=c.position.clone().sub(o.target);offset.setLength(Math.max(o.minDistance,Math.min(o.maxDistance,offset.length()*factor)));c.position.copy(o.target).add(offset);o.update();}
  return <div className="spaceThree"><div className="spaceCanvas" ref={host} role="img" aria-label={`${slug.replaceAll("-"," ")} 3D view`}/>{failed&&<p className="spaceFallback">3D is unavailable on this device. You can still use the controls, measurements, and mission checks.</p>}<div className="spaceCameraBar"><span>Drag to orbit · Scroll / pinch to zoom<br/><small>Illustrative overview scale</small></span><div><button aria-label="Zoom in" onClick={()=>zoom(.8)}>＋</button><button aria-label="Zoom out" onClick={()=>zoom(1.25)}>−</button><button aria-pressed={cameraMode==="top"} onClick={()=>cameraView(cameraMode==="top"?"perspective":"top")}>Top view</button><button onClick={()=>cameraView("perspective")}>Reset view</button></div></div></div>;
}
