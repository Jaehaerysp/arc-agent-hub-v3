import { JOB_STATUS } from '../../lib/blockchain/constants'

/**
 * Jobs v7 (Mission 6) — pure, dependency-free selectors derived entirely
 * from data the Jobs pages already fetch: the `jobs` array from useJobs()
 * and the `activity` feed from useWallet(). Nothing here performs a new
 * RPC call or duplicates state — it mirrors the pattern already
 * established in features/dashboard/dashboardLogic.js.
 *
 * A deliberate constraint threads through this file: the on-chain Job
 * status enum is exactly ['Open', 'Funded', 'Submitted', 'Completed',
 * 'Rejected', 'Expired'] (see lib/blockchain/constants.js) — there is no
 * 'Draft', 'Accepted', 'Running', 'Review', or 'Cancelled' status in the
 * ERC-8183 contract. Every selector below works in terms of the real
 * six-state enum rather than inventing states that don't exist on-chain.
 */

/** Running work = escrow already funded or a deliverable already in review. */
export function computeRunningJobs(jobStats) {
  return jobStats.funded + jobStats.submitted
}

/**
 * Success rate across every job this account is party to (client or
 * provider) that reached a terminal state — Completed counts as success,
 * Rejected/Expired do not. Distinct from dashboardLogic's `computeTrust`
 * (provider-only) and `computeValidationRate` (client-only): this is the
 * whole-account figure the Jobs Overview strip needs.
 */
export function computeSuccessRate(jobs) {
  const completed = jobs.filter((j) => j.status === 3).length
  const rejected = jobs.filter((j) => j.status === 4).length
  const expired = jobs.filter((j) => j.status === 5).length
  const settled = completed + rejected + expired
  const rate = settled ? Math.round((completed / settled) * 100) : null
  return { rate, completed, rejected, expired, settled }
}

/** Job counts per on-chain status, in enum order — powers both the Kanban column headers and the "Jobs by status" bar chart. */
export function computeStatusBreakdown(jobs) {
  return JOB_STATUS.map((label, i) => ({
    key: label.toLowerCase(),
    status: i,
    label,
    value: jobs.filter((j) => j.status === i).length,
  }))
}

/**
 * USDC currently associated with jobs in each status bucket. Only
 * Funded/Submitted jobs hold *live* escrow, but showing every non-zero
 * bucket (including Open jobs with a budget already set, and the final
 * value of settled jobs) communicates where value sits across the whole
 * pipeline, not just what's currently locked.
 */
export function computeEscrowByStatus(jobs) {
  return JOB_STATUS.map((label, i) => ({
    key: label.toLowerCase(),
    label,
    value: jobs
      .filter((j) => j.status === i)
      .reduce((sum, j) => sum + Number(j.budgetFormatted || 0), 0),
  })).filter((bucket) => bucket.value > 0)
}

/**
 * Splits jobs into Kanban columns, one per on-chain status, in enum
 * order. Each job keeps its full record so the card can render budget,
 * counterpart address, and expiry.
 */
export function computeKanbanColumns(jobs) {
  return JOB_STATUS.map((label, i) => ({
    status: i,
    label,
    jobs: jobs.filter((j) => j.status === i),
  }))
}

const MONTH_LABEL_OPTIONS = { month: 'short' }

/**
 * Buckets job-related wallet activity by calendar month for the last
 * `months` months (default 6). Built from `wallet.activity`, the same
 * locally-persisted feed MissionTimeline/ActivityFeed already render —
 * job `createdAt` from the chain isn't reliable here (listJobsForAccount
 * intentionally leaves it null to avoid extra per-job RPC calls), so this
 * is the one source of real, timestamped job history already on hand.
 */
export function computeMonthlyActivity(activity, months = 6) {
  const now = new Date()
  const buckets = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString([], MONTH_LABEL_OPTIONS), value: 0 })
  }

  const indexByKey = new Map(buckets.map((b, i) => [b.key, i]))

  activity
    .filter((a) => a.type === 'job')
    .forEach((a) => {
      const d = new Date(a.timestamp)
      if (Number.isNaN(d.getTime())) return
      const idx = indexByKey.get(`${d.getFullYear()}-${d.getMonth()}`)
      if (idx !== undefined) buckets[idx].value += 1
    })

  return buckets
}

const CREATED_RE = /^Job #(\S+) created$/
const COMPLETED_RE = /^Job #(\S+) completed$/

/**
 * Average time from a job's "created" activity entry to its "completed"
 * activity entry, for jobs where both were logged locally. This is an
 * honest, derived figure — not a fabricated on-chain duration — and is
 * necessarily scoped to jobs created and completed from *this* browser's
 * activity log, same as every other wallet.activity-driven number in the
 * app (see useWallet's addActivity/useLocalStorage).
 */
export function computeAverageCompletionTime(activity) {
  const created = new Map()
  const completed = new Map()

  activity.forEach((a) => {
    const createdMatch = CREATED_RE.exec(a.label || '')
    if (createdMatch) created.set(createdMatch[1], new Date(a.timestamp).getTime())

    const completedMatch = COMPLETED_RE.exec(a.label || '')
    if (completedMatch) completed.set(completedMatch[1], new Date(a.timestamp).getTime())
  })

  const durationsMs = []
  completed.forEach((completedAt, jobId) => {
    const createdAt = created.get(jobId)
    if (createdAt && completedAt > createdAt) durationsMs.push(completedAt - createdAt)
  })

  if (durationsMs.length === 0) return { averageMs: null, sampleSize: 0 }

  const averageMs = durationsMs.reduce((sum, ms) => sum + ms, 0) / durationsMs.length
  return { averageMs, sampleSize: durationsMs.length }
}

/** Formats a millisecond duration as a compact, human-scaled string ("42m", "3.2h", "1.4d"). */
export function formatDuration(ms) {
  if (ms === null || ms === undefined || Number.isNaN(ms)) return '—'

  const minutes = Math.round(ms / 60000)
  if (minutes < 60) return `${minutes}m`

  const hours = minutes / 60
  if (hours < 24) return `${hours.toFixed(1)}h`

  const days = hours / 24
  return `${days.toFixed(1)}d`
}

/** The single sentence under the Jobs Hero title. */
export function computeJobsSummary(jobStats) {
  const running = computeRunningJobs(jobStats)
  if (jobStats.total === 0) return 'No jobs yet — post one to get started.'
  const runningClause = running === 0 ? 'nothing in progress right now' : `${running} job${running === 1 ? '' : 's'} in progress`
  return `${jobStats.total} job${jobStats.total === 1 ? '' : 's'} total, ${runningClause}.`
}
