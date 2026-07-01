import { Suspense, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useWalletContext } from '../providers/WalletProvider'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { NAV_ITEMS } from '../nav'
import { shortAddr } from '../../lib/format'
import { Button } from '../../ui/Button'
import { ToastViewport } from '../../ui/ToastViewport'
import { Skeleton } from '../../ui/Skeleton'
import { IconMenu, IconClose, IconCollapse } from '../../ui/icons'

export default function AppLayout() {
  const wallet = useWalletContext()
  const location = useLocation()
  const [collapsed, setCollapsed] = useLocalStorage('arc_sidebar_collapsed', false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [copiedAddr, setCopiedAddr] = useState(false)

  const activeItem = NAV_ITEMS.find((i) => location.pathname.startsWith(i.path))

  const handleCopyAddress = async () => {
    if (!wallet.account) return
    await navigator.clipboard.writeText(wallet.account)
    setCopiedAddr(true)
    setTimeout(() => setCopiedAddr(false), 1500)
  }

  return (
    <div className="app-root">
      <div className={`sidebar-scrim ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">ARC</div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">Arc Agent Hub</span>
              <span className="brand-sub">ERC-8004 · Testnet</span>
            </div>
          )}
          <button
            className="btn btn-ghost btn-icon mobile-menu-btn"
            style={{ marginLeft: 'auto' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <IconClose width={16} height={16} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const badge = item.badgeKey === 'agentId' && wallet.agentId ? `#${wallet.agentId}` : null
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-icon"><Icon width={16} height={16} /></span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
                {!collapsed && badge && <span className="nav-badge">{badge}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="collapse-btn" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar width">
            <IconCollapse style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} width={16} height={16} />
            {!collapsed && <span style={{ marginLeft: 8, fontSize: 12 }}>Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="app-header">
          <div className="header-title">
            <button className="btn btn-ghost btn-icon mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <IconMenu width={16} height={16} />
            </button>
            <h1>{activeItem?.label || 'Arc Agent Hub'}</h1>
            <span className="header-eyebrow">
              {wallet.isArcNetwork ? 'Arc Testnet · Live' : 'Wrong network'}
            </span>
          </div>

          <div className="header-right">
            {wallet.account ? (
              <>
                {!wallet.isArcNetwork && (
                  <Button variant="warning" size="sm" onClick={wallet.switchToArc}>
                    Switch to Arc
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="mono" onClick={handleCopyAddress}>
                  {copiedAddr ? '✓ Copied' : shortAddr(wallet.account)}
                </Button>
                <Button variant="danger" size="sm" onClick={wallet.disconnect}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={wallet.connect} disabled={wallet.isConnecting}>
                {wallet.isConnecting ? 'Connecting…' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </header>

        {wallet.error && (
          <div style={{ padding: '14px 28px 0' }}>
            <div className="alert alert-error">
              <span className="alert-icon">✕</span>
              <div className="alert-body">{wallet.error}</div>
            </div>
          </div>
        )}

        <div className="page-body">
          {wallet.account ? (
            <Suspense fallback={<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}><Skeleton height={120} /><Skeleton height={220} /></div>}>
              <Outlet />
            </Suspense>
          ) : (
            <ConnectPrompt onConnect={wallet.connect} connecting={wallet.isConnecting} />
          )}
        </div>
      </div>

      <ToastViewport />
    </div>
  )
}

function ConnectPrompt({ onConnect, connecting }) {
  return (
    <div className="card" style={{ maxWidth: 460, margin: '10vh auto 0', textAlign: 'center' }}>
      <div className="card-pad">
        <div className="panel-icon-wrap" style={{ margin: '0 auto 16px', fontSize: 18 }}>
          🔌
        </div>
        <h2 style={{ marginBottom: 8 }}>Connect your wallet</h2>
        <p className="panel-desc">
          Connect a wallet on Arc Testnet to register agents, submit reputation feedback, and transfer ANV.
        </p>
        <Button variant="primary" onClick={onConnect} disabled={connecting} className="btn-block">
          {connecting ? 'Connecting…' : 'Connect Wallet'}
        </Button>
      </div>
    </div>
  )
}
