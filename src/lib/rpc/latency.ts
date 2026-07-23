// Shared latency presentation helpers for the RPC diagnostics UI
// (Wallet & Network panel + RPC Resilience panel). Kept in one place so
// both panels color-code and label latency identically instead of each
// re-implementing the thresholds.

import type { RpcSelectionReason } from './types'

export type LatencyVariant = 'success' | 'warning' | 'error' | 'muted'

/** Color thresholds: <300ms green, 300–800ms yellow, >800ms red. `null` (not yet measured) renders muted. */
export function getLatencyVariant(latencyMs: number | null): LatencyVariant {
  if (latencyMs === null) return 'muted'
  if (latencyMs < 300) return 'success'
  if (latencyMs <= 800) return 'warning'
  return 'error'
}

export function formatLatency(latencyMs: number | null): string {
  return latencyMs !== null ? `${latencyMs} ms` : '—'
}

/** Human-readable label for why the active provider is the one currently selected. */
export function describeSelectionReason(reason: RpcSelectionReason | null): string {
  switch (reason) {
    case 'lowest-latency':
      return 'Lowest latency'
    case 'failover':
      return 'Failover (previous provider failed)'
    case 'recovery':
      return 'Recovery (returned to preferred provider)'
    case 'initial':
      return 'Initial selection'
    default:
      return '—'
  }
}

/** Builds the "Switched from X to Y ..." notification copy for a provider change. */
export function describeProviderSwitch(fromLabel: string, toLabel: string, reason: RpcSelectionReason | null): string {
  switch (reason) {
    case 'lowest-latency':
      return `Switched from ${fromLabel} to ${toLabel} due to high latency.`
    case 'failover':
      return `Switched from ${fromLabel} to ${toLabel} due to a provider failure.`
    case 'recovery':
      return `Switched from ${fromLabel} to ${toLabel} — preferred provider recovered.`
    default:
      return `Switched from ${fromLabel} to ${toLabel}.`
  }
}
