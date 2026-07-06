# Arc Agent Hub v7.0.0

**Title:** Arc Agent Hub v7.0.0 — Premium UI & Production Release

Arc Agent Hub v7 completes a ten-mission redesign arc: a shared premium design system, a Jobs Platform refresh, a merged Trust Center, a full Wallet experience, a global polish pass, and now the production-release scaffolding to make the repository genuinely public-ready.

## Highlights

### 🎨 Premium Design System
A single `src/ui/design-system/` import surface (`GlassCard`, `Panel`, `HeroCard`, `MetricCard`, `Grid`, `Container`, `Section`, `Badge`, `Skeleton`, `EmptyState`, and more) that every v7 page below is built on — consistent elevation, radius, and motion language across the app.

### 🛒 Marketplace & Agent Profiles
The Marketplace and Agent Profile pages carry the v7 visual language: résumé-style profiles, custom SVG charts, and an extended data model, while the underlying static-catalog data source (documented limitation) is unchanged.

### 💼 Jobs Platform
The full ERC-8183 job lifecycle — dashboard, create, history, detail — redesigned onto the v7 system, with stats, search/filter, and an activity timeline.

### 🛡 Trust Center
The former Reputation and Validation pages are merged into one Trust Center at `/trust`: a composite trust score and tier, a validation-status timeline, a reputation milestone timeline, a verification-history table, five pure-SVG analytics charts, certificates, on-chain evidence, achievement badges, and security insights — all derived transparently from this browser's own activity log, since neither registry ABI exposes a getter to read scores or decisions back from chain. `/reputation` and `/validation` still work as redirects.

### 💳 Wallet
A new Wallet page at `/wallet`: portfolio summary, asset balances, network status, recent transactions, and a wallet-scoped activity timeline.

### 🧹 Production Polish & Release
Accessibility (ARIA, keyboard nav, `prefers-reduced-motion`) and responsive-layout consistency across the v7 pages, plus this release's own scaffolding: a rewritten README, an itemized CHANGELOG, a root ROADMAP, updated CONTRIBUTING guidance (including branch strategy), `.github/CODEOWNERS`, issue templates, a pull request template, and `build`/`lint`/`test` GitHub Actions workflows.

## Breaking changes

- `src/features/reputation/` and `src/features/validation/` are removed. `/reputation` and `/validation` now redirect to `/trust` rather than rendering their own page — update any direct imports or bookmarks accordingly.

## What did *not* change

- Contract addresses, ABI signatures, RPC endpoint, and explorer URL — byte-for-byte identical to v6.
- All wallet connect / register / feedback / validation-request / transfer / job-lifecycle business logic.
- Landing, Dashboard, Marketplace, Agent Profile, Settings, and Developer Tools pages.

## Upgrading

No action needed for existing forks — pull the latest `main` and run `npm install`. If you had a direct import of `ReputationPage` or `ValidationPage`, switch it to `src/features/trust/TrustCenterPage.jsx`.

## Full changelog

See [CHANGELOG.md](./CHANGELOG.md#v700--production-release) for the itemized diff, and [ROADMAP.md](./ROADMAP.md) for what's next.

<!-- Note: GitHub's exact anchor slug for "## v7.0.0 — Production Release" may render
     with a slightly different number of hyphens depending on punctuation stripping;
     if the deep link doesn't land exactly on the section, the CHANGELOG.md file itself
     is short enough to scan directly. -->

---

**Contract addresses (Arc Testnet):**

| Contract | Address |
|---|---|
| Identity Registry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| Reputation Registry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| Validation Registry | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |
| ANV Token | `0x736223037D622ed365fa641a116daAcED7A5be96` |
| Agentic Commerce (ERC-8183) | `0x0747EEf0706327138c69792bF28Cd525089e4583` |
| USDC | `0x3600000000000000000000000000000000000000` |
