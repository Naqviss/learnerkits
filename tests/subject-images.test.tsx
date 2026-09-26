import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { locales } from "@/lib/i18n/config";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { subjectImages } from "@/lib/subjects/images";
import { localizedUrl, siteUrl } from "@/lib/seo/metadata";
import SubjectPage, { generateMetadata } from "@/app/[locale]/subjects/[subject]/page";
import SubjectIndex from "@/app/[locale]/subjects/page";
import sitemap from "@/app/sitemap";

describe("subject image discovery", () => {
  it("renders each localized subject's preferred image with matching metadata and structured data", async () => {
    for (const subject of visibleSubjectSlugs) {
      const image = subjectImages[subject]!;
      expect(image, subject).toBeDefined();
      for (const locale of locales) {
        const params = Promise.resolve({ locale, subject });
        const html = renderToStaticMarkup(await SubjectPage({ params }));
        const metadata = await generateMetadata({ params });
        expect(html).toContain(`src="${image.src}"`);
        expect(html).toContain(`srcSet="${image.smallSrc} 640w, ${image.src} 1200w"`);
        expect(html).toContain('width="1200" height="800"');
        expect(html).toContain('loading="eager"');
        expect(image.alt[locale].length).toBeGreaterThan(15);
        const json = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
        const collection = json.find((item) => item["@type"] === "CollectionPage");
        expect(collection.primaryImageOfPage).toMatchObject({ "@type": "ImageObject", contentUrl: `${siteUrl}${image.src}`, description: image.alt[locale] });
        expect(collection.image).toEqual(collection.primaryImageOfPage);
        expect(metadata.openGraph).toMatchObject({ images: [{ url: collection.image.contentUrl, width: 1200, height: 800, type: "image/webp", alt: image.alt[locale] }] });
        expect(metadata.twitter).toMatchObject({ images: [{ url: collection.image.contentUrl, alt: image.alt[locale] }] });
        expect(metadata.robots).toMatchObject({ index: true, googleBot: { "max-image-preview": "large" } });
      }
    }
  });

  it("lists images on their actual landing pages and localized image sitemap entries", async () => {
    const entries = sitemap();
    for (const locale of locales) {
      const html = renderToStaticMarkup(await SubjectIndex({ params: Promise.resolve({ locale }) }));
      const index = entries.find((entry) => entry.url === localizedUrl(locale, "/subjects"));
      expect(index?.images).toHaveLength(visibleSubjectSlugs.length);
      for (const subject of visibleSubjectSlugs) {
        const image = subjectImages[subject]!;
        expect(html).toContain(`src="${image.src}"`);
        expect(entries.find((entry) => entry.url === localizedUrl(locale, `/subjects/${subject}`))?.images).toContain(`${siteUrl}${image.src}`);
      }
    }
    expect(subjectImages.biology).toBeUndefined();
    expect(subjectImages.mathematics).toBeUndefined();
  });

  it("provides compressed WebP variants without changing the downloadable originals", () => {
    for (const subject of visibleSubjectSlugs) {
      const image = subjectImages[subject]!;
      for (const src of [image.src, image.smallSrc]) {
        const path = join(process.cwd(), "public", src);
        const bytes = readFileSync(path);
        expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
        expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
        expect(statSync(path).size).toBeLessThan(src.includes("-640") ? 110 * 1024 : 300 * 1024);
      }
    }
  });
});
