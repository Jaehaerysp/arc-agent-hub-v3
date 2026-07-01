export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', size === 'lg' ? 'btn-lg' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
