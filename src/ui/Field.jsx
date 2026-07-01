export function FieldGroup({ label, hint, badge, children }) {
  return (
    <div className="field-group">
      {label && (
        <label>
          {label}
          {badge}
        </label>
      )}
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  )
}

export function Input(props) {
  return <input className="input" {...props} />
}

export function Textarea(props) {
  return <textarea className="textarea" {...props} />
}

export function Select({ children, ...props }) {
  return (
    <select className="select" {...props}>
      {children}
    </select>
  )
}

export function PrefixInput({ prefix, ...props }) {
  return (
    <div className="input-prefix-wrap">
      <span className="input-prefix">{prefix}</span>
      <input className="input" {...props} />
    </div>
  )
}
