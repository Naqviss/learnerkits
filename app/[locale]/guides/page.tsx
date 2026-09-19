import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";
import { getTopicGuides } from "@/lib/seo/topic-guides";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw) || raw !== "en") return {};
  return localizedMetadata(
    raw,
    "/guides",
    "Science Simulation Guides",
    "Clear, interactive explanations for high-interest science topics, paired with free simulations for students and teachers.",
    { keywords: ["science simulation guides", "interactive science explanations", "free science simulations"], englishOnly: true },
  );
}

export default async function TopicGuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en") notFound();
  const guides = getTopicGuides();

  return <main className="container topicGuidesIndex">
    <header className="pageHeader generalPageHeader">
      <div className="eyebrow">Learn before you launch the lab</div>
      <h1 className="pageTitle">Science simulation guides</h1>
      <p className="lede">Start with a plain-language explanation, make a prediction, then use the interactive model to test it. Each guide states what the model does and where its simplifications matter.</p>
    </header>
    <section className="topicGuideGrid" aria-label="Priority science topic guides">
      {guides.map((guide) => <article className="topicGuideCard" key={guide.slug}>
        <span className="eyebrow">{guide.subject.eyebrow}</span>
        <h2><Link href={`/en/guides/${guide.slug}`}>{guide.title}</Link></h2>
        <p>{guide.answer}</p>
        <div className="topicGuideCardActions">
          <Link className="textLink" href={`/en/guides/${guide.slug}`}>Read the guide →</Link>
          <Link className="textLink" href={`/en/simulations/${guide.slug}`}>Open simulation</Link>
        </div>
      </article>)}
    </section>
  </main>;
}
