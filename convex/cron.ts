import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Hourly cron job to process matured staking pools
 */
export const hourlyStakingCheck = internalMutation({
  handler: async (ctx) => {
    // Process matured staking pools
    await ctx.scheduler.runAfter(0, internal.staking.processMaturedPools, {});
  },
});

/**
 * Daily cron job to calculate ROI for active staking pools
 */
export const dailyRoiCalculation = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Get all active staking pools
    const activePools = await ctx.db
      .query("stakingPools")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    for (const pool of activePools) {
      // Calculate daily ROI amount
      const totalRoi = (pool.amount * pool.roiPercentage) / 100;
      const dailyRoi = totalRoi / pool.duration;
      
      // Get last calculation time or use start date
      const lastCalculation = pool.lastRoiCalculation || pool.startDate;
      
      // Calculate how many days have passed since last calculation
      const daysSinceLastCalculation = Math.floor((now - lastCalculation) / oneDayMs);
      
      // Only calculate if at least one day has passed
      if (daysSinceLastCalculation >= 1) {
        // Calculate accumulated ROI for the days passed
        const newAccumulatedRoi = (pool.accumulatedRoi || 0) + (dailyRoi * daysSinceLastCalculation);
        
        // Don't exceed total ROI
        const maxRoi = totalRoi;
        const finalAccumulatedRoi = Math.min(newAccumulatedRoi, maxRoi);
        
        // Update pool with accumulated ROI
        await ctx.db.patch(pool._id, {
          accumulatedRoi: finalAccumulatedRoi,
          lastRoiCalculation: now,
        });
      }
    }

    return { calculated: activePools.length };
  },
});

/**
 * Daily cron job for cleanup and reports
 */
export const dailyCleanup = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;

    // Clean up old activities (older than 90 days)
    const oldActivities = await ctx.db
      .query("activities")
      .withIndex("by_timestamp")
      .filter((q) => q.lt(q.field("timestamp"), ninetyDaysAgo))
      .collect();

    // Keep only last 1000 activities per user, delete older ones
    const activitiesByUser = new Map<string, typeof oldActivities>();
    for (const activity of oldActivities) {
      const userActivities = activitiesByUser.get(activity.userId) || [];
      userActivities.push(activity);
      activitiesByUser.set(activity.userId, userActivities);
    }

    for (const [userId, activities] of activitiesByUser.entries()) {
      if (activities.length > 1000) {
        const toDelete = activities.slice(1000);
        for (const activity of toDelete) {
          await ctx.db.delete(activity._id);
        }
      }
    }

    // Clean up expired sessions
    const expiredSessions = await ctx.db
      .query("sessions")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }

    // Clean up expired email verification tokens
    const expiredEmailTokens = await ctx.db
      .query("emailVerificationTokens")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const token of expiredEmailTokens) {
      await ctx.db.delete(token._id);
    }

    // Clean up expired password reset tokens
    const expiredResetTokens = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const token of expiredResetTokens) {
      await ctx.db.delete(token._id);
    }

    return { cleaned: true };
  },
});

