# Seeding Balances in Convex Database

## Schema Structure

Based on `convex/schema.ts`, the `balances` table has this structure:

```typescript
balances: defineTable({
  userId: v.id("users"),
  depositBalance: v.object({}),  // Dynamic: { "ETH": 100, "BTC": 5, "USDT": 1000 }
  stakedBalance: v.object({}),    // Dynamic: { "ETH": 50, "BTC": 2 }
  availableBalance: v.object({}), // Dynamic: { "ETH": 50, "BTC": 3 }
  updatedAt: v.number(),
})
```

## Understanding the Balance Objects

The `depositBalance`, `stakedBalance`, and `availableBalance` fields are **dynamic objects** where:
- **Keys** = Coin symbols (strings like `"ETH"`, `"BTC"`, `"USDT"`, `"MATIC"`)
- **Values** = Balance amounts (numbers)

## How to Seed depositBalance

### Option 1: Using Convex Dashboard (Manual)

1. Go to your Convex dashboard
2. Navigate to the `balances` table
3. Create a new record with:

```json
{
  "userId": "j1234567890abcdef",  // Replace with actual user ID
  "depositBalance": {
    "ETH": 10.5,
    "BTC": 0.5,
    "USDT": 1000,
    "MATIC": 500,
    "BNB": 2.3
  },
  "stakedBalance": {
    "ETH": 5.0,
    "BTC": 0.2
  },
  "availableBalance": {
    "ETH": 5.5,
    "BTC": 0.3,
    "USDT": 1000,
    "MATIC": 500,
    "BNB": 2.3
  },
  "updatedAt": 1704067200000  // Unix timestamp in milliseconds
}
```

### Option 2: Using a Convex Mutation (Recommended)

Create a seed mutation in `convex/seed.ts`:

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedBalance = mutation({
  args: {
    userId: v.id("users"),
    depositBalance: v.object({
      // You can specify specific coins or use v.any() for flexibility
      ETH: v.optional(v.number()),
      BTC: v.optional(v.number()),
      USDT: v.optional(v.number()),
      MATIC: v.optional(v.number()),
      BNB: v.optional(v.number()),
    }),
    stakedBalance: v.optional(v.object({})),
    availableBalance: v.optional(v.object({})),
  },
  handler: async (ctx, args) => {
    // Check if balance already exists
    const existing = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      // Update existing balance
      await ctx.db.patch(existing._id, {
        depositBalance: args.depositBalance,
        stakedBalance: args.stakedBalance || {},
        availableBalance: args.availableBalance || args.depositBalance,
        updatedAt: Date.now(),
      });
      return { success: true, updated: true };
    }

    // Create new balance
    const balanceId = await ctx.db.insert("balances", {
      userId: args.userId,
      depositBalance: args.depositBalance,
      stakedBalance: args.stakedBalance || {},
      availableBalance: args.availableBalance || args.depositBalance,
      updatedAt: Date.now(),
    });

    return { success: true, balanceId };
  },
});
```

**Usage:**
```typescript
// Call from frontend or Convex dashboard
await seedBalance({
  userId: "j1234567890abcdef",
  depositBalance: {
    ETH: 10.5,
    BTC: 0.5,
    USDT: 1000,
    MATIC: 500,
    BNB: 2.3
  },
  stakedBalance: {
    ETH: 5.0,
    BTC: 0.2
  },
  availableBalance: {
    ETH: 5.5,
    BTC: 0.3,
    USDT: 1000,
    MATIC: 500,
    BNB: 2.3
  }
});
```

### Option 3: Using Convex CLI Script

Create `scripts/seed-balances.ts`:

```typescript
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function seedBalances() {
  // Replace with actual user IDs
  const userIds = [
    "j1234567890abcdef",
    "j0987654321fedcba",
  ];

  for (const userId of userIds) {
    await client.mutation(api.seed.seedBalance, {
      userId: userId as any,
      depositBalance: {
        ETH: 10.5,
        BTC: 0.5,
        USDT: 1000,
        MATIC: 500,
        BNB: 2.3
      },
      stakedBalance: {
        ETH: 5.0,
        BTC: 0.2
      },
      availableBalance: {
        ETH: 5.5,
        BTC: 0.3,
        USDT: 1000,
        MATIC: 500,
        BNB: 2.3
      }
    });
    console.log(`Seeded balance for user ${userId}`);
  }
}

seedBalances();
```

Run with:
```bash
npx tsx scripts/seed-balances.ts
```

## Important Notes

### 1. Balance Relationships

The three balance types have relationships:
- **depositBalance**: Total amount ever deposited
- **stakedBalance**: Amount currently staked (locked)
- **availableBalance**: Amount available for withdrawal/staking

**Formula:** `availableBalance = depositBalance - stakedBalance - withdrawnAmount`

### 2. Dynamic Coin Support

Since `v.object({})` accepts any keys, you can add any coin symbol:

```typescript
depositBalance: {
  "ETH": 10.5,
  "BTC": 0.5,
  "USDT": 1000,
  "MATIC": 500,
  "BNB": 2.3,
  "AVAX": 100,      // New coin
  "ARB": 50,        // New coin
  // ... any other coin
}
```

### 3. Initialization Pattern

Looking at `convex/balances.ts`, balances are typically initialized as empty objects `{}` and coins are added dynamically:

```typescript
// Initial state
depositBalance: {}
stakedBalance: {}
availableBalance: {}

// After first deposit of 10 ETH
depositBalance: { ETH: 10 }
availableBalance: { ETH: 10 }
stakedBalance: {}

// After staking 5 ETH
depositBalance: { ETH: 10 }
availableBalance: { ETH: 5 }
stakedBalance: { ETH: 5 }
```

### 4. Type Safety in TypeScript

When working with balances in your code, cast them as `Record<string, number>`:

```typescript
const depositBalance = balance.depositBalance as Record<string, number>;
const ethBalance = depositBalance["ETH"] || 0;
```

## Example: Complete Seed Data

```json
{
  "userId": "j1234567890abcdef",
  "depositBalance": {
    "ETH": 10.5,
    "BTC": 0.5,
    "USDT": 1000,
    "USDC": 500,
    "MATIC": 500,
    "BNB": 2.3,
    "AVAX": 100,
    "ARB": 50
  },
  "stakedBalance": {
    "ETH": 5.0,
    "BTC": 0.2,
    "MATIC": 200
  },
  "availableBalance": {
    "ETH": 5.5,
    "BTC": 0.3,
    "USDT": 1000,
    "USDC": 500,
    "MATIC": 300,
    "BNB": 2.3,
    "AVAX": 100,
    "ARB": 50
  },
  "updatedAt": 1704067200000
}
```

## Validation

When seeding, ensure:
1. ✅ `userId` is a valid user ID from the `users` table
2. ✅ All balance values are non-negative numbers
3. ✅ `availableBalance[coin] <= depositBalance[coin]` (can't have more available than deposited)
4. ✅ `stakedBalance[coin] <= depositBalance[coin]` (can't stake more than deposited)
5. ✅ `updatedAt` is a valid Unix timestamp in milliseconds

