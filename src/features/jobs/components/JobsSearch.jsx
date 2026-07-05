import { SearchInput } from '../../../ui/design-system'

/**
 * Reusable search box for the Jobs dashboard and Job history table.
 * Purely controlled — matching is left to the caller (JobHistoryPage /
 * JobsPage both filter client-side over the jobs useJobs() already loaded).
 */
export function JobsSearch({ value, onChange, placeholder = 'Search by job ID, client, or provider address…' }) {
  return (
    <SearchInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClear={() => onChange('')}
      placeholder={placeholder}
      className="jv7-search"
    />
  )
}
