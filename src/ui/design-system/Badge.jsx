/**
 * v7 Premium Design System — Badge.
 *
 * Implements the Status Chips table in docs/UI_BLUEPRINT.md. Every
 * variant pairs a color direction with the text label passed as
 * `children` — color is never the sole signal, per the accessibility
 * principle repeated throughout the Blueprint. `dot` can be disabled for
 * contexts where the leading dot glyph would be redundant.
 */
export function Badge({ variant = 'muted', dot = true, size = 'md', children, className = '' }) {
  const cls = [
    'ds-badge',
    `ds-badge-${variant}`,
    dot ? '' : 'ds-badge-no-dot',
    size === 'sm' ? 'ds-badge-sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={cls}>{children}</span>
}
