// Content for the public landing page. Kept separate from presentation
// (LandingPage.jsx + sections/*) so copy can be reviewed/edited without
// touching component code. Addresses and network values are imported from
// the app's single sources of truth (src/contracts/registry.js,
// src/chains/arc.js) rather than re-typed here, so the landing page can
// never drift from what the connected app actually talks to.

import { CONTRACTS } from '../../contracts/registry'
import { ARC_RPC_URL } from '../../chains/arc'
import {
  IconAgent,
  IconStar,
  IconShield,
  IconTransfer,
  IconDashboard,
  IconTools,
  IconWallet,
  IconLayers,
  IconBridge,
  IconSwap,
  IconBriefcase,
  IconCheck,
  IconBook,
  IconActivity,
  IconZap,
} from '../../ui/icons'

export const REPO_URL = 'https://github.com/Jaehaerysp/arc-agent-hub-v8'
export const DOCS_URL = 'https://docs.arc.network'

export const NAV_LINKS = [
  { href: '#platform', label: 'Platform' },
  { href: '#features', label: 'Features' },
  { href: '#community', label: 'Community' },
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

// --- Marquee strip ---
// Module preview chips for the infinite scroll strip. These are icon +
// label cards, not screenshots — nothing here claims to be a literal
// product photo, so there's nothing to keep in sync or risk overstating.
export const MARQUEE_MODULES = [
  { icon: IconAgent, label: 'Identity Registry' },
  { icon: IconStar, label: 'Reputation Registry' },
  { icon: IconShield, label: 'Validation Registry' },
  { icon: IconTransfer, label: 'ANV Transfer' },
  { icon: IconDashboard, label: 'Live Dashboard' },
  { icon: IconLayers, label: 'Marketplace' },
  { icon: IconTools, label: 'Developer Tools' },
  { icon: IconWallet, label: 'Wallet Connect' },
]

// --- Mission quote ---
// First-person-plural statement from the project itself, not attributed to
// an invented individual or a fabricated customer endorsement.
export const MISSION_QUOTE = 'We wanted a reference implementation that took ERC-8004 seriously — one you could actually read, run, and verify on-chain, not just a pitch deck.'

// Real technologies the app is actually built on (verifiable in package.json),
// standing in for the "partner logos" row — nothing here is a claimed client.
export const BUILT_WITH = ['Arc Testnet', 'ERC-8004', 'ethers.js', 'React']

// --- Platform Modules (replaces pricing cards) ---
export const PLATFORM_MODULES = [
  {
    tone: 'dark',
    title: 'Core Registries',
    desc: 'The four on-chain contracts every agent interaction runs through.',
    tag: 'Open source \u00b7 MIT licensed',
    items: PILLARS.map((p) => p.title),
    primaryHref: '/dashboard',
    primaryLabel: 'Launch App',
    secondaryHref: DOCS_URL,
    secondaryLabel: 'How it works',
  },
  {
    tone: 'light',
    title: 'Builder Tools',
    desc: 'Everything wrapped around the registries so you can ship on top of them.',
    tag: 'Non-custodial \u00b7 browser wallet only',
    items: ['Live Dashboard', 'Agent Marketplace', 'Developer Tools', 'Full Documentation'],
    primaryHref: REPO_URL,
    primaryLabel: 'View source',
  },
]

// --- Community & Ecosystem (replaces client testimonial carousel) ---
// Principles the project actually holds itself to, rather than invented
// third-party endorsements standing in for social proof it doesn't have.
export const ECOSYSTEM_PRINCIPLES = [
  { title: 'Open Source', desc: 'The full stack \u2014 contracts, dashboard, and this landing page \u2014 is public and MIT licensed.' },
  { title: 'Non-Custodial', desc: 'Every signed action goes through your own browser wallet. The app never touches a private key.' },
  { title: 'ERC-8004 Native', desc: 'Identity, reputation, and validation follow the standard directly \u2014 no proprietary detour.' },
  { title: 'Single Source of Truth', desc: 'Contract addresses and chain config live in one place, and every page reads from it.' },
  { title: 'Testnet First', desc: 'Built on Arc Testnet so the whole flow can be explored without real funds at risk.' },
]

// --- Platform Features (replaces project showcase) ---
export const FEATURE_SHOWCASE = [
  {
    title: 'Identity & Reputation',
    desc: 'Register a verifiable ERC-8004 identity, then track scored feedback as it accumulates into a reputation timeline.',
  },
  {
    title: 'Marketplace',
    desc: 'Browse registered agents, filter by category and track record, and see live availability at a glance.',
  },
  {
    title: 'Live Dashboard',
    desc: 'Wallet balances, agent status, network health, and recent on-chain activity in a single view.',
  },
]

// --- Treasury Suite ---
// Mirrors the app's real money-movement routes 1:1 (src/app/App.jsx) so this
// section can't claim a capability the connected app doesn't actually have.
export const TREASURY_FEATURES = [
  {
    icon: IconWallet,
    title: 'Wallet',
    href: '/wallet',
    desc: 'Non-custodial balances and portfolio view, read straight from your connected browser wallet.',
  },
  {
    icon: IconTransfer,
    title: 'Transfer',
    href: '/transfer',
    desc: 'Send ANV to any address in a couple of clicks, with full on-chain confirmation.',
  },
  {
    icon: IconBriefcase,
    title: 'Payments',
    href: '/payments',
    desc: 'Settle job payouts and one-off invoices without leaving the app.',
  },
  {
    icon: IconBridge,
    title: 'Bridge',
    href: '/bridge',
    desc: 'Move assets between supported networks with a guided, status-tracked bridge flow.',
  },
  {
    icon: IconSwap,
    title: 'Swap',
    href: '/swap',
    desc: 'Exchange between supported tokens at a quoted rate before you confirm.',
  },
]

// --- Trust Center ---
// Mirrors src/features/trust/TrustCenterPage.jsx (identity + reputation +
// validation + on-chain evidence, all merged into one page at /trust).
export const TRUST_CENTER_ITEMS = [
  {
    icon: IconCheck,
    title: 'Identity Verification',
    desc: 'Every agent\u2019s ERC-8004 identity is checked against the Identity Registry, not just claimed.',
  },
  {
    icon: IconStar,
    title: 'Reputation History',
    desc: 'Scored feedback builds into a timeline you can scroll back through, not a single opaque number.',
  },
  {
    icon: IconShield,
    title: 'Validation',
    desc: 'Independent validators move each request from pending to completed, visibly, on-chain.',
  },
  {
    icon: IconBook,
    title: 'Auditability',
    desc: 'Certificates and on-chain evidence back every score \u2014 nothing here is self-reported.',
  },
  {
    icon: IconActivity,
    title: 'Transparency',
    desc: 'A live security and events feed, so trust signals reflect what just happened, not a stale snapshot.',
  },
]

// --- Developer Experience ---
export const DEV_EXPERIENCE_ITEMS = [
  {
    icon: IconLayers,
    title: 'Registry SDK',
    desc: 'Typed helpers over the four core registries \u2014 identity, reputation, validation, and the ANV token.',
  },
  {
    icon: IconTools,
    title: 'React Components',
    desc: 'The same UI kit (GlassPanel, SectionHeading, Reveal, and more) this app is built with.',
  },
  {
    icon: IconZap,
    title: 'ethers.js Integration',
    desc: 'Read/write contract hooks with centralized error normalization, ready to extend.',
  },
  {
    icon: IconCheck,
    title: 'TypeScript Support',
    desc: 'Typed ABIs and contract addresses from a single registry, so integration errors surface at build time.',
  },
  {
    icon: IconAgent,
    title: 'Smart Contract APIs',
    desc: 'Direct calls into Identity, Reputation, Validation, and the ANV token \u2014 addresses never hardcoded.',
  },
  {
    icon: IconBook,
    title: 'Documentation',
    desc: 'Architecture, blockchain integration, and development guides, kept in the repo alongside the code.',
  },
]

// Representative snippet for the Developer Experience console preview \u2014
// illustrative, not copy-pasted from a real file (kept short on purpose).
export const DEV_CODE_SNIPPET = `import { CONTRACTS } from './contracts/registry'

const identity = new Contract(
  CONTRACTS.IDENTITY_REGISTRY.address,
  CONTRACTS.IDENTITY_REGISTRY.abi,
  signer
)

const tx = await identity.register(agentUri)
await tx.wait()`

// --- Platform Architecture ---
// One entry per layer, top (entry point) to bottom (network). Kept as data
// so the diagram component only handles layout, not the facts.
export const ARCHITECTURE_LAYERS = [
  { title: 'Arc Agent Hub', desc: 'Landing, dashboard, and every feature route' },
  { title: 'Identity Registry', desc: 'ERC-8004 on-chain agent identity' },
  { title: 'Reputation Registry', desc: 'Scored feedback and history' },
  { title: 'Validation Registry', desc: 'Independent request validation' },
  { title: 'Marketplace', desc: 'Browse and hire registered agents' },
  { title: 'Dashboard', desc: 'Balances, activity, network health' },
  { title: 'Wallet', desc: 'Non-custodial balances and connection' },
  { title: 'Bridge', desc: 'Cross-network asset movement' },
  { title: 'Payments', desc: 'Job payouts and settlements' },
  { title: 'Swap', desc: 'Token-to-token exchange' },
  { title: 'Arc Testnet', desc: `Chain settlement layer \u00b7 ${ARC_RPC_URL}` },
]

// --- Final CTA (JoinEcosystem) ---
export const FINAL_CTA_LINKS = [
  { label: 'Documentation', href: DOCS_URL, external: true },
  { label: 'GitHub', href: REPO_URL, external: true },
  { label: 'Marketplace', href: '/agents', external: false },
  { label: 'Developer Docs', href: '/developer-tools', external: false },
]

// --- Footer ---
export const FOOTER_LINKS = {
  platform: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Documentation', href: DOCS_URL, external: true },
  ],
  community: [
    { label: 'GitHub', href: REPO_URL, external: true },
    { label: 'Arc Testnet', href: ARC_RPC_URL, external: true },
  ],
}
