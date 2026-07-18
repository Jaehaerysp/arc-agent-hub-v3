import { Reveal } from '../../../ui/Reveal'
import { FEATURE_SHOWCASE } from '../landing.data'
import { IdentityReputationMock, MarketplaceMock, DashboardMock } from '../components/ShowcaseMockups'

const PREVIEWS = [IdentityReputationMock, MarketplaceMock, DashboardMock]

export function FeatureShowcase() {
  return (
    <section id="features" className="landing-showcase">
      <div className="landing-shell-wide landing-showcase-stack">
        {FEATURE_SHOWCASE.map((item, i) => {
          const Preview = PREVIEWS[i]
          return (
            <Reveal as="div" key={item.title} className="landing-showcase-item" delay={i * 60}>
              <div className="landing-showcase-text">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <div className="landing-showcase-frame" aria-hidden="true">
                {Preview ? <Preview /> : null}
                <span className="landing-showcase-frame-label">Preview</span>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
