/**
 * v7 Premium Design System — GlassCard.
 *
 * The base elevated glass surface every other card component
 * (MetricCard, Panel, HeroCard, FeatureCard) is built on, per the
 * Blueprint's Cards rule: "all cards share the same elevation and radius
 * language; they differ in content density and typographic emphasis,
 * not in structural shape."
 */
export function GlassCard({
  as: Tag = 'div',
  padding = 'md',
  interactive = false,
  glow = false,
  strong = false,
  className = '',
  children,
  ...props
}) {
  const cls = [
    'ds-glass-card',
    `ds-glass-card-pad-${padding}`,
    interactive ? 'is-interactive' : '',
    glow ? 'has-glow' : '',
    strong ? 'is-strong' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  )
}
