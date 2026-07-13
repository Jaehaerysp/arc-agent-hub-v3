/**
 * src/shared/config/chains.ts
 *
 * ET-001 — Platform foundation.
 *
 * This module does NOT define any new network data. It re-exports the
 * existing, already-canonical Arc Testnet + bridge-network configuration so
 * future `src/sdk` and `src/plugins` code has a single, stable import path
 * (`@/shared/config/chains`) without duplicating or moving the source of
 * truth.
 *
 * Canonical sources (unchanged, do not duplicate their values elsewhere):
 *   - Arc Testnet network definition: src/chains/arc.js
 *   - CCTP bridge-network list:        src/chains/bridgeNetworks.js
 */

// Arc Testnet — chain id, RPC URL, explorer URL, wallet_addEthereumChain
// params, and explorer-link helpers.
export {
  ARC_CHAIN_ID,
  ARC_CHAIN_ID_HEX,
  ARC_RPC_URL,
  ARC_EXPLORER_URL,
  ARC_NETWORK_PARAMS,
  explorerTxUrl,
  explorerAddressUrl,
  explorerTokenUrl,
} from '../../chains/arc'

// CCTP bridge-network list (Arc Testnet <-> Base Sepolia, etc.) + helpers.
export {
  BRIDGE_NETWORKS,
  EVM_BRIDGE_NETWORKS,
  getBridgeNetwork,
  bridgeNetworkExplorerTxUrl,
} from '../../chains/bridgeNetworks'

// TODO(ET-00x): If/when multi-chain (beyond Arc Testnet + its bridge
// targets) is introduced, this file becomes the place to expose a
// chain-registry keyed by chain id, per the migration plan in
// docs/PROJECT_AUDIT.md §15 Phase 4.
