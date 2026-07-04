import { GlassCard } from './GlassCard'

/**
 * v7 Premium Design System — HeroCard.
 *
 * The "Hero" card type from the Blueprint's Cards table: larger, can
 * contain rich content, used once per page maximum (e.g. Mission
 * Control's MissionHero, a reputation trend chart on Agent Profile).
 * Always carries the ambient glow so it reads as the page's one hero
 * element, per the Blueprint's "one hero element" checklist rule.
 */
export function HeroCard({ eyebrow, title, description, actions, media, className = '', children }) {
  return (
    <GlassCard as="section" className={['ds-hero-card', className].filter(Boolean).join(' ')} padding="lg" glow>
      <div className="ds-hero-card-body">
        {eyebrow && <span className="ds-hero-eyebrow">{eyebrow}</span>}
        {title && <h2 className="ds-hero-title">{title}</h2>}
        {description && <p className="ds-hero-desc">{description}</p>}
        {actions && <div className="ds-hero-actions">{actions}</div>}
        {children}
      </div>
      {media && <div className="ds-hero-media">{media}</div>}
    </GlassCard>
  )
}
