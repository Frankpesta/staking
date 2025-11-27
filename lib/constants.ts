/**
 * Supported blockchain networks configuration
 */
export const SUPPORTED_CHAINS = {
  ethereum: {
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL_MAINNET || "",
    explorer: "https://etherscan.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  polygon: {
    id: 137,
    name: "Polygon",
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL_POLYGON || "",
    explorer: "https://polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  bsc: {
    id: 56,
    name: "BNB Smart Chain",
    rpcUrl: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum One",
    rpcUrl: process.env.ARBITRUM_RPC_URL || "",
    explorer: "https://arbiscan.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  optimism: {
    id: 10,
    name: "Optimism",
    rpcUrl: process.env.OPTIMISM_RPC_URL || "",
    explorer: "https://optimistic.etherscan.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  avalanche: {
    id: 43114,
    name: "Avalanche C-Chain",
    rpcUrl: process.env.AVALANCHE_RPC_URL || "",
    explorer: "https://snowtrace.io",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
  },
  base: {
    id: 8453,
    name: "Base",
    rpcUrl: process.env.BASE_RPC_URL || "",
    explorer: "https://basescan.org",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
} as const;

/**
 * Default coin configurations
 * These can be overridden by admin settings
 */
export const DEFAULT_COINS = [
  // Native coins
  {
    symbol: "ETH",
    name: "Ethereum",
    chainId: 1,
    isNative: true,
    contractAddress: undefined,
    decimals: 18,
    minDeposit: 0.001,
    minWithdrawal: 0.001,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    chainId: 137,
    isNative: true,
    contractAddress: undefined,
    decimals: 18,
    minDeposit: 1,
    minWithdrawal: 1,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  {
    symbol: "BNB",
    name: "BNB",
    chainId: 56,
    isNative: true,
    contractAddress: undefined,
    decimals: 18,
    minDeposit: 0.01,
    minWithdrawal: 0.01,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    chainId: 43114,
    isNative: true,
    contractAddress: undefined,
    decimals: 18,
    minDeposit: 0.1,
    minWithdrawal: 0.1,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  // USD (fiat currency)
  {
    symbol: "USD",
    name: "US Dollar",
    chainId: 1,
    isNative: false,
    contractAddress: undefined,
    decimals: 2,
    minDeposit: 1,
    minWithdrawal: 1,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  // Stablecoins
  {
    symbol: "USDT",
    name: "Tether USD",
    chainId: 1,
    isNative: false,
    contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    minDeposit: 10,
    minWithdrawal: 10,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    chainId: 1,
    isNative: false,
    contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0c3606eB48",
    decimals: 6,
    minDeposit: 10,
    minWithdrawal: 10,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    chainId: 1,
    isNative: false,
    contractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    minDeposit: 10,
    minWithdrawal: 10,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  // Polygon USDT
  {
    symbol: "USDT",
    name: "Tether USD",
    chainId: 137,
    isNative: false,
    contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    minDeposit: 10,
    minWithdrawal: 10,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
  // BSC USDT
  {
    symbol: "USDT",
    name: "Tether USD",
    chainId: 56,
    isNative: false,
    contractAddress: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18,
    minDeposit: 10,
    minWithdrawal: 10,
    depositEnabled: true,
    withdrawalEnabled: true,
  },
] as const;

/**
 * Default staking options
 */
export const DEFAULT_STAKING_OPTIONS = [
  { duration: 30, roiPercentage: 5 },
  { duration: 60, roiPercentage: 12 },
  { duration: 90, roiPercentage: 20 },
  { duration: 180, roiPercentage: 45 },
  { duration: 365, roiPercentage: 100 },
] as const;

/**
 * Transaction statuses
 */
export const TRANSACTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

/**
 * Transaction types
 */
export const TRANSACTION_TYPE = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  STAKE: "stake",
  UNSTAKE: "unstake",
  SWAP: "swap",
} as const;

/**
 * KYC document types
 */
export const KYC_DOCUMENT_TYPES = {
  ID_FRONT: "id_front",
  ID_BACK: "id_back",
  SELFIE: "selfie",
  PROOF_OF_ADDRESS: "proof_of_address",
} as const;

/**
 * KYC statuses
 */
export const KYC_STATUS = {
  NOT_STARTED: "not_started",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

/**
 * User roles
 */
export const USER_ROLES = {
  USER: "user",
  SUPER_ADMIN: "super_admin",
} as const;

/**
 * Support ticket statuses
 */
export const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

/**
 * Support ticket priorities
 */
export const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

/**
 * Staking pool statuses
 */
export const STAKING_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

/**
 * File upload constraints
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "application/pdf"],
} as const;

/**
 * JWT token expiration times
 */
export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Withdrawal limits
 */
export const WITHDRAWAL_LIMITS = {
  DAILY_MAX: 100000, // $100k equivalent
  WEEKLY_MAX: 500000, // $500k equivalent
  COOLDOWN_HOURS: 24, // 24 hours between requests
} as const;

