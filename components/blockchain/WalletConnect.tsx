"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mainnet, polygon, bsc, arbitrum, optimism, avalanche, base } from "wagmi/chains";

const chains = [mainnet, polygon, bsc, arbitrum, optimism, avalanche, base];

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Wallet className="mr-2 h-4 w-4" />
            {formatAddress(address)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="end">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Connected Wallet</p>
              <p className="text-sm font-mono">{address}</p>
              {chain && (
                <p className="text-xs text-muted-foreground mt-1">
                  Network: {chain.name}
                </p>
              )}
            </div>
            
            {chain && (
              <div className="space-y-2">
                <p className="text-xs font-medium">Switch Network</p>
                <div className="grid grid-cols-2 gap-2">
                  {chains.map((c) => (
                    <Button
                      key={c.id}
                      variant={chain.id === c.id ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => switchChain({ chainId: c.id })}
                      disabled={chain.id === c.id}
                    >
                      {c.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium mb-2">Connect Wallet</p>
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              className="w-full justify-start"
              onClick={() => connect({ connector })}
            >
              {connector.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

