/**
 * v7 Premium Design System — Section.
 *
 * Vertical-rhythm wrapper for a page's top-level regions, using the
 * spacing scale from docs/UI_BLUEPRINT.md ("gap between distinct page
 * regions" / "vertical rhythm between top-level page sections").
 * `spacing="sm"` maps to `--space-6`, `"md"` (default) to `--space-7`,
 * `"lg"` to `--space-8` for the rare largest hero moments.
 */
export function Section({ as: Tag = 'section', spacing = 'md', divider = false, className = '', children, ...props }) {
  const cls = ['ds-section', `ds-section-${spacing}`, className].filter(Boolean).join(' ')

  return (
    <Tag className={cls} {...props}>
      {children}
      {divider && <hr className="ds-section-divider" />}
    </Tag>
  )
}
