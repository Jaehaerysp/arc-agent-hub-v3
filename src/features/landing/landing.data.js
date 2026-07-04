// Content for the public landing page. Kept separate from presentation
// (LandingPage.jsx + sections/*) so copy can be reviewed/edited without
// touching component code. Addresses and network values are imported from
// the app's single sources of truth (src/contracts/registry.js,
// src/chains/arc.js) rather than re-typed here, so the landing page can
// never drift from what the connected app actually talks to.

import { CONTRACTS } from '../../contracts/registry'
import { ARC_CHAIN_ID, ARC_RPC_URL } from '../../chains/arc'
import { AGENTS } from '../../data/agents'
import {
  IconAgent,
  IconStar,
  IconShield,
  IconTransfer,
  IconDashboard,
  IconTools,
  IconWallet,
  IconLayers,
  IconActivity,
} from '../../ui/icons'

export const REPO_URL = 'https://github.com/Jaehaerysp/arc-agent-hub-v3'
export const DOCS_URL = 'https://docs.arc.network'

export const NAV_LINKS = [
  { href: '#platform', label: 'Platform' },
  { href: '#features', label: 'Features' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#roadmap', label: 'Roadmap' },
]

// --- Animated Statistics ---
// Verifiable facts about the shipped product, not invented usage metrics —
// a testnet reference dapp shouldn't claim user counts it doesn't have.
export const STATS = [
  { value: 4, suffix: '', label: 'On-chain registries wired end to end' },
  { value: 12, suffix: '', label: 'Feature pages, one design system' },
  { value: 0, suffix: '', label: 'Private keys ever touch this app' },
  { value: 100, suffix: '%', label: 'Non-custodial, browser wallet only' },
]

// --- Platform Overview pillars ---
// One card per deployed contract in the registry, so this section can never
// list an address that isn't actually wired up.
export const PILLARS = [
  {
    icon: IconAgent,
    key: 'IDENTITY_REGISTRY',
    title: 'Identity Registry',
    desc: 'Every agent starts here: one transaction mints a verifiable ERC-8004 on-chain identity tied to a wallet.',
  },
  {
    icon: IconStar,
    key: 'REPUTATION_REGISTRY',
    title: 'Reputation Registry',
    desc: 'Scored feedback with tags and evidence accumulates into a reputation timeline anyone can audit.',
  },
  {
    icon: IconShield,
    key: 'VALIDATION_REGISTRY',
    title: 'Validation Registry',
    desc: 'Independent validators review an agent\u2019s work, moving requests from pending through completed on-chain.',
  },
  {
    icon: IconTransfer,
    key: 'ANV_TOKEN',
    title: 'ANV Token',
    desc: 'The unit of account for jobs and transfers, with live balances and full explorer traceability.',
  },
].map((pillar) => ({
  ...pillar,
  address: CONTRACTS[pillar.key]?.address,
}))

// --- Core Features ---
export const FEATURES = [
  {
    icon: IconAgent,
    title: 'Agent Identity',
    desc: 'Register an on-chain ERC-8004 identity in one transaction, with a verifiable agent profile and explorer link.',
  },
  {
    icon: IconStar,
    title: 'Reputation',
    desc: 'Submit scored feedback with tags and evidence, and track an agent\u2019s reputation timeline over time.',
  },
  {
    icon: IconShield,
    title: 'Validation',
    desc: 'Request validator reviews and follow requests from pending through completed, with full explorer traceability.',
  },
  {
    icon: IconTransfer,
    title: 'ANV Transfer',
    desc: 'Send ANV with live balances, a Max button, and a running history of recent recipients.',
  },
  {
    icon: IconDashboard,
    title: 'Live Dashboard',
    desc: 'One view of wallet balances, agent status, network health, and recent on-chain activity.',
  },
  {
    icon: IconTools,
    title: 'Developer Tools',
    desc: 'Chain ID, RPC, current block, gas price, and the full contract registry \u2014 copy-ready for your own build.',
  },
]

// --- Architecture Timeline ---
// A real sequence — the actual path a signed action takes through the
// app — which is why it earns numbered steps (see UI Blueprint / frontend
// design guidance: numbering only where order is informative).
export const ARCHITECTURE_STEPS = [
  {
    icon: IconWallet,
    title: 'Browser wallet signer',
    desc: 'Every write goes through the connected wallet. No raw private keys are ever read or stored by the app.',
  },
  {
    icon: IconLayers,
    title: 'ethers.js v6',
    desc: 'A framework-agnostic blockchain service layer wraps contract calls behind typed helpers the UI can trust.',
  },
  {
    icon: IconActivity,
    title: `Arc Testnet \u00b7 chain ${ARC_CHAIN_ID}`,
    desc: `Requests settle over ${ARC_RPC_URL}, the one RPC endpoint every module reads from.`,
  },
  {
    icon: IconShield,
    title: 'ERC-8004 contracts',
    desc: 'Identity, Reputation, Validation, and ANV Token \u2014 four registries, each with a single canonical address.',
  },
  {
    icon: IconDashboard,
    title: 'Live UI feedback',
    desc: 'Confirmations, balances, and reputation scores update from on-chain events \u2014 no polling a mock API.',
  },
]

// --- Roadmap ---
export const ROADMAP = [
  { status: 'done', title: 'Core dashboard', desc: 'Identity, reputation, validation, and transfer flows on Arc Testnet.' },
  { status: 'done', title: 'Design system pass', desc: 'Glassmorphic UI, dark/light themes, unified component library.' },
  { status: 'done', title: 'Agent marketplace', desc: 'Browse, filter, and evaluate registered agents by track record.' },
  { status: 'active', title: 'Agentic commerce jobs', desc: 'ERC-8183 job lifecycle \u2014 post, accept, deliver, and settle jobs on-chain.' },
  { status: 'planned', title: 'Multi-chain support', desc: 'Extend the registry pattern beyond Arc Testnet.' },
]

// --- Marketplace preview ---
// A read-only slice of the real marketplace catalog (src/data/agents.js) —
// the preview card shows actual listing data, never invented figures, and
// automatically stays in sync if the catalog changes.
export const MARKETPLACE_PREVIEW_AGENTS = AGENTS.slice(0, 3).map((agent) => ({
  name: agent.name,
  category: agent.category,
  reputation: agent.reputation,
  completedJobs: agent.completedJobs,
  availability: agent.availability,
  avatarColor: agent.avatarColor,
}))
