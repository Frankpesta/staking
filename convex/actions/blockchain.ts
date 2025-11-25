"use node";

import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { createWalletClient, http, parseEther, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, polygon, bsc, arbitrum, optimism, avalanche, base } from "viem/chains";

/**
 * Get chain configuration by chain ID
 */
function getChainConfig(chainId: number) {
  switch (chainId) {
    case 1:
      return mainnet;
    case 137:
      return polygon;
    case 56:
      return bsc;
    case 42161:
      return arbitrum;
    case 10:
      return optimism;
    case 43114:
      return avalanche;
    case 8453:
      return base;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

/**
 * Get RPC URL for chain
 */
function getRpcUrl(chainId: number): string {
  const rpcUrls: Record<number, string> = {
    1: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL_MAINNET || "",
    137: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL_POLYGON || "",
    56: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/",
    42161: process.env.ARBITRUM_RPC_URL || "",
    10: process.env.OPTIMISM_RPC_URL || "",
    43114: process.env.AVALANCHE_RPC_URL || "",
    8453: process.env.BASE_RPC_URL || "",
  };

  const url = rpcUrls[chainId];
  if (!url) {
    throw new Error(`RPC URL not configured for chain ${chainId}`);
  }

  return url;
}

/**
 * Process withdrawal on-chain
 */
export const processWithdrawal = internalAction({
  args: {
    transactionId: v.id("transactions"),
    privateKeyEnvVar: v.string(),
    chainId: v.number(),
    toAddress: v.string(),
    amount: v.number(),
    coin: v.string(),
    isNative: v.boolean(),
    contractAddress: v.optional(v.string()),
    decimals: v.number(),
  },
  handler: async (ctx, args) => {
    // Get private key from environment variable
    const privateKey = process.env[args.privateKeyEnvVar];
    if (!privateKey) {
      throw new Error(`Private key not found for ${args.privateKeyEnvVar}`);
    }

    // Remove 0x prefix if present and ensure it's valid
    const privateKeyHex =
      privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;

    // Create account from private key
    const account = privateKeyToAccount(privateKeyHex as `0x${string}`);

    // Get chain configuration
    const chain = getChainConfig(args.chainId);
    const rpcUrl = getRpcUrl(args.chainId);

    // Create wallet client
    const client = createWalletClient({
      account,
      chain,
      transport: http(rpcUrl),
    });

    try {
      let txHash: `0x${string}`;

      if (args.isNative) {
        // Send native coin (ETH, MATIC, BNB, etc.)
        const value = parseEther(args.amount.toString());
        txHash = await client.sendTransaction({
          to: args.toAddress as `0x${string}`,
          value,
        });
      } else {
        // Send ERC-20 token
        if (!args.contractAddress) {
          throw new Error("Contract address required for token transfer");
        }

        // ERC-20 transfer ABI
        const erc20Abi = [
          {
            constant: false,
            inputs: [
              { name: "_to", type: "address" },
              { name: "_value", type: "uint256" },
            ],
            name: "transfer",
            outputs: [{ name: "", type: "bool" }],
            type: "function",
          },
        ] as const;

        const amount = parseUnits(
          args.amount.toString(),
          args.decimals
        );

        txHash = await client.writeContract({
          address: args.contractAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "transfer",
          args: [args.toAddress as `0x${string}`, amount],
        });
      }

      // Update transaction with hash
      await ctx.runMutation(internal.transactions.completeTransaction, {
        transactionId: args.transactionId,
        adminId: "" as any, // Will be set by caller
        txHash: txHash,
      });

      return { success: true, txHash };
    } catch (error) {
      // Mark transaction as failed
      await ctx.runMutation(internal.transactions.rejectTransaction, {
        transactionId: args.transactionId,
        adminId: "" as any, // Will be set by caller
        adminNote: `Blockchain error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });

      throw error;
    }
  },
});

