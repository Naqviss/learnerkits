import { describe, expect, it } from 'vitest';
import { elements } from '@/lib/simulations/chemistry/elements';
import { addAtom, bondSum, builderPresets, connect, emptyStructure, fillHydrogens, formula, fragments, parseStructure, removeAtom, toMol, toXYZ, valenceNotes } from '@/lib/simulations/chemistry/builder';

describe('complete molecular element palette',()=>{
  it('contains all 118 unique elements in valid periodic-table cells',()=>{
    expect(elements).toHaveLength(118);
    expect(new Set(elements.map(e=>e.symbol)).size).toBe(118);
    expect(new Set(elements.map(e=>`${e.column}:${e.row}`)).size).toBe(118);
    expect(elements.at(-1)).toMatchObject({symbol:'Og',number:118,name:'Oganesson',column:18,row:7});
    expect(elements.find(e=>e.symbol==='Hf')).toMatchObject({column:4,row:6});
    expect(elements.find(e=>e.symbol==='Lu')).toMatchObject({column:17,row:9});
    for(const e of elements){expect(e.name).toBeTruthy();expect(e.color).toMatch(/^#[a-f\d]{6}$/i);expect(e.column).toBeGreaterThan(0);expect(e.column).toBeLessThanOrEqual(18);}
  });
});
describe('freeform molecular structures',()=>{
  it('builds chains, changes bond order, closes rings and removes incident bonds',()=>{
    let s=addAtom(emptyStructure,'C',null,1);
    s=addAtom(s,'C',1,1);s=addAtom(s,'C',2,1);
    s=connect(s,3,1,1);expect(s.bonds).toHaveLength(3);
    s=connect(s,1,2,2);expect(s.bonds).toHaveLength(3);expect(bondSum(s,1)).toBe(3);
    expect(connect(s,1,1,1)).toBe(s);expect(connect(s,1,99,1)).toBe(s);
    const removed=removeAtom(s,2);expect(removed.atoms).toHaveLength(2);expect(removed.bonds).toEqual([{a:3,b:1,order:1}]);
  });
  it('supports every element and bounded, non-overlapping placement',()=>{
    for(const e of elements){const s=addAtom(emptyStructure,e.symbol,null,1);expect(s.atoms[0].element).toBe(e.symbol);}
    let s=addAtom(emptyStructure,'C',null,1);for(let i=0;i<4;i++)s=addAtom(s,'H',1,1);
    expect(new Set(s.atoms.map(a=>a.position.join(','))).size).toBe(5);
    expect(addAtom(s,'Missing',1,1)).toBe(s);
    let max=emptyStructure;for(let i=0;i<201;i++)max=addAtom(max,'He',null,1);expect(max.atoms).toHaveLength(200);
  });
  it('fills supported neutral valences without duplicating existing hydrogens',()=>{
    const methane=fillHydrogens(addAtom(emptyStructure,'C',null,1));
    expect(formula(methane)).toBe('CH4');expect(fillHydrogens(methane)).toEqual(methane);
    const iron=addAtom(emptyStructure,'Fe',null,1);expect(fillHydrogens(iron)).toEqual(iron);expect(valenceNotes(iron)[0]).toContain('no reference check');
    const ion={...methane,atoms:methane.atoms.map(a=>a.id===1?{...a,charge:1}:a)};expect(valenceNotes(ion)[0]).toContain('charged atoms');
  });
  it('presets contain consistent graphs and expected formulae',()=>{
    const formulae=['H2O','CH4','CO2','H3N','N2','C2H6O','C2H4','C2H2','C6H6','F6S'];
    builderPresets.forEach((p,i)=>{expect(formula(p.structure)).toBe(formulae[i]);expect(parseStructure(JSON.stringify(p.structure))).toEqual(p.structure);expect(fragments(p.structure)).toBe(1);expect(valenceNotes(p.structure)).toEqual([]);});
    expect(fragments(emptyStructure)).toBe(0);expect(fragments(addAtom(builderPresets[0].structure,'He',null,1))).toBe(2);
  });
  it('round-trips JSON and rejects malformed structures without coercion',()=>{
    const good=builderPresets[5].structure;
    expect(parseStructure(JSON.stringify({version:1,...good}))).toEqual(good);
    const atom=good.atoms[0];
    const bad=[null,{}, {atoms:[atom,atom],bonds:[]},{atoms:[{...atom,element:'toString'}],bonds:[]},{atoms:[{...atom,position:[0,0,'1']}],bonds:[]},{atoms:[{...atom,charge:99}],bonds:[]},{...good,bonds:[{a:1,b:999,order:1}]},{...good,bonds:[{a:1,b:1,order:1}]},{...good,bonds:[{a:1,b:2,order:4}]},{...good,bonds:[{a:1,b:2,order:1},{a:2,b:1,order:1}]}];
    bad.forEach(data=>expect(()=>parseStructure(JSON.stringify(data))).toThrow());
  });
  it('exports coordinates and MOL connectivity with mapped indices and charge',()=>{
    const s={atoms:[{id:4,element:'C',position:[0,0,0] as [number,number,number],charge:-1},{id:9,element:'N',position:[1.2,0,0] as [number,number,number],charge:0}],bonds:[{a:4,b:9,order:3 as const}]};
    expect(toXYZ(s)).toContain('2\nCN');expect(toXYZ(s)).toContain('N 1.200000 0.000000 0.000000');
    const mol=toMol(s);expect(mol).toContain('  1  2  3');expect(mol).toContain('M  CHG  1   1  -1');expect(mol).toContain('V2000');expect(mol).toContain('M  END');
  });
});
