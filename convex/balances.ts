import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

/**
 * Get user balance
 */
export const getUserBalance = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const balance = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!balance) {
      // Create initial balance if it doesn't exist
      const balanceId = await ctx.db.insert("balances", {
        userId: args.userId,
        depositBalance: {},
        stakedBalance: {},
        availableBalance: {},
        updatedAt: Date.now(),
      });
      const newBalance = await ctx.db.get(balanceId);
      return newBalance;
    }

    return balance;
  },
});

/**
 * Update user balance (internal use)
 */
export const updateBalance = internalMutation({
  args: {
    userId: v.id("users"),
    coin: v.string(),
    amount: v.number(),
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("stake"),
      v.literal("unstake"),
      v.literal("swap_from"),
      v.literal("swap_to")
    ),
  },
  handler: async (ctx, args) => {
    let balance = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!balance) {
      // Create initial balance
      const balanceId = await ctx.db.insert("balances", {
        userId: args.userId,
        depositBalance: {},
        stakedBalance: {},
        availableBalance: {},
        updatedAt: Date.now(),
      });
      balance = await ctx.db.get(balanceId);
      if (!balance) throw new Error("Failed to create balance");
    }

    const depositBalance = balance.depositBalance as Record<string, number>;
    const stakedBalance = balance.stakedBalance as Record<string, number>;
    const availableBalance = balance.availableBalance as Record<string, number>;

    // Initialize coin balances if they don't exist
    if (!depositBalance[args.coin]) depositBalance[args.coin] = 0;
    if (!stakedBalance[args.coin]) stakedBalance[args.coin] = 0;
    if (!availableBalance[args.coin]) availableBalance[args.coin] = 0;

    // Update balances based on transaction type
    switch (args.type) {
      case "deposit":
        depositBalance[args.coin] += args.amount;
        availableBalance[args.coin] += args.amount;
        break;
      case "withdrawal":
        availableBalance[args.coin] -= args.amount;
        depositBalance[args.coin] -= args.amount;
        break;
      case "stake":
        availableBalance[args.coin] -= args.amount;
        stakedBalance[args.coin] += args.amount;
        break;
      case "unstake":
        stakedBalance[args.coin] -= args.amount;
        availableBalance[args.coin] += args.amount;
        break;
      case "swap_from":
        availableBalance[args.coin] -= args.amount;
        break;
      case "swap_to":
        availableBalance[args.coin] += args.amount;
        break;
    }

    // Ensure balances don't go negative
    if (depositBalance[args.coin] < 0) depositBalance[args.coin] = 0;
    if (stakedBalance[args.coin] < 0) stakedBalance[args.coin] = 0;
    if (availableBalance[args.coin] < 0) availableBalance[args.coin] = 0;

    await ctx.db.patch(balance._id, {
      depositBalance,
      stakedBalance,
      availableBalance,
      updatedAt: Date.now(),
    });

    return balance;
  },
});

