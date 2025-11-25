import { z } from "zod";
import { isAddress } from "viem";

export const depositSchema = z.object({
  coin: z.string().min(1, "Coin is required"),
  amount: z.number().positive("Amount must be positive"),
  txHash: z.string().optional(),
});

export const withdrawalSchema = z.object({
  coin: z.string().min(1, "Coin is required"),
  amount: z.number().positive("Amount must be positive"),
  walletAddress: z
    .string()
    .min(1, "Wallet address is required")
    .refine((val) => isAddress(val), {
      message: "Invalid wallet address format",
    }),
});

export const stakeSchema = z.object({
  coin: z.string().min(1, "Coin is required"),
  amount: z.number().positive("Amount must be positive"),
  duration: z.number().refine((val) => [30, 60, 90, 180, 365].includes(val), {
    message: "Invalid staking duration",
  }),
});

export const swapSchema = z.object({
  fromCoin: z.string().min(1, "From coin is required"),
  toCoin: z.string().min(1, "To coin is required"),
  amount: z.number().positive("Amount must be positive"),
});

export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
export type StakeInput = z.infer<typeof stakeSchema>;
export type SwapInput = z.infer<typeof swapSchema>;

