import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionHeading } from '../../../ui/SectionHeading'
import { GlassPanel } from '../../../ui/GlassPanel'
import { IconChevronLeft, IconChevronRight } from '../../../ui/icons'
import { ECOSYSTEM_PRINCIPLES } from '../landing.data'

const AUTO_MS = 3800

export function EcosystemCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = ECOSYSTEM_PRINCIPLES.length

  const go = useCallback((delta) => {
    setIndex((i) => (i + delta + count) % count)
  }, [count])

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => go(1), AUTO_MS)
    return () => clearInterval(id)
  }, [paused, go])

  return (
    <section id="community" className="landing-section">
      <div className="landing-shell">
        <div className="landing-carousel-header">
          <SectionHeading
            eyebrow="Community & Ecosystem"
            title="What the project stands on"
            align="left"
            className="landing-carousel-title"
          />
          <div className="landing-carousel-controls">
            <button type="button" aria-label="Previous" onClick={() => go(-1)}>
              <IconChevronLeft width={18} height={18} />
            </button>
            <button type="button" aria-label="Next" onClick={() => go(1)}>
              <IconChevronRight width={18} height={18} />
            </button>
          </div>
        </div>

        <div
          className="landing-carousel-track"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="landing-carousel-rail"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {ECOSYSTEM_PRINCIPLES.map((p) => (
              <div className="landing-carousel-slide" key={p.title}>
                <GlassPanel interactive className="landing-carousel-card">
                  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
                    <path d="M0 22V13.2C0 5.5 4.7.9 11 0v4.4C7.7 5.4 6 7.7 6 10.6h5V22H0zm14.5 0V13.2c0-7.7 4.7-12.3 11-13.2v4.4c-3.3 1-5 3.3-5 6.2h5V22h-11z" fill="currentColor" opacity="0.4" />
                  </svg>
                  <p className="landing-carousel-quote">{p.desc}</p>
                  <div className="landing-carousel-name">{p.title}</div>
                </GlassPanel>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
