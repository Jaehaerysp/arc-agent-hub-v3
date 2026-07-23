/**
 * src/shared/index.ts
 *
 * ET-002 — Shared Export Layer.
 *
 * Re-export-only barrel. No component files were moved, renamed, or
 * modified to produce this file.
 *
 * Two component libraries already exist in the codebase:
 *   - src/ui/               (legacy — Button, Card, Badge, Tabs, etc.)
 *   - src/ui/design-system/ (v7 premium design system — Button, Badge,
 *                            Tabs, Skeleton, EmptyState, etc.)
 *
 * They intentionally share five symbol names (Badge, Button, EmptyState,
 * Skeleton, Tabs) with different implementations — see
 * docs/PROJECT_AUDIT.md §9/§14. A flat `export *` from both would create
 * an ambiguous-binding collision, so each library is re-exported under
 * its own namespace instead. This changes nothing about how existing
 * pages import these components today (those imports are untouched);
 * it only adds a new, optional single-surface way to reach both:
 *
 *   import { legacyUI, designSystem } from '@/shared/components'
 *   const { Button } = designSystem
 */

export * as legacyUI from '../ui'
export * as designSystem from '../ui/design-system'

// TODO(ET-00x): Once the two kits are consolidated (docs/PROJECT_AUDIT.md
// §14, item 2), this file collapses to a single flat `export *` from the
// resulting unified library.
