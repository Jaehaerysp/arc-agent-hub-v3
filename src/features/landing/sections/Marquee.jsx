import { MARQUEE_MODULES } from '../landing.data'

const track = [...MARQUEE_MODULES, ...MARQUEE_MODULES]

/**
 * Horizontally auto-scrolling strip of module chips. Layout/animation
 * pattern (duplicated track, CSS transform loop, pause on hover) is the
 * classic marquee approach; content is original icon+label cards for
 * Arc Agent Hub's own registries, not third-party imagery.
 */
export function Marquee() {
  return (
    <section className="landing-marquee" aria-hidden="true">
      <div className="landing-marquee-track">
        {track.map((mod, i) => {
          const Icon = mod.icon
          return (
            <div className="landing-marquee-chip" key={`${mod.label}-${i}`}>
              <span className="landing-marquee-chip-icon"><Icon width={22} height={22} /></span>
              <span>{mod.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
