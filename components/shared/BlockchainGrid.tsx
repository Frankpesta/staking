"use client";

import { CryptoIcon } from "./CryptoIcon";

const blockchains = [
  { name: "Ethereum", symbol: "ETH", color: "from-blue-500/20 to-purple-600/20" },
  { name: "Polygon", symbol: "MATIC", color: "from-purple-500/20 to-pink-600/20" },
  { name: "BNB Chain", symbol: "BNB", color: "from-yellow-400/20 to-orange-500/20" },
  { name: "Arbitrum", symbol: "ETH", color: "from-blue-400/20 to-cyan-500/20" },
  { name: "Optimism", symbol: "ETH", color: "from-red-400/20 to-pink-500/20" },
  { name: "Avalanche", symbol: "AVAX", color: "from-red-500/20 to-pink-600/20" },
  { name: "Base", symbol: "ETH", color: "from-blue-300/20 to-blue-500/20" },
];

export function BlockchainGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {blockchains.map((chain) => (
        <div
          key={chain.name}
          className="group relative flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg"
        >
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${chain.color} opacity-0 transition-opacity group-hover:opacity-100`} />
          <CryptoIcon symbol={chain.symbol} size={48} className="relative z-10" />
          <span className="relative z-10 text-xs font-medium">{chain.name}</span>
        </div>
      ))}
    </div>
  );
}

