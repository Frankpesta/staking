# Hot Wallet Security Analysis & Recommendations

## Current Setup

### How Hot Wallets Work Now

1. **Platform Wallet Storage** (`convex/platformWallets.ts`):
   - Stores wallet **address** and **coin/chain** information
   - Stores a **reference** to an environment variable name (e.g., `WALLET_PRIVATE_KEY_ETH`)
   - **Does NOT store the actual private key** (good!)

2. **Private Key Storage**:
   - Private keys are stored in **server-side environment variables**
   - Only accessible in Convex actions (server-side code)
   - Example: `WALLET_PRIVATE_KEY_ETH=0x1234...`

3. **How Withdrawals Work** (`convex/actions/blockchain.ts`):
   ```
   User requests withdrawal 
   → Admin approves transaction
   → processWithdrawal() action:
      → Reads private key from env var
      → Creates account from private key
      → Signs and sends transaction
      → Updates transaction status
   ```

### Why Private Keys Are Currently Needed

Private keys are needed because:
- **Withdrawals require signing transactions** from the platform wallet
- The platform wallet must **send funds** to user addresses
- To sign a transaction, you need the private key to prove ownership

**Current Flow:**
```
Platform Wallet (has private key) 
  → Signs withdrawal transaction 
  → Sends funds to User Wallet
```

## The Problem with Private Keys

### Security Risks:
1. **Single Point of Failure**: If the private key is compromised, all funds are at risk
2. **Environment Variable Exposure**: Keys in env vars can be leaked through:
   - Code repositories (if accidentally committed)
   - Server logs
   - Environment variable dumps
   - Server breaches
3. **No Multi-Signature Protection**: One key controls everything
4. **Compliance Issues**: Many jurisdictions require better security for custodial wallets

## Solutions: Eliminating Private Keys

### Option 1: Hardware Security Module (HSM) ⭐ RECOMMENDED

**How it works:**
- Private keys are stored in a hardware device (never leaves the device)
- Transactions are signed inside the HSM
- Keys cannot be extracted

**Implementation:**
```typescript
// Instead of:
const account = privateKeyToAccount(privateKeyHex);

// Use HSM service:
import { HSMClient } from '@your-hsm-provider';

const hsmClient = new HSMClient({
  keyId: 'platform-wallet-eth',
  // No private key needed!
});

const txHash = await hsmClient.signAndSend({
  to: userAddress,
  value: amount,
});
```

**Providers:**
- AWS CloudHSM
- Azure Key Vault (with HSM)
- Google Cloud HSM
- HashiCorp Vault (with HSM backend)

**Pros:**
- ✅ Private keys never exposed
- ✅ Hardware-level security
- ✅ Audit trails
- ✅ Compliance-friendly

**Cons:**
- ❌ Higher cost
- ❌ More complex setup

---

### Option 2: Custodial Wallet Services ⭐ EASIEST

**How it works:**
- Third-party service manages wallets
- You call their API to send transactions
- They handle all key management

**Implementation:**
```typescript
// Instead of managing private keys:
import { FireblocksSDK } from 'fireblocks-sdk';

const fireblocks = new FireblocksSDK(apiKey, privateKey);

// Send transaction via Fireblocks API
const txHash = await fireblocks.createTransaction({
  assetId: 'ETH',
  amount: amount.toString(),
  destination: {
    type: 'EXTERNAL_WALLET',
    oneTimeAddress: {
      address: userAddress
    }
  }
});
```

**Providers:**
- **Fireblocks** (most popular, enterprise-grade)
- **BitGo** (multi-sig focus)
- **Coinbase Custody** (institutional)
- **Circle** (USDC-focused)

**Pros:**
- ✅ No private key management
- ✅ Insurance coverage available
- ✅ Multi-signature support
- ✅ Easy to implement
- ✅ Regulatory compliance built-in

**Cons:**
- ❌ Service fees
- ❌ Dependency on third party
- ❌ Less control

---

### Option 3: Multi-Signature Wallets

**How it works:**
- Multiple keys required to sign transactions
- Can use services like Gnosis Safe
- Reduces single point of failure

**Implementation:**
```typescript
// Use Gnosis Safe SDK
import Safe, { EthersAdapter } from '@safe-global/protocol-kit';

const safeSdk = await Safe.init({
  ethAdapter: ethersAdapter,
  safeAddress: platformSafeAddress,
});

// Create transaction (requires multiple signatures)
const safeTransaction = await safeSdk.createTransaction({
  safeTransactionData: {
    to: userAddress,
    value: amount.toString(),
    data: '0x',
  },
});

// Multiple admins must sign before execution
```

**Pros:**
- ✅ Distributed security
- ✅ No single point of failure
- ✅ Audit trail of all signers

**Cons:**
- ❌ Still need to manage multiple keys
- ❌ More complex approval flow
- ❌ Slower transaction processing

---

### Option 4: Smart Contract Wallets with Access Control

**How it works:**
- Deploy a smart contract wallet
- Use access control instead of private keys
- Can implement time locks, spending limits, etc.

**Implementation:**
```solidity
// Smart contract wallet
contract PlatformWallet {
    mapping(address => bool) public admins;
    uint256 public dailyLimit;
    
    function withdraw(address to, uint256 amount) external {
        require(admins[msg.sender], "Not authorized");
        require(amount <= dailyLimit, "Exceeds limit");
        // Transfer logic
    }
}
```

**Pros:**
- ✅ Programmable security rules
- ✅ No private key exposure
- ✅ Can add features (time locks, limits)

**Cons:**
- ❌ Requires smart contract deployment
- ❌ Gas costs for each transaction
- ❌ More complex architecture

---

### Option 5: Transaction Relayer Service

**How it works:**
- Users sign transactions with their own keys
- Relayer pays gas and executes
- Platform doesn't need to hold funds

**Implementation:**
```typescript
// User signs transaction
const userSignature = await userWallet.signTransaction({
  to: recipientAddress,
  value: amount,
});

// Relayer executes (pays gas)
const txHash = await relayer.execute({
  signedTx: userSignature,
});
```

**Pros:**
- ✅ Platform doesn't hold user funds
- ✅ No private keys needed
- ✅ Users control their own keys

**Cons:**
- ❌ Different architecture (not custodial)
- ❌ Users need to manage keys
- ❌ Not suitable for staking platform

---

## Recommended Solution: Fireblocks or AWS CloudHSM

### For Most Use Cases: **Fireblocks**

**Why:**
- Easiest to implement
- Handles all security
- Insurance available
- Multi-signature support
- Great API and documentation

**Migration Steps:**
1. Sign up for Fireblocks
2. Create vault and wallets
3. Replace `processWithdrawal` to use Fireblocks API
4. Remove private key env vars
5. Update wallet management UI

### For Enterprise/High Security: **AWS CloudHSM**

**Why:**
- Full control
- Hardware security
- No third-party dependency
- FIPS 140-2 Level 3 certified

**Migration Steps:**
1. Set up AWS CloudHSM cluster
2. Generate keys in HSM
3. Use AWS KMS or CloudHSM SDK
4. Replace signing logic
5. Remove private key env vars

---

## Implementation Example: Fireblocks Integration

Here's how you would modify the code:

### 1. Update `convex/actions/blockchain.ts`:

```typescript
import { FireblocksSDK } from "fireblocks-sdk";

export const processWithdrawal = internalAction({
  args: {
    transactionId: v.id("transactions"),
    // Remove: privateKeyEnvVar
    // Add: fireblocksVaultId, fireblocksAssetId
    fireblocksVaultId: v.string(),
    fireblocksAssetId: v.string(),
    chainId: v.number(),
    toAddress: v.string(),
    amount: v.number(),
    coin: v.string(),
  },
  handler: async (ctx, args) => {
    // Initialize Fireblocks SDK
    const fireblocks = new FireblocksSDK(
      process.env.FIREBLOCKS_API_KEY!,
      process.env.FIREBLOCKS_PRIVATE_KEY! // This is YOUR API key, not wallet key
    );

    try {
      // Create transaction via Fireblocks
      const tx = await fireblocks.createTransaction({
        assetId: args.fireblocksAssetId, // e.g., "ETH"
        amount: args.amount.toString(),
        source: {
          type: "VAULT_ACCOUNT",
          id: args.fireblocksVaultId,
        },
        destination: {
          type: "EXTERNAL_WALLET",
          oneTimeAddress: {
            address: args.toAddress,
          },
        },
      });

      // Update transaction with hash
      await ctx.runMutation(internal.transactions.completeTransaction, {
        transactionId: args.transactionId,
        adminId: "" as any,
        txHash: tx.id, // Fireblocks transaction ID
      });

      return { success: true, txHash: tx.id };
    } catch (error) {
      // Handle error...
    }
  },
});
```

### 2. Update `convex/platformWallets.ts`:

```typescript
// Remove privateKeyEnvVar field
// Add:
fireblocksVaultId: v.string(),
fireblocksAssetId: v.string(),
```

### 3. Update Environment Variables:

```bash
# Remove these:
# WALLET_PRIVATE_KEY_ETH=...
# WALLET_PRIVATE_KEY_USDT=...

# Add these:
FIREBLOCKS_API_KEY=your-api-key
FIREBLOCKS_PRIVATE_KEY=your-api-private-key  # This is for API auth, not wallet
```

---

## Security Comparison

| Solution | Private Key Exposure | Security Level | Cost | Complexity |
|----------|---------------------|----------------|------|------------|
| **Current (Env Vars)** | ⚠️ High | ⚠️ Low | ✅ Low | ✅ Low |
| **HSM** | ✅ None | ✅✅✅ Very High | ⚠️ High | ⚠️ Medium |
| **Fireblocks** | ✅ None | ✅✅✅ Very High | ⚠️ Medium | ✅ Low |
| **Multi-Sig** | ⚠️ Medium | ✅✅ High | ✅ Low | ⚠️ Medium |
| **Smart Contract** | ✅ None | ✅✅ High | ⚠️ Medium | ⚠️ High |

---

## Recommendation

**For a production staking platform, I strongly recommend Fireblocks** because:

1. ✅ **No private keys** - They handle all key management
2. ✅ **Easy migration** - Minimal code changes
3. ✅ **Insurance** - Funds are insured
4. ✅ **Compliance** - Built-in regulatory compliance
5. ✅ **Multi-sig** - Can require multiple approvals
6. ✅ **Audit trail** - Complete transaction history
7. ✅ **Support** - Enterprise support available

The migration would take approximately:
- **Setup**: 1-2 days (Fireblocks account, vault creation)
- **Code changes**: 2-3 days (update withdrawal logic)
- **Testing**: 2-3 days
- **Total**: ~1 week

Would you like me to implement the Fireblocks integration?

