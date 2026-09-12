import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getEducationCopy, getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { localizedMetadata, jsonLd, websiteJsonLd } from "@/lib/seo/metadata";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

const subjectGlyphs = { space: "✦", physics: "↗", geography: "◒", "environmental-science": "≈", biology: "⌁", chemistry: "⚗", mathematics: "∑" } as const;

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale:raw}=await params; const locale=isLocale(raw)?raw:"en"; const c=getEducationCopy(locale);
  return localizedMetadata(locale,"/",c.seo.homeTitle,c.seo.homeDescription,{});
}

export default async function Home({params}:{params:Promise<{locale:string}>}){
  const {locale:raw}=await params;if(!isLocale(raw))notFound();const c=getEducationCopy(raw);
  const visibleLabCount=visibleSubjectSlugs.reduce((count,slug)=>count+subjectsCatalog[slug].simulations.length,0);
  const structured=websiteJsonLd(raw,c.seo.homeTitle,c.seo.homeDescription);
  return <main className="educationHome">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)}/>
    <section className="container educationHero">
      <div className="educationHeroCopy">
        <div className="eyebrow">{c.home.eyebrow}</div><h1>{c.home.title}</h1><p>{c.home.intro}</p>
        <div className="actions"><Link className="button primary" href={`/${raw}/subjects`}>{c.home.exploreSubjects}</Link><Link className="button" href={`/${raw}/simulations`}>{c.home.browseLabs}</Link></div>
        <div className="learningMeta"><span>{c.home.grades}</span><span>{visibleLabCount} {c.home.interactiveLabs}</span><span>{c.home.noSignup}</span></div>
      </div>
      <aside className="learningCycleCard" aria-label={c.home.cycleTitle}><div className="learningCardHeader"><div><span className="eyebrow">{c.home.how}</span><h2>{c.home.cycleTitle}</h2></div><span className="lessonBadge">{c.home.stepsLabel}</span></div><ol className="learningCycleList">
        <li><b>01</b><div><strong>{c.home.predict}</strong><span>{c.home.predictBody}</span></div></li><li><b>02</b><div><strong>{c.home.experiment}</strong><span>{c.home.experimentBody}</span></div></li><li><b>03</b><div><strong>{c.home.observe}</strong><span>{c.home.observeBody}</span></div></li><li><b>04</b><div><strong>{c.home.explain}</strong><span>{c.home.explainBody}</span></div></li>
      </ol><div className="learningNote"><strong>{c.home.corePrinciple}</strong><span>{c.home.principle}</span></div></aside>
    </section>
    <section className="container subjectGateway educationSubjectGateway"><div className="sectionHeading"><div><div className="eyebrow">{c.home.subjects}</div><h2>{c.home.choose}</h2></div><p>{c.home.chooseBody}</p></div><div className="subjectGatewayGrid">{visibleSubjectSlugs.map(slug=>{const data=getLocalizedSubject(raw,slug);return <Link className={`subjectGatewayCard educationSubjectCard subject-${slug}`} key={slug} href={`/${raw}/subjects/${slug}`}><div className="subjectCardTop"><span className="gatewayGlyph">{subjectGlyphs[slug]}</span><span className="gradeTag">{data.gradeBand}</span></div><div><small>{data.simulations.length} {c.home.interactiveLabs}</small><h3>{getLocalizedSubjectName(raw,slug)}</h3><p>{data.learningObjectives[0]}</p></div><div className="subjectCardFooter"><span>{data.concepts.slice(0,2).join(" · ")}</span><b>{c.home.viewSubject} →</b></div></Link>})}</div></section>
    <section className="container section educationMethod"><div className="sectionHeading"><div><div className="eyebrow">{c.home.learningDesign}</div><h2>{c.home.everyLab}</h2></div><p>{c.home.everyLabBody}</p></div><div className="educationFeatureGrid"><article className="educationFeature"><span>?</span><h3>{c.home.questionTitle}</h3><p>{c.home.questionBody}</p></article><article className="educationFeature"><span>↔</span><h3>{c.home.variablesTitle}</h3><p>{c.home.variablesBody}</p></article><article className="educationFeature"><span>▥</span><h3>{c.home.evidenceTitle}</h3><p>{c.home.evidenceBody}</p></article><article className="educationFeature"><span>↻</span><h3>{c.home.retryTitle}</h3><p>{c.home.retryBody}</p></article></div></section>
    <section className="container classroomBand"><div><span className="eyebrow">{c.home.anywhere}</span><h2>{c.home.anywhereTitle}</h2><p>{c.home.anywhereBody}</p></div><div className="classroomCards"><article><b>{c.home.studentView}</b><span>{c.home.studentFlow}</span></article><article><b>{c.home.teacherReady}</b><span>{c.home.teacherBody}</span></article></div></section>
  </main>;
}
