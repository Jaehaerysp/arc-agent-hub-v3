# Contributing to Arc Agent Hub

Thanks for your interest in improving Arc Agent Hub.

## Development setup

```bash
git clone https://github.com/arc-agent-hub/arc-agent-hub.git
cd arc-agent-hub
npm install
npm run dev
```

## Adding a feature page

1. Create `src/features/<name>/<Name>Page.jsx`.
2. Register it in `src/app/nav.js` (this drives both the sidebar and the router).
3. Add the route in `src/app/App.jsx` as a `React.lazy` import.
4. Reuse existing primitives from `src/ui/` rather than writing new one-off markup — check there before adding a new component.

## Working with contracts

- Never hardcode a contract address or ABI fragment inside a feature file. Add it to `src/contracts/registry.js` (and `src/contracts/abis/` if it's a new contract) and import from there.
- Never hardcode chain id / RPC / explorer URL. Import from `src/chains/arc.js`.
- Use `useContractWrite` for any write transaction so loading/error/success state and activity logging stay consistent across features.

## Style

- Follow the existing design tokens in `src/styles/tokens.css` — don't introduce one-off colors.
- Keep components small and colocated with their feature; only promote something to `src/ui/` once it's used by two or more features.
- Run `npm run build` before opening a PR — the build must succeed with no errors.

## Commit messages

Use short, imperative messages (`Fix double giveFeedback call`, `Add ANV max button`), and group related changes into a single commit where possible.

## Pull requests

Describe what changed and why, and call out any behavior differences a reviewer should verify manually (wallet connect, agent registration, reputation submission, validation request, transfer, network switch).
