// Bridge Center — fee & time estimation.
//
// Same "pure, never-throws" shape as `usdcPaymentService.estimateTransferFee`.
// Two different kinds of estimate live here, and they're kept honest about
// what's live vs. reference data:
//
//   - Network fee: a REAL, live estimate — the gas the connected wallet
//     would actually pay for the ERC-20 `approve` step on Arc Testnet
//     (the first on-chain action of any bridge, funded on the source
//     chain regardless of destination). It's computed the same way
//     `estimateTransferFee` does it: `estimateGas` + current `feeData`
//     against the real token contract, never a guess.
//   - Estimated arrival time: NOT live. Circle's CCTP publishes two
//     transfer speeds — a fast/soft-finality path (seconds) and a
//     standard/hard-finality path (minutes, longer on L1 Ethereum) — and
//     that's a protocol-level constant, not something an RPC call can
//     tell you ahead of a transfer. The ranges below are labeled as
//     Circle's published typical ranges, not a per-transfer measurement.

import { ethers } from 'ethers'
import { ERC20_ABI } from '../../../contracts/abis/erc20'
import { getReadProvider } from '../../../lib/rpc/ethersAdapter'

/**
 * Typical arrival windows by transfer speed, per Circle's published CCTP
 * behavior: L1 Ethereum's finality is materially slower than L2/alt-L1
 * testnets, so it gets its own bucket.
 */
const ARRIVAL_WINDOWS = {
  'ethereum-sepolia': { fast: '~20 sec', standard: '~15–20 min' },
  default: { fast: '~8–20 sec', standard: '~1–3 min' },
}

export function estimateBridgeArrival(networkId) {
  return ARRIVAL_WINDOWS[networkId] || ARRIVAL_WINDOWS.default
}

/**
 * Live gas estimate for the `approve` step of a bridge, against the real
 * token contract on Arc Testnet. Never throws — resolves to
 * `{ ...null fields, error }` so the form can still proceed; the estimate
 * is advisory, same as Payments'.
 */
export async function estimateBridgeFee(token, _signerOrProvider, from, amount, spender) {
  try {
    if (!amount || Number(amount) <= 0) throw new Error('Invalid amount')
    if (!spender || !ethers.isAddress(spender)) throw new Error('No bridge contract configured for this network')

    const readProvider = getReadProvider()
    const contract = new ethers.Contract(token.address, ERC20_ABI, readProvider)
    const parsedAmount = ethers.parseUnits(amount, token.decimals)

    const [gasUnits, feeData] = await Promise.all([
      contract.approve.estimateGas(spender, parsedAmount, { from }),
      readProvider.getFeeData(),
    ])

    const gasPrice = feeData.gasPrice ?? 0n
    const feeRaw = gasUnits * gasPrice

    return {
      gasUnits,
      feeRaw,
      feeFormatted: Number(ethers.formatUnits(feeRaw, 18)),
      error: null,
    }
  } catch (e) {
    return {
      gasUnits: null,
      feeRaw: null,
      feeFormatted: null,
      error: e?.reason || e?.shortMessage || e?.message || 'Fee estimate unavailable',
    }
  }
}
