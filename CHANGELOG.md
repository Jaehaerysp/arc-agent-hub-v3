# Changelog

## v7.0.0 — Production Release

Missions 6–10: Jobs Platform, Trust Center, Wallet Ecosystem, Global Production Polish, and Production Release prep. This is the first release documented under the "Mission" naming used internally for this redesign arc; it supersedes v5.1.0 as the current stable line.

### Added
- **Jobs Platform (Mission 6)** — `src/features/jobs/` redesigned onto the v7 premium design system (`jobs-v7.css`), with a stats grid, search/filter, activity timeline, and per-job action panel, reusing `GlassCard`/`Panel`/`MetricCard`/`Grid` from `src/ui/design-system/`.
- **Trust Center (Mission 7)** — `src/features/trust/TrustCenterPage.jsx` merges the previous Reputation and Validation pages into one page at `/trust`: trust score/tier, validation status timeline, reputation timeline, verification history table, five pure-SVG analytics charts, certificates, on-chain evidence, achievement badges, security insights, recent events, and quick actions. `giveFeedback()`/`validationRequest()` business logic is preserved verbatim from the removed pages; every displayed figure is derived from local wallet activity via `src/features/trust/trustAnalytics.js` (documented limitation: neither registry ABI exposes a getter to read scores/validation decisions back from chain).
- **Wallet Ecosystem (Mission 8)** — `src/features/wallet/WalletPage.jsx` at `/wallet`: portfolio summary, asset balances, network status, recent-transactions table, wallet activity timeline, and quick actions, backed by `walletAnalytics.js` (with unit tests).
- **Global Production Polish (Mission 9)** — cross-page accessibility, responsive, and empty/loading-state pass across the v7 pages.
- **Production release scaffolding (Mission 10)** — `.github/CODEOWNERS`, `.github/ISSUE_TEMPLATE/` (bug report, feature request), `.github/PULL_REQUEST_TEMPLATE.md`, and `.github/workflows/` (`build.yml`, `lint.yml`, `test.yml`). Root-level `ROADMAP.md`.

### Changed
- `nav.js` — the two former "Reputation" / "Validation" sidebar entries are now a single "Trust Center" entry.
- `package.json` version bumped from the stale `6.0.0-m4` to `7.0.0`.
- `README.md`, `CONTRIBUTING.md`, `RELEASE_NOTES.md` rewritten/updated to describe the current v7 feature set and repository conventions.

### Breaking changes
- **Routes:** `/reputation` and `/validation` are removed as standalone pages. Both now redirect (`<Navigate replace>`) to `/trust`, so existing bookmarks and links keep working, but any code that imported `ReputationPage`/`ValidationPage` directly needs to import from `src/features/trust/` instead.
- `src/features/reputation/` and `src/features/validation/` were deleted.

### Preserved (unchanged, verified working)
- All ERC-8004/ERC-8183 contract addresses, ABI signatures, RPC endpoint, and explorer URL — untouched.
- `src/contracts/*`, `src/lib/blockchain/*`, `WalletProvider`, `useWallet`, `useJob`/`useJobs`, `useContractWrite` — untouched.
- Landing, Dashboard, Marketplace, Agent Profile, Settings, and Developer Tools pages — untouched by Missions 7–10.

## v5.1.0 — Stabilization & Developer Experience

No user-facing behavior changes. This release focuses entirely on documentation accuracy, test coverage, and internal cleanup.

### Added
- `src/hooks/usePolling.js` — shared `fn`-on-an-interval hook, with unit tests (`usePolling.test.js`).
- Vitest + React Testing Library test setup (`vite.config.js` `test` block, `src/test/setup.js`), plus `npm test` / `npm run test:watch` scripts.
- Initial unit tests for pure utility logic: `src/lib/format.test.js`, `src/features/jobs/components/JobStats.test.js` (`computeJobStats`), `src/features/agents/components/AgentStats.test.js` (`computeAgentStats`), `src/data/agents.test.js` (`getAgentByWallet`).
- `docs/` folder: `OVERVIEW.md`, `ARCHITECTURE.md`, `BLOCKCHAIN.md`, `MARKETPLACE.md`, `DEVELOPMENT.md`, `PROJECT_ROADMAP.md`.
- JSDoc for `useCopyToClipboard`, `ToastProvider`, and `useToast`, which previously had none.

### Changed
- `useBalances.js` and `useJobs.js` refactored to call the new `usePolling()` hook instead of each hand-rolling an identical `useEffect`/`setInterval` block. Verified behavior-identical: same poll intervals (15s / 20s), same immediate-call-on-mount, same skip/cleanup conditions. No change to `useJob.js`, `useContractWrite.js`, `useWallet.js`, `WalletProvider`, `src/contracts/*`, or `src/lib/blockchain/*`.
- `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md` rewritten to accurately describe the current v5.1 feature set (Marketplace, Agent Profile, Hire Agent flow — previously undocumented), folder structure, and development workflow.
- `package.json` version bumped from the stale `4.0.0-sprint2` to `5.1.0` to match the actually-shipped feature set.

### Preserved (unchanged, verified working)
- All ERC-8004/ERC-8183 contract addresses, ABI signatures, RPC endpoint, and explorer URL — untouched.
- `src/contracts/*`, `src/lib/blockchain/*`, `WalletProvider`, `useWallet`, `useJob`, `useContractWrite` — untouched.
- Every feature page's rendered output and routing — untouched.

## v5.0.0 — Agent Marketplace, Profile & Hire flow

*(Documented retroactively in v5.1.0 — this functionality had already shipped without a changelog entry or version bump; see v5.1.0's "Changed" notes above.)*

### Added
- `AgentsPage` "Marketplace" tab: searchable, category-filterable grid of agents (`AgentGrid`/`AgentCard`) with a stats row (`AgentStats` / `computeAgentStats()`).
- `AgentProfilePage` (route `/agents/:wallet`) + `AgentProfileCard` — full per-agent profile with a "Hire this agent" action.
- Hire Agent flow: both `AgentCard` and `AgentProfileCard` navigate to `/jobs/create` with the agent pre-filled as the job provider via router state.
- `src/data/agents.js` — curated static agent catalog (`AGENTS[]`, `getAgentByWallet()`), clearly commented as a temporary stand-in for on-chain discovery (see Known Limitation below).
- `src/styles/agents.css`.

### Changed
- The original `AgentsPage` body (ERC-8004 `register()` form) moved, unchanged, into `RegisterAgentPanel.jsx` under a new "Register Agent" tab, so registration keeps working exactly as before alongside the new Marketplace default view.

### Known Limitation
- The ERC-8004 Identity Registry ABI has no `totalSupply()`/`tokenURI()`/`ownerOf()`/`tokenByIndex()`, so the Marketplace cannot yet enumerate on-chain identities. `data/agents.js` is an intentional stand-in until a registry upgrade or an indexer/subgraph makes real discovery possible.

## v4.0.0-sprint3 (unreleased)

UI/UX and dashboard polish on top of Sprint 2.1's stable job lifecycle — no protocol, contract, or write-function changes.

### Added
- `src/features/jobs/components/JobStats.jsx` — reusable 7-card stats grid (`computeJobStats()` + `<JobStats />`: Total / Open / Funded / Submitted / Completed Jobs, Total Escrow Value, Average Budget), now shared by the Dashboard and Jobs pages instead of each page computing its own subset inline.
- `src/features/jobs/components/ActivityFeed.jsx` — reusable activity list (used by the Dashboard for all activity and by Jobs for `type === 'job'` activity only), replacing duplicated markup that previously lived directly in `DashboardPage.jsx`.
- `src/features/jobs/components/JobsSearch.jsx` / `JobsFilters.jsx` — reusable search box and status-filter-pills + sort dropdown, now shared by Job History (replacing its inline filter bar) and available to any future jobs view.
- `IconFilter`, `IconSearch`, `IconActivity` in `src/ui/icons.jsx`, needed by the components above.
- Dashboard: new "Job overview" section showing the full `JobStats` grid alongside the existing wallet stats.
- Jobs page: new "Job activity" section showing job-scoped recent activity via `ActivityFeed`.
- Job detail: the single combined field card is now split into distinct **Overview**, **Participants**, **Budget**, **Timeline**, and **Explorer Links** cards, the last of which adds direct ArcScan links for the client wallet, provider wallet, and the Agentic Commerce contract (previously only the creation tx was linked).
- Jobs table: explicit **Client** column (previously only a Client/Provider role pill was shown), and columns reordered to Job ID / Status / Client / Provider / Budget / Created / Explorer / Actions.
- `.stats-grid-jobs`, `.jobs-search-wrap`, `.jobs-filters-row` and related rules in `src/styles/jobs.css`, all built on existing design tokens with the same responsive breakpoints used elsewhere.

### Changed
- `DashboardPage.jsx`, `JobsPage.jsx`, `JobHistoryPage.jsx` refactored to consume the shared `JobStats` / `ActivityFeed` / `JobsSearch` / `JobsFilters` components instead of duplicating stat-calculation and filter-bar logic.

### Removed
- `src/features/jobs/components/JobsTimeline.jsx` — an exact duplicate of `JobTimeline.jsx` left over from in-progress work; consolidated to the single `JobTimeline.jsx`.

### Preserved (unchanged, verified working)
- `createJob()`, `setBudget()`, `approveUsdc()`, `fundJob()`, `submitDeliverable()`, `completeJob()`, `getJob()`, `useJobs()`, `useJob()` — untouched.
- All ERC-8004/ERC-8183 contract addresses, ABI signatures, RPC endpoint, and explorer URL — untouched.

## v4.0.0-sprint2 (unreleased)

### Added
- Full ERC-8183 Jobs UI, replacing the Sprint 1 placeholder, across all four routes (`/jobs`, `/jobs/create`, `/jobs/history`, `/jobs/:id`):
  - **Jobs dashboard** — Open Jobs / Completed Jobs / Escrow Locked / USDC Earned stat cards, a recent-jobs table, and Create Job / Refresh / History quick actions.
  - **Create Job** — form for provider address, optional evaluator, description, optional budget, and optional expiration; calls the verified `createJob()` and, if a budget was entered, `setBudget()`, then routes to the new job's detail page.
  - **Job history** — search (job ID / address / description), status filter, sort (newest/oldest/budget), and client-side pagination over the account's full job list.
  - **Job detail** — full field display (client/provider/evaluator/budget/expiration/hook), a Created → Budget Set → Approved → Funded → Submitted → Completed timeline, and a role-gated action panel that shows exactly one correct next action per job status.
- `src/lib/blockchain/jobs.js`: `listJobsForAccount()` (event-log-based job discovery — the SDK has no "list jobs" call) and `getUsdcAllowance()`. Purely additive; none of the seven verified functions were changed.
- `src/hooks/useJobs.js`, `src/hooks/useJob.js` — polling data hooks for the job list and a single job + allowance, matching `useBalances`' shape.
- `src/hooks/useAsyncAction.js` — generalizes `useContractWrite`'s loading/error/success lifecycle to wrap any async function, for the jobs.js helpers that do more than one contract call (event parsing, hashing).
- `src/features/jobs/components/` — `JobStatusBadge`, `JobTimeline`, `JobActionPanel`, `JobsTable`.
- `src/styles/jobs.css` (table, timeline, filter bar, pagination), built entirely on the existing design tokens — no new palette.
- `formatExpiry()` / `isExpired()` in `src/lib/format.js`.

### Changed
- `README.md` and `ARCHITECTURE.md` updated: Jobs marked shipped, roadmap updated, and a new "ERC-8183 Agentic Commerce — job lifecycle UI (Sprint 2)" section documents the job-discovery approach, the client-side Budget Set/Approved status model, and the Create Job budget-chaining behavior.

### Removed
- `src/features/jobs/ComingSoon.jsx` — the Sprint 1 placeholder, no longer referenced anywhere.

### Preserved (unchanged, verified working)
- All ERC-8004 and ERC-8183 contract addresses, ABI signatures, RPC endpoint, and explorer URL — untouched.
- Every existing feature page, hook, provider, and the seven verified `jobs.js` write/read functions — untouched.

## v4.0.0-sprint1

### Added
- `src/lib/blockchain/` — ERC-8183 Agentic Commerce services, integrated from the verified ERC-8183 SDK: `constants.js`, `abis.js`, `contracts.js`, `helpers.js`, `jobs.js` (createJob/setBudget/approveUsdc/fundJob/submitDeliverable/completeJob/getJob), plus a barrel `index.js`.
- Placeholder routes `/jobs`, `/jobs/create`, `/jobs/history`, `/jobs/:id` (`src/features/jobs/`), each showing "Coming in Sprint 2" via a shared `ComingSoon` component built from existing design-system primitives.
- "Jobs" entry in the sidebar navigation (`src/app/nav.js`), with a new `IconJob` icon.

### Changed
- `README.md` and `ARCHITECTURE.md` updated to document the ERC-8183 integration, its file layout, and the two deliberate adaptations from the SDK (browser wallet signer instead of raw private keys; plain JS instead of TypeScript, matching the existing toolchain).

### Preserved (unchanged, verified working)
- All ERC-8004 contract addresses, ABI signatures, RPC endpoint, and explorer URL — untouched.
- Every existing feature page, hook, and provider — untouched.
- ERC-8183 contract addresses, ABI signatures, and call arguments — carried over unchanged from the verified SDK.

### Notes
- No job-lifecycle UI or on-chain write logic ships in this sprint — only services and routing scaffolding, per the Sprint 1 scope.

## v3.0.0

### Added
- Public landing page at `/` (`src/features/landing/LandingPage.jsx`): hero, feature grid, dashboard preview mock, "why Arc Agent Hub", tech stack, open-source callout, roadmap, and footer. The connected app now lives at `/dashboard` and is reached via a "Launch App" call to action.
- `src/styles/landing.css`, built entirely on the existing design tokens (no new palette).
- New shared icons (`IconGithub`, `IconArrowRight`, `IconCheck`, `IconBook`, `IconLayers`, `IconZap`) in `src/ui/icons.jsx`.
- `btn-lg` size support in the shared `Button` component.
- `LICENSE` (MIT), `CODE_OF_CONDUCT.md`, `SECURITY.md`.
- `.gitignore` for a clean public repo.
- GitHub issue forms (`bug_report.yml`, `feature_request.yml`) and a pull request template under `.github/`.
- GitHub Actions workflows: `build.yml` (installs + builds on Node 18/20) and `lint.yml` (runs ESLint) on every push/PR to `main`.
- ESLint config (`.eslintrc.cjs`) plus `npm run lint` script and `eslint`/`eslint-plugin-react`/`eslint-plugin-react-hooks`/`eslint-plugin-react-refresh` devDependencies.
- `RELEASE_NOTES.md` for the v3.0.0 GitHub release.
- `package.json` metadata: `description`, `keywords`, `repository`, `homepage`, `bugs`, `author`, `license`.

### Changed
- `README.md` fully rewritten for public release: hero banner, badges, architecture diagram (Mermaid), screenshot/GIF placeholders, install/quick-start/configuration/smart-contract/deployment sections.
- Routing: `/` now renders the public landing page outside the wallet-gated layout; `/dashboard` (and all other feature routes) remain behind `AppLayout`. Unknown paths still redirect to `/dashboard`.
- `ARCHITECTURE.md` updated to document the landing page and new route structure.

### Preserved (unchanged, verified working)
- Contract addresses, ABI signatures, RPC endpoint, explorer URL, and all wallet/contract read-write logic — untouched.
- Every existing feature page, hook, and provider — untouched.

## v2.0.0

### Fixed
- **Reputation: duplicate transaction.** `ReputationPanel` called `contract.giveFeedback(...)` twice per submit (once discarded, once awaited), submitting two on-chain transactions per feedback. Now calls it exactly once.

### Added
- React Router-based navigation (`/dashboard`, `/agents`, `/reputation`, `/validation`, `/transfer`, `/settings`, `/developer-tools`) replacing tab state, with working browser back/forward.
- Live USDC + ANV balance display on the Dashboard (previously the `provider` prop was passed in but never used).
- Settings page: theme toggle, network/contract info, activity export/reset, agent-ID reset.
- Developer Tools page: live block number, gas price, wallet/network diagnostics, contract explorer links, documentation links.
- Transfer page: live ANV balance, Max button, recent-transfers list.
- Reusable design system in `src/ui/` (Button, Card, Field/Input/Textarea/Select, Badge, Alert, Spinner, EmptyState, StatCard, Skeleton, Dialog, Tooltip, Tabs, CopyButton, ToastViewport).
- Toast notification system (`useToast`) — the old `useToast.js`/`ToastContainer.jsx` existed but were never wired up.
- `useBalances`, `useContractWrite`, `useLocalStorage`, `useCopyToClipboard` hooks.
- Code splitting: every feature page is `React.lazy`-loaded.
- Dark/light theme toggle, persisted per device.
- Collapsible sidebar, mobile drawer navigation.
- `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`.

### Changed
- Migrated to a feature-based folder structure (`src/features/*`) from a flat `src/components/` directory.
- Centralized all contract addresses/ABIs into `src/contracts/registry.js` — previously each panel (and the unused `lib/config.js`) redeclared its own copy.
- Centralized Arc Testnet chain config into `src/chains/arc.js`.
- Full visual redesign: dark glassmorphic theme with a purple/indigo/neon accent palette, replacing the previous blue-accent theme.
- `useWallet` refactored to source chain constants from `chains/arc.js` instead of inline literals.

### Removed (dead code)
- `src/components/Header.jsx`, `Sidebar.jsx`, `TransferPanel.jsx`, `ActivityFeed.jsx`, `ToastContainer.jsx` — none were imported anywhere; `App.jsx` built its own inline sidebar/header/transfer panel instead.
- `src/hooks/useToast.js` (old, unused version).
- `src/assets/index.css` — byte-for-byte duplicate of `src/index.css`.
- `src/lib/config.js` — unused; also contained a stale/incorrect chain-id hex value that didn't match the one actually used in `useWallet.js`.
- `src/components/old project/` and `old project.zip` — leftover backup folder committed into source.
- `.git/.MERGE_MSG.swp` — stray editor swap file.

### Preserved (unchanged, verified working)
- Contract addresses, ABI function signatures, RPC endpoint, explorer URL — byte-for-byte identical to baseline.
- Wallet connect/disconnect, network switch/add flow.
- Agent registration, reputation feedback, validation request, ANV transfer — all business logic preserved.
