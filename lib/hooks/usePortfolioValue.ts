import { useEffect, useState, useRef } from "react";
import { getCryptoPricesUSD } from "@/lib/utils/crypto-prices";

interface BalanceData {
  depositBalance?: Record<string, number> | any;
  stakedBalance?: Record<string, number> | any;
  availableBalance?: Record<string, number> | any;
}

// Cache for prices to reduce API calls
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_DURATION = 86400000; // 24 hours (1 day) cache

/**
 * Hook to calculate total portfolio value in USD
 * Fetches real-time prices and converts all coin balances to USD
 * Includes caching to prevent rate limiting
 */
export function usePortfolioValue(balance: BalanceData | undefined) {
  const [portfolioValue, setPortfolioValue] = useState<{
    totalAvailable: number;
    totalStaked: number;
    totalDeposited: number;
    isLoading: boolean;
    lastUpdated: number | null;
    error: string | null;
  }>({
    totalAvailable: 0,
    totalStaked: 0,
    totalDeposited: 0,
    isLoading: true,
    lastUpdated: null,
    error: null,
  });

  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!balance) {
      setPortfolioValue({
        totalAvailable: 0,
        totalStaked: 0,
        totalDeposited: 0,
        isLoading: false,
        lastUpdated: null,
        error: null,
      });
      return;
    }

    const calculatePortfolioValue = async () => {
      try {
        // Get all unique coin symbols from all balance types
        const allCoins = new Set<string>();
        
        const availableBalance = balance.availableBalance as Record<string, number> | undefined;
        const stakedBalance = balance.stakedBalance as Record<string, number> | undefined;
        const depositBalance = balance.depositBalance as Record<string, number> | undefined;

        if (availableBalance) {
          Object.keys(availableBalance).forEach(coin => allCoins.add(coin));
        }
        if (stakedBalance) {
          Object.keys(stakedBalance).forEach(coin => allCoins.add(coin));
        }
        if (depositBalance) {
          Object.keys(depositBalance).forEach(coin => allCoins.add(coin));
        }

        const coinSymbols = Array.from(allCoins);
        
        if (coinSymbols.length === 0) {
          setPortfolioValue({
            totalAvailable: 0,
            totalStaked: 0,
            totalDeposited: 0,
            isLoading: false,
            lastUpdated: Date.now(),
            error: null,
          });
          return;
        }

        // Check cache first
        const now = Date.now();
        const prices: Record<string, number> = {};
        const coinsToFetch: string[] = [];

        for (const coin of coinSymbols) {
          const cacheKey = coin.toUpperCase();
          const cached = priceCache.get(cacheKey);
          
          if (cached && (now - cached.timestamp) < CACHE_DURATION) {
            // Use cached price
            prices[cacheKey] = cached.price;
          } else {
            // Need to fetch this coin
            coinsToFetch.push(coin);
          }
        }

        // Fetch prices only for coins not in cache (frontend fetch)
        if (coinsToFetch.length > 0) {
          try {
            const fetchedPrices = await getCryptoPricesUSD(coinsToFetch);
            
            // Update cache and prices object
            for (const [coin, price] of Object.entries(fetchedPrices)) {
              prices[coin.toUpperCase()] = price;
              priceCache.set(coin.toUpperCase(), {
                price,
                timestamp: now,
              });
            }
          } catch (error) {
            console.error("Error fetching prices:", error);
            // Use cached prices if available, even if expired
            for (const coin of coinsToFetch) {
              const cacheKey = coin.toUpperCase();
              const cached = priceCache.get(cacheKey);
              if (cached) {
                prices[cacheKey] = cached.price;
              } else {
                // If no cache, set price to 0 to avoid calculation errors
                prices[cacheKey] = 0;
              }
            }
            // Don't update error here - we'll calculate with cached/zero prices
          }
        }

        // Calculate USD value for each balance type
        let totalAvailableUSD = 0;
        let totalStakedUSD = 0;
        let totalDepositedUSD = 0;

        // Calculate available balance value
        if (availableBalance) {
          for (const [coin, amount] of Object.entries(availableBalance)) {
            const price = prices[coin.toUpperCase()] || 0;
            totalAvailableUSD += amount * price;
          }
        }

        // Calculate staked balance value
        if (stakedBalance) {
          for (const [coin, amount] of Object.entries(stakedBalance)) {
            const price = prices[coin.toUpperCase()] || 0;
            totalStakedUSD += amount * price;
          }
        }

        // Calculate deposited balance value
        if (depositBalance) {
          for (const [coin, amount] of Object.entries(depositBalance)) {
            const price = prices[coin.toUpperCase()] || 0;
            totalDepositedUSD += amount * price;
          }
        }

        setPortfolioValue({
          totalAvailable: totalAvailableUSD,
          totalStaked: totalStakedUSD,
          totalDeposited: totalDepositedUSD,
          isLoading: false,
          lastUpdated: Date.now(),
          error: null,
        });
      } catch (error) {
        console.error("Error calculating portfolio value:", error);
        setPortfolioValue(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to calculate portfolio value",
        }));
      }
    };

    calculatePortfolioValue();

    // Update prices once per day (24 hours) to prevent rate limiting
    updateIntervalRef.current = setInterval(calculatePortfolioValue, 86400000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [balance]);

  return portfolioValue;
}

