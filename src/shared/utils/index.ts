/**
 * src/shared/utils/index.ts
 *
 * ET-002 — Shared Export Layer.
 *
 * Re-export-only barrel over the existing framework-agnostic utility
 * modules that are already used across multiple features. No files were
 * moved, renamed, or modified. Existing imports elsewhere in the app
 * (e.g. `import { shortAddr } from '../../lib/format'`) are untouched and
 * continue to work exactly as before — this barrel is an additional,
 * optional import surface only:
 *
 *   import { shortAddr, formatTokenAmount, logger } from '@/shared/utils'
 */

export * from '../../lib/format'
export * from '../../lib/agentAvailability'
export { logger, default as loggerDefault } from '../../utils/logger'
