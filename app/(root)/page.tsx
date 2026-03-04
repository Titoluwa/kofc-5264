import HeroSection from '@/components/HeroSection'
import WhatSection from '@/components/WhatSection'
import Link from 'next/link'
import SubscribeNewsletter from '@/components/SubscribeNewsletter'

export const metadata = {
  title: 'Our Lady of the Prairie, Council 5264',
  description: 'Join our Catholic community organization dedicated to faith formation, fraternal brotherhood, and charitable service.',
}

export default function Home() {
  return (
    <main id='home'>

      {/* Hero Section */}
      <HeroSection/>

      {/* What Section */}
      <WhatSection/>

      {/* Events Preview */}
      <section className="bg-primary/50 text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Upcoming Events
          </h2>
          <p className="text-lg text-primary-foreground/95 max-w-2xl mx-auto mb-8">
            Join us for events and gatherings throughout the year celebrating our faith and fellowship.
          </p>
          <Link
            href="/programs"
            className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-block"
          >
            View All Events
          </Link>
        </div>
      </section>

      <SubscribeNewsletter/>
    </main>
  )
}
