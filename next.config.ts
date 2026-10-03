import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production: every page is prerendered to plain files in out/, which Cloudflare serves as free static assets.
  // Anything that needs a request (locale redirects, donations, contact submissions) lives in worker/index.ts instead.
  ...(process.env.NODE_ENV === "production" ? { output: "export" as const } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
