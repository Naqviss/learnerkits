import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production: every page is prerendered to plain files in out/, which Cloudflare serves as free static assets.
  // Anything that needs a request (locale redirects, donations, contact submissions) lives in worker/index.ts instead.
  ...(process.env.NODE_ENV === "production" ? { output: "export" as const } : {}),
  // Static hosting redirects the bare domain in worker/index.ts. Match that behavior in
  // local development, where there is no worker in front of Next.js.
  ...(process.env.NODE_ENV !== "production" ? {
    async redirects() {
      return [{ source: "/", destination: "/en", permanent: false }];
    },
  } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
