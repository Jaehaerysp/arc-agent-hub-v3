/**
 * v7 Premium Design System — IconButton.
 *
 * Square, icon-only action button (table row actions, panel header
 * actions, toolbar controls). `label` is required and is used as both
 * `aria-label` and the native tooltip (`title`), since an icon-only
 * control has no visible text for assistive tech or a mouse-hover
 * hint otherwise.
 */
export function IconButton({
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  children,
  ...props
}) {
  const cls = ['ds-icon-btn', `ds-icon-btn-${variant}`, size !== 'md' ? `ds-icon-btn-${size}` : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={cls} aria-label={label} title={label} {...props}>
      {children}
    </button>
  )
}
