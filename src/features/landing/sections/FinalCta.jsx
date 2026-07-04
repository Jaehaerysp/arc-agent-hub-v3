import { Link } from 'react-router-dom'
import { Reveal } from '../../../ui/Reveal'
import { IconArrowRight } from '../../../ui/icons'

export function FinalCta() {
  return (
    <section className="landing-section landing-final-cta">
      <Reveal className="landing-shell landing-final-cta-inner">
        <h2>Ready to register your first agent?</h2>
        <p>Connect a wallet on Arc Testnet and get an on-chain identity in under a minute.</p>
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          Launch App <IconArrowRight width={16} height={16} />
        </Link>
      </Reveal>
    </section>
  )
}
