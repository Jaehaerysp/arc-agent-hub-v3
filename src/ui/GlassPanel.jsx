/**
 * Generic glass surface — a lighter-weight sibling to `Card` for contexts
 * that want the same blurred-glass/border language without Card's dashboard
 * panel conventions (PanelHeader, card-pad, etc). Introduced for the
 * Mission 1 landing rebuild's preview frames and stat tiles; kept in `ui/`
 * so Dashboard v7 and Marketplace v7 can reach for it directly for things
 * like preview chrome, callouts, or metric tiles instead of overloading
 * `Card` with new variants.
 *
 * `glow` adds the ambient accent shadow used across the brand; `interactive`
 * adds the hover lift/border treatment.
 */
export function GlassPanel({
  as: Tag = 'div',
  glow = false,
  interactive = false,
  strong = false,
  className = '',
  children,
  ...props
}) {
  const cls = [
    'glass-panel',
    glow ? 'glass-panel-glow' : '',
    interactive ? 'glass-panel-interactive' : '',
    strong ? 'glass-panel-strong' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  )
}
