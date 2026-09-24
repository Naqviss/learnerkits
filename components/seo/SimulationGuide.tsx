import Link from "next/link";
import { getArticlesForSimulation } from "@/lib/articles/catalog";
import type { Locale } from "@/lib/i18n/config";
import { getSimulationGuide } from "@/lib/seo/simulation-guides";
import { getTopicGuide } from "@/lib/seo/topic-guides";
import { getMoleculeKitCopy, moleculeKitSimSlugs } from "@/lib/seo/molecule-kit-content";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";

export function SimulationGuide({ locale, subject, simulation }: { locale: Locale; subject: SubjectDefinition; simulation: SimulationCard }) {
  const guide = getSimulationGuide(locale, subject, simulation);
  const related = subject.simulations.filter((item) => item.slug !== simulation.slug).slice(0, 4);
  const topicGuide = locale === "en" ? getTopicGuide(simulation.slug) : undefined;
  const inMoleculeKit = (moleculeKitSimSlugs as readonly string[]).includes(simulation.slug);
  const kitCopy = inMoleculeKit ? getMoleculeKitCopy(locale) : undefined;

  return <section className="container simulationGuide" aria-labelledby="simulation-guide-title">
    <header className="simulationGuideHeader">
      <span className="eyebrow">{guide.freeLabel}</span>
      <h2 id="simulation-guide-title">{guide.title}</h2>
      <p>{guide.intro}</p>
      {kitCopy && <Link className="textLink simulationTopicLink" href={`/${locale}/molecule-kit`}>{kitCopy.partOfBadge} →</Link>}
      {topicGuide && <Link className="textLink simulationTopicLink" href={`/en/guides/${topicGuide.slug}`}>Read the focused topic guide →</Link>}
    </header>
    <div className="simulationGuideGrid">
      <article className="simulationGuideCard">
        <h3>{guide.investigate}</h3>
        <p>{guide.investigateBody}</p>
        <div className="conceptRow">{simulation.concepts.split(" · ").map((concept) => <span className="conceptChip" key={concept}>{concept}</span>)}</div>
      </article>
      <article className="simulationGuideCard">
        <h3>{guide.howTo}</h3>
        <ol>{guide.steps.map((step, index) => <li key={step}><b>{index + 1}</b><span>{step}</span></li>)}</ol>
      </article>
      <article className="simulationGuideCard classroomGuide">
        <h3>{guide.classroom}</h3>
        <p>{guide.classroomBody}</p>
        <dl><div><dt>{guide.level}</dt><dd>{simulation.difficulty}</dd></div><div><dt>{guide.time}</dt><dd>{simulation.duration}</dd></div><div><dt>{guide.format}</dt><dd>{simulation.kind}</dd></div></dl>
      </article>
    </div>
    <div className="simulationFaq">
      <h2>{guide.questions}</h2>
      {guide.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
    </div>
    {locale === "en" && getArticlesForSimulation(simulation.slug).length > 0 && <aside className="simulationArticleLinks"><h2>Learn with this simulation</h2><ul>{getArticlesForSimulation(simulation.slug).map((article) => <li key={article.slug}><Link className="textLink" href={`/en/articles/${article.slug}`}>{article.title} →</Link></li>)}</ul></aside>}
    <nav className="relatedSimulations" aria-label={guide.related}>
      <div><span className="eyebrow">{guide.related}</span><Link href={`/${locale}/subjects/${subject.slug}`}>{subject.eyebrow} →</Link></div>
      <div>{related.map((item) => <Link href={`/${locale}/simulations/${item.slug}`} key={item.slug}><span>{item.kind}</span><strong>{item.title}</strong><small>{guide.open} →</small></Link>)}</div>
    </nav>
  </section>;
}
