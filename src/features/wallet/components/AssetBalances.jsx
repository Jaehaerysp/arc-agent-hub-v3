import { Panel, Grid, GlassCard, Badge, Skeleton } from '../../../ui/design-system'
import { shortAddr } from '../../../lib/format'
import { IconWallet, IconLink } from '../../../ui/icons'

const ICONS = { native: IconLink, anv: IconWallet }

/**
 * Premium asset cards — one per token this app actually tracks. See
 * walletAnalytics.js for why "USD Value" is intentionally omitted rather
 * than fabricated.
 */
export function AssetBalances({ assets, loading }) {
  return (
    <Panel title="Asset Balances" subtitle="Tokens held on Arc Testnet" className="wv7-assets-panel">
      <Grid minColWidth="240px" gap="md" aria-label="Asset balances">
        {assets.map((asset) => {
          const Icon = ICONS[asset.key] || IconWallet
          return (
            <GlassCard key={asset.key} className="wv7-asset-card" padding="md">
              <div className="wv7-asset-card-top">
                <div className="wv7-asset-icon" aria-hidden="true">
                  <Icon width={16} height={16} />
                </div>
                <Badge variant={asset.status === 'connected' ? 'success' : 'warning'} size="sm" dot>
                  {asset.status === 'connected' ? 'Connected' : 'Wrong network'}
                </Badge>
              </div>

              <div className="wv7-asset-symbol">{asset.symbol}</div>
              <div className="wv7-asset-name">{asset.name}</div>

              <div className="wv7-asset-balance">
                {loading && asset.balance === null ? <Skeleton width={90} height={24} /> : asset.balanceFormatted}
              </div>

              <div className="wv7-asset-foot">
                <span className="wv7-asset-network">{asset.network}</span>
                {asset.address && (
                  <span className="wv7-asset-address mono" title={asset.address}>
                    {shortAddr(asset.address)}
                  </span>
                )}
              </div>
            </GlassCard>
          )
        })}
      </Grid>
    </Panel>
  )
}
