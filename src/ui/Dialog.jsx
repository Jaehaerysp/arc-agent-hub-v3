export function Dialog({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
        {children}
        {footer && <div style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  )
}
