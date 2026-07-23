// useRpcHealth — subscribes a component to RpcManager's live telemetry
// (active provider, latency, failover/retry counts, per-provider health).
// Used by the DevTools panel; kept generic enough that anything else
// (a status dot in the header, a toast on "down") could use it too.

import { useEffect, useState } from 'react'
import { getRpcManager } from '../../lib/rpc/RpcManager'
import type { RpcMetricsSnapshot } from '../../lib/rpc/types'

export function useRpcHealth(): RpcMetricsSnapshot {
  const [snapshot, setSnapshot] = useState<RpcMetricsSnapshot>(() => getRpcManager().getMetrics())

  useEffect(() => {
    const unsubscribe = getRpcManager().subscribe(setSnapshot)
    return unsubscribe
  }, [])

  return snapshot
}
