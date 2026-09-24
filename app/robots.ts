import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/api/"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/"] },
      { userAgent: "bingbot", allow: "/", disallow: ["/api/"] },
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
