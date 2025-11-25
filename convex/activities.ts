import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get user activities
 */
export const getUserActivities = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by timestamp descending and take limit
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  },
});

/**
 * Get recent activities (admin only)
 */
export const getRecentActivities = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);

    return activities;
  },
});

