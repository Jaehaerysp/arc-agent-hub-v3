import { SectionHeading } from '../../../ui/SectionHeading'
import { Reveal } from '../../../ui/Reveal'

const NAV_ITEMS = ['Dashboard', 'Agents', 'Jobs', 'Reputation', 'Validation', 'Transfer']

export function MissionControlPreview() {
  return (
    <section className="landing-section landing-preview-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Inside the app"
          title="Mission control for a workforce that isn't human"
          desc="Wallet balances, agent status, and live network data in one glance — not a crypto app you click through."
        />
        <Reveal className="landing-preview-frame">
          <div className="landing-preview-chrome">
            <span /><span /><span />
            <span className="landing-preview-url mono">arcagenthub.app/dashboard</span>
          </div>
          <div className="landing-preview-body">
            <div className="landing-preview-sidebar">
              {NAV_ITEMS.map((l, i) => (
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
        </Reveal>
      </div>
    </section>
  )
}
