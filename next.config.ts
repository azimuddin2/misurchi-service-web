import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-circular-progressbar'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  i18n: {
    locales: ["en", "bn"],
    defaultLocale: "en",
  },
};

export default nextConfig;