import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconGithub, IconArrowRight, IconMenu, IconClose } from '../../../ui/icons'
import { AppLogo } from '../../../ui/AppLogo'
import { NAV_LINKS, REPO_URL, DOCS_URL } from '../landing.data'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Navbar — fixed over the full-viewport hero (transparent until scroll,
 * then glass), so it reads as a floating premium nav rather than an
 * in-flow header. Same links/routes as before; only the presentation
 * (fixed position, Motion entrance, glass-on-scroll, a11y on the mobile
 * sheet) changed.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    firstLinkRef.current?.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <motion.header
      className={`landing-nav landing-nav-fixed ${scrolled ? 'is-scrolled' : ''}`}
      initial={shouldReduceMotion ? undefined : { y: -16, opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="landing-shell landing-nav-row">
        <a href="#top" className="landing-brand">
          <AppLogo variant="horizontal" size={40} />
        </a>
        <nav className="landing-nav-links" aria-label="Section">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <a href={DOCS_URL} target="_blank" rel="noreferrer">Documentation</a>
        </nav>
        <div className="landing-nav-actions">
          <a className="btn btn-ghost btn-sm" href={REPO_URL} target="_blank" rel="noreferrer">
            <IconGithub width={15} height={15} /> Star
          </a>
          <Link to="/dashboard" className="btn btn-primary btn-sm">
            Launch App <IconArrowRight width={14} height={14} />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="landing-nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="landing-nav-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose width={18} height={18} /> : <IconMenu width={18} height={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="landing-nav-sheet"
            className="landing-nav-sheet landing-nav-sheet-open"
            role="menu"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href={DOCS_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Documentation</a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>GitHub</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
