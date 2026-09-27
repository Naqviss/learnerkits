import { describe, expect, it } from "vitest";
import { coastalHeight, coastalSurface, coastalWave, coastX } from "@/components/subjects/geography/tsunami/coastalModel";
import { tsunami } from "@/lib/simulations/geographyLabs/model";
const values={depth:4000,distance:200,uplift:1,estimate:17};
describe("Coastal tsunami visualization",()=>{
 it("starts calm and carries a narrowing packet monotonically toward the shallow shelf",()=>{
  expect(coastalWave(values,0).amplitude).toBe(0);
  let center=-Infinity,width=Infinity;
  for(let i=0;i<=100;i++){const wave=coastalWave(values,i/10);expect(wave.center).toBeGreaterThanOrEqual(center);expect(wave.width).toBeLessThanOrEqual(width);center=wave.center;width=wave.width;}
  expect(center).toBeLessThan(5); // End at the offshore shelf; do not imply calculated inundation.
 });
 it("uses the existing model's shoaling ratio, independent of scenic camera scale",()=>{
  expect(coastalWave(values,10).amplification).toBeCloseTo(tsunami(values).coastal/values.uplift);
  expect(coastalWave({...values,uplift:2},10).amplitude).toBeCloseTo(coastalWave(values,10).amplitude*2);
  expect(coastalWave({...values,depth:6000},10).amplification).toBeGreaterThan(coastalWave({...values,depth:500},10).amplification);
 });
 it("keeps water and floating-object positions finite across supported input extremes",()=>{
  for(const depth of [500,6000])for(const uplift of [.2,3])for(const t of [0,.1,5,9.9,10])for(const x of [-30,-6,1,5])expect(Number.isFinite(coastalSurface(x,3,t,{...values,depth,uplift}))).toBe(true);
 });
 it("joins a submerged seabed to the beach without a block-shaped coastal cliff",()=>{
  for(const z of [-30,0,30]){const shore=coastX(z);expect(coastalHeight(shore-1,z)).toBeLessThan(0);expect(coastalHeight(shore+1,z)).toBeGreaterThan(0);expect(Math.abs(coastalHeight(shore+.001,z)-coastalHeight(shore-.001,z))).toBeLessThan(.12);}
 });
});
