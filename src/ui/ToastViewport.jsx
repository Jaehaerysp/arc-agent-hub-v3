import { useToast } from '../hooks/useToast'

export function ToastViewport() {
  const { toasts, dismiss } = useToast()
  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.variant === 'success' ? 'toast-success' : t.variant === 'error' ? 'toast-error' : ''}`}
          onClick={() => dismiss(t.id)}
          role="status"
        >
          {t.title && <div className="toast-title">{t.title}</div>}
          {t.description && <div className="toast-desc">{t.description}</div>}
        </div>
      ))}
    </div>
  )
}
