import { existsSync, readdirSync, readFileSync } from "node:fs";

function headTags(html, label) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  if (!head) throw new Error(`Missing HTML head: ${label}`);
  return [...head.matchAll(/<(meta|link)\b[^>]*>/gi)].map((match) => {
    const attributes = Object.fromEntries([...match[0].matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)]
      .map((attribute) => [attribute[1].toLowerCase(), attribute[2]]));
    return { tag: match[1].toLowerCase(), ...attributes };
  });
}
const isNoindex = (tags) => tags.some((tag) => tag.tag === "meta" && /^(robots|googlebot)$/i.test(tag.name ?? "") && /\b(noindex|none)\b/i.test(tag.content ?? ""));

// A published language that is not open to search engines (see indexedLocales) must not leak
// into the index: every exported page under it has to carry noindex.
export function verifyUnlistedLocales(out, unlistedLocales) {
  let checked = 0;
  for (const locale of unlistedLocales) {
    const files = [`${locale}.html`, ...(existsSync(new URL(`${locale}/`, out)) ? readdirSync(new URL(`${locale}/`, out), { recursive: true }).filter((file) => file.endsWith(".html")).map((file) => `${locale}/${file}`) : [])];
    for (const file of files) {
      if (!existsSync(new URL(file, out))) continue;
      if (!isNoindex(headTags(readFileSync(new URL(file, out), "utf8"), file))) throw new Error(`Page in a language not open to search is indexable: /${file.replace(/\.html$/, "")}`);
      checked++;
    }
  }
  return checked;
}

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
    const tags = headTags(html, location);
    if (isNoindex(tags)) throw new Error(`Sitemap page is marked noindex: ${location}`);
    const canonicals = tags.filter((tag) => tag.tag === "link" && tag.rel === "canonical");
    if (canonicals.length !== 1 || !canonicals[0].href || new URL(canonicals[0].href).href !== url.href) {
      throw new Error(`Sitemap page has a missing or mismatched canonical: ${location}`);
    }
  }
  return urls.length;
}
