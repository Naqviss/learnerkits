import { studentGuides } from "@/lib/simulations/practical/student-guides";
import type { InvestigationSlug } from "@/lib/simulations/practical/investigations";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";
import { SimulationGuide } from "@/components/seo/SimulationGuide";
import { getSimulationContent, simulationReviewDate } from "@/lib/seo/simulation-content";
import { ProtectedFeaturePreview } from "./ProtectedFeaturePreview";

const dateFormat = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
import { SimulationSectionNav } from "./SimulationSectionNav";

export function SimulationPageLayout({
  locale,
  subject,
  simulation,
  children,
  supplementaryGuide,
  measurementsAvailable = true,
  missionsAvailable = true,
}: {
  locale: Locale;
  subject: SubjectDefinition;
  simulation: SimulationCard;
  children: React.ReactNode;
  supplementaryGuide?: React.ReactNode;
  measurementsAvailable?: boolean;
  missionsAvailable?: boolean;
}) {
  const content = locale === "en" ? getSimulationContent(simulation.slug) : undefined;
  const student = studentGuides[simulation.slug as InvestigationSlug];
  const guidePath = `/en/guides/${simulation.slug}`;
  return <main className={`universalSimulationPage subject-${subject.slug}`}>
    <header className="container simulationPageHeader">
      <nav className="simulationBreadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href={locale === "en" ? "/" : `/${locale}`}>Home</Link></li>
          <li><Link href={`/${locale}/simulations`}>Simulations</Link></li>
          <li><Link href={`/${locale}/subjects/${subject.slug}`}>{subject.eyebrow}</Link></li>
          <li aria-current="page">{simulation.title}</li>
        </ol>
      </nav>
      <h1>{simulation.title}</h1>
      <p>{simulation.outcome}</p>
    </header>
    <SimulationSectionNav/>
    <article>
      <section id="simulation" className="simulationPrimary" aria-label={`${simulation.title} interactive simulation`}>
        <div className="simulationEngine">{children}</div>
      </section>
      {/* Answer-first block: the page's main question and a self-contained answer that search
          engines and AI assistants can quote. English pages only; other languages keep the summary. */}
      <section className="container simulationIntroduction" aria-labelledby="simulation-introduction-title">
        <div>
          <span className="eyebrow">{content ? `About this simulation · Updated ${dateFormat.format(new Date(simulationReviewDate(simulation.slug)))}` : "About this simulation"}</span>
          <h2 id="simulation-introduction-title">{content ? content.question : `Explore ${simulation.concepts.replaceAll(" · ", ", ")}`}</h2>
        </div>
        <p>{content ? content.answer : `${simulation.outcome} Change the available controls, observe the model’s visual and numerical evidence, and compare what changes when you test a new setup.`}</p>
      </section>
      <div id="guide" className="simulationGuideAnchor">
        <SimulationGuide locale={locale} subject={subject} simulation={simulation} protectedSections={
          <div className="protectedSimulationGrid">
            <ProtectedFeaturePreview feature="Measurements" simulation={simulation} available={!!student || measurementsAvailable}>
              {student && <div><p>{student.method}</p><Link className="textLink" href={guidePath+"/how-to-measure"}>{student.measurement} →</Link></div>}
            </ProtectedFeaturePreview>
            <ProtectedFeaturePreview feature="Missions" simulation={simulation} available={!!student || missionsAvailable} prompts={student ? [student.challenge, student.method, student.explanation] : undefined}>
              {student && <div><p>{student.challenge}</p><Link className="textLink" href={guidePath+"/mission"}>{student.mission} →</Link></div>}
            </ProtectedFeaturePreview>
          </div>
        }/>
        {supplementaryGuide}
      </div>
    </article>
  </main>;
}
