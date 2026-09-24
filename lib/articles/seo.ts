import type { Article } from "./index";
import { defaultOgImage, localizedUrl, siteName, siteUrl } from "@/lib/seo/metadata";

export function articleJsonLd(article: Article) {
  const url = localizedUrl("en", `/articles/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: siteName, url: localizedUrl("en", "/about") },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
    image: [defaultOgImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: "en",
    isAccessibleForFree: true,
    articleSection: article.category,
    wordCount: article.wordCount,
    audience: { "@type": "Audience", audienceType: article.audience },
    citation: [...new Set([...article.body.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]))],
    isPartOf: { "@type": "CollectionPage", "@id": localizedUrl("en", "/articles"), name: "Science learning articles" },
  };
}
