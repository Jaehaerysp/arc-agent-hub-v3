export function shortAddr(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function shortHash(hash) {
  if (!hash) return ''
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`
}

export function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTokenAmount(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}
