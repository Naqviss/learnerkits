import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { getEducationCopy, getLocalizedSubject } from "@/lib/i18n/content";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata, simulationJsonLd } from "@/lib/seo/metadata";
import { SimulationPageLayout } from "@/components/simulation/SimulationPageLayout";
import { SimulationAssistant } from "@/components/premium/SimulationAssistant";
import { getSimulationGuide } from "@/lib/seo/simulation-guides";
import { getSimulationContent, getSimulationDescription, simulationContentUpdated } from "@/lib/seo/simulation-content";

const OrbitalRescueClient = dynamic(() => import("@/components/simulation/OrbitalRescueClient").then((module) => module.OrbitalRescueClient));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const subject = getLocalizedSubject(locale, "space");
  const simulation = subject.simulations.find((item) => item.slug === "orbital-rescue");
  const m = getMessages(locale);
  const c = getEducationCopy(locale);
  return localizedMetadata(locale, "/simulations/orbital-rescue", c.seo.simulationTitle(simulation?.title ?? m.orbitalRescue.title), getSimulationDescription("orbital-rescue", locale) ?? c.seo.simulationDescription(simulation?.title ?? m.orbitalRescue.title, simulation?.outcome ?? m.orbitalRescue.subtitle));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const m = getMessages(locale);
  const c = getEducationCopy(locale);
  const subject = getLocalizedSubject(locale, "space");
  const simulation = subject.simulations.find((item) => item.slug === "orbital-rescue");
  const content = locale === "en" ? getSimulationContent("orbital-rescue") : undefined;
  const schema = simulationJsonLd({ locale, path: "/simulations/orbital-rescue", title: simulation?.title ?? m.orbitalRescue.title, description: simulation?.outcome ?? m.orbitalRescue.subtitle, subject: subject.eyebrow, concepts: simulation?.concepts ? simulation.concepts.split(" · ") : [], abstract: content?.answer, dateModified: content ? simulationContentUpdated : undefined });
  const crumbs = breadcrumbJsonLd(locale, [{ name: c.home.exploreSubjects, path: "/subjects" }, { name: subject.eyebrow, path: "/subjects/space" }, { name: simulation?.title ?? m.orbitalRescue.title, path: "/simulations/orbital-rescue" }]);
  const faq = faqJsonLd(locale, simulation ? getSimulationGuide(locale, subject, simulation).faq : m.orbitalRescue.seo.faq);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)}/>
    {simulation && <SimulationPageLayout locale={locale} subject={subject} simulation={simulation}>
      <Suspense fallback={<div className="simLayout" aria-busy="true"><section className="simViewport"><div className="statusBanner"><strong>{m.orbitalRescue.title}</strong><span>{m.loading.environment}</span></div></section></div>}><OrbitalRescueClient m={m}/></Suspense>
    </SimulationPageLayout>}
    <SimulationAssistant locale={locale} simulation={{ title: simulation?.title ?? m.orbitalRescue.title, subject: subject.eyebrow, concepts: simulation?.concepts }}/>
  </>;
}
