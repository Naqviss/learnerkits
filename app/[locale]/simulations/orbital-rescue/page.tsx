import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { getEducationCopy, getLocalizedSubject } from "@/lib/i18n/content";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata, simulationJsonLd } from "@/lib/seo/metadata";
import { SimulationGuide } from "@/components/seo/SimulationGuide";

const OrbitalRescueClient = dynamic(() => import("@/components/simulation/OrbitalRescueClient").then((module) => module.OrbitalRescueClient));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const subject = getLocalizedSubject(locale, "space");
  const simulation = subject.simulations.find((item) => item.slug === "orbital-rescue");
  const m = getMessages(locale);
  const c = getEducationCopy(locale);
  return localizedMetadata(locale, "/simulations/orbital-rescue", c.seo.simulationTitle(simulation?.title ?? m.orbitalRescue.title), c.seo.simulationDescription(simulation?.title ?? m.orbitalRescue.title, simulation?.outcome ?? m.orbitalRescue.subtitle));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const m = getMessages(locale);
  const c = getEducationCopy(locale);
  const subject = getLocalizedSubject(locale, "space");
  const simulation = subject.simulations.find((item) => item.slug === "orbital-rescue");
  const schema = simulationJsonLd({ locale, path: "/simulations/orbital-rescue", title: simulation?.title ?? m.orbitalRescue.title, description: simulation?.outcome ?? m.orbitalRescue.subtitle, subject: subject.eyebrow, concepts: simulation?.concepts ? simulation.concepts.split(" · ") : [] });
  const crumbs = breadcrumbJsonLd(locale, [{ name: c.home.exploreSubjects, path: "/subjects" }, { name: subject.eyebrow, path: "/subjects/space" }, { name: simulation?.title ?? m.orbitalRescue.title, path: "/simulations/orbital-rescue" }]);
  const faq = faqJsonLd(locale, m.orbitalRescue.seo.faq);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)}/>
    <Suspense fallback={<div className="simLayout" aria-busy="true"><section className="simViewport"><div className="statusBanner"><strong>{m.orbitalRescue.title}</strong><span>{m.loading.environment}</span></div></section></div>}><OrbitalRescueClient m={m}/></Suspense>
    <section className="container section" aria-labelledby="orbit-objectives"><h2 id="orbit-objectives">{m.orbitalRescue.seo.objectivesTitle}</h2><div className="grid2">{m.orbitalRescue.seo.objectives.map((objective) => <article className="card" key={objective}><h3>{objective}</h3></article>)}</div></section>
    <section className="container section"><h2>{m.orbitalRescue.seo.faqTitle}</h2><div className="grid3">{m.orbitalRescue.seo.faq.map((item) => <article className="card" key={item.q}><h3>{item.q}</h3><p className="muted">{item.a}</p></article>)}</div></section>
    <section className="container section"><div className="card"><h2>{m.orbitalRescue.seo.relatedTitle}</h2><p className="muted">{m.orbitalRescue.seo.related}</p><Link className="button" href={`/${locale}/simulations`}>{m.navigation.simulations}</Link></div></section>
    {simulation && <SimulationGuide locale={locale} subject={subject} simulation={simulation}/>}
  </>;
}
