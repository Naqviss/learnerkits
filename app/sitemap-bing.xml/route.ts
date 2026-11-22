import { googleUnlistedPaths } from "@/lib/seo/google-unlisted";
import { localizedUrl } from "@/lib/seo/metadata";

export const dynamic = "force-static";

// Pages open to Bing but kept out of Google (see lib/seo/google-unlisted.ts). Deliberately not named
// in robots.txt, which Google reads: submit it once in Bing Webmaster Tools; `npm run indexnow` (run
// by `npm run deploy`) sends it with sitemap.xml. Every page here also carries a googlebot noindex,
// which the build checks, so Google keeps them out even if it finds this file.
export function GET() {
  const urls = googleUnlistedPaths().map((path) => `  <url><loc>${localizedUrl("en", path)}</loc></url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
