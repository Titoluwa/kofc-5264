'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Search, X } from 'lucide-react'
import { Event, PageContent } from '@/lib/constants'
import Header from '@/components/pages/header'
// import { useRouter } from 'next/navigation'

const PAGE_SLUG = "programs"

function formatEventDateTime(dateStr: string) {
  const date = new Date(dateStr)
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0

  const datePart = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase()

  if (!hasTime) return datePart

  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase()

  return `${datePart}, ${timePart}`
}

function hasValidDateTime(event: Event): boolean {
  if (!event.date) return false
  const d = new Date(event.date)
  return !Number.isNaN(d.getTime())
}

export default function ProgramsPage() {
  // const router = useRouter()
  const [events, setEvents]   = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [content, setContent] = useState<PageContent | null>(null)

  useEffect(() => { fetchContent() }, [])

  const fetchContent = async () => {
    try {
      const pageRes = await fetch(`/api/pages/content?slug=${encodeURIComponent(PAGE_SLUG)}`)
      if (!pageRes.ok) throw new Error("Failed to fetch page content")
      const pageData = await pageRes.json()
      const contentRes = await fetch(`/api/pages/${pageData.id}/content?name=${encodeURIComponent(PAGE_SLUG)}`)
      if (!contentRes.ok) throw new Error("Failed to fetch page content")
      const section: PageContent = await contentRes.json()
      if (section) setContent(section)
    } catch (error) {
      console.error('Failed to fetch page content:', error)
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        if (!res.ok) throw new Error("Failed to fetch events")
        const data = await res.json()
        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load events:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filtered = events.filter((e) => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    )
  })

  // Split into dated vs undated
  const datedEvents = filtered
    .filter(hasValidDateTime)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const undatedEvents = filtered.filter((e) => !hasValidDateTime(e))

  return (
    <main>
      <Header
        title={content?.mainText || 'Our Programs & Events'}
        description={content?.subtext1 || 'Year-round opportunities to serve, grow, and build community.'}
      />

      {/* Search bar */}
      <section className="bg-background/95 backdrop-blur-md border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programs and events…"
              className="w-full pl-11 pr-10 py-2.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="space-y-10 max-w-4xl mx-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i+1} className="space-y-2 animate-pulse">
                  <div className="h-3.5 w-64 bg-muted rounded" />
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-5/6 bg-muted rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                <Calendar className="w-7 h-7 text-muted-foreground opacity-60" />
              </div>
              <p className="font-semibold text-lg text-foreground">No programs found</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try a different search term or check back soon.
              </p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

              {undatedEvents.length > 0 && (
                <aside className="lg:w-56 xl:w-64 shrink-0 h-80 overflow-y-auto">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    Date to be determined
                  </p>
                  <nav className="space-y-0">
                    {undatedEvents.map((event) => (
                      <div key={event.id} className="border-b border-dashed border-gray-800">
                        <Link key={event.id} href={`/programs/${event.id}`} className="font-sans font-[600] block py-1 text-sm text-accent hover:text-primary transition-colors">
                          {event.name}
                          {event.schedule && (
                            <span className="text-muted-foreground ml-1 text-xs">
                              ({event.schedule})
                            </span>
                          )}
                        </Link>
                        <p className="text-xs text-muted-foreground mb-1">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </nav>
                </aside>
              )}

              {datedEvents.length > 0 && (
                <div className="flex-1 min-w-0">
                  {/* {undatedEvents.length > 0 && ( */}
                    <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                      All Upcoming Events ...
                    </h2>
                  {/* )} */}

                  <div className="divide-y divide-gray-300 h-screen overflow-y-auto">
                    {datedEvents.map((event) => (
                      <article key={event.id} className="py-4 first:pt-0">
                        <p className="text-sm font-bold tracking-wide text-foreground mb-2">
                          {formatEventDateTime(event.date)}
                        </p>

                        <Link href={`/programs/${event.id}`} className="inline-block font-semibold text-accent hover:text-primary/80 text-base sm:text-lg mb-3 leading-snug transition-colors">
                          {event.name}
                        </Link>

                        <p className="text-xs w-4/5 line-clamp-3 italic text-foreground/80 leading-relaxed">
                          {event.description}
                        </p>

                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}