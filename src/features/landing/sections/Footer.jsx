import { Link } from 'react-router-dom'
import { REPO_URL, DOCS_URL } from '../landing.data'

export function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-shell landing-footer-inner">
        <div className="landing-footer-brand">
          <span className="brand-mark">ARC</span>
          <span>Arc Agent Hub</span>
        </div>
        <div className="landing-footer-links">
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={DOCS_URL} target="_blank" rel="noreferrer">Docs</a>
          <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">License</a>
          <Link to="/dashboard">Launch App</Link>
        </div>
        <span className="landing-footer-copy">Built for the Arc developer community. Not affiliated with Circle.</span>
      </div>
    </footer>
  )
}
