/**
 * Shared section header: eyebrow label + title + optional description.
 * Promoted out of the landing page so Dashboard v7 and Marketplace v7
 * section headers (e.g. a panel group intro) can use the same eyebrow/title
 * rhythm instead of each page hand-rolling its own heading markup.
 */
export function SectionHeading({ eyebrow, title, desc, align = 'center', className = '' }) {
  return (
    <div className={['section-heading', `align-${align}`, className].filter(Boolean).join(' ')}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  )
}
