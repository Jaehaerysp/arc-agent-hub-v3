import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { CONTRACTS } from '../contracts/registry'

const POLL_INTERVAL_MS = 15000

/**
 * Reads the native balance (USDC, the Arc Testnet gas token) and the
 * ANV ERC-20 balance for the connected account. Polls lightly so the
 * dashboard stays fresh without hammering the RPC.
 */
export function useBalances(provider, account) {
  const [nativeBalance, setNativeBalance] = useState(null)
  const [anvBalance, setAnvBalance] = useState(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!provider || !account) {
      setNativeBalance(null)
      setAnvBalance(null)
      return
    }

    setLoading(true)

    try {
      const [native, anvContract] = [
        provider.getBalance(account),
        new ethers.Contract(CONTRACTS.ANV_TOKEN.address, CONTRACTS.ANV_TOKEN.abi, provider),
      ]

      const [nativeRaw, anvRaw] = await Promise.all([native, anvContract.balanceOf(account)])

      setNativeBalance(Number(ethers.formatUnits(nativeRaw, 18)))
      setAnvBalance(Number(ethers.formatUnits(anvRaw, 18)))
    } catch {
      // RPC hiccup — keep last known values, try again next poll
    } finally {
      setLoading(false)
    }
  }, [provider, account])

  useEffect(() => {
    refresh()
    if (!provider || !account) return
    const interval = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refresh, provider, account])

  return { nativeBalance, anvBalance, loading, refresh }
}
