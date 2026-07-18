import { useEffect, useRef } from 'react'

/**
 * NetworkCanvas — hero background: a slow, interconnected node graph meant
 * to read as "the Arc agent network," not a generic particle demo. Pure
 * canvas 2D (no WebGL dependency, no new render-heavy library), so it
 * stays cheap enough to run behind real content at 60fps.
 *
 * Perf/accessibility contract:
 * - Reads node/line color from the live CSS custom properties, so it
 *   follows the dark/light theme automatically without duplicating tokens.
 * - Freezes to a single static frame under prefers-reduced-motion.
 * - Cancels its rAF loop when the tab is hidden (visibilitychange) and
 *   resumes on return, so an inactive tab costs nothing.
 * - Node count scales down on small viewports and caps out on large ones.
 * - Devicetooltip pixel ratio is capped at 2 to avoid burning fill-rate on
 *   very high-DPI displays for a background layer.
 */
export function NetworkCanvas({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = reduceMotionQuery.matches

    const styles = getComputedStyle(document.documentElement)
    const nodeColor = (styles.getPropertyValue('--accent-neon') || '#22d3ee').trim()
    const lineColorA = (styles.getPropertyValue('--accent') || '#8b5cf6').trim()
    const lineColorB = (styles.getPropertyValue('--accent-2') || '#6366f1').trim()

    let width = 0
    let height = 0
    let dpr = 1
    let nodes = []
    let rafId = null
    let lastTime = 0
    const pointer = { x: -9999, y: -9999, active: false }

    const hexToRgb = (hex) => {
      const clean = hex.replace('#', '')
      const bigint = parseInt(clean.length === 3
        ? clean.split('').map((c) => c + c).join('')
        : clean, 16)
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
    }
    const nodeRgb = hexToRgb(nodeColor)
    const lineRgbA = hexToRgb(lineColorA)
    const lineRgbB = hexToRgb(lineColorB)

    function seedNodes() {
      const area = width * height
      const density = width < 640 ? 1 / 15000 : 1 / 11000
      const count = Math.max(18, Math.min(70, Math.round(area * density)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.8,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedNodes()
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height)
      drawFrame(0)
    }

    const LINK_DIST = 150
    const POINTER_DIST = 170

    function drawFrame(dt) {
      ctx.clearRect(0, 0, width, height)

      if (!reduceMotion) {
        for (const n of nodes) {
          n.x += n.vx * dt
          n.y += n.vy * dt
          n.pulse += dt * 0.0015

          if (pointer.active) {
            const dx = n.x - pointer.x
            const dy = n.y - pointer.y
            const d = Math.hypot(dx, dy)
            if (d < POINTER_DIST && d > 0.001) {
              const force = (1 - d / POINTER_DIST) * 0.02
              n.vx += (dx / d) * force
              n.vy += (dy / d) * force
            }
          }

          n.vx *= 0.995
          n.vy *= 0.995
          const speed = Math.hypot(n.vx, n.vy)
          if (speed > 0.35) {
            n.vx = (n.vx / speed) * 0.35
            n.vy = (n.vy / speed) * 0.35
          }

          if (n.x < -20) n.x = width + 20
          if (n.x > width + 20) n.x = -20
          if (n.y < -20) n.y = height + 20
          if (n.y > height + 20) n.y = -20
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.35
            const [r1, g1, b1] = lineRgbA
            const [r2, g2, b2] = lineRgbB
            const t = (Math.sin(a.pulse) + 1) / 2
            const r = Math.round(r1 + (r2 - r1) * t)
            const g = Math.round(g1 + (g2 - g1) * t)
            const bl = Math.round(b1 + (b2 - b1) * t)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        const glow = 0.55 + Math.sin(n.pulse) * 0.25
        ctx.beginPath()
        ctx.fillStyle = `rgba(${nodeRgb[0]}, ${nodeRgb[1]}, ${nodeRgb[2]}, ${glow})`
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function loop(time) {
      const dt = lastTime ? Math.min(time - lastTime, 48) : 16
      lastTime = time
      drawFrame(dt)
      rafId = requestAnimationFrame(loop)
    }

    function start() {
      if (rafId != null) return
      if (reduceMotion) {
        drawStatic()
        return
      }
      lastTime = 0
      rafId = requestAnimationFrame(loop)
    }

    function stop() {
      if (rafId != null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }
    function onPointerLeave() {
      pointer.active = false
    }
    function onReduceMotionChange(e) {
      reduceMotion = e.matches
      stop()
      start()
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduceMotion) drawStatic()
    })
    ro.observe(canvas.parentElement)

    resize()
    start()

    document.addEventListener('visibilitychange', onVisibility)
    canvas.parentElement.addEventListener('pointermove', onPointerMove)
    canvas.parentElement.addEventListener('pointerleave', onPointerLeave)
    if (reduceMotionQuery.addEventListener) {
      reduceMotionQuery.addEventListener('change', onReduceMotionChange)
    }

    return () => {
      stop()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.parentElement.removeEventListener('pointermove', onPointerMove)
      canvas.parentElement.removeEventListener('pointerleave', onPointerLeave)
      if (reduceMotionQuery.removeEventListener) {
        reduceMotionQuery.removeEventListener('change', onReduceMotionChange)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`landing-hero-canvas ${className}`.trim()}
      aria-hidden="true"
    />
  )
}
