import { useState } from 'react'
import { useRpcHealth } from './useRpcHealth'
import { getRpcManager } from '../../lib/rpc/RpcManager'
import { getLatencyVariant, formatLatency, describeSelectionReason } from '../../lib/rpc/latency'
import { Panel, Badge, Button } from '../../ui/design-system'
import { CopyButton } from '../../ui/CopyButton'
import { IconActivity, IconRefresh } from '../../ui/icons'
import { formatTime } from '../../lib/format'

function statusBadge(status) {
  if (status === 'healthy') return <Badge variant="success" size="sm">Healthy</Badge>
  if (status === 'degraded') return <Badge variant="warning" size="sm">Degraded</Badge>
  return <Badge variant="error" size="sm">Down</Badge>
}

function healthBadge(healthy) {
  return healthy ? (
    <Badge variant="success" size="sm">Healthy</Badge>
  ) : (
    <Badge variant="error" size="sm">Unhealthy</Badge>
  )
}

/** Requirement #7 — color-coded latency: green <300ms, yellow 300-800ms, red >800ms. */
function LatencyBadge({ latencyMs }) {
  return (
    <Badge variant={getLatencyVariant(latencyMs)} size="sm">
      {formatLatency(latencyMs)}
    </Badge>
  )
}

/**
 * The Developer Tools "RPC Resilience" panel - the single place that
 * measures and displays RPC latency. Every latency figure here (and in
 * the Wallet & Network panel, via the same `useRpcHealth` snapshot)
 * comes straight from `RpcManager.getMetrics()`; nothing on this page
 * runs its own `performance.now()` timing.
 */
export default function RpcResiliencePanel() {
  const snapshot = useRpcHealth()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await getRpcManager().refreshHealth()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Panel
      icon={<IconActivity width={18} height={18} />}
      title="RPC Resilience"
      subtitle="Live telemetry from the resilient RPC layer (RpcManager)"
      className="wv7-devtools-panel"
      actions={
        <Button
          variant="secondary"
          size="sm"
          loading={refreshing}
          iconLeft={<IconRefresh width={14} height={14} />}
          onClick={handleRefresh}
        >
          Refresh RPC Health
        </Button>
      }
    >
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Status</span>
        <span className="wv7-devtools-value">{statusBadge(snapshot.status)}</span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Active RPC provider</span>
        <span className="wv7-devtools-value mono">{snapshot.activeProviderLabel ?? '—'}</span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Current RPC latency</span>
        <span className="wv7-devtools-value mono">
          <LatencyBadge latencyMs={snapshot.latencyMs} />
        </span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Average latency (last 20 requests)</span>
        <span className="wv7-devtools-value mono">
          <LatencyBadge latencyMs={snapshot.averageLatencyMs} />
        </span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Fastest provider</span>
        <span className="wv7-devtools-value mono">
          {snapshot.fastestProvider ? (
            <>
              {snapshot.fastestProvider.label} <LatencyBadge latencyMs={snapshot.fastestProvider.latencyMs} />
            </>
          ) : (
            '—'
          )}
        </span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Slowest provider</span>
        <span className="wv7-devtools-value mono">
          {snapshot.slowestProvider ? (
            <>
              {snapshot.slowestProvider.label} <LatencyBadge latencyMs={snapshot.slowestProvider.latencyMs} />
            </>
          ) : (
            '—'
          )}
        </span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Provider selection reason</span>
        <span className="wv7-devtools-value mono">{describeSelectionReason(snapshot.selectionReason)}</span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Last health check</span>
        <span className="wv7-devtools-value mono">
          {snapshot.lastHealthCheckAt ? formatTime(snapshot.lastHealthCheckAt) : '—'}
        </span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Failover count</span>
        <span className="wv7-devtools-value mono">{snapshot.failoverCount}</span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Retry count</span>
        <span className="wv7-devtools-value mono">{snapshot.retryCount}</span>
      </div>
      <div className="wv7-devtools-row">
        <span className="wv7-devtools-label">Last successful request</span>
        <span className="wv7-devtools-value mono">
          {snapshot.lastSuccessAt ? formatTime(snapshot.lastSuccessAt) : '—'}
        </span>
      </div>

      <div className="wv7-devtools-contracts" style={{ marginTop: '1rem' }}>
        {snapshot.providers.map((provider) => (
          <div className="wv7-devtools-row" key={provider.id}>
            <span className="wv7-devtools-label">
              {provider.label}
              {provider.id === snapshot.activeProviderId ? ' (active)' : ''}
            </span>
            <span className="wv7-devtools-value mono">
              <LatencyBadge latencyMs={provider.latencyMs} />
              {provider.slow ? ' (slow)' : ''}
              {healthBadge(provider.healthy)}
              <CopyButton value={provider.url} label="" />
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
