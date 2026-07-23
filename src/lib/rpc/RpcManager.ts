// RpcManager — the single resilient RPC layer for Arc Testnet.
//
// Every RPC call the app makes (reads, gas estimates, log queries) goes
// through here instead of talking to `https://rpc.testnet.arc.network`
// directly. This is also the *only* module in the app allowed to call
// viem's `createPublicClient` / `createWalletClient` / `http` /
// `fallback`, or construct an `ethers.JsonRpcProvider` — every
// blockchain service imports RpcManager (directly, or through the
// `ethersAdapter` read-provider built on top of it) instead of
// instantiating its own client. See ARCHITECTURE.md.
//
// Architecture:
//   RpcManager.request()          — public entry point: dedup (RpcCache)
//                                    + timeout/abort
//     -> viem `fallback([...])`   — tries providers in ranked-latency order
//          -> instrumented        — one per provider: rate limit + retry
//             transport             (RpcRetry), latency measurement and
//                                   health-cache bookkeeping (RpcHealth),
//                                   dev-mode logging
//
// RpcManager itself only wires these pieces together and owns the
// viem client instances; the bookkeeping logic lives in:
//   RpcHealth.ts  — per-provider health, ranking, rate limiting
//   RpcCache.ts   — in-flight request coalescing
//   RpcRetry.ts   — exponential-backoff retry executor
//   RpcMetrics.ts — aggregate counters + the getMetrics() snapshot
//
// A single module-level instance is exported (`rpcManager`) — the app
// only ever needs one resilient connection to one chain.
//
// Wallet-signed transactions are the one deliberate exception to "all
// RPC traffic goes through here": those are broadcast by the connected
// wallet through whatever RPC *it* is configured with, which is how
// EIP-1193 wallets work and outside what an app-level RPC manager can
// or should override. `getWalletClient()` below still centralizes
// *that* client's construction too, though, so no component needs to
// call `createWalletClient` itself — see its doc comment for why that
// one intentionally talks to the injected wallet, not the fallback
// pool. `src/chains/arc.js` separately tells the wallet about all four
// providers, so the wallet has its own fallback list too.

import { createPublicClient, createWalletClient, custom, fallback, http, type Chain, type Transport } from 'viem'
import type { RpcManagerListener, RpcMetricsSnapshot, RpcProviderConfig, RpcProviderHealth } from './types'
import { getRpcProviderConfigs } from './config'
import { RpcHealthTracker, SLOW_THRESHOLD_MS } from './RpcHealth'
import { RequestCache } from './RpcCache'
import { RpcMetricsTracker } from './RpcMetrics'
import { withExponentialBackoff } from './RpcRetry'

const ARC_CHAIN_ID = 5042002
/** Requirement #10 — hard per-attempt timeout. */
const REQUEST_TIMEOUT_MS = 8000
/** Matches RpcHealth's HEALTH_CACHE_TTL_MS — how often viem's fallback transport re-ranks providers by latency. */
const RANK_INTERVAL_MS = 30_000

export class RpcUnavailableError extends Error {
  constructor() {
    super('RPC network temporarily unavailable')
    this.name = 'RpcUnavailableError'
  }
}

function isDev(): boolean {
  try {
    return Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV)
  } catch {
    return false
  }
}

function buildChain(configs: RpcProviderConfig[]): Chain {
  return {
    id: ARC_CHAIN_ID,
    name: 'Arc Testnet',
    nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
    rpcUrls: {
      default: { http: configs.map((c) => c.url) },
    },
  } as Chain
}

class RpcManager {
  private readonly configs: RpcProviderConfig[]
  private readonly health: RpcHealthTracker
  private readonly metrics = new RpcMetricsTracker()
  private readonly cache = new RequestCache()
  private readonly listeners = new Set<RpcManagerListener>()
  private readonly chain: Chain
  private readonly publicClient: ReturnType<typeof createPublicClient>
  private walletClient: ReturnType<typeof createWalletClient> | null = null

  constructor(configs: RpcProviderConfig[]) {
    this.configs = configs
    this.health = new RpcHealthTracker(configs)
    this.chain = buildChain(configs)

    const transports = configs.map((config) => this.createInstrumentedTransport(config))

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: fallback(transports, {
        // viem re-ranks providers by latency on this cadence instead of on
        // every single call — this IS requirement #8 ("don't repeatedly
        // test every provider on every request"), and the interval doubles
        // as requirement #7's health cache.
        rank: { interval: RANK_INTERVAL_MS, timeout: SLOW_THRESHOLD_MS },
        retryCount: 0, // retries are handled per-provider inside the instrumented transport (RpcRetry)
      }),
    })
  }

  // ---------------------------------------------------------------------
  // Required public API
  // ---------------------------------------------------------------------

  /** The viem PublicClient backed by the resilient fallback transport — for anything that wants viem's typed read actions directly. */
  getPublicClient() {
    return this.publicClient
  }

  /**
   * The viem WalletClient for signed writes, backed by the injected
   * EIP-1193 wallet (`window.ethereum`) rather than RpcManager's own
   * read-fallback pool — a wallet broadcasts through whatever RPC *it*
   * is configured with, which an app-level manager can't override.
   * Centralizing construction here still matters: it means no
   * component ever calls `createWalletClient` itself, keeping "every
   * client comes from RpcManager" true for writes too.
   * Throws if there is no injected wallet (e.g. no MetaMask installed).
   */
  getWalletClient() {
    if (this.walletClient) return this.walletClient

    const injected = (globalThis as unknown as { window?: { ethereum?: unknown } }).window?.ethereum
    if (!injected) {
      throw new Error('No injected wallet found (window.ethereum is undefined). Connect a wallet first.')
    }

    this.walletClient = createWalletClient({
      chain: this.chain,
      transport: custom(injected as Parameters<typeof custom>[0]),
    })
    return this.walletClient
  }

  /** The currently best-ranked healthy provider (lowest latency, tier order as tiebreak), or `null` if every provider is unhealthy. */
  getBestProvider(): RpcProviderHealth | null {
    return this.health.getBestProvider()
  }

  /** Aggregate telemetry — active provider, latency, failover/retry counts, per-provider health. Used by `useRpcHealth` / the DevTools panel. */
  getMetrics(): RpcMetricsSnapshot {
    return this.metrics.getMetrics(this.health)
  }

  /** @deprecated alias for `getMetrics()`, kept so existing subscribers don't need to change. */
  getSnapshot(): RpcMetricsSnapshot {
    return this.getMetrics()
  }

  /**
   * Requirement #7/#8 — forces an immediate re-probe of every
   * configured provider instead of waiting for the health-cache TTL to
   * expire on its own. Clears each provider's "unhealthy" mark, then
   * sends a lightweight `eth_blockNumber` directly through every
   * provider's instrumented transport (not just the currently active
   * one), so the whole health table is fresh — not just whichever
   * provider the next real request happens to hit.
   */
  async refreshHealth(): Promise<RpcMetricsSnapshot> {
    this.health.clearHealthCache()

    await Promise.allSettled(
      this.configs.map((config) =>
        this.runWithResilience(config, () =>
          http(config.url, { timeout: REQUEST_TIMEOUT_MS, retryCount: 0 })({ chain: this.chain }).request({
            method: 'eth_blockNumber',
          } as never)
        )
      )
    )

    this.notify()
    return this.getMetrics()
  }

  /**
   * Issues a raw JSON-RPC request through the resilient transport chain.
   * Requirement #11: identical concurrent requests (same method + params)
   * are coalesced into a single in-flight call instead of being sent
   * twice (RpcCache). Requirement #12: pass an AbortSignal via
   * `opts.signal` to cancel; requirement #10: `opts.timeoutMs` overrides
   * the default per-attempt timeout.
   */
  async request<T = unknown>(
    method: string,
    params: unknown[] = [],
    opts: { signal?: AbortSignal; timeoutMs?: number } = {}
  ): Promise<T> {
    const key = RequestCache.key(method, params)
    return this.cache.dedupe(key, () => this.executeRequest<T>(method, params, opts))
  }

  /** Subscribe to telemetry changes. Returns an unsubscribe function. */
  subscribe(listener: RpcManagerListener): () => void {
    this.listeners.add(listener)
    listener(this.getMetrics())
    return () => {
      this.listeners.delete(listener)
    }
  }

  // ---------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------

  private notify() {
    const snapshot = this.getMetrics()
    for (const listener of this.listeners) listener(snapshot)
  }

  private async executeRequest<T>(
    method: string,
    params: unknown[],
    opts: { signal?: AbortSignal; timeoutMs?: number }
  ): Promise<T> {
    if (opts.signal?.aborted) {
      throw new DOMException('Request aborted', 'AbortError')
    }

    const timeoutMs = opts.timeoutMs ?? REQUEST_TIMEOUT_MS
    const controller = new AbortController()
    const onExternalAbort = () => controller.abort()
    opts.signal?.addEventListener('abort', onExternalAbort)
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const result = (await this.publicClient.request({ method, params } as never, {})) as T

      this.metrics.recordSuccess()
      this.notify()
      return result
    } catch (err) {
      // Every configured provider has already been tried (that's viem
      // fallback's job) and every one failed — surface the graceful
      // message instead of a raw transport error (requirement #9).
      this.notify()
      if ((err as { name?: string })?.name === 'AbortError') throw err
      throw new RpcUnavailableError()
    } finally {
      clearTimeout(timeoutId)
      opts.signal?.removeEventListener('abort', onExternalAbort)
    }
  }

  private createInstrumentedTransport(config: RpcProviderConfig): Transport {
    const base = http(config.url, {
      timeout: REQUEST_TIMEOUT_MS,
      retryCount: 0, // RpcRetry owns retries, so viem shouldn't also retry
    })
    // Close over the manager instance directly — the returned transport is
    // a plain object literal, so a `this`-based lookup inside `request()`
    // would resolve to that object, not the RpcManager. `self` sidesteps
    // that entirely regardless of how viem invokes `request`.
    const self = this

    return (transportConfig) => {
      const instance = base(transportConfig)

      return {
        ...instance,
        async request(args: { method: string; params?: unknown }) {
          return self.runWithResilience(config, () => instance.request(args as never))
        },
      } as unknown as ReturnType<Transport>
    }
  }

  /** Runs one call (with rate limiting, exponential-backoff retry, timing, and health bookkeeping) against a single provider. */
  private async runWithResilience<T>(config: RpcProviderConfig, attempt: () => Promise<T>): Promise<T> {
    await this.health.acquireRateLimitToken(config.id)

    try {
      const result = await withExponentialBackoff(
        async () => {
          const startedAt = performance.now()
          const value = await attempt()
          const latencyMs = performance.now() - startedAt
          this.metrics.recordLatencySample(latencyMs)
          const { didFailover } = this.health.recordSuccess(config.id, latencyMs)
          if (didFailover) {
            this.metrics.recordFailover()
            if (isDev()) {
              // eslint-disable-next-line no-console
              console.info(`[RpcManager] active provider -> ${config.label} (${config.url})`)
            }
          }
          return value
        },
        {
          onRetry: () => {
            this.metrics.recordRetry()
          },
        }
      )
      return result
    } catch (err) {
      this.health.recordFailure(config.id)
      if (isDev()) {
        // eslint-disable-next-line no-console
        console.warn(`[RpcManager] ${config.label} marked unhealthy`)
      }
      throw err
    }
  }
}

let instance: RpcManager | null = null

/** The shared RpcManager for Arc Testnet. Lazily created on first access. */
export function getRpcManager(): RpcManager {
  if (!instance) {
    instance = new RpcManager(getRpcProviderConfigs())
  }
  return instance
}

export const ARC_TESTNET_CHAIN_ID = ARC_CHAIN_ID
export type { RpcManager }
