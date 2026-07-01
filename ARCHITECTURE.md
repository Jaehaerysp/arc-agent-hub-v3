# Architecture

Arc Agent Hub uses a **feature-based architecture**: code is grouped by what it does for the user (agents, reputation, validation…) rather than by technical layer.

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
    agents/
    reputation/
    validation/
    transfer/
    settings/
    developer-tools/
    Each feature exports a single <FeatureName>Page.jsx, lazy-loaded by the router.

  contracts/
    registry.js            Every contract address + ABI + display label — single source of truth
    abis/                  One ABI file per contract

  chains/
    arc.js                 Arc Testnet chain id, RPC, explorer, wallet_addEthereumChain params

  hooks/
    useWallet.js            Wallet connection, network state, activity log, agent id
    useBalances.js          Polls native + ANV balances
    useContractWrite.js      Shared write-transaction lifecycle (loading/error/success/activity)
    useLocalStorage.js       Generic localStorage-backed state
    useCopyToClipboard.js
    useToast.jsx             Toast notification context

  ui/                      Design-system primitives (Button, Card, Field, Alert, Badge,
                            Spinner, EmptyState, StatCard, Skeleton, Dialog, Tooltip, Tabs,
                            CopyButton, ToastViewport, icons)

  lib/
    format.js               shortAddr / shortHash / formatTime / formatTokenAmount

  styles/
    tokens.css              Design tokens (color, type, radius, shadow) — dark + light theme
    base.css                Reset, typography, focus states
    layout.css               App shell layout, responsive breakpoints
    components.css           Design-system component styles
    features.css              Feature-specific styles (dashboard grid, activity list, settings rows…)
```

## Data flow

1. `WalletProvider` creates a single `useWallet()` instance and shares it via context — no prop drilling.
2. Feature pages read wallet state with `useWalletContext()` and read/write contracts through the shared `contracts/registry.js` and `useContractWrite` hook.
3. `useContractWrite` centralizes the try/execute/await-receipt/catch pattern that was previously duplicated across every panel, and logs to the shared activity feed via `addActivity`.
4. Activity and Agent ID persist to `localStorage` through `useLocalStorage`, so they survive reloads.

## Routing

Feature pages are registered once in `app/nav.js` and consumed both by the sidebar and the router in `app/App.jsx`, so adding a feature means adding one entry, not editing multiple files.

`App.jsx` splits routing into two zones: `/` renders `features/landing/LandingPage.jsx` directly, with no wallet requirement. Every other route (`/dashboard`, `/agents`, `/reputation`, `/validation`, `/transfer`, `/settings`, `/developer-tools`) is nested under `AppLayout`, which renders the sidebar/header chrome and gates the page body behind a connected wallet. Unknown paths redirect to `/dashboard`.

Each page is `React.lazy`-loaded, so the initial bundle only includes the Dashboard; other routes are fetched on first visit (see the per-route chunks in `npm run build` output).

## Why a contract registry

The baseline project re-declared the same contract addresses and ABI fragments inside `AgentPanel.jsx`, `ReputationPanel.jsx`, `ValidationPanel.jsx`, and `App.jsx` (four independent copies). `contracts/registry.js` is now the only place addresses are declared; every feature imports from it.

## Known bug fixed in this refactor

`ReputationPanel`'s submit handler called `contract.giveFeedback(...)` **twice** — once with the result discarded, once awaited — so every feedback submission sent two separate on-chain transactions. The new `ReputationPage` calls it exactly once through `useContractWrite`.
