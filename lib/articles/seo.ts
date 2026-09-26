import type { Metadata } from "next";
import type { Article } from "./index";
import { articleImages } from "./images";
import { localizedMetadata, localizedUrl, siteName, siteUrl } from "@/lib/seo/metadata";

export function articleMetadata(article: Article): Metadata {
  const metadata = localizedMetadata("en", `/articles/${article.slug}`, article.title, article.description, { type: "article", englishOnly: true });
  const image = articleImages[article.slug];
  return {
    ...metadata,
    title: { absolute: `${article.title} | ${siteName}` },
    authors: [{ name: siteName, url: localizedUrl("en", "/about") }],
    creator: siteName,
    publisher: siteName,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [localizedUrl("en", "/about")],
      section: article.category,
      images: [{ url: `${siteUrl}${image.socialSrc}`, type: "image/webp", width: 1200, height: 630, alt: image.alt }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [{ url: `${siteUrl}${image.socialSrc}`, alt: image.alt }] },
  };
}

export function articleJsonLd(article: Article) {
  const url = localizedUrl("en", `/articles/${article.slug}`);
  const image = articleImages[article.slug];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: siteName, url: localizedUrl("en", "/about") },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/learnerkits-logo.svg` } },
    image: [{ "@type": "ImageObject", "@id": `${url}#image`, url: `${siteUrl}${image.src}`, contentUrl: `${siteUrl}${image.src}`, width: image.width, height: image.height, caption: image.caption, description: image.alt, encodingFormat: "image/webp" }, ...article.figures.map((figure) => ({ "@type": "ImageObject", "@id": `${url}#figure-${figure.id}`, url: `${siteUrl}${figure.src}`, contentUrl: `${siteUrl}${figure.src}`, width: figure.width, height: figure.height, caption: figure.caption, description: figure.alt, encodingFormat: "image/webp" }))],
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
