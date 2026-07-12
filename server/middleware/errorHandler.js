import logger from './logger.js'

/**
 * Maps a caught error to an HTTP status + safe client-facing message.
 * Never forwards raw error objects (which could contain the kit key from
 * request/response internals, stack traces, or upstream headers) to the
 * browser — only a status and a short message.
 */
function classifyError(err) {
  if (err?.name === 'AbortError' || err?.code === 'ETIMEDOUT') {
    return { status: 504, message: 'Upstream request timed out' }
  }
  if (err?.status === 429 || err?.upstreamStatus === 429) {
    return { status: 429, message: 'Rate limited — please try again shortly' }
  }
  if (err?.status === 401 || err?.upstreamStatus === 401) {
    return { status: 502, message: 'Invalid or missing Kit Key configuration' }
  }
  if (err?.isValidationError) {
    return { status: 400, message: err.message || 'Invalid request' }
  }
  if (err?.upstreamStatus) {
    return { status: 502, message: 'Circle Stablecoin Kit API error' }
  }
  return { status: 500, message: 'Unexpected server error' }
}

/**
 * Express error-handling middleware (4-arg signature required by Express
 * to be recognized as an error handler). Registered last in app.js.
 */
export function errorHandler(err, req, res, _next) {
  const { status, message } = classifyError(err)

  logger.error('Request failed', {
    path: req.path,
    method: req.method,
    status,
    // Only the error's own message/name — never headers or bodies, which
    // is where a kit key or upstream secret could otherwise leak.
    detail: err?.message || err?.name || 'unknown error',
  })

  res.status(status).json({ error: message })
}

export default errorHandler
