import { Grid, MetricCard, Skeleton } from '../../../ui/design-system'
import { formatTokenAmount } from '../../../lib/format'
import { IconWallet, IconActivity, IconLink, IconShield } from '../../../ui/icons'

/**
 * Four glanceable metric tiles beneath the Portfolio Hero: ANV Balance,
 * Native (USDC) Balance, Transactions Logged, and Network Health. Every
 * figure is either a balance already read by `useBalances` or a count
 * derived from `wallet.activity` — no new reads.
 */
export function PortfolioSummary({ anvBalance, nativeBalance, balancesLoading, txCount, isArcNetwork }) {
  const skeleton = <Skeleton width={64} height={26} />

  return (
    <Grid columns={4} minColWidth="200px" gap="md" className="wv7-summary" aria-label="Portfolio summary">
      <MetricCard
        icon={<IconWallet width={16} height={16} />}
        label="ANV Balance"
        accent
        value={balancesLoading && anvBalance === null ? skeleton : formatTokenAmount(anvBalance, 4)}
        sub="ERC-20 · ANV Token"
      />

      <MetricCard
        icon={<IconLink width={16} height={16} />}
        label="Native Balance"
        value={balancesLoading && nativeBalance === null ? skeleton : formatTokenAmount(nativeBalance, 4)}
        sub="USDC · gas token"
      />

      <MetricCard
        icon={<IconActivity width={16} height={16} />}
        label="Transactions Logged"
        value={txCount}
        sub="Locally tracked activity"
      />

      <MetricCard
        icon={<IconShield width={16} height={16} />}
        label="Network Health"
        value={isArcNetwork ? 'Healthy' : 'Attention'}
        sub={isArcNetwork ? 'Arc Testnet connected' : 'Wrong network'}
      />
    </Grid>
  )
}
