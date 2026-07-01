import { Card } from './Card'

export function StatCard({ label, value, accent = false, sub, icon }) {
  return (
    <Card className="stat-card">
      <div className="stat-label">
        <span>{label}</span>
        {icon}
      </div>
      <div className={`stat-value ${accent ? 'accent' : ''}`}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </Card>
  )
}
