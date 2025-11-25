# Truststaking - Crypto Staking Platform

A comprehensive multi-blockchain staking platform built with Next.js 15, TypeScript, Convex, and wagmi/viem.

## 🚀 Features

### Core Functionality
- **Multi-Blockchain Support**: Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche, Base
- **Deposit System**: On-chain deposits to platform wallets with admin approval
- **Withdrawal System**: Admin-processed withdrawals with on-chain transactions
- **Staking System**: Fixed-term staking with predetermined ROI (30, 60, 90, 180, 365 days)
- **Swap System**: In-app coin exchange with admin approval
- **KYC Verification**: Document upload and admin review workflow
- **Support Ticketing**: Full ticketing system with admin responses
- **Activity Feed**: Real-time activity tracking
- **Admin Dashboard**: Comprehensive admin panel for managing all platform operations

### Technical Stack
- **Frontend**: Next.js 15 (App Router), TypeScript (strict mode), Tailwind CSS
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Animations**: GSAP for smooth animations
- **Blockchain**: wagmi + viem for blockchain interactions
- **Backend**: Convex (real-time DB, file storage, cron jobs, server functions)
- **Email**: Resend + react-email for templated emails
- **Auth**: Custom JWT + session-based authentication

## 📁 Project Structure

```
/app
  /(auth) - Authentication routes
  /(dashboard) - User dashboard
  /(admin) - Admin dashboard
/components
  /ui - Shadcn components
  /shared - Reusable components
  /forms - Form components
  /blockchain - Wallet and transaction components
/convex
  /schema.ts - Database schema
  /users.ts - User management
  /transactions.ts - Transaction logic
  /staking.ts - Staking operations
  /kyc.ts - KYC workflows
  /support.ts - Ticketing system
  /platformWallets.ts - Platform wallet management
  /cron.ts - Scheduled jobs
  /actions - Server-side blockchain operations
/lib
  /utils.ts - Utility functions
  /constants.ts - App constants
  /validations - Zod schemas
  /web3 - Blockchain utilities
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Convex account
- Resend account (for emails)
- RPC endpoints for supported chains

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Database
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# Authentication
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# Email
RESEND_API_KEY=your-resend-key

# Blockchain RPC Endpoints
NEXT_PUBLIC_ALCHEMY_API_KEY=your-key
NEXT_PUBLIC_ALCHEMY_RPC_URL_MAINNET=your-url
NEXT_PUBLIC_ALCHEMY_RPC_URL_POLYGON=your-url
BSC_RPC_URL=your-url
ARBITRUM_RPC_URL=your-url
OPTIMISM_RPC_URL=your-url
AVALANCHE_RPC_URL=your-url
BASE_RPC_URL=your-url

# Platform Wallets (Server-side only)
WALLET_PRIVATE_KEY_ETH=your-private-key
WALLET_PRIVATE_KEY_USDT=your-private-key
# ... one for each supported coin
```

3. Initialize Convex:
```bash
npx convex dev
```

4. Run development server:
```bash
npm run dev
```

## 🔐 Authentication Flow

1. User signs up with email and password
2. Verification email sent via Resend
3. User verifies email
4. User completes KYC (optional but recommended)
5. User can deposit, stake, swap, and withdraw

## 💰 Supported Coins

### Native Coins
- ETH (Ethereum)
- MATIC (Polygon)
- BNB (BSC)
- AVAX (Avalanche)

### Stablecoins
- USDT (Ethereum, Polygon, BSC)
- USDC (Ethereum)
- DAI (Ethereum)

Coins can be configured by admins in the admin dashboard.

## 📊 Staking Options

- **30 days**: 5% ROI
- **60 days**: 12% ROI
- **90 days**: 20% ROI
- **180 days**: 45% ROI
- **365 days**: 100% ROI

ROI percentages are configurable by admins.

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- Session management with expiration
- Input validation with Zod
- Rate limiting on sensitive endpoints
- Private keys stored only in environment variables
- Admin action logging
- Withdrawal cooldown periods

## 📝 Database Schema

### Users
- User accounts with roles (user/super_admin)
- Email verification status
- KYC status and documents

### Balances
- Deposit balance
- Staked balance
- Available balance

### Transactions
- All deposit, withdrawal, stake, swap transactions
- Status tracking (pending/approved/rejected/completed/failed)
- Blockchain transaction hashes

### StakingPools
- Active staking pools
- Maturity dates and ROI calculations

### PlatformWallets
- Platform wallet addresses for each coin/chain
- Private key references (not actual keys)

## 🚧 Development Status

### Completed
- ✅ Database schema and Convex functions
- ✅ Authentication system (signup, login, email verification)
- ✅ User management
- ✅ Balance management
- ✅ Transaction system
- ✅ Staking system with cron jobs
- ✅ KYC system
- ✅ Support ticketing
- ✅ Platform wallet management
- ✅ Basic UI components

### In Progress
- 🔄 Frontend pages and components
- 🔄 Admin dashboard
- 🔄 Email templates
- 🔄 Blockchain integration
- 🔄 GSAP animations

### TODO
- ⏳ Complete all frontend pages
- ⏳ Implement email templates
- ⏳ Add GSAP animations
- ⏳ Comprehensive testing
- ⏳ Security audit
- ⏳ Performance optimization

## 📄 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.
