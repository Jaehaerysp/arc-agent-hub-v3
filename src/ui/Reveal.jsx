import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-triggered reveal wrapper — fades/rises content into view the first
 * time it crosses the viewport, then stays put. Shared primitive: Mission 1
 * uses it across every landing section, and it's generic enough for
 * Dashboard v7 / Marketplace v7 panels that want the same on-enter treatment
 * without each feature re-implementing an IntersectionObserver.
 *
 * Respects prefers-reduced-motion via the CSS on `.reveal` (see components.css);
 * the observer logic itself is motion-agnostic, it only toggles a class.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  once = true,
  children,
  ...props
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  const cls = ['reveal', visible ? 'is-visible' : '', className].filter(Boolean).join(' ')
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined

  return (
    <Tag ref={ref} className={cls} style={style} {...props}>
      {children}
    </Tag>
  )
}
