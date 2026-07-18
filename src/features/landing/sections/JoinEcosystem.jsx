import { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FINAL_CTA_LINKS } from '../landing.data'

function CtaLink({ href, label, external }) {
  if (external) {
    return (
      <a className="btn btn-ghost landing-join-secondary" href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    )
  }
  return (
    <Link className="btn btn-ghost landing-join-secondary" to={href}>
      {label}
    </Link>
  )
}

const SPAWN_MS = 80
const LIFE_MS = 1000

// Small static SVG glyphs for the mouse-trail chips — plain markup strings
// (not a mounted React root) so each spawn is a cheap DOM node, not a
// throwaway React tree.
const GLYPHS = [
  '<path d="M4 8h16v12H4z" rx="2"/><circle cx="9" cy="14" r="1.4"/><circle cx="15" cy="14" r="1.4"/>',
  '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6l-5.9 3-1.2-6.5L.1 9.4l6.6-.9L12 2.5z"/>',
  '<path d="M12 3l8 3v6c0 4.5-3.2 8.4-8 9-4.8-.6-8-4.5-8-9V6l8-3z"/>',
  '<path d="M3 8h13M12 4l4 4-4 4"/><path d="M21 16H8m5 4l-4-4 4-4"/>',
]

function chipSvg() {
  const inner = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
}

export function JoinEcosystem() {
  const containerRef = useRef(null)
  const lastSpawn = useRef(0)

  const onMouseMove = useCallback((e) => {
    const now = performance.now()
    if (now - lastSpawn.current < SPAWN_MS) return
    lastSpawn.current = now

    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotation = Math.round(Math.random() * 20 - 10)

    const chip = document.createElement('div')
    chip.className = 'landing-trail-chip'
    chip.style.left = `${x}px`
    chip.style.top = `${y}px`
    chip.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
    chip.innerHTML = chipSvg()
    container.appendChild(chip)

    setTimeout(() => chip.classList.add('is-leaving'), LIFE_MS - 300)
    setTimeout(() => chip.remove(), LIFE_MS)
  }, [])

  return (
    <section className="landing-section">
      <div className="landing-shell">
        <div
          className="glass-panel glass-panel-glow landing-join"
          ref={containerRef}
          onMouseMove={onMouseMove}
        >
          <h2 className="landing-join-title">Join the Arc Ecosystem</h2>
          <p className="landing-join-subtitle">
            Identity, reputation, treasury, and the tooling to build on top of all of it — in one open-source stack.
          </p>
          <div className="landing-join-actions">
            <Link className="btn btn-primary btn-lg landing-btn-layered landing-join-cta" to="/dashboard">
              <span className="landing-join-mark">A</span> Launch App
            </Link>
            {FINAL_CTA_LINKS.map((link) => (
              <CtaLink key={link.label} {...link} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
