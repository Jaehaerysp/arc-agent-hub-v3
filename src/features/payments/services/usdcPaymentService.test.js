import { describe, it, expect, vi, beforeEach } from 'vitest'
import { estimateUsdcTransferFee, estimateTransferFee, USDC_TOKEN, USDC_DECIMALS } from './usdcPaymentService'

// Fee/gas estimates now always go through RpcManager's read provider
// (`getReadProvider()`) instead of the `signerOrProvider` a caller passes
// in — see src/lib/rpc/ethersAdapter.js. The second positional argument
// is kept for backwards compatibility with existing call sites but no
// longer drives the actual read, so these tests mock the read provider
// directly and control its `getFeeData()` behavior via `readProviderState`.
const readProviderState = { getFeeData: async () => ({ gasPrice: 0n }) }

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
        constructor(address, abi, signerOrProvider) {
          this.address = address
          this.signerOrProvider = signerOrProvider
          this.transfer = {
            estimateGas: async () => {
              if (this.signerOrProvider?.shouldThrow) throw new Error('execution reverted')
              return 65000n
            },
          }
        }
      },
    },
  }
})

const VALID_ADDRESS = '0x' + '1'.repeat(40)

beforeEach(() => {
  readProviderState.getFeeData = async () => ({ gasPrice: 0n })
  readProviderState.shouldThrow = false
})

describe('USDC_TOKEN', () => {
  it('uses 6 decimals, matching the ERC-8183 job-funding USDC contract', () => {
    expect(USDC_TOKEN.decimals).toBe(6)
    expect(USDC_DECIMALS).toBe(6)
    expect(USDC_TOKEN.symbol).toBe('USDC')
  })
})

describe('estimateUsdcTransferFee', () => {
  it('estimates a fee from live gas units and fee data', async () => {
    readProviderState.getFeeData = async () => ({ gasPrice: 1000000000n }) // 1 gwei
    const result = await estimateUsdcTransferFee(null, '0xfrom', VALID_ADDRESS, '1.00')
    expect(result.error).toBeNull()
    expect(result.gasUnits).toBe(65000n)
    expect(result.gasPriceGwei).toBe(1)
    expect(result.feeFormatted).toBeGreaterThan(0)
  })

  it('rejects an invalid recipient instead of calling the chain', async () => {
    const result = await estimateUsdcTransferFee(null, '0xfrom', 'not-an-address', '1.00')
    expect(result.error).toBeTruthy()
    expect(result.feeFormatted).toBeNull()
  })

  it('rejects a zero/invalid amount', async () => {
    const result = await estimateUsdcTransferFee(null, '0xfrom', VALID_ADDRESS, '0')
    expect(result.error).toBeTruthy()
  })

  it('returns an error entry instead of throwing when the gas estimate reverts', async () => {
    readProviderState.shouldThrow = true
    const result = await estimateUsdcTransferFee(null, '0xfrom', VALID_ADDRESS, '1.00')
    expect(result.error).toBeTruthy()
    expect(result.gasUnits).toBeNull()
  })
})

describe('estimateTransferFee (generic, Sprint 2 — Universal Payment Support)', () => {
  const OTHER_TOKEN = { key: 'anv', symbol: 'ANV', address: '0x' + '2'.repeat(40), decimals: 18 }

  it('estimates a fee for a non-USDC token using its own address/decimals', async () => {
    readProviderState.getFeeData = async () => ({ gasPrice: 1000000000n })
    const result = await estimateTransferFee(OTHER_TOKEN, null, '0xfrom', VALID_ADDRESS, '1.00')
    expect(result.error).toBeNull()
    expect(result.gasUnits).toBe(65000n)
  })

  it('estimateUsdcTransferFee is equivalent to calling the generic function with USDC_TOKEN', async () => {
    readProviderState.getFeeData = async () => ({ gasPrice: 1000000000n })
    const viaUsdc = await estimateUsdcTransferFee(null, '0xfrom', VALID_ADDRESS, '1.00')
    const viaGeneric = await estimateTransferFee(USDC_TOKEN, null, '0xfrom', VALID_ADDRESS, '1.00')
    expect(viaUsdc).toEqual(viaGeneric)
  })
})
