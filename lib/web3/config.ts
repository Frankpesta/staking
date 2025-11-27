import { createConfig, http } from "wagmi";
import { mainnet, polygon, bsc, arbitrum, optimism, avalanche, base } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import type { Config } from "wagmi";

let configCache: Config | undefined;

/**
 * Get wagmi config - lazy initialization to prevent SSR issues with MetaMask SDK
 */
export function getConfig(): Config {
  if (typeof window === "undefined") {
    // Return a minimal config for SSR that won't cause errors
    // This should never be used, but prevents initialization errors
    return createConfig({
      chains: [mainnet],
      connectors: [],
      transports: {
        [mainnet.id]: http(),
      },
    });
  }

  if (!configCache) {
    configCache = createConfig({
      chains: [mainnet, polygon, bsc, arbitrum, optimism, avalanche, base],
      connectors: [
        injected(),
        metaMask(),
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
        }),
      ],
      transports: {
        [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL_MAINNET),
        [polygon.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL_POLYGON),
        [bsc.id]: http(process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/"),
        [arbitrum.id]: http(process.env.ARBITRUM_RPC_URL || ""),
        [optimism.id]: http(process.env.OPTIMISM_RPC_URL || ""),
        [avalanche.id]: http(process.env.AVALANCHE_RPC_URL || ""),
        [base.id]: http(process.env.BASE_RPC_URL || ""),
      },
    });
  }

  return configCache;
}

// Export config for backward compatibility (will be lazy-loaded)
export const config = getConfig();

