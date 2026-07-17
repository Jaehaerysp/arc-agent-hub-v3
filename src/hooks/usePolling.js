import { useEffect } from 'react'

/**
 * Calls `fn` once immediately, then every `intervalMs` for as long as
 * `enabled` stays true, clearing the interval on unmount or whenever `fn`,
 * `intervalMs`, or `enabled` changes.
 *
 * Extracted from the identical refresh+interval+cleanup shape that
 * `useBalances` and `useJobs` each implemented independently. Both hooks
 * already guard their own `fn` against a missing provider/account (resetting
 * state to null/empty), so `enabled` only needs to control whether a repeat
 * timer is scheduled — it does not skip the initial call. This preserves
 * the exact previous behavior of both hooks:
 *
 *   useEffect(() => {
 *     refresh()
 *     if (!provider || !account) return
 *     const interval = setInterval(refresh, POLL_INTERVAL_MS)
 *     return () => clearInterval(interval)
 *   }, [refresh, provider, account])
 *
 * @param {() => void} fn - Function to call immediately and on each tick.
 * @param {number} intervalMs - Delay between calls, in milliseconds.
 * @param {boolean} [enabled=true] - Whether repeat polling should run.
 */
export function usePolling(fn, intervalMs, enabled = true) {
  useEffect(() => {
    fn()
    if (!enabled) return
    const interval = setInterval(fn, intervalMs)
    return () => clearInterval(interval)
  }, [fn, intervalMs, enabled])
}
