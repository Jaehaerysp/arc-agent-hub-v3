# Contributing to Arc Agent Hub

Thanks for your interest in improving Arc Agent Hub.

## Branch strategy

- `main` is always deployable — every commit on `main` should pass `npm run build`, `npm run lint`, and `npm test`.
- Work happens on short-lived feature branches off `main` (e.g. `feature/trust-center-polish`, `fix/wallet-balance-refresh`). This repo's own v7 redesign work happened on `feature/v7-premium-ui` before merging.
- Open a Pull Request against `main` when a branch is ready for review; avoid long-lived branches that drift far from `main`.

## Development setup

```bash
git clone https://github.com/Jaehaerysp/arc-agent-hub-v3.git
cd arc-agent-hub
npm install
npm run dev
```

Before opening a PR, all of the following must pass:

```bash
npm run build
npm run lint
npm test
```

## Adding a feature page

1. Create `src/features/<name>/<Name>Page.jsx`.
2. Register it in `src/app/nav.js` (this drives both the sidebar and the router).
3. Add the route in `src/app/App.jsx` as a `React.lazy` import.
4. Reuse existing primitives from `src/ui/` rather than writing new one-off markup — check there before adding a new component.

## Working with contracts (ERC-8004: Identity, Reputation, Validation, ANV)

- Never hardcode a contract address or ABI fragment inside a feature file. Add it to `src/contracts/registry.js` (and `src/contracts/abis/` if it's a new contract) and import from there.
- Never hardcode chain id / RPC / explorer URL. Import from `src/chains/arc.js`.
- Use `useContractWrite` for any write transaction so loading/error/success state and activity logging stay consistent across features.
- The Reputation and Validation registries have no getters — only `giveFeedback()` and `validationRequest()`. The Trust Center (`src/features/trust/`) derives all of its scores/charts from the local wallet activity log rather than an on-chain read; keep that pattern (and its documentation in `trustAnalytics.js`) in mind if you touch that feature.

## Working with the ERC-8183 job lifecycle

- Business logic lives in `src/lib/blockchain/` (`constants.js`, `abis.js`, `contracts.js`, `helpers.js`, `jobs.js`) — call these functions from feature pages/hooks rather than constructing `ethers.Contract` instances inline in a component.
- Every write function in `jobs.js` takes a `signer`. Always pass the connected wallet's signer from `useWalletContext()` — never a raw private key or a server-held wallet, even for testing.
- Chain id / RPC / explorer still come from `src/chains/arc.js`; `lib/blockchain/constants.js` only adds the ERC-8183-specific addresses (Agentic Commerce, USDC).
- **Yes, this is a different pattern from `src/contracts/registry.js` above.** That's intentional and documented in `ARCHITECTURE.md` ("A note on contract-access patterns") — the Jobs feature's addresses/ABIs are kept traceable back to the verified ERC-8183 SDK they came from. Don't "fix" this by merging the two without discussing it first; it's a scoped decision, not an oversight.

## Working with the Agent Marketplace

- The agent catalog (`src/data/agents.js`) is intentionally static — the ERC-8004 registry ABI can't yet enumerate registered identities on-chain. Don't try to replace it with a live contract read unless you've found a genuine on-chain (or indexer/subgraph) discovery method; see `docs/MARKETPLACE.md`.
- If you do wire up real discovery, keep the same shape `getAgentByWallet()`/`AGENTS[]` currently provide (or introduce a `useAgents()` hook with the same loading/error/data/refresh shape as `useBalances`/`useJobs`) so `AgentGrid`, `AgentCard`, and `AgentProfileCard` don't need to change.

## Testing

- Tests live next to the code they cover (`format.test.js` beside `format.js`), using Vitest + React Testing Library.
- Cover new pure logic (formatters, `compute*Stats()`-style aggregations, data lookups) with unit tests.
- Don't feel obligated to test `ethers.Contract` calls, wallet interaction, or anything in `src/contracts/`/`src/lib/blockchain/` as part of an unrelated change — that requires provider/signer mocking and is tracked separately in `docs/PROJECT_ROADMAP.md`.
- Run `npm test` locally before opening a PR.

## Style

- Follow the existing design tokens in `src/styles/tokens.css` — don't introduce one-off colors.
- Keep components small and colocated with their feature; only promote something to `src/ui/` once it's used by two or more features.
- Run `npm run build` before opening a PR — the build must succeed with no errors.

## Commit messages

Use short, imperative messages (`Fix double giveFeedback call`, `Add ANV max button`), and group related changes into a single commit where possible.

## Pull requests

Describe what changed and why, and call out any behavior differences a reviewer should verify manually (wallet connect, agent registration, hiring an agent, reputation submission, validation request, transfer, network switch).
