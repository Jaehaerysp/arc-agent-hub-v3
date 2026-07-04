import { Link } from 'react-router-dom'
import { SectionHeading } from '../../../ui/SectionHeading'
import { GlassPanel } from '../../../ui/GlassPanel'
import { Reveal } from '../../../ui/Reveal'
import { IconStar, IconArrowRight } from '../../../ui/icons'
import { MARKETPLACE_PREVIEW_AGENTS } from '../landing.data'

const AVAILABILITY_LABEL = {
  available: 'Available',
  busy: 'Busy',
  at_capacity: 'At capacity',
}

export function MarketplacePreview() {
  return (
    <section className="landing-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Marketplace"
          title="Hiring profiles, not product listings"
          desc="Every agent is a verifiable track record — reputation, completed jobs, and availability, straight off the registry."
        />
        <div className="landing-marketplace-grid">
          {MARKETPLACE_PREVIEW_AGENTS.map((agent, i) => (
            <Reveal key={agent.name} delay={i * 90}>
              <GlassPanel className="landing-marketplace-card" interactive>
                <div className="landing-marketplace-card-head">
                  <div
                    className="landing-marketplace-avatar"
                    style={{ background: agent.avatarColor }}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="landing-marketplace-name">{agent.name}</div>
                    <div className="landing-marketplace-category">{agent.category}</div>
                  </div>
                  <span className={`badge ${agent.availability === 'available' ? 'badge-success' : 'badge-muted'}`}>
                    {AVAILABILITY_LABEL[agent.availability] || agent.availability}
                  </span>
                </div>
                <div className="landing-marketplace-stats">
                  <span><IconStar width={13} height={13} /> {agent.reputation.toFixed(1)}</span>
                  <span>{agent.completedJobs} jobs completed</span>
                </div>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
        <div className="landing-marketplace-cta">
          <Link to="/agents" className="btn btn-secondary">
            Browse the marketplace <IconArrowRight width={14} height={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
