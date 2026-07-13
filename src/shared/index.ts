/**
 * src/shared/index.ts
 *
 * ET-001 — Platform foundation.
 *
 * Barrel entry point for the new `src/shared/` module. This gives future
 * code (in particular `src/sdk` and `src/plugins`) one stable import path
 * for cross-cutting, non-feature-specific building blocks, without moving
 * or changing any existing feature code.
 *
 * `src/shared/` is intentionally being scaffolded ahead of content:
 *   - config/  -> populated now (contracts.ts, chains.ts), re-exporting
 *                 the existing canonical config modules.
 *   - components/, hooks/, services/, types/, utils/ -> empty scaffolding
 *                 for now; nothing has been moved into them. See the TODOs
 *                 below and docs/PROJECT_AUDIT.md §14 for candidates.
 */

export * from './config/contracts'
export * from './config/chains'

// TODO(ET-00x): Re-export shared UI primitives once `src/ui/` and
// `src/ui/design-system/` are consolidated (docs/PROJECT_AUDIT.md §14,
// item 2) into src/shared/components.
// export * from './components'

// TODO(ET-00x): Re-export cross-feature hooks (e.g. src/hooks/*) once a
// decision is made on whether they move under src/shared/hooks or stay in
// place with re-exports only, matching the config/ pattern above.
// export * from './hooks'

// TODO(ET-00x): Re-export cross-feature services once identified
// (tokenRegistry.js is the leading candidate per docs/PROJECT_AUDIT.md §10).
// export * from './services'

// TODO(ET-00x): Shared TypeScript types/interfaces go here as the codebase
// migrates incrementally toward TypeScript.
// export * from './types'

// TODO(ET-00x): Shared framework-agnostic utilities (formatting, etc.) —
// candidate: src/lib/format.js.
// export * from './utils'
