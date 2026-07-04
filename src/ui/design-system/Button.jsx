/**
 * v7 Premium Design System — Button.
 *
 * Implements the Buttons table in docs/UI_BLUEPRINT.md: primary (brand
 * gradient), secondary (elevated/bordered), ghost, danger, and success
 * variants, three sizes, and a loading state that keeps the button's
 * label visible (per the Blueprint's "never a bare spinner alone" rule)
 * while swapping in a spinner glyph and disabling interaction.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  block = false,
  iconLeft,
  iconRight,
  className = '',
  children,
  ...props
}) {
  const cls = [
    'ds-btn',
    `ds-btn-${variant}`,
    size !== 'md' ? `ds-btn-${size}` : '',
    block ? 'ds-btn-block' : '',
    loading ? 'is-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <span className="ds-spinner" aria-hidden="true" />}
      {!loading && iconLeft}
      <span className="ds-btn-label">{children}</span>
      {!loading && iconRight}
    </button>
  )
}
