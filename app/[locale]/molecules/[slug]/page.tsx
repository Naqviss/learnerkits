import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata, siteName, siteUrl } from "@/lib/seo/metadata";
import { getMoleculeReference, getMoleculesWithShape, moleculeCopy, moleculeReferences } from "@/lib/seo/molecules";
import { MoleculeViewer } from "@/components/seo/MoleculeViewer";

export function generateStaticParams() {
  return moleculeReferences.map((molecule) => ({ locale: "en", slug: molecule.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const molecule = getMoleculeReference(slug);
  if (!molecule || !isLocale(raw) || raw !== "en") return {};
  const { lead } = moleculeCopy(molecule);
  return localizedMetadata(
    raw,
    `/molecules/${molecule.slug}`,
    `${molecule.formula} Molecular Geometry, Shape & Bond Angle (3D)`,
    `${lead} Rotate the free interactive 3D model.`,
    {
      keywords: [
        `${molecule.formula} molecular geometry`, `${molecule.asciiFormula} molecular geometry`, `${molecule.name.toLowerCase()} shape`,
        `${molecule.asciiFormula} bond angle`, `${molecule.asciiFormula} lewis structure shape`, `is ${molecule.asciiFormula} polar`,
        `${molecule.asciiFormula} hybridization`, `${molecule.asciiFormula} 3D model`, "VSEPR",
      ],
      englishOnly: true,
    },
  );
}

export default async function MoleculePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw) || raw !== "en") notFound();
  const molecule = getMoleculeReference(slug);
  if (!molecule) notFound();
  const path = `/molecules/${molecule.slug}`;
  const copy = moleculeCopy(molecule);
  const sameShape = getMoleculesWithShape(molecule.shape, molecule.axe).filter((m) => m.slug !== molecule.slug).slice(0, 10);
  const facts: [string, string][] = [
    ["Molecular geometry", molecule.shape],
    ["Electron geometry", molecule.electronGeometry],
    ["Bond angle", molecule.bondAngle],
    ["VSEPR notation", molecule.axe],
    ["Central atom", molecule.center],
    ["Bonding domains", String(molecule.bondingPairs)],
    ["Lone pairs on central atom", String(molecule.lonePairs)],
    ...(molecule.hybridization ? [["Hybridization", molecule.hybridization] as [string, string]] : []),
    ["Polarity", molecule.polarity === "Ion" ? "Polyatomic ion (net charge)" : molecule.polarity],
  ];

  const resource = {
    "@context": "https://schema.org",
    "@type": ["LearningResource", "WebPage"],
    name: `${copy.label} molecular geometry`,
    description: copy.lead,
    url: `${siteUrl}/en${path}`,
    inLanguage: "en",
    isAccessibleForFree: true,
    learningResourceType: ["Reference", "Interactive 3D model"],
    educationalLevel: "Grades 9–12 and introductory college chemistry",
    educationalUse: ["instruction", "self-study", "practice"],
    teaches: ["VSEPR theory", "Molecular geometry", "Bond angles", molecule.shape, ...(molecule.hybridization ? ["Hybridization"] : []), "Molecular polarity"],
    audience: { "@type": "EducationalAudience", educationalRole: ["student", "teacher", "researcher"] },
    about: { "@type": "MolecularEntity", name: molecule.name, molecularFormula: molecule.asciiFormula },
    isPartOf: { "@type": "CollectionPage", name: "VSEPR shapes chart", url: `${siteUrl}/en/molecules` },
    provider: { "@type": "Organization", name: siteName, url: siteUrl },
  };
  const breadcrumbs = breadcrumbJsonLd("en", [
    { name: "Molecule Kit", path: "/molecule-kit" },
    { name: "VSEPR shapes chart", path: "/molecules" },
    { name: `${molecule.formula} molecular geometry`, path },
  ]);
  const faq = faqJsonLd("en", copy.faq);

  return <main className="container topicGuidePage subject-chemistry">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(resource)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)} />
    <article>
      <header className="topicGuideHero">
        <div className="eyebrow"><Link href="/en/molecules">VSEPR shapes chart</Link> · {molecule.name}</div>
        <h1>{molecule.formula} molecular geometry</h1>
        <p className="topicGuideLead">{copy.lead}</p>
        <div className="topicGuideHeroActions">
          <Link className="button primary" href={`/en/simulations/molecular-geometry-3d?molecule=${molecule.slug}`}>Test yourself in the 3D lab</Link>
          <Link className="textLink" href="/en/molecule-kit">Explore the Molecule Kit →</Link>
        </div>
      </header>
      <div className="topicGuideBody">
        <MoleculeViewer index={molecule.index} label={`Interactive 3D model of ${copy.label}`} />
        <section className="topicGuideSection topicGuideAnswer">
          <span className="eyebrow">Quick facts</span>
          <h2>{molecule.name} at a glance</h2>
          <dl className="moleculeFacts">{facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">Explain the shape</span>
          <h2>Why is {molecule.formula} {molecule.shape.toLowerCase()}?</h2>
          <p>{copy.why}</p>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">Polarity</span>
          <h2>Is {molecule.formula} polar or nonpolar?</h2>
          <p>{copy.polarity}</p>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">Method</span>
          <h2>How to predict the shape of {molecule.formula} with VSEPR</h2>
          <ol>
            <li>Identify the central atom: {molecule.center}.</li>
            <li>Count the bonding domains around it: {molecule.bondingPairs} bond{molecule.bondingPairs === 1 ? "" : "s"} to {molecule.outer}. A double or triple bond counts as one domain.</li>
            <li>Count the lone pairs on the central atom: {molecule.lonePairs}.</li>
            <li>Add them to get the electron domains ({molecule.domains}), which gives the electron geometry: {molecule.electronGeometry.toLowerCase()}.</li>
            <li>Describe only the positions of the atoms to get the molecular shape: {molecule.shape.toLowerCase()} ({molecule.axe}).</li>
          </ol>
        </section>
        {sameShape.length > 0 && <section className="topicGuideSection">
          <span className="eyebrow">Compare</span>
          <h2>Other {molecule.shape.toLowerCase()} molecules ({molecule.axe})</h2>
          <ul className="moleculeLinkList">{sameShape.map((m) => <li key={m.slug}><Link href={`/en/molecules/${m.slug}`}><b>{m.formula}</b> {m.name}</Link></li>)}</ul>
        </section>}
        <aside className="topicGuideModelNote">
          <strong>Model scope</strong>
          <p>VSEPR predicts idealized shapes from electron-domain repulsion. Bond angles are approximate experimental or textbook values; ball sizes and bond lengths in the 3D model are illustrative, not to scale.</p>
          <Link href="/en/editorial-policy">Read our model and editorial policy →</Link>
        </aside>
        <section className="topicGuideSection topicGuideFaq">
          <span className="eyebrow">Quick answers</span>
          <h2>Common questions about {molecule.formula}</h2>
          {copy.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
        </section>
      </div>
    </article>
  </main>;
}
