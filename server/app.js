import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import healthRoute from './routes/health.js'
import circleProxyRoute from './routes/circleProxy.js'
import errorHandler from './middleware/errorHandler.js'
import logger from './middleware/logger.js'

const app = express()

// In dev, Vite (5173) and Express (this server) run on different ports, so
// the browser->this-server hop still needs CORS — but that's a same-app,
// same-team hop we control, unlike the Circle API's cross-origin block.
// In production, put this behind the same origin as the frontend (e.g. a
// reverse proxy) and this can be tightened to same-origin only.
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: allowedOrigin }))
app.use(express.json({ limit: '1mb' }))

app.use('/api/health', healthRoute)
app.use('/api/circle-proxy', circleProxyRoute)

// 404 for anything else under /api
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 8787
app.listen(PORT, () => {
  logger.info('Server listening', { port: PORT })
})

export default app
