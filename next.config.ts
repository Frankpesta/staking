import path from "path";
import type { NextConfig } from "next";

const resolveStub = (relativePath: string) =>
  path.resolve(__dirname, relativePath);

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@walletconnect/ethereum-provider"],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.pino = resolveStub("./stubs/pino.js");
    return config;
  },
};

export default nextConfig;
