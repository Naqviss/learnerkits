import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/articles";
import { getArticleSummary } from "@/lib/articles/catalog";
import { articleJsonLd } from "@/lib/articles/seo";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { breadcrumbJsonLd, jsonLd, localizedMetadata, localizedUrl } from "@/lib/seo/metadata";
import { getSimulationCard } from "@/lib/subjects/catalog";
import styles from "@/components/articles/articles.module.css";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return articles.map((article) => ({ locale: "en", slug: article.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (locale !== "en" || !article) return {};
  const metadata = localizedMetadata("en", `/articles/${slug}`, article.title, article.description, { type: "article", englishOnly: true });
  return { ...metadata, title: { absolute: `${article.title} | LearnerKits` }, authors: [{ name: "LearnerKits", url: localizedUrl("en", "/about") }], openGraph: { ...metadata.openGraph, type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt, authors: [localizedUrl("en", "/about")], section: article.category } };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (locale !== "en" || !article) notFound();
  const dateLabel = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(article.publishedAt));
  return <main className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd(article))} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd("en", [{ name: "Home", path: "/" }, { name: "Articles", path: "/articles" }, { name: article.title, path: `/articles/${slug}` }]))} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/en">Home</Link><span aria-hidden="true">/</span><Link href="/en/articles">Articles</Link><span aria-hidden="true">/</span><span aria-current="page">{article.category}</span></nav>
    <article>
      <header className={styles.hero}>
        <span className="eyebrow">{article.category} · {article.audience}</span>
        <h1>{article.title}</h1>
        <div className={styles.byline}><Link href="/en/about" rel="author">By LearnerKits</Link><time dateTime={article.publishedAt}>{dateLabel}</time><span>{article.readingMinutes} min read</span></div>
      </header>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav aria-label="On this page"><h2>In this article</h2><ol>{article.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
          <Link className={styles.backLink} href="#try-a-simulation">Try a linked simulation ↓</Link>
        </aside>
        <div className={styles.prose}>
          <div className={styles.intro}><ArticleBody body={article.intro} /></div>
          {article.sections.map((section) => <section key={section.id} id={section.id}><h2>{section.title}</h2><ArticleBody body={section.body} /></section>)}
          <aside className={styles.editorialNote}><strong>About this article</strong><p>AI-assisted educational content from LearnerKits. Worked examples are illustrative; simulation outputs are model predictions. Sources are linked beside the relevant discussion. No independent expert review is claimed.</p><div className={styles.links}><Link href="/en/editorial-policy">Editorial policy</Link><Link href="/en/contact">Report a correction</Link></div></aside>
        </div>
      </div>
    </article>
    <section id="try-a-simulation" className={styles.related} aria-labelledby="try-title"><span className="eyebrow">Put the idea to work</span><h2 id="try-title">Try a linked simulation</h2><div className={styles.labGrid}>{article.simulationSlugs.map((simSlug) => {
      const simulation = getSimulationCard(simSlug);
      return simulation && <Link className={styles.labCard} href={`/en/simulations/${simSlug}`} key={simSlug}><span className="eyebrow">{simulation.kind} · {simulation.duration}</span><h3>{simulation.title}</h3><p>{simulation.outcome}</p><span className="textLink">Open simulation →</span></Link>;
    })}</div></section>
    <section className={styles.related} aria-labelledby="related-title"><h2 id="related-title">Continue reading</h2><div className={styles.grid}>{article.relatedSlugs.map((relatedSlug) => {
      const related = getArticleSummary(relatedSlug);
      return related && <ArticleCard key={relatedSlug} article={related} />;
    })}</div></section>
  </main>;
}
