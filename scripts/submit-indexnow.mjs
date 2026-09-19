const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.learnerkits.com").replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY;

if (!key) {
  console.error("Missing INDEXNOW_KEY. Create an IndexNow key, publish the matching key file at the site root, then run npm run indexnow.");
  process.exitCode = 1;
} else {
  const requestedUrls = process.env.INDEXNOW_URLS?.split(",").map((url) => url.trim()).filter(Boolean);
  const sitemapResponse = await fetch(`${site}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`Could not read ${site}/sitemap.xml (${sitemapResponse.status})`);
  const sitemap = await sitemapResponse.text();
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const urlList = requestedUrls?.length ? requestedUrls.map((url) => new URL(url, site).toString()) : sitemapUrls;
  if (!urlList.length) throw new Error("No URLs found to submit.");

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
  });
  const message = await response.text();
  if (!response.ok) throw new Error(`IndexNow rejected the submission (${response.status}): ${message}`);
  console.log(`Submitted ${urlList.length} URLs to IndexNow: ${response.status} ${message || "accepted"}`);
}
