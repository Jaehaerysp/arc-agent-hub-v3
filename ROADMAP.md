# Roadmap

## Completed — Missions 1–10 (v7.0.0)

| Mission | Summary |
|---|---|
| 1 — Premium Landing | Public marketing page at `/`: hero, feature grid, dashboard preview, roadmap, footer |
| 2 — Premium Design System | `src/ui/design-system/` — `GlassCard`, `Panel`, `HeroCard`, `MetricCard`, `Grid`, `Container`, `Section`, `Badge`, `Skeleton`, `EmptyState`, and the `ds-*` token-driven stylesheet every later mission builds on |
| 3 — Mission Control Dashboard | Wallet overview, job stats, and unified activity feed at `/dashboard` |
| 4 — AI Marketplace | Searchable/filterable agent catalog with stats, at `/agents` |
| 5 — Premium Agent Profile | Résumé-style profile redesign at `/agents/:wallet` — reputation, stats, custom SVG charts |
| 6 — Jobs Platform | ERC-8183 job lifecycle (`/jobs`, `/jobs/create`, `/jobs/history`, `/jobs/:id`) redesigned onto the v7 design system |
| 7 — Trust Center | Merged Reputation + Validation into one page at `/trust` — trust score, validation status, certificates, on-chain evidence, achievement badges, security insights |
| 8 — Wallet Ecosystem | Portfolio, balances, network status, and transaction history at `/wallet` |
| 9 — Global Production Polish | Cross-page accessibility, responsive layout, and empty/loading-state consistency pass |
| 10 — Production Release | README/CHANGELOG/CONTRIBUTING rewrite, `.github/` OSS scaffolding, CI workflows, v7.0.0 tag |

Full itemized diffs for every mission and every pre-v7 sprint are in **[CHANGELOG.md](./CHANGELOG.md)**.

## Known limitation carried into v7.0.0

The Agent Marketplace remains backed by a curated, static catalog (`src/data/agents.js`) rather than live on-chain discovery — the deployed ERC-8004 Identity Registry ABI has no `totalSupply()`/`tokenByIndex()`/`ownerOf()` to enumerate registered identities. The Trust Center's score/validation data is similarly scoped to this browser's local activity log, since neither the Reputation nor Validation registry ABI exposes a getter to read a value back from chain. Both are documented in detail in `docs/MARKETPLACE.md` and `src/features/trust/trustAnalytics.js` respectively.

## Future ideas

Nothing below is scheduled or committed — these are candidate directions for a future mission, not promises:

- **On-chain (or indexer-backed) Agent Discovery** — replace the static Marketplace catalog once a registry upgrade or subgraph/indexer makes enumeration possible.
- **Real Validation outcomes** — if the Validation Registry ever adds a getter, replace the Trust Center's "Pending validator review" status with the actual on-chain decision.
- **Multi-chain support** — currently Arc Testnet only, which is an intentional simplification rather than an oversight.
- **WalletConnect / multi-wallet support** — currently MetaMask (or another injected provider) only.
- **Blockchain-layer test coverage** — `useContractWrite`, `useJob`/`useJobs`, `src/contracts/*`, and `src/lib/blockchain/*` aren't covered by the current Vitest suite; this needs provider/signer mocking (or a local fork) as its own infrastructure investment.
- **Analytics dashboard** — no requirements gathered yet.

If you want to pick up any of these, please open an issue first describing your approach — see [CONTRIBUTING.md](./CONTRIBUTING.md).
