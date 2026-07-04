import { SectionHeading } from '../../../ui/SectionHeading'
import { Reveal } from '../../../ui/Reveal'
import { ARCHITECTURE_STEPS } from '../landing.data'

export function ArchitectureTimeline() {
  return (
    <section id="architecture" className="landing-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Architecture"
          title="What happens when you sign a transaction"
          desc="The actual path a request takes through the app \u2014 in order."
        />
        <ol className="landing-timeline">
          {ARCHITECTURE_STEPS.map((step, i) => (
            <Reveal as="li" className="landing-timeline-item" key={step.title} delay={i * 90}>
              <div className="landing-timeline-marker">
                <span className="landing-timeline-index mono">{String(i + 1).padStart(2, '0')}</span>
                <step.icon width={16} height={16} />
              </div>
              <div className="landing-timeline-body">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
