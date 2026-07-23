// ERC-8183 contract registry — the ERC-8183 counterpart to
// src/contracts/registry.js (ERC-8004). Kept separate because these two
// registries describe different protocols, but follow the same shape so
// both are easy to read side by side.

import { ethers } from 'ethers'
import { AGENTIC_COMMERCE_ABI, USDC_ABI } from './abis'
import { AGENTIC_COMMERCE_ADDRESS, USDC_ADDRESS } from './constants'

export const ERC8183_CONTRACTS = {
  AGENTIC_COMMERCE: {
    address: AGENTIC_COMMERCE_ADDRESS,
    abi: AGENTIC_COMMERCE_ABI,
    label: 'Agentic Commerce',
  },
  USDC: {
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    label: 'USDC',
  },
}

/**
 * Returns an ethers.Contract for the Agentic Commerce job contract.
 * Pass a signer for writes (createJob/setBudget/fund/submit/complete). For
 * reads, pass `getReadProvider()` from `src/lib/rpc/ethersAdapter` (the
 * RpcManager-backed provider) rather than the connected wallet's
 * provider — every read call site in this app (jobs.js) already does
 * this, so the wallet's own RPC is only ever used for signing/broadcast.
 */
export function getCommerceContract(signerOrProvider) {
  return new ethers.Contract(AGENTIC_COMMERCE_ADDRESS, AGENTIC_COMMERCE_ABI, signerOrProvider)
}

/** Returns an ethers.Contract for the USDC token used to fund jobs. */
export function getUsdcContract(signerOrProvider) {
  return new ethers.Contract(USDC_ADDRESS, USDC_ABI, signerOrProvider)
}
