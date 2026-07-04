/**
 * v7 Premium Design System — EmptyState.
 *
 * Per the Blueprint's checklist rule "empty states explain and invite":
 * every empty state should name what belongs there (`title`/`description`)
 * and offer the action that would fill it (`action`).
 */
export function EmptyState({ icon, title, description, action, size = 'md', className = '' }) {
  const cls = ['ds-empty-state', size === 'sm' ? 'ds-empty-state-sm' : '', className].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      {icon && <div className="ds-empty-state-icon">{icon}</div>}
      {title && <div className="ds-empty-state-title">{title}</div>}
      {description && <div className="ds-empty-state-desc">{description}</div>}
      {action && <div className="ds-empty-state-action">{action}</div>}
    </div>
  )
}
