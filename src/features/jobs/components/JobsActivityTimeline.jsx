import { Panel, EmptyState } from '../../../ui/design-system'
import { formatTime, shortHash } from '../../../lib/format'
import { IconActivity } from '../../../ui/icons'

/**
 * Jobs v7 (Mission 6) — "Job Timeline": the same vertical dot-marked
 * timeline pattern as Dashboard v7's MissionTimeline, scoped to
 * `activity.filter(a => a.type === 'job')` — the exact same job-activity
 * slice the previous ActivityFeed rendered, just in the shared v7
 * timeline visual language instead of a flat list.
 */
export function JobsActivityTimeline({ activity, arcExplorer, limit = 8 }) {
  const items = activity.slice(0, limit)

  return (
    <Panel title="Job Timeline" subtitle="Job creation, funding, submissions, and completions, most recent first" className="jv7-timeline-panel">
      {items.length === 0 ? (
        <EmptyState
          icon={<IconActivity width={20} height={20} />}
          title="No job activity yet"
          description="Job creation, funding, submissions and completions will show up here."
        />
      ) : (
        <ol className="jv7-timeline" aria-live="polite">
          {items.map((item) => (
            <li key={item.id} className="jv7-timeline-item" data-status={item.status}>
              <span className="jv7-timeline-dot" data-status={item.status} aria-hidden="true" />
              <div className="jv7-timeline-body">
                <div className="jv7-timeline-title">{item.label}</div>
                {item.detail && <div className="jv7-timeline-detail">{item.detail}</div>}
              </div>
              <div className="jv7-timeline-meta">
                {item.txHash && (
                  <a
                    href={`${arcExplorer}/tx/${item.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jv7-timeline-tx mono"
                  >
                    {shortHash(item.txHash)}
                  </a>
                )}
                <time className="jv7-timeline-time">{formatTime(item.timestamp)}</time>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
