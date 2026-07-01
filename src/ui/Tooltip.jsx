export function Tooltip({ label, children }) {
  return (
    <span className="tooltip-wrap" tabIndex={0}>
      {children}
      <span className="tooltip-bubble" role="tooltip">{label}</span>
    </span>
  )
}
