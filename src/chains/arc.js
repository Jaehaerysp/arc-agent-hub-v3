// Arc Testnet — canonical network definition.
// Every other module (wallet hook, network switch, explorer links) imports from here.
// DO NOT hardcode chain id / RPC / explorer anywhere else.
//
// RPC URLs are no longer literal strings in this file — they come from
// src/lib/rpc/config.js (env-driven: VITE_RPC_PRIMARY / _SECONDARY /
// _THIRD / _FALLBACK), which is also what RpcManager itself reads. This
// file just re-exports the primary/full list under the same names every
// existing consumer (NetworkStatusPanel, WalletPage, SettingsPage,
// DeveloperToolsPage, landing.data.js) already imports, so none of them
// needed to change.

import { getAllRpcUrls, getPrimaryRpcUrl } from '../lib/rpc/config'

export const ARC_CHAIN_ID = 5042002
export const ARC_CHAIN_ID_HEX = '0x4cef52'
/** Primary RPC endpoint — display/reference only. Actual reads go through RpcManager's full fallback pool, not just this one URL. */
export const ARC_RPC_URL = getPrimaryRpcUrl()
/** All four configured RPC endpoints, priority order — used so the wallet itself (MetaMask etc.) has a fallback list, not just RpcManager. */
export const ARC_RPC_URLS = getAllRpcUrls()
export const ARC_EXPLORER_URL = 'https://testnet.arcscan.app'

export const ARC_NETWORK_PARAMS = {
  chainId: ARC_CHAIN_ID_HEX,
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: ARC_RPC_URLS,
  blockExplorerUrls: [ARC_EXPLORER_URL],
}

export function explorerTxUrl(hash) {
  return `${ARC_EXPLORER_URL}/tx/${hash}`
}

export function explorerAddressUrl(address) {
  return `${ARC_EXPLORER_URL}/address/${address}`
}

/** Token detail page — used for every "View on ArcScan" link on the Wallet page. */
export function explorerTokenUrl(contract) {
  return `${ARC_EXPLORER_URL}/token/${contract}`
}
