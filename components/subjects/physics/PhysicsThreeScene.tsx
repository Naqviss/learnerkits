"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { bridge, collision, field, force, radians, ramp, type Values } from "@/lib/simulations/physicsLabs/model";
import { loadSettings, renderProfile } from "@/lib/settings/storage";

export function PhysicsThreeScene({slug,values,time,closed}:{slug:string;values:Values;time:number;closed:boolean}){
  const host=useRef<HTMLDivElement>(null),live=useRef({values,time,closed});live.current={values,time,closed};
  const controlsRef=useRef<OrbitControls|null>(null);const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const container=host.current;if(!container)return;
    let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);return;}
    const settings=loadSettings(),profile=renderProfile(settings.quality);
    renderer.setPixelRatio(Math.min(devicePixelRatio,profile.pixelRatioCap));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
    container.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(1,5,14);
    const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1,0);controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=true;controls.saveState();controlsRef.current=controls;
    scene.add(new THREE.HemisphereLight(0xe4edff,0x30343c,3));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-5,8,6);scene.add(key);const rim=new THREE.DirectionalLight(0x82a8ef,2);rim.position.set(4,3,-5);scene.add(rim);
    const steel=new THREE.MeshStandardMaterial({color:0x738299,metalness:.65,roughness:.3}),blue=new THREE.MeshStandardMaterial({color:0x548dee,metalness:.2,roughness:.28}),amber=new THREE.MeshStandardMaterial({color:0xe8b376,metalness:.25,roughness:.3}),dark=new THREE.MeshStandardMaterial({color:0x303b4a,roughness:.65});
    const materials=new Set<THREE.Material>([steel,blue,amber,dark]);const geometries=new Set<THREE.BufferGeometry>();
    function mesh(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D=scene){geometries.add(g);materials.add(m);const o=new THREE.Mesh(g,m);parent.add(o);return o;}
    const cylinder=new THREE.CylinderGeometry(1,1,1,12);geometries.add(cylinder);
    function rod(a:THREE.Vector3,b:THREE.Vector3,r:number,m:THREE.Material,parent:THREE.Object3D=scene){const o=mesh(cylinder,m,parent);setRod(o,a,b,r);return o;}
    function setRod(o:THREE.Mesh,a:THREE.Vector3,b:THREE.Vector3,r:number){o.position.copy(a).add(b).multiplyScalar(.5);o.scale.set(r,a.distanceTo(b),r);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());}
    const floor=mesh(new THREE.BoxGeometry(12,.12,5),dark);floor.position.y=-.25;
    const grid=new THREE.GridHelper(12,24,0x465267,0x303e50);grid.position.y=-.18;scene.add(grid);geometries.add(grid.geometry);(Array.isArray(grid.material)?grid.material:[grid.material]).forEach(m=>materials.add(m));
    let update:(v:Values,t:number,on:boolean)=>void=()=>{};
    function cart(mat:THREE.Material){const group=new THREE.Group();scene.add(group);const body=mesh(new THREE.BoxGeometry(1,.45,.85),mat,group);body.position.y=.28;for(const x of [-.32,.32])for(const z of [-.46,.46]){const wheel=mesh(new THREE.CylinderGeometry(.15,.15,.12,20),steel,group);wheel.rotation.x=Math.PI/2;wheel.position.set(x,0,z);}return group;}
    if(slug==="inclined-plane-friction"){
      const slope=new THREE.Group();scene.add(slope);mesh(new THREE.BoxGeometry(6,.16,1.8),steel,slope);const block=mesh(new THREE.BoxGeometry(.65,.65,.85),blue,slope);
      const support=mesh(new THREE.BoxGeometry(.18,1,1.5),dark);
      update=(v,t)=>{const a=radians(v.angle),r=ramp(v),s=Math.min(6,.5*r.acceleration*t*t);slope.rotation.z=-a;slope.position.y=3*Math.sin(a)+.25;block.position.set(-3+s,.42,0);support.scale.y=6*Math.sin(a)+.15;support.position.set(-3*Math.cos(a),support.scale.y/2-.1,0);block.material=r.sliding?blue:amber;};
    }else if(slug==="momentum-collision"){
      const a=cart(blue),b=cart(amber);rod(new THREE.Vector3(-6,-.02,-.35),new THREE.Vector3(6,-.02,-.35),.035,steel);rod(new THREE.Vector3(-6,-.02,.35),new THREE.Vector3(6,-.02,.35),.035,steel);
      update=(v,t)=>{const c=collision(v),before=Math.min(t,c.at),after=Math.max(0,t-c.at),center=-2+v.speedA*c.at;const ax=t<c.at?-2+v.speedA*before:center+c.speedA*after,bx=t<c.at?2+v.speedB*before:center+c.speedB*after;a.position.set(ax-.5,.04,0);b.position.set(bx+.5,.04,0);a.scale.y=.75+v.massA*.12;b.scale.y=.75+v.massB*.12;};
    }else if(slug==="newtons-laws-force-lab"){
      const c=cart(blue);const arrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),2,0x84b5ff,.25,.15);scene.add(arrow);const resistance=new THREE.ArrowHelper(new THREE.Vector3(-1,0,0),new THREE.Vector3(),1,0xefb57b,.2,.12);scene.add(resistance);
      [arrow,resistance].forEach(a=>a.traverse(o=>{if(o instanceof THREE.Line||o instanceof THREE.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}}));
      update=(v,t)=>{const f=force(v),distance=.5*f.acceleration*t*t,scale=8/Math.max(8,.5*f.acceleration*25);c.position.set(-4+distance*scale,.02,0);arrow.position.copy(c.position).add(new THREE.Vector3(.6,.6,0));arrow.setLength(Math.max(.01,v.force/25),.2,.12);resistance.position.copy(c.position).add(new THREE.Vector3(-.6,.6,0));resistance.setLength(Math.max(.01,Math.min(v.resistance,v.force)/25),.2,.12);arrow.visible=v.force>0;resistance.visible=Math.min(v.resistance,v.force)>0;};
    }else if(slug==="electromagnet-3d"){
      const winding=new THREE.Group();scene.add(winding);winding.position.y=1.3;
      const points=Array.from({length:1001},(_,i)=>{const u=i/1000;return new THREE.Vector3((u-.5)*6,Math.sin(u*Math.PI*40)*.8,Math.cos(u*Math.PI*40)*.8);});
      const copper=new THREE.MeshStandardMaterial({color:0xbd865e,metalness:.7,roughness:.28});mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),1000,.05,8,false),copper,winding);
      const lines=new THREE.Group();scene.add(lines);lines.position.y=1.3;const lineMat=new THREE.LineBasicMaterial({color:0x91b7ff,transparent:true,opacity:.65});materials.add(lineMat);
      for(let i=0;i<8;i++){const angle=i*Math.PI/4;const pts=Array.from({length:101},(_,j)=>{const a=j/100*Math.PI*2;return new THREE.Vector3(Math.cos(a)*3.8,Math.sin(a)*1.6*Math.cos(angle),Math.sin(a)*1.6*Math.sin(angle));});const g=new THREE.BufferGeometry().setFromPoints(pts);geometries.add(g);lines.add(new THREE.LineLoop(g,lineMat));}
      const poleA=mesh(new THREE.ConeGeometry(.18,.45,16),blue),poleB=mesh(new THREE.ConeGeometry(.18,.45,16),amber);
      update=(v,_,on)=>{winding.scale.x=v.length/.5;lines.scale.x=v.length/.5;const active=on&&v.current>0;lines.visible=active;lineMat.opacity=Math.min(.9,.2+field(v,on)*100);poleA.visible=active;poleB.visible=active;poleA.position.set(-3.7*v.length/.5,1.3,0);poleB.position.set(3.7*v.length/.5,1.3,0);poleA.rotation.z=poleB.rotation.z=(v.polarity?-1:1)*Math.PI/2;};
    }else if(slug==="bridge-builder-challenge"){
      const compressionMat=new THREE.MeshStandardMaterial({color:0xe3b077,metalness:.4,roughness:.35});const bars=[rod(new THREE.Vector3(-3,0,0),new THREE.Vector3(0,2,0),.1,compressionMat),rod(new THREE.Vector3(0,2,0),new THREE.Vector3(3,0,0),.1,compressionMat),rod(new THREE.Vector3(-3,0,0),new THREE.Vector3(3,0,0),.1,blue)];
      const nodes=[0,1,2].map(()=>mesh(new THREE.SphereGeometry(.18,20,12),steel));const weight=mesh(new THREE.BoxGeometry(.9,.65,.9),dark);const supports=[-1,1].map(()=>mesh(new THREE.ConeGeometry(.45,.5,4),steel));
      update=(v,t)=>{const b=bridge(v),fraction=Math.min(1,t/4),failed=b.utilization*fraction>1;const a=new THREE.Vector3(-v.span/2,.3,0),top=new THREE.Vector3(0,v.rise+.3-(failed?.35:0),0),c=new THREE.Vector3(v.span/2,.3,0),radius=.055+Math.sqrt(v.area)*.022;setRod(bars[0],a,top,radius);setRod(bars[1],top,c,radius);setRod(bars[2],a,c,radius);nodes.forEach((n,i)=>n.position.copy([a,top,c][i]));supports[0].position.set(a.x,0,0);supports[1].position.set(c.x,0,0);weight.position.copy(top).add(new THREE.Vector3(0,.5,0));weight.scale.y=.4+fraction*.8;compressionMat.color.setHex(failed?0xef6175:0xe3b077);};
    }
    const resize=()=>{renderer.setSize(container.clientWidth,container.clientHeight,false);camera.aspect=container.clientWidth/Math.max(1,container.clientHeight);camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(container);resize();
    let raf=0;const draw=()=>{update(live.current.values,live.current.time,live.current.closed);controls.update();renderer.render(scene,camera);raf=requestAnimationFrame(draw);};raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);observer.disconnect();controls.dispose();controlsRef.current=null;geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
  },[slug]);
  return <div className="physicsThree"><div ref={host} className="physicsCanvas" role="img" aria-label={`${slug.replaceAll("-"," ")} interactive 3D experiment`}/>{failed&&<p className="physicsFallback">3D is unavailable on this device. Measurements and mission controls remain available below.</p>}<div className="physicsOrbit"><span>Drag to rotate · touch to explore</span><button onClick={()=>controlsRef.current?.reset()}>Reset view</button></div></div>;
}
