/**
 * v7 Premium Design System — Skeleton.
 *
 * Shape-preserving loading placeholder per the Blueprint's Motion System
 * ("Loading: shape-preserving skeleton, shimmer 1.6s loop"). `variant`
 * picks the shape: `rect` (default — cards, images), `text` (a single
 * line matching body-text height/radius), or `circle` (avatars, agent
 * marks).
 */
export function Skeleton({ variant = 'rect', width = '100%', height = 16, circleSize, className = '', style = {} }) {
  const cls = ['ds-skeleton', `ds-skeleton-${variant}`, className].filter(Boolean).join(' ')

  const dimStyle =
    variant === 'circle'
      ? { width: circleSize || height, height: circleSize || height }
      : { width, height }

  return <div className={cls} style={{ ...dimStyle, ...style }} aria-hidden="true" />
}
