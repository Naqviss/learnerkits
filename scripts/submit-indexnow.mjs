const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.learnerkits.com").replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY;

if (!key) {
  console.error("Missing INDEXNOW_KEY. Create an IndexNow key, publish the matching key file at the site root, then run npm run indexnow.");
  process.exitCode = 1;
} else {
  const requestedUrls = process.env.INDEXNOW_URLS?.split(",").map((url) => url.trim()).filter(Boolean);
  const sitemapResponse = await fetch(`${site}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`Could not read ${site}/sitemap.xml (${sitemapResponse.status})`);
  const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  // IndexNow reaches Bing and its partners, never Google, so it also gets the pages kept out of Google
  // (sitemap-bing.xml), which Bing may index.
  const bingResponse = await fetch(`${site}/sitemap-bing.xml`);
  const bingUrls = bingResponse.ok ? locs(await bingResponse.text()) : [];
  if (!bingResponse.ok) console.warn(`No ${site}/sitemap-bing.xml (${bingResponse.status}); submitting sitemap.xml only.`);
  const sitemapUrls = [...new Set([...locs(await sitemapResponse.text()), ...bingUrls])];
  const urlList = requestedUrls?.length ? requestedUrls.map((url) => new URL(url, site).toString()) : sitemapUrls;
  if (!urlList.length) throw new Error("No URLs found to submit.");

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
  });
  const message = await response.text();
  if (response.status === 429) {
    // Throttled for this key: nothing is wrong with the site. Retrying straight away does not help.
    console.error(`IndexNow is throttling submissions for ${new URL(site).host} (429). The deploy is unaffected and search engines still read the sitemap.`);
    console.error("Try again tomorrow, and send only the pages that changed: INDEXNOW_URLS=/en/simulations/tsunami-3d,/en/about npm run indexnow");
    process.exitCode = 1;
  } else if (!response.ok) {
    throw new Error(`IndexNow rejected the submission (${response.status}): ${message}`);
  } else {
    console.log(`Submitted ${urlList.length} URLs to IndexNow${requestedUrls?.length ? "" : ` (${bingUrls.length} of them from sitemap-bing.xml)`}: ${response.status} ${message || "accepted"}`);
  }
}
