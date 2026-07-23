// RPC provider configuration — the ONLY place Arc Testnet RPC URLs are
// declared. Everything else (RpcManager, chains/arc.js's wallet
// add-network params, the landing page's display text) reads from here,
// which itself reads from the four VITE_RPC_* env vars with the
// documented public endpoints as defaults so the app still runs against
// something reasonable in an environment where the env vars aren't set.
//
// Requirement #17 / #16: this replaces the single hardcoded
// `https://rpc.testnet.arc.network` constant that used to live in
// src/chains/arc.js. That URL still appears below, but now only as the
// *fallback tier's default value* — not as "the RPC" the app talks to.

import type { RpcProviderConfig } from './types'

const DEFAULT_URLS = {
  primary: 'https://rpc.quicknode.testnet.arc.network',
  secondary: 'https://rpc.drpc.testnet.arc.network',
  third: 'https://rpc.blockdaemon.testnet.arc.network',
  fallback: 'https://rpc.testnet.arc.network',
} as const

function readEnv(key: string, fallback: string): string {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  const value = env?.[key]
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

/**
 * Builds the ordered list of RPC providers from `VITE_RPC_PRIMARY` /
 * `VITE_RPC_SECONDARY` / `VITE_RPC_THIRD` / `VITE_RPC_FALLBACK`, falling
 * back to the known-good public defaults for any that isn't set.
 * Order is significant: it's the priority order RpcManager tries
 * providers in, and the order viem's `fallback()` transport receives
 * them, before ranking kicks in.
 */
export function getRpcProviderConfigs(): RpcProviderConfig[] {
  return [
    {
      id: 'primary',
      label: 'QuickNode',
      url: readEnv('VITE_RPC_PRIMARY', DEFAULT_URLS.primary),
      tier: 'primary',
    },
    {
      id: 'secondary',
      label: 'dRPC',
      url: readEnv('VITE_RPC_SECONDARY', DEFAULT_URLS.secondary),
      tier: 'secondary',
    },
    {
      id: 'third',
      label: 'Blockdaemon',
      url: readEnv('VITE_RPC_THIRD', DEFAULT_URLS.third),
      tier: 'third',
    },
    {
      id: 'fallback',
      label: 'Arc Public RPC',
      url: readEnv('VITE_RPC_FALLBACK', DEFAULT_URLS.fallback),
      tier: 'fallback',
    },
  ]
}

/** The URL shown on the landing page / used for the "external link" style references — always the primary provider. */
export function getPrimaryRpcUrl(): string {
  return getRpcProviderConfigs()[0].url
}

/** Full URL list, in priority order — used for the wallet's `wallet_addEthereumChain` `rpcUrls` array, so MetaMask itself has all four to fall back across. */
export function getAllRpcUrls(): string[] {
  return getRpcProviderConfigs().map((p) => p.url)
}
