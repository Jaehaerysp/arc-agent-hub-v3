import { describe, it, expect } from 'vitest'
import { computeJobStats } from './components/JobStats'
import {
  computeRunningJobs,
  computeSuccessRate,
  computeStatusBreakdown,
  computeEscrowByStatus,
  computeKanbanColumns,
  computeMonthlyActivity,
  computeAverageCompletionTime,
  formatDuration,
  computeJobsSummary,
} from './jobsAnalytics'

const OPEN = 0
const FUNDED = 1
const SUBMITTED = 2
const COMPLETED = 3
const REJECTED = 4
const EXPIRED = 5

function job(overrides = {}) {
  return { id: '1', status: OPEN, budgetFormatted: '0', ...overrides }
}

describe('computeRunningJobs', () => {
  it('sums funded and submitted counts', () => {
    const jobs = [job({ status: FUNDED }), job({ status: FUNDED }), job({ status: SUBMITTED }), job({ status: OPEN })]
    expect(computeRunningJobs(computeJobStats(jobs))).toBe(3)
  })
})

describe('computeSuccessRate', () => {
  it('returns null rate when nothing has settled', () => {
    const jobs = [job({ status: OPEN }), job({ status: FUNDED })]
    expect(computeSuccessRate(jobs)).toEqual({ rate: null, completed: 0, rejected: 0, expired: 0, settled: 0 })
  })

  it('computes percent completed among settled jobs', () => {
    const jobs = [job({ status: COMPLETED }), job({ status: COMPLETED }), job({ status: REJECTED }), job({ status: EXPIRED })]
    const result = computeSuccessRate(jobs)
    expect(result.settled).toBe(4)
    expect(result.rate).toBe(50)
  })
})

describe('computeStatusBreakdown', () => {
  it('returns one bucket per on-chain status, in enum order', () => {
    const jobs = [job({ status: OPEN }), job({ status: OPEN }), job({ status: COMPLETED })]
    const breakdown = computeStatusBreakdown(jobs)
    expect(breakdown.map((b) => b.label)).toEqual(['Open', 'Funded', 'Submitted', 'Completed', 'Rejected', 'Expired'])
    expect(breakdown[0].value).toBe(2)
    expect(breakdown[3].value).toBe(1)
    expect(breakdown[1].value).toBe(0)
  })
})

describe('computeEscrowByStatus', () => {
  it('excludes zero-value buckets', () => {
    const jobs = [job({ status: FUNDED, budgetFormatted: '100' }), job({ status: OPEN, budgetFormatted: '0' })]
    const buckets = computeEscrowByStatus(jobs)
    expect(buckets).toEqual([{ key: 'funded', label: 'Funded', value: 100 }])
  })

  it('sums multiple jobs in the same bucket', () => {
    const jobs = [job({ status: SUBMITTED, budgetFormatted: '10' }), job({ status: SUBMITTED, budgetFormatted: '15' })]
    expect(computeEscrowByStatus(jobs)).toEqual([{ key: 'submitted', label: 'Submitted', value: 25 }])
  })
})

describe('computeKanbanColumns', () => {
  it('assigns every job to exactly one column, in enum order', () => {
    const jobs = [job({ id: '1', status: OPEN }), job({ id: '2', status: COMPLETED })]
    const columns = computeKanbanColumns(jobs)
    expect(columns).toHaveLength(6)
    expect(columns[0].label).toBe('Open')
    expect(columns[0].jobs.map((j) => j.id)).toEqual(['1'])
    expect(columns[3].jobs.map((j) => j.id)).toEqual(['2'])
    expect(columns[1].jobs).toEqual([])
  })
})

describe('computeMonthlyActivity', () => {
  it('buckets job activity into the requested number of trailing months', () => {
    const now = new Date()
    const activity = [{ type: 'job', timestamp: now.toISOString() }]
    const buckets = computeMonthlyActivity(activity, 3)
    expect(buckets).toHaveLength(3)
    expect(buckets[2].value).toBe(1)
    expect(buckets[0].value).toBe(0)
  })

  it('ignores non-job activity entries', () => {
    const now = new Date()
    const activity = [{ type: 'agent', timestamp: now.toISOString() }]
    const buckets = computeMonthlyActivity(activity, 3)
    expect(buckets.every((b) => b.value === 0)).toBe(true)
  })
})

describe('computeAverageCompletionTime', () => {
  it('returns null when no job has both a created and completed entry', () => {
    const activity = [{ label: 'Job #1 created', timestamp: '2026-01-01T00:00:00.000Z' }]
    expect(computeAverageCompletionTime(activity)).toEqual({ averageMs: null, sampleSize: 0 })
  })

  it('averages elapsed time across jobs with matching created/completed entries', () => {
    const activity = [
      { label: 'Job #1 created', timestamp: '2026-01-01T00:00:00.000Z' },
      { label: 'Job #1 completed', timestamp: '2026-01-01T01:00:00.000Z' },
      { label: 'Job #2 created', timestamp: '2026-01-02T00:00:00.000Z' },
      { label: 'Job #2 completed', timestamp: '2026-01-02T03:00:00.000Z' },
    ]
    const result = computeAverageCompletionTime(activity)
    expect(result.sampleSize).toBe(2)
    expect(result.averageMs).toBe(2 * 60 * 60 * 1000)
  })
})

describe('formatDuration', () => {
  it('formats minutes under an hour', () => {
    expect(formatDuration(42 * 60 * 1000)).toBe('42m')
  })
  it('formats hours under a day', () => {
    expect(formatDuration(3.2 * 60 * 60 * 1000)).toBe('3.2h')
  })
  it('formats days', () => {
    expect(formatDuration(1.4 * 24 * 60 * 60 * 1000)).toBe('1.4d')
  })
  it('returns an em dash for missing data', () => {
    expect(formatDuration(null)).toBe('—')
  })
})

describe('computeJobsSummary', () => {
  it('handles the empty-account case', () => {
    expect(computeJobsSummary(computeJobStats([]))).toBe('No jobs yet — post one to get started.')
  })

  it('mentions total and running counts', () => {
    const jobs = [job({ status: FUNDED }), job({ status: COMPLETED })]
    expect(computeJobsSummary(computeJobStats(jobs))).toBe('2 jobs total, 1 job in progress.')
  })
})
