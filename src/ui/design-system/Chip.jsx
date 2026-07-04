/**
 * v7 Premium Design System — Chip.
 *
 * Distinct from `Badge`: a Badge communicates a fixed status, a Chip is
 * an interactive or removable pill — filter toggles, multi-select tag
 * pickers ("Client", "Provider", category filters). Renders a `<button>`
 * when `onClick` is provided (toggle/filter chip) or a plain `<span>`
 * when it's purely a removable tag with no toggle behavior of its own.
 */
export function Chip({
  selected = false,
  disabled = false,
  icon,
  onClick,
  onRemove,
  children,
  className = '',
}) {
  const interactive = typeof onClick === 'function'
  const Tag = interactive ? 'button' : 'span'

  const cls = ['ds-chip', selected ? 'is-selected' : '', interactive ? 'ds-chip-interactive' : '', className]
    .filter(Boolean)
    .join(' ')

  const handleRemoveKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRemove()
    }
  }

  const handleRemoveClick = (event) => {
    event.stopPropagation()
    onRemove()
  }

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      className={cls}
      onClick={interactive ? onClick : undefined}
      disabled={interactive ? disabled : undefined}
      aria-pressed={interactive ? selected : undefined}
    >
      {icon && <span className="ds-chip-icon">{icon}</span>}
      <span className="ds-chip-label">{children}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          className="ds-chip-remove"
          aria-label="Remove"
          onClick={handleRemoveClick}
          onKeyDown={handleRemoveKeyDown}
        >
          ×
        </span>
      )}
    </Tag>
  )
}
