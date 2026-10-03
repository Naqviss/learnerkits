import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is prerendered to plain files in out/, which Cloudflare serves as free static assets.
  // Anything that needs a request (locale redirects, donations) lives in worker/index.ts instead.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
