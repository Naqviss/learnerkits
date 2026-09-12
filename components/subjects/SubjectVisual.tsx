import type { SubjectSlug } from "@/lib/subjects/catalog";

export function SubjectVisual({ subject }: { subject: SubjectSlug }) {
  if (subject === "space") return <div className="subjectVisual visualSpace" aria-hidden="true"><i className="spaceSun"/><i className="spaceOrbit orbitA"/><i className="spaceOrbit orbitB"/><i className="spacePlanet planetA"/><i className="spacePlanet planetB"/></div>;
  if (subject === "physics") return <div className="subjectVisual visualPhysics" aria-hidden="true"><i className="forceBlock"/><i className="forceArrow arrowX"/><i className="forceArrow arrowY"/><i className="forceTrack"/><b>F</b><span>m</span></div>;
  if (subject === "geography") return <div className="subjectVisual visualGeography" aria-hidden="true"><i className="earthCore"/><i className="earthLayer layer1"/><i className="earthLayer layer2"/><i className="earthLayer layer3"/><span className="terrainLine t1"/><span className="terrainLine t2"/><span className="terrainLine t3"/></div>;
  if (subject === "environmental-science") return <div className="subjectVisual visualEnvironmental" aria-hidden="true"><i className="envAtmosphere"/><i className="envOcean"/><i className="envCity"/><i className="envTurbine"/><i className="envPulse"/><b>CO₂</b><span>↘</span></div>;
  if (subject === "biology") return <div className="subjectVisual visualBiology" aria-hidden="true"><i className="cell cellA"><span/></i><i className="cell cellB"><span/></i><i className="dna"><b/><b/><b/><b/><b/></i></div>;
  if (subject === "chemistry") return <div className="subjectVisual visualChemistry" aria-hidden="true"><i className="flask"><span/></i><i className="molecule molA"/><i className="molecule molB"/><i className="bond bondA"/><i className="bond bondB"/></div>;
  return <div className="subjectVisual visualMathematics" aria-hidden="true"><i className="mathGrid"/><i className="mathCurve"/><i className="mathVector"/><b>ƒ(x)</b><span>∑</span></div>;
}
