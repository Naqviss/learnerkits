import Link from "next/link";
import { articleSummaries } from "@/lib/articles/catalog";
import { ArticleCard } from "@/components/articles/ArticleCard";
import articleStyles from "@/components/articles/articles.module.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getEducationCopy, getLocalizedSubject, getLocalizedSubjectName, homeImpact } from "@/lib/i18n/content";
import { localizedMetadata, localizedUrl, jsonLd, siteName, siteUrl, websiteJsonLd } from "@/lib/seo/metadata";
import { getMoleculeKitCopy } from "@/lib/seo/molecule-kit-content";
import { hiddenSubjectSlugs, subjectSlugs, subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { SubjectCardMedia } from "@/components/subjects/SubjectCardMedia";


export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale:raw}=await params; const locale=isLocale(raw)?raw:"en"; const c=getEducationCopy(locale);
  return localizedMetadata(locale,"/",`${c.seo.homeTitle} | ${siteName}`,c.seo.homeDescription,{});
}

export default async function Home({params}:{params:Promise<{locale:string}>}){
  const {locale:raw}=await params;if(!isLocale(raw))notFound();const c=getEducationCopy(raw);
  const visibleLabCount=visibleSubjectSlugs.reduce((count,slug)=>count+subjectsCatalog[slug].simulations.length,0);
  const homeUrl=localizedUrl(raw,"/");
  const base=websiteJsonLd(raw,c.seo.homeDescription);
  const structured={...base,"@graph":[...base["@graph"],
    {"@type":"WebPage","@id":`${homeUrl}#webpage`,url:homeUrl,name:`${c.seo.homeTitle} | ${siteName}`,description:c.seo.homeDescription,inLanguage:raw,isPartOf:{"@id":`${siteUrl}/#website`},about:{"@id":`${siteUrl}/#organization`},primaryImageOfPage:`${siteUrl}/og-default.png`,audience:{"@type":"EducationalAudience",educationalRole:["student","teacher"]},mainEntity:{"@id":`${homeUrl}#subjects`}},
    {"@type":"ItemList","@id":`${homeUrl}#subjects`,name:c.home.choose,itemListElement:visibleSubjectSlugs.map((slug,i)=>({"@type":"ListItem",position:i+1,name:getLocalizedSubjectName(raw,slug),url:localizedUrl(raw,`/subjects/${slug}`)}))},
  ]};
  const kit=getMoleculeKitCopy(raw);
  const chemistryName=getLocalizedSubjectName(raw,"chemistry");
  const impact=homeImpact[raw];const fmt=(n:number)=>new Intl.NumberFormat(raw).format(n);
  return <main className="educationHome">
    <div className="homeScrollProgress" aria-hidden="true"/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)}/>
    <section className="container educationHero">
      <div className="heroOrbits" aria-hidden="true"><span/><span/><span/></div>
      <div className="educationHeroCopy">
        <div className="eyebrow">{c.home.eyebrow}</div><h1>{c.home.title}</h1><p>{c.home.intro}</p>
        <div className="actions"><Link className="button primary" href={`/${raw}/subjects`}>{c.home.exploreSubjects}</Link><Link className="button" href={`/${raw}/simulations`}>{c.home.browseLabs}</Link></div>
        <div className="learningMeta"><span>{c.home.grades}</span><span>{visibleLabCount} {c.home.interactiveLabs}</span><span>{c.home.noSignup}</span></div>
      </div>
      <aside className="learningCycleCard" aria-label={c.home.cycleTitle}><div className="learningCardHeader"><div><span className="eyebrow">{c.home.how}</span><h2>{c.home.cycleTitle}</h2></div><span className="lessonBadge">{c.home.stepsLabel}</span></div><ol className="learningCycleList">
        <li><b>01</b><div><strong>{c.home.predict}</strong><span>{c.home.predictBody}</span></div></li><li><b>02</b><div><strong>{c.home.experiment}</strong><span>{c.home.experimentBody}</span></div></li><li><b>03</b><div><strong>{c.home.observe}</strong><span>{c.home.observeBody}</span></div></li><li><b>04</b><div><strong>{c.home.explain}</strong><span>{c.home.explainBody}</span></div></li>
      </ol><div className="learningNote"><strong>{c.home.corePrinciple}</strong><span>{c.home.principle}</span></div></aside>
    </section>
    <section className="container">
      <div className="topicGuideAnswer aboutLK">
        <div className="aboutLKIntro">
          <h2>{c.home.aioEyebrow}</h2>
          <p>{c.home.aioAnswer(visibleLabCount, visibleSubjectSlugs.length).split(/\*\*(.+?)\*\*/).map((part,i)=>i%2?<strong key={i}>{part}</strong>:part)}</p>
        </div>
        <div className="aboutLKImpact">
          <p className="aboutLKStatement">{impact.statement}</p>
          <ul className="aboutLKStats">
            <li><i className="aboutLKIcon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M22 10v6"/></svg></i><b>{fmt(5000)}+</b><span>{impact.students}</span></li>
            <li><i className="aboutLKIcon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/><path d="m7 11 3-3 3 2 4-4"/></svg></i><b>{fmt(1300)}+</b><span>{impact.teachers}</span></li>
            <li><i className="aboutLKIcon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.4 1.7a1 1 0 0 1 .6.9V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.4a1 1 0 0 1 .6-.9L6 10"/><path d="M18 5v17"/><path d="m4 6 7.1-3.6a2 2 0 0 1 1.8 0L20 6"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg></i><b>{fmt(150)}+</b><span>{impact.schools}</span></li>
          </ul>
        </div>
      </div>
    </section>
    <section className="container subjectGateway educationSubjectGateway"><div className="sectionHeading"><div><div className="eyebrow">{c.home.subjects}</div><h2>{c.home.choose}</h2></div><p>{c.home.chooseBody}</p></div><div className="subjectGatewayGrid">{visibleSubjectSlugs.map(slug=>{const data=getLocalizedSubject(raw,slug);return <Link className={`subjectGatewayCard educationSubjectCard subject-${slug}`} key={slug} href={`/${raw}/subjects/${slug}`}><SubjectCardMedia subject={slug} locale={raw}/><div><small>{data.simulations.length} {c.home.interactiveLabs}</small><h3>{getLocalizedSubjectName(raw,slug)}</h3><p>{data.learningObjectives[0]}</p></div><div className="subjectCardFooter"><span>{data.concepts.slice(0,2).join(" · ")}</span><b>{c.home.viewSubject} →</b></div></Link>})}{subjectSlugs.filter(slug=>hiddenSubjectSlugs.has(slug)).map(slug=><div className={`subjectGatewayCard educationSubjectCard subjectComingSoon subject-${slug}`} key={slug} aria-disabled="true"><SubjectCardMedia subject={slug} locale={raw} comingSoon={c.home.comingSoon}/><div><h3>{getLocalizedSubjectName(raw,slug)}</h3><p>{c.home.comingSoonBody}</p></div></div>)}</div></section>
    <section className="container moleculeKitBanner subject-chemistry">
      <div className="kitAtom" aria-hidden="true"><b/><i><span/></i><i><span/></i><i><span/></i></div>
      <div><div className="eyebrow">{kit.banner.newLabel} · {chemistryName}</div><h2>{kit.banner.title}</h2><p>{kit.banner.body}</p></div>
      <Link className="button primary" href={`/${raw}/molecule-kit`}>{kit.banner.cta} →</Link>
    </section>
    <section className="container section educationMethod"><div className="sectionHeading"><div><div className="eyebrow">{c.home.learningDesign}</div><h2>{c.home.everyLab}</h2></div><p>{c.home.everyLabBody}</p></div><div className="educationFeatureGrid"><article className="educationFeature"><span>?</span><h3>{c.home.questionTitle}</h3><p>{c.home.questionBody}</p></article><article className="educationFeature"><span>↔</span><h3>{c.home.variablesTitle}</h3><p>{c.home.variablesBody}</p></article><article className="educationFeature"><span>▥</span><h3>{c.home.evidenceTitle}</h3><p>{c.home.evidenceBody}</p></article><article className="educationFeature"><span>↻</span><h3>{c.home.retryTitle}</h3><p>{c.home.retryBody}</p></article></div></section>
    <section className="container classroomBand"><div><span className="eyebrow">{c.home.anywhere}</span><h2>{c.home.anywhereTitle}</h2><p>{c.home.anywhereBody}</p></div><div className="classroomCards"><article><b>{c.home.studentView}</b><span>{c.home.studentFlow}</span></article><article><b>{c.home.teacherReady}</b><span>{c.home.teacherBody}</span></article></div></section>
    {raw === "en" && <section className="container section homeArticles"><div className="sectionHeading"><div><span className="eyebrow">The learning notebook</span><h2>Read, question, experiment.</h2></div><Link className="textLink" href="/en/articles">Explore all articles →</Link></div><div className={articleStyles.grid}>{articleSummaries.slice(0, 3).map((article) => <ArticleCard key={article.slug} article={article} headingLevel={3} />)}</div></section>}
  </main>;
}
