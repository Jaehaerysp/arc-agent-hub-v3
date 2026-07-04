import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconGithub, IconArrowRight, IconMenu, IconClose } from '../../../ui/icons'
import { NAV_LINKS, REPO_URL, DOCS_URL } from '../landing.data'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`landing-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="landing-shell landing-nav-row">
        <a href="#top" className="landing-brand">
          <span className="brand-mark">ARC</span>
          <span className="landing-brand-text">Arc Agent Hub</span>
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
            type="button"
            className="landing-nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose width={18} height={18} /> : <IconMenu width={18} height={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="landing-nav-sheet" role="menu">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
          ))}
          <a href={DOCS_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Documentation</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>GitHub</a>
        </div>
      )}
    </header>
  )
}
