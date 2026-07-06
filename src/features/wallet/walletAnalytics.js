import { CONTRACTS } from '../../contracts/registry'
import { formatTokenAmount } from '../../lib/format'

/**
 * Pure selectors for Wallet v7 (Mission 8). Every function here reads
 * from data the app already fetches — `useBalances` (native + ANV) and
 * `wallet.activity` (locally logged transactions) — no new on-chain
 * reads are introduced.
 *
 * Documented limitation, same pattern as trustAnalytics.js: there is no
 * price oracle wired into this app, so no USD conversion is invented for
 * either token. Arc Testnet's native gas currency is itself named USDC
 * (see `src/chains/arc.js` — `nativeCurrency.symbol`), so "Native
 * Balance" and "USDC Balance" in the Mission 8 brief are the same
 * on-chain figure; ANV is the separate ERC-20 balanced tracked by
 * `useBalances`. Both are shown as real, distinct holdings rather than
 * summed into a fabricated single "portfolio value".
 */

export const NETWORK_LABEL = 'Arc Testnet'

/** Asset Balances — one card per real, held token; never fabricates a USD figure. */
export function computeAssetBalances(nativeBalance, anvBalance, isArcNetwork) {
  return [
    {
      key: 'native',
      symbol: 'USDC',
      name: 'Native Gas Token',
      balance: nativeBalance,
      balanceFormatted: formatTokenAmount(nativeBalance, 4),
      usdValue: null,
      network: NETWORK_LABEL,
      status: isArcNetwork ? 'connected' : 'wrong-network',
    },
    {
      key: 'anv',
      symbol: 'ANV',
      name: 'ANV Token',
      balance: anvBalance,
      balanceFormatted: formatTokenAmount(anvBalance, 4),
      usdValue: null,
      network: NETWORK_LABEL,
      status: isArcNetwork ? 'connected' : 'wrong-network',
      address: CONTRACTS.ANV_TOKEN.address,
    },
  ]
}

const TX_TYPE_LABELS = {
  transfer: 'Transfer',
  job: 'Job',
  register: 'Registration',
  feedback: 'Feedback',
  validation: 'Validation',
  network: 'Network',
}

export function txTypeLabel(type) {
  return TX_TYPE_LABELS[type] || (type ? type[0].toUpperCase() + type.slice(1) : 'Activity')
}

/** Recent Transactions table — only activity entries with a real on-chain tx hash. */
export function computeRecentTransactions(activity, limit = 8) {
  return activity
    .filter((a) => a.txHash)
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      hash: a.txHash,
      type: txTypeLabel(a.type),
      amount: a.detail || '—',
      network: NETWORK_LABEL,
      status: a.status,
      date: a.timestamp,
    }))
}

/** Activity Timeline — every locally logged event, success or failure, newest first. */
export function computeActivityTimeline(activity, limit = 10) {
  return activity.slice(0, limit).map((a) => ({
    id: a.id,
    type: a.type,
    label: a.label,
    detail: a.detail,
    status: a.status,
    txHash: a.txHash,
    timestamp: a.timestamp,
  }))
}

/** Network Information — RPC, chain, contract registry status; all static config plus one live poll. */
export function computeNetworkInfo({ isArcNetwork, chainId, rpcUrl, blockNumber, gasPriceGwei, latencyMs }) {
  return {
    chainName: NETWORK_LABEL,
    chainId,
    isArcNetwork,
    rpcUrl,
    blockNumber,
    gasPriceGwei,
    latencyMs,
    registryStatus: Object.values(CONTRACTS).length === 4 ? 'operational' : 'degraded',
    contractCount: Object.values(CONTRACTS).length,
  }
}
