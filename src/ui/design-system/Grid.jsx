/**
 * v7 Premium Design System — Grid.
 *
 * Responsive CSS grid wrapper. Pass `columns` (1–4) for a fixed
 * breakpoint-aware column count (collapses toward 1 column on narrow
 * viewports), or `minColWidth` (e.g. `"240px"`) for an auto-fill grid
 * that fits as many columns as space allows — the common case for
 * agent/job/feature card grids of unknown length.
 */
export function Grid({ as: Tag = 'div', columns = 3, minColWidth, gap = 'md', className = '', children, ...props }) {
  const style = minColWidth ? { gridTemplateColumns: `repeat(auto-fill, minmax(${minColWidth}, 1fr))` } : undefined

  const cls = [
    'ds-grid',
    !minColWidth ? `ds-grid-cols-${columns}` : '',
    `ds-grid-gap-${gap}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={cls} style={style} {...props}>
      {children}
    </Tag>
  )
}
