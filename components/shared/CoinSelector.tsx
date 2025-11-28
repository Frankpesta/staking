"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
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
  balances?: Record<string, number>; // User balances for filtering and display
  filterByBalance?: boolean; // If true, only show coins with balance > 0
}

export function CoinSelector({ 
  value, 
  onValueChange, 
  chainId,
  balances,
  filterByBalance = false,
}: CoinSelectorProps) {
  const [open, setOpen] = useState(false);

  let coins = chainId
    ? DEFAULT_COINS.filter((coin) => coin.chainId === chainId)
    : DEFAULT_COINS;

  // Filter coins by balance if needed
  if (filterByBalance && balances) {
    coins = coins.filter((coin) => {
      const balance = balances[coin.symbol] || 0;
      return balance > 0;
    });
  }

  const selectedCoin = coins.find((coin) => coin.symbol === value);

  const getBalance = (symbol: string): number => {
    return balances?.[symbol] || 0;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCoin ? selectedCoin.symbol : "Select coin..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0 z-[100]" align="start">
        <Command shouldFilter={true}>
          <CommandInput placeholder="Search coin..." />
          <CommandList>
            <CommandEmpty>No coin found.</CommandEmpty>
            <CommandGroup>
              {coins.map((coin) => {
                const isSelected = value === coin.symbol;
                const balance = getBalance(coin.symbol);
                return (
                  <CommandItem
                    key={`${coin.symbol}-${coin.chainId}`}
                    value={coin.symbol}
                    onSelect={() => {
                      onValueChange(coin.symbol);
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
                        <span className="text-xs text-muted-foreground">{coin.name}</span>
                      </div>
                      {balances && (
                        <div className="text-right ml-4">
                          <span className="text-sm font-medium">
                            {balance.toFixed(6)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

