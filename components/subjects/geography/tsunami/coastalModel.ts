import { clamp, tsunami, type Values } from "@/lib/simulations/geographyLabs/model";

/** Scenic units only. The original lab retains its physical travel-time calculation. */
export const coastX=(z:number)=>5+Math.sin(z*.13)*.9+Math.sin(z*.31)*.3;
export function coastalHeight(x:number,z:number){
 const d=x-coastX(z);
 if(d<0)return -.03+Math.max(-7,d*.23);
 return .03+Math.min(d,2.8)*.12+Math.max(0,d-15)*.12+Math.max(0,d-20)*(.3+.18*Math.sin(z*.16))+.045*Math.sin(x*.7)*Math.sin(z*.55);
}
export function coastalWave(values:Values,time:number){
 const progress=clamp(time/10),near=clamp((progress-.55)/.45);
 return {progress,center:-18+21*(1-(1-progress)**1.5),amplitude:values.uplift*.42*Math.min(1,progress/.06),amplification:tsunami(values).coastal/values.uplift,width:3.3-2.35*near,phase:progress===0?"Ready to launch":progress<.5?"Crossing the ocean":progress<.8?"Approaching the shelf":"At the shallow shelf"};
}
export function coastalSurface(x:number,z:number,time:number,values:Values){
 const w=coastalWave(values,time),q=x-coastX(z)+5,near=clamp((q+5)/8),d=(q-w.center)/w.width;
 const long=w.amplitude*(1+(w.amplification-1)*near*near)*(Math.exp(-d*d)-.28*Math.exp(-(((d+2.6)/1.5)**2)));
 return long+.035*Math.sin(x*1.3+z*.8-time*1.2)+.018*Math.sin(z*2.7-x*.5-time*1.9);
}
