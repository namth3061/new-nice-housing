import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Ẩn source maps khi deploy (production) — không lộ mã nguồn
  productionBrowserSourceMaps: false,
  // Next.js 16 uses Turbopack by default; empty config acknowledges and silences migration warning
  turbopack: {},
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
