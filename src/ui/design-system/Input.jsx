/**
 * v7 Premium Design System — form field primitives.
 *
 * `FieldGroup` provides the shared label/hint/error wrapper described in
 * the Blueprint's Forms table; `Input` and `Textarea` are the bare
 * controls, usable standalone or nested inside a `FieldGroup`.
 */
export function FieldGroup({ label, hint, error, required = false, children, className = '' }) {
  return (
    <div className={['ds-field-group', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="ds-field-label">
          {label}
          {required && (
            <span className="ds-field-required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <span className="ds-field-hint is-error" role="alert">
          {error}
        </span>
      ) : (
        hint && <span className="ds-field-hint">{hint}</span>
      )}
    </div>
  )
}

export function Input({ error = false, className = '', ...props }) {
  return <input className={['ds-input', error ? 'is-error' : '', className].filter(Boolean).join(' ')} {...props} />
}

export function Textarea({ error = false, className = '', ...props }) {
  return (
    <textarea
      className={['ds-textarea', error ? 'is-error' : '', className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}
