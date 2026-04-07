'use client'

import { useEffect, useState } from 'react'
import { PageContent } from '@/lib/constants'

interface TimelineItem {
  year: string
  title: string
  description: string
}

const MAIN_SLUG     = '#history'
const HERO_SLUG     = '#history-hero'
const TIMELINE_SLUG = '#history-timeline'

function parseTimelineItems(lists: string[] | TimelineItem[]): TimelineItem[] {
  if (!lists || lists.length === 0) return []
  return lists.map((item) => {
    if (typeof item === 'string') {
      try {
        return JSON.parse(item) as TimelineItem
      } catch {
        return { year: '', title: '', description: item }
      }
    }
    return item
  })
}

async function fetchSection(slug: string): Promise<PageContent> {
  const pageRes = await fetch(`/api/pages/content?slug=${encodeURIComponent(MAIN_SLUG)}`)
  if (!pageRes.ok) throw new Error(`Failed to load page for ${slug}`)
  const page = await pageRes.json()

  const contentRes = await fetch(`/api/pages/${page.id}/content?name=${encodeURIComponent(slug)}`)
  if (!contentRes.ok) throw new Error(`Failed to load content for ${slug}`)
  return contentRes.json()
}

function HeroSkeleton() {
  return (
    <section className="bg-primary py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="animate-pulse h-12 w-64 bg-primary-foreground/20 rounded-lg mx-auto" />
        <div className="animate-pulse h-6 w-96 bg-primary-foreground/10 rounded-lg mx-auto" />
      </div>
    </section>
  )
}

function TimelineSkeleton() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="animate-pulse h-10 w-48 bg-muted rounded-lg mx-auto" />
          <div className="animate-pulse h-5 w-80 bg-muted rounded-lg mx-auto" />
          <div className="animate-pulse h-1 w-24 bg-muted rounded mx-auto mt-6" />
        </div>
        <div className="space-y-8 mt-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i.toFixed()} className="flex gap-6">
              <div className="animate-pulse w-16 h-6 bg-muted rounded shrink-0 mt-1" />
              <div className="flex-1 space-y-2">
                <div className="animate-pulse h-5 w-48 bg-muted rounded" />
                <div className="animate-pulse h-4 w-full bg-muted rounded" />
                <div className="animate-pulse h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HistoryPage() {
  const [hero, setHero]               = useState<PageContent | null>(null)
  const [timeline, setTimeline]       = useState<PageContent | null>(null)
  const [heroLoading, setHeroLoading] = useState(true)
  const [tlLoading, setTlLoading]     = useState(true)
  const [heroError, setHeroError]     = useState(false)
  const [tlError, setTlError]         = useState(false)

  useEffect(() => {
    fetchSection(HERO_SLUG)
      .then(setHero)
      .catch(() => setHeroError(true))
      .finally(() => setHeroLoading(false))

    fetchSection(TIMELINE_SLUG)
      .then(setTimeline)
      .catch(() => setTlError(true))
      .finally(() => setTlLoading(false))
  }, [])

  const timelineItems = timeline ? parseTimelineItems(timeline.lists ?? []) : []

  const renderHero = () => {
    if (heroLoading) return <HeroSkeleton />
    if (heroError || !hero) {
      return (
        <section className="bg-primary text-primary-foreground py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Our History
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Rooted in faith, dedicated to service, shaping our community for over 70 years.
            </p>
          </div>
        </section>
      )
    }
    return (
      <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {hero.mainText && (
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
              {hero.mainText}
            </h1>
          )}
          {hero.subtext1 && (
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              {hero.subtext1}
            </p>
          )}
        </div>
      </section>
    )
  }

  const renderTimeline = () => {
    if (tlLoading) return <TimelineSkeleton />
    if (tlError || !timeline) {
      return (
        <section className="bg-background py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground">Timeline unavailable.</p>
          </div>
        </section>
      )
    }
    
    return (
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center mb-16">
            {timeline.mainText && (
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {timeline.mainText}
              </h2>
            )}
            {timeline.subtext1 && (
              <p className="text-lg text-muted-foreground">
                {timeline.subtext1}
              </p>
            )}
            <div className="w-24 h-1 bg-accent mx-auto mt-6" />
          </div>

          {/* Timeline items */}
          {timelineItems.length > 0 && (
            <div className="relative">

              {/* Vertical spine */}
              <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-border hidden sm:block" />

              <div className="space-y-10">
                {timelineItems.map((item, i) => (
                  <div key={`${item.year}-${item.title}-${i}`} className="flex gap-6 sm:gap-10 group">

                    {/* Year */}
                    <div className="w-16 shrink-0 text-right">
                      <span className="inline-block text-sm font-bold text-accent bg-accent/10 border border-accent/20 rounded-md px-2 py-0.5">
                        {item.year}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="relative hidden sm:flex items-start justify-center w-px">
                      <div className="w-3 h-3 rounded-full bg-accent border-2 border-background ring-2 ring-accent/30 mt-1 shrink-0 -translate-x-1/2 group-hover:ring-accent/60 transition-all" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      {item.title && (
                        <h3 className="font-semibold text-foreground text-base mb-1">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional closing subtext */}
          {timeline.subtext2 && (
            <p className="text-center text-muted-foreground mt-16 text-lg leading-relaxed max-w-2xl mx-auto">
              {timeline.subtext2}
            </p>
          )}

          {/* Optional CTA buttons */}
          {(timeline.primaryButton?.text || timeline.secondaryButton?.text) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              {timeline.primaryButton?.text && (
                <a
                  href={timeline.primaryButton.link || '#'}
                  className="bg-accent text-accent-foreground rounded-lg px-8 py-3 font-semibold hover:opacity-90 transition-opacity text-center"
                >
                  {timeline.primaryButton.text}
                </a>
              )}
              {timeline.secondaryButton?.text && (
                <a
                  href={timeline.secondaryButton.link || '#'}
                  className="border-2 border-accent text-accent rounded-lg px-8 py-3 font-semibold hover:bg-accent/10 transition-colors text-center"
                >
                  {timeline.secondaryButton.text}
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <main>
      {renderHero()}
      {renderTimeline()}
    </main>
  )
}