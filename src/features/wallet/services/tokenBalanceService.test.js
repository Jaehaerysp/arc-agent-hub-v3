import { describe, it, expect, vi } from 'vitest'
import { fetchTokenBalance, fetchTokenBalances } from './tokenBalanceService'
import { WALLET_TOKENS } from './tokenRegistry'

const TOKEN = WALLET_TOKENS[0]

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

describe('fetchTokenBalance', () => {
  it('formats a successful read using the token decimals', async () => {
    const provider = { rawBalance: 1000000n } // 1 EURC at 6 decimals
    const result = await fetchTokenBalance(provider, TOKEN, '0xabc')
    expect(result.symbol).toBe(TOKEN.symbol)
    expect(result.balance).toBe(1)
    expect(result.error).toBeNull()
  })

  it('returns an error entry instead of throwing when the read fails', async () => {
    const provider = { shouldThrow: true }
    const result = await fetchTokenBalance(provider, TOKEN, '0xabc')
    expect(result.balance).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it('carries the token category through to the result', async () => {
    const provider = { rawBalance: 0n }
    const result = await fetchTokenBalance(provider, TOKEN, '0xabc')
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
    const provider = { shouldThrow: true }
    const { results } = await fetchTokenBalances(provider, '0xabc', WALLET_TOKENS)
    expect(results).toHaveLength(WALLET_TOKENS.length)
    expect(results.every((r) => r.error)).toBe(true)
  })
})
