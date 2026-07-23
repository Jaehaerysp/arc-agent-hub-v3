// USDC payment service — reads/writes the same Circle-issued USDC ERC-20
// contract the ERC-8183 Agentic Commerce flow already funds jobs with (see
// `src/lib/blockchain/constants.js` / `contracts.js` — USDC_ADDRESS,
// getUsdcContract). Payments is a second consumer of that same contract,
// not a new token integration.
//
// Same convention as the Wallet feature's `tokenBalanceService.js`
// (Sprint 1): plain async functions, never throw, always take a
// `provider`/`signer` from the connected browser wallet — never a private
// key. `send-usdc.ts` (the reference CLI script) signs with raw private
// keys read from `.env`; that pattern is intentionally NOT ported here.

import { ethers } from 'ethers'
import { ERC20_ABI } from '../../../contracts/abis/erc20'
import { USDC_ADDRESS } from '../../../lib/blockchain/constants'
import { getReadProvider } from '../../../lib/rpc/ethersAdapter'

// `getUsdcContract`/`USDC_ABI` in lib/blockchain (the ERC-8183 job-funding
// helpers) only expose approve/balanceOf/allowance — no `transfer`, since
// job funding always goes through `approve` + the commerce contract's
// `fund()`. Payments sends USDC directly peer-to-peer, so it needs
// `transfer`, which the general-purpose `ERC20_ABI` (already used for the
// ANV token in `contracts/registry.js`) already provides — same address,
// a wider ABI for a different call shape.

// Carried over from the ERC-8183 job-funding flow (`helpers.js` formats
// `job.budget` with the same 6 decimals) — this is the same USDC contract,
// so the decimals figure must match.
export const USDC_DECIMALS = 6

/** Token descriptor in the same shape as the Wallet feature's WALLET_TOKENS entries. */
export const USDC_TOKEN = {
  key: 'usdc',
  symbol: 'USDC',
  name: 'Circle USDC',
  address: USDC_ADDRESS,
  decimals: USDC_DECIMALS,
}

/**
 * Estimates the network fee for sending `amount` of `token` to `to`, using
 * the connected wallet's own gas estimate + current fee data — the same
 * two RPC calls `send-usdc.ts`'s `kit.estimateSend()` wraps, done directly
 * against the token's ERC-20 contract instead of through Circle's App Kit
 * (which requires a server-side/private-key signer this browser app
 * doesn't use).
 *
 * `token` is any descriptor with `{ address, decimals }` — the same shape
 * as `USDC_TOKEN` and every `WALLET_TOKENS`/`PAYMENT_TOKENS` entry, so this
 * one function covers every token the Payment Form offers (Sprint 2 —
 * Universal Payment Support), not just USDC.
 *
 * Never throws: a failed estimate resolves to `{ ...null fields, error }`
 * so the form can still let the person attempt the send.
 */
export async function estimateTransferFee(token, _signerOrProvider, from, to, amount) {
  try {
    if (!ethers.isAddress(to)) throw new Error('Invalid recipient address')
    if (!amount || Number(amount) <= 0) throw new Error('Invalid amount')

    const readProvider = getReadProvider()
    const contract = new ethers.Contract(token.address, ERC20_ABI, readProvider)
    const parsedAmount = ethers.parseUnits(amount, token.decimals)

    const [gasUnits, feeData] = await Promise.all([
      contract.transfer.estimateGas(to, parsedAmount, { from }),
      readProvider.getFeeData(),
    ])

    const gasPrice = feeData.gasPrice ?? 0n
    const feeRaw = gasUnits * gasPrice

    return {
      gasUnits,
      gasPriceGwei: gasPrice ? Number(gasPrice) / 1e9 : null,
      feeRaw,
      feeFormatted: Number(ethers.formatUnits(feeRaw, 18)), // paid in native gas token
      error: null,
    }
  } catch (e) {
    return {
      gasUnits: null,
      gasPriceGwei: null,
      feeRaw: null,
      feeFormatted: null,
      error: e?.reason || e?.shortMessage || e?.message || 'Fee estimate failed',
    }
  }
}

/**
 * USDC-specific convenience wrapper, kept for backward compatibility with
 * existing callers/tests — identical behavior to before Sprint 2, just
 * implemented in terms of the generic `estimateTransferFee` above.
 */
export async function estimateUsdcTransferFee(signerOrProvider, from, to, amount) {
  return estimateTransferFee(USDC_TOKEN, signerOrProvider, from, to, amount)
}
