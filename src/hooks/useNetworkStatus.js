import { useCallback, useRef, useState } from 'react'
import { usePolling } from './usePolling'

const POLL_INTERVAL_MS = 10000

/**
 * Reads lightweight network diagnostics — latest block number and current
 * gas price — from the connected provider. Extracted out of the old
 * DeveloperToolsPage's inline `useEffect` so Wallet v7 (Network
 * Information) and Developer Tools v7 (Diagnostics) can both show live
 * network health without each polling the RPC independently.
 *
 * `latencyMs` is measured client-side around the `getBlockNumber` call —
 * a real round-trip time, not a placeholder — and is the only "latency"
 * figure surfaced anywhere in the UI.
 */
export function useNetworkStatus(provider) {
  const [blockNumber, setBlockNumber] = useState(null)
  const [gasPriceGwei, setGasPriceGwei] = useState(null)
  const [latencyMs, setLatencyMs] = useState(null)
  const [loading, setLoading] = useState(false)
  const inFlight = useRef(false)

  const refresh = useCallback(async () => {
    if (!provider || inFlight.current) {
      if (!provider) {
        setBlockNumber(null)
        setGasPriceGwei(null)
        setLatencyMs(null)
      }
      return
    }

    inFlight.current = true
    setLoading(true)
    const start = performance.now()

    try {
      const [block, fee] = await Promise.all([provider.getBlockNumber(), provider.getFeeData()])
      setLatencyMs(Math.round(performance.now() - start))
      setBlockNumber(block)
      setGasPriceGwei(fee.gasPrice ? Number(fee.gasPrice) / 1e9 : null)
    } catch {
      // RPC hiccup — keep last known values, try again next poll
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }, [provider])

  usePolling(refresh, POLL_INTERVAL_MS, Boolean(provider))

  return { blockNumber, gasPriceGwei, latencyMs, loading, refresh }
}
