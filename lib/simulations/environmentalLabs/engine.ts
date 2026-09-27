import { activities, clamp, normalizeValues, type Values } from "./model";
export type Reading = { key: string; label: string; unit: string; digits: number; color: string };
export type Sample = { time: number; [key: string]: number };
export type Experiment = { slug: string; values: Values; duration: number; timeUnit: string; readings: Reading[]; samples: Sample[]; summary: {label:string;value:number;unit:string;digits:number}[] };
const reading=(key:string,label:string,unit:string,digits=1,color="#59dbc0"):Reading=>({key,label,unit,digits,color});
const columns:Record<string,Reading[]>={
 "greenhouse-effect-simulator":[reading("surface","Surface warming","°C",2),reading("deep","Deep-ocean warming","°C",2,"#75baff"),reading("imbalance","Energy imbalance","W/m²",2,"#ffd183")],
 "carbon-cycle-simulator":[reading("ppm","Atmospheric CO₂","ppm"),reading("net","Net atmospheric flow","GtCO₂/year",1,"#ffd183"),reading("stored","Total captured","GtCO₂",1,"#75baff")],
 "sea-level-rise-simulator":[reading("total","Relative sea-level rise","m",3),reading("thermal","Thermal expansion","m",3,"#75baff"),reading("ice","Land-ice contribution","m",3,"#ffd183")],
 "ocean-acidification-simulator":[reading("ph","Surface-water pH","pH",2),reading("carbonate","Carbonate ions","µmol/L",1,"#75baff"),reading("hydrogen","Hydrogen ions","nmol/L",2,"#ffd183")],
 "renewable-energy-grid-simulator":[reading("renewable","Renewable output","MW"),reading("demand","City demand","MW",1,"#ffd183"),reading("soc","Stored energy","MWh",1,"#75baff"),reading("gas","Gas output","MW",1,"#ecadbf"),reading("unmet","Unmet demand","MW",1,"#ff937d")],
 "air-pollution-smog-simulator":[reading("pm","PM₂.₅ concentration","µg/m³"),reading("ozone","Ozone concentration","ppb",1,"#ffd183"),reading("mixing","Mixing depth","m",0,"#75baff")],
 "deforestation-water-cycle-simulator":[reading("rainfall","Cumulative rainfall","mm"),reading("infiltration","Infiltrated water","mm",1,"#75baff"),reading("runoff","Surface runoff","mm",1,"#ffd183"),reading("interception","Canopy interception","mm",1,"#ecadbf")],
 "biodiversity-habitat-fragmentation":[reading("occupancy","Expected patch occupancy","%"),reading("connectivity","Dispersal index","/100",0,"#75baff"),reading("edge","Relative edge exposure","/100",0,"#ffd183")],
 "urban-heat-island-simulator":[reading("local","Neighborhood air","°C"),reading("reference","Regional air","°C",1,"#75baff"),reading("anomaly","Urban heat difference","°C",2,"#ffd183")],
 "climate-resilience-city-builder":[reading("ponding","Street water depth","mm"),reading("exposure","Building exposure index","/100",1,"#ffd183"),reading("wetland","Wetland water storage","mm",1,"#75baff")],
};
export function carbonateChemistry(pco2:number,warming=0) {
 const dissolved=.034*Math.exp(-.025*warming)*pco2*1e-6,k1=1e-6,k2=8e-10,alk=.0023;
 let low=6,high=10;
 for(let i=0;i<60;i++) {const ph=(low+high)/2,h=10**-ph,trial=k1*dissolved/h+2*k1*k2*dissolved/(h*h)+1e-14/h-h;if(trial>alk)high=ph;else low=ph;}
 const ph=(low+high)/2,h=10**-ph;
 return {ph,hydrogen:h*1e9,carbonate:k1*k2*dissolved/(h*h)*1e6,dissolved:dissolved*1e6};
}
export function habitatNetwork(v:Values) {
 const n=Math.round(v.patches),area=v.habitat/n,radius=Math.sqrt(area/Math.PI)*9;
 const nodes=Array.from({length:n},(_,i)=>({x:n===1?340:340+210*Math.cos(i*2*Math.PI/n),y:n===1?220:220+120*Math.sin(i*2*Math.PI/n),radius}));
 const weights=nodes.map((a,i)=>nodes.map((b,j)=>i===j?0:Math.exp(-Math.hypot(a.x-b.x,a.y-b.y)/150)*(.08+.92*v.corridor/100)));
 const connectivity=n===1?100:100*weights.reduce((sum,row)=>sum+Math.max(...row),0)/n;
 return {nodes,weights,connectivity,edge:clamp(.65/Math.sqrt(area/100))*100};
}
export function runExperiment(slug:string,input:Values):Experiment {
 const activity=activities.find(a=>a.slug===slug);if(!activity)throw new Error(`Unknown environmental experiment: ${slug}`);
 const v=normalizeValues(activity,input),duration=slug==="greenhouse-effect-simulator"?100:slug==="sea-level-rise-simulator"?v.years:slug==="deforestation-water-cycle-simulator"?3:slug==="climate-resilience-city-builder"?12:["renewable-energy-grid-simulator","air-pollution-smog-simulator","urban-heat-island-simulator"].includes(slug)?24:30;
 const timeUnit=duration===24||duration===3||duration===12?"hours":"years";
 const samples:Sample[]=[],steps=1200,dt=duration/steps;
 let surface=0,deep=0,ppm=420,landStored=0,oceanStored=0,removed=0,thermal=0,ice=0,lagged=1.2,pco2=420;
 let soc=0,totalDemand=0,totalUnmet=0,totalGas=0,totalCurtail=0,totalDischarge=0,totalCharge=0,totalRenewable=0;
 let pm=4,ozone=25,rainfall=0,interception=0,infiltration=0,runoff=0,erosion=0,anomaly=0,ponding=0,wetland=0,drained=0,stormInput=0,peakPonding=0,peakExposure=0;
 const network=slug==="biodiversity-habitat-fragmentation"?habitatNetwork(v):null;
 let occupied:number[]=network?.nodes.map((_,i)=>i%3===0?.8:.2)??[];
 const heatTarget=(hour:number)=>{
  const sun=Math.max(0,Math.sin(Math.PI*(hour-6)/12));
  return Math.max(.15,(1.2+4*sun+.04*(v.temperature-28))*(1-.007*v.trees)*(1-.004*v.coolRoofs)*(1-.005*v.permeable));
 };
 // Spin up heat storage for three identical days so midnight does not start artificially cold.
 if(slug==="urban-heat-island-simulator")for(let i=0;i<3600;i++)anomaly+=(heatTarget((i*.02)%24)-anomaly)/4*.02;
 for(let i=0;i<=steps;i++) {
  const t=i*dt,integrate=i<steps;
  let m:Record<string,number>={};
  if(slug==="greenhouse-effect-simulator") {
   const forcing=5.35*Math.log(v.co2/280)+.036*(Math.sqrt(v.methane)-Math.sqrt(700))+1361*(.3-v.albedo)/4,imbalance=forcing-1.25*surface,exchange=.7*(surface-deep);
   m={surface,deep,forcing,imbalance,absorbed:1361*(1-v.albedo)/4,outgoing:1361*(1-v.albedo)/4-imbalance};
   if(integrate){surface+=(imbalance-exchange)/8*dt;deep+=exchange/100*dt;}
  } else if(slug==="carbon-cycle-simulator") {
   const excess=Math.max(0,(ppm-280)/140),land=v.forest*excess,ocean=v.ocean*excess,removal=Math.min(v.removal,Math.max(0,ppm*7.8/dt+v.emissions-land-ocean)),net=v.emissions-land-ocean-removal;
   m={ppm,net,stored:landStored+oceanStored+removed,landStored,oceanStored,removed,emitted:v.emissions*t,landFlow:land,oceanFlow:ocean};
   if(integrate){ppm+=net*dt/7.8;landStored+=land*dt;oceanStored+=ocean*dt;removed+=removal*dt;}
  } else if(slug==="sea-level-rise-simulator") {
   const warming=1.2+(v.warming-1.2)*t/duration,local=v.subsidence*t/1000;
   m={thermal,ice,local,total:thermal+ice+local,warming};
   if(integrate){thermal+=.9*lagged*dt/1000;ice+=1.8*Math.max(0,warming-.3)*dt/1000;lagged+=(warming-lagged)/25*dt;}
  } else if(slug==="ocean-acidification-simulator") {
   m={...carbonateChemistry(pco2+1.5*v.nutrients,v.warming),pco2};
   if(integrate)pco2+=(v.co2-pco2)*(1-Math.exp(-dt/8));
  } else if(slug==="renewable-energy-grid-simulator") {
   const hour=t%24,solar=v.solar*.88*Math.max(0,Math.sin(Math.PI*(hour-6)/12)),wind=v.wind*clamp(.38+.18*Math.sin(hour*.43+1)+.09*Math.cos(hour*.91),.06,.75),hydro=v.hydro*.7;
   const demand=v.demand*(.72+.2*Math.exp(-Math.pow((hour-8)/2.5,2))+.4*Math.exp(-Math.pow((hour-19)/3,2)));
   const renewable=solar+wind+hydro,direct=Math.min(demand,renewable),surplus=Math.max(0,renewable-demand),gap=Math.max(0,demand-renewable),eta=Math.sqrt(.9),power=v.storage/4;
   const charge=Math.min(surplus,power,Math.max(0,(v.storage-soc)/(dt*eta))),discharge=Math.min(gap,power,Math.max(0,soc*eta/dt)),gas=Math.min(v.gas,gap-discharge),unmet=Math.max(0,gap-discharge-gas),curtail=surplus-charge;
   m={solar,wind,hydro,renewable,demand,charge,discharge,gas,unmet,curtail,soc};
   if(integrate){soc=clamp(soc+(charge*eta-discharge/eta)*dt,0,v.storage);totalDemand+=demand*dt;totalUnmet+=unmet*dt;totalGas+=gas*dt;totalCurtail+=curtail*dt;totalDischarge+=discharge*dt;totalCharge+=charge*dt;totalRenewable+=direct*dt;}
  } else if(slug==="air-pollution-smog-simulator") {
   const sun=Math.max(0,Math.sin(Math.PI*(t-6)/12))*v.sunlight/100,trafficProfile=.35+.65*Math.exp(-Math.pow((t-8)/2,2))+.6*Math.exp(-Math.pow((t-18)/2.5,2)),mixing=1000-8*v.inversion,loss=.08+.36*v.wind;
   const source=(v.traffic*.16*trafficProfile+v.industry*.2)*1000/mixing;
   const ozoneSource=.24*Math.sqrt((.8*v.traffic*trafficProfile+.4*v.industry)*(.4*v.traffic*trafficProfile+.8*v.industry))*sun*1000/mixing,ozoneLoss=.2+.16*v.wind;
   m={pm,ozone,mixing,sun};
   if(integrate){pm=4+(pm-4)*Math.exp(-loss*dt)+source/loss*(1-Math.exp(-loss*dt));ozone=25+(ozone-25)*Math.exp(-ozoneLoss*dt)+ozoneSource/ozoneLoss*(1-Math.exp(-ozoneLoss*dt));}
  } else if(slug==="deforestation-water-cycle-simulator") {
   const rate=t<2?v.rain*Math.sin(Math.PI*t/2):0,forest=v.forest/100,compaction=v.compaction/100,finalCapacity=(5+25*forest)*(1-.75*compaction),initialCapacity=finalCapacity+30*(1-.6*compaction),capacity=finalCapacity+(initialCapacity-finalCapacity)*Math.exp(-1.2*t);
   const intercepted=Math.min(rate*dt,Math.max(0,2*forest-interception)),throughfall=Math.max(0,rate*dt-intercepted),soaked=Math.min(throughfall,capacity*dt),excess=throughfall-soaked;
   m={rainfall,interception,infiltration,runoff,capacity,rainRate:rate,erosion};
   if(integrate){rainfall+=rate*dt;interception+=intercepted;infiltration+=soaked;runoff+=excess;erosion+=excess*(v.slope/35)*(1-.9*forest);}
  } else if(slug==="biodiversity-habitat-fragmentation"&&network) {
   const area=v.habitat/v.patches,extinction=.025+.07/Math.sqrt(area)+.08*v.pollution/100;
   m={occupancy:occupied.reduce((s,x)=>s+x,0)/occupied.length*100,connectivity:network.connectivity,edge:network.edge};
   occupied.forEach((x,j)=>{m[`patch${j}`]=x;});
   if(integrate)occupied=occupied.map((x,j)=>{const dispersal=network.weights[j].reduce((s,w,k)=>s+w*occupied[k],0),colonization=.006+.32*dispersal/Math.max(1,Math.sqrt(v.patches-1));return clamp(x+(colonization*(1-x)-extinction*x)*dt);});
  } else if(slug==="urban-heat-island-simulator") {
   const reference=v.temperature-5+5*Math.cos(2*Math.PI*(t-15)/24),runoffDepth=30*clamp(.82-v.trees*.004-v.permeable*.007);
   m={reference,anomaly,local:reference+anomaly,runoffDepth};
   if(integrate)anomaly+=(heatTarget(t)-anomaly)*(1-Math.exp(-dt/4));
  } else {
   const rainRate=t<6?.45*v.hazard*Math.sin(Math.PI*t/6):0,runoffRate=.8*rainRate,capacity=.8*v.wetlands,threshold=5+1.2*v.barriers,exposure=clamp((ponding-threshold)/40)*100*(1-.015*v.warning),heat=clamp(80-v.shade*1.3-v.warning*.45,0,100);
   m={ponding,wetland,exposure,rainRate,drained,stormInput,threshold,heat,budget:v.wetlands+v.drainage+v.shade+v.barriers+v.warning};
   peakPonding=Math.max(peakPonding,ponding);peakExposure=Math.max(peakExposure,exposure);
   if(integrate){const incoming=runoffRate*dt,capture=Math.min(incoming,Math.max(0,capacity-wetland));wetland+=capture;ponding+=incoming-capture;const out=Math.min(ponding,(2+.35*v.drainage)*dt);ponding-=out;drained+=out;stormInput+=incoming;}
  }
  if(i%10===0)samples.push({time:t,...m});
 }
 const last=samples.at(-1)!,summary:Experiment["summary"]=[];
 const add=(label:string,value:number,unit:string,digits=1)=>summary.push({label,value,unit,digits});
 if(slug==="renewable-energy-grid-simulator"){add("Demand served",100*(1-totalUnmet/totalDemand),"%");add("Clean share of served energy",100*(totalRenewable+totalDischarge)/Math.max(.001,totalDemand-totalUnmet),"%");add("Operational CO₂",totalGas*.4,"tCO₂");add("Unmet energy",totalUnmet,"MWh");add("Curtailed energy",totalCurtail,"MWh");add("Battery charged",totalCharge,"MWh");add("Battery discharged",totalDischarge,"MWh");}
 else if(slug==="climate-resilience-city-builder"){add("Peak street water",peakPonding,"mm");add("Peak exposure index",peakExposure,"/100");add("Heat exposure index",last.heat,"/100");add("Budget used",last.budget,"/100",0);}
 else if(slug==="deforestation-water-cycle-simulator"){add("Runoff share",last.runoff/Math.max(.001,last.rainfall)*100,"%");add("Sediment pressure",last.erosion,"index");add("Water balance error",last.rainfall-last.runoff-last.infiltration-last.interception,"mm",6);}
 else if(slug==="urban-heat-island-simulator"){add("Peak neighborhood air",Math.max(...samples.map(s=>s.local)),"°C");add("Runoff from 30 mm storm",last.runoffDepth,"mm");}
 else if(slug==="sea-level-rise-simulator")add("Subsidence contribution",last.local,"m",3);
 else if(slug==="carbon-cycle-simulator"){add("Cumulative human emissions",last.emitted,"GtCO₂");add("Net land storage",last.landStored,"GtCO₂");add("Net ocean storage",last.oceanStored,"GtCO₂");add("Engineered storage",last.removed,"GtCO₂");}
 else for(const r of columns[slug])add(`Final ${r.label.toLowerCase()}`,last[r.key],r.unit,r.digits);
 return {slug,values:v,duration,timeUnit,readings:columns[slug],samples,summary};
}
export function experimentCsv(experiment:Experiment):string {
 const quote=(value:string|number)=>`"${String(value).replaceAll('"','""')}"`;
 const keys=Object.keys(experiment.samples[0]),units=Object.fromEntries(experiment.readings.map(r=>[r.key,r.unit]));
 const rows:(string|number)[][]=[["LearnerKits educational model",experiment.slug],["Model version","environmental-2"],["Note","Hypothetical scenarios, not measured data or forecasts"],...Object.entries(experiment.values).map(([k,v])=>["Input",k,v]),keys.map(k=>`${k}${k==="time"?` (${experiment.timeUnit})`:units[k]?` (${units[k]})`:""}`),...experiment.samples.map(s=>keys.map(k=>Number(s[k].toFixed(6))))];
 return rows.map(row=>row.map(quote).join(",")).join("\r\n");
}
