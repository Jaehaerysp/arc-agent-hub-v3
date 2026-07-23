// Public entry point for the resilient RPC layer. Every blockchain
// service/hook in the app should import from here (or from
// `./RpcManager` / `./ethersAdapter` directly) rather than reaching
// into viem/ethers itself — see RpcManager.ts's header comment for why.

export { getRpcManager, RpcUnavailableError, ARC_TESTNET_CHAIN_ID } from './RpcManager'
export { getReadProvider, RpcManagedProvider } from './ethersAdapter'
export { getRpcProviderConfigs, getPrimaryRpcUrl, getAllRpcUrls } from './config'

export type { RpcMetricsSnapshot, RpcManagerSnapshot, RpcProviderHealth, RpcProviderConfig, RpcManagerListener } from './types'

// The individual building blocks — exported for tests and advanced
// consumers (e.g. a future health-check CLI), but ordinary app code
// should keep going through `getRpcManager()` rather than composing
// these directly.
export { RpcHealthTracker, SLOW_THRESHOLD_MS, HEALTH_CACHE_TTL_MS, RATE_LIMIT_MAX_TOKENS, RATE_LIMIT_REFILL_MS } from './RpcHealth'
export { RequestCache } from './RpcCache'
export { RpcMetricsTracker } from './RpcMetrics'
export { withExponentialBackoff, MAX_RETRIES_PER_PROVIDER, RETRY_BASE_DELAY_MS } from './RpcRetry'
