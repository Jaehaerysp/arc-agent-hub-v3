/**
 * v7 Premium Design System — single import surface.
 *
 * Dashboard v7, Marketplace v7, Jobs v7, Validation v7, and Wallet v7
 * should import their shared UI primitives from here:
 *
 *   import { Button, Panel, MetricCard, Grid } from '../../ui/design-system'
 *
 * This package is purely additive — it does not replace or alter
 * anything under `src/ui/*.jsx` (Button, Card, Badge, etc.), which the
 * existing Landing page and any current pages keep using unmodified.
 * See `docs/UI_BLUEPRINT.md` Part B for the design language this
 * package implements, and `src/styles/design-system.css` for the
 * backing styles (all `ds-*`-prefixed, zero collisions with existing
 * class names).
 */

export { Button } from './Button'
export { IconButton } from './IconButton'
export { Badge } from './Badge'
export { Chip } from './Chip'
export { FieldGroup, Input, Textarea } from './Input'
export { SearchInput } from './SearchInput'
export { Select } from './Select'
export { Tabs, TabPanel } from './Tabs'
export { Divider } from './Divider'
export { GlassCard } from './GlassCard'
export { MetricCard } from './MetricCard'
export { Panel } from './Panel'
export { HeroCard } from './HeroCard'
export { FeatureCard } from './FeatureCard'
export { Toast } from './Toast'
export { Skeleton } from './Skeleton'
export { EmptyState } from './EmptyState'
export { Container } from './Container'
export { Section } from './Section'
export { Grid } from './Grid'
export * as motion from './motion'
