import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";
import { getSimulationContent } from "@/lib/seo/simulation-content";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

const firstSentence = (text: string) => text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;

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
    "Short answers to the key question behind every LearnerKits simulation, from Moon phases to titration, each linked to the interactive lab that tests it.",
    { keywords: ["science simulation guides", "interactive science explanations", "free science simulations"], englishOnly: true },
  );
}

export default async function TopicGuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en") notFound();
  // Every simulation page carries its own guide (question, answer, steps, science, FAQ); this hub
  // links to each one by its main question, grouped by subject.
  const groups = visibleSubjectSlugs.map((slug) => ({
    subject: subjectsCatalog[slug],
    guides: subjectsCatalog[slug].simulations.flatMap((simulation) => {
      const content = getSimulationContent(simulation.slug);
      return content ? [{ simulation, content }] : [];
    }),
  })).filter((group) => group.guides.length);

  return <main className="container topicGuidesIndex">
    <header className="pageHeader generalPageHeader">
      <div className="eyebrow">Learn before you launch the lab</div>
      <h1 className="pageTitle">Science simulation guides</h1>
      <p className="lede">Start with a plain-language explanation, make a prediction, then use the interactive model to test it. Each guide states what the model does and where its simplifications matter.</p>
      <Link className="textLink" href="/en/articles">Explore articles on AI, study skills, and teaching →</Link>
    </header>
    <section className="topicGuideGrid" aria-label="Priority science topic guides">
      <article className="topicGuideCard">
        <span className="eyebrow">Environmental science · Game guide</span>
        <h2><Link href="/en/guides/environmental-city-builder">Environmental city builder: how to play</Link></h2>
        <p>Learn the illustrated controls, drag projects onto valid plots, and compare scientific results. Includes a first-build walkthrough and starter investigations for all ten environmental worlds.</p>
        <div className="topicGuideCardActions"><Link className="textLink" href="/en/guides/environmental-city-builder">Read the game guide →</Link><Link className="textLink" href="/en/simulations/urban-heat-island-simulator">Open simulation</Link></div>
      </article>
    </section>
    {groups.map(({ subject, guides }) => <section className="topicGuideGrid" key={subject.slug} aria-labelledby={`guides-${subject.slug}`}>
      <h2 className="topicGuideGroupTitle" id={`guides-${subject.slug}`}>{subject.eyebrow}</h2>
      {guides.map(({ simulation, content }) => <article className="topicGuideCard" key={simulation.slug}>
        <span className="eyebrow">{simulation.title}</span>
        <h3><Link href={`/en/simulations/${simulation.slug}`}>{content.question}</Link></h3>
        <p>{firstSentence(content.answer)}</p>
        <div className="topicGuideCardActions"><Link className="textLink" href={`/en/simulations/${simulation.slug}`}>Read the guide and open the lab →</Link></div>
      </article>)}
    </section>)}
  </main>;
}
