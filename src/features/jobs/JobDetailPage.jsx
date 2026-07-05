import { useParams, useNavigate } from 'react-router-dom'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useJob } from '../../hooks/useJob'
import { Panel, Button, Skeleton, EmptyState } from '../../ui/design-system'
import { Alert } from '../../ui/Alert'
import { CopyButton } from '../../ui/CopyButton'
import { formatExpiry, isExpired, shortAddr } from '../../lib/format'
import { AGENTIC_COMMERCE_ADDRESS, ZERO_ADDRESS } from '../../lib/blockchain/constants'
import { IconJob, IconExternal } from '../../ui/icons'
import { JobStatusBadge } from './components/JobStatusBadge'
import { JobTimeline } from './components/JobTimeline'
import { JobActionPanel } from './components/JobActionPanel'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { account, signer, provider, addActivity, arcExplorer } = useWalletContext()
  const { job, allowance, loading, error, notFound, refresh } = useJob(provider, account, id)

  if (loading && !job) {
    return (
      <Panel className="jv7-detail-panel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton height={28} width={180} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </div>
      </Panel>
    )
  }

  if (notFound || (!loading && !job && error)) {
    return (
      <Panel className="jv7-detail-panel">
        <EmptyState
          icon={<IconJob width={22} height={22} />}
          title={`Job #${id} not found`}
          description="This job ID doesn't exist yet on Arc Testnet, or the RPC request failed."
          action={<Button variant="primary" onClick={() => navigate('/jobs')}>Back to Jobs</Button>}
        />
      </Panel>
    )
  }

  if (!job) return null

  const expired = isExpired(job.expiredAt) && job.status !== 3

  return (
    <div className="two-col jv7-detail-layout">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Overview */}
        <Panel icon={<IconJob width={18} height={18} />} title={`Job #${job.id}`} subtitle="ERC-8183 Agentic Commerce" className="jv7-detail-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <JobStatusBadge status={job.status} label={job.statusLabel} />
            {expired && <Alert variant="warning" title="Past expiration">This job&apos;s expiration has passed.</Alert>}
          </div>

          {error && <Alert variant="error" title="Refresh failed">{error}</Alert>}

          {job.description ? (
            <p className="panel-desc" style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
          ) : (
            <p className="panel-desc" style={{ color: 'var(--text-dim)' }}>No description provided for this job.</p>
          )}
        </Panel>

        {/* Participants */}
        <Panel title="Participants" className="jv7-detail-panel">
          <div className="kv-grid">
            <div className="kv-row">
              <span className="kv-label">Client</span>
              <span className="kv-value">{shortAddr(job.client)} <CopyButton value={job.client} label="Copy" /></span>
            </div>
            <div className="kv-row">
              <span className="kv-label">Provider</span>
              <span className="kv-value">{shortAddr(job.provider)} <CopyButton value={job.provider} label="Copy" /></span>
            </div>
            <div className="kv-row">
              <span className="kv-label">Evaluator</span>
              <span className="kv-value">
                {job.evaluator === ZERO_ADDRESS ? 'None (client approves)' : <>{shortAddr(job.evaluator)} <CopyButton value={job.evaluator} label="Copy" /></>}
              </span>
            </div>
          </div>
        </Panel>

        {/* Budget / Escrow */}
        <Panel title="Budget & Escrow" className="jv7-detail-panel">
          <div className="kv-grid">
            <div className="kv-row">
              <span className="kv-label">Budget</span>
              <span className="kv-value">{job.budgetFormatted} USDC</span>
            </div>
            <div className="kv-row">
              <span className="kv-label">Escrow status</span>
              <span className="kv-value">
                {job.status === 1 || job.status === 2 ? 'Locked in escrow' : job.status === 3 ? 'Released to provider' : 'Not yet funded'}
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-label">Expiration</span>
              <span className="kv-value">{formatExpiry(job.expiredAt)}</span>
            </div>
            <div className="kv-row">
              <span className="kv-label">Hook</span>
              <span className="kv-value">{job.hook === ZERO_ADDRESS ? 'None' : <>{shortAddr(job.hook)} <CopyButton value={job.hook} label="Copy" /></>}</span>
            </div>
          </div>
        </Panel>

        {/* Timeline */}
        <Panel title="Timeline" className="jv7-detail-panel">
          <JobTimeline job={job} allowance={allowance} account={account} />
        </Panel>

        {/* Explorer Links */}
        <Panel title="Explorer links" subtitle="View this job's on-chain activity on ArcScan" className="jv7-detail-panel">
          <div className="kv-grid">
            {job.createdTxHash && (
              <div className="kv-row">
                <span className="kv-label">Creation tx</span>
                <span className="kv-value">
                  <a href={`${arcExplorer}/tx/${job.createdTxHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                    {shortAddr(job.createdTxHash)} <IconExternal width={12} height={12} />
                  </a>
                </span>
              </div>
            )}
            <div className="kv-row">
              <span className="kv-label">Client wallet</span>
              <span className="kv-value">
                <a href={`${arcExplorer}/address/${job.client}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                  {shortAddr(job.client)} <IconExternal width={12} height={12} />
                </a>
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-label">Provider wallet</span>
              <span className="kv-value">
                <a href={`${arcExplorer}/address/${job.provider}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                  {shortAddr(job.provider)} <IconExternal width={12} height={12} />
                </a>
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-label">Agentic Commerce contract</span>
              <span className="kv-value">
                <a href={`${arcExplorer}/address/${AGENTIC_COMMERCE_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                  {shortAddr(AGENTIC_COMMERCE_ADDRESS)} <IconExternal width={12} height={12} />
                </a>
              </span>
            </div>
          </div>
        </Panel>
      </div>

      <JobActionPanel
        job={job}
        account={account}
        signer={signer}
        allowance={allowance}
        arcExplorer={arcExplorer}
        addActivity={addActivity}
        onChanged={refresh}
      />
    </div>
  )
}
