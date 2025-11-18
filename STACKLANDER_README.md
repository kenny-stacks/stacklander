# Introduction to Stacks and Clarity
## Workshop Outline

---

## 1. What is Stacks? (5 minutes)

### The Big Picture
- Stacks is a **Bitcoin Layer 2** that brings smart contracts to Bitcoin
- Built on top of Bitcoin, not a separate blockchain
- The native token is **STX**

### Why Bitcoin?
- Most secure and decentralized blockchain
- But lacks native smart contract functionality
- Stacks unlocks Bitcoin's potential for DeFi, NFTs, and dApps

---

## 2. Proof of Transfer (PoX) - The Innovation (10 minutes)

### What is PoX?
- **Proof of Transfer** is Stacks' unique consensus mechanism
- Connects Stacks directly to Bitcoin's security

### How It Works
- **Miners spend Bitcoin (BTC)** to participate in block production
  - Unlike proof-of-burn, the BTC isn't destroyed
  - BTC goes to Stackers (STX holders who lock their tokens)
- Every Stacks block anchors to a Bitcoin block
- Makes reversing a Stacks transaction as hard as reversing Bitcoin

### The PoX Economic Loop
1. Miners spend BTC to mine Stacks blocks
2. Miners earn newly minted STX
3. Stackers lock STX and earn the BTC that miners spent
4. This creates a virtuous cycle connecting both chains

---

## 3. Stacking - Earn Bitcoin by Holding STX (10 minutes)

### What is Stacking?
- Lock your STX tokens to support network consensus
- Earn **Bitcoin (BTC)** rewards - not more STX!
- Different from "staking" - you lock one token, earn a different one

### Stacking Cycles
- Happens in **reward cycles** of **2,100 Bitcoin blocks** (~2 weeks)
- Tokens are locked non-custodially (stay in your wallet)
- You **must wait until the cycle completes** to unlock

### Participation Options
- **Solo Stacking**: Run your own signer (~100,000 STX minimum, dynamic)
- **Delegated Stacking**: Delegate to a pool operator
- **Liquid Stacking**: Receive liquid tokens while locked

---

## 4. The Nakamoto Upgrade (10 minutes)

### Before Nakamoto
- Block times: **~10 minutes** (tied to Bitcoin blocks)
- Stacks could fork independently from Bitcoin
- Limited throughput

### After Nakamoto (Activated 2024)
- **Fast blocks**: ~5 seconds instead of 10 minutes
- **100% Bitcoin finality**: Transactions are as final and secure as Bitcoin transactions
  - Reversing requires reversing Bitcoin itself
  - Stacks no longer forks on its own
- **70% of stacked STX must sign blocks** for them to be valid
- Stackers became critical consensus participants (signers)

---

## 5. Clarity - Smart Contracts Done Right (15 minutes)

### What is Clarity?
- The **smart contract language** for Stacks
- Designed from the ground up to be secure and predictable

### Key Features

#### 1. Decidable
- You can determine what a program will do **before running it**
- No "running out of gas" mid-execution
- No surprises

#### 2. Immutable by Default
- **Clarity smart contracts cannot be updated after deployment**
- What you deploy is what stays on-chain forever
- Increases trust and security

#### 3. Bitcoin Integration
- **Clarity can read Bitcoin blockchain data**
- Contracts can trigger based on Bitcoin transactions
- Access Bitcoin state using built-in functions like `get-burn-block-info?`

#### 4. Built-in Security
- No reentrancy attacks
- Automatic overflow/underflow protection
- Required error handling
- Post-conditions (covered next)

---

## 6. Post-Conditions - User Protection (5 minutes)

### What Are Post-Conditions?
- **Security rules that protect users from unexpected behavior**
- Set by the user/developer, enforced at the protocol level
- Not just a UI feature - part of the blockchain protocol

### Example
- "This transaction must transfer exactly 1 NFT and take 50 STX, or abort"
- If conditions aren't met, transaction fails (user only pays gas)
- Displayed in wallets so users see exactly what will happen
- Prevents malicious contracts from stealing assets

---

## 7. sBTC - Bitcoin on Stacks (10 minutes)

### What is sBTC?
- A **1:1 Bitcoin-backed asset** on Stacks
- **1 sBTC = 1 BTC** always
- Launched on mainnet December 2024

### What Can You Do With sBTC?
- **Use Bitcoin in Stacks smart contracts**
- Participate in DeFi with your Bitcoin
- Keep Bitcoin's value while gaining programmability

### What Makes sBTC Different?
- **Decentralized, not a trusted federation**
- Open-network signers (not a closed group)
- Trust-minimized design
- Quick conversions (deposit within 3 Bitcoin blocks, withdraw within 6)

### Technical Details
- Managed by sBTC Signer Set in a multi-signature address
- Initially 15 community-chosen signers
- Signers validate deposit/withdrawal operations

---

## 8. Building on Stacks - Developer Perspective (5 minutes)

### Why Build on Stacks?
1. Access Bitcoin's $1T+ of capital
2. Bitcoin's security and decentralization
3. Clarity's security guarantees
4. Fast transactions (post-Nakamoto)
5. Growing ecosystem and tooling

### Key Resources
- Clarity language documentation
- Stacks.js for frontend integration
- Hiro developer tools
- Active developer community

---

## 9. The Stacks Ecosystem Today (5 minutes)

### Key Stats
- Secured by 100% of Bitcoin's hashpower (post-Nakamoto)
- Fast block times (~5 seconds)
- Growing DeFi ecosystem
- NFT marketplaces and projects
- Active developer community

### Use Cases
- **DeFi**: DEXs, lending protocols, stablecoins
- **NFTs**: Digital art, collectibles, gaming assets
- **DAOs**: Decentralized governance
- **Bitcoin-native apps**: Leveraging sBTC

---

## 10. Q&A and Next Steps (10 minutes)

### Getting Started
- Try testnet development
- Join Discord/forums
- Explore example contracts
- Stack your STX

### Resources
- docs.stacks.co
- clarity-lang.org
- stacks.org

---

## Key Takeaways

✅ Stacks brings smart contracts to Bitcoin via Proof of Transfer (PoX)  
✅ Stacking lets you earn BTC by locking STX  
✅ Nakamoto upgrade brought 5-second blocks and Bitcoin finality  
✅ Clarity is decidable, secure, and can read Bitcoin state  
✅ sBTC enables Bitcoin DeFi with 1:1 peg  
✅ Post-conditions protect users at the protocol level  
✅ 70% of stacked STX must sign blocks  
✅ Miners spend BTC, which goes to Stackers  

---

**Total Time**: ~75 minutes (leaves 15 minutes buffer in a 90-minute workshop)
