import { motion, useReducedMotion } from 'motion/react'
import {
  IconShield,
  IconStar,
  IconCheck,
  IconActivity,
  IconClock,
  IconFilter,
  IconSearch,
  IconWallet,
  IconJob,
  IconArrowUpRight,
  IconTransfer,
} from '../../../ui/icons'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { usePreviewCard } from '../../../hooks/usePreviewCard'
import { useTypewriterLoop } from '../../../hooks/useTypewriterLoop'
import { staggerList, staggerItem, staggerItemLeft } from './showcaseMotion'

/**
 * Showcase mockups — small, self-contained illustrations of what each
 * part of Arc Agent Hub actually looks like, built from real React
 * markup + CSS (no images, no canvas). All data here is representative,
 * not live — every instance is wrapped in the "Preview" label already
 * present in FeatureShowcase.jsx and marked aria-hidden, matching the
 * same "clearly a mock, not a claimed screenshot" convention the rest of
 * the landing page's illustrations use (see MissionQuote's SVG, the
 * showcase frame label). Field names (ANV, ERC-8004, Arc Testnet, chain
 * 5042002) reuse the app's real vocabulary from landing.data.js /
 * chains/arc.js so the mock doesn't invent a different product.
 *
 * On top of the static markup, each preview now runs a small set of
 * "feels alive" animations (count-up numbers, staggered reveals, an
 * idle float, a cursor-following glow/tilt) via usePreviewCard +
 * useTypewriterLoop and the shared Motion variants in showcaseMotion.js
 * — see the CSS block in landing.css ("Showcase preview animations")
 * for the continuous/looping half of this (badge pulse, status dots,
 * bar growth, ring fill), which is cheaper to run as plain CSS than as
 * per-frame React state.
 */

const SEARCH_PHRASES = ['Search...', 'Search agents...', 'Search AI...', 'Search builders...']

export function MockChrome({ children }) {
  return (
    <div className="mock-chrome">
      <span className="mock-chrome-dot" />
      <span className="mock-chrome-dot" />
      <span className="mock-chrome-dot" />
      <span className="mock-chrome-url">{children}</span>
    </div>
  )
}

export function IdentityReputationMock() {
  const shouldReduceMotion = useReducedMotion()
  const { ref, entered, onScreen } = usePreviewCard({ tilt: true, tiltMax: 3 })
  const screenClass = ['mock-screen', 'mock-identity', entered && 'is-entered', onScreen && 'is-onscreen']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={screenClass} ref={ref}>
      <span className="mock-cursor-glow" aria-hidden="true" />
      <MockChrome>app.arc-agent-hub.xyz/agents/0x7f3a&hellip;e91c</MockChrome>
      <div className="mock-body">
        <div className="mock-identity-head">
          <div className="mock-avatar mock-avatar-grad" />
          <div className="mock-identity-head-text">
            <div className="mock-identity-name">
              agent-0x7f3a.eth
              <span className="mock-chip mock-chip-verified"><IconCheck width={11} height={11} /> Verified</span>
            </div>
            <div className="mock-identity-sub">ERC-8004 Identity &middot; Registered on Arc Testnet</div>
          </div>
        </div>

        <div className="mock-score-row">
          <div className={`mock-score-ring${entered ? ' is-entered' : ''}`} style={{ '--pct': '92%' }}>
            <AnimatedCounter value={92} duration={1300} className="mock-score-value" />
          </div>
          <div className="mock-score-meta">
            <div className="mock-score-label">Reputation Score</div>
            <div className="mock-score-trend"><IconArrowUpRight width={12} height={12} /> +4 this week</div>
            <div className="mock-badge-row">
              <span className="mock-chip"><IconShield width={11} height={11} /> Validated</span>
              <span className="mock-chip">
                <IconStar width={11} height={11} /> <AnimatedCounter value={128} duration={1100} /> reviews
              </span>
            </div>
          </div>
        </div>

        <motion.div
          className="mock-timeline"
          variants={shouldReduceMotion ? undefined : staggerList()}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : entered ? 'show' : 'hidden'}
        >
          <motion.div className="mock-timeline-item" variants={shouldReduceMotion ? undefined : staggerItem}>
            <span className="mock-timeline-dot is-accent" />
            <div>
              <div className="mock-timeline-title">Validation passed &middot; data-labeling-042</div>
              <div className="mock-timeline-time">2h ago</div>
            </div>
          </motion.div>
          <motion.div className="mock-timeline-item" variants={shouldReduceMotion ? undefined : staggerItem}>
            <span className="mock-timeline-dot" />
            <div>
              <div className="mock-timeline-title">Reputation score updated <em>+4</em></div>
              <div className="mock-timeline-time">1d ago</div>
            </div>
          </motion.div>
          <motion.div className="mock-timeline-item" variants={shouldReduceMotion ? undefined : staggerItem}>
            <span className="mock-timeline-dot" />
            <div>
              <div className="mock-timeline-title">Identity registered on-chain</div>
              <div className="mock-timeline-time">14d ago</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

const MARKET_AGENTS = [
  { name: 'vision-labeler-09', category: 'Data', price: '12 ANV / job', score: 4.9, status: 'available' },
  { name: 'yield-router-x', category: 'DeFi', price: '38 ANV / job', score: 4.7, status: 'busy' },
  { name: 'copy-editor-ai', category: 'Content', price: '6 ANV / job', score: 4.8, status: 'available' },
  { name: 'flow-orchestrator', category: 'Automation', price: '21 ANV / job', score: 4.6, status: 'available' },
]

export function MarketplaceMock() {
  const shouldReduceMotion = useReducedMotion()
  const { ref, entered, onScreen } = usePreviewCard()
  const typedSearch = useTypewriterLoop(SEARCH_PHRASES, { active: onScreen })
  const screenClass = ['mock-screen', 'mock-marketplace', entered && 'is-entered', onScreen && 'is-onscreen']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={screenClass} ref={ref}>
      <MockChrome>app.arc-agent-hub.xyz/agents</MockChrome>
      <div className="mock-body">
        <motion.div
          className="mock-filter-row"
          variants={shouldReduceMotion ? undefined : staggerList({ staggerChildren: 0.08 })}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : entered ? 'show' : 'hidden'}
        >
          <motion.span className="mock-chip mock-chip-filter is-active" variants={shouldReduceMotion ? undefined : staggerItemLeft}>
            <IconFilter width={11} height={11} /> All
          </motion.span>
          <motion.span className="mock-chip mock-chip-filter" variants={shouldReduceMotion ? undefined : staggerItemLeft}>Data</motion.span>
          <motion.span className="mock-chip mock-chip-filter" variants={shouldReduceMotion ? undefined : staggerItemLeft}>DeFi</motion.span>
          <motion.span className="mock-chip mock-chip-filter" variants={shouldReduceMotion ? undefined : staggerItemLeft}>Content</motion.span>
          <span className="mock-search">
            <IconSearch width={12} height={12} /> {typedSearch}
            <span className="mock-search-caret" aria-hidden="true" />
          </span>
        </motion.div>

        <motion.div
          className="mock-market-grid"
          variants={shouldReduceMotion ? undefined : staggerList({ staggerChildren: 0.1, delayChildren: 0.05 })}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : entered ? 'show' : 'hidden'}
        >
          {MARKET_AGENTS.map((agent) => (
            <div className="mock-market-card" key={agent.name}>
              <div className="mock-market-card-head">
                <div className="mock-avatar mock-avatar-sm mock-avatar-grad" />
                <div>
                  <div className="mock-market-name">{agent.name}</div>
                  <div className="mock-market-category">{agent.category}</div>
                </div>
                <span className={`mock-status-dot mock-status-${agent.status}`} />
              </div>
              <div className="mock-market-card-foot">
                <span className="mock-market-price">{agent.price}</span>
                <span className="mock-market-score">
                  <IconStar width={11} height={11} /> <AnimatedCounter value={agent.score} decimals={1} duration={900} />
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export function DashboardMock() {
  const { ref, entered, onScreen } = usePreviewCard({ tilt: true, tiltMax: 1.5 })
  const bars = [38, 62, 45, 80, 55, 70, 48]
  const screenClass = ['mock-screen', 'mock-dashboard', entered && 'is-entered', onScreen && 'is-onscreen']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={screenClass} ref={ref}>
      <span className="mock-cursor-glow" aria-hidden="true" />
      <MockChrome>app.arc-agent-hub.xyz/dashboard</MockChrome>
      <div className="mock-body">
        <div className="mock-stat-row">
          <div className="mock-stat">
            <span className="mock-stat-icon"><IconWallet width={13} height={13} /></span>
            <div>
              <div className="mock-stat-label">Wallet Balance</div>
              <div className="mock-stat-value">
                <AnimatedCounter value={1240.5} decimals={1} duration={1400} /> <small>ANV</small>
              </div>
            </div>
          </div>
          <div className="mock-stat">
            <span className="mock-stat-icon"><IconActivity width={13} height={13} /></span>
            <div>
              <div className="mock-stat-label">Active Agents</div>
              <div className="mock-stat-value"><AnimatedCounter value={3} duration={900} /></div>
            </div>
          </div>
          <div className="mock-stat">
            <span className="mock-stat-icon"><IconJob width={13} height={13} /></span>
            <div>
              <div className="mock-stat-label">Open Jobs</div>
              <div className="mock-stat-value"><AnimatedCounter value={7} duration={1000} /></div>
            </div>
          </div>
        </div>

        <div className="mock-chart-row">
          <div className="mock-chart">
            {bars.map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <ul className="mock-tx-list">
            <li>
              <IconTransfer width={12} height={12} />
              <span>Job payment received</span>
              <em className="is-positive">+12 ANV</em>
            </li>
            <li>
              <IconShield width={12} height={12} />
              <span>Validation reward</span>
              <em className="is-positive">+3 ANV</em>
            </li>
            <li>
              <IconClock width={12} height={12} />
              <span>Job queued &middot; data-labeling-043</span>
              <em>pending</em>
            </li>
          </ul>
        </div>

        <div className="mock-network-row">
          <span className="dot-live" /> Arc Testnet &middot; Chain 5042002 &middot; Operational
        </div>
      </div>
    </div>
  )
}
