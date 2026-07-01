export function Skeleton({ width = '100%', height = 16, className = '', style = {} }) {
  return (
    <div
      className={['skeleton', className].filter(Boolean).join(' ')}
      style={{ width, height, ...style }}
    />
  )
}
