import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata, siteName, siteUrl } from "@/lib/seo/metadata";
import { getVseprClasses, moleculeReferences } from "@/lib/seo/molecules";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

const title = "VSEPR Shapes Chart: Molecular Geometry & Bond Angles (3D)";
const description = `Interactive VSEPR chart with ${moleculeReferences.length} molecules and ions: molecular geometry, electron geometry, bond angles, hybridization, and polarity, each with a free 3D model.`;
const faqItems = [
  { q: "What is VSEPR theory?", a: "VSEPR (valence shell electron pair repulsion) theory predicts molecular shape by assuming that electron domains around a central atom — bonds and lone pairs — arrange themselves as far apart as possible to minimize repulsion." },
  { q: "What is the difference between electron geometry and molecular geometry?", a: "Electron geometry describes the arrangement of all electron domains, including lone pairs. Molecular geometry describes only the positions of the atoms. They are the same when the central atom has no lone pairs." },
  { q: "How do lone pairs change bond angles?", a: "Lone pairs repel more strongly than bonding pairs, so they push bonded atoms closer together. That is why NH₃ (about 107°) and H₂O (about 104.5°) have smaller angles than the ideal tetrahedral 109.5°." },
  { q: "What does AXE notation mean?", a: "In AXₙEₘ notation, A is the central atom, X is each bonded atom (bonding domain), and E is each lone pair on the central atom. For example, water is AX₂E₂ and ammonia is AX₃E." },
  { q: "Does a double bond count as one electron domain?", a: "Yes. In VSEPR, a single, double, or triple bond to one atom counts as one electron domain, so CO₂ has two domains and is linear." },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw) || raw !== "en") return {};
  return localizedMetadata(raw, "/molecules", title, description, {
    keywords: ["VSEPR chart", "VSEPR shapes", "molecular geometry chart", "bond angles chart", "molecular shapes table", "AXE notation", "electron geometry vs molecular geometry", "3D molecule viewer"],
    englishOnly: true,
  });
}

export default async function MoleculesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en") notFound();
  const classes = getVseprClasses();

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
    audience: { "@type": "EducationalAudience", educationalRole: ["student", "teacher", "researcher"] },
    isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: moleculeReferences.length,
      itemListElement: moleculeReferences.map((m, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/en/molecules/${m.slug}`,
        name: `${m.formula} (${m.name}) — ${m.shape}`,
      })),
    },
  };
  const breadcrumbs = breadcrumbJsonLd("en", [
    { name: "Molecule Kit", path: "/molecule-kit" },
    { name: "VSEPR shapes chart", path: "/molecules" },
  ]);
  const faq = faqJsonLd("en", faqItems);

  return <main className="container topicGuidePage subject-chemistry">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)} />
    <header className="topicGuideHero">
      <div className="eyebrow"><Link href="/en/molecule-kit">Molecule Kit</Link> · Chemistry reference</div>
      <h1>VSEPR shapes chart</h1>
      <p className="topicGuideLead">Every common VSEPR shape in one table: electron geometry, molecular geometry, ideal bond angles, and hybridization, with {moleculeReferences.length} example molecules and ions you can rotate in 3D. Free for students, tutors, and teachers, with no sign-up.</p>
      <div className="topicGuideHeroActions">
        <Link className="button primary" href="/en/simulations/molecular-geometry-3d">Open the 3D geometry lab</Link>
        <Link className="textLink" href="/en/simulations/molecule-builder-3d">Build molecules atom by atom →</Link>
      </div>
    </header>
    <div className="topicGuideBody">
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
              <td>{row.examples.slice(0, 4).map((m, i) => <span key={m.slug}>{i > 0 && ", "}<Link href={`/en/molecules/${m.slug}`}>{m.formula}</Link></span>)}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>
      {classes.map((row) => <section className="topicGuideSection" key={`${row.axe}-${row.shape}-list`} id={`${row.shape.toLowerCase().replace(/[^a-z]+/g, "-")}-${row.domains}-${row.lonePairs}`}>
        <span className="eyebrow">{row.axe} · {row.electronGeometry} electron geometry</span>
        <h2>{row.shape} molecules ({row.axe})</h2>
        <ul className="moleculeLinkList">{row.examples.map((m) => <li key={m.slug}><Link href={`/en/molecules/${m.slug}`}><b>{m.formula}</b> {m.name}</Link></li>)}</ul>
      </section>)}
      <section className="topicGuideSection topicGuideFaq">
        <span className="eyebrow">Quick answers</span>
        <h2>VSEPR questions</h2>
        {faqItems.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
      </section>
    </div>
  </main>;
}
