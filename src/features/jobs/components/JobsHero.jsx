import { HeroCard, Button, Skeleton } from '../../../ui/design-system'
import { formatTokenAmount } from '../../../lib/format'
import { IconJob, IconArrowRight } from '../../../ui/icons'
import { computeRunningJobs, computeJobsSummary } from '../jobsAnalytics'

/**
 * Jobs Hero — the one gradient/glow hero element on the page (same
 * ambient-radial treatment as Mission Control's hero, scoped under the
 * `.jv7-hero` class so it doesn't collide with `.dv7-hero`). Answers
 * "what's the state of my work right now" in one glance: Active, Pending,
 * Completed, Rejected, and Escrow Locked, all computed from the same
 * `jobStats`/`success` figures the Overview grid below already shows —
 * no separate on-chain read.
 */
export function JobsHero({ jobStats, success, loading, onCreateJob, onRefresh }) {
  const running = computeRunningJobs(jobStats)
  const summary = computeJobsSummary(jobStats)
  const skeleton = <Skeleton width={28} height={20} />

  return (
    <HeroCard
      className="jv7-hero"
      eyebrow="Jobs Platform"
      title="Jobs"
      description={summary}
      actions={
        <div className="jv7-hero-facts" role="list">
          <div className="jv7-hero-fact" role="listitem" aria-label={`Active jobs ${running}`}>
            <span className="jv7-hero-fact-label">Active</span>
            <span className="jv7-hero-fact-value">{loading ? skeleton : running}</span>
          </div>

          <div className="jv7-hero-fact" role="listitem" aria-label={`Pending jobs ${jobStats.open}`}>
            <span className="jv7-hero-fact-label">Pending</span>
            <span className="jv7-hero-fact-value">{loading ? skeleton : jobStats.open}</span>
          </div>

          <div className="jv7-hero-fact" role="listitem" aria-label={`Completed jobs ${jobStats.completed}`}>
            <span className="jv7-hero-fact-label">Completed</span>
            <span className="jv7-hero-fact-value">{loading ? skeleton : jobStats.completed}</span>
          </div>

          <div className="jv7-hero-fact" role="listitem" aria-label={`Rejected jobs ${success.rejected}`}>
            <span className="jv7-hero-fact-label">Rejected</span>
            <span className="jv7-hero-fact-value">{loading ? skeleton : success.rejected}</span>
          </div>

          <div className="jv7-hero-fact jv7-hero-fact-hero" role="listitem" aria-label="Escrow locked">
            <span className="jv7-hero-fact-label">Escrow Locked</span>
            <span className="jv7-hero-fact-value jv7-hero-gradient">
              {loading ? <Skeleton width={72} height={26} /> : `${formatTokenAmount(jobStats.totalEscrow, 2)} USDC`}
            </span>
          </div>
        </div>
      }
    >
      <div className="jv7-hero-actions">
        <Button variant="primary" iconRight={<IconArrowRight width={15} height={15} />} onClick={onCreateJob}>
          Create Job
        </Button>
        <Button variant="secondary" iconLeft={<IconJob width={15} height={15} />} onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </HeroCard>
  )
}
