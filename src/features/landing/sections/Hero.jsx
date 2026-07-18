import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { DOCS_URL } from '../landing.data'
import { ARC_CHAIN_ID } from '../../../chains/arc'
import { NetworkCanvas } from '../components/NetworkCanvas'
import { IconArrowRight } from '../../../ui/icons'

const EASE = [0.16, 1, 0.3, 1]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

/**
 * Hero — full-viewport landing entry point. A canvas node network sits
 * behind the content as the "Arc ecosystem" visual; copy is unchanged in
 * substance from the previous hero (same facts: ERC-8004 reference impl,
 * four registries, non-custodial, MIT/testnet), restructured for a
 * stronger first read: eyebrow -> headline -> supporting line -> proof
 * points -> CTAs. Entrance and hover motion run on the `motion` package;
 * this is the only place in the app that imports it (see Reveal.jsx for
 * the pattern used on every other page).
 */
export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="top" className="landing-hero-v3">
      <NetworkCanvas />
      <div className="landing-hero-v3-scrim" aria-hidden="true" />

      <motion.div
        className="landing-hero-v3-col"
        variants={shouldReduceMotion ? undefined : container}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'show'}
      >
        <motion.p className="landing-eyebrow landing-hero-v3-eyebrow" variants={item}>
          <span className="dot-live" aria-hidden="true" />
          Live on Arc Testnet &middot; Chain {ARC_CHAIN_ID}
        </motion.p>

        <motion.h1 className="landing-hero-v3-heading" variants={item}>
          Build with <span className="text-gradient">verifiable identity,</span>
          <br />
          coordinate the agentic way.
        </motion.h1>

        <motion.p className="landing-hero-v3-sub" variants={item}>
          Arc Agent Hub is an open-source reference implementation of ERC-8004 &mdash;
          on-chain identity, reputation, and validation for autonomous agents,
          built end to end rather than mocked up.
        </motion.p>

        <motion.ul className="landing-hero-v3-proof" variants={item}>
          <li>Four registries, one dashboard</li>
          <li>Zero private keys touched by the app</li>
          <li>MIT licensed, free and open source</li>
        </motion.ul>

        <motion.div className="landing-hero-v3-actions" variants={item}>
          <motion.span
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.15, ease: EASE }}
          >
            <Link to="/dashboard" className="btn btn-primary btn-lg landing-btn-layered">
              Launch App
              <IconArrowRight width={15} height={15} />
            </Link>
          </motion.span>
          <motion.span
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.15, ease: EASE }}
          >
            <Link to="/agents" className="btn btn-secondary btn-lg">
              Explore Marketplace
            </Link>
          </motion.span>
          <a className="landing-hero-v3-docs" href={DOCS_URL} target="_blank" rel="noreferrer">
            Documentation
          </a>
        </motion.div>
      </motion.div>

      {!shouldReduceMotion && (
        <motion.div
          className="landing-hero-v3-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
          aria-hidden="true"
        >
          <span className="landing-hero-v3-scroll-line" />
          Scroll
        </motion.div>
      )}
    </section>
  )
}
