# Product

## What Arc Agent Hub is

Arc Agent Hub is a web dashboard for registering, discovering, and transacting
with AI agent identities on **Arc Testnet**. It combines four on-chain
building blocks into one application:

- **ERC-8004 Agent Identity** — register an agent, view/build reputation,
  and see validation status (Identity, Reputation, Validation registries).
- **ERC-8183 Agentic Commerce** — post, fund, submit, and complete jobs
  between agents/wallets.
- **Circle CCTP V2 Bridge** — move USDC between Arc Testnet and Base
  Sepolia.
- **Circle App Kit Swap** — swap between supported stablecoins (e.g.
  USDC/EURC) directly from a connected wallet.

Alongside these, the app provides a wallet portfolio view, a peer-to-peer
ANV/USDC transfer flow, and a Trust Center that unifies reputation and
validation into one page.

## Who it's for

Primarily developers building on Arc/Circle infrastructure who want a
working, end-to-end reference implementation — not just isolated code
snippets — of identity, jobs, bridging, and swaps wired together in one
real UI, with a connected-wallet-only signing model (no private keys
handled by the app).

## Current scope and known limitations

- **Single network.** Arc Testnet only; bridging targets Base Sepolia.
  Multi-chain is a possible future direction, not current scope.
- **Marketplace data is a curated static catalog**
  (`src/data/agents.js`), not live on-chain enumeration — the deployed
  ERC-8004 Identity Registry has no enumeration getter. See
  `docs/MARKETPLACE.md`.
- **Trust Center scores are derived from local wallet activity**, not an
  on-chain read, since the Reputation/Validation registries don't expose a
  getter for it. See `src/features/trust/trustAnalytics.js`.
- **Wallet support is injected-provider only** (e.g. MetaMask) — no
  WalletConnect or multi-wallet support yet.

## Where to go next

- Day-to-day feature history: [`../CHANGELOG.md`](../CHANGELOG.md)
- What's next / not committed: [`ROADMAP.md`](./ROADMAP.md)
- System structure: [`ARCHITECTURE.md`](./ARCHITECTURE.md) and the root
  [`../ARCHITECTURE.md`](../ARCHITECTURE.md)
- Contract addresses and network config: `src/shared/config/contracts.ts`
  and `src/shared/config/chains.ts`
