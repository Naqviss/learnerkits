import { MoonOrbit } from "@/components/home/MoonOrbit";
import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { isLocale } from "@/lib/i18n/config";
import { localizedMetadata, localizedUrl, jsonLd, siteUrl, websiteJsonLd } from "@/lib/seo/metadata";
import { simulationCountLabel, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { isVerified, liveSubjects } from "@/lib/exam-prep/catalog";
import { mockExams } from "@/lib/mock-exams/catalog";
import { getHomeCopy } from "@/lib/home/content";
import { HomeStart } from "@/components/home/HomeStart";
import { HomeMotion } from "@/components/home/HomeMotion";
import { LabArtwork } from "@/components/home/LabArtwork";
import styles from "@/components/home/home.module.css";

const reachIcons = [
  <path key="students" d="m2 9 10-5 10 5-10 5L2 9Zm4 2v5q6 5 12 0v-5m4-2v7" />,
  <g key="instructors"><path d="M10 4h11v12h-6m-4-5 5-3M2 21v-3a5 5 0 0 1 10 0v3" /><circle cx="7" cy="9" r="3" /></g>,
  <path key="institutions" d="m2 8 10-5 10 5H2Zm3 3v7m5-7v7m4-7v7m5-7v7M3 21h18" />,
];

const featuredLabIds = [["space", "moon-phases-3d"], ["physics", "projectile-lab"], ["geography", "earthquake-epicenter-finder"], ["chemistry", "molecule-builder-3d"]] as const;
const guideSlugs = ["how-virtual-science-labs-work", "how-to-create-a-digital-science-notebook", "how-teachers-use-ai-to-prepare-science-lessons"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const c = getHomeCopy(locale);
  return { ...localizedMetadata(locale, "/", c.title, c.description), title: { absolute: c.title } };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = getHomeCopy(locale);
  const homeUrl = localizedUrl(locale, "/");
  const labCount = simulationCountLabel();
  const base = websiteJsonLd(locale, c.description);
  const structured = {
    ...base,
    "@graph": [...base["@graph"],
      { "@type": "WebPage", "@id": `${homeUrl}#webpage`, url: homeUrl, name: c.title, description: c.description, inLanguage: locale, dateModified: c.updatedAt, isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": `${siteUrl}/#organization` }, primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}/og-default.png` }, audience: { "@type": "EducationalAudience", educationalRole: ["student", "teacher"] }, mainEntity: { "@id": `${homeUrl}#subjects` } },
      { "@type": "ItemList", "@id": `${homeUrl}#subjects`, name: c.subjectLabel, numberOfItems: visibleSubjectSlugs.length, itemListElement: visibleSubjectSlugs.map((slug, i) => ({ "@type": "ListItem", position: i + 1, name: getLocalizedSubjectName(locale, slug), url: localizedUrl(locale, `/subjects/${slug}`) })) },
    ],
  };
  const featuredLabs = featuredLabIds.flatMap(([subject, slug]) => {
    const lab = getLocalizedSubject(locale, subject).simulations.find((item) => item.slug === slug);
    return lab ? [{ ...lab, subject, subjectName: getLocalizedSubjectName(locale, subject) }] : [];
  });
  const freeMocks = mockExams.filter((exam) => !exam.premium).slice(0, 2);
  const featureLinks = [`/${locale}/subjects`, "/en/exam-prep", "/en/teacher-kit"];

  return <main id="home" className={styles.home}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />
    <HomeMotion />
    <section className={`container ${styles.hero}`} aria-labelledby="home-heading">
      <div className={styles.heroCopy}>
        <span className={styles.heroEyebrow}>{labCount} {c.labs} · {visibleSubjectSlugs.length} {c.subjects}</span>
        <h1 id="home-heading">{c.heading}<br /><span>{c.highlight}</span></h1>
        <p>{c.intro}</p>
        <div className={styles.heroActions}><Link className={styles.primaryButton} href={`/${locale}/simulations`}>{c.explore}<span aria-hidden="true">↗</span></Link><a className={styles.secondaryButton} href="#student-exam-prep">{c.examHeading}</a><Link className={styles.secondaryButton} href="/en/teacher-kit">{c.teacherCta}</Link></div>
        <p className={styles.heroFootnote}><span aria-hidden="true">✓</span>{c.free}</p>
      </div>
      {featuredLabs[0] && <div className={styles.cover}>
        <MoonOrbit earthView={c.earthView} moveMoon={c.moveMoon} pauseOrbit={c.pauseOrbit} />
        <Link className={styles.coverCaption} href={`/${locale}/simulations/${featuredLabs[0].slug}`}><span><small>{featuredLabs[0].subjectName}</small><strong>{featuredLabs[0].title}</strong></span><b aria-hidden="true">↗</b></Link>
        <p className={styles.orbitNote}>{c.orbitNote}</p>
      </div>}
    </section>

    <nav className={`container ${styles.subjectStrip}`} aria-label={c.subjectLabel}>
      <span>{c.subjectLabel}</span><div>{visibleSubjectSlugs.map((slug) => <Link key={slug} href={`/${locale}/subjects/${slug}`}>{getLocalizedSubjectName(locale, slug)}<span aria-hidden="true">↗</span></Link>)}</div>
    </nav>

    <section id="our-reach" className={`container ${styles.reach}`} aria-labelledby="reach-heading">
      <h2 id="reach-heading">{c.reachHeading}</h2>
      <ul>
        {c.reach.map(({ count, label }, index) => (
          <li key={label}>
            <svg className={styles.reachIcon} viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {reachIcons[index]}
            </svg>
            <strong>{count}</strong> {label}
          </li>
        ))}
      </ul>
    </section>

    <section className={`container ${styles.section}`} aria-labelledby="lab-heading" data-home-reveal>
      <header className={styles.head}><div><span className="eyebrow">{c.labEyebrow}</span><h2 id="lab-heading">{c.labHeading}</h2></div><Link className={styles.arrowLink} href={`/${locale}/simulations`}>{c.browseLabs} →</Link></header>
      <div className={styles.simGrid}>{featuredLabs.map((lab, index) => <Link key={lab.slug} className={styles.sim} href={`/${locale}/simulations/${lab.slug}`} style={{ "--card-index": index } as CSSProperties}>
        <div className={styles.labArt}><LabArtwork kind={lab.subject} /><span>{lab.subjectName}</span></div><div className={styles.simBody}><small>{lab.kind}</small><h3>{lab.title}</h3><p>{lab.outcome}</p><b>{c.openLab}<span aria-hidden="true">↗</span></b></div>
      </Link>)}</div><p className={styles.fine}>{c.labNote}</p>
    </section>

    <section className={`container ${styles.section}`} aria-labelledby="paths-heading" data-home-reveal>
      <header className={styles.head}><div><span className="eyebrow">{c.toolsLabel}</span><h2 id="paths-heading">{c.toolsHeading}</h2></div><p>{c.toolsIntro}</p></header>
      <div className={styles.workbench}><HomeStart locale={locale} copy={c.preview} /><div className={styles.featureGrid}>{c.features.map((feature, index) => <Link key={feature.label} className={`${styles.featureCard} ${[styles.learnCard, styles.reviseCard, styles.teachCard][index]}`} href={featureLinks[index]}>
        <div className={styles.featureTop}><span>{feature.label}</span><span className={styles.featureGlyph} aria-hidden="true">{["✳", "▤", "✎"][index]}</span></div><h3>{feature.title}</h3><p>{feature.body}</p><span className={styles.featureFoot}>{feature.footer}<b aria-hidden="true">↗</b></span>
      </Link>)}</div></div>
    </section>

    <section id="student-exam-prep" className={`container ${styles.section}`} aria-labelledby="exam-heading" data-home-reveal>
      <header className={styles.head}><div><span className="eyebrow">{c.examEyebrow}</span><h2 id="exam-heading">{c.examHeading}</h2></div><p>{c.examIntro}</p></header>
      <div className={styles.examGrid}>
        <article className={`${styles.panel} ${styles.panelTinted}`}>
          <h3>{c.prepTitle}</h3><p>{c.prepBody}</p>
          <ul className={styles.courseList}>{liveSubjects.map(subject => {
            const level = subject.id === "physics" ? "as" : "igcse";
            const verified = isVerified({ board: "cambridge", level, subject: subject.id });
            return <li key={subject.id}><Link href={`/en/exam-prep/cambridge/${level}/${subject.id}`} hrefLang="en">
              <strong>{c.courseNames[subject.id as keyof typeof c.courseNames]}</strong>
              <small>{level.toUpperCase()} · {verified ? c.syllabus : c.previewCourse}</small>
            </Link></li>;
          })}</ul>
          <Link className={styles.arrowLink} href="/en/exam-prep" hrefLang="en">{c.prepCta} →</Link>
        </article>
        <article className={styles.panel}><h3>{c.mockTitle}</h3><p>{c.mockBody}</p><ul className={styles.mocks}>{freeMocks.map((exam) => <li key={exam.id}><Link className={styles.mock} href={`/en/mock-exams/${exam.id}`} hrefLang="en"><strong>{exam.title}</strong><span>{exam.paper} · {exam.minutes} {c.minutes}</span><b>{c.tryFree} →</b></Link></li>)}</ul><p className={styles.fine}>{c.mockNote}</p></article>
      </div>
    </section>

    <section className={`container ${styles.section}`} aria-labelledby="teacher-heading" data-home-reveal>
      <div className={styles.teach}><div><span className="eyebrow">{c.teachEyebrow}</span><h2 id="teacher-heading">{c.teachHeading}</h2><p>{c.teachBody}</p><div className={styles.teachActions}><Link className={styles.goldButton} href="/en/teacher-kit">{c.teachCta} ↗</Link><Link className={styles.secondaryButton} href="/en/teacher-kit/dashboard">{c.dashboard}</Link></div><p className={styles.teachNote}>{c.classroom} <Link href="/en/classroom">{c.classroomCta} →</Link></p></div>
      <ol className={styles.tkGrid}>{c.teacherTools.map((tool, i) => <li key={tool.title}><span className={styles.tkIcon} aria-hidden="true">0{i + 1}</span><h3>{tool.title}</h3><p>{tool.body}</p></li>)}</ol></div>
    </section>

    <section className={`container ${styles.section}`} aria-labelledby="guides-heading" data-home-reveal>
      <header className={styles.head}><div><span className="eyebrow">{c.guideEyebrow}</span><h2 id="guides-heading">{c.guideHeading}</h2></div><Link className={styles.arrowLink} href="/en/articles">{c.guidesCta} →</Link></header>
      {locale !== "en" && <p className={styles.fine}>{c.englishNote}</p>}
      <div className={styles.guideGrid}>{guideSlugs.map((slug, i) => <Link className={styles.guideCard} key={slug} href={`/en/articles/${slug}`} hrefLang="en"><span className={styles.guideNumber}>0{i + 1}</span><div><h3>{c.guideTitles[i]}</h3><p>{c.guideDescriptions[i]}</p></div><span aria-hidden="true">↗</span></Link>)}</div>
    </section>

    <section className={`container ${styles.section} ${styles.faqWrap}`} aria-labelledby="faq-heading" data-home-reveal><div><span className="eyebrow">{c.faqEyebrow}</span><h2 id="faq-heading">{c.faqHeading}</h2><div className={styles.trustLinks}><Link href={`/${locale}/about`}>{c.aboutCta} →</Link><Link href={`/${locale}/editorial-policy`}>{c.policyCta} →</Link></div></div><div className={styles.faq}>{c.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div></section>
    <section className={`container ${styles.closing}`} data-home-reveal><div><span aria-hidden="true">✦</span><h2>{c.closingHeading}</h2><p>{c.closingBody}</p></div><Link className={styles.primaryButton} href={`/${locale}/subjects`}>{c.explore} ↗</Link></section>
  </main>;
}
