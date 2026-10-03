import { elementBySymbol, neutralValences } from './elements';

export type Position = [number, number, number];
export type BuilderAtom = { id: number; element: string; position: Position; charge: number };
export type BuilderBond = { a: number; b: number; order: 1 | 2 | 3 };
export type Structure = { atoms: BuilderAtom[]; bonds: BuilderBond[] };
export const MAX_ATOMS = 200;
export const emptyStructure: Structure = { atoms: [], bonds: [] };
export function bondSum(s: Structure, id: number) { return s.bonds.reduce((n, b) => n + (b.a === id || b.b === id ? b.order : 0), 0); }
export function formula(s: Structure) {
  const counts: Record<string, number> = {};
  s.atoms.forEach(a => { counts[a.element] = (counts[a.element] ?? 0) + 1; });
  const keys = Object.keys(counts).sort();
  const ordered = counts.C ? ['C', ...(counts.H ? ['H'] : []), ...keys.filter(k => k !== 'C' && k !== 'H')] : keys;
  return ordered.map(k => k + (counts[k] > 1 ? counts[k] : '')).join('') || 'Empty';
}
export function fragments(s: Structure) {
  const seen = new Set<number>(); let count = 0;
  for (const atom of s.atoms) {
    if (seen.has(atom.id)) continue;
    count++; const stack = [atom.id];
    while (stack.length) { const id = stack.pop()!; if (seen.has(id)) continue; seen.add(id); for (const b of s.bonds) { if (b.a === id) stack.push(b.b); if (b.b === id) stack.push(b.a); } }
  }
  return count;
}
export function valenceNotes(s: Structure) {
  return s.atoms.flatMap(a => {
    const valences = neutralValences[a.element], sum = bondSum(s, a.id);
    if (a.charge || !valences) return [`${a.element}${a.id}: no reference check for ${a.charge ? 'charged atoms' : 'this element'}.`];
    return valences.includes(sum) ? [] : [`${a.element}${a.id}: bond order ${sum}; common neutral values ${valences.join(', ')}.`];
  });
}
export function removeAtom(s: Structure, id: number): Structure { return { atoms:s.atoms.filter(a => a.id !== id), bonds:s.bonds.filter(b => b.a !== id && b.b !== id) }; }
export function connect(s: Structure, a: number, b: number, order: 1|2|3): Structure {
  if (a === b || !s.atoms.some(x => x.id === a) || !s.atoms.some(x => x.id === b)) return s;
  return { ...s, bonds:[...s.bonds.filter(x => !(x.a === a && x.b === b || x.a === b && x.b === a)), { a,b,order }] };
}
// Deterministic spatial placement with collision avoidance. Coordinates are illustrative Å.
export function addAtom(s: Structure, element: string, parent: number | null, order: 1|2|3): Structure {
  if (!elementBySymbol[element] || s.atoms.length >= MAX_ATOMS) return s;
  const anchor = s.atoms.find(a => a.id === parent), id = Math.max(0, ...s.atoms.map(a => a.id)) + 1;
  let position: Position = [s.atoms.length ? Math.max(...s.atoms.map(a=>a.position[0])) + 3 : 0, 0, 0];
  if (anchor) {
    let best = -Infinity;
    for (let i=0;i<80;i++) {
      const y = 1 - 2*(i+.5)/80, r = Math.sqrt(1-y*y), angle = i*2.399963;
      const direction = [r*Math.cos(angle),y,r*Math.sin(angle)], length = element === 'H' || anchor.element === 'H' ? 1.1 : 1.5;
      const candidate = anchor.position.map((p,j) => p+direction[j]*length) as Position;
      const score = Math.min(...s.atoms.filter(a=>a.id!==parent).map(a=>a.position.reduce((sum,p,j)=>sum+(p-candidate[j])**2,0)), 100);
      if (score > best) { best=score; position=candidate; }
    }
  }
  const next = { atoms:[...s.atoms,{id,element,position,charge:0}], bonds:[...s.bonds] };
  return anchor ? connect(next, anchor.id, id, order) : next;
}
export function fillHydrogens(s: Structure): Structure {
  let next=s;
  for (const atom of s.atoms) {
    const valences=neutralValences[atom.element];
    if (!valences || atom.charge || atom.element === 'H') continue;
    const sum=bondSum(next,atom.id), target=valences.find(v=>v>=sum);
    if (target === undefined) continue;
    for (let i=sum;i<target;i++) next=addAtom(next,'H',atom.id,1);
  }
  return next;
}
export function parseStructure(text: string): Structure {
  const raw: unknown=JSON.parse(text);
  if (!raw || typeof raw !== 'object') throw new Error('Choose a Molecule Builder JSON file.');
  const {atoms,bonds}=raw as Structure;
  if (!Array.isArray(atoms) || !Array.isArray(bonds) || atoms.length>MAX_ATOMS || bonds.length>1000) throw new Error('Invalid structure or size limit exceeded (200 atoms).');
  const ids=new Set<number>();
  for (const a of atoms) {
    if (!a || !Number.isSafeInteger(a.id) || a.id<1 || ids.has(a.id) || !Object.hasOwn(elementBySymbol,a.element) || !Array.isArray(a.position) || a.position.length!==3 || !a.position.every(p=>typeof p==='number' && Number.isFinite(p) && Math.abs(p)<=1000) || !Number.isInteger(a.charge) || Math.abs(a.charge)>8) throw new Error('Invalid atom data.');
    ids.add(a.id);
  }
  const pairs=new Set<string>();
  for (const b of bonds) {
    const pair=b && [b.a,b.b].sort((a,b)=>a-b).join(':');
    if (!b || !ids.has(b.a) || !ids.has(b.b) || b.a===b.b || ![1,2,3].includes(b.order) || pairs.has(pair)) throw new Error('Invalid or duplicate bond.');
    pairs.add(pair);
  }
  return { atoms:atoms.map(a=>({id:a.id,element:a.element,position:[...a.position],charge:a.charge})), bonds:bonds.map(b=>({a:b.a,b:b.b,order:b.order})) };
}
export function toXYZ(s: Structure) { return `${s.atoms.length}\n${formula(s)} | illustrative coordinates in angstroms; not energy optimized\n${s.atoms.map(a=>`${a.element} ${a.position.map(p=>p.toFixed(6)).join(' ')}`).join('\n')}\n`; }
export function toMol(s: Structure) {
  const pad=(n:number)=>String(n).padStart(3,' ');
  return [formula(s),'  LearnerKits  3D','Illustrative coordinates; not energy optimized',`${pad(s.atoms.length)}${pad(s.bonds.length)}  0  0  0  0            999 V2000`,...s.atoms.map(a=>`${a.position.map(p=>p.toFixed(4).padStart(10,' ')).join('')} ${a.element.padEnd(3,' ')} 0  0  0  0  0  0  0  0  0  0  0  0`),...s.bonds.map(b=>`${pad(s.atoms.findIndex(a=>a.id===b.a)+1)}${pad(s.atoms.findIndex(a=>a.id===b.b)+1)}${pad(b.order)}  0  0  0  0`),...s.atoms.filter(a=>a.charge).map(a=>`M  CHG  1${String(s.atoms.indexOf(a)+1).padStart(4)}${String(a.charge).padStart(4)}`),'M  END',''].join('\n');
}
function preset(atoms: [string,number,number,number][], bonds: [number,number,1|2|3][]): Structure { return {atoms:atoms.map(([element,x,y,z],i)=>({id:i+1,element,position:[x,y,z],charge:0})),bonds:bonds.map(([a,b,order])=>({a,b,order}))}; }
const benzene = preset(Array.from({length:6},(_,i)=>['C',1.4*Math.cos(i*Math.PI/3),1.4*Math.sin(i*Math.PI/3),0]),Array.from({length:6},(_,i)=>[i+1,(i+1)%6+1,i%2?1:2]));
export const builderPresets = [
  {name:'Water',group:'Essentials',structure:preset([['O',0,0,0],['H',.76,.59,0],['H',-.76,.59,0]],[[1,2,1],[1,3,1]])},
  {name:'Methane',group:'Essentials',structure:preset([['C',0,0,0],['H',.63,.63,.63],['H',.63,-.63,-.63],['H',-.63,.63,-.63],['H',-.63,-.63,.63]],[[1,2,1],[1,3,1],[1,4,1],[1,5,1]])},
  {name:'Carbon dioxide',group:'Essentials',structure:preset([['C',0,0,0],['O',-1.16,0,0],['O',1.16,0,0]],[[1,2,2],[1,3,2]])},
  {name:'Ammonia',group:'Essentials',structure:preset([['N',0,.3,0],['H',.94,0,0],['H',-.47,0,.81],['H',-.47,0,-.81]],[[1,2,1],[1,3,1],[1,4,1]])},
  {name:'Nitrogen',group:'Essentials',structure:preset([['N',-.55,0,0],['N',.55,0,0]],[[1,2,3]])},
  {name:'Ethanol',group:'Organic',structure:fillHydrogens(preset([['C',-1.3,0,0],['C',0,.75,0],['O',1.25,0,0]],[[1,2,1],[2,3,1]]))},
  {name:'Ethene',group:'Organic',structure:preset([['C',-.67,0,0],['C',.67,0,0],['H',-1.21,.94,0],['H',-1.21,-.94,0],['H',1.21,.94,0],['H',1.21,-.94,0]],[[1,2,2],[1,3,1],[1,4,1],[2,5,1],[2,6,1]])},
  {name:'Acetylene',group:'Organic',structure:preset([['C',-.6,0,0],['C',.6,0,0],['H',-1.66,0,0],['H',1.66,0,0]],[[1,2,3],[1,3,1],[2,4,1]])},
  {name:'Benzene',group:'Rings',structure:{atoms:[...benzene.atoms,...Array.from({length:6},(_,i)=>({id:i+7,element:'H',position:[2.48*Math.cos(i*Math.PI/3),2.48*Math.sin(i*Math.PI/3),0] as Position,charge:0}))],bonds:[...benzene.bonds,...Array.from({length:6},(_,i)=>({a:i+1,b:i+7,order:1 as const}))]}},
  {name:'Sulfur hexafluoride',group:'Expanded valence',structure:preset([['S',0,0,0],['F',1.56,0,0],['F',-1.56,0,0],['F',0,1.56,0],['F',0,-1.56,0],['F',0,0,1.56],['F',0,0,-1.56]],Array.from({length:6},(_,i)=>[1,i+2,1]))},
];
