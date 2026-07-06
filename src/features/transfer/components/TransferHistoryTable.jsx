import { Panel, Badge, EmptyState } from '../../../ui/design-system'
import { shortHash, formatDate, formatTime } from '../../../lib/format'
import { IconTransfer, IconExternal } from '../../../ui/icons'

function statusBadge(status) {
  if (status === 'success') return <Badge variant="success" size="sm">Success</Badge>
  if (status === 'error') return <Badge variant="error" size="sm">Failed</Badge>
  return <Badge variant="muted" size="sm">Pending</Badge>
}

/**
 * Transfer History — the same `activity.filter(a => a.type === 'transfer')`
 * slice the previous TransferPage rendered as a flat list, now in the
 * shared v7 table visual language (same class shape as Wallet's
 * RecentTransactionsTable, `wv7-table*`).
 */
export function TransferHistoryTable({ transfers, arcExplorer }) {
  return (
    <Panel title="Transfer History" subtitle="ANV transfers sent from this wallet" className="wv7-tx-panel">
      {transfers.length === 0 ? (
        <EmptyState
          icon={<IconTransfer width={22} height={22} />}
          title="No transfers yet"
          description="Transfers you send will appear here."
        />
      ) : (
        <div className="wv7-table-wrap">
          <table className="wv7-table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Detail</th>
                <th>Status</th>
                <th>Date</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((item) => (
                <tr key={item.id} className="wv7-table-row">
                  <td className="mono">{item.txHash ? shortHash(item.txHash) : '—'}</td>
                  <td>{item.detail || item.label}</td>
                  <td>{statusBadge(item.status)}</td>
                  <td>
                    {formatDate(item.timestamp)} <span className="text-muted">{formatTime(item.timestamp)}</span>
                  </td>
                  <td>
                    {item.txHash ? (
                      <a href={`${arcExplorer}/tx/${item.txHash}`} target="_blank" rel="noopener noreferrer" className="wv7-table-link" aria-label="View on explorer">
                        <IconExternal width={14} height={14} />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}
