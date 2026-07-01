import { useCallback, useRef, useState } from 'react'

export function useCopyToClipboard(resetDelay = 1500) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  const copy = useCallback(
    async (text) => {
      if (!text) return
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), resetDelay)
      } catch {
        // clipboard API unavailable — no-op
      }
    },
    [resetDelay]
  )

  return [copied, copy]
}
