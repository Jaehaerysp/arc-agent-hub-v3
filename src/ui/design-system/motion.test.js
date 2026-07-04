import { describe, it, expect } from 'vitest'
import { staggerDelay, staggerStyle, prefersReducedMotion, DURATIONS, EASINGS } from './motion'

describe('staggerDelay', () => {
  it('returns 0 for the first item', () => {
    expect(staggerDelay(0)).toBe(0)
  })

  it('multiplies index by the step (default 60ms)', () => {
    expect(staggerDelay(1)).toBe(60)
    expect(staggerDelay(3)).toBe(180)
  })

  it('respects a custom step', () => {
    expect(staggerDelay(2, { step: 100 })).toBe(200)
  })

  it('clamps to the max step so long lists do not keep growing', () => {
    expect(staggerDelay(50, { max: 8 })).toBe(staggerDelay(8, { max: 8 }))
    expect(staggerDelay(8, { max: 8 })).toBe(480)
  })

  it('returns 0 for invalid input instead of throwing', () => {
    expect(staggerDelay(-1)).toBe(0)
    expect(staggerDelay(NaN)).toBe(0)
    expect(staggerDelay('3')).toBe(0)
  })

  it('floors fractional indices', () => {
    expect(staggerDelay(2.9)).toBe(120)
  })
})

describe('staggerStyle', () => {
  it('returns an empty object for index 0', () => {
    expect(staggerStyle(0)).toEqual({})
  })

  it('returns a transitionDelay string for a positive index', () => {
    expect(staggerStyle(2)).toEqual({ transitionDelay: '120ms' })
  })
})

describe('prefersReducedMotion', () => {
  it('does not throw and returns a boolean in the jsdom test environment', () => {
    expect(typeof prefersReducedMotion()).toBe('boolean')
  })
})

describe('DURATIONS / EASINGS', () => {
  it('exposes the named motion constants used across the design system', () => {
    expect(DURATIONS.hover).toBe(150)
    expect(DURATIONS.toast).toBe(250)
    expect(EASINGS.standard).toMatch(/^cubic-bezier/)
    expect(EASINGS.spring).toMatch(/^cubic-bezier/)
  })

  it('is frozen so consumers cannot accidentally mutate shared constants', () => {
    expect(Object.isFrozen(DURATIONS)).toBe(true)
    expect(Object.isFrozen(EASINGS)).toBe(true)
  })
})
