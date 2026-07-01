# Arc Agent Hub v3.0.0

**Release date:** 2026-07-01

Arc Agent Hub v3 introduces a public landing page and prepares the project for its first public, open-source release — repo metadata, contribution templates, and CI are all in place.

## Highlights

### 🖥️ Public landing page
A marketing page now lives at `/`, separate from the wallet-gated app:
- Hero section with a live-styled agent identity card
- Feature overview, dashboard preview, "why Arc Agent Hub," tech stack, and roadmap sections
- "Launch App" takes visitors straight into `/dashboard`

The dashboard and every other feature route (`/agents`, `/reputation`, `/validation`, `/transfer`, `/settings`, `/developer-tools`) are unchanged and still require a connected wallet.

### 📦 Open source readiness
- `LICENSE` (MIT), `CODE_OF_CONDUCT.md`, `SECURITY.md` added
- `README.md` rewritten with architecture diagram, screenshots/GIF placeholders, install/quick-start/deploy instructions, and a smart contract reference table
- `.gitignore` added
- Issue forms (bug report, feature request), a pull request template, and two GitHub Actions workflows (`build`, `lint`) added under `.github/`
- `package.json` filled out with description, keywords, repository/homepage/bugs URLs, author, and license

## What did *not* change

- Contract addresses, ABI signatures, RPC endpoint, and explorer URL — byte-for-byte identical to v2
- All wallet connect / register / feedback / validation / transfer logic
- The dashboard UI and every existing feature page

## Upgrading

No action needed for existing forks — pull the latest `main` and run `npm install` to pick up the new `eslint` devDependencies used by `npm run lint`.

## Full changelog

See [CHANGELOG.md](./CHANGELOG.md#v300) for the itemized diff.

---

**Contract addresses (Arc Testnet):**

| Contract | Address |
|---|---|
| Identity Registry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| Reputation Registry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| Validation Registry | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |
| ANV Token | `0x736223037D622ed365fa641a116daAcED7A5be96` |
