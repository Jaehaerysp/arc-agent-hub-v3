/**
 * v7 Premium Design System — Divider.
 *
 * Horizontal (default, optionally labeled — "OR" between two actions),
 * or vertical (for inline toolbar/breadcrumb separators).
 */
export function Divider({ orientation = 'horizontal', label, className = '' }) {
  if (orientation === 'vertical') {
    return (
      <span
        className={['ds-divider-vertical', className].filter(Boolean).join(' ')}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (label) {
    return (
      <div className={['ds-divider-labeled', className].filter(Boolean).join(' ')} role="separator">
        <span className="ds-divider-line" />
        <span className="ds-divider-label">{label}</span>
        <span className="ds-divider-line" />
      </div>
    )
  }

  return <hr className={['ds-divider', className].filter(Boolean).join(' ')} />
}
