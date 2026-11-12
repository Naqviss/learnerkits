import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Home, { generateMetadata } from "@/app/[locale]/page";
import { locales } from "@/lib/i18n/config";
import { getHomeCopy } from "@/lib/home/content";
import { localizedUrl } from "@/lib/seo/metadata";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";
import sitemap from "@/app/sitemap";

describe("homepage discovery and localized metadata", () => {
  for (const locale of locales) {
    it(`${locale}: exports discoverable content and subject links before JavaScript runs`, async () => {
      const html = renderToStaticMarkup(await Home({ params: Promise.resolve({ locale }) }));
      const copy = getHomeCopy(locale);
      expect(html.match(/<h1[ >]/g)).toHaveLength(1);
      expect(html).toContain(copy.heading);
      expect(html).toContain(copy.faqs[0].q);
      expect(html).toContain('href="/en/teacher-kit"');
      expect(html).toContain('href="/en/exam-prep"');
      expect(html).toContain('href="/en/mock-exams/9702free"');
      expect(html).toContain('href="/en/articles/how-virtual-science-labs-work"');
      const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1])["@graph"];
      const page = graph.find((node: Record<string, unknown>) => node["@type"] === "WebPage");
      expect(page).toMatchObject({ inLanguage: locale, url: localizedUrl(locale, "/"), dateModified: copy.updatedAt });
      const list = graph.find((node: Record<string, unknown>) => node["@type"] === "ItemList");
      expect(list.numberOfItems).toBe(visibleSubjectSlugs.length);
      for (const [index, slug] of visibleSubjectSlugs.entries()) {
        expect(html).toContain(`href="/${locale}/subjects/${slug}"`);
        expect(list.itemListElement[index].url).toBe(localizedUrl(locale, `/subjects/${slug}`));
      }
      if (locale === "es") {
        expect(html).toContain("Recursos en inglés");
        expect(html).not.toContain("Science learning,");
      }
    });
    it(`${locale}: keeps one brand title and consistent canonical/share metadata`, async () => {
      const copy = getHomeCopy(locale);
      const meta = await generateMetadata({ params: Promise.resolve({ locale }) });
      expect(meta.title).toEqual({ absolute: copy.title });
      expect(copy.title.match(/LearnerKits/g)).toHaveLength(1);
      expect(meta).toMatchObject({ description: copy.description, alternates: { canonical: localizedUrl(locale, "/") }, robots: { index: true, follow: true }, openGraph: { title: copy.title, description: copy.description }, twitter: { title: copy.title } });
      expect(sitemap().find((entry) => entry.url === localizedUrl(locale, "/"))?.lastModified).toBe(copy.updatedAt);
    });
  }
});
