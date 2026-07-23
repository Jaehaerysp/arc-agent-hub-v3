// Shared types for the RpcManager layer. Kept in their own file so both
// the manager itself and any consumer (hooks, the DevTools panel, the
// ethers compatibility adapter) can import types without pulling in the
// runtime code.

/** One configured RPC endpoint, in priority order. */
export interface RpcProviderConfig {
  /** Stable identifier — used as the map key everywhere (health cache, telemetry, logs). */
  id: string
  /** Human-readable name shown in dev logs and the DevTools panel. */
  label: string
  /** The actual JSON-RPC HTTP endpoint. */
  url: string
  /** Priority tier — lower index tried first, both for viem's fallback order and our own ranking bias. */
  tier: 'primary' | 'secondary' | 'third' | 'fallback'
}

/**
 * Why the currently active provider became active:
 *  - 'initial'       first successful request of the session, nothing to switch from
 *  - 'lowest-latency' both providers were healthy; we re-ranked to a faster one
 *  - 'failover'       the previously active provider is currently unhealthy
 *  - 'recovery'       we returned to a higher-priority provider once it became healthy again
 */
export type RpcSelectionReason = 'initial' | 'lowest-latency' | 'failover' | 'recovery'

/** Point-in-time health snapshot for a single provider. */
export interface RpcProviderHealth {
  id: string
  label: string
  url: string
  /** Round-trip latency of the most recent successful request, in ms. `null` if never measured. */
  latencyMs: number | null
  /** Whether the provider is considered usable right now (see SLOW_THRESHOLD_MS / health cache TTL). */
  healthy: boolean
  /** Whether the last measured request exceeded SLOW_THRESHOLD_MS. */
  slow: boolean
  lastCheckedAt: number | null
  lastSuccessAt: number | null
  consecutiveFailures: number
}

/** Aggregate snapshot the DevTools panel (and anything else) subscribes to. Returned by `RpcManager.getMetrics()`. */
export interface RpcMetricsSnapshot {
  activeProviderId: string | null
  activeProviderLabel: string | null
  /** Latency of the most recent request served by the active provider. */
  latencyMs: number | null
  /** Number of times the active provider has changed since the app loaded. */
  failoverCount: number
  /** Total number of retry attempts issued across all providers. */
  retryCount: number
  lastSuccessAt: number | null
  status: 'healthy' | 'degraded' | 'down'
  providers: RpcProviderHealth[]
  /** Mean of the last 20 measured request latencies (across whichever provider served each one). `null` until the first sample. */
  averageLatencyMs: number | null
  /** Provider with the lowest measured latency right now, among those with a measurement. */
  fastestProvider: RpcProviderHealth | null
  /** Provider with the highest measured latency right now, among those with a measurement. */
  slowestProvider: RpcProviderHealth | null
  /** Why the active provider is the one currently selected (lowest latency / failover / recovery / initial). */
  selectionReason: RpcSelectionReason | null
  /** Most recent timestamp any provider was probed (a real request or an explicit `refreshHealth()` call). */
  lastHealthCheckAt: number | null
}

/** @deprecated use `RpcMetricsSnapshot` — kept as an alias so existing imports (`useRpcHealth`, DevTools panel) don't need to change. */
export type RpcManagerSnapshot = RpcMetricsSnapshot

export type RpcManagerListener = (snapshot: RpcMetricsSnapshot) => void
