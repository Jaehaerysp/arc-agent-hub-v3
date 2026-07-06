import { Panel, Grid, Badge } from '../../../ui/design-system'
import { CONTRACTS } from '../../../contracts/registry'
import { ARC_RPC_URL, ARC_EXPLORER_URL } from '../../../chains/arc'
import { CopyButton } from '../../../ui/CopyButton'

/**
 * Network Information — RPC, chain, live latency, and registry status.
 * `latencyMs` comes from `useNetworkStatus`'s real round-trip timing
 * around `getBlockNumber`, not a placeholder value.
 */
export function NetworkStatusPanel({ networkInfo }) {
  const { chainName, chainId, isArcNetwork, blockNumber, gasPriceGwei, latencyMs, registryStatus, contractCount } = networkInfo

  return (
    <Panel title="Network Information" subtitle="Live Arc Testnet connection and registry status" className="wv7-network-panel">
      <Grid columns={2} minColWidth="260px" gap="md">
        <div className="wv7-network-row">
          <span className="wv7-network-label">Network</span>
          <span className="wv7-network-value">
            {isArcNetwork ? <Badge variant="success" size="sm">{chainName}</Badge> : <Badge variant="warning" size="sm">Unexpected chain</Badge>}
          </span>
        </div>

        <div className="wv7-network-row">
          <span className="wv7-network-label">Chain ID</span>
          <span className="wv7-network-value mono">{chainId ?? '—'}</span>
        </div>

        <div className="wv7-network-row">
          <span className="wv7-network-label">RPC</span>
          <span className="wv7-network-value mono">
            {ARC_RPC_URL}
            <CopyButton value={ARC_RPC_URL} label="" />
          </span>
        </div>

        <div className="wv7-network-row">
          <span className="wv7-network-label">Latency</span>
          <span className="wv7-network-value mono">{latencyMs !== null ? `${latencyMs} ms` : '—'}</span>
        </div>

        <div className="wv7-network-row">
          <span className="wv7-network-label">Latest Block</span>
          <span className="wv7-network-value mono">{blockNumber ?? '—'}</span>
        </div>

        <div className="wv7-network-row">
          <span className="wv7-network-label">Gas Price</span>
          <span className="wv7-network-value mono">{gasPriceGwei !== null ? `${gasPriceGwei.toFixed(2)} gwei` : '—'}</span>
        </div>

        <div className="wv7-network-row">
          <span className="wv7-network-label">Registry Contracts</span>
          <span className="wv7-network-value">{contractCount} configured</span>
        </div>

        <div className="wv7-network-row">
          <span className="wv7-network-label">Registry Status</span>
          <span className="wv7-network-value">
            <Badge variant={registryStatus === 'operational' ? 'success' : 'error'} size="sm">
              {registryStatus === 'operational' ? 'Operational' : 'Degraded'}
            </Badge>
          </span>
        </div>
      </Grid>

      <div className="wv7-network-explorer">
        <span className="wv7-network-label">Explorer</span>
        <a href={ARC_EXPLORER_URL} target="_blank" rel="noopener noreferrer" className="mono">
          {ARC_EXPLORER_URL.replace('https://', '')} ↗
        </a>
      </div>

      <div className="wv7-network-contracts">
        {Object.values(CONTRACTS).map((c) => (
          <div className="wv7-network-contract-row" key={c.address}>
            <span className="wv7-network-contract-label">{c.label}</span>
            <span className="wv7-network-contract-value mono">
              {c.address.slice(0, 10)}…{c.address.slice(-6)}
              <CopyButton value={c.address} label="" />
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
