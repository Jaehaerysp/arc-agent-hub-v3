import { describe, it, expect } from 'vitest'
import {
  computeAssetBalances,
  computeRecentTransactions,
  computeActivityTimeline,
  computeNetworkInfo,
  txTypeLabel,
} from './walletAnalytics'

function activityEntry(overrides = {}) {
  return { id: 1, type: 'transfer', label: 'ANV transfer', status: 'success', timestamp: '2026-01-01T00:00:00.000Z', ...overrides }
}

describe('computeAssetBalances', () => {
  it('returns native and ANV assets with no fabricated USD value', () => {
    const assets = computeAssetBalances(12.5, 42, true)
    expect(assets).toHaveLength(2)
    expect(assets[0].key).toBe('native')
    expect(assets[0].usdValue).toBeNull()
    expect(assets[1].key).toBe('anv')
    expect(assets[1].usdValue).toBeNull()
    expect(assets.every((a) => a.status === 'connected')).toBe(true)
  })

  it('flags wrong-network status when not on Arc', () => {
    const assets = computeAssetBalances(null, null, false)
    expect(assets.every((a) => a.status === 'wrong-network')).toBe(true)
  })
})

describe('computeRecentTransactions', () => {
  it('only includes activity entries with a real tx hash', () => {
    const activity = [activityEntry({ id: 1, txHash: '0xabc' }), activityEntry({ id: 2, txHash: null })]
    const txs = computeRecentTransactions(activity, 10)
    expect(txs).toHaveLength(1)
    expect(txs[0].hash).toBe('0xabc')
  })

  it('respects the limit', () => {
    const activity = Array.from({ length: 5 }, (_, i) => activityEntry({ id: i, txHash: `0x${i}` }))
    expect(computeRecentTransactions(activity, 2)).toHaveLength(2)
  })

  it('falls back to an em dash when there is no detail', () => {
    const activity = [activityEntry({ id: 1, txHash: '0xabc', detail: undefined })]
    expect(computeRecentTransactions(activity)[0].amount).toBe('—')
  })
})

describe('computeActivityTimeline', () => {
  it('maps every activity entry, not just ones with a tx hash', () => {
    const activity = [activityEntry({ id: 1, txHash: null }), activityEntry({ id: 2, txHash: '0xabc' })]
    expect(computeActivityTimeline(activity)).toHaveLength(2)
  })
})

describe('computeNetworkInfo', () => {
  it('reports operational registry status when all four contracts are configured', () => {
    const info = computeNetworkInfo({ isArcNetwork: true, chainId: 5042002, rpcUrl: 'https://rpc', blockNumber: 100, gasPriceGwei: 1.2, latencyMs: 50 })
    expect(info.registryStatus).toBe('operational')
    expect(info.contractCount).toBe(4)
  })
})

describe('txTypeLabel', () => {
  it('maps known types to human labels', () => {
    expect(txTypeLabel('transfer')).toBe('Transfer')
    expect(txTypeLabel('job')).toBe('Job')
  })

  it('title-cases unknown types instead of throwing', () => {
    expect(txTypeLabel('custom')).toBe('Custom')
  })

  it('falls back to Activity for a missing type', () => {
    expect(txTypeLabel(undefined)).toBe('Activity')
  })
})
