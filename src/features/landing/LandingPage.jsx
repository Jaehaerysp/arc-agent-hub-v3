import { Link } from 'react-router-dom'
import {
  IconDashboard,
  IconAgent,
  IconStar,
  IconShield,
  IconTransfer,
  IconTools,
  IconGithub,
  IconArrowRight,
  IconCheck,
  IconBook,
  IconLayers,
  IconZap,
  IconExternal,
} from '../../ui/icons'

const REPO_URL = 'https://github.com/arc-agent-hub/arc-agent-hub'
const DOCS_URL = 'https://docs.arc.network'

const FEATURES = [
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

const WHY = [
  {
    title: 'Single source of truth',
    desc: 'One chain config, one contract registry. No addresses or RPC URLs scattered across the codebase.',
  },
  {
    title: 'Built for Arc Testnet',
    desc: 'Native support for Arc\u2019s chain ID, RPC, and explorer \u2014 network switching handled for you.',
  },
  {
    title: 'Reference implementation',
    desc: 'A clean, feature-based React architecture meant to be read, forked, and extended by other builders.',
  },
]

const STACK = [
  { name: 'React 18', note: 'UI runtime' },
  { name: 'Vite 5', note: 'Build tooling' },
  { name: 'ethers.js v6', note: 'Chain interaction' },
  { name: 'React Router 6', note: 'Client routing' },
  { name: 'ERC-8004', note: 'Agent identity standard' },
  { name: 'Arc Testnet', note: 'Settlement network' },
]

const ROADMAP = [
  { status: 'done', title: 'Core dashboard', desc: 'Identity, reputation, validation, and transfer flows on Arc Testnet.' },
  { status: 'done', title: 'Design system pass', desc: 'Glassmorphic UI, dark/light themes, unified component library.' },
  { status: 'active', title: 'Public landing page', desc: 'A homepage for the project separate from the connected app.' },
  { status: 'planned', title: 'Agent discovery', desc: 'Browse and search registered agents across the network.' },
  { status: 'planned', title: 'Multi-chain support', desc: 'Extend the registry pattern beyond Arc Testnet.' },
]

export default function LandingPage() {
  return (
    <div className="landing">
      <LandingNav />
      <Hero />
      <LogosStrip />
      <Features />
      <DashboardPreview />
      <WhySection />
      <TechStack />
      <OpenSource />
      <Roadmap />
      <FinalCta />
      <LandingFooter />
    </div>
  )
}

function LandingNav() {
  return (
    <header className="landing-nav">
      <div className="landing-shell landing-nav-row">
        <a href="#top" className="landing-brand">
          <span className="brand-mark">ARC</span>
          <span className="landing-brand-text">Arc Agent Hub</span>
        </a>
        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#roadmap">Roadmap</a>
          <a href={DOCS_URL} target="_blank" rel="noreferrer">Documentation</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        <div className="landing-nav-actions">
          <a className="btn btn-ghost btn-sm" href={REPO_URL} target="_blank" rel="noreferrer">
            <IconGithub width={15} height={15} /> Star
          </a>
          <Link to="/dashboard" className="btn btn-primary btn-sm">
            Launch App <IconArrowRight width={14} height={14} />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="landing-hero">
      <div className="landing-shell landing-hero-grid">
        <div className="landing-hero-copy">
          <span className="landing-eyebrow">
            <span className="dot-live" /> Live on Arc Testnet
          </span>
          <h1>
            The open-source home for <span className="text-gradient">ERC-8004 agents</span> on Arc
          </h1>
          <p className="landing-hero-sub">
            Register identities, build reputation, request validation, and move ANV — all from one
            dark, glassmorphic dashboard built with React, Vite, and ethers.js.
          </p>
          <div className="landing-hero-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Launch App <IconArrowRight width={15} height={15} />
            </Link>
            <a className="btn btn-secondary" href={REPO_URL} target="_blank" rel="noreferrer">
              <IconGithub width={15} height={15} /> View on GitHub
            </a>
          </div>
          <div className="landing-hero-meta">
            <span><IconCheck width={13} height={13} /> MIT licensed</span>
            <span><IconCheck width={13} height={13} /> No backend required</span>
            <span><IconCheck width={13} height={13} /> Non-custodial</span>
          </div>
        </div>

        <div className="landing-hero-visual" aria-hidden="true">
          <AgentCardMock />
        </div>
      </div>
    </section>
  )
}

function AgentCardMock() {
  return (
    <div className="mock-agent-card">
      <div className="mock-agent-card-glow" />
      <div className="mock-agent-card-head">
        <div className="mock-avatar">A8</div>
        <div>
          <div className="mock-agent-title">Agent #0142</div>
          <div className="mock-agent-sub mono">0x8e4f…b2a1</div>
        </div>
        <span className="badge badge-success">Verified</span>
      </div>
      <div className="mock-agent-row">
        <span>Reputation score</span>
        <strong>92 / 100</strong>
      </div>
      <div className="mock-agent-bar"><span style={{ width: '92%' }} /></div>
      <div className="mock-agent-stats">
        <div>
          <span className="mock-stat-label">Validations</span>
          <span className="mock-stat-value">18</span>
        </div>
        <div>
          <span className="mock-stat-label">Feedback</span>
          <span className="mock-stat-value">64</span>
        </div>
        <div>
          <span className="mock-stat-label">Network</span>
          <span className="mock-stat-value">Arc</span>
        </div>
      </div>
      <div className="mock-agent-footer mono">testnet.arcscan.app/address/0x8e4f…</div>
    </div>
  )
}

function LogosStrip() {
  return (
    <div className="landing-shell landing-logos">
      <span>Built on</span>
      <span className="landing-logo-item mono">Arc Testnet</span>
      <span className="landing-logo-item mono">ERC-8004</span>
      <span className="landing-logo-item mono">ethers.js</span>
      <span className="landing-logo-item mono">React Router</span>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="landing-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Features"
          title="Everything an ERC-8004 agent needs"
          desc="Seven focused pages, one shared design system, zero backend."
        />
        <div className="landing-feature-grid">
          {FEATURES.map((f) => (
            <div className="landing-feature-card" key={f.title}>
              <div className="panel-icon-wrap"><f.icon width={18} height={18} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DashboardPreview() {
  return (
    <section className="landing-section landing-preview-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Inside the app"
          title="A dashboard that reads like a control room"
          desc="Wallet balances, agent status, and live network data in one glance."
        />
        <div className="landing-preview-frame">
          <div className="landing-preview-chrome">
            <span /><span /><span />
            <span className="landing-preview-url mono">arcagenthub.app/dashboard</span>
          </div>
          <div className="landing-preview-body">
            <div className="landing-preview-sidebar">
              {['Dashboard', 'Agents', 'Reputation', 'Validation', 'Transfer'].map((l, i) => (
                <div key={l} className={`landing-preview-nav-item ${i === 0 ? 'active' : ''}`}>{l}</div>
              ))}
            </div>
            <div className="landing-preview-main">
              <div className="landing-preview-stat-row">
                <div className="landing-preview-stat"><span>Balance</span><strong>1,204.5 ANV</strong></div>
                <div className="landing-preview-stat"><span>Reputation</span><strong>92</strong></div>
                <div className="landing-preview-stat"><span>Validations</span><strong>18</strong></div>
              </div>
              <div className="landing-preview-chart">
                {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section className="landing-section">
      <div className="landing-shell landing-why-grid">
        <div>
          <SectionHeading
            eyebrow="Why Arc Agent Hub"
            title="A reference build, not a demo"
            desc="Made to be read, forked, and shipped from \u2014 not just clicked through."
            align="left"
          />
          <div className="landing-hero-actions">
            <a className="btn btn-secondary" href={`${REPO_URL}#readme`} target="_blank" rel="noreferrer">
              <IconBook width={15} height={15} /> Read the docs
            </a>
          </div>
        </div>
        <div className="landing-why-list">
          {WHY.map((w) => (
            <div className="landing-why-item" key={w.title}>
              <div className="panel-icon-wrap"><IconLayers width={16} height={16} /></div>
              <div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechStack() {
  return (
    <section className="landing-section">
      <div className="landing-shell">
        <SectionHeading eyebrow="Technology" title="Built with a small, deliberate stack" />
        <div className="landing-stack-grid">
          {STACK.map((s) => (
            <div className="landing-stack-item" key={s.name}>
              <IconZap width={14} height={14} />
              <div>
                <div className="landing-stack-name mono">{s.name}</div>
                <div className="landing-stack-note">{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function OpenSource() {
  return (
    <section className="landing-section landing-oss">
      <div className="landing-shell landing-oss-inner">
        <div>
          <span className="landing-eyebrow">Open source</span>
          <h2>MIT licensed. Fork it, extend it, ship it.</h2>
          <p>
            Arc Agent Hub is free and open source. Contributions, issues, and forks are welcome —
            see the contributing guide to get started.
          </p>
        </div>
        <div className="landing-oss-actions">
          <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
            <IconGithub width={15} height={15} /> View repository
          </a>
          <a className="btn btn-secondary" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
            Contributing guide <IconExternal width={14} height={14} />
          </a>
        </div>
      </div>
    </section>
  )
}

function Roadmap() {
  return (
    <section id="roadmap" className="landing-section">
      <div className="landing-shell">
        <SectionHeading eyebrow="Roadmap" title="Where the project is headed" />
        <div className="landing-roadmap">
          {ROADMAP.map((r) => (
            <div className={`landing-roadmap-item status-${r.status}`} key={r.title}>
              <span className="landing-roadmap-dot" />
              <div>
                <div className="landing-roadmap-title">
                  {r.title}
                  <span className={`badge badge-${r.status === 'done' ? 'success' : r.status === 'active' ? 'warning' : 'muted'}`}>
                    {r.status === 'done' ? 'Shipped' : r.status === 'active' ? 'In progress' : 'Planned'}
                  </span>
                </div>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="landing-section landing-final-cta">
      <div className="landing-shell landing-final-cta-inner">
        <h2>Ready to register your first agent?</h2>
        <p>Connect a wallet on Arc Testnet and get an on-chain identity in under a minute.</p>
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          Launch App <IconArrowRight width={16} height={16} />
        </Link>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-shell landing-footer-inner">
        <div className="landing-footer-brand">
          <span className="brand-mark">ARC</span>
          <span>Arc Agent Hub</span>
        </div>
        <div className="landing-footer-links">
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={DOCS_URL} target="_blank" rel="noreferrer">Docs</a>
          <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">License</a>
          <Link to="/dashboard">Launch App</Link>
        </div>
        <span className="landing-footer-copy">Built for the Arc developer community. Not affiliated with Circle.</span>
      </div>
    </footer>
  )
}

function SectionHeading({ eyebrow, title, desc, align = 'center' }) {
  return (
    <div className={`landing-section-head align-${align}`}>
      <span className="landing-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  )
}
