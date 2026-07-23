// ethersAdapter.ts — bridges RpcManager's viem-based resilient transport
// into an ethers.Provider, so the app's existing `new ethers.Contract(addr,
// abi, provider)` call sites (tokenBalanceService, contracts.js, jobs.js,
// bridgeEstimator, usdcPaymentService, useBalances) don't need to be
// rewritten against viem's API. Every one of those is a READ — balanceOf,
// getJob, allowance, estimateGas, getBalance — never a signed write, so
// swapping what "provider" resolves to is safe: writes still go through
// the wallet's own ethers.BrowserProvider/Signer from useWallet(),
// untouched.
//
// Requirement #2 says use viem's `fallback()` transport; this file is the
// seam that lets that viem transport serve ethers-shaped call sites
// without a second, parallel implementation of "how to read the chain."
// Every method below ultimately calls `rpcManager.request(...)`, so
// dedup/timeout/retry/failover/health-cache all apply uniformly whether a
// caller uses viem's PublicClient directly or an ethers.Contract through
// this adapter.

import { ethers } from 'ethers'
import { getRpcManager, ARC_TESTNET_CHAIN_ID } from './RpcManager'

function toQuantity(value: string | number | bigint | null | undefined): string {
  if (value === null || value === undefined) return '0x0'
  return ethers.toQuantity(value)
}

/**
 * A read-only ethers.Provider whose underlying transport is RpcManager's
 * resilient viem fallback pool instead of a single RPC URL. Pass this
 * anywhere an existing function accepts `provider` for a pure read
 * (balance/allowance/view-call/gas-estimate/log-query). Never use it as a
 * signer — it has none; writes must keep using the wallet's own provider.
 */
export class RpcManagedProvider extends ethers.AbstractProvider {
  constructor() {
    super(ARC_TESTNET_CHAIN_ID)
  }

  async _detectNetwork(): Promise<ethers.Network> {
    return ethers.Network.from(ARC_TESTNET_CHAIN_ID)
  }

  async _perform<T = unknown>(req: ethers.PerformActionRequest): Promise<T> {
    return (await this.performRaw(req)) as T
  }

  private async performRaw(req: ethers.PerformActionRequest): Promise<unknown> {
    const rpcManager = getRpcManager()

    switch (req.method) {
      case 'chainId':
        return toQuantity(ARC_TESTNET_CHAIN_ID)

      case 'getBlockNumber':
        return rpcManager.request('eth_blockNumber', [])

      case 'getGasPrice':
        return rpcManager.request('eth_gasPrice', [])

      case 'getPriorityFee':
        return rpcManager.request('eth_maxPriorityFeePerGas', [])

      case 'getBalance':
        return rpcManager.request('eth_getBalance', [req.address, req.blockTag])

      case 'getTransactionCount':
        return rpcManager.request('eth_getTransactionCount', [req.address, req.blockTag])

      case 'getCode':
        return rpcManager.request('eth_getCode', [req.address, req.blockTag])

      case 'getStorage':
        return rpcManager.request('eth_getStorageAt', [req.address, toQuantity(req.position), req.blockTag])

      case 'call':
        return rpcManager.request('eth_call', [req.transaction, req.blockTag])

      case 'estimateGas':
        return rpcManager.request('eth_estimateGas', [req.transaction])

      case 'getLogs':
        return rpcManager.request('eth_getLogs', [req.filter])

      case 'getBlock': {
        if ('blockHash' in req) {
          return rpcManager.request('eth_getBlockByHash', [req.blockHash, false])
        }
        return rpcManager.request('eth_getBlockByNumber', [req.blockTag, false])
      }

      case 'getTransaction':
        return rpcManager.request('eth_getTransactionByHash', [req.hash])

      case 'getTransactionReceipt':
        return rpcManager.request('eth_getTransactionReceipt', [req.hash])

      case 'broadcastTransaction':
        // This adapter is deliberately read-only — signed transactions
        // must go out through the connected wallet's own provider (see
        // module doc comment above), not the app-managed RPC pool.
        throw new Error('RpcManagedProvider is read-only; broadcast transactions via the connected wallet instead.')

      default:
        throw new Error(`RpcManagedProvider: unsupported method "${(req as { method: string }).method}"`)
    }
  }
}

let readProvider: RpcManagedProvider | null = null

/**
 * The shared read-only provider every read-path service/hook should use
 * in place of the connected wallet's provider. Lazily constructed so
 * importing this module doesn't itself create network activity.
 */
export function getReadProvider(): RpcManagedProvider {
  if (!readProvider) {
    readProvider = new RpcManagedProvider()
  }
  return readProvider
}
