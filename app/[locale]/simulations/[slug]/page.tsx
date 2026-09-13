import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getEducationCopy, getLocalizedSubject } from "@/lib/i18n/content";
import { breadcrumbJsonLd, jsonLd, localizedMetadata, simulationJsonLd } from "@/lib/seo/metadata";
import { getSimulationCard, getSubjectForSimulation, isVisibleSubjectSlug } from "@/lib/subjects/catalog";
import { ConceptLabClient } from "@/components/simulation/ConceptLabClient";
import { ChemistryActivitiesClient } from "@/components/subjects/chemistry/ChemistryActivitiesClient";
import { PhysicsActivitiesClient } from "@/components/subjects/physics/PhysicsActivitiesClient";
import { SpaceActivitiesClient } from "@/components/subjects/space/SpaceActivitiesClient";
import { GeographyActivitiesClient } from "@/components/subjects/geography/GeographyActivitiesClient";
import { BiologyActivitiesClient } from "@/components/subjects/biology/BiologyActivitiesClient";
import { MathematicsActivitiesClient } from "@/components/subjects/mathematics/MathematicsActivitiesClient";
import { EnvironmentalActivitiesClient } from "@/components/subjects/environmental/EnvironmentalActivitiesClient";
import { SimulationGuide } from "@/components/seo/SimulationGuide";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";

export function generateStaticParams() {
  return visibleSubjectSlugs.flatMap((subject) => getLocalizedSubject("en", subject).simulations
    .filter((simulation) => simulation.slug !== "moon-landing" && simulation.slug !== "orbital-rescue")
    .map((simulation) => ({ slug: simulation.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const baseSimulation = getSimulationCard(slug);
  const baseSubject = getSubjectForSimulation(slug);
  if (!baseSimulation || !baseSubject || !isVisibleSubjectSlug(baseSubject.slug)) return {};
  const localizedSubject = getLocalizedSubject(locale, baseSubject.slug);
  const simulation = localizedSubject.simulations.find((item) => item.slug === slug);
  if (!simulation) return {};
  const copy = getEducationCopy(locale);
  const targetPhrase = locale === "en" && baseSimulation.seoTarget ? ` ${baseSimulation.seoTarget}.` : "";
  const keywords = [simulation.title, localizedSubject.eyebrow, ...(simulation.concepts ? simulation.concepts.split(" · ") : [])];
  if (locale === "en" && baseSimulation.seoTarget) keywords.unshift(baseSimulation.seoTarget);
  return localizedMetadata(
    locale,
    `/simulations/${slug}`,
    copy.seo.simulationTitle(simulation.title),
    copy.seo.simulationDescription(simulation.title, `${simulation.outcome}${targetPhrase}`),
    { keywords }
  );
}

export default async function ConceptSimulationPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const baseSubject = getSubjectForSimulation(slug);
  const baseSimulation = getSimulationCard(slug);
  if (!baseSubject || !baseSimulation || !isVisibleSubjectSlug(baseSubject.slug) || slug === "moon-landing" || slug === "orbital-rescue") notFound();
  const safeLocale = locale as Locale;
  const subject = getLocalizedSubject(safeLocale, baseSubject.slug);
  const simulation = subject.simulations.find((item) => item.slug === slug);
  if (!simulation) notFound();
  const copy = getEducationCopy(safeLocale);
  const targetPhrase = safeLocale === "en" && baseSimulation.seoTarget ? ` ${baseSimulation.seoTarget}.` : "";
  const schema = simulationJsonLd({
    locale: safeLocale,
    path: `/simulations/${slug}`,
    title: simulation.title,
    description: `${simulation.outcome}${targetPhrase}`,
    subject: subject.eyebrow,
    concepts: simulation.concepts ? simulation.concepts.split(" · ") : [],
  });
  const crumbs = breadcrumbJsonLd(safeLocale, [
    { name: copy.home.exploreSubjects, path: "/subjects" },
    { name: subject.eyebrow, path: `/subjects/${subject.slug}` },
    { name: simulation.title, path: `/simulations/${slug}` },
  ]);
  const activity = baseSubject.slug === "environmental-science"
    ? <EnvironmentalActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
    : baseSubject.slug === "mathematics"
      ? <MathematicsActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
      : baseSubject.slug === "biology"
        ? <BiologyActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
        : baseSubject.slug === "geography"
          ? <GeographyActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
          : baseSubject.slug === "space"
            ? <SpaceActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
            : baseSubject.slug === "physics"
              ? <PhysicsActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
              : baseSubject.slug === "chemistry"
                ? <ChemistryActivitiesClient key={slug} locale={safeLocale} subject={subject} simulation={simulation}/>
                : <ConceptLabClient locale={safeLocale} subject={subject} simulation={simulation} copy={{ lab: copy.lab }}/>;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)}/>
    {activity}
    <SimulationGuide locale={safeLocale} subject={subject} simulation={simulation}/>
  </>;
}
