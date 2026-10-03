// IUPAC names and atomic numbers: https://iupac.org/what-we-do/periodic-table-of-elements/
const rows = `H Hydrogen,He Helium,Li Lithium,Be Beryllium,B Boron,C Carbon,N Nitrogen,O Oxygen,F Fluorine,Ne Neon,
Na Sodium,Mg Magnesium,Al Aluminium,Si Silicon,P Phosphorus,S Sulfur,Cl Chlorine,Ar Argon,
K Potassium,Ca Calcium,Sc Scandium,Ti Titanium,V Vanadium,Cr Chromium,Mn Manganese,Fe Iron,Co Cobalt,Ni Nickel,Cu Copper,Zn Zinc,Ga Gallium,Ge Germanium,As Arsenic,Se Selenium,Br Bromine,Kr Krypton,
Rb Rubidium,Sr Strontium,Y Yttrium,Zr Zirconium,Nb Niobium,Mo Molybdenum,Tc Technetium,Ru Ruthenium,Rh Rhodium,Pd Palladium,Ag Silver,Cd Cadmium,In Indium,Sn Tin,Sb Antimony,Te Tellurium,I Iodine,Xe Xenon,
Cs Caesium,Ba Barium,La Lanthanum,Ce Cerium,Pr Praseodymium,Nd Neodymium,Pm Promethium,Sm Samarium,Eu Europium,Gd Gadolinium,Tb Terbium,Dy Dysprosium,Ho Holmium,Er Erbium,Tm Thulium,Yb Ytterbium,Lu Lutetium,
Hf Hafnium,Ta Tantalum,W Tungsten,Re Rhenium,Os Osmium,Ir Iridium,Pt Platinum,Au Gold,Hg Mercury,Tl Thallium,Pb Lead,Bi Bismuth,Po Polonium,At Astatine,Rn Radon,
Fr Francium,Ra Radium,Ac Actinium,Th Thorium,Pa Protactinium,U Uranium,Np Neptunium,Pu Plutonium,Am Americium,Cm Curium,Bk Berkelium,Cf Californium,Es Einsteinium,Fm Fermium,Md Mendelevium,No Nobelium,Lr Lawrencium,
Rf Rutherfordium,Db Dubnium,Sg Seaborgium,Bh Bohrium,Hs Hassium,Mt Meitnerium,Ds Darmstadtium,Rg Roentgenium,Cn Copernicium,Nh Nihonium,Fl Flerovium,Mc Moscovium,Lv Livermorium,Ts Tennessine,Og Oganesson`;

export const familyColors: Record<string, string> = {
  'Nonmetal': '#9ecbb9', 'Noble gas': '#b6a8e0', 'Alkali metal': '#e6ae8c',
  'Alkaline earth': '#dcc58e', 'Transition metal': '#95bddd', 'Post-transition metal': '#a7c0cb',
  'Metalloid': '#96c8ce', 'Halogen': '#b9ce8c', 'Lanthanide': '#c7afd8', 'Actinide': '#d9a6b9',
};
const atomColors: Record<string, string> = { H:'#e8eff6', C:'#647b92', N:'#7794ff', O:'#f47788', F:'#8eddaf', Cl:'#8eddaf', P:'#eda668', S:'#f5d57f', Br:'#c98566', I:'#b895ec' };
// A deliberately limited neutral covalent reference, not a universal stability rule.
export const neutralValences: Record<string, number[]> = { H:[1], B:[3], C:[4], N:[3], O:[2], F:[1], Si:[4], P:[3,5], S:[2,4,6], Cl:[1], Br:[1], I:[1] };
export const elements = rows.split(',').map((entry, i) => {
  const [symbol, name] = entry.trim().split(' '), number = i + 1;
  const period = number <= 2 ? 1 : number <= 10 ? 2 : number <= 18 ? 3 : number <= 36 ? 4 : number <= 54 ? 5 : number <= 86 ? 6 : 7;
  let column: number;
  if (period === 1) column = number === 1 ? 1 : 18;
  else if (period <= 3) { const offset = number - (period === 2 ? 3 : 11); column = offset < 2 ? offset + 1 : offset + 11; }
  else { const start = [0,0,0,0,19,37,55,87][period]; const offset = number - start; column = offset > 16 && period >= 6 ? offset - 13 : offset + 1; }
  const lanthanide = number >= 57 && number <= 71, actinide = number >= 89 && number <= 103;
  const family = lanthanide ? 'Lanthanide' : actinide ? 'Actinide' : column === 18 ? 'Noble gas' : column === 17 ? 'Halogen' : column === 1 && number !== 1 ? 'Alkali metal' : column === 2 ? 'Alkaline earth' : ['B','Si','Ge','As','Sb','Te'].includes(symbol) ? 'Metalloid' : ['H','C','N','O','P','S','Se'].includes(symbol) ? 'Nonmetal' : column >= 3 && column <= 12 ? 'Transition metal' : 'Post-transition metal';
  return { symbol, name, number, period, column: lanthanide ? number - 54 : actinide ? number - 86 : column, row: lanthanide ? 9 : actinide ? 10 : period, family, color: atomColors[symbol] ?? familyColors[family] };
});
export const elementBySymbol = Object.fromEntries(elements.map(e => [e.symbol, e]));
