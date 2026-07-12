import { Router } from 'express'
import { forwardToCircle } from '../services/circleProxyService.js'

const router = Router()

/**
 * POST /api/circle-proxy
 *
 * Body: { path, method, headers, body } — the request the frontend's
 * fetch interceptor (src/features/swap/services/circleProxyBridge.js)
 * captured from AppKit's own outbound call to Circle, forwarded here so
 * it can be re-sent server-to-server (immune to CORS) with the real kit
 * key attached. Never signs anything — see server/services/circleProxyService.js.
 */
router.post('/', async (req, res, next) => {
  try {
    const { path, method, headers, body } = req.body || {}
    const result = await forwardToCircle({ path, method, headers, body })

    res.status(result.status)
    for (const [key, value] of Object.entries(result.headers)) {
      res.setHeader(key, value)
    }
    res.send(result.body)
  } catch (err) {
    next(err)
  }
})

export default router
