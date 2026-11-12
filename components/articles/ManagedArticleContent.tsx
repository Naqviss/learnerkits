"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./articles.module.css";

type ArticleRecord = { slug: string; title: string; description: string; category: string; audience: string; body: string; status: "draft" | "published"; published_at: string | null; updated_at: string };
type ListResponse = { articles?: ArticleRecord[]; hiddenSlugs?: string[] };

function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    if (href.startsWith("/en/")) return <Link key={`${keyPrefix}-${index}`} href={href}>{label}</Link>;
    if (href.startsWith("https://")) return <a key={`${keyPrefix}-${index}`} href={href} rel="noopener noreferrer">{label}</a>;
    return label;
  });
}

function bodyBlocks(body: string) {
  return body.trim().split(/\n\s*\n/).map((block, index) => {
    if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
    if (block.startsWith("### ")) return <h3 key={index}>{block.slice(4)}</h3>;
    if (block.startsWith("- ")) return <ul key={index}>{block.split("\n").map((line, lineIndex) => <li key={lineIndex}>{inline(line.replace(/^-\s*/, ""), `${index}-${lineIndex}`)}</li>)}</ul>;
    if (block.startsWith("> ")) return <blockquote key={index}><p>{inline(block.slice(2), `${index}`)}</p></blockquote>;
    return <p key={index}>{inline(block.replace(/^#\s+/, ""), `${index}`)}</p>;
  });
}

function ManagedArticleView({ article, children }: { article: ArticleRecord; children?: ReactNode }) {
  const date = article.published_at ?? article.updated_at;
  const dateLabel = date ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date)) : "";
  return <main className={`container ${styles.page}`}><article><header className={styles.hero}><span className="eyebrow">{article.category} · {article.audience}</span><h1>{article.title}</h1><div className={styles.byline}><Link href="/en/about" rel="author">By LearnerKits</Link>{dateLabel && <time dateTime={date}>{dateLabel}</time>}<span>Edited {new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(article.updated_at))}</span></div><p>{article.description}</p></header><div className={styles.layout}><aside className={styles.sidebar}><nav aria-label="Article actions"><h2>Keep learning</h2><ol><li><Link href="/en/articles">All articles</Link></li><li><Link href="/en/simulations">Browse interactive labs</Link></li><li><Link href="/en/exam-prep">Open Exam Prep</Link></li></ol></nav></aside><div className={styles.prose}><div className={styles.intro}>{bodyBlocks(article.body)}</div><aside className={styles.editorialNote}><strong>About this article</strong><p>Published by LearnerKits. Check linked sources and use evidence to evaluate scientific claims.</p><div className={styles.links}><Link href="/en/editorial-policy">Editorial policy</Link><Link href="/en/contact">Report a correction</Link></div></aside></div></div></article>{children}</main>;
}

export function ManagedArticleOverlay({ slug, children }: { slug: string; children: ReactNode }) {
  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    let live = true;
    fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "article", slug }) }).then((response) => response.ok ? response.json() as Promise<{ article: ArticleRecord | null }> : null).then((result) => { if (live) { setArticle(result?.article ?? null); setChecked(true); } }).catch(() => { if (live) setChecked(true); });
    return () => { live = false; };
  }, [slug]);
  if (!checked) return <>{children}</>;
  if (!article) return <>{children}</>;
  if (article.status !== "published") return <main className={`container ${styles.page}`}><div className={styles.note}><h1>This article is not published.</h1><p>Browse other learning articles or explore an interactive lab.</p><div className={styles.links}><Link href="/en/articles">Browse articles →</Link><Link href="/en/simulations">Explore labs →</Link></div></div></main>;
  return <ManagedArticleView article={article}>{children}</ManagedArticleView>;
}

function ManagedArticleListContent({ sourceSlugs }: { sourceSlugs: string[] }) {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  useEffect(() => { let live = true; fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "articles" }) }).then((response) => response.ok ? response.json() as Promise<ListResponse> : null).then((result) => { if (live) setArticles((result?.articles ?? []).filter((article) => !sourceSlugs.includes(article.slug) && article.status === "published")); }).catch(() => {}); return () => { live = false; }; }, [sourceSlugs]);
  if (!articles.length) return null;
  return <section className={`container ${styles.managedSection}`}><header><span className="eyebrow">Recently published</span><h2>New from LearnerKits</h2></header><div className={styles.grid}>{articles.map((article) => <article className={styles.card} key={article.slug}><span className={styles.cardMeta}>{article.category} · {article.audience}</span><h3><Link href={`/en/articles/read?slug=${encodeURIComponent(article.slug)}`}>{article.title}</Link></h3><p>{article.description}</p><Link className={styles.cardLink} href={`/en/articles/read?slug=${encodeURIComponent(article.slug)}`}>Read article →</Link></article>)}</div></section>;
}

export function ManagedArticleList({ sourceSlugs }: { sourceSlugs: string[] }) {
  return <Suspense fallback={null}><ManagedArticleListContent sourceSlugs={sourceSlugs} /></Suspense>;
}

function ManagedArticleReaderContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { let live = true; if (!slug) { setLoaded(true); return () => { live = false; }; } fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "article", slug }) }).then((response) => response.ok ? response.json() as Promise<{ article: ArticleRecord | null }> : null).then((result) => { if (live) { setArticle(result?.article?.status === "published" ? result.article : null); setLoaded(true); } }).catch(() => { if (live) setLoaded(true); }); return () => { live = false; }; }, [slug]);
  if (!loaded) return <main className={`container ${styles.page}`}><div className={styles.note}>Loading article…</div></main>;
  if (!article) return <main className={`container ${styles.page}`}><div className={styles.note}><h1>Article unavailable</h1><p>This article may be a draft or may have been removed.</p><Link href="/en/articles">Return to articles →</Link></div></main>;
  return <ManagedArticleView article={article} />;
}

export function ManagedArticleReader() {
  return <Suspense fallback={<main className={`container ${styles.page}`}><div className={styles.note}>Loading article…</div></main>}><ManagedArticleReaderContent /></Suspense>;
}
