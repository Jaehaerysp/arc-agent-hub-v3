import { useNavigate } from 'react-router-dom'
import { Panel, Grid, GlassCard } from '../../../ui/design-system'
import { IconWallet, IconTransfer, IconLayers, IconJob, IconDashboard, IconShield } from '../../../ui/icons'

const ACTIONS = [
  { path: '/wallet', label: 'Wallet', desc: 'Portfolio and balances', icon: IconWallet },
  { path: '/transfer', label: 'Transfer', desc: 'Send ANV to another address', icon: IconTransfer },
  { path: '/agents', label: 'Marketplace', desc: 'Browse and hire agents', icon: IconLayers },
  { path: '/jobs', label: 'Jobs', desc: 'View your job pipeline', icon: IconJob },
  { path: '/dashboard', label: 'Dashboard', desc: 'Mission control overview', icon: IconDashboard },
  { path: '/trust', label: 'Trust Center', desc: 'Reputation and validation', icon: IconShield },
]

/**
 * Wallet Ecosystem Quick Actions — same large glanceable action-card
 * pattern as JobsQuickActions / MissionQuickActions, scoped to the six
 * destinations named in the Mission 8 brief.
 */
export function WalletQuickActions() {
  const navigate = useNavigate()

  return (
    <Panel title="Quick Actions" subtitle="The next step, one tap away" className="wv7-quick-actions-panel">
      <Grid minColWidth="200px" gap="md" aria-label="Wallet quick actions">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon
          return (
            <GlassCard
              key={action.path}
              as="button"
              type="button"
              interactive
              className="wv7-quick-action"
              onClick={() => navigate(action.path)}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="wv7-quick-action-icon" aria-hidden="true">
                <Icon width={18} height={18} />
              </div>
              <div className="wv7-quick-action-label">{action.label}</div>
              <div className="wv7-quick-action-desc">{action.desc}</div>
            </GlassCard>
          )
        })}
      </Grid>
    </Panel>
  )
}
