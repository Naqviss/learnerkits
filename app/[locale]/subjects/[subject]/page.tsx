import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { displayDifficulty, getEducationCopy, getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { breadcrumbJsonLd, jsonLd, localizedMetadata, subjectCollectionJsonLd } from "@/lib/seo/metadata";
import { isVisibleSubjectSlug, visibleSubjectSlugs, type SubjectSlug } from "@/lib/subjects/catalog";
import { SubjectImage } from "@/components/subjects/SubjectImage";
import { subjectImageJsonLd, withSubjectImage } from "@/lib/seo/subject-images";

export function generateStaticParams() { return visibleSubjectSlugs.map((subject) => ({ subject })); }

export async function generateMetadata({params}:{params:Promise<{locale:string;subject:string}>}):Promise<Metadata>{
  const {locale,subject}=await params;if(!isLocale(locale)||!isVisibleSubjectSlug(subject))return{};const c=getEducationCopy(locale);const data=getLocalizedSubject(locale,subject);const name=getLocalizedSubjectName(locale,subject);
  return withSubjectImage(localizedMetadata(locale,`/subjects/${subject}`,c.seo.subjectTitle(name),c.seo.subjectDescription(name,data.description),{keywords:[name,...data.concepts,c.subject.labs,c.lab.interactiveModel]}), locale, subject);
}

export default async function SubjectPage({ params }: { params: Promise<{ locale: string; subject: string }> }) {
  const { locale, subject } = await params;if (!isLocale(locale) || !isVisibleSubjectSlug(subject)) notFound();const c=getEducationCopy(locale);const subjectSlug=subject as SubjectSlug;const data=getLocalizedSubject(locale,subjectSlug);const name=getLocalizedSubjectName(locale,subjectSlug);
  const breadcrumb=breadcrumbJsonLd(locale,[{name:c.home.subjects,path:"/subjects"},{name,path:`/subjects/${subjectSlug}`}]);
  const collection={ ...subjectCollectionJsonLd({locale,path:`/subjects/${subjectSlug}`,name,description:data.description,simulations:data.simulations.map((sim)=>({name:sim.title,path:`/simulations/${sim.slug}`,description:sim.outcome}))}), image: subjectImageJsonLd(locale, subjectSlug), primaryImageOfPage: subjectImageJsonLd(locale, subjectSlug) };
  return <main className={`subjectPage educationSubjectPage subject-${subject}`}><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)}/><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)}/>
    <section className="container subjectHero educationSubjectHero"><div className="subjectHeroCopy"><Link className="backLink" href={`/${locale}/subjects`}>← {c.home.subjects}</Link><div className="eyebrow">{data.eyebrow}</div><h1>{data.headline}</h1><p>{data.description}</p><div className="subjectStudyMeta"><span>{data.gradeBand}</span><span>{data.simulations.length} {c.subject.labs}</span><span>{data.concepts.length} {c.subject.concepts}</span></div><div className="conceptRow">{data.concepts.map(concept=><span className="conceptChip" key={concept}>{concept}</span>)}</div></div><div className="subjectStudyPanel"><SubjectImage subject={subjectSlug} locale={locale} priority/><div className="studyPanelBody"><span className="eyebrow">{c.subject.learningObjectives}</span><ul>{data.learningObjectives.map(objective=><li key={objective}><span>✓</span>{objective}</li>)}</ul></div></div></section>
    <section className="container inquiryCard"><div><span className="eyebrow">{c.subject.inquiry}</span><p>{c.subject.inquiryBody}</p></div><strong>{data.prompt}</strong></section>
    <section className="container section subjectLabs educationLabs"><div className="sectionHeading"><div><div className="eyebrow">{c.subject.complete}</div><h2>{c.subject.ways(data.simulations.length)}</h2></div><p>{c.subject.completeBody}</p></div><div className="labCatalogGrid">{data.simulations.map((sim,index)=><article className="subjectSimCard educationLabCard" key={sim.slug}><div className="labCardHeader"><div><span className="labType">{c.library.lab} {String(index+1).padStart(2,"0")}{sim.kind?` · ${sim.kind}`:""}</span><h3>{sim.title}</h3></div>{sim.featured&&<span className="priorityBadge">{c.subject.priority}</span>}</div><div className="learningOutcome"><span>{c.subject.learningOutcome}</span><strong>{sim.outcome}</strong></div>{sim.concepts&&<p className="labConcepts">{sim.concepts}</p>}<div className="simMeta"><span className="pill">{displayDifficulty(locale,sim.difficulty)}</span><span className="pill">{sim.duration}</span></div><Link className="button subjectButton" href={`/${locale}/simulations/${sim.slug}`}>{c.subject.startLab} →</Link></article>)}</div></section>
    <section className="container subjectStudyTips"><div><span className="eyebrow">{c.subject.study}</span><h2>{c.subject.studyTitle}</h2></div><div className="studyTipsGrid"><article><b>{c.subject.predict}</b><span>{c.subject.predictBody}</span></article><article><b>{c.subject.oneThing}</b><span>{c.subject.oneThingBody}</span></article><article><b>{c.subject.evidence}</b><span>{c.subject.evidenceBody}</span></article></div></section>
  </main>;
}
