import { useNavigate } from 'react-router-dom'
import { Panel, GlassCard } from '../../../ui/design-system'
import { JobStatusBadge } from './JobStatusBadge'
import { shortAddr, formatExpiry, isExpired } from '../../../lib/format'
import { IconClock } from '../../../ui/icons'

function JobCard({ job, account, onOpen }) {
  const isClient = account && job.client?.toLowerCase() === account.toLowerCase()
  const counterpart = isClient ? job.provider : job.client
  const counterpartLabel = isClient ? 'Provider' : 'Client'
  const expired = isExpired(job.expiredAt) && job.status !== 3

  return (
    <GlassCard as="button" type="button" interactive className="jv7-kanban-card" onClick={() => onOpen(job.id)}>
      <div className="jv7-kanban-card-top">
        <span className="jv7-kanban-card-id mono">#{job.id}</span>
        <JobStatusBadge status={job.status} label={job.statusLabel} size="sm" />
      </div>

      <p className="jv7-kanban-card-desc">{job.description || 'No description provided.'}</p>

      <div className="jv7-kanban-card-foot">
        <span className="jv7-kanban-card-counterpart mono" title={counterpart}>
          {counterpartLabel} · {shortAddr(counterpart)}
        </span>
        <span className="jv7-kanban-card-reward">{job.budgetFormatted} USDC</span>
      </div>

      {job.status !== 3 && (
        <div className={`jv7-kanban-card-expiry ${expired ? 'is-expired' : ''}`}>
          <IconClock width={11} height={11} />
          {expired ? 'Expired' : formatExpiry(job.expiredAt)}
        </div>
      )}
    </GlassCard>
  )
}

/**
 * Premium Kanban board — one column per real on-chain job status (Open,
 * Funded, Submitted, Completed, Rejected, Expired; see jobsAnalytics'
 * computeKanbanColumns). Scrolls horizontally as a single row on every
 * viewport, which is also the natural mobile behavior the brief asks for.
 */
export function JobsPipeline({ columns, account }) {
  const navigate = useNavigate()
  const total = columns.reduce((sum, c) => sum + c.jobs.length, 0)

  return (
    <Panel title="Pipeline" subtitle="Every job you're party to, grouped by on-chain status" className="jv7-pipeline-panel">
      {total === 0 ? (
        <p className="jv7-pipeline-empty">Jobs will appear here as soon as you create or get hired for one.</p>
      ) : (
        <div className="jv7-kanban" role="list" aria-label="Jobs pipeline">
          {columns.map((column) => (
            <div className="jv7-kanban-column" role="listitem" key={column.status}>
              <div className="jv7-kanban-column-head">
                <span className="jv7-kanban-column-title">{column.label}</span>
                <span className="jv7-kanban-column-count">{column.jobs.length}</span>
              </div>
              <div className="jv7-kanban-column-body">
                {column.jobs.length === 0 ? (
                  <div className="jv7-kanban-column-empty">No jobs</div>
                ) : (
                  column.jobs.map((job) => (
                    <JobCard key={job.id} job={job} account={account} onOpen={(id) => navigate(`/jobs/${id}`)} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}
