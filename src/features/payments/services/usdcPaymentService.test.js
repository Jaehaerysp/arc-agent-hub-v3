import { describe, it, expect, vi } from 'vitest'
import { estimateUsdcTransferFee, estimateTransferFee, USDC_TOKEN, USDC_DECIMALS } from './usdcPaymentService'

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

describe('USDC_TOKEN', () => {
  it('uses 6 decimals, matching the ERC-8183 job-funding USDC contract', () => {
    expect(USDC_TOKEN.decimals).toBe(6)
    expect(USDC_DECIMALS).toBe(6)
    expect(USDC_TOKEN.symbol).toBe('USDC')
  })
})

describe('estimateUsdcTransferFee', () => {
  it('estimates a fee from live gas units and fee data', async () => {
    const provider = { getFeeData: async () => ({ gasPrice: 1000000000n }) } // 1 gwei
    const result = await estimateUsdcTransferFee(provider, '0xfrom', VALID_ADDRESS, '1.00')
    expect(result.error).toBeNull()
    expect(result.gasUnits).toBe(65000n)
    expect(result.gasPriceGwei).toBe(1)
    expect(result.feeFormatted).toBeGreaterThan(0)
  })

  it('falls back to signer.provider.getFeeData when the runner has no getFeeData of its own', async () => {
    const provider = { getFeeData: async () => ({ gasPrice: 2000000000n }) }
    const signer = { provider }
    const result = await estimateUsdcTransferFee(signer, '0xfrom', VALID_ADDRESS, '1.00')
    expect(result.error).toBeNull()
    expect(result.gasPriceGwei).toBe(2)
  })

  it('rejects an invalid recipient instead of calling the chain', async () => {
    const provider = { getFeeData: async () => ({ gasPrice: 1n }) }
    const result = await estimateUsdcTransferFee(provider, '0xfrom', 'not-an-address', '1.00')
    expect(result.error).toBeTruthy()
    expect(result.feeFormatted).toBeNull()
  })

  it('rejects a zero/invalid amount', async () => {
    const provider = { getFeeData: async () => ({ gasPrice: 1n }) }
    const result = await estimateUsdcTransferFee(provider, '0xfrom', VALID_ADDRESS, '0')
    expect(result.error).toBeTruthy()
  })

  it('returns an error entry instead of throwing when the gas estimate reverts', async () => {
    const provider = { shouldThrow: true, getFeeData: async () => ({ gasPrice: 1n }) }
    const result = await estimateUsdcTransferFee(provider, '0xfrom', VALID_ADDRESS, '1.00')
    expect(result.error).toBeTruthy()
    expect(result.gasUnits).toBeNull()
  })
})

describe('estimateTransferFee (generic, Sprint 2 — Universal Payment Support)', () => {
  const OTHER_TOKEN = { key: 'anv', symbol: 'ANV', address: '0x' + '2'.repeat(40), decimals: 18 }

  it('estimates a fee for a non-USDC token using its own address/decimals', async () => {
    const provider = { getFeeData: async () => ({ gasPrice: 1000000000n }) }
    const result = await estimateTransferFee(OTHER_TOKEN, provider, '0xfrom', VALID_ADDRESS, '1.00')
    expect(result.error).toBeNull()
    expect(result.gasUnits).toBe(65000n)
  })

  it('estimateUsdcTransferFee is equivalent to calling the generic function with USDC_TOKEN', async () => {
    const provider = { getFeeData: async () => ({ gasPrice: 1000000000n }) }
    const viaUsdc = await estimateUsdcTransferFee(provider, '0xfrom', VALID_ADDRESS, '1.00')
    const viaGeneric = await estimateTransferFee(USDC_TOKEN, provider, '0xfrom', VALID_ADDRESS, '1.00')
    expect(viaUsdc).toEqual(viaGeneric)
  })
})
