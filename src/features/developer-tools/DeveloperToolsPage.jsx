import { useEffect, useState } from 'react'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { CONTRACTS } from '../../contracts/registry'
import { ARC_CHAIN_ID, ARC_RPC_URL, ARC_EXPLORER_URL } from '../../chains/arc'
import { Card, CardBody, PanelHeader } from '../../ui/Card'
import { CopyButton } from '../../ui/CopyButton'
import { EmptyState } from '../../ui/EmptyState'
import { formatTime, shortHash } from '../../lib/format'
import { IconTools } from '../../ui/icons'

const DOC_LINKS = [
  { label: 'Arc Testnet Docs', url: 'https://docs.arc.network' },
  { label: 'ERC-8004 Standard', url: 'https://eips.ethereum.org/EIPS/eip-8004' },
  { label: 'ArcScan Explorer', url: ARC_EXPLORER_URL },
  { label: 'ethers.js Docs', url: 'https://docs.ethers.org' },
]

export default function DeveloperToolsPage() {
  const { account, provider, chainId, activity, arcExplorer } = useWalletContext()
  const [blockNumber, setBlockNumber] = useState(null)
  const [gasPrice, setGasPrice] = useState(null)

  useEffect(() => {
    if (!provider) return

    let cancelled = false

    const load = async () => {
      try {
        const [block, fee] = await Promise.all([provider.getBlockNumber(), provider.getFeeData()])
        if (!cancelled) {
          setBlockNumber(block)
          setGasPrice(fee.gasPrice ? `${(Number(fee.gasPrice) / 1e9).toFixed(2)} gwei` : null)
        }
      } catch {
        // RPC unavailable — leave as null
      }
    }

    load()
    const interval = setInterval(load, 10000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [provider])

  return (
    <div className="two-col">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardBody>
            <PanelHeader icon={<IconTools width={18} height={18} />} title="Wallet & network" />
            <div className="kv-grid">
              <div className="kv-row">
                <span className="kv-label">Connected address</span>
                <span className="kv-value">{account}<CopyButton value={account} label="" /></span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Chain ID</span>
                <span className="kv-value">{chainId} {chainId === ARC_CHAIN_ID ? '(Arc Testnet)' : '(unexpected)'}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">RPC URL</span>
                <span className="kv-value">{ARC_RPC_URL}<CopyButton value={ARC_RPC_URL} label="" /></span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Latest block</span>
                <span className="kv-value">{blockNumber ?? '—'}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Gas price</span>
                <span className="kv-value">{gasPrice ?? '—'}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <PanelHeader title="Contract addresses" />
            <div className="kv-grid">
              {Object.values(CONTRACTS).map((c) => (
                <div className="kv-row" key={c.address}>
                  <span className="kv-label">{c.label}</span>
                  <span className="kv-value">
                    {c.address}
                    <CopyButton value={c.address} label="" />
                    <a href={`${arcExplorer}/address/${c.address}`} target="_blank" rel="noopener noreferrer" className="tx-link">↗</a>
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <PanelHeader title="Documentation" />
            <div className="doc-link-grid">
              {DOC_LINKS.map((d) => (
                <a key={d.url} className="doc-link" href={d.url} target="_blank" rel="noopener noreferrer">
                  {d.label} <span>↗</span>
                </a>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <PanelHeader title="Recent events" subtitle="Locally logged transactions" />
          {activity.length === 0 ? (
            <EmptyState icon="⌁" title="No events yet" description="Transactions you submit will be logged here." />
          ) : (
            <div className="activity-list">
              {activity.slice(0, 10).map((item) => (
                <div key={item.id} className={`activity-item ${item.status}`}>
                  <div className="activity-main">
                    <div className="activity-title">{item.label}</div>
                    {item.detail && <div className="activity-detail">{item.detail}</div>}
                  </div>
                  <div className="activity-meta">
                    {item.txHash && (
                      <a href={`${arcExplorer}/tx/${item.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                        {shortHash(item.txHash)}
                      </a>
                    )}
                    <div className="activity-time">{formatTime(item.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
