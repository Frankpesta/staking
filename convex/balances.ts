import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { requireSuperAdmin } from "./authHelpers";
import { scheduleAdminActivityEmail } from "./notifyAdmin";

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

    // If balance doesn't exist, return null - it should be created via mutation
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

const balanceScope = v.union(
  v.literal("available"),
  v.literal("staked"),
  v.literal("deposit"),
  v.literal("funding")
);

/**
 * Super-admin adjustment of a user's coin balances (manual credit/debit).
 */
export const adminAdjustBalance = mutation({
  args: {
    adminToken: v.string(),
    targetUserId: v.id("users"),
    coin: v.string(),
    amount: v.number(),
    direction: v.union(v.literal("add"), v.literal("subtract")),
    scope: balanceScope,
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.amount <= 0 || !Number.isFinite(args.amount)) {
      throw new Error("Amount must be a positive number");
    }

    const admin = await requireSuperAdmin(ctx, args.adminToken);
    const target = await ctx.db.get(args.targetUserId);
    if (!target) {
      throw new Error("User not found");
    }

    const delta = args.direction === "add" ? args.amount : -args.amount;

    let balance = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .first();

    if (!balance) {
      const balanceId = await ctx.db.insert("balances", {
        userId: args.targetUserId,
        depositBalance: {},
        stakedBalance: {},
        availableBalance: {},
        updatedAt: Date.now(),
      });
      balance = await ctx.db.get(balanceId);
      if (!balance) throw new Error("Failed to create balance");
    }

    const depositBalance = { ...(balance.depositBalance as Record<string, number>) };
    const stakedBalance = { ...(balance.stakedBalance as Record<string, number>) };
    const availableBalance = { ...(balance.availableBalance as Record<string, number>) };

    const applyDelta = (map: Record<string, number>, coin: string, d: number) => {
      if (!map[coin]) map[coin] = 0;
      map[coin] += d;
      if (map[coin] < 0) map[coin] = 0;
    };

    switch (args.scope) {
      case "available":
        applyDelta(availableBalance, args.coin, delta);
        break;
      case "staked":
        applyDelta(stakedBalance, args.coin, delta);
        break;
      case "deposit":
        applyDelta(depositBalance, args.coin, delta);
        break;
      case "funding":
        applyDelta(availableBalance, args.coin, delta);
        applyDelta(depositBalance, args.coin, delta);
        break;
      default: {
        const _exhaustive: never = args.scope;
        return _exhaustive;
      }
    }

    await ctx.db.patch(balance._id, {
      depositBalance,
      stakedBalance,
      availableBalance,
      updatedAt: Date.now(),
    });

    const actionWord = args.direction === "add" ? "Added" : "Subtracted";
    const desc = `${actionWord} ${args.amount} ${args.coin} (${args.scope}) for ${target.email}${
      args.note ? ` — ${args.note}` : ""
    }`;

    await scheduleAdminActivityEmail(ctx, {
      activityType: "admin_balance_adjustment",
      description: `${desc} — Admin: ${admin.email}`,
      userId: args.targetUserId,
      adminPath: "/admin/users",
    });

    return { success: true };
  },
});
