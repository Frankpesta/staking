"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

// Token expiration constants (can't import from lib in Convex actions)
const TOKEN_EXPIRATION = {
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
  ACCESS_TOKEN: 24 * 60 * 60 * 1000, // 24 hours
};

function generateExpiration(ms: number): number {
  return Date.now() + ms;
}

/**
 * Create a new user account (action version for Node.js APIs)
 */
export const createUser = action({
  args: {
    email: v.string(),
    password: v.string(),
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
    recaptchaToken: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ userId: string; verificationToken: string }> => {
    // Check if user already exists
    const existingUser = await ctx.runQuery(internal.users.getUserByEmail, {
      email: args.email,
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash: string = await ctx.runAction(internal.actions.auth.hashPassword, {
      password: args.password,
    });

    // Create user using internal mutation
    const userId = await ctx.runMutation(internal.users.createUserInternal, {
      email: args.email,
      passwordHash,
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
    });

    // Generate email verification token
    const verificationToken: string = await ctx.runAction(
      internal.actions.auth.generateRandomToken,
      {}
    );

    await ctx.runMutation(internal.users.createVerificationToken, {
      userId,
      token: verificationToken,
      expiresAt: generateExpiration(TOKEN_EXPIRATION.EMAIL_VERIFICATION),
    });

    // Send welcome email with verification link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
    
    try {
      await ctx.runAction((internal.actions as any).email.sendWelcomeEmail, {
        email: args.email,
        verificationLink,
      });
    } catch (error) {
      // Log error but don't fail user creation - email sending is optional
      console.error("Failed to send welcome email:", error);
    }

    return {
      userId,
      verificationToken, // Still return for development/testing
    };
  },
});

/**
 * Authenticate user and create session (action version)
 */
export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ token: string; user: { _id: string; email: string; role: string; emailVerified: boolean; kycStatus: string } }> => {
    // Find user
    const user = await ctx.runQuery(internal.users.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValid = await ctx.runAction(internal.actions.auth.verifyPassword, {
      password: args.password,
      hash: user.passwordHash,
    });

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error("Please verify your email before logging in. Check your inbox for the verification link or request a new one.");
    }

    // Generate session token
    const token: string = await ctx.runAction(internal.actions.auth.generateToken, {
      userId: user._id,
      role: user.role,
    });

    const expiresAt = generateExpiration(TOKEN_EXPIRATION.ACCESS_TOKEN);

    // Create session
    await ctx.runMutation(internal.users.createSession, {
      userId: user._id,
      token,
      expiresAt,
    });

    // Create activity log
    await ctx.runMutation(internal.users.createActivity, {
      userId: user._id,
      type: "login",
      description: "User logged in",
    });

    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        kycStatus: user.kycStatus,
      },
    };
  },
});

/**
 * Reset password with token (action version)
 */
export const resetPassword = action({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Find reset token
    const reset = await ctx.runQuery(internal.users.getPasswordResetToken, {
      token: args.token,
    });

    if (!reset || reset.expiresAt < Date.now()) {
      throw new Error("Invalid or expired reset token");
    }

    // Hash new password
    const passwordHash = await ctx.runAction(internal.actions.auth.hashPassword, {
      password: args.newPassword,
    });

    // Get user to verify they exist
    const user = await ctx.runQuery(internal.users.getUserByIdInternal, {
      userId: reset.userId,
    });
    if (!user) {
      throw new Error("User not found");
    }

    // Update user password
    await ctx.runMutation(internal.users.updatePassword, {
      userId: reset.userId,
      passwordHash,
    });

    // Delete reset token
    await ctx.runMutation(internal.users.deletePasswordResetToken, {
      tokenId: reset._id,
    });

    // Invalidate all sessions
    await ctx.runMutation(internal.users.invalidateUserSessions, {
      userId: reset.userId,
    });

    // Create activity log
    await ctx.runMutation(internal.users.createActivity, {
      userId: reset.userId,
      type: "password_reset",
      description: "Password reset completed",
    });

    return { success: true };
  },
});

/**
 * Request password reset (action version)
 */
export const requestPasswordReset = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; resetToken?: string }> => {
    // Find user
    const user = await ctx.runQuery(internal.users.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      // Don't reveal if user exists for security
      return { success: true };
    }

    // Generate reset token
    const resetToken: string = await ctx.runAction(
      internal.actions.auth.generateRandomToken,
      {}
    );

    await ctx.runMutation(internal.users.createPasswordResetToken, {
      userId: user._id,
      token: resetToken,
      expiresAt: generateExpiration(TOKEN_EXPIRATION.PASSWORD_RESET),
    });

    // Send password reset email (placeholder)
    // await ctx.runAction(internal.actions.email.sendPasswordResetEmail, { email: args.email, resetToken });

    return { success: true, resetToken };
  },
});

/**
 * Resend email verification (action version)
 */
export const resendVerificationEmail = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // Find user
    const user = await ctx.runQuery(internal.users.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      // Don't reveal if user exists for security - return success anyway
      return { success: true };
    }

    // If already verified, return success (don't reveal status)
    if (user.emailVerified) {
      return { success: true };
    }

    // Generate new verification token
    const verificationToken: string = await ctx.runAction(
      internal.actions.auth.generateRandomToken,
      {}
    );

    await ctx.runMutation(internal.users.createVerificationToken, {
      userId: user._id,
      token: verificationToken,
      expiresAt: generateExpiration(TOKEN_EXPIRATION.EMAIL_VERIFICATION),
    });

    // Send welcome email with verification link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
    
    try {
      await ctx.runAction((internal.actions as any).email.sendWelcomeEmail, {
        email: args.email,
        verificationLink,
      });
    } catch (error) {
      // Log error but don't fail - email sending is optional
      console.error("Failed to send verification email:", error);
    }

    return { success: true };
  },
});

