import { GlassCard } from './GlassCard'

/**
 * v7 Premium Design System — MetricCard.
 *
 * The "Metric" card type from the Blueprint's Cards table: compact,
 * label + big number, with gradient-text (`accent`) reserved for the
 * single most important metric per page. Optional `trend` renders a
 * directional delta (e.g. `{ direction: 'up', value: '+4.2%' }`).
 */
export function MetricCard({ label, value, icon, trend, accent = false, sub, className = '' }) {
  return (
    <GlassCard className={['ds-metric-card', className].filter(Boolean).join(' ')} padding="md">
      <div className="ds-metric-head">
        <span className="ds-metric-label">{label}</span>
        {icon && <span className="ds-metric-icon">{icon}</span>}
      </div>
      <div className={['ds-metric-value', accent ? 'is-accent' : ''].filter(Boolean).join(' ')}>{value}</div>
      {(sub || trend) && (
        <div className="ds-metric-foot">
          {trend && (
            <span
              className={[
                'ds-metric-trend',
                trend.direction === 'up' ? 'is-up' : trend.direction === 'down' ? 'is-down' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : ''} {trend.value}
            </span>
          )}
          {sub && <span className="ds-metric-sub">{sub}</span>}
        </div>
      )}
    </GlassCard>
  )
}
