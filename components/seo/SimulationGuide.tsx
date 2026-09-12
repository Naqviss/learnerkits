import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getSimulationGuide } from "@/lib/seo/simulation-guides";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";

export function SimulationGuide({ locale, subject, simulation }: { locale: Locale; subject: SubjectDefinition; simulation: SimulationCard }) {
  const guide = getSimulationGuide(locale, subject, simulation);
  const related = subject.simulations.filter((item) => item.slug !== simulation.slug).slice(0, 4);

  return <section className="container simulationGuide" aria-labelledby="simulation-guide-title">
    <header className="simulationGuideHeader">
      <span className="eyebrow">{guide.freeLabel}</span>
      <h2 id="simulation-guide-title">{guide.title}</h2>
      <p>{guide.intro}</p>
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
        <dl><div><dt>Level</dt><dd>{simulation.difficulty}</dd></div><div><dt>Time</dt><dd>{simulation.duration}</dd></div><div><dt>Format</dt><dd>{simulation.kind}</dd></div></dl>
      </article>
    </div>
    <div className="simulationFaq">
      <h2>{guide.questions}</h2>
      {guide.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
    </div>
    <nav className="relatedSimulations" aria-label={guide.related}>
      <div><span className="eyebrow">{guide.related}</span><Link href={`/${locale}/subjects/${subject.slug}`}>{subject.eyebrow} →</Link></div>
      <div>{related.map((item) => <Link href={`/${locale}/simulations/${item.slug}`} key={item.slug}><span>{item.kind}</span><strong>{item.title}</strong><small>{guide.open} →</small></Link>)}</div>
    </nav>
  </section>;
}
