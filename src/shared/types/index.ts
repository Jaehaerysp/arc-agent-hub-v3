/**
 * src/shared/types/index.ts
 *
 * ET-002 — Shared Export Layer.
 *
 * Re-export-only barrel. The codebase is currently JavaScript/JSX
 * throughout (see docs/PROJECT_AUDIT.md §11) — there are no existing
 * TypeScript type/interface definitions anywhere in `src/` to re-export.
 * Per the ET-002 rule of "re-export existing shared code only," this file
 * is intentionally left as a placeholder rather than introducing new
 * type definitions, which would be new code, not a re-export.
 *
 * TODO(ET-00x): As the codebase incrementally adopts TypeScript, shared
 * cross-feature types/interfaces (e.g. Agent, Job, WalletState shapes)
 * belong here.
 */

export {}
