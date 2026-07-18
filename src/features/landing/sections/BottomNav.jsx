import { Link } from 'react-router-dom'

export function BottomNav() {
  return (
    <div className="landing-bottom-nav">
      <a href="#top" className="landing-bottom-nav-mark" aria-label="Back to top">A</a>
      <Link to="/dashboard" className="btn btn-primary btn-sm">Launch App</Link>
    </div>
  )
}
