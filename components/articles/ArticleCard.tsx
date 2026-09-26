import Link from "next/link";
import type { ArticleSummary } from "@/lib/articles/catalog";
import styles from "./articles.module.css";
import { ArticleImage } from "./ArticleImage";

export function ArticleCard({ article, readingMinutes, headingLevel = 2 }: { article: ArticleSummary; readingMinutes?: number; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return <article className={styles.card}>
    <ArticleImage slug={article.slug} thumbnail />
    <span className="eyebrow">{article.category}</span>
    <Heading><Link href={`/en/articles/${article.slug}`}>{article.title}</Link></Heading>
    <p>{article.description}</p>
    <div className={styles.cardMeta}>{article.audience}{readingMinutes && ` · ${readingMinutes} min read`}</div>
    <Link className="textLink" href={`/en/articles/${article.slug}`} aria-label={`Read: ${article.title}`}>Read article →</Link>
  </article>;
}
