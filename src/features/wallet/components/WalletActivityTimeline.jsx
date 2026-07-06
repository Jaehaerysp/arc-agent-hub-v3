import { Panel, EmptyState } from '../../../ui/design-system'
import { formatTime, shortHash } from '../../../lib/format'
import { txTypeLabel } from '../walletAnalytics'
import { IconActivity } from '../../../ui/icons'

/**
 * Activity Timeline — every locally logged wallet event (connect,
 * transfer, job, validation, network switch), most recent first. Same
 * vertical dot-marked pattern as Dashboard v7's MissionTimeline / Jobs
 * v7's JobsActivityTimeline, scoped to the full unfiltered activity feed
 * since this is the wallet's own page.
 */
export function WalletActivityTimeline({ items, arcExplorer }) {
  return (
    <Panel title="Activity Timeline" subtitle="Wallet connections, transfers, and on-chain events, most recent first" className="wv7-timeline-panel">
      {items.length === 0 ? (
        <EmptyState
          icon={<IconActivity width={20} height={20} />}
          title="No activity yet"
          description="Wallet connections, transfers, and on-chain actions will show up here."
        />
      ) : (
        <ol className="wv7-timeline" aria-live="polite">
          {items.map((item) => (
            <li key={item.id} className="wv7-timeline-item" data-status={item.status}>
              <span className="wv7-timeline-dot" data-status={item.status} aria-hidden="true" />
              <div className="wv7-timeline-body">
                <div className="wv7-timeline-title">
                  <span className="wv7-timeline-type">{txTypeLabel(item.type)}</span> {item.label}
                </div>
                {item.detail && <div className="wv7-timeline-detail">{item.detail}</div>}
              </div>
              <div className="wv7-timeline-meta">
                {item.txHash && (
                  <a href={`${arcExplorer}/tx/${item.txHash}`} target="_blank" rel="noopener noreferrer" className="wv7-timeline-tx mono">
                    {shortHash(item.txHash)}
                  </a>
                )}
                <time className="wv7-timeline-time">{formatTime(item.timestamp)}</time>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
