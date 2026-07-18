import { SectionHeading } from '../../../ui/SectionHeading'
import { ArchitectureDiagram } from '../components/ExpansionMockups'

export function PlatformArchitecture() {
  return (
    <section id="architecture" className="landing-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Under the hood"
          title="Platform Architecture"
          desc="One connected system, from the landing page you're reading down to the settlement layer it all runs on."
        />
        <ArchitectureDiagram />
      </div>
    </section>
  )
}
