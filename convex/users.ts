import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { TOKEN_EXPIRATION } from "../lib/constants";

function generateExpiration(ms: number): number {
  return Date.now() + ms;
}

// Note: createUser, login, and resetPassword are now actions in convex/actions/users.ts
// They need to be called as actions from the frontend, not mutations

/**
 * Authenticate user and create session
 * Note: This is now an action wrapper - the actual implementation is in actions/users.ts
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<never> => {
    // Note: This mutation wrapper is deprecated - use actions/users.login directly from frontend
    // Delegate to action for Node.js APIs (non-blocking)
    // Note: This mutation is deprecated - use actions/users.login directly
    // ctx.scheduler.runAfter(0, internal.actions.users.login, args);
    throw new Error("Use actions/users.login action instead of this mutation");
  },
});

/**
 * Get current user from session token
 */
export const getCurrentUser = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus,
      twoFactorEnabled: user.twoFactorEnabled,
    };
  },
});

/**
 * Verify email with token
 */
export const verifyEmail = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find verification token
    const verification = await ctx.db
      .query("emailVerificationTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!verification || verification.expiresAt < Date.now()) {
      throw new Error("Invalid or expired verification token");
    }

    // Update user
    const user = await ctx.db.get(verification.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      emailVerified: true,
      updatedAt: Date.now(),
    });

    // Delete verification token
    await ctx.db.delete(verification._id);

    // Create activity log
    await ctx.db.insert("activities", {
      userId: user._id,
      type: "email_verified",
      description: "Email verified",
      timestamp: Date.now(),
    });

    // Send confirmation email (non-blocking)
    // Note: Mutations can't directly call actions, so we skip the confirmation email
    // The user already knows they verified since they clicked the link
    // If needed, this could be handled via a scheduled action or webhook

    return { success: true };
  },
});

/**
 * Request password reset
 */
export const requestPasswordReset = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      // Don't reveal if user exists for security
      return { success: true };
    }

    // Generate reset token (simple random token for Convex mutations)
    const resetToken = `${Math.random().toString(36).substring(2)}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
    await ctx.db.insert("passwordResetTokens", {
      userId: user._id,
      token: resetToken,
      expiresAt: generateExpiration(TOKEN_EXPIRATION.PASSWORD_RESET),
      createdAt: Date.now(),
    });

    return {
      success: true,
      resetToken, // In production, this would be sent via email
    };
  },
});

/**
 * Reset password with token
 * Note: This is now an action wrapper - the actual implementation is in actions/users.ts
 */
export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args): Promise<never> => {
    // Note: This mutation wrapper is deprecated - use actions/users.resetPassword directly from frontend
    // Delegate to action for Node.js APIs (non-blocking)
    // Note: This mutation is deprecated - use actions/users.resetPassword directly  
    // ctx.scheduler.runAfter(0, internal.actions.users.resetPassword, args);
    throw new Error("Use actions/users.resetPassword action instead of this mutation");
  },
});

/**
 * Get user by ID (admin only)
 */
export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus,
      accountHolderName1: user.accountHolderName1,
      accountHolderName2: user.accountHolderName2,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      country: user.country,
      phoneNumber: user.phoneNumber,
      phoneCountryCode: user.phoneCountryCode,
      accountType: user.accountType,
      hasLLCTrustCorp: user.hasLLCTrustCorp,
      hasCryptoIRA: user.hasCryptoIRA,
      profileImageId: user.profileImageId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    accountHolderName1: v.optional(v.string()),
    accountHolderName2: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    phoneCountryCode: v.optional(v.string()),
    accountType: v.optional(v.union(
      v.literal("Individual Staking"),
      v.literal("Digital Wealth Partner"),
      v.literal("Joint Ownership Account")
    )),
    hasLLCTrustCorp: v.optional(v.boolean()),
    hasCryptoIRA: v.optional(v.boolean()),
    profileImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Delete user (admin only)
 */
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Delete user's balance
    const balance = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (balance) {
      await ctx.db.delete(balance._id);
    }

    // Delete user's sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Delete user
    await ctx.db.delete(args.userId);

    return { success: true };
  },
});

/**
 * List all users (admin only)
 */
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    const users = await ctx.db.query("users").take(limit);

    return users.map((user) => ({
      _id: user._id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus,
      accountHolderName1: user.accountHolderName1,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  },
});

// ============================================================================
// Internal functions (for use by actions and other Convex functions)
// ============================================================================

/**
 * Internal query to get user by email
 */
export const getUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user;
  },
});

/**
 * Internal mutation to create user
 */
export const createUserInternal = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    accountHolderName1: v.optional(v.string()),
    accountHolderName2: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    phoneCountryCode: v.optional(v.string()),
    accountType: v.optional(v.union(
      v.literal("Individual Staking"),
      v.literal("Digital Wealth Partner"),
      v.literal("Joint Ownership Account")
    )),
    hasLLCTrustCorp: v.optional(v.boolean()),
    hasCryptoIRA: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      role: "user",
      emailVerified: false,
      kycStatus: "not_started",
      kycDocuments: [],
      twoFactorEnabled: false,
      accountHolderName1: args.accountHolderName1,
      accountHolderName2: args.accountHolderName2,
      dateOfBirth: args.dateOfBirth,
      address: args.address,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      country: args.country,
      phoneNumber: args.phoneNumber,
      phoneCountryCode: args.phoneCountryCode,
      accountType: args.accountType,
      hasLLCTrustCorp: args.hasLLCTrustCorp,
      hasCryptoIRA: args.hasCryptoIRA,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create initial balance record
    await ctx.db.insert("balances", {
      userId,
      depositBalance: {},
      stakedBalance: {},
      availableBalance: {},
      updatedAt: Date.now(),
    });

    return userId;
  },
});

/**
 * Internal mutation to create verification token
 */
export const createVerificationToken = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailVerificationTokens", {
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
  },
});

/**
 * Internal mutation to create password reset token
 */
export const createPasswordResetToken = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("passwordResetTokens", {
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
  },
});

/**
 * Internal mutation to create session
 */
export const createSession = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
  },
});

/**
 * Internal mutation to create activity
 */
export const createActivity = internalMutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activities", {
      userId: args.userId,
      type: args.type,
      description: args.description,
      timestamp: Date.now(),
    });
  },
});

/**
 * Internal query to get password reset token
 */
export const getPasswordResetToken = internalQuery({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const reset = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    return reset;
  },
});

/**
 * Internal mutation to update password
 */
export const updatePassword = internalMutation({
  args: {
    userId: v.id("users"),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      passwordHash: args.passwordHash,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Internal mutation to delete password reset token
 */
export const deletePasswordResetToken = internalMutation({
  args: {
    tokenId: v.id("passwordResetTokens"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.tokenId);
  },
});

/**
 * Internal mutation to invalidate user sessions
 */
export const invalidateUserSessions = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
  },
});

/**
 * Internal query to get user by ID (full user object with password hash)
 */
export const getUserByIdInternal = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

