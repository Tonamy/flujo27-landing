import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: ["*"],

  // Turbopack acelera el dev server (compilación ~10x más rápida que Webpack)
  // Activado por defecto en Next.js 15, pero lo dejamos explícito
  turbopack: {},
};

export default nextConfig;
