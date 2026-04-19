# GM Social Protocol — The Decentralized Economy for Human Connection

**Built on Stacks. Powered by $GM. Owned by the Community.**

GM Social is a high-fidelity, on-chain social economy designed to gamify daily engagement and verify human reputation through a liquid, deflationary token economy ($GM).

> [!IMPORTANT]
> This is a **Hybrid Decentralized Protocol**. All social truth lives on the Stacks blockchain, while a high-performance **Shadow Sync** layer in Supabase ensures real-time discoverability and algorithmic relevance.

---

## 🚀 The Protocol Economy

GM Social introduces a circular social economy where attention has real value.

### 🪙 The $GM Token
*   **Minting (Social Mining)**: Earn $GM through daily check-ins (GMs) and by receiving tips from the community. Pro members earn 2x mining rewards.
*   **Burning (Social Sinks)**: Users can permanently burn $GM to **Boost** posts. This deflationary mechanism ensures token scarcity while giving creators a path to amplified visibility.
*   **Gratitude Rewards**: Tipping others initiates a protocol-level "Gratitude Mint" that rewards the tipper with bonus $GM.

### ⚡ The "Vigor Scoring" Algorithm
The global feed is powered by a decentralized discovery engine that weights posts based on:
*   **Economic Signals (+50 pts)**: High-weight post boosts (burn events).
*   **Community Validation (+5 pts/STX)**: Real-time tipping volume.
*   **Author Reputation (+0.1 pts/Rep)**: Verified on-chain karma.
*   **Social Proximity (+100 pts)**: Bonus points for content from followed users.
*   **Freshness Decay (-2 pts/hr)**: Ensures the network "Pulse" remains current.

---

## 🏛️ Governance & DAO

The protocol is governed by its participants through the **Governance Hub**.
*   **Weighted Voting**: Protocol proposals are decided using $GM-weighted voting.
*   **Decentralized Prioritization**: Anyone can "Boost" a post to the top of the collective attention, creating an open market for social discovery.
*   **Protocol Pulse**: A real-time analytics dashboard tracking tokenomics (Mint vs. Burn), social vigor, and global network health.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Social Core** | Clarity Smart Contracts (Stacks L2) |
| **Identity Layer** | BNS / Stacks Principal Identities |
| **Shadow Sync** | Supabase (PostgreSQL) + Real-time Change Data Capture |
| **Vigor Engine** | PL/pgSQL Algorithmic Scoring Functions |
| **UI Framework** | Next.js 15 (App Router), Tailwind CSS, Lucide Icons |
| **State Engine** | Redux Toolkit (On-Chain Hydration) |

---

## 📂 Project Structure

```
gm-dapp/
├── contracts/               # Clarity Smart Contracts ($GM Token, Social Core)
├── src/
│   ├── app/                 # Next.js App Router (Governance, Analytics, Feed)
│   ├── components/          # High-Fidelity UI Components (Rocket Boost, HUD)
│   ├── lib/
│   │   ├── stacks.ts        # On-chain interaction layer
│   │   ├── supabase.ts      # Shadow Sync client
│   │   └── vigor.ts         # Algorithmic scoring logic
│   └── store/               # Redux State (On-chain state hydration)
├── migrations/              # SQL Vigor Score Migrations
└── README.md
```

---

## 🛤️ Roadmap: From dApp to Protocol

### ✅ Phase 1-4: The Foundation
*   Bulletproof GM/GN on-chain interactions.
*   Identity system with avatars and bios.
*   Follow/Unfollow social graph.

### ✅ Phase 5-8: The Economy (Current)
*   **$GM Token Launch**: SIP-010 compliant social mining.
*   **Deflationary Boosts**: On-chain burn mechanism for post priority.
*   **Vigor Discovery**: Algorithmic "For You" feed implementation.
*   **Mobile Protocol HUD**: Real-time stats parity for all devices.

### 🚀 Future: The Scale
*   **Soulbound Badges**: Automatically minting reputation milestones.
*   **Viral Loops**: Referral-based $GM incentives for network growth.
*   **Mainnet Launch**: Transition from Devnet/Testnet to Stacks Mainnet.

---

## 🏗️ Getting Started

### Prerequisites
- [Leather Wallet](https://leather.io/)
- [Clarinet](https://github.com/hirosystems/clarinet)
- Supabase Project with `vigor_score` migration applied.

### Quick Start
1. `npm install`
2. Configure `.env.local` with your Supabase and Stacks credentials.
3. `npm run dev`
4. Run the `vigor_score_migration.sql` in your Supabase SQL Editor.

---

Built with 🧡 on Stacks by [Divine Dilibe](https://github.com/TheWeirdDee).
**Join the economy. Own your social.**
