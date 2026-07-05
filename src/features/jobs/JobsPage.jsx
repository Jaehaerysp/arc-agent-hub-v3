import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useJobs } from '../../hooks/useJobs'
import { Container, Section, Panel, Button, Skeleton, EmptyState } from '../../ui/design-system'
import { Alert } from '../../ui/Alert'
import { IconJob } from '../../ui/icons'
import { JobsTable } from './components/JobsTable'
import { JobStats, computeJobStats } from './components/JobStats'
import { JobsHero } from './components/JobsHero'
import { JobsPipeline } from './components/JobsPipeline'
import { JobsActivityTimeline } from './components/JobsActivityTimeline'
import { JobsAnalyticsPanel } from './components/JobsAnalyticsPanel'
import { JobsQuickActions } from './components/JobsQuickActions'
import {
  computeSuccessRate,
  computeStatusBreakdown,
  computeEscrowByStatus,
  computeKanbanColumns,
  computeMonthlyActivity,
  computeAverageCompletionTime,
} from './jobsAnalytics'

/**
 * Jobs v7 (Mission 6) — "AI Work Management Platform." Layout order: Hero
 * -> Overview -> Pipeline -> Active Jobs -> Job Timeline -> Analytics ->
 * Quick Actions, per the Mission 6 brief. Every number on this page still
 * traces back to the same two data sources the previous Jobs dashboard
 * used — wallet context and useJobs — no new on-chain reads were added.
 * All derived figures are memoized since jobs/activity only change on a
 * refresh or a new wallet action, not on every render.
 */
export default function JobsPage() {
  const { account, provider, arcExplorer, activity } = useWalletContext()
  const { jobs, loading, error, refresh } = useJobs(provider, account)
  const navigate = useNavigate()

  const recentJobs = jobs.slice(0, 8)
  const jobActivity = useMemo(() => activity.filter((a) => a.type === 'job'), [activity])

  const jobStats = useMemo(() => computeJobStats(jobs), [jobs])
  const success = useMemo(() => computeSuccessRate(jobs), [jobs])
  const statusBreakdown = useMemo(() => computeStatusBreakdown(jobs), [jobs])
  const escrowByStatus = useMemo(() => computeEscrowByStatus(jobs), [jobs])
  const kanbanColumns = useMemo(() => computeKanbanColumns(jobs), [jobs])
  const monthlyActivity = useMemo(() => computeMonthlyActivity(jobActivity), [jobActivity])
  const avgCompletion = useMemo(() => computeAverageCompletionTime(jobActivity), [jobActivity])

  return (
    <Container size="wide" className="jv7-jobs-page">
      <Section spacing="md">
        <JobsHero
          jobStats={jobStats}
          success={success}
          loading={loading && jobs.length === 0}
          onCreateJob={() => navigate('/jobs/create')}
          onRefresh={refresh}
        />
      </Section>

      <Section spacing="md">
        <JobStats jobs={jobs} loading={loading} activity={jobActivity} />
      </Section>

      <Section spacing="md">
        <JobsPipeline columns={kanbanColumns} account={account} />
      </Section>

      <Section spacing="md">
        <Panel
          title="Active Jobs"
          subtitle="Your most recent jobs, client or provider"
          actions={!loading && <Button variant="ghost" size="sm" onClick={refresh}>Refresh</Button>}
          className="jv7-active-jobs-panel"
        >
          {error && <Alert variant="error" title="Failed to load jobs">{error}</Alert>}

          {!error && loading && jobs.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton height={36} />
              <Skeleton height={36} />
              <Skeleton height={36} />
            </div>
          ) : recentJobs.length === 0 ? (
            <EmptyState
              icon={<IconJob width={22} height={22} />}
              title="No jobs yet"
              description="Jobs where you're the client or provider will appear here."
              action={<Button variant="primary" onClick={() => navigate('/jobs/create')}>Create your first job</Button>}
            />
          ) : (
            <JobsTable jobs={recentJobs} account={account} arcExplorer={arcExplorer} />
          )}
        </Panel>
      </Section>

      <Section spacing="md">
        <JobsActivityTimeline activity={jobActivity} arcExplorer={arcExplorer} limit={8} />
      </Section>

      <Section spacing="md">
        <JobsAnalyticsPanel
          statusBreakdown={statusBreakdown}
          success={success}
          monthlyActivity={monthlyActivity}
          escrowByStatus={escrowByStatus}
          avgCompletion={avgCompletion}
        />
      </Section>

      <Section spacing="md">
        <JobsQuickActions />
      </Section>
    </Container>
  )
}
