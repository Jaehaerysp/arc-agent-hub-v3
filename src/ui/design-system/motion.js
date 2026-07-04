/**
 * Motion utilities for the v7 Premium Design System.
 *
 * Mirrors the Motion System table in docs/UI_BLUEPRINT.md so every
 * animated transition in Dashboard v7 / Marketplace v7 / Jobs v7 /
 * Validation v7 / Wallet v7 traces back to one named, purposeful set of
 * constants instead of ad-hoc millisecond values scattered across
 * components. Values match the `--duration-*` / `--ease*` custom
 * properties in src/styles/tokens.css — kept in sync manually since CSS
 * custom properties aren't readable from JS without a DOM round-trip.
 */

export const DURATIONS = Object.freeze({
  hover: 150,
  page: 200,
  modalIn: 200,
  modalOut: 150,
  toast: 250,
  success: 200,
  shimmer: 1600,
})

export const EASINGS = Object.freeze({
  standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
})

/**
 * Reads the user's reduced-motion preference. Returns `false` (motion
 * allowed) in any environment without `window.matchMedia`, e.g. during
 * server-side rendering or in tests, so callers never crash and default
 * to the safer "just show the animation" behavior rather than throwing.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/**
 * Pure function computing a staggered transition delay for the Nth item
 * in a list (e.g. a grid of FeatureCards or MetricCards revealing in
 * sequence). Index is clamped to `max` steps so a long list doesn't
 * produce an ever-growing, increasingly sluggish delay — items beyond
 * `max` all share the final step's delay.
 *
 * @param {number} index - zero-based position in the list
 * @param {{ step?: number, max?: number }} [options]
 * @returns {number} delay in milliseconds, always >= 0
 */
export function staggerDelay(index, { step = 60, max = 8 } = {}) {
  if (typeof index !== 'number' || Number.isNaN(index) || index < 0) return 0
  const cappedIndex = Math.min(Math.floor(index), max)
  return cappedIndex * step
}

/**
 * Convenience wrapper returning an inline `transitionDelay` style object
 * for `staggerDelay`, honoring `prefersReducedMotion` by omitting the
 * delay entirely when the user has asked for reduced motion.
 *
 * @param {number} index
 * @param {{ step?: number, max?: number }} [options]
 * @returns {{ transitionDelay?: string }}
 */
export function staggerStyle(index, options) {
  if (prefersReducedMotion()) return {}
  const delay = staggerDelay(index, options)
  return delay > 0 ? { transitionDelay: `${delay}ms` } : {}
}
