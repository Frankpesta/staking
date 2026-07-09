# Cron Jobs Setup Instructions

## Overview
The cron jobs for daily ROI calculation and other scheduled tasks are defined in `convex/crons.ts`. Convex registers these automatically from the `export default crons` in that file — **there is no manual dashboard step**. Any `npx convex dev` or `npx convex deploy` run against a deployment reads `convex/crons.ts` and syncs its cron jobs to that deployment.

## Registered Cron Jobs

### 1. Hourly Staking Check
- **Function**: `internal.staking.processMaturedPools`
- **Schedule**: Every hour
- **Purpose**: Moves matured staking pools' principal + accumulated ROI back to available balance

### 2. Daily ROI Calculation
- **Function**: `internal.crons.dailyRoiCalculation`
- **Schedule**: Daily at midnight UTC (`0 0 * * *`)
- **Purpose**: Accrues daily ROI onto active staking pools and now logs a `roi` transaction + activity entry per accrual

### 3. Daily Cleanup
- **Function**: `internal.crons.dailyCleanup`
- **Schedule**: Daily at 2 AM UTC (`0 2 * * *`)
- **Purpose**: Cleans up old activities, expired sessions, and tokens

## Critical prerequisite: deployment must match what the app uses

Cron jobs only run on the deployment they were deployed to. Before assuming crons aren't firing, confirm:
1. `CONVEX_DEPLOYMENT` (used by the CLI to deploy) and `NEXT_PUBLIC_CONVEX_URL` (used by the running app) point to the **same** deployment. If they don't match, your deploys never reach the database the live app actually reads/writes.
2. The value of `NEXT_PUBLIC_CONVEX_URL` configured on your hosting provider (e.g. Vercel env vars) matches the one in `.env.local` — a stale value on the host is a common source of "it works locally but not in production."

## Verification

After deploying:
1. Convex dashboard → your deployment → **Functions** tab: confirm `crons.ts` and `staking.ts` are present.
2. Convex dashboard → **Logs** / **Health**: confirm `hourlyStakingCheck`, `dailyRoiCalculation`, and `dailyCleanup` show recent successful runs.
3. Check the `stakingPools` table: `accumulatedRoi` and `lastRoiCalculation` should update daily on active pools.
4. Check the `transactions` table: a `roi` transaction should appear per pool per day it accrues.
5. Check that matured pools flip to `status: "completed"` and their principal + ROI land back in `balances.availableBalance`.

## Troubleshooting

If cron jobs aren't running:
- Verify the functions are deployed to the deployment the app actually uses: `npx convex deploy` (check `CONVEX_DEPLOYMENT` first).
- Check Convex dashboard logs for errors.
- Ensure your Convex deployment is active and your CLI login has access to it (`npx convex env list` will error with "You don't have access to the selected project" if not).
- Verify the cron schedule syntax is correct.
