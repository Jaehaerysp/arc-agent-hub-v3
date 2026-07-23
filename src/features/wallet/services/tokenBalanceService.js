// Wallet blockchain read service — pure, framework-free functions that talk
// to the chain via ethers. No React here; `useTokenBalances` is the only
// caller. Follows the same convention as `useBalances`/`getUsdcContract`:
// reads take a `provider` (or any ethers signer/provider), never a raw
// private key. This app never signs with anything other than the
// browser wallet the user connected.

import { ethers } from 'ethers'
import { ERC20_ABI } from '../../../contracts/abis/erc20'
import { WALLET_TOKENS } from './tokenRegistry'
import { getReadProvider } from '../../../lib/rpc/ethersAdapter'

/**
 * Reads a single ERC-20 balance for `account`. Never throws — a failed read
 * (bad RPC, unsupported token, etc.) resolves to an error entry so one bad
 * token can't take down the rest of the batch.
 *
 * `provider` is kept as a parameter (fetchTokenBalances below still uses
 * it as the "is a wallet connected" gate) but the actual chain read
 * always goes through RpcManager's resilient provider instead — see
 * src/lib/rpc/ethersAdapter.js.
 */
export async function fetchTokenBalance(provider, token, account) {
  try {
    const contract = new ethers.Contract(token.address, ERC20_ABI, getReadProvider())
    const raw = await contract.balanceOf(account)
    const balance = Number(ethers.formatUnits(raw, token.decimals))

    return {
      key: token.key,
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      decimals: token.decimals,
      category: token.category,
      balance,
      raw,
      error: null,
    }
  } catch (e) {
    return {
      key: token.key,
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      decimals: token.decimals,
      category: token.category,
      balance: null,
      raw: null,
      error: e?.reason || e?.shortMessage || e?.message || 'Balance read failed',
    }
  }
}

/**
 * Reads every token in `tokens` (defaults to the full WALLET_TOKENS
 * registry) for `account` in parallel via `Promise.allSettled` — so a
 * token whose read function itself throws unexpectedly (rather than
 * resolving to its own `{ error }` entry, which `fetchTokenBalance`
 * already does for the common RPC-failure case) still can't stop the
 * rest of the batch from resolving. Returns `{ results, error }` —
 * `results` always has one entry per token (each may carry its own
 * per-token `error`); the top-level `error` is only set when the whole
 * batch could not run at all (no provider/account).
 */
export async function fetchTokenBalances(provider, account, tokens = WALLET_TOKENS) {
  if (!provider || !account) {
    return { results: [], error: null }
  }

  const settled = await Promise.allSettled(tokens.map((token) => fetchTokenBalance(provider, token, account)))

  const results = settled.map((outcome, i) => {
    if (outcome.status === 'fulfilled') return outcome.value
    const token = tokens[i]
    return {
      key: token.key,
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      decimals: token.decimals,
      category: token.category,
      balance: null,
      raw: null,
      error: outcome.reason?.message || 'Balance read failed',
    }
  })

  return { results, error: null }
}
