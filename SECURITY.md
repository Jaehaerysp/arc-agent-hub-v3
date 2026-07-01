# Security Policy

Arc Agent Hub is a client-side, non-custodial dApp: it never holds private
keys or funds itself, and every transaction is signed by the user's own
wallet (MetaMask, Rabby, etc.). Still, we take security issues seriously —
especially anything that could put a user's wallet or funds at risk.

## Reporting a vulnerability

If you find a security issue — for example, something that could trick a
user into signing a malicious transaction, leak wallet data, or allow
injection of arbitrary script into the app — please **do not open a public
issue**. Instead:

1. Open a private security advisory on GitHub (`Security` tab → `Report a
   vulnerability`), or
2. Email the maintainers with a description of the issue, steps to
   reproduce, and its potential impact.

Please include:

- The affected page/component and, if possible, a minimal reproduction
- What you'd expect to happen vs. what actually happens
- Whether the issue depends on a specific wallet, network, or browser

We aim to acknowledge reports within a few days and will credit reporters
in the changelog once a fix ships, unless you'd prefer to stay anonymous.

## Scope

In scope:

- The Arc Agent Hub frontend (`src/`) — XSS, dependency vulnerabilities,
  unsafe handling of wallet data, misleading transaction prompts, etc.

Out of scope:

- The ERC-8004 smart contracts themselves (Identity/Reputation/Validation
  registries, ANV token) — these are deployed independently; report
  contract-level issues to the Arc/Circle team directly.
- Issues that require physical access to a user's device or an already
  compromised wallet.

## Supported versions

Only the latest `main` branch is actively maintained and receives security
fixes.
