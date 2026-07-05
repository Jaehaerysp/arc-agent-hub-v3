import { Chip, Select } from '../../../ui/design-system'
import { JOB_STATUS } from '../../../lib/blockchain/constants'

// 'all' + every on-chain status. The ticket's Sprint-3 list calls out
// All/Open/Funded/Submitted/Completed/Expired explicitly; Rejected is kept
// too since it's a real terminal status on-chain and hiding it would make
// rejected jobs disappear from search/history entirely.
const FILTERS = [{ id: 'all', label: 'All' }, ...JOB_STATUS.map((label, i) => ({ id: String(i), label }))]

const JOB_SORTS = [
  { id: 'created_desc', label: 'Newest' },
  { id: 'created_asc', label: 'Oldest' },
  { id: 'budget_desc', label: 'Highest budget' },
  { id: 'budget_asc', label: 'Lowest budget' },
]

/** Reusable status-filter chip row + sort dropdown, shared by JobsPage and JobHistoryPage. */
export function JobsFilters({ status, onStatusChange, sort, onSortChange }) {
  return (
    <div className="jv7-filters-row">
      <div className="jv7-filters-chip-row" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <Chip key={f.id} selected={status === f.id} onClick={() => onStatusChange(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {onSortChange && (
        <Select value={sort} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort jobs" className="jv7-sort-select">
          {JOB_SORTS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
        </Select>
      )}
    </div>
  )
}
