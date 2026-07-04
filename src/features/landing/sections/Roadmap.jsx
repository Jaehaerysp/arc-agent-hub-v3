import { SectionHeading } from '../../../ui/SectionHeading'
import { Reveal } from '../../../ui/Reveal'
import { ROADMAP } from '../landing.data'

const STATUS_LABEL = { done: 'Shipped', active: 'In progress', planned: 'Planned' }
const STATUS_BADGE = { done: 'success', active: 'warning', planned: 'muted' }

export function Roadmap() {
  return (
    <section id="roadmap" className="landing-section">
      <div className="landing-shell">
        <SectionHeading eyebrow="Roadmap" title="Where the project is headed" />
        <div className="landing-roadmap">
          {ROADMAP.map((r, i) => (
            <Reveal as="div" className={`landing-roadmap-item status-${r.status}`} key={r.title} delay={i * 70}>
              <span className="landing-roadmap-dot" />
              <div>
                <div className="landing-roadmap-title">
                  {r.title}
                  <span className={`badge badge-${STATUS_BADGE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                </div>
                <p>{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
