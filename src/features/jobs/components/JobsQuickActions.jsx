import { useNavigate } from 'react-router-dom'
import { Panel, Grid, GlassCard } from '../../../ui/design-system'
import { IconJob, IconLayers, IconAgent, IconTools, IconShield } from '../../../ui/icons'

const ACTIONS = [
  { path: '/jobs/create', label: 'Create Job', desc: 'Post a new ERC-8183 job', icon: IconJob },
  { path: '/agents', label: 'Browse Marketplace', desc: 'Explore every listed agent', icon: IconLayers },
  { path: '/agents', label: 'Hire Agent', desc: 'Find a provider and start a job', icon: IconAgent },
  { path: '/developer-tools', label: 'Developer Tools', desc: 'Call contracts directly', icon: IconTools },
  { path: '/validation', label: 'Validation', desc: 'Request or review validation', icon: IconShield },
]

/**
 * Large, glanceable action cards for the Jobs Platform's most common next
 * steps — same "cards lift, never invert" GlassCard treatment as
 * MissionQuickActions (Dashboard v7), scoped to Jobs-relevant actions.
 */
export function JobsQuickActions() {
  const navigate = useNavigate()

  return (
    <Panel title="Quick Actions" subtitle="The next step, one tap away" className="jv7-quick-actions-panel">
      <Grid minColWidth="200px" gap="md" aria-label="Jobs quick actions">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon
          return (
            <GlassCard
              key={`${action.path}-${action.label}`}
              as="button"
              type="button"
              interactive
              className="jv7-quick-action"
              onClick={() => navigate(action.path)}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="jv7-quick-action-icon" aria-hidden="true">
                <Icon width={18} height={18} />
              </div>
              <div className="jv7-quick-action-label">{action.label}</div>
              <div className="jv7-quick-action-desc">{action.desc}</div>
            </GlassCard>
          )
        })}
      </Grid>
    </Panel>
  )
}
