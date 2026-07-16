import { useCallback, useEffect, useRef, useState } from 'react'
import { listJobsForAccount } from '../lib/blockchain/jobs'
import { usePolling } from './usePolling'

const POLL_INTERVAL_MS = 20000

/**
 * Loads every ERC-8183 job where the connected account is client or
 * provider. Prevents duplicate RPC requests and pauses polling while the
 * browser tab is hidden.
 */
export function useJobs(provider, account) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Prevent duplicate requests
  const loadingRef = useRef(false)

  // Avoid updating state after unmount
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!provider || !account) {
      if (mountedRef.current) {
        setJobs([])
        setError(null)
      }
      return
    }

    // Ignore if a request is already running
    if (loadingRef.current) {
      return
    }

    loadingRef.current = true

    if (mountedRef.current) {
      setLoading(true)
      setError(null)
    }

    try {
      const result = await listJobsForAccount(provider, account)

      if (mountedRef.current) {
        setJobs(result)
      }
    } catch (e) {
      console.error("Jobs refresh failed:", e)

      if (mountedRef.current) {
        setError(
          "Unable to load recent jobs. Arc Testnet RPC is temporarily busy. Please try again shortly."
        )
      }
    } finally {
      loadingRef.current = false

      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [provider, account])

  // Only poll while the tab is visible
  const pollingEnabled =
    Boolean(provider && account) &&
    document.visibilityState === 'visible'

  usePolling(refresh, POLL_INTERVAL_MS, pollingEnabled)

  return {
    jobs,
    loading,
    error,
    refresh,
  }
}
