import { Reveal } from '../../../ui/Reveal'
import { SectionHeading } from '../../../ui/SectionHeading'
import { TRUST_CENTER_ITEMS } from '../landing.data'
import { TrustCenterMock } from '../components/ExpansionMockups'

export function TrustCenter() {
  return (
    <section id="trust" className="landing-showcase">
      <div className="landing-shell-wide">
        <SectionHeading
          eyebrow="Trust Center"
          title="Trust Center"
          desc="Identity verification, reputation history, and independent validation, backed by on-chain evidence anyone can audit."
        />
        <div className="landing-showcase-item tcp-layout">
          <ul className="tcp-desc-list">
            {TRUST_CENTER_ITEMS.map((item, i) => (
              <Reveal as="li" key={item.title} className="tcp-desc-item" delay={i * 60}>
                <span className="tcp-desc-icon"><item.icon width={16} height={16} /></span>
                <div>
                  <div className="tcp-desc-title">{item.title}</div>
                  <p className="tcp-desc-text">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="landing-showcase-frame" aria-hidden="true">
            <TrustCenterMock />
            <span className="landing-showcase-frame-label">Preview</span>
          </div>
        </div>
      </div>
    </section>
  )
}
