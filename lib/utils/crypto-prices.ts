/**
 * Crypto price fetching utilities using CoinGecko API
 * CoinGecko free tier: 10-50 calls/minute (no API key needed)
 */

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
  USD: "usd", // This is a special case - USD is always 1
};

/**
 * Fetch the current USD price of a cryptocurrency
 */
export async function getCryptoPriceUSD(symbol: string): Promise<number> {
  // USD is always 1
  if (symbol.toUpperCase() === "USD") {
    return 1;
  }

  const coinId = COINGECKO_IDS[symbol.toUpperCase()];
  if (!coinId) {
    throw new Error(`Unsupported coin: ${symbol}`);
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store", // Frontend fetch - don't cache at fetch level
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch price: ${response.statusText}`);
    }

    const data = await response.json();
    const price = data[coinId]?.usd;

    if (!price || typeof price !== "number") {
      throw new Error(`Invalid price data for ${symbol}`);
    }

    return price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Fetch prices for multiple cryptocurrencies at once
 */
export async function getCryptoPricesUSD(symbols: string[]): Promise<Record<string, number>> {
  // Filter out USD and handle it separately
  const cryptoSymbols = symbols.filter((s) => s.toUpperCase() !== "USD");
  const prices: Record<string, number> = {};

  // USD is always 1
  if (symbols.some((s) => s.toUpperCase() === "USD")) {
    prices.USD = 1;
  }

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
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store", // Frontend fetch - don't cache at fetch level
      }
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
}

/**
 * Calculate exchange rate between two coins based on USD values
 * This ensures that swapping from 10 USD to ETH gives you the ETH equivalent of 10 USD
 */
export async function calculateExchangeRate(
  fromCoin: string,
  toCoin: string
): Promise<number> {
  // If swapping the same coin, rate is 1
  if (fromCoin.toUpperCase() === toCoin.toUpperCase()) {
    return 1;
  }

  // Fetch prices for both coins
  const prices = await getCryptoPricesUSD([fromCoin, toCoin]);

  const fromPrice = prices[fromCoin.toUpperCase()];
  const toPrice = prices[toCoin.toUpperCase()];

  if (!fromPrice || !toPrice) {
    throw new Error(`Could not fetch prices for ${fromCoin} or ${toCoin}`);
  }

  // Exchange rate = (price of fromCoin in USD) / (price of toCoin in USD)
  // This means: 1 fromCoin = (fromPrice/toPrice) toCoin
  // So if you have X fromCoin worth Y USD, you get (Y/toPrice) toCoin
  const rate = fromPrice / toPrice;

  return rate;
}

/**
 * Calculate exchange rate with detailed price information (for swap page)
 * Returns the same structure as the Convex action for compatibility
 */
export async function calculateExchangeRateDetailed(
  fromCoin: string,
  toCoin: string
): Promise<{
  rate: number;
  fromPriceUSD: number;
  toPriceUSD: number;
  timestamp: number;
}> {
  // If swapping the same coin, rate is 1
  if (fromCoin.toUpperCase() === toCoin.toUpperCase()) {
    return {
      rate: 1,
      fromPriceUSD: 1,
      toPriceUSD: 1,
      timestamp: Date.now(),
    };
  }

  // Fetch prices for both coins
  const prices = await getCryptoPricesUSD([fromCoin, toCoin]);

  const fromPrice = prices[fromCoin.toUpperCase()];
  const toPrice = prices[toCoin.toUpperCase()];

  if (!fromPrice || !toPrice) {
    throw new Error(`Could not fetch prices for ${fromCoin} or ${toCoin}`);
  }

  // Exchange rate = (price of fromCoin in USD) / (price of toCoin in USD)
  const rate = fromPrice / toPrice;

  return {
    rate,
    fromPriceUSD: fromPrice,
    toPriceUSD: toPrice,
    timestamp: Date.now(),
  };
}

/**
 * Convert amount from one coin to another based on USD value
 * Example: convert 10 USD to ETH equivalent
 */
export async function convertAmount(
  amount: number,
  fromCoin: string,
  toCoin: string
): Promise<number> {
  const rate = await calculateExchangeRate(fromCoin, toCoin);
  return amount * rate;
}

/**
 * Get USD value of an amount of cryptocurrency
 */
export async function getUSDValue(amount: number, coin: string): Promise<number> {
  const price = await getCryptoPriceUSD(coin);
  return amount * price;
}



