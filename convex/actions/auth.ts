"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = internalAction({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    return bcrypt.hash(args.password, SALT_ROUNDS);
  },
});

/**
 * Verify a password against a hash
 */
export const verifyPassword = internalAction({
  args: { password: v.string(), hash: v.string() },
  handler: async (ctx, args) => {
    return bcrypt.compare(args.password, args.hash);
  },
});

/**
 * Generate a JWT token
 */
export const generateToken = internalAction({
  args: { userId: v.string(), role: v.string() },
  handler: async (ctx, args) => {
    return jwt.sign({ userId: args.userId, role: args.role }, JWT_SECRET, {
      expiresIn: "24h",
    });
  },
});

/**
 * Verify and decode a JWT token
 */
export const verifyToken = internalAction({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    try {
      const decoded = jwt.verify(args.token, JWT_SECRET) as {
        userId: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  },
});

/**
 * Generate a random token for email verification or password reset
 */
export const generateRandomToken = internalAction({
  handler: async (ctx) => {
    return uuidv4() + "-" + Date.now().toString(36);
  },
});

