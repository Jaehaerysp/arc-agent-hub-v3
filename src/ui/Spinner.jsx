export function Spinner({ className = '' }) {
  return <span className={['spinner', className].filter(Boolean).join(' ')} aria-hidden="true" />
}
