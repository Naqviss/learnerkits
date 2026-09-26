import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { displayDifficulty, getEducationCopy, getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { localizedMetadata } from "@/lib/seo/metadata";
import { hiddenSubjectSlugs, subjectSlugs, subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { SimulationLibrary } from "@/components/simulation/SimulationLibrary";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale:raw}=await params,locale=isLocale(raw)?raw:"en",copy=getEducationCopy(locale);
  return localizedMetadata(locale,"/simulations",copy.seo.libraryTitle,copy.seo.libraryDescription,{});
}

export default async function Simulations({params}:{params:Promise<{locale:string}>}){
  const {locale:raw}=await params;if(!isLocale(raw))notFound();
  const copy=getEducationCopy(raw);
  const subjects=visibleSubjectSlugs.map(slug=>({slug,name:getLocalizedSubjectName(raw,slug),data:getLocalizedSubject(raw,slug)}));
  const all=subjects.flatMap(({data})=>data.simulations),featured=all.filter(sim=>sim.featured).slice(0,6);
  const labs=subjects.flatMap(({slug,name,data})=>data.simulations.map((sim,index)=>({slug,name,sim,base:subjectsCatalog[slug].simulations[index]})));
  const levels=(["Beginner","Intermediate","Advanced"] as const).map(value=>({value,label:displayDifficulty(raw,value)}));
  return <main className="container educationLibrary simLibrary">
    <header className="pageHeader generalPageHeader libHeader"><div className="eyebrow">{copy.library.eyebrow}</div><h1 className="pageTitle">{copy.library.title}</h1><p className="lede">{copy.library.body(all.length,visibleSubjectSlugs.length)}</p></header>
    {featured.length>0&&<section className="libStartHere" aria-labelledby="lib-start-here"><h2 id="lib-start-here">{copy.library.priority}</h2><div>{featured.map(sim=><Link href={`/${raw}/simulations/${sim.slug}`} key={sim.slug}>{sim.title} <span aria-hidden="true">→</span></Link>)}</div></section>}
    <SimulationLibrary
      groups={subjects.map(({slug,name,data})=>({slug,name,meta:`${data.gradeBand} · ${data.simulations.length} ${copy.generic.labs}`,href:`/${raw}/subjects/${slug}`,viewLabel:copy.library.viewSubject}))}
      upcoming={subjectSlugs.filter(slug=>hiddenSubjectSlugs.has(slug)).map(slug=>({slug,name:getLocalizedSubjectName(raw,slug)}))}
      items={labs.map(({slug,name,sim,base})=>({subject:slug,level:sim.difficulty,text:[sim.title,sim.kind,sim.concepts,sim.outcome,name,base.title,base.concepts,sim.slug.replace(/-/g," ")].filter(Boolean).join(" ")}))}
      levels={levels}
      labels={{comingSoon:copy.home.comingSoon,comingSoonBody:copy.home.comingSoonBody,search:copy.library.searchLabel,placeholder:copy.library.searchPlaceholder,allSubjects:copy.library.allSubjects,allLevels:copy.library.allLevels,subjectFilter:copy.library.subjectFilter,levelFilter:copy.library.levelFilter,count:copy.subject.labSearchCount("{shown}","{total}"),empty:copy.subject.labSearchEmpty,clear:copy.subject.labSearchClear}}
    >{labs.map(({slug,sim})=><Link href={`/${raw}/simulations/${sim.slug}`} className={`libCard subject-${slug}`} key={sim.slug}>
      <div className="libCardTop"><span className="libKind">{sim.kind}</span>{sim.featured&&<span className="priorityBadge">{copy.library.priorityBadge}</span>}</div>
      <h3>{sim.title}</h3>
      <p>{sim.outcome}</p>
      <div className="libCardMeta"><span className="pill">{displayDifficulty(raw,sim.difficulty)}</span><span className="pill">{sim.duration}</span><b aria-hidden="true">→</b></div>
    </Link>)}</SimulationLibrary>
  </main>;
}
