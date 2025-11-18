import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Your existing pattern
      { protocol: "https", hostname: "storage.leomotors.me" },

      // The new pattern for gstatic.com
      {
        protocol: "https",
        hostname: "**.gstatic.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
