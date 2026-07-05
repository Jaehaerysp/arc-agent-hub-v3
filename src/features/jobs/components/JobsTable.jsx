import { useNavigate } from 'react-router-dom'
import { JobStatusBadge } from './JobStatusBadge'
import { Button, Badge } from '../../../ui/design-system'
import { shortAddr, formatDate, formatTime } from '../../../lib/format'
import { IconExternal } from '../../../ui/icons'

/** Escrow state is derived, not a separate on-chain field: locked while Funded/Submitted, released once Completed. */
function escrowBadge(status) {
  if (status === 1 || status === 2) return <Badge variant="confirmed" size="sm">Locked</Badge>
  if (status === 3) return <Badge variant="completed" size="sm">Released</Badge>
  return <span className="text-muted">—</span>
}

/**
 * Jobs v7 (Mission 6) — "Active Jobs" professional table. Same data and
 * row-click-to-detail behavior as before; visual language updated to the
 * v7 design system (Badge, Button) with an explicit Escrow column so
 * status and settlement read as two distinct facts, not one.
 */
export function JobsTable({ jobs, account, arcExplorer }) {
  const navigate = useNavigate()

  return (
    <div className="jv7-table-wrap">
      <table className="jv7-table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Status</th>
            <th>Client</th>
            <th>Agent</th>
            <th>Reward</th>
            <th>Escrow</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const isClient = account && job.client.toLowerCase() === account.toLowerCase()
            const isProvider = account && job.provider.toLowerCase() === account.toLowerCase()
            return (
              <tr key={job.id} className="jv7-table-row" onClick={() => navigate(`/jobs/${job.id}`)}>
                <td className="mono jv7-table-id">#{job.id}</td>
                <td><JobStatusBadge status={job.status} label={job.statusLabel} size="sm" /></td>
                <td className="mono">
                  {shortAddr(job.client)}
                  {isClient && <span className="role-pill client" style={{ marginLeft: 6 }}>You</span>}
                </td>
                <td className="mono">
                  {shortAddr(job.provider)}
                  {isProvider && <span className="role-pill provider" style={{ marginLeft: 6 }}>You</span>}
                </td>
                <td className="mono">{job.budgetFormatted} USDC</td>
                <td>{escrowBadge(job.status)}</td>
                <td>
                  {job.createdAt ? (
                    <>{formatDate(job.createdAt)} <span className="text-muted">{formatTime(job.createdAt)}</span></>
                  ) : job.createdTxHash ? (
                    <a
                      href={`${arcExplorer}/tx/${job.createdTxHash}`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-link"
                      title="View creation tx on ArcScan"
                    >
                      View tx <IconExternal width={12} height={12} />
                    </a>
                  ) : '—'}
                </td>
                <td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`) }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
