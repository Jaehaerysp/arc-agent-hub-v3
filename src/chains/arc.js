// Arc Testnet — canonical network definition.
// Every other module (wallet hook, network switch, explorer links) imports from here.
// DO NOT hardcode chain id / RPC / explorer anywhere else.

export const ARC_CHAIN_ID = 5042002
export const ARC_CHAIN_ID_HEX = '0x4cef52'
export const ARC_RPC_URL = 'https://rpc.testnet.arc.network'
export const ARC_EXPLORER_URL = 'https://testnet.arcscan.app'

export const ARC_NETWORK_PARAMS = {
  chainId: ARC_CHAIN_ID_HEX,
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: [ARC_RPC_URL],
  blockExplorerUrls: [ARC_EXPLORER_URL],
}

export function explorerTxUrl(hash) {
  return `${ARC_EXPLORER_URL}/tx/${hash}`
}

export function explorerAddressUrl(address) {
  return `${ARC_EXPLORER_URL}/address/${address}`
}
