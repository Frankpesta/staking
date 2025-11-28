import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface BalanceData {
  depositBalance?: Record<string, number> | any;
  stakedBalance?: Record<string, number> | any;
  availableBalance?: Record<string, number> | any;
}

/**
 * Hook to calculate total portfolio value in USD
 * Fetches real-time prices and converts all coin balances to USD
 */
export function usePortfolioValue(balance: BalanceData | undefined) {
  const [portfolioValue, setPortfolioValue] = useState<{
    totalAvailable: number;
    totalStaked: number;
    totalDeposited: number;
    isLoading: boolean;
    lastUpdated: number | null;
  }>({
    totalAvailable: 0,
    totalStaked: 0,
    totalDeposited: 0,
    isLoading: true,
    lastUpdated: null,
  });

  const getCryptoPrices = useAction(api.actions.crypto_prices.getCryptoPricesUSD);

  useEffect(() => {
    if (!balance) {
      setPortfolioValue({
        totalAvailable: 0,
        totalStaked: 0,
        totalDeposited: 0,
        isLoading: false,
        lastUpdated: null,
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
          });
          return;
        }

        // Fetch prices for all coins
        const prices = await getCryptoPrices({ symbols: coinSymbols });

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
        });
      } catch (error) {
        console.error("Error calculating portfolio value:", error);
        setPortfolioValue(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    calculatePortfolioValue();

    // Update prices every 30 seconds
    const interval = setInterval(calculatePortfolioValue, 30000);

    return () => clearInterval(interval);
  }, [balance, getCryptoPrices]);

  return portfolioValue;
}

