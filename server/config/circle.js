// Server-only Circle configuration.
//
// CIRCLE_KIT_KEY lives ONLY here — read from process.env, never sent to the
// browser, never logged. This is the credential Circle's own docs mark as
// "do not embed in client-side source" (every App Kit quickstart reads it
// via `process.env.KIT_KEY` in a Node context, never a Vite `import.meta.env`
// var — see the Swap/Bridge/Send quickstarts on Arc Docs).
//
// CIRCLE_SWAP_API_HOST is the allowlisted upstream host this proxy is
// permitted to forward to (see services/circleProxyService.js). Kept
// configurable rather than hardcoded so it can be corrected once the actual
// failing request's host is confirmed from browser devtools, without a
// code change.

function required(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required server env var: ${name}`)
  }
  return value
}

export function getCircleConfig() {
  return {
    kitKey: required('CIRCLE_KIT_KEY'),
    // TODO: confirm against the actual browser Network-tab request once
    // `npm install` + a live swap attempt shows the failing cross-origin
    // host. Defaulting to the documented Circle API host as a starting
    // point — update CIRCLE_SWAP_API_HOST in server/.env if this differs.
    swapApiHost: process.env.CIRCLE_SWAP_API_HOST || 'https://api.circle.com',
  }
}

export default getCircleConfig
