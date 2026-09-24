import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

// Named explicitly (not just via "*") so search engines and AI assistants can crawl, cite,
// and recommend the free labs. Each entry is allowed everywhere except the API.
const crawlers = [
  "Googlebot", "bingbot", "Applebot", "DuckDuckBot", "YandexBot", "Baiduspider",
  "OAI-SearchBot", "ChatGPT-User", "GPTBot",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Meta-ExternalAgent", "Amazonbot", "DuckAssistBot", "MistralAI-User", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...crawlers.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
