import { SectionHeading } from '../../../ui/SectionHeading'
import { GlassPanel } from '../../../ui/GlassPanel'
import { Reveal } from '../../../ui/Reveal'
import { FEATURES } from '../landing.data'

export function CoreFeatures() {
  return (
    <section id="features" className="landing-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Features"
          title="Everything an ERC-8004 agent needs"
          desc="Twelve focused pages, one shared design system, zero backend."
        />
        <div className="landing-feature-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <GlassPanel className="landing-feature-card" interactive>
                <div className="panel-icon-wrap"><f.icon width={18} height={18} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
