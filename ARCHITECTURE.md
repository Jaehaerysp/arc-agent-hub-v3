# Architecture

Arc Agent Hub uses a **feature-based architecture**: code is grouped by what it does for the user (agents, trust, wallet…) rather than by technical layer.

```
src/
  app/                    Application shell
    App.jsx               Router + top-level providers
    nav.js                Single source of truth for sidebar/route entries
    providers/
      WalletProvider.jsx  Wraps useWallet(), exposes useWalletContext()
      ThemeProvider.jsx   Dark/light theme, persisted to localStorage
    layout/
      AppLayout.jsx        Sidebar + header + routed page body

  features/               One folder per user-facing feature
    landing/               Public marketing page, mounted at "/" (no wallet gate)
    dashboard/
    agents/                 Marketplace + Agent Profile + ERC-8004 registration (two tabs, one route family)
      AgentsPage.jsx          Tabs: "Marketplace" (browse/search/filter + hire) and "Register Agent"
      AgentProfilePage.jsx    Route /agents/:wallet — resolves a wallet to a catalog entry via getAgentByWallet()
      components/
        AgentStats.jsx        computeAgentStats() + marketplace-wide stats row (agents / categories / avg reputation / jobs completed)
        AgentGrid.jsx         Responsive grid of AgentCard tiles + shared empty state
        AgentCard.jsx         Marketplace tile — click to view profile, "Hire" button routes straight to /jobs/create
        AgentProfileCard.jsx  Full profile view + "Hire this agent" panel, used by AgentProfilePage
        RegisterAgentPanel.jsx  The pre-Marketplace agents body (ERC-8004 register() call), unchanged, now under the "Register Agent" tab
    trust/                 Merged Trust Center (route /trust) — reputation feedback + validation requests,
                             trust score, certificates, on-chain evidence, badges, security insights
                             (/reputation and /validation redirect here for backward compatibility)
      TrustCenterPage.jsx
      trustAnalytics.js      Pure selectors deriving every figure from local wallet activity —
                              no registry getter exists to read scores/decisions back from chain
      components/
        FeedbackFormPanel.jsx        giveFeedback() — preserved verbatim from the old ReputationPage
        ValidationRequestPanel.jsx   validationRequest() — preserved verbatim from the old ValidationPage
    wallet/                Portfolio, balances, network status, and transaction history (route /wallet)
      WalletPage.jsx
      walletAnalytics.js
    transfer/
    settings/
    developer-tools/
    jobs/                  ERC-8183 job lifecycle (dashboard, create, history, detail)
      JobsPage.jsx          Stats + recent jobs + quick actions
      CreateJobPage.jsx     createJob() then optional setBudget()
      JobHistoryPage.jsx    Search/filter/sort/paginate the full job list
      JobDetailPage.jsx     Full job fields, timeline, next action
      components/
        JobStatusBadge.jsx  Maps the on-chain status enum to a Badge variant
        JobTimeline.jsx     Created → Budget Set → Approved → Funded → Submitted → Completed
        JobActionPanel.jsx  Resolves + renders the single correct next action, role-gated
        JobsTable.jsx       Shared table used by both the dashboard and history page
        JobStats.jsx        computeJobStats() + reusable 7-card stats grid, shared by Dashboard and Jobs
        ActivityFeed.jsx    Reusable activity list, shared by Dashboard (all activity) and Jobs (job-only)
        JobsSearch.jsx      Reusable search box, shared by Job History
        JobsFilters.jsx     Reusable status-filter pills + sort dropdown, shared by Job History
    Each feature exports a single <FeatureName>Page.jsx, lazy-loaded by the router.

  data/
    agents.js               Curated, static Marketplace catalog (AGENTS[] + getAgentByWallet()) — see
                             "Why the Marketplace uses static data" below

  contracts/
    registry.js            Every contract address + ABI + display label for ERC-8004 (Identity,
                            Reputation, Validation) + the ANV token — single source of truth for those four
    abis/                  One ABI file per contract

  chains/
    arc.js                 Arc Testnet chain id, RPC, explorer, wallet_addEthereumChain params

  hooks/
    useWallet.js            Wallet connection, network state, activity log, agent id
    usePolling.js            fn-on-an-interval, extracted from the identical shape useBalances and
                             useJobs each used to hand-roll — see "Polling" below (v5.1)
    useBalances.js          Polls native + ANV balances (now via usePolling; same behavior)
    useContractWrite.js      Shared write-transaction lifecycle (loading/error/success/activity)
    useAsyncAction.js        Same lifecycle shape as useContractWrite, generalized to wrap any
                             async function — used by jobs.js calls that do more than one thing
    useJobs.js               Polls the list of jobs for the connected account (now via usePolling; same behavior)
    useJob.js                Loads a single job + the connected account's USDC allowance
    useLocalStorage.js       Generic localStorage-backed state
    useCopyToClipboard.js
    useToast.jsx             Toast notification context

  ui/                      Design-system primitives (Button, Card, Field, Alert, Badge,
                            Spinner, EmptyState, StatCard, Skeleton, Dialog, Tooltip, Tabs,
                            CopyButton, ToastViewport, icons)

  lib/
    format.js               shortAddr / shortHash / formatTime / formatTokenAmount / formatExpiry / isExpired

  styles/
    tokens.css              Design tokens (color, type, radius, shadow) — dark + light theme
    base.css                Reset, typography, focus states
    layout.css               App shell layout, responsive breakpoints
    components.css           Design-system component styles
    features.css              Feature-specific styles (dashboard grid, activity list, settings rows…)
    jobs.css                  Jobs module styles (table, timeline, filter bar, pagination) — same tokens, no new palette
    agents.css                Marketplace/profile styles (grid, cards, stats row) — same tokens, no new palette

  test/
    setup.js                Vitest setup — extends `expect` with jest-dom matchers (v5.1)
```

Test files are colocated with the code they cover (`format.test.js` next to `format.js`, `JobStats.test.js` next to `JobStats.jsx`) rather than mirrored into `src/test/`, so a file and its test move together. `src/test/` holds only cross-cutting test config.

## Data flow

1. `WalletProvider` creates a single `useWallet()` instance and shares it via context — no prop drilling.
2. Feature pages read wallet state with `useWalletContext()` and read/write contracts through the shared `contracts/registry.js` and `useContractWrite` hook.
3. `useContractWrite` centralizes the try/execute/await-receipt/catch pattern that was previously duplicated across every panel, and logs to the shared activity feed via `addActivity`.
4. Activity and Agent ID persist to `localStorage` through `useLocalStorage`, so they survive reloads.

## Routing

Feature pages are registered once in `app/nav.js` and consumed both by the sidebar and the router in `app/App.jsx`, so adding a feature means adding one entry, not editing multiple files.

`App.jsx` splits routing into two zones: `/` renders `features/landing/LandingPage.jsx` directly, with no wallet requirement. Every other route (`/dashboard`, `/agents`, `/agents/:wallet`, `/reputation`, `/validation`, `/transfer`, `/jobs`, `/jobs/create`, `/jobs/history`, `/jobs/:id`, `/settings`, `/developer-tools`) is nested under `AppLayout`, which renders the sidebar/header chrome and gates the page body behind a connected wallet. Unknown paths redirect to `/dashboard`.

Each page is `React.lazy`-loaded, so the initial bundle only includes the Dashboard; other routes are fetched on first visit (see the per-route chunks in `npm run build` output).

## Why a contract registry

The baseline project re-declared the same contract addresses and ABI fragments inside `AgentPanel.jsx`, `ReputationPanel.jsx`, `ValidationPanel.jsx`, and `App.jsx` (four independent copies). `contracts/registry.js` is now the only place addresses are declared; every feature imports from it.

## Known bug fixed in this refactor

`ReputationPanel`'s submit handler called `contract.giveFeedback(...)` **twice** — once with the result discarded, once awaited — so every feedback submission sent two separate on-chain transactions. The new `ReputationPage` calls it exactly once through `useContractWrite`.

## ERC-8183 Agentic Commerce (Sprint 1)

The verified ERC-8183 SDK (a standalone Node.js toolkit for testing the Agentic Commerce job lifecycle on Arc Testnet) has been folded into the app as `src/lib/blockchain/`:

```
lib/blockchain/
  constants.js    AGENTIC_COMMERCE_ADDRESS, USDC_ADDRESS, JOB_STATUS — chain id/RPC/explorer
                  are NOT duplicated here, they're imported from chains/arc.js
  abis.js         AGENTIC_COMMERCE_ABI, USDC_ABI — carried over unchanged from the SDK
  contracts.js    ERC8183_CONTRACTS registry + getCommerceContract()/getUsdcContract()
                  factories, mirroring contracts/registry.js's shape
  helpers.js      hashText() (keccak256), formatJob() (tuple → plain object)
  jobs.js         createJob/setBudget/approveUsdc/fundJob/submitDeliverable/
                  completeJob/getJob — one function per verified script
  index.js        barrel export
```

**One deliberate change from the SDK, and why:** the SDK's scripts sign transactions with raw private keys loaded from a `.env` file (`CLIENT_PRIVATE_KEY` / `PROVIDER_PRIVATE_KEY`) — a Node-only pattern appropriate for a CLI testing tool. That pattern is **not** ported into the app. A browser app must never hold a private key, so every write function in `jobs.js` instead takes a `signer` argument — the same connected-wallet `ethers.Signer` that `AgentsPage`, `TrustCenterPage` and `TransferPage` already pull from `useWalletContext()`. Likewise, the SDK's `storage.ts` persisted the active job id to a local `job.json` file; the browser has no filesystem, so job ids are simply passed as normal values (route params, form state, or the existing `useLocalStorage` hook) instead.

A second adaptation: the SDK is written in TypeScript (`.ts`), but this project's Vite/ESLint toolchain is plain JavaScript (`.jsx`/`.js`, no `tsconfig`, no TS build step). The blockchain lib is therefore implemented as `.js` with the same structure and JSDoc-style comments, rather than introducing a parallel TypeScript toolchain for one folder.

Contract addresses, ABI signatures, and call arguments are otherwise carried over unchanged and re-verified against the working SDK scripts.

## ERC-8183 Agentic Commerce — job lifecycle UI (Sprint 2)

`/jobs`, `/jobs/create`, `/jobs/history`, and `/jobs/:id` now render the full job lifecycle instead of the Sprint 1 placeholder, wired to `lib/blockchain/jobs.js` the same way `AgentsPage` is wired to `useContractWrite`.

**Job discovery.** The verified SDK only exposes `getJob(id)` — there's no "list jobs" call. `listJobsForAccount()` (added to `lib/blockchain/jobs.js`, alongside the seven verified functions, none of which were changed) fills that gap by reading `JobCreated` logs — `jobId`, `client` and `provider` are all indexed — for jobs where the connected account is client or provider, then resolves each id with the existing `getJob()`. It's a read-only addition; no write path was touched.

**Status model.** The on-chain `Job.status` enum only has `Open → Funded → Submitted → Completed` (plus terminal `Rejected`/`Expired`) — there's no "Budget Set" or "Approved" status on-chain. Those two are derived client-side while a job is `Open`: `budget === 0n` → *Set Budget* is next; else `allowance(client, AgenticCommerce) < budget` → *Approve USDC* is next; else → *Fund Job* is next. `JobActionPanel` resolves this into a single next action per job and role-gates it against the connected wallet (client for setBudget/approve/fund, provider for submit, evaluator — or client if no evaluator was set — for complete), disabling the action with an explanation if the wrong wallet is connected rather than hiding it.

**Create Job.** The form's "Budget (USDC)" field isn't a `createJob()` parameter on-chain — budget is set in a separate `setBudget()` call. `CreateJobPage` chains the two verified calls (`createJob()` then, if a budget was entered, `setBudget()`) so entering a budget at creation "just works," while still only ever calling the verified SDK functions. If the second call fails, the job still exists and a toast points the user to the job page, where `JobActionPanel` will correctly offer *Set Budget* again.

**Error handling.** Wallet-not-connected and wrong-network are already handled globally (`AppLayout`'s `ConnectPrompt` / "Switch to Arc" banner). Within the Jobs pages: `useJob`/`useJobs` surface RPC/read failures as an `Alert` with a `Refresh` retry; `useAsyncAction` (same error-extraction convention as `useContractWrite`: `e.reason || e.shortMessage || e.message`) surfaces user-rejected transactions and contract reverts inline on the action button; every successful write links to its ArcScan transaction.

## Agent Marketplace, Profile & Hire flow (v5.0)

`AgentsPage` now renders two tabs: **Marketplace** (the default) and **Register Agent** (the original ERC-8004 registration body, moved into `RegisterAgentPanel.jsx` unchanged). The Marketplace tab adds:

- `AgentStats` — `computeAgentStats()` (pure) + a 4-card stats row (agents listed, categories, average reputation, jobs completed).
- Search + category filter (local `useState`, filtered client-side with `useMemo`) over the static `AGENTS` catalog.
- `AgentGrid` / `AgentCard` — the browsable grid; clicking a card navigates to `/agents/:wallet`, and each card's "Hire" button navigates straight to `/jobs/create` with `{ provider, agentName }` pre-filled via router state.
- `AgentProfilePage` (route `/agents/:wallet`) resolves the wallet param to a catalog entry with `getAgentByWallet()` and renders `AgentProfileCard` — full stats, a placeholder "recent activity" panel, and a "Hire this agent" panel that does the same `/jobs/create` hand-off as the card.

**Why the Marketplace uses static data.** The deployed ERC-8004 Identity Registry ABI only exposes `register(string)` and a `Transfer` event — there's no `totalSupply()`, `tokenURI()`, `ownerOf()`, or `tokenByIndex()` to enumerate registered identities on-chain. `src/data/agents.js` is therefore an intentional, clearly-commented curated catalog (`AGENTS[]` + `getAgentByWallet()`), not a stand-in that was forgotten. It gives the Marketplace/Profile/Hire UX a real, working data source today. When on-chain enumeration becomes possible (either a registry upgrade or an indexer/subgraph — see `docs/PROJECT_ROADMAP.md`), the plan is a drop-in `useAgents()` hook with the same loading/error/data/refresh shape as `useBalances`/`useJobs`, so `AgentGrid`, `AgentCard`, and `AgentProfileCard` need no changes — only the data source behind them does.

## A note on contract-access patterns

Two conventions currently coexist for talking to contracts, and this is a deliberate, documented state rather than an oversight:

- **`src/contracts/registry.js` + `src/contracts/abis/`** — used by Identity, Reputation, Validation, and the ANV token. This is the pattern described above under "Why a contract registry."
- **`src/lib/blockchain/`** — used exclusively by the ERC-8183 Jobs feature, carried over from the verified ERC-8183 SDK (see "ERC-8183 Agentic Commerce (Sprint 1)" above) to keep its addresses/ABIs/call signatures traceable back to that SDK.

Both patterns are production-stable and neither is being merged into the other in v5.1 — the ERC-8183 integration is treated as verified, working code that should not be touched for the sake of stylistic consistency alone. A future sprint may revisit unifying them (see `docs/PROJECT_ROADMAP.md`), but that is a deliberate, scoped decision for later, not debt introduced by accident.

## Polling (v5.1)

`useBalances` and `useJobs` previously each implemented the same shape independently:

```js
useEffect(() => {
  refresh()
  if (!provider || !account) return
  const interval = setInterval(refresh, POLL_INTERVAL_MS)
  return () => clearInterval(interval)
}, [refresh, provider, account])
```

This is now `src/hooks/usePolling.js` — `usePolling(fn, intervalMs, enabled)` — calling `fn` immediately and then on every tick while `enabled` is true. Both hooks call it as `usePolling(refresh, POLL_INTERVAL_MS, Boolean(provider && account))`, which reproduces the exact previous behavior (verified: `refresh()` still runs on every `provider`/`account` change via `refresh`'s own `useCallback` dependency array, and the interval is still skipped/cleared under the same conditions). No polling interval, no blockchain read/write logic, and no component-visible behavior changed — this was a pure internal refactor. `useJob.js` (the single-job hook) was intentionally left as-is in this pass.

## Testing (v5.1)

Vitest + React Testing Library are configured via the `test` block in `vite.config.js` (one config file, no separate toolchain) with `src/test/setup.js` loading jest-dom matchers. `npm test` runs the suite once; `npm run test:watch` runs it in watch mode.

Initial coverage targets pure, side-effect-free logic only — no contract calls, no wallet interaction:

- `src/lib/format.test.js` — every `format.js` export.
- `src/features/jobs/components/JobStats.test.js` — `computeJobStats()`.
- `src/features/agents/components/AgentStats.test.js` — `computeAgentStats()`.
- `src/data/agents.test.js` — `getAgentByWallet()`.
- `src/hooks/usePolling.test.js` — the new hook, using fake timers.

Testing `useContractWrite`, `useJobs`/`useJob`, or any `lib/blockchain`/`contracts` code is explicitly out of scope for this pass (would require mocking `ethers.Contract`/`BrowserProvider`) and is called out as follow-up work in `docs/PROJECT_ROADMAP.md`.
