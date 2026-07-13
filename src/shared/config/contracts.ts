/**
 * src/shared/config/contracts.ts
 *
 * ET-001 — Platform foundation.
 *
 * This module does NOT define any new contract data. It re-exports the
 * existing, already-canonical contract registries so future `src/sdk` and
 * `src/plugins` code has a single, stable import path (`@/shared/config/contracts`)
 * without duplicating or moving the source of truth.
 *
 * Canonical sources (unchanged, do not duplicate their values elsewhere):
 *   - ERC-8004 (Identity / Reputation / Validation / ANV):
 *       src/contracts/registry.js
 *   - ERC-8183 (Agentic Commerce / Job funding):
 *       src/lib/blockchain/contracts.js
 *       src/lib/blockchain/constants.js
 */

// ERC-8004 registry (Identity Registry, Reputation Registry, Validation
// Registry, ANV Token) + default validator address.
export { CONTRACTS, DEFAULT_VALIDATOR } from '../../contracts/registry'

// ERC-8183 registry (Agentic Commerce job contract, USDC) + contract
// factory helpers.
export {
  ERC8183_CONTRACTS,
  getCommerceContract,
  getUsdcContract,
} from '../../lib/blockchain/contracts'

// ERC-8183 supporting constants (addresses, job status enum/labels, default
// job expiry).
export {
  AGENTIC_COMMERCE_ADDRESS,
  USDC_ADDRESS,
  ZERO_ADDRESS,
  JOB_STATUS,
  jobStatusLabel,
  DEFAULT_JOB_EXPIRY_SECONDS,
} from '../../lib/blockchain/constants'

// TODO(ET-00x): Once the ERC-8004 and ERC-8183 registries are unified
// (see docs/PROJECT_AUDIT.md §14, item 5), this file becomes the place to
// expose that single merged registry instead of two re-exported halves.
