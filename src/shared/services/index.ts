/**
 * src/shared/services/index.ts
 *
 * ET-002 — Shared Export Layer.
 *
 * Re-export-only barrel. Every existing "service" module in this codebase
 * today is intentionally feature-scoped (e.g.
 * `features/bridge/services/bridgeService.js`,
 * `features/swap/services/swapService.js`,
 * `features/wallet/services/tokenBalanceService.js`,
 * `features/payments/services/usdcPaymentService.js`) rather than a
 * cross-feature shared service. Per the ET-002 rule of "re-export
 * existing shared code only," none of them are re-exported from here —
 * doing so would misrepresent feature-owned code as part of the shared
 * layer, and no files have been moved to make that accurate.
 *
 * TODO(ET-00x): `features/wallet/services/tokenRegistry.js` is the
 * leading candidate to promote to a genuinely shared service (it's
 * referenced by more than one feature's token-selection UI) — see
 * docs/PROJECT_AUDIT.md §10 "Missing abstractions". When/if that
 * promotion happens as its own reviewed change, re-export it here.
 */

export {}
