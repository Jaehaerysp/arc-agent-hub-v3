import { useNavigate } from 'react-router-dom'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useBalances } from '../../hooks/useBalances'
import { StatCard } from '../../ui/StatCard'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import { Badge } from '../../ui/Badge'
import { Skeleton } from '../../ui/Skeleton'
import { formatTime, formatTokenAmount, shortHash } from '../../lib/format'
import { IconAgent, IconStar, IconShield, IconTransfer } from '../../ui/icons'

const QUICK_ACTIONS = [
  { path: '/agents', label: 'Register agent', desc: 'Create an on-chain identity', icon: IconAgent },
  { path: '/reputation', label: 'Give feedback', desc: 'Submit a reputation score', icon: IconStar },
  { path: '/validation', label: 'Request validation', desc: 'Ask a validator to review', icon: IconShield },
  { path: '/transfer', label: 'Send ANV', desc: 'Transfer tokens instantly', icon: IconTransfer },
]

export default function DashboardPage() {
  const wallet = useWalletContext()
  const { nativeBalance, anvBalance, loading: balancesLoading } = useBalances(wallet.provider, wallet.account)
  const navigate = useNavigate()

  const successCount = wallet.activity.filter((a) => a.status === 'success').length

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard
          label="Network"
          value={wallet.isArcNetwork ? 'Arc Testnet' : 'Wrong network'}
          accent={wallet.isArcNetwork}
          sub={wallet.isArcNetwork ? 'Connected & healthy' : 'Switch network to continue'}
        />
        <StatCard
          label="Agent ID"
          value={wallet.agentId ? `#${wallet.agentId}` : 'Not registered'}
          accent={!!wallet.agentId}
          sub={wallet.agentId ? 'Reused across features' : 'Register to get started'}
        />
        <StatCard
          label="USDC Balance"
          value={balancesLoading && nativeBalance === null ? <Skeleton width={70} height={26} /> : formatTokenAmount(nativeBalance, 4)}
          sub="Native gas token"
        />
        <StatCard
          label="ANV Balance"
          value={balancesLoading && anvBalance === null ? <Skeleton width={70} height={26} /> : formatTokenAmount(anvBalance, 4)}
          sub="ERC-20 utility token"
        />
      </div>

      <div className="dashboard-section-title">Quick actions</div>
      <div className="quick-actions-grid">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <button key={a.path} className="quick-action" onClick={() => navigate(a.path)}>
              <div className="panel-icon-wrap" style={{ width: 32, height: 32 }}>
                <Icon width={15} height={15} />
              </div>
              <div>
                <div className="quick-action-title">{a.label}</div>
                <div className="quick-action-desc">{a.desc}</div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="dashboard-section-title">
        Recent activity
        <Badge variant="accent">{successCount} completed</Badge>
      </div>

      {wallet.activity.length === 0 ? (
        <Card>
          <EmptyState
            icon="◎"
            title="No activity yet"
            description="Register an agent, submit feedback, or send a transfer to see it show up here."
          />
        </Card>
      ) : (
        <div className="activity-list">
          {wallet.activity.slice(0, 8).map((item) => (
            <div key={item.id} className={`activity-item ${item.status}`}>
              <div className="activity-main">
                <div className="activity-title">{item.label}</div>
                {item.agentId && <div className="activity-agent">Agent #{item.agentId}</div>}
                {item.detail && <div className="activity-detail">{item.detail}</div>}
              </div>
              <div className="activity-meta">
                {item.txHash && (
                  <a
                    href={`${wallet.arcExplorer}/tx/${item.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    {shortHash(item.txHash)}
                  </a>
                )}
                <div className="activity-time">{formatTime(item.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
