/**
 * Shared `motion/react` variants for the three showcase previews in
 * ShowcaseMockups.jsx (Identity & Reputation, Marketplace, Live
 * Dashboard). Centralized so the fade/stagger/hover treatment is
 * defined once instead of copy-pasted per mock — see Hero.jsx for the
 * same `[0.16, 1, 0.3, 1]` easing used on the rest of the landing page
 * (it's also the app's `--ease` token in tokens.css).
 */

export const EASE = [0.16, 1, 0.3, 1]

/** Wrap a list container with this; children use `staggerItem`. */
export function staggerList({ delayChildren = 0.1, staggerChildren = 0.12 } = {}) {
  return {
    hidden: {},
    show: { transition: { delayChildren, staggerChildren } },
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

export const staggerItemLeft = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
}

/** Gentle lift used on hover for preview cards — tween, not spring, per the "no bounce" brief. */
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.25, ease: EASE } },
}

/** Gentle scale used on hover for marketplace agent cards. */
export const hoverScale = {
  whileHover: { scale: 1.02, y: -3, transition: { duration: 0.25, ease: EASE } },
}
