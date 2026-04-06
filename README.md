# gm-dapp
A social dApp on Stacks that gamifies daily engagement through streaks, reputation, and on-chain interactions.
# GM dApp — Decentralized Social Engagement on Stacks

> Say GM. Build streaks. Earn reputation. Own your social graph.

GM dApp is a decentralized social consumer application built on the [Stacks](https://www.stacks.co/) blockchain. It gamifies daily on-chain engagement through GM interactions, streaks, social posting, reactions, and a reputation system — all powered by a composable Clarity smart contract.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

GM dApp is a **decentralized social engagement protocol** that brings high-frequency, meaningful on-chain interactions to everyday users. Think Twitter meets Discord — but decentralized, composable, and running on Stacks.

Every action — saying GM, creating a post, reacting, following someone — is a blockchain transaction. Your streak, reputation, and social graph are owned by you, not a platform.

**Core Philosophy:**
- **Blockchain as source of truth** — all state lives on-chain
- **Backend as performance layer** — caching for fast reads
- **Composability first** — other apps can build on top of the contract
- **Engagement = Reputation** — every interaction contributes to your on-chain identity

---

## Features

### Daily Engagement
- **Say GM / GN** — daily on-chain check-ins with a single click
- **Streak System** — maintain consecutive daily GMs (+1 if within 24h, resets if missed)
- **Points & Reputation** — every action earns points that build your on-chain reputation

### Social Layer
- **Posts** — create, delete, and interact with on-chain posts
- **Reactions** — react with GM, fire, laugh, and more
- **Comments** — comment on any post
- **Reposts** — amplify content you love

### Social Graph
- **Follow / Unfollow** — build your on-chain social network
- **Profile** — username, avatar, stats (streak, points, posts)
- **Leaderboard** — top streaks and top points globally

### Anti-Spam
- Built-in rate limiting per user
- `can-act` checks before any public function executes

### Wallet Integration
- Leather Wallet connect
- One-click transaction signing
- Real-time UI updates post-confirmation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Compiler | React Compiler (experimental) |
| Blockchain | Stacks, Clarity smart contracts |
| Wallet | Leather Wallet (`@stacks/connect`) |
| Stacks SDK | `@stacks/transactions`, `@stacks/network` |
| Backend (optional) | Node.js, REST API (performance cache layer) |

---

## Project Structure

```
gm-dapp/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Landing page /
│   │   ├── dashboard/
│   │   │   └── page.tsx            # /dashboard
│   │   ├── feed/
│   │   │   └── page.tsx            # /feed
│   │   ├── profile/
│   │   │   └── [address]/
│   │   │       └── page.tsx        # /profile/[address]
│   │   └── leaderboard/
│   │       └── page.tsx            # /leaderboard
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── GMButton.tsx
│   │   ├── PostCard.tsx
│   │   ├── ReactionBar.tsx
│   │   ├── StreakCard.tsx
│   │   ├── PointsCard.tsx
│   │   ├── LeaderboardTable.tsx
│   │   └── ProfileHeader.tsx
│   ├── lib/
│   │   ├── stacks.ts               # Stacks network config
│   │   ├── contract.ts             # Contract call helpers
│   │   └── mock-data.ts            # Mock data for Phase 1
│   └── hooks/
│       ├── useWallet.ts
│       ├── useGM.ts
│       └── useProfile.ts
├── contracts/
│   └── gm-social.clar              # Clarity smart contract
├── backend/                        # Optional Node.js cache layer
│   ├── routes/
│   │   ├── posts.ts
│   │   └── leaderboard.ts
│   └── server.ts
├── public/
├── AGENTS.md
├── next.config.ts
└── README.md
```

---

## Pages & Routes

This project has **5 pages** in total.

### `/` — Landing Page
Hero section introducing GM dApp with a wallet connect CTA. First impression for new users.

### `/dashboard` — Dashboard
The main hub after connecting. Includes the GM Button (primary daily action), streak display, points display, and a quick feed preview of recent activity.

### `/feed` — Social Feed
Chronological list of all posts. Each PostCard shows the post content, author, reaction counts, comment count, and repost count.

### `/profile/[address]` — User Profile
Public profile page for any wallet address. Shows avatar, username, stats (streak, points, post count), a follow/unfollow button, and the user's post history.

### `/leaderboard` — Leaderboard
Global rankings by top streaks (longest active) and top points (highest reputation).

---

## Smart Contract Architecture

The core Clarity contract (`contracts/gm-social.clar`) is designed for composability and high-frequency interactions. All public functions are non-restricted and callable by any user or external contract.

### Modules

#### 1. Identity
```clarity
(define-public (set-username (name (string-ascii 50))))
(define-public (set-avatar (avatar (string-ascii 200))))
```

#### 2. Daily Engagement
```clarity
(define-public (say-gm))
(define-public (say-gn))
(define-public (daily-checkin (type uint)))
```

#### 3. Streak System
```clarity
(define-public (update-streak (user principal)))
(define-read-only (get-streak (user principal)))
```
Logic: +1 if last GM was within 24h, reset to 0 if missed.

#### 4. Posts
```clarity
(define-public (create-post (content (string-ascii 500))))
(define-public (delete-post (post-id uint)))
```

#### 5. Social Engagement
```clarity
(define-public (like-post (post-id uint)))
(define-public (comment (post-id uint) (content (string-ascii 300))))
(define-public (repost (post-id uint)))
```

#### 6. Reaction System
```clarity
(define-public (react (post-id uint) (reaction-type uint)))
;; reaction-type: 0 = GM, 1 = fire, 2 = laugh
```

#### 7. Points & Reputation
```clarity
(define-public (earn-points (action uint)))
(define-read-only (get-points (user principal)))
```

#### 8. Social Graph
```clarity
(define-public (follow (user principal)))
(define-public (unfollow (user principal)))
```

#### 9. Anti-Spam Layer
```clarity
(define-read-only (last-action (user principal)))
(define-read-only (can-act (user principal)))
```

#### 10. Read-Only Helpers
```clarity
(define-read-only (get-user (address principal)))
(define-read-only (get-post (id uint)))
(define-read-only (get-feed))
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- [Leather Wallet](https://leather.io/) browser extension
- [Clarinet](https://github.com/hirosystems/clarinet) (for smart contract development)

### 1. Clone & Install

```bash
git clone https://github.com/TheWeirdDee/gm-dapp.git
cd gm-dapp
npm install
```

### 2. Run in Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). In Phase 1 everything runs on mock data — no wallet required.

### 3. Smart Contract Development

```bash
# Install Clarinet (macOS)
brew install clarinet

# Run contract tests
clarinet test

# Start local Stacks devnet
clarinet devnet start
```

### 4. Deploy to Testnet

```bash
clarinet deployments generate --testnet
clarinet deployments apply --testnet
```

---

## Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST...
NEXT_PUBLIC_CONTRACT_NAME=gm-social

# Optional backend cache
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Development Roadmap

### Phase 1 — UI & Mock Data
- [ ] All 5 pages scaffolded
- [ ] All 8 components built
- [ ] Dark mode, mobile-first design
- [ ] Mock data wired up
- [ ] Smooth animations

### Phase 2 — Wallet Connection
- [ ] Leather Wallet integration via `@stacks/connect`
- [ ] Connect / disconnect flow
- [ ] Display connected address in Navbar

### Phase 3 — GM Function Live
- [ ] `say-gm()` contract call wired to GM Button
- [ ] Streak and points reading from chain
- [ ] Transaction confirmation UI

### Phase 4 — Posts & Social
- [ ] `create-post()` and post feed live
- [ ] `like-post()`, `react()`, `comment()` working
- [ ] `follow()` / `unfollow()` on profile pages

### Phase 5 — Points & Leaderboard
- [ ] `earn-points()` integrated across all actions
- [ ] Live leaderboard from chain (or cache layer)
- [ ] Badges and quest system

---

## UI Design Principles

- **Dark mode first** — deep dark backgrounds with vibrant accents
- **Card-based layout** — all content in clean, elevated cards
- **Mobile-first** — fully responsive and touch-optimized
- **Smooth animations** — subtle transitions on all interactions
- Inspired by Twitter (X) for feed UX and Discord for community feel

---

## Optional Backend (Cache Layer)

A lightweight Node.js API acts as a read performance layer. Blockchain is still the single source of truth.

```
GET  /posts        -> Cached post feed
POST /posts        -> Index new post after on-chain confirmation
GET  /leaderboard  -> Cached top streaks and points
```

User cache schema:
```json
{
  "wallet": "ST1...",
  "username": "gm_alice",
  "streak": 14,
  "points": 2840
}
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with clear messages
4. Open a Pull Request

Please add Clarinet tests for any new contract functions.


---

Built by [Divine Dilibe](https://github.com/TheWeirdDee) — Built on Stacks. Owned by you.
