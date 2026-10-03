// Runs after `next build` (output: "export") to finish the static site in out/.
import { readdirSync, readFileSync, rmSync, rmdirSync, writeFileSync } from "node:fs";

const out = new URL("../out/", import.meta.url);
const config = readFileSync(new URL("../lib/i18n/config.ts", import.meta.url), "utf8");
const locales = JSON.parse(config.match(/export const locales = (\[[^\]]*\])/)[1]);
const defaultLocale = config.match(/export const defaultLocale: Locale = "([^"]+)"/)[1];

// The bare domain is the canonical English homepage (see localizedUrl), so "/" serves the
// same HTML as /en. Crawlers always get English; returning visitors who picked a language, or
// whose browser prefers one, are sent to it, matching the Worker's locale choice.
const localeBoot = `<script>(function(){try{var l=${JSON.stringify(locales)},c=document.cookie.match(/(?:^|;\\s*)science-sim-locale=([^;]+)/),r=c&&c[1],a=(navigator.language||"").split("-")[0],t=l.indexOf(r)>=0?r:l.indexOf(a)>=0?a:${JSON.stringify(defaultLocale)};if(t!==${JSON.stringify(defaultLocale)})location.replace("/"+t+location.search+location.hash)}catch(e){}})();</script>`;
const home = readFileSync(new URL(`${defaultLocale}.html`, out), "utf8");
if (!home.includes("<head>")) throw new Error(`out/${defaultLocale}.html has no <head> to inject into`);
writeFileSync(new URL("index.html", out), home.replace("<head>", `<head>${localeBoot}`));

// A page that calls notFound() at build time (e.g. missions/progress while switched off) is
// still exported, as 404 content that would be served with status 200. Remove it and its
// prefetch payloads so the Worker answers those URLs with a real 404.
let removed = 0;
for (const file of readdirSync(out, { recursive: true })) {
  if (!file.endsWith(".html") || !readFileSync(new URL(file, out), "utf8").includes("NEXT_HTTP_ERROR_FALLBACK;404")) continue;
  const route = file.slice(0, -".html".length);
  rmSync(new URL(file, out));
  rmSync(new URL(`${route}.txt`, out), { force: true });
  const segments = new URL(`${route}/`, out);
  try {
    for (const name of readdirSync(segments)) if (name.startsWith("__next.")) rmSync(new URL(name, segments));
    if (!readdirSync(segments).length) rmdirSync(segments);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  removed++;
}

// Guard against shipping a build made with .env.local's localhost URL.
const sitemap = readFileSync(new URL("sitemap.xml", out), "utf8");
if (process.env.ALLOW_LOCAL_SITE_URL !== "1" && /localhost|127\.0\.0\.1/.test(sitemap)) {
  throw new Error("sitemap.xml points at localhost. Build with NEXT_PUBLIC_SITE_URL=https://www.learnerkits.com (npm run build does this).");
}
console.log(`Static site ready in out/ (homepage = /${defaultLocale}, ${removed} not-found pages removed)`);
