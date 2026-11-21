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

// A sentence that only appears in the generic simulation guide (lib/seo/simulation-guides.ts).
const templatedGuide = /Change one variable so its effect is easier to identify\./;

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
    // Bing flags titles over 70 characters (lib/seo/metadata.ts maxTitleLength).
    const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
    if (!title.trim()) throw new Error(`Sitemap page has no title: ${location}`);
    if ([...title].length > 70) throw new Error(`Title over 70 characters (${[...title].length}): ${location} -> ${title}`);
    if (isNoindex(tags)) throw new Error(`Sitemap page is marked noindex: ${location}`);
    // Link previews (WhatsApp, Facebook, LinkedIn, X): an exported JPEG or PNG on this site.
    const ogImage = tags.find((tag) => tag.tag === "meta" && tag.property === "og:image")?.content;
    if (!ogImage) throw new Error(`Sitemap page has no og:image: ${location}`);
    const image = new URL(ogImage);
    if (image.origin !== url.origin || !/\.(jpe?g|png)$/i.test(image.pathname)) throw new Error(`og:image must be a JPEG or PNG on this site: ${location} -> ${ogImage}`);
    if (!existsSync(new URL(image.pathname.slice(1), out))) throw new Error(`og:image file was not exported: ${location} -> ${ogImage}`);
    const canonicals = tags.filter((tag) => tag.tag === "link" && tag.rel === "canonical");
    if (canonicals.length !== 1 || !canonicals[0].href || new URL(canonicals[0].href).href !== url.href) {
      throw new Error(`Sitemap page has a missing or mismatched canonical: ${location}`);
    }
    // The September 2026 spam update demoted this site for templated pages. An indexed English
    // simulation page must carry its own content (lib/seo/simulation-content), not the generic
    // fallback guide shared by every lab.
    if (/^\/en\/simulations\/[^/]+$/.test(url.pathname) && templatedGuide.test(html)) {
      throw new Error(`Simulation page uses the generic template instead of its own content (add it to lib/seo/simulation-content): ${location}`);
    }
  }
  return urls.length;
}
