export function Badge({ variant = 'muted', children, className = '' }) {
  return (
    <span className={['badge', `badge-${variant}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
