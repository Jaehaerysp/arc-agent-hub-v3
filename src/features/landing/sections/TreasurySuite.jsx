import { SectionHeading } from '../../../ui/SectionHeading'
import { TREASURY_FEATURES } from '../landing.data'
import { TreasuryFeatureCard } from '../components/ExpansionMockups'

export function TreasurySuite() {
  return (
    <section id="treasury" className="landing-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Treasury"
          title="Treasury Suite"
          desc="Manage digital assets, settle payments, bridge between supported networks, transfer tokens, and perform swaps without leaving Arc Agent Hub."
        />
        <div className="trs-grid">
          {TREASURY_FEATURES.map((feature, i) => (
            <TreasuryFeatureCard feature={feature} index={i} key={feature.title} />
          ))}
        </div>
      </div>
    </section>
  )
}
