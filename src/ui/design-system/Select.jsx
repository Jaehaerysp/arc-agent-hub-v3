/**
 * v7 Premium Design System — Select.
 *
 * Wraps a native `<select>` (kept native for full keyboard/assistive-tech
 * support) with the shared premium chrome and a custom chevron glyph, per
 * the Blueprint's Forms table ("text + chevron trigger, no unnecessary
 * icons").
 */
export function Select({ error = false, className = '', children, ...props }) {
  return (
    <div className="ds-select-wrap">
      <select className={['ds-select', error ? 'is-error' : '', className].filter(Boolean).join(' ')} {...props}>
        {children}
      </select>
      <svg
        className="ds-select-chevron"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  )
}
