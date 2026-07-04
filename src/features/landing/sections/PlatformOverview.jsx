import { SectionHeading } from '../../../ui/SectionHeading'
import { GlassPanel } from '../../../ui/GlassPanel'
import { Reveal } from '../../../ui/Reveal'
import { PILLARS } from '../landing.data'

function truncateAddress(address) {
  if (!address) return ''
  return `${address.slice(0, 6)}\u2026${address.slice(-4)}`
}

export function PlatformOverview() {
  return (
    <section id="platform" className="landing-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Platform"
          title="Four registries, one source of truth"
          desc="Every page in the app reads from the same contract registry — nothing here is a mock waiting to be wired up."
        />
        <div className="landing-pillar-grid">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 80}>
              <GlassPanel className="landing-pillar" interactive>
                <div className="panel-icon-wrap"><pillar.icon width={18} height={18} /></div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
                {pillar.address && (
                  <div className="landing-pillar-address mono">{truncateAddress(pillar.address)}</div>
                )}
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
