import { GlassCard } from './GlassCard'

/**
 * v7 Premium Design System — FeatureCard.
 *
 * Icon + title + description card for feature/benefit grids (e.g. a
 * Marketplace category grid, a Validation "how it works" strip). Pass
 * `interactive` when the whole card is clickable (e.g. `as="button"` or
 * wrapped in a router `Link`).
 */
export function FeatureCard({ icon, title, description, interactive = false, className = '', ...props }) {
  return (
    <GlassCard
      className={['ds-feature-card', className].filter(Boolean).join(' ')}
      padding="md"
      interactive={interactive}
      {...props}
    >
      {icon && <div className="ds-feature-icon">{icon}</div>}
      {title && <h4 className="ds-feature-title">{title}</h4>}
      {description && <p className="ds-feature-desc">{description}</p>}
    </GlassCard>
  )
}
