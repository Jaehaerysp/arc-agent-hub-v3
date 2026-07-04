/**
 * v7 Premium Design System — Toast.
 *
 * Standalone presentational toast, decoupled from any provider/context
 * so it can be rendered directly (e.g. in a Storybook-style preview, or
 * a future v7 toast viewport) without pulling in `useToast`. The
 * existing app-wide notifications continue to flow through
 * `src/hooks/useToast.jsx` + `src/ui/ToastViewport.jsx`, unchanged.
 */
export function Toast({ title, description, variant = 'default', onDismiss, className = '' }) {
  const cls = ['ds-toast', variant !== 'default' ? `ds-toast-${variant}` : '', className].filter(Boolean).join(' ')

  return (
    <div className={cls} role="status">
      <div className="ds-toast-body">
        {title && <div className="ds-toast-title">{title}</div>}
        {description && <div className="ds-toast-desc">{description}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="ds-toast-dismiss" aria-label="Dismiss notification" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  )
}
