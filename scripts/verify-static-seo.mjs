import { readFileSync } from "node:fs";

// Validate the generated files, after cleanup, rather than just the source metadata.
export function verifyStaticSeo(out, expectedOrigin) {
  const sitemap = readFileSync(new URL("sitemap.xml", out), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!urls.length) throw new Error("sitemap.xml contains no page URLs");

  for (const location of urls) {
    const url = new URL(location);
    if (expectedOrigin && url.origin !== expectedOrigin) {
      throw new Error(`Unexpected sitemap origin: ${location}`);
    }
    const path = url.pathname === "/" ? "index.html" : `${url.pathname.slice(1)}.html`;
    let html;
    try {
      html = readFileSync(new URL(path, out), "utf8");
    } catch (error) {
      throw new Error(`Sitemap page has no exported HTML: ${location}`, { cause: error });
    }
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
    if (!head) throw new Error(`Missing HTML head: ${location}`);
    const tags = [...head.matchAll(/<(meta|link)\b[^>]*>/gi)].map((match) => {
      const attributes = Object.fromEntries([...match[0].matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)]
        .map((attribute) => [attribute[1].toLowerCase(), attribute[2]]));
      return { tag: match[1].toLowerCase(), ...attributes };
    });
    if (tags.some((tag) => tag.tag === "meta" && /^(robots|googlebot)$/i.test(tag.name ?? "") && /\b(noindex|none)\b/i.test(tag.content ?? ""))) {
      throw new Error(`Sitemap page is marked noindex: ${location}`);
    }
    const canonicals = tags.filter((tag) => tag.tag === "link" && tag.rel === "canonical");
    if (canonicals.length !== 1 || !canonicals[0].href || new URL(canonicals[0].href).href !== url.href) {
      throw new Error(`Sitemap page has a missing or mismatched canonical: ${location}`);
    }
  }
  return urls.length;
}
