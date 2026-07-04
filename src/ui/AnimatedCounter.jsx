import { useEffect, useRef, useState } from 'react'

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * Counts up from 0 to `value` once it enters the viewport. Shared primitive:
 * built for the landing page's Animated Statistics band, but written to be
 * generic (no landing-specific markup or copy) so Dashboard v7 stat tiles and
 * Marketplace v7 listing metrics can reuse it for the same "value lands, then
 * settles" feel instead of a plain static number.
 *
 * Renders the final value immediately when prefers-reduced-motion is set or
 * IntersectionObserver is unavailable, so it degrades to a plain number.
 */
export function AnimatedCounter({
  value,
  duration = 1400,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setDisplay(value)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1)
              setDisplay(value * easeOutExpo(progress))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
