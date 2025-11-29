"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_COINS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CoinSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  chainId?: number;
  balances?: Record<string, number>;
  filterByBalance?: boolean;
}

export function CoinSelector({
  value,
  onValueChange,
  chainId,
  balances,
  filterByBalance = false,
}: CoinSelectorProps) {
  const baseCoins = useMemo(() => {
    const filteredByChain = chainId
      ? DEFAULT_COINS.filter((coin) => coin.chainId === chainId)
      : DEFAULT_COINS;

    // Deduplicate by symbol so we don't show the same coin multiple times
    const seen = new Set<string>();
    return filteredByChain.filter((coin) => {
      if (seen.has(coin.symbol)) {
        return false;
      }
      seen.add(coin.symbol);
      return true;
    });
  }, [chainId]);

  const coins = useMemo(() => {
    if (!filterByBalance || !balances) {
      return baseCoins;
    }

    return baseCoins.filter((coin) => {
      const balance = balances?.[coin.symbol] || 0;
      return balance > 0;
    });
  }, [baseCoins, balances, filterByBalance]);

  const formatBalance = (balance: number | undefined) => {
    if (balance === undefined) return "0.000000";
    if (balance === 0) return "0.000000";
    if (balance < 0.000001) return balance.toExponential(2);
    return balance.toFixed(6);
  };

  return (
    <Select value={value || ""} onValueChange={onValueChange}>
      <SelectTrigger className="w-full h-auto min-h-10 py-2.5">
        <div className="flex flex-col items-start w-full text-left flex-1">
          <SelectValue placeholder="Select coin..." />
          {value && balances?.[value] !== undefined && (
            <span className="text-xs text-muted-foreground mt-0.5 font-normal">
              {formatBalance(balances[value])} available
            </span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[320px]">
        {coins.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            {filterByBalance
              ? "No coins with balance yet. Deposit funds to get started."
              : "No coins available."}
          </div>
        ) : (
          coins.map((coin) => {
            const balance = balances?.[coin.symbol];
            const isSelected = value === coin.symbol;

            return (
              <SelectItem
                key={coin.symbol}
                value={coin.symbol}
                className={cn(
                  "cursor-pointer py-2.5",
                  isSelected && "bg-accent"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-medium text-sm">{coin.symbol}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {coin.name}
                    </span>
                  </div>
                  {balances && (
                    <div className="text-right ml-4 shrink-0">
                      <span className="text-sm font-medium block">
                        {formatBalance(balance)}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        Balance
                      </span>
                    </div>
                  )}
                </div>
              </SelectItem>
            );
          })
        )}
      </SelectContent>
    </Select>
  );
}
