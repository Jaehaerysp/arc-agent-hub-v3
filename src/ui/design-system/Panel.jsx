import { GlassCard } from './GlassCard'

/**
 * v7 Premium Design System — Panel.
 *
 * The general-purpose "card with a header" shape used for grouped
 * content sections (a settings block, a stats table wrapper, a form
 * card). Header is optional and only renders when at least one of
 * `icon` / `title` / `actions` is provided.
 */
export function Panel({ icon, title, subtitle, actions, footer, padding = 'md', className = '', children }) {
  const hasHeader = icon || title || actions
  return (
    <GlassCard className={['ds-panel', className].filter(Boolean).join(' ')} padding={padding}>
      {hasHeader && (
        <div className="ds-panel-header">
          {icon && <div className="ds-panel-icon-wrap">{icon}</div>}
          <div className="ds-panel-heading">
            {title && <h3 className="ds-panel-title">{title}</h3>}
            {subtitle && <p className="ds-panel-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="ds-panel-actions">{actions}</div>}
        </div>
      )}
      <div className="ds-panel-body">{children}</div>
      {footer && <div className="ds-panel-footer">{footer}</div>}
    </GlassCard>
  )
}
