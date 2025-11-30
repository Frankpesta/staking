import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Create a staking pool
 */
export const createStakingPool = mutation({
  args: {
    userId: v.id("users"),
    coin: v.string(),
    amount: v.number(),
    duration: v.number(),
    roiPercentage: v.number(),
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
    const stakedBalance = balance.stakedBalance as Record<string, number>;
    const currentBalance = availableBalance[args.coin] || 0;

    if (currentBalance < args.amount) {
      throw new Error("Insufficient balance");
    }

    const now = Date.now();
    const endDate = now + args.duration * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    // Deduct balance immediately (move from available to staked)

    if (!availableBalance[args.coin]) availableBalance[args.coin] = 0;
    availableBalance[args.coin] -= args.amount;
    if (availableBalance[args.coin] < 0) availableBalance[args.coin] = 0;

    if (!stakedBalance[args.coin]) stakedBalance[args.coin] = 0;
    stakedBalance[args.coin] += args.amount;

    // Save updated balance immediately
    await ctx.db.patch(balance._id, {
      availableBalance,
      stakedBalance,
      updatedAt: now,
    });

    // Create staking pool
    const poolId = await ctx.db.insert("stakingPools", {
      userId: args.userId,
      coin: args.coin,
      amount: args.amount,
      duration: args.duration,
      roiPercentage: args.roiPercentage,
      startDate: now,
      endDate,
      status: "active",
      accumulatedRoi: 0, // Start with 0 accumulated ROI
      lastRoiCalculation: now, // Track when ROI was last calculated
      createdAt: now,
    });

    // Create transaction record
    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "stake",
      coin: args.coin,
      amount: args.amount,
      status: "completed",
      requestedAt: now,
      processedAt: now,
      metadata: {
        poolId,
        duration: args.duration,
        roiPercentage: args.roiPercentage,
        endDate,
      },
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: args.userId,
      type: "stake",
      description: `Staked ${args.amount} ${args.coin} for ${args.duration} days`,
      metadata: { poolId, amount: args.amount, coin: args.coin, duration: args.duration },
      timestamp: now,
    });

    return { poolId };
  },
});

/**
 * Get user's staking pools
 */
export const getUserStakingPools = query({
  args: {
    userId: v.id("users"),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("stakingPools")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    const pools = await query.collect();

    if (args.status) {
      return pools.filter((p) => p.status === args.status);
    }

    return pools.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get all staking pools (admin only)
 */
export const getAllStakingPools = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("completed"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("stakingPools");

    const pools = await query.collect();

    if (args.status) {
      return pools.filter((p) => p.status === args.status).sort((a, b) => b.createdAt - a.createdAt);
    }

    return pools.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get total accumulated ROI for a user's active staking pools
 */
export const getUserTotalAccumulatedRoi = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const activePools = await ctx.db
      .query("stakingPools")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Group ROI by coin
    const roiByCoin: Record<string, number> = {};
    
    for (const pool of activePools) {
      const accumulatedRoi = pool.accumulatedRoi || 0;
      if (!roiByCoin[pool.coin]) {
        roiByCoin[pool.coin] = 0;
      }
      roiByCoin[pool.coin] += accumulatedRoi;
    }

    return roiByCoin;
  },
});

/**
 * Process matured staking pools (called by cron)
 */
export const processMaturedPools = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    
    // Find all active pools that have matured
    const activePools = await ctx.db
      .query("stakingPools")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const maturedPools = activePools.filter((pool) => pool.endDate <= now);

    for (const pool of maturedPools) {
      // Use accumulated ROI (calculated daily) or calculate final ROI if not set
      const roiAmount = pool.accumulatedRoi ?? ((pool.amount * pool.roiPercentage) / 100);
      const maturedAmount = pool.amount + roiAmount;

      // Update pool status
      await ctx.db.patch(pool._id, {
        status: "completed",
        maturedAmount,
        completedAt: now,
      });

      // Move staked amount back to available balance
      await ctx.scheduler.runAfter(0, internal.balances.updateBalance, {
        userId: pool.userId,
        coin: pool.coin,
        amount: pool.amount,
        type: "unstake",
      });

      // Add ROI to available balance
      await ctx.scheduler.runAfter(0, internal.balances.updateBalance, {
        userId: pool.userId,
        coin: pool.coin,
        amount: roiAmount,
        type: "swap_to", // Using swap_to to add funds
      });

      // Create transaction record
      await ctx.db.insert("transactions", {
        userId: pool.userId,
        type: "unstake",
        coin: pool.coin,
        amount: maturedAmount,
        status: "completed",
        requestedAt: now,
        processedAt: now,
        metadata: {
          poolId: pool._id,
          principal: pool.amount,
          roi: roiAmount,
        },
      });

      // Create activity log
      await ctx.db.insert("activities", {
        userId: pool.userId,
        type: "stake_matured",
        description: `Staking pool matured: ${maturedAmount} ${pool.coin} (${pool.amount} principal + ${roiAmount} ROI)`,
        metadata: {
          poolId: pool._id,
          amount: pool.amount,
          roi: roiAmount,
          maturedAmount,
          coin: pool.coin,
        },
        timestamp: now,
      });
    }

    return { processed: maturedPools.length };
  },
});

