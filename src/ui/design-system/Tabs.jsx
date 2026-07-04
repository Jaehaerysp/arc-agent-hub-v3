import { useRef } from 'react'

/**
 * v7 Premium Design System — Tabs.
 *
 * Full WAI-ARIA tabs pattern: roving tabindex, Arrow/Home/End keyboard
 * navigation, and `aria-controls`/`aria-labelledby` wiring to a matching
 * `TabPanel`. `tabs` is `[{ id, label, icon? }]`.
 */
export function Tabs({ tabs, active, onChange, className = '' }) {
  const triggerRefs = useRef([])

  const handleKeyDown = (event, index) => {
    let nextIndex = null
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = tabs.length - 1

    if (nextIndex !== null) {
      event.preventDefault()
      onChange(tabs[nextIndex].id)
      triggerRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className={['ds-tabs-list', className].filter(Boolean).join(' ')} role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => {
            triggerRefs.current[index] = el
          }}
          id={`ds-tab-${tab.id}`}
          role="tab"
          type="button"
          aria-selected={active === tab.id}
          aria-controls={`ds-tabpanel-${tab.id}`}
          tabIndex={active === tab.id ? 0 : -1}
          className={['ds-tab-trigger', active === tab.id ? 'is-active' : ''].filter(Boolean).join(' ')}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ id, active, children, className = '' }) {
  if (active !== id) return null
  return (
    <div
      id={`ds-tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`ds-tab-${id}`}
      className={['ds-tab-panel', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}
