import { Reveal } from '../../../ui/Reveal'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { STATS } from '../landing.data'

export function AnimatedStats() {
  return (
    <section className="landing-stats" aria-label="Platform statistics">
      <div className="landing-shell landing-stats-grid">
        {STATS.map((stat, i) => (
          <Reveal as="div" className="landing-stat-tile" key={stat.label} delay={i * 90}>
            <div className="landing-stat-value mono">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="landing-stat-label">{stat.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
