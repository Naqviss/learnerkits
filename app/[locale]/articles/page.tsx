import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/lib/articles";
import { articleCategories } from "@/lib/articles/catalog";
import { articleImages } from "@/lib/articles/images";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { breadcrumbJsonLd, jsonLd, localizedMetadata, localizedUrl, siteUrl } from "@/lib/seo/metadata";
import styles from "@/components/articles/articles.module.css";

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};
  const metadata = localizedMetadata("en", "/articles", "Science Learning Articles: Educational Technology & AI", "Explore educational technology and AI in education: science simulations, virtual labs, self-study, visual explanations, and digital science notebooks.", { englishOnly: true });
  const image = articleImages[articles[0].slug];
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: `${siteUrl}${image.socialSrc}`, width: 1200, height: 630, type: "image/webp", alt: image.alt }] }, twitter: { ...metadata.twitter, card: "summary_large_image", images: [{ url: `${siteUrl}${image.socialSrc}`, alt: image.alt }] } };
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
      <p>Practical articles on educational technology and AI in education. Explore virtual labs, build better study habits, and turn an idea into an experiment. Read, make a prediction, then put it to the test.</p>
      <div className={styles.tags}><span>{articles.length} in-depth articles</span><span>Worked examples</span><span>Free simulation activities</span></div>
    </header>
    <nav className={styles.categoryNav} aria-label="Article categories">{articleCategories.map((category) => <a key={category.id} href={`#${category.id}`}>{category.name}<span>{articles.filter((article) => article.category === category.name).length}</span></a>)}</nav>
    {articleCategories.map((category) => <section key={category.id} id={category.id} className={styles.categorySection} aria-labelledby={`${category.id}-title`}>
      <header className={styles.categoryHeader}><h2 id={`${category.id}-title`}>{category.name}</h2><p>{category.description}</p></header>
      <div className={styles.grid}>{articles.filter((article) => article.category === category.name).map((article) => <ArticleCard key={article.slug} article={article} readingMinutes={article.readingMinutes} headingLevel={3} />)}</div>
    </section>)}
    <aside className={styles.note}><h2>Learn it. Then try it.</h2><p>Pair these articles with our focused science guides and interactive labs. Every model has assumptions; make them part of your explanation.</p><div className={styles.links}><Link href="/en/simulations">Explore simulations →</Link><Link href="/en/guides">Read science guides →</Link><Link href="/en/editorial-policy">Editorial policy →</Link></div></aside>
  </main>;
}
