import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { Marquee } from './sections/Marquee'
import { MissionQuote } from './sections/MissionQuote'
import { PlatformModules } from './sections/PlatformModules'
import { EcosystemCarousel } from './sections/EcosystemCarousel'
import { FeatureShowcase } from './sections/FeatureShowcase'
import { TreasurySuite } from './sections/TreasurySuite'
import { TrustCenter } from './sections/TrustCenter'
import { DeveloperExperience } from './sections/DeveloperExperience'
import { PlatformArchitecture } from './sections/PlatformArchitecture'
import { JoinEcosystem } from './sections/JoinEcosystem'
import { Footer } from './sections/Footer'
import { CopyrightBar } from './sections/CopyrightBar'
import { BottomNav } from './sections/BottomNav'

// Public landing page — presentation only. Every route it links to
// (/dashboard, /marketplace, etc.) and every fact it states (contract
// addresses, chain id, technologies used) is imported from the same
// modules the connected app uses, so this page can't drift out of sync
// with the product it's advertising. See src/features/landing/landing.data.js
// for content and src/features/landing/sections/ for the sections below.
//
// Layout, spacing, and animation rhythm (narrow centered hero, infinite
// marquee, parallax quote, auto-scroll carousel, mouse-trail CTA, fixed
// bottom nav) were rebuilt from scratch as an original implementation for
// Arc Agent Hub — inspired by common patterns in premium product sites,
// not a reproduction of any specific one.
export default function LandingPage() {
  return (
    <div className="landing landing-v2">
      <Navbar />
      <Hero />
      <Marquee />
      <MissionQuote />
      <PlatformModules />
      <EcosystemCarousel />
      <FeatureShowcase />
      <TreasurySuite />
      <TrustCenter />
      <DeveloperExperience />
      <PlatformArchitecture />
      <JoinEcosystem />
      <Footer />
      <CopyrightBar />
      <BottomNav />
    </div>
  )
}
