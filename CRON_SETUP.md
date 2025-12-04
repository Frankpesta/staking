# Cron Jobs Setup Instructions

## Overview
The cron jobs for daily ROI calculation and other scheduled tasks are defined in `convex/cron.ts` but need to be registered in the Convex dashboard.

## Required Cron Jobs

### 1. Hourly Staking Check
- **Function**: `cron:hourlyStakingCheck`
- **Schedule**: Every hour (`0 * * * *`)
- **Purpose**: Processes matured staking pools

### 2. Daily ROI Calculation
- **Function**: `cron:dailyRoiCalculation`
- **Schedule**: Daily at midnight UTC (`0 0 * * *`)
- **Purpose**: Calculates and accumulates daily ROI for active staking pools

### 3. Daily Cleanup
- **Function**: `cron:dailyCleanup`
- **Schedule**: Daily at 2 AM UTC (`0 2 * * *`)
- **Purpose**: Cleans up old activities, expired sessions, and tokens

## Setup Steps

### Option 1: Via Convex Dashboard (Recommended)
1. Go to your Convex dashboard: https://dashboard.convex.dev
2. Select your project
3. Navigate to **Settings** → **Cron Jobs**
4. Click **Add Cron Job**
5. For each cron job:
   - **Name**: Use the function name (e.g., `hourlyStakingCheck`)
   - **Function**: Select `cron:hourlyStakingCheck` (or the appropriate function)
   - **Schedule**: Enter the cron expression (e.g., `0 * * * *` for hourly)
   - **Arguments**: Leave empty `{}`
6. Repeat for all three cron jobs

### Option 2: Via Convex CLI
After deploying your functions, you can register cron jobs using:
```bash
npx convex run cron:hourlyStakingCheck --schedule "0 * * * *"
npx convex run cron:dailyRoiCalculation --schedule "0 0 * * *"
npx convex run cron:dailyCleanup --schedule "0 2 * * *"
```

## Verification

After setting up the cron jobs:
1. Check the Convex dashboard logs to verify cron jobs are running
2. Monitor the `stakingPools` table to see `accumulatedRoi` and `lastRoiCalculation` fields updating daily
3. Check that matured pools are being processed hourly

## Troubleshooting

If cron jobs aren't running:
- Verify the functions are deployed: `npx convex deploy`
- Check Convex dashboard logs for errors
- Ensure your Convex deployment is active
- Verify the cron schedule syntax is correct

