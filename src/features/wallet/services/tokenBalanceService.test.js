import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTokenBalance, fetchTokenBalances } from './tokenBalanceService'
import { WALLET_TOKENS } from './tokenRegistry'

const TOKEN = WALLET_TOKENS[0]

// The service now always reads through RpcManager's provider
// (`getReadProvider()`), not whatever `provider` argument a caller passes
// in — see src/lib/rpc/ethersAdapter.js. `provider` is kept as a
// parameter only as the "is a wallet connected" gate one layer up
// (useTokenBalances), so these tests mock the read provider directly and
// control its behavior per test via `readProviderState`.
const readProviderState = { rawBalance: 0n, shouldThrow: false }

vi.mock('../../../lib/rpc/ethersAdapter', () => ({
  getReadProvider: () => readProviderState,
}))

vi.mock('ethers', async () => {
  const actual = await vi.importActual('ethers')
  return {
    ...actual,
    ethers: {
      ...actual.ethers,
      Contract: class {
        constructor(address, abi, provider) {
          this.address = address
          this.provider = provider
        }
        async balanceOf() {
          if (this.provider?.shouldThrow) throw new Error('RPC unavailable')
          return this.provider?.rawBalance ?? 0n
        }
      },
    },
  }
})

beforeEach(() => {
  readProviderState.rawBalance = 0n
  readProviderState.shouldThrow = false
})

describe('fetchTokenBalance', () => {
  it('formats a successful read using the token decimals', async () => {
    readProviderState.rawBalance = 1000000n // 1 EURC at 6 decimals
    const result = await fetchTokenBalance(null, TOKEN, '0xabc')
    expect(result.symbol).toBe(TOKEN.symbol)
    expect(result.balance).toBe(1)
    expect(result.error).toBeNull()
  })

  it('returns an error entry instead of throwing when the read fails', async () => {
    readProviderState.shouldThrow = true
    const result = await fetchTokenBalance(null, TOKEN, '0xabc')
    expect(result.balance).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it('carries the token category through to the result', async () => {
    const result = await fetchTokenBalance(null, TOKEN, '0xabc')
    expect(result.category).toBe(TOKEN.category)
  })
})

describe('fetchTokenBalances', () => {
  it('returns no results and no error when provider/account are missing', async () => {
    const { results, error } = await fetchTokenBalances(null, null)
    expect(results).toEqual([])
    expect(error).toBeNull()
  })

  it('reads every token in the registry in parallel', async () => {
    const provider = { rawBalance: 0n }
    const { results, error } = await fetchTokenBalances(provider, '0xabc', WALLET_TOKENS)
    expect(results).toHaveLength(WALLET_TOKENS.length)
    expect(error).toBeNull()
  })

  it("one token's failure doesn't prevent the others from resolving", async () => {
    readProviderState.shouldThrow = true
    const provider = { shouldThrow: true }
    const { results } = await fetchTokenBalances(provider, '0xabc', WALLET_TOKENS)
    expect(results).toHaveLength(WALLET_TOKENS.length)
    expect(results.every((r) => r.error)).toBe(true)
  })
})
