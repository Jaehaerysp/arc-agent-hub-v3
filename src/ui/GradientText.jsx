/**
 * Wraps text in the brand gradient (violet → indigo → neon cyan). Shared
 * primitive so hero/CTA copy across Marketing, Dashboard v7, and
 * Marketplace v7 all reference one implementation instead of scattering
 * `className="text-gradient"` spans with slightly different fallbacks.
 */
export function GradientText({ as: Tag = 'span', className = '', children, ...props }) {
  return (
    <Tag className={['text-gradient', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Tag>
  )
}
