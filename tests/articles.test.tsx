import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { articles, getArticle } from "@/lib/articles";
import { getArticlesForSimulation } from "@/lib/articles/catalog";
import { getSimulationCard, getSubjectForSimulation, isVisibleSubjectSlug } from "@/lib/subjects/catalog";
import { articleJsonLd } from "@/lib/articles/seo";
import { articleImages } from "@/lib/articles/images";
import { localizedUrl, siteUrl } from "@/lib/seo/metadata";
import { ArticleBody } from "@/components/articles/ArticleBody";
import sitemap from "@/app/sitemap";
import { GET } from "@/app/llms.txt/route";
import ArticlePage, { generateMetadata } from "@/app/[locale]/articles/[slug]/page";

describe("article publishing", () => {
  it("publishes five distinct, substantial articles with navigable sections", () => {
    expect(articles).toHaveLength(5);
    expect(new Set(articles.map((article) => article.slug)).size).toBe(5);
    for (const article of articles) {
      expect(article.wordCount, article.slug).toBeGreaterThanOrEqual(1000);
      expect(article.wordCount, article.slug).toBeLessThanOrEqual(1500);
      expect(article.sections.length).toBeGreaterThanOrEqual(6);
      expect(new Set(article.sections.map((section) => section.id)).size).toBe(article.sections.length);
      expect(article.sections.every((section) => section.id && section.body)).toBe(true);
    }
  });

  it("links only to published articles and visible simulations, with backlinks", () => {
    for (const article of articles) {
      for (const slug of article.relatedSlugs) expect(getArticle(slug), slug).toBeDefined();
      for (const slug of article.simulationSlugs) {
        expect(getSimulationCard(slug), slug).toBeDefined();
        expect(isVisibleSubjectSlug(getSubjectForSimulation(slug)!.slug)).toBe(true);
        expect(getArticlesForSimulation(slug).map((related) => related.slug)).toContain(article.slug);
      }
      for (const [, type, slug] of article.body.matchAll(/\]\(\/en\/(articles|simulations)\/([^)]+)\)/g)) {
        expect(type === "articles" ? getArticle(slug) : getSimulationCard(slug), slug).toBeDefined();
      }
    }
  });

  it("uses matching canonical URLs, dates and article structured data", async () => {
    for (const article of articles) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en", slug: article.slug }) });
      const structured = articleJsonLd(article);
      expect(metadata.alternates?.canonical).toBe(structured.url);
      expect(structured.headline).toBe(article.title);
      expect(structured.datePublished).toBe(article.publishedAt);
      expect(structured.citation.length).toBeGreaterThan(0);
      expect(Object.keys(metadata.alternates!.languages!)).toEqual(["en", "x-default"]);
      const image = articleImages[article.slug];
      expect(metadata.openGraph).toMatchObject({ type: "article", images: [{ url: `${siteUrl}${image.socialSrc}`, type: "image/webp", width: 1200, height: 630, alt: image.alt }] });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [{ url: `${siteUrl}${image.socialSrc}`, alt: image.alt }] });
      expect(structured.image[0]).toMatchObject({ contentUrl: `${siteUrl}${image.src}`, width: 1200, height: 800, encodingFormat: "image/webp" });
      expect(metadata.robots).toMatchObject({ index: true, follow: true, googleBot: { "max-image-preview": "large" } });
    }
  });

  it("lists only English article URLs in the sitemap and discovery file", async () => {
    const entries = sitemap().filter((entry) => entry.url.includes("/articles"));
    const guide = await (await GET()).text();
    expect(entries).toHaveLength(6);
    for (const article of articles) {
      const url = localizedUrl("en", `/articles/${article.slug}`);
      expect(entries.find((entry) => entry.url === url)?.lastModified).toBe(article.updatedAt);
      expect(entries.find((entry) => entry.url === url)?.images).toContain(`${siteUrl}${articleImages[article.slug].src}`);
      expect(guide).toContain(url);
    }
    expect(entries.every((entry) => entry.url.includes("/en/articles"))).toBe(true);
  });

  it("ships distinct, compressed WebP files for full, small and social images", () => {
    expect(new Set(Object.values(articleImages).map((image) => image.src)).size).toBe(5);
    for (const image of Object.values(articleImages)) {
      for (const src of [image.src, image.smallSrc, image.socialSrc]) {
        const file = join(process.cwd(), "public", src);
        const bytes = readFileSync(file);
        expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
        expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
        expect(statSync(file).size).toBeLessThan(200 * 1024);
      }
    }
  });

  it("renders content, sources, headings and answer disclosures without client JavaScript", async () => {
    for (const article of articles) {
      const html = renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ locale: "en", slug: article.slug }) }));
      expect(html.match(/<h1>/g)).toHaveLength(1);
      for (const section of article.sections) expect(html).toContain(`id="${section.id}"`);
      expect(html).toContain("https://openstax.org/");
      expect(html).toContain('type="application/ld+json"');
      expect(html).not.toContain(":::answer");
      if (article.slug === "use-ai-to-create-science-practice-questions") expect(html.match(/<details>/g)).toHaveLength(5);
    }
  });

  it("does not render raw HTML or unsafe link protocols", () => {
    const html = renderToStaticMarkup(<ArticleBody body={'<script>alert(1)</script> [unsafe](javascript:alert) [safe](/en/articles)'} />);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain('href="/en/articles"');
  });

  it("returns not found for unknown articles and untranslated URLs", async () => {
    for (const params of [{ locale: "en", slug: "missing" }, { locale: "fr", slug: articles[0].slug }]) {
      await expect(ArticlePage({ params: Promise.resolve(params) })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    }
  });
});
