import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("user"), v.literal("super_admin")),
    emailVerified: v.boolean(),
    kycStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("not_started")
    ),
    kycDocuments: v.array(v.id("kycDocuments")),
    twoFactorEnabled: v.boolean(),
    twoFactorSecret: v.optional(v.string()),
    // Profile fields
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  balances: defineTable({
    userId: v.id("users"),
    depositBalance: v.any(), // Dynamic object with coin symbols as keys and numbers as values
    // Example: { BTC: 0, ETH: 0, USDT: 0 }
    stakedBalance: v.any(), // Dynamic object with coin symbols as keys and numbers as values
    availableBalance: v.any(), // Dynamic object with coin symbols as keys and numbers as values
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("stake"),
      v.literal("unstake"),
      v.literal("swap"),
      v.literal("roi")
    ),
    coin: v.string(),
    amount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("completed"),
      v.literal("failed")
    ),
    walletAddress: v.optional(v.string()),
    txHash: v.optional(v.string()),
    chainId: v.optional(v.number()),
    fromAddress: v.optional(v.string()),
    toAddress: v.optional(v.string()),
    adminNote: v.optional(v.string()),
    requestedAt: v.number(),
    processedAt: v.optional(v.number()),
    processedBy: v.optional(v.id("users")),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_user_and_status", ["userId", "status"]),

  stakingPools: defineTable({
    userId: v.id("users"),
    coin: v.string(),
    amount: v.number(),
    duration: v.number(), // days: 30, 60, 90, 180, 365
    roiPercentage: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    maturedAmount: v.optional(v.number()),
    accumulatedRoi: v.optional(v.number()), // ROI accumulated daily, only withdrawable at maturity
    lastRoiCalculation: v.optional(v.number()), // Timestamp of last ROI calculation
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_end_date", ["endDate"]),

  kycDocuments: defineTable({
    userId: v.id("users"),
    documentType: v.union(
      v.literal("id_front"),
      v.literal("id_back"),
      v.literal("selfie"),
      v.literal("proof_of_address")
    ),
    fileId: v.id("_storage"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    uploadedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.id("users")),
    rejectionReason: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  supportTickets: defineTable({
    userId: v.id("users"),
    subject: v.string(),
    message: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    responses: v.array(
      v.object({
        adminId: v.id("users"),
        message: v.string(),
        timestamp: v.number(),
        attachments: v.optional(v.array(v.id("_storage"))),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  activities: defineTable({
    userId: v.id("users"),
    type: v.string(),
    description: v.string(),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  platformWallets: defineTable({
    coin: v.string(),
    chainId: v.number(),
    address: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_coin", ["coin"])
    .index("by_coin_and_chain", ["coin", "chainId"]),

  appSettings: defineTable({
    platformPaused: v.boolean(),
    supportedCoins: v.array(
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
    ),
    stakingOptions: v.array(
      v.object({
        duration: v.number(),
        roiPercentage: v.number(),
      })
    ),
    maintenanceMode: v.boolean(),
    announcementMessage: v.optional(v.string()),
  }),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  emailVerificationTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  passwordResetTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),
});

