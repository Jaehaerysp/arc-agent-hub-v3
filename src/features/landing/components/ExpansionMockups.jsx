import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { IconCheck, IconArrowUpRight, IconSwap } from '../../../ui/icons'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { usePreviewCard } from '../../../hooks/usePreviewCard'
import { MockChrome } from './ShowcaseMockups'
import { staggerList, staggerItem, staggerItemLeft } from './showcaseMotion'
import { TRUST_CENTER_ITEMS, DEV_CODE_SNIPPET, ARCHITECTURE_LAYERS } from '../landing.data'

/**
 * Phase 3 preview components — same construction rules as
 * ShowcaseMockups.jsx: real React markup + CSS only, wrapped by the
 * caller's "Preview" label + aria-hidden, representative (not live) data.
 * Styles live in landing.css under "Phase 3 — expansion previews".
 */

// --- Treasury Suite: one small animated preview per feature card ---

function TreasuryWalletPreview() {
  return (
    <div className="trs-preview trs-preview-wallet">
      <div className="trs-wallet-balance">
        <AnimatedCounter value={1284.3} decimals={1} duration={1200} /> <small>ANV</small>
      </div>
      <div className="trs-mini-chart">
        {[30, 55, 40, 70, 50, 65, 45].map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function TreasuryTransferPreview() {
  return (
    <div className="trs-preview trs-preview-transfer">
      <span className="trs-address-chip">0x7f3a&hellip;e91c</span>
      <span className="trs-transfer-track" aria-hidden="true">
        <span className="trs-transfer-dot" />
      </span>
      <span className="trs-address-chip">0x2c1b&hellip;44a0</span>
    </div>
  )
}

function TreasuryPaymentsPreview() {
  return (
    <div className="trs-preview trs-preview-payments">
      <div className="trs-invoice-row">
        <span>Job payout &middot; data-labeling-042</span>
        <span className="trs-invoice-amount">12 ANV</span>
      </div>
      <div className="trs-invoice-status">
        <span className="trs-invoice-check"><IconCheck width={11} height={11} /></span> Settled
      </div>
    </div>
  )
}

function TreasuryBridgePreview() {
  return (
    <div className="trs-preview trs-preview-bridge">
      <span className="mock-chip">Arc Testnet</span>
      <span className="trs-bridge-track" aria-hidden="true">
        <span className="trs-bridge-dot" />
      </span>
      <span className="mock-chip">Base Sepolia</span>
    </div>
  )
}

function TreasurySwapPreview() {
  return (
    <div className="trs-preview trs-preview-swap">
      <div className="trs-swap-row">
        <span>ANV</span>
        <AnimatedCounter value={38.2} decimals={1} duration={1000} />
      </div>
      <span className="trs-swap-icon"><IconSwap width={14} height={14} /></span>
      <div className="trs-swap-row">
        <span>USDC</span>
        <AnimatedCounter value={41.6} decimals={1} duration={1000} />
      </div>
    </div>
  )
}

const TREASURY_PREVIEWS = {
  Wallet: TreasuryWalletPreview,
  Transfer: TreasuryTransferPreview,
  Payments: TreasuryPaymentsPreview,
  Bridge: TreasuryBridgePreview,
  Swap: TreasurySwapPreview,
}

export function TreasuryFeatureCard({ feature, index }) {
  const shouldReduceMotion = useReducedMotion()
  const { ref, entered } = usePreviewCard()
  const Preview = TREASURY_PREVIEWS[feature.title]
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      className="trs-card glass-panel glass-panel-interactive"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? undefined : entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.25 } }}
    >
      <span className="trs-card-icon"><Icon width={18} height={18} /></span>
      <h4 className="trs-card-title">{feature.title}</h4>
      <p className="trs-card-desc">{feature.desc}</p>
      {Preview ? <Preview /> : null}
      <Link to={feature.href} className="trs-card-link">
        Open {feature.title} <IconArrowUpRight width={12} height={12} />
      </Link>
    </motion.div>
  )
}

// --- Trust Center: single verification-dashboard style preview ---

export function TrustCenterMock() {
  const shouldReduceMotion = useReducedMotion()
  const { ref, entered, onScreen } = usePreviewCard({ tilt: true, tiltMax: 2.5 })
  const screenClass = ['mock-screen', 'mock-trust', entered && 'is-entered', onScreen && 'is-onscreen']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={screenClass} ref={ref}>
      <span className="mock-cursor-glow" aria-hidden="true" />
      <MockChrome>app.arc-agent-hub.xyz/trust</MockChrome>
      <div className="mock-body">
        <div className="mock-score-row">
          <div className={`mock-score-ring${entered ? ' is-entered' : ''}`} style={{ '--pct': '96%' }}>
            <AnimatedCounter value={96} duration={1300} className="mock-score-value" />
          </div>
          <div className="mock-score-meta">
            <div className="mock-score-label">Overall Trust Score</div>
            <div className="mock-score-trend"><IconArrowUpRight width={12} height={12} /> +2 this month</div>
          </div>
        </div>

        <motion.div
          className="tcp-check-list"
          variants={shouldReduceMotion ? undefined : staggerList({ staggerChildren: 0.09 })}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : entered ? 'show' : 'hidden'}
        >
          {TRUST_CENTER_ITEMS.map((item) => (
            <motion.div className="tcp-check-item" key={item.title} variants={shouldReduceMotion ? undefined : staggerItemLeft}>
              <span className="tcp-check-icon"><item.icon width={13} height={13} /></span>
              <span className="tcp-check-label">{item.title}</span>
              <span className="mock-chip mock-chip-verified"><IconCheck width={10} height={10} /> Verified</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// --- Developer Experience: code + console preview ---

const CONSOLE_LINES = [
  { type: 'in', text: '> registry.get(IDENTITY_REGISTRY)' },
  { type: 'out', text: '{ address: "0x8004...4BD9e", abi: [...] }' },
  { type: 'in', text: '> identity.register(agentUri)' },
  { type: 'out', text: 'tx confirmed \u00b7 block #482,910' },
]

export function DevConsoleMock() {
  const shouldReduceMotion = useReducedMotion()
  const { ref, entered, onScreen } = usePreviewCard({ tilt: true, tiltMax: 2 })
  const screenClass = ['mock-screen', 'mock-dev', entered && 'is-entered', onScreen && 'is-onscreen']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={screenClass} ref={ref}>
      <MockChrome>arc-agent-hub &middot; dev console</MockChrome>
      <div className="mock-body dev-body">
        <pre className="dev-code"><code>{DEV_CODE_SNIPPET}</code></pre>
        <motion.div
          className="dev-console"
          variants={shouldReduceMotion ? undefined : staggerList({ staggerChildren: 0.14, delayChildren: 0.1 })}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : entered ? 'show' : 'hidden'}
        >
          {CONSOLE_LINES.map((line, i) => (
            <motion.div
              className={`dev-console-line dev-console-${line.type}`}
              key={i}
              variants={shouldReduceMotion ? undefined : staggerItem}
            >
              {line.text}
            </motion.div>
          ))}
          <span className="dev-console-caret" aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  )
}

// --- Platform Architecture: layered flow diagram ---

export function ArchitectureDiagram() {
  const shouldReduceMotion = useReducedMotion()
  const { ref, entered } = usePreviewCard()

  return (
    <div className="arch-diagram" ref={ref}>
      {ARCHITECTURE_LAYERS.map((layer, i) => (
        <div className="arch-row" key={layer.title}>
          <motion.div
            className={`arch-node${i === 0 ? ' arch-node-root' : ''}${i === ARCHITECTURE_LAYERS.length - 1 ? ' arch-node-leaf' : ''}`}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? undefined : entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="arch-node-title">{layer.title}</span>
            <span className="arch-node-desc">{layer.desc}</span>
          </motion.div>
          {i < ARCHITECTURE_LAYERS.length - 1 && (
            <span className={`arch-connector${entered ? ' is-entered' : ''}`} aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}
