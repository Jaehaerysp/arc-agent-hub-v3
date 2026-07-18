import { Reveal } from '../../../ui/Reveal'
import { SectionHeading } from '../../../ui/SectionHeading'
import { GlassPanel } from '../../../ui/GlassPanel'
import { DEV_EXPERIENCE_ITEMS, REPO_URL, DOCS_URL } from '../landing.data'
import { DevConsoleMock } from '../components/ExpansionMockups'

export function DeveloperExperience() {
  return (
    <section id="developers" className="landing-showcase">
      <div className="landing-shell-wide">
        <SectionHeading
          eyebrow="Build on Arc"
          title="Developer Experience"
          desc="Everything Arc Agent Hub is built with, wrapped up so you can build on top of it instead of starting from a blank contract."
        />

        <div className="landing-showcase-item dev-showcase-layout">
          <div className="landing-showcase-frame" aria-hidden="true">
            <DevConsoleMock />
            <span className="landing-showcase-frame-label">Preview</span>
          </div>
          <div className="dev-grid">
            {DEV_EXPERIENCE_ITEMS.map((item, i) => (
              <Reveal as="div" key={item.title} delay={i * 50}>
                <GlassPanel interactive className="dev-item-card">
                  <span className="dev-item-icon"><item.icon width={16} height={16} /></span>
                  <div className="dev-item-title">{item.title}</div>
                  <p className="dev-item-desc">{item.desc}</p>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="dev-links">
          <a className="btn btn-ghost" href={REPO_URL} target="_blank" rel="noreferrer">View source</a>
          <a className="btn btn-ghost" href={DOCS_URL} target="_blank" rel="noreferrer">Read the docs</a>
        </div>
      </div>
    </section>
  )
}
