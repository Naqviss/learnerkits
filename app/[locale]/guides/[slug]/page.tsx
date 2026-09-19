import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata, siteName, siteUrl } from "@/lib/seo/metadata";
import { getTopicGuide, getTopicGuides } from "@/lib/seo/topic-guides";
import { getMoleculeKitCopy, moleculeKitSimSlugs } from "@/lib/seo/molecule-kit-content";

export function generateStaticParams() {
  return getTopicGuides().map((guide) => ({ locale: "en", slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const guide = getTopicGuide(slug);
  if (!guide || !isLocale(raw) || raw !== "en") return {};
  return localizedMetadata(
    raw,
    `/guides/${guide.slug}`,
    guide.title,
    `${guide.answer} Use the free interactive ${guide.simulation.kind.toLowerCase()} to test your prediction.`,
    { type: "article", keywords: [guide.target, guide.simulation.title, guide.subject.eyebrow], englishOnly: true },
  );
}

export default async function TopicGuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw) || raw !== "en") notFound();
  const guide = getTopicGuide(slug);
  if (!guide) notFound();
  const locale = raw as Locale;
  const path = `/guides/${guide.slug}`;
  const article = {
    "@context": "https://schema.org",
    "@type": ["Article", "LearningResource"],
    headline: guide.title,
    description: guide.answer,
    url: `${siteUrl}/en${path}`,
    inLanguage: "en",
    isAccessibleForFree: true,
    learningResourceType: "Interactive topic guide",
    educationalUse: ["instruction", "practice"],
    educationalLevel: "Grades 6–12",
    about: [guide.subject.eyebrow, guide.simulation.title, guide.target],
    isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/en${path}` },
  };
  const breadcrumbs = breadcrumbJsonLd(locale, [
    { name: "Science guides", path: "/guides" },
    { name: guide.subject.eyebrow, path: `/subjects/${guide.subject.slug}` },
    { name: guide.title, path },
  ]);
  const faq = faqJsonLd(locale, guide.faq);
  const inMoleculeKit = (moleculeKitSimSlugs as readonly string[]).includes(guide.simulation.slug);
  const kitCopy = inMoleculeKit ? getMoleculeKitCopy(locale) : undefined;

  return <main className="container topicGuidePage">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(article)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)} />
    <article>
      <header className="topicGuideHero">
        <div className="eyebrow">{guide.subject.eyebrow} · Interactive topic guide</div>
        <h1>{guide.title}</h1>
        <p className="topicGuideLead">{guide.answer}</p>
        <div className="topicGuideHeroActions">
          <Link className="button primary" href={`/en/simulations/${guide.simulation.slug}`}>Open the interactive simulation</Link>
          <Link className="textLink" href={`/en/subjects/${guide.subject.slug}`}>Browse {guide.subject.eyebrow} →</Link>
          {kitCopy && <Link className="textLink" href={`/en/molecule-kit`}>{kitCopy.partOfBadge} →</Link>}
        </div>
      </header>
      <div className="topicGuideBody">
        <section className="topicGuideSection topicGuideAnswer">
          <span className="eyebrow">Why this matters</span>
          <h2>Turn the idea into a testable prediction</h2>
          <p>{guide.whyItMatters}</p>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">Investigate</span>
          <h2>Questions to explore</h2>
          <ul>{guide.investigate.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">Predict · experiment · observe · explain</span>
          <h2>Suggested method</h2>
          <ol>{guide.method.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
        <aside className="topicGuideModelNote">
          <strong>Model scope</strong>
          <p>{guide.modelNote}</p>
          <Link href="/en/editorial-policy">Read our model and editorial policy →</Link>
        </aside>
        <section className="topicGuideSection topicGuideFaq">
          <span className="eyebrow">Quick answers</span>
          <h2>Common questions</h2>
          {guide.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
        </section>
      </div>
    </article>
  </main>;
}
