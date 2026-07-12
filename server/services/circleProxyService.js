import logger from '../middleware/logger.js'
import { getCircleConfig } from '../config/circle.js'

// Headers that must never be forwarded as-is between hops (either
// hop-by-hop per the HTTP spec, or origin-identifying values that would
// otherwise leak this server's internals or fail upstream validation).
const STRIPPED_REQUEST_HEADERS = new Set([
  'host', 'origin', 'referer', 'connection', 'content-length',
  'cookie', 'authorization', // re-added below with the real kit key
])
const STRIPPED_RESPONSE_HEADERS = new Set([
  'content-encoding', 'content-length', 'transfer-encoding', 'connection',
  'access-control-allow-origin', 'access-control-allow-headers',
  'access-control-allow-methods',
])

/**
 * Only paths under the Stablecoin/Swap Kit API are proxyable — this is not
 * a general-purpose open proxy. Extend this list once the real request
 * path(s) App Kit calls are confirmed from browser devtools.
 *
 * TODO: replace with the confirmed path prefix(es). Left permissive
 * (allow everything under the configured host) until that's known, since
 * the exact path segment App Kit's internal client calls isn't publicly
 * documented — narrow this once confirmed.
 */
function assertProxyablePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) {
    const err = new Error('Invalid proxy path')
    err.isValidationError = true
    throw err
  }
}

function buildForwardHeaders(originalHeaders, kitKey) {
  const headers = new Headers()
  for (const [key, value] of Object.entries(originalHeaders || {})) {
    if (STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) continue
    headers.set(key, value)
  }

  // TODO: confirm the actual auth mechanism the Stablecoin Kit API expects
  // (Authorization: Bearer, a custom `X-Kit-Key` header, or a `kitKey`
  // field in the JSON body — App Kit's public docs only show `config.kitKey`
  // passed into `kit.swap()`, not the wire format). Setting both a Bearer
  // header and leaving body-level injection to the caller covers the most
  // common cases; adjust once the real request is inspected.
  headers.set('Authorization', `Bearer ${kitKey}`)
  headers.set('content-type', headers.get('content-type') || 'application/json')

  return headers
}

/**
 * Forwards one request to Circle's real API, server-to-server (plain Node
 * `fetch`, which isn't subject to browser CORS). The kit key is attached
 * here — never trusted from the client payload — so it's never present in
 * anything the browser sends or receives.
 */
export async function forwardToCircle({ path, method, headers, body }) {
  assertProxyablePath(path)

  const { kitKey, swapApiHost } = getCircleConfig()
  const url = `${swapApiHost}${path}`
  const forwardHeaders = buildForwardHeaders(headers, kitKey)

  const upstreamResponse = await fetch(url, {
    method: method || 'GET',
    headers: forwardHeaders,
    body: body && method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
  })

  const responseBody = await upstreamResponse.text()

  logger.info('Proxied Circle Stablecoin Kit request', {
    path,
    method: method || 'GET',
    upstreamStatus: upstreamResponse.status,
  })

  if (!upstreamResponse.ok) {
    const err = new Error('Circle Stablecoin Kit API returned an error')
    err.upstreamStatus = upstreamResponse.status
    throw err
  }

  const responseHeaders = {}
  upstreamResponse.headers.forEach((value, key) => {
    if (!STRIPPED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders[key] = value
    }
  })

  return {
    status: upstreamResponse.status,
    headers: responseHeaders,
    body: responseBody,
  }
}

export default forwardToCircle
