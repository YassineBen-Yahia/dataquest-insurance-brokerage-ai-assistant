import { Navbar } from '@/components/landing/navbar'
import { AnimatedBackground } from '@/components/landing/animated-background'
import { Hero } from '@/components/landing/hero'
import { DemoPreview } from '@/components/landing/demo-preview'
import { Features } from '@/components/landing/features'
import { Metrics } from '@/components/landing/metrics'
import { FinalCTA } from '@/components/landing/final-cta'

export const metadata = {
  title: 'Marcos AI - AI-Powered Insurance Intelligence',
  description: 'Automate policy matching, optimize recommendations, and close smarter with AI-powered insurance intelligence.',
}

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="relative">
        <Hero />
        <DemoPreview />
        <Features />
        <Metrics />
        <FinalCTA />

        {/* Footer */}
        <footer className="border-t border-border py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground">
            <p>&copy; 2026 Marcos AI. Built for modern insurance brokers.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
