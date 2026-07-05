import { Badge } from '../../../ui/design-system'

// Mirrors JOB_STATUS order from lib/blockchain/constants.js exactly —
// ['Open', 'Funded', 'Submitted', 'Completed', 'Rejected', 'Expired'].
// These map onto Badge's existing status-specific variants (design-system.css)
// rather than the generic tone variants, so every job status gets its own
// unambiguous color without inventing new CSS.
const VARIANT_BY_STATUS = ['pending', 'confirmed', 'submitted', 'completed', 'rejected', 'expired']

export function JobStatusBadge({ status, label, size }) {
  const variant = VARIANT_BY_STATUS[Number(status)] ?? 'muted'
  return (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  )
}
