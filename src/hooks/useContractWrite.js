import { useCallback, useState } from 'react'
import { ethers } from 'ethers'

/**
 * Wraps a single on-chain write call with consistent loading/error/success
 * state and optional activity-feed logging. Every transaction panel
 * (Agents, Reputation, Validation, Transfer) shares this instead of
 * re-implementing its own try/catch/finally block.
 */
export function useContractWrite({ address, abi, signer, addActivity }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const reset = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const execute = useCallback(
    async (method, args, activityMeta = {}) => {
      if (!signer) {
        setError('Connect your wallet to continue')
        return null
      }

      setLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const contract = new ethers.Contract(address, abi, signer)
        const tx = await contract[method](...args)
        const receipt = await tx.wait()

        const result = { txHash: tx.hash, receipt }
        setSuccess(result)

        if (addActivity) {
          addActivity({
            status: 'success',
            txHash: tx.hash,
            ...activityMeta,
          })
        }

        return result
      } catch (e) {
        const msg = e?.reason || e?.shortMessage || e?.message || 'Transaction failed'
        setError(msg)

        if (addActivity) {
          addActivity({
            status: 'error',
            detail: msg,
            ...activityMeta,
            label: activityMeta.failLabel || activityMeta.label,
          })
        }

        return null
      } finally {
        setLoading(false)
      }
    },
    [address, abi, signer, addActivity]
  )

  return { execute, loading, error, success, reset }
}
