import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Create a swap transaction
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
    const balance = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!balance) {
      throw new Error("Balance not found");
    }

    const availableBalance = balance.availableBalance as Record<string, number>;
    const currentBalance = availableBalance[args.fromCoin] || 0;

    if (currentBalance < args.amount) {
      throw new Error("Insufficient balance");
    }

    // Calculate amount to receive
    const toAmount = args.amount * args.exchangeRate;

    // Create transaction
    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "swap",
      coin: `${args.fromCoin}/${args.toCoin}`,
      amount: args.amount,
      status: "pending",
      requestedAt: Date.now(),
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
      type: "swap",
      description: `Swap request: ${args.amount} ${args.fromCoin} → ${toAmount} ${args.toCoin}`,
      metadata: {
        transactionId,
        fromCoin: args.fromCoin,
        toCoin: args.toCoin,
        fromAmount: args.amount,
        toAmount,
      },
      timestamp: Date.now(),
    });

    return { transactionId };
  },
});

/**
 * Approve and process swap (admin only)
 */
export const approveSwap = mutation({
  args: {
    transactionId: v.id("transactions"),
    adminId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.type !== "swap" || transaction.status !== "pending") {
      throw new Error("Invalid transaction");
    }

    const metadata = transaction.metadata as {
      fromCoin: string;
      toCoin: string;
      fromAmount: number;
      toAmount: number;
    };

    // Update transaction status
    await ctx.db.patch(args.transactionId, {
      status: "approved",
      processedAt: Date.now(),
      processedBy: args.adminId,
    });

    // Update balances
    await ctx.scheduler.runAfter(0, internal.balances.updateBalance, {
      userId: transaction.userId,
      coin: metadata.fromCoin,
      amount: metadata.fromAmount,
      type: "swap_from",
    });

    await ctx.scheduler.runAfter(0, internal.balances.updateBalance, {
      userId: transaction.userId,
      coin: metadata.toCoin,
      amount: metadata.toAmount,
      type: "swap_to",
    });

    // Mark as completed
    await ctx.db.patch(args.transactionId, {
      status: "completed",
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: transaction.userId,
      type: "swap_completed",
      description: `Swap completed: ${metadata.fromAmount} ${metadata.fromCoin} → ${metadata.toAmount} ${metadata.toCoin}`,
      metadata: { transactionId: args.transactionId },
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

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

