import { useCallback, useState } from 'react'

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Value is JSON-serialized. Pass a plain string key.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        try {
          if (resolved === null || resolved === undefined) {
            localStorage.removeItem(key)
          } else {
            localStorage.setItem(key, JSON.stringify(resolved))
          }
        } catch {
          // storage unavailable (private mode, quota) — fail silently
        }
        return resolved
      })
    },
    [key]
  )

  return [value, set]
}
