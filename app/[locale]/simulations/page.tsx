import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { displayDifficulty, displayOpportunity, getEducationCopy, getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { localizedMetadata } from "@/lib/seo/metadata";
import { subjectSlugs } from "@/lib/subjects/catalog";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const{locale:raw}=await params;const locale=isLocale(raw)?raw:"en";const c=getEducationCopy(locale);return localizedMetadata(locale,"/simulations",c.seo.libraryTitle,c.seo.libraryDescription,{});}

export default async function Simulations({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;if (!isLocale(raw)) notFound();const c=getEducationCopy(raw);const localized=subjectSlugs.map(slug=>getLocalizedSubject(raw,slug));const all=localized.flatMap(s=>s.simulations);const featured=all.filter(s=>s.featured);
  return <main className="container educationLibrary"><header className="pageHeader generalPageHeader"><div className="eyebrow">{c.library.eyebrow}</div><h1 className="pageTitle">{c.library.title}</h1><p className="lede">{c.library.body(all.length)}</p></header>
    <section className="libraryPriority section"><div className="sectionHeading"><div><div className="eyebrow">{c.library.priority}</div><h2>{c.library.priorityTitle}</h2></div><p>{c.library.priorityBody}</p></div><div className="priorityStrip">{featured.map(sim=><Link href={`/${raw}/simulations/${sim.slug}`} className="priorityStripCard" key={sim.slug}><span>{displayOpportunity(raw,sim.opportunity)}</span><strong>{sim.title}</strong>{sim.seoTarget&&raw==="en"&&<small>{sim.seoTarget}</small>}</Link>)}</div></section>
    {subjectSlugs.map(slug=>{const data=getLocalizedSubject(raw,slug);return <section className={`simulationShelf educationShelf subject-${slug}`} key={slug}><div className="shelfHeading"><div><span>{data.gradeBand} · {data.simulations.length} {c.generic.labs}</span><h2>{getLocalizedSubjectName(raw,slug)}</h2></div><Link href={`/${raw}/subjects/${slug}`}>{c.library.viewSubject} →</Link></div><div className="libraryCatalogGrid">{data.simulations.map((sim,index)=><article className="librarySimCard educationLibraryCard" key={sim.slug}><div className="libraryCardTop"><span className="labType">{c.library.lab} {String(index+1).padStart(2,"0")}{sim.kind?` · ${sim.kind}`:""}</span>{sim.featured?<span className="priorityBadge">{c.library.priorityBadge}</span>:<span className="lessonBadge">{sim.duration}</span>}</div><h3>{sim.title}</h3><div className="learningOutcome compactOutcome"><span>{c.library.whatLearn}</span><strong>{sim.outcome}</strong></div>{sim.concepts&&<p>{sim.concepts}</p>}{sim.seoTarget&&raw==="en"&&<div className="compactSeo"><span>{c.library.searchTopic}</span>{sim.seoTarget}</div>}<div className="simMeta"><span className="pill">{displayDifficulty(raw,sim.difficulty)}</span>{sim.opportunity&&<span className="pill">{displayOpportunity(raw,sim.opportunity)}</span>}</div><Link className="button subjectButton" href={`/${raw}/simulations/${sim.slug}`}>{c.library.startLab}</Link></article>)}</div></section>})}
  </main>;
}
