// RpcCache — in-flight request coalescing (Requirement #11).
//
// Identical concurrent requests (same method + params) are collapsed
// into a single underlying call instead of being sent to the RPC layer
// twice. This is intentionally a *coalescing* cache, not a
// time-based response cache: once a request settles (success or
// failure) it is evicted immediately, so the next call for the same
// key always goes to the network fresh. That's the right tradeoff for
// chain reads, where "currently in flight" is the only kind of
// duplication we want to suppress.

export class RequestCache {
  private readonly inFlight = new Map<string, Promise<unknown>>()

  /** Builds the dedup key for a JSON-RPC call. Exposed so callers (RpcManager) can build keys consistently. */
  static key(method: string, params: unknown[]): string {
    return `${method}:${JSON.stringify(params)}`
  }

  /**
   * Returns the in-flight promise for `key` if one exists, otherwise
   * calls `factory()`, tracks it, and evicts it once it settles.
   */
  dedupe<T>(key: string, factory: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key)
    if (existing) return existing as Promise<T>

    const promise = factory().finally(() => {
      this.inFlight.delete(key)
    })

    this.inFlight.set(key, promise)
    return promise
  }

  /** Number of requests currently in flight — useful for diagnostics/tests. */
  get size(): number {
    return this.inFlight.size
  }
}
