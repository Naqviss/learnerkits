import { describe, expect, it } from "vitest";
import { subjectsCatalog } from "@/lib/subjects/catalog";
import { activities, derivative, initialValues, integrals, matrix, mission, probability, quadratic, riemann, sliceShape, transformShape, vector, type Values } from "@/lib/simulations/mathematicsLabs/model";

const values=(slug:string,changes:Values={})=>({...initialValues(activities.find(a=>a.slug===slug)!),...changes});
describe("mathematics missions",()=>{
 it("replaces every mathematics placeholder and makes every badge achievable",()=>{
  expect(activities.map(a=>a.slug).sort()).toEqual(subjectsCatalog.mathematics.simulations.map(s=>s.slug).sort());
  const solutions:Record<string,Values>={"vector-lab":{bx:4,by:5},"function-explorer":{a:1,b:1,c:-6},"geometry-slice-3d":{solid:0,plane:0,offset:0},"pythagorean-puzzle":{puzzle:0,answer:5},"unit-circle-challenge":{angle:0,answer:1},"quadratic-transformation":{target:0,a:1,h:2,k:-3},"slope-intercept-challenge":{target:0,m:2,b:-3},"geometry-transformation":{challenge:0,tx:4,ty:-2},"probability-experiment":{experiment:0,trials:1000},"derivative-tangent":{function:0,x:1,guess:2},"area-under-curve":{problem:0,rectangles:40,method:1},"matrix-transformation":{target:0,a:0,b:-1,c:1,d:0}};
  for(const a of activities)expect(mission(a.slug,values(a.slug,solutions[a.slug]),true).ok,a.slug).toBe(true);
 });
 it("adds vector components and derives magnitude and direction",()=>{expect(vector({ax:2,ay:3,bx:4,by:5})).toMatchObject({x:6,y:8,magnitude:10});expect(vector({ax:-1,ay:0,bx:0,by:1}).angle).toBeCloseTo(135);});
 it("finds quadratic roots and handles degenerate or imaginary cases",()=>{expect(quadratic({a:1,b:1,c:-6}).roots).toEqual([-3,2]);expect(quadratic({a:1,b:0,c:1}).roots).toEqual([]);expect(quadratic({a:0,b:2,c:1}).roots).toEqual([]);expect(quadratic({a:2,b:-8,c:3}).vertexX).toBe(2);});
 it("classifies centered sections of ideal solids",()=>{expect(sliceShape({solid:0,plane:0})).toBe("Circle");expect(sliceShape({solid:1,plane:0})).toBe("Square");expect(sliceShape({solid:2,plane:1})).toBe("Triangle");expect(sliceShape({solid:3,plane:1})).toBe("Circle");});
 it("uses distinct stamps for multi-target challenges",()=>{
  const cases:Record<string,Values[]>={
   "geometry-slice-3d":[{solid:0,plane:0,offset:0},{solid:1,plane:0,offset:0},{solid:2,plane:1,offset:0}],
   "pythagorean-puzzle":[{puzzle:0,answer:5},{puzzle:1,answer:13},{puzzle:2,answer:17}],
   "unit-circle-challenge":[{angle:0,answer:1},{angle:90,answer:2},{angle:180,answer:3},{angle:270,answer:4}],
   "quadratic-transformation":[{target:0,a:1,h:2,k:-3},{target:1,a:-.5,h:-2,k:2},{target:2,a:2,h:1,k:1}],
   "slope-intercept-challenge":[{target:0,m:2,b:-3},{target:1,m:-1.5,b:4},{target:2,m:.5,b:-2}],
   "geometry-transformation":[{challenge:0,tx:4,ty:-2},{challenge:1,angle:90},{challenge:2,axis:1},{challenge:3,scale:2}],
   "probability-experiment":[{experiment:0,trials:1000},{experiment:1,trials:1000},{experiment:2,trials:1000}],
   "derivative-tangent":[{function:0,x:1,guess:2},{function:1,x:2,guess:12},{function:2,x:0,guess:1}],
   "area-under-curve":[{problem:0,rectangles:40,method:1},{problem:1,rectangles:40,method:1},{problem:2,rectangles:40,method:1}],
   "matrix-transformation":[{target:0,a:0,b:-1,c:1,d:0},{target:1,a:1,b:1,c:0,d:1},{target:2,a:-1,b:0,c:0,d:1}],
  };
  for(const [slug,attempts] of Object.entries(cases)){const results=attempts.map(changes=>mission(slug,values(slug,changes),true));expect(results.every(r=>r.ok),slug).toBe(true);expect(new Set(results.map(r=>r.step)).size,slug).toBe(results[0].required);}
 });
 it("requires completed probability trials and converges reproducibly",()=>{const v=values("probability-experiment",{trials:1000});expect(mission("probability-experiment",v,false).ok).toBe(false);expect(probability(v)).toEqual(probability(v));expect(probability(v).error).toBeLessThan(.08);expect(probability({...v,experiment:1}).theory).toBeCloseTo(1/3);expect(probability({...v,experiment:2}).theory).toBe(.25);});
 it("matches analytic derivatives",()=>{for(const x of [-2,-.5,0,1,2]){expect(derivative(0,x)).toBeCloseTo(2*x);expect(derivative(1,x)).toBeCloseTo(3*x*x);expect(derivative(2,x)).toBeCloseTo(Math.cos(x));}});
 it("makes midpoint Riemann sums converge to each exact integral",()=>{for(let problem=0;problem<integrals.length;problem++){const coarse=riemann({problem,rectangles:4,method:1}),fine=riemann({problem,rectangles:40,method:1});expect(fine.error).toBeLessThan(coarse.error+1e-12);expect(fine.error).toBeLessThan(.03);expect(fine.bars).toHaveLength(40);expect(fine.bars.reduce((a,b)=>a+b.height*b.width,0)).toBeCloseTo(fine.sum);}});
 it("applies matrices and tracks signed area scale",()=>{const rotate=matrix({a:0,b:-1,c:1,d:0});expect(rotate.apply([2,3])).toEqual([-3,2]);expect(rotate.det).toBe(1);expect(matrix({a:-1,b:0,c:0,d:1}).det).toBe(-1);expect(matrix({a:1,b:2,c:2,d:4}).det).toBe(0);});
 it("preserves expected invariants under geometry transformations",()=>{const original=transformShape({challenge:0,tx:0,ty:0,angle:0,axis:0,scale:1}),translated=transformShape({challenge:0,tx:4,ty:-2}),dilated=transformShape({challenge:3,scale:2});const distance=(p:[number,number],q:[number,number])=>Math.hypot(p[0]-q[0],p[1]-q[1]);expect(distance(translated[0],translated[1])).toBeCloseTo(distance(original[0],original[1]));expect(distance(dilated[0],dilated[1])).toBeCloseTo(2*distance(original[0],original[1]));});
 it("rejects near misses outside stated tolerances",()=>{expect(mission("vector-lab",values("vector-lab",{bx:4,by:4}),true).ok).toBe(false);expect(mission("pythagorean-puzzle",values("pythagorean-puzzle",{answer:5.1}),true).ok).toBe(false);expect(mission("area-under-curve",values("area-under-curve",{rectangles:40,method:0}),true).ok).toBe(false);expect(mission("matrix-transformation",values("matrix-transformation",{target:0,a:0,b:-.75,c:1,d:0}),true).ok).toBe(false);});
});
