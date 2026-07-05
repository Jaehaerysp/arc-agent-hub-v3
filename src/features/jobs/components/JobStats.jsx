import { Grid, MetricCard, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { formatTokenAmount } from '../../../lib/format'
import { IconJob, IconCheck, IconClock, IconStar, IconWallet, IconActivity } from '../../../ui/icons'
import { computeRunningJobs, computeSuccessRate, computeAverageCompletionTime, formatDuration } from '../jobsAnalytics'

/**
 * Derives the Sprint-3 dashboard numbers (Total / Open / Funded / Submitted /
 * Completed / Total Escrow / Average Budget) from a jobs array. Pure and
 * read-only — every value comes from the job objects useJobs() already
 * returns, so this never re-touches the chain.
 *
 * Unchanged since Sprint 3 — DashboardPage and JobStats.test.js both
 * depend on this exact shape.
 */
export function computeJobStats(jobs) {
  const total = jobs.length
  const open = jobs.filter((j) => j.status === 0).length
  const funded = jobs.filter((j) => j.status === 1).length
  const submitted = jobs.filter((j) => j.status === 2).length
  const completed = jobs.filter((j) => j.status === 3).length

  const totalEscrow = jobs
    .filter((j) => j.status === 1 || j.status === 2)
    .reduce((sum, j) => sum + Number(j.budgetFormatted), 0)

  const budgetsSet = jobs.filter((j) => Number(j.budgetFormatted) > 0)
  const averageBudget = budgetsSet.length
    ? budgetsSet.reduce((sum, j) => sum + Number(j.budgetFormatted), 0) / budgetsSet.length
    : 0

  return { total, open, funded, submitted, completed, totalEscrow, averageBudget }
}

/**
 * Jobs v7 (Mission 6) — "Jobs Overview" metric grid. Six premium tiles:
 * Open, Running, Completed, Escrow Locked, Average Duration, Success Rate.
 * Only Success Rate carries the gradient `accent` treatment (the Jobs Hero
 * above already used the gradient once, so exactly one tile uses it here,
 * per the Blueprint's "gradient in at most three places" rule).
 */
export function JobStats({ jobs, loading, activity = [] }) {
  const isEmpty = loading && jobs.length === 0
  const stats = computeJobStats(jobs)
  const running = computeRunningJobs(stats)
  const success = computeSuccessRate(jobs)
  const avgCompletion = computeAverageCompletionTime(activity)
  const skeleton = <Skeleton width={48} height={28} />

  return (
    <Grid columns={3} minColWidth="200px" gap="md" aria-label="Jobs overview">
      <MetricCard
        icon={<IconJob width={16} height={16} />}
        label="Open Jobs"
        value={isEmpty ? skeleton : <AnimatedCounter value={stats.open} duration={900} />}
        sub="Awaiting budget or funding"
      />

      <MetricCard
        icon={<IconActivity width={16} height={16} />}
        label="Running Jobs"
        value={isEmpty ? skeleton : <AnimatedCounter value={running} duration={1000} />}
        sub="Funded + submitted"
      />

      <MetricCard
        icon={<IconCheck width={16} height={16} />}
        label="Completed"
        value={isEmpty ? skeleton : <AnimatedCounter value={stats.completed} duration={1100} />}
        sub="Fully settled on-chain"
      />

      <MetricCard
        icon={<IconWallet width={16} height={16} />}
        label="Escrow Locked"
        value={isEmpty ? skeleton : `${formatTokenAmount(stats.totalEscrow, 2)} USDC`}
        sub="Funded + submitted jobs"
      />

      <MetricCard
        icon={<IconClock width={16} height={16} />}
        label="Average Duration"
        value={isEmpty ? skeleton : formatDuration(avgCompletion.averageMs)}
        sub={avgCompletion.sampleSize > 0 ? `Across ${avgCompletion.sampleSize} completed job${avgCompletion.sampleSize === 1 ? '' : 's'}` : 'Not enough data yet'}
      />

      <MetricCard
        icon={<IconStar width={16} height={16} />}
        label="Success Rate"
        accent
        value={isEmpty ? skeleton : success.rate === null ? '—' : <AnimatedCounter value={success.rate} suffix="%" duration={1200} />}
        sub={success.rate === null ? 'No settled jobs yet' : `${success.completed} completed · ${success.rejected + success.expired} unsuccessful`}
      />
    </Grid>
  )
}
