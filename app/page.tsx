import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import StatsSection from '@/components/StatsSection'
import Link from 'next/link'
import { Building, Handshake, Heart, Shield, Users, Book } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'Our Lady of the Prairie, Council 5264',
  description: 'Join our Catholic community organization dedicated to faith formation, fraternal brotherhood, and charitable service.',
}

export default function Home() {
  const benefits = [
    {
      icon: <Building />,
      title: 'Deepen Your Faith',
      description: 'Join faith-centered gatherings and study programs designed to strengthen your spiritual journey.',
      link: '#',
      linkText: 'Learn about faith formation'
    },
    {
      icon: <Handshake />,
      title: 'Find Your Brothers',
      description: 'Connect with like-minded Catholic men committed to living their faith with purpose and action.',
      link: '#',
      linkText: 'Discover brotherhood'
    },
    {
      icon: <Heart />,
      title: 'Serve Your Community',
      description: 'Make a real difference through charitable work and community service initiatives.',
      link: '#',
      linkText: 'See our impact'
    },
    {
      icon: <Shield />,
      title: 'Protect Your Family',
      description: 'Access member-exclusive insurance and financial products aligned with Catholic values.',
      link: '#',
      linkText: 'Explore benefits'
    },
    {
      icon: <Users />,
      title: 'Family Fraternal Benefits',
      description: 'Strengthen family bonds through programs and benefits available to all members.',
      link: '#',
      linkText: 'Learn more'
    },
    {
      icon: <Book />,
      title: 'Stay Informed',
      description: 'Get exclusive access to our award-winning magazine and community news.',
      link: '#',
      linkText: 'Read our publication'
    },
  ]

  const stats = [
    { number: '2.2M+', label: 'Members', description: 'In 17,000+ councils worldwide' },
    { number: '$193M', label: 'Donated', description: 'Supporting charitable causes in 2024' },
    { number: '47.5M', label: 'Volunteer Hours', description: 'Knights serving their communities' },
    { number: '$147M', label: 'Charitable Fund', description: 'Empowering Catholic causes' },
  ]

  return (
    <main>

      {/* Hero Section */}
      <HeroSection
        title="Faith. Brotherhood. Purpose"
        // subtitle="Since 1882, the Knights of Columbus has empowered Catholic men to put their faith into action – building stronger families, stronger parishes and stronger communities."
        // subtitle="Knights support family life and active faith through community service, social affairs, insurance protection, wholesome recreation, and new friendships."
        subtitle="Men who believe that faith without works is dead. We don't just profess our beliefs, we live them through service, sacrifice, and solidarity with others."
        subtitle2="We are united as brothers in faith, and that unity empowers our community and our service to others."
        primaryButtonText="Join Now"
        primaryButtonHref="/register"
        // secondaryButtonText="Our Mission"
        // secondaryButtonHref="#our-mission"
        imageUrl="/images/screenshot-202026-01-30-20at-2010.png"
      />

      {/* Member Benefits */}
      {/* <section className="bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary   rotate-45 flex items-center justify-center">
                <div className="text-white text-2xl -rotate-45">✦</div>
              </div>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Member Benefits
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the world's premier lay Catholic men's organization.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mt-6" />
          </div>

          <FeaturesSection
            title=""
            subtitle=""
            features={benefits}
            variant="list"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/join"
              className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Join
            </Link>
            <Link
              href="/learn-more"
              className="border-2 border-primary text-primary px-8 py-3   font-semibold hover:bg-primary/5 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section> */}

      {/* Charity Section */}
      {/* <StatsSection
        title="Where There's a Need, There's a Knight"
        subtitle="Charity is our first principle, guiding our mission for more than 140 years. Every year, the numbers speak for themselves."
        stats={stats}
        variant="horizontal"
      /> */}

      {/* Why Join Section */}
      <section id="our-mission" className="bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-12 bg-accent rounded" />
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  Real Stories. Real Impact.
                </h2>
              </div>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                From growing in faith to helping those most in need, Knights of Columbus are putting their faith into action, living out our mission and making a real difference.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-3xl">✦</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Serving God</h3>
                    <p className="text-muted-foreground text-sm">Through faith formation and spiritual growth</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-3xl">✦</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Supporting Families</h3>
                    <p className="text-muted-foreground text-sm">With financial protection and fraternal benefits</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-3xl">✦</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Building Communities</h3>
                    <p className="text-muted-foreground text-sm">Through charitable work and service</p>
                  </div>
                </div>
              </div>

              <Link
                href="/join"
                className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity inline-block mt-8"
              >
                Join Our Mission
              </Link>
            </div>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden h-96 lg:h-full bg-primary">
              <Image src="/images/kofc-logo.png" alt="Community service" className="w-full h-full object-cover" width={100} height={100} />
              {/* <img
                src="/images/screenshot-202026-01-30-20at-2010.png"
                alt="Community service"
                className="w-full h-full object-cover"
                // onError={(e) => {
                //   e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23003366%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'
                // }}
              /> */}
            </div>
          </div>
        </div>
      </section>

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
            className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity inline-block"
          >
            View All Events
          </Link>
        </div>
      </section>
    </main>
  )
}
