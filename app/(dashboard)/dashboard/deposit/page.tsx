"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDepositDetection } from "@/lib/hooks/useDepositDetection";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CryptoIcon } from "@/components/shared/CryptoIcon";
import { Copy, Check, ExternalLink, Loader2, Wallet, ArrowRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { DEFAULT_COINS } from "@/lib/constants";
import { convexApi } from "@/lib/utils/convex-api";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Get unique coins (group by symbol, prefer native coins)
const getUniqueCoins = () => {
  const coinMap = new Map<string, (typeof DEFAULT_COINS)[number]>();
  
  DEFAULT_COINS.forEach((coin) => {
    const key = coin.symbol;
    if (!coinMap.has(key) || coin.isNative) {
      coinMap.set(key, coin);
    }
  });
  
  return Array.from(coinMap.values()).filter(coin => coin.depositEnabled);
};

const AVAILABLE_COINS = getUniqueCoins();

export default function DepositPage() {
  const { user } = useAuth();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [amountConfirmed, setAmountConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoDetectedTx, setAutoDetectedTx] = useState<string | null>(null);
  const [depositSubmitted, setDepositSubmitted] = useState(false);
  
  const createDepositMutation = useMutation(
    convexApi.transactions?.createDeposit as any
  );
  const platformWallet = useQuery(
    api.platformWallets.getPlatformWallet,
    selectedCoin ? { coin: selectedCoin } : "skip"
  );

  const selectedCoinConfig = AVAILABLE_COINS.find((c) => c.symbol === selectedCoin);

  // Auto-detect deposits when wallet is connected
  const { isMonitoring, detectedTxHash } = useDepositDetection({
    platformWalletAddress: platformWallet?.address || "",
    coin: selectedCoin,
    chainId: selectedCoinConfig?.chainId || 1,
    onDepositDetected: (hash, detectedAmount) => {
      setAutoDetectedTx(hash);
      // Use user-entered amount if available, otherwise use detected amount
      const depositAmount = amount ? parseFloat(amount) : parseFloat(detectedAmount);
      // Auto-submit deposit request if amount is set
      if (user?._id && amount) {
        createDepositMutation({
          userId: user._id,
          coin: selectedCoin,
          amount: depositAmount,
          txHash: hash,
          chainId: selectedCoinConfig?.chainId,
        }).then(() => {
          setDepositSubmitted(true);
          alert(`Deposit detected! ${depositAmount} ${selectedCoin} will be reviewed by admin.`);
        }).catch((err) => {
          console.error("Failed to create deposit:", err);
        });
      }
    },
  });

  const handleCopyAddress = () => {
    if (platformWallet?.address) {
      navigator.clipboard.writeText(platformWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCoinSelect = (coinSymbol: string) => {
    setSelectedCoin(coinSymbol);
    setAmount("");
    setAmountConfirmed(false);
    setAutoDetectedTx(null);
    setDepositSubmitted(false);
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleSubmitDeposit = async () => {
    if (!user?._id || !selectedCoin || !amount) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const coinConfig = AVAILABLE_COINS.find((c) => c.symbol === selectedCoin);
    if (coinConfig?.minDeposit && numAmount < coinConfig.minDeposit) {
      alert(`Minimum deposit is ${coinConfig.minDeposit} ${selectedCoin}`);
      return;
    }

    try {
      await createDepositMutation({
        userId: user._id,
        coin: selectedCoin,
        amount: numAmount,
        txHash: autoDetectedTx || undefined,
        chainId: coinConfig?.chainId,
      });
      setDepositSubmitted(true);
      alert("Deposit request submitted! Admin will review and approve it.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit deposit");
    }
  };

  const handleConnectWallet = async () => {
    // Prefer WalletConnect connector
    const walletConnectConnector = connectors.find(c => c.name.toLowerCase().includes('walletconnect'));
    const connector = walletConnectConnector || connectors[0];
    if (connector) {
      try {
        await connect({ connector });
      } catch (error) {
        console.error(`Failed to connect to ${connector.name}:`, error);
        alert(`Failed to connect to ${connector.name}. Please make sure the wallet extension is installed and unlocked.`);
      }
    }
  };

  // Step 1: Coin Selection
  if (!selectedCoin) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Deposit Funds</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Select a cryptocurrency to deposit
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {AVAILABLE_COINS.map((coin) => (
            <Card
              key={`${coin.symbol}-${coin.chainId}`}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2",
                selectedCoin === coin.symbol
                  ? "border-primary shadow-lg scale-105"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => handleCoinSelect(coin.symbol)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
                <CryptoIcon symbol={coin.symbol} size={64} />
                <div className="text-center">
                  <p className="font-semibold text-lg">{coin.symbol}</p>
                  <p className="text-xs text-muted-foreground">{coin.name}</p>
                </div>
                {coin.minDeposit && (
                  <p className="text-xs text-muted-foreground">
                    Min: {coin.minDeposit} {coin.symbol}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Amount Input
  // Only show amount input if amount hasn't been confirmed yet
  if (!amountConfirmed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedCoin("");
              setAmount("");
            }}
            className="text-muted-foreground"
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Enter Deposit Amount</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              How much {selectedCoinConfig?.symbol} would you like to deposit?
            </p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CryptoIcon symbol={selectedCoinConfig?.symbol || ""} size={80} />
            </div>
            <CardTitle className="text-2xl">Deposit Amount</CardTitle>
            <CardDescription>
              Enter the amount of <span className="font-semibold">{selectedCoinConfig?.symbol}</span> you want to deposit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({selectedCoinConfig?.symbol})</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                onKeyDown={(e) => {
                  // Allow Enter key to submit
                  if (e.key === "Enter" && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
                    e.preventDefault();
                    const numAmount = parseFloat(amount);
                    if (selectedCoinConfig?.minDeposit && numAmount < selectedCoinConfig.minDeposit) {
                      alert(`Minimum deposit is ${selectedCoinConfig.minDeposit} ${selectedCoinConfig.symbol}`);
                      return;
                    }
                    setAmountConfirmed(true);
                  }
                }}
                className="text-2xl text-center h-16"
                autoFocus
              />
              {selectedCoinConfig?.minDeposit && (
                <p className="text-xs text-muted-foreground text-center">
                  Minimum deposit: {selectedCoinConfig.minDeposit} {selectedCoinConfig.symbol}
                </p>
              )}
            </div>

            <Button
              onClick={() => {
                const numAmount = parseFloat(amount);
                if (isNaN(numAmount) || numAmount <= 0) {
                  alert("Please enter a valid amount");
                  return;
                }
                if (selectedCoinConfig?.minDeposit && numAmount < selectedCoinConfig.minDeposit) {
                  alert(`Minimum deposit is ${selectedCoinConfig.minDeposit} ${selectedCoinConfig.symbol}`);
                  return;
                }
                // Confirm the amount and proceed to next step
                setAmountConfirmed(true);
              }}
              className="w-full"
              size="lg"
              disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Wallet Connect Prompt
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setAmount("");
              setAmountConfirmed(false);
            }}
            className="text-muted-foreground"
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Connect Your Wallet</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Connect your wallet to proceed with {amount} {selectedCoinConfig?.symbol} deposit
            </p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CryptoIcon symbol={selectedCoinConfig?.symbol || ""} size={80} />
            </div>
            <CardTitle className="text-2xl">Connect Wallet to Continue</CardTitle>
            <CardDescription>
              You&rsquo;re depositing <span className="font-semibold">{amount} {selectedCoinConfig?.symbol}</span>. 
              Please connect your wallet to view the deposit address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  variant="outline"
                  size="lg"
                  className="w-full justify-start h-auto py-4"
                  onClick={async () => {
                    try {
                      await connect({ connector });
                    } catch (error) {
                      console.error(`Failed to connect to ${connector.name}:`, error);
                      alert(`Failed to connect to ${connector.name}. Please make sure the wallet extension is installed and unlocked.`);
                    }
                  }}
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{connector.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {connector.name.toLowerCase().includes('walletconnect') 
                        ? 'Connect via WalletConnect' 
                        : 'Connect your wallet'}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              ))}
            </div>

            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
              <p className="font-medium mb-2">Why connect your wallet?</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Verify your wallet address</li>
                <li>Monitor deposit transactions</li>
                <li>Get real-time deposit confirmations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 4: Deposit Address Display
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => {
            setAmount("");
            setAmountConfirmed(false);
            setAutoDetectedTx(null);
            setDepositSubmitted(false);
          }}
          className="text-muted-foreground"
        >
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Deposit {selectedCoinConfig?.symbol}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Send {amount} {selectedCoinConfig?.symbol} to the address below
          </p>
        </div>
      </div>

      {isMonitoring && (
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm">
                Monitoring transaction... {detectedTxHash && `(${detectedTxHash.slice(0, 10)}...)`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {autoDetectedTx && !depositSubmitted && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-green-900 dark:text-green-100">
                ✓ Transaction detected! Hash: {autoDetectedTx.slice(0, 20)}...
              </p>
              <Button
                onClick={handleSubmitDeposit}
                className="w-full mt-2"
              >
                Submit Deposit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {depositSubmitted && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <p className="text-sm text-green-900 dark:text-green-100">
              ✓ Deposit request submitted! Admin will review and approve it.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 max-w-5xl">
        {/* Selected Coin Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CryptoIcon symbol={selectedCoinConfig?.symbol || ""} size={48} />
              <div>
                <CardTitle>{selectedCoinConfig?.symbol}</CardTitle>
                <CardDescription>{selectedCoinConfig?.name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Network</p>
              <p className="text-sm text-muted-foreground">
                {(() => {
                  const chainId = selectedCoinConfig?.chainId;
                  if (chainId === 1) return "Ethereum Mainnet";
                  if (chainId === 137) return "Polygon";
                  if (chainId === 56) return "BNB Smart Chain";
                  if (chainId === 43114) return "Avalanche C-Chain";
                  if (chainId === 42161) return "Arbitrum One";
                  if (chainId === 10) return "Optimism";
                  if (chainId === 8453) return "Base";
                  return "Unknown Network";
                })()}
              </p>
            </div>
            {selectedCoinConfig?.minDeposit && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Minimum Deposit</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCoinConfig.minDeposit} {selectedCoinConfig.symbol}
                </p>
              </div>
            )}
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
              <p className="font-medium mb-1">Important:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Only send {selectedCoinConfig?.symbol} to this address</li>
                <li>Double-check the address before sending</li>
                <li>Do not send other cryptocurrencies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Address Display */}
        <Card>
          <CardHeader>
            <CardTitle>Deposit Address</CardTitle>
            <CardDescription>
              Scan QR code or copy the address below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformWallet?.address ? (
              <>
                <div className="flex items-center justify-center rounded-lg border bg-muted p-3 sm:p-4">
                  <QRCodeSVG value={platformWallet.address} size={160} className="sm:w-[200px] sm:h-[200px]" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
                    <code className="flex-1 break-all text-sm">
                      {platformWallet.address}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyAddress}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-600 text-center">Address copied!</p>
                  )}
                </div>
                {platformWallet.chainId && (
                  <a
                    href={`https://${
                      platformWallet.chainId === 1 ? "etherscan.io" :
                      platformWallet.chainId === 137 ? "polygonscan.com" :
                      platformWallet.chainId === 56 ? "bscscan.com" :
                      platformWallet.chainId === 42161 ? "arbiscan.io" :
                      platformWallet.chainId === 10 ? "optimistic.etherscan.io" :
                      platformWallet.chainId === 43114 ? "snowtrace.io" :
                      platformWallet.chainId === 8453 ? "basescan.org" : "etherscan.io"
                    }/address/${platformWallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline justify-center"
                  >
                    View on explorer <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {!depositSubmitted && (
                  <Button
                    onClick={handleSubmitDeposit}
                    className="w-full mt-4"
                    size="lg"
                  >
                    Submit Deposit Request ({amount} {selectedCoinConfig?.symbol})
                  </Button>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
