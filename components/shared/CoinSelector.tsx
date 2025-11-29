"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { DEFAULT_COINS } from "@/lib/constants";

interface CoinSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  chainId?: number;
  balances?: Record<string, number>;
  filterByBalance?: boolean;
}

const MOBILE_BREAKPOINT = 640;

export function CoinSelector({
  value,
  onValueChange,
  chainId,
  balances,
  filterByBalance = false,
}: CoinSelectorProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

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

  const selectedCoin = baseCoins.find((coin) => coin.symbol === value);

  const formatBalance = (balance: number | undefined) => {
    if (balance === undefined) return "0.000000";
    if (balance === 0) return "0.000000";
    if (balance < 0.000001) return balance.toExponential(2);
    return balance.toFixed(6);
  };

  const listContent = (
    <Command>
      <CommandInput placeholder="Search coin..." />
      <CommandList>
        <CommandEmpty>
          {filterByBalance ? "No coins with available balance." : "No coin found."}
        </CommandEmpty>

        {coins.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            {filterByBalance
              ? "No coins with balance yet. Deposit funds to get started."
              : "No coins available."}
          </div>
        ) : (
          <CommandGroup>
            {coins.map((coin) => {
              const isSelected = value === coin.symbol;
              const balance = balances?.[coin.symbol];

              return (
                <CommandItem
                  key={coin.symbol}
                  value={coin.symbol}
                  onSelect={(currentValue) => {
                    if (!currentValue) return;
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-medium">{coin.symbol}</span>
                      <span className="text-xs text-muted-foreground">
                        {coin.name}
                      </span>
                    </div>
                    {balances && (
                      <div className="text-right ml-4">
                        <span className="text-sm font-medium">
                          {formatBalance(balance)}
                        </span>
                        <p className="text-[10px] uppercase text-muted-foreground">
                          Balance
                        </p>
                      </div>
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-full justify-between"
      onClick={isMobile ? () => setOpen(true) : undefined}
    >
      <div className="flex flex-col text-left">
        <span className="text-sm">
          {selectedCoin ? selectedCoin.symbol : "Select coin..."}
        </span>
        {value && balances?.[value] !== undefined && (
          <span className="text-xs text-muted-foreground">
            {formatBalance(balances[value])} available
          </span>
        )}
      </div>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <CommandDialog open={open} onOpenChange={setOpen}>
          {listContent}
        </CommandDialog>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        className="w-[360px] p-0 z-100 max-h-[320px] overflow-hidden"
        align="start"
        sideOffset={8}
      >
        {listContent}
      </PopoverContent>
    </Popover>
  );
}
