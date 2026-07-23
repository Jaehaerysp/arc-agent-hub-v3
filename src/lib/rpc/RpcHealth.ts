// RpcHealth — per-provider health bookkeeping: latency, the healthy/
// unhealthy cache, and the token-bucket rate limiter. This is the
// module RpcManager consults to answer "which provider should I use
// right now" (`getBestProvider`) and "is this provider worth retrying
// at all" (health-cache TTL), and where `refreshHealth()` resets state
// to force a fresh probe.
//
// Deliberately has no idea how to *make* an RPC call — RpcManager owns
// the transport wiring; this module only tracks the outcome of calls
// it's told about via `recordSuccess` / `recordFailure`.

import type { RpcProviderConfig, RpcProviderHealth, RpcSelectionReason } from './types'

/** Requirement #4 — a response slower than this marks the provider "slow" for ranking purposes. */
export const SLOW_THRESHOLD_MS = 1500
/** Requirement #7/#8 — how long a health verdict is trusted before we re-test that provider from scratch. */
export const HEALTH_CACHE_TTL_MS = 30_000
/** Requirement #13 — simple token-bucket rate limit per provider, generous enough not to interfere with normal use. */
export const RATE_LIMIT_MAX_TOKENS = 8
export const RATE_LIMIT_REFILL_MS = 1000

interface ProviderState {
  config: RpcProviderConfig
  latencyMs: number | null
  slow: boolean
  lastCheckedAt: number | null
  lastSuccessAt: number | null
  consecutiveFailures: number
  /** Health-cache TTL: once a provider is marked unhealthy, skip re-probing it until this timestamp passes. */
  unhealthyUntil: number | null
  /** Token-bucket rate limiter state. */
  tokens: number
  lastRefillAt: number
}

const TIER_ORDER: Record<RpcProviderConfig['tier'], number> = {
  primary: 0,
  secondary: 1,
  third: 2,
  fallback: 3,
}

export class RpcHealthTracker {
  private readonly states = new Map<string, ProviderState>()
  private readonly order: RpcProviderConfig[]
  private activeProviderId: string | null = null
  /** Why `activeProviderId` is the one currently selected — set on every switch, retained until the next one. */
  private activeSelectionReason: RpcSelectionReason | null = null

  constructor(configs: RpcProviderConfig[]) {
    this.order = configs
    const now = Date.now()
    for (const config of configs) {
      this.states.set(config.id, {
        config,
        latencyMs: null,
        slow: false,
        lastCheckedAt: null,
        lastSuccessAt: null,
        consecutiveFailures: 0,
        unhealthyUntil: null,
        tokens: RATE_LIMIT_MAX_TOKENS,
        lastRefillAt: now,
      })
    }
  }

  /** Requirement #13 — waits for (and consumes) a rate-limit token before a request is allowed to proceed against this provider. */
  async acquireRateLimitToken(providerId: string): Promise<void> {
    const state = this.states.get(providerId)
    if (!state) return

    const now = Date.now()
    const elapsed = now - state.lastRefillAt
    if (elapsed > 0) {
      const refill = (elapsed / RATE_LIMIT_REFILL_MS) * RATE_LIMIT_MAX_TOKENS
      state.tokens = Math.min(RATE_LIMIT_MAX_TOKENS, state.tokens + refill)
      state.lastRefillAt = now
    }

    if (state.tokens < 1) {
      // Brief backpressure instead of an outright rejection — this is a
      // resilience layer, not a hard quota enforcer.
      await wait(RATE_LIMIT_REFILL_MS / RATE_LIMIT_MAX_TOKENS)
      state.tokens = 1
    }

    state.tokens -= 1
  }

  /**
   * Records a successful call against a provider. Returns whether this
   * caused the active provider to change (a failover), plus *why* the
   * new provider was selected — surfaced to the UI via
   * `getSelectionReason()` / `RpcMetricsSnapshot.selectionReason`.
   */
  recordSuccess(providerId: string, latencyMs: number): { didFailover: boolean; reason: RpcSelectionReason | null } {
    const state = this.states.get(providerId)
    if (!state) return { didFailover: false, reason: this.activeSelectionReason }

    const now = Date.now()
    state.latencyMs = Math.round(latencyMs)
    state.slow = latencyMs > SLOW_THRESHOLD_MS
    state.lastCheckedAt = now
    state.lastSuccessAt = now
    state.consecutiveFailures = 0
    state.unhealthyUntil = null

    const previousProviderId = this.activeProviderId
    const didFailover = previousProviderId !== null && previousProviderId !== providerId

    if (previousProviderId === null) {
      this.activeSelectionReason = 'initial'
    } else if (didFailover) {
      const wasHealthy = this.isHealthy(previousProviderId)
      const previousState = this.states.get(previousProviderId)
      if (!wasHealthy) {
        // We only moved on because the prior active provider stopped working.
        this.activeSelectionReason = 'failover'
      } else if (previousState && TIER_ORDER[state.config.tier] < TIER_ORDER[previousState.config.tier]) {
        // Both were healthy, but we moved back to a higher-priority provider.
        this.activeSelectionReason = 'recovery'
      } else {
        // Both healthy, same-or-lower priority — a pure latency re-rank.
        this.activeSelectionReason = 'lowest-latency'
      }
    }
    // Same provider as before: keep whatever reason is already recorded.

    this.activeProviderId = providerId
    return { didFailover, reason: this.activeSelectionReason }
  }

  recordFailure(providerId: string): void {
    const state = this.states.get(providerId)
    if (!state) return

    const now = Date.now()
    state.lastCheckedAt = now
    state.consecutiveFailures += 1
    state.unhealthyUntil = now + HEALTH_CACHE_TTL_MS
  }

  /** Requirement #7/#8 — forces every provider back up for immediate re-probing, ignoring the health-cache TTL. Used by `RpcManager.refreshHealth()`. */
  clearHealthCache(): void {
    for (const state of this.states.values()) {
      state.unhealthyUntil = null
    }
  }

  isHealthy(providerId: string): boolean {
    const state = this.states.get(providerId)
    if (!state) return false
    return !state.unhealthyUntil || state.unhealthyUntil < Date.now()
  }

  getActiveProviderId(): string | null {
    return this.activeProviderId
  }

  /** Why the active provider is the one currently selected. `null` before any successful request. */
  getSelectionReason(): RpcSelectionReason | null {
    return this.activeSelectionReason
  }

  /** Most recent timestamp any provider was probed (success or failure), across the whole table. */
  getLastHealthCheckAt(): number | null {
    let latest: number | null = null
    for (const state of this.states.values()) {
      if (state.lastCheckedAt !== null && (latest === null || state.lastCheckedAt > latest)) {
        latest = state.lastCheckedAt
      }
    }
    return latest
  }

  getProviderConfigs(): RpcProviderConfig[] {
    return this.order
  }

  getHealth(providerId: string): RpcProviderHealth | null {
    const state = this.states.get(providerId)
    if (!state) return null
    return this.toHealth(state)
  }

  getAllHealth(): RpcProviderHealth[] {
    return this.order.map((config) => this.toHealth(this.states.get(config.id)!))
  }

  /**
   * The provider RpcManager should prefer right now: the healthy
   * provider with the lowest measured latency, falling back to
   * priority-tier order for providers that haven't been measured yet.
   * This is what `RpcManager.getBestProvider()` delegates to.
   */
  getBestProvider(): RpcProviderHealth | null {
    const healthy = this.order
      .map((config) => this.states.get(config.id)!)
      .filter((state) => this.isHealthy(state.config.id))

    if (healthy.length === 0) return null

    const ranked = [...healthy].sort((a, b) => {
      if (a.latencyMs !== null && b.latencyMs !== null) return a.latencyMs - b.latencyMs
      if (a.latencyMs !== null) return -1
      if (b.latencyMs !== null) return 1
      return TIER_ORDER[a.config.tier] - TIER_ORDER[b.config.tier]
    })

    return this.toHealth(ranked[0])
  }

  private toHealth(state: ProviderState): RpcProviderHealth {
    return {
      id: state.config.id,
      label: state.config.label,
      url: state.config.url,
      latencyMs: state.latencyMs,
      healthy: this.isHealthy(state.config.id),
      slow: state.slow,
      lastCheckedAt: state.lastCheckedAt,
      lastSuccessAt: state.lastSuccessAt,
      consecutiveFailures: state.consecutiveFailures,
    }
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
