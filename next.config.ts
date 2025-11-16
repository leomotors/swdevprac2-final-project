import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "storage.leomotors.me" }],
  },
};

export default nextConfig;
