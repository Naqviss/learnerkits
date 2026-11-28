import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoleculeExplorer, type MoleculeRow } from "@/components/molecules/MoleculeExplorer";
import styles from "@/components/molecules/moleculeExplorer.module.css";
import { isLocale } from "@/lib/i18n/config";
import { breadcrumbJsonLd, jsonLd, localizedMetadata, siteName, siteUrl } from "@/lib/seo/metadata";
import { angleShort, classMistake, coreMoleculeSlugs, getVseprClasses, moleculeReferences, plainFormula } from "@/lib/seo/molecules";

// The one molecule reference page. It replaced 118 template-built /en/molecules/<slug> pages
// (November 2026 thin-content clean-up): each molecule now opens from the table below in a dialog,
// at /en/molecules#<slug>, and the old URLs 301 there (lib/seo/legacy-redirects.ts).

export function generateStaticParams() {
  return [{ locale: "en" }];
}

const title = "VSEPR Shapes Chart: Molecular Geometry & Bond Angles (3D)";
const description = `VSEPR chart of ${moleculeReferences.length} molecules and ions: molecular and electron geometry, bond angles, hybridization and polarity, each with a 3D model.`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw) || raw !== "en") return {};
  return localizedMetadata(raw, "/molecules", title, description, {
    keywords: ["VSEPR chart", "VSEPR shapes", "molecular geometry chart", "bond angles chart", "molecular shapes table", "AXE notation", "electron geometry vs molecular geometry", "3D molecule viewer"],
    englishOnly: true,
  });
}

const domainOrder = (row: { domains: number; lonePairs: number }) => row.domains * 10 + row.lonePairs;

export default async function MoleculesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en") notFound();
  const classes = getVseprClasses();
  const rows: MoleculeRow[] = [...moleculeReferences]
    .sort((a, b) => domainOrder(a) - domainOrder(b) || a.index - b.index)
    .map((m) => ({ index: m.index, slug: m.slug, formula: m.formula, asciiFormula: plainFormula(m), name: m.name, center: m.center, outer: m.outer, bondingPairs: m.bondingPairs, lonePairs: m.lonePairs, axe: m.axe, shape: m.shape, electronGeometry: m.electronGeometry, bondAngle: m.bondAngle, angle: angleShort(m), hybridization: m.hybridization, polarity: m.polarity, core: coreMoleculeSlugs.has(m.slug) }));

  const collection = {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "LearningResource"],
    name: "VSEPR shapes chart",
    description,
    url: `${siteUrl}/en/molecules`,
    inLanguage: "en",
    isAccessibleForFree: true,
    learningResourceType: ["Reference table", "Interactive 3D model"],
    educationalLevel: "Grades 9–12 and introductory college chemistry",
    teaches: ["VSEPR theory", "Molecular geometry", "Electron geometry", "Bond angles", "Hybridization", "Molecular polarity"],
    audience: { "@type": "EducationalAudience", educationalRole: ["student", "teacher"] },
    isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: rows.length,
      // One entry per molecule with the same facts as its table row, so search engines and AI
      // assistants can answer "SF4 molecular geometry" or "is NH3 polar" from this page (each old
      // /en/molecules/<slug> URL 301s to its row here).
      itemListElement: rows.map((m, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "DefinedTerm",
          "@id": `${siteUrl}/en/molecules#${m.slug}`,
          name: `${m.formula} (${m.name})`,
          alternateName: m.asciiFormula,
          termCode: m.axe,
          url: `${siteUrl}/en/molecules#${m.slug}`,
          description: `${m.asciiFormula} (${m.name[0].toLowerCase()}${m.name.slice(1)}) has a ${m.shape.toLowerCase()} molecular geometry and ${m.electronGeometry.toLowerCase()} electron geometry, bond angle ${m.bondAngle.replace("≈ ", "about ")}${m.hybridization ? `, ${m.hybridization} hybridization` : ""}, ${m.lonePairs} lone pair${m.lonePairs === 1 ? "" : "s"} on ${m.center}; ${m.polarity === "Ion" ? "a polyatomic ion" : m.polarity.toLowerCase()}.`,
          inDefinedTermSet: `${siteUrl}/en/molecules`,
        },
      })),
    },
  };
  const breadcrumbs = breadcrumbJsonLd("en", [
    { name: "Molecule Kit", path: "/molecule-kit" },
    { name: "VSEPR shapes chart", path: "/molecules" },
  ]);

  return <main className="container topicGuidePage subject-chemistry">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <header className="topicGuideHero">
      <div className="eyebrow"><Link href="/en/molecule-kit">Molecule Kit</Link> · Chemistry reference</div>
      <h1>VSEPR shapes chart</h1>
      <p className="topicGuideLead">VSEPR (valence shell electron pair repulsion) theory predicts the shape of a molecule from one count: how many electron domains surround the central atom, and how many of them are lone pairs. This chart sets out all 13 VSEPR classes that come from two to six domains, then lists {rows.length} molecules and ions you can open and rotate in 3D.</p>
      <div className="topicGuideHeroActions">
        <a className="button primary" href="#all-molecules">Browse all {rows.length} molecules</a>
        <Link className="textLink" href="/en/simulations/molecular-geometry-3d">Open the 3D geometry lab →</Link>
      </div>
    </header>
    <div className="topicGuideBody">
      <section className="topicGuideSection">
        <span className="eyebrow">Method</span>
        <h2>How to predict a shape with VSEPR</h2>
        <p>Take ammonia, NH₃. Nitrogen brings five valence electrons and each hydrogen one, eight in total. Three N–H bonds use six of them, which leaves one lone pair on nitrogen. That gives four electron domains: three bonds and one lone pair.</p>
        <ol>
          <li>Find the central atom and count its electron domains. A single, double or triple bond each counts as one domain; so does each lone pair.</li>
          <li>Arrange the domains as far apart as possible. Two domains make a line, three a triangle, four a tetrahedron, five a trigonal bipyramid and six an octahedron. This is the electron geometry.</li>
          <li>Ignore the lone pairs and describe where the atoms are. That is the molecular shape. Ammonia’s four domains are tetrahedral, but with one corner taken by a lone pair the atoms form a trigonal pyramid.</li>
          <li>Write the AXE class to check yourself: A is the central atom, X a bonded atom, E a lone pair. Ammonia is AX₃E, the same class as phosphine and nitrogen trifluoride.</li>
        </ol>
      </section>

      <section className="topicGuideSection">
        <span className="eyebrow">The chart</span>
        <h2>Molecular geometry by electron domains</h2>
        <div className="vseprTableWrap">
          <table className="vseprTable">
            <thead><tr><th scope="col">Domains</th><th scope="col">AXE</th><th scope="col">Electron geometry</th><th scope="col">Molecular shape</th><th scope="col">Ideal angle</th><th scope="col">Hybridization</th><th scope="col">Examples</th></tr></thead>
            <tbody>{classes.map((row) => <tr key={`${row.axe}-${row.shape}`}>
              <td>{row.domains}</td>
              <td>{row.axe}</td>
              <td>{row.electronGeometry}</td>
              <th scope="row">{row.shape}</th>
              <td>{row.idealAngle}</td>
              <td>{row.hybridization}</td>
              <td>{row.examples.slice(0, 4).map((m, i) => <span key={m.slug}>{i > 0 && ", "}<a href={`#${m.slug}`}>{m.formula}</a></span>)}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="topicGuideSection">
        <span className="eyebrow">Lone pairs</span>
        <h2>Why lone pairs squeeze bond angles</h2>
        <p>Methane, ammonia and water all have four electron domains, yet their bond angles fall from 109.5° in CH₄ to about 107° in NH₃ and 104.5° in H₂O. A lone pair is held by one nucleus instead of two, so it sits closer to the central atom and spreads out more than a bonding pair. Repulsion is strongest between two lone pairs, weaker between a lone pair and a bond, and weakest between two bonds, so every lone pair pushes the bonds a little closer together.</p>
        <p>The outer atoms matter too. In nitrogen trifluoride the angle is about 102.5°, smaller than in ammonia, because fluorine pulls the bonding electrons away from nitrogen and leaves the lone pair more room. The rule is not universal: phosphorus trifluoride, at about 97.8°, is wider than phosphine at 93.5°. Bond angles are measured values, and VSEPR explains their direction better than their exact size.</p>
      </section>

      <section className="topicGuideSection">
        <span className="eyebrow">Down a group</span>
        <h2>Bigger central atoms, smaller angles</h2>
        <p>Moving down a group, the hydrides close up toward 90°. The angle is about 107° in NH₃, 93.5° in PH₃ and 91.8° in AsH₃; in group 16 it goes from 104.5° in H₂O to 92.1° in H₂S, 91° in H₂Se and 90° in H₂Te. A larger central atom holds its bonds farther apart, so the bonding pairs repel each other less and the lone pairs dominate. In the hybridization picture, heavier atoms bond mainly through nearly unmixed p orbitals, which sit at right angles.</p>
      </section>

      <section className="topicGuideSection">
        <span className="eyebrow">Five and six domains</span>
        <h2>Where the lone pairs go in larger shapes</h2>
        <p>A trigonal bipyramid has two kinds of position: three equatorial corners 120° apart around the middle, and two axial corners above and below at 90° to them. Lone pairs always take equatorial positions, where they have fewer neighbors at 90°. One equatorial lone pair turns PCl₅’s shape into the seesaw of SF₄; two give the T shape of ClF₃; three leave XeF₂ perfectly linear, because the three lone pairs balance each other around the equator.</p>
        <p>In an octahedron all six positions are equivalent. One lone pair gives the square pyramid of BrF₅. A second lone pair goes directly opposite the first, as far from it as possible, which is why XeF₄ is a flat square rather than a distorted tetrahedron.</p>
      </section>

      <section className="topicGuideSection">
        <span className="eyebrow">Polarity</span>
        <h2>Shape decides whether a molecule is polar</h2>
        <p>Polar bonds do not guarantee a polar molecule. Carbon dioxide is linear, so its two C=O dipoles point in opposite directions and cancel; sulfur dioxide is bent at about 119°, so its S=O dipoles add up and the molecule is polar. The same contrast separates boron trifluoride, flat and nonpolar, from ammonia, pyramidal and polar. Carbon tetrachloride is nonpolar although every C–Cl bond is polar, because four identical bonds at tetrahedral angles balance exactly. Lone pairs usually make a molecule polar, but not when they are arranged symmetrically: XeF₂ and XeF₄ are both nonpolar.</p>
      </section>

      <section className="topicGuideSection">
        <span className="eyebrow">Avoid these</span>
        <h2>Common mistakes, shape by shape</h2>
        <dl className={styles.mistakes}>{classes.map((row) => {
          const mistake = classMistake(row.examples[0]);
          return mistake ? <div key={`${row.axe}-${row.shape}-mistake`}><dt>{row.shape} ({row.axe})</dt><dd>{mistake}</dd></div> : null;
        })}</dl>
      </section>

      <section className="topicGuideSection" id="all-molecules">
        <span className="eyebrow">Every molecule</span>
        <h2>All {rows.length} molecules and ions</h2>
        <p>Every row gives the facts most homework questions ask for: shape, electron geometry, bond angle, hybridization, lone pairs and polarity. Press View 3D to rotate the molecule and read its Lewis structure, the dot-and-cross diagram built step by step from valence electrons, and its background. To study one idea at a time, filter by shape, by polarity or by the number of lone pairs on the central atom, or tick “Textbook examples only” for the {[...coreMoleculeSlugs].length} molecules most courses use to teach each shape. The list is ordered by electron domains, then lone pairs, so molecules of the same shape sit together.</p>
        <MoleculeExplorer rows={rows} />
      </section>

      <aside className="topicGuideModelNote">
        <strong>Model scope</strong>
        <p>VSEPR predicts idealized shapes from electron-domain repulsion. Bond angles are approximate experimental or textbook values; ball sizes and bond lengths in the 3D models are illustrative, not to scale. Hybridization labels are left out for transition-metal and actinide centers, where they mislead.</p>
        <Link href="/en/editorial-policy">Read our model and editorial policy →</Link>
      </aside>
    </div>
  </main>;
}
