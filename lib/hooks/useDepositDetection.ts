"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount, useWatchBlockNumber } from "wagmi";
import { usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { DEFAULT_COINS } from "@/lib/constants";
import { useMutation } from "convex/react";
import { convexApi } from "@/lib/utils/convex-api";
import { useAuth } from "./useAuth";

interface DepositDetectionOptions {
  platformWalletAddress: string;
  coin: string;
  chainId: number;
  onDepositDetected?: (txHash: string, amount: string) => void;
}

/**
 * Hook to detect on-chain deposits to platform wallet
 * Monitors blocks for incoming transactions
 */
export function useDepositDetection({
  platformWalletAddress,
  coin,
  chainId,
  onDepositDetected,
}: DepositDetectionOptions) {
  const { address, isConnected, chain } = useAccount();
  const publicClient = usePublicClient();
  const { user } = useAuth();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [detectedTxHash, setDetectedTxHash] = useState<string | null>(null);
  const processedTxs = useRef<Set<string>>(new Set());

  const createDepositMutation = useMutation(
    convexApi.transactions?.createDeposit as any
  );

  // Watch for new blocks and check for deposits
  useWatchBlockNumber({
    onBlockNumber(blockNumber) {
      if (!isConnected || !address || !platformWalletAddress || chain?.id !== chainId) {
        return;
      }

      // Check recent blocks for deposits
      checkForDeposits(blockNumber);
    },
  });

  const checkForDeposits = async (blockNumber: bigint) => {
    if (!publicClient || !platformWalletAddress) return;

    try {
      setIsMonitoring(true);
      
      // Get block with transactions
      const block = await publicClient.getBlock({
        blockNumber,
        includeTransactions: true,
      });

      if (!block.transactions) return;

      // Check each transaction in the block
      for (const tx of block.transactions) {
        if (typeof tx === "string") continue; // Skip if it's just a hash

        const txHash = tx.hash;
        if (processedTxs.current.has(txHash)) continue;

        // Check if transaction is to platform wallet
        if (
          tx.to?.toLowerCase() === platformWalletAddress.toLowerCase() &&
          address &&
          tx.from.toLowerCase() === address.toLowerCase()
        ) {
          processedTxs.current.add(txHash);
          setDetectedTxHash(txHash);

          // Get transaction receipt
          const receipt = await publicClient.getTransactionReceipt({
            hash: txHash,
          });

          if (receipt && receipt.status === "success") {
            const coinConfig = DEFAULT_COINS.find((c) => c.symbol === coin);
            if (!coinConfig) continue;

            let amount = "0";

            if (coinConfig.isNative) {
              // Native token (ETH, MATIC, etc.)
              amount = formatUnits(tx.value || BigInt(0), coinConfig.decimals);
            } else {
              // ERC-20 token - parse Transfer event from logs
              // For ERC-20, we need to check Transfer events
              // This is a simplified version - in production, parse all Transfer events
              amount = formatUnits(tx.value || BigInt(0), coinConfig.decimals);
            }

            // Create deposit record
            if (user?._id && createDepositMutation && parseFloat(amount) > 0) {
              try {
                await createDepositMutation({
                  userId: user._id,
                  coin,
                  amount: parseFloat(amount),
                  txHash: txHash,
                  chainId,
                });

                onDepositDetected?.(txHash, amount);
              } catch (error) {
                console.error("Failed to create deposit record:", error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking for deposits:", error);
    } finally {
      setIsMonitoring(false);
    }
  };

  return {
    isMonitoring,
    detectedTxHash,
  };
}

