import { useWalletContext } from '../../app/providers/WalletProvider'
import { useTheme } from '../../app/providers/ThemeProvider'
import { CONTRACTS } from '../../contracts/registry'
import { ARC_CHAIN_ID, ARC_RPC_URL, ARC_EXPLORER_URL } from '../../chains/arc'
import { Card, CardBody, PanelHeader } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { CopyButton } from '../../ui/CopyButton'
import { IconSettings, IconSun, IconMoon } from '../../ui/icons'

const APP_VERSION = '2.0.0'
const REPO_URL = 'https://github.com/arc-network/arc-agent-hub'

export default function SettingsPage() {
  const wallet = useWalletContext()
  const { theme, setTheme } = useTheme()

  const handleExportActivity = () => {
    const blob = new Blob([JSON.stringify(wallet.activity, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arc-agent-hub-activity-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleResetActivity = () => {
    if (confirm('Clear all local activity history? This cannot be undone.')) {
      wallet.clearActivity()
    }
  }

  const handleResetAgent = () => {
    if (confirm('Forget your saved Agent ID on this device? On-chain data is unaffected.')) {
      wallet.setAgentId(null)
    }
  }

  return (
    <div className="two-col">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardBody>
            <PanelHeader icon={<IconSettings width={18} height={18} />} title="Appearance" />
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Theme</div>
                <div className="settings-row-desc">Switch between dark and light mode</div>
              </div>
              <div className="theme-toggle">
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>
                  <IconMoon width={13} height={13} /> Dark
                </button>
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>
                  <IconSun width={13} height={13} /> Light
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <PanelHeader title="Network" />
            <div className="settings-row">
              <span className="settings-row-label">Network</span>
              <span className="settings-row-value">Arc Testnet</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Chain ID</span>
              <span className="settings-row-value">{ARC_CHAIN_ID}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">RPC URL</span>
              <span className="settings-row-value">{ARC_RPC_URL}<CopyButton value={ARC_RPC_URL} label="" /></span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Explorer</span>
              <a className="settings-row-value tx-link" href={ARC_EXPLORER_URL} target="_blank" rel="noopener noreferrer">
                {ARC_EXPLORER_URL.replace('https://', '')} ↗
              </a>
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
                    {c.address.slice(0, 10)}…{c.address.slice(-6)}
                    <CopyButton value={c.address} label="" />
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardBody>
            <PanelHeader title="Local data" />
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Export activity</div>
                <div className="settings-row-desc">Download your activity log as JSON</div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleExportActivity}>Export</Button>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Reset activity</div>
                <div className="settings-row-desc">Clear locally stored activity history</div>
              </div>
              <Button variant="danger" size="sm" onClick={handleResetActivity}>Reset</Button>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Reset agent ID</div>
                <div className="settings-row-desc">Forget the saved agent ID on this device</div>
              </div>
              <Button variant="danger" size="sm" onClick={handleResetAgent} disabled={!wallet.agentId}>Reset</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <PanelHeader title="About" />
            <div className="settings-row">
              <span className="settings-row-label">Version</span>
              <span className="settings-row-value">{APP_VERSION}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Standard</span>
              <span className="settings-row-value">ERC-8004</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Source</span>
              <a className="settings-row-value tx-link" href={REPO_URL} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
