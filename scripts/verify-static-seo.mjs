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

// Every internal link, image and canonical/alternate URL in the exported pages must reach an
// exported file directly: a missing page is a dead link, and a link to a public/_redirects source
// costs visitors and crawlers an extra hop. Paths only Cloudflare handles (dropped languages) count as missing.
export function verifyInternalLinks(out, origin = "https://www.learnerkits.com") {
  const root = new URL(out).pathname;
  const pages = readdirSync(out, { recursive: true }).filter((file) => file.endsWith(".html") && !file.startsWith("_next"));
  const redirectsFile = new URL("_redirects", out);
  const redirects = new Map(existsSync(redirectsFile) ? readFileSync(redirectsFile, "utf8").split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => line.split(/\s+/)) : []);
  const exported = (path) => path === "/" ? existsSync(new URL("index.html", out)) : [path.slice(1), `${path.slice(1).replace(/\/$/, "")}.html`, `${path.slice(1).replace(/\/$/, "")}/index.html`].some((file) => file && existsSync(new URL(file, out)));
  const problems = new Map();
  let checked = 0;
  for (const page of pages) {
    const html = readFileSync(new URL(page, out), "utf8");
    for (const match of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"|<link\b[^>]*?\srel="(?:canonical|alternate)"[^>]*?\shref="([^"]*)"|<img\b[^>]*?\ssrc="([^"]*)"/g)) {
      let href = (match[1] ?? match[2] ?? match[3]).replace(/&amp;/g, "&");
      if (href.startsWith(origin)) href = href.slice(origin.length) || "/";
      if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/_next/")) continue;
      let path;
      try { path = decodeURIComponent(href.split("#")[0].split("?")[0]); } catch { path = href; }
      checked++;
      const problem = redirects.has(path) ? `redirects to ${redirects.get(path)}` : exported(path) ? undefined : "not exported";
      if (!problem) continue;
      const key = `${path} (${problem})`;
      if (!problems.has(key)) problems.set(key, new Set());
      problems.get(key).add(`/${page.replace(/\.html$/, "")}`.replace(root, ""));
    }
  }
  if (problems.size) throw new Error(`Internal links that do not reach a page:\n${[...problems].slice(0, 15).map(([key, from]) => `  ${key} — linked from ${from.size} page(s), e.g. ${[...from].slice(0, 3).join(", ")}`).join("\n")}`);
  return checked;
}

// sitemap-bing.xml lists pages open to Bing but kept out of Google. Each must be exported, indexable
// for other engines, noindex for Googlebot, self-canonical, and absent from sitemap.xml (which Google reads).
export function verifyBingSitemap(out) {
  const file = new URL("sitemap-bing.xml", out);
  if (!existsSync(file)) return 0;
  const google = new Set([...readFileSync(new URL("sitemap.xml", out), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const urls = [...readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (new Set(urls).size !== urls.length) throw new Error("sitemap-bing.xml lists a URL twice");
  for (const location of urls) {
    if (google.has(location)) throw new Error(`Page is in both sitemap.xml and sitemap-bing.xml: ${location}`);
    const { pathname } = new URL(location);
    let html;
    try { html = readFileSync(new URL(`${pathname.slice(1)}.html`, out), "utf8"); } catch (error) { throw new Error(`sitemap-bing.xml page has no exported HTML: ${location}`, { cause: error }); }
    const tags = headTags(html, location);
    const robots = tags.find((tag) => tag.tag === "meta" && /^robots$/i.test(tag.name ?? ""))?.content ?? "";
    const googlebot = tags.find((tag) => tag.tag === "meta" && /^googlebot$/i.test(tag.name ?? ""))?.content ?? "";
    if (/\b(noindex|none)\b/i.test(robots)) throw new Error(`sitemap-bing.xml page is noindex for every engine: ${location}`);
    if (!/\bnoindex\b/i.test(googlebot)) throw new Error(`sitemap-bing.xml page is open to Google (no googlebot noindex): ${location}`);
    const canonical = tags.find((tag) => tag.tag === "link" && tag.rel === "canonical")?.href;
    if (canonical !== location) throw new Error(`sitemap-bing.xml page has a missing or different canonical: ${location} -> ${canonical}`);
  }
  return urls.length;
}

// A sentence that only appears in the generic simulation guide (lib/seo/simulation-guides.ts).
const templatedGuide = /Change one variable so its effect is easier to identify\./;

// Validate the generated files, after cleanup, rather than just the source metadata.
export function verifyStaticSeo(out, expectedOrigin) {
  const sitemap = readFileSync(new URL("sitemap.xml", out), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!urls.length) throw new Error("sitemap.xml contains no page URLs");
  const descriptions = new Map();

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
    // Identical meta descriptions are flagged by Bing and rewritten by Google; each page needs its own.
    const description = tags.find((tag) => tag.tag === "meta" && tag.name === "description")?.content?.trim();
    if (description && descriptions.has(description)) throw new Error(`Sitemap pages share a meta description: ${descriptions.get(description)} and ${location}`);
    if (description) descriptions.set(description, location);
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
