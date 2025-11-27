import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverComponentsExternalPackages moved from experimental in Next.js 16
  serverExternalPackages: ["@walletconnect/ethereum-provider"],
  // Removed webpack config - pino stub can be handled via package.json or module resolution
  // If pino causes issues, consider using a package.json override or different logger
};

export default nextConfig;
