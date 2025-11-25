import { api } from "@/convex/_generated/api";

/**
 * Safe API accessor for Convex functions
 * This helps with TypeScript errors before Convex generates types
 */
export const convexApi = api as any as {
  users?: {
    login?: any;
    createUser?: any;
    getCurrentUser?: any;
    verifyEmail?: any;
    requestPasswordReset?: any;
    resetPassword?: any;
  };
  balances?: {
    getUserBalance?: any;
    updateBalance?: any;
  };
  transactions?: {
    createDeposit?: any;
    createWithdrawal?: any;
    getUserTransactions?: any;
    getPendingTransactions?: any;
    approveTransaction?: any;
    rejectTransaction?: any;
    completeTransaction?: any;
  };
  staking?: {
    createStakingPool?: any;
    getUserStakingPools?: any;
    getAllStakingPools?: any;
    processMaturedPools?: any;
  };
  swaps?: {
    createSwap?: any;
    getExchangeRate?: any;
    approveSwap?: any;
  };
  kyc?: {
    uploadKYCDocument?: any;
    getUserKYCDocuments?: any;
    getPendingKYCDocuments?: any;
    approveKYCDocument?: any;
    rejectKYCDocument?: any;
  };
  support?: {
    createTicket?: any;
    getUserTickets?: any;
    getAllTickets?: any;
    respondToTicket?: any;
    updateTicket?: any;
    updateTicketStatus?: any;
  };
  activities?: {
    getUserActivities?: any;
    getRecentActivities?: any;
  };
  platformWallets?: {
    createPlatformWallet?: any;
    getPlatformWallet?: any;
    listPlatformWallets?: any;
    updatePlatformWallet?: any;
  };
  appSettings?: {
    getAppSettings?: any;
    updateAppSettings?: any;
    initializeSettings?: any;
  };
  files?: {
    generateUploadUrl?: any;
    getFileUrl?: any;
  };
  actions?: {
    users?: {
      createUser?: any;
      login?: any;
      resetPassword?: any;
    };
    auth?: {
      hashPassword?: any;
      verifyPassword?: any;
      generateToken?: any;
      verifyToken?: any;
      generateRandomToken?: any;
    };
    blockchain?: {
      processWithdrawal?: any;
    };
  };
};

