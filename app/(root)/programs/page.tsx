'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Users, Heart, BookOpen, Bell, Phone, Mail } from 'lucide-react'

export default function ProgramsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const programs = [
    {
      id: 1,
      category: 'charitable',
      name: 'Feed the Hungry Program',
      description: 'Serving meals to families in need at our local community centers.',
      schedule: 'Every 2nd Saturday',
      volunteers: 15,
      icon: <Heart className="w-6 h-6" />
    },
    {
      id: 2,
      category: 'charitable',
      name: 'Homeless Care Initiative',
      description: 'Providing care packages, blankets, and support to homeless individuals.',
      schedule: 'Monthly - Various dates',
      volunteers: 20,
      icon: <Heart className="w-6 h-6" />
    },
    {
      id: 3,
      category: 'faith',
      name: 'Bible Study & Discussion',
      description: 'Deep dive into scripture and Catholic teachings with brother knights.',
      schedule: 'Weekly - Thursday evenings',
      volunteers: 12,
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      id: 4,
      category: 'social',
      name: 'Artarama Festival',
      description: 'Annual showcase of local artists, crafts, and community talent. Seeking artists and volunteers!',
      schedule: 'Spring (April)',
      volunteers: 50,
      icon: <Users className="w-6 h-6" />,
      featured: true
    },
    {
      id: 5,
      category: 'youth',
      name: 'Young Adults Fellowship',
      description: 'Social and faith-based activities for young Catholic professionals.',
      schedule: 'Monthly - 1st Friday',
      volunteers: 8,
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 6,
      category: 'youth',
      name: 'Knights of Columbus Youth Program',
      description: 'Leadership and service opportunities for young men seeking knighthood.',
      schedule: 'Bi-monthly meetings',
      volunteers: 25,
      icon: <Heart className="w-6 h-6" />
    },
  ]

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCategory)

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Our Programs & Events
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Year-round opportunities to serve, grow, and build community with fellow knights.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-background py-8 sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-20 py-2   font-medium transition-colors ${selectedCategory === 'all'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              All Programs
            </button>
            <button
              onClick={() => setSelectedCategory('charitable')}
              className={`px-20 py-2   font-medium transition-colors ${selectedCategory === 'charitable'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Volunteer
            </button>
            {/* <button
              onClick={() => setSelectedCategory('faith')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'faith'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Faith
            </button>
            <button
              onClick={() => setSelectedCategory('social')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'social'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Social Events
            </button>
            <button
              onClick={() => setSelectedCategory('youth')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'youth'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Youth
            </button> */}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      {/* <section className="bg-background py-16 lg:py-24"> */}
        {/* <p className="text-center text-muted-foreground">No programs at the moment</p> */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className={`rounded-xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col ${program.featured
                  ? 'border-accent bg-accent/5 md:col-span-2 lg:col-span-1'
                  : 'border-border bg-card'
                  }`}
              >
                {program.featured && (
                  <div className="bg-accent text-accent-foreground px-4 py-2 text-center text-sm font-semibold">
                    Featured Program
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  <div className="text-accent mb-4">
                    {program.icon}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                    {program.name}
                  </h3>

                  <p className="text-muted-foreground mb-6 flex-1">
                    {program.description}
                  </p>

                  <div className="space-y-3 border-t border-border pt-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>{program.schedule}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-accent" />
                      <span>{program.volunteers} volunteers needed</span>
                    </div>
                  </div>

                  <Link
                    href={`/register?program=${program.id}&type=volunteer`}
                    className="mt-6 bg-accent text-accent-foreground px-4 py-2   font-medium hover:opacity-90 transition-opacity text-center"
                  >
                    Volunteer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      {/* </section> */}

      {/* Calendar & Registration CTA */}
      <section className="bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-6">
                Flexible Participation
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our programs run throughout the year with varying schedules. Whether you can commit to weekly service or participate occasionally, there's a place for you in our community.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl leading-none">✓</span>
                  <span className="text-muted-foreground">Programs scheduled at different times to fit your availability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl leading-none">✓</span>
                  <span className="text-muted-foreground">Email notifications for upcoming events and opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl leading-none">✓</span>
                  <span className="text-muted-foreground">Cancellations due to weather or circumstances will be communicated promptly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl leading-none">✓</span>
                  <span className="text-muted-foreground">Join any program anytime—no prior commitment needed</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register?type=volunteer"
                  className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity text-center"
                >
                  Register as Volunteer
                </Link>
                {/* <Link
                  href="/register?type=artist"
                  className="border-2 border-primary text-primary px-8 py-3   font-semibold hover:bg-primary/5 transition-colors text-center"
                >
                  Join Artarama
                </Link> */}
              </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-12">
              <h3 className="font-serif text-3xl font-bold mb-8">
                Full Event Calendar Available
              </h3>
              <div className="space-y-6 mb-8">
                <div>
                  <div className="text-accent text-lg font-semibold mb-2 flex items-center gap-2"><Mail/> Email Reminders</div>
                  <p className="text-primary-foreground/90">Subscribe to our mailing list for program updates and schedule changes.</p>
                </div>
                <div>
                  <div className="text-accent text-lg font-semibold mb-2 flex items-center gap-2"><Phone/> Mobile Access</div>
                  <p className="text-primary-foreground/90">View the complete calendar on our events page with real-time updates.</p>
                </div>
                <div>
                  <div className="text-accent text-lg font-semibold mb-2 flex items-center gap-2"><Bell/>Updates</div>
                  <p className="text-primary-foreground/90">Cancellations and changes are posted immediately to keep you informed.</p>
                </div>
              </div>
              <Link
                href="/programs"
                className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity inline-block w-full text-center"
              >
                View Full Calendar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
