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
}

export function CoinSelector({ value, onValueChange, chainId }: CoinSelectorProps) {
  const [open, setOpen] = useState(false);

  const coins = chainId
    ? DEFAULT_COINS.filter((coin) => coin.chainId === chainId)
    : DEFAULT_COINS;

  const selectedCoin = coins.find((coin) => coin.symbol === value);

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
      <PopoverContent className="w-[300px] p-0 z-50">
        <Command>
          <CommandInput placeholder="Search coin..." />
          <CommandList>
            <CommandEmpty>No coin found.</CommandEmpty>
            <CommandGroup>
              {coins.map((coin) => {
                const isSelected = value === coin.symbol;
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
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {coin.symbol} - {coin.name}
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

