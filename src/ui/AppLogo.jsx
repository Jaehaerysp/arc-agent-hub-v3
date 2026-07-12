import { useTheme } from '../app/providers/ThemeProvider'
import symbolDarkInk from '../assets/brand/symbol-dark-ink.svg'
import symbolLightInk from '../assets/brand/symbol-light-ink.svg'
import horizontalCompactDarkText from '../assets/brand/horizontal-compact-dark-text.svg'
import horizontalCompactLightText from '../assets/brand/horizontal-compact-light-text.svg'

/**
 * Shared application logo mark. Single source of truth for the Arc Agent
 * Hub brand image — used across the landing nav, footer, sidebar,
 * loading/splash screens, and empty states so the mark never drifts out
 * of sync between surfaces.
 *
 * Automatically swaps ink color to match the active theme (dark theme →
 * light-ink asset for contrast on dark surfaces, light theme → dark-ink
 * asset for contrast on light surfaces), integrating with the existing
 * ThemeProvider rather than adding a separate light/dark toggle.
 *
 * variant="symbol" (default) renders the square mark alone, sized to a
 * `size` × `size` box — used anywhere the mark sits beside separate brand
 * text (sidebar, footer).
 * variant="horizontal" renders a compact icon+wordmark+tagline lockup
 * sized to a fixed height with width following its native aspect ratio.
 * The tagline uses a bold, saturated accent color (rather than the muted
 * gray of the large-format lockup) so it stays clearly readable at small
 * navbar heights instead of washing out.
 */
export function AppLogo({ size = 34, variant = 'symbol', className = '', ...rest }) {
  const { theme } = useTheme()

  if (variant === 'horizontal') {
    const src = theme === 'light' ? horizontalCompactDarkText : horizontalCompactLightText
    return (
      <img
        src={src}
        alt="Arc Agent Hub"
        height={size}
        className={`app-logo app-logo-horizontal ${className}`.trim()}
        style={{ height: size, width: 'auto' }}
        {...rest}
      />
    )
  }

  const src = theme === 'light' ? symbolDarkInk : symbolLightInk
  return (
    <img
      src={src}
      alt="Arc Agent Hub"
      width={size}
      height={size}
      className={`app-logo ${className}`.trim()}
      {...rest}
    />
  )
}
