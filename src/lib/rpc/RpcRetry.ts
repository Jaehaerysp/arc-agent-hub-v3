// RpcRetry — the exponential-backoff retry executor used against a
// *single* provider before viem's `fallback()` gives up on it and moves
// to the next one in the chain (Requirement #3).
//
// This is deliberately provider-agnostic: it knows nothing about health
// state, rate limits, or which provider it's even talking to. It just
// takes an async "attempt" function and retries it, with jittered
// exponential backoff, up to `maxRetries` additional times. RpcHealth /
// RpcManager decide *what* to retry and what to do with the outcome.

/** Requirement #3 — retries against the same provider before failover. */
export const MAX_RETRIES_PER_PROVIDER = 2
export const RETRY_BASE_DELAY_MS = 250

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface RetryOptions {
  maxRetries?: number
  baseDelayMs?: number
  /** Called once per failed attempt (including the final, non-retried failure), so the caller can track retry metrics. */
  onRetry?: (attemptIndex: number, error: unknown) => void
}

/**
 * Runs `attempt` up to `1 + maxRetries` times total. Waits
 * `baseDelayMs * 2^attemptIndex` (plus a little jitter) between
 * attempts. Resolves with the first successful result, or rejects with
 * the last error once retries are exhausted.
 */
export async function withExponentialBackoff<T>(attempt: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const maxRetries = opts.maxRetries ?? MAX_RETRIES_PER_PROVIDER
  const baseDelayMs = opts.baseDelayMs ?? RETRY_BASE_DELAY_MS

  let lastError: unknown
  for (let attemptIndex = 0; attemptIndex <= maxRetries; attemptIndex++) {
    try {
      return await attempt()
    } catch (err) {
      lastError = err
      opts.onRetry?.(attemptIndex, err)

      if (attemptIndex < maxRetries) {
        const backoff = baseDelayMs * 2 ** attemptIndex + Math.random() * 100
        await wait(backoff)
      }
    }
  }

  throw lastError
}
