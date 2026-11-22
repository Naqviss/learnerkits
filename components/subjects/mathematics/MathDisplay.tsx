"use client";
import { useId } from "react";
import { baseShape, derivative, functionValue, lineTargets, matrix, probability, quadraticTargets, riemann, sliceShape, transformShape, triangles, vector, type Values } from "@/lib/simulations/mathematicsLabs/model";

const blue="#9fc2fa",amber="#e8ba7d",pink="#df8da2",muted="#91a2ba";
const line=(points:[number,number][])=>points.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
const polygon=(points:[number,number][])=>points.map(p=>p.join(",")).join(" ");
const gx=(x:number)=>325+x*25,gy=(y:number)=>220-y*25;
function grid(){return <>{Array.from({length:21},(_,i)=><path key={`v${i}`} d={`M${75+i*25} 35V405`} stroke={i===10?"#71829a":"#344257"} strokeWidth={i===10?1.5:1}/>)}{Array.from({length:15},(_,i)=><path key={`h${i}`} d={`M75 ${45+i*25}H575`} stroke={i===7?"#71829a":"#344257"} strokeWidth={i===7?1.5:1}/>)}{/* Axis numbers every 2 units so learners can read coordinates and count rise and run. */}{[-10,-8,-6,-4,-2,2,4,6,8,10].map(n=><text key={`gx${n}`} x={gx(n)} y="235" textAnchor="middle" fontSize="11" fill="#8c9cb3">{n}</text>)}{[-6,-4,-2,2,4,6].map(n=><text key={`gy${n}`} x="319" y={gy(n)+4} textAnchor="end" fontSize="11" fill="#8c9cb3">{n}</text>)}</>}
export function MathDisplay({slug,values:v,time:t}:{slug:string;values:Values;time:number}){
 const id=useId().replaceAll(":","");let content:React.ReactNode;
 if(slug==="vector-lab"){
  const q=vector(v),origin:[number,number]=[325,220],a:[number,number]=[gx(v.ax),gy(v.ay)],end:[number,number]=[gx(q.x),gy(q.y)],corner:[number,number]=[gx(v.ax+v.bx),gy(v.ay+v.by)];
  content=<>{grid()}<path d={`M${origin}L${a}`} stroke={blue} strokeWidth="4" markerEnd={`url(#${id}blue)`}/><path d={`M${a}L${corner}`} stroke={amber} strokeWidth="4" markerEnd={`url(#${id}amber)`}/><path d={`M${origin}L${end}`} stroke="white" strokeWidth="3" strokeDasharray="7 5" markerEnd={`url(#${id}white)`}/><text x={a[0]+8} y={a[1]-8} fill={blue}>A</text><text x={corner[0]+8} y={corner[1]-8} fill={amber}>A + B</text><text x="90" y="390">R = ⟨{q.x}, {q.y}⟩ · |R| = {q.magnitude.toFixed(2)} · θ = {q.angle.toFixed(1)}°</text></>;
 }else if(slug==="function-explorer"){
  const fn=(x:number)=>v.a*x*x+v.b*x+v.c,points=Array.from({length:241},(_,i)=>{const x=-6+i*.05;return[gx(x),gy(fn(x))] as [number,number]}).filter(p=>p[1]>20&&p[1]<420);
  content=<>{grid()}<path d={line(points)} fill="none" stroke={blue} strokeWidth="4"/><circle cx={gx(0)} cy={gy(v.c)} r="6" fill={amber}/><text x="90" y="55" fill={blue}>f(x) = {v.a}x² {v.b<0?"−":"+"} {Math.abs(v.b)}x {v.c<0?"−":"+"} {Math.abs(v.c)}</text><text x="90" y="390">Gold point: y-intercept · roots occur where the curve crosses the x-axis</text></>;
 }else if(slug==="pythagorean-puzzle"){
  // Squares on all three sides: the two leg squares together have the same area as the
  // hypotenuse square. The dashed square is built from the learner's hypotenuse and only lines up
  // with the real one when the answer is right.
  const [a,b,c]=triangles[v.puzzle],box={left:24,top:24,width:372,height:392},s=Math.min(box.width/(a+2*b),box.height/(2*a+b));
  const x0=box.left+b*s+(box.width-(a+2*b)*s)/2,y0=box.top+(a+b)*s+(box.height-(2*a+b)*s)/2;
  const P:[number,number]=[x0,y0],B:[number,number]=[x0+a*s,y0],C:[number,number]=[x0,y0-b*s],n:[number,number]=[b*s,-a*s];
  const add=(p:[number,number],q:[number,number],k=1):[number,number]=>[p[0]+q[0]*k,p[1]+q[1]*k];
  const legA=[P,B,add(B,[0,a*s]),add(P,[0,a*s])],legB=[P,C,add(C,[-b*s,0]),add(P,[-b*s,0])],hyp=[B,C,add(C,n),add(B,n)];
  const u:[number,number]=[(C[0]-B[0])/(c*s),(C[1]-B[1])/(c*s)],nu:[number,number]=[n[0]/(c*s),n[1]/(c*s)],g=v.answer*s;
  const guess=[B,add(B,u,g),add(add(B,u,g),nu,g),add(B,nu,g)],right=Math.abs(v.answer-c)<=.05;
  const centre=(q:[number,number][])=>[(q[0][0]+q[2][0])/2,(q[0][1]+q[2][1])/2];
  const [ax,ay]=centre(legA),[bx,by]=centre(legB),[hx,hy]=centre(hyp);
  content=<>
   <polygon points={polygon(legA)} fill={amber} fillOpacity=".22" stroke={amber} strokeWidth="2"/>
   <polygon points={polygon(legB)} fill={pink} fillOpacity=".22" stroke={pink} strokeWidth="2"/>
   <polygon points={polygon(hyp)} fill={blue} fillOpacity={right?".34":".12"} stroke={blue} strokeWidth="2"/>
   {Array.from({length:a-1},(_,i)=><path key={`a${i}`} d={`M${P[0]+(i+1)*s} ${y0}V${y0+a*s}M${P[0]} ${y0+(i+1)*s}H${B[0]}`} stroke={amber} strokeOpacity=".28"/>)}
   {Array.from({length:b-1},(_,i)=><path key={`b${i}`} d={`M${x0-(i+1)*s} ${y0}V${C[1]}M${x0} ${y0-(i+1)*s}H${x0-b*s}`} stroke={pink} strokeOpacity=".28"/>)}
   <polygon points={polygon(guess)} fill="none" stroke="white" strokeWidth="2" strokeDasharray="6 5" opacity=".85"/>
   <polygon points={polygon([P,B,C])} fill="#2b3a52" stroke="white" strokeWidth="3"/>
   <path d={`M${x0} ${y0-12}H${x0+12}V${y0}`} fill="none" stroke="white"/>
   <text x={ax} y={ay+5} textAnchor="middle" fill={amber} fontSize="17" fontWeight="700">a² = {a*a}</text>
   <text x={bx} y={by+5} textAnchor="middle" fill={pink} fontSize="17" fontWeight="700">b² = {b*b}</text>
   <text x={hx} y={hy+5} textAnchor="middle" fill={blue} fontSize="17" fontWeight="700">c² = {right?c*c:"?"}</text>
   <text x={(P[0]+B[0])/2} y={y0-8} textAnchor="middle" fill="white">a = {a}</text>
   <text x={x0+8} y={(y0+C[1])/2} fill="white">b = {b}</text>
   <g transform="translate(420 92)"><rect width="200" height="256" rx="18" fill="#252f3d" stroke="#4a5a70"/><text x="100" y="40" textAnchor="middle" fill={blue}>AREA EQUATION</text><text x="100" y="88" textAnchor="middle" fill="white" fontSize="24">a² + b² = c²</text><text x="100" y="128" textAnchor="middle" fontSize="16">{a*a} + {b*b} = {a*a+b*b}</text><text x="100" y="172" textAnchor="middle" fill={amber}>Your c = {v.answer.toFixed(1)}</text><text x="100" y="196" textAnchor="middle" fill={amber}>Your c² = {(v.answer*v.answer).toFixed(1)}</text><text x="100" y="232" textAnchor="middle" fill={right?"#8fdcb4":"white"} fontSize="14" fontWeight="700">{right?"✓ The squares match":v.answer<c?"Dashed square too small":"Dashed square too big"}</text></g>
  </>;
 }else if(slug==="unit-circle-challenge"){
  const angle=v.angle*Math.PI/180,x=Math.cos(angle),y=Math.sin(angle),px=325+x*150,py=220-y*150;
  content=<>{grid()}<circle cx="325" cy="220" r="150" fill="#385272" fillOpacity=".2" stroke={blue} strokeWidth="3"/><path d={`M325 220L${px} ${py}`} stroke={amber} strokeWidth="4" markerEnd={`url(#${id}amber)`}/><path d={`M${px} ${py}V220M${px} ${py}H325`} stroke="#8193ad" strokeDasharray="5 6"/><circle cx={px} cy={py} r="8" fill={amber}/><path d={line(Array.from({length:31},(_,i)=>[325+45*Math.cos(i/30*angle),220-45*Math.sin(i/30*angle)] as [number,number]))} fill="none" stroke={pink} strokeWidth="3"/><text x="385" y="205" fill={pink}>{v.angle}°</text><text x="90" y="390">(cos θ, sin θ) = ({x.toFixed(3)}, {y.toFixed(3)})</text></>;
 }else if(slug==="quadratic-transformation"){
  const target=quadraticTargets[v.target],curve=(a:number,h:number,k:number)=>Array.from({length:241},(_,i)=>{const x=-6+i*.05;return[gx(x),gy(a*(x-h)**2+k)] as [number,number]}).filter(p=>p[1]>20&&p[1]<420);
  content=<>{grid()}<path d={line(curve(target.a,target.h,target.k))} fill="none" stroke={pink} strokeWidth="8" opacity=".45"/><path d={line(curve(v.a,v.h,v.k))} fill="none" stroke={blue} strokeWidth="3"/><circle cx={gx(target.h)} cy={gy(target.k)} r="8" fill={pink}/><circle cx={gx(v.h)} cy={gy(v.k)} r="5" fill={blue}/><text x="90" y="55" fill={pink}>TARGET</text><text x="165" y="55" fill={blue}>YOUR GRAPH</text><text x="90" y="390">y = {v.a}(x − {v.h})² {v.k<0?"−":"+"} {Math.abs(v.k)}</text></>;
 }else if(slug==="slope-intercept-challenge"){
  const target=lineTargets[v.target],segment=(m:number,b:number)=>[[-10,m*-10+b],[10,m*10+b]].map(([x,y])=>[gx(x),gy(y)] as [number,number]);
  content=<>{grid()}<path d={line(segment(target.m,target.b))} stroke={pink} strokeWidth="9" opacity=".4"/><path d={line(segment(v.m,v.b))} stroke={blue} strokeWidth="3"/><circle cx={gx(0)} cy={gy(target.b)} r="8" fill={pink}/><circle cx={gx(0)} cy={gy(v.b)} r="5" fill={blue}/><text x="90" y="55" fill={pink}>TARGET</text><text x="165" y="55" fill={blue}>YOUR LINE</text><text x="90" y="390">y = {v.m}x {v.b<0?"−":"+"} {Math.abs(v.b)}</text></>;
 }else if(slug==="geometry-transformation"){
  const current=transformShape(v),targets=[baseShape.map(([x,y])=>[x+4,y-2] as [number,number]),baseShape.map(([x,y])=>[-y,x] as [number,number]),baseShape.map(([x,y])=>[-x,y] as [number,number]),baseShape.map(([x,y])=>[2*x,2*y] as [number,number])][v.challenge];
  content=<>{grid()}<polygon points={polygon(baseShape.map(([x,y])=>[gx(x),gy(y)]))} fill="#718199" fillOpacity=".25" stroke="#8190a5" strokeDasharray="5 5"/><polygon points={polygon(targets.map(([x,y])=>[gx(x),gy(y)]))} fill={pink} fillOpacity=".28" stroke={pink} strokeWidth="8" opacity=".55"/><polygon points={polygon(current.map(([x,y])=>[gx(x),gy(y)]))} fill={blue} fillOpacity=".3" stroke={blue} strokeWidth="3"/><text x="90" y="55"><tspan fill="#8f9fb5">ORIGINAL</tspan><tspan x="190" fill={pink}>TARGET</tspan><tspan x="270" fill={blue}>YOUR IMAGE</tspan></text></>;
 }else if(slug==="probability-experiment"){
  const shown=Math.floor(v.trials*t/10),q0=probability({...v,trials:Math.max(1,shown)}),q=shown?q0:{...q0,experimental:0,error:NaN},scale=400;
  content=<><text x="55" y="55" fill={blue}>LIVE FREQUENCY / {shown} TRIALS</text><path d="M80 350H580" stroke="#68778d"/><rect x="135" y={350-q.experimental*scale} width="130" height={q.experimental*scale} rx="8" fill={blue}/><rect x="380" y={350-q.theory*scale} width="130" height={q.theory*scale} rx="8" fill={amber}/><text x="200" y="382" textAnchor="middle">EXPERIMENTAL</text><text x="445" y="382" textAnchor="middle">THEORETICAL</text><text x="200" y={330-q.experimental*scale} textAnchor="middle" fill="white" fontSize="23">{shown?`${(q.experimental*100).toFixed(1)}%`:"Press Run trials"}</text><text x="445" y={330-q.theory*scale} textAnchor="middle" fill="white" fontSize="23">{(q.theory*100).toFixed(1)}%</text><text x="320" y="420" textAnchor="middle">{shown?`Absolute error ${(q.error*100).toFixed(1)} percentage points`:"No trials yet"}</text></>;
 }else if(slug==="derivative-tangent"){
  const x0=v.x,y0=functionValue(v.function,x0),d=derivative(v.function,x0),fn=Array.from({length:241},(_,i)=>{const x=-4+i/30;return[gx(x),gy(functionValue(v.function,x))] as [number,number]}).filter(p=>p[1]>15&&p[1]<425),tangent=[-5,5].map(x=>[gx(x),gy(y0+d*(x-x0))] as [number,number]);
  content=<>{grid()}<path d={line(fn)} fill="none" stroke={blue} strokeWidth="4"/><path d={line(tangent)} stroke={amber} strokeWidth="3"/><circle cx={gx(x0)} cy={gy(y0)} r="8" fill={amber}/><text x="90" y="55" fill={blue}>{["f(x)=x²","f(x)=x³","f(x)=sin(x)"][v.function]}</text><text x="90" y="390">Exact tangent slope {d.toFixed(3)} · your estimate {v.guess.toFixed(2)}</text></>;
 }else if(slug==="area-under-curve"){
  const q=riemann(v),xScale=480/(q.b-q.a),maxY=Math.max(...q.bars.map(b=>b.height),1),yScale=260/maxY;
  content=<><path d="M75 345H575M75 55V345" stroke="#71829a"/>{q.bars.map((bar,i)=><rect key={i} x={75+(bar.x-q.a)*xScale} y={345-bar.height*yScale} width={bar.width*xScale} height={bar.height*yScale} fill={blue} fillOpacity=".25" stroke={blue} strokeWidth=".7"/>)}<path d={line(Array.from({length:201},(_,i)=>{const x=q.a+(q.b-q.a)*i/200;return[75+(x-q.a)*xScale,345-q.fn(x)*yScale] as [number,number];}))} fill="none" stroke={amber} strokeWidth="4"/><text x="75" y="385">{v.rectangles} {['left','midpoint','right'][v.method]} rectangles</text><text x="575" y="385" textAnchor="end">sum {q.sum.toFixed(4)} · exact {q.exact.toFixed(4)}</text><text x="325" y="425" textAnchor="middle">absolute error {q.error.toFixed(4)}</text></>;
 }else{
  const m=matrix(v),original:[number,number][]=[[-4,-3],[4,-3],[4,3],[-4,3]],image=original.map(m.apply);
  const transformedLines=[] as [number,number][][];for(let i=-8;i<=8;i++){transformedLines.push([m.apply([i,-8]),m.apply([i,8])],[m.apply([-8,i]),m.apply([8,i])]);}
  content=<>{grid()}{transformedLines.map((l,i)=><path key={i} d={line(l.map(([x,y])=>[gx(x),gy(y)]))} stroke={i%2?"#526b8d":"#49617f"} strokeWidth="1"/>)}<polygon points={polygon(original.map(([x,y])=>[gx(x),gy(y)]))} fill="none" stroke="#8998ad" strokeDasharray="5 6"/><polygon points={polygon(image.map(([x,y])=>[gx(x),gy(y)]))} fill={blue} fillOpacity=".16" stroke={blue} strokeWidth="3"/><path d={`M325 220L${gx(v.a)} ${gy(v.c)}`} stroke={amber} strokeWidth="4" markerEnd={`url(#${id}amber)`}/><path d={`M325 220L${gx(v.b)} ${gy(v.d)}`} stroke={pink} strokeWidth="4" markerEnd={`url(#${id}pink)`}/><text x="90" y="55" fill={blue}>TRANSFORMED GRID</text><text x="90" y="390">det(A) = {m.det.toFixed(2)} · signed area scale</text></>;
 }
 return <div className="mathDiagram"><svg viewBox="0 0 650 440" role="img" aria-label={`${slug.replaceAll("-"," ")} interactive visualization`}><defs><radialGradient id={`${id}bg`}><stop stopColor="#344258"/><stop offset="1" stopColor="#1b242f"/></radialGradient>{[["blue",blue],["amber",amber],["pink",pink],["white","white"]].map(([name,color])=><marker key={name} id={`${id}${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5 0 10Z" fill={color}/></marker>)}<clipPath id={`${id}clip`}><rect width="650" height="440" rx="10"/></clipPath></defs><rect width="650" height="440" fill={`url(#${id}bg)`}/><g clipPath={`url(#${id}clip)`} fill={muted} fontFamily="inherit" fontSize="13">{content}</g></svg></div>;
}
