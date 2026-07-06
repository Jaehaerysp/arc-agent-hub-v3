import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useTheme } from '../../app/providers/ThemeProvider'
import { useToast } from '../../hooks/useToast'
import { CONTRACTS } from '../../contracts/registry'
import { ARC_CHAIN_ID, ARC_RPC_URL, ARC_EXPLORER_URL } from '../../chains/arc'
import { Container, Section, Panel, Tabs, TabPanel, Button, Badge, EmptyState } from '../../ui/design-system'
import { CopyButton } from '../../ui/CopyButton'
import { shortAddr } from '../../lib/format'
import {
  IconSettings, IconSun, IconMoon, IconBell, IconWallet, IconShield, IconTools, IconBook,
} from '../../ui/icons'

const APP_VERSION = '2.0.0'
const REPO_URL = 'https://github.com/arc-network/arc-agent-hub'

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'security', label: 'Security' },
  { id: 'developer', label: 'Developer' },
  { id: 'about', label: 'About' },
]

/**
 * Settings v7 (Mission 8) — same business logic as the previous Settings
 * page (theme toggle, export/reset activity, reset agent ID — every
 * handler below is byte-for-byte the same behavior), reorganized into
 * the seven categories the Mission 8 brief names, each inside a premium
 * Panel. Categories with no backing feature yet (Notifications) say so
 * honestly via EmptyState rather than shipping a toggle that does
 * nothing; Security is intentionally informational only, since this app
 * never touches private keys — signing always happens in the browser
 * wallet extension.
 */
export default function SettingsPage() {
  const wallet = useWalletContext()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [category, setCategory] = useState('general')

  const handleExportActivity = () => {
    const blob = new Blob([JSON.stringify(wallet.activity, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arc-agent-hub-activity-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Activity exported', variant: 'success' })
  }

  const handleResetActivity = () => {
    if (confirm('Clear all local activity history? This cannot be undone.')) {
      wallet.clearActivity()
      toast({ title: 'Activity cleared', variant: 'success' })
    }
  }

  const handleResetAgent = () => {
    if (confirm('Forget your saved Agent ID on this device? On-chain data is unaffected.')) {
      wallet.setAgentId(null)
      toast({ title: 'Agent ID forgotten on this device', variant: 'success' })
    }
  }

  return (
    <Container size="narrow" className="wv7-settings-page">
      <Section spacing="md">
        <Tabs tabs={CATEGORIES} active={category} onChange={setCategory} className="wv7-settings-tabs" />
      </Section>

      <Section spacing="md">
        <TabPanel id="general" active={category}>
          <Panel icon={<IconSettings width={18} height={18} />} title="Local Data" subtitle="Activity logged on this device only" className="wv7-settings-panel">
            <div className="wv7-settings-row">
              <div>
                <div className="wv7-settings-row-label">Export activity</div>
                <div className="wv7-settings-row-desc">Download your activity log as JSON</div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleExportActivity}>Export</Button>
            </div>
            <div className="wv7-settings-row">
              <div>
                <div className="wv7-settings-row-label">Reset activity</div>
                <div className="wv7-settings-row-desc">Clear locally stored activity history</div>
              </div>
              <Button variant="danger" size="sm" onClick={handleResetActivity}>Reset</Button>
            </div>
          </Panel>
        </TabPanel>

        <TabPanel id="appearance" active={category}>
          <Panel icon={<IconSettings width={18} height={18} />} title="Appearance" className="wv7-settings-panel">
            <div className="wv7-settings-row">
              <div>
                <div className="wv7-settings-row-label">Theme</div>
                <div className="wv7-settings-row-desc">Switch between dark and light mode</div>
              </div>
              <div className="wv7-theme-toggle">
                <button className={theme === 'dark' ? 'is-active' : ''} onClick={() => setTheme('dark')} type="button">
                  <IconMoon width={13} height={13} /> Dark
                </button>
                <button className={theme === 'light' ? 'is-active' : ''} onClick={() => setTheme('light')} type="button">
                  <IconSun width={13} height={13} /> Light
                </button>
              </div>
            </div>
          </Panel>
        </TabPanel>

        <TabPanel id="notifications" active={category}>
          <Panel icon={<IconBell width={18} height={18} />} title="Notifications" className="wv7-settings-panel">
            <EmptyState
              icon={<IconBell width={22} height={22} />}
              title="Notifications aren't available yet"
              description="This app doesn't run a notification backend. In-app toasts already surface transaction results, and the Wallet page's Activity Timeline keeps a full history."
              size="sm"
            />
          </Panel>
        </TabPanel>

        <TabPanel id="wallet" active={category}>
          <Panel icon={<IconWallet width={18} height={18} />} title="Wallet" subtitle="Connection and agent identity" className="wv7-settings-panel">
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Connected address</span>
              <span className="wv7-settings-row-value mono">
                {wallet.account ? shortAddr(wallet.account) : 'Not connected'}
                {wallet.account && <CopyButton value={wallet.account} label="" />}
              </span>
            </div>
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Network</span>
              <span className="wv7-settings-row-value">
                {wallet.isArcNetwork ? <Badge variant="success" size="sm">Arc Testnet</Badge> : <Badge variant="warning" size="sm">Unexpected chain</Badge>}
              </span>
            </div>
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Agent ID</span>
              <span className="wv7-settings-row-value mono">{wallet.agentId ? `#${wallet.agentId}` : 'Unregistered'}</span>
            </div>
            <div className="wv7-settings-row">
              <div>
                <div className="wv7-settings-row-label">Reset agent ID</div>
                <div className="wv7-settings-row-desc">Forget the saved agent ID on this device</div>
              </div>
              <Button variant="danger" size="sm" onClick={handleResetAgent} disabled={!wallet.agentId}>Reset</Button>
            </div>
          </Panel>
        </TabPanel>

        <TabPanel id="security" active={category}>
          <Panel icon={<IconShield width={18} height={18} />} title="Security" className="wv7-settings-panel">
            <p className="wv7-settings-note">
              Arc Agent Hub never stores or transmits your private key. Every transaction is
              signed inside your browser wallet extension (MetaMask, Rabby, etc.); this app only
              ever holds a read-only provider connection and the addresses/hashes it logs locally
              on this device.
            </p>
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Signer type</span>
              <span className="wv7-settings-row-value">Browser wallet only</span>
            </div>
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Local storage</span>
              <span className="wv7-settings-row-value">Activity log, agent ID, theme, sidebar state</span>
            </div>
          </Panel>
        </TabPanel>

        <TabPanel id="developer" active={category}>
          <Panel icon={<IconTools width={18} height={18} />} title="Developer" subtitle="Contract addresses and network config" className="wv7-settings-panel">
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Chain ID</span>
              <span className="wv7-settings-row-value mono">{ARC_CHAIN_ID}</span>
            </div>
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">RPC URL</span>
              <span className="wv7-settings-row-value mono">{ARC_RPC_URL}<CopyButton value={ARC_RPC_URL} label="" /></span>
            </div>
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Explorer</span>
              <a className="wv7-settings-row-value tx-link" href={ARC_EXPLORER_URL} target="_blank" rel="noopener noreferrer">
                {ARC_EXPLORER_URL.replace('https://', '')} ↗
              </a>
            </div>
            <div className="wv7-settings-contracts">
              {Object.values(CONTRACTS).map((c) => (
                <div className="wv7-settings-row" key={c.address}>
                  <span className="wv7-settings-row-label">{c.label}</span>
                  <span className="wv7-settings-row-value mono">
                    {c.address.slice(0, 10)}…{c.address.slice(-6)}
                    <CopyButton value={c.address} label="" />
                  </span>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('/developer-tools')} style={{ marginTop: 12 }}>
              Open Developer Tools
            </Button>
          </Panel>
        </TabPanel>

        <TabPanel id="about" active={category}>
          <Panel icon={<IconBook width={18} height={18} />} title="About" className="wv7-settings-panel">
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Version</span>
              <span className="wv7-settings-row-value">{APP_VERSION}</span>
            </div>
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Standard</span>
              <span className="wv7-settings-row-value">ERC-8004</span>
            </div>
            <div className="wv7-settings-row">
              <span className="wv7-settings-row-label">Source</span>
              <a className="wv7-settings-row-value tx-link" href={REPO_URL} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </div>
          </Panel>
        </TabPanel>
      </Section>
    </Container>
  )
}
