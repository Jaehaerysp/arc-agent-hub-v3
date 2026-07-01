import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

export function CopyButton({ value, label = 'Copy' }) {
  const [copied, copy] = useCopyToClipboard()
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() => copy(value)}
      aria-label={`Copy ${label}`}
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}
