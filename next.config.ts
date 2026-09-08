import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Saath is also served through Vitasta Hub's /saath external rewrite.  Use
  // the standalone host for Next's compiled assets so the browser does not
  // try to load them from vitastahub.vercel.app/_next (where they do not live).
  assetPrefix: "https://saath-frontend.vercel.app",
};

export default nextConfig;
