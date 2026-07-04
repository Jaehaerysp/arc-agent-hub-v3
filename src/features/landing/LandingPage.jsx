import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { AnimatedStats } from './sections/AnimatedStats'
import { PlatformOverview } from './sections/PlatformOverview'
import { MissionControlPreview } from './sections/MissionControlPreview'
import { MarketplacePreview } from './sections/MarketplacePreview'
import { CoreFeatures } from './sections/CoreFeatures'
import { ArchitectureTimeline } from './sections/ArchitectureTimeline'
import { Roadmap } from './sections/Roadmap'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'

// Public landing page — presentation only. Every route it links to
// (/dashboard, /agents, etc.) and every fact it states (contract addresses,
// chain id, agent catalog) is imported from the same modules the connected
// app uses, so this page can't drift out of sync with the product it's
// advertising. See src/features/landing/landing.data.js for content and
// src/features/landing/sections/ for the eleven sections below.
export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <AnimatedStats />
      <PlatformOverview />
      <MissionControlPreview />
      <MarketplacePreview />
      <CoreFeatures />
      <ArchitectureTimeline />
      <Roadmap />
      <FinalCta />
      <Footer />
    </div>
  )
}
