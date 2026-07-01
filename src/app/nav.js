import { IconDashboard, IconAgent, IconStar, IconShield, IconTransfer, IconSettings, IconTools } from '../ui/icons'

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { path: '/agents', label: 'Agents', icon: IconAgent, badgeKey: 'agentId' },
  { path: '/reputation', label: 'Reputation', icon: IconStar },
  { path: '/validation', label: 'Validation', icon: IconShield },
  { path: '/transfer', label: 'Transfer', icon: IconTransfer },
  { path: '/settings', label: 'Settings', icon: IconSettings },
  { path: '/developer-tools', label: 'Developer Tools', icon: IconTools },
]
