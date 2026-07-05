import { useMemo, useState } from 'react'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useJobs } from '../../hooks/useJobs'
import { Panel, Button, EmptyState, Skeleton } from '../../ui/design-system'
import { Alert } from '../../ui/Alert'
import { IconJob } from '../../ui/icons'
import { JobsTable } from './components/JobsTable'
import { JobsSearch } from './components/JobsSearch'
import { JobsFilters } from './components/JobsFilters'

const PAGE_SIZE = 10

export default function JobHistoryPage() {
  const { account, provider, arcExplorer } = useWalletContext()
  const { jobs, loading, error, refresh } = useJobs(provider, account)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('created_desc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    let result = jobs.filter((job) => {
      if (statusFilter !== 'all' && String(job.status) !== statusFilter) return false
      if (!q) return true
      return (
        job.id.includes(q) ||
        job.client.toLowerCase().includes(q) ||
        job.provider.toLowerCase().includes(q) ||
        job.description?.toLowerCase().includes(q)
      )
    })

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'created_asc': return (a.createdAt || 0) - (b.createdAt || 0)
        case 'budget_desc': return Number(b.budgetFormatted) - Number(a.budgetFormatted)
        case 'budget_asc': return Number(a.budgetFormatted) - Number(b.budgetFormatted)
        default: return (b.createdAt || 0) - (a.createdAt || 0)
      }
    })

    return result
  }, [jobs, search, statusFilter, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateAndResetPage = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  return (
    <Panel
      icon={<IconJob width={18} height={18} />}
      title="Job history"
      subtitle="All jobs where you're the client or provider"
      actions={<Button variant="ghost" size="sm" onClick={refresh}>Refresh</Button>}
      className="jv7-history-panel"
    >
      <div className="jv7-history-search-row">
        <JobsSearch value={search} onChange={updateAndResetPage(setSearch)} />
      </div>

      <JobsFilters
        status={statusFilter}
        onStatusChange={updateAndResetPage(setStatusFilter)}
        sort={sort}
        onSortChange={setSort}
      />

      {error && <Alert variant="error" title="Failed to load jobs">{error}</Alert>}

      {!error && loading && jobs.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Skeleton height={36} />
          <Skeleton height={36} />
          <Skeleton height={36} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconJob width={22} height={22} />}
          title="No jobs found"
          description={jobs.length === 0 ? "Jobs where you're the client or provider will appear here." : 'Try a different search or filter.'}
        />
      ) : (
        <>
          <JobsTable jobs={pageItems} account={account} arcExplorer={arcExplorer} />

          {totalPages > 1 && (
            <div className="jobs-pagination">
              <Button variant="ghost" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="field-hint">Page {currentPage} of {totalPages}</span>
              <Button variant="ghost" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </Panel>
  )
}
