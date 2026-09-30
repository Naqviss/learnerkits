import type { Values } from "../model";
export const R = 8.314462618;
export const F = 96485.33212;
export const AVOGADRO = 6.02214076e23;
export const clamp = (v:number,min:number,max:number) => Math.max(min,Math.min(max,v));
export const elements = [
  // Z, name, symbol, group, period, covalent radius pm, first IE kJ/mol, Pauling EN, EA kJ/mol released.
  [1,"Hydrogen","H",1,1,31,1312,2.20,72.8], [2,"Helium","He",18,1,28,2372,null,null],
  [3,"Lithium","Li",1,2,128,520,.98,59.6], [4,"Beryllium","Be",2,2,96,900,1.57,null],
  [5,"Boron","B",13,2,84,801,2.04,26.7], [6,"Carbon","C",14,2,76,1087,2.55,121.8],
  [7,"Nitrogen","N",15,2,71,1402,3.04,null], [8,"Oxygen","O",16,2,66,1314,3.44,141],
  [9,"Fluorine","F",17,2,57,1681,3.98,328], [10,"Neon","Ne",18,2,58,2081,null,null],
  [11,"Sodium","Na",1,3,166,496,.93,52.9], [12,"Magnesium","Mg",2,3,141,738,1.31,null],
  [13,"Aluminum","Al",13,3,121,578,1.61,42.5], [14,"Silicon","Si",14,3,111,787,1.90,133.6],
  [15,"Phosphorus","P",15,3,107,1012,2.19,72], [16,"Sulfur","S",16,3,105,1000,2.58,200.4],
  [17,"Chlorine","Cl",17,3,102,1251,3.16,349], [18,"Argon","Ar",18,3,106,1521,null,null],
  [19,"Potassium","K",1,4,203,419,.82,48.4], [20,"Calcium","Ca",2,4,176,590,1.00,2.4],
].map(row=>({z:row[0] as number,name:row[1] as string,symbol:row[2] as string,group:row[3] as number,period:row[4] as number,radius:row[5] as number,ionization:row[6] as number,en:row[7] as number|null,affinity:row[8] as number|null,character:[3,4,11,12,13,19,20].includes(row[0] as number)?"Metal":[5,14].includes(row[0] as number)?"Metalloid":"Non-metal"}));
export function atom(v:Values) {
  let left = v.electrons;
  const orbitals = [{name:"1s",n:1,boxes:1},{name:"2s",n:2,boxes:1},{name:"2p",n:2,boxes:3},{name:"3s",n:3,boxes:1},{name:"3p",n:3,boxes:3}].map(o=>{
    const count=Math.min(left,o.boxes*2);left-=count;
    return {...o,count,occupancy:Array.from({length:o.boxes},(_,i)=>(count>i?1:0)+(count>o.boxes+i?1:0))};
  });
  return {element:elements[v.protons-1],mass:v.protons+v.neutrons,charge:v.protons-v.electrons,orbitals,shells:[1,2,3].map(n=>orbitals.filter(o=>o.n===n).reduce((s,o)=>s+o.count,0)),configuration:orbitals.filter(o=>o.count>0).map(o=>`${o.name}${String(o.count).replace(/[0-9]/g,d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[+d])}`).join(" ")||"No electrons"};
}
export function heating(heat:number) {
  if(heat<42) return {temperature:-20+heat/2.1,phase:"Solid ice",fraction:0};
  if(heat<376) return {temperature:0,phase:"Melting / freezing",fraction:(heat-42)/334};
  if(heat<794.4) return {temperature:(heat-376)/4.184,phase:"Liquid water",fraction:1};
  if(heat<3051.4) return {temperature:100,phase:"Boiling / condensation",fraction:(heat-794.4)/2257};
  return {temperature:100+(heat-3051.4)/2,phase:"Water vapor",fraction:1};
}
// NIST WebBook / Stull (1947), Antoine coefficients, valid 255.9–373 K.
export function vaporExchange(v:Values) {
  const saturation=100*10**(4.6543-1435.264/(v.surfaceTemperature+273.15-64.848));
  const vapor=saturation*(v.humidity/100);
  return {saturation,vapor,difference:saturation-vapor,state:v.humidity===100?"Dynamic equilibrium":v.humidity<100?"Net evaporation":"Net condensation"};
}
export function diffusionProfile(x:number,time:number,temperature:number) {
  if(time===0) return x<.5?1:x>.5?0:.5;
  const D=.007*(temperature/300)**1.5;
  let c=.5;
  for(let n=1;n<100;n+=2)c+=2/(n*Math.PI)*Math.sin(n*Math.PI/2)*Math.cos(n*Math.PI*x)*Math.exp(-D*n*n*Math.PI*Math.PI*time);
  return clamp(c,0,1);
}
export const compounds = [
  {formula:"H₂O",name:"Water",mass:18.015,entity:"molecules",parts:"2 × 1.008 + 15.999"},
  {formula:"NaCl",name:"Sodium chloride",mass:58.44,entity:"formula units",parts:"22.99 + 35.45"},
  {formula:"CO₂",name:"Carbon dioxide",mass:44.009,entity:"molecules",parts:"12.011 + 2 × 15.999"},
  {formula:"C₆H₁₂O₆",name:"Glucose",mass:180.156,entity:"molecules",parts:"6 × 12.011 + 12 × 1.008 + 6 × 15.999"},
  {formula:"CaCO₃",name:"Calcium carbonate",mass:100.086,entity:"formula units",parts:"40.078 + 12.011 + 3 × 15.999"},
];
export function moleAmounts(v:Values){const compound=compounds[v.compound];const moles=v.mass/compound.mass;return{compound,moles,particles:moles*AVOGADRO,concentration:moles/v.volume};}
export function dilution(v:Values){const volume=v.aliquot+v.water,mmol=v.stock*v.aliquot;return{volume,mmol,concentration:mmol/volume,factor:volume/v.aliquot};}
// Acid/acetate mass balance and charge balance, robust beyond the buffer region.
export function buffer(v:Values){
  const total=(v.acid+v.base)/1000/v.volume,netCations=(v.base+v.dose)/1000/v.volume,ka=1.8e-5;
  let lo=-14,hi=1;
  for(let i=0;i<100;i++){const logh=(lo+hi)/2,h=10**logh,residual=h+netCations-total*ka/(ka+h)-1e-14/h;if(residual>0)hi=logh;else lo=logh;}
  const h=10**((lo+hi)/2),acetate=total*ka/(ka+h),acid=total-acetate;
  return {ph:-Math.log10(h),acetate,acid,total,inRange:acetate/acid>=.1&&acetate/acid<=10,remainingAcid:Math.max(0,v.acid-v.dose),remainingBase:Math.max(0,v.base+v.dose)};
}
export function equilibriumK(v:Values){const dh=v.enthalpy===1?-20000:20000;return 4*Math.exp(-dh/R*(1/v.temperature-1/298));}
export function equilibriumTarget(v:Values){
  const k=equilibriumK(v);let lo=-v.b/2,hi=v.a;
  for(let i=0;i<90;i++){const x=(lo+hi)/2,a=(v.a-x)/v.volume,b=(v.b+2*x)/v.volume;if(b*b>k*a)hi=x;else lo=x;}
  return (lo+hi)/2;
}
export function equilibrium(v:Values,time=v.elapsed){
  const k=equilibriumK(v),kf=.12,kr=kf/k;
  // Exact mass-action solution for d[B]/dt = 2kf(S − [B]/2) − 2kr[B]².
  // S = [A] + [B]/2 is conserved; stable root evaluation avoids cancellation.
  const conserved=(v.a+v.b/2)/v.volume,initialB=v.b/v.volume;
  const decay=Math.sqrt(kf*kf+16*kr*kf*conserved);
  const positive=4*kf*conserved/(decay+kf),negative=-(decay+kf)/(4*kr);
  const ratio=(initialB-positive)/(initialB-negative)*Math.exp(-decay*time);
  const b=(positive-ratio*negative)/(1-ratio);
  const a=conserved-b/2,extent=equilibriumTarget(v);
  return {a,b,k,forward:kf*a,reverse:kr*b*b,pressure:(a+b)*R*v.temperature,eqA:(v.a-extent)/v.volume,eqB:(v.b+2*extent)/v.volume,quotient:a>0?b*b/a:Infinity};
}
export function calorimetry(v:Values){const dh=v.mode===1?436+243-2*v.formed:v.enthalpy,heat=v.moles*dh*1000,capacity=v.mass*4.184+v.cup;return{dh,heat,capacity,delta:-heat/capacity,final:v.initial-heat/capacity,broken:679,formed:2*v.formed};}
export function electrochemistry(v:Values){const voltage=1.1-R*298.15/(2*F)*Math.log(v.zinc/v.copper),charge=v.current*v.minutes*60,electrons=charge/F,mass=electrons/2*63.546*v.efficiency/100;return{voltage,charge,electrons,mass};}
export function enzyme(v:Values,substrate=v.substrate){const vmax=v.enzyme,km=1+v.inhibitor;return{vmax,km,rate:vmax*substrate/(km+substrate),uninhibited:vmax*substrate/(1+substrate)};}
export const reactionExamples = [
  {equation:"AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)",reactants:["AgNO₃","NaCl"],products:["AgCl(s)","NaNO₃"],left:[1,1],right:[1,1],type:"Precipitation · double displacement",net:"Ag⁺(aq) + Cl⁻(aq) → AgCl(s)",evidence:"White AgCl precipitate forms. Na⁺ and NO₃⁻ remain in solution.",energy:"Formation of an insoluble ionic solid"},
  {equation:"HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)",reactants:["HCl","NaOH"],products:["NaCl","H₂O"],left:[1,1],right:[1,1],type:"Acid–base neutralization",net:"H₃O⁺(aq) + OH⁻(aq) → 2 H₂O(l)",evidence:"Hydronium and hydroxide are consumed; the solution warms.",energy:"Exothermic · about −57 kJ per mol water formed in dilute solution"},
  {equation:"Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s)",reactants:["Zn","CuSO₄"],products:["ZnSO₄","Cu(s)"],left:[1,1],right:[1,1],type:"Single displacement · redox",net:"Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)",evidence:"Copper deposits as zinc dissolves. Sulfate is a spectator ion.",energy:"Thermodynamically favorable at standard conditions"},
  {equation:"CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g)",reactants:["CH₄","O₂"],products:["CO₂","H₂O(g)"],left:[1,2],right:[1,2],type:"Combustion · redox",net:"C: −4 → +4 · O: 0 → −2",evidence:"After ignition, energy is released as methane reacts with oxygen.",energy:"Exothermic · products lie below reactants in enthalpy"},
  {equation:"CaCO₃(s) → CaO(s) + CO₂(g)",reactants:["CaCO₃"],products:["CaO","CO₂"],left:[1],right:[1,1],type:"Thermal decomposition",net:"Carbonate → oxide + carbon dioxide",evidence:"Strong heating can release carbon dioxide from calcium carbonate.",energy:"Endothermic · heating supplies energy"},
];
export const redoxExamples = [
  {oxidized:"Zn: 0 → +2",reduced:"Cu: +2 → 0",reducing:"Zn(s)",oxidizing:"Cu²⁺(aq)",oxidation:"Zn → Zn²⁺ + 2 e⁻",reduction:"Cu²⁺ + 2 e⁻ → Cu",multipliers:"1 × oxidation; 1 × reduction",electrons:2,balanced:"Zn + Cu²⁺ → Zn²⁺ + Cu",charge:"+2 → +2",atoms:"Zn: 1 → 1 · Cu: 1 → 1"},
  {oxidized:"Fe: +2 → +3",reduced:"Mn: +7 → +2",reducing:"Fe²⁺(aq)",oxidizing:"MnO₄⁻(aq)",oxidation:"Fe²⁺ → Fe³⁺ + e⁻",reduction:"MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O",multipliers:"5 × oxidation; 1 × reduction",electrons:5,balanced:"5 Fe²⁺ + MnO₄⁻ + 8 H⁺ → 5 Fe³⁺ + Mn²⁺ + 4 H₂O",charge:"+17 → +17",atoms:"Fe: 5 → 5 · Mn: 1 → 1 · O: 4 → 4 · H: 8 → 8"},
  {oxidized:"I: −1 → 0",reduced:"Cr: +6 → +3",reducing:"I⁻(aq)",oxidizing:"Cr₂O₇²⁻(aq)",oxidation:"2 I⁻ → I₂ + 2 e⁻",reduction:"Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O",multipliers:"3 × oxidation; 1 × reduction",electrons:6,balanced:"6 I⁻ + Cr₂O₇²⁻ + 14 H⁺ → 3 I₂ + 2 Cr³⁺ + 7 H₂O",charge:"+6 → +6",atoms:"I: 6 → 6 · Cr: 2 → 2 · O: 7 → 7 · H: 14 → 14"},
];
export const metals=[{symbol:"Mg",ion:"Mg²⁺",e:-2.37,z:2},{symbol:"Zn",ion:"Zn²⁺",e:-.76,z:2},{symbol:"Fe",ion:"Fe²⁺",e:-.44,z:2},{symbol:"Cu",ion:"Cu²⁺",e:.34,z:2},{symbol:"Ag",ion:"Ag⁺",e:.80,z:1}];
export function metalReaction(v:Values){const metal=metals[v.metal],ion=metals[v.ion],voltage=ion.e-metal.e,electrons=metal.z===ion.z?metal.z:2;return{metal,ion,voltage,favorable:voltage>0,stripCoefficient:electrons/metal.z,ionCoefficient:electrons/ion.z,electrons};}
export const functionalGroups=[{name:"Alcohol",formula:"CH₃–CH₂–OH",group:"–OH",note:"Hydroxyl group attached to saturated carbon."},{name:"Aldehyde",formula:"CH₃–CH=O",group:"–CHO",note:"Terminal carbonyl group with a hydrogen on its carbon."},{name:"Ketone",formula:"CH₃–C(=O)–CH₃",group:">C=O",note:"Carbonyl carbon bonded to two carbon groups."},{name:"Carboxylic acid",formula:"CH₃–C(=O)–OH",group:"–COOH",note:"Carboxyl group combines carbonyl and hydroxyl."},{name:"Ester",formula:"CH₃–C(=O)–O–CH₂–CH₃",group:"–COO–",note:"Acyl group connected to an alkoxy group."},{name:"Amine",formula:"CH₃–NH₂",group:"–NH₂",note:"Nitrogen-containing group; methylamine is a weak base."}];
export function organic(v:Values){
  const step=v.step;
  if(v.family===0)return {name:"Ethane · alkane",formula:"CH₃–CH₃",note:"Single C–C bond; each carbon has four bonds in total.",kind:"Saturated hydrocarbon"};
  if(v.family===1)return {name:"Ethene · alkene",formula:"CH₂=CH₂",note:"A C=C bond contains one σ bond and one π bond; each carbon is approximately trigonal planar.",kind:"Unsaturated hydrocarbon"};
  if(v.family===2)return {name:"Ethyne · alkyne",formula:"CH≡CH",note:"A C≡C bond contains one σ and two π bonds; the carbon skeleton is linear.",kind:"Unsaturated hydrocarbon"};
  if(v.family===3)return {name:step%2?"2-methylpropane":"Butane",formula:step%2?"CH₃–CH(CH₃)–CH₃":"CH₃–CH₂–CH₂–CH₃",note:"Both structures are C₄H₁₀. Connectivity changes while molecular formula stays fixed.",kind:"Structural isomers"};
  if(v.family===4){const g=functionalGroups[v.group];return{name:g.name,formula:g.formula,note:g.note,kind:`Functional group: ${g.group}`};}
  if(v.family===5)return {name:["Reactants","Protonation","Nucleophilic attack","Addition product"][step],formula:["CH₂=CH₂ + H–Br","CH₃–CH₂⁺ + Br⁻","CH₃–CH₂⁺ ← :Br⁻","CH₃–CH₂–Br"][step],note:["The alkene π electrons can accept a proton from HBr.","A π-electron pair forms a C–H bond; the H–Br bond pair goes to bromine.","A lone pair on bromide forms a bond to the carbocation.","Bromoethane is formed; the double bond has become a single bond."][step],kind:"Electrophilic addition · electron-pair movement"};
  if(v.family===6)return {name:["Initiation · UV light","Propagation 1","Propagation 2","Termination example"][step],formula:["Cl–Cl → 2 Cl•","Cl• + CH₄ → HCl + •CH₃","•CH₃ + Cl₂ → CH₃Cl + Cl•","Cl• + Cl• → Cl₂"][step],note:["Light splits a Cl–Cl bond homolytically, one electron to each chlorine.","A chlorine radical abstracts hydrogen, creating a methyl radical.","The methyl radical forms chloromethane and regenerates Cl•.","Two radicals combine. Other termination reactions and further substitutions are possible."][step],kind:"Free-radical substitution · single-electron movement"};
  if(v.family===7)return{name:"Complete combustion",formula:step===0?"CH₄ + 2 O₂":"CH₄ + 2 O₂ → CO₂ + 2 H₂O",note:"With sufficient oxygen and ignition, complete combustion conserves 1 C, 4 H, and 4 O atoms. This equation summarizes many elementary steps.",kind:"Exothermic oxidation"};
  return {name:["Ethene monomer","Radical initiation","Chain propagation","Polyethylene repeat unit"][step],formula:["CH₂=CH₂","R• + CH₂=CH₂ → R–CH₂–CH₂•","R–(CH₂–CH₂)ₙ• + CH₂=CH₂ → R–(CH₂–CH₂)ₙ₊₁•","[–CH₂–CH₂–]ₙ"][step],note:["The π bond can open while the σ bond remains.","An initiator radical adds to a monomer; a new radical remains on the chain end.","Additional monomers form C–C bonds and lengthen the chain.","Repeating ethene units form polyethylene; the brackets indicate continuation."][step],kind:"Addition polymerization"};
}
