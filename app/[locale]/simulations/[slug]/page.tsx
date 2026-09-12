import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getEducationCopy, getLocalizedSubject } from "@/lib/i18n/content";
import { breadcrumbJsonLd, jsonLd, localizedMetadata, simulationJsonLd } from "@/lib/seo/metadata";
import { getSimulationCard, getSubjectForSimulation } from "@/lib/subjects/catalog";
import { ConceptLabClient } from "@/components/simulation/ConceptLabClient";
import { ChemistryActivitiesClient } from "@/components/subjects/chemistry/ChemistryActivitiesClient";
import { PhysicsActivitiesClient } from "@/components/subjects/physics/PhysicsActivitiesClient";
import { SpaceActivitiesClient } from "@/components/subjects/space/SpaceActivitiesClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const baseSimulation = getSimulationCard(slug);
  const baseSubject = getSubjectForSimulation(slug);
  if (!baseSimulation || !baseSubject) return {};
  const localizedSubject = getLocalizedSubject(locale, baseSubject.slug);
  const simulation = localizedSubject.simulations.find((item) => item.slug === slug);
  if (!simulation) return {};
  const copy = getEducationCopy(locale);
  const keywords = [simulation.title, localizedSubject.eyebrow, ...(simulation.concepts ? simulation.concepts.split(" · ") : [])];
  if (locale === "en" && baseSimulation.seoTarget) keywords.unshift(baseSimulation.seoTarget);
  return localizedMetadata(
    locale,
    `/simulations/${slug}`,
    copy.seo.simulationTitle(simulation.title),
    copy.seo.simulationDescription(simulation.title, simulation.outcome),
    { keywords }
  );
}

export default async function ConceptSimulationPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const baseSubject = getSubjectForSimulation(slug);
  const baseSimulation = getSimulationCard(slug);
  if (!baseSubject || !baseSimulation || slug === "moon-landing" || slug === "orbital-rescue") notFound();
  const safeLocale = locale as Locale;
  const subject = getLocalizedSubject(safeLocale, baseSubject.slug);
  const simulation = subject.simulations.find((item) => item.slug === slug);
  if (!simulation) notFound();
  const copy = getEducationCopy(safeLocale);
  const schema = simulationJsonLd({
    locale: safeLocale,
    path: `/simulations/${slug}`,
    title: simulation.title,
    description: simulation.outcome,
    subject: subject.eyebrow,
    concepts: simulation.concepts ? simulation.concepts.split(" · ") : [],
  });
  const crumbs = breadcrumbJsonLd(safeLocale, [
    { name: copy.home.exploreSubjects, path: "/subjects" },
    { name: subject.eyebrow, path: `/subjects/${subject.slug}` },
    { name: simulation.title, path: `/simulations/${slug}` },
  ]);
  if (baseSubject.slug === "space") return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)}/>
    <SpaceActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
  </>;
  if (baseSubject.slug === "physics") return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)}/>
    <PhysicsActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
  </>;
  if (baseSubject.slug === "chemistry") return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)}/>
    <ChemistryActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
  </>;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)}/>
    <ConceptLabClient locale={safeLocale} subject={subject} simulation={simulation} copy={{ lab: copy.lab }}/>
  </>;
}
