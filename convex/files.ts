import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Generate upload URL for file uploads
 */
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Get download URL for a file
 */
export const getFileUrl = mutation({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

