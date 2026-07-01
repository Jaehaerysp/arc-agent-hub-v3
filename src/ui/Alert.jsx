export function Alert({ variant = 'error', title, children, action }) {
  const icon = variant === 'success' ? '✓' : variant === 'warning' ? '⚠' : '✕'
  return (
    <div className={`alert alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <span className="alert-icon">{icon}</span>
      <div className="alert-body">
        {title && <span className="alert-title">{title}</span>}
        <div>{children}</div>
        {action}
      </div>
    </div>
  )
}
