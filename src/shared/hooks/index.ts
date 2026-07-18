/**
 * src/shared/hooks/index.ts
 *
 * ET-002 — Shared Export Layer.
 *
 * Re-export-only barrel over the existing cross-feature hooks in
 * `src/hooks/`. No hook files were moved, renamed, or modified. Existing
 * imports elsewhere in the app (e.g. `import { useWallet } from
 * '../../hooks/useWallet'`) are untouched and continue to work exactly as
 * before — this barrel is an additional, optional import surface only:
 *
 *   import { useWallet, useBalances } from '@/shared/hooks'
 *
 * Feature-scoped hooks (e.g. `features/swap/hooks/useSwap.js`,
 * `features/bridge/hooks/useBridge.js`) are intentionally NOT re-exported
 * here — they belong to their feature, not to the shared layer.
 */

export * from '../../hooks/useAsyncAction'
export * from '../../hooks/useBalances'
export * from '../../hooks/useContractWrite'
export * from '../../hooks/useCopyToClipboard'
export * from '../../hooks/useJob'
export * from '../../hooks/useJobs'
export * from '../../hooks/useLocalStorage'
export * from '../../hooks/useNetworkStatus'
export * from '../../hooks/usePolling'
export * from '../../hooks/useToast'
export * from '../../hooks/useWallet'
