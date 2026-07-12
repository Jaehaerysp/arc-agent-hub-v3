// Universal Token Swap (Sprint 4) — same-origin CORS bridge for Circle's
// Stablecoin/Swap Kit API.
//
// WHY THIS EXISTS: `kit.swap()`/`kit.estimateSwap()` (called from
// `swapService.js`/`quoteService.js`, still with the browser-wallet
// adapter, still signed by the connected wallet — nothing about that
// changes) make an internal HTTP request to Circle's backend to
// authenticate with the kit key and fetch quote/route data. Circle's
// backend doesn't send CORS headers back for browser-origin callers (see
// the audit in swapService.js's own doc comment), so that one internal
// request fails with an Access-Control-Allow-Headers error — nothing else
// about the swap flow is broken.
//
// This module patches `window.fetch` so ONLY requests headed to that one
// Circle host get rerouted to our own same-origin Express endpoint
// (`/api/circle-proxy`) instead of going cross-origin directly. Express
// forwards them to Circle server-to-server (immune to CORS) with the real
// kit key attached there — see server/services/circleProxyService.js.
// Every other `fetch` call in the app (RPC calls, other features, etc.)
// passes through untouched.
//
// Signing is NEVER touched here — this only reroutes an HTTP call for
// quote/auth data, the same way a browser extension or corporate proxy
// might reroute traffic. The adapter still talks to `window.ethereum`
// directly for every signature.

import logger from '../../../utils/logger'

// TODO: confirm against the actual failing request's host in browser
// devtools (Network tab) when a swap/quote is attempted. Defaulting to the
// documented Circle API host as a starting point.
const CIRCLE_HOST_MATCH = import.meta.env.VITE_CIRCLE_SWAP_API_HOST_MATCH || 'api.circle.com'

let installed = false

function headersToPlainObject(initHeaders) {
  const headers = {}
  if (!initHeaders) return headers
  new Headers(initHeaders).forEach((value, key) => {
    headers[key] = value
  })
  return headers
}

function parseBody(initBody) {
  if (!initBody) return undefined
  if (typeof initBody !== 'string') return initBody
  try {
    return JSON.parse(initBody)
  } catch {
    return initBody
  }
}

/**
 * Installs the interceptor once per page load. Safe to call multiple
 * times (e.g. from both swapService.js and quoteService.js) — only the
 * first call takes effect.
 */
export function installCircleProxyBridge() {
  if (installed || typeof window === 'undefined' || !window.fetch) return
  installed = true

  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input, init = {}) => {
    const rawUrl = typeof input === 'string' || input instanceof URL ? String(input) : input?.url

    if (!rawUrl) return originalFetch(input, init)

    let parsed
    try {
      parsed = new URL(rawUrl, window.location.origin)
    } catch {
      return originalFetch(input, init)
    }

    if (!parsed.hostname.includes(CIRCLE_HOST_MATCH)) {
      return originalFetch(input, init)
    }

    logger.log('Rerouting Circle Stablecoin Kit request through same-origin proxy', {
      path: parsed.pathname,
    })

    return originalFetch('/api/circle-proxy', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        path: `${parsed.pathname}${parsed.search}`,
        method: init.method || 'GET',
        headers: headersToPlainObject(init.headers),
        body: parseBody(init.body),
      }),
    })
  }
}

export default installCircleProxyBridge
