export function Card({ interactive = false, className = '', children, ...props }) {
  const cls = ['card', interactive ? 'interactive' : '', className].filter(Boolean).join(' ')
  return (
    <div className={cls} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className = '', children, ...props }) {
  return (
    <div className={['card-pad', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}

export function PanelHeader({ icon, title, subtitle }) {
  return (
    <div className="panel-header">
      {icon && <div className="panel-icon-wrap">{icon}</div>}
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="rep-panel-subtitle" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{subtitle}</p>}
      </div>
    </div>
  )
}
