import Link from "next/link";
import type { ArticleSummary } from "@/lib/articles/catalog";
import styles from "./articles.module.css";

export function ArticleCard({ article, readingMinutes }: { article: ArticleSummary; readingMinutes?: number }) {
  return <article className={styles.card}>
    <span className="eyebrow">{article.category}</span>
    <h2><Link href={`/en/articles/${article.slug}`}>{article.title}</Link></h2>
    <p>{article.description}</p>
    <div className={styles.cardMeta}>{article.audience}{readingMinutes && ` · ${readingMinutes} min read`}</div>
    <Link className="textLink" href={`/en/articles/${article.slug}`} aria-label={`Read: ${article.title}`}>Read article →</Link>
  </article>;
}
