import { useCallback, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { CONTRACTS } from '../contracts/registry'
import { usePolling } from './usePolling'

// Background poll cadence. Was 15s — widened to the 60-90s "background
// refresh only" window (Sprint 2 Wallet Performance Optimization) since
// event-driven refreshes (connect/network switch/manual refresh, all via
// `refresh()` below) already cover the moments balances actually need to
// be current. This interval is just the fallback safety net.
const POLL_INTERVAL_MS = 75000

/**
 * Reads the native balance (USDC, the Arc Testnet gas token) and the
 * ANV ERC-20 balance for the connected account. Polls lightly so the
 * dashboard stays fresh without hammering the RPC.
 *
 * `refresh({ silent: true })` — used for the background poll tick — never
 * toggles `loading` once the first successful read has happened, and only
 * commits a new balance value when it actually changed, so already-visible
 * numbers never flash/blank out on a routine background refresh. A plain
 * `refresh()` (wallet connect, network switch, "Refresh" button, or after
 * an action completes) always shows loading, since that's a
 * person-visible moment worth signaling.
 */
export function useBalances(provider, account) {
  const [nativeBalance, setNativeBalance] = useState(null)
  const [anvBalance, setAnvBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const hasLoadedRef = useRef(false)

  const refresh = useCallback(
    async ({ silent = false } = {}) => {
      if (!provider || !account) {
        hasLoadedRef.current = false
        setNativeBalance(null)
        setAnvBalance(null)
        setLoading(false)
        return
      }

      const showLoading = !silent || !hasLoadedRef.current
      if (showLoading) setLoading(true)

      try {
        const [native, anvContract] = [
          provider.getBalance(account),
          new ethers.Contract(CONTRACTS.ANV_TOKEN.address, CONTRACTS.ANV_TOKEN.abi, provider),
        ]

        const [nativeRaw, anvRaw] = await Promise.all([native, anvContract.balanceOf(account)])

        const nextNative = Number(ethers.formatUnits(nativeRaw, 18))
        const nextAnv = Number(ethers.formatUnits(anvRaw, 18))

        // Only commit (and re-render) when the value actually moved.
        setNativeBalance((prev) => (prev === nextNative ? prev : nextNative))
        setAnvBalance((prev) => (prev === nextAnv ? prev : nextAnv))
        hasLoadedRef.current = true
      } catch {
        // RPC hiccup — keep last known values, try again next poll
      } finally {
        if (showLoading) setLoading(false)
      }
    },
    [provider, account]
  )

  const backgroundRefresh = useCallback(() => refresh({ silent: true }), [refresh])

  usePolling(backgroundRefresh, POLL_INTERVAL_MS, Boolean(provider && account))

  return { nativeBalance, anvBalance, loading, refresh }
}
