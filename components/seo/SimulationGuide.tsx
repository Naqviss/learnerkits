import Link from "next/link";
import { SIMULATION_LEARNING_TOOLS_ENABLED } from "@/lib/settings/simulationFeatures";
import { getArticlesForSimulation } from "@/lib/articles/catalog";
import type { Locale } from "@/lib/i18n/config";
import { getSimulationGuide } from "@/lib/seo/simulation-guides";
import { getTopicGuide } from "@/lib/seo/topic-guides";
import { getSimulationContent } from "@/lib/seo/simulation-content";
import { getMoleculeKitCopy, moleculeKitSimSlugs } from "@/lib/seo/molecule-kit-content";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";

export function SimulationGuide({ locale, subject, simulation, protectedSections }: { locale: Locale; subject: SubjectDefinition; simulation: SimulationCard; protectedSections?: React.ReactNode }) {
  const guide = getSimulationGuide(locale, subject, simulation);
  const related = subject.simulations.filter((item) => item.slug !== simulation.slug).slice(0, 4);
  // Page-specific English content replaces the generic intro, science text and model note, and the
  // older topic guide (whose /guides URL now redirects here).
  const content = locale === "en" ? getSimulationContent(simulation.slug) : undefined;
  const topicGuide = locale === "en" && !content ? getTopicGuide(simulation.slug) : undefined;
  const inMoleculeKit = (moleculeKitSimSlugs as readonly string[]).includes(simulation.slug);
  const kitCopy = inMoleculeKit ? getMoleculeKitCopy(locale) : undefined;
  const concepts = simulation.concepts.split(" · ");

  return <section className="container simulationGuide" aria-labelledby="simulation-guide-title">
    <article className="simulationGuidePanel">
      <header className="simulationGuideHeader">
        <span className="simulationSectionKicker">Step-by-step learning</span>
        <h2 id="simulation-guide-title">{guide.title}</h2>
        {!content && <p>{guide.intro}</p>}
        {kitCopy && <Link className="textLink simulationTopicLink" href={`/${locale}/molecule-kit`}>{kitCopy.partOfBadge} →</Link>}
      </header>
      <div className={`simulationGuideGrid${SIMULATION_LEARNING_TOOLS_ENABLED ? "" : " simulationGuidePublic"}`}>
        <section className="simulationSteps">
          <h3>{guide.howTo}</h3>
          <ol>{guide.steps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span></li>)}</ol>
        </section>
        <section className="simulationScienceCard">
          <span className="simulationSectionKicker">Understand the science</span>
          <h3>{guide.investigate}</h3>
          {content ? content.science.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>{guide.investigateBody}</p>}
          {content?.formula && <p className="simulationFormula"><b>{content.formula.expression}</b> {content.formula.meaning}</p>}
          <div className="simulationConceptFormula">{concepts.join(" · ")}</div>
          <ul>{concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
        </section>
      </div>
      {content && <aside className="simulationModelNote simulationMisconception"><h3>Common misconception</h3><p><b>Myth:</b> {content.misconception.myth}</p><p><b>Fact:</b> {content.misconception.fact}</p></aside>}
      <aside className="simulationModelNote"><h3>{content ? "What the model includes" : "Model scope and learning focus"}</h3><p>{content ? content.modelNote : `${simulation.outcome} This educational model simplifies the real system so you can isolate variables, compare evidence, and explain the relationship you observe.`}</p>{content && <Link className="textLink" href="/en/editorial-policy">How we build and check our models →</Link>}</aside>
      <div id="simulation-guide-extension" className="simulationFeatureExtension"/>
    </article>

    {topicGuide && <article className="simTopicGuide" id="topic-guide" aria-labelledby="topic-guide-title">
      <header><span className="eyebrow">Topic guide</span><h2 id="topic-guide-title">{topicGuide.title}</h2><p>{topicGuide.answer}</p></header>
      <div className="simTopicGuideGrid"><section><h3>Why this matters</h3><p>{topicGuide.whyItMatters}</p></section><section><h3>Questions to explore</h3><ul>{topicGuide.investigate.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Suggested method</h3><ol>{topicGuide.method.map((item) => <li key={item}>{item}</li>)}</ol></section></div>
      <aside className="topicGuideModelNote"><strong>Model scope</strong><p>{topicGuide.modelNote}</p><Link href="/en/editorial-policy">Read our model and editorial policy →</Link></aside>
    </article>}

    {protectedSections}

    <section className="simulationFaqPanel" aria-labelledby="simulation-faq-title">
      <div className="simulationFaqIntro"><span className="simulationSectionKicker">Quick answers</span><h2 id="simulation-faq-title">{guide.questions}</h2>{!content && <p>Clear explanations of the science behind this lab, useful before or after an experiment.</p>}</div>
      <div className="simulationFaq">{guide.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
    </section>

    {locale === "en" && getArticlesForSimulation(simulation.slug).length > 0 && <aside className="simulationArticleLinks"><h2>Learn with this simulation</h2><ul>{getArticlesForSimulation(simulation.slug).map((article) => <li key={article.slug}><Link className="textLink" href={`/en/articles/${article.slug}`}>{article.title} →</Link></li>)}</ul></aside>}

    <nav className="relatedSimulations" aria-label={guide.related}>
      <header><div><h2>Learn More</h2></div></header>
      <div>{related.map((item, index) => <article className="subjectSimCard educationLabCard" key={item.slug}><div className="labCardHeader"><div><span className="labType">Lab {String(index + 1).padStart(2, "0")}{item.kind ? ` · ${item.kind}` : ""}</span><h3>{item.title}</h3></div>{item.featured && <span className="priorityBadge">Featured</span>}</div><div className="learningOutcome"><span>Learning outcome</span><strong>{item.outcome}</strong></div>{item.concepts && <p className="labConcepts">{item.concepts}</p>}<Link className="button subjectButton" href={`/${locale}/simulations/${item.slug}`}>{guide.open} →</Link></article>)}</div>
      <Link className="button relatedSeeAll" href={`/${locale}/subjects/${subject.slug}`}>See all {subject.eyebrow} simulations →</Link>
    </nav>

    <aside className="simulationBottomCta"><div><h2>Curious about the science behind the experiment?</h2><p>Read short science articles and keep building your understanding.</p></div><Link href="/en/articles">Explore science articles ↗</Link></aside>
  </section>;
}
