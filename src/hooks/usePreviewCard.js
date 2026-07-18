import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../ui/design-system/motion'

/**
 * Shared visibility + pointer-interaction rig for the landing page's three
 * showcase previews (Identity & Reputation / Marketplace / Live Dashboard
 * in ShowcaseMockups.jsx). Built as one hook so none of the three mocks
 * re-implements its own IntersectionObserver or pointermove listener.
 *
 * Returns:
 *  - `ref`          attach to the outer `.mock-screen` node
 *  - `entered`      flips true the first time the card crosses the
 *                    viewport and then stays true — drives one-shot
 *                    entrance animations (ring fill, stagger-in, etc).
 *  - `onScreen`      true only while the card currently intersects the
 *                    viewport — drives `animation-play-state` on
 *                    continuous/looping CSS animations so they pause
 *                    instead of ticking away off screen.
 *
 * When `tilt` is enabled, pointer position is written straight to CSS
 * custom properties (`--tilt-x`, `--tilt-y`, `--parallax-x`,
 * `--parallax-y`, `--glow-x`, `--glow-y`) on the DOM node via a
 * rAF-throttled listener — never through React state, so hovering a
 * preview never triggers a re-render. Skipped entirely under
 * prefers-reduced-motion.
 */
export function usePreviewCard({ tilt = false, tiltMax = 3, threshold = 0.2 } = {}) {
  const ref = useRef(null)
  const [onScreen, setOnScreen] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true)
      setEntered(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting)
        if (entry.isIntersecting) setEntered(true)
      },
      { threshold, rootMargin: '0px 0px -5% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  useEffect(() => {
    const node = ref.current
    if (!node || !tilt || prefersReducedMotion()) return undefined

    let frame = null

    const handleMove = (event) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        const rect = node.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        const rotateY = (px - 0.5) * tiltMax * 2
        const rotateX = (0.5 - py) * tiltMax * 2
        node.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`)
        node.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`)
        node.style.setProperty('--parallax-x', `${((px - 0.5) * 12).toFixed(1)}px`)
        node.style.setProperty('--parallax-y', `${((py - 0.5) * 12).toFixed(1)}px`)
        node.style.setProperty('--glow-x', `${(px * 100).toFixed(1)}%`)
        node.style.setProperty('--glow-y', `${(py * 100).toFixed(1)}%`)
      })
    }

    const handleLeave = () => {
      node.style.setProperty('--tilt-x', '0deg')
      node.style.setProperty('--tilt-y', '0deg')
      node.style.setProperty('--parallax-x', '0px')
      node.style.setProperty('--parallax-y', '0px')
    }

    node.addEventListener('pointermove', handleMove)
    node.addEventListener('pointerleave', handleLeave)
    return () => {
      node.removeEventListener('pointermove', handleMove)
      node.removeEventListener('pointerleave', handleLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [tilt, tiltMax])

  return { ref, onScreen, entered }
}
