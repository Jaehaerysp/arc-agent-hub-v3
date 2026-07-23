// RpcMetrics — aggregate counters (failovers, retries, last success)
// plus the snapshot assembly used by `RpcManager.getMetrics()`. Health
// state lives in RpcHealth; this module just accumulates the
// across-the-board counters and stitches everything together into the
// shape the DevTools panel (and anything else) subscribes to.

import type { RpcHealthTracker } from './RpcHealth'
import type { RpcMetricsSnapshot } from './types'

/** Requirement #3 — "Average latency (last 20 requests)" is a rolling window, not an all-time average. */
const LATENCY_WINDOW_SIZE = 20

export class RpcMetricsTracker {
  private failoverCount = 0
  private retryCount = 0
  private lastSuccessAt: number | null = null
  /** Rolling window of the last N measured round-trip latencies (whichever provider served each one). */
  private readonly latencySamples: number[] = []

  recordRetry(): void {
    this.retryCount += 1
  }

  recordFailover(): void {
    this.failoverCount += 1
  }

  recordSuccess(at: number = Date.now()): void {
    this.lastSuccessAt = at
  }

  /** Adds one measured request latency to the rolling window used for the average-latency figure. */
  recordLatencySample(latencyMs: number): void {
    this.latencySamples.push(Math.round(latencyMs))
    if (this.latencySamples.length > LATENCY_WINDOW_SIZE) {
      this.latencySamples.shift()
    }
  }

  private getAverageLatency(): number | null {
    if (this.latencySamples.length === 0) return null
    const sum = this.latencySamples.reduce((total, ms) => total + ms, 0)
    return Math.round(sum / this.latencySamples.length)
  }

  /** Builds the full telemetry snapshot — combines this tracker's counters with RpcHealth's per-provider state. */
  getMetrics(health: RpcHealthTracker): RpcMetricsSnapshot {
    const providers = health.getAllHealth()
    const activeId = health.getActiveProviderId()
    const active = activeId ? health.getHealth(activeId) : null
    const anyHealthy = providers.some((p) => p.healthy)

    const measured = providers.filter((p) => p.latencyMs !== null)
    let fastestProvider = null
    let slowestProvider = null
    for (const provider of measured) {
      if (!fastestProvider || provider.latencyMs! < fastestProvider.latencyMs!) fastestProvider = provider
      if (!slowestProvider || provider.latencyMs! > slowestProvider.latencyMs!) slowestProvider = provider
    }

    return {
      activeProviderId: activeId,
      activeProviderLabel: active?.label ?? null,
      latencyMs: active?.latencyMs ?? null,
      failoverCount: this.failoverCount,
      retryCount: this.retryCount,
      lastSuccessAt: this.lastSuccessAt,
      status: !anyHealthy ? 'down' : active?.slow ? 'degraded' : 'healthy',
      providers,
      averageLatencyMs: this.getAverageLatency(),
      fastestProvider,
      slowestProvider,
      selectionReason: health.getSelectionReason(),
      lastHealthCheckAt: health.getLastHealthCheckAt(),
    }
  }
}
