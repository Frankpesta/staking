import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { DEFAULT_COINS, DEFAULT_STAKING_OPTIONS } from "../lib/constants";

/**
 * Initialize app settings (run once)
 */
export const initializeSettings = mutation({
  handler: async (ctx) => {
    // Check if settings already exist
    const existing = await ctx.db.query("appSettings").first();
    if (existing) {
      return existing._id;
    }

    const settingsId = await ctx.db.insert("appSettings", {
      platformPaused: false,
      supportedCoins: DEFAULT_COINS.map((coin) => ({
        symbol: coin.symbol,
        name: coin.name,
        chainId: coin.chainId,
        isNative: coin.isNative,
        contractAddress: coin.contractAddress,
        decimals: coin.decimals,
        minDeposit: coin.minDeposit,
        minWithdrawal: coin.minWithdrawal,
        depositEnabled: coin.depositEnabled,
        withdrawalEnabled: coin.withdrawalEnabled,
      })),
      stakingOptions: DEFAULT_STAKING_OPTIONS.map((option) => ({
        duration: option.duration,
        roiPercentage: option.roiPercentage,
      })),
      maintenanceMode: false,
    });

    return settingsId;
  },
});

/**
 * Get app settings
 */
export const getAppSettings = query({
  handler: async (ctx) => {
    let settings = await ctx.db.query("appSettings").first();

    if (!settings) {
      // Initialize if not exists - will be created on first mutation
      // Return default settings for now
      return {
        platformPaused: false,
        supportedCoins: DEFAULT_COINS,
        stakingOptions: DEFAULT_STAKING_OPTIONS,
        maintenanceMode: false,
      };
    }

    return settings;
  },
});

/**
 * Update app settings (admin only)
 */
export const updateAppSettings = mutation({
  args: {
    platformPaused: v.optional(v.boolean()),
    maintenanceMode: v.optional(v.boolean()),
    announcementMessage: v.optional(v.string()),
    supportedCoins: v.optional(
      v.array(
        v.object({
          symbol: v.string(),
          name: v.string(),
          chainId: v.number(),
          isNative: v.boolean(),
          contractAddress: v.optional(v.string()),
          decimals: v.number(),
          minDeposit: v.number(),
          minWithdrawal: v.number(),
          depositEnabled: v.boolean(),
          withdrawalEnabled: v.boolean(),
        })
      )
    ),
    stakingOptions: v.optional(
      v.array(
        v.object({
          duration: v.number(),
          roiPercentage: v.number(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    let settings = await ctx.db.query("appSettings").first();

    if (!settings) {
      // Initialize first
      await initializeSettings(ctx, {});
      settings = await ctx.db.query("appSettings").first();
      if (!settings) {
        throw new Error("Failed to initialize settings");
      }
    }

    const updates: {
      platformPaused?: boolean;
      maintenanceMode?: boolean;
      announcementMessage?: string;
      supportedCoins?: typeof args.supportedCoins;
      stakingOptions?: typeof args.stakingOptions;
    } = {};

    if (args.platformPaused !== undefined) {
      updates.platformPaused = args.platformPaused;
    }
    if (args.maintenanceMode !== undefined) {
      updates.maintenanceMode = args.maintenanceMode;
    }
    if (args.announcementMessage !== undefined) {
      updates.announcementMessage = args.announcementMessage;
    }
    if (args.supportedCoins !== undefined) {
      updates.supportedCoins = args.supportedCoins;
    }
    if (args.stakingOptions !== undefined) {
      updates.stakingOptions = args.stakingOptions;
    }

    await ctx.db.patch(settings._id, updates);
    return { success: true };
  },
});

