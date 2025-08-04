// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This is the key setting
  },

  // add other config if needed
};

export default nextConfig;
