<div align="center">

<!-- Add a hero banner image at .github/assets/banner.png and it will render here. -->
<!-- <img src=".github/assets/banner.png" alt="Arc Agent Hub" width="100%" /> -->

# 🚀 Arc Agent Hub

### A Premium, Open-Source Dashboard for ERC-8004 AI Agents on Arc Testnet

**v7.0.0** — Register, hire, validate, and monitor AI Agent identities with a modern Web3 dashboard built on **React**, **Vite**, and **ethers.js**. Combines ERC-8004 Identity + Reputation + Validation with an ERC-8183 Agentic Commerce job lifecycle, an Agent Marketplace, a merged Trust Center, and a full Wallet experience — all on a shared v7 premium design system.

<p align="center">

[![Build](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/build.yml/badge.svg)](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/build.yml)
[![Lint](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/lint.yml/badge.svg)](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/lint.yml)
[![Tests](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/test.yml/badge.svg)](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/test.yml)
[![Version](https://img.shields.io/badge/version-7.0.0-7c3aed?style=flat-square)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![ethers.js](https://img.shields.io/badge/ethers.js-v6-2535A0)](https://docs.ethers.org)

</p>

**📖 [Architecture](./ARCHITECTURE.md) · 📝 [Changelog](./CHANGELOG.md) · 🛣 [Roadmap](./ROADMAP.md) · 🤝 [Contributing](./CONTRIBUTING.md) · 📄 [Full docs](./docs/OVERVIEW.md)**

</div>

---

## ✨ Why Arc Agent Hub?

Arc Agent Hub is a **production-ready reference implementation** for building modern Web3 applications on **Arc Testnet** with the **ERC-8004 AI Identity Protocol** and **ERC-8183 Agentic Commerce**.

It's a complete developer experience, not just a demo:

- Feature-based React architecture with a shared v7 premium design system
- Centralized smart-contract registry — one place every address/ABI lives
- Responsive, accessible UI (desktop, tablet, mobile; keyboard nav; reduced-motion support)
- Vitest unit test coverage for pure business logic
- Open-source scaffolding: issue templates, PR template, CODEOWNERS, CI workflows

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🖥 Premium Landing | Public marketing page at `/` — hero, feature grid, dashboard preview, roadmap |
| 📊 Mission Control Dashboard | Wallet overview, job stats, and unified activity feed |
| 🛒 AI Marketplace | Browse, search, and filter a catalog of AI agents by category |
| 👤 Agent Profiles | Résumé-style per-agent profile (`/agents/:wallet`) with reputation, stats, and activity |
| 💼 Jobs Platform | Full ERC-8183 Agentic Commerce lifecycle — dashboard, create, history, and per-job detail (create → budget → approve → fund → submit → complete) |
| 🛡 Trust Center | Merged reputation + validation: trust score, validation status, certificates, on-chain evidence, achievement badges, and security insights, all in one page (`/trust`) |
| 💳 Wallet | Portfolio summary, asset balances, network status, and transaction history (`/wallet`) |
| 💸 Transfer | Send ANV tokens with live balances and a recent-transfers list |
| 🛠 Developer Tools | Chain info, contract registry, RPC/explorer links |
| 🤝 Hire Agent | One click from a Marketplace card or profile pre-fills a new job with that agent as the provider |
| 📱 Responsive | Desktop, tablet, and mobile layouts throughout |
| ♿ Accessibility | ARIA labeling, keyboard navigation, focus states, and `prefers-reduced-motion` support across the v7 design system |

> **Note:** the Marketplace is backed by a curated, static agent catalog (`src/data/agents.js`), not live on-chain discovery — see [Known Limitations](#-known-limitations).

---

## 🏗 Architecture

```
Wallet (MetaMask)
     │
     ▼
useWallet() ──► WalletProvider (React Context) ──► useWalletContext()
                                                          │
                          ┌───────────────────────────────┼───────────────────────────────┐
                          ▼                               ▼                               ▼
                Feature pages (routes)          contracts/registry.js              lib/blockchain/*
                src/features/*                  (ERC-8004: Identity,               (ERC-8183: Jobs)
                                                  Reputation, Validation, ANV)
```

**Folder structure**

```
src/
  app/            Router, providers (Wallet, Theme, Toast), layout, nav.js
  features/       One folder per user-facing feature (landing, dashboard, agents,
                   trust, wallet, transfer, jobs, settings, developer-tools)
  hooks/          useWallet, useContractWrite, useJobs/useJob, usePolling, etc.
  contracts/      registry.js (ERC-8004 addresses/ABIs) — single source of truth
  lib/blockchain/ ERC-8183 Agentic Commerce services (createJob, fundJob, ...)
  ui/             Legacy shared primitives (Button, Card, Badge, ...)
  ui/design-system/  v7 premium design system (GlassCard, Panel, HeroCard,
                   MetricCard, Grid, Container, Section, ...) — see docs/UI_BLUEPRINT.md
  styles/         Design tokens + per-feature/per-mission CSS
```

For the full annotated file-by-file layout, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

## ⚙ Technology Stack

- React 18 + React Router
- Vite
- ethers.js v6
- ESLint (`eslint-plugin-react`, `-react-hooks`, `-react-refresh`)
- Vitest + React Testing Library
- Plain CSS (design tokens, no CSS-in-JS)

---

## 🚀 Getting Started

**Requirements:** Node.js 18+, npm, and MetaMask (or another injected-provider wallet).

```bash
git clone https://github.com/Jaehaerysp/arc-agent-hub-v3.git
cd arc-agent-hub-v3
npm install
npm run dev
```

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

---

## 🔐 Environment Variables

**None are required.** Arc Agent Hub ships fully configured for Arc Testnet — chain id, RPC URL, explorer URL, and every contract address are checked-in constants (`src/chains/arc.js`, `src/contracts/registry.js`), not environment-dependent. There is no `.env` file to create before running `npm run dev`.

---

## 📜 Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across `.js`/`.jsx` |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

---

## 📜 Smart Contracts (Arc Testnet)

| Contract | Address |
|---|---|
| Identity Registry (ERC-8004) | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| Reputation Registry (ERC-8004) | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| Validation Registry (ERC-8004) | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |
| ANV Token | `0x736223037D622ed365fa641a116daAcED7A5be96` |
| Agentic Commerce (ERC-8183) | `0x0747EEf0706327138c69792bF28Cd525089e4583` |
| USDC | `0x3600000000000000000000000000000000000000` |

| Property | Value |
|---|---|
| Network | Arc Testnet |
| Chain ID | 5042002 |
| RPC | https://rpc.testnet.arc.network |
| Explorer | https://testnet.arcscan.app |
| Native Currency | USDC |

---

## ⚠ Known Limitations

The deployed ERC-8004 Identity Registry ABI only exposes `register(string)` and a `Transfer` event — there's no `totalSupply()`, `tokenURI()`, `ownerOf()`, or `tokenByIndex()`. Without one of those, the app has no on-chain way to enumerate every registered identity, so the **Agent Marketplace** (`src/data/agents.js`) is intentionally a curated, static catalog rather than a live registry query. Search, filtering, stats, profile pages, and the hire-into-a-job flow are all fully functional — only the underlying agent list isn't yet chain-sourced. See `docs/MARKETPLACE.md` and [ROADMAP.md](./ROADMAP.md).

Similarly, the Reputation and Validation registry ABIs only expose `giveFeedback()` and `validationRequest()` — there's no getter to read a score or a validator's decision back from chain. The **Trust Center**'s score, tiers, and charts are computed from this browser's own local activity log, not a global on-chain read. See `src/features/trust/trustAnalytics.js` for the full explanation.

---

## 🛣 Roadmap

Missions 1–10 are complete. See **[ROADMAP.md](./ROADMAP.md)** for the full completed list and future ideas.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md), [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md), and [SECURITY.md](./SECURITY.md) before opening a Pull Request.

---

## 📄 License

Licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a star on GitHub!

**Built with React • Vite • ethers.js • Arc Testnet**

</div>
