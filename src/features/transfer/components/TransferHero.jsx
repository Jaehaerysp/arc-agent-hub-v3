import { HeroCard, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { NETWORK_LABEL } from '../../wallet/walletAnalytics'

/**
 * Transfer Hero — same HeroCard language as every other v7 module.
 * Shows the one figure that matters before sending: available ANV
 * balance. Balance itself still comes from `useBalances`, unchanged.
 */
export function TransferHero({ anvBalance, loading }) {
  return (
    <HeroCard
      className="wv7-hero wv7-transfer-hero"
      eyebrow="Transfer"
      title="Send ANV"
      description={`Move ANV tokens to any address on ${NETWORK_LABEL}`}
      actions={
        <div className="wv7-hero-facts" role="list">
          <div className="wv7-hero-fact wv7-hero-fact-hero" role="listitem" aria-label="Available ANV balance">
            <span className="wv7-hero-fact-label">Available Balance</span>
            <span className="wv7-hero-fact-value wv7-hero-gradient">
              {loading && anvBalance === null ? (
                <Skeleton width={90} height={26} />
              ) : (
                <AnimatedCounter value={Number(anvBalance) || 0} decimals={2} duration={1000} suffix=" ANV" />
              )}
            </span>
          </div>
        </div>
      }
    />
  )
}
