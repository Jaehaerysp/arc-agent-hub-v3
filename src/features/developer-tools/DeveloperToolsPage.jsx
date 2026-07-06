import { useMemo } from 'react'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { CONTRACTS } from '../../contracts/registry'
import { ARC_CHAIN_ID, ARC_RPC_URL, ARC_EXPLORER_URL } from '../../chains/arc'
import { Container, Section, Panel, Grid, Badge, EmptyState } from '../../ui/design-system'
import { CopyButton } from '../../ui/CopyButton'
import { formatTime, shortHash } from '../../lib/format'
import { IconTools, IconActivity, IconBook, IconCheck } from '../../ui/icons'

const DOC_LINKS = [
  { label: 'Arc Testnet Docs', url: 'https://docs.arc.network' },
  { label: 'ERC-8004 Standard', url: 'https://eips.ethereum.org/EIPS/eip-8004' },
  { label: 'ArcScan Explorer', url: ARC_EXPLORER_URL },
  { label: "ethers.js Docs", url: 'https://docs.ethers.org' },
]

function statusBadge(status) {
  if (status === 'success') return <Badge variant="success" size="sm">Success</Badge>
  if (status === 'error') return <Badge variant="error" size="sm">Failed</Badge>
  return <Badge variant="muted" size="sm">Pending</Badge>
}

/**
 * Developer Tools v7 (Mission 8) — same data sources as the previous
 * page (wallet context, `CONTRACTS`, static doc links), plus the shared
 * `useNetworkStatus` hook (block number, gas price, real round-trip
 * latency) instead of its own inline `useEffect` polling loop. Adds a
 * Diagnostics panel that's purely derived pass/fail badges over data
 * already on the page — no new reads.
 */
export default function DeveloperToolsPage() {
  const { account, provider, chainId, isArcNetwork, signer, activity, arcExplorer } = useWalletContext()
  const { blockNumber, gasPriceGwei, latencyMs } = useNetworkStatus(provider)

  const diagnostics = useMemo(
    () => [
      { label: 'Wallet connected', ok: Boolean(account) },
      { label: 'Signer available', ok: Boolean(signer) },
      { label: 'Correct network (Arc Testnet)', ok: isArcNetwork },
      { label: 'RPC reachable', ok: blockNumber !== null },
      { label: 'Registry contracts configured', ok: Object.values(CONTRACTS).length === 4 },
    ],
    [account, signer, isArcNetwork, blockNumber]
  )

  return (
    <Container size="wide" className="wv7-devtools-page">
      <Section spacing="md">
        <Panel icon={<IconTools width={18} height={18} />} title="Wallet & Network" subtitle="Live connection and RPC diagnostics" className="wv7-devtools-panel">
          <Grid columns={2} minColWidth="260px" gap="md">
            <div className="wv7-devtools-row">
              <span className="wv7-devtools-label">Connected address</span>
              <span className="wv7-devtools-value mono">
                {account || 'Not connected'}
                {account && <CopyButton value={account} label="" />}
              </span>
            </div>
            <div className="wv7-devtools-row">
              <span className="wv7-devtools-label">Chain ID</span>
              <span className="wv7-devtools-value mono">
                {chainId ?? '—'} {chainId === ARC_CHAIN_ID ? '(Arc Testnet)' : chainId ? '(unexpected)' : ''}
              </span>
            </div>
            <div className="wv7-devtools-row">
              <span className="wv7-devtools-label">RPC URL</span>
              <span className="wv7-devtools-value mono">{ARC_RPC_URL}<CopyButton value={ARC_RPC_URL} label="" /></span>
            </div>
            <div className="wv7-devtools-row">
              <span className="wv7-devtools-label">Latency</span>
              <span className="wv7-devtools-value mono">{latencyMs !== null ? `${latencyMs} ms` : '—'}</span>
            </div>
            <div className="wv7-devtools-row">
              <span className="wv7-devtools-label">Latest block</span>
              <span className="wv7-devtools-value mono">{blockNumber ?? '—'}</span>
            </div>
            <div className="wv7-devtools-row">
              <span className="wv7-devtools-label">Gas price</span>
              <span className="wv7-devtools-value mono">{gasPriceGwei !== null ? `${gasPriceGwei.toFixed(2)} gwei` : '—'}</span>
            </div>
          </Grid>
        </Panel>
      </Section>

      <Section spacing="md">
        <Panel icon={<IconCheck width={18} height={18} />} title="Diagnostics" subtitle="Pass/fail checks derived from the data above" className="wv7-devtools-panel">
          <div className="wv7-diagnostics-list">
            {diagnostics.map((d) => (
              <div className="wv7-diagnostics-row" key={d.label}>
                <span className="wv7-diagnostics-label">{d.label}</span>
                <Badge variant={d.ok ? 'success' : 'error'} size="sm">{d.ok ? 'OK' : 'Fail'}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section spacing="md">
        <Panel title="Registry Contracts" subtitle="Addresses, unchanged from src/contracts/registry.js" className="wv7-devtools-panel">
          <div className="wv7-devtools-contracts">
            {Object.values(CONTRACTS).map((c) => (
              <div className="wv7-devtools-row" key={c.address}>
                <span className="wv7-devtools-label">{c.label}</span>
                <span className="wv7-devtools-value mono">
                  {c.address}
                  <CopyButton value={c.address} label="" />
                  <a href={`${arcExplorer}/address/${c.address}`} target="_blank" rel="noopener noreferrer" className="tx-link">↗</a>
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section spacing="md">
        <Panel icon={<IconBook width={18} height={18} />} title="Documentation" className="wv7-devtools-panel">
          <div className="wv7-doc-link-grid">
            {DOC_LINKS.map((d) => (
              <a key={d.url} className="wv7-doc-link" href={d.url} target="_blank" rel="noopener noreferrer">
                {d.label} <span>↗</span>
              </a>
            ))}
          </div>
        </Panel>
      </Section>

      <Section spacing="md">
        <Panel icon={<IconActivity width={18} height={18} />} title="Recent Events" subtitle="Locally logged transactions" className="wv7-devtools-panel">
          {activity.length === 0 ? (
            <EmptyState icon={<IconActivity width={20} height={20} />} title="No events yet" description="Transactions you submit will be logged here." />
          ) : (
            <div className="wv7-timeline-list">
              {activity.slice(0, 10).map((item) => (
                <div key={item.id} className="wv7-devtools-event" data-status={item.status}>
                  <div className="wv7-devtools-event-main">
                    <div className="wv7-devtools-event-title">{item.label}</div>
                    {item.detail && <div className="wv7-devtools-event-detail">{item.detail}</div>}
                  </div>
                  <div className="wv7-devtools-event-meta">
                    {item.txHash && (
                      <a href={`${arcExplorer}/tx/${item.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                        {shortHash(item.txHash)}
                      </a>
                    )}
                    {statusBadge(item.status)}
                    <span className="wv7-devtools-event-time">{formatTime(item.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </Section>
    </Container>
  )
}
