import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata, simulationJsonLd, subjectCollectionJsonLd } from "@/lib/seo/metadata";
import { getMoleculeKitCopy, moleculeKitSimSlugs } from "@/lib/seo/molecule-kit-content";
import { getMoleculeReference } from "@/lib/seo/molecules";

// High-demand lookups featured on the kit page; each links to its English reference page.
const popularMolecules = ["water-h2o", "carbon-dioxide-co2", "methane-ch4", "ammonia-nh3", "sulfur-dioxide-so2", "boron-trifluoride-bf3", "phosphorus-pentachloride-pcl5", "sulfur-hexafluoride-sf6", "xenon-tetrafluoride-xef4", "sulfate-ion-so4"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getMoleculeKitCopy(raw);
  return localizedMetadata(raw, "/molecule-kit", copy.metaTitle, copy.metaDescription, { keywords: copy.keywords });
}

export default async function MoleculeKitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const copy = getMoleculeKitCopy(locale);
  const chemistryName = getLocalizedSubjectName(locale, "chemistry");
  const chemistry = getLocalizedSubject(locale, "chemistry");
  const kitSimulations = moleculeKitSimSlugs.map((slug) => chemistry.simulations.find((sim) => sim.slug === slug)!);

  const breadcrumb = breadcrumbJsonLd(locale, [
    { name: chemistryName, path: "/subjects/chemistry" },
    { name: copy.title, path: "/molecule-kit" },
  ]);
  const collection = subjectCollectionJsonLd({
    locale,
    path: "/molecule-kit",
    name: copy.title,
    description: copy.metaDescription,
    simulations: kitSimulations.map((sim) => ({ name: sim.title, path: `/simulations/${sim.slug}`, description: sim.outcome })),
  });
  const faq = faqJsonLd(locale, copy.faq);
  const kitApp = simulationJsonLd({
    locale,
    path: "/molecule-kit",
    title: copy.title,
    description: copy.metaDescription,
    subject: chemistryName,
    concepts: ["Valence", "Chemical bonding", "VSEPR theory", "Molecular geometry", "Bond angles", "Lone pairs"],
  });
  const featured = popularMolecules.map((slug) => getMoleculeReference(slug)!);

  return (
    <main className="container topicGuidePage subject-chemistry">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(kitApp)} />
      <header className="topicGuideHero">
        <div className="eyebrow">{chemistryName} · {copy.heroEyebrowSuffix}</div>
        <h1>{copy.title}</h1>
        <p className="topicGuideLead">{copy.lede}</p>
        <div className="topicGuideHeroActions">
          <Link className="button primary" href={`/${locale}/simulations/molecule-builder-3d`}>{copy.ctaPrimary}</Link>
          <Link className="textLink" href={`/${locale}/subjects/chemistry`}>{copy.ctaSecondary(chemistryName)} →</Link>
        </div>
      </header>
      <div className="topicGuideBody">
        <section className="topicGuideSection topicGuideAnswer">
          <span className="eyebrow">{copy.whatEyebrow}</span>
          <h2>{copy.whatTitle}</h2>
          <ul>{copy.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">{copy.kitEyebrow}</span>
          <h2>{copy.kitTitle}</h2>
          <div className="priorityLabGrid">
            {kitSimulations.map((sim) => (
              <article className="priorityLabCard" key={sim.slug}>
                <div className="priorityTop"><span>{sim.kind}</span><b>{sim.difficulty}</b></div>
                <h3>{sim.title}</h3>
                <p>{sim.outcome}</p>
                <div className="simMeta"><span className="pill">{sim.duration}</span>{sim.concepts && <span className="pill">{sim.concepts}</span>}</div>
                <Link className="button subjectButton" href={`/${locale}/simulations/${sim.slug}`}>{copy.openLab} →</Link>
              </article>
            ))}
          </div>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">{copy.chart.eyebrow}</span>
          <h2>{copy.chart.title}</h2>
          <p>{copy.chart.body}</p>
          <div className="moleculeKitChart" lang="en">
            {featured.map((m) => <Link key={m.slug} href={`/en/molecules/${m.slug}`}>{m.formula} · {m.name}</Link>)}
          </div>
          <div className="topicGuideHeroActions"><Link className="button subjectButton" href="/en/molecules">{copy.chart.cta} →</Link></div>
        </section>
        <section className="topicGuideSection topicGuideFaq">
          <span className="eyebrow">{copy.faqEyebrow}</span>
          <h2>{copy.faqTitle}</h2>
          {copy.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
        </section>
      </div>
    </main>
  );
}
