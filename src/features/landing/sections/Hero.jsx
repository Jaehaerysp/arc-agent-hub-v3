import { Link } from 'react-router-dom'
import { IconArrowRight, IconGithub, IconCheck } from '../../../ui/icons'
import { GradientText } from '../../../ui/GradientText'
import { Reveal } from '../../../ui/Reveal'
import { REPO_URL } from '../landing.data'
import { ARC_CHAIN_ID } from '../../../chains/arc'

export function Hero() {
  return (
    <section id="top" className="landing-hero">
      <div className="landing-shell landing-hero-grid">
        <div className="landing-hero-copy">
          <Reveal as="span" className="landing-eyebrow">
            <span className="dot-live" /> Live on Arc Testnet &middot; chain {ARC_CHAIN_ID}
          </Reveal>
          <Reveal as="h1" delay={80}>
            The mission control for <GradientText>ERC-8004 agents</GradientText> on Arc
          </Reveal>
          <Reveal as="p" className="landing-hero-sub" delay={140}>
            Register identities, build reputation, request validation, and move ANV — all from one
            dark, glassmorphic dashboard built with React, Vite, and ethers.js.
          </Reveal>
          <Reveal as="div" className="landing-hero-actions" delay={200}>
            <Link to="/dashboard" className="btn btn-primary">
              Launch App <IconArrowRight width={15} height={15} />
            </Link>
            <a className="btn btn-secondary" href={REPO_URL} target="_blank" rel="noreferrer">
              <IconGithub width={15} height={15} /> View on GitHub
            </a>
          </Reveal>
          <Reveal as="div" className="landing-hero-meta" delay={260}>
            <span><IconCheck width={13} height={13} /> MIT licensed</span>
            <span><IconCheck width={13} height={13} /> No backend required</span>
            <span><IconCheck width={13} height={13} /> Non-custodial</span>
          </Reveal>
        </div>

        <Reveal as="div" className="landing-hero-visual" delay={180} aria-hidden="true">
          <AgentCardMock />
        </Reveal>
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
          <div className="mock-agent-sub mono">0x8e4f&hellip;b2a1</div>
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
      <div className="mock-agent-footer mono">testnet.arcscan.app/address/0x8e4f&hellip;</div>
    </div>
  )
}
