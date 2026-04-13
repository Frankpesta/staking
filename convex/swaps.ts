import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { scheduleAdminActivityEmail } from "./notifyAdmin";

/**
 * Create a swap transaction (automatic - no admin approval needed)
 */
export const createSwap = mutation({
  args: {
    userId: v.id("users"),
    fromCoin: v.string(),
    toCoin: v.string(),
    amount: v.number(),
    exchangeRate: v.number(), // Rate from fromCoin to toCoin
  },
  handler: async (ctx, args) => {
    // Get user balance
    let balance = await ctx.db
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
      balance = await ctx.db.get(balanceId);
      if (!balance) throw new Error("Failed to create balance");
    }

    const availableBalance = balance.availableBalance as Record<string, number>;
    const currentBalance = availableBalance[args.fromCoin] || 0;

    if (currentBalance < args.amount) {
      throw new Error("Insufficient balance");
    }

    // Calculate amount to receive
    const toAmount = args.amount * args.exchangeRate;

    // Update balances immediately (synchronously)
    // Deduct from coin
    if (!availableBalance[args.fromCoin]) availableBalance[args.fromCoin] = 0;
    availableBalance[args.fromCoin] -= args.amount;
    if (availableBalance[args.fromCoin] < 0) availableBalance[args.fromCoin] = 0;

    // Add to coin
    if (!availableBalance[args.toCoin]) availableBalance[args.toCoin] = 0;
    availableBalance[args.toCoin] += toAmount;

    // Update deposit balance for both coins
    const depositBalance = balance.depositBalance as Record<string, number>;
    if (!depositBalance[args.fromCoin]) depositBalance[args.fromCoin] = 0;
    depositBalance[args.fromCoin] -= args.amount;
    if (depositBalance[args.fromCoin] < 0) depositBalance[args.fromCoin] = 0;

    if (!depositBalance[args.toCoin]) depositBalance[args.toCoin] = 0;
    depositBalance[args.toCoin] += toAmount;

    // Save updated balance
    await ctx.db.patch(balance._id, {
      depositBalance,
      availableBalance,
      updatedAt: Date.now(),
    });

    const now = Date.now();

    // Create transaction record (completed immediately)
    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "swap",
      coin: `${args.fromCoin}/${args.toCoin}`,
      amount: args.amount,
      status: "completed",
      requestedAt: now,
      processedAt: now,
      metadata: {
        fromCoin: args.fromCoin,
        toCoin: args.toCoin,
        fromAmount: args.amount,
        toAmount,
        exchangeRate: args.exchangeRate,
      },
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: args.userId,
      type: "swap_completed",
      description: `Swap completed: ${args.amount} ${args.fromCoin} → ${toAmount.toFixed(6)} ${args.toCoin}`,
      metadata: {
        transactionId,
        fromCoin: args.fromCoin,
        toCoin: args.toCoin,
        fromAmount: args.amount,
        toAmount,
      },
      timestamp: now,
    });

    await scheduleAdminActivityEmail(ctx, {
      activityType: "swap_completed",
      description: `Swap: ${args.amount} ${args.fromCoin} → ${toAmount.toFixed(6)} ${args.toCoin}`,
      userId: args.userId,
      adminPath: "/admin/transactions",
    });

    return { transactionId, success: true };
  },
});

/**
 * Note: Swaps are now automatic and don't require admin approval.
 * The createSwap mutation handles balance updates immediately.
 * This function is kept for backward compatibility but is no longer needed.
 */

/**
 * Get swap exchange rate using real-time prices from CoinGecko
 * Note: This query now returns a placeholder. The actual rate calculation
 * should be done on the client side using the calculateExchangeRate action
 * to ensure real-time prices and proper USD-based calculations.
 */
export const getExchangeRate = query({
  args: {
    fromCoin: v.string(),
    toCoin: v.string(),
  },
  handler: async (ctx, args) => {
    // This is a placeholder. The client should use the calculateExchangeRate action
    // from convex/actions/crypto_prices.ts to get real-time rates.
    // We return a placeholder here to maintain compatibility.
    return {
      rate: 1.0, // Placeholder - client should calculate using action
      timestamp: Date.now(),
      note: "Use calculateExchangeRate action for real-time rates",
    };
  },
});

