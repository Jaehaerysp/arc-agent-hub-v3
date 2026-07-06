import { HeroCard, Button, Badge, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { CopyButton } from '../../../ui/CopyButton'
import { shortAddr } from '../../../lib/format'
import { NETWORK_LABEL } from '../walletAnalytics'

/**
 * Portfolio Hero — the one gradient/glow hero element on the Wallet
 * page. Shows the connected address, live network status, and the two
 * real token balances this app tracks (native/USDC + ANV). "Animated
 * background" per the Mission 8 brief is the drifting gradient defined
 * on `.wv7-hero` in wallet-v7.css — the same ambient-glow language every
 * other v7 HeroCard already uses, kept consistent rather than one-off.
 */
export function PortfolioHero({ account, isArcNetwork, chainId, nativeBalance, anvBalance, balancesLoading, arcExplorer, isConnecting, onConnect, onDisconnect, onSwitchNetwork }) {
  if (!account) {
    return (
      <HeroCard
        className="wv7-hero"
        eyebrow="Wallet"
        title="No wallet connected"
        description="Connect a browser wallet to view your Arc Testnet portfolio, send transfers, and track on-chain activity."
        actions={
          <Button variant="primary" onClick={onConnect} loading={isConnecting}>
            {isConnecting ? 'Connecting' : 'Connect Wallet'}
          </Button>
        }
      />
    )
  }

  return (
    <HeroCard
      className="wv7-hero"
      eyebrow="Wallet"
      title="Portfolio"
      description={`Connected to ${NETWORK_LABEL} as ${shortAddr(account)}`}
      actions={
        <div className="wv7-hero-facts" role="list">
          <div className="wv7-hero-fact" role="listitem" aria-label={`Wallet address ${account}`}>
            <span className="wv7-hero-fact-label">Address</span>
            <span className="wv7-hero-fact-value mono">
              <span className="wv7-status-dot" data-tone={isArcNetwork ? 'healthy' : 'attention'} />
              {shortAddr(account)}
              <CopyButton value={account} label="" />
            </span>
          </div>

          <div className="wv7-hero-fact" role="listitem" aria-label="Connected network">
            <span className="wv7-hero-fact-label">Network</span>
            <span className="wv7-hero-fact-value">
              {isArcNetwork ? (
                <Badge variant="success" size="sm">{NETWORK_LABEL}</Badge>
              ) : (
                <Badge variant="warning" size="sm">Chain {chainId ?? '—'}</Badge>
              )}
            </span>
          </div>

          <div className="wv7-hero-fact" role="listitem" aria-label="ANV balance">
            <span className="wv7-hero-fact-label">ANV Balance</span>
            <span className="wv7-hero-fact-value">
              {balancesLoading && anvBalance === null ? (
                <Skeleton width={72} height={26} />
              ) : (
                <AnimatedCounter value={Number(anvBalance) || 0} decimals={2} duration={1200} />
              )}
            </span>
          </div>

          <div className="wv7-hero-fact wv7-hero-fact-hero" role="listitem" aria-label="Native USDC balance, treated as portfolio value">
            <span className="wv7-hero-fact-label">Native Balance (USDC)</span>
            <span className="wv7-hero-fact-value wv7-hero-gradient">
              {balancesLoading && nativeBalance === null ? (
                <Skeleton width={90} height={26} />
              ) : (
                <AnimatedCounter value={Number(nativeBalance) || 0} decimals={2} duration={1200} />
              )}
            </span>
          </div>
        </div>
      }
    >
      <div className="wv7-hero-actions">
        <CopyButton value={account} label="Copy Address" />
        <a href={`${arcExplorer}/address/${account}`} target="_blank" rel="noopener noreferrer" className="ds-btn ds-btn-secondary ds-btn-sm">
          <span className="ds-btn-label">View on Explorer ↗</span>
        </a>
        {!isArcNetwork && (
          <Button variant="primary" size="sm" onClick={onSwitchNetwork}>
            Switch to {NETWORK_LABEL}
          </Button>
        )}
        <Button variant="danger" size="sm" onClick={onDisconnect}>
          Disconnect
        </Button>
      </div>
    </HeroCard>
  )
}
