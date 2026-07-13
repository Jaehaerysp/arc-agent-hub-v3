# Roadmap (docs/)

This is a short, developer-facing pointer. The authoritative, itemized
roadmap — completed missions/sprints through v8.0.0 and the full list of
uncommitted future ideas — lives at [`../ROADMAP.md`](../ROADMAP.md).
This file exists so `docs/` is self-contained without duplicating that
content; update the root file, not this one, when scope actually changes.

## Where the project is now

- **v8.0.0** — Sprint 4 (Universal Token Swap, Circle App Kit) complete,
  alongside the v7.0.0 feature set (Landing, Dashboard, Marketplace, Agent
  Profile, Jobs, Trust Center, Wallet) and the v8 additions (Universal
  Portfolio, Universal Payments, Circle CCTP Bridge Center).
- **Current branch:** `feature/v8.1-platform-foundation` — introduces the
  `src/shared/`, `src/sdk/`, and `src/plugins/` scaffolding (ET-001) as a
  foundation for future work, with no changes to existing feature
  behavior, UI, routing, or contract logic.

## Near-term candidates (not committed)

Carried over from [`../ROADMAP.md`](../ROADMAP.md) "Future ideas":

- On-chain (or indexer-backed) Agent Discovery, replacing the static
  Marketplace catalog.
- Real Validation outcomes, once/if the Validation Registry exposes a
  getter.
- Multi-chain support beyond Arc Testnet.
- WalletConnect / multi-wallet support.
- Blockchain-layer test coverage for `useContractWrite`,
  `useJob`/`useJobs`, `src/contracts/*`, and `src/lib/blockchain/*`.

## Platform-foundation track (new, this branch)

Tracked separately from feature roadmap items since it's internal
structure, not user-facing:

- **ET-001 (this task):** scaffold `src/shared/`, `src/sdk/`,
  `src/plugins/`; add `src/shared/config/contracts.ts` and
  `chains.ts` as re-export wrappers over the existing canonical config.
- **Follow-up candidates** (see `docs/PROJECT_AUDIT.md` §14 for the full
  list this track is expected to draw from):
  - Consolidate the two UI kits (`src/ui/` and `src/ui/design-system/`)
    into `src/shared/components/`.
  - Move/re-export cross-feature hooks into `src/shared/hooks/`.
  - Unify the ERC-8004 (`src/contracts/`) and ERC-8183
    (`src/lib/blockchain/`) contract-registry patterns.
  - Remove confirmed-dead code (`src/shared/layouts/`,
    `ReputationPage.jsx`, `ValidationPage.jsx`, duplicate
    `bridgeErrors.js`).

If you want to pick up any of these, open an issue first describing your
approach — see [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
