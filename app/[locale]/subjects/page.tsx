import Link from "next/link";
import type { Metadata } from "next";
import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n/config";
import {getEducationCopy,getLocalizedSubject,getLocalizedSubjectName} from "@/lib/i18n/content";
import {breadcrumbJsonLd,jsonLd,localizedMetadata,subjectCollectionJsonLd} from "@/lib/seo/metadata";
import { getSubjectSeo } from "@/lib/seo/subject-seo";
import { SubjectCardMedia } from "@/components/subjects/SubjectCardMedia";
import { hiddenSubjectSlugs, subjectSlugs, visibleSubjectSlugs } from "@/lib/subjects/catalog";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const{locale:raw}=await params;const locale=isLocale(raw)?raw:"en";const c=getEducationCopy(locale);return localizedMetadata(locale,"/subjects",c.seo.subjectsTitle,c.seo.subjectsDescription,{});}

export default async function Page({params}:{params:Promise<{locale:string}>}){
  const{locale:raw}=await params;if(!isLocale(raw))notFound();const c=getEducationCopy(raw);
  const breadcrumb=breadcrumbJsonLd(raw,[{name:c.home.subjects,path:"/subjects"}]);
  const collection=subjectCollectionJsonLd({locale:raw,path:"/subjects",name:c.seo.subjectsTitle,description:c.seo.subjectsDescription,simulations:visibleSubjectSlugs.map((slug)=>{const data=getLocalizedSubject(raw,slug);return{name:getLocalizedSubjectName(raw,slug),path:`/subjects/${slug}`,description:getSubjectSeo(raw,slug,data.simulations.length)?.description??data.description};})});
  return <main className="container educationIndex"><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)}/><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)}/><header className="pageHeader generalPageHeader"><div className="eyebrow">{c.subjectsIndex.eyebrow}</div><h1 className="pageTitle">{c.subjectsIndex.title}</h1><p className="lede">{c.subjectsIndex.body}</p></header><section className="subjectIndexGrid">{visibleSubjectSlugs.map((slug,index)=>{const data=getLocalizedSubject(raw,slug);return <Link href={`/${raw}/subjects/${slug}`} className={`subjectIndexCard educationIndexCard subjectImageCard subject-${slug}`} key={slug}><SubjectCardMedia subject={slug} locale={raw} priority={index === 0}/><div className="indexCardHeader"><span/><span className="lessonBadge">{String(data.simulations.length).padStart(2,"0")} {c.subjectsIndex.labs}</span></div><h2>{getLocalizedSubjectName(raw,slug)}</h2><p>{data.description}</p><div className="indexObjective"><span>{c.subjectsIndex.firstGoal}</span><strong>{data.learningObjectives[0]}</strong></div><div className="conceptRow">{data.concepts.map(concept=><span className="conceptChip" key={concept}>{concept}</span>)}</div><b className="indexAction">{c.subjectsIndex.open} →</b></Link>})}{subjectSlugs.filter(slug=>hiddenSubjectSlugs.has(slug)).map(slug=><div className={`subjectIndexCard educationIndexCard subjectImageCard subjectComingSoon subject-${slug}`} key={slug} aria-disabled="true"><SubjectCardMedia subject={slug} locale={raw} comingSoon={c.home.comingSoon}/><div className="indexCardHeader"><span className="lessonBadge">{c.home.comingSoon}</span></div><h2>{getLocalizedSubjectName(raw,slug)}</h2><p>{c.home.comingSoonBody}</p></div>)}</section></main>
}
