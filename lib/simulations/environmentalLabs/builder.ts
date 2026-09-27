import { activities, initialValues, type Values } from "./model";
export type AssetKind="trees"|"roof"|"garden"|"factory"|"farm"|"water"|"capture"|"pump"|"solar"|"wind"|"battery"|"house"|"road"|"transit"|"clearing"|"corridor"|"wetland"|"drain"|"barrier"|"warning";
export type BuildTool={id:string;label:string;kind:AssetKind;key:string;delta:number;zone:"land"|"water";detail:string};
export type Placement={id:number;tool:string;col:number;row:number};
export type BuildState={values:Values;placements:Placement[];nextId:number};
const t=(id:string,label:string,kind:AssetKind,key:string,delta:number,detail:string,zone:"land"|"water"="land"):BuildTool=>({id,label,kind,key,delta,detail,zone});
export const buildTools:Record<string,BuildTool[]>={
 "greenhouse-effect-simulator":[t("co2","CO₂ source","factory","co2",20,"CO₂ scenario +20 ppm"),t("methane","Methane source","farm","methane",100,"Methane scenario +100 ppb"),t("reflect","Reflective district","roof","albedo",.005,"Planetary reflectivity +0.005")],
 "carbon-cycle-simulator":[t("forest","Forest restoration","trees","forest",1,"Land sink capacity +1 GtCO₂/year"),t("ocean","Ocean sink scenario","water","ocean",1,"Ocean sink capacity +1 GtCO₂/year","water"),t("capture","Carbon capture","capture","removal",1,"Removal +1 GtCO₂/year"),t("industry","Emitting industry","factory","emissions",2,"Emissions +2 GtCO₂/year")],
 "sea-level-rise-simulator":[t("pump","Groundwater pumping","pump","subsidence",.5,"Subsidence scenario +0.5 mm/year"),t("restore","Subsidence reduction","garden","subsidence",-.5,"Subsidence scenario −0.5 mm/year")],
 "ocean-acidification-simulator":[t("outfall","Nutrient discharge","factory","nutrients",10,"Local respiration pressure +10"),t("wetland","Runoff treatment","wetland","nutrients",-10,"Local respiration pressure −10"),t("co2","Higher CO₂ scenario","capture","co2",40,"Atmospheric CO₂ scenario +40 ppm")],
 "renewable-energy-grid-simulator":[t("solar","Solar park","solar","solar",20,"Solar capacity +20 MW"),t("wind","Wind farm","wind","wind",20,"Wind capacity +20 MW"),t("battery","Battery station","battery","storage",50,"Storage +50 MWh"),t("hydro","Hydropower","water","hydro",10,"Hydro capacity +10 MW","water"),t("gas","Gas power plant","factory","gas",10,"Gas capacity +10 MW"),t("homes","Housing district","house","demand",10,"Typical demand +10 MW")],
 "air-pollution-smog-simulator":[t("transit","Public transport","transit","traffic",-10,"Traffic emission index −10"),t("industry","Industrial district","factory","industry",10,"Industry emission index +10"),t("clean","Industry retrofit","capture","industry",-10,"Industry emission index −10"),t("traffic","Busy road","road","traffic",10,"Traffic emission index +10")],
 "deforestation-water-cycle-simulator":[t("forest","Tree grove","trees","forest",10,"Forest cover +10 percentage points"),t("clearing","Clear forest","clearing","forest",-10,"Forest cover −10 percentage points"),t("pave","Compact soil","road","compaction",10,"Soil compaction index +10"),t("restore","Restore soil","garden","compaction",-10,"Soil compaction index −10")],
 "biodiversity-habitat-fragmentation":[t("habitat","Habitat grove","trees","habitat",10,"Habitat area +10 percentage points"),t("corridor","Wildlife corridor","corridor","corridor",15,"Corridor restoration index +15"),t("road","Habitat barrier","road","patches",1,"Fragmentation scenario +1 patch"),t("clean","Restore habitat","wetland","pollution",-10,"Habitat stress index −10")],
 "urban-heat-island-simulator":[t("trees","Tree grove","trees","trees",10,"Canopy +10 percentage points"),t("roofs","Cool-roof district","roof","coolRoofs",10,"Reflective roofs +10 percentage points"),t("garden","Rain garden","garden","permeable",10,"Permeable ground +10 percentage points"),t("paving","Paved district","road","permeable",-10,"Permeable ground −10 percentage points")],
 "climate-resilience-city-builder":[t("wetland","Wetlands","wetland","wetlands",5,"Wetland investment +5 points"),t("drain","Drainage","drain","drainage",5,"Drainage investment +5 points"),t("shade","Shade trees","trees","shade",5,"Cooling investment +5 points"),t("barrier","Flood barrier","barrier","barriers",5,"Barrier investment +5 points"),t("warning","Warning tower","warning","warning",5,"Warning investment +5 points")],
};
export const MAP_SIZE=12;
export const reservedCells=new Set(["4,1","5,1","4,9","5,9","7,2","8,2","9,2","7,3","9,3","7,8","8,8","9,8"]);
export function cellZone(col:number,row:number):"land"|"water"|"blocked" {
 if(!Number.isInteger(col)||!Number.isInteger(row)||col<0||row<0||col>=MAP_SIZE||row>=MAP_SIZE)return "blocked";
 if(col<3)return "water";
 if(row===5||row===6||reservedCells.has(`${col},${row}`))return "blocked";
 return "land";
}
export function createBuildState(slug:string):BuildState{return {values:initialValues(activities.find(a=>a.slug===slug)!),placements:[],nextId:1};}
export function placementProblem(state:BuildState,tool:BuildTool,col:number,row:number,movingId?:number):string|null {
 if(cellZone(col,row)!==tool.zone)return tool.zone==="water"?"Place this project in the water on the west side.":"Choose an open land plot, away from roads and existing buildings.";
 if(state.placements.some(p=>p.id!==movingId&&p.col===col&&p.row===row))return "That plot is occupied. Move or remove its project first.";
 return null;
}
function valueProblem(slug:string,values:Values,key:string,delta:number):string|null {
 const control=activities.find(a=>a.slug===slug)!.controls.find(c=>c.key===key)!;
 const next=values[key]+delta;
 if(next<control.min-1e-8||next>control.max+1e-8)return `${control.label} must stay between ${control.min} and ${control.max} ${control.unit}.`;
 if(slug==="climate-resilience-city-builder"&&["wetlands","drainage","shade","barriers","warning"].reduce((sum,k)=>sum+values[k],delta)>100+1e-8)return "The 100-point budget is full. Remove a project or undo an edit first.";
 return null;
}
export function editBuild(slug:string,state:BuildState,action:{type:"place";tool:string;col:number;row:number}|{type:"move";id:number;col:number;row:number}|{type:"remove";id:number}):{state:BuildState;message:string;ok:boolean} {
 const existing=action.type!=="place"?state.placements.find(p=>p.id===action.id):undefined;
 const tool=buildTools[slug]?.find(t=>t.id===(action.type==="place"?action.tool:existing?.tool));
 const fail=(message:string)=>({state,message,ok:false});if(!tool)return fail("Choose a project from the build dock first.");
 if(action.type!=="remove") {const error=placementProblem(state,tool,action.col,action.row,existing?.id);if(error)return fail(error);}
 if(action.type==="move")return {state:{...state,placements:state.placements.map(p=>p.id===action.id?{...p,col:action.col,row:action.row}:p)},message:`${tool.label} moved. Model totals are unchanged.`,ok:true};
 const delta=action.type==="remove"?-tool.delta:tool.delta,error=valueProblem(slug,state.values,tool.key,delta);if(error)return fail(error);
 const values={...state.values,[tool.key]:Number((state.values[tool.key]+delta).toFixed(6))};
 const placements=action.type==="remove"?state.placements.filter(p=>p.id!==action.id):[...state.placements,{id:state.nextId,tool:tool.id,col:action.col,row:action.row}];
 return {state:{values,placements,nextId:state.nextId+(action.type==="place"?1:0)},message:action.type==="remove"?`${tool.label} removed; its model change was reversed.`:`${tool.label} built. ${tool.detail}.`,ok:true};
}
