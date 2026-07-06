import { IconDashboard, IconAgent, IconShield, IconWallet, IconTransfer, IconSettings, IconTools, IconJob } from '../ui/icons'

// Flat list — preserved for anything that just needs "all nav items"
// (breadcrumbs, command palette, active-route lookups).
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { path: '/agents', label: 'Agents', icon: IconAgent, badgeKey: 'agentId' },
  { path: '/trust', label: 'Trust Center', icon: IconShield },
  { path: '/wallet', label: 'Wallet', icon: IconWallet },
  { path: '/transfer', label: 'Transfer', icon: IconTransfer },
  { path: '/jobs', label: 'Jobs', icon: IconJob },
  { path: '/settings', label: 'Settings', icon: IconSettings },
  { path: '/developer-tools', label: 'Developer Tools', icon: IconTools },
]

// Grouped by operating concern, for sidebar section hierarchy.
// Purely presentational — same items, same paths, same icons as above.
export const NAV_SECTIONS = [
  {
    label: 'Operate',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: IconDashboard },
      { path: '/agents', label: 'Agents', icon: IconAgent, badgeKey: 'agentId' },
      { path: '/jobs', label: 'Jobs', icon: IconJob },
    ],
  },
  {
    label: 'Trust',
    items: [{ path: '/trust', label: 'Trust Center', icon: IconShield }],
  },
  {
    label: 'Treasury',
    items: [
      { path: '/wallet', label: 'Wallet', icon: IconWallet },
      { path: '/transfer', label: 'Transfer', icon: IconTransfer },
    ],
  },
  {
    label: 'System',
    items: [
      { path: '/settings', label: 'Settings', icon: IconSettings },
      { path: '/developer-tools', label: 'Developer Tools', icon: IconTools },
    ],
  },
]

// Human labels for dynamic route segments the breadcrumb can't infer
// from NAV_ITEMS alone (job ids, wallet addresses, sub-routes).
export const ROUTE_LABELS = {
  create: 'Create Job',
  history: 'History',
}
