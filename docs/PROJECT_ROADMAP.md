# Project Roadmap

> **v7.0.0 note:** the up-to-date, high-level completed/future list now lives in the root **[ROADMAP.md](../ROADMAP.md)**. This file is kept as the detailed historical record through v5.1.0 (Missions 1–5 predate the "Mission" naming and are documented here under their sprint/version names).

## Shipped

| Release | Summary |
|---|---|
| v2.0.0 | Feature-based restructure, design system, contract registry, dead-code removal, duplicate-transaction fix |
| v3.0.0 | Public landing page, GitHub OSS scaffolding (CI, issue templates, license) |
| v4.0.0-sprint1 | ERC-8183 services + placeholder routes |
| v4.0.0-sprint2 | Full ERC-8183 job lifecycle UI |
| v4.0.0-sprint3 | Job stats/search/filter/activity dashboard layer |
| **v5.0.0** | Agent Marketplace, Agent Profile, Hire Agent flow *(documented retroactively in v5.1)* |
| **v5.1.0** | Stabilization & Developer Experience: docs overhaul, `usePolling` extraction, first automated test suite — zero user-facing changes |

Full details for each release are in `CHANGELOG.md` at the repo root.

## Next up: Marketplace Data Layer

Goal: give the Marketplace a real data-fetching seam without touching any component, while on-chain discovery remains blocked by the registry ABI limitation (see `MARKETPLACE.md`).

- Introduce `useAgents()` with the same `{ data, loading, error, refresh }` shape as `useBalances`/`useJobs`, initially still backed by `data/agents.js`.
- Spike a real discovery mechanism: either an upgraded Identity Registry ABI (`totalSupply()`/`tokenByIndex()`/`ownerOf()`), or an off-chain indexer/subgraph watching `Transfer` events on the existing registry.
- Add integration-style smoke tests for the highest-stakes flows: connect wallet → register identity; browse Marketplace → hire agent → fund job → complete; transfer ANV.

## Later: Real Discovery & Polish

Depends on which discovery mechanism the spike above validates.

- Wire `useAgents()` to the validated discovery source, replacing static data — `AgentGrid`/`AgentCard`/`AgentProfileCard` should require no changes.
- Replace the Agent Profile page's placeholder "recent activity" panel with real on-chain job history for that agent.
- Environment-based contract configuration if multi-network support becomes a goal (currently Arc Testnet only, which is an intentional simplification, not an oversight).
- Performance pass on the Marketplace grid once agent counts are no longer bounded by a hand-written array (virtualization if needed).

## Deliberately deferred (not scheduled)

These were identified during architecture review but are explicitly **not** being scheduled opportunistically — each needs its own dedicated, reviewable pass rather than riding along with unrelated work:

- **Unifying `src/contracts/registry.js` and `src/lib/blockchain/` into one contract-access pattern.** Both are production-stable; see `BLOCKCHAIN.md` for why they currently differ. Worth revisiting once the Marketplace Data Layer work is stable, so it doesn't compound the number of moving pieces in flight at once.
- **Testing the blockchain layer itself** (`useContractWrite`, `useJob`/`useJobs`, `src/contracts/*`, `src/lib/blockchain/*`). Requires `ethers.Contract`/`BrowserProvider`/signer mocking (or a local fork) as its own infrastructure investment, not a quick addition to the current pure-function test suite.
- **WalletConnect support / multi-wallet.** Currently MetaMask-only via the injected provider.
- **Analytics dashboard.** No requirements gathered yet.

## Contributing to the roadmap

If you want to pick up one of the "Next up" items, open an issue first describing your approach — particularly for anything touching `src/lib/blockchain/` or `src/contracts/`, since those are verified, production-stable integrations (see `CONTRIBUTING.md`).
