'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Bell, Phone, Mail, Clock, RotateCcw, Search, X } from 'lucide-react'
import Image from 'next/image'
import { PAGE_SIZE, Event, CATEGORY_LABELS, CATEGORY_ACCENT, PageContent } from '@/lib/constants'
import EventCardSkeleton from '@/components/skeleton/events'
import PublicPagination, { PageShowing } from '@/components/PublicPagination'
import Header from '@/components/pages/header'
import EventModal from '@/components/pages/event-dialog'

const PAGE_SLUG = "programs";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ProgramsPage() {
  const [events, setEvents]           = useState<Event[]>([])
  const [loading, setLoading]         = useState(true)
  const [page, setPage]               = useState(1)
  const [search, setSearch]           = useState('')
  const [content, setContent]         = useState<PageContent | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent]  = useState<Event | null>(null)

  useEffect(() => { fetchContent() }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const pageRes = await fetch(`/api/pages/content?slug=${encodeURIComponent(PAGE_SLUG)}`)
      if (!pageRes.ok) throw new Error('Failed to load page')
      const pageData = await pageRes.json()

      const contentRes = await fetch(`/api/pages/${pageData.id}/content?name=${encodeURIComponent(PAGE_SLUG)}`)
      if (!contentRes.ok) throw new Error('Failed to load content')
      const section: PageContent = await contentRes.json()

      if (!section) throw new Error('No content found')
      setContent(section)
    } catch {
      setError('Failed to load content')
    } finally {
      setLoading(false)
    }
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

  const filteredPrograms = events.filter((e) => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    )
  })

  const totalPages        = Math.ceil(filteredPrograms.length / PAGE_SIZE)
  const paginatedPrograms = filteredPrograms.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleCardClick = useCallback((program: Event) => {
    setSelectedEvent(program)
  }, [])

  return (
    <main>
      {/* Event detail modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      <Header
        title={content?.mainText || 'Our Programs & Events'}
        description={content?.subtext1 || 'Year-round opportunities to serve, grow, and build community with fellow knights.'}
      />

      <section className="bg-background/95 backdrop-blur-md border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search programs and events…"
              className="w-full pl-11 pr-10 py-2.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-6">
            <PageShowing meta={{ page, totalPages, limit: PAGE_SIZE, total: filteredPrograms.length }} />
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i.toFixed()} />)}
            </div>
          )}

          {!loading && filteredPrograms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                <Calendar className="w-7 h-7 text-muted-foreground opacity-60" />
              </div>
              <p className="font-semibold text-lg text-foreground">No programs at the moment</p>
              <p className="text-muted-foreground text-sm mt-2">
                Check back soon — new events are added regularly.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && paginatedPrograms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {paginatedPrograms.map((program) => {
                const eventDate = new Date(program.date)
                const dateLabel = eventDate.toLocaleDateString(undefined, {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                })
                const timeLabel = eventDate.toLocaleTimeString(undefined, {
                  hour: '2-digit', minute: '2-digit',
                })
                const hasTime  = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0
                const coverImg = program.image
                const catStyle = CATEGORY_ACCENT[program.category] ?? CATEGORY_ACCENT.other
                const catLabel = CATEGORY_LABELS[program.category] ?? program.category

                return (
                  <button
                    key={program.id}
                    onClick={() => handleCardClick(program)}
                    aria-label={`View details for ${program.name}`}
                    className="group text-left w-full flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    {/* Cover image */}
                    <div className="relative h-52 bg-muted overflow-hidden shrink-0">
                      {coverImg ? (
                        <Image
                          src={coverImg}
                          alt={program.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#071A4D]/10 to-[#0451A0]/10">
                          <Calendar className="w-12 h-12 text-primary/70" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          {catLabel}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-3 leading-snug">
                        {program.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3">
                        {program.description}
                      </p>

                      {/* Meta */}
                      <div className="mt-5 pt-5 border-t border-border/70 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="font-medium text-foreground">{dateLabel}</span>
                          {program.schedule && (
                            <span className="italic text-muted-foreground truncate">
                              · {program.schedule}
                            </span>
                          )}
                        </div>
                        {hasTime && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span>{timeLabel}</span>
                          </div>
                        )}
                        {program.schedule && !hasTime && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <RotateCcw className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="italic">{program.schedule}</span>
                          </div>
                        )}
                        {program.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="truncate">{program.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          <PublicPagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
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