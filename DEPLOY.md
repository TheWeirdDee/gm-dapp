# Gm Smart Contract Deployment Guide

Follow these steps to deploy the `gm-social.clar` contract to the Stacks Testnet.

## Step 1: Install Clarinet (Optional but Recommended)
Clarinet is the testing framework for Stacks.
```bash
npm install -g @hirosystems/clarinet
```

## Step 2: Syntax Check
Before deploying, make sure the contract code is valid.
1. Create a clarinet project: `clarinet new gm-protocol`
2. Copy `contracts/gm-social.clar` into the `gm-protocol/contracts/` folder.
3. Run:
```bash
clarinet check
```

## Step 3: Deploy via Stacks Explorer (Testnet)
Since you want it live, we'll use the easiest deployment method:

1. **Get Testnet STX**:
   - Go to the [Stacks Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet).
   - Connect your **Leather** or **Hiro** wallet.
   - Switch the wallet network to **Testnet**.
   - Request STX.

2. **Deploy**:
   - Go to the [Stacks Explorer Sandbox](https://explorer.hiro.so/sandbox/deploy?chain=testnet).
   - Paste the contents of `contracts/gm-social.clar` into the editor.
   - Provide a contract name (e.g., `gm-social-v1`).
   - Click **Deploy**.
   - Confirm the transaction in your wallet.

## Step 4: Update Frontend
Once the transaction is confirmed, copy your contract ID (e.g., `ST...ABC.gm-social-v1`) and update `src/lib/stacks.ts`.

---

> [!IMPORTANT]
> **Wait for Confirmation**: Stacks transactions take ~10-15 minutes to confirm. Do not refresh until the explorer shows 'Confirmed'.
