import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname, "../.."),
  },
  // Enable standalone output for production
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
};

export default nextConfig;
