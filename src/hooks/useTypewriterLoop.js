import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../ui/design-system/motion'

/**
 * Types out each phrase in `phrases`, pauses, deletes it, and moves to the
 * next — looping forever. Built for the Marketplace preview's search bar
 * ("Search... / Search agents... / Search AI... / Search builders...")
 * but generic enough for any other typed-placeholder use.
 *
 * Self-schedules with a single `setTimeout` chain rather than
 * `setInterval`, so there's never more than one pending timer and no
 * drift to correct for. Pass `active: false` (e.g. when the preview is
 * off screen) to freeze mid-phrase without losing place; the effect
 * cleans up its pending timeout whenever `active` flips or the component
 * unmounts. Renders the first phrase statically under
 * prefers-reduced-motion instead of animating.
 */
export function useTypewriterLoop(phrases, { typeSpeed = 55, deleteSpeed = 30, pause = 1400, active = true } = {}) {
  const [text, setText] = useState(phrases[0] ?? '')
  const reduced = useRef(prefersReducedMotion())

  useEffect(() => {
    if (reduced.current || !active || phrases.length === 0) {
      return undefined
    }

    let phraseIndex = 0
    let charIndex = text.length
    let deleting = false
    let timeoutId = null

    const tick = () => {
      const current = phrases[phraseIndex]

      if (!deleting) {
        charIndex += 1
        setText(current.slice(0, charIndex))
        if (charIndex >= current.length) {
          deleting = true
          timeoutId = setTimeout(tick, pause)
          return
        }
        timeoutId = setTimeout(tick, typeSpeed)
      } else {
        charIndex -= 1
        setText(current.slice(0, charIndex))
        if (charIndex <= 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % phrases.length
        }
        timeoutId = setTimeout(tick, deleteSpeed)
      }
    }

    timeoutId = setTimeout(tick, typeSpeed)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, phrases, typeSpeed, deleteSpeed, pause])

  return reduced.current ? (phrases[0] ?? '') : text
}
