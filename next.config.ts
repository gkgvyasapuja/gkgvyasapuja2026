import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["gkgvyasapuja.com", "iskcongkg.s3.ap-south-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gkgvyasapuja.com",
      },
      {
        protocol: "https",
        hostname: "gkgvyasapuja.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "iskcongkg.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
