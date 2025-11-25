import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a platform wallet
 */
export const createPlatformWallet = mutation({
  args: {
    coin: v.string(),
    chainId: v.number(),
    address: v.string(),
    privateKeyEnvVar: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if wallet already exists for this coin/chain
    const existing = await ctx.db
      .query("platformWallets")
      .withIndex("by_coin_and_chain", (q) =>
        q.eq("coin", args.coin).eq("chainId", args.chainId)
      )
      .first();

    if (existing) {
      throw new Error(
        `Platform wallet already exists for ${args.coin} on chain ${args.chainId}`
      );
    }

    const walletId = await ctx.db.insert("platformWallets", {
      coin: args.coin,
      chainId: args.chainId,
      address: args.address,
      privateKeyEnvVar: args.privateKeyEnvVar,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { walletId };
  },
});

/**
 * Get platform wallet for a coin
 */
export const getPlatformWallet = query({
  args: {
    coin: v.string(),
    chainId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.chainId) {
      const wallet = await ctx.db
        .query("platformWallets")
        .withIndex("by_coin_and_chain", (q) =>
          q.eq("coin", args.coin).eq("chainId", args.chainId)
        )
        .first();

      return wallet;
    }

    // Get first active wallet for coin
    const wallet = await ctx.db
      .query("platformWallets")
      .withIndex("by_coin", (q) => q.eq("coin", args.coin))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    return wallet;
  },
});

/**
 * List all platform wallets (admin only)
 */
export const listPlatformWallets = query({
  handler: async (ctx) => {
    const wallets = await ctx.db.query("platformWallets").collect();
    return wallets.sort((a, b) => a.createdAt - b.createdAt);
  },
});

/**
 * Update platform wallet
 */
export const updatePlatformWallet = mutation({
  args: {
    walletId: v.id("platformWallets"),
    coin: v.optional(v.string()),
    chainId: v.optional(v.number()),
    address: v.optional(v.string()),
    privateKeyEnvVar: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // If coin or chainId is being updated, check for duplicates
    if (args.coin !== undefined || args.chainId !== undefined) {
      const wallet = await ctx.db.get(args.walletId);
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const newCoin = args.coin ?? wallet.coin;
      const newChainId = args.chainId ?? wallet.chainId;

      // Check if another wallet exists with the same coin/chainId
      const existing = await ctx.db
        .query("platformWallets")
        .withIndex("by_coin_and_chain", (q) =>
          q.eq("coin", newCoin).eq("chainId", newChainId)
        )
        .first();

      if (existing && existing._id !== args.walletId) {
        throw new Error(
          `Platform wallet already exists for ${newCoin} on chain ${newChainId}`
        );
      }
    }

    const updates: {
      coin?: string;
      chainId?: number;
      address?: string;
      privateKeyEnvVar?: string;
      isActive?: boolean;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.coin !== undefined) {
      updates.coin = args.coin;
    }
    if (args.chainId !== undefined) {
      updates.chainId = args.chainId;
    }
    if (args.address !== undefined) {
      updates.address = args.address;
    }
    if (args.privateKeyEnvVar !== undefined) {
      updates.privateKeyEnvVar = args.privateKeyEnvVar;
    }
    if (args.isActive !== undefined) {
      updates.isActive = args.isActive;
    }

    await ctx.db.patch(args.walletId, updates);
    return { success: true };
  },
});

