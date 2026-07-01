# Changelog

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
