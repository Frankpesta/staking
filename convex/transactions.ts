import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Create a deposit transaction
 */
export const createDeposit = mutation({
  args: {
    userId: v.id("users"),
    coin: v.string(),
    amount: v.number(),
    txHash: v.optional(v.string()),
    chainId: v.optional(v.number()),
    fromAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get platform wallet for this coin
    const platformWallet = await ctx.db
      .query("platformWallets")
      .withIndex("by_coin", (q) => q.eq("coin", args.coin))
      .first();

    if (!platformWallet || !platformWallet.isActive) {
      throw new Error(`Platform wallet not configured for ${args.coin}`);
    }

    // Create transaction
    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "deposit",
      coin: args.coin,
      amount: args.amount,
      status: "pending",
      txHash: args.txHash,
      chainId: args.chainId || platformWallet.chainId,
      fromAddress: args.fromAddress,
      toAddress: platformWallet.address,
      requestedAt: Date.now(),
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: args.userId,
      type: "deposit",
      description: `Deposit request: ${args.amount} ${args.coin}`,
      metadata: { transactionId, amount: args.amount, coin: args.coin },
      timestamp: Date.now(),
    });

    return { transactionId };
  },
});

/**
 * Create a withdrawal transaction
 */
export const createWithdrawal = mutation({
  args: {
    userId: v.id("users"),
    coin: v.string(),
    amount: v.number(),
    walletAddress: v.string(),
    chainId: v.optional(v.number()),
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
    const currentBalance = availableBalance[args.coin] || 0;

    if (currentBalance < args.amount) {
      throw new Error("Insufficient balance");
    }

    // Get platform wallet for this coin
    const platformWallet = await ctx.db
      .query("platformWallets")
      .withIndex("by_coin", (q) => q.eq("coin", args.coin))
      .first();

    if (!platformWallet || !platformWallet.isActive) {
      throw new Error(`Platform wallet not configured for ${args.coin}`);
    }

    // Create transaction
    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "withdrawal",
      coin: args.coin,
      amount: args.amount,
      status: "pending",
      walletAddress: args.walletAddress,
      chainId: args.chainId || platformWallet.chainId,
      fromAddress: platformWallet.address,
      toAddress: args.walletAddress,
      requestedAt: Date.now(),
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: args.userId,
      type: "withdrawal",
      description: `Withdrawal request: ${args.amount} ${args.coin}`,
      metadata: { transactionId, amount: args.amount, coin: args.coin },
      timestamp: Date.now(),
    });

    return { transactionId };
  },
});

/**
 * Approve a transaction (admin only)
 */
export const approveTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    adminId: v.id("users"),
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "pending") {
      throw new Error("Transaction is not pending");
    }

    // Update transaction status
    await ctx.db.patch(args.transactionId, {
      status: "approved",
      processedAt: Date.now(),
      processedBy: args.adminId,
      adminNote: args.adminNote,
    });

    // If it's a deposit, update balance
    if (transaction.type === "deposit") {
      await ctx.scheduler.runAfter(0, internal.balances.updateBalance, {
        userId: transaction.userId,
        coin: transaction.coin,
        amount: transaction.amount,
        type: "deposit",
      });
    }

    // Create activity log
    await ctx.db.insert("activities", {
      userId: transaction.userId,
      type: `${transaction.type}_approved`,
      description: `${transaction.type} approved: ${transaction.amount} ${transaction.coin}`,
      metadata: { transactionId: args.transactionId },
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Reject a transaction (admin only)
 */
export const rejectTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    adminId: v.id("users"),
    adminNote: v.string(),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "pending") {
      throw new Error("Transaction is not pending");
    }

    await ctx.db.patch(args.transactionId, {
      status: "rejected",
      processedAt: Date.now(),
      processedBy: args.adminId,
      adminNote: args.adminNote,
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: transaction.userId,
      type: `${transaction.type}_rejected`,
      description: `${transaction.type} rejected: ${transaction.amount} ${transaction.coin}`,
      metadata: { transactionId: args.transactionId, reason: args.adminNote },
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Complete a transaction (admin only)
 */
export const completeTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    adminId: v.id("users"),
    txHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "approved") {
      throw new Error("Transaction must be approved first");
    }

    await ctx.db.patch(args.transactionId, {
      status: "completed",
      txHash: args.txHash,
      processedAt: Date.now(),
      processedBy: args.adminId,
    });

    // Update balance based on transaction type
    if (transaction.type === "withdrawal") {
      await ctx.scheduler.runAfter(0, internal.balances.updateBalance, {
        userId: transaction.userId,
        coin: transaction.coin,
        amount: transaction.amount,
        type: "withdrawal",
      });
    }

    // Create activity log
    await ctx.db.insert("activities", {
      userId: transaction.userId,
      type: `${transaction.type}_completed`,
      description: `${transaction.type} completed: ${transaction.amount} ${transaction.coin}`,
      metadata: { transactionId: args.transactionId, txHash: args.txHash },
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get user transactions
 */
export const getUserTransactions = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    return transactions;
  },
});

/**
 * Get pending transactions (admin only)
 */
export const getPendingTransactions = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("deposit"),
        v.literal("withdrawal"),
        v.literal("stake"),
        v.literal("unstake"),
        v.literal("swap")
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("transactions")
      .withIndex("by_status", (q) => q.eq("status", "pending"));

    if (args.type) {
      // Filter by type if provided
      const transactions = await query.collect();
      return transactions.filter((t) => t.type === args.type);
    }

    return query.order("desc").collect();
  },
});

