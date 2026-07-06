import { Panel, Badge, EmptyState } from '../../../ui/design-system'
import { shortHash, formatDate, formatTime } from '../../../lib/format'
import { IconActivity, IconExternal } from '../../../ui/icons'

function statusBadge(status) {
  if (status === 'success') return <Badge variant="success" size="sm">Success</Badge>
  if (status === 'error') return <Badge variant="error" size="sm">Failed</Badge>
  return <Badge variant="muted" size="sm">Pending</Badge>
}

/**
 * Premium transactions table — Hash, Type, Amount, Network, Status,
 * Date, Explorer, built entirely from `wallet.activity` entries that
 * carry a real `txHash`. No synthetic rows.
 */
export function RecentTransactionsTable({ transactions, arcExplorer }) {
  return (
    <Panel title="Recent Transactions" subtitle="On-chain transactions logged from this device" className="wv7-tx-panel">
      {transactions.length === 0 ? (
        <EmptyState
          icon={<IconActivity width={22} height={22} />}
          title="No transactions yet"
          description="Transactions you submit from this wallet will appear here."
        />
      ) : (
        <div className="wv7-table-wrap">
          <table className="wv7-table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Network</th>
                <th>Status</th>
                <th>Date</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="wv7-table-row">
                  <td className="mono">{shortHash(tx.hash)}</td>
                  <td>{tx.type}</td>
                  <td className="mono">{tx.amount}</td>
                  <td>{tx.network}</td>
                  <td>{statusBadge(tx.status)}</td>
                  <td>
                    {formatDate(tx.date)} <span className="text-muted">{formatTime(tx.date)}</span>
                  </td>
                  <td>
                    <a href={`${arcExplorer}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="wv7-table-link" aria-label="View on explorer">
                      <IconExternal width={14} height={14} />
                    </a>
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
