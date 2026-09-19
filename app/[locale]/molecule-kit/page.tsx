import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata, subjectCollectionJsonLd } from "@/lib/seo/metadata";
import { getMoleculeKitCopy } from "@/lib/seo/molecule-kit-content";

const kitSimSlugs = ["molecule-builder-3d", "molecular-geometry-3d"] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getMoleculeKitCopy(raw);
  return localizedMetadata(raw, "/molecule-kit", copy.metaTitle, copy.metaDescription, {
    keywords: ["molecule kit", "molecule builder 3D", "molecular geometry simulator", "build molecules game", "VSEPR simulator"],
  });
}

export default async function MoleculeKitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const copy = getMoleculeKitCopy(locale);
  const chemistryName = getLocalizedSubjectName(locale, "chemistry");
  const chemistry = getLocalizedSubject(locale, "chemistry");
  const kitSimulations = kitSimSlugs.map((slug) => chemistry.simulations.find((sim) => sim.slug === slug)!);

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

  return (
    <main className="container topicGuidePage subject-chemistry">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)} />
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
        <section className="topicGuideSection topicGuideFaq">
          <span className="eyebrow">{copy.faqEyebrow}</span>
          <h2>{copy.faqTitle}</h2>
          {copy.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
        </section>
      </div>
    </main>
  );
}
