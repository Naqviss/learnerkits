// Measured central-atom bond lengths in picometers, each with the reference it was taken from.
// Shapes with two bond types (trigonal bipyramidal, seesaw, T-shaped, square pyramidal) list
// axial and equatorial values; square pyramidal uses axial for the apical bond and equatorial for basal.
// Values are gas-phase where available (mostly NIST CCCBDB); ions use crystal or solution values.
// Molecules without a verified value are omitted rather than estimated.
export type BondLength = { pm: number; axial?: undefined; equatorial?: undefined; source: string } | { pm?: undefined; axial: number; equatorial: number; source: string };

export const bondLengths: Record<string, BondLength> = {
  "CO₂": { pm: 116, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=124389&charge=0" },
  "BF₃": { pm: 131, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7637072&charge=0" },
  "CH₄": { pm: 109, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=74828&charge=0" },
  "NH₃": { pm: 101, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7664417&charge=0" },
  "H₂O": { pm: 96, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7732185&charge=0" },
  "CS₂": { pm: 155, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=75150&charge=0" },
  "BeF₂": { pm: 137, source: "https://europepmc.org/article/MED/16223284" },
  "MgCl₂": { pm: 218, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7786303&charge=0" },
  "ZnCl₂": { pm: 205, source: "https://it.wikipedia.org/wiki/Cloruro_di_zinco" },
  "ZnBr₂": { pm: 221, source: "https://en.wikipedia.org/wiki/Zinc_bromide" },
  "CdCl₂": { pm: 228, source: "https://iiste.org/Journals/index.php/JSTR/article/viewFile/49007/50639" },
  "N₃⁻": { pm: 118, source: "https://en.wikipedia.org/wiki/Sodium_azide" },
  "BCl₃": { pm: 174, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=10294345&charge=0" },
  "BBr₃": { pm: 189, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=10294334&charge=0" },
  "BI₃": { pm: 212, source: "https://academic.oup.com/bcsj/article-abstract/47/9/2337/7353868" },
  "AlCl₃": { pm: 206, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7446700&charge=0" },
  "AlF₃": { pm: 163, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7784181&charge=0" },
  "SO₃": { pm: 142, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7446119&charge=0" },
  "CO₃²⁻": { pm: 129, source: "https://chem.libretexts.org/Bookshelves/General_Chemistry/ChemPRIME_(Moore_et_al.)/07:_Further_Aspects_of_Covalent_Bonding/7.14:_Resonance" },
  "SO₂": { pm: 143, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7446095&charge=0" },
  "O₃": { pm: 128, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=10028156&charge=0" },
  "SnBr₂": { pm: 255, source: "https://en.wikipedia.org/wiki/Tin(II)_bromide" },
  "PbCl₂": { pm: 244, source: "https://en.wikipedia.org/wiki/Lead(II)_chloride" },
  "GeCl₂": { pm: 219, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=10060114&charge=0" },
  "GeF₂": { pm: 173, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=13940631&charge=0" },
  "CCl₄": { pm: 177, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=56235&charge=0" },
  "CF₄": { pm: 132, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=75730&charge=0" },
  "CBr₄": { pm: 194, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=558134&charge=0" },
  "SiH₄": { pm: 148, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7803625&charge=0" },
  "SiCl₄": { pm: 202, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=10026047&charge=0" },
  "SiF₄": { pm: 155, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783611&charge=0" },
  "SiBr₄": { pm: 218, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7789664&charge=0" },
  "GeH₄": { pm: 153, source: "https://commons.wikimedia.org/wiki/File:Germane-2D-dimensions.svg" },
  "GeF₄": { pm: 167, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783586&charge=0" },
  "SnCl₄": { pm: 228, source: "https://en.wikipedia.org/wiki/Tin(IV)_chloride" },
  "SnBr₄": { pm: 242, source: "https://en.wikipedia.org/wiki/Tin(IV)_bromide" },
  "TiCl₄": { pm: 217, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7550450&charge=0" },
  "PO₄³⁻": { pm: 153, source: "https://europepmc.org/article/MED/30156411" },
  "SO₄²⁻": { pm: 149, source: "https://en.wikipedia.org/wiki/Sulfate" },
  "ClO₄⁻": { pm: 144, source: "https://europepmc.org/article/MED/32022710" },
  "MnO₄⁻": { pm: 162, source: "https://en.wikipedia.org/wiki/Potassium_permanganate" },
  "XeO₄": { pm: 174, source: "https://it.wikipedia.org/wiki/Tetrossido_di_xeno" },
  "PH₃": { pm: 142, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7803512&charge=0" },
  "AsH₃": { pm: 151, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7784421&charge=0" },
  "SbH₃": { pm: 170, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7803523&charge=0" },
  "NF₃": { pm: 137, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783542&charge=0" },
  "PF₃": { pm: 156, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783553&charge=0" },
  "PCl₃": { pm: 204, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7719122&charge=0" },
  "PBr₃": { pm: 222, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7789608&charge=0" },
  "AsF₃": { pm: 171, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7784352&charge=0" },
  "AsCl₃": { pm: 217, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7784341&charge=0" },
  "ClO₃⁻": { pm: 149, source: "https://en.wikipedia.org/wiki/Chlorate" },
  "IO₃⁻": { pm: 180, source: "https://europepmc.org/article/MED/35459291" },
  "H₂S": { pm: 134, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783064&charge=0" },
  "H₂Se": { pm: 146, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783075&charge=0" },
  "H₂Te": { pm: 165, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783097&charge=0" },
  "OF₂": { pm: 141, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783417&charge=0" },
  "SCl₂": { pm: 201, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=10545990&charge=0" },
  "SeCl₂": { pm: 216, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=14457706&charge=0" },
  "TeCl₂": { pm: 233, source: "https://en.wikipedia.org/wiki/Tellurium_dichloride" },
  "PCl₅": { axial: 212, equatorial: 202, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=10026138&charge=0" },
  "PF₅": { axial: 158, equatorial: 153, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7647190&charge=0" },
  "AsF₅": { axial: 171, equatorial: 166, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7784363&charge=0" },
  "SbCl₅": { axial: 234, equatorial: 228, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7647189&charge=0" },
  "SF₄": { axial: 165, equatorial: 155, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7783600&charge=0" },
  "SeF₄": { axial: 177, equatorial: 168, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=13465662&charge=0" },
  "ClF₃": { axial: 170, equatorial: 160, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7790912&charge=0" },
  "BrF₃": { axial: 181, equatorial: 172, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7787715&charge=0" },
  "IF₃": { axial: 198, equatorial: 187, source: "https://it.wikipedia.org/wiki/Trifluoruro_di_iodio" },
  "XeF₂": { pm: 197, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=13709369&charge=0" },
  "ICl₂⁻": { pm: 255, source: "https://en.wikipedia.org/wiki/Caesium_dichloroiodate" },
  "SF₆": { pm: 156, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=2551624&charge=0" },
  "SeF₆": { pm: 169, source: "https://en.wikipedia.org/wiki/Selenium_hexafluoride" },
  "TeF₆": { pm: 184, source: "https://commons.wikimedia.org/wiki/File:Tellurium-hexafluoride-dimensions-2D.png" },
  "MoF₆": { pm: 182, source: "https://en.wikipedia.org/wiki/Molybdenum_hexafluoride" },
  "WF₆": { pm: 183, source: "https://en.wikipedia.org/wiki/Tungsten_hexafluoride" },
  "UF₆": { pm: 199, source: "https://www.chm.bris.ac.uk/motm/uf6/uf6v.htm" },
  "SiF₆²⁻": { pm: 168, source: "https://europepmc.org/article/PMC/PMC11525531" },
  "BrF₅": { axial: 169, equatorial: 177, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=7789302&charge=0" },
  "IF₅": { axial: 184, equatorial: 187, source: "https://commons.wikimedia.org/wiki/File:Iodine-pentafluoride-gas-2D-dimensions.png" },
  "ClF₅": { axial: 162, equatorial: 172, source: "https://commons.wikimedia.org/wiki/File:Chlorine-pentafluoride-2D-dimensions.png" },
  "XeF₄": { pm: 194, source: "https://cccbdb.nist.gov/expgeom2x.asp?casno=13709610&charge=0" },
};

// Compact form for narrow readouts: "116 pm" or "158 / 153 pm (ax / eq)".
export function bondLengthShort(formula: string) {
  const length = bondLengths[formula];
  if (!length) return undefined;
  return length.pm !== undefined ? `${length.pm} pm` : `${length.axial} / ${length.equatorial} pm (ax / eq)`;
}

export function bondLengthText(formula: string) {
  const length = bondLengths[formula];
  if (!length) return undefined;
  return length.pm !== undefined ? `${length.pm} pm` : `${length.axial} pm axial · ${length.equatorial} pm equatorial`;
}
