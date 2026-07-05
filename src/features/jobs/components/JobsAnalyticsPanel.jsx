import { Panel, Grid } from '../../../ui/design-system'
import { formatDuration } from '../jobsAnalytics'

/** Same dependency-free animated-in bar chart pattern as Dashboard v7's MissionAnalytics — draws in once, never re-animates on re-render. */
function BarChart({ data, valueKey = 'value', labelKey = 'label', suffix = '' }) {
  const max = Math.max(1, ...data.map((d) => d[valueKey]))

  return (
    <div className="jv7-bar-chart" role="img" aria-label={data.map((d) => `${d[labelKey]}: ${d[valueKey]}${suffix}`).join(', ')}>
      {data.map((d, i) => (
        <div className="jv7-bar-row" key={d.key || d[labelKey]}>
          <span className="jv7-bar-label">{d[labelKey]}</span>
          <div className="jv7-bar-track">
            <div
              className="jv7-bar-fill"
              style={{ width: `${Math.max(3, (d[valueKey] / max) * 100)}%`, transitionDelay: `${i * 60}ms` }}
            />
          </div>
          <span className="jv7-bar-value">
            {d[valueKey]}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Bounded-completion ring — only ever used for a genuine percentage-of-a-whole. */
function RingChart({ percent, label, sub }) {
  const size = 96
  const stroke = 8
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const clamped = percent === null ? 0 : Math.max(0, Math.min(100, percent))
  const offset = circumference * (1 - clamped / 100)

  return (
    <div className="jv7-ring-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${percent === null ? 'no data yet' : percent + '%'}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="jv7-ring-track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="jv7-ring-fill"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={percent === null ? circumference : offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="47%" textAnchor="middle" className="jv7-ring-value">
          {percent === null ? '—' : `${percent}%`}
        </text>
      </svg>
      <div className="jv7-ring-caption">
        <div className="jv7-ring-label">{label}</div>
        <div className="jv7-ring-sub">{sub}</div>
      </div>
    </div>
  )
}

/**
 * Five analytics blocks — Jobs by Status, Completion Rate, Monthly
 * Activity, Escrow Volume, Average Time — every one built from data the
 * page already has (statusBreakdown, success, monthlyActivity,
 * escrowByStatus, avgCompletion all computed once in JobsPage and passed
 * down). No new on-chain reads; bars for counts/amounts across
 * categories, a ring only for the genuine percentage-of-a-whole.
 */
export function JobsAnalyticsPanel({ statusBreakdown, success, monthlyActivity, escrowByStatus, avgCompletion }) {
  return (
    <Panel title="Analytics" subtitle="Status, completion, activity, and escrow at a glance" className="jv7-analytics-panel">
      <Grid columns={2} minColWidth="320px" gap="lg">
        <div className="jv7-analytics-block">
          <div className="jv7-analytics-block-title">Jobs by Status</div>
          <BarChart data={statusBreakdown} valueKey="value" labelKey="label" />
        </div>

        <div className="jv7-analytics-block jv7-analytics-block-rings">
          <div className="jv7-analytics-block-title">Completion Rate</div>
          <RingChart
            percent={success.rate}
            label="Jobs completed"
            sub={success.rate === null ? 'No settled jobs yet' : `${success.completed} completed · ${success.rejected + success.expired} unsuccessful`}
          />
        </div>

        <div className="jv7-analytics-block">
          <div className="jv7-analytics-block-title">Monthly Activity</div>
          {monthlyActivity.every((m) => m.value === 0) ? (
            <p className="jv7-analytics-empty">No job activity recorded yet this period.</p>
          ) : (
            <BarChart data={monthlyActivity} valueKey="value" labelKey="label" />
          )}
        </div>

        <div className="jv7-analytics-block">
          <div className="jv7-analytics-block-title">Escrow Volume</div>
          {escrowByStatus.length === 0 ? (
            <p className="jv7-analytics-empty">No budget has been set on any job yet.</p>
          ) : (
            <BarChart data={escrowByStatus} valueKey="value" labelKey="label" suffix=" USDC" />
          )}
        </div>

        <div className="jv7-analytics-block jv7-analytics-block-rings">
          <div className="jv7-analytics-block-title">Average Time</div>
          <div className="jv7-avg-time">
            <span className="jv7-avg-time-value">{formatDuration(avgCompletion.averageMs)}</span>
            <span className="jv7-avg-time-sub">
              {avgCompletion.sampleSize > 0
                ? `Average from creation to completion, across ${avgCompletion.sampleSize} job${avgCompletion.sampleSize === 1 ? '' : 's'}`
                : 'Not enough completed jobs yet to average'}
            </span>
          </div>
        </div>
      </Grid>
    </Panel>
  )
}
