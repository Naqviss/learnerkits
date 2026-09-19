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

const MoonLandingClient = dynamic(() => import("@/components/simulation/MoonLandingClient").then((module) => module.MoonLandingClient));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const subject = getLocalizedSubject(locale, "space");
  const simulation = subject.simulations.find((item) => item.slug === "moon-landing");
  const m = getMessages(locale);
  const c = getEducationCopy(locale);
  return localizedMetadata(locale, "/simulations/moon-landing", c.seo.simulationTitle(simulation?.title ?? m.moonLanding.title), c.seo.simulationDescription(simulation?.title ?? m.moonLanding.title, simulation?.outcome ?? m.moonLanding.subtitle));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const m = getMessages(locale);
  const c = getEducationCopy(locale);
  const subject = getLocalizedSubject(locale, "space");
  const simulation = subject.simulations.find((item) => item.slug === "moon-landing");
  const schema = simulationJsonLd({ locale, path: "/simulations/moon-landing", title: simulation?.title ?? m.moonLanding.title, description: simulation?.outcome ?? m.moonLanding.subtitle, subject: subject.eyebrow, concepts: simulation?.concepts ? simulation.concepts.split(" · ") : [] });
  const crumbs = breadcrumbJsonLd(locale, [{ name: c.home.exploreSubjects, path: "/subjects" }, { name: subject.eyebrow, path: "/subjects/space" }, { name: simulation?.title ?? m.moonLanding.title, path: "/simulations/moon-landing" }]);
  const faq = faqJsonLd(locale, m.moonLanding.seo.faq);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)}/>
    <Suspense fallback={<div className="simLayout" aria-busy="true"><section className="simViewport"><div className="statusBanner"><strong>{m.moonLanding.title}</strong><span>{m.loading.environment}</span></div></section></div>}><MoonLandingClient m={m}/></Suspense>
    <section className="container section" aria-labelledby="moon-objectives"><h2 id="moon-objectives">{m.moonLanding.seo.objectivesTitle}</h2><div className="grid2">{m.moonLanding.seo.objectives.map((objective) => <article className="card" key={objective}><h3>{objective}</h3></article>)}</div></section>
    <section className="container section"><h2>{m.moonLanding.seo.faqTitle}</h2><div className="grid3">{m.moonLanding.seo.faq.map((item) => <article className="card" key={item.q}><h3>{item.q}</h3><p className="muted">{item.a}</p></article>)}</div></section>
    <section className="container section"><div className="card"><h2>{m.moonLanding.seo.relatedTitle}</h2><p className="muted">{m.moonLanding.seo.related}</p><Link className="button" href={`/${locale}/learn`}>{m.navigation.learn}</Link></div></section>
    {simulation && <SimulationGuide locale={locale} subject={subject} simulation={simulation}/>}
  </>;
}
