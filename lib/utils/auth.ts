import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: "24h",
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a random token for email verification or password reset
 */
export function generateRandomToken(): string {
  return uuidv4() + "-" + Date.now().toString(36);
}

/**
 * Generate expiration timestamp
 */
export function generateExpiration(ms: number): number {
  return Date.now() + ms;
}

