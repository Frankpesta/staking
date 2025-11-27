/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_auth from "../actions/auth.js";
import type * as actions_blockchain from "../actions/blockchain.js";
import type * as actions_crypto_prices from "../actions/crypto_prices.js";
import type * as actions_email from "../actions/email.js";
import type * as actions_users from "../actions/users.js";
import type * as activities from "../activities.js";
import type * as appSettings from "../appSettings.js";
import type * as balances from "../balances.js";
import type * as cron from "../cron.js";
import type * as files from "../files.js";
import type * as kyc from "../kyc.js";
import type * as platformWallets from "../platformWallets.js";
import type * as staking from "../staking.js";
import type * as support from "../support.js";
import type * as swaps from "../swaps.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/auth": typeof actions_auth;
  "actions/blockchain": typeof actions_blockchain;
  "actions/crypto_prices": typeof actions_crypto_prices;
  "actions/email": typeof actions_email;
  "actions/users": typeof actions_users;
  activities: typeof activities;
  appSettings: typeof appSettings;
  balances: typeof balances;
  cron: typeof cron;
  files: typeof files;
  kyc: typeof kyc;
  platformWallets: typeof platformWallets;
  staking: typeof staking;
  support: typeof support;
  swaps: typeof swaps;
  transactions: typeof transactions;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
