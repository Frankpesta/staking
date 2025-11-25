import { createConfig, http } from "wagmi";
import { mainnet, polygon, bsc, arbitrum, optimism, avalanche, base } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
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

