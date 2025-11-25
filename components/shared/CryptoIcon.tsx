"use client";

import { useMemo } from "react";

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

const cryptoColors: Record<string, string> = {
  ETH: "from-blue-500 to-purple-600",
  BTC: "from-orange-400 to-orange-600",
  MATIC: "from-purple-500 to-pink-600",
  BNB: "from-yellow-400 to-orange-500",
  AVAX: "from-red-500 to-pink-600",
  USDT: "from-green-500 to-teal-600",
  USDC: "from-blue-400 to-blue-600",
  DAI: "from-yellow-500 to-orange-600",
};

export function CryptoIcon({ symbol, size = 40, className = "" }: CryptoIconProps) {
  const gradient = cryptoColors[symbol] || "from-gray-400 to-gray-600";
  
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-white font-bold text-xs">{symbol}</span>
    </div>
  );
}

