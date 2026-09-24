import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/lib/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { breadcrumbJsonLd, jsonLd, localizedMetadata, localizedUrl } from "@/lib/seo/metadata";
import styles from "@/components/articles/articles.module.css";

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};
  return localizedMetadata("en", "/articles", "Science Learning Articles: AI, Study Skills & Teaching", "Practical articles for students and teachers: use AI thoughtfully, check science answers, plan lessons, and test ideas in free interactive simulations.", { englishOnly: true });
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  const collection = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Science learning articles", url: localizedUrl("en", "/articles"), inLanguage: "en",
    mainEntity: { "@type": "ItemList", numberOfItems: articles.length, itemListElement: articles.map((article, index) => ({ "@type": "ListItem", position: index + 1, name: article.title, url: localizedUrl("en", `/articles/${article.slug}`) })) },
  };
  return <main className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd("en", [{ name: "Home", path: "/" }, { name: "Articles", path: "/articles" }]))} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/en">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Articles</span></nav>
    <header className={styles.indexHero}>
      <span className="eyebrow">The learning notebook · Students & teachers</span>
      <h1>Better questions.<br />Deeper science learning.</h1>
      <p>Practical articles on studying with AI, checking an explanation, and turning an idea into an experiment. Read, make a prediction, then put it to the test.</p>
      <div className={styles.tags}><span>5 in-depth articles</span><span>Worked examples</span><span>Free simulation activities</span></div>
    </header>
    <section className={styles.grid} aria-label="Science learning articles">{articles.map((article) => <ArticleCard key={article.slug} article={article} readingMinutes={article.readingMinutes} />)}</section>
    <aside className={styles.note}><h2>Learn it. Then try it.</h2><p>Pair these articles with our focused science guides and interactive labs. Every model has assumptions; make them part of your explanation.</p><div className={styles.links}><Link href="/en/simulations">Explore simulations →</Link><Link href="/en/guides">Read science guides →</Link><Link href="/en/editorial-policy">Editorial policy →</Link></div></aside>
  </main>;
}
