import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { displayDifficulty, getEducationCopy, getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { localizedMetadata } from "@/lib/seo/metadata";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale:raw}=await params,locale=isLocale(raw)?raw:"en",copy=getEducationCopy(locale);
  return localizedMetadata(locale,"/simulations",copy.seo.libraryTitle,copy.seo.libraryDescription,{});
}

export default async function Simulations({params}:{params:Promise<{locale:string}>}){
  const {locale:raw}=await params;if(!isLocale(raw))notFound();
  const copy=getEducationCopy(raw),localized=visibleSubjectSlugs.map(slug=>getLocalizedSubject(raw,slug)),all=localized.flatMap(subject=>subject.simulations),featured=all.filter(sim=>sim.featured);
  return <main className="container educationLibrary">
    <header className="pageHeader generalPageHeader"><div className="eyebrow">{copy.library.eyebrow}</div><h1 className="pageTitle">{copy.library.title}</h1><p className="lede">{copy.library.body(all.length,visibleSubjectSlugs.length)}</p></header>
    <nav className="subjectQuickNav" aria-label={copy.home.subjects}>{visibleSubjectSlugs.map((slug,index)=><a href={`#${slug}`} className={`subject-${slug}`} key={slug}><span>{String(index+1).padStart(2,"0")}</span>{getLocalizedSubjectName(raw,slug)}</a>)}</nav>
    <section className="libraryPriority section"><div className="sectionHeading"><div><div className="eyebrow">{copy.library.priority}</div><h2>{copy.library.priorityTitle}</h2></div><p>{copy.library.priorityBody}</p></div><div className="priorityStrip">{featured.map(sim=><Link href={`/${raw}/simulations/${sim.slug}`} className="priorityStripCard" key={sim.slug}><strong>{sim.title}</strong></Link>)}</div></section>
    {visibleSubjectSlugs.map((slug,shelfIndex)=>{
      const subject=getLocalizedSubject(raw,slug);
      return <details id={slug} className={`simulationShelf educationShelf subject-${slug}`} key={slug} open={shelfIndex===0}>
        <summary className="shelfHeading"><div><span>{subject.gradeBand} · {subject.simulations.length} {copy.generic.labs}</span><h2>{getLocalizedSubjectName(raw,slug)}</h2></div><b><span>{copy.generic.labs}</span><i>⌄</i></b></summary>
        <div className="shelfTools"><p>{subject.description}</p><Link href={`/${raw}/subjects/${slug}`}>{copy.library.viewSubject} →</Link></div>
        <div className="libraryCatalogGrid">{subject.simulations.map((sim,index)=><article className="librarySimCard educationLibraryCard" key={sim.slug}>
          <div className="libraryCardTop"><span className="labType">{copy.library.lab} {String(index+1).padStart(2,"0")}{sim.kind?` · ${sim.kind}`:""}</span>{sim.featured?<span className="priorityBadge">{copy.library.priorityBadge}</span>:<span className="lessonBadge">{sim.duration}</span>}</div>
          <h3>{sim.title}</h3><div className="learningOutcome compactOutcome"><span>{copy.library.whatLearn}</span><strong>{sim.outcome}</strong></div>{sim.concepts&&<p>{sim.concepts}</p>}
          <div className="simMeta"><span className="pill">{displayDifficulty(raw,sim.difficulty)}</span></div><Link className="button subjectButton" href={`/${raw}/simulations/${sim.slug}`}>{copy.library.startLab} <span>→</span></Link>
        </article>)}</div>
      </details>;
    })}
  </main>;
}
