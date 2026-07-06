import { useMemo } from 'react'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useBalances } from '../../hooks/useBalances'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { Container, Section } from '../../ui/design-system'
import { PortfolioHero } from './components/PortfolioHero'
import { PortfolioSummary } from './components/PortfolioSummary'
import { AssetBalances } from './components/AssetBalances'
import { RecentTransactionsTable } from './components/RecentTransactionsTable'
import { WalletActivityTimeline } from './components/WalletActivityTimeline'
import { NetworkStatusPanel } from './components/NetworkStatusPanel'
import { WalletQuickActions } from './components/WalletQuickActions'
import { computeAssetBalances, computeRecentTransactions, computeActivityTimeline, computeNetworkInfo } from './walletAnalytics'
import { ARC_RPC_URL } from '../../chains/arc'

/**
 * Wallet v7 (Mission 8) — the premium portfolio experience for the
 * Wallet Ecosystem. Layout order per the brief: Portfolio Hero ->
 * Portfolio Summary -> Asset Balances -> Recent Transactions -> Activity
 * Timeline -> Network Information -> Quick Actions.
 *
 * Every figure traces back to existing hooks only: `useWalletContext`
 * (account, activity, connection state), `useBalances` (native + ANV
 * balances — the same hook Transfer already used), and the new
 * `useNetworkStatus` (extracted from Developer Tools' old inline polling
 * so both pages share one RPC poll instead of two). No new on-chain
 * reads were added; see walletAnalytics.js for the documented USD-value
 * limitation.
 */
export default function WalletPage() {
  const { account, provider, chainId, isArcNetwork, isConnecting, activity, arcExplorer, connect, disconnect, switchToArc } = useWalletContext()
  const { nativeBalance, anvBalance, loading: balancesLoading } = useBalances(provider, account)
  const { blockNumber, gasPriceGwei, latencyMs } = useNetworkStatus(provider)

  const assets = useMemo(() => computeAssetBalances(nativeBalance, anvBalance, isArcNetwork), [nativeBalance, anvBalance, isArcNetwork])
  const transactions = useMemo(() => computeRecentTransactions(activity, 8), [activity])
  const timelineItems = useMemo(() => computeActivityTimeline(activity, 10), [activity])
  const networkInfo = useMemo(
    () => computeNetworkInfo({ isArcNetwork, chainId, rpcUrl: ARC_RPC_URL, blockNumber, gasPriceGwei, latencyMs }),
    [isArcNetwork, chainId, blockNumber, gasPriceGwei, latencyMs]
  )

  return (
    <Container size="wide" className="wv7-wallet-page">
      <Section spacing="md">
        <PortfolioHero
          account={account}
          isArcNetwork={isArcNetwork}
          chainId={chainId}
          nativeBalance={nativeBalance}
          anvBalance={anvBalance}
          balancesLoading={balancesLoading}
          arcExplorer={arcExplorer}
          isConnecting={isConnecting}
          onConnect={connect}
          onDisconnect={disconnect}
          onSwitchNetwork={switchToArc}
        />
      </Section>

      {account && (
        <>
          <Section spacing="md">
            <PortfolioSummary
              anvBalance={anvBalance}
              nativeBalance={nativeBalance}
              balancesLoading={balancesLoading}
              txCount={activity.length}
              isArcNetwork={isArcNetwork}
            />
          </Section>

          <Section spacing="md">
            <AssetBalances assets={assets} loading={balancesLoading} />
          </Section>

          <Section spacing="md">
            <RecentTransactionsTable transactions={transactions} arcExplorer={arcExplorer} />
          </Section>

          <Section spacing="md">
            <WalletActivityTimeline items={timelineItems} arcExplorer={arcExplorer} />
          </Section>

          <Section spacing="md">
            <NetworkStatusPanel networkInfo={networkInfo} />
          </Section>
        </>
      )}

      <Section spacing="md">
        <WalletQuickActions />
      </Section>
    </Container>
  )
}
