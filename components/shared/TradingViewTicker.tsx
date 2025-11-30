"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface TradingViewTickerProps {
  className?: string;
}

export function TradingViewTicker({ className = "" }: TradingViewTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // Remove existing script if present
    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    // Clear container
    containerRef.current.innerHTML = "";

    // Create container div for TradingView widget
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetContainer);

    // Create configuration script
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "BINANCE:BTCUSDT",
          title: "Bitcoin",
        },
        {
          proName: "BINANCE:ETHUSDT",
          title: "Ethereum",
        },
        {
          proName: "BINANCE:BNBUSDT",
          title: "BNB",
        },
        {
          proName: "BINANCE:ADAUSDT",
          title: "Cardano",
        },
        {
          proName: "BINANCE:SOLUSDT",
          title: "Solana",
        },
        {
          proName: "BINANCE:XRPUSDT",
          title: "XRP",
        },
        {
          proName: "BINANCE:DOTUSDT",
          title: "Polkadot",
        },
        {
          proName: "BINANCE:DOGEUSDT",
          title: "Dogecoin",
        },
        {
          proName: "BINANCE:MATICUSDT",
          title: "Polygon",
        },
        {
          proName: "BINANCE:AVAXUSDT",
          title: "Avalanche",
        },
        {
          proName: "BINANCE:LINKUSDT",
          title: "Chainlink",
        },
        {
          proName: "BINANCE:UNIUSDT",
          title: "Uniswap",
        },
        {
          proName: "BINANCE:ATOMUSDT",
          title: "Cosmos",
        },
        {
          proName: "BINANCE:LTCUSDT",
          title: "Litecoin",
        },
        {
          proName: "BINANCE:ETCUSDT",
          title: "Ethereum Classic",
        },
      ],
      showSymbolLogo: true,
      colorTheme: resolvedTheme === "dark" ? "dark" : "light",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });
    widgetContainer.appendChild(configScript);

    // Create and append the TradingView widget script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    widgetContainer.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [mounted, resolvedTheme]);

  if (!mounted) {
    return (
      <div
        className={`h-[60px] rounded-lg bg-muted/50 animate-pulse ${className}`}
      />
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={containerRef}
        className="tradingview-widget-container h-[60px] w-full rounded-lg overflow-hidden border border-border/50 bg-background/95 dark:bg-background/95 backdrop-blur-sm shadow-sm"
        style={{ minHeight: "60px" }}
      />
      <style jsx global>{`
        .tradingview-widget-container {
          position: relative;
        }
        .tradingview-widget-container iframe {
          border-radius: 0.5rem;
          border: none !important;
        }
      `}</style>
    </div>
  );
}

