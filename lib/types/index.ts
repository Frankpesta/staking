import { z } from "zod";

/**
 * User types
 */
export type UserRole = "user" | "super_admin";
export type KYCStatus = "not_started" | "pending" | "approved" | "rejected";
export type TransactionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "failed";
export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "stake"
  | "unstake"
  | "swap";
export type StakingStatus = "active" | "completed" | "cancelled";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";
export type KYCDocumentType =
  | "id_front"
  | "id_back"
  | "selfie"
  | "proof_of_address";

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  kycStatus: KYCStatus;
  kycDocuments: string[];
  twoFactorEnabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Balance {
  _id: string;
  userId: string;
  depositBalance: Record<string, number>;
  stakedBalance: Record<string, number>;
  availableBalance: Record<string, number>;
  updatedAt: number;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  coin: string;
  amount: number;
  status: TransactionStatus;
  walletAddress?: string;
  txHash?: string;
  chainId?: number;
  fromAddress?: string;
  toAddress?: string;
  adminNote?: string;
  requestedAt: number;
  processedAt?: number;
  processedBy?: string;
  metadata?: Record<string, unknown>;
}

export interface StakingPool {
  _id: string;
  userId: string;
  coin: string;
  amount: number;
  duration: number;
  roiPercentage: number;
  startDate: number;
  endDate: number;
  status: StakingStatus;
  maturedAmount?: number;
  createdAt: number;
  completedAt?: number;
}

export interface KYCDocument {
  _id: string;
  userId: string;
  documentType: KYCDocumentType;
  fileId: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface SupportTicket {
  _id: string;
  userId: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  responses: Array<{
    adminId: string;
    message: string;
    timestamp: number;
    attachments?: string[];
  }>;
  createdAt: number;
  updatedAt: number;
}

export interface Activity {
  _id: string;
  userId: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export interface PlatformWallet {
  _id: string;
  coin: string;
  chainId: number;
  address: string;
  privateKeyEnvVar: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CoinConfig {
  symbol: string;
  name: string;
  chainId: number;
  isNative: boolean;
  contractAddress?: string;
  decimals: number;
  minDeposit: number;
  minWithdrawal: number;
  depositEnabled: boolean;
  withdrawalEnabled: boolean;
}

export interface StakingOption {
  duration: number;
  roiPercentage: number;
}

export interface AppSettings {
  _id: string;
  platformPaused: boolean;
  supportedCoins: CoinConfig[];
  stakingOptions: StakingOption[];
  maintenanceMode: boolean;
  announcementMessage?: string;
}

