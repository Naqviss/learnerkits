import Link from "next/link";
import type { Metadata } from "next";
import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n/config";
import {getEducationCopy,getLocalizedSubject,getLocalizedSubjectName} from "@/lib/i18n/content";
import {localizedMetadata} from "@/lib/seo/metadata";
import { subjectSlugs } from "@/lib/subjects/catalog";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const{locale:raw}=await params;const locale=isLocale(raw)?raw:"en";const c=getEducationCopy(locale);return localizedMetadata(locale,"/subjects",c.seo.subjectsTitle,c.seo.subjectsDescription,{});}

export default async function Page({params}:{params:Promise<{locale:string}>}){
  const{locale:raw}=await params;if(!isLocale(raw))notFound();const c=getEducationCopy(raw);
  return <main className="container educationIndex"><header className="pageHeader generalPageHeader"><div className="eyebrow">{c.subjectsIndex.eyebrow}</div><h1 className="pageTitle">{c.subjectsIndex.title}</h1><p className="lede">{c.subjectsIndex.body}</p></header><section className="subjectIndexGrid">{subjectSlugs.map((slug)=>{const data=getLocalizedSubject(raw,slug);return <Link href={`/${raw}/subjects/${slug}`} className={`subjectIndexCard educationIndexCard subject-${slug}`} key={slug}><div className="indexCardHeader"><span className="subjectIndexNumber">{data.gradeBand}</span><span className="lessonBadge">{String(data.simulations.length).padStart(2,"0")} {c.subjectsIndex.labs}</span></div><h2>{getLocalizedSubjectName(raw,slug)}</h2><p>{data.description}</p><div className="indexObjective"><span>{c.subjectsIndex.firstGoal}</span><strong>{data.learningObjectives[0]}</strong></div><div className="conceptRow">{data.concepts.map(concept=><span className="conceptChip" key={concept}>{concept}</span>)}</div><b className="indexAction">{c.subjectsIndex.open} →</b></Link>})}</section></main>
}
