'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Bell, Phone, Mail, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

interface Event {
  id: number
  category: string
  name: string
  description: string
  content?: string
  location?: string
  schedule?: string
  images?: string[]
  date: string
  createdAt: string
  updatedAt: string
}

const FILTER_BUTTONS = [
  { label: 'All Programs', value: 'all' },
  { label: 'Volunteer', value: 'charitable' },
]

const PAGE_SIZE = 6

export default function ProgramsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setPage(1)
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredPrograms =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory)

  const totalPages = Math.ceil(filteredPrograms.length / PAGE_SIZE)
  const paginatedPrograms = filteredPrograms.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) {
    return (
      <section className="relative bg-primary py-20 lg:py-32 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-white text-lg">
          <p>Loading Events and Programs</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="h-12 bg-primary-foreground/20 rounded w-3/4 mb-6" />
          <div className="h-6 bg-primary-foreground/20 rounded w-1/2 mb-3" />
          <div className="h-6 bg-primary-foreground/20 rounded w-2/3" />
        </div>
      </section>
    )
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-[#071A4D] to-[#0451A0] text-primary-foreground py-16 lg:py-24">
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
            {FILTER_BUTTONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleCategoryChange(value)}
                className={`px-20 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === value
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="bg-background py-16 lg:py-24">
        {filteredPrograms.length === 0 && (
          <p className="text-center text-muted-foreground">No programs at the moment</p>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPrograms.map((program) => {
              const eventDate = new Date(program.date)
              const dateLabel = eventDate.toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
              const timeLabel = eventDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })
              const hasTime = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0

              return (
                <div
                  key={program.id}
                  className="rounded-xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col border-border bg-card"
                >
                  <div className="p-8 flex flex-col flex-1">
                    <Image
                      src={program.images?.[0] || '/placeholder.svg'}
                      alt={program.name}
                      width={500}
                      height={500}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />

                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      {program.name}
                      <br />
                      <Badge className="text-white text-sm capitalize bg-[#0451A0]">
                        {program.category}
                      </Badge>
                    </h3>

                    <p className="text-muted-foreground mb-6 flex-1">{program.description}</p>

                    <div className="space-y-1 border-t border-border pt-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{dateLabel}</span>
                        {program.schedule && (
                          <span className="italic text-xs">{program.schedule}</span>
                        )}
                      </div>
                      {hasTime && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-accent shrink-0" />
                          <span>{timeLabel}</span>
                        </div>
                      )}
                      {program.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{program.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border bg-card text-foreground hover:border-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                    p === page
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-card text-foreground border-border hover:border-accent'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-border bg-card text-foreground hover:border-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-6">
                Flexible Participation
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our programs run throughout the year with varying schedules. Whether you can commit
                to weekly service or participate occasionally, there's a place for you in our
                community.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Programs scheduled at different times to fit your availability',
                  'Email notifications for upcoming events and opportunities',
                  'Cancellations due to weather or circumstances will be communicated promptly',
                  'Join any program anytime—no prior commitment needed',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-accent text-2xl leading-none">✓</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register?type=volunteer"
                  className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
                >
                  Register as Volunteer
                </Link>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-12">
              <h3 className="font-serif text-3xl font-bold mb-8">Full Event Calendar Available</h3>
              <div className="space-y-6 mb-8">
                {[
                  {
                    icon: <Mail />,
                    label: 'Email Reminders',
                    body: 'Subscribe to our mailing list for program updates and schedule changes.',
                  },
                  {
                    icon: <Phone />,
                    label: 'Mobile Access',
                    body: 'View the complete calendar on our events page with real-time updates.',
                  },
                  {
                    icon: <Bell />,
                    label: 'Updates',
                    body: 'Cancellations and changes are posted immediately to keep you informed.',
                  },
                ].map(({ icon, label, body }) => (
                  <div key={label}>
                    <div className="text-accent text-lg font-semibold mb-2 flex items-center gap-2">
                      {icon} {label}
                    </div>
                    <p className="text-primary-foreground/90">{body}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/programs"
                className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-block w-full text-center"
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