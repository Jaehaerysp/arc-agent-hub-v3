/**
 * v7 Premium Design System — Container.
 *
 * Max-width, horizontally-centered page wrapper with responsive
 * side padding. `size="narrow"` is for reading-width content (e.g. a
 * single settings form); `size="wide"` removes the max-width cap for
 * full-bleed dashboard grids.
 */
export function Container({ as: Tag = 'div', size = 'default', className = '', children, ...props }) {
  const cls = [
    'ds-container',
    size === 'narrow' ? 'ds-container-narrow' : '',
    size === 'wide' ? 'ds-container-wide' : '',
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
