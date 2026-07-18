import { Link } from 'react-router-dom'
import { Reveal } from '../../../ui/Reveal'
import { GlassPanel } from '../../../ui/GlassPanel'
import { SectionHeading } from '../../../ui/SectionHeading'
import { IconCheck } from '../../../ui/icons'
import { PLATFORM_MODULES } from '../landing.data'

function ModuleCta({ href, className, children }) {
  const isInternal = href.startsWith('/')
  if (isInternal) {
    return <Link to={href} className={className}>{children}</Link>
  }
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export function PlatformModules() {
  return (
    <section id="platform" className="landing-section">
      <div className="landing-shell">
        <SectionHeading
          eyebrow="Core infrastructure"
          title="Platform Modules"
          desc="Two ways to build on Arc Agent Hub — use the registries directly, or build on the tools already wrapped around them."
        />

        <div className="landing-modules-grid">
          {PLATFORM_MODULES.map((mod, i) => (
            <Reveal as="div" key={mod.title} delay={i * 100}>
              <GlassPanel
                strong={mod.tone === 'dark'}
                className={`landing-module-card landing-module-card-${mod.tone}`}
              >
                <div className="landing-module-title">{mod.title}</div>
                <p className="landing-module-desc">{mod.desc}</p>
                <span className="landing-module-tag">{mod.tag}</span>

                <ul className="landing-module-list">
                  {mod.items.map((item) => (
                    <li key={item}><IconCheck width={14} height={14} /> {item}</li>
                  ))}
                </ul>

                <div className="landing-module-actions">
                  <ModuleCta href={mod.primaryHref} className="btn btn-primary">
                    {mod.primaryLabel}
                  </ModuleCta>
                  {mod.secondaryLabel && (
                    <ModuleCta href={mod.secondaryHref} className="btn btn-ghost">
                      {mod.secondaryLabel}
                    </ModuleCta>
                  )}
                </div>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
