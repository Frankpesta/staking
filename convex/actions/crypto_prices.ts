"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

// CoinGecko API coin IDs mapping
const COINGECKO_IDS: Record<string, string> = {
  ETH: "ethereum",
  BTC: "bitcoin",
  MATIC: "matic-network",
  BNB: "binancecoin",
  AVAX: "avalanche-2",
  USDT: "tether",
  USDC: "usd-coin",
  DAI: "dai",
  USD: "usd", // Special case - USD is always 1
};

/**
 * Fetch the current USD price of a cryptocurrency
 */
export const getCryptoPriceUSD = action({
  args: {
    symbol: v.string(),
  },
  handler: async (ctx, args) => {
    // USD is always 1
    if (args.symbol.toUpperCase() === "USD") {
      return 1;
    }

    const coinId = COINGECKO_IDS[args.symbol.toUpperCase()];
    if (!coinId) {
      throw new Error(`Unsupported coin: ${args.symbol}`);
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch price: ${response.statusText}`);
      }

      const data = await response.json();
      const price = data[coinId]?.usd;

      if (!price || typeof price !== "number") {
        throw new Error(`Invalid price data for ${args.symbol}`);
      }

      return price;
    } catch (error) {
      console.error(`Error fetching price for ${args.symbol}:`, error);
      throw error;
    }
  },
});

/**
 * Fetch prices for multiple cryptocurrencies at once
 */
export const getCryptoPricesUSD = action({
  args: {
    symbols: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const prices: Record<string, number> = {};

    // USD is always 1
    if (args.symbols.some((s) => s.toUpperCase() === "USD")) {
      prices.USD = 1;
    }

    // Filter out USD
    const cryptoSymbols = args.symbols.filter((s) => s.toUpperCase() !== "USD");

    if (cryptoSymbols.length === 0) {
      return prices;
    }

    const coinIds = cryptoSymbols
      .map((symbol) => COINGECKO_IDS[symbol.toUpperCase()])
      .filter(Boolean);

    if (coinIds.length === 0) {
      return prices;
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.statusText}`);
      }

      const data = await response.json();

      // Map back to symbols
      for (const symbol of cryptoSymbols) {
        const coinId = COINGECKO_IDS[symbol.toUpperCase()];
        if (coinId && data[coinId]?.usd) {
          prices[symbol.toUpperCase()] = data[coinId].usd;
        }
      }

      return prices;
    } catch (error) {
      console.error("Error fetching prices:", error);
      throw error;
    }
  },
});

/**
 * Calculate exchange rate between two coins based on USD values
 * This ensures that swapping from 10 USD to ETH gives you the ETH equivalent of 10 USD
 */
export const calculateExchangeRate = action({
  args: {
    fromCoin: v.string(),
    toCoin: v.string(),
  },
  handler: async (ctx, args) => {
    // If swapping the same coin, rate is 1
    if (args.fromCoin.toUpperCase() === args.toCoin.toUpperCase()) {
      return {
        rate: 1,
        fromPriceUSD: 1,
        toPriceUSD: 1,
        timestamp: Date.now(),
      };
    }

    const prices: Record<string, number> = {};
    const symbols = [args.fromCoin, args.toCoin];

    // Handle USD separately
    if (symbols.some((s) => s.toUpperCase() === "USD")) {
      prices.USD = 1;
    }

    // Filter out USD and fetch prices for crypto coins
    const cryptoSymbols = symbols.filter((s) => s.toUpperCase() !== "USD");

    if (cryptoSymbols.length > 0) {
      const coinIds = cryptoSymbols
        .map((symbol) => COINGECKO_IDS[symbol.toUpperCase()])
        .filter(Boolean);

      if (coinIds.length > 0) {
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch prices: ${response.statusText}`);
          }

          const data = await response.json();

          // Map back to symbols
          for (const symbol of cryptoSymbols) {
            const coinId = COINGECKO_IDS[symbol.toUpperCase()];
            if (coinId && data[coinId]?.usd) {
              prices[symbol.toUpperCase()] = data[coinId].usd;
            }
          }
        } catch (error) {
          console.error("Error fetching prices:", error);
          throw error;
        }
      }
    }

    const fromPrice = prices[args.fromCoin.toUpperCase()];
    const toPrice = prices[args.toCoin.toUpperCase()];

    if (fromPrice === undefined || toPrice === undefined) {
      throw new Error(`Could not fetch prices for ${args.fromCoin} or ${args.toCoin}`);
    }

    // Exchange rate = (price of fromCoin in USD) / (price of toCoin in USD)
    // This means: 1 fromCoin = (fromPrice/toPrice) toCoin
    // So if you have X fromCoin worth Y USD, you get (Y/toPrice) toCoin
    // Example: If swapping 10 USD to ETH, and ETH is $3000:
    // - fromPrice = 1 (USD), toPrice = 3000 (ETH)
    // - rate = 1/3000 = 0.000333
    // - 10 USD * 0.000333 = 0.00333 ETH (correct!)
    const rate = fromPrice / toPrice;

    return {
      rate,
      fromPriceUSD: fromPrice,
      toPriceUSD: toPrice,
      timestamp: Date.now(),
    };
  },
});







