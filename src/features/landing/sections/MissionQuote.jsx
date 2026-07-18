import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../../../ui/Reveal'
import { MISSION_QUOTE, BUILT_WITH } from '../landing.data'

function useParallax(maxOffset = 60) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    let raf = null

    const update = () => {
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // progress: -1 (bottom of viewport) -> 1 (top of viewport)
      const progress = 1 - (rect.top + rect.height / 2) / vh
      const next = Math.max(-1, Math.min(1, progress)) * maxOffset
      setOffset(next)
      raf = null
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [maxOffset])

  return [ref, offset]
}

export function MissionQuote() {
  const [parallaxRef, offset] = useParallax(50)

  return (
    <section className="landing-quote">
      <div className="landing-shell landing-quote-col">
        <Reveal as="span" className="landing-quote-mark" delay={100} aria-hidden="true">
          &ldquo;
        </Reveal>

        <Reveal as="h2" className="landing-quote-text" delay={200}>
          {MISSION_QUOTE}
        </Reveal>

        <Reveal as="p" className="landing-quote-author" delay={300}>
          The Arc Agent Hub team
        </Reveal>

        <Reveal as="div" className="landing-quote-stack" delay={400}>
          {BUILT_WITH.map((name) => (
            <span key={name} className="landing-quote-stack-item">{name}</span>
          ))}
        </Reveal>

        <Reveal as="div" className="landing-quote-visual-wrap" delay={500}>
          <div ref={parallaxRef} className="landing-quote-visual" style={{ transform: `translateY(${offset}px)` }}>
            <NetworkGraphic />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function NetworkGraphic() {
  return (
    <svg viewBox="0 0 320 220" className="landing-quote-svg" role="img" aria-label="Agents connected through on-chain registries">
      <defs>
        <linearGradient id="netgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="55%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <g stroke="url(#netgrad)" strokeWidth="1.4" fill="none" opacity="0.55">
        <path d="M60 170L160 60" />
        <path d="M160 60L260 170" />
        <path d="M60 170L260 170" />
        <path d="M160 60L160 170" />
        <path d="M110 115L210 115" />
      </g>
      {[
        [60, 170, 8],
        [160, 60, 10],
        [260, 170, 8],
        [160, 170, 6],
        [110, 115, 5],
        [210, 115, 5],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="url(#netgrad)" />
      ))}
    </svg>
  )
}
